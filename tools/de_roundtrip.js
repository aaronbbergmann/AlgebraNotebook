// Drag Equation, step 3: every problem of every instance survives being written as a string and read back (deText, then deParse).
// For each instance in migration/drag-equation/before.json and each seed, the problem is made as the recorder makes it, written, read, and compared.
// It also lists the rule switches that differ between the problem as the level makes it and the problem as its string is read (the step 4 work).
//   node tools/de_roundtrip.js [filter]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const ROOT = 'file://' + path.join(__dirname, '..') + '/', FILTER = process.argv[2] || '';
const REC = JSON.parse(fs.readFileSync(path.join(__dirname, '../migration/drag-equation/before.json'), 'utf8'));
const INIT = fs.readFileSync(path.join(__dirname, 'de_record.js'), 'utf8').match(/const INIT = `([\s\S]*?)`;/)[1];
const FLAGS = ['zpq', 'grq', 'quq', 'sq', 'av', 'lit', 'dvq', 'qd', 'sf', 'quad', 'fac', 'grp', 'rad'];
(async () => {
  const b = await chromium.launch(), pg = await b.newPage({ viewport: { width: 1400, height: 900 } }); let errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 150)));
  await pg.addInitScript(INIT); await pg.clock.install(); await pg.route(/^https?:/, r => r.abort()); await pg.route(/auth\.js$/, r => r.fulfill({ body: '', contentType: 'text/javascript' }));
  let ok = 0, bad = 0, skip = 0; const flagDiff = {}, fails = [];
  for (const id of Object.keys(REC).filter(k => !FILTER || k.indexOf(FILTER) >= 0)) {
    const m = /^PS-rung-(\d+)$/.exec(id), e = /^PS-expr-(\d+)$/.exec(id), a = /^A-(.+)-q(\d+)$/.exec(id);
    for (const sd of [11, 22, 33]) {
      errs = [];
      await pg.goto(a ? ROOT + 'a/index.html?id=P-' + a[1] + '&ex=q' + a[2] : ROOT + 'playsolve/index.html'); await pg.clock.runFor(1200);
      const r = await pg.evaluate(([m, e, sd, FLAGS]) => {
        __seed(sd);
        if (m) { SOL.lvl = +m[1]; setMode0('demo'); solverGo(0, 'demo'); }
        else if (e) { setMode0('demo'); EXP = { items: [], orig: [] }; SOL.lvl = EXLAD[+e[1]]; solverGo(0, 'demo'); }
        else setMode0('demo');
        const canon = o => JSON.stringify(o, (k, v) => v && typeof v === 'object' && !Array.isArray(v) ? Object.keys(v).sort().reduce((z, kk) => (v[kk] !== undefined && !(kk === 'pa' && v[kk] === false) && kk !== 'vk' && (z[kk] = v[kk]), z), {}) : v);
        if (pq()) return { skip: 'word problem (step 6)' };
        const E = EXP && $("exBox") && !$("exBox").hidden ? EXP : null, rows = E ? null : orig;
        if (!E && !(rows && rows.length)) return { skip: 'no problem on screen' };
        const before = E ? canon(E.eq ? (E.orig.cmp ? E.orig.cmp : { L: E.orig.L, R: E.orig.R, rel: E.orig.rel || '=' }) : E.orig) : canon(rows), t = deText(E, rows), R = deParse(t);
        if (R.error) return { t, err: R.error };
        const X = R.exp, after = X ? canon(X.eq ? (X.orig.cmp ? X.orig.cmp : { L: X.orig.L, R: X.orig.R, rel: X.orig.rel || '=' }) : X.orig) : canon(R.rows);
        const fd = E && X ? FLAGS.filter(f => !!E[f] !== !!X[f]).map(f => f + ':' + (!!E[f] ? 'level' : 'string')) : [];
        return { t, same: before === after, before: before.slice(0, 300), after: after.slice(0, 300), engine: E ? 'main' : 'rows', engine2: X ? 'main' : 'rows', fd };
      }, [m, e, sd, FLAGS]);
      if (r.skip) { skip++; continue; }
      if (!r.err && r.engine !== r.engine2) { (flagDiff['engine ' + r.engine + ' -> ' + r.engine2 + ' (step 5)'] = flagDiff['engine ' + r.engine + ' -> ' + r.engine2 + ' (step 5)'] || new Set()).add(id); ok++; continue; }
      if (r.err || !r.same) { bad++; fails.push(id + ' seed ' + sd + ': "' + r.t + '" ' + (r.err ? 'ERROR ' + r.err : 'DIFF\n      before ' + r.before + '\n      after  ' + r.after)); }
      else ok++;
      (r.fd || []).forEach(f => { (flagDiff[f] = flagDiff[f] || new Set()).add(id); });
      if (errs.length) fails.push(id + ' seed ' + sd + ' page errors: ' + errs[0]);
    }
  }
  await b.close();
  fails.forEach(f => console.log(f));
  console.log('\nrule switches that differ (level vs string):'); Object.keys(flagDiff).sort().forEach(f => console.log('  ' + f + ': ' + [...flagDiff[f]].join(', ')));
  console.log('\n' + ok + ' round trips identical, ' + bad + ' not, ' + skip + ' skipped (word problems)');
  process.exit(bad ? 1 : 0);
})();
