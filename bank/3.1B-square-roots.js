// Bank question 3.1B-square-roots: Solving with Square Roots (Algebra 2, 3.1B, exercise 3).
// x^2 = 32, 5x^2 = 80, z^2 - 7 = 29, (n - 4)^2 = 5. Its problems come from the Play Solve levels named in solve (the same levels as Play Solve: shared engine code).
(window.AN_BANK || (window.AN_BANK = {}))["3.1B-square-roots"] = {
  id: "3.1B-square-roots", version: 1, title: "Solving with Square Roots", section: "3.1", example: 3,
  skills: ["square roots", "inverse operations"], tiers: [0], modes: ["demo", "sequence", "calculate", "solo"], engine: "equation", writeRounds: 2, showWork: "steps",
  patterns: { sequence: "Try Another", calculate: "Try Another", solo: "Submit" },
  solve: { eq: [function (r) { return r.sq === 1; }, function (r) { return r.sq === 2; }, function (r) { return r.sq === 3; }, function (r) { return r.sqg === 1; }] },
  build: function () { return {}; }
};
