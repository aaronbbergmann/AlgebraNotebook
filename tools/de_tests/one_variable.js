// Drag Equation, step 5a: 1.4 One Variable on the main solver (switch on); moving to Substitution and back. node tools/de_tests/one_variable.js
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1400, height: 900 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 160)));
  await pg.addInitScript(() => { try { localStorage.setItem('an.de', '1'); } catch (e) {} }); await pg.clock.install();
  await pg.route(/^https?:/, r => r.abort()); await pg.route(/auth\.js$/, r => r.fulfill({ body: '', contentType: 'text/javascript' }));
  const st = () => pg.evaluate(() => ({ q: revI, act, lesson, subx, eng: EXP && !$("exBox").hidden ? 'main' : !$("wsEl").hidden && $("wsEl").style.display !== 'none' ? 'rows' : '?', row: (EXP && !$("exBox").hidden ? $("exRow") : $("wsEl")).innerText.replace(/\s+/g, ' ').trim().slice(0, 60), title: $("stT").textContent, modes: [...$("modeSel").options].map(o => o.value).join(',') }));
  await pg.goto('file://' + require('path').join(__dirname, '../..') + '/a/index.html?id=P-1.4B&ex=q1'); await pg.clock.runFor(1500);
  await pg.evaluate(() => setMode0('demo')); await pg.clock.runFor(800); console.log('Q1 demo   ', JSON.stringify(await st()));
  await pg.evaluate(() => $("dmBtn").click()); const seq = []; for (let i = 0; i < 100; i++) { await pg.clock.runFor(400); const t = await pg.evaluate(() => $("exRow").innerText.replace(/\s+/g, ' ').trim() + (locked ? ' [done]' : '')); if (t !== seq[seq.length - 1]) seq.push(t); if (/done/.test(t)) break; } console.log('   ', seq.join(' => '));
  await pg.evaluate(() => setMode0('sequence')); await pg.clock.runFor(800); console.log('Q1 seq    ', JSON.stringify(await st()));
  await pg.evaluate(() => { const s = $("lesson"); s.value = '1'; s.dispatchEvent(new Event('change', { bubbles: true })); }); await pg.clock.runFor(1200); console.log('-> Q2     ', JSON.stringify(await st()));
  await pg.evaluate(() => { const s = $("lesson"); s.value = '0'; s.dispatchEvent(new Event('change', { bubbles: true })); }); await pg.clock.runFor(1200); console.log('-> Q1     ', JSON.stringify(await st()));
  await pg.evaluate(() => setMode0('solo')); await pg.clock.runFor(800); console.log('Q1 write  ', JSON.stringify(await st()), await pg.evaluate(() => $("exSoloGo").textContent + ' boxes ' + [$("exSolo"), $("exSolo2")].filter(e => !e.hidden).length));
  console.log(errs.slice(0, 3)); await b.close(); })();
