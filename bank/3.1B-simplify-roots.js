// Bank question 3.1B-simplify-roots: Simplifying Square Roots (Algebra 2, 3.1 Example 16).
(window.AN_BANK || (window.AN_BANK = {}))["3.1B-simplify-roots"] = {
  id: "3.1B-simplify-roots",
  title: "Simplifying Square Roots",
  section: "3.1",
  example: 16,
  skills: ["square roots", "product property"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 1,
  showWork: "QWA",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    function c3M16(tier) {
      var q = C3PSF[rnd(C3PSF.length)], a = q[0], b = q[1], c = a / b, d = Math.round(Math.sqrt(b)), pb = { kind: 20 };
      var nsf = []; for (var f = 2; f < a; f++) if (a % f === 0 && !isSq(f)) nsf.push(f); var inc1 = nsf[rnd(nsf.length)],   /* (the wrong choice is another factor of a, one that is not a perfect square) */ inc2 = c === d ? b : d, inc3 = d === 2 ? 3 : d === c && d > 2 ? 2 : c;
      pb.head = "√" + a; pb.pic = "";
      pb.story = ""; pb.noCueW = 1; pb.noList = 1; pb.noArrow = 1;   // (no list of the steps done under the instruction: the work is in the centre pane) (every mode starts with √a alone, shown large below; Write: no list of the parts)
      Object.defineProperty(pb, "tq", { get: function () { return mode === "solo" ? "" : "<div class=\"regQ\">Simplify.</div>"; } });   // (the instruction; Write asks "Simplify √a" itself, above its box)
      pb.ws = function () {   // the work, built up as each answer is given (Demo, Sequence, Calculate): √a, then √b · √c, then d√c
        if (mode === "solo") return QZ.m3done ? "<div class=\"c3Eq lm\" style=\"font-size:40px;flex-direction:column;align-items:center;gap:6px\"><div>" + c3Rt(a) + "</div><div>" + c3Rt(b) + " · " + c3Rt(c) + "</div><div>" + c3Rt(c, d) + "</div></div>" : "";   /* (Write, once right: the three lines of Show work, without = signs) */   // (Write: "Simplify √a" and its box, in the centre; once right, √a = d√c)
        var x = QZ.m3x || {}, Q = "<span class=\"c3Q\">?</span>";
        var l2 = x.ps ? c3Rt(b) + " · " + c3Rt(x.lf ? c : Q) : "", l3 = x.lf ? (x.sr ? c3Rt(c, d) : Q + c3Rt(c)) : "", line = function (t) { return t ? "<div>" + t + "</div>" : "<div style=\"visibility:hidden\">" + c3Rt(b) + "</div>"; };   /* (each line alone, without an = sign) */   // (it starts with √a alone; each line comes as it is found, in a place kept for it)
        return "<div class=\"c3Eq lm\" style=\"font-size:40px;flex-direction:column;align-items:center;gap:6px\"><div>" + c3Rt(a) + "</div>" + line(l2) + line(l3) + "</div>";
      };
      pb.fig = function () { return ""; };
      var two = function (good, bad) { return m3Sh([{ t: String(good), ok: true }, { t: String(bad), ok: false, why: "" }]); };
      pb.isteps = [
        { id: "ps", lab: "perfect square factor", type: "pick", ask: "Which is a perfect square factor of " + a + "?", opts: m3Sh([{ t: String(b), ok: true }, { t: String(inc1), ok: false, why: inc1 + " is a factor of " + a + ", but it is not a perfect square." }]), after: function (x) { x.ps = true; }, hint: ["Perfect squares: 4, 9, 16, 25, 36, 49, 64, 81, 100.", b + " · " + c + " = " + a + "."], line: c3Rt(a) + " = " + c3Rt(b) + " · " + c3Rt("?") },
        { id: "lf", lab: "leftover factor", type: "pick", ask: "Which is the other leftover factor?", opts: m3Sh([{ t: String(c), ok: true }, { t: String(inc2), ok: false, why: b + " · " + inc2 + " is not " + a + "." }]), after: function (x) { x.lf = true; }, hint: [a + " ÷ " + b + " = ?", a + " ÷ " + b + " = " + c + "."], line: c3Rt(a) + " = " + c3Rt(b) + " · " + c3Rt(c) },
        { id: "sr", lab: "square root", type: "pick", ask: "What is the square root of " + b + "?", opts: m3Sh([{ t: String(d), ok: true }, { t: String(inc3), ok: false, why: inc3 + " · " + inc3 + " is not " + b + "." }]), after: function (x) { x.sr = true; }, hint: ["What number times itself is " + b + "?", d + " · " + d + " = " + b + "."], line: c3Rt(a) + " = " + c3Rt(c, d) }
      ];
      pb.steps = [
        { id: "ps", lab: "perfect square factor", ask: "What is the largest perfect square factor of " + a + "?", pre: "", ans: b, nums: [inc1, a / 2, c], after: function (x) { x.ps = true; }, hint: pb.isteps[0].hint, line: pb.isteps[0].line },
        { id: "lf", lab: "leftover factor", ask: "What is the other leftover factor?", pre: "", ans: c, nums: [inc2, b, a - b], after: function (x) { x.lf = true; }, hint: pb.isteps[1].hint, line: pb.isteps[1].line },
        { id: "sr", lab: "square root", ask: "What is the square root of " + b + "?", pre: "", ans: d, nums: [inc3, b / 2, d + 1], after: function (x) { x.sr = true; }, hint: pb.isteps[2].hint, line: pb.isteps[2].line }
      ];
      pb.steps.forEach(function (st) { st.wno = 1; });   // (Calculate keeps the three typed answers; Write has one box, below)
      pb.steps.push({ id: "ans", lab: "simplified", ask: "Simplify " + c3Rt(a), pre: "", ans: d, ansT: d + "√" + c, rootKey: 1, so: 1,
        okf: function (raw) {   // the simplified form typed, like 5√2 (5·√2, 5 sqrt(2) and 5√(2) are read too)
          var t = String(raw).replace(/\s+/g, "").replace(/sqrt/gi, "√").replace(/[*·]/g, "").replace(/√\((\d+)\)/g, "√$1"), m = /^(\d*)√(\d+)$/.exec(t);
          if (!m) return { ok: false, msg: "Type the simplified square root, like 5√2." };
          var k = m[1] === "" ? 1 : +m[1], r = +m[2]; if (Math.abs(k * k * r - a) > 1e-9) return { ok: false, msg: "Not quite." };
          if (r !== c) return { ok: false, msg: "That is equal to √" + a + ", but it can be simplified more." };
          return { ok: true, show: c3Rt(c, d) };
        }, hint: pb.isteps[0].hint, line: c3Rt(a) + " = " + c3Rt(b) + " · " + c3Rt(c) + " = " + c3Rt(c, d) });
      pb.qwa = { Q: [[c3Rt(a)]], W: [[c3Rt(b) + " · " + c3Rt("?"), ["ps"]], [c3Rt(b) + " · " + c3Rt(c), ["lf", "ans"]]], A: [[c3Rt(c, d), ["sr", "ans"]]] };
      return pb;
    }
    return { generate: c3M16 };
  }
};
