// Bank question 3.1G-factor-ac: Factor ax^2 + bx + c (Algebra 2, 3.1G, exercise 9).
// factor ax^2 + bx + c ("ac"). Its problems come from the Play Solve levels named in solve (the same levels as Play Solve: shared engine code).
(window.AN_BANK || (window.AN_BANK = {}))["3.1G-factor-ac"] = {
  id: "3.1G-factor-ac", version: 1, title: "Factor ax^2 + bx + c", section: "3.1", example: 9,
  skills: ["factoring trinomials", "ac method"], tiers: [0], modes: ["demo", "sequence", "calculate", "solo"], engine: "equation", writeRounds: 2, showWork: "steps",
  patterns: { sequence: "Try Another", calculate: "Try Another", solo: "Submit" },
  solve: { eq: [function (r) { return r.grp === 4; }] },
  build: function () { return {}; }
};
