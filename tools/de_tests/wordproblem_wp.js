// Drag Equation, step 6: number expressions next to the variable, and word problems solved by the Drag Equation (switch on). node tools/de_tests/<this file>
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1400, height: 900 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 200)));
  await pg.addInitScript(() => { try { localStorage.setItem('an.de', '1'); } catch (e) {} }); await pg.clock.install();
  await pg.route(/^https?:/, r => r.abort()); await pg.route(/auth\.js$/, r => r.fulfill({ body: '', contentType: 'text/javascript' }));
  for (const [url, m] of [['a/index.html?id=P-2.4A&ex=q1', 'calculate']]) {
    await pg.goto('file://' + require('path').join(__dirname, '../..') + '/' + url); await pg.clock.runFor(1500); await pg.evaluate(m => setMode0(m), m); await pg.clock.runFor(900);
    const log = [];
    for (let k = 0; k < 40; k++) {
      const s = await pg.evaluate(() => ({ de: !!DE_WP, row: DE_WP ? $("exRow").innerText.replace(/\s+/g, ' ').trim() : '', st: !DE_WP && m3Step() ? m3Step().id + ':' + m3Step().type : null, ask: EXP && EXP.ask ? $("askT").textContent : null, want: EXP && EXP.ask ? (EXP.ask.want ? exSay([EXP.ask.want]) : EXP.ask.b && EXP.ask.b.want ? exSay([EXP.ask.b.want]) : null) : null }));
      if (s.de && s.ask) { log.push('  [DE] ask "' + s.ask + '" -> ' + s.want); await pg.evaluate(v => { const el = $("askIn"); el.value = v; el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); }, (s.want || '').split('\u2212').join('-').replace(/\s/g, '')); await pg.clock.runFor(900); continue; }
      if (s.de) { const c = await pg.evaluate(() => { const x = eqNextStep(); if (!x) return 'no step'; x.run(); return x.cap; }); log.push('  [DE] ' + s.row + ' -> ' + c); await pg.clock.runFor(2500); continue; }
      if (!s.st) { log.push('word problem finished its steps'); break; }
      if (/vsub|vfrm/.test(s.st) && !/ans/.test(s.st) && (s.st.indexOf('frm') !== 0 || k < 2)) { await pg.evaluate(() => m3Accept(m3Step(), '')); log.push('[wp] ' + s.st + ' filled'); await pg.clock.runFor(600); continue; }
      log.push('[wp] next step: ' + s.st + ' | Show work done: ' + await pg.evaluate(() => Object.keys((QZ.ww && QZ.ww.done) || {}).join(','))); break;
    }
    console.log(url, m, '\n  ' + log.join('\n  '));
  }
  console.log(errs.slice(0, 3)); await b.close(); })();
