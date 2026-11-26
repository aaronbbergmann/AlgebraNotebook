// Bank question 3.4A-quadratic-formula: Quadratic Formula (Algebra 2, 3.4A, exercise 12).
// the quadratic formula. Its problems come from the Play Solve levels named in solve (the same levels as Play Solve: shared engine code).
(window.AN_BANK || (window.AN_BANK = {}))["3.4A-quadratic-formula"] = {
  id: "3.4A-quadratic-formula", version: 1, title: "Quadratic Formula", section: "3.4", example: 12,
  skills: ["quadratic formula"], tiers: [0], modes: ["demo", "sequence", "calculate", "solo"], engine: "equation", writeRounds: 2, showWork: "steps",
  patterns: { sequence: "Try Another", calculate: "Try Another", solo: "Submit" },
  solve: { eq: [function (r) { return r.qu === 1; }, function (r) { return r.qu === 2; }, function (r) { return r.qu === 3; }] },
  build: function () { return {}; }
};
