// Drag Equation, step 5b: systems hand each one-variable equation to the Drag Equation (switch on). node tools/de_tests/<this file>
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1400, height: 900 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 200)));
  await pg.addInitScript(() => { try { localStorage.setItem('an.de', '1'); } catch (e) {} }); await pg.clock.install();
  await pg.route(/^https?:/, r => r.abort()); await pg.route(/auth\.js$/, r => r.fulfill({ body: '', contentType: 'text/javascript' }));
  for (const url of ['a/index.html?id=P-1.4C&ex=q1', 'a/index.html?id=P-1.4D&ex=q1']) {
    await pg.goto('file://' + require('path').join(__dirname, '../..') + '/' + url); await pg.clock.runFor(1500);
    await pg.evaluate(() => setMode0('sequence')); await pg.clock.runFor(800);
    const log = [];
    for (let k = 0; k < 60; k++) {
      const st = await pg.evaluate(() => ({ de: !!DE_SYS, ex: EXP && !$("exBox").hidden, row: EXP && !$("exBox").hidden ? $("exRow").innerText.replace(/\s+/g, ' ').trim() : lines().join(' ; '), note: $("exNote").textContent, vals: JSON.stringify(Object.keys(vals).map(k => k + '=' + vals[k].n + '/' + vals[k].d)), locked }));
      if (st.locked && !st.de) { log.push('SOLVED ' + st.vals); break; }
      if (st.ex) { const c = await pg.evaluate(() => { const s = eqNextStep(); if (!s) return 'no step'; s.run(); return s.cap; }); log.push('  [DE] ' + st.row + '  -> ' + c); await pg.clock.runFor(2500); continue; }
      const c = await pg.evaluate(() => { const s = nextStep(); if (!s) return 'none'; const t = s[0];
        if (t === 'mul') mulEq(s[1], s[2]); else if (t === 'add') addEq(s[1], s[2]); else if (t === 'sub') substitute(s[1], s[2], s[3], s[1]); else if (t === 'comb') combineK(s[1], s[2], s[3], s[2]); else if (t === 'const') constDrop(s[1], s[2]); else if (t === 'coef') coefDrop(s[1]); else if (t === 'calc') doCalc(s[1]); else if (t === 'simp') return 'simp (would be the Drag Equation)'; else return 'unknown ' + JSON.stringify(s);
        return JSON.stringify(s); });
      log.push('[sys] ' + st.row + '  -> ' + c + (st.note ? ' | ' + st.note : '')); if (c === 'none' || /unknown/.test(c)) break; await pg.clock.runFor(1800);
    }
    console.log(url + '\n  ' + log.join('\n  '));
  }
  console.log(errs.slice(0, 3)); await b.close(); })();
