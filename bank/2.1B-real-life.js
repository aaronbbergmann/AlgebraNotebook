// Bank question 2.1B-real-life: Real Life (Algebra 2, 2.1 Example 4).
(window.AN_BANK || (window.AN_BANK = {}))["2.1B-real-life"] = {
  id: "2.1B-real-life",
  title: "Real Life",
  section: "2.1",
  example: 4,
  skills: ["transformations", "modeling"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 3,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    // ---- 2.1, fourth exercise: Using a Transformed Quadratic.  A path h(x) = ax² + bx + c lands at x = R; it must land D feet farther (or closer), so the whole path moves
    // up (or down) by -h(R + D): g(x) = h(x) + k.  The textbook's Example 4 and its What If (closer).
    var C2S214 = [
      { pic: "hose", s: "A firefighter sprays water from a hose.", w: "water", land: "hits the ground", from: "the fire truck", up: "The crew raises the aerial ladder", dn: "The crew lowers the aerial ladder" },
      { pic: "fount", s: "A fountain in a park shoots a jet of water from a nozzle.", w: "water", land: "lands", from: "the nozzle", up: "The park crew raises the nozzle", dn: "The park crew lowers the nozzle" },
      { pic: "sprink", s: "A garden sprinkler sprays a stream of water across a lawn.", w: "water", land: "lands", from: "the sprinkler", up: "The gardener puts the sprinkler on a taller stand", dn: "The gardener puts the sprinkler on a shorter stand" },
      { pic: "cannon", s: "A water cannon at a splash park shoots a stream of water.", w: "water", land: "lands", from: "the cannon", up: "The cannon is lifted onto a higher platform", dn: "The cannon is moved down onto a lower platform" },
      { pic: "boat", s: "A fireboat sprays water across a river.", w: "water", land: "hits the river", from: "the fireboat", up: "The crew raises the water gun on its tower", dn: "The crew lowers the water gun on its tower" }
    ];
    function c2M214(tier) {
      for (var t = 0; t < 2000; t++) {
        var q = c2Pick(tier === 0 ? [10, 20] : tier === 1 ? [20, 25] : [20, 25, 50]), R = c2Pick([20, 25, 30, 40, 50, 60]), r1 = c2Pick([-5, -10, -15, -20, -25]);
        var D = tier === 2 && rnd(2) ? -c2Pick([5, 10]) : c2Pick([5, 10]), N = R + D;
        var hN = -(N - r1) * (N - R) / q; if (!Number.isInteger(hN) || !hN) continue;
        var a = -1 / q, b = (R + r1) / q, c = -r1 * R / q;
        if (!Number.isInteger(c * 100) || !Number.isInteger(c2R(b * 100, 6)) || c < 4 || c > 45 || b <= 0) continue;
        var peak = c + b * b * q / 4; if (peak > 70) continue;
        var k = -hN, sc = c2Pick(C2S214), H = function (x) { return a * x * x + b * x + c; }, G = function (x) { return H(x) + k; };
        var hS = c2Sf(a, b, c, "<i>h</i>(" + c2X + ")"), gS = c2Sf(a, b, c + k, "<i>g</i>(" + c2X + ")"), far = D > 0, dir = k > 0 ? "up" : "down";
        var pb = { kind: 20, sc: sc };
        pb.gr = { a: a, b: b, c: c, R: R, N: N, D: D, k: k, hN: hN, peak: peak, xmax: Math.max(R, N) + 5 };
        pb.head = hS[0].replace(/<[^>]+>/g, "");
        pb.pic = c2Pic(sc.pic);
        pb.story = sc.s + " The height (in feet) of the " + sc.w + " is modeled by <span class=\"lm cf\">" + hS[0] + "</span>, where " + c2X + " is the horizontal distance (in feet) from " + sc.from + ". " + (far ? sc.up : sc.dn) + " so that the " + sc.w + " " + sc.land + " " + Math.abs(D) + " feet " + (far ? "farther from" : "closer to") + " " + sc.from + ". Write a function <i>g</i> that models the new path.";
        var xa = c2Axis(0, Math.max(R, N) + 5), ya = c2Axis(Math.min(0, hN, k < 0 ? 0 : 0), Math.max(peak, peak + k) + 2);
        pb.fig = (function (xa, ya) { return function (x) {
          x = x || {}; var o = { xmin: 0, xmax: xa.max, ymin: ya.min, ymax: ya.max, gx: xa.g, gy: ya.g, tx: xa.t, ty: ya.t, xl: "Horizontal distance (feet)", yl: "Height (feet)", alt: sc.s };
          o.curves = [{ fn: H, col: C2B, lo: 0, hi: x.gv ? Math.max(R, N) + 5 : R + (far ? Math.abs(D) + 4 : 0) }];
          o.pts = [{ x: R, y: 0, col: C2B, lab: true, dy: 16, an: "start" }];
          if (x.hv) { o.pts.push({ x: N, y: hN, col: C2G, lab: true, dy: hN < 0 ? 16 : -8, an: "start" }); o.segs = [{ x1: N, y1: hN, x2: N, y2: 0, col: C2G, dash: "5 4" }]; }
          if (x.gv) { o.curves.push({ fn: G, col: C2P, lo: 0, hi: N }); o.pts.push({ x: N, y: 0, col: C2P, lab: true, dy: -8, an: far ? "start" : "end" }); }
          return c2Fig(o);
        }; })(xa, ya);
        var wrongs = [c2Sf(a, b, c - k, "<i>g</i>(" + c2X + ")")[0], c2Sf(a, b + k, c, "<i>g</i>(" + c2X + ")")[0], c2Sf(a, b, c + D, "<i>g</i>(" + c2X + ")")[0]];
        pb.steps = [
          { id: "hN", lab: "<i>h</i>(" + N + ")", ask: c2S("Because <i>h</i>(" + R + ") = 0, the " + sc.w + " now " + sc.land + " " + R + " feet from " + sc.from + ". The new path must be at height 0 when " + c2X + " = " + N + ". Find the height of the old path there: <i>h</i>(" + N + ").", "Find <i>h</i>(" + N + "), the height of the old path at " + c2X + " = " + N + "."),
            pre: "<i>h</i>(" + N + ") =", ans: hN, after: function (x) { x.hv = true; }, hint: ["Replace every " + c2X + " in <i>h</i>(" + c2X + ") with " + N + ".", c2F(a) + "(" + N + ")² + " + c2F(b) + "(" + N + ") + " + c2F(c) + " = " + c2F(hN) + "."], line: "<i>h</i>(" + N + ") = " + c2F(hN) },
          { id: "k", fine: 1, lab: "shift", ask: "To bring the point (" + N + ", " + c2F(hN) + ") to height 0, how far " + dir + " must the whole path move?", pre: dir, post: "feet", ans: Math.abs(k), wrong: function (v) { return v === -Math.abs(k) ? "Type how far, as a positive number. The direction is already " + dir + "." : ""; }, hint: ["The new path must be at 0 where the old one is at " + c2F(hN) + ".", "From " + c2F(hN) + " to 0 is " + Math.abs(k) + " feet " + dir + "."], line: "a translation " + Math.abs(k) + " feet " + dir },
          { id: "g", lab: "<i>g</i>(" + c2X + ")", type: "fn", ask: c2S("Moving " + dir + " " + Math.abs(k) + " " + (k > 0 ? "adds" : "subtracts") + " " + Math.abs(k) + " to the output: <i>g</i>(" + c2X + ") = <i>h</i>(" + c2X + ") " + (k > 0 ? "+ " : "− ") + Math.abs(k) + ". Write <i>g</i>(" + c2X + ") and simplify.", "Write <i>g</i>(" + c2X + ")."),
            fn: G, xs: [0, 5, 10, 20, 30, 40, 2.5], rtol: 1e-6, eg: "g(x) = −0.05x^2 + 1.5x + 20", typed: gS[1], fo: c2Fo(gS[0], wrongs), after: function (x) { x.gv = true; },
            wrongFn: function (f) { return c2Same(f, H, [0, 10, 20]) ? "That is still h(x). Add " + k + " to the output." : c2Same(f, function (x) { return H(x) - k; }, [0, 10, 20]) ? "Check the direction: the path moves " + dir + "." : ""; },
            hint: ["Add " + c2F(k) + " to the constant term of <i>h</i>(" + c2X + ").", gS[0] + "."], line: gS[0] },
          { id: "chk", fine: 1, lab: "check", ask: "Check: find <i>g</i>(" + N + "). The new path should be on the ground there.", pre: "<i>g</i>(" + N + ") =", ans: 0, hint: ["Put " + N + " into <i>g</i>(" + c2X + ").", "<i>h</i>(" + N + ") " + (k > 0 ? "+ " : "− ") + Math.abs(k) + " = " + c2F(hN) + (k > 0 ? " + " : " − ") + Math.abs(k) + " = 0."], line: "<i>g</i>(" + N + ") = 0 ✓" }
        ];
        pb.ex = "Because <i>h</i>(" + R + ") = 0, the " + sc.w + " " + sc.land + " " + R + " feet away. To land at " + N + " feet, the path must be at height 0 there, but <i>h</i>(" + N + ") = " + c2F(hN) + ". So the path moves " + dir + " " + Math.abs(k) + " feet: " + gS[0] + ", and <i>g</i>(" + N + ") = 0.";
        return pb;
      }
    }
    return { generate: c2M214, scenarios: C2S214 };
  }
};
