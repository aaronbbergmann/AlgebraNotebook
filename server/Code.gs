/**
 * Algebra Notebook progress server (Google Apps Script, bound to a Google Sheet).
 * Paste into Extensions > Apps Script of the progress Sheet, fill in CLIENT_ID, then
 * Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 *
 * Sheets it keeps:
 *   Students  - one row per student: email, name, last saved, then one column per activity (stars, 0.0 to 5.0)
 *   Data      - the raw saved progress (JSON, split over columns if long)
 *   Sessions  - sign-in sessions (a random key per device, valid 90 days)
 *   Settings  - due dates (due:<activity> = yyyy-mm-dd), the Google Classroom classes last synced, and their teachers
 *
 * Google Classroom sync (the "Sync with Google Classroom" button on the class progress page) needs the Classroom service:
 * in the Apps Script editor, Services (+) > Google Classroom API > Add, then run "setup" once to approve the new permissions.
 */
var CLIENT_ID = "160859714217-010cnbk9qdbjo75h6k7uskud60s8cu30.apps.googleusercontent.com";
var SHEET_ID = "1HryFKwRUEdEqvbsTO52QCFk07JIp1gBzzlBbiFl-7kk";   // the progress Sheet "Algebra Notebook Progress"
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
    if (["roster", "setDue", "courses", "syncClassroom"].indexOf(req.action) >= 0 && !isTeacher(who.email)) return out({ error: "forbidden", message: "Teachers only." });
    if (req.action === "roster") return out(roster());
    if (req.action === "setDue") return out(setDue(req.act, req.date));
    if (req.action === "courses") return out(courses(who.email));
    if (req.action === "syncClassroom") return out(syncClassroom(req.courseIds || []));
    return out({ error: "bad", message: "Unknown action." });
  } catch (err) {
    return out({ error: "server", message: String(err && err.message || err) });
  }
}
function doGet() { return out({ ok: true, service: "Algebra Notebook" }); }
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function isTeacher(email) { var e = String(email).toLowerCase(); return TEACHERS.map(function (t) { return t.toLowerCase(); }).indexOf(e) >= 0 || classTeachers().indexOf(e) >= 0; }
function classTeachers() { var c = CacheService.getScriptCache(), hit = c.get("teachers"); if (hit != null) return JSON.parse(hit); var v = []; try { v = JSON.parse(getSetting("teachers") || "[]"); } catch (e) { } c.put("teachers", JSON.stringify(v), 600); return v; }

// ---- sheets ----
function book() {
  var s = null; try { s = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) { }
  if (!s) { var id = SHEET_ID || PropertiesService.getScriptProperties().getProperty("SHEET_ID"); s = SpreadsheetApp.openById(id); }
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
function settings() { return sheet("Settings", ["Key", "Value"]); }
function allSettings() { var sh = settings(), n = sh.getLastRow(), o = {}; if (n < 2) return o; sh.getRange(2, 1, n - 1, 2).getValues().forEach(function (r) { if (r[0]) o[String(r[0])] = r[1] instanceof Date ? Utilities.formatDate(r[1], Session.getScriptTimeZone(), "yyyy-MM-dd") : String(r[1]); }); return o; }
function getSetting(k) { return allSettings()[k] || ""; }
function putSetting(k, v) {
  var sh = settings(), row = findRow(sh, k);
  if (!v) { if (row) sh.deleteRow(row); return; }
  if (!row) sh.appendRow([k, ""]), row = sh.getLastRow();
  sh.getRange(row, 2).setNumberFormat("@").setValue(String(v));
}
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
// Students sheet: one column per activity with its stars (a finished activity is 5.0, split over its exercises in tenths, larger shares first;
// an exercise earns its share in proportion to how far it has come, rounded down to a tenth); a note on each cell lists the exercises
function writeSummary(st, row, summary) {
  var head = st.getRange(1, 1, 1, Math.max(st.getLastColumn(), 3)).getValues()[0];
  Object.keys(summary).forEach(function (act) {
    if (act.charAt(0) === "_") return;   // (bookkeeping, such as when an activity last changed: kept only in the Detail column)
    var ex = summary[act] || {}, names = Object.keys(ex); if (!names.length) return;
    var w = [], b = Math.floor(50 / names.length), r = 50 - b * names.length; names.forEach(function (n, i) { w.push(b + (i < r ? 1 : 0)); });
    var got = names.map(function (n, i) { return Math.floor((Number(ex[n]) || 0) * w[i] / 100 + 1e-9); }), tot = got.reduce(function (s, v) { return s + v; }, 0);
    var col = head.indexOf(act) + 1;
    if (!col) { col = head.length + 1; st.getRange(1, col).setValue(act).setFontWeight("bold"); head.push(act); }
    var cell = st.getRange(row, col); cell.setValue(tot / 10).setNumberFormat('0.0 "★"');
    cell.setNote(names.map(function (n, i) { return n + ": " + (got[i] / 10).toFixed(1) + " of " + (w[i] / 10).toFixed(1) + " stars"; }).join("\n"));
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
    students: v.filter(function (r) { return !isTeacher(r[0]); }).map(function (r) {   // (a teacher's own progress is not a student's)
      var d = {}; if (dc >= 0 && r[dc]) { try { d = JSON.parse(r[dc]); } catch (e) { } }
      return { email: r[0], name: r[1], saved: r[2] ? new Date(r[2]).toISOString() : "", detail: d };
    }),
    due: dueDates()
  };
}

// ---- due dates: one per activity (yyyy-mm-dd); the class progress page marks "L" when 5 stars were not earned by the end of that day ----
function dueDates() { var o = {}, s = allSettings(); Object.keys(s).forEach(function (k) { if (k.indexOf("due:") === 0) o[k.slice(4)] = s[k]; }); return o; }
function setDue(act, date) {
  if (!act) return { error: "bad", message: "Which activity?" };
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "bad", message: "That date isn't valid." };
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try { putSetting("due:" + act, date || ""); } finally { lock.releaseLock(); }
  return { ok: true, due: dueDates() };
}

// ---- Google Classroom: the class list comes from the teacher's Classroom classes ----
function courses(email) {
  var out = [], tok;
  do {
    var r = Classroom.Courses.list({ teacherId: "me", courseStates: ["ACTIVE"], pageSize: 100, pageToken: tok });
    (r.courses || []).forEach(function (c) { out.push({ id: c.id, name: c.name + (c.section ? " (" + c.section + ")" : "") }); });
    tok = r.nextPageToken;
  } while (tok);
  var last = []; try { last = JSON.parse(getSetting("courses") || "[]"); } catch (e) { }
  return { courses: out, last: last };
}
function people(courseId, kind) {
  var out = [], tok;
  do {
    var r = kind === "t" ? Classroom.Courses.Teachers.list(courseId, { pageSize: 100, pageToken: tok }) : Classroom.Courses.Students.list(courseId, { pageSize: 100, pageToken: tok });
    (r[kind === "t" ? "teachers" : "students"] || []).forEach(function (p) { var pr = p.profile || {}; if (pr.emailAddress) out.push({ email: String(pr.emailAddress).toLowerCase(), name: (pr.name && pr.name.fullName) || pr.emailAddress }); });
    tok = r.nextPageToken;
  } while (tok);
  return out;
}
// The Students sheet is made to match the chosen classes: students who are not in them leave the list (their saved work stays in the Data sheet,
// so nothing is lost if they come back), and students who are in them but have not signed in yet are added.  The classes' teachers may open this page.
function syncClassroom(ids) {
  if (!ids.length) return { error: "bad", message: "Choose at least one class." };
  var want = {}, teach = {};
  ids.forEach(function (id) { people(id, "s").forEach(function (p) { want[p.email] = p.name; }); people(id, "t").forEach(function (p) { teach[p.email] = 1; }); });
  var added = 0, removed = 0, lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    var st = students(), n = st.getLastRow(), have = {};
    if (n >= 2) {
      var v = st.getRange(2, 1, n - 1, 2).getValues();
      for (var i = v.length - 1; i >= 0; i--) {
        var e = String(v[i][0]).toLowerCase(); if (!e) continue;
        if (want[e] == null && !TEACHERS.some(function (t) { return t.toLowerCase() === e; })) { st.deleteRow(i + 2); removed++; }
        else { have[e] = 1; if (want[e] && !v[i][1]) st.getRange(i + 2, 2).setValue(want[e]); }
      }
    }
    Object.keys(want).forEach(function (e) { if (!have[e]) { st.appendRow([e, want[e], ""]); added++; } });
    putSetting("courses", JSON.stringify(ids));
    putSetting("teachers", JSON.stringify(Object.keys(teach)));
    CacheService.getScriptCache().remove("teachers");
  } finally { lock.releaseLock(); }
  return { ok: true, added: added, removed: removed, students: Object.keys(want).length, teachers: Object.keys(teach).length };
}

/** Run once from the editor (select "setup", click Run) to create the sheets and approve permissions. */
function setup() {
  var s = SpreadsheetApp.getActiveSpreadsheet();
  if (s) PropertiesService.getScriptProperties().setProperty("SHEET_ID", s.getId());
  students(); dataSheet(); sessions(); settings();
  try { Classroom.Courses.list({ teacherId: "me", pageSize: 1 }); } catch (e) { }   // (asks for the Classroom permissions)
  UrlFetchApp.fetch("https://oauth2.googleapis.com/tokeninfo?id_token=x", { muteHttpExceptions: true });
}
