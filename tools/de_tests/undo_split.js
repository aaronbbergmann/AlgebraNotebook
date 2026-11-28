// Bug fix: undoing a ± split turns split mode off again (the Quadratic Formula button comes back). node tools/de_tests/undo_split.js
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch();
  for (const de of [false, true]) { const pg = await b.newPage({ viewport: { width: 1400, height: 900 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
    if (de) await pg.addInitScript(() => { try { localStorage.setItem('an.de', '1'); } catch (e) {} });
    await pg.route(/^https?:/, r => r.abort()); await pg.route(/auth\.js$/, r => r.fulfill({ body: '', contentType: 'text/javascript' }));
    await pg.goto('file://' + require('path').join(__dirname, '../..') + '/playsolve/index.html'); await pg.waitForTimeout(800);
    await pg.evaluate(() => { setMode0('create'); $("crIn").value = '(x+3)^2 = 16'; $("crAdd").click(); }); await pg.waitForTimeout(300); await pg.evaluate(() => setMode0('sequence')); await pg.waitForTimeout(600);
    const st = () => pg.evaluate(() => $("exRow").innerText.replace(/\s+/g, ' ').trim() + ' | zpq=' + EXP.zpq + ' zp=' + !!EXP.zp + ' QF button=' + !$("quBtn").hidden + ' EXP: ' + exSay(EXP.L) + ' = ' + exSay(EXP.R) + ' zpA ' + ($("zpA") ? $("zpA").innerText.replace(/\s+/g,' ') : ''));
    const log = [await st()];
    for (let k = 0; k < 4; k++) { const c = await pg.evaluate(() => { const s = eqNextStep(); if (!s) return 'none'; s.run(); return s.cap; }); await pg.waitForTimeout(1500); log.push(c + ' -> ' + await st()); if (/split/i.test(c)) break; }
    for (let k = 0; k < 3; k++) { const hb = await pg.evaluate(() => 'before: hist ' + hist.length + ' hidden ' + $("undo").hidden); log.push(hb); await pg.evaluate(() => $("undo").click()); await pg.waitForTimeout(600); log.push('Undo -> ' + await st() + ' | ' + await pg.evaluate(() => 'hist ' + hist.length + ' undo hidden ' + $("undo").hidden + ' disabled ' + $("undo").disabled)); }
    console.log(de ? 'switch on:' : 'switch off:', '\n  ' + log.join('\n  '), errs.slice(0, 1)); await pg.close(); }
  await b.close(); })();
