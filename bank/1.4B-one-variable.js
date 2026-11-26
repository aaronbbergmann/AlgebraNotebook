// Bank question 1.4B-one-variable: One Variable (Algebra 2, 1.4).
// a x + k = c, k before or after the x. Play Solve (its copy) draws from its own levels instead.
(window.AN_BANK || (window.AN_BANK = {}))["1.4B-one-variable"] = {
  id: "1.4B-one-variable",
  title: "One Variable",
  section: "1.4",
  skills: ["two-step equations", "inverse operations"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "systems",
  writeRounds: 1,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    // one variable, two steps: a x + k = c, k before or after the x, sometimes written + (−k)
    function generate1() {
      var a = nz(5), x = nz(9), k = nz(9), form = rnd(3);
      if (Math.abs(a) < 2) a = a < 0 ? -2 : 2;
      if (form === 2 && k > 0) k = -k;
      var q = mkEq(a, 0, 0, a * x + k);
      q.ks = [{ v: form === 1 ? "p" : "s", k: mk(k), pa: form === 2 }];
      return [q];
    }
    return { generate: generate1 };
  }
};
