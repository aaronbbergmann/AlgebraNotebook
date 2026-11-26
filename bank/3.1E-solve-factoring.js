// Bank question 3.1E-solve-factoring: Solve by Factoring (Algebra 2, 3.1E, exercise 7).
// split (Zero Product Property); set equal to zero, factor, split. Its problems come from the Play Solve levels named in solve (the same levels as Play Solve: shared engine code).
(window.AN_BANK || (window.AN_BANK = {}))["3.1E-solve-factoring"] = {
  id: "3.1E-solve-factoring", version: 1, title: "Solve by Factoring", section: "3.1", example: 7,
  skills: ["zero product property", "factoring"], tiers: [0], modes: ["demo", "sequence", "calculate", "solo"], engine: "equation", writeRounds: 2, showWork: "steps",
  patterns: { sequence: "Try Another", calculate: "Try Another", solo: "Submit" },
  solve: { eq: [function (r) { return r.zp === 1; }, function (r) { return r.zp === 2; }, function (r) { return r.zp === 5; }, function (r) { return r.grp === 3; }] },
  build: function () { return {}; }
};
