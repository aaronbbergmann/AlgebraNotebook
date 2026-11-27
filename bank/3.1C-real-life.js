// Bank question 3.1C-real-life: Real Life (Algebra 2, 3.1 Example 4).
(window.AN_BANK || (window.AN_BANK = {}))["3.1C-real-life"] = {
  id: "3.1C-real-life",
  title: "Real Life",
  section: "3.1",
  example: 4,
  skills: ["square roots", "inverse operations", "modeling"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 1,
  showWork: "GUESS",
  patterns: {"solo": "Submit"},
  version: 2,   // 2: supplemental text (rounding) in its one place, the smaller line just below the step
  build: function () {
    // 3.1C the dropped object: h(t) = −16t² + s₀ in the centre pane.  The student drags the place it lands ("the ground": h = 0) onto h(t) and the height onto s₀,
    // then undoes the operations in order, as in Play Solve: drag + s₀ across the =, click the subtraction, drag −16 across (it divides), click the fraction bar,
    // drag the exponent across (it becomes ±√), click the root, and keeps the positive time.  Calculate asks each value; Write: the answer alone
    function c3Drop(tier) {
      var sc = c2Pick(C3DROP), s0 = 0, n = 0;
      if (rnd(3) === 0) { n = c2Pick([1, 4, 9, 16, 25]); s0 = 16 * n; } else { do { s0 = c2Rng(20, 320); n = s0 / 16; } while (Number.isInteger(Math.sqrt(n))); }   // (most need a calculator: 150 ÷ 16 = 9.375, √9.375 ≈ 3.1)
      var r = Math.sqrt(n), sq = Number.isInteger(r), Tr = c2R(r, 1), pb = { kind: 20 };
      var place = /\{([^}]*)\}/.exec(sc[1])[1], ground = "<span class=\"vpN vpG\" data-vpsrc=\"sg\" data-vpv=\"0\">" + place + "</span>";
      pb.head = sc[0] + s0 + sc[1].replace(/[{}]/g, "") + " How long does it take to hit " + place.replace(/^the /, "the ") + "?";
      pb.pic = c2Pic("drop");
      var story0 = sc[0] + vpN(s0, "ss") + sc[1].replace(/\{[^}]*\}/, ground), fml = " A dropped object's height is <span class=\"lm\"><i>h</i>(<i>t</i>) = −16<i>t</i>² + <i>s</i><sub>0</sub></span>.";
      Object.defineProperty(pb, "story", { get: function () { return story0 + (mode === "solo" ? fml : ""); } });   // (Write: the formula in the story; the other modes: large, in the centre)
      pb.tq = "<div class=\"regQ\">How long does it take to hit " + place + "?</div><div class=\"supp\"><i>t</i> = seconds, <i>h</i> = height in feet." + (sq ? "" : " Round to the nearest tenth.") + "</div>";
      pb.dsm = { calc: 1 };   // (Calculate and Write: Desmos to divide and take the root; nothing is checked in it)
      pb.qc = 1; pb.vp = { form: "d", s0: s0, n: n, r: r, sq: sq, Tr: Tr, k: s0, D: -16, Dg: "(−16)", want: { h: 0, s: s0 }, why: { h: "h(t) is the height. On " + place + ", the height is 0.", s: "s₀ is the height it starts from, " + s0 + " feet." }, place: place };
      pb.ws = function () { return vpWs(pb); };
      pb.fig = function () { return ""; };
      var ws = function (id, type, ask, o) { var st = { id: id, type: type, fine: 1, nol: 1, ask: ask, lab: id }; for (var kk in o) st[kk] = o[kk]; return st; };
      var setS = function (k) { return function (x) { x.vs = k; x.pend = ""; }; };
      var opA = function (id, k) { return function (x) { if (mode === "calculate") x.pend = id; else { x.vs = k; x.pend = ""; } }; };
      var subA = function (key) { return function (x) { x.sb = x.sb || {}; x.sb[key] = 1; }; };
      var askS = "";   // (no instructions on dragging: the Demo shows it)
      var SUB = [
        ws("sh", "vsub", askS, { k: "h", v: 0, after: subA("h"), hint: ["On " + place + ", the height is 0.", "Drag \u201c" + place + "\u201d onto h(t)."] }),
        ws("ss", "vsub", askS, { k: "s", v: s0, after: subA("s"), hint: ["It starts " + s0 + " feet up.", "Drag " + s0 + " onto s₀."] })
      ];
      var rt = sq ? String(r) : "≈ " + c2F(Tr), tA = sq ? "<i>t</i> = " + r : "<i>t</i> ≈ " + c2F(Tr);
      var mv = ws("mv", "vmv", "Undo the addition.", { after: setS(1), hint: ["The " + s0 + " is added to −16t².", "Drag + " + s0 + " across the = sign. It becomes − " + s0 + "."] });
      var o1 = ws("o1", "vop", "Subtract.", { op: "o1", after: opA("o1", 2), hint: ["Combine 0 − " + s0 + ".", "Click the − between 0 and " + s0 + "."] });
      var c1 = ws("c1", "num", "Work it out.", { pre: "0 − " + s0 + " =", ans: -s0, after: setS(2), hint: ["Subtract.", "0 − " + s0 + " = −" + s0 + "."] });
      var dv = ws("dv", "vdv", "Undo the multiplication.", { after: setS(3), hint: ["−16 multiplies t². Undo it by dividing.", "Drag −16 across the = sign."] });
      var o2 = ws("o2", "vop", "Divide.", { op: "o2", after: opA("o2", 4), hint: ["A fraction bar means divide.", "Click the bar between −" + s0 + " and −16."] });
      var c2 = ws("c2", "num", "Work it out.", { pre: "−" + s0 + " ÷ (−16) =", ans: n, tol: Number.isInteger(n) ? 1e-9 : 0.0051, after: setS(4), hint: ["A negative divided by a negative is positive.", "−" + s0 + " ÷ (−16) = " + n + "."] });
      var ex = ws("ex", "vex", "Undo the exponent.", { after: setS(5), hint: ["The square root undoes the square.", "Drag the 2 across the = sign. It becomes ±√."] });
      var o3 = ws("o3", "vop", "Take the square root." + (sq ? "" : "<span class=\"supp\">Round to the nearest tenth.</span>"), { op: "o3", after: opA("o3", 6), hint: [sq ? "What number times itself is " + n + "?" : "√" + n + " is between " + Math.floor(r) + " and " + Math.ceil(r) + ".", "√" + n + " " + (sq ? "= " + r : "≈ " + c2F(Tr)) + "."] });
      var c3 = ws("c3", "num", "Work it out." + (sq ? "" : "<span class=\"supp\">Round to the nearest tenth.</span>"), { pre: "√" + n + " " + (sq ? "=" : "≈"), post: "", ans: sq ? r : Tr, tol: sq ? 1e-9 : 0.051, after: setS(6), hint: [sq ? "What number times itself is " + n + "?" : "Use a calculator, then round.", "√" + n + " " + (sq ? "= " + r : "≈ " + c2F(Tr)) + "."] });
      var ng = ws("ng", "pick", "Which solution answers the question?", { opts: m3Sh([{ t: sq ? "t = " + r : "t ≈ " + c2F(Tr), ok: true }, { t: sq ? "t = −" + r : "t ≈ −" + c2F(Tr), ok: false, why: "A time cannot be negative." }]), after: setS(7), hint: ["Time is counted forward from the drop.", "A time cannot be negative: keep the positive solution."] });
      var ans = { id: "ans", lab: "Time", ask: "How long does it take to hit " + place + "?", pre: sq ? "<i>t</i> =" : "<i>t</i> ≈", post: "s", ans: sq ? r : Tr, tol: sq ? 1e-9 : 0.051,
        nums: [n, c2R(s0 / 16 / 2, 1), c2R(r * 2, 1)].filter(function (v, j, A) { return Math.abs(v - Tr) > 0.06 && A.indexOf(v) === j; }),
        hint: ["Set h(t) = 0: 0 = −16t² + " + s0 + ".", "t² = " + n + ", so t = √" + n + " " + (sq ? "= " + r : "≈ " + c2F(Tr)) + " (a time is not negative)."], line: "it hits " + place + " after " + (sq ? "" : "about ") + c2F(Tr) + " seconds" };
      pb.isteps = SUB.concat([mv, o1, dv, o2, ex, o3, ng]);
      pb.csteps = SUB.concat([mv, o1, c1, dv, o2, c2, ex, o3, c3, ng]);
      pb.steps = [ans];   // (Write: the answer alone)
      var gV = function (k) { return function (x) { return (x.vs || 0) >= k && !(x.pend && (x.vs || 0) === k - 1); }; };
      var gM = function (t) { return "<span class=\"lm\">" + t + "</span>"; };
      pb.guess = { G: [["<i>s</i><sub>0</sub> = " + s0 + " ft", function (x, dn) { return (x.sb && x.sb.s) || dn.ans; }], ["<i>h</i>(<i>t</i>) = 0 on " + place, function (x, dn) { return (x.sb && x.sb.h) || dn.ans; }]],
        U: [["<i>t</i> = ? seconds", null]],
        E: [[gM("<i>h</i>(<i>t</i>) = −16<i>t</i>² + <i>s</i><sub>0</sub>"), null]],
        S1: [[gM("0 = −16<i>t</i>² + " + s0), function (x, dn) { return (x.sb && x.sb.h && x.sb.s) || dn.ans; }]],
        S2: [[gM("−" + s0 + " = −16<i>t</i>²"), gV(2)], [gM(n + " = <i>t</i>²"), gV(4)], [gM("±√" + n + " = <i>t</i>"), gV(5)], [gM("<i>t</i> " + (sq ? "= ±" + r : "≈ ±" + c2F(Tr))), gV(6)], ["a time is not negative: " + gM(tA), gV(7)]],
        A: [["It hits " + place + " after " + (sq ? "" : "about ") + c2F(Tr) + " seconds.", function (x, dn) { return (x.vs || 0) >= 7 || dn.ans; }]] };
      return pb;
    }
    function c3M4(tier) { return c3Drop(tier); }   // 3.1C Real Life: the dropped object, solved algebraically
    return { generate: c3M4 };
  }
};
