// Bank question 2.2C-characteristics: Characteristics of a Parabola (Algebra 2, 2.2 Example 12).
(window.AN_BANK || (window.AN_BANK = {}))["2.2C-characteristics"] = {
  id: "2.2C-characteristics",
  title: "Characteristics of a Parabola",
  section: "2.2",
  example: 12,
  skills: ["vertex", "axis of symmetry", "intercepts", "domain and range"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 2,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    // 2.2C Characteristics of a Parabola: the equation and its graph, vertex labelled, are given; report the axis of symmetry, domain, range, increasing and
    // decreasing.  Demo, Sequence: Circle Back, multiple-choice buttons.  Calculate: a list of boxes, "Try Another" questioning (interval keys below them).
    function c2M2212(tier) {
      for (var t = 0; t < 2000; t++) {
        var a = c2Pick(tier === 0 ? [1, -1, 2, -2] : [1, -1, 2, -2, 0.5, -0.5, 3, -3]), h = c2Rng(-6, 6), k = c2Rng(-7, 7), b = -2 * a * h, c = a * h * h + k;
        if (!h || h === k || h === -k) continue;   // (so no wrong choice repeats the right one)
        var std = rnd(2) && Number.isInteger(b) && Number.isInteger(c), up = a > 0, F = function (x) { return a * (x - h) * (x - h) + k; };
        var fS = std ? c2Sf(a, b, c, "<i>f</i>(" + c2X + ")") : c2Vf(a, h, k, "x", "<i>f</i>(" + c2X + ")"), pb = { kind: 20, cb: 1, ta: 1, ivk: 1, qc: 1, wb: 1 };
        pb.head = fS[0];   /* (c2Make turns it into plain text, fractions as a/b) */ pb.pic = "";
        pb.story = "The graph of <span class=\"lm cf\">" + fS[0] + "</span> is shown, with its vertex labelled. Find the axis of symmetry, the domain and range, and where the function is increasing and decreasing.";
        pb.fig = function (x) { return c2Pl(c2Plane(k - 2, k + 2), x || {}, { alt: "Graph of f with its vertex", curves: [{ fn: F, col: C2P }], pts: [{ x: h, y: k, col: C2P, lab: true, dy: up ? 18 : -8 }] }); };
        var L = { v: -IVI }, Rr = { v: IVI }, K = { v: k, cl: true }, H = { v: h, cl: true }, I = function (p, q) { return ivStr([ivPc(p, q)]); };
        var D = I(L, Rr), Rg = up ? I(K, Rr) : I(L, K), Inc = up ? I(H, Rr) : I(L, H), Dec = up ? I(L, H) : I(H, Rr);
        // inequalities are the default way an answer is shown (x for increasing and decreasing, y for the range); the domain of a parabola is all real numbers
        var Q = function (v, op, n, html) { return (html ? (v === "y" ? c2Y : c2X) : v) + " " + op + " " + c2F(n); }, ge = "≥", le = "≤";
        var allR = "all real numbers", rgQ = function (H0) { return Q("y", up ? ge : le, k, H0); }, incQ = function (H0) { return Q("x", up ? ge : le, h, H0); }, decQ = function (H0) { return Q("x", up ? le : ge, h, H0); };
        var ax = c2X + " = " + c2F(h);
        pb.steps = [
          { id: "ax", lab: "Axis", type: "pick", ask: "What is the axis of symmetry?", opts: c2Pk(ax, [[c2X + " = " + c2F(k), "The axis is the vertical line through the vertex: use its x-coordinate, " + c2F(h) + "."], [c2Y + " = " + c2F(h), "The axis is a vertical line, so its equation is x = …"], [c2X + " = " + c2F(-h), "Check the sign: the vertex is at x = " + c2F(h) + "."]]), hint: ["The axis of symmetry is the vertical line through the vertex.", "The vertex is (" + c2F(h) + ", " + c2F(k) + "), so " + ax + "."], line: "axis of symmetry " + ax },
          { id: "dom", lab: "Domain", type: "pick", ask: "What is the domain?", opts: c2Pk(allR, [[Q("y", up ? ge : le, k, 1), "That describes the outputs (the range). Every x can go in."], [Q("x", up ? ge : le, h, 1), "The parabola goes on forever to the left and right: every x can go in."]]), hint: ["The domain is every x you can put in.", "A parabola's domain is all real numbers, (−∞, ∞)."], line: "domain: " + allR },
          { id: "rng", lab: "Range", type: "pick", ask: "What is the range?", opts: c2Pk(rgQ(1), [[Q("y", up ? le : ge, k, 1), "It opens " + (up ? "upward, so the outputs go up from " : "downward, so the outputs go down from ") + c2F(k) + "."], [allR, "The outputs never go " + (up ? "below " : "above ") + "the vertex's y-value, " + c2F(k) + "."], [Q("y", up ? ge : le, h, 1), "Use the vertex's y-value, " + c2F(k) + ", not its x-value."]]), hint: ["The range starts at the vertex's y-value.", "It opens " + (up ? "upward from " : "downward from ") + c2F(k) + ": " + rgQ(1) + "."], line: "range: " + rgQ(1) },
          { id: "inc", lab: "Increasing", type: "pick", ask: "Where is the function increasing?", opts: c2Pk(incQ(1), [[decQ(1), "That is where it decreases. Read the graph from left to right."], [Q("x", up ? ge : le, k, 1), "Use the vertex's x-value, " + c2F(h) + ", not its y-value."]]), hint: ["Move left to right along the graph: where does it go up?", "It goes up " + (up ? "after x = " : "until x = ") + c2F(h) + ": " + incQ(1) + "."], line: "increasing: " + incQ(1) },
          { id: "dec", lab: "Decreasing", type: "pick", ask: "Where is the function decreasing?", opts: c2Pk(decQ(1), [[incQ(1), "That is where it increases. Read the graph from left to right."], [Q("x", up ? le : ge, k, 1), "Use the vertex's x-value, " + c2F(h) + ", not its y-value."]]), hint: ["Move left to right along the graph: where does it go down?", "It goes down " + (up ? "until x = " : "after x = ") + c2F(h) + ": " + decQ(1) + "."], line: "decreasing: " + decQ(1) }
        ];
        // Calculate and Write: boxes; each answer may be typed in interval notation or as an inequality (increasing/decreasing in x, the range in y; the ends at the
        // vertex may be open or closed for increasing and decreasing); the domain is all real numbers, typed as (−∞, ∞), ℝ or in words
        var ivOk = function (want, alt) { return function (v) { var t0 = String(v || "").trim(); if (/^(ℝ|R|all real numbers)$/i.test(t0)) t0 = "(−∞, ∞)"; var r = ivParse(t0); if (!r.pcs) return false; var got = ivStr(r.pcs); return got === want || (alt && got === alt); }; };
        var op = function (iv) { return iv.replace("[" + ivNum(h) + ",", "(" + ivNum(h) + ",").replace(", " + ivNum(h) + "]", ", " + ivNum(h) + ")"); };
        var inq = function (t0) {   // "x ≥ 3", "x>=3", "3 <= x", "y≤−2" → { v, op, n } with the variable on the left
          t0 = String(t0 || "").replace(/\s+/g, "").replace(/[−–]/g, "-").replace(/>=|=>/g, "≥").replace(/<=|=</g, "≤").toLowerCase();
          var num = "(-?\\d+(?:\\.\\d+)?(?:/\\d+)?)", m = t0.match(new RegExp("^([xy])([≥≤<>])" + num + "$")), fl = { "≥": "≤", "≤": "≥", "<": ">", ">": "<" };
          if (!m) { var m2 = t0.match(new RegExp("^" + num + "([≥≤<>])([xy])$")); if (!m2) return null; m = [0, m2[3], fl[m2[2]], m2[1]]; }
          var n = m[3].indexOf("/") > 0 ? +m[3].split("/")[0] / +m[3].split("/")[1] : +m[3]; return isFinite(n) ? { v: m[1], op: m[2], n: n } : null;
        };
        var inqOk = function (v0, ops, n) { return function (v) { var q = inq(v); return !!q && q.v === v0 && ops.indexOf(q.op) >= 0 && Math.abs(q.n - n) < 1e-9; }; };
        var either = function (f1, f2) { return function (v) { return f1(v) || f2(v); }; };
        pb.tsteps = [
          { id: "ax", pre: "Axis of Symmetry:", w: 6.5, own: 1, word: function (v) { var m = String(v || "").replace(/\s+/g, "").replace(/[−–]/g, "-").toLowerCase().match(/^x=(-?\d+(?:\.\d+)?)$/); return !!m && Math.abs(+m[1] - h) < 1e-9; }, show: "x = " + c2F(h), line: "axis of symmetry " + ax },   // (the whole equation, like x = 2)
          { id: "dom", pre: "Domain:", w: 8, iv: 1, own: 1, word: ivOk(D), show: allR + ", (−∞, ∞)", line: "domain: " + allR },
          { id: "rng", pre: "Range:", w: 8, iv: 1, own: 1, word: either(ivOk(Rg), inqOk("y", [up ? ge : le], k)), show: rgQ() + " or " + Rg, line: "range: " + rgQ(1) },
          { id: "inc", pre: "Increasing:", w: 8, iv: 1, own: 1, word: either(ivOk(Inc, op(Inc)), inqOk("x", up ? [ge, ">"] : [le, "<"], h)), show: incQ() + " or " + Inc, line: "increasing: " + incQ(1) },
          { id: "dec", pre: "Decreasing:", w: 8, iv: 1, own: 1, word: either(ivOk(Dec, op(Dec)), inqOk("x", up ? [le, "<"] : [ge, ">"], h)), show: decQ() + " or " + Dec, line: "decreasing: " + decQ(1) }
        ];
        pb.ex = "The vertex is (" + c2F(h) + ", " + c2F(k) + "), so the axis of symmetry is " + ax + ". Every x can go in, so the domain is all real numbers. The parabola opens " + (up ? "upward" : "downward") + " from " + c2F(k) + ", so the range is " + rgQ(1) + ". Reading left to right, it " + (up ? "decreases for " + decQ(1) + " and increases for " + incQ(1) : "increases for " + incQ(1) + " and decreases for " + decQ(1)) + ".";
        return pb;
      }
    }
    return { generate: c2M2212 };
  }
};
