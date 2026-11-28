// Drag Equation, step 5b: systems hand each one-variable equation to the Drag Equation (switch on). node tools/de_tests/<this file>
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1400, height: 900 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 200)));
  await pg.addInitScript(() => { try { localStorage.setItem('an.de', '1'); } catch (e) {} }); await pg.clock.install();
  await pg.route(/^https?:/, r => r.abort()); await pg.route(/auth\.js$/, r => r.fulfill({ body: '', contentType: 'text/javascript' }));
  for (const url of ['a/index.html?id=P-1.4C&ex=q1', 'a/index.html?id=P-1.4D&ex=q1', 'a/index.html?id=P-RevT1&ex=q2-solutions']) {
    await pg.goto('file://' + require('path').join(__dirname, '../..') + '/' + url); await pg.clock.runFor(1500);
    await pg.evaluate(() => setMode0('demo')); await pg.clock.runFor(800); await pg.evaluate(() => $("dmBtn").click());
    const seq = []; let n = 0;
    for (; n < 600; n++) { await pg.clock.runFor(400); const t = await pg.evaluate(() => (DE_SYS ? '[DE] ' + $("exRow").innerText : '[sys] ' + lines().join(' ; ')).replace(/\s+/g, ' ').trim() + (locked && !DE_SYS ? ' [SOLVED]' : '') + (DM4.paused ? ' [paused]' : '')); if (t !== seq[seq.length - 1] && !(await pg.evaluate(() => busy))) seq.push(t);
      if (/\[paused\]/.test(t) && await pg.evaluate(() => /Resume/.test($("dmBtn").textContent))) await pg.evaluate(() => $("dmBtn").click());
      if (/SOLVED/.test(t)) break; }
    console.log(url, n < 600 ? 'finished' : 'DID NOT FINISH', '\n   ' + seq.slice(-9).join('\n   '));
  }
  console.log(errs.slice(0, 3)); await b.close(); })();
