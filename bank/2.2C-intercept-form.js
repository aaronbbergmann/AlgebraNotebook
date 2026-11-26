// Bank question 2.2C-intercept-form: Graphing Intercept Form (Algebra 2, 2.2 Example 4).
(window.AN_BANK || (window.AN_BANK = {}))["2.2C-intercept-form"] = {
  id: "2.2C-intercept-form",
  title: "Graphing Intercept Form",
  section: "2.2",
  example: 4,
  skills: ["intercept form", "x-intercepts", "graphing parabolas"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 2,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    // Example 4: Graphing a Quadratic Function in Intercept Form
    function c2M224(tier) {   // 2.2C Graphing Intercept Form: f(x) = a(x − p)(x − q) on the 2.2A Standard Form engine (table rows ts apart, p and q on rows 2 and 4)
      for (var t = 0; t < 4000; t++) {
        // p and q are 2 or 4 apart (ts = half the distance, also the spacing of the table's rows); a varies more as the round goes on
        var ts = c2Pick([1, 2]), a = c2Pick(tier === 0 ? [1, -1, 2, -2, 0.5, -0.5] : tier === 1 ? [1, -1, 2, -2, 0.5, -0.5, 3, -3] : [2, -2, 3, -3, 0.5, -0.5]);
        var p = c2Rng(-8, 6 - 2 * ts), q = p + 2 * ts, h = (p + q) / 2, k = -a * ts * ts;
        if (p - ts < -9 || q + ts > 9 || Math.abs(k) > 9 || (tier > 0 && p === 0) || q === 0 && tier === 0) continue;
        var F0 = function (x) { return a * (x - p) * (x - q); }, gp = 0; for (var gx = -10; gx <= 10; gx++) { var gy = F0(gx); if (Number.isInteger(gy) && Math.abs(gy) <= 10) gp++; }
        if (gp < 5) continue;   // (Write: at least 5 grid points on the parabola, inside the graph)
        var sw = rnd(2), p1 = sw ? q : p, q1 = sw ? p : q, fS = c2If(a, p1, q1, "<i>f</i>(" + c2X + ")");
        var pb = { kind: 20, vf: { std: 1, ip: 1, a: a, p1: p1, q1: q1, h: h, k: k, ts: ts } };
        pb.head = fS[0];   /* (c2Make turns it into plain text, fractions as a/b) */ pb.pic = ""; pb.story = "Graph <span class=\"lm cf\">" + fS[0] + "</span>.";
        pb.fig = function () { return ""; }; pb.steps = [{ id: "v" }];
        pb.ex = "In " + fS[0] + ", <i>a</i> = " + c2F(a) + ", <i>p</i> = " + c2F(p1) + " and <i>q</i> = " + c2F(q1) + ", so the " + c2X + "-intercepts are " + c2F(p) + " and " + c2F(q) + ". Put them in rows 2 and 4 of the table, fill in the other " + c2X + "-values, work out each <i>f</i>(" + c2X + "), and graph the points: the parabola opens " + (a > 0 ? "up." : "down.");
        return pb;
      }
    }
    return { generate: c2M224 };
  }
};
