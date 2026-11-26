// Bank question 3.3B-vertex-form: Vertex Form by Completing the Square (Algebra 2, 3.3 Example 11).
(window.AN_BANK || (window.AN_BANK = {}))["3.3B-vertex-form"] = {
  id: "3.3B-vertex-form",
  title: "Vertex Form by Completing the Square",
  section: "3.3",
  example: 11,
  skills: ["completing the square", "vertex form"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 1,
  showWork: "QWA",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    // 3.3B Vertex form by completing the square: y = x² + bx + c → y = (x − h)² + k (and with a in front: divide by a first)
    function c3M11(tier) {
      var a = rnd(3) ? 1 : c2Pick([2, 3, 5]), hh = nz(8), b = -2 * a * hh, c = nz(12) + a * hh * hh, q = hh * hh, k = c - a * q, pb = { kind: 20 };
      var eq = "<i>y</i> = " + c3T(a, b, c), vf = "<i>y</i> = " + (a === 1 ? "" : a) + "(" + c2X + (hh > 0 ? " − " + hh : " + " + -hh) + ")²" + (k ? (k < 0 ? " − " + -k : " + " + k) : "");
      pb.head = eq; pb.pic = "";
      pb.story = "<span class=\"lm cf\">" + eq + "</span>";
      pb.tq = "<div class=\"regQ\">Write the function in vertex form by completing the square.</div>";
      var Fv = function (x0) { return a * (x0 - hh) * (x0 - hh) + k; };
      pb.fig = function (x) { x = x || {}; if (!x.vf) return ""; return c2Pl(c2Plane(Math.min(k, 0) - 3, Math.max(k, 0) + 3), x, { alt: "Graph of the parabola", curves: [{ fn: Fv, col: C2P }], pts: [{ x: hh, y: k, col: C2P, lab: true, dy: -8 }] }); };   // (once the vertex form is found: the parabola, its vertex labelled)
      var bb = b / a, half = bb / 2, lhs = a === 1 ? "<i>y</i> − " + c3P(c) : "(<i>y</i> − " + c3P(c) + ")/" + a;
      pb.steps = [
        { id: "sq", lab: "(b ÷ 2)²", ask: "Find (<i>b</i> ÷ 2)²" + (a === 1 ? "" : " for " + c2X + "² + " + c3P(bb) + c2X) + ".", pre: "(<i>b</i> ÷ 2)² =", ans: q, nums: [half, bb * bb, q * 2].filter(function (v) { return v !== q; }), hint: ["(" + c3P(bb) + " ÷ 2)² = " + c3P(half) + "².", c3P(half) + "² = " + q + "."], line: "(" + c3P(bb) + " ÷ 2)² = " + q },
        { id: "h", lab: "h", ask: "Find <i>h</i>.", pre: "<i>h</i> =", ans: hh, nums: [-hh, half, q].filter(function (v) { return v !== hh; }), hint: [c2X + "² " + (bb < 0 ? "− " : "+ ") + Math.abs(bb) + c2X + " + " + q + " = (" + c2X + (half < 0 ? " − " + -half : " + " + half) + ")².", "<i>h</i> = " + hh + "."], line: lhs + " + " + q + " = (" + c2X + (half < 0 ? " − " + -half : " + " + half) + ")²" },
        { id: "k", lab: "k", ask: "Find <i>k</i>.", pre: "<i>k</i> =", ans: k, nums: [c + a * q, -k, c].filter(function (v) { return v !== k; }), after: function (x) { x.vf = true; }, hint: ["Isolate <i>y</i>: subtract " + q + (a === 1 ? "" : ", multiply by " + a) + ", then add " + c3P(c) + ".", "<i>k</i> = " + c3P(c) + " − " + (a === 1 ? "" : a + "·") + q + " = " + k + "."], line: vf }
      ];
      pb.qwa = { Q: [["<span class=\"lm\">" + eq + "</span>"]],
        W: [[lhs + " = " + c2X + "² " + (bb < 0 ? "− " : "+ ") + Math.abs(bb) + c2X, ["sq"]], ["(" + c3P(bb) + " ÷ 2)² = " + q, ["sq"]], [lhs + " + " + q + " = (" + c2X + (half < 0 ? " − " + -half : " + " + half) + ")²", ["h"]]],
        A: [["<span class=\"lm\">" + vf + "</span>", ["k"]]] };
      return pb;
    }
    return { generate: c3M11 };
  }
};
