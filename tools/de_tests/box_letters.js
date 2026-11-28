// Drag Equation, step 4 (decision 5): the box with letters, in Sequence and Calculate. node tools/de_tests/box_letters.js
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1400, height: 900 } }); let errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 150)));
  await pg.addInitScript(() => { try { localStorage.setItem('an.de', '1'); } catch (e) {} });
  await pg.route(/^https?:/, r => r.abort()); await pg.route(/auth\.js$/, r => r.fulfill({ body: '', contentType: 'text/javascript' }));
  const row = () => pg.evaluate(() => $("exRow").innerText.replace(/\s+/g, ' ').trim() + (BX ? ' [box ' + BX.nL + 'x' + BX.nT + ' cells ' + JSON.stringify(BX.cell) + ']' : '') + (EXP && EXP.ask ? ' [ask "' + $("askT").textContent + '"]' : '') + (locked ? ' [done]' : ''));
  const ctr = async sel => { const h = await pg.$(sel); if (!h) return null; const r = await h.boundingBox(); return r && [r.x + r.width / 2, r.y + r.height / 2]; };
  const drag = async (a, t) => { const p = await ctr(a), q = await ctr(t); if (!p || !q) return 'missing ' + (!p ? a : t); await pg.mouse.move(p[0], p[1]); await pg.mouse.down(); for (let s = 1; s <= 12; s++) { await pg.mouse.move(p[0] + (q[0] - p[0]) * s / 12, p[1] + (q[1] - p[1]) * s / 12); await pg.waitForTimeout(25); } await pg.mouse.up(); await pg.waitForTimeout(700); return 'ok'; };
  for (const m of ['sequence', 'calculate']) {
    await pg.goto('file://' + require('path').join(__dirname, '../..') + '/playsolve/index.html'); await pg.waitForTimeout(800);
    await pg.evaluate(() => { setMode0('create'); $("crIn").value = '2(x+a)=b'; $("crAdd").click(); }); await pg.waitForTimeout(300); await pg.evaluate(m => setMode0(m), m); await pg.waitForTimeout(700);
    console.log(m, await row()); console.log('  open box:', await drag('#exRow .exT > .exM', '#exRow .exT > .exG'), await row());
    console.log('  left  :', await drag('#exRow .bxChip[data-b="0"][data-k="0"]', '#distBox [data-slot="L0"]'));
    for (let k = 0; k < 2; k++) console.log('  top ' + k + ':', await drag('#exRow .bxChip[data-b="1"][data-k="' + k + '"]', '#distBox [data-slot="T' + k + '"]'));
    console.log('  set up:', await row());
    if (m === 'sequence') { for (let c = 0; c < 2; c++) { await pg.click('#distBox .bxCell[data-c="' + c + '"]'); await pg.waitForTimeout(400); } }
    else { for (const ans of ['2x', '2a']) { await pg.fill('#askIn', ans); await pg.press('#askIn', 'Enter'); await pg.waitForTimeout(500); console.log('  typed', ans, '->', await row(), await pg.evaluate(() => $("askErr").textContent)); } }
    await pg.waitForTimeout(2200); console.log('  end:', await row());
  }
  console.log(errs); await b.close(); })();
