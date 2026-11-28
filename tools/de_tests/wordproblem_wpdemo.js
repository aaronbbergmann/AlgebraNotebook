// Drag Equation, step 6: number expressions next to the variable, and word problems solved by the Drag Equation (switch on). node tools/de_tests/<this file>
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1400, height: 900 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 200)));
  await pg.addInitScript(() => { try { localStorage.setItem('an.de', '1'); } catch (e) {} }); await pg.clock.install();
  await pg.route(/^https?:/, r => r.abort()); await pg.route(/auth\.js$/, r => r.fulfill({ body: '', contentType: 'text/javascript' }));
  for (const url of ['a/index.html?id=P-2.4A&ex=q1', 'a/index.html?id=P-2.4A&ex=q2', 'a/index.html?id=P-3.1C&ex=q1', 'a/index.html?id=P-3.1C&ex=q5']) {
    await pg.goto('file://' + require('path').join(__dirname, '../..') + '/' + url); await pg.clock.runFor(1500); await pg.evaluate(() => setMode0('demo')); await pg.clock.runFor(900);
    await pg.evaluate(() => $("pgDemo").click());
    const seq = []; let n = 0;
    for (; n < 500; n++) { await pg.clock.runFor(400); const t = await pg.evaluate(() => DE_WP ? '[DE] ' + $("exRow").innerText.replace(/\s+/g, ' ') : '[wp] ' + (m3Step() ? m3Step().id : 'end') + (QZ.step >= 4 ? ' FINISHED' : '')); if (t !== seq[seq.length - 1]) seq.push(t); if (/FINISHED/.test(t)) break; }
    console.log(url, n < 500 ? 'ok' : 'DID NOT FINISH', '\n   ' + seq.join(' | ').slice(0, 600));
  }
  console.log(errs.slice(0, 3)); await b.close(); })();
