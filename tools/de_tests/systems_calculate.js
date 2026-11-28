// Drag Equation, step 5b: Calculate inside a system: the Drag Equation asks each step's arithmetic. node tools/de_tests/systems_calculate.js
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1400, height: 900 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 200)));
  await pg.addInitScript(() => { try { localStorage.setItem('an.de', '1'); } catch (e) {} }); await pg.clock.install();
  await pg.route(/^https?:/, r => r.abort()); await pg.route(/auth\.js$/, r => r.fulfill({ body: '', contentType: 'text/javascript' }));
  await pg.goto('file://' + require('path').join(__dirname, '../..') + '/a/index.html?id=P-1.4C&ex=q1'); await pg.clock.runFor(1500);
  await pg.evaluate(() => setMode0('calculate')); await pg.clock.runFor(800);
  const log = [];
  for (let k = 0; k < 40; k++) {
    const st = await pg.evaluate(() => ({ de: !!DE_SYS, row: DE_SYS ? $("exRow").innerText.replace(/\s+/g, ' ').trim() : lines().join(' ; '), ask: EXP && EXP.ask && !$("ask").hidden ? $("askT").textContent : null, want: EXP && EXP.ask ? (EXP.ask.want ? exSay([EXP.ask.want]) : EXP.ask.b && EXP.ask.b.want ? exSay([EXP.ask.b.want]) : JSON.stringify(EXP.ask).slice(0, 200)) : null, locked }));
    if (st.locked && !st.de) { log.push('SOLVED ' + st.row); break; }
    if (st.de && st.ask) { const a = (st.want || '').replace(/−/g, '-').replace(/\s+/g, ''); log.push('  [DE] ask "' + st.ask + '" -> ' + a); await pg.fill('#askIn', a); await pg.press('#askIn', 'Enter'); await pg.clock.runFor(800); continue; }
    if (st.de) { const c = await pg.evaluate(() => { const s = eqNextStep(); if (!s) return 'no step'; s.run(); return s.cap; }); log.push('  [DE] ' + st.row + ' -> ' + c); await pg.clock.runFor(2500); continue; }
    const c = await pg.evaluate(() => { closeAsk(false); calc = null; const s = nextStep(); if (!s) return 'none'; if (s[0] === 'mul') mulEq(s[1], s[2], true); else if (s[0] === 'add') addEq(s[1], s[2], true); else if (s[0] === 'sub') substitute(s[1], s[2], s[3], s[1]); else return 'other ' + JSON.stringify(s); return JSON.stringify(s); });
    log.push('[sys] ' + st.row + ' -> ' + c); if (/none|other/.test(c)) break; await pg.clock.runFor(2000);
  }
  console.log(log.join('\n')); console.log(errs.slice(0, 3)); await b.close(); })();
