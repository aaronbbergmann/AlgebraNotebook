// Bank question 2.4A-point-intercepts: Point and x-Intercepts (Algebra 2, 2.4 Example 2).
// The story gives the x-intercepts p and q and one more point; the student substitutes into y = a(x - p)(x - q), solves for a,
// graphs the parabola in Desmos and reads the vertex (h or k).
(window.AN_BANK || (window.AN_BANK = {}))["2.4A-point-intercepts"] = {
  id: "2.4A-point-intercepts",
  title: "Point and x-Intercepts",
  section: "2.4",
  example: 2,
  skills: ["intercept form", "substitution", "solve for a", "vertex from a graph", "Desmos graphing"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 1,
  showWork: "GUESS",
  patterns: {"sequence": "Try Another", "calculate": "Try Another", "solo": "Submit"},
  version: 2,   // 2: step commands name the step only (no mechanics instructions)
  build: function () {
    var C2S242 = [
      { pic: "temp", up: true, u: "°C", xu: "hours", s: "A meteorologist models tomorrow's temperature with a parabola. Here " + c2X + " is the number of hours after midnight and " + c2Y + " is the temperature in degrees Celsius.",
        ic: function (P, Q) { return "The temperature is 0 °C at " + P + " and again at " + Q + "."; }, kn: function (X0, P0) { return X0 === 0 ? "At midnight it is " + P0.y + " °C: " + P0.pt + " is the " + c2Y + "-intercept." : "At " + c2X + " = " + X0 + " hours the temperature is " + P0.y + " °C, the point " + P0.pt + "."; },
        qh: "How many hours after midnight is it coldest?", qk: "What is the coldest temperature?", ah: "It is coldest", ak: "The coldest temperature is", ps: [1, 2, 3], ws: [4, 6, 8], as: [0.25, 0.5, 1, 1.5, 2], km: -15, hmax: 5.5 },   // (hmax: the coldest time is in the night, before 6 am)
      { pic: "kick", u: "yards", xu: "yards", s: "A football is kicked downfield. Here " + c2X + " is the distance from the goal line and " + c2Y + " is the height of the ball, both in yards.",
        ic: function (P, Q) { return "It leaves the ground at " + P + " and lands at " + Q + "."; }, kn: function (X0, P0) { return "It passes through " + P0.pt + "."; },
        qh: "How far from the goal line is the ball when it is highest?", qk: "What is the greatest height of the ball?", ah: "The ball is highest", ak: "The greatest height is", ps: [10, 15, 20, 25, 30], ws: [40, 50, 60], as: [0.01, 0.02], km: 20 },
      { pic: "jump", u: "feet", xu: "feet", s: "A dancer leaps across the stage. Here " + c2X + " is the distance from the left edge of the stage and " + c2Y + " is the height of the leap, both in feet.",
        ic: function (P, Q) { return "The dancer takes off at " + P + " and lands at " + Q + "."; }, kn: function (X0, P0) { return "Partway through the leap the dancer passes " + P0.pt + "."; },
        qh: "How far from the left edge is the dancer at the top of the leap?", qk: "How high is the top of the leap?", ah: "The top of the leap is", ak: "The greatest height of the leap is", ps: [0, 2, 4, 6, 8], ws: [4, 6, 8, 10], as: [0.25, 0.5, 1], km: 8 },
      { pic: "arch", u: "meters", xu: "meters", s: "The arch of a footbridge is a parabola. Here " + c2X + " is the distance from the left end of the walkway and " + c2Y + " is the height of the arch, both in meters.",
        ic: function (P, Q) { return "The arch meets the walkway at " + P + " and " + Q + "."; }, kn: function (X0, P0) { return "A lamp hangs from the arch at " + P0.pt + "."; },
        qh: "How far from the left end of the walkway is the top of the arch?", qk: "How tall is the arch at its top?", ah: "The top of the arch is", ak: "The greatest height of the arch is", ps: [0, 2, 4, 5], ws: [10, 12, 16, 20], as: [0.1, 0.2, 0.25, 0.5], km: 20 },
      { pic: "golf", u: "feet", xu: "feet", s: "A golfer chips a ball onto the green. Here " + c2X + " is the distance from the tee marker and " + c2Y + " is the height of the ball, both in feet.",
        ic: function (P, Q) { return "The ball leaves the ground at " + P + " and lands at " + Q + "."; }, kn: function (X0, P0) { return "It flies over a flag at " + P0.pt + "."; },
        qh: "How far from the tee marker is the ball at its highest?", qk: "What is the greatest height of the ball?", ah: "The ball is highest", ak: "The greatest height is", ps: [0, 5, 10, 20], ws: [40, 60, 80, 100], as: [0.01, 0.02, 0.04], km: 40 }
    ];
    function c2M242(tier) {
      var qt = rnd(2) ? "h" : "k", sc = c2Pick(C2S242);
      for (var t = 0; t < 30000; t++) {
        if (t && t % 6000 === 0) { qt = rnd(2) ? "h" : "k"; sc = c2Pick(C2S242); }
        var up = !!sc.up, p = c2Pick(sc.ps), q = p + c2Pick(sc.ws), ap = tier >= 2 && rnd(2), a, X0, Y0, P;
        if (tier === 0 && !up && p > 10) continue;
        if (up) X0 = tier === 0 || rnd(3) ? 0 : c2Pick([1, q + 1, q + 2, Math.round((p + q) / 2) + 1]); else X0 = p + 1 + rnd(q - p - 1);
        if (X0 === p || X0 === q || X0 === (p + q) / 2) continue;
        P = (X0 - p) * (X0 - q); if (!P) continue;
        if (ap) { Y0 = up ? c2Rng(1, 30) : c2Rng(2, sc.km); a = Y0 / P; if (Number.isInteger(c2R(a * 100, 6))) continue; }
        else { a = (up ? 1 : -1) * c2Pick(sc.as); Y0 = c2R(a * P, 6); if (!Number.isInteger(Y0)) continue; }
        var ar = c2R(a, 2); if (!ar || (up ? ar <= 0 : ar >= 0)) continue;
        if (ap && (Math.abs(Math.abs(a * 100 % 1) - 0.5) < 0.02 || Math.abs(ar - a) > Math.abs(a) * 0.12)) continue;
        var h = (p + q) / 2, k = c2R(ar * (h - p) * (h - q), 4);
        if (sc.hmax != null && h > sc.hmax) continue;
        if (!Number.isInteger(c2R(k * 100, 6)) || (up ? k < sc.km || k > -1 : k > sc.km || k < 2)) continue;
        if (up && (Y0 < 1 || Y0 > 30)) continue;
        if (!up && (Y0 < 1 || Y0 >= k)) continue;
        if (tier === 0 && !Number.isInteger(k)) continue;
        var Vs = [p, q, X0, Y0]; if (Vs.some(function (v, i) { return Vs.indexOf(v) !== i; }) || (Y0 === 0)) continue;
        return c2M242Pb(sc, { form: "i", p: p, q: q, h: h, k: k, X0: X0, Y0: Y0, d1: X0 - p, d2: X0 - q, D: P, R: Y0, a: a, ar: ar, ap: !!ap, qt: qt, ans: qt === "h" ? h : k, up: up });
      }
    }
    function c2M242Pb(sc, V) {
      var pb = { kind: 20, sc: sc, vp: V }, p = V.p, q = V.q, h = V.h, k = V.k, ar = V.ar, u = sc.u, xu = sc.xu, Fr = function (x) { return ar * (x - p) * (x - q); };
      V.want = { p: p, q: q, x: V.X0, y: V.Y0 };
      V.why = { p: "p and q are the x-intercepts, " + c2Pt(p, 0) + " and " + c2Pt(q, 0) + ".", q: "p and q are the x-intercepts, " + c2Pt(p, 0) + " and " + c2Pt(q, 0) + ".", x: "x comes from the other point you know, " + c2Pt(V.X0, V.Y0) + ".", y: "y comes from the other point you know, " + c2Pt(V.X0, V.Y0) + "." };
      V.qv = null;
      var qtx = V.qt === "h" ? sc.qh : sc.qk, E = c2If(ar, p, q, c2Y), Ftx = E[0].replace(/<[^>]+>/g, "");
      var P0 = { pt: vpPt(V.X0, V.Y0, "s"), y: c2F(V.Y0) };
      var p0 = V.p0 != null ? V.p0 : p, q0 = V.q0 != null ? V.q0 : q;   // (the story keeps its own order when p and q are swapped)
      pb.head = sc.s + " Intercepts " + c2Pt(p0, 0) + " and " + c2Pt(q0, 0) + ", point " + c2Pt(V.X0, V.Y0) + ". " + qtx;
      pb.pic = c2Pic(sc.pic);
      pb.story = sc.s + " " + sc.ic(vpPt(p0, 0, "s"), vpPt(q0, 0, "s")) + " " + sc.kn(V.X0, P0) + " " + qtx;
      pb.qc = 1;
      pb.ws = function () { return vpWs(pb); };
      pb.fig = function () { return mode === "solo" ? vpOwnPic() : vpSketch(pb); };
      var lo = Math.min(0, p, V.X0), hi = Math.max(q, V.X0);
      pb.dsm = { one: 1, late: 1, F1: Fr, D1: hi, xmax: hi * 1.12 + 1, ymax: V.up ? Math.max(V.Y0, 4) * 1.3 : k * 1.3, ymin: V.up ? k * 1.3 : undefined, l1: "y=" + c2T(ar, 6) + (p ? "\\left(x-" + p + "\\right)" : "x") + "\\left(x-" + q + "\\right)" };
      var N = c2F, Pn = function (v) { return v < 0 ? "(" + N(v) + ")" : N(v); }, sub0 = N(V.Y0) + " = a(" + N(V.X0) + " − " + p + ")(" + N(V.X0) + " − " + q + ")";
      var aTx = (V.ap ? "≈ " : "= ") + N(ar);
      var ws = function (id, type, ask, o) { var s = { id: id, type: type, fine: 1, nol: 1, ask: ask, lab: id }; for (var kk in o) s[kk] = o[kk]; return s; };
      var setS = function (n) { return function (x) { x.vs = n; x.pend = ""; }; };
      var opA = function (id, n) { return function (x) { if (mode === "calculate") x.pend = id; else { x.vs = n; x.pend = ""; } }; };
      var subA = function (key) { return function (x) { x.sb = x.sb || {}; x.sb[key] = 1; }; };
      var askS = "Substitute the intercepts and the other point you know.";   // (the step named only: no mechanics)
      var SUB = [
        ws("sp", "vsub", askS, { k: "p", v: p, after: subA("p"), wl: "y = a(x − p)(x − q)", hint: ["The x-intercepts are " + c2Pt(p, 0) + " and " + c2Pt(q, 0) + ".", "Drag " + N(p) + " onto p."] }),
        ws("sq", "vsub", askS, { k: "q", v: q, after: subA("q"), wl: "", hint: ["The x-intercepts are " + c2Pt(p, 0) + " and " + c2Pt(q, 0) + ".", "Drag " + N(q) + " onto q."] }),
        ws("sx", "vsub", askS, { k: "x", v: V.X0, after: subA("x"), wl: "", hint: ["The point you know (not an intercept) is " + c2Pt(V.X0, V.Y0) + ".", "Drag " + N(V.X0) + " onto x."] }),
        ws("sy", "vsub", askS, { k: "y", v: V.Y0, after: subA("y"), wl: sub0, hint: ["The point you know is " + c2Pt(V.X0, V.Y0) + ".", "Drag " + N(V.Y0) + " onto y."] })
      ];
      var o1 = ws("o1", "vop", "Simplify the first parentheses.", { op: "o1", after: opA("o1", 1), wl: N(V.Y0) + " = a(" + N(V.d1) + ")(" + N(V.X0) + " − " + q + ")", hint: ["Work inside the parentheses first.", "Click the − between " + N(V.X0) + " and " + p + "."] });
      var c1 = ws("c1", "num", "Work it out.", { pre: N(V.X0) + " − " + p + " =", ans: V.d1, after: setS(1), wl: "", hint: ["Subtract.", N(V.X0) + " − " + p + " = " + N(V.d1) + "."] });
      var o2 = ws("o2", "vop", "Simplify the second parentheses.", { op: "o2", after: opA("o2", 2), wl: N(V.Y0) + " = a(" + N(V.d1) + ")(" + N(V.d2) + ")", hint: ["Work inside the second parentheses.", "Click the − between " + N(V.X0) + " and " + q + "."] });
      var c2 = ws("c2", "num", "Work it out.", { pre: N(V.X0) + " − " + q + " =", ans: V.d2, after: setS(2), wl: "", hint: ["Subtract.", N(V.X0) + " − " + q + " = " + N(V.d2) + "."] });
      var o3 = ws("o3", "vop", "Multiply.", { op: "o3", after: opA("o3", 3), wl: N(V.Y0) + " = " + N(V.D) + "a", hint: ["The two numbers in parentheses multiply.", "Click (" + N(V.d1) + ")(" + N(V.d2) + ")."] });
      var c3 = ws("c3", "num", "Work it out.", { pre: "(" + N(V.d1) + ")(" + N(V.d2) + ") =", ans: V.D, after: setS(3), wl: "", hint: ["Multiply the two numbers.", "(" + N(V.d1) + ")(" + N(V.d2) + ") = " + N(V.D) + "."], wrong: function (v) { return v === -V.D ? "Check the sign: " + (V.D < 0 ? "a positive times a negative is negative." : "two negatives (or two positives) make a positive.") : ""; } });
      var dv = ws("dv", "vdv", "Undo the multiplication.", { after: setS(5), wl: N(V.Y0) + "/" + Pn(V.D) + " = a", hint: [N(V.D) + " multiplies a. Undo it by dividing.", "Drag " + N(V.D) + " across the = sign."] });
      var o4 = ws("o4", "vop", "Divide." + (V.ap ? " Round to the nearest hundredth." : ""), { op: "o4", dfr: [V.Y0, V.D], after: opA("o4", 6), wl: "a " + aTx, hint: ["A fraction bar means divide.", "Click the bar between " + N(V.Y0) + " and " + N(V.D) + "."] });
      var c4 = ws("c4", "num", "Work it out.", { pre: N(V.Y0) + " ÷ " + Pn(V.D) + " =", post: V.ap ? "(to the nearest hundredth)" : "", ans: V.a, tol: V.ap ? 0.005 + 1e-9 : 1e-9, after: setS(6), wl: "", hint: ["Divide." + (V.ap ? " Round to the nearest hundredth." : ""), N(V.Y0) + " ÷ " + Pn(V.D) + " " + aTx + "."] });
      var gr = { id: "gr", fine: 1, lab: "Graph", type: "dsm", ask: "Graph " + E[0] + " in Desmos.", line: "graphed " + Ftx + " in Desmos", hint: ["Type the equation on the first line of Desmos.", "Type " + E[1] + "."] };
      var isH = V.qt === "h";
      var ansA = function () { return qtx; };
      var ans = { id: "ans", lab: isH ? "h" : "k", ask: ansA, pre: isH ? "<i>h</i> =" : "<i>k</i> =", post: isH ? xu : u, ans: V.ans, tol: 0.051,
        nums: isH ? [p, q, k, V.X0] : [h, V.Y0, -k, c2R(V.a * (h - p) * (h - q), 1)],
        line: isH ? "the vertex is at " + c2X + " = " + N(h) + " " + xu : "the vertex is at height " + N(k) + " " + u,
        hint: [isH ? "The vertex is halfway between the x-intercepts." : "The " + (V.up ? "lowest" : "highest") + " point of the parabola is the vertex; read its y-coordinate.", "The vertex is (" + N(h) + ", " + N(k) + ")."],
        dpre: function (run, then) { vpDsmAns(pb, run, then); } };
      var frm = ws("frm", "vfrm", "Write the intercept form of a parabola.", { typed: "y=a(x-p)(x-q)", after: function (x) { x.frm = 1; }, wl: "y = a(x − p)(x − q)", chk: vpFrmOkI, hint: ["Intercept form shows the x-intercepts p and q.", "y = a(x − p)(x − q)"] });
      pb.isteps = SUB.concat([o1, o2, o3, dv, o4, gr, ans]);
      var S2 = SUB.map(function (s) { var c = {}; for (var kk in s) c[kk] = s[kk]; return c; }); S2[0].wl = "";
      pb.csteps = [frm].concat(S2, [o1, c1, o2, c2, o3, c3, dv, o4, c4, gr, ans]);
      pb.steps = [ans];   // (Write: the answer alone, with Desmos)
      var stmt = isH ? sc.ah + " " + N(h) + " " + xu + (V.up ? " after midnight." : " from the start of the " + c2X.replace(/<[^>]+>/g, "") + "-axis.") : sc.ak + " " + N(k) + " " + u + ".";
      if (isH && !V.up) stmt = sc.ah + " at " + c2X.replace(/<[^>]+>/g, "") + " = " + N(h) + " " + xu + ".";
      pb.ex = "The x-intercepts are " + p + " and " + q + ", and the parabola passes through " + c2Pt(V.X0, V.Y0) + ", so " + sub0 + ". Then " + N(V.Y0) + " = " + N(V.D) + "a, so a = " + N(V.Y0) + "/" + Pn(V.D) + " " + aTx + ". In Desmos, " + Ftx + " has its vertex at (" + N(h) + ", " + N(k) + "). " + stmt;
      var gV = function (n) { return function (x) { return (x.vs || 0) >= n; }; }, gD = Number.isInteger(V.ans) ? "= " : "≈ ";
      pb.guess = { G: [[gqM("x") + "-intercepts " + gqM("p = " + N(p)) + " and " + gqM("q = " + N(q)) + " " + xu], ["point " + gqM("(x, y) = (" + N(V.X0) + ", " + N(V.Y0) + ")")]],
        U: [[gqM("a = ?")], [isH ? gqM("h = ?") + " " + xu + ", the " + c2X.replace(/<[^>]+>/g, "") + "-coordinate of the vertex" : gqM("k = ?") + " " + u + ", the " + c2Y.replace(/<[^>]+>/g, "") + "-coordinate of the vertex"]],
        E: [[gqM("y = a(x − p)(x − q)"), function (x, dn) { return dn.frm || dn.sp || (x.sb && (x.sb.p || x.sb.q || x.sb.x || x.sb.y)); }]],
        S1: [[gqM(sub0), function (x) { var b = x.sb || {}; return b.p && b.q && b.x && b.y; }]],
        S2: [[gqM(N(V.Y0) + " = a(" + N(V.d1) + ")(" + N(V.X0) + " − " + q + ")"), gV(1)], [gqM(N(V.Y0) + " = a(" + N(V.d1) + ")(" + N(V.d2) + ")"), gV(2)], [gqM(N(V.Y0) + " = " + N(V.D) + "a"), gV(3)], [gqM("a = " + N(V.Y0) + " ÷ " + Pn(V.D)), gV(5)], [gqM("a " + aTx), gV(6)], [gqM(Ftx), gV(6)],
          [gqM("vertex (h, k) " + gD + "(" + N(h) + ", " + N(k) + ")") + " (from the graph in Desmos)", ["ans"]]],
        A: [[stmt, ["ans"]]] };
      return pb;
    }
    return { generate: c2M242, scenarios: C2S242, makePb: c2M242Pb };
  }
};
