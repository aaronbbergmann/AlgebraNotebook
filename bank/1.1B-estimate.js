// Bank question 1.1B-estimate: Estimating a Value from a Graph (Algebra 2, 1.1 Example 3).
// Used by 1.1B Estimate and Play Data. generate(n) returns n problems, each from a different kind (ESTT, in the engine).
(window.AN_BANK || (window.AN_BANK = {}))["1.1B-estimate"] = {
  id: "1.1B-estimate",
  title: "Estimating a Value from a Graph",
  section: "1.1",
  example: 3,
  skills: ["reading graphs", "estimating", "scatter plots"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "solo"],
  engine: "graph",
  writeRounds: 3,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    function estSet(n) {
      var idx = [0, 1, 2, 3, 4], i, j, t; for (i = 4; i > 0; i--) { j = rnd(i + 1); t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
      var out = []; for (i = 0; i < n; i++) out.push(ESTT[idx[i % 5]]()); return out;
    }
    return { generate: estSet };
  }
};
