// Bank question 2.2B-range: Range (Algebra 2, 2.2 Example 8).
(window.AN_BANK || (window.AN_BANK = {}))["2.2B-range"] = {
  id: "2.2B-range",
  title: "Range",
  section: "2.2",
  example: 8,
  skills: ["range", "interval notation"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 1,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    function c2M228(tier) {
      for (var t = 0; t < 4000; t++) {
        var n = tier === 0 ? 1 : tier === 1 ? 2 : 3, xs = [c2Rng(-6, 0)], K;
        for (var i = 0; i < n; i++) xs.push(xs[i] + (n === 1 ? c2Rng(3, 8) : c2Rng(2, n === 2 ? 5 : 4))); if (xs[n] > 6) continue;
        K = xs.map(function (x) { return [x, c2Rng(-6, 6)]; }); if (K.some(function (k, i) { return i && k[1] === K[i - 1][1]; })) continue;
        if (n > 1 && K.some(function (k, i) { return i > 0 && i < n && (k[1] - K[i - 1][1]) * (k[1] - K[i + 1][1]) <= 0; })) continue;   // every inside point is a turning point
        var ca = !!rnd(2), cb = !!rnd(2), ys = K.map(function (k) { return k[1]; }), lo = Math.min.apply(null, ys), hi = Math.max.apply(null, ys);
        var inc = function (v) { return K.some(function (k, i) { return k[1] === v && (i === 0 ? ca : i === n ? cb : true); }); }, cl = inc(lo), ch = inc(hi);
        if (mode === "demo" && cl === ch) continue;
        var M = ivMarks(lo, hi); if (!M) continue;
        var pcs = [ivPc({ v: lo, cl: cl }, { v: hi, cl: ch })], show = ivGr() ? "graph" : mode === "calculate" ? "both" : "fig";
        var P = { M: M, pcs: pcs, show: show, v: "y", dom: { K: K, a: K[0][0], b: K[n][0], ya: K[0][1], yb: K[n][1], ca: ca, cb: cb } }, pb = { kind: 28, iv: P, pic: "" };
        if (n === 1) P.dom.K = null, P.dom.N = K;   // (a segment: drawn straight)
        pb.head = "range " + ivIneq(P, true) + " " + JSON.stringify(K) + ca + cb;
        pb.story = "What is the range of the graph?";
        pb.fig = function () { return ""; };
        pb.steps = [{ id: "iv", lab: "Range", type: "ivn", ask: "" }];
        pb.ex = "The range is every y-value of the graph. The lowest is y = " + c2F(lo) + (cl ? " (the graph reaches it: included)" : " (only at an open dot: not included)") + " and the highest is y = " + c2F(hi) + (ch ? " (included)" : " (only at an open dot: not included)") + ", so the range is " + ivIneq(P, true) + ", or " + ivStr(pcs) + " in interval notation.";
        return pb;
      }
    }
    return { generate: c2M228 };
  }
};
