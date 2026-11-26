// Bank question 1.1A-graph-describe: Graphing and Describing Translations (Algebra 2, 1.1 Example 2).
// Used by 1.1A Graph & Describe, Play Graph and RevT1 Q3. generate(fam) returns the shift { h, k } for the family fam.
(window.AN_BANK || (window.AN_BANK = {}))["1.1A-graph-describe"] = {
  id: "1.1A-graph-describe",
  title: "Graphing and Describing Translations",
  section: "1.1",
  example: 2,
  skills: ["parent functions", "translations", "graphing"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "solo"],
  engine: "graph",
  writeRounds: 3,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    function gdMake(fam) {
      function nz(m) { var v = 0; while (!v) v = rnd(2 * m + 1) - m; return v; }
      var h = 0, k = 0;
      if (fam < 2) k = nz(5); else { h = nz(5); k = nz(5); var r = rnd(4); if (r === 0) h = 0; else if (r === 1) k = 0; }
      return { h: h, k: k };
    }
    return { generate: gdMake };
  }
};
