// Bank question 3.1F-special-products: Special Products (Algebra 2, 3.1F, exercise 8).
// a^2 - b^2 and a^2 +- 2ab + b^2. Its problems come from the Play Solve levels named in solve (the same levels as Play Solve: shared engine code).
(window.AN_BANK || (window.AN_BANK = {}))["3.1F-special-products"] = {
  id: "3.1F-special-products", version: 1, title: "Special Products", section: "3.1", example: 8,
  skills: ["difference of squares", "perfect square trinomials"], tiers: [0], modes: ["demo", "sequence", "calculate", "solo"], engine: "equation", writeRounds: 2, showWork: "steps",
  patterns: { sequence: "Try Another", calculate: "Try Another", solo: "Submit" },
  solve: { eq: [function (r) { return r.fm === 1; }, function (r) { return r.fm === 2; }] },
  build: function () { return {}; }
};
