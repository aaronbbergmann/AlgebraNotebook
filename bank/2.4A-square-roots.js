// Bank question 2.4A-square-roots: Simplifying Square Roots (Algebra 2, 2.4 Example 7).
// Simplify a square root with a perfect square factor: sqrt(200) = 10 sqrt(2). Used by 2.4A and the 3.1 square-root exercises. Returns the items.
(window.AN_BANK || (window.AN_BANK = {}))["2.4A-square-roots"] = {
  id: "2.4A-square-roots", version: 1, title: "Simplifying Square Roots", section: "2.4", example: 7,
  skills: ["square roots", "product property"], tiers: [0], modes: ["demo", "sequence", "calculate", "solo"], engine: "equation", writeRounds: 2, showWork: "steps",
  patterns: { sequence: "Try Another", calculate: "Try Another", solo: "Submit" },
  build: function () {
    var X = function (a) { return { k: "x", v: "x", n: mk(a) }; }, C = function (c) { return { k: "c", n: mk(c) }; };
    return { generate: function () {
      var M = [2, 3, 5, 6, 7, 10, 11], sq, m1, n; do { sq = 2 + rnd(9); m1 = M[rnd(M.length)]; n = sq * sq * m1; } while (n > 300);
      return [{ k: "r", n: mk(rnd(5) ? 1 : 2 + rnd(2)), r: mk(n) }];
    } };
  }
};
