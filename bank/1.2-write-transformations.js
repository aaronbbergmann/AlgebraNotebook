// Bank question 1.2-write-transformations: Writing Transformations (Algebra 2, 1.2 Example 1).
// Used by 1.2A Translations and Stretches, 1.2B Reflections, 1.2C Combining and Profit (each kind chosen by the exercise) and RevT1 Q4. generate(n) returns n different problems.
(window.AN_BANK || (window.AN_BANK = {}))["1.2-write-transformations"] = {
  id: "1.2-write-transformations",
  title: "Writing Transformations",
  section: "1.2",
  example: 1,
  skills: ["translations", "reflections", "stretches", "writing functions"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "write-function",
  writeRounds: 3,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    // tier 0: the plain line f(x) = x + b moved one way only; tier 1: a line with a slope or an absolute value, still one way only;
    // tier 2: moved sideways and up or down (like the last problems of the textbook's practice, which grow harder)
    function wfMake(tier) {
      if (wfL() === 2) return wfMakeR(tier);
      if (wfL() === 3) return wfMakeS(tier);
      if (wfL() === 4) return wfMakeC(tier);
      if (wfL() === 5) return wfMakeP(tier);
      for (var t = 0; t < 400; t++) {
        var ab = tier === 0 ? false : rnd(2) === 1, p;
        if (tier === 0) p = { fam: 1, fa: 1, fh: 0, fk: rnd(9) - 4 };
        else p = ab ? { fam: 2, fa: [1, 1, 2, -1, 3, -2][rnd(6)], fh: rnd(5) - 2, fk: rnd(7) - 3 } : { fam: 1, fa: [2, 3, -1, -2, -3][rnd(5)], fh: 0, fk: rnd(9) - 4 };
        var side = rnd(2) === 1;   // one way only: sideways or up/down
        p.dh = tier === 2 ? wfNz(5) : side ? wfNz(tier === 0 ? 4 : 5) : 0; p.dk = tier === 2 ? wfNz(5) : side ? 0 : wfNz(tier === 0 ? 4 : 5); wfG(p);
        if (p.fam === 1 && p.g.k === p.fk) continue;
        if (Math.abs(p.g.k) > 8 || Math.abs(p.g.h) > 7) continue;
        return p;
      }
    }
    // a round gets harder as it goes: the first problem is the simplest, the last the hardest
    function wfSet(n) {
      if (n === 1) return [wfMake(0)];   // the Demo always starts with the simplest kind: a plain line, moved one way (or reflected in the x-axis, or stretched)
      var out = [], key = function (p) { return JSON.stringify([p.fam, p.fa, p.fh, p.fk, p.dh, p.dk, p.rf, p.scn, p.scd, p.comb && p.comb.map(function (c) { return [c.dh, c.dk, c.rf, c.scn, c.scd]; })]); };
      while (out.length < n) { var p = wfMake(Math.min(out.length, 2)); if (!out.some(function (o) { return key(o) === key(p) || (p.ctx && o.ctx && o.ctx.sc === p.ctx.sc); })) out.push(p); }
      return out;
    }
    return { generate: wfSet };
  }
};
