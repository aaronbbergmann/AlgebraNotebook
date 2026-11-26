// Bank question 3.3A-complete-square: Complete the Square (Algebra 2, 3.3A, exercise 10).
// complete the square. Its problems come from the Play Solve levels named in solve (the same levels as Play Solve: shared engine code).
(window.AN_BANK || (window.AN_BANK = {}))["3.3A-complete-square"] = {
  id: "3.3A-complete-square", version: 1, title: "Complete the Square", section: "3.3", example: 10,
  skills: ["completing the square"], tiers: [0], modes: ["demo", "sequence", "calculate", "solo"], engine: "equation", writeRounds: 2, showWork: "steps",
  patterns: { sequence: "Try Another", calculate: "Try Another", solo: "Submit" },
  solve: { eq: [function (r) { return r.cs === 1; }, function (r) { return r.cs === 2; }, function (r) { return r.cs === 3; }] },
  build: function () { return {}; }
};
