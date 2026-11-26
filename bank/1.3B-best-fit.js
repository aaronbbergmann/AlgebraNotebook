// Bank question 1.3B-best-fit: Line of Best Fit (Algebra 2, 1.3 Example 4).
(window.AN_BANK || (window.AN_BANK = {}))["1.3B-best-fit"] = {
  id: "1.3B-best-fit",
  title: "Line of Best Fit",
  section: "1.3",
  example: 4,
  skills: ["linear regression", "line of best fit", "Desmos"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 3,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    function m3Make4(tier) {
      var D, a, b, r, sc, xs, ys;
      for (var t = 0; t < 200; t++) {
        D = m3Data(tier); xs = D.x; ys = D.y; var n = xs.length, mx = 0, my = 0; xs.forEach(function (v, i) { mx += v / n; my += ys[i] / n; });
        var sxx = 0, sxy = 0, syy = 0; xs.forEach(function (v, i) { sxx += (v - mx) * (v - mx); sxy += (v - mx) * (ys[i] - my); syy += (ys[i] - my) * (ys[i] - my); });
        a = Math.round(sxy / sxx * 100) / 100; b = Math.round((my - sxy / sxx * mx) * 100) / 100; r = Math.round(sxy / Math.sqrt(sxx * syy) * 100) / 100;
        if (Math.abs(r) >= .9 && Math.abs(r) < 1 && a !== Math.round(a) && b !== Math.round(b)) break;
      }
      sc = D.sc; var X = m3Pick([9, 10]), est = Math.round((a * X + b) * 100) / 100, mC = Math.round(a), cC = Math.round(b) + (rnd(2) ? 1 : -1), E = mC * X + cC, diff = Math.round(Math.abs(est - E) * 100) / 100;
      var pos = r > 0, pb = { kind: 4, sc: sc }, rs = m3F(r), eqs = "y = " + m3F(a) + "x " + (b < 0 ? "− " : "+ ") + m3F(Math.abs(b));
      pb.head = sc.s; pb.pic = m3Svg(sc.pic);
      pb.story = sc.s + " The table and the scatter plot show the data.";
      pb.tq = "<div class=\"regQ\">Find the line of best fit and compare it with a classmate's line of fit.</div><div class=\"supp\">Round to the nearest tenth.</div>";
      pb.tbl = m3Tbl(sc.xn, sc.yn, xs, ys);
      pb.fig = function (x) { return m3Fig({ xmax: 10, ymax: D.ymax, xs: 1, ys: D.ystep, xl: sc.xn, yl: sc.yn, alt: sc.s, line: x && x.reg ? { m: a, b: b } : null, scat: xs.map(function (v, i) { return [v, ys[i]]; }) }); };
      var sgn = pos ? "positive" : "negative", osg = pos ? "negative" : "positive";
      pb.steps = [
        { id: "reg", lab: "Regression", type: "btn", btn: "Linear Regression", ask: "Find the line of best fit (linear regression).", hint: ["The calculator does the hard work for you.", "Press the button."], line: "Best-fit line: " + eqs.replace("y = ", "<i>y</i> = ") + ", <i>r</i> = " + rs },
        { id: "r", lab: "Meaning of r", ask: "The calculator shows <i>r</i> = " + rs + ". What does <i>r</i> tell you?", type: "pick", opts: m3Sh([{ t: "A strong " + sgn + " correlation: the points are close to the line.", ok: true }, { t: "A weak " + sgn + " correlation: the points are far from the line.", ok: false, why: "<i>r</i> is close to " + (pos ? "1" : "−1") + ", so the fit is strong." }, { t: "A strong " + osg + " correlation.", ok: false, why: "The sign of <i>r</i> matches the direction of the points: " + sgn + "." }, { t: "No correlation.", ok: false, why: "<i>r</i> is close to " + (pos ? "1" : "−1") + ", not 0." }]), hint: ["<i>r</i> is between −1 and 1. Close to 1 or −1 is a strong fit; close to 0 is no correlation.", "The sign matches the direction: " + sgn + "."], line: "<i>r</i> = " + rs + ": a strong " + sgn + " correlation" },
        { id: "ax", fine: 1, lab: "a × x", ask: "To estimate <i>y</i> when <i>x</i> is " + X + ", first multiply the slope by " + X + ".", pre: m3F(a) + " × " + X + " =", ans: Math.round(a * X * 100) / 100, tol: .02, hint: ["Multiply the number in front of <i>x</i> by " + X + ".", m3F(a) + " × " + X + " = " + m3F(a * X) + "."], line: m3F(a) + " × " + X + " = " + m3F(a * X) },
        { id: "est", lab: "Estimate", ask: "Use the best-fit line to estimate the " + sc.yn.toLowerCase() + " when " + sc.xn.toLowerCase() + " is " + X + ".", pre: "<i>y</i> ≈", ans: est, tol: .1, hint: ["Put <i>x</i> = " + X + " into " + eqs + ".", m3F(a * X) + " " + (b < 0 ? "−" : "+") + " " + m3F(Math.abs(b)) + " = " + m3F(est) + "."], line: "<i>y</i> ≈ " + m3F(est) },
        { id: "diff", lab: "Compare", ask: "A classmate's line of fit is " + m3EqH(mC, cC) + ", which estimates " + m3F(E) + " when <i>x</i> is " + X + ". How far apart are the two estimates?", pre: "difference ≈", ans: diff, tol: .15, hint: ["Subtract the smaller estimate from the larger one.", m3F(Math.max(est, E)) + " − " + m3F(Math.min(est, E)) + " ≈ " + m3F(diff) + "."], line: "difference ≈ " + m3F(diff) }
      ];
      pb.ex = "The calculator's linear regression gives " + eqs + " with <i>r</i> = " + rs + ", a strong " + sgn + " correlation. At <i>x</i> = " + X + " the best-fit estimate is about " + m3F(est) + ". The classmate's line of fit gives " + m3F(E) + ", so the estimates are about " + m3F(diff) + " apart.";
      return pb;
    }
    return { generate: m3Make4 };
  }
};
