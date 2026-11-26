// Bank question 2.2B-domain: Domain (Algebra 2, 2.2 Example 7).
(window.AN_BANK || (window.AN_BANK = {}))["2.2B-domain"] = {
  id: "2.2B-domain",
  title: "Domain",
  section: "2.2",
  example: 7,
  skills: ["domain", "interval notation"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 1,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    function c2M227(tier) {
      for (var t = 0; t < 4000; t++) {
        var a = c2Rng(-6, 2), b = a + c2Rng(2, 8); if (b > 6) continue;
        var st = b - a <= 4 ? 1 : (b - a) % 2 ? 0 : 2; if (!st) continue;
        var lo = Math.max(-6 * st, b - 4 * st), hi = a, opts = []; for (var m = lo; m <= hi; m += 1) if ((a - m) % st === 0) opts.push(m); if (!opts.length) continue;
        var m0 = c2Pick(opts), M = [0, 1, 2, 3, 4].map(function (i) { return m0 + i * st; }); if (M.indexOf(b) < 0) continue;
        var deg = tier === 0 ? c2Pick([1, 2]) : tier === 1 ? c2Pick([2, 3]) : c2Pick([1, 2, 3, 3]), N = [];
        for (var i = 0; i <= deg; i++) N.push([a + (b - a) * i / deg, c2Rng(-5, 5)]);
        if (deg === 1 && N[0][1] === N[1][1]) continue;
        var F = ivPoly(N), ok = true; for (var x = a; x <= b + 1e-9; x += (b - a) / 60) if (Math.abs(F(x)) > 6.4) ok = false; if (!ok) continue;
        var ya = Math.round(F(a)), yb = Math.round(F(b)), c1 = !!rnd(2), c2 = demoMix() ? !c1 : tier === 0 ? c1 : !!rnd(2);
        var pcs = [ivPc({ v: a, cl: c1 }, { v: b, cl: c2 })], show = ivGr() ? "graph" : mode === "calculate" ? "both" : "fig";
        var P = { M: M, pcs: pcs, show: show, dom: { N: N, a: a, b: b, ya: ya, yb: yb } }, pb = { kind: 27, iv: P, pic: "" };
        pb.head = "domain " + ivIneq(P, true) + " " + JSON.stringify(N);
        pb.story = "What is the domain of the graph?";
        pb.fig = function () { return ""; };
        pb.steps = [{ id: "iv", lab: "Domain", type: "ivn", ask: "" }];
        pb.ex = "The domain is every x-value of the graph. It starts at x = " + c2F(a) + (c1 ? " (closed dot: included)" : " (open dot: not included)") + " and ends at x = " + c2F(b) + (c2 ? " (closed dot: included)" : " (open dot: not included)") + ", so the domain is " + ivIneq(P, true) + ", or " + ivStr(pcs) + " in interval notation.";
        return pb;
      }
    }
    return { generate: c2M227 };
  }
};
