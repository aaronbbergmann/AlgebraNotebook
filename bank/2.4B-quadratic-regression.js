// Bank question 2.4B-quadratic-regression: Quadratic Regression (Algebra 2, 2.4 Example 4).
// A data table whose inputs are not equally spaced; the student enters it in Desmos, runs a quadratic regression
// and answers questions from the curve.
(window.AN_BANK || (window.AN_BANK = {}))["2.4B-quadratic-regression"] = {
  id: "2.4B-quadratic-regression",
  title: "Quadratic Regression",
  section: "2.4",
  example: 4,
  skills: ["quadratic regression", "data tables", "Desmos regression"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "solo"],
  engine: "word",
  writeRounds: 2,
  showWork: "QWA",
  patterns: {"sequence": "Try Another", "solo": "Submit"},
  version: 1,
  build: function () {
    var C2S244 = [
      { pic: "car", s: "The table shows the fuel efficiency " + c2Y + " (in miles per gallon) of a car at different speeds " + c2X + " (in miles per hour).", xn: "Speed (mi/h)", yn: "Fuel efficiency (mi/gal)", xs: [20, 24, 30, 36, 40, 45, 50, 56, 60, 70], up: false, vx: [46, 52], vy: [24, 32], wide: 0.012, ask: "max", what: "best gas mileage", u: "miles per gallon", xw: "speed", xu: "miles per hour", yw: "fuel efficiency", q: ["vx", "vy"] },
      { pic: "leaf", s: "The table shows how efficiently a plant turns light into energy, " + c2Y + " (percent), at temperatures " + c2X + " (in °C).", xn: "Temperature (°C)", yn: "Efficiency (%)", xs: [2, 5, 8, 11, 15, 18, 22, 26, 30], up: false, vx: [12, 16], vy: [85, 95], wide: 0.25, ask: "max", what: "greatest efficiency", u: "percent", xw: "temperature", xu: "°C", yw: "efficiency", q: ["vx", "vy", "yi", "xi"] },
      { pic: "ice", s: "The table shows the greatest weight " + c2Y + " (in tons) that ice " + c2X + " inches thick can hold.", xn: "Ice thickness (in.)", yn: "Weight (tons)", xs: [12, 14, 15, 18, 20, 24, 27], up: true, vx: [2, 6], vy: [-4, 0], wide: 0.09, ask: "est", X: 22, what: "weight ice 22 inches thick can hold", u: "tons", xw: "thickness", xu: "inches", yw: "weight it can hold", q: ["y"] },
      { pic: "brake", s: "The table shows the stopping distance " + c2Y + " (in feet) of a car at different speeds " + c2X + " (in miles per hour).", xn: "Speed (mi/h)", yn: "Stopping distance (ft)", xs: [20, 30, 40, 55, 65, 70], up: true, vx: [-30, -20], vy: [-10, 0], wide: 0.045, ask: "est", X: 45, what: "stopping distance at 45 miles per hour", u: "feet", xw: "speed", xu: "miles per hour", yw: "stopping distance", q: ["y", "yi"] },
      { pic: "scooter", s: "The table shows the number " + c2Y + " (in thousands) of people using shared scooters " + c2X + " weeks after they arrived in a city.", xn: "Weeks", yn: "Users (thousands)", xs: [1, 4, 6, 10, 12, 15, 20, 24, 25], up: true, vx: [0, 2], vy: [1, 2], wide: 0.026, ask: "est", X: 30, what: "number of users after 30 weeks", u: "thousand", xw: "number of weeks", xu: "weeks", yw: "number of users", q: ["y", "yi"] }
    ];
    function c2Reg(xs, ys) {   // least squares a, b, c and R²
      var S = [0, 0, 0, 0, 0], T = [0, 0, 0], n = xs.length, my = 0;
      xs.forEach(function (x, i) { var p = 1; for (var k = 0; k <= 4; k++) { S[k] += p; if (k <= 2) T[k] += p * ys[i]; p *= x; } my += ys[i] / n; });
      var M = [[S[4], S[3], S[2], T[2]], [S[3], S[2], S[1], T[1]], [S[2], S[1], S[0], T[0]]];
      for (var c = 0; c < 3; c++) { var piv = c; for (var r = c + 1; r < 3; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r; var tmp = M[c]; M[c] = M[piv]; M[piv] = tmp; for (r = 0; r < 3; r++) if (r !== c) { var f = M[r][c] / M[c][c]; for (var k2 = c; k2 < 4; k2++) M[r][k2] -= f * M[c][k2]; } }
      var a = M[0][3] / M[0][0], b = M[1][3] / M[1][1], cc = M[2][3] / M[2][2], ss = 0, st = 0;
      xs.forEach(function (x, i) { var e = ys[i] - (a * x * x + b * x + cc); ss += e * e; st += (ys[i] - my) * (ys[i] - my); });
      return { a: a, b: b, c: cc, r2: 1 - ss / st };
    }
    function c24Sg(v) { return v ? (v < 0 ? "-" : "+") + c2T(Math.abs(v), 6) : ""; }   // a signed number for Desmos LaTeX (+28, -20; nothing for 0)
    function c2Sig(v, n) { if (!v) return 0; var d = Math.ceil(Math.log10(Math.abs(v))), p = n - d; return c2R(Math.round(v * Math.pow(10, p)) / Math.pow(10, p), 8); }
    // 2.4B Quadratic Regression: the data go into a Desmos table and the quadratic regression runs; then the graph answers one question: the vertex, an intercept,
    // or the value at a given x (clicking the parabola shows the point).  Answers accept the rounded model's values and the full regression's alike
    function c2M244(tier) {
      for (var t = 0; t < 600; t++) {
        var sc = c2Pick(C2S244), qt = c2Pick(sc.q), h = sc.vx[0] + rnd(sc.vx[1] - sc.vx[0] + 1), k = sc.vy[0] + rnd(sc.vy[1] - sc.vy[0] + 1), a0 = (sc.up ? 1 : -1) * sc.wide * (0.85 + rnd(31) / 100);
        var y0 = sc.xs.map(function (x) { return a0 * (x - h) * (x - h) + k; }), spread = Math.max.apply(null, y0) - Math.min.apply(null, y0);
        var noise = Math.max(Math.abs(a0) * 6 + 0.15, spread * 0.012), xs = sc.xs.slice(), ys = xs.map(function (x, j) { return c2R(y0[j] + (rnd(21) - 10) / 10 * noise, 1); });   // (scatter in proportion to the data: stopping distances in the hundreds of feet scatter more)
        if (ys.some(function (y) { return y <= 0; })) continue;
        var R = c2Reg(xs, ys); if (R.r2 < 0.97 || R.r2 > 0.99995) continue;
        var a = c2Sig(R.a, 3), b = c2Sig(R.b, 3), c = c2Sig(R.c, 3), F = function (x) { return a * x * x + b * x + c; }, Ff = function (x) { return R.a * x * x + R.b * x + R.c; };
        var X = null, Y = null, Xr = null, Yr = null;   // the point the question is about: from the full regression (Desmos), and from the rounded model
        if (qt === "vx" || qt === "vy") { X = -R.b / (2 * R.a); Y = Ff(X); Xr = -b / (2 * a); Yr = F(Xr); }
        else if (qt === "yi") { X = 0; Y = R.c; Xr = 0; Yr = c; if (Y <= 0.05) continue; }
        else if (qt === "xi") { var dF = R.b * R.b - 4 * R.a * R.c, dr = b * b - 4 * a * c; if (dF <= 0 || dr <= 0) continue; X = Math.max((-R.b + Math.sqrt(dF)) / (2 * R.a), (-R.b - Math.sqrt(dF)) / (2 * R.a)); Xr = Math.max((-b + Math.sqrt(dr)) / (2 * a), (-b - Math.sqrt(dr)) / (2 * a)); Y = 0; Yr = 0; if (X < xs[xs.length - 1] || X > xs[xs.length - 1] * 2.5) continue; }
        else { X = sc.X; Y = Ff(X); Xr = X; Yr = F(X); }
        var isX = qt === "vx" || qt === "xi", ans = c2R(isX ? X : Y, 1), alt = isX ? Xr : Yr, tol = Math.max(0.06, Math.abs(alt - (isX ? X : Y)) + 0.06, Math.abs(ans) * 0.005);
        var E = c2Sf(a, b, c, c2Y), pb = { kind: 20, sc: sc }, hi = sc.up ? "lowest" : "highest";
        var Q = qt === "vx" ? ["At what " + sc.xw + " is the " + sc.yw + " " + hi + "?", "Click the parabola: Desmos shows its " + hi + " point, the vertex. Read its " + c2X + "-coordinate.", c2X + " ≈", sc.xu, "the " + sc.yw + " is " + hi + " at " + c2X + " ≈ " + c2F(ans) + " " + sc.xu]
          : qt === "vy" ? ["What is the " + (sc.up ? "lowest " : "greatest ") + sc.yw + "?", "Click the parabola: Desmos shows its " + hi + " point, the vertex. Read its " + c2Y + "-coordinate.", c2Y + " ≈", sc.u, "the " + (sc.up ? "lowest " : "greatest ") + sc.yw + " is about " + c2F(ans) + " " + sc.u]
          : qt === "yi" ? ["What does the model give for the " + sc.yw + " when the " + sc.xw + " is 0?", "Click the parabola: Desmos shows where it crosses the " + c2Y + "-axis, the " + c2Y + "-intercept.", c2Y + " ≈", sc.u, "the " + c2Y + "-intercept is about " + c2F(ans) + " " + sc.u]
          : qt === "xi" ? ["At what " + sc.xw + " does the " + sc.yw + " fall to 0?", "Click the parabola: Desmos shows where it crosses the " + c2X + "-axis, the " + c2X + "-intercepts. Use the one to the right of the data.", c2X + " ≈", sc.xu, "the " + sc.yw + " falls to 0 at " + c2X + " ≈ " + c2F(ans) + " " + sc.xu]
          : ["Estimate the " + sc.what + ".", "On the parabola, find the point where " + c2X + " = " + X + " (click the parabola and drag along it: Desmos shows the point's coordinates).", c2Y + " ≈", sc.u, "at " + c2X + " = " + X + ", " + c2Y + " ≈ " + c2F(ans) + " " + sc.u];
        pb.head = sc.s; pb.pic = c2Pic(sc.pic);
        pb.story = sc.s;
        pb.tq = "<div class=\"regQ\">" + Q[0] + "</div><div class=\"supp\">Round to the nearest tenth.</div>";   // (the question goes under the table, bold and larger; the rounding in plain type below it)
        pb.dsm = { reg: 1, xs: xs.slice(), ys: ys.slice(), rg: "ax_{1}^{2}+bx_{1}+c" };
        pb.tbl = m3Tbl(sc.xn.replace(/ \(.*/, ""), sc.yn.replace(/ \(.*/, ""), xs, ys.map(function (v) { return c2F(v); }));
        var xa = c2Axis(0, Math.max(xs[xs.length - 1], X) + 1), ya = c2Axis(0, Math.max.apply(null, ys.concat([Y])) * 1.12);
        pb.dsm.xmax = xa.max; pb.dsm.ymax = ya.max;
        pb.fig = function (x) { return DSM.fail ? fig0(x) : ""; };   // (a blank Desmos graph takes the place of the scatter plot; it comes back only if Desmos cannot load)
        var fig0 = function (x) {
          x = x || {}; var o = { xmin: 0, xmax: xa.max, ymin: 0, ymax: ya.max, gx: xa.g, gy: ya.g, tx: xa.t, ty: ya.t, xl: sc.xn, yl: sc.yn, alt: "Scatter plot", scat: xs.map(function (v, j) { return [v, ys[j]]; }) };
          if (x.reg) o.curves = [{ fn: F, col: C2P }];
          if (x.av) o.pts = [{ x: Xr, y: Yr, col: C2P, lab: "(" + c2F(c2R(Xr, 1)) + ", " + c2F(c2R(Yr, 1)) + ")", tc: C2P }];
          return c2Fig(o);
        };
        var ptX = X, ptY = Y;
        pb.steps = [
          { id: "dsm", fine: 1, lab: "Desmos", type: "dsm", ask: "", after: function (x) { x.reg = true; }, line: "quadratic regression in Desmos: " + E[0] + " (rounded)", hint: ["Type each pair on a row of the table, then add a quadratic regression.", "The regression is about " + E[0] + "."] },
          { id: "ans", lab: "Answer", ask: function () { return mode === "solo" ? "" : "Use the graph. " + Q[0]; }, /* (Write: no instructions; the story asks the question) */ pre: Q[2], post: Q[3], ans: ans, tol: tol, nums: [c2R(isX ? Y : X, 1), c2R(ans * 1.1 + (ans ? 0 : 1), 1), c2R(ans * 0.9 - (ans ? 0 : 1), 1)].filter(function (v, j, A) { return Math.abs(v - ans) > tol && A.indexOf(v) === j; }), after: function (x) { x.av = true; }, line: Q[4],   // (Sequence: the other coordinate, and 10% either way, as the wrong choices)
            hint: [Q[1], "The point is about (" + c2F(c2R(X, 1)) + ", " + c2F(c2R(Y, 1)) + ")."],
            dpre: function (run, then) {   // the demo: the hand clicks the parabola at the point, and Desmos labels it
              var box = $("dsmCalc"); if (!DSM.calc || DSM.fail) { then(); return; } try { box.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (er) { }
              pgWait(450, function () { if (pgRun !== run) return; var rb = box.getBoundingClientRect(); handGo(vpDsmPx(ptX, ptY) || { x: rb.left + rb.width * 0.7, y: rb.top + rb.height * 0.45 }, 700); });
              pgWait(1300, function () { if (pgRun !== run) return; handTap(); try { DSM.calc.setExpression({ id: "rqp", latex: "\\left(" + c2T(c2R(ptX, 2), 6) + "," + c2T(c2R(ptY, 2), 6) + "\\right)", color: "#7A3FB5", showLabel: true }); } catch (er) { } pgWait(1400, then); });
            } }
        ];
        pb.ex = "In Desmos, the quadratic regression of the table gives about " + E[0] + ". On its graph, " + Q[4] + ".";
        var ax = function (v, xr) { return c2R(v, 1); }, ptLab = "(" + c2F(c2R(X, 1)) + ", " + c2F(c2R(Y, 1)) + ")";
        var gq = function (pt) {   // Show work's graph: the data, the parabola, and (for the answer) the point, labelled
          var o = { H: 300, xmin: 0, xmax: xa.max, ymin: 0, ymax: ya.max, gx: xa.g, gy: ya.g, tx: xa.t * 2, ty: ya.t * 2, noGrid: 1, xl: sc.xn, yl: sc.yn, alt: pt ? "The answer on the graph" : "The regression on the graph", scat: xs.map(function (v, j) { return [v, ys[j]]; }), curves: [{ fn: Ff, col: "#2D70B3" }] };
          if (pt) o.pts = [{ x: X, y: Y, col: "#6042A6", tc: "#6042A6", lab: ptLab, dy: -10 }];
          return "<div style=\"color:#1B2433;--bg:#fff\">" + c2Fig(o).replace("<svg ", "<svg width=\"520\" ") + "</div>";
        };
        var tdS = "border:1px solid #ccd;padding:.2em .55em;text-align:center;font:.8em system-ui,sans-serif", thS = tdS + ";font-weight:700;text-align:left;background:#f3f4f8";
        var dataT = "<table style=\"border-collapse:collapse\"><tr><th style=\"" + thS + "\">" + sc.xn + "</th>" + xs.map(function (v) { return "<td style=\"" + tdS + "\">" + c2F(v) + "</td>"; }).join("") + "</tr><tr><th style=\"" + thS + "\">" + sc.yn + "</th>" + ys.map(function (v) { return "<td style=\"" + tdS + "\">" + c2F(v) + "</td>"; }).join("") + "</tr></table>";
        var qPt = qt === "vx" || qt === "vy" ? "(?, ?)" : qt === "yi" ? "(0, ?)" : qt === "xi" ? "(?, 0)" : "(" + c2F(X) + ", ?)";   // (the point asked for, its unknown a ?)
        pb.qwa = { Q: [[dataT], [qPt]],   // (Show work, abbreviated: the data and the point asked for; the graph, simplified, with the answer's point; the point)
          W: [["Quadratic regression in Desmos: " + E[0] + " (rounded)", ["dsm"]], [function (x) { return gq(!!(x && x.av)); }, ["dsm"]]],   // (one graph: the answer's point joins it once the question is answered)
          A: [[ptLab, ["ans"]]] };
        return pb;
      }
    }


    return { generate: c2M244, scenarios: C2S244 };
  }
};
