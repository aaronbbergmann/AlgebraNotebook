// Drag Equation, step 3: every pattern in bank/play-solve.js makes the same kinds of problems as the old generator of its rung.
// For each rung, 60 problems from the pattern and 60 from the old generator are read by the Drag Equation and sorted by Play Solve's own classifier
// (ladderEq / ladderPane / exLevel). The classifier cannot tell every rung apart (x^2 = 49 sorts as completing the square), so the test is that the two
// spreads match: no kind the old generator never makes, and the shares within 0.25 of each other (total variation distance).
//   node tools/de_patterns.js [from] [to] [-v]      (rung numbers; "e0".."e17" for the expression levels)
const { chromium } = require('playwright'); const path = require('path');
const ROOT = 'file://' + path.join(__dirname, '..') + '/', A = process.argv.slice(2).filter(a => a[0] !== '-'), V = process.argv.includes('-v');
(async () => {
  const b = await chromium.launch(), pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort()); await pg.route(/auth\.js$/, r => r.fulfill({ body: '', contentType: 'text/javascript' }));
  await pg.goto(ROOT + 'playsolve/index.html'); await pg.waitForTimeout(900);
  const res = await pg.evaluate(([A, V]) => {
    const B = AN_BANK['play-solve'], out = [], N = 60; let bad = 0;
    const key = k => k[0] === 'e' ? 1000 + +k.slice(1) : +k;
    const want = k => !A.length || (key(k) >= key(A[0]) && key(k) <= key(A[1] || A[0]));
    const kind = (t, ex) => { const r = deParse(t); if (r.error) return 'unreadable'; if (ex) return r.exp && !r.exp.eq ? 'e' + r.lvl : 'not an expression'; if (r.rows) return r.rows.length === 1 ? 'r' + ladderPane(r.rows[0]) : 'system'; return 'r' + r.lvl; };
    const oldOne = (i, ex) => { if (ex) { EXP = { items: [], orig: [] }; SOL.lvl = EXLAD[i]; solverGo(0, 'sequence'); return deText(EXP); } SOL.lvl = i; solverGo(0, 'sequence'); return EXP && !$("exBox").hidden ? deText(EXP) : deText(null, orig); };
    const spread = (f) => { const d = {}, s = []; for (let k = 0; k < N; k++) { let t; try { t = f(); } catch (e) { t = 'ERR ' + e.message; } if (k < 4) s.push(t); const c = /^ERR/.test(t) ? 'error' : kind(t); d[c] = (d[c] || 0) + 1; } return { d, s }; };
    const show = d => Object.keys(d).sort().map(k => k + ':' + d[k]).join(' ');
    const check = (label, pat, i, ex) => {
      if (!pat) { out.push(label + '  (no pattern yet)'); bad++; return; }
      const kindEx = (t) => kind(t, ex);
      const P = (() => { const d = {}, s = []; for (let k = 0; k < N; k++) { let t; try { t = dePattern(pat); } catch (e) { t = 'ERR ' + e.message; } if (k < 4) s.push(t); const c = /^ERR/.test(t) ? 'error' : kindEx(t); d[c] = (d[c] || 0) + 1; } return { d, s }; })();
      const O = (() => { const d = {}, s = []; for (let k = 0; k < N; k++) { let t; try { t = oldOne(i, ex); } catch (e) { t = 'ERR ' + e.message; } if (k < 4) s.push(t); const c = /^ERR/.test(t) ? 'error' : kindEx(t); d[c] = (d[c] || 0) + 1; } return { d, s }; })();
      const ks = [...new Set(Object.keys(P.d).concat(Object.keys(O.d)))], tv = ks.reduce((z, k) => z + Math.abs((P.d[k] || 0) - (O.d[k] || 0)), 0) / (2 * N);
      const novel = Object.keys(P.d).filter(k => !O.d[k]), broken = (P.d.unreadable || 0) + (P.d.error || 0);
      const ok = !novel.length && tv <= 0.25 && !broken; if (!ok) bad++;
      out.push(label + '  ' + (ok ? 'OK ' : 'BAD') + '  distance ' + tv.toFixed(2) + (novel.length ? '  new kinds: ' + novel.join(',') : '') + (broken ? '  unreadable: ' + broken : '') +
        (V || !ok ? '\n      pattern ' + show(P.d) + '   | ' + P.s.join(' | ') + '\n      old     ' + show(O.d) + '   | ' + O.s.join(' | ') : ''));
    };
    LADDER.forEach((r, i) => { if (want(String(i))) check(String(i).padStart(2) + ' ' + JSON.stringify(r).padEnd(30), B.ladder[i], i, false); });
    EXLAD.forEach((lv, i) => { if (want('e' + i)) check(('e' + i).padStart(3) + ' exGen(' + lv + ')'.padEnd(20), B.expr[i], i, true); });
    out.push('\n' + bad + ' patterns not matching their old generator'); return out.join('\n');
  }, [A, V]);
  console.log(res); if (errs.length) console.log('page errors:', errs.slice(0, 3)); await b.close();
})();
