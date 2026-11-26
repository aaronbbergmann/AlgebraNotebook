// Bank question 2.1A-graph-transformations: Transformations of Quadratic Functions (Algebra 2, 2.1 Example 1).
// Used by 2.1A Translations, 2.1A Reflect & Stretch, 2.1B Write g and RevQ2's copies. generate(i) returns problem i of a round (they get harder).
(window.AN_BANK || (window.AN_BANK = {}))["2.1A-graph-transformations"] = {
  id: "2.1A-graph-transformations",
  title: "Transformations of Quadratic Functions",
  section: "2.1",
  example: 1,
  skills: ["vertex form", "translations", "reflections", "stretches"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "graph",
  writeRounds: 3,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    function gdMake21(tier) {
      function nz(m) { var v = 0; while (!v) v = rnd(2 * m + 1) - m; return v; }
      function pk(a) { return a[rnd(a.length)]; }
      for (var t = 0; t < 200; t++) {
      var h = 0, k = 0, a = 1;
      if (lesson === 1) {
        if (tier === 0) { if (rnd(2)) h = nz(4); else k = nz(4); }
        else if (tier === 1) { h = nz(4); k = nz(4); }
        else { h = nz(6); k = nz(6); }
      } else if (lesson === 2) {
        a = tier === 0 ? pk([2, 0.5, -1, 0.25]) : tier === 1 ? pk([-2, -0.5, 2, -0.25]) : pk([2, -2, 0.5, -0.5, -1]);
        if (tier === 2) { if (rnd(2)) h = nz(4); else k = nz(4); }
      } else {
        a = tier === 0 ? pk([2, 0.5, 0.25]) : tier === 1 ? pk([-1, -2, -0.5]) : pk([-2, -0.5, 2, 0.5, -0.25]);
        if (tier === 0) { if (rnd(2)) h = nz(4); else k = nz(4); } else { h = nz(4); k = nz(4); }
      }
      if (Math.abs(k + 4 * a) > 10) continue;   // the table's outer rows (two from the vertex) stay inside the window, so it never has to zoom out
      return { h: h, k: k, a: a };
      }
      return { h: 1, k: -2, a: 2 };
    }
    return { generate: gdMake21 };
  }
};
