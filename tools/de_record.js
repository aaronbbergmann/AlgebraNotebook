// Drag Equation, step 1: the record of every equation as it is now. For each instance (a Play Solve rung or expression level, an exercise question)
// and each seed: the problem, every settled state of its Demo, and the moves offered (elements that take a click or a drag) at each state.
//   node tools/de_record.js migration/drag-equation/before.json [filter]   (filter: part of an instance id, such as PS-rung-1 or A-1.4C)
const { chromium } = require('playwright'); const fs = require('fs');
const OUT = process.argv[2] || 'record.json', FILTER = process.argv[3] || '';
const INIT = `(() => { let s = 1; window.__seed = n => { s = n >>> 0 || 1; }; Math.random = () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return (s >>> 0) / 4294967296; };
  const ae = EventTarget.prototype.addEventListener; EventTarget.prototype.addEventListener = function (t, f, o) { try { if (this.nodeType === 1 && (t === 'pointerdown' || t === 'click')) this.dataset.evt = (this.dataset.evt || '') + t[0]; } catch (e) {} return ae.call(this, t, f, o); }; })();`;
const SEEDS = [11, 22, 33];
const ROOT = 'file://' + require('path').join(__dirname, '..') + '/';
(async () => {
  const b = await chromium.launch(), out = {};
  // the instances: Play Solve rungs and expression levels, then the exercises (as assignments)
  const pg0 = await b.newPage(); await pg0.route(/^https?:/, r => r.abort()); await pg0.route(/auth\.js$/, r => r.fulfill({ body: '', contentType: 'text/javascript' }));
  await pg0.goto(ROOT + 'playsolve/index.html'); await pg0.waitForTimeout(800);
  const meta = await pg0.evaluate(() => ({ rungs: LADDER.map(r => JSON.stringify(r)), exlad: EXLAD.slice() }));
  await pg0.goto(ROOT + 'a/index.html?id=P-RevT1'); await pg0.waitForTimeout(500);
  const asg = await pg0.evaluate(() => ['1.4B', '1.4C', '1.4D', '2.4A', '2.4B', '3.1A', '3.1B', '3.1C', '3.1D', '3.1E', '3.1F', '3.1G', '3.3A', '3.3B', '3.4A', '3.4B', 'RevT1'].map(ab => ({ ab, its: asgItems(presetRec(ab)).map(it => ({ q: it.q, qid: it.qid, act: it.act, lesson: it.lesson, subx: it.subx })) })));
  await pg0.close();
  const inst = [];
  meta.rungs.forEach((r, i) => inst.push({ id: 'PS-rung-' + String(i).padStart(2, '0'), kind: 'rung', i, spec: r }));
  meta.exlad.forEach((lv, i) => inst.push({ id: 'PS-expr-' + String(i).padStart(2, '0'), kind: 'expr', lv, spec: 'exGen(' + lv + ')' }));
  asg.forEach(a => a.its.forEach((it, i) => inst.push({ id: 'A-' + a.ab + '-q' + (i + 1), kind: 'asg', ab: a.ab, n: i, spec: it.qid + ' (' + it.act + '/' + it.lesson + (it.subx ? ' sub' : '') + ')' })));
  const todo = inst.filter(x => !FILTER || x.id.indexOf(FILTER) >= 0);
  const pg = await b.newPage({ viewport: { width: 1400, height: 900 } }); let errs = []; pg.on('pageerror', e => errs.push(e.message.slice(0, 160)));
  await pg.addInitScript(INIT); await pg.clock.install();
  await pg.route(/^https?:/, r => r.abort()); await pg.route(/auth\.js$/, r => r.fulfill({ body: '', contentType: 'text/javascript' }));
  const run = async ms => { try { await pg.clock.runFor(ms); } catch (e) { errs.push('timer: ' + String(e.message).split('\n')[0].slice(0, 160)); } };
  const snap = () => pg.evaluate(() => {
    const vis = e => e && !e.hidden && e.offsetParent !== null ? e : null;
    const areas = ['exBox', 'wsEl', 'sysEl', 'pg'].map(id => vis($(id))).filter(Boolean);
    const area = areas[0], tx = a => a.innerText;
    const txt = areas.slice(0, 2).map(a => tx(a).replace(/\s+/g, ' ').trim()).join(' | ').slice(0, 2500);
    const mv = area ? [...area.querySelectorAll('[data-evt]')].filter(e => e.offsetParent !== null).map(e => (e.textContent.replace(/\s+/g, '').slice(0, 24) || '·') + ':' + e.dataset.evt).sort().join(' ') : '';
    const ask = (typeof EXP !== 'undefined' && EXP && EXP.ask ? ' [ask ' + EXP.ask.kind + ']' : '') + (vis($('ask')) ? ' [askbox ' + $('askT').innerText.replace(/\s+/g, ' ').slice(0, 60) + ']' : '');
    return { t: txt + ask + (locked ? ' [done]' : ''), mv, settled: (!busy || pq()) && !(typeof BX !== 'undefined' && BX && BX.anim) };
  });
  for (const x of todo) {
    out[x.id] = { spec: x.spec, runs: [] };
    for (const sd of SEEDS) {
      errs = [];
      const url = x.kind === 'asg' ? ROOT + 'a/index.html?id=P-' + x.ab + '&ex=q' + (x.n + 1) : ROOT + 'playsolve/index.html';
      await pg.goto(url); await run(1200);
      try {
        await pg.evaluate(([x, sd]) => {
          __seed(sd);
          if (x.kind === 'rung') { SOL.lvl = x.i; setMode0('demo'); solverGo(0, 'demo'); }
          else if (x.kind === 'expr') { setMode0('demo'); EXP = { items: [], orig: [] }; SOL.lvl = x.lv; solverGo(0, 'demo'); }
          else { if (typeof revGo === 'function' && revI !== x.n) { const s = $("lesson"); s.value = String(x.n); s.dispatchEvent(new Event('change', { bubbles: true })); } setMode0('demo'); }
        }, [x, sd]);
      } catch (e) { errs.push('start: ' + e.message.slice(0, 160)); }
      await run(800);
      const first = await snap();
      await pg.evaluate(() => { const d = $("dmBtn"); if (d && d.offsetParent) d.click(); else { const p = $("pgDemo"); if (p && p.offsetParent) p.click(); } });
      const seq = [first]; let n = 0;
      for (; n < 400; n++) { await run(400); if (await pg.evaluate(() => typeof DM4 !== 'undefined' && DM4.run && DM4.paused && !busy && $('dmBtn').offsetParent && /Resume/.test($('dmBtn').textContent))) { seq.push({ t: '[the Demo paused itself; Resume pressed]', mv: '' }); await pg.evaluate(() => $('dmBtn').click()); continue; } const s = await snap(); if (s.settled && seq[seq.length - 1].t !== s.t) seq.push(s); if (await pg.evaluate(() => locked || (typeof QZ !== 'undefined' && QZ && QZ.step >= 4))) { await run(400); const z = await snap(); if (seq[seq.length - 1].t !== z.t) seq.push(z); break; } }
      out[x.id].runs.push({ seed: sd, problem: first.t, states: seq.map(s => s.t), moves: seq.map(s => s.mv), finished: n < 400, errors: [...new Set(errs)] });
    }
    const r0 = out[x.id].runs[0]; process.stdout.write(x.id + ' ' + r0.states.length + ' states' + (out[x.id].runs.every(r => r.finished) ? '' : ' UNFINISHED') + (out[x.id].runs.some(r => r.errors.length) ? ' ERR' : '') + ' | ' + r0.problem.slice(0, 50) + '\n');
  }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1)); await b.close();
})();
