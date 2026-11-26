// Bank question 2.2A-vertex-form: Graphing Vertex Form (Algebra 2, 2.2 Example 1).
(window.AN_BANK || (window.AN_BANK = {}))["2.2A-vertex-form"] = {
  id: "2.2A-vertex-form",
  title: "Graphing Vertex Form",
  section: "2.2",
  example: 1,
  skills: ["vertex form", "graphing parabolas", "axis of symmetry"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 3,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    // Example 1: Using Symmetry to Graph (vertex form)
    function c2M221(tier) {
      for (var t = 0; t < 2000; t++) {
        var a = c2Pick(tier === 0 ? [1, -1] : tier === 1 ? [2, -2, 1, -1] : [2, -2, 0.5, -0.5]), h = c2Rng(-5, 5), k = c2Rng(-6, 6), s = rnd(2) ? 1 : -1, d = Math.abs(a) === 0.5 ? [2, 4] : [1, 2];
        if (tier === 0 && rnd(3) === 0) h = 0;
        if (a === 1 && !h && !k) continue;   // (never the parent x² itself: at least one transformation)
        if (c2Cu()) { a = c2Custom.a; h = c2Custom.h; k = c2Custom.k; d = Math.abs(a) === 0.5 ? [2, 4] : [1, 2]; }   // (Create: the student's own function)
        var F = function (x) { return a * (x - h) * (x - h) + k; }, x1 = h + s * d[0], x2 = h + s * d[1], y1 = F(x1), y2 = F(x2);
        if ([x1, x2, 2 * h - x1, 2 * h - x2].some(function (v) { return Math.abs(v) > 9; }) || [y1, y2].some(function (v) { return Math.abs(v) > 9; })) continue;
        var fS = c2Vf(a, h, k, "x", "<i>f</i>(" + c2X + ")"), pb = { kind: 20, vf: { std: 1, vx: 1, a: a, b: -2 * a * h, c: a * h * h + k, h: h, k: k } };   // (vx: Vertex Form, with a graphing table)
        pb.head = fS[0];   /* (c2Make turns it into plain text, fractions as a/b) */ pb.pic = "";
        pb.story = "Graph <span class=\"lm cf\">" + fS[0] + "</span>. Label the vertex and the axis of symmetry.";
        pb.fig = function (x) { x = x || {}; var o = c2Plane(-9, 9), ex = { alt: "Coordinate plane" }; ex.vl = x.ax ? [{ x: h, col: C2G, lab: c2X + " = " + c2F(h) }] : []; ex.curves = x.cv ? [{ fn: F, col: C2P }] : []; return c2Pl(o, x, ex); };
        pb.steps = [
          { id: "h", fine: 1, lab: "h", ask: "Compare with <i>f</i>(" + c2X + ") = <i>a</i>(" + c2X + " − <i>h</i>)² + <i>k</i>. What is <i>h</i>?", pre: "<i>h</i> =", ans: h, wrong: function (v) { return v === -h && h ? "Careful with the sign: " + c2X + c2Sg(-h) + " is " + c2X + " − (" + c2F(h) + "), so <i>h</i> = " + c2F(h) + "." : ""; }, hint: ["<i>h</i> is the number subtracted from " + c2X + " inside the parentheses.", h ? c2X + c2Sg(-h) + " = " + c2X + " − (" + c2F(h) + "), so <i>h</i> = " + c2F(h) + "." : "There is nothing subtracted from " + c2X + ", so <i>h</i> = 0."], line: "<i>h</i> = " + c2F(h) },
          { id: "k", fine: 1, lab: "k", ask: "What is <i>k</i>?", pre: "<i>k</i> =", ans: k, hint: ["<i>k</i> is the number added at the end.", "<i>k</i> = " + c2F(k) + "."], line: "<i>k</i> = " + c2F(k) },
          { id: "v", lab: "Vertex", type: "gpt", ask: c2S("Plot the vertex (<i>h</i>, <i>k</i>) = " + c2Pt(h, k) + ".", "Plot the vertex."), pts: [[h, k]], miss: function (px, py) { return px === k && py === h ? "Swap them: the vertex is (h, k), so " + c2X + " = " + c2F(h) + " comes first." : px === -h && py === k ? "Check the sign of h." : "The vertex is (h, k). Try again."; }, hint: ["The vertex of <i>a</i>(" + c2X + " − <i>h</i>)² + <i>k</i> is (<i>h</i>, <i>k</i>).", "Click " + c2Pt(h, k) + "."], line: "vertex " + c2Pt(h, k) },
          { id: "ax", lab: "Axis", ask: "The axis of symmetry is the vertical line through the vertex. Write its equation.", pre: c2X + " =", ans: h, after: function (x) { x.ax = true; }, hint: ["A vertical line through (" + c2F(h) + ", " + c2F(k) + ") has the equation " + c2X + " = a number.", c2X + " = " + c2F(h) + "."], line: "axis of symmetry " + c2X + " = " + c2F(h) },
          { id: "y1", fine: 1, lab: "f(" + x1 + ")", ask: "Find one more point: evaluate <i>f</i>(" + c2F(x1) + ").", pre: "<i>f</i>(" + c2F(x1) + ") =", ans: y1, hint: ["Replace " + c2X + " with " + c2F(x1) + ".", c2F(a) + "(" + c2F(x1) + c2Sg(-h) + ")² " + (k < 0 ? "− " : "+ ") + c2F(Math.abs(k)) + " = " + c2F(y1) + "."], line: "<i>f</i>(" + c2F(x1) + ") = " + c2F(y1) },
          { id: "y2", fine: 1, lab: "f(" + x2 + ")", ask: "And <i>f</i>(" + c2F(x2) + ").", pre: "<i>f</i>(" + c2F(x2) + ") =", ans: y2, hint: ["Replace " + c2X + " with " + c2F(x2) + ".", c2F(a) + "(" + c2F(x2) + c2Sg(-h) + ")² " + (k < 0 ? "− " : "+ ") + c2F(Math.abs(k)) + " = " + c2F(y2) + "."], line: "<i>f</i>(" + c2F(x2) + ") = " + c2F(y2) },
          { id: "p", fine: 1, lab: "points", type: "gpt", ask: "Plot " + c2Pt(x1, y1) + " and " + c2Pt(x2, y2) + ".", pts: [[x1, y1], [x2, y2]], hint: ["Go across to " + c2X + ", then up or down to " + c2Y + ".", "Click " + c2Pt(x1, y1) + " and " + c2Pt(x2, y2) + "."], line: "points " + c2Pt(x1, y1) + " and " + c2Pt(x2, y2) },
          { id: "r", fine: 1, lab: "reflections", type: "gpt", ask: "Reflect both points in the axis of symmetry " + c2X + " = " + c2F(h) + ": plot their mirror images.", pts: [[2 * h - x1, y1], [2 * h - x2, y2]], after: function (x) { x.cv = true; }, hint: ["A mirror image is the same distance from the axis, on the other side, at the same height.", "Click " + c2Pt(2 * h - x1, y1) + " and " + c2Pt(2 * h - x2, y2) + "."], line: "mirror images " + c2Pt(2 * h - x1, y1) + " and " + c2Pt(2 * h - x2, y2) },
          c2Any(F, h, k)
        ];
        pb.ex = "In " + fS[0] + ", <i>h</i> = " + c2F(h) + " and <i>k</i> = " + c2F(k) + ", so the vertex is " + c2Pt(h, k) + " and the axis of symmetry is " + c2X + " = " + c2F(h) + ". <i>f</i>(" + c2F(x1) + ") = " + c2F(y1) + " and <i>f</i>(" + c2F(x2) + ") = " + c2F(y2) + "; their mirror images in the axis are " + c2Pt(2 * h - x1, y1) + " and " + c2Pt(2 * h - x2, y2) + ". The parabola goes through all five points.";
        return pb;
      }
    }
    return { generate: c2M221 };
  }
};
