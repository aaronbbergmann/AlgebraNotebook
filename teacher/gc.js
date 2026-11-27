/* Algebra Notebook: Google Classroom and Calendar from a teacher's own browser (Question Bank migration, step 6).
   The server runs as the Admin, so Google lets it see only the Admin's classes. Every other teacher's Sync, posting, grades and class
   meeting times run here, as that teacher: Google asks them once for permission (on their first click), then this page calls Classroom
   and Calendar directly. The Admin keeps the server's way (and its 5 am grades timer). */
(function () {
  "use strict";
  var CLIENT_ID = "160859714217-010cnbk9qdbjo75h6k7uskud60s8cu30.apps.googleusercontent.com";   // (the same sign-in client as auth.js)
  var SCOPES = ["https://www.googleapis.com/auth/classroom.courses.readonly", "https://www.googleapis.com/auth/classroom.rosters.readonly",
    "https://www.googleapis.com/auth/classroom.profile.emails", "https://www.googleapis.com/auth/classroom.coursework.students",
    "https://www.googleapis.com/auth/calendar.readonly"].join(" ");
  var C = "https://classroom.googleapis.com/v1/", CAL = "https://www.googleapis.com/calendar/v3/", TZ = "America/New_York";
  var tok = null, exp = 0, client = null, waiting = [];
  function gsi(cb) {
    if (window.google && google.accounts && google.accounts.oauth2) return cb();
    var s = document.querySelector("script[src*='accounts.google.com/gsi/client']");
    if (!s) { s = document.createElement("script"); s.src = "https://accounts.google.com/gsi/client"; s.async = true; document.head.appendChild(s); }
    var t = setInterval(function () { if (window.google && google.accounts && google.accounts.oauth2) { clearInterval(t); cb(); } }, 100);
  }
  // the access token: asked for on a click (Google opens its permission window the first time), kept for its hour
  function token() {
    if (tok && Date.now() < exp - 60000) return Promise.resolve(tok);
    return new Promise(function (res, rej) {
      waiting.push([res, rej]); if (waiting.length > 1) return;
      gsi(function () {
        var done = function (err, t) { var w = waiting; waiting = []; w.forEach(function (p) { if (err) p[1](err); else p[0](t); }); };
        client = client || google.accounts.oauth2.initTokenClient({ client_id: CLIENT_ID, scope: SCOPES, hint: (window.AN && AN.user && AN.user.email) || undefined, callback: function () { } });
        client.callback = function (r) { if (r.error) return done(new Error(r.error_description || "Google permission was not given (" + r.error + ").")); tok = r.access_token; exp = Date.now() + (+r.expires_in || 3600) * 1000; done(null, tok); };
        client.error_callback = function (e) { done(new Error(e && e.type === "popup_closed" ? "The Google permission window was closed. Click again and choose Allow." : (e && e.message) || "Google permission was not given.")); };
        client.requestAccessToken({ prompt: "" });
      });
    });
  }
  function call(method, url, body) {
    return token().then(function (t) {
      return fetch(url, { method: method, headers: { Authorization: "Bearer " + t, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined }).then(function (r) {
        if (r.status === 204) return {};
        return r.json().then(function (j) { if (!r.ok) throw new Error((j.error && j.error.message) || ("Google answered " + r.status)); return j; });
      });
    });
  }
  function all(url, key) {
    var out = [];
    function page(next) { return call("GET", url + (url.indexOf("?") < 0 ? "?" : "&") + "pageSize=100" + (next ? "&pageToken=" + encodeURIComponent(next) : "")).then(function (j) { out = out.concat(j[key] || []); return j.nextPageToken ? page(j.nextPageToken) : out; }); }
    return page();
  }
  // New York time <-> UTC (Classroom's due dates are in UTC; the site's are New York time, "yyyy-MM-ddTHH:mm")
  function nyParts(d) { var f = {}; new Intl.DateTimeFormat("en-US", { timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(d).forEach(function (p) { f[p.type] = p.value; }); return f; }
  function nyText(d) { var f = nyParts(d); return f.year + "-" + f.month + "-" + f.day + "T" + f.hour + ":" + f.minute; }
  function nyMs(y, mo, d, h, mi) { var g = Date.UTC(y, mo - 1, d, h, mi); for (var i = 0; i < 2; i++) { var f = nyParts(new Date(g)), shown = Date.UTC(+f.year, +f.month - 1, +f.day, +f.hour, +f.minute); g += Date.UTC(y, mo - 1, d, h, mi) - shown; } return g; }
  function due(local) {
    var m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/.exec(local || ""); if (!m) return null;
    var t = new Date(nyMs(+m[1], +m[2], +m[3], m[4] == null ? 23 : +m[4], m[5] == null ? 59 : +m[5]));
    return { dueDate: { year: t.getUTCFullYear(), month: t.getUTCMonth() + 1, day: t.getUTCDate() }, dueTime: { hours: t.getUTCHours(), minutes: t.getUTCMinutes() } };
  }
  var GC = window.GC = {
    courses: function () { return all(C + "courses?teacherId=me&courseStates=ACTIVE", "courses").then(function (L) { return L.map(function (c) { return { id: c.id, name: c.name + (c.section ? " (" + c.section + ")" : "") }; }); }); },
    roster: function (id) {   // a class's students (with emails) and teachers, for the server's Sync
      return Promise.all([all(C + "courses/" + id + "/students", "students"), all(C + "courses/" + id + "/teachers", "teachers")]).then(function (r) {
        return { students: r[0].map(function (p) { var pr = p.profile || {}; return { email: String(pr.emailAddress || "").toLowerCase(), name: (pr.name && pr.name.fullName) || pr.emailAddress || "" }; }),
          teachers: r[1].map(function (p) { return String((p.profile || {}).emailAddress || "").toLowerCase(); }).filter(String) };
      });
    },
    // an assignment's post in a class: made, or (with its post id) updated; the post's id comes back
    post: function (course, workId, rec, link) {
      var d = due((rec.due || {})[course] || (rec.due || {}).all), body = { title: rec.abbr + ": " + rec.title };
      if (d) { body.dueDate = d.dueDate; body.dueTime = d.dueTime; }
      if (workId) return call("PATCH", C + "courses/" + course + "/courseWork/" + workId + "?updateMask=" + (d ? "title,dueDate,dueTime" : "title"), body).then(function (w) { return w.id || workId; });
      body.description = "Open it in Algebra Notebook. Your stars are your grade (5 stars = 5 points)."; body.workType = "ASSIGNMENT"; body.state = "PUBLISHED"; body.maxPoints = 5;
      body.materials = [{ link: { url: link, title: rec.abbr + " · " + rec.title } }];
      return call("POST", C + "courses/" + course + "/courseWork", body).then(function (w) { return w.id; });
    },
    remove: function (course, workId) { return call("DELETE", C + "courses/" + course + "/courseWork/" + workId); },
    // grades: the server works out each student's grade (gradesFor); here they go to each class's submissions. onlyPassed: classes past their due date
    sendGrades: function (id, onlyPassed) {
      var sent = 0, warn = [];
      return AN.api("gradesFor", { id: id }).then(function (j) {
        return (j.classes || []).filter(function (c) { return !onlyPassed || c.passed; }).reduce(function (p, c) {
          return p.then(function () {
            return Promise.all([all(C + "courses/" + c.course + "/students", "students"), all(C + "courses/" + c.course + "/courseWork/" + c.work + "/studentSubmissions", "studentSubmissions")]).then(function (r) {
              var who = {}; r[0].forEach(function (s) { if (s.profile && s.profile.emailAddress) who[s.userId] = String(s.profile.emailAddress).toLowerCase(); });
              return r[1].reduce(function (q, sub) { var g = c.grades[who[sub.userId]]; if (g == null) return q; return q.then(function () { return call("PATCH", C + "courses/" + c.course + "/courseWork/" + c.work + "/studentSubmissions/" + sub.id + "?updateMask=assignedGrade,draftGrade", { assignedGrade: g, draftGrade: g }).then(function () { sent++; }); }); }, Promise.resolve());
            }).catch(function (e) { warn.push(e.message || String(e)); });
          });
        }, Promise.resolve());
      }).then(function () { return { sent: sent, warnings: warn }; });
    },
    // a class's meetings in the next 5 months, from the teacher's calendars: events whose title holds the course code, New York time
    meetings: function (code) {
      if (!code) return Promise.resolve([]);
      var from = new Date(Date.now() - 864e5).toISOString(), to = new Date(Date.now() + 150 * 864e5).toISOString(), seen = {}, out = [];
      return all(CAL + "users/me/calendarList?minAccessRole=reader", "items").then(function (cals) {
        return cals.reduce(function (p, cal) {
          return p.then(function () {
            return all(CAL + "calendars/" + encodeURIComponent(cal.id) + "/events?singleEvents=true&orderBy=startTime&q=" + encodeURIComponent(code) + "&timeMin=" + encodeURIComponent(from) + "&timeMax=" + encodeURIComponent(to), "items").then(function (ev) {
              ev.forEach(function (e) { if (!e.start || !e.start.dateTime || String(e.summary || "").indexOf(code) < 0) return; var t = nyText(new Date(e.start.dateTime)); if (!seen[t]) { seen[t] = 1; out.push(t); } });
            }).catch(function () { });
          });
        }, Promise.resolve());
      }).then(function () { return out.sort(); });
    },
    due: due,
    ready: token   // (call it first in a click, before any other wait: Google opens its permission window only straight from a click)
  };
  // is the signed-in teacher the Admin (the server's way) or another teacher (this file's way)?
  var me = null;
  GC.whoami = function () { if (me) return me; me = window.AN && AN.enabled && AN.user ? AN.api("whoami").catch(function () { return { owner: true }; }) : Promise.resolve({ owner: true }); return me; };
})();
