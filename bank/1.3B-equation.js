// Bank question 1.3B-equation: Equation from a Graph (Algebra 2, 1.3 Example 1).
(window.AN_BANK || (window.AN_BANK = {}))["1.3B-equation"] = {
  id: "1.3B-equation",
  title: "Equation from a Graph",
  section: "1.3",
  example: 1,
  skills: ["slope", "linear equations", "word problems"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 3,
  showWork: "GUESS",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    function m3Make1(tier) {
      for (var t = 0; t < 800; t++) {
        var sc = m3Pick(M3A); if (tier === 0 && sc.sg < 0) continue;
        var b = m3Pick(sc.bs), m = m3Pick(sc.ms), xmax; if (b === Math.abs(m) || Math.abs(m) === 1) continue;
        if (sc.sg > 0) xmax = m3Pick([6, 8, 10]); else { if (b % -m) continue; xmax = b / -m; if (xmax < 4 || xmax > 12) continue; }
        var x2 = 2 + rnd(xmax - 3), ks = [], kk; for (kk = 2; kk < xmax; kk++) if (kk !== x2) ks.push(kk);
        var k = m3Pick(ks), y2 = b + m * x2, T = b + m * k; if (T <= 0 || y2 <= 0) continue;
        var maxy = Math.max(b, b + m * xmax), ys = m3Step1(maxy), ymax = Math.ceil(maxy / ys) * ys, up = m > 0, dir = (sc.pl ? "go " : "goes ") + (up ? "up" : "down"), amt = Math.abs(m);
        var mean = sc.yv + " " + dir + " " + m3U(sc, amt) + " for each " + sc.x1 + ".";
        var opts = m3Sh([
          { t: mean, ok: true },
          { t: sc.yv + " " + dir + " " + m3U(sc, b) + " for each " + sc.x1 + ".", ok: false, why: "That number, " + m3F(b) + ", is where the line starts (the y-intercept), not the slope." },
          { t: sc.yv + " " + (sc.pl ? "go " : "goes ") + (up ? "down " : "up ") + m3U(sc, amt) + " for each " + sc.x1 + ".", ok: false, why: "Look at the graph: the line goes " + (up ? "up" : "down") + " as you move right." },
          { t: sc.yv + (sc.pl ? " are " : " is ") + m3U(sc, b) + " at the start.", ok: false, why: "That is what the y-intercept means. The slope is the change for each " + sc.x1 + "." }
        ]);
        var cap = sc.xn.toLowerCase() === sc.xu ? sc.xn : sc.xn + " (" + sc.xu + ")", pb = { kind: 1, sc: sc, b: b, m: m, x2: x2, y2: y2, k: k, T: T };
        pb.head = sc.s; pb.pic = m3Svg(sc.pic);
        pb.story = sc.s + " Write an equation of the line, tell what its slope means, and answer the question at the end.";
        pb.fig = function (x) {
          x = x || {}; var o = { xmax: xmax, ymax: ymax, xs: xmax <= 10 ? 1 : 2, ys: ys, xl: cap, yl: sc.yn + " (" + sc.yu + ")", alt: sc.s, line: { m: m, b: b } };
          if (mode !== "sequence" && mode !== "demo" && mode !== "calculate") { o.pts = [{ x: 0, y: b }, { x: x2, y: y2, lab: true, dy: up ? 18 : -9 }]; return m3Fig(o); }
          var cs = m3Step(), rs = x.rs || [];
          o.xt = sc.xn.toLowerCase() === sc.xu ? [[sc.xn, "xu"]] : [[sc.xn, "xn"], ["(" + sc.xu + ")", "xu"]]; o.yt = [[sc.yn, "yn"], ["(" + sc.yu + ")", "yu"]]; o.labOn = !!(cs && cs.type === "sent");
          o.pts = [];
          var cal = mode === "calculate";   // (Calculate: the numbers are for the student to find)
          if (x.b) o.pts.push({ x: 0, y: b, lab: !x.rr && !cal, dy: up ? 18 : -9 });
          o.pts.push({ x: x2, y: y2, lab: cal || !x.rr, dy: up ? 18 : -9, hollow: !x.rr && rs.indexOf("b") < 0 });
          if (x.rr) {
            var RG = "#2E9E4F", RB = "#2D70B3", Xp = function (v) { return 58 + v / xmax * 268; }, Yp = function (v) { return 22 + 200 - v / ymax * 200; }, below = up && Yp(b) < 196;
            o.arrows = [
              { x1: 0, y1: b, x2: x2, y2: b, col: RG, lab: cal ? "" : "run = " + x2, lx: Xp(x2 / 2), ly: Yp(b) + (below ? 15 : -7) },
              { x1: x2, y1: b, x2: x2, y2: y2, col: RB, lab: cal ? "" : "rise = " + m3F(y2 - b), lx: Xp(x2) + (Xp(x2) + 78 > 336 ? -8 : 8), ly: (Yp(b) + Yp(y2)) / 2 + 4, an: Xp(x2) + 78 > 336 ? "end" : "start" }
            ];
          }
          if (x.pt) { o.guide = { x: k, y: T }; o.pts.push({ x: k, y: T, lab: true, left: true, dy: up ? -8 : 16 }); }
          return m3Fig(o);
        };
        pb.steps = [
          { id: "b", fine: 1, lab: "b", ask: "Where does the line cross the <i>y</i>-axis? That number is <i>b</i>.", pre: "<i>b</i> =", ans: b, hint: ["The <i>y</i>-intercept is the point where the line meets the vertical axis, at <i>x</i> = 0.", "The line crosses the vertical axis at " + b + "."], line: "<i>b</i> = " + m3F(b) },
          { id: "rise", fine: 1, lab: "rise", ask: "The line also goes through (" + x2 + ", " + y2 + "). Find the rise from (0, " + b + ") to (" + x2 + ", " + y2 + "): " + y2 + " − " + b + ".", pre: "rise =", ans: y2 - b, hint: ["Rise is how much <i>y</i> changes: the new <i>y</i> minus the old <i>y</i>.", y2 + " − " + b + " = " + m3F(y2 - b) + "."], line: "rise = " + y2 + " − " + b + " = " + m3F(y2 - b) },
          { id: "run", fine: 1, lab: "run", ask: "Find the run from <i>x</i> = 0 to <i>x</i> = " + x2 + ".", pre: "run =", ans: x2, hint: ["Run is how much <i>x</i> changes.", x2 + " − 0 = " + x2 + "."], line: "run = " + x2 + " − 0 = " + x2 },
          { id: "m", fine: 1, lab: "m", after: function (x) { x.mt = true; }, ask: "The slope is rise ÷ run: " + m3F(y2 - b) + " ÷ " + x2 + ".", pre: "<i>m</i> =", ans: m, wrong: function (v) { return v === -m ? "Check the sign: the line goes " + (up ? "up" : "down") + " as you move right." : v * m === 1 ? "Rise goes on top: slope = rise ÷ run." : ""; }, hint: ["Slope = rise ÷ run.", m3F(y2 - b) + " ÷ " + x2 + " = " + m3F(m) + "."], line: "<i>m</i> = " + m3F(y2 - b) + " ÷ " + x2 + " = " + m3F(m) },
          { id: "eq", lab: "Equation", ask: "Write the equation of the line: <i>y</i> = <i>mx</i> + <i>b</i> with your numbers.", pre: "", type: "eq", a: m, b: b, hint: ["Put the slope in for <i>m</i> and the <i>y</i>-intercept in for <i>b</i>.", "The slope is " + m3F(m) + " and <i>b</i> is " + b + ": " + m3Eq(m, b) + "."], line: function (p, x, s) { return m3EqH(m, b); }, wrongEq: function (f) { return Math.abs(f(0) - b) < 1e-6 ? "The <i>y</i>-intercept is right. Check the slope." : Math.abs(f(1) - f(0) - m) < 1e-6 ? "The slope is right. Check where the line crosses the <i>y</i>-axis." : "Not quite. Try again."; } },
          { id: "mean", lab: "Slope", ask: "What does the slope mean in this story?", type: "pick", opts: opts, hint: ["The slope is the change in " + sc.yn.toLowerCase() + " for each 1 " + sc.x1 + ".", "The slope is " + m3F(m) + ": " + mean] , line: "The slope " + m3F(m) + " means: " + mean.charAt(0).toLowerCase() + mean.slice(1) },
          { id: "sub", fine: 1, lab: "subtract", ask: "To answer, solve " + T + " = " + m3Co(m) + "<i>x</i> + " + b + ". First subtract " + b + " from both sides.", pre: T + " − " + b + " =", ans: T - b, hint: ["Take " + b + " away from both sides to get the <i>x</i> term alone.", T + " − " + b + " = " + m3F(T - b) + "."], line: T + " − " + b + " = " + m3F(T - b) },
          { id: "x", lab: sc.xu.charAt(0).toUpperCase() + sc.xu.slice(1), ask: sc.tq(T), pre: "<i>x</i> =", post: sc.xu, ans: k, hint: ["Solve " + T + " = " + m3Co(m) + "<i>x</i> + " + b + " for <i>x</i>.", "Subtract " + b + ", then divide by " + m3F(m) + ": " + m3F(T - b) + " ÷ " + m3F(m) + " = " + k + "."], line: "<i>x</i> = " + m3F(T - b) + " ÷ " + m3F(m) + " = " + k }
        ];
        var yw = sc.yv.replace(/^The /, ""); sc.yw = yw;
        pb.isteps = [
          { id: "yint", lab: "y-intercept", type: "yint", ask: "Find the <i>y</i>-intercept.", hint: ["The <i>y</i>-intercept is where the line meets the vertical axis, at <i>x</i> = 0.", "Click the line right where it touches the vertical axis."], after: function (x) { x.bv = true; }, line: "<i>y</i>-intercept: (0, " + b + "), so <i>b</i> = " + b },
          { id: "rr", lab: "rise and run", type: "rr", after: function (x) { x.rv = x.nv = true; }, ask: "Find the rise and the run.", hint: ["Click the <i>y</i>-intercept, then the other point.", "The arrows go across (run) and up or down (rise) between the two points."], line: "rise = " + y2 + " − " + b + " = " + m3F(y2 - b) + ", run = " + x2 + " − 0 = " + x2 },
          { id: "frac", lab: "slope formula", type: "frac", ask: "Find the slope: rise ÷ run.", hint: ["Rise goes on top of the fraction and run on the bottom.", "Drag the rise tile to the top and the run tile to the bottom."], line: "slope = rise ÷ run = " + m3F(y2 - b) + " ÷ " + x2 },
          pb.steps[3],
          { id: "eqd", lab: "Equation", type: "eqd", ask: "Write the equation: drag the slope and the <i>y</i>-intercept into <i>y</i> = <i>mx</i> + <i>b</i>.", hint: ["The slope <i>m</i> goes in front of <i>x</i>. The <i>y</i>-intercept <i>b</i> goes at the end.", "Drag the <i>m</i> tile and the <i>b</i> tile into the blanks."], line: m3EqH(m, b) },
          { id: "sent", lab: "Slope", type: "sent", ask: "What does the slope mean in this story?", hint: ["The slope is the change in " + sc.yn.toLowerCase() + " for each 1 " + sc.x1 + ".", "Click " + sc.yn + ", then its unit, then the unit of the <i>x</i>-axis. Choose up or down."], line: "The slope " + m3F(m) + " means: the " + yw + " " + (sc.pl ? "go " : "goes ") + (up ? "up " : "down ") + amt + " " + sc.yu + " for each " + sc.x1 + "." },
          { id: "pt", lab: "Point", type: "clickpt", ask: sc.tq(T) + " Click the point on the line that helps answer it.", hint: ["The question gives <i>y</i> = " + T + ". Find the point on the line at that height.", "Click the line where <i>y</i> is " + T + "."], line: "The point (" + k + ", " + T + ") is on the line" },
          pb.steps[6], pb.steps[7]
        ];
        pb.csteps = [
          { id: "yint", lab: "y-intercept", type: "yint", ask: "Find the <i>y</i>-intercept.", hint: pb.isteps[0].hint, line: "The line crosses the <i>y</i>-axis at the point marked" },
          { id: "bT", lab: "b", ask: "What is the <i>y</i>-intercept? Read <i>b</i> from the graph.", pre: "<i>b</i> =", ans: b, after: function (x) { x.bv = true; }, hint: ["Look at where the marked point is on the vertical axis.", "The line crosses the vertical axis at " + b + "."], line: "<i>b</i> = " + b },
          Object.assign({}, pb.isteps[1], { after: null, line: "The points (0, " + b + ") and (" + x2 + ", " + y2 + ") are marked" }),
          { id: "riseT", lab: "rise", ask: "Find the rise, the change in <i>y</i> from the <i>y</i>-intercept to (" + x2 + ", " + y2 + ").", pre: "rise =", ans: y2 - b, after: function (x) { x.rv = true; }, wrong: function (v) { return v === b - y2 ? "Check the sign: the line goes " + (up ? "up" : "down") + " as you move right." : ""; }, hint: ["Rise is the new <i>y</i> minus the old <i>y</i>.", y2 + " \u2212 " + b + " = " + m3F(y2 - b) + "."], line: "rise = " + y2 + " \u2212 " + b + " = " + m3F(y2 - b) },
          { id: "runT", lab: "run", ask: "Find the run, the change in <i>x</i> between the same two points.", pre: "run =", ans: x2, after: function (x) { x.nv = true; }, hint: ["Run is the new <i>x</i> minus the old <i>x</i>.", x2 + " \u2212 0 = " + x2 + "."], line: "run = " + x2 + " \u2212 0 = " + x2 },
          pb.isteps[2],
          Object.assign({}, pb.steps[3], { ask: "Find the slope: rise \u00f7 run." }),
          pb.isteps[4],
          Object.assign({}, pb.isteps[5], { ask: "What does the slope mean in this story?" }),
          pb.isteps[6], pb.steps[6], pb.steps[7]
        ];
        pb.ex = "The line crosses the <i>y</i>-axis at " + b + ", so <i>b</i> = " + b + ". From (0, " + b + ") to (" + x2 + ", " + y2 + ") the rise is " + m3F(y2 - b) + " and the run is " + x2 + ", so the slope is " + m3F(m) + ". The equation is " + m3Eq(m, b) + ". " + mean + " To find <i>x</i> when <i>y</i> = " + T + ", solve " + T + " = " + m3Co(m) + "x + " + b + ": <i>x</i> = " + k + ".";
        var mc1 = m3Co(m);
        pb.guess = { G: [[gqM("(0, " + b + ")") + " the <i>y</i>-intercept, from the graph (" + sc.yu + ")"], [gqM("(" + x2 + ", " + y2 + ")") + " another point on the line"], [gqM("y = " + T) + " " + sc.yu]],
          U: [[gqM("m = ?") + " the slope"], [gqM("x = ?") + " " + sc.xu + ", when " + gqM("y = " + T)]],
          E: [[gqM("m = (y₂ − y₁) ÷ (x₂ − x₁)")], [gqM("y = mx + b")]],
          S1: [[gqM("m = (" + y2 + " − " + b + ") ÷ (" + x2 + " − 0)"), ["rise", "riseT", "rr"]], [gqM(T + " = " + mc1 + "x + " + b), ["sub", "x"]]],
          S2: [[gqM("m = " + m3F(y2 - b) + " ÷ " + x2 + " = " + m3F(m)), ["m"]], [gqM(m3Eq(m, b)), ["eq", "eqd"]], [gqM(T + " − " + b + " = " + mc1 + "x"), ["sub"]], [gqM(m3F(T - b) + " = " + mc1 + "x"), ["sub"]], [gqM("x = " + m3F(T - b) + " ÷ " + (m < 0 ? "(" + m3F(m) + ")" : m3F(m)) + " = " + k) + " " + sc.xu, ["x"]]],
          A: [[gqM("x = " + k) + " " + sc.xu + ": when the " + sc.yn.toLowerCase() + " is " + T + " " + sc.yu + ", " + sc.xn.toLowerCase() + " is " + k + " " + sc.xu + ".", ["x"]]] };
        return pb;
      }
    }
    return { generate: m3Make1 };
  }
};
