// Drag Equation, step 4 (decision 15): one answer box takes a quadratic's answers ("4, -1/2"). node tools/de_tests/one_box.js
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); 
  for (const de of [false, true]) { const pg = await b.newPage({ viewport: { width: 1400, height: 900 } });
    if (de) await pg.addInitScript(() => { try { localStorage.setItem('an.de', '1'); } catch (e) {} });
    await pg.route(/^https?:/, r => r.abort()); await pg.route(/auth\.js$/, r => r.fulfill({ body: '', contentType: 'text/javascript' }));
    for (const sep of [', ', ',']) for (const ex of ['3.4A', '3.1G']) {
      await pg.goto('file://' + require('path').join(__dirname, '../..') + '/a/index.html?id=P-' + ex + '&ex=q1'); await pg.waitForTimeout(900); await pg.evaluate(() => setMode0('solo')); await pg.waitForTimeout(700);
      const r = await pg.evaluate(() => (qdRoots(EXP.orig.L, EXP.orig.R) || []).map(v => exSay([{ k: 'c', n: v }]).replace(/−/g, '-').replace(/\s+/g, '')));
      const two = await pg.evaluate(() => !$("exSolo2").hidden);
      if (two) { await pg.fill('#exSoloIn', r[0]); await pg.fill('#exSoloIn2', r[1] || ''); } else await pg.fill('#exSoloIn', r.join(sep));
      await pg.click('#exSoloGo'); await pg.waitForTimeout(500);
      console.log(de ? 'on ' : 'off', ex, two ? 'two boxes' : 'one box  ', JSON.stringify(two ? r : r.join(sep)).padEnd(16), '->', await pg.evaluate(() => $("exMsg").textContent.slice(0, 70) + (locked ? ' [done]' : '')));
    } await pg.close(); }
  await b.close(); })();
