// Bank question 1.3B-compare: Comparing Linear Equations (Algebra 2, 1.3 Example 2).
(window.AN_BANK || (window.AN_BANK = {}))["1.3B-compare"] = {
  id: "1.3B-compare",
  title: "Comparing Linear Equations",
  section: "1.3",
  example: 2,
  skills: ["slope", "linear equations", "comparing rates"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 3,
  showWork: "GUESS",
  patterns: {"solo": "Submit"},
  version: 3,   // 3: Show work shortened (math in place of sentences)
  build: function () {
    function m3Make2(tier) {
      for (var t = 0; t < 800; t++) {
        var sc = m3Pick(M3B), ml = 2 + rnd(9), mh = ml + 1 + rnd(5), xs = 2 + rnd(9), bh = 5 * (1 + rnd(tier === 0 ? 3 : 6)), bl = bh + (mh - ml) * xs;
        if (bl > 90 || mh > 14) continue;
        var tIsHigh = rnd(2) === 1, mT = tIsHigh ? mh : ml, bT = tIsHigh ? bh : bl, mQ = tIsHigh ? ml : mh, bQ = tIsHigh ? bl : bh;
        var nT = tIsHigh ? sc.A : sc.B, nQ = tIsHigh ? sc.B : sc.A; if (rnd(2)) { var sw = nT; nT = nQ; nQ = sw; }   // (which name goes with the table is mixed up)
        var rows = tier === 0 ? [0, 1, 2, 3] : tier === 1 ? [1, 2, 3, 4] : m3Pick([[2, 4, 6, 8], [1, 3, 5, 7]]), ys = rows.map(function (x) { return mT * x + bT; });
        var r0 = rows[0], r1 = rows[1], y0 = ys[0], y1 = ys[1], ystar = mh * xs + bh, e = bl - bh, d = mh - ml, pb = { kind: 2, sc: sc, rows: rows, tys: ys, mQ: mQ, bQ: bQ, mT: mT, bT: bT, yq1: mQ + bQ, xs: xs, ystar: ystar };
        pb.head = sc.s; pb.pic = m3Svg(sc.pic);
        pb.story = sc.s + " The table shows the total cost (dollars) for <b>" + nT + "</b>. For <b>" + nQ + "</b>, the total cost is <span class=\"lm\">" + m3EqH(mQ, bQ) + "</span>, where <i>x</i> is the number of " + sc.xu + ".";
        pb.tbl = m3Tbl(sc.xn, "Total cost ($)", rows, ys);
        var xmax2 = Math.max(xs + 2, rows[rows.length - 1] + 1); if (xmax2 % 2) xmax2++;
        var need2 = Math.max(ys[ys.length - 1], bQ + mQ * 2, ystar * 1.3, 10), ystp = m3Step1(need2), ymax2 = Math.ceil(need2 / ystp) * ystp, PUR = "#7A3FB5", ORG = "#D97706";
        pb.fig = function (x) {   // (Solo has no graph)
          if (mode === "solo") return ""; x = x || {}; var tp = x.tp || [], ls = x.ls || [];
          var o = { xmax: xmax2, ymax: ymax2, xs: xmax2 <= 10 ? 1 : 2, ys: ystp, xl: sc.xn, yl: "Total cost (dollars)", alt: sc.s, lines: [], pts: [] };
          var endT = bT + mT * xmax2, endQ = bQ + mQ * xmax2;
          if (x.tl) o.lines.push({ m: mT, b: bT, col: PUR, lab: nT, below: endT < endQ });
          if (x.ql) o.lines.push({ m: mQ, b: bQ, col: ORG, lab: nQ, below: endQ <= endT });
          tp.forEach(function (i) { o.pts.push({ x: rows[i], y: ys[i], col: PUR, ring: !x.tl && ls.indexOf(i) >= 0 }); });
          if (x.q1) o.pts.push({ x: 0, y: bQ, col: ORG }); if (x.q2) o.pts.push({ x: 1, y: mQ + bQ, col: ORG });
          if (x.cr) o.pts.push({ x: xs, y: ystar, col: "#2E9E4F", lab: true, left: true, dy: -10 });
          return m3Fig(o);
        };
        var which = m3Sh([{ t: nT, ok: mT > mQ, why: "Compare the rates: " + nT + " has " + m3F(mT) + " per " + sc.x1 + " and " + nQ + " has " + m3F(mQ) + "." }, { t: nQ, ok: mQ > mT, why: "Compare the rates: " + nT + " has " + m3F(mT) + " per " + sc.x1 + " and " + nQ + " has " + m3F(mQ) + "." }]);
        pb.steps = [
          { id: "rise", fine: 1, lab: "rise", ask: "Use the table for " + nT + ". Find the rise, the change in cost from " + sc.x1 + " " + r0 + " to " + sc.x1 + " " + r1 + ".", pre: y1 + " − " + y0 + " =", ans: y1 - y0, hint: ["Subtract the first cost from the second cost.", y1 + " − " + y0 + " = " + (y1 - y0) + "."], line: "rise = " + y1 + " − " + y0 + " = " + (y1 - y0) },
          { id: "run", fine: 1, lab: "run", ask: "Find the run, the change in " + sc.xu + ".", pre: r1 + " − " + r0 + " =", ans: r1 - r0, hint: ["Subtract the first " + sc.x1 + " from the second.", r1 + " − " + r0 + " = " + (r1 - r0) + "."], line: "run = " + r1 + " − " + r0 + " = " + (r1 - r0) },
          { id: "m", fine: 1, lab: "rate", ask: "The rate of " + nT + " is rise ÷ run.", pre: "rate =", ans: mT, post: "dollars per " + sc.x1, hint: ["Rate = rise ÷ run.", (y1 - y0) + " ÷ " + (r1 - r0) + " = " + mT + "."], line: "rate of " + nT + " = " + (y1 - y0) + " ÷ " + (r1 - r0) + " = " + mT },
          { id: "which", lab: "Greater rate", ask: "The rate of " + nQ + " is the number multiplying <i>x</i>: " + m3F(mQ) + ". Which has the greater rate?", type: "pick", opts: which, hint: ["Compare the rate of " + nT + " (rise ÷ run from the table) with " + m3F(mQ) + ".", nT + " has " + m3F(mT) + " and " + nQ + " has " + m3F(mQ) + "."], line: (mT > mQ ? nT : nQ) + " has the greater rate" },
          { id: "b", fine: 1, lab: "b", ask: "Find where " + nT + " starts: <i>b</i> = <i>y</i> − rate × <i>x</i>, using the first row of the table.", pre: y0 + " − " + mT + "(" + r0 + ") =", ans: bT, hint: ["Multiply the rate by the " + sc.x1 + ", then subtract from the cost.", y0 + " − " + (mT * r0) + " = " + bT + "."], line: "<i>b</i> = " + y0 + " − " + mT + "(" + r0 + ") = " + bT },
          { id: "eq", lab: "Equation", ask: "Write the equation for " + nT + ".", pre: "", type: "eq", a: mT, b: bT, hint: ["Use <i>y</i> = <i>mx</i> + <i>b</i> with the rate for <i>m</i> and the starting amount for <i>b</i>.", m3Eq(mT, bT) + "."], line: nT + ": " + m3EqH(mT, bT) },
          { id: "e", fine: 1, lab: "constants", ask: "The plans cost the same when " + m3Co(mh) + "<i>x</i> + " + bh + " = " + m3Co(ml) + "<i>x</i> + " + bl + ". Subtract " + m3Co(ml) + "<i>x</i> and " + bh + " from both sides. What is " + bl + " − " + bh + "?", pre: bl + " − " + bh + " =", ans: e, hint: ["Subtract the smaller constant from the larger one.", bl + " − " + bh + " = " + e + "."], line: bl + " − " + bh + " = " + e },
          { id: "d", fine: 1, lab: "x terms", ask: "Now what is " + mh + " − " + ml + "? Then " + d + "<i>x</i> = " + e + ".", pre: mh + " − " + ml + " =", ans: d, hint: ["Subtract the smaller rate from the larger one.", mh + " − " + ml + " = " + d + "."], line: d + "<i>x</i> = " + e },
          { id: "x", lab: sc.xn, ask: "After how many " + sc.xu + " do the two plans cost the same?", pre: "<i>x</i> =", post: sc.xu, ans: xs, hint: ["Solve " + d + "<i>x</i> = " + e + ".", "Divide: " + e + " ÷ " + d + " = " + xs + "."], line: "<i>x</i> = " + e + " ÷ " + d + " = " + xs },
          { id: "y", lab: "Cost", ask: "What does each plan cost then?", pre: "<i>y</i> =", post: "dollars", ans: ystar, hint: ["Put <i>x</i> = " + xs + " into either equation.", m3Co(mh) + "(" + xs + ") + " + bh + " = " + ystar + "."], line: "<i>y</i> = " + mh + "(" + xs + ") + " + bh + " = " + ystar }
        ];
        var S2 = pb.steps, PC = " (" + "purple" + ")", OC = " (orange)";
        pb.isteps = [
          { id: "plotT", lab: "plot", type: "plotT", ask: "Plot the points from the table for " + nT + ".", hint: ["For each column of the table, find the <i>x</i> on the bottom axis and the <i>y</i> on the side axis.", "Click where they meet."], line: "Plotted the points from the table for " + nT },
          { id: "lineT", lab: "line", type: "lineT", ask: "Draw the line through the points.", hint: ["The points are in a straight line.", "Click any two of the points."], line: nT + "'s line is drawn (purple)" },
          S2[0], S2[1], S2[2], S2[3], S2[4], S2[5],
          { id: "plotQ1", lab: "start", type: "plotQ1", ask: "Now graph " + nQ + " (orange): " + m3EqH(mQ, bQ) + ". Start at <i>x</i> = 0.", hint: ["Put <i>x</i> = 0 into the equation.", "At <i>x</i> = 0 the cost is " + bQ + "."], line: nQ + " starts at (0, " + bQ + ")" },
          { id: "y1", fine: 1, lab: "x = 1", ask: "Find the cost for " + nQ + " when <i>x</i> = 1: put 1 in for <i>x</i> in " + m3EqH(mQ, bQ) + ".", pre: "<i>y</i> =", ans: mQ + bQ, hint: ["Replace <i>x</i> with 1 and calculate.", m3Co(mQ) + "(1) + " + bQ + " = " + (mQ + bQ) + "."], line: "<i>y</i> = " + mQ + "(1) + " + bQ + " = " + (mQ + bQ) },
          { id: "plotQ2", lab: "second point", type: "plotQ2", ask: "Find the point of " + nQ + " where <i>x</i> = 1.", hint: ["You just found the cost when <i>x</i> = 1.", "Click at <i>x</i> = 1 and <i>y</i> = " + (mQ + bQ) + "."], line: nQ + "'s line is drawn (orange)" },
          { id: "cross", lab: "crossing", type: "cross", ask: "Find where the two lines cross.", hint: ["Look for the point that is on both lines.", "The lines cross at (" + xs + ", " + ystar + ")."], line: "The lines cross at (" + xs + ", " + ystar + ")" },
          S2[6], S2[7], S2[8], S2[9]
        ];
        pb.csteps = pb.isteps;
        pb.ex = nT + "'s rate is " + (y1 - y0) + " ÷ " + (r1 - r0) + " = " + mT + ", and its table starts at <i>b</i> = " + bT + ", so " + m3Eq(mT, bT) + ". " + (mT > mQ ? nT : nQ) + " has the greater rate. The plans are equal when " + m3Co(mh) + "x + " + bh + " = " + m3Co(ml) + "x + " + bl + ", so " + d + "x = " + e + " and <i>x</i> = " + xs + " " + sc.xu + ", when each costs $" + ystar + ".";
        pb.guess = { G: [[nT + ": " + gqM("(" + r0 + ", " + y0 + ")") + ", " + gqM("(" + r1 + ", " + y1 + ")")], [nQ + ": " + gqM(m3Eq(mQ, bQ))]],
          U: [[nT + ": " + gqM("m = ?") + ", " + gqM("b = ?")], [gqM("x = ?") + ", " + gqM("y = ?") + " when the costs are equal"]],
          E: [[gqM("m = (y₂ − y₁) ÷ (x₂ − x₁)")], [gqM("y = mx + b")], ["same cost: " + gqM("y") + " of " + nT + " = " + gqM("y") + " of " + nQ]],
          S1: [[gqM("m = (" + y1 + " − " + y0 + ") ÷ (" + r1 + " − " + r0 + ")"), ["rise", "run", "m"]], [gqM(y0 + " = " + mT + "(" + r0 + ") + b"), ["b"]], [gqM(m3Co(mh) + "x + " + bh + " = " + m3Co(ml) + "x + " + bl), ["e"]], [gqM("y = " + mh + "(" + xs + ") + " + bh), ["y"]]],
          S2: [[gqM("m = " + (y1 - y0) + " ÷ " + (r1 - r0) + " = " + mT), ["m"]], [gqM("b = " + y0 + " − " + (mT * r0) + " = " + bT), ["b"]], [nT + ": " + gqM(m3Eq(mT, bT)), ["eq"]], [gqM(m3Co(d) + "x = " + e), ["d"]], [gqM("x = " + e + " ÷ " + d + " = " + xs) + " " + sc.xu, ["x"]], [gqM("y = " + ystar) + " dollars", ["y"]]],
          A: [["After " + xs + " " + sc.xu + " both plans cost $" + ystar + ".", ["y"]]] };
        return pb;
      }
    }
    return { generate: m3Make2 };
  }
};
