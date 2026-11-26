// Bank question 2.2C-min-max: Minimum and Maximum Values (Algebra 2, 2.2 Example 3).
(window.AN_BANK || (window.AN_BANK = {}))["2.2C-min-max"] = {
  id: "2.2C-min-max",
  title: "Minimum and Maximum Values",
  section: "2.2",
  example: 3,
  skills: ["minimum and maximum", "vertex"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 2,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    // Example 3: Finding a Minimum or a Maximum Value (ends with the y-value of the vertex)
    // Demo, Sequence: Circle Back. a, b and c are clicked in the equation (they stay listed), then opens up or down, minimum or maximum, x = −b/(2a), and the
    // y-value of the vertex on a one-row table (x and the work in the centre already filled in).  Calculate: a list of boxes, "Try Another" questioning.
    // Write: minimum or maximum, and the value.
    function c2M223(tier) {
      for (var t = 0; t < 2000; t++) {
        var a = c2Pick(tier === 0 ? [1, -1, 2, -2] : tier === 1 ? [2, -2, 3, -3, 0.5] : [3, -3, 4, -4, 0.5, -0.5]), h = c2Rng(-5, 5), k = c2Rng(-8, 8), b = -2 * a * h, c = a * h * h + k;
        if (!Number.isInteger(b) || !Number.isInteger(c) || !h || !c) continue;
        var F = function (x) { return a * x * x + b * x + c; }, up = a > 0, mm = up ? "minimum" : "maximum";
        var fS = c2Sf(a, b, c, "<i>f</i>(" + c2X + ")"), pb = { kind: 20, cb: 1, ta: 1, qc: 1, noPt: 1, wb: 1, mx: { a: a, b: b, c: c, h: h, k: k } };   /* (noPt: the demo ends on the minimum or maximum value, with no point clicked on the graph) */
        pb.head = fS[0];   /* (c2Make turns it into plain text, fractions as a/b) */ pb.pic = "";
        // the equation, with a, b and c each a part that can be clicked (Demo, Sequence)
        var eqC = function () {
          var st = m3Step(), live = st && st.type === "eqc" && QZ.step < 4, co = c2Co(a)[0], cb = c2Q(Math.abs(b))[0];
          var sp = function (k0, inner, one) { return "<span class=\"vfnE m3c" + (one ? " vfnE1" : "") + (live ? " live" : "") + "\" data-m3c=\"" + k0 + "\"" + (one ? " title=\"No number here means a = 1\"" : "") + ">" + inner + "</span>"; };
          return "<i>f</i>(" + c2X + ") = " + sp("a", co, a === 1) + c2X + "² " + sp("b", (b < 0 ? "− " : "+ ") + (Math.abs(b) === 1 ? "" : cb)) + c2X + " " + sp("c", (c < 0 ? "− " : "+ ") + c2F(Math.abs(c)));
        };
        Object.defineProperty(pb, "story", { enumerable: true, configurable: true, get: function () {
          var eq = mode === "demo" || mode === "sequence" ? eqC() : fS[0];
          return "Find the minimum or maximum value of <span class=\"lm cf\">" + eq + "</span>.";
        } });
        pb.fig = function (x) { x = x || {}; if (!x.vv && mode !== "calculate") return ""; return c2Pl(c2Plane(k - 2, k + 2), x, { alt: "Graph of f", curves: [{ fn: F, col: C2P }], vl: [{ x: h, col: C2G, lab: c2X + " = " + c2F(h) }], pts: [{ x: h, y: k, col: C2P, lab: true, dy: up ? 18 : -8 }] }); };
        // the one-row table for the y-value of the vertex: x and the work are filled in (Demo, Sequence, once x = −b/(2a) is found)
        var work = (a === 1 ? "" : a === -1 ? "−" : c2F(a)) + "(" + c2F(h) + ")² " + (b < 0 ? "− " : "+ ") + c2F(Math.abs(b)) + "(" + c2F(h) + ") " + (c < 0 ? "− " : "+ ") + c2F(Math.abs(c));
        // the work, one operation per click: the square, a times it (unless a = ±1), b times h, then adding left to right
        var WS = (function () {
          var L = [work], sq = h * h, t1 = a * sq, t2 = b * h, row = function (A) { return A.map(function (v, i) { return i === 0 ? c2F(v) : (v < 0 ? "− " : "+ ") + c2F(Math.abs(v)); }).join(" "); };
          var bS = (b < 0 ? "− " : "+ ") + c2F(Math.abs(b)) + "(" + c2F(h) + ")", cS = (c < 0 ? "− " : "+ ") + c2F(Math.abs(c));
          if (Math.abs(a) !== 1) L.push(c2F(a) + "(" + c2F(sq) + ") " + bS + " " + cS);
          L.push(c2F(t1) + " " + bS + " " + cS); L.push(row([t1, t2, c])); L.push(row([t1 + t2, c])); L.push(c2F(k));
          return L;
        })();
        pb.tbl = function (x) {
          x = x || {}; var cs = m3Step(); if (!(mode === "demo" || mode === "sequence") || !(x.xh || x.vv || (cs && cs.id === "val"))) return "";   // (also when x = −b/(2a) was missed and comes back later: the y-value question always has its table)
          return "<table class=\"cmpG m3Row\"><thead><tr><th class=\"lm\"><i>x</i></th><th class=\"lm\"><i>f</i>(<i>x</i>)</th><th class=\"lm\"><i>y</i></th></tr></thead><tbody><tr><td class=\"lm\">" + c2F(h) + "</td><td class=\"lm" + (cs && cs.type === "tclick" && QZ.step < 4 ? " m3tc live" : "") + "\"" + (cs && cs.type === "tclick" ? " data-m3tc=\"1\" title=\"Click to work it out, one step at a time\"" : "") + ">" + (x.vv ? work : WS[Math.min(x.ts || 0, WS.length - 1)]) + "</td><td class=\"lm\">" + (x.vv ? c2F(k) + " <span class=\"cueOk\">✓</span>" : "?") + "</td></tr></tbody></table>";
        };
        var sayA = a === 1 ? "No number in front of " + c2X + "² means a = 1." : "a is the number in front of " + c2X + "².";
        pb.steps = [
          { id: "a", fine: 1, lab: "a", type: "eqc", k: "a", ans: a, ask: "Find <i>a</i>.", hint: [sayA, "<i>a</i> = " + c2F(a) + "."], line: "<i>a</i> = " + c2F(a) },
          { id: "b", fine: 1, lab: "b", type: "eqc", k: "b", ans: b, ask: "Find <i>b</i>.", hint: ["b is the number in front of " + c2X + ", with its sign.", "<i>b</i> = " + c2F(b) + "."], line: "<i>b</i> = " + c2F(b) },
          { id: "c", fine: 1, lab: "c", type: "eqc", k: "c", ans: c, ask: "Find <i>c</i>.", hint: ["c is the constant term, with its sign.", "<i>c</i> = " + c2F(c) + "."], line: "<i>c</i> = " + c2F(c) },
          { id: "op", fine: 1, lab: "Opens", type: "pick", ask: "Does the parabola open upward or downward?", opts: c2Pk(up ? "Upward" : "Downward", [[up ? "Downward" : "Upward", "Look at the sign of <i>a</i> = " + c2Q(a)[0] + ": positive opens upward, negative opens downward."]]), hint: ["The sign of <i>a</i> tells you.", "<i>a</i> = " + c2Q(a)[0] + ", so it opens " + (up ? "upward" : "downward") + "."], line: "opens " + (up ? "upward" : "downward") },
          { id: "mm", lab: "Min or max", type: "pick", ask: "Does <i>f</i> have a minimum value or a maximum value?", opts: c2Pk(up ? "A minimum" : "A maximum", [[up ? "A maximum" : "A minimum", "It opens " + (up ? "upward, so the vertex is the lowest point." : "downward, so the vertex is the highest point.")]]), hint: ["Opening upward gives a minimum; opening downward gives a maximum.", "It opens " + (up ? "upward: a minimum." : "downward: a maximum.")], line: "a " + mm },
          { id: "xv", fine: 1, noseq: 1, lab: "x of vertex", ask: "The " + mm + " is at the vertex, where " + c2X + " = −<i>b</i>/(2<i>a</i>). Find " + c2X + ".", pre: c2X + " =", ans: h, after: function (x) { x.xh = true; }, wrong: function (v) { return v === -h ? "Remember the negative sign: " + c2X + " = −b/(2a)." : ""; }, hint: ["<i>a</i> = " + c2Q(a)[0] + " and <i>b</i> = " + c2F(b) + ".", "−(" + c2F(b) + ")/(2 · " + c2Q(a)[0] + ") = " + c2F(h) + "."], line: c2X + " = −<i>b</i>/(2<i>a</i>) = " + c2F(h) },
          { id: "val", lab: "Value", ask: c2S("Find the <i>y</i>-value of the vertex: work out <i>f</i>(" + c2F(h) + ") in the table. That is the " + mm + " value.", "Find the minimum or maximum value: the <i>y</i>-value of the vertex."), pre: c2Y + " =", ans: k, after: function (x) { x.vv = true; }, hint: ["Work out " + work + ".", "<i>f</i>(" + c2F(h) + ") = " + c2F(k) + "."], line: "the " + mm + " value is " + c2F(k) }
        ];
        // Demo, Sequence: the y-value is found by clicking the work in the table (one operation per click)
        pb.isteps = pb.steps.map(function (st) { return st.id !== "val" ? st : { id: "val", lab: "Value", type: "tclick", n: WS.length - 1, ans: k, ask: "Find the " + mm + " value.", after: st.after, hint: st.hint, line: st.line }; });
        // Calculate ("Try Another"): every box at once
        var W1 = function (L) { return function (v) { return L.indexOf(String(v).trim().toLowerCase().replace(/\.$/, "")) >= 0; }; };
        pb.tsteps = [
          { id: "a", pre: "<i>a</i> =", ans: a, line: "<i>a</i> = " + c2F(a) },
          { id: "b", pre: "<i>b</i> =", ans: b, line: "<i>b</i> = " + c2F(b) },
          { id: "c", pre: "<i>c</i> =", ans: c, line: "<i>c</i> = " + c2F(c) },
          { id: "op", pre: "Opens upward or downward?", w: 9, word: W1(up ? ["up", "upward", "upwards"] : ["down", "downward", "downwards"]), show: up ? "upward" : "downward", line: "opens " + (up ? "upward" : "downward") },
          { id: "mm", pre: "Minimum or maximum?", w: 9, word: W1(up ? ["min", "minimum", "a minimum"] : ["max", "maximum", "a maximum"]), show: mm, line: "a " + mm },
          { id: "xv", pre: c2X + " = −<i>b</i>/(2<i>a</i>) =", ans: h, line: c2X + " = −<i>b</i>/(2<i>a</i>) = " + c2F(h) },
          { id: "val", pre: "<i>y</i>-value of the vertex: <i>f</i>(" + c2X + ") =", ans: k, after: function (x) { x.vv = true; }, line: "the " + mm + " value is " + c2F(k) }
        ];
        pb.ex = "<i>a</i> = " + c2Q(a)[0] + ", <i>b</i> = " + c2F(b) + " and <i>c</i> = " + c2F(c) + ". <i>a</i> is " + (up ? "positive, so the parabola opens upward and has a minimum" : "negative, so the parabola opens downward and has a maximum") + ". At " + c2X + " = −<i>b</i>/(2<i>a</i>) = " + c2F(h) + ", <i>f</i>(" + c2F(h) + ") = " + work + " = " + c2F(k) + ", so the " + mm + " value is " + c2F(k) + ".";
        return pb;
      }
    }
    return { generate: c2M223 };
  }
};
