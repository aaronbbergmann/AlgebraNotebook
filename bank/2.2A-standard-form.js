// Bank question 2.2A-standard-form: Graphing Standard Form (Algebra 2, 2.2 Example 2).
(window.AN_BANK || (window.AN_BANK = {}))["2.2A-standard-form"] = {
  id: "2.2A-standard-form",
  title: "Graphing Standard Form",
  section: "2.2",
  example: 2,
  skills: ["standard form", "graphing parabolas", "axis of symmetry"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 3,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    // Example 2: Graphing a Quadratic Function in Standard Form
    function c2M222(tier) {
      for (var t = 0; t < 3000; t++) {
        var a = c2Pick(tier === 0 ? [1, -1] : tier === 1 ? [1, -1, 2, -2] : [2, -2, 3, -3]), h = c2Nz(-4, 4), k = c2Rng(-7, 7), b = -2 * a * h, c = a * h * h + k;
        var F = function (x) { return a * x * x + b * x + c; }, s = rnd(2) ? 1 : -1, x3 = h + s; if (x3 === 0 || x3 === 2 * h) x3 = h - s; if (x3 === 0 || x3 === 2 * h) continue;
        var y3 = F(x3);
        if (Math.abs(c) > 9 || Math.abs(2 * h) > 9 || Math.abs(y3) > 9 || Math.abs(2 * h - x3) > 9 || Math.abs(k) > 9) continue;
        if (!c) continue; var nvp = 0; for (var dd = 1; dd <= 9; dd++) if (Math.abs(h + dd) <= 10 && Math.abs(h - dd) <= 10 && Math.abs(F(h + dd)) <= 9.5) nvp++; if (nvp < 2) continue;   // (c is clicked in the equation, and two pairs of mirror points must be on the graph)
        var fS = c2Sf(a, b, c, "<i>f</i>(" + c2X + ")"), pb = { kind: 20, vf: { std: 1, a: a, b: b, c: c, h: h, k: k } };
        pb.head = fS[0];   /* (c2Make turns it into plain text, fractions as a/b) */ pb.pic = "";
        pb.story = "Graph <span class=\"lm cf\">" + fS[0] + "</span>. Label the vertex and the axis of symmetry.";
        pb.fig = function (x) { x = x || {}; var ex = { alt: "Coordinate plane" }; ex.vl = x.ax ? [{ x: h, col: C2G, lab: c2X + " = " + c2F(h) }] : []; ex.curves = x.cv ? [{ fn: F, col: C2P }] : []; return c2Pl(c2Plane(-9, 9), x, ex); };
        pb.steps = [
          { id: "xv", fine: 1, lab: "x of vertex", ask: "The coefficients are <i>a</i> = " + c2F(a) + ", <i>b</i> = " + c2F(b) + " and <i>c</i> = " + c2F(c) + ". The vertex has " + c2X + " = −<i>b</i> ÷ (2<i>a</i>). Find it.", pre: c2X + " =", ans: h, wrong: function (v) { return v === -h ? "Remember the negative sign: " + c2X + " = −b ÷ (2a)." : v === -b / a ? "Divide by 2a, not by a." : ""; }, hint: ["Put <i>a</i> and <i>b</i> into −<i>b</i> ÷ (2<i>a</i>).", "−(" + c2F(b) + ") ÷ (2 · " + c2F(a) + ") = " + c2F(h) + "."], line: c2X + " = −<i>b</i> ÷ (2<i>a</i>) = " + c2F(h) },
          { id: "yv", fine: 1, lab: "y of vertex", ask: "Find the " + c2Y + "-coordinate of the vertex: <i>f</i>(" + c2F(h) + ").", pre: "<i>f</i>(" + c2F(h) + ") =", ans: k, hint: ["Replace " + c2X + " with " + c2F(h) + " in <i>f</i>.", c2F(a) + "(" + c2F(h) + ")² " + (b < 0 ? "− " : "+ ") + c2F(Math.abs(b)) + "(" + c2F(h) + ") " + (c < 0 ? "− " : "+ ") + c2F(Math.abs(c)) + " = " + c2F(k) + "."], line: "<i>f</i>(" + c2F(h) + ") = " + c2F(k) },
          { id: "v", lab: "Vertex", type: "gpt", ask: c2S("Plot the vertex " + c2Pt(h, k) + ".", "Plot the vertex."), pts: [[h, k]], hint: ["The vertex is (−b ÷ (2a), f(−b ÷ (2a))).", "Click " + c2Pt(h, k) + "."], line: "vertex " + c2Pt(h, k) },
          { id: "ax", lab: "Axis", ask: "Write the equation of the axis of symmetry.", pre: c2X + " =", ans: h, after: function (x) { x.ax = true; }, hint: ["It is the vertical line through the vertex.", c2X + " = " + c2F(h) + "."], line: "axis of symmetry " + c2X + " = " + c2F(h) },
          { id: "c", fine: 1, lab: "y-intercept", ask: "The " + c2Y + "-intercept of <i>ax</i>² + <i>bx</i> + <i>c</i> is <i>c</i>. What is it?", pre: c2Y + "-intercept =", ans: c, hint: ["When " + c2X + " = 0, only <i>c</i> is left.", "<i>c</i> = " + c2F(c) + "."], line: c2Y + "-intercept " + c2F(c) },
          { id: "pc", fine: 1, lab: "points", type: "gpt", ask: "Plot the " + c2Y + "-intercept (0, " + c2F(c) + ") and its mirror image in the axis of symmetry.", pts: [[0, c], [2 * h, c]], hint: ["(0, " + c2F(c) + ") is " + Math.abs(h) + " units from the axis; its mirror image is " + Math.abs(h) + " units on the other side.", "Click (0, " + c2F(c) + ") and " + c2Pt(2 * h, c) + "."], line: "points (0, " + c2F(c) + ") and " + c2Pt(2 * h, c) },
          { id: "y3", fine: 1, lab: "f(" + x3 + ")", ask: "Find one more point: evaluate <i>f</i>(" + c2F(x3) + ").", pre: "<i>f</i>(" + c2F(x3) + ") =", ans: y3, hint: ["Replace " + c2X + " with " + c2F(x3) + ".", "<i>f</i>(" + c2F(x3) + ") = " + c2F(y3) + "."], line: "<i>f</i>(" + c2F(x3) + ") = " + c2F(y3) },
          { id: "p3", fine: 1, lab: "points", type: "gpt", ask: "Plot " + c2Pt(x3, y3) + " and its mirror image.", pts: [[x3, y3], [2 * h - x3, y3]], after: function (x) { x.cv = true; }, hint: ["The mirror image is the same distance from the axis, on the other side.", "Click " + c2Pt(x3, y3) + " and " + c2Pt(2 * h - x3, y3) + "."], line: "points " + c2Pt(x3, y3) + " and " + c2Pt(2 * h - x3, y3) },
          c2Any(F, h, k)
        ];
        pb.ex = "For " + fS[0] + ", " + c2X + " = −<i>b</i> ÷ (2<i>a</i>) = " + c2F(h) + " and <i>f</i>(" + c2F(h) + ") = " + c2F(k) + ", so the vertex is " + c2Pt(h, k) + " and the axis of symmetry is " + c2X + " = " + c2F(h) + ". The " + c2Y + "-intercept (0, " + c2F(c) + ") reflects to " + c2Pt(2 * h, c) + ", and " + c2Pt(x3, y3) + " reflects to " + c2Pt(2 * h - x3, y3) + ".";
        return pb;
      }
    }
    return { generate: c2M222 };
  }
};
