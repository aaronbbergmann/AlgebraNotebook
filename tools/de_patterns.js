// Drag Equation, step 3: every pattern in bank/play-solve.js makes problems that Play Solve classifies onto the pattern's own rung.
//   node tools/de_patterns.js [from] [to]      (rung numbers; "e0".."e17" for the expression levels)   -v also prints samples
const { chromium } = require('playwright'); const path = require('path');
const ROOT = 'file://' + path.join(__dirname, '..') + '/', A = process.argv.slice(2).filter(a => a[0] !== '-'), V = process.argv.includes('-v');
(async () => {
  const b = await chromium.launch(), pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort()); await pg.route(/auth\.js$/, r => r.fulfill({ body: '', contentType: 'text/javascript' }));
  await pg.goto(ROOT + 'playsolve/index.html'); await pg.waitForTimeout(900);
  const res = await pg.evaluate(([A, V]) => {
    const B = AN_BANK['play-solve'], out = [], N = 40; let bad = 0;
    const want = (k) => { if (!A.length) return true; const n = k[0] === 'e' ? 1000 + +k.slice(1) : +k, f = A[0][0] === 'e' ? 1000 + +A[0].slice(1) : +A[0], t = A[1] ? (A[1][0] === 'e' ? 1000 + +A[1].slice(1) : +A[1]) : f; return n >= f && n <= t; };
    const orig = (i, ex) => { const o = []; for (let s = 0; s < 4; s++) { try { if (ex) { EXP = { items: [], orig: [] }; SOL.lvl = EXLAD[i]; solverGo(0, 'sequence'); o.push(deText(EXP)); } else { SOL.lvl = i; solverGo(0, 'sequence'); o.push(EXP && !$("exBox").hidden ? deText(EXP) : deText(null, orig_rows())); } } catch (e) { o.push('ERR ' + e.message); } } return o; };
    window.orig_rows = () => orig;
    const check = (key, pat, target, ex) => {
      if (!pat) { out.push(key + '  (no pattern yet)'); return; }
      const got = {}, fails = [], samp = [];
      for (let s = 0; s < N; s++) {
        let t; try { t = dePattern(pat); } catch (e) { fails.push('pattern error: ' + e.message); break; }
        const r = deParse(t); if (s < 4) samp.push(t);
        let lv; if (r.error) { fails.push(t + ' -> ' + r.error); continue; }
        if (ex) lv = r.exp && !r.exp.eq ? r.lvl : 'not an expression';
        else if (r.rows) lv = r.rows.length === 1 ? ladderPane(r.rows[0]) : 'system'; else lv = r.lvl;
        got[lv] = (got[lv] || 0) + 1; if (lv !== target && fails.length < 3) fails.push(t + ' -> rung ' + lv);
      }
      const okN = got[target] || 0; if (okN < N) bad++;
      out.push(key + '  ' + (okN === N ? 'OK  ' : 'BAD ') + okN + '/' + N + (okN < N ? '  ' + JSON.stringify(got) + '\n      ' + fails.slice(0, 3).join('\n      ') : '') + (V || okN < N ? '\n      pattern: ' + samp.join(' | ') + '\n      old    : ' + orig(ex ? EXLAD.indexOf(target) : target, ex).join(' | ') : ''));
    };
    LADDER.forEach((r, i) => { if (want(String(i))) check(String(i).padStart(2) + ' ' + JSON.stringify(r).padEnd(30), B.ladder[i], i, false); });
    EXLAD.forEach((lv, i) => { if (want('e' + i)) check(('e' + i).padStart(3) + ' exGen(' + lv + ')'.padEnd(20), B.expr[i], lv, true); });
    out.push('\n' + bad + ' patterns not yet matching'); return out.join('\n');
  }, [A, V]);
  console.log(res); if (errs.length) console.log('page errors:', errs.slice(0, 3)); await b.close();
})();
