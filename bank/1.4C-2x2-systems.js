// Bank question 1.4C-2x2-systems: 2x2 Systems (Algebra 2, 1.4).
// Two equations in x and y with one solution (generateDeg, in the engine, makes the special ones). Also RevT1 Q2 and Q6 Elimination.
(window.AN_BANK || (window.AN_BANK = {}))["1.4C-2x2-systems"] = {
  id: "1.4C-2x2-systems",
  title: "2x2 Systems",
  section: "1.4",
  skills: ["systems of equations", "elimination"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "systems",
  writeRounds: 1,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    function generate2(level, demo) {
      var m = level ? 7 : 4, sm = level ? 9 : 5, x, y, a1, b1, a2, b2;
      do {
        x = nz(sm); y = nz(sm); a1 = nz(m); b1 = nz(m); a2 = nz(m); b2 = nz(m);
      } while (a1 * b2 - a2 * b1 === 0 || (level && (Math.abs(b1) === Math.abs(b2) || b1 % b2 === 0 || b2 % b1 === 0)) ||
               (demo === 1 && (Math.abs(a1) === Math.abs(a2) || need(a1, a2) !== 1 || need(b1, b2) !== 2)) ||
               (demo === 2 && (need(a1, a2) !== 2 || need(b1, b2) !== 2)));
      return [[a1, b1], [a2, b2]].map(function (p) { return mkEq(p[0], p[1], 0, p[0] * x + p[1] * y); });
    }
    return { generate: generate2 };
  }
};
