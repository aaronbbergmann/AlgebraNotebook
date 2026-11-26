// Bank question 1.4D-3x3-systems: 3x3 Systems (Algebra 2, 1.4).
// Three equations in x, y and z with one solution. Also RevT1 Q7.
(window.AN_BANK || (window.AN_BANK = {}))["1.4D-3x3-systems"] = {
  id: "1.4D-3x3-systems",
  title: "3x3 Systems",
  section: "1.4",
  skills: ["systems of equations", "elimination", "three variables"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "systems",
  writeRounds: 3,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    function generate3(demo) {
      for (;;) {
        var sol = [nz(4), nz(4), nz(4)], M = [0, 1, 2].map(function () { return [nz(3), nz(3), nz(3)]; });
        if (!det3(M)) continue;
        var E = M.map(function (r) { return mkEq(r[0], r[1], r[2], r[0] * sol[0] + r[1] * sol[1] + r[2] * sol[2]); });
        var b = bestElim(E);
        if (b && (demo !== 1 || b.cost <= 2)) return E;
      }
    }
    return { generate: generate3 };
  }
};
