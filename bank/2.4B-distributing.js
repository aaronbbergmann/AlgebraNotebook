// Bank question 2.4B-distributing: Distributing (Algebra 2, 2.4 Example 8).
// Distribute with the 1 x 2 box: 3(x - 2) = 3x - 6. Used by 2.4B and 3.1D Box Method. Returns the items.
(window.AN_BANK || (window.AN_BANK = {}))["2.4B-distributing"] = {
  id: "2.4B-distributing", version: 1, title: "Distributing", section: "2.4", example: 8,
  skills: ["distributing", "box method"], tiers: [0], modes: ["demo", "sequence", "calculate", "solo"], engine: "equation", writeRounds: 2, showWork: "steps",
  patterns: { sequence: "Try Another", calculate: "Try Another", solo: "Submit" },
  build: function () {
    var X = function (a) { return { k: "x", v: "x", n: mk(a) }; }, C = function (c) { return { k: "c", n: mk(c) }; };
    return { generate: function () {
      var m8 = (rnd(5) ? 1 : -1) * (2 + rnd(8)), k8 = rnd(4) ? 1 : 2 + rnd(3), c8 = nz(9);
      return [{ k: "g", m: mk(m8), items: [X(k8), C(c8)] }];
    } };
  }
};
