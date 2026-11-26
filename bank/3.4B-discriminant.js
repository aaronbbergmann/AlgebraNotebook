// Bank question 3.4B-discriminant: The Discriminant (Algebra 2, 3.4 Example 13).
(window.AN_BANK || (window.AN_BANK = {}))["3.4B-discriminant"] = {
  id: "3.4B-discriminant",
  title: "The Discriminant",
  section: "3.4",
  example: 13,
  skills: ["discriminant", "number of solutions"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 1,
  showWork: "QWA",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    // 3.4B The Discriminant: a, b and c, then b² − 4ac, then how many real solutions (positive: 2, zero: 1, negative: 0)
    function c3M13(tier) {
      for (var t = 0; t < 500; t++) {
        var kind = rnd(3), a, b, c;
        if (kind === 1) { var p0 = c2Pick([1, 1, 2, 3]), q0 = nz(6); a = p0 * p0; b = 2 * p0 * q0; c = q0 * q0; if (rnd(4) === 0) { a = -a; b = -b; c = -c; } }
        else { a = c2Pick([1, 1, 2, 3, -1, -2]); b = nz(9); c = nz(12); }
        var D = b * b - 4 * a * c; if ((kind === 0 && D >= 0) || (kind === 2 && D <= 0) || (kind === 1 && D !== 0)) continue;
        var pb = { kind: 20, mx: { a: a, b: b, c: c } }, eq = c3T(a, b, c) + " = 0", n = D > 0 ? 2 : D === 0 ? 1 : 0;
        pb.head = eq; pb.pic = "";
        pb.story = "<span class=\"lm cf\">" + eq + "</span>";
        pb.tq = "<div class=\"regQ\">Find the discriminant. How many real solutions does the equation have?</div>";
        var F = function (x) { return a * x * x + b * x + c; }, h = -b / (2 * a), k = F(h);
        pb.fig = function (x) { x = x || {}; if (!x.ns) return ""; return c2Pl(c2Plane(Math.min(k, 0) - 3, Math.max(k, 0) + 3), x, { alt: "Graph of y = " + c3T(a, b, c), curves: [{ fn: F, col: C2P }] }); };
        var wd = D > 0 ? "positive" : D === 0 ? "zero" : "negative", nn = function (v) { return [v, -v, b * b, b * b + 4 * a * c].filter(function (z, j, A) { return z !== D && A.indexOf(z) === j; }).slice(0, 3); };
        pb.steps = [
          { id: "a", fine: 1, lab: "a", ask: "Find <i>a</i>.", pre: "<i>a</i> =", ans: a, nums: [b, c, -a].filter(function (z) { return z !== a; }), hint: ["<i>a</i> is the number in front of " + c2X + "².", "<i>a</i> = " + c2F(a) + "."], line: "<i>a</i> = " + c2F(a) },
          { id: "b", fine: 1, lab: "b", ask: "Find <i>b</i>.", pre: "<i>b</i> =", ans: b, nums: [a, c, -b].filter(function (z) { return z !== b; }), hint: ["<i>b</i> is the number in front of " + c2X + ".", "<i>b</i> = " + c2F(b) + "."], line: "<i>b</i> = " + c2F(b) },
          { id: "c", fine: 1, lab: "c", ask: "Find <i>c</i>.", pre: "<i>c</i> =", ans: c, nums: [a, b, -c].filter(function (z) { return z !== c; }), hint: ["<i>c</i> is the number on its own.", "<i>c</i> = " + c2F(c) + "."], line: "<i>c</i> = " + c2F(c) },
          { id: "d", lab: "Discriminant", ask: "Find the discriminant.", pre: "<i>b</i>² − 4<i>ac</i> =", ans: D, nums: nn(D), hint: ["<i>b</i>² − 4<i>ac</i> = " + c3P(b) + "² − 4(" + c2F(a) + ")(" + c2F(c) + ")" + ".", c3P(b) + "² − 4(" + c2F(a) + ")(" + c2F(c) + ")" + " = " + c2F(b * b) + " − " + c3P(4 * a * c) + " = " + c2F(D) + "."], line: "<i>b</i>² − 4<i>ac</i> = " + c3P(b) + "² − 4(" + c2F(a) + ")(" + c2F(c) + ")" + " = " + c2F(D) },
          { id: "n", lab: "Solutions", type: "pick", ask: "How many real solutions?", opts: [{ t: "2", ok: n === 2, why: "The discriminant is " + wd + "." }, { t: "1", ok: n === 1, why: "The discriminant is " + wd + "." }, { t: "0", ok: n === 0, why: "The discriminant is " + wd + "." }],
            after: function (x) { x.ns = true; }, hint: ["Positive: 2 solutions. Zero: 1. Negative: 0.", "The discriminant is " + wd + ", so " + n + "."], line: "the discriminant is " + wd + ": " + n + " real solution" + (n === 1 ? "" : "s") }
        ];
        pb.qwa = { Q: [["<span class=\"lm\">" + eq + "</span>"], ["<i>b</i>² − 4<i>ac</i> = ?"]],
          W: [["<i>a</i> = " + c2F(a) + ", <i>b</i> = " + c2F(b) + ", <i>c</i> = " + c2F(c), ["a", "b", "c", "d"]], ["<i>b</i>² − 4<i>ac</i> = " + c3P(b) + "² − 4(" + c2F(a) + ")(" + c2F(c) + ")" + " = " + c2F(D), ["d"]]],
          A: [[c2F(D) + " is " + wd + ": " + n + " real solution" + (n === 1 ? "" : "s"), ["n"]]] };
        return pb;
      }
    }
    return { generate: c3M13 };
  }
};
