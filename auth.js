/* Algebra Notebook: Google sign-in and progress sync.
   - Every page except the Playgrounds (playsolve, playgraph, playdata) needs a sign-in with a school Google account.
   - Progress (the algebraProgress* keys in localStorage) is saved to the teacher's Google Sheet through an Apps Script web app,
     so it follows the student to any device; the teacher page (teacher/) shows everyone's progress.
   - Until CLIENT_ID and API_URL are filled in, this file does nothing and the site works as before. */
(function () {
  "use strict";
  var CONFIG = {
    CLIENT_ID: "160859714217-010cnbk9qdbjo75h6k7uskud60s8cu30.apps.googleusercontent.com",
    API_URL: "https://script.google.com/macros/s/AKfycbzgC-1EJrwb2kkMpFLxtHoa-N20jEqbLlLoFST9k-OpmcUFRbIvteSe6CuEdrLWI1q-tw/exec",
    DOMAIN: "sch.org",        // only accounts from this Google domain can sign in
    PLAYGROUNDS: ["playsolve", "playsolver", "playgraph", "playdata", "1-1play"]
  };
  var PREFIX = "algebraProgress", AUTH = "an:auth", OWNER = "an:owner", PULLED = "an:pulled";
  if (!CONFIG.CLIENT_ID || !CONFIG.API_URL) { window.AN = { enabled: false }; return; }

  // where the site's root is, from this script's own address
  var me = document.currentScript && document.currentScript.src || "";
  var BASE = me ? me.replace(/auth\.js(\?.*)?$/, "") : "./";
  var seg = decodeURIComponent(location.pathname).replace(/\/index\.html$/i, "").replace(/\/+$/, "").split("/").pop().toLowerCase();
  var isPlay = CONFIG.PLAYGROUNDS.indexOf(seg) >= 0;

  var ls = window.localStorage, ss = window.sessionStorage;
  function get(k) { try { return ls.getItem(k); } catch (e) { return null; } }
  function auth() { try { return JSON.parse(get(AUTH) || "null"); } catch (e) { return null; } }
  var rawSet = Storage.prototype.setItem, rawRemove = Storage.prototype.removeItem;
  function put(k, v) { try { rawSet.call(ls, k, v); } catch (e) { } }
  function del(k) { try { rawRemove.call(ls, k); } catch (e) { } }
  function progKeys() { var out = []; try { for (var i = 0; i < ls.length; i++) { var k = ls.key(i); if (k && k.indexOf(PREFIX) === 0) out.push(k); } } catch (e) { } return out; }
  function snapshot() { var o = {}; progKeys().forEach(function (k) { o[k] = get(k); }); return o; }
  function clearProgress() { progKeys().forEach(del); }

  // ---- server calls (text/plain keeps them simple cross-origin requests) ----
  function api(action, body, opts) {
    var a = auth(), payload = Object.assign({ action: action, session: a && a.session }, body || {});
    return fetch(CONFIG.API_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload), keepalive: !!(opts && opts.keepalive), redirect: "follow" })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j && j.error === "auth") { del(AUTH); if (!isPlay) location.reload(); }
        if (j && j.error) throw new Error(j.message || j.error);
        return j;
      });
  }

  // ---- merging: nothing earned on either side is lost ----
  function deep(a, b) {
    if (a === undefined) return b; if (b === undefined) return a;
    if (typeof a === "number" && typeof b === "number") return Math.max(a, b);
    if (typeof a === "boolean" || typeof b === "boolean") return !!(a || b);
    if (a && b && typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) {
      var o = {}; Object.keys(a).concat(Object.keys(b)).forEach(function (k) { o[k] = deep(a[k], b[k]); }); return o;
    }
    return a;
  }
  function merge(server, local) {
    var out = {}; Object.keys(server || {}).concat(Object.keys(local || {})).forEach(function (k) {
      var s = server && server[k], l = local && local[k];
      if (s == null) { out[k] = l; return; } if (l == null) { out[k] = s; return; }
      try { out[k] = JSON.stringify(deep(JSON.parse(s), JSON.parse(l))); } catch (e) { out[k] = s; }
    });
    return out;
  }
  function same(a, b) { var ka = Object.keys(a), kb = Object.keys(b); if (ka.length !== kb.length) return false; return ka.every(function (k) { return a[k] === b[k]; }); }

  // ---- saving: any change to a progress key is sent a moment later ----
  var dirty = false, timer = null, busy = false;
  function summary() { try { return window.AN_summary ? window.AN_summary() : null; } catch (e) { return null; } }
  function push(keepalive) {
    if (!auth() || !dirty) return Promise.resolve();
    if (busy && !keepalive) { clearTimeout(timer); timer = setTimeout(push, 1500); return Promise.resolve(); }
    dirty = false; busy = true;
    return api("save", { data: snapshot(), summary: summary() }, { keepalive: keepalive })
      .catch(function () { dirty = true; clearTimeout(timer); timer = setTimeout(push, 15000); })
      .then(function () { busy = false; });
  }
  Storage.prototype.setItem = function (k, v) {
    var r = rawSet.apply(this, arguments);
    if (this === ls && String(k).indexOf(PREFIX) === 0 && auth()) { dirty = true; clearTimeout(timer); timer = setTimeout(push, 2000); }
    return r;
  };
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") push(true); });
  window.addEventListener("pagehide", function () { push(true); });

  // ---- loading: once per browser session, the account's saved work is merged in ----
  function pull() {
    return api("load").then(function (j) {
      var local = snapshot(), m = merge(j.data || {}, local);
      try { ss.setItem(PULLED, "1"); } catch (e) { }
      if (!same(m, local)) { Object.keys(m).forEach(function (k) { put(k, m[k]); }); }
      if (!same(m, j.data || {})) { dirty = true; return push().then(function () { return !same(m, local); }); }
      return !same(m, local);
    });
  }

  // ---- signing in ----
  function onCredential(resp) {
    setMsg("Signing in…");
    api("signin", { credential: resp.credential }).then(function (j) {
      var owner = get(OWNER);
      if (owner && owner !== j.email) clearProgress();       // a different student used this browser: start from this account's own work
      put(OWNER, j.email);
      put(AUTH, JSON.stringify({ session: j.session, email: j.email, name: j.name, teacher: !!j.teacher }));
      return pull();
    }).then(function () { location.reload(); })
      .catch(function (e) { setMsg(e.message || "Sign-in failed. Try again.", true); });
  }
  function signOut() {
    dirty = true;
    var done = function () { var a = auth(); if (a) api("signout").catch(function () { }); del(AUTH); clearProgress(); put(OWNER, ""); try { ss.removeItem(PULLED); } catch (e) { } try { google.accounts.id.disableAutoSelect(); } catch (e) { } location.reload(); };
    push().then(done, done);
  }

  function loadGis(cb) {
    if (window.google && google.accounts && google.accounts.id) return cb();
    var s = document.createElement("script"); s.src = "https://accounts.google.com/gsi/client"; s.async = true; s.onload = cb;
    s.onerror = function () { setMsg("Could not reach Google. Check the internet connection and reload.", true); };
    document.head.appendChild(s);
  }

  // ---- the sign-in screen ----
  var css = "html.an-lock body>*:not(#anGate){visibility:hidden!important}" +
    "#anGate{position:fixed;inset:0;z-index:2147483646;background:#fff;display:flex;align-items:center;justify-content:center;padding:16px;font:16px -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111}" +
    "#anGate .anC{max-width:420px;width:100%;text-align:center}#anGate h1{display:block;font:600 2rem LM,Georgia,serif;margin:0 0 .3em}" +
    "#anGate .anP{margin:.4em 0 1.2em;color:#333;line-height:1.4}#anGate .anB{display:flex;justify-content:center;min-height:44px}" +
    "#anGate .anM{min-height:1.4em;margin-top:.9em;color:#333}#anGate .anM.anE{color:#c0262d}" +
    "#anGate .anPg{display:block!important;margin-top:2.2em;padding-top:1.2em;border-top:1px solid #e3e3ea;font-size:.92em;color:#444}#anGate .anPg a{color:#111;margin:0 .45em;white-space:nowrap}" +
    "#anChip{position:fixed;left:6px;bottom:6px;z-index:2147483000;font:11px -apple-system,BlinkMacSystemFont,sans-serif;color:#555;background:rgba(255,255,255,.85);border:1px solid #e3e3ea;border-radius:10px;padding:2px 8px;opacity:.55}" +
    "#anChip:hover{opacity:1}#anChip a{color:#111;cursor:pointer;margin-left:.6em}@media print{#anChip{display:none}}";
  var st = document.createElement("style"); st.textContent = css; (document.head || document.documentElement).appendChild(st);

  function setMsg(t, err) { var m = document.getElementById("anMsg"); if (m) { m.textContent = t || ""; m.className = "anM" + (err ? " anE" : ""); } }
  function whenBody(cb) { if (document.body) cb(); else document.addEventListener("DOMContentLoaded", cb); }

  function showGate(text) {
    document.documentElement.classList.add("an-lock");
    whenBody(function () {
      var g = document.getElementById("anGate");
      if (!g) {
        g = document.createElement("div"); g.id = "anGate";
        g.innerHTML = "<div class=\"anC\"><h1>Algebra Notebook</h1><p class=\"anP\">Sign in with your school Google account to open the activities and save your progress.</p>" +
          "<div class=\"anB\" id=\"anBtn\"></div><div class=\"anM\" id=\"anMsg\"></div>" +
          "<div class=\"anPg\">The Playgrounds are open to everyone, no sign-in needed:<br><a href=\"" + BASE + "playsolve/\">Play Solve</a><a href=\"" + BASE + "playgraph/\">Play Graph</a><a href=\"" + BASE + "playdata/\">Play Data</a></div></div>";
        document.body.appendChild(g);
      }
      if (text) { document.getElementById("anBtn").innerHTML = ""; setMsg(text); return; }
      loadGis(function () {
        google.accounts.id.initialize({ client_id: CONFIG.CLIENT_ID, callback: onCredential, hd: CONFIG.DOMAIN, auto_select: true, cancel_on_tap_outside: false, use_fedcm_for_prompt: true });
        google.accounts.id.renderButton(document.getElementById("anBtn"), { theme: "outline", size: "large", text: "signin_with", shape: "pill" });
        google.accounts.id.prompt();
      });
    });
  }
  function unlock() { document.documentElement.classList.remove("an-lock"); var g = document.getElementById("anGate"); if (g) g.remove(); }

  function chip(a) {
    whenBody(function () {
      var c = document.createElement("div"); c.id = "anChip";
      c.innerHTML = "<span></span>" + (a.teacher ? "<a href=\"" + BASE + "teacher/\">Class progress</a>" : "") + "<a id=\"anOut\">Sign out</a>";
      c.firstChild.textContent = a.name || a.email;
      c.querySelector("#anOut").onclick = signOut;
      document.body.appendChild(c);
    });
  }
  function signInLink() {
    whenBody(function () {
      var c = document.createElement("div"); c.id = "anChip";
      c.innerHTML = "<span>Students: </span><a href=\"" + BASE + "\">Sign in to save progress</a>";
      document.body.appendChild(c);
    });
  }

  // ---- start ----
  var a = auth();
  window.AN = { enabled: true, user: a, api: api, signOut: signOut, base: BASE };
  if (!a) { if (isPlay) signInLink(); else showGate(); return; }
  chip(a);
  var pulled = false; try { pulled = ss.getItem(PULLED) === "1"; } catch (e) { }
  if (!pulled) {
    if (!isPlay) showGate("Loading your work…");
    pull().then(function (changed) { if (changed) location.reload(); else unlock(); })
      .catch(function () { unlock(); });        // offline: keep working; changes are sent later
  }
})();
