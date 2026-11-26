// Bank question 3.1B-square-roots-simplify: Square Roots: Simplify (Algebra 2, 3.1B, exercise 17).
// x^2 = 32 -> x = +-4 sqrt(2). Its own generator (below); the engine builds the equation from what it returns.
(window.AN_BANK || (window.AN_BANK = {}))["3.1B-square-roots-simplify"] = {
  id: "3.1B-square-roots-simplify", version: 1, title: "Square Roots: Simplify", section: "3.1", example: 17,
  skills: ["square roots", "simplifying radicals"], tiers: [0], modes: ["demo", "sequence", "calculate", "solo"], engine: "equation", writeRounds: 2, showWork: "steps",
  patterns: { sequence: "Try Another", calculate: "Try Another", solo: "Submit" },
  solve: { sqh: 1 },
  build: function () {
    return { generate: function () {
      var X2h = function (q) { return { k: "x", v: "x^2", n: mk(q) }; }, Ch = function (q) { return { k: "c", n: mk(q) }; }, rh, mh, vh, Lh, Rh, form = mode === "demo" ? 0 : rnd(4), grp = false;
      do { rh = 2 + rnd(5); mh = [2, 3, 5, 6, 7][rnd(5)]; vh = rh * rh * mh; } while (vh > 300);
      if (form === 0) { Lh = [X2h(1)]; Rh = [Ch(vh)]; }
      else if (form === 1) { var ah = 2 + rnd(3); Lh = [X2h(ah)]; Rh = [Ch(ah * vh)]; }
      else if (form === 2) { var bh = nz(12); Lh = [X2h(1), Ch(bh)]; Rh = [Ch(vh + bh)]; if (rnd(2)) Lh.reverse(); }
      else { var hh = nz(6), items = [{ k: "x", v: "x", n: mk(1) }, Ch(-hh)]; Lh = [{ k: "g", m: mk(1), items: items, b: JSON.parse(JSON.stringify(items)), pw: true }]; Rh = [Ch(vh)]; grp = true; }
      return { L: Lh, R: Rh, grp: grp };
    } };
  }
};
