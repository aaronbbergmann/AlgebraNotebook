// Bank question 1.1A-parents: Memorizing Parents (Algebra 2, 1.1A, exercise 1).
// The four parent functions (constant, linear, absolute value, quadratic) in a random order; for each the student names the family,
// writes its equation, fills its table and draws its graph.  Also RevT1 Q1.  generate() returns the order of the families, [0..3] shuffled.
(window.AN_BANK || (window.AN_BANK = {}))["1.1A-parents"] = {
  id: "1.1A-parents", version: 1, title: "Memorizing Parents", section: "1.1", example: 1,
  skills: ["parent functions", "tables", "graphing"], tiers: [0], modes: ["demo", "sequence", "solo"], engine: "quiz", writeRounds: 3, showWork: "steps",
  patterns: {"solo": "Submit"},
  build: function () {
    return { generate: function () {
      var o = [0, 1, 2, 3]; for (var i = 3; i > 0; i--) { var j = rnd(i + 1), t = o[i]; o[i] = o[j]; o[j] = t; }
      return o;
    } };
  }
};
