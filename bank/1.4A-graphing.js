// Bank question 1.4A-graphing: Solving Systems by Graphing (word problem) (Algebra 2, 1.4 Example 4).
(window.AN_BANK || (window.AN_BANK = {}))["1.4A-graphing"] = {
  id: "1.4A-graphing",
  title: "Solving Systems by Graphing (word problem)",
  section: "1.4",
  example: 4,
  skills: ["systems of equations", "graphing", "word problems"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 3,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    function m3MakeG(tier) {
      for (var t = 0; t < 1500; t++) {
        var sc = m3Pick(M3B), ml = (tier === 0 ? 1 : 2) + rnd(tier === 0 ? 6 : 9), mh = ml + 1 + rnd(tier === 0 ? 3 : 5), xs = 2 + rnd(tier === 0 ? 5 : 9), bh = 5 * (1 + rnd(tier === 0 ? 3 : 6)), bl = bh + (mh - ml) * xs;
        if (bl > 90 || mh > 14) continue;
        var aHigh = rnd(2) === 1, rows = tier === 0 ? [0, 1, 2] : tier === 1 ? [0, 2, 4] : m3Pick([[0, 2, 4], [1, 3, 5], [0, 3, 6]]), ystar = mh * xs + bh;
        function plan(m, b, n) { return { m: m, b: b, n: n, rows: rows, ys: rows.map(function (v) { return m * v + b; }), rh: m3EqH(m, b).replace("<i>y</i> = ", ""), sub: function (v) { return m3F(m) + "(" + m3F(v) + ")" + (b ? " + " + b : ""); } }; }
        var A = aHigh ? plan(mh, bh, sc.A) : plan(ml, bl, sc.A), B = aHigh ? plan(ml, bl, sc.B) : plan(mh, bh, sc.B);
        var xmax = Math.max(xs + 2, rows[2] + 1); if (xmax % 2) xmax++;
        var need = Math.max(A.ys[2], B.ys[2], ystar * 1.3, 10), ystp = m3Step1(need), ymax = Math.ceil(need / ystp) * ystp;
        var pb = { kind: 5, sc: sc, A: A, B: B, xs: xs, ystar: ystar, xmax: xmax, ymax: ymax, hx0: xmax * .86, hy0: ymax * .1 };
        pb.head = sc.s; pb.pic = m3Svg(sc.pic);
        pb.story = sc.s + " <b>" + A.n + "</b> charges $" + A.b + " to start and $" + A.m + " for each " + sc.x1 + ". <b>" + B.n + "</b> charges $" + B.b + " to start and $" + B.m + " for each " + sc.x1 + ". Let <i>x</i> be the number of " + sc.xu + " and <i>y</i> the total cost in dollars. After how many " + sc.xu + " do the two cost the same?";
        pb.tbl = function (x) { x = x || {}; return "<div class=\"glTbls\">" + glTbl(pb, x, "a", A, GLA) + glTbl(pb, x, "b", B, GLB) + "</div>"; };
        pb.fig = function (x) {
          x = x || {}; var o = { xmax: xmax, ymax: ymax, xs: xmax <= 10 ? 1 : 2, ys: ystp, xl: sc.xn, yl: "Total cost (dollars)", alt: sc.s, lines: [], pts: [] }, both = glAll([glN(x, "a") >= 3, glN(x, "b") >= 3, true]);
          [["a", A, GLA, B], ["b", B, GLB, A]].forEach(function (q) {
            var L = q[0], P = q[1], col = q[2], Q = q[3];
            for (var i = 0; i < 3; i++) if (glRowOk(x, L, i)) o.pts.push({ x: x["rx" + L][i], y: P.m * x["rx" + L][i] + P.b, col: col });
            if (glN(x, L) >= 3) o.lines.push({ m: P.m, b: P.b, col: col, lab: P.n, below: both && P.b + P.m * xmax < Q.b + Q.m * xmax });
          });
          if (m3wOn()) {   // Write: the points as typed or clicked and the lines drawn through them, all one colour until Submit; the green point once there are two lines
            glwPts(x).forEach(function (q) { o.pts.push({ x: q[0], y: q[1], col: M3W }); });
            (x.wl || []).forEach(function (l) { o.lines.push({ m: l.m, b: l.b, col: M3W }); });
            both = (x.wl || []).length >= 2;
          } else if (x.lnA && x.lnB && !glN(x, "a")) [[A, GLA, B], [B, GLB, A]].forEach(function (q) { o.lines.push({ m: q[0].m, b: q[0].b, col: q[1], lab: q[0].n, below: q[0].b + q[0].m * xmax < q[2].b + q[2].m * xmax }); });   // (finished in Write)
          if (x.cr) o.pts.push({ x: xs, y: ystar, col: GLC, lab: true, left: true, dy: -10 });
          var s = m3Fig(o); if (both && !x.cr) s = s.replace(/<\/svg>$/, glHandle(pb, x) + "</svg>");
          return s;
        };
        function term(P, v) { return m3F(P.m) + "(" + m3F(v) + ") + " + P.b; }
        function eqS(L, P) { return { id: "e" + L, lab: "equation " + L.toUpperCase(), L: L, type: "geq", ask: "Write the equation for <b>" + P.n + "</b>.<span class=\"supp\"><i>x</i> = number of " + sc.xu + ", <i>y</i> = total cost</span>",
          hint: ["The cost starts at $" + P.b + " and goes up $" + P.m + " for each " + sc.x1 + ". Use <i>y</i> = <i>mx</i> + <i>b</i>.", m3Eq(P.m, P.b) + "."], line: P.n + ": " + m3EqH(P.m, P.b) }; }
        function rowS(L, P, i) { var xv = P.rows[i];
          return { id: "r" + L + i, fine: 1, lab: "table", L: L, i: i, type: "grow", ask: "Fill in row " + (i + 1) + " of the table for <b>" + P.n + "</b>.",
            hint: ["Pick any whole number for <i>x</i>, like " + m3F(xv) + ". Put it in for <i>x</i> in <span class=\"lm\">" + m3EqH(P.m, P.b) + "</span> and calculate.", "For example, <i>x</i> = " + m3F(xv) + " gives " + term(P, xv) + " = " + m3F(P.ys[i]) + "."],
            line: function (pp, xx) { var xr = xx["rx" + L][i]; return P.n + ": <i>x</i> = " + m3F(xr) + " gives <i>y</i> = " + m3F(P.m * xr + P.b); } }; }
        var drag = { id: "cr", lab: "crossing", type: "gdrag", ask: "Find where the lines cross.", hint: ["Look for the place where the purple line and the orange line meet.", "They meet at (" + m3F(xs) + ", " + m3F(ystar) + ")."],
          line: "The lines cross at (" + m3F(xs) + ", " + m3F(ystar) + "): after " + m3F(xs) + " " + sc.xu + " both cost $" + m3F(ystar) };
        pb.isteps = [eqS("a", A), rowS("a", A, 0), rowS("a", A, 1), rowS("a", A, 2), eqS("b", B), rowS("b", B, 0), rowS("b", B, 1), rowS("b", B, 2), drag];
        pb.csteps = pb.isteps;
        function tabS(L, P) { return { id: "t" + L, lab: "table " + L.toUpperCase(), type: "gtab", L: L, ask: function () { return mode === "solo" ? "Graph <b>" + P.n + "</b>." : "Complete the table for <b>" + P.n + "</b>."; }, hint: ["Pick whole numbers for <i>x</i>, like " + P.rows.map(m3F).join(", ") + ". Put each one into <span class=\"lm\">" + m3EqH(P.m, P.b) + "</span> and calculate.", "For example, <i>x</i> = " + m3F(P.rows[0]) + " gives " + term(P, P.rows[0]) + " = " + m3F(P.ys[0]) + "."], line: P.n + ": the table is done and the line is drawn" }; }
        pb.steps = [eqS("a", A), eqS("b", B), tabS("a", A), tabS("b", B), drag];
        pb.ex = A.n + " is " + m3EqH(A.m, A.b) + " and " + B.n + " is " + m3EqH(B.m, B.b) + ". Fill in each table and the points join in a line. The two cost the same where the lines cross, at (" + m3F(xs) + ", " + m3F(ystar) + "): after " + m3F(xs) + " " + sc.xu + " both cost $" + m3F(ystar) + ". Check: " + term(A, xs) + " = " + m3F(ystar) + " and " + term(B, xs) + " = " + m3F(ystar) + ".";
        return pb;
      }
    }
    return { generate: m3MakeG };
  }
};
