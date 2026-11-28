// Drag Equation, step 4: the moves the new rules allow, made with the mouse (switch on: localStorage an.de). node tools/de_tests/moves.js
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1400, height: 900 } }); let errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 150)));
  await pg.addInitScript(() => { try { localStorage.setItem('an.de', '1'); } catch (e) {} });
  await pg.route(/^https?:/, r => r.abort()); await pg.route(/auth\.js$/, r => r.fulfill({ body: '', contentType: 'text/javascript' }));
  const row = () => pg.evaluate(() => $("exRow").innerText.replace(/\s+/g, ' ').trim() + (BX ? ' [box ' + BX.nL + 'x' + BX.nT + ']' : '') + (EXP && EXP.ask ? ' [ask ' + EXP.ask.kind + ']' : ''));
  const ctr = async sel => { const h = await pg.$(sel); if (!h) return null; const r = await h.boundingBox(); return r && [r.x + r.width / 2, r.y + r.height / 2]; };
  const drag = async (a, t) => { const p = await ctr(a), q = typeof t === 'string' ? await ctr(t) : t; if (!p || !q) return 'missing ' + (!p ? a : t); await pg.mouse.move(p[0], p[1]); await pg.mouse.down(); for (let s = 1; s <= 12; s++) { await pg.mouse.move(p[0] + (q[0] - p[0]) * s / 12, p[1] + (q[1] - p[1]) * s / 12); await pg.waitForTimeout(25); } await pg.mouse.up(); await pg.waitForTimeout(1500); return 'ok'; };
  const start = async (t, m) => { await pg.goto('file://' + require('path').join(__dirname, '../..') + '/playsolve/index.html'); await pg.waitForTimeout(800); await pg.evaluate(t => { setMode0('create'); $("crIn").value = t; $("crAdd").click(); }, t); await pg.waitForTimeout(300); await pg.evaluate(m => setMode0(m), m || 'sequence'); await pg.waitForTimeout(700); return row(); };
  // 9: a product = 0: drag one factor onto the other
  console.log('9  ', await start('(x+2)(x-3)=0'), '| drag', await drag('#exRow .exT > .exG', '#exRow .exT > .exH'), '->', await row());
  // 7: the exponent of x^2 on a factoring rung (the level used to switch it off)
  await pg.goto('file://' + require('path').join(__dirname, '../..') + '/playsolve/index.html'); await pg.waitForTimeout(800);
  await pg.evaluate(() => { SOL.lvl = 63; setMode0('sequence'); solverGo(0, 'sequence'); }); await pg.waitForTimeout(700);
  console.log('7  ', await row(), '| exponent draggable:', await pg.evaluate(() => !!$("exRow").querySelector('.exExp')), '| goal', await pg.evaluate(() => EXP.goal + ' grq=' + EXP.grq + ' sq=' + EXP.sq));
  // 6: letters: drag the 3 in 3x + a = b across the =
  console.log('6a ', await start('3x+a=b'), '| handle:', await pg.evaluate(() => !!$("exRow").querySelector('.exCoA')), '| drag', await drag('#exRow .exCoA', '#exRow .exEq'), '->', await row());
  // 5: letters: a number times parentheses with a letter inside: the box
  console.log('5  ', await start('2(x+a)=b'), '| drag', await drag('#exRow .exT > .exM', '#exRow .exT > .exG'), '->', await row());
  // 13: x on both sides with letters: the smaller onto the larger
  console.log('13 ', await start('2ax+b=ax+c', 'demo'), '| Demo first step:', await pg.evaluate(() => { const s = eqNextStep(); return s && s.cap + ' ' + JSON.stringify(s.mv); }));
  console.log(errs); await b.close(); })();
