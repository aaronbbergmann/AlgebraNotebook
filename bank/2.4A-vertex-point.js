// Bank question 2.4A-vertex-point: Vertex and a Point (Algebra 2, 2.4 Example 1).
// The story gives the vertex of a path and one more point on it; the student substitutes into y = a(x - h)^2 + k, solves for a,
// graphs the parabola in Desmos and answers a question about a third point.  Used by 2.4A and 3.1C.
(window.AN_BANK || (window.AN_BANK = {}))["2.4A-vertex-point"] = {
  id: "2.4A-vertex-point",
  version: 2,   // 2: step commands name the step only (no mechanics instructions)
  title: "Vertex and a Point",
  section: "2.4", example: 1,
  skills: ["vertex form", "substitution", "solve for a", "Desmos graphing"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 1,
  showWork: "GUESS",
  patterns: { sequence: "Try Another", calculate: "Try Another", solo: "Submit" },
  build: function () {
    var C2S241 = [
      { pic: "human", s: "A performer is shot out of a cannon and flies into a net.", st: "leaves the cannon", en: "drops into the net", qE: function (X) { return "The net is " + X + " feet from the cannon, horizontally. How high is the net?"; }, qS: "At what height does the performer leave the cannon (where " + c2X + " = 0)?", qT: function (Y) { return "The net is " + Y + " feet off the ground. How far from the cannon is the net, horizontally?"; }, qG: "If the net were not there, how far from the cannon would the performer reach the ground (where " + c2Y + " = 0)?" },
      { pic: "ramp", s: "A stunt rider jumps off one ramp and lands on a second ramp.", st: "leaves the first ramp", en: "touches down on the second ramp", qE: function (X) { return "The rider touches down " + X + " feet from the first ramp. How high is the second ramp there?"; }, qS: "How high is the end of the first ramp (where " + c2X + " = 0)?", qT: function (Y) { return "The rider touches down on the second ramp at a height of " + Y + " feet. How far is that from the first ramp, horizontally?"; }, qG: "If the second ramp were not there, how far from the first ramp would the rider reach the ground (where " + c2Y + " = 0)?" },
      { pic: "ball", s: "A ball is thrown from a balcony to a friend.", st: "leaves the thrower's hand", en: "is caught", qE: function (X) { return "The friend catches it " + X + " feet away, horizontally. How high is the friend's glove?"; }, qS: "How high is the thrower's hand (where " + c2X + " = 0)?", qT: function (Y) { return "The friend catches it " + Y + " feet above the ground, on its way down. How far away is the friend, horizontally?"; }, qG: "If nobody caught it, how far away would it hit the ground (where " + c2Y + " = 0)?" },
      { pic: "skier", s: "A water skier goes off a jump and lands on a floating platform.", st: "leaves the jump", en: "lands on the platform", qE: function (X) { return "The platform is " + X + " feet from the jump. How high is the platform?"; }, qS: "How high is the top of the jump (where " + c2X + " = 0)?", qT: function (Y) { return "The platform is " + Y + " feet high. How far from the jump is the platform, horizontally?"; }, qG: "If the platform were not there, how far from the jump would the skier reach the water (where " + c2Y + " = 0)?" },
      { pic: "cannon", s: "A water cannon at a splash park shoots a stream of water into a bucket.", st: "leaves the nozzle", en: "pours into the bucket", qE: function (X) { return "The bucket is " + X + " feet from the cannon. How high is the bucket's rim?"; }, qS: "How high is the nozzle (where " + c2X + " = 0)?", qT: function (Y) { return "The bucket's rim is " + Y + " feet high. How far from the cannon is the bucket, horizontally?"; }, qG: "If the bucket were not there, how far from the cannon would the water hit the ground (where " + c2Y + " = 0)?" }
    ];
    // the known point is the start (x = 0), a point partway, or where the path ends; the question asks for a height at an x (y), how far the path
    // goes to reach a height on its way down (xt), or where it would reach the ground, its x-intercept (xi)
    function c2M241(tier) {
      var QT = tier === 0 ? ["y", "xt"] : ["y", "xt", "xi"];
      var qt = c2Pick(QT), kp = c2Pick(tier === 0 ? ["start", "mid"] : ["start", "mid", "end"]);   // (chosen first, so every kind comes up as often)
      for (var t = 0; t < 30000; t++) {
        if (t && t % 6000 === 0) { qt = c2Pick(QT); kp = c2Pick(["start", "mid", "end"]); }
        var h = c2Pick([10, 15, 20, 25, 30, 40, 50]), k = c2Rng(15, 60), ap = tier >= 2 && qt === "y" && rnd(2), a, X0, Y0, Xq, Yq, ans;
        if (kp === "start") X0 = 0;
        else if (kp === "mid") X0 = rnd(2) ? h - c2Pick([5, 10, 15, 20]) : h + c2Pick([5, 10, 15]);
        else X0 = h + c2Pick([10, 15, 20, 25, 30, 40]);
        if (X0 <= 0 && kp !== "start") continue;
        if (a * h * h + k < 1 && !ap) continue;   // (the path starts above the ground at x = 0)
        var d = X0 - h, D = d * d; if (!D) continue;
        if (ap) { Y0 = c2Rng(Math.max(2, k - 40), k - 3); a = (Y0 - k) / D; if (Number.isInteger(c2R(a * 100, 6))) continue; }   // ≈: a is rounded to the nearest hundredth
        else { a = -c2Pick([0.01, 0.02, 0.04, 0.05, 0.08, 0.1, 0.2, 0.25, 0.5]); Y0 = c2R(a * D + k, 6); if (!Number.isInteger(Y0)) continue; }
        var ar = c2R(a, 2); if (!ar || Y0 < 2 || k - Y0 < Math.max(6, k / 4) || ar * h * h + k < 1) continue;   // (a path that rises well above its known point)
        if (ap && (Math.abs(Math.abs(a * 100 % 1) - 0.5) < 0.02 || Math.abs(ar - a) > Math.abs(a) * 0.12)) continue;   // (no halfway rounding; the rounded a stays close)
        var Fr = function (x) { return ar * (x - h) * (x - h) + k; };
        if (qt === "y") {
          if (kp === "end") Xq = 0; else Xq = h + c2Pick([10, 15, 20, 25, 30, 40]);
          if (kp === "mid" && X0 > h && rnd(2)) Xq = 0;
          Yq = c2R(Fr(Xq), 4); ans = Yq;
          if (Yq < 1.5 || Yq >= k - 1 || !Number.isInteger(c2R(Yq * 100, 6))) continue;
          if (tier === 0 && !Number.isInteger(Yq)) continue;
        } else if (qt === "xt") {   // a height on the way down: x = h + Δ
          var dl = c2Pick([5, 10, 15, 20, 25, 30, 40]); Yq = c2R(k + ar * dl * dl, 6); Xq = h + dl; ans = Xq;
          if (!Number.isInteger(Yq) || Yq < 2 || k - Yq < 4) continue;
        } else {   // the ground: k + aΔ² = 0
          var dg = c2R(Math.sqrt(-k / ar), 6); Xq = c2R(h + dg, 6); Yq = 0; ans = Xq;
          if (!Number.isInteger(c2R(dg * 10, 6)) || dg < 5) continue;
        }
        if (X0 >= Xq && qt !== "y") continue;   // (the known point comes before the point asked about)
        if (Xq === X0) continue;
        var V = [h, k, X0, Y0, Xq]; if (V.some(function (v, i) { return V.indexOf(v) !== i; }) || (qt !== "xi" && (Yq === Y0 || Yq === k))) continue;
        return c2M241Pb(c2Pick(C2S241), { h: h, k: k, X0: X0, Y0: Y0, Xq: Xq, Yq: Yq, qt: qt, ans: ans, kp: kp, d: d, D: D, R: Y0 - k, a: a, ar: ar, ap: !!ap });
      }
    }
    function c2M241Pb(sc, V) {
      var pb = { kind: 20, sc: sc, vp: V }, h = V.h, k = V.k, ar = V.ar, Fr = function (x) { return ar * (x - h) * (x - h) + k; };
      var q = V.qt === "xt" ? sc.qT(V.Yq) : V.qt === "xi" ? sc.qG : V.Xq === 0 ? sc.qS : sc.qE(V.Xq), qPlain = m3Plain(q), E = c2Vf(ar, h, k, "x", c2Y), u = "feet";
      V.qv = V.qt === "y" ? V.Xq : V.qt === "xt" ? V.Yq : null;   // (the number in the question: it may be dragged, but it is not h, k, x or y)
      var P0 = vpPt(V.X0, V.Y0, "s"), known = V.X0 === 0 ? "It " + sc.st + " at " + P0 + "." : V.X0 > h && V.qt === "y" && V.Xq === 0 ? "It " + sc.en + " at " + P0 + "." : "On its way " + (V.X0 < h ? "up" : "down") + ", it passes through " + P0 + ".";
      pb.head = sc.s + " Vertex " + c2Pt(h, k) + ", point " + c2Pt(V.X0, V.Y0) + ". " + qPlain;
      pb.pic = c2Pic(sc.pic);
      pb.story = sc.s + " Here " + c2X + " is the horizontal distance from where it starts and " + c2Y + " is the height, both in feet. The highest point of the path, its vertex, is " + vpPt(h, k, "s") + ". " + known + " " + (V.qv == null ? q : q.replace(/(\d+)( feet)/, function (m0, n0, f0) { return vpN(+n0, "sq") + f0; }));
      pb.qc = 1;   // (Demo and Sequence: each question in the centre pane)
      pb.ws = function () { return vpWs(pb); };
      pb.fig = function () { return mode === "solo" ? vpOwnPic() : vpSketch(pb); };
      var xmax = Math.max(V.X0, V.Xq, 2 * h) * 1.12;
      pb.dsm = { one: 1, late: 1, F1: Fr, D1: Math.max(V.X0, V.Xq, 2 * h), xmax: xmax, ymax: k * 1.3, l1: "y=" + c2T(ar, 6) + "\\left(x-" + h + "\\right)^{2}+" + k };
      var R = V.R, dTx = c2F(V.d), sub0 = c2F(V.Y0) + " = a(" + c2F(V.X0) + " − " + h + ")² + " + k;
      var aTx = (V.ap ? "≈ " : "= ") + c2F(ar), Ftx = E[0].replace(/<[^>]+>/g, "");
      var ws = function (id, type, ask, o) { var s = { id: id, type: type, fine: 1, nol: 1, ask: ask, lab: id }; for (var kk in o) s[kk] = o[kk]; return s; };
      var setS = function (n) { return function (x) { x.vs = n; x.pend = ""; }; };
      var opA = function (id, n) { return function (x) { if (mode === "calculate") x.pend = id; else { x.vs = n; x.pend = ""; } }; };
      var subA = function (key) { return function (x) { x.sb = x.sb || {}; x.sb[key] = 1; }; };
      var SUB = [
        ws("sh", "vsub", "Substitute the vertex and the other point you know.", { k: "h", v: h, after: subA("h"), wl: "", hint: ["The vertex is (" + c2F(h) + ", " + c2F(k) + ").", "Drag " + c2F(h) + " onto h."] }),
        ws("sk", "vsub", "Substitute the vertex and the other point you know.", { k: "k", v: k, after: subA("k"), wl: "", hint: ["The vertex is (" + c2F(h) + ", " + c2F(k) + ").", "Drag " + c2F(k) + " onto k."] }),
        ws("sx", "vsub", "Substitute the vertex and the other point you know.", { k: "x", v: V.X0, after: subA("x"), wl: "", hint: ["The point you know (not the vertex) is " + c2Pt(V.X0, V.Y0) + ".", "Drag " + c2F(V.X0) + " onto x."] }),
        ws("sy", "vsub", "Substitute the vertex and the other point you know.", { k: "y", v: V.Y0, after: subA("y"), wl: sub0, hint: ["The point you know is " + c2Pt(V.X0, V.Y0) + ".", "Drag " + c2F(V.Y0) + " onto y."] })
      ];
      var o1 = ws("o1", "vop", "Simplify inside the parentheses.", { op: "o1", after: opA("o1", 1), wl: c2F(V.Y0) + " = a(" + dTx + ")² + " + k, hint: ["Work inside the parentheses first.", "Click the − between " + c2F(V.X0) + " and " + h + "."] });
      var c1 = ws("c1", "num", "Work it out.", { pre: c2F(V.X0) + " − " + h + " =", ans: V.d, after: setS(1), wl: "", hint: ["Subtract.", c2F(V.X0) + " − " + h + " = " + dTx + "."] });
      var o2 = ws("o2", "vop", "Square " + (V.d < 0 ? "(" + dTx + ")" : dTx) + ".", { op: "o2", after: opA("o2", 2), wl: c2F(V.Y0) + " = " + V.D + "a + " + k, hint: ["The exponent comes next in the order of operations.", "Click the ² after the parentheses."] });
      var c2 = ws("c2", "num", "Work it out.", { pre: "(" + dTx + ")² =", ans: V.D, after: setS(2), wl: "", hint: ["Multiply the number by itself.", "(" + dTx + ")(" + dTx + ") = " + V.D + "."], wrong: function (v) { return v === -V.D ? "A negative times a negative is positive." : ""; } });
      var mv = ws("mv", "vmv", "Get the <i>a</i> term by itself: undo the addition.", { after: setS(3), wl: c2F(V.Y0) + " − " + k + " = " + V.D + "a", hint: ["Undo the + " + k + ".", "Drag + " + k + " across the = sign. It becomes − " + k + "."] });
      var o3 = ws("o3", "vop", "Combine " + c2F(V.Y0) + " − " + k + ".", { op: "o3", after: opA("o3", 4), wl: c2F(R) + " = " + V.D + "a", hint: ["Combine the numbers on the left.", "Click the − between " + c2F(V.Y0) + " and " + k + "."] });
      var c3 = ws("c3", "num", "Work it out.", { pre: c2F(V.Y0) + " − " + k + " =", ans: R, after: setS(4), wl: "", hint: ["Subtract.", c2F(V.Y0) + " − " + k + " = " + c2F(R) + "."] });
      var dv = ws("dv", "vdv", "Undo the multiplication.", { after: setS(5), wl: c2F(R) + "/" + V.D + " = a", hint: [V.D + " multiplies a. Undo it by dividing.", "Drag " + V.D + " across the = sign."] });
      var o4 = ws("o4", "vop", "Divide." + (V.ap ? " Round to the nearest hundredth." : ""), { op: "o4", dfr: [R, V.D], after: opA("o4", 6), wl: "a " + aTx, hint: ["A fraction bar means divide.", "Click the bar between " + c2F(R) + " and " + V.D + "."] });
      var c4 = ws("c4", "num", "Work it out.", { pre: c2F(R) + " ÷ " + V.D + " =", post: V.ap ? "(to the nearest hundredth)" : "", ans: V.a, tol: V.ap ? 0.005 + 1e-9 : 1e-9, after: setS(6), wl: "", hint: ["Divide." + (V.ap ? " Round to the nearest hundredth." : ""), c2F(R) + " ÷ " + V.D + " " + aTx + "."] });
      var gr = { id: "gr", fine: 1, lab: "Graph", type: "dsm", ask: "Graph " + E[0] + " in Desmos.", line: "graphed " + Ftx + " in Desmos", hint: ["Type the equation on the first line of Desmos.", "Type " + E[1] + "."] };
      var ansA = function () { return q; };
      var isY = V.qt === "y", aTx2 = (V.qt === "xi" && !Number.isInteger(V.ans) ? "about " : "") + c2F(V.ans);
      var ans = { id: "ans", lab: isY ? "Height" : "Distance", ask: ansA, pre: (isY ? c2Y : c2X) + " =", post: u, ans: V.ans, tol: 0.051,
        nums: isY ? [k, V.Y0, c2R(V.a * (V.Xq - h) * (V.Xq - h) + k, 1)] : [h, c2R(2 * h - V.Xq, 4), V.X0, k],
        line: isY ? "at " + c2X + " = " + c2F(V.Xq) + ", the height is " + c2F(V.ans) + " feet" : V.qt === "xt" ? "the height is " + c2F(V.Yq) + " feet at " + c2X + " = " + c2F(V.ans) : "it reaches the ground at " + c2X + " = " + c2F(V.ans),
        hint: isY ? ["Find the point of the parabola where " + c2X + " = " + c2F(V.Xq) + ".", "Its height is " + c2F(V.ans) + " feet."] : V.qt === "xt" ? ["Find where the parabola has height " + c2F(V.Yq) + " on its way down (right of the vertex).", c2X + " = " + c2F(V.ans) + "."] : ["Find where the parabola crosses the " + c2X + "-axis on the right.", c2X + " = " + c2F(V.ans) + "."],
        dpre: function (run, then) { vpDsmAns(pb, run, then); } };
      var frm = ws("frm", "vfrm", "Write the vertex form of a parabola.", { typed: "y=a(x-h)^2+k", after: function (x) { x.frm = 1; }, wl: "y = a(x − h)² + k", chk: vpFrmOk, hint: ["Vertex form shows the vertex (h, k).", "y = a(x − h)² + k"] });
      SUB[0].wl = "y = a(x − h)² + k";
      pb.isteps = SUB.concat([o1, o2, mv, o3, dv, o4, gr, ans]);
      var S2 = SUB.map(function (s) { var c = {}; for (var kk in s) c[kk] = s[kk]; return c; }); S2[0].wl = "";
      pb.csteps = [frm].concat(S2, [o1, c1, o2, c2, mv, o3, c3, dv, o4, c4, gr, ans]);
      pb.steps = [ans];   // (Write: the answer alone, with Desmos)
      pb.ex = "The vertex is " + c2Pt(h, k) + ", so h = " + c2F(h) + " and k = " + c2F(k) + ". The path passes through " + c2Pt(V.X0, V.Y0) + ", so " + sub0 + ". Then " + c2F(V.Y0) + " = " + V.D + "a + " + k + ", so " + c2F(R) + " = " + V.D + "a and a = " + c2F(R) + "/" + V.D + " " + aTx + ". In Desmos, " + Ftx + (V.qt === "y" ? " has height " + c2F(V.ans) + " feet at x = " + c2F(V.Xq) : V.qt === "xt" ? " reaches a height of " + c2F(V.Yq) + " feet, on its way down, at x = " + c2F(V.ans) : " crosses the x-axis at x = " + c2F(V.ans)) + ".";
      var gV = function (n) { return function (x) { return (x.vs || 0) >= n && !(x.pend && (x.vs || 0) === n - 1); }; }, gD = Number.isInteger(V.ans) ? "= " : "≈ ";
      var gAsk = V.qt === "y" ? [gqM("x = " + c2F(V.Xq)) + " feet, the point asked about"] : V.qt === "xt" ? [gqM("y = " + c2F(V.Yq)) + " feet, on the way down"] : [gqM("y = 0") + ", the ground"];
      pb.guess = { G: [["vertex " + gqM("(h, k) = (" + c2F(h) + ", " + c2F(k) + ")") + " feet"], ["point " + gqM("(x, y) = (" + c2F(V.X0) + ", " + c2F(V.Y0) + ")") + " feet"], gAsk],
        U: [[gqM("a = ?")], [V.qt === "y" ? gqM("y = ?") + " feet, when " + gqM("x = " + c2F(V.Xq)) : gqM("x = ?") + " feet, when " + gqM("y = " + c2F(V.Yq))]],
        E: [[gqM("y = a(x − h)^2 + k"), function (x, dn) { return dn.frm || dn.sh || (x.sb && (x.sb.h || x.sb.k || x.sb.x || x.sb.y)); }]],
        S1: [[gqM(sub0), function (x) { var b = x.sb || {}; return b.h && b.k && b.x && b.y; }], [gqM((V.qt === "y" ? "y" : c2F(V.Yq)) + " = " + c2F(ar) + "(" + (V.qt === "y" ? c2F(V.Xq) : "x") + " − " + h + ")^2 + " + k), ["ans"]]],
        S2: [[gqM(c2F(V.Y0) + " = a(" + dTx + ")^2 + " + k), gV(1)], [gqM(c2F(V.Y0) + " = " + V.D + "a + " + k), gV(2)], [gqM(c2F(V.Y0) + " − " + k + " = " + V.D + "a"), gV(3)], [gqM(c2F(R) + " = " + V.D + "a"), gV(4)], [gqM("a = " + c2F(R) + " ÷ " + V.D), gV(5)], [gqM("a " + aTx), gV(6)], [Ftx.replace(/\b([a-z])\b/g, "<i>$1</i>"), gV(6)],
          [gqM((V.qt === "y" ? "y " : "x ") + gD + c2F(V.ans)) + " feet (from the graph in Desmos)", ["ans"]]],
        A: [[V.qt === "y" ? "At " + c2F(V.Xq) + " feet from the start, the height is " + c2F(V.ans) + " feet." : V.qt === "xt" ? "The path is " + c2F(V.Yq) + " feet high, on its way down, " + c2F(V.ans) + " feet from the start." : "The path would reach the ground " + c2F(V.ans) + " feet from the start.", ["ans"]]] };
      return pb;
    }
    return { generate: c2M241, scenarios: C2S241 };
  }
};
