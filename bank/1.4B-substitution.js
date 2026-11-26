// Bank question 1.4B-substitution: Substitution (Algebra 2, 1.4).
// One equation solved for y, the other in standard form; now and then (after a regular one) a system with no solution or infinitely many. Also RevT1 Q6 Substitution.
(window.AN_BANK || (window.AN_BANK = {}))["1.4B-substitution"] = {
  id: "1.4B-substitution",
  title: "Substitution",
  section: "1.4",
  skills: ["systems of equations", "substitution"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "systems",
  writeRounds: 0,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 2,   // 2: its random draws go through RNG (seeded problems repeat exactly)
  build: function () {
    // a system for substitution: one equation already solved for y (y = mx + n), the other in standard form
    function generateSub(demo) {
      var deg = !demo && mode !== "create" && degOK() && RNG() < 0.2 ? (RNG() < 0.5 ? "inf" : "none") : "";
      lastDeg = !!deg;
      for (;;) {
        var m = nz(4), x0 = nz(5), y0 = nz(6), n = y0 - m * x0, a, b, c;
        if (!n || Math.abs(n) > 12) continue;
        if (deg) { var t = [2, 3, -1, -2, 4][rnd(5)]; a = -m * t; b = t; c = n * t + (deg === "none" ? nz(5) : 0); }
        else { a = nz(5); b = nz(5); if (a + b * m === 0 || Math.abs(b) === 1 && a === -m) continue; c = a * x0 + b * y0; }
        var E1 = mkEq(a, b, 0, c), E2 = mkEq(-m, 1, 0, n); E2.sol = "y";
        return rnd(2) ? [E1, E2] : [E2, E1];
      }
    }
    return { generate: generateSub };
  }
};
