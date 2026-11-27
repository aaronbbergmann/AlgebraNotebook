// Migration check, activities half (Question Bank migration, step 7): every preset assignment P-<activity> must match its activity as it was
// exported in step 1 (migration/backup-2026-11-26/activities.json): the same abbreviation and title, the same exercises in the same order
// (each preset question runs that exercise), the same modes, and the same levels (percent per mode and the number of Write rounds).
// Reviews (RevT1, RevQ2): the same items in the same order.
//   node tools/check_presets.js        prints each difference; exits 1 if there is any
// Needs Playwright (preinstalled in the cloud session).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const EXP = JSON.parse(fs.readFileSync(path.join(ROOT, 'migration/backup-2026-11-26/activities.json'), 'utf8'));
(async () => {
  const b = await chromium.launch(), pg = await b.newPage(), errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort()); await pg.route(/auth\.js$/, r => r.fulfill({ body: '', contentType: 'text/javascript' }));
  await pg.goto('file://' + path.join(ROOT, 'a', 'index.html')); await pg.waitForTimeout(800);
  const diffs = await pg.evaluate((EXP) => {
    const out = [], add = (ab, t) => out.push(ab + ": " + t);
    const place = (base, k) => base === '1.4D' ? { act: '1.4D', lesson: k === 's' ? 2 : +k, subx: k === 's' } : { act: base, lesson: +k, subx: false };
    EXP.views.forEach(v => {
      if (!v.exercises.length) return;
      const ab = v.abbreviation, rec = presetRec(ab); if (!rec) { add(ab, "no preset"); return; }
      const title = (ACTS.filter(x => x[0] === ab)[0] || [])[1]; if (title !== v.title) add(ab, "title " + JSON.stringify(title) + " is not " + JSON.stringify(v.title));
      const its = asgItems(rec); if (its.length !== v.exercises.length) add(ab, its.length + " questions, the activity has " + v.exercises.length);
      v.exercises.forEach((e, i) => {
        const it = its[i], want = place(VW[ab] ? VW[ab].base : v.section, e.key); if (!it) return;
        if (it.act !== want.act || it.lesson !== want.lesson || !!it.subx !== want.subx) { add(ab, "question " + (i + 1) + " runs " + it.act + "/" + it.lesson + (it.subx ? " sub" : "") + ", the activity's exercise " + e.key + " (" + e.name + ") is " + want.act + "/" + want.lesson + (want.subx ? " sub" : "")); return; }
        const B = BUILT[it.act], modes = ((B.modesFor ? B.modesFor(it.lesson) : B.modes) || []).filter(m => m !== 'create'), em = (e.modes || []).filter(m => m !== 'create');
        if (it.act !== '1.4D' && JSON.stringify(modes) !== JSON.stringify(em)) add(ab, e.name + ": modes " + modes.join(",") + " are not " + em.join(","));
        // the levels the activity page itself uses (levelsNow, for that activity), and, outside 1.4, the export too (the export holds the old
        // combined 1.4 levels, from before 1.4 was split into four activities; the 1.4 pages have used their own since)
        const L = exLevels(it).map(l => [l[0], l[1], l[3] || 1].join("/"));
        const kk = it.act === '1.4D' ? (it.subx ? 4 : it.lesson === 4 ? 'g' : it.lesson) : it.lesson, sv = [view, act, rev]; view = VW[ab] ? ab : null; act = it.act; rev = null;
        const PL = levelsNow().filter(l => String(l[0]) === String(kk)).map(l => [l[1], l[2], l[4] || 1].join("/")); view = sv[0]; act = sv[1]; rev = sv[2];
        if (JSON.stringify(L) !== JSON.stringify(PL)) add(ab, e.name + ": levels " + L.join(" ") + " are not the activity page's " + PL.join(" "));
        const EL = (e.levels || []).map(l => [l.mode, l.percent, l.round || 1].join("/"));
        if (it.act !== '1.4D' && EL.length && JSON.stringify(L) !== JSON.stringify(EL)) add(ab, e.name + ": levels " + L.join(" ") + " are not the export's " + EL.join(" "));
      });
    });
    (EXP.reviews || []).forEach(r => {
      const rec = presetRec(r.abbreviation); if (!rec) { add(r.abbreviation, "no preset"); return; }
      const its = asgItems(rec); if (its.length !== r.items.length) add(r.abbreviation, its.length + " questions, the review has " + r.items.length);
      r.items.forEach((o, i) => { const it = its[i]; if (it && (it.act !== o.section || it.lesson !== o.exercise || !!it.subx !== !!o.subx)) add(r.abbreviation, "question " + (i + 1) + " (" + o.q + ") runs " + it.act + "/" + it.lesson); });
    });
    return out;
  }, EXP);
  await b.close();
  if (errs.length) diffs.push("page errors: " + errs.slice(0, 3).join(" | "));
  diffs.forEach(d => console.log(d));
  console.log(diffs.length ? diffs.length + " differences" : "Every preset matches its activity (" + EXP.views.filter(v => v.exercises.length).length + " activities, " + (EXP.reviews || []).length + " reviews).");
  process.exit(diffs.length ? 1 : 0);
})();
