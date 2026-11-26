// Bank question 2.4A-3step-equations: 3-Step Linear Equations (Algebra 2, 2.4 Example 5).
// Solve a 3-step linear equation: 5(x + 2) - 13 = 7, or (x - 2)/3 + 2 = 10. Used by 2.4A and 2.4B. Returns { L, R }.
(window.AN_BANK || (window.AN_BANK = {}))["2.4A-3step-equations"] = {
  id: "2.4A-3step-equations", version: 1, title: "3-Step Linear Equations", section: "2.4", example: 5,
  skills: ["linear equations", "distributing", "inverse operations"], tiers: [0], modes: ["demo", "sequence", "calculate", "solo"], engine: "equation", writeRounds: 2, showWork: "steps",
  patterns: { sequence: "Try Another", calculate: "Try Another", solo: "Submit" },
  build: function () {
    var X = function (a) { return { k: "x", v: "x", n: mk(a) }; }, C = function (c) { return { k: "c", n: mk(c) }; };
    return { generate: function () {
      for (;;) {   // (until a usable equation: the same draws as before, when svMake tried again)
        var g = rnd(2) ? eqOv() : (function () { var a = 2 + rnd(5), b = nz(9), c = nz(15), x = nz(9), d = a * (x + b) + c; if (!d || x + b === 0) return null; return { L: [{ k: "g", m: mk(a), items: [X(1), C(b)] }, C(c)], R: [C(d)] }; })();
        if (g) return g;
      }
    } };
  }
};
