// Bank question 3.1A-4step-equations: 4-Step Equations (Algebra 2, 3.1A, exercise 14).
// 3(x - 2) + 4 = x + 10. Its own generator (below); the engine builds the equation from what it returns.
(window.AN_BANK || (window.AN_BANK = {}))["3.1A-4step-equations"] = {
  id: "3.1A-4step-equations", version: 1, title: "4-Step Equations", section: "3.1", example: 14,
  skills: ["linear equations", "distributing", "variables on both sides"], tiers: [0], modes: ["demo", "sequence", "calculate", "solo"], engine: "equation", writeRounds: 2, showWork: "steps",
  patterns: { sequence: "Try Another", calculate: "Try Another", solo: "Submit" },
  solve: { lin4: 1 },
  build: function () {
    return { generate: function () {
      var X4 = function (q) { return { k: "x", v: "x", n: mk(q) }; }, C4 = function (q) { return { k: "c", n: mk(q) }; }, a4, b4, c4, d4, e4, x4;
      do { a4 = 2 + rnd(5); b4 = nz(8); c4 = nz(12); d4 = 1 + rnd(5); x4 = nz(9); e4 = a4 * (x4 + b4) + c4 - d4 * x4; } while (d4 === a4 || !e4 || x4 + b4 === 0);
      return { a: a4, b: b4, c: c4, d: d4, e: e4 };
    } };
  }
};
