// Bank question 2.4A-box-method: Multiplying Binomials (Box Method) (Algebra 2, 2.4 Example 6).
// Multiply two binomials with the 2 x 2 box: (x - 2)(x + 5) = x^2 + 3x - 10. Used by 2.4A, 3.1A-C Binomials and 3.1D Box Method. Returns the items.
(window.AN_BANK || (window.AN_BANK = {}))["2.4A-box-method"] = {
  id: "2.4A-box-method", version: 1, title: "Multiplying Binomials (Box Method)", section: "2.4", example: 6,
  skills: ["multiplying binomials", "box method"], tiers: [0], modes: ["demo", "sequence", "calculate", "solo"], engine: "equation", writeRounds: 2, showWork: "steps",
  patterns: { sequence: "Try Another", calculate: "Try Another", solo: "Submit" },
  build: function () {
    var X = function (a) { return { k: "x", v: "x", n: mk(a) }; }, C = function (c) { return { k: "c", n: mk(c) }; };
    return { generate: function () {
      for (;;) {   // (until the first binomial has no common factor: the same draws as before)
        var a1 = rnd(10) < 7 ? 1 : 2 + rnd(2), p = nz(9), q = nz(9); if (gcd(a1, Math.abs(p)) > 1) continue;
        return [{ k: "g", m: mk(1), items: [X(a1), C(p)], b: [X(1), C(q)] }];
      }
    } };
  }
};
