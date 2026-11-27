/**
 * Algebra Notebook progress server (Google Apps Script, bound to a Google Sheet).
 * Paste into Extensions > Apps Script of the progress Sheet, fill in CLIENT_ID, then
 * Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 *
 * Sheets it keeps:
 *   Students  - one row per student: email, name, last saved, then one column per activity (stars, 0.0 to 5.0)
 *   Data      - the raw saved progress (JSON, split over columns if long)
 *   Sessions  - sign-in sessions (a random key per device, valid 90 days)
 *   Assignments - one row per assignment a teacher saved: id, title, abbreviation, owner, classes, due (JSON), items (JSON), created
 *   Attempts  - one row per finished problem of an assignment or of practice (append only): time, student, class, assignment, question,
 *               version, seed, mode, tier, correct, tries
 *   Settings  - due dates (due:<activity> = yyyy-mm-ddThh:mm, or yyyy-mm-dd from older saves), the Google Classroom classes last synced, and their teachers
 *
 * Google Classroom sync (the "Sync with Google Classroom" button on the class progress page) needs the Classroom service:
 * in the Apps Script editor, Services (+) > Google Classroom API > Add, and the permissions in server/appsscript.json (Project Settings >
 * "Show appsscript.json manifest file in editor", then paste it into appsscript.json), then run "setup" once to approve the new permissions.
 */
var CLIENT_ID = "160859714217-010cnbk9qdbjo75h6k7uskud60s8cu30.apps.googleusercontent.com";
var SHEET_ID = "1HryFKwRUEdEqvbsTO52QCFk07JIp1gBzzlBbiFl-7kk";   // the progress Sheet "Algebra Notebook Progress"
var DOMAIN = "sch.org";                   // only this Google Workspace domain may sign in
var TEACHERS = ["abergmann@sch.org"];     // may open the class progress page
var SESSION_DAYS = 90;
var CHUNK = 45000;
var TACTS = ["roster", "setDue", "courses", "syncClassroom", "saveAssignment", "listAssignments", "deleteAssignment", "classes", "setCode", "sendGrades", "migrationCheck", "addTeacher", "listTeachers", "syncRoster", "setPosts", "gradesFor"];                        // a cell holds at most 50,000 characters

function doPost(e) {
  var req;
  try { req = JSON.parse(e.postData.contents); } catch (err) { return out({ error: "bad", message: "Bad request." }); }
  try {
    if (req.action === "signin") return out(signin(req.credential));
    var who = sessionEmail(req.session);
    if (!who) return out({ error: "auth", message: "Please sign in again." });
    try { ensureConverted(); } catch (err) { }   // (once: the activities 1.1A to 3.1C become assignments)
    if (req.action === "load") return out(load(who));
    if (req.action === "save") return out(save(who, req.data, req.summary));
    if (req.action === "signout") { endSession(req.session); return out({ ok: true }); }
    if (req.action === "due") return out({ due: dueDates() });
    if (req.action === "whoami") return out({ email: who.email, teacher: isTeacher(who.email), owner: isOwner(who.email) });   // (step 6: another teacher's Classroom runs in their browser)
    if (req.action === "assignment") return out(getAssignment(req.id, who));   // (step 5: /a/?id= fetches its record once)
    if (req.action === "attempts") return out(logAttempts(who, req.rows || []));   // (step 5: finished problems, in batches)   // (any signed-in student: the welcome page opens the activity due next)
    if (TACTS.indexOf(req.action) >= 0) {   // teacher actions: on the teacher's own Sheet (yours: this one)
      if (!isTeacher(who.email)) return out({ error: "forbidden", message: "Teachers only." });
      if (req.action === "addTeacher" || req.action === "listTeachers") { if (!isOwner(who.email)) return out({ error: "forbidden", message: "Only the Admin can add teachers." }); return out(req.action === "addTeacher" ? addTeacher(req.email, req.name) : listTeachers()); }
      return out(asTeacher(who.email, function () { return teacherAction(req, who); }));
    }
    return out({ error: "bad", message: "Unknown action." });
  } catch (err) {
    return out({ error: "server", message: String(err && err.message || err) });
  }
}
function teacherAction(req, who) {
    if (req.action === "saveAssignment") return (saveAssignment(who, req.assignment || {}));   // (step 6: the builder, teacher/build/)
    if (req.action === "listAssignments") return (listAssignments(who));
    if (req.action === "deleteAssignment") return (deleteAssignment(who, req.id));
    if (req.action === "classes") return (classes());   // (step 6: the synced classes, with their meetings from Calendar)
    if (req.action === "setCode") return (setCode(req.id, req.code));
    if (req.action === "sendGrades") return (sendGrades(req.id, true));
    if (req.action === "migrationCheck") return (migrationCheck(req.snapshot));   // (step 7: the snapshot's activity stars against the presets now)
    if (req.action === "roster") return (roster());
    if (req.action === "setDue") return (setDue(req.act, req.date));
    if (req.action === "courses") return (courses(who.email));
    if (req.action === "syncClassroom") return (syncClassroom(req.courseIds || [], who));
    if (req.action === "syncRoster") return (syncClassroom((req.classes || []).map(function (c) { return String(c.id); }), who, req.classes || []));   // (another teacher: the classes their browser read from Classroom)
    if (req.action === "setPosts") return (setPosts(req.id, req.posts || {}));
    if (req.action === "gradesFor") return (gradesFor(req.id));
  return { error: "bad", message: "Unknown action." };
}
function doGet() { return out({ ok: true, service: "Algebra Notebook" }); }
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function isTeacher(email) { var e = String(email).toLowerCase(); return isOwner(e) || classTeachers().indexOf(e) >= 0 || !!teacherSheetId(e); }
function isOwner(email) { var e = String(email).toLowerCase(); return TEACHERS.map(function (t) { return t.toLowerCase(); }).indexOf(e) >= 0; }   // (the Admin: this Sheet is theirs)
// ---- More teachers (step 6): this Sheet is the hub (only you have it): Teachers (each teacher's own Sheet), Rosters (who is whose student) and
// Assignment Index (whose each assignment is).  A teacher's own Sheet holds their Students, Assignments, Attempts and Settings.
function hubSheet(name, header) { var b = home(), sh = b.getSheetByName(name); if (!sh) { sh = b.insertSheet(name); sh.appendRow(header); sh.setFrozenRows(1); sh.getRange(1, 1, 1, header.length).setFontWeight("bold"); } return sh; }
function teachersTab() { return hubSheet("Teachers", ["Email", "Name", "Sheet id", "Added"]); }
function rostersTab() { return hubSheet("Rosters", ["Student", "Teacher", "Class"]); }
function indexTab() { return hubSheet("Assignment Index", ["Assignment", "Owner"]); }
function tabRows(sh, w) { var n = sh.getLastRow(); return n < 2 ? [] : sh.getRange(2, 1, n - 1, w).getValues(); }
function teacherMap() {   // email -> their own Sheet id (cached ten minutes)
  var c = CacheService.getScriptCache(), hit = c.get("tmap"); if (hit) return JSON.parse(hit);
  var o = {}; try { tabRows(teachersTab(), 3).forEach(function (r) { if (r[0] && r[2]) o[String(r[0]).toLowerCase()] = String(r[2]); }); } catch (e) { }
  c.put("tmap", JSON.stringify(o), 600); return o;
}
function teacherSheetId(email) { return teacherMap()[String(email).toLowerCase()] || ""; }
function asTeacher(email, fn) {   // run fn on the teacher's own Sheet (yours, if they are you or have none)
  var id = isOwner(email) ? "" : teacherSheetId(email); if (!id) return fn();
  var keep = BOOK; BOOK = SpreadsheetApp.openById(id); try { return fn(); } finally { BOOK = keep; }
}
function ownerOf(asgId) { var r = tabRows(indexTab(), 2).filter(function (x) { return String(x[0]) === String(asgId); })[0]; return r ? String(r[1]).toLowerCase() : ""; }
function indexPut(asgId, owner) { var sh = indexTab(), rows = tabRows(sh, 2); for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === String(asgId)) { if (!owner) sh.deleteRow(i + 2); else sh.getRange(i + 2, 2).setValue(owner); return; } if (owner) sh.appendRow([asgId, owner]); }
function teachersOf(student) { var e = String(student).toLowerCase(), o = {}; tabRows(rostersTab(), 2).forEach(function (r) { if (String(r[0]).toLowerCase() === e && r[1]) o[String(r[1]).toLowerCase()] = 1; }); return Object.keys(o); }
function listTeachers() { return { teachers: tabRows(teachersTab(), 4).map(function (r) { return { email: String(r[0]), name: String(r[1]), sheet: String(r[2]), added: r[3] instanceof Date ? r[3].toISOString() : String(r[3] || "") }; }) }; }
function addTeacher(email, name) {   // a new teacher: their own Progress Sheet (in your Drive, shared with them as editor) and a row in Teachers
  email = String(email || "").trim().toLowerCase(); name = String(name || "").trim();
  if (!/^[^@\s]+@[^@\s]+$/.test(email)) return { error: "bad", message: "Type the teacher's school email address." };
  if (DOMAIN && email.split("@")[1] !== DOMAIN) return { error: "bad", message: "Only " + DOMAIN + " accounts can be teachers." };
  if (teacherSheetId(email) || isOwner(email)) return { error: "bad", message: email + " is already a teacher." };
  var ss = SpreadsheetApp.create("Algebra Notebook Progress – " + (name || email));
  var keep = BOOK; BOOK = ss; try { students(); settings(); assignmentsSheet(); attemptsSheet(); var s1 = ss.getSheetByName("Sheet1"); if (s1 && ss.getSheets().length > 1) ss.deleteSheet(s1); } finally { BOOK = keep; }
  ss.addEditor(email);
  teachersTab().appendRow([email, name, ss.getId(), new Date()]); CacheService.getScriptCache().remove("tmap");
  return { ok: true, sheet: ss.getId(), url: ss.getUrl() };
}
function classTeachers() { var c = CacheService.getScriptCache(), hit = c.get("teachers"); if (hit != null) return JSON.parse(hit); var v = []; try { v = JSON.parse(getSetting("teachers") || "[]"); } catch (e) { } c.put("teachers", JSON.stringify(v), 600); return v; }

// ---- sheets ----
var BOOK = null;   // the Sheet a teacher action works on (that teacher's own); otherwise yours
function book() { return BOOK || home(); }
function home() {
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
    if (summary && typeof summary === "object") { var own = {}; Object.keys(summary).forEach(function (k) { var m = /^(?:_[td]:)?A:(.+)$/.exec(k), o = m && !/^P-/.test(m[1]) ? ownerOf(m[1]) : ""; if (!o || isOwner(o)) own[k] = summary[k]; }); writeSummary(st, r2, own); }   // (here: activities, presets and your own assignments; another teacher's go to their Sheet)
  } finally { lock.releaseLock(); }
  if (summary && typeof summary === "object") teachersOf(who.email).forEach(function (t) {
    if (isOwner(t) || !teacherSheetId(t)) return;
    try { asTeacher(t, function () {
      var mine = {}; Object.keys(summary).forEach(function (k) { var m = /^(?:_[td]:)?A:(.+)$/.exec(k); if (!m || /^P-/.test(m[1]) || ownerOf(m[1]) === t) mine[k] = summary[k]; });   // (activities and presets; of the assignments, only this teacher's)
      var ts = students(), rr = findRow(ts, who.email); if (!rr) { ts.appendRow([who.email, who.name, now]); rr = findRow(ts, who.email); } ts.getRange(rr, 3).setValue(now); writeSummary(ts, rr, mine);
    }); } catch (e) { }
  });
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
  var head = st.getRange(1, 1, 1, w).getValues()[0], v = st.getRange(2, 1, n - 1, w).getValues(), dc = head.indexOf("Detail (JSON)"), SC = studentClasses();
  return {
    students: v.filter(function (r) { return !isTeacher(r[0]); }).map(function (r) {   // (a teacher's own progress is not a student's)
      var d = {}; if (dc >= 0 && r[dc]) { try { d = JSON.parse(r[dc]); } catch (e) { } }
      return { email: r[0], name: r[1], saved: r[2] ? new Date(r[2]).toISOString() : "", detail: d, classes: SC[String(r[0]).toLowerCase()] || [] };
    }),
    due: dueDates()
  };
}

// ---- due dates: one per activity (yyyy-mm-ddThh:mm, New York time; older saves yyyy-mm-dd = the end of that day); the class progress page marks "L" when 5 stars were not earned by then ----
function dueDates() { var o = {}, s = allSettings(); Object.keys(s).forEach(function (k) { if (k.indexOf("due:") === 0) o[k.slice(4)] = s[k]; }); return o; }
function setDue(act, date) {
  if (!act) return { error: "bad", message: "Which activity?" };
  if (date && !/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/.test(date)) return { error: "bad", message: "That date isn't valid." };
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
    (r[kind === "t" ? "teachers" : "students"] || []).forEach(function (p) { var pr = p.profile || {}; if (pr.emailAddress) out.push({ email: String(pr.emailAddress).toLowerCase(), name: (pr.name && pr.name.fullName) || pr.emailAddress }); else out.noEmail = (out.noEmail || 0) + 1; });
    tok = r.nextPageToken;
  } while (tok);
  return out;
}
// The Students sheet is made to match the chosen classes: students who are not in them leave the list (their saved work stays in the Data sheet,
// so nothing is lost if they come back), and students who are in them but have not signed in yet are added.  The classes' teachers may open this page.
function syncClassroom(ids, who, given) {
  if (!ids.length) return { error: "bad", message: "Choose at least one class." };
  var want = {}, teach = {};
  var noEmail = 0;
  var byClass = {};
  if (given) given.forEach(function (c) { var id = String(c.id); byClass[id] = []; if (c.name) putSetting("cname:" + id, String(c.name));   // (another teacher's browser read these from Classroom)
    (c.students || []).forEach(function (p) { var e = String(p.email || "").toLowerCase(); if (!e) { noEmail++; return; } byClass[id].push(e); want[e] = p.name || e; }); (c.teachers || []).forEach(function (t) { teach[String(t).toLowerCase()] = 1; }); });
  else ids.forEach(function (id) { var ss = people(id, "s"); noEmail += ss.noEmail || 0; byClass[id] = ss.map(function (p) { return p.email; }); ss.forEach(function (p) { want[p.email] = p.name; }); people(id, "t").forEach(function (p) { teach[p.email] = 1; }); });
  // Classroom leaves out email addresses without the classroom.profile.emails permission (appsscript.json): then nothing is changed, rather than every student leaving the list
  if (noEmail) return { error: "server", message: "Google Classroom didn't share " + noEmail + " students' email addresses, so nothing was changed. The Apps Script needs the classroom.profile.emails permission: see server/SETUP.md." };
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
    Object.keys(byClass).forEach(function (id) { putSetting("roster:" + id, JSON.stringify(byClass[id])); });
    if (who) { var me = String(who.email).toLowerCase(), R = rostersTab(), rr = tabRows(R, 3);   // (the hub's Rosters: this teacher's students, by class)
      for (var q = rr.length - 1; q >= 0; q--) if (String(rr[q][1]).toLowerCase() === me) R.deleteRow(q + 2);
      var add = []; Object.keys(byClass).forEach(function (id) { byClass[id].forEach(function (e) { add.push([e, me, id]); }); }); if (add.length) R.getRange(R.getLastRow() + 1, 1, add.length, 3).setValues(add); }   // (who is in which class: each student's own due date)
    putSetting("teachers", JSON.stringify(Object.keys(teach)));
    CacheService.getScriptCache().remove("teachers");
  } finally { lock.releaseLock(); }
  return { ok: true, added: added, removed: removed, students: Object.keys(want).length, teachers: Object.keys(teach).length };
}

/** Run once from the editor (select "setup", click Run) to create the sheets and approve permissions. */
// ---- Assignments and Attempts (Question Bank migration, step 5).  Step 6 sends each assignment's attempts to its owner's own Sheet.
function assignmentsSheet() { var sh = sheet("Assignments", ["Id", "Title", "Abbreviation", "Owner", "Classes", "Due (JSON)", "Items (JSON)", "Created", "Classroom (JSON)"]); if (sh.getRange(1, 9).getValue() !== "Classroom (JSON)") sh.getRange(1, 9).setValue("Classroom (JSON)").setFontWeight("bold"); return sh; }
function attemptsSheet() { return sheet("Attempts", ["Time", "Student", "Class", "Assignment", "Question", "Version", "Seed", "Mode", "Tier", "Correct", "Tries"]); }
function getAssignment(id, who) { var o = ""; try { o = ownerOf(id); } catch (e) { } return o ? asTeacher(o, function () { return getAssignment0(id, who); }) : getAssignment0(id, who); }
function getAssignment0(id, who) {
  id = String(id || ""); if (!id) return { error: "bad", message: "No assignment id." };
  var sh = assignmentsSheet(), n = sh.getLastRow(); if (n < 2) return { assignment: null };
  var rows = sh.getRange(2, 1, n - 1, 8).getValues();
  for (var i = 0; i < rows.length; i++) if (String(rows[i][0]) === id) {
    var r = rows[i], items = [], due = {};
    try { items = JSON.parse(r[6] || "[]"); } catch (e) { items = []; } try { due = JSON.parse(r[5] || "{}"); } catch (e) { due = {}; }
    var cls = String(r[4]).split(/\s*,\s*/).filter(String), mine = who ? (studentClasses()[String(who.email).toLowerCase()] || []).filter(function (c) { return cls.indexOf(c) >= 0; })[0] : null;
    if (mine && due[mine]) due.mine = due[mine]; else if (due.all) due.mine = due.all;   // (the student's own class's due date)
    return { assignment: { id: id, title: String(r[1]), abbr: String(r[2]), owner: String(r[3]), classes: cls, due: due, items: items } };
  }
  return { assignment: null };
}
function logAttempts(who, rows) {
  var by = {}; (rows || []).slice(0, 500).forEach(function (r) { var a = String(r && r.a || ""), o = /^A-/.test(a) ? ownerOf(a) : ""; (by[o] = by[o] || []).push(r); });
  var n = 0; Object.keys(by).forEach(function (o) { var res = o ? asTeacher(o, function () { return logAttempts0(who, by[o]); }) : logAttempts0(who, by[o]); n += res.n || 0; });
  return { ok: true, n: n };
}
function logAttempts0(who, rows) {
  if (!rows.length) return { ok: true, n: 0 };
  rows = rows.slice(0, 500);
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var sh = attemptsSheet(), vals = rows.map(function (r) {
      return [r.t ? new Date(r.t) : new Date(), who.email, "", String(r.a || ""), String(r.q || ""), Number(r.v) || 1, String(r.seed || ""), String(r.m || ""), Number(r.tier) || 0, r.ok ? "yes" : "no", Number(r.tries) || 1];
    });
    sh.getRange(sh.getLastRow() + 1, 1, vals.length, vals[0].length).setValues(vals);
  } finally { lock.releaseLock(); }
  return { ok: true, n: rows.length };
}
// ---- The builder (step 6): a teacher saves an assignment; its id makes the student link /a/?id=<id>
function asgRows() { var sh = assignmentsSheet(), n = sh.getLastRow(); return { sh: sh, rows: n < 2 ? [] : sh.getRange(2, 1, n - 1, 9).getValues() }; }
function asgRec(r) { var items = [], due = {}; try { items = JSON.parse(r[6] || "[]"); } catch (e) { } try { due = JSON.parse(r[5] || "{}"); } catch (e) { }
  var posts = {}; try { posts = JSON.parse(r[8] || "{}"); } catch (e) { }
  return { id: String(r[0]), title: String(r[1]), abbr: String(r[2]), owner: String(r[3]), classes: String(r[4]).split(/\s*,\s*/).filter(String), due: due, items: items, created: r[7] instanceof Date ? r[7].toISOString() : String(r[7] || ""), posted: Object.keys(posts), posts: posts }; }
function listAssignments(who) {
  var me = String(who.email).toLowerCase();
  return { assignments: asgRows().rows.filter(function (r) { return String(r[3]).toLowerCase() === me; }).map(asgRec) };
}
function saveAssignment(who, a) {
  var me = String(who.email).toLowerCase(), title = String(a.title || "").trim(), abbr = String(a.abbr || "").trim();
  var items = (a.items || []).filter(function (it) { return it && typeof it.q === "string" && it.q; }).map(function (it) { var o = { q: it.q }; if (+it.v) o.v = +it.v; if (it.name) o.name = String(it.name).slice(0, 60); return o; });   // (name: a review's own question names, "Q6 Substitution")
  if (!title) return { error: "bad", message: "Give the assignment a title." };
  if (!abbr) return { error: "bad", message: "Give the assignment an abbreviation (like 2.4A)." };
  if (!items.length) return { error: "bad", message: "Add at least one question." };
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var A = asgRows(), rows = A.rows, at = -1, id = String(a.id || "");
    for (var i = 0; i < rows.length; i++) {
      var mine = String(rows[i][3]).toLowerCase() === me;
      if (id && String(rows[i][0]) === id) { if (!mine) return { error: "forbidden", message: "That assignment belongs to another teacher." }; at = i; }
      else if (mine && String(rows[i][2]).toLowerCase() === abbr.toLowerCase()) return { error: "bad", message: "You already have an assignment called " + abbr + ". Each abbreviation is used once." };
    }
    if (at < 0 && /^P-[A-Za-z0-9.]+$/.test(id) && a.convert && isOwner(me) && !BOOK) { }   // (a converted activity keeps its preset's id, P-2.4A: students' stars and the old links carry on)
    else if (at < 0) {   // a new id: A-<date>-<abbreviation>, with a number added if it is taken
      var base = "A-" + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MMdd") + "-" + abbr.replace(/[^A-Za-z0-9]+/g, ""), n = 1; id = base;
      var ids = rows.map(function (r) { return String(r[0]); }); while (ids.indexOf(id) >= 0) id = base + "-" + (++n);
    }
    var due = a.due && typeof a.due === "object" ? a.due : (a.due ? { all: String(a.due) } : {}), cls = (a.classes || []).map(String).filter(String);
    var posts = {}; if (at >= 0) { try { posts = JSON.parse(rows[at][8] || "{}"); } catch (e) { } }
    var row = [id, title, abbr, me, cls.join(", "), JSON.stringify(due), JSON.stringify(items), at >= 0 ? rows[at][7] : new Date(), JSON.stringify(posts)];
    if (at >= 0) A.sh.getRange(at + 2, 1, 1, 9).setValues([row]); else { A.sh.getRange(A.sh.getLastRow() + 1, 1, 1, 9).setValues([row]); at = A.sh.getLastRow() - 2; }
  } finally { lock.releaseLock(); }
  // Google Classroom: a post in each chosen class (an assignment out of 5 points, the link, that class's due date); an edit updates the post
  var warn = [];
  if (a.post !== false && cls.length && !BOOK) {   // (another teacher's browser posts, then sends the posts back: setPosts)
    cls.forEach(function (c) {
      try {
        var body = { title: abbr + ": " + title, description: "Open it in Algebra Notebook. Your stars are your grade (5 stars = 5 points).", workType: "ASSIGNMENT", state: "PUBLISHED", maxPoints: 5,
          materials: [{ link: { url: SITE_URL + "a/?id=" + encodeURIComponent(id), title: abbr + " · " + title } }] }, d = due[c] || due.all, dd = d ? classroomDue(d) : null;
        if (dd) { body.dueDate = dd.dueDate; body.dueTime = dd.dueTime; }
        if (posts[c]) Classroom.Courses.CourseWork.patch({ title: body.title, dueDate: body.dueDate, dueTime: body.dueTime }, c, posts[c], { updateMask: dd ? "title,dueDate,dueTime" : "title" });
        else posts[c] = Classroom.Courses.CourseWork.create(body, c).id;
      } catch (e) { warn.push(className(c) + ": " + String(e && e.message || e)); }
    });
    assignmentsSheet().getRange(at + 2, 9).setValue(JSON.stringify(posts)); row[8] = JSON.stringify(posts);
  }
  try { indexPut(id, me); } catch (e) { }   // (whose assignment it is: students' work on it goes to this teacher's Sheet)
  if (/^P-/.test(id) && !BOOK) { try { var dv = due.all || Object.keys(due).map(function (k) { return due[k]; }).sort()[0] || ""; putSetting("due:" + id.slice(2), dv); } catch (e) { } }   // (a converted activity: its due date also stays where the student home page reads it before the assignment is opened)
  return { ok: true, assignment: asgRec(row), warnings: warn };
}
// ---- The activities as assignments (after step 8): each activity, 1.1A to 3.1C (with RevT1 and RevQ2; 1.1C and 1.3A had no questions), then 3.1D to 3.4B, is written into
// your Assignments tab the first time this server runs, keeping its preset's id (P-2.4A) so the students' stars and the old links carry on, with the
// activity's questions in order and its due date (Settings, due:<abbreviation>). Nothing is posted to Classroom. Each is then edited, posted or deleted in
// the builder like any other assignment. An id already in the tab is left alone (two first requests at once just write the same row twice); "converted:1" (and "converted:2") in Settings marks each batch done.
var CONVERTED = [{"id":"P-1.1A","abbr":"1.1A","title":"Parent Functions and Transformations","items":[{"q":"1.1A-parents"},{"q":"1.1A-graph-describe"}]},{"id":"P-1.1B","abbr":"1.1B","title":"Parent Functions and Transformations: Desmos","items":[{"q":"1.1B-estimate"}]},{"id":"P-1.2A","abbr":"1.2A","title":"Transformations of Linear and Absolute Value Functions","items":[{"q":"1.2-write-transformations"},{"q":"1.2-write-transformations","v":1}]},{"id":"P-1.2B","abbr":"1.2B","title":"Transformations of Linear and AbsVal Functions: Reflections","items":[{"q":"1.2-write-transformations","v":2}]},{"id":"P-1.2C","abbr":"1.2C","title":"Transformations of Linear and AbsVal Functions: Combinations","items":[{"q":"1.2-write-transformations","v":3},{"q":"1.2-write-transformations","v":4}]},{"id":"P-1.3B","abbr":"1.3B","title":"Modeling with Linear Functions (Day 2)","items":[{"q":"1.3B-equation"},{"q":"1.3B-compare"},{"q":"1.3B-line-of-fit"},{"q":"1.3B-best-fit"}]},{"id":"P-1.4A","abbr":"1.4A","title":"Solve Linear Systems: Graphing","items":[{"q":"1.4A-graphing"}]},{"id":"P-1.4B","abbr":"1.4B","title":"Solve Linear Systems Algebraically (Substitution)","items":[{"q":"1.4B-one-variable"},{"q":"1.4B-substitution"}]},{"id":"P-1.4C","abbr":"1.4C","title":"Solve Linear Systems Algebraically (Elimination)","items":[{"q":"1.4C-2x2-systems"}]},{"id":"P-1.4D","abbr":"1.4D","title":"Solve Systems of Linear Equations in 3 Variables","items":[{"q":"1.4D-3x3-systems"}]},{"id":"P-RevT1","abbr":"RevT1","title":"Review for Chapter 1 Test","items":[{"q":"1.1A-parents","name":"Q1 Families"},{"q":"1.4C-2x2-systems","name":"Q2 Solutions"},{"q":"1.1A-graph-describe","name":"Q3 Graph"},{"q":"1.2-write-transformations","v":3,"name":"Q4 Rule"},{"q":"1.3B-equation","name":"Q5 Line"},{"q":"1.4A-graphing","name":"Q6 Graphing"},{"q":"1.4B-substitution","name":"Q6 Substitution"},{"q":"1.4C-2x2-systems","name":"Q6 Elimination"},{"q":"1.4D-3x3-systems","name":"Q7 Three Variables"},{"q":"1.4A-graphing","name":"Q8 Word Problem"}]},{"id":"P-2.1A","abbr":"2.1A","title":"Transformations of Quadratic Functions","items":[{"q":"2.1A-graph-transformations"},{"q":"2.1A-graph-transformations","v":1}]},{"id":"P-2.1B","abbr":"2.1B","title":"Transformations of Quadratic Functions: Trans to Func","items":[{"q":"2.1A-graph-transformations","v":2},{"q":"2.1B-real-life"}]},{"id":"P-2.2A","abbr":"2.2A","title":"Characteristics of Quadratic Functions","items":[{"q":"2.2A-vertex-form"},{"q":"2.2A-standard-form"}]},{"id":"P-2.2B","abbr":"2.2B","title":"Characteristics of Quadratic Functions: Domain, Range, Increasing, Decreasing","items":[{"q":"2.2B-interval-notation"},{"q":"2.2B-domain"},{"q":"2.2B-range"},{"q":"2.2B-increasing"},{"q":"2.2B-decreasing"}]},{"id":"P-2.2C","abbr":"2.2C","title":"Characteristics of Quadratic Functions: Intercept Form","items":[{"q":"2.2C-memorize"},{"q":"2.2C-min-max"},{"q":"2.2C-characteristics"},{"q":"2.2C-intercept-form"},{"q":"2.2C-compare"}]},{"id":"P-RevQ2","abbr":"RevQ2","title":"Review for 2.1-2.2 Quiz","items":[{"q":"2.2A-standard-form","name":"Q1"},{"q":"2.2C-min-max","name":"Q2"},{"q":"2.2A-vertex-form","name":"Q3"},{"q":"2.2C-characteristics","name":"Q4"},{"q":"2.2C-intercept-form","name":"Q5"},{"q":"2.2C-compare","name":"Q6"}]},{"id":"P-2.4A","abbr":"2.4A","title":"Modeling with Quadratic Functions","items":[{"q":"2.4A-vertex-point"},{"q":"2.4A-point-intercepts"},{"q":"2.4A-3step-equations"},{"q":"2.4A-box-method"},{"q":"2.4A-square-roots"}]},{"id":"P-2.4B","abbr":"2.4B","title":"Modeling with Quadratic Functions (Day 2)","items":[{"q":"2.4B-quadratic-regression"},{"q":"2.4A-3step-equations"},{"q":"2.4B-distributing"}]},{"id":"P-3.1A","abbr":"3.1A","title":"Solving Quadratic Equations: Graphing","items":[{"q":"3.1A-graphing"},{"q":"3.1A-4step-equations"},{"q":"2.4A-box-method","v":1}]},{"id":"P-3.1B","abbr":"3.1B","title":"Solving Quadratic Equations: Square Roots","items":[{"q":"3.1B-simplify-roots"},{"q":"3.1B-square-roots"},{"q":"3.1B-square-roots-simplify"},{"q":"2.4A-box-method","v":1}]},{"id":"P-3.1C","abbr":"3.1C","title":"Solving Quadratic Equations: Real Life","items":[{"q":"3.1C-real-life"},{"q":"3.1C-real-life-desmos"},{"q":"3.1B-square-roots-simplify"},{"q":"2.4A-box-method","v":1},{"q":"2.4A-vertex-point","v":1}]}];
var CONVERTED2 = [{"id":"P-3.1D","abbr":"3.1D","title":"Solving Quadratic Equations: Factoring","items":[{"q":"2.4A-box-method","v":2},{"q":"3.1D-factoring"}]},{"id":"P-3.1E","abbr":"3.1E","title":"Solving Quadratic Equations: Solving by Factoring","items":[{"q":"3.1E-solve-factoring"}]},{"id":"P-3.1F","abbr":"3.1F","title":"Solving Quadratic Equations: Formulas","items":[{"q":"3.1F-special-products"}]},{"id":"P-3.1G","abbr":"3.1G","title":"Solving Quadratic Equations: Factor ax\u00b2 + bx + c","items":[{"q":"3.1G-factor-ac"}]},{"id":"P-3.3A","abbr":"3.3A","title":"Complete the Square (Solve)","items":[{"q":"3.3A-complete-square"}]},{"id":"P-3.3B","abbr":"3.3B","title":"Complete the Square (Vertex Form)","items":[{"q":"3.3B-vertex-form"}]},{"id":"P-3.4A","abbr":"3.4A","title":"Use the Quadratic Formula and the Discriminant","items":[{"q":"3.4A-quadratic-formula"}]},{"id":"P-3.4B","abbr":"3.4B","title":"Use the Quadratic Formula and the Discriminant: The Discriminant","items":[{"q":"3.4B-discriminant"}]}];   // (the second batch, 3.1D to 3.4B: "converted:2")
function ensureConverted() {
  var c = CacheService.getScriptCache(); if (c.get("converted2")) return;
  [["converted:1", CONVERTED], ["converted:2", CONVERTED2]].forEach(function (bt) {
    if (getSetting(bt[0])) return;   // (a batch is written once: an assignment deleted afterwards stays deleted)
    var me = { email: TEACHERS[0] }, dues = dueDates(), have = {}, warn = [];
    asgRows().rows.forEach(function (r) { have[String(r[0])] = 1; });
    bt[1].forEach(function (a) {
      if (have[a.id]) return; var ab = a.id.slice(2);
      var r = saveAssignment(me, { id: a.id, convert: true, title: a.title, abbr: a.abbr, items: a.items, due: dues[ab] ? { all: dues[ab] } : {}, classes: [], post: false });
      if (r.error) warn.push(ab + ": " + r.message);
    });
    putSetting(bt[0], new Date().toISOString() + (warn.length ? " " + warn.join(" ") : ""));
  });
  c.put("converted2", "1", 21600);
}
function deleteAssignment(who, id) {
  var me = String(who.email).toLowerCase(), A = asgRows();
  for (var i = 0; i < A.rows.length; i++) if (String(A.rows[i][0]) === String(id)) {
    if (String(A.rows[i][3]).toLowerCase() !== me) return { error: "forbidden", message: "That assignment belongs to another teacher." };
    var posts = {}, warn = []; try { posts = JSON.parse(A.rows[i][8] || "{}"); } catch (e) { }
    if (!BOOK) Object.keys(posts).forEach(function (c) { try { Classroom.Courses.CourseWork.remove(c, posts[c]); } catch (e) { warn.push(className(c) + ": " + String(e && e.message || e)); } });   // (its Classroom posts go too)
    A.sh.deleteRow(i + 2); try { indexPut(id, ""); } catch (e) { } return { ok: true, warnings: warn };
  }
  return { error: "bad", message: "That assignment was not found." };
}
// ---- Classes, Calendar and grades (step 6): the classes chosen at the last sync; each class's calendar course code (HAlg2-D2) finds its meetings
// in the calendars shared with you, so due dates are chosen from class times; grades go back to Classroom each day once a class's due date has passed.
var SITE_URL = "https://aaronbbergmann.github.io/AlgebraNotebook/";
function studentClasses() {   // email -> the synced classes the student is in
  var o = {}, s = allSettings(); Object.keys(s).forEach(function (k) { if (k.indexOf("roster:") !== 0) return; var id = k.slice(7), L = []; try { L = JSON.parse(s[k] || "[]"); } catch (e) { } L.forEach(function (e) { (o[e] = o[e] || []).push(id); }); });
  return o;
}
function className(id) {
  if (BOOK) return getSetting("cname:" + id) || id;   // (another teacher: the name their browser saved at Sync)
  var c = CacheService.getScriptCache(), hit = c.get("cname:" + id); if (hit) return hit;
  var n = id; try { var co = Classroom.Courses.get(id); n = co.name + (co.section ? " (" + co.section + ")" : ""); } catch (e) { }
  c.put("cname:" + id, n, 21600); return n;
}
function meetings(code) {   // the class's meetings in the next 5 months, from the calendars shared with you: "yyyy-MM-ddTHH:mm" (New York time)
  if (!code || BOOK) return [];   // (another teacher: their browser reads their calendars)
  var c = CacheService.getScriptCache(), hit = c.get("meet:" + code); if (hit) return JSON.parse(hit);
  var from = new Date(Date.now() - 864e5), to = new Date(Date.now() + 150 * 864e5), seen = {}, out = [], tz = Session.getScriptTimeZone();
  CalendarApp.getAllCalendars().forEach(function (cal) {
    try { cal.getEvents(from, to, { search: code }).forEach(function (ev) { if (String(ev.getTitle()).indexOf(code) < 0 || ev.isAllDayEvent()) return; var t = Utilities.formatDate(ev.getStartTime(), tz, "yyyy-MM-dd'T'HH:mm"); if (!seen[t]) { seen[t] = 1; out.push(t); } }); } catch (e) { }
  });
  out.sort(); c.put("meet:" + code, JSON.stringify(out), 21600); return out;
}
function classes() {
  var ids = []; try { ids = JSON.parse(getSetting("courses") || "[]"); } catch (e) { }
  return { classes: ids.map(function (id) { var code = getSetting("code:" + id); return { id: id, name: className(id), code: code, meetings: meetings(code) }; }) };
}
function setCode(id, code) { if (!id) return { error: "bad", message: "No class." }; putSetting("code:" + id, String(code || "").trim()); CacheService.getScriptCache().remove("meet:" + String(code || "").trim()); return { ok: true, meetings: meetings(String(code || "").trim()) }; }
function classroomDue(local) {   // "yyyy-MM-ddTHH:mm" in New York time -> Classroom's dueDate and dueTime (UTC)
  var m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/.exec(local || ""); if (!m) return null;
  var d = Utilities.parseDate(m[1] + "-" + m[2] + "-" + m[3] + " " + (m[4] || "23") + ":" + (m[5] || "59"), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm");
  return { at: d, dueDate: { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() }, dueTime: { hours: d.getUTCHours(), minutes: d.getUTCMinutes() } };
}
function gradeOf(detail, key, dueAt) {   // stars as a grade out of 5 (tenths), less 0.5 when late (the same rule as Class progress)
  var ex = detail[key] || {}, names = Object.keys(ex); if (!names.length) return dueAt && Date.now() > dueAt ? 0 : null;
  var b = Math.floor(50 / names.length), r = 50 - b * names.length, tot = 0;
  names.forEach(function (n, i) { tot += Math.floor((Number(ex[n]) || 0) * (b + (i < r ? 1 : 0)) / 100 + 1e-9); });
  var late = false; if (dueAt) { if (tot >= 50) { var t = +detail["_d:" + key] || +detail["_t:" + key] || 0; late = t > dueAt; } else late = Date.now() > dueAt; }
  return Math.max(0, tot - (late ? 5 : 0)) / 10;
}
function sendGrades(id, force) {   // the grades of one assignment, to each class it was posted in (force: before the due date too, from the builder)
  var A = asgRows(), r = A.rows.filter(function (x) { return String(x[0]) === String(id); })[0]; if (!r) return { error: "bad", message: "That assignment was not found." };
  var rec = asgRec(r), posts = {}; try { posts = JSON.parse(r[8] || "{}"); } catch (e) { }
  var st = students(), n = st.getLastRow(), w = st.getLastColumn(), det = {};
  if (n >= 2) { var head = st.getRange(1, 1, 1, w).getValues()[0], dc = head.indexOf("Detail (JSON)"); st.getRange(2, 1, n - 1, w).getValues().forEach(function (v) { var d = {}; if (dc >= 0 && v[dc]) { try { d = JSON.parse(v[dc]); } catch (e) { } } det[String(v[0]).toLowerCase()] = d; }); }
  var sent = 0, warn = [];
  Object.keys(posts).forEach(function (c) {
    var dd = classroomDue(rec.due[c] || rec.due.all), dueAt = dd ? dd.at.getTime() : 0; if (!force && (!dueAt || Date.now() < dueAt)) return;
    try {
      var who = {}, tok; do { var L = Classroom.Courses.Students.list(c, { pageSize: 100, pageToken: tok }); (L.students || []).forEach(function (p) { if (p.profile && p.profile.emailAddress) who[p.userId] = String(p.profile.emailAddress).toLowerCase(); }); tok = L.nextPageToken; } while (tok);
      tok = null; do {
        var S = Classroom.Courses.CourseWork.StudentSubmissions.list(c, posts[c], { pageSize: 100, pageToken: tok });
        (S.studentSubmissions || []).forEach(function (sub) { var e = who[sub.userId]; if (!e) return; var g = gradeOf(det[e] || {}, "A:" + id, dueAt); if (g == null) return;
          Classroom.Courses.CourseWork.StudentSubmissions.patch({ assignedGrade: g, draftGrade: g }, c, posts[c], sub.id, { updateMask: "assignedGrade,draftGrade" }); sent++; });
        tok = S.nextPageToken;
      } while (tok);
    } catch (e) { warn.push(className(c) + ": " + String(e && e.message || e)); }
  });
  return { ok: true, sent: sent, warnings: warn };
}
function setPosts(id, posts) {   // another teacher's browser posted the assignment in Classroom: keep each class's post id
  var A = asgRows(); for (var i = 0; i < A.rows.length; i++) if (String(A.rows[i][0]) === String(id)) {
    var cur = {}; try { cur = JSON.parse(A.rows[i][8] || "{}"); } catch (e) { } Object.keys(posts).forEach(function (c) { if (posts[c]) cur[c] = String(posts[c]); else delete cur[c]; });
    A.sh.getRange(i + 2, 9).setValue(JSON.stringify(cur)); return { ok: true, posts: cur };
  }
  return { error: "bad", message: "That assignment was not found." };
}
function gradesFor(id) {   // each class's post, due date and every student's grade (for another teacher's browser to send)
  var A = asgRows(), r = A.rows.filter(function (x) { return String(x[0]) === String(id); })[0]; if (!r) return { error: "bad", message: "That assignment was not found." };
  var rec = asgRec(r), det = detailsOf(book()), out = [];
  Object.keys(rec.posts || {}).forEach(function (c) {
    var dd = classroomDue(rec.due[c] || rec.due.all), dueAt = dd ? dd.at.getTime() : 0, g = {};
    Object.keys(det).forEach(function (e) { var v = gradeOf(det[e], "A:" + id, dueAt); if (v != null) g[e] = v; });
    out.push({ course: c, work: rec.posts[c], due: dueAt, passed: !!dueAt && Date.now() >= dueAt, grades: g });
  });
  return { ok: true, classes: out };
}
function dailyGrades() {   // the timer: every posted assignment whose due date has passed in a class sends that class's grades again (later work counts, late)
  dailyGrades0();   // (your classes; another teacher's grades go from their browser when they open Class progress)
}
function dailyGrades0() {
  asgRows().rows.forEach(function (r) { var p = {}; try { p = JSON.parse(r[8] || "{}"); } catch (e) { } if (Object.keys(p).length) { try { sendGrades(String(r[0]), false); } catch (e) { } } });
}
function setupTimer() { ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === "dailyGrades") ScriptApp.deleteTrigger(t); }); ScriptApp.newTrigger("dailyGrades").timeBased().everyDays(1).atHour(5).create(); }
// ---- Migration check, students half (step 7): every student's stars in each activity in the dated snapshot of this Sheet (step 6) against the
// stars of its preset assignment P-<activity> now.  A preset may be higher (work done since) but never lower.  A student whose browser has not
// opened the app since the presets came (so has not sent them yet) is counted apart, not as a difference.
function starTenths(ex) { var n = Object.keys(ex || {}); if (!n.length) return 0; var b = Math.floor(50 / n.length), r = 50 - b * n.length, t = 0; n.forEach(function (k, i) { t += Math.floor((Number(ex[k]) || 0) * (b + (i < r ? 1 : 0)) / 100 + 1e-9); }); return t; }
function detailsOf(ss) {
  var st = ss.getSheetByName("Students"); if (!st || st.getLastRow() < 2) return {};
  var w = st.getLastColumn(), head = st.getRange(1, 1, 1, w).getValues()[0], dc = head.indexOf("Detail (JSON)"), o = {}; if (dc < 0) return o;
  st.getRange(2, 1, st.getLastRow() - 1, w).getValues().forEach(function (v) { var d = {}; try { d = JSON.parse(v[dc] || "{}"); } catch (e) { } if (v[0]) o[String(v[0]).toLowerCase()] = d; });
  return o;
}
function migrationCheck(snapshot) {
  var m = /[-\w]{25,}/.exec(String(snapshot || "")); if (!m) return { error: "bad", message: "Paste the link (or the id) of the dated copy of the Progress Sheet." };
  var snap; try { snap = SpreadsheetApp.openById(m[0]); } catch (e) { return { error: "bad", message: "That Sheet could not be opened: " + String(e && e.message || e) }; }
  var before = detailsOf(snap), now = detailsOf(book()), diffs = [], waiting = [], checked = 0;
  Object.keys(before).forEach(function (email) {
    if (isTeacher(email)) return;
    var b = before[email], n = now[email] || {}, any = Object.keys(n).some(function (k) { return k.indexOf("A:P-") === 0; });
    Object.keys(b).forEach(function (act) {
      if (act.charAt(0) === "_" || act.indexOf("A:") === 0) return;
      var was = starTenths(b[act]); if (!was) return; checked++;
      if (!any) { if (waiting.indexOf(email) < 0) waiting.push(email); return; }
      var is = starTenths(n["A:P-" + act]); if (is < was) diffs.push({ student: email, activity: act, snapshot: was / 10, preset: is / 10 });
    });
  });
  return { ok: true, snapshotName: snap.getName(), students: Object.keys(before).length, checked: checked, differences: diffs, waiting: waiting };
}
function setup() {
  var s = SpreadsheetApp.getActiveSpreadsheet();
  if (s) PropertiesService.getScriptProperties().setProperty("SHEET_ID", s.getId());
  students(); dataSheet(); sessions(); settings(); assignmentsSheet(); attemptsSheet();
  try { Classroom.Courses.list({ teacherId: "me", pageSize: 1 }); } catch (e) { }   // (asks for the Classroom permissions)
  try { CalendarApp.getAllCalendars(); } catch (e) { }   // (asks for the Calendar permission: class meeting times)
  setupTimer();   // (grades go back to Classroom each morning at 5)
  UrlFetchApp.fetch("https://oauth2.googleapis.com/tokeninfo?id_token=x", { muteHttpExceptions: true });
}
