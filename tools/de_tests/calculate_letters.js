// Drag Equation, step 4 (decision 14): Calculate with letters asks one term at a time. node tools/de_tests/calculate_letters.js
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1400, height: 900 } }); let errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 150)));
  await pg.addInitScript(() => { try { localStorage.setItem('an.de', '1'); } catch (e) {} });
  await pg.route(/^https?:/, r => r.abort()); await pg.route(/auth\.js$/, r => r.fulfill({ body: '', contentType: 'text/javascript' }));
  for (const t of ['ax+b=c', '3x+a=b', '2(x+a)=b', 'ax+bx=c', 'x/a+b=c']) {
    await pg.goto('file://' + require('path').join(__dirname, '../..') + '/playsolve/index.html'); await pg.waitForTimeout(800);
    await pg.evaluate(t => { setMode0('create'); $("crIn").value = t; $("crAdd").click(); }, t); await pg.waitForTimeout(300); await pg.evaluate(() => setMode0('calculate')); await pg.waitForTimeout(700);
    const log = [];
    for (let k = 0; k < 25; k++) {
      const st = await pg.evaluate(() => ({ row: $("exRow").innerText.replace(/\s+/g, ' ').trim(), ask: EXP.ask && !$("ask").hidden ? $("askT").textContent : null, kind: EXP.ask && EXP.ask.kind, want: EXP.ask && EXP.ask.want ? exSay([EXP.ask.want]) : null, locked, box: !!BX }));
      if (st.locked) { log.push('DONE ' + st.row); break; }
      if (st.ask) { const ans = st.kind === 'mulq' ? '(whole equation asked)' : (st.want || '').replace(/−/g, '-').replace(/\s+/g, ''); log.push('ask "' + st.ask + '" -> ' + ans); if (st.kind === 'mulq') break; await pg.fill('#askIn', ans); await pg.press('#askIn', 'Enter'); await pg.waitForTimeout(500); const e = await pg.evaluate(() => $("askErr").textContent); if (e) { log.push('  !! ' + e); break; } continue; }
      const r = await pg.evaluate(() => { const s = eqNextStep(); if (!s) return 'no step'; s.run(); return s.cap; }); log.push(r); if (r === 'no step') break; await pg.waitForTimeout(1600);
    }
    console.log(t + '\n   ' + log.join('\n   '));
  }
  console.log(errs); await b.close(); })();
