// Drag Equation, step 7b: each exercise's pattern string (its bank file's `pattern`) makes the same kinds of problems as its old generator.
// 80 problems from each, written as strings with every number blanked (#): the two spreads of shapes must match (no shape the generator never
// makes; total variation distance at most 0.3), and every pattern problem must be readable by the Drag Equation.
//   node tools/de_bankpatterns.js [id] [-v]
const { chromium } = require('playwright'); const path = require('path');
const ROOT = 'file://' + path.join(__dirname, '..') + '/', A = process.argv.slice(2).filter(a => a[0] !== '-'), V = process.argv.includes('-v');
const IDS = ['1.4B-one-variable', '2.4A-3step-equations', '3.1A-4step-equations', '3.1B-square-roots-simplify', '2.4A-box-method', '2.4B-distributing', '2.4A-square-roots', '1.4C-2x2-systems', '1.4D-3x3-systems', '1.4B-substitution'];
(async () => {
  const b = await chromium.launch(), pg = await b.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort()); await pg.route(/auth\.js$/, r => r.fulfill({ body: '', contentType: 'text/javascript' }));
  await pg.goto(ROOT + 'a/index.html?id=P-1.4C'); await pg.waitForTimeout(900);
  const res = await pg.evaluate(([IDS, V]) => {
    const N = 80, out = []; let bad = 0;
    const X = q => ({ k: 'x', v: 'x', n: mk(q) }), C = q => ({ k: 'c', n: mk(q) });
    const asText = (id, g) => {
      if (Array.isArray(g) && g.length && g[0].ks) return deText(null, g);                       // rows (one variable, systems)
      if (id === '3.1A-4step-equations') return deText({ eq: true, orig: { L: [{ k: 'g', m: mk(g.a), items: [X(1), C(g.b)] }, C(g.c)], R: [X(g.d), C(g.e)], rel: '=' } });
      if (Array.isArray(g)) return deText({ orig: g });                                            // an expression
      return deText({ eq: true, orig: { L: g.L, R: g.R, rel: '=' } });
    };
    const sig = t => String(t).replace(/\s*;.*$/, '').replace(/\d+(\.\d+)?/g, '#').replace(/\s+/g, '');
    for (const id of IDS) {
      const d = AN_BANK[id]; if (!d) { out.push(id + '  missing'); continue; }
      if (!d.pattern) { out.push(id.padEnd(28) + ' (no pattern yet)'); bad++; continue; }
      const G = {}, P = {}, gs = [], ps = []; let unread = 0;
      for (let k = 0; k < N; k++) {
        let t; try { const sv = mode; t = asText(id, id === '1.4C-2x2-systems' ? bankQ(id).generate(0, 0) : bankQ(id).generate(0)); } catch (e) { t = 'ERR ' + e.message; }
        G[sig(t)] = (G[sig(t)] || 0) + 1; if (k < 3) gs.push(t);
        let u; try { u = dePattern(d.pattern); } catch (e) { u = 'ERR ' + e.message; }
        const r = /^ERR/.test(u) ? { error: u } : deParse(u, /,/.test(u) ? null : { main: true }); if (r.error) unread++;
        P[sig(u)] = (P[sig(u)] || 0) + 1; if (k < 3) ps.push(u + (r.error ? ' !! ' + r.error : ''));
      }
      const ks = [...new Set(Object.keys(G).concat(Object.keys(P)))], tv = ks.reduce((z, k) => z + Math.abs((G[k] || 0) - (P[k] || 0)), 0) / (2 * N);
      const novel = Object.keys(P).filter(k => !G[k]), ok = !novel.length && tv <= 0.3 && !unread; if (!ok) bad++;
      out.push(id.padEnd(28) + (ok ? ' OK ' : ' BAD') + ' distance ' + tv.toFixed(2) + (novel.length ? ' new shapes: ' + novel.slice(0, 3).join('  ') : '') + (unread ? ' unreadable ' + unread : '') +
        (V || !ok ? '\n     pattern: ' + ps.join(' | ') + '\n     old    : ' + gs.join(' | ') + '\n     old shapes: ' + Object.keys(G).slice(0, 8).join('  ') : ''));
    }
    out.push('\n' + bad + ' patterns not matching'); return out.join('\n');
  }, [IDS, V]);
  console.log(res); if (errs.length) console.log('page errors:', errs.slice(0, 3)); await b.close();
})();
