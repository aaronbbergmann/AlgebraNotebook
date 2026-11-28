// Drag Equation, step 6: number expressions next to the variable, and word problems solved by the Drag Equation (switch on). node tools/de_tests/<this file>
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1400, height: 900 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 200)));
  await pg.addInitScript(() => { try { localStorage.setItem('an.de', '1'); } catch (e) {} }); await pg.clock.install();
  await pg.route(/^https?:/, r => r.abort()); await pg.route(/auth\.js$/, r => r.fulfill({ body: '', contentType: 'text/javascript' }));
  for (const [t, m] of [['21 = x(0 - 20)^2 + 37', 'demo'], ['28 = x(10 - 2)(10 - 18) + 4', 'demo'], ['21 = x(0 - 20)^2 + 37', 'calculate'], ['0 = x(30 - 10)(30 - 50)', 'sequence']]) {
    await pg.goto('file://' + require('path').join(__dirname, '../..') + '/playsolve/index.html'); await pg.clock.runFor(1200);
    const st0 = await pg.evaluate(([t, m]) => { const r = deParse(t, { main: true }); if (r.error) return 'ERR ' + r.error; EXP = r.exp; setMode0(m); exBegin(); return deText(EXP) + ' | n=' + JSON.stringify(EXP.L.concat(EXP.R).filter(u => u.ce).map(u => u.n)); }, [t, m]); await pg.clock.runFor(500);
    const log = [st0];
    if (m === 'demo') { await pg.evaluate(() => $("dmBtn").click()); for (let i = 0; i < 150; i++) { await pg.clock.runFor(400); const r = await pg.evaluate(() => $("exRow").innerText.replace(/\s+/g, ' ').trim() + (locked ? ' [done]' : '')); if (r !== log[log.length - 1] && !(await pg.evaluate(() => busy))) log.push(r); if (/done/.test(r)) break; } }
    else for (let k = 0; k < 12; k++) { const s = await pg.evaluate(() => ({ row: $("exRow").innerText.replace(/\s+/g, ' ').trim(), ask: EXP.ask && !$("ask").hidden ? $("askT").textContent : null, want: EXP.ask && EXP.ask.want ? exSay([EXP.ask.want]) : null, locked })); if (s.locked) { log.push('DONE ' + s.row); break; }
      if (s.ask) { log.push('ask "' + s.ask + '" -> ' + s.want); await pg.fill('#askIn', (s.want || '').replace(/−/g, '-').replace(/\s/g, '')); await pg.press('#askIn', 'Enter'); await pg.clock.runFor(900); continue; }
      const c = await pg.evaluate(() => { const el = $("exRow").querySelector('.ceF'); if (el) { el.click(); return 'click ' + el.textContent; } const s = eqNextStep(); if (!s) return 'no step'; s.run(); return s.cap; }); log.push(s.row + ' -> ' + c); await pg.clock.runFor(1800); }
    console.log(m, '\n   ' + log.join('\n   '));
  }
  console.log(errs.slice(0, 3)); await b.close(); })();
