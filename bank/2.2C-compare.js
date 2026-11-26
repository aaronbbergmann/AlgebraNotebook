// Bank question 2.2C-compare: Comparing Different Forms (Algebra 2, 2.2 Example 5).
(window.AN_BANK || (window.AN_BANK = {}))["2.2C-compare"] = {
  id: "2.2C-compare",
  title: "Comparing Different Forms",
  section: "2.2",
  example: 5,
  skills: ["vertex form", "standard form", "intercept form"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 2,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 2,   // 2: step commands name the step only (no mechanics instructions)
  build: function () {
    // Example 5: Comparing Functions in Different Forms (two paths: one graphed, one in intercept form)
    var C2S225 = [
      { pic: "golf", s: "You hit two golf shots.", it: "shot", u: "yards", Ds: [80, 90, 100, 110, 120, 140, 160], Hs: [15, 40] },
      { pic: "soccer", s: "A soccer player kicks the ball twice.", it: "kick", u: "yards", Ds: [30, 40, 50, 60], Hs: [8, 20] },
      { pic: "punt", s: "A football player punts the ball twice.", it: "punt", u: "yards", Ds: [40, 50, 60, 70], Hs: [12, 30] },
      { pic: "frog", s: "A frog makes two jumps.", it: "jump", u: "inches", Ds: [20, 24, 30, 36, 40], Hs: [6, 16] },
      { pic: "balloon", s: "A water balloon launcher fires two balloons.", it: "launch", u: "feet", Ds: [60, 80, 100, 120], Hs: [15, 45] }
    ];
    function c2M225(tier) {
      for (var t = 0; t < 6000; t++) {
        var sc = c2Pick(C2S225), D1 = c2Pick(sc.Ds), D2 = c2Pick(sc.Ds), H1 = c2Rng(sc.Hs[0], sc.Hs[1]), a = c2Pick([0.01, 0.02, 0.025, 0.04, 0.05, 0.08, 0.1, 0.125, 0.2, 0.25]);
        var H2 = a * D2 * D2 / 4, a1 = c2R(-4 * H1 / (D1 * D1), 9); if (D1 === D2 || !Number.isInteger(H2) || H2 === H1 || H2 < sc.Hs[0] || H2 > sc.Hs[1] || D1 % 2 || D2 % 2) continue;
        if (Math.abs(a1 * 10000 - Math.round(a1 * 10000)) > 1e-7) continue;   // (the first path's a is a short decimal)
        if (tier < 2 && (D1 > D2) === (H1 > H2) && rnd(3)) continue;   // usually one goes farther and the other higher
        var F1 = function (x) { return a1 * (x - D1 / 2) * (x - D1 / 2) + H1; }, F2 = function (x) { return -a * x * (x - D2); }, u = sc.u, it = sc.it;
        var f1 = c2Vf(a1, D1 / 2, H1, "x", c2Y)[0], f2 = c2Y + " = −" + c2F(a) + c2X + "(" + c2X + " − " + D2 + ")", pb = { kind: 20, sc: sc };
        pb.dsm = { F1: F1, F2: F2, D1: D1, D2: D2, xmax: Math.max(D1, D2) * 1.12, ymax: Math.max(H1, H2) * 1.35, l1: "y=" + c2T(a1, 6) + "\\left(x-" + D1 / 2 + "\\right)^{2}+" + H1, l2: "y=-" + c2T(a, 6) + "x\\left(x-" + D2 + "\\right)" };
        pb.head = sc.s + " Path 1: " + f1.replace(/<[^>]+>/g, "") + "  Path 2: " + f2.replace(/<[^>]+>/g, ""); pb.pic = c2Pic(sc.pic);
        var st0 = sc.s + " In each path, " + c2X + " is the horizontal distance and " + c2Y + " is the height (both in " + u + ").<br>Path of the first " + it + ": <span class=\"lm\" style=\"color:#C74440\">" + f1 + "</span><br>Path of the second " + it + ": <span class=\"lm\" style=\"color:#2D70B3\">" + f2 + "</span>";   // (red and blue, as Desmos draws the first and second expressions)
        Object.defineProperty(pb, "story", { enumerable: true, configurable: true, get: function () { return st0; } });
        pb.cb = 1; pb.qc = 1; pb.grid = { it: it, u: u };   // (Circle Back in Demo, Sequence and Calculate; one static grid in Write)
        pb.fig = function () { return ""; };
        var far = D1 > D2 ? "first" : "second", hi = H1 > H2 ? "first" : "second";
        pb.steps = [
          { id: "gr", fine: 1, lab: "Graph", type: "dsm", ask: "Graph each path.", line: "graphed both paths in Desmos" },
          { id: "d1", lab: "Distance 1", ask: "How far does the first " + it + " travel before it lands?", post: u, ans: D1, hint: ["It starts at (0, 0) and lands at the other " + c2X + "-intercept.", "The other " + c2X + "-intercept is (" + D1 + ", 0)."], line: "first " + it + ": " + D1 + " " + u },
          { id: "h1", lab: "Height 1", ask: "What is the maximum height of the first " + it + "?", post: u, ans: H1, hint: ["The maximum is the vertex: the top of the path.", "The vertex is (" + D1 / 2 + ", " + H1 + ")."], line: "first " + it + " height: " + H1 + " " + u },
          { id: "d2", lab: "Distance 2", ask: "How far does the second " + it + " travel before it lands?", post: u, ans: D2, hint: ["Read the " + c2X + "-intercept where it lands.", "It lands at (" + D2 + ", 0)."], line: "second " + it + ": " + D2 + " " + u },
          { id: "h2", lab: "Height 2", ask: "What is the maximum height of the second " + it + "?", post: u, ans: H2, hint: ["Click the second path's maximum.", "The vertex is (" + D2 / 2 + ", " + H2 + ")."], line: "second " + it + " height: " + H2 + " " + u },
          { id: "far", lab: "Farther", type: "pick", ask: "Which " + it + " travels farther before landing?", opts: c2Pk("The " + far + " " + it, [["The " + (far === "first" ? "second" : "first") + " " + it, "Compare " + D1 + " and " + D2 + " " + u + "."]]), hint: ["Compare the two distances.", Math.max(D1, D2) + " " + u + " is farther."], line: "the " + far + " " + it + " travels farther" },
          { id: "hi", lab: "Higher", type: "pick", ask: "Which " + it + " travels higher?", opts: c2Pk("The " + hi + " " + it, [["The " + (hi === "first" ? "second" : "first") + " " + it, "Compare " + H1 + " and " + H2 + " " + u + "."]]), hint: ["Compare the two maximum heights.", Math.max(H1, H2) + " " + u + " is higher."], line: "the " + hi + " " + it + " travels higher" }
        ];
        pb.ex = "In Desmos, the first path lands at (" + D1 + ", 0) and its maximum is (" + D1 / 2 + ", " + H1 + "); the second lands at (" + D2 + ", 0) and its maximum is (" + D2 / 2 + ", " + H2 + "). So the " + far + " " + it + " travels farther and the " + hi + " " + it + " travels higher.";
        return pb;
      }
    }
    return { generate: c2M225, scenarios: C2S225 };
  }
};
