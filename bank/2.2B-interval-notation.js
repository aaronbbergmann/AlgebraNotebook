// Bank question 2.2B-interval-notation: Interval Notation (Algebra 2, 2.2 Example 6).
(window.AN_BANK || (window.AN_BANK = {}))["2.2B-interval-notation"] = {
  id: "2.2B-interval-notation",
  title: "Interval Notation",
  section: "2.2",
  example: 6,
  skills: ["interval notation"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 1,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    // the problems: a round gets harder (a ray; two boundaries, or a ray written backwards; mixed dots, or "or")
    function c2M226(tier) {
      var demo = mode === "demo", st = c2Pick(tier === 0 ? [1, 1, 2] : tier === 1 ? [1, 2, 5] : [2, 5, 10]), m0 = st * c2Rng(-4, 0), M = [0, 1, 2, 3, 4].map(function (i) { return m0 + i * st; });
      var kind = demo ? "mix" : tier === 0 ? "one" : tier === 1 ? c2Pick(["two", "mix", "one"]) : c2Pick(["mix", "mix", "two"]), cl = function () { return !!rnd(2); }, pcs, flip = false, i, j;
      if (kind === "one") { var b = M[1 + rnd(3)], c = cl(); pcs = [rnd(2) ? ivPc({ v: -IVI }, { v: b, cl: c }) : ivPc({ v: b, cl: c }, { v: IVI })]; flip = tier === 1; }
      else if (kind === "or") { i = rnd(2); j = i + 2 + rnd(3 - i); pcs = [ivPc({ v: -IVI }, { v: M[i], cl: cl() }), ivPc({ v: M[j], cl: cl() }, { v: IVI })]; }
      else { i = rnd(3); j = i + 2 + rnd(3 - i); var c1 = cl(), c2 = kind === "mix" ? !c1 : c1; pcs = [ivPc({ v: M[i], cl: c1 }, { v: M[j], cl: c2 })]; }
      var show = ivGr() ? "graph" : mode === "calculate" ? "both" : tier === 0 ? "ineq" : tier === 1 ? "line" : c2Pick(["ineq", "line"]);
      var P = { M: M, pcs: pcs, flip: flip, show: show }, pb = { kind: 26, iv: P, pic: "" };
      pb.head = ivIneq(P, true);
      pb.story = show === "line" ? "Write the numbers graphed on the number line in interval notation." : (ivGr() ? "Graph " : "Write ") + "<span class=\"lm\">" + ivIneq(P) + "</span>" + (ivGr() ? " on the number line." : " in interval notation.");
      pb.fig = function () { return ""; };
      pb.steps = [{ id: "iv", lab: "Interval notation", type: "ivn", ask: "" }];
      pb.ex = "A closed dot and a bracket [ ] mean the boundary is included (≤ or ≥); an open dot and a parenthesis ( ) mean it is not (< or >). ∞ and −∞ always take a parenthesis. " + ivIneq(P, true) + " in interval notation is " + ivStr(pcs) + ".";
      return pb;
    }
    return { generate: c2M226 };
  }
};
