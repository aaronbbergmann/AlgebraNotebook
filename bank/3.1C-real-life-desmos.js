// Bank question 3.1C-real-life-desmos: Real Life Desmos (Algebra 2, 3.1 Example 19).
(window.AN_BANK || (window.AN_BANK = {}))["3.1C-real-life-desmos"] = {
  id: "3.1C-real-life-desmos",
  title: "Real Life Desmos",
  section: "3.1",
  example: 19,
  skills: ["quadratic models", "x-intercepts", "Desmos graphing"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 1,
  showWork: "QWA",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    function c3M19(tier) {
      for (var t = 0; t < 500; t++) {   // the revenue: R(x) = (S − d·x)(P + x), x = the price increase in dollars
        var P = 4 + rnd(9), d = c2Pick([0.5, 1, 1.5, 2]), Z = P + 2 + rnd(12); if ((Z - P) % 2) continue;   // (zeros Z and −P; their average a whole number of dollars)
        var S = c2R(Z * d, 4), xm = (Z - P) / 2, price = P + xm, R = c2R((S - d * xm) * (P + xm), 4), pb2 = { kind: 20 };
        var who = c2Pick([["A streaming service charges $", " per month and has ", " million subscribers. For each $1 increase in price, the service loses ", " million subscribers.", "million"], ["A gym charges $", " per class and fills ", " hundred spots each month. For each $1 increase in price, it fills ", " hundred fewer.", "hundred"]]);
        pb2.head = who[0] + P + who[1] + c2F(S) + who[2] + c2F(d) + who[3]; pb2.pic = "";
        var dX = (d === 1 ? "" : c2F(d)) + c2X;
        pb2.story = pb2.head + " The revenue is <span class=\"lm\"><i>R</i>(" + c2X + ") = (" + c2F(S) + " − " + dX + ")(" + P + " + " + c2X + ")</span>, where " + c2X + " is the price increase in dollars.";
        var Fr = function (x) { return (S - d * x) * (P + x); };
        pb2.fig = function (x) { x = x || {}; if (!x.zz) return ""; var xa = c2Axis(-P - 1, Z + 1), ya = c2Axis(0, R * 1.15); return c2Fig({ H: 260, xmin: xa.min, xmax: xa.max, ymin: 0, ymax: ya.max, gx: xa.g, gy: ya.g, tx: xa.t, ty: ya.t, xl: "Price increase ($)", yl: "Revenue", alt: "The revenue", curves: [{ fn: Fr, col: C2P }], pts: [{ x: -P, y: 0, col: C2P, lab: "(" + c2F(-P) + ", 0)" }, { x: Z, y: 0, col: C2P, lab: "(" + Z + ", 0)" }].concat(x.mx ? [{ x: xm, y: R, col: C2P, lab: "(" + c2F(xm) + ", " + c2F(R) + ")", dy: -8 }] : []) }); };
        var FrD = function (x) { return (S - d * x) * (P + x); }, subs = who[4] === "million" ? "subscribers" : "spots";
        pb2.fig = function () { return ""; };
        pb2.qc = 1; pb2.noCueW = 1;   // (Write: no list of the parts)
        pb2.dsm = { one: 1, F1: FrD, D1: Z, xmin: -P - 2, xmax: Z + 2, ymin: -R * 0.15, ymax: R * 1.25, l1: "y=\\left(" + c2T(S, 6) + "-" + (d === 1 ? "" : c2T(d, 6)) + "x\\right)\\left(" + P + "+x\\right)" };
        var gr = { id: "gr", fine: 1, lab: "Graph", type: "dsm", ask: "", line: "graphed R(x) in Desmos", hint: ["Type the revenue function on the first line of Desmos, with y or R(x).", "Type y = (" + c2F(S) + " − " + dX.replace(/<[^>]+>/g, "") + ")(" + P + " + x)."] };
        var Q4 = [
          { id: "qz", lab: "Price increase", ask: "At what price increase would the " + (subs === "spots" ? "gym have no spots filled" : "service have no subscribers") + "?", pre: c2X + " =", post: "dollars", ans: Z, nums: [P, -P, xm], hint: ["No " + subs + " means no revenue: find where the graph crosses the x-axis, on the right.", "The x-intercept is (" + Z + ", 0), so " + c2X + " = " + Z + "."], line: "x-intercept (" + Z + ", 0): no " + subs + " at a $" + Z + " increase", x: Z, y: 0 },
          { id: "qp", lab: "Price change", ask: "What change in price would make it free (a price of $0)?", pre: c2X + " =", post: "dollars", ans: -P, nums: [P, Z, -Z], hint: ["A price of $0 means no revenue: find where the graph crosses the x-axis, on the left.", "The x-intercept is (" + c2F(-P) + ", 0), so " + c2X + " = " + c2F(-P) + "."], line: "x-intercept (" + c2F(-P) + ", 0): the price drops by $" + P + " to $0", x: -P, y: 0 },
          { id: "qh", lab: "Price increase", ask: "What price increase gives the greatest revenue?", pre: c2X + " =", post: "dollars", ans: xm, nums: [Z, P, xm + 1].filter(function (v) { return v !== xm; }), hint: ["The greatest revenue is the highest point of the graph, its vertex.", "The vertex is (" + c2F(xm) + ", " + c2F(R) + "), so " + c2X + " = " + c2F(xm) + "."], line: "vertex (" + c2F(xm) + ", " + c2F(R) + "): a $" + c2F(xm) + " increase, a price of $" + c2F(price), x: xm, y: R },
          { id: "qk", lab: "Revenue", ask: "What is the greatest revenue?", pre: "<i>R</i> =", post: who[4] + " dollars", ans: R, tol: 0.01, nums: [c2R(S * P, 4), Z, c2R(R + d * 2, 4)].filter(function (v) { return Math.abs(v - R) > 0.01; }), hint: ["The greatest revenue is the height of the vertex.", "The vertex is (" + c2F(xm) + ", " + c2F(R) + "), so the greatest revenue is " + c2F(R) + " " + who[4] + " dollars."], line: "vertex (" + c2F(xm) + ", " + c2F(R) + "): the greatest revenue is " + c2F(R) + " " + who[4] + " dollars", x: xm, y: R }
        ];
        Q4 = Q4.filter(function (q) { return q.id !== "qp"; });   // (the left x-intercept, a price of $0, is not a sensible answer: the intercept asked about is the right one)
        var pick = m3Sh(Q4.slice()).slice(0, 2).sort(function (u, v) { return Q4.indexOf(u) - Q4.indexOf(v); });
        pick.forEach(function (q) { var X0 = q.x, Y0 = q.y; q.dpre = function (run, then) { c3DsmPt(X0, Y0, run, then); }; });
        pb2.tq = "<div class=\"supp\">Revenue in " + who[4] + "s of dollars.</div>";   // (each question is asked once, by itself)
        pb2.isteps = pb2.csteps = [gr].concat(pick);
        pb2.steps = [gr].concat(pick);
        pb2.qwa = { Q: [[pb2.head.replace(/<[^>]+>/g, "")], ["<i>R</i>(" + c2X + ") = (" + c2F(S) + " − " + dX + ")(" + P + " + " + c2X + ")"]], W: [["graphed in Desmos: x-intercepts (" + c2F(-P) + ", 0) and (" + Z + ", 0), vertex (" + c2F(xm) + ", " + c2F(R) + ")", function (x, dn) { return dn.gr || pick.some(function (q) { return dn[q.id]; }); }]], A: pick.map(function (q) { return [q.line, [q.id]]; }) };
        return pb2;
      }
    }
    return { generate: c3M19 };
  }
};
