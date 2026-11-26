// Bank question 3.1A-graphing: Solving by Graphing (Algebra 2, 3.1 Example 1).
(window.AN_BANK || (window.AN_BANK = {}))["3.1A-graphing"] = {
  id: "3.1A-graphing",
  title: "Solving by Graphing",
  section: "3.1",
  example: 1,
  skills: ["solving by graphing", "x-intercepts", "Desmos graphing"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 1,
  showWork: "QWA",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    function c3M1(tier) {
      for (var t = 0; t < 800; t++) {
        var kind = rnd(10) < 6 ? 2 : rnd(2), a = c2Pick([1, 1, 1, -1, 2, -2]), b, c, r1 = 0, r2 = 0;
        if (kind === 0) { var h0 = c2Rng(-4, 4), k0 = 1 + rnd(5); if (a < 0) k0 = -k0; b = -2 * a * h0; c = a * h0 * h0 + k0; }   // (no x-intercepts: the vertex above the axis, opening up, or below it, opening down)
        else { r1 = c2Rng(-6, 6); r2 = kind === 1 ? r1 : c2Rng(-6, 6); if (kind === 2 && r1 === r2) continue; b = -a * (r1 + r2); c = a * r1 * r2; }
        if (!b && !c) continue;
        var lo = Math.min(r1, r2), hi = Math.max(r1, r2), F = function (x) { return a * x * x + b * x + c; }, hv = -b / (2 * a), k = F(hv);
        if (Math.abs(k) > 40 || Math.abs(c) > 40) continue;
        // the terms: x² on the left; the others on either side, at least one on the right
        var L = [{ c: a, d: 2 }], R = [], parts = [{ c: b, d: 1 }, { c: c, d: 0 }].filter(function (q) { return q.c; });
        parts.forEach(function (q) { if (rnd(2)) R.push({ c: -q.c, d: q.d }); else L.push(q); }); if (!R.length) { var mv0 = L.pop(); R.push({ c: -mv0.c, d: mv0.d }); }
        var eq = c3Side(L) + " = " + c3Side(R), std = c3T(a, b, c) + " = 0", rel = "<i>y</i> = " + c3T(a, b, c), n = kind, pb = { kind: 20 };
        pb.c3 = { L: L, R: R }; pb.ws = c3Ws; pb.noCueW = 1;   // (Write: no list of the parts under the graph, and no related function question)
        pb.head = eq; pb.pic = "";
        Object.defineProperty(pb, "story", { enumerable: true, configurable: true, get: function () { return mode === "solo" ? "<span class=\"lm cf\">" + eq + "</span>" : ""; } });   // (Demo, Sequence, Calculate: the draggable equation takes its place)
        pb.tq = "<div class=\"regQ\">Solve by graphing.</div>";
        pb.dsm = { one: 1, zo: 1, F1: F, F1b: function (x0) { return -F(x0); }, D1: 6, xmax: 10, ymax: Math.max(10, Math.abs(k) * 1.3), l1: c3Lx(a, b, c) };
        var pts = n === 2 ? [{ x: lo, y: 0, col: C2P, lab: "(" + lo + ", 0)", dy: -8 }, { x: hi, y: 0, col: C2P, lab: "(" + hi + ", 0)", dy: hi - lo <= 4 ? 18 : -8 }] : n === 1 ? [{ x: r1, y: 0, col: C2P, lab: "(" + r1 + ", 0)", dy: a > 0 ? 16 : -8 }] : [];
        var pic = function (lab) { var xa = c2Axis(Math.min(n ? lo : hv - 3, 0) - 2, Math.max(n ? hi : hv + 3, 0) + 2, false), ya = c2Axis(Math.min(k, 0) - 2, Math.max(k, c, 0) + 2, false); return c2Fig({ H: 260, xmin: xa.min, xmax: xa.max, ymin: ya.min, ymax: ya.max, gx: xa.g, gy: ya.g, tx: xa.t * 2, ty: ya.t * 2, noGrid: 1, alt: "The graph of " + rel.replace(/<[^>]+>/g, ""), curves: [{ fn: F, col: C2P }], pts: lab ? pts : [] }); };
        pb.fig = function (x) { return DSM.fail ? pic(!!(x && x.xi)) : ""; };   // (Desmos is the graph; the drawn one only if Desmos cannot load)
        var relN = "<i>y</i> = " + c3T(-a, -b, -c), right = function (xx) { return !!(xx && xx.c3L && !xx.c3L.length); }, relOf = function (xx) { return right(xx) ? relN : rel; }, stdOf = function (xx) { return right(xx) ? "0 = " + c3T(-a, -b, -c) : std; };   // (the terms dragged to the right: 0 = −ax² − bx − c, and its related function)
        var wrongT = [[a, b, 0], [a, -b, c], [a, 0, c], [a, b, -c], [-a, b, c]].map(function (q) { return "<i>y</i> = " + c3T(q[0], q[1], q[2]); }).filter(function (t) { return t !== rel && t !== relN; })[0];   // (the wrong choice never matches a right one: with no number term, dropping it changes nothing)
        var opts = m3Sh([{ t: rel, ok: true }, { t: relN, ok: true }, { t: wrongT, ok: false, why: "Keep every term and each sign: the related function is <span class=\"lm\">" + rel + "</span> (or <span class=\"lm\">" + relN + "</span>)." }]);
        var zx0 = Math.min(n ? lo : hv, hv, 0), zx1 = Math.max(n ? hi : hv, hv, 0), zy0 = Math.min(k, 0), zy1 = Math.max(k, 0), zw = Math.max(zx1 - zx0, 8) * 1.5 + 4, zh = Math.max(zy1 - zy0, 8) * 1.4 + 4, zcx = (zx0 + zx1) / 2, zcy = (zy0 + zy1) / 2;
        var zoomV = { l: Math.min(zcx - zw / 2, -11), r: Math.max(zcx + zw / 2, 11), b: Math.min(zcy - zh / 2, -8), t: Math.max(zcy + zh / 2, 8) };   // (always wider than the home view: the Demo zooms out)
        var howMany = function (id, ask, what) { return { id: id, lab: "number of " + what + "s", dpre: id === "nx" ? c3ZoomDemo(zoomV) : undefined, type: "pick", radio: 1, wno: id === "nx" ? 1 : 0, ask: ask, opts: [0, 1, 2].map(function (v) { return { t: String(v), ok: v === n, why: n === 0 ? "The parabola never reaches the " + c2X + "-axis." : n === 1 ? "The parabola touches the " + c2X + "-axis once, at its vertex." : "The parabola crosses the " + c2X + "-axis twice." }; }), after: function (x) { x.xi = true; }, hint: ["Count where the parabola meets the " + c2X + "-axis.", n + "."], line: n + " " + what + (n === 1 ? "" : "s").replace(/^/, "") }; };
        var boxes = function (pre, ask1, ask2, word, pick) {   // the x = boxes: two (either order), one, or none
          if (n === 0) return [];
          if (n === 1) return [{ id: pre + "1", lab: word, ask: ask1, pre: c2X + " =", ans: r1, nums: [-r1, c, r1 + 2].filter(function (v) { return v !== r1; }), wif: function (v) { return v[pick] === 1; }, hint: ["Where does the parabola touch the " + c2X + "-axis?", c2X + " = " + r1 + "."], line: c2X + " = " + r1 }];
          return [{ id: pre + "1", lab: word + "s", ask: ask2, pre: c2X + " =", ans: lo, pair: [lo, hi], wif: function (v) { return v[pick] === 2; },
            okf: function (raw) { var v = String(raw).split("|").map(m3Num); if (v.length < 2 || v.some(isNaN)) return { ok: false, msg: "Type both values." }; var a0 = Math.min(v[0], v[1]), b0 = Math.max(v[0], v[1]); if (Math.abs(a0 - lo) < 1e-9 && Math.abs(b0 - hi) < 1e-9) return { ok: true, show: c2X + " = " + m3F(v[0]) + " and " + c2X + " = " + m3F(v[1]) }; return { ok: false, msg: "Not quite." }; },
            hint: ["The parabola crosses the " + c2X + "-axis twice.", c2X + " = " + m3F(lo) + " and " + c2X + " = " + m3F(hi) + "."], line: c2X + " = " + m3F(lo) + " and " + c2X + " = " + m3F(hi) }];   // (both x = boxes at once, either order)
        };
        pb.steps = [
          { id: "mv", fine: 1, lab: "standard form", type: "c3mv", ask: "Move the terms to one side, so the equation equals 0.", demo: c3MvDemo, after: function (x) { x.std = true; }, hint: ["Drag the terms across the = until one side is 0. Each sign changes as it crosses.", "<span class=\"lm\">" + std + "</span>."], line: function (pp, xx) { return "standard form: <span class=\"lm\">" + stdOf(xx) + "</span>"; } },
          { id: "rel", lab: "related function", type: "pick", wno: 1, ask: "What is the related function?", opts: opts, hint: ["Write it as <span class=\"lm\">" + std + "</span>; the related function is <i>y</i> = the side that is not 0.", "<span class=\"lm\">" + rel + "</span> (or <span class=\"lm\">" + relN + "</span>)."], line: function (pp, xx) { return "related function: <span class=\"lm\">" + relOf(xx) + "</span>"; } },
          { id: "gr", fine: 1, lab: "Graph", type: "dsm", ask: "Graph the related function.", line: function (pp, xx) { return "graphed <span class=\"lm\">" + relOf(xx) + "</span>"; }, hint: ["Type the related function on the first line of Desmos.", "Type " + c3Lx(a, b, c).replace(/\^\{2\}/g, "^2") + "."] },
          howMany("nx", "How many <i>x</i>-intercepts are there?", "x-intercept")
        ].concat(boxes("xi", "What is the <i>x</i>-intercept?", "What are the <i>x</i>-intercepts?", "x-intercept", "nx").map(function (q) { q.wno = 1; return q; }))
         .concat([howMany("ns", function () { return mode === "solo" ? "How many solutions are there?" : "How many solutions to <span class=\"lm\">" + eq + "</span> are there?"; }, "solution")])
         .concat(boxes("so", "What is the solution?", "What are the solutions?", "solution", "ns"));
        var ansT = n === 2 ? c2X + " = " + lo + " and " + c2X + " = " + hi : n === 1 ? c2X + " = " + r1 + " (only one solution)" : "no real solutions";
        pb.qwa = { Q: [["<span class=\"lm\">" + eq + "</span>"], [c2X + " = ?"]],
          W: [[function (x) { return "<span class=\"lm\">" + stdOf(x) + "</span>, related function <span class=\"lm\">" + relOf(x) + "</span>"; }, ["mv", "rel"]], [function (x) { return pic(!!(x && x.xi)); }, ["gr", "nx"]]],
          A: [[ansT, ["ns"]]] };
        return pb;
      }
    }
    return { generate: c3M1 };
  }
};
