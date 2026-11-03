/**
 * Algebra Notebook progress server (Google Apps Script, bound to a Google Sheet).
 * Paste into Extensions > Apps Script of the progress Sheet, fill in CLIENT_ID, then
 * Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 *
 * Sheets it keeps:
 *   Students  - one row per student: email, name, last saved, then one column per activity (percent)
 *   Data      - the raw saved progress (JSON, split over columns if long)
 *   Sessions  - sign-in sessions (a random key per device, valid 90 days)
 */
var CLIENT_ID = "";                       // same OAuth client ID as in auth.js
var DOMAIN = "sch.org";                   // only this Google Workspace domain may sign in
var TEACHERS = ["abergmann@sch.org"];     // may open the class progress page
var SESSION_DAYS = 90;
var CHUNK = 45000;                        // a cell holds at most 50,000 characters

function doPost(e) {
  var req;
  try { req = JSON.parse(e.postData.contents); } catch (err) { return out({ error: "bad", message: "Bad request." }); }
  try {
    if (req.action === "signin") return out(signin(req.credential));
    var who = sessionEmail(req.session);
    if (!who) return out({ error: "auth", message: "Please sign in again." });
    if (req.action === "load") return out(load(who));
    if (req.action === "save") return out(save(who, req.data, req.summary));
    if (req.action === "signout") { endSession(req.session); return out({ ok: true }); }
    if (req.action === "roster") { if (!isTeacher(who.email)) return out({ error: "forbidden", message: "Teachers only." }); return out(roster()); }
    return out({ error: "bad", message: "Unknown action." });
  } catch (err) {
    return out({ error: "server", message: String(err && err.message || err) });
  }
}
function doGet() { return out({ ok: true, service: "Algebra Notebook" }); }
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function isTeacher(email) { return TEACHERS.map(function (t) { return t.toLowerCase(); }).indexOf(String(email).toLowerCase()) >= 0; }

// ---- sheets ----
function book() {
  var s = null; try { s = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) { }
  if (!s) { var id = PropertiesService.getScriptProperties().getProperty("SHEET_ID"); s = SpreadsheetApp.openById(id); }
  return s;
}
function sheet(name, header) {
  var b = book(), sh = b.getSheetByName(name);
  if (!sh) { sh = b.insertSheet(name); sh.appendRow(header); sh.setFrozenRows(1); sh.getRange(1, 1, 1, header.length).setFontWeight("bold"); }
  return sh;
}
function students() { return sheet("Students", ["Email", "Name", "Last saved"]); }
function dataSheet() { return sheet("Data", ["Email", "Updated", "Progress (JSON)"]); }
function sessions() { return sheet("Sessions", ["Key", "Email", "Name", "Expires"]); }
function findRow(sh, email) {
  var n = sh.getLastRow(); if (n < 2) return 0;
  var v = sh.getRange(2, 1, n - 1, 1).getValues();
  for (var i = 0; i < v.length; i++) if (String(v[i][0]).toLowerCase() === email.toLowerCase()) return i + 2;
  return 0;
}

// ---- sign-in: the Google ID token is checked with Google ----
function signin(credential) {
  if (!credential) return { error: "bad", message: "Missing sign-in." };
  var r = UrlFetchApp.fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(credential), { muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) return { error: "denied", message: "Google could not confirm that sign-in. Try again." };
  var t = JSON.parse(r.getContentText());
  if (t.aud !== CLIENT_ID) return { error: "denied", message: "This sign-in was not made for Algebra Notebook." };
  if (String(t.email_verified) !== "true") return { error: "denied", message: "That Google account's email is not verified." };
  if (Number(t.exp) * 1000 < Date.now()) return { error: "denied", message: "That sign-in expired. Try again." };
  if ((t.hd || "").toLowerCase() !== DOMAIN.toLowerCase()) return { error: "denied", message: "Please use your @" + DOMAIN + " school account." };
  var email = String(t.email).toLowerCase(), name = t.name || email;
  var key = Utilities.getUuid() + Utilities.getUuid().replace(/-/g, "");
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var exp = new Date(Date.now() + SESSION_DAYS * 864e5);
    sessions().appendRow([key, email, name, exp]);
    var st = students(), row = findRow(st, email);
    if (!row) st.appendRow([email, name, ""]); else st.getRange(row, 2).setValue(name);
    pruneSessions();
  } finally { lock.releaseLock(); }
  return { session: key, email: email, name: name, teacher: isTeacher(email) };
}
function sessionEmail(key) {
  if (!key) return null;
  var c = CacheService.getScriptCache(), hit = c.get("s:" + key);
  if (hit) return JSON.parse(hit);
  var sh = sessions(), n = sh.getLastRow(); if (n < 2) return null;
  var v = sh.getRange(2, 1, n - 1, 4).getValues();
  for (var i = 0; i < v.length; i++) if (v[i][0] === key) {
    if (new Date(v[i][3]).getTime() < Date.now()) return null;
    var who = { email: v[i][1], name: v[i][2] }; c.put("s:" + key, JSON.stringify(who), 21600); return who;
  }
  return null;
}
function endSession(key) {
  CacheService.getScriptCache().remove("s:" + key);
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try { var sh = sessions(), n = sh.getLastRow(); if (n < 2) return; var v = sh.getRange(2, 1, n - 1, 1).getValues(); for (var i = v.length - 1; i >= 0; i--) if (v[i][0] === key) sh.deleteRow(i + 2); }
  finally { lock.releaseLock(); }
}
function pruneSessions() {
  var sh = sessions(), n = sh.getLastRow(); if (n < 2) return;
  var v = sh.getRange(2, 4, n - 1, 1).getValues(), now = Date.now();
  for (var i = v.length - 1; i >= 0; i--) if (new Date(v[i][0]).getTime() < now) sh.deleteRow(i + 2);
}

// ---- progress ----
function load(who) {
  var sh = dataSheet(), row = findRow(sh, who.email); if (!row) return { data: {} };
  var last = sh.getLastColumn(), v = sh.getRange(row, 1, 1, last).getValues()[0], json = v.slice(2).join("");
  var data = {}; try { data = json ? JSON.parse(json) : {}; } catch (e) { }
  return { data: data, updated: v[1] };
}
function save(who, data, summary) {
  if (!data || typeof data !== "object") return { error: "bad", message: "Nothing to save." };
  var clean = {}; Object.keys(data).forEach(function (k) { if (/^algebraProgress/.test(k) && typeof data[k] === "string") clean[k] = data[k]; });
  var json = JSON.stringify(clean), parts = [];
  for (var i = 0; i < json.length; i += CHUNK) parts.push(json.slice(i, i + CHUNK));
  var now = new Date(), lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var ds = dataSheet(), row = findRow(ds, who.email);
    if (!row) { row = ds.getLastRow() + 1; }
    var width = Math.max(ds.getLastColumn(), 2 + parts.length);
    var vals = [who.email, now].concat(parts); while (vals.length < width) vals.push("");
    ds.getRange(row, 1, 1, width).setValues([vals]);

    var st = students(), r2 = findRow(st, who.email);
    if (!r2) { st.appendRow([who.email, who.name, now]); r2 = findRow(st, who.email); }
    st.getRange(r2, 3).setValue(now);
    if (summary && typeof summary === "object") writeSummary(st, r2, summary);
  } finally { lock.releaseLock(); }
  return { ok: true, updated: now };
}
// Students sheet: one column per activity with the average of its exercises' percents; a note on each cell lists the exercises
function writeSummary(st, row, summary) {
  var head = st.getRange(1, 1, 1, Math.max(st.getLastColumn(), 3)).getValues()[0];
  Object.keys(summary).forEach(function (act) {
    var ex = summary[act] || {}, names = Object.keys(ex); if (!names.length) return;
    var avg = Math.round(names.reduce(function (s, n) { return s + (Number(ex[n]) || 0); }, 0) / names.length);
    var col = head.indexOf(act) + 1;
    if (!col) { col = head.length + 1; st.getRange(1, col).setValue(act).setFontWeight("bold"); head.push(act); }
    var cell = st.getRange(row, col); cell.setValue(avg / 100).setNumberFormat("0%");
    cell.setNote(names.map(function (n) { return n + ": " + (Number(ex[n]) || 0) + "%"; }).join("\n"));
  });
  // keep a copy of the full breakdown for the class progress page
  var c = head.indexOf("Detail (JSON)") + 1;
  if (!c) { c = head.length + 1; st.getRange(1, c).setValue("Detail (JSON)").setFontWeight("bold"); }
  st.getRange(row, c).setValue(JSON.stringify(summary));
}
function roster() {
  var st = students(), n = st.getLastRow(), w = st.getLastColumn(); if (n < 2) return { students: [] };
  var head = st.getRange(1, 1, 1, w).getValues()[0], v = st.getRange(2, 1, n - 1, w).getValues(), dc = head.indexOf("Detail (JSON)");
  return {
    students: v.map(function (r) {
      var d = {}; if (dc >= 0 && r[dc]) { try { d = JSON.parse(r[dc]); } catch (e) { } }
      return { email: r[0], name: r[1], saved: r[2] ? new Date(r[2]).toISOString() : "", detail: d };
    })
  };
}

/** Run once from the editor (select "setup", click Run) to create the sheets and approve permissions. */
function setup() {
  var s = SpreadsheetApp.getActiveSpreadsheet();
  if (s) PropertiesService.getScriptProperties().setProperty("SHEET_ID", s.getId());
  students(); dataSheet(); sessions();
  UrlFetchApp.fetch("https://oauth2.googleapis.com/tokeninfo?id_token=x", { muteHttpExceptions: true });
}
