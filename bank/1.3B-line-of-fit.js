// Bank question 1.3B-line-of-fit: Line of Fit (Algebra 2, 1.3 Example 3).
(window.AN_BANK || (window.AN_BANK = {}))["1.3B-line-of-fit"] = {
  id: "1.3B-line-of-fit",
  title: "Line of Fit",
  section: "1.3",
  example: 3,
  skills: ["line of fit", "slope", "predictions"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 3,
  showWork: "GUESS",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    function m3Make3(tier) {
      var D = m3Data(tier), sc = D.sc, m = D.m, b = D.b, X = m3Pick([9, 10]), dots = [1, 3, 5, 7, 9].map(function (x, i) { return { x: x, y: b + m * x, i: i }; });
      var pb = { kind: 3, sc: sc, dots: dots }, pos = m > 0, est = m * X + b;
      pb.head = sc.s; pb.pic = m3Svg(sc.pic);
      pb.story = sc.s + " The scatter plot shows the data, and a line of fit is drawn.";
      pb.tq = "<div class=\"regQ\">Write an equation of the line of fit. Then estimate the " + sc.yn.toLowerCase() + " when " + sc.xn.toLowerCase() + " is " + X + ".</div>";
      pb.fig = function (x) {
        var sel = x.sel || []; return m3Fig({ xmax: 10, ymax: D.ymax, xs: 1, ys: D.ystep, xl: sc.xn, yl: sc.yn, alt: sc.s, line: { m: m, b: b }, scat: D.x.map(function (v, i) { return [v, D.y[i]]; }), dots: dots.map(function (d) { return { x: d.x, y: d.y, i: d.i, on: sel.indexOf(d.i) >= 0 || (x.p && x.p.some(function (q) { return q.i === d.i; })) }; }) });
      };
      var P = function (x) { return x.p || [{ x: 1, y: 1 }, { x: 2, y: 2 }]; };
      pb.steps = [
        { id: "corr", lab: "Correlation", ask: "Do the points show a positive correlation, a negative correlation, or no correlation?", type: "pick", opts: [{ t: "Positive correlation", ok: pos, why: "The points go down as you move right: that is a negative correlation." }, { t: "Negative correlation", ok: !pos, why: "The points go up as you move right: that is a positive correlation." }, { t: "No correlation", ok: false, why: "The points follow a line closely, so there is a correlation." }], hint: ["Look at the direction the points go as you move to the right.", "The points go " + (pos ? "up" : "down") + "."], line: (pos ? "Positive" : "Negative") + " correlation" },
        { id: "pts", lab: "Two points", type: "pts", ask: "Choose two points on the line of fit.", hint: ["Choose two circles that sit on the purple line.", "Any two circles on the line work."], line: function (p, x, s) { return "Points " + s; } },
        { id: "rise", fine: 1, lab: "rise", ask: function (p, x) { var q = P(x); return "Find the rise from (" + q[0].x + ", " + q[0].y + ") to (" + q[1].x + ", " + q[1].y + "): " + q[1].y + " − " + q[0].y + "."; }, pre: "rise =", ans: function (p, x) { var q = P(x); return q[1].y - q[0].y; }, hint: ["Subtract the first <i>y</i> from the second <i>y</i>.", "Use the two points you clicked."], line: function (p, x) { var q = P(x); return "rise = " + q[1].y + " − " + q[0].y + " = " + m3F(q[1].y - q[0].y); } },
        { id: "run", fine: 1, lab: "run", ask: "Find the run, the change in <i>x</i>.", pre: "run =", ans: function (p, x) { var q = P(x); return q[1].x - q[0].x; }, hint: ["Subtract the first <i>x</i> from the second <i>x</i>.", "Use the two points you clicked."], line: function (p, x) { var q = P(x); return "run = " + q[1].x + " − " + q[0].x + " = " + (q[1].x - q[0].x); } },
        { id: "m", fine: 1, lab: "m", ask: "The slope is rise ÷ run.", pre: "<i>m</i> =", ans: m, wrong: function (v) { return v === -m ? "Check the sign: the line goes " + (pos ? "up" : "down") + "." : ""; }, hint: ["Slope = rise ÷ run.", "The slope is " + m3F(m) + "."], line: "<i>m</i> = " + m3F(m) },
        { id: "b", fine: 1, lab: "b", ask: function (p, x) { var q = P(x); return "Find <i>b</i>: <i>y</i> − <i>m</i> × <i>x</i> at the point (" + q[0].x + ", " + q[0].y + ")."; }, pre: "<i>b</i> =", ans: b, hint: ["Multiply the slope by <i>x</i>, then subtract it from <i>y</i>.", "<i>b</i> = " + b + "."], line: "<i>b</i> = " + b },
        { id: "eq", lab: "Equation", ask: "Write the equation of the line of fit.", pre: "", type: "eq", a: m, b: b, hint: ["Use <i>y</i> = <i>mx</i> + <i>b</i> with your slope and <i>b</i>.", m3Eq(m, b) + "."], line: m3EqH(m, b) },
        { id: "est", lab: "Estimate", ask: "Use your equation to estimate the " + sc.yn.toLowerCase() + " when " + sc.xn.toLowerCase() + " is " + X + ".", pre: "<i>y</i> =", ans: est, hint: ["Put <i>x</i> = " + X + " into your equation.", m3Co(m) + "(" + X + ") + " + b + " = " + m3F(est) + "."], line: "<i>y</i> = " + m3Co(m) + "(" + X + ") " + (b < 0 ? "− " : "+ ") + Math.abs(b) + " = " + m3F(est) }
      ];
      pb.ex = "The points go " + (pos ? "up" : "down") + ", a " + (pos ? "positive" : "negative") + " correlation. Two points on the line give rise ÷ run = " + m3F(m) + ", and the line crosses the <i>y</i>-axis at " + b + ", so " + m3Eq(m, b) + ". At <i>x</i> = " + X + ", <i>y</i> = " + m3F(est) + ".";
      var gP = function (x) { return x.p || null; };
      pb.guess = { G: [[function (x) { var q = gP(x); return q ? "two points on the line of fit: " + gqM("(" + q[0].x + ", " + q[0].y + ")") + " and " + gqM("(" + q[1].x + ", " + q[1].y + ")") : "two points on the line of fit (you choose them)"; }], [gqM("x = " + X) + " (" + sc.xn.toLowerCase() + ")"]],
        U: [[gqM("m = ?") + ", " + gqM("b = ?")], [gqM("y = ?") + " (" + sc.yn.toLowerCase() + ") when " + gqM("x = " + X)]],
        E: [[gqM("m = (y₂ − y₁) ÷ (x₂ − x₁)")], [gqM("y = mx + b")]],
        S1: [[function (x) { var q = gP(x); return q ? gqM("m = (" + q[1].y + " − " + q[0].y + ") ÷ (" + q[1].x + " − " + q[0].x + ")") : ""; }, ["rise", "m"]], [function (x) { var q = gP(x); return q ? gqM(q[0].y + " = " + m3F(m) + "(" + q[0].x + ") + b") : ""; }, ["b"]], [gqM("y = " + m3Co(m) + "(" + X + ") " + (b < 0 ? "− " : "+ ") + Math.abs(b)), ["est"]]],
        S2: [[gqM("m = " + m3F(m)), ["m"]], [gqM("b = " + b), ["b"]], [gqM(m3Eq(m, b)), ["eq"]], [gqM("y = " + m3F(est)), ["est"]]],
        A: [["When " + sc.xn.toLowerCase() + " is " + X + ", the estimate of " + sc.yn.toLowerCase() + " is " + m3F(est) + ".", ["est"]]] };
      return pb;
    }
    return { generate: m3Make3 };
  }
};
