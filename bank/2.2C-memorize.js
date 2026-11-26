// Bank question 2.2C-memorize: Memorizing the Forms (Algebra 2, 2.2 Example 11).
(window.AN_BANK || (window.AN_BANK = {}))["2.2C-memorize"] = {
  id: "2.2C-memorize",
  title: "Memorizing the Forms",
  section: "2.2",
  example: 11,
  skills: ["standard form", "vertex form", "intercept form"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate"],
  engine: "word",
  writeRounds: 0,
  showWork: "steps",
  patterns: {},
  version: 1,
  build: function () {
    function c2M2211() {
      var ids = Object.keys(CS_CARDS); for (var i = ids.length - 1; i > 0; i--) { var j = rnd(i + 1), t = ids[i]; ids[i] = ids[j]; ids[j] = t; }
      return { kind: 30, cs: { order: ids, qs: mode === "calculate" ? csqMake() : null }, head: "Sort into three piles " + ids.join(""), pic: "", story: "Sort into three piles.", fig: function () { return ""; }, steps: [{ id: "cs" }],
        ex: "Standard Form is f(x) = ax² + bx + c: its vertex is at x = −b/(2a), which goes in the centre row of the table. Vertex Form is f(x) = a(x − h)² + k: (h, k) is the vertex, the centre row of the parent table. Intercept Form is f(x) = a(x − p)(x − q): p and q are the x-intercepts." };
    }
    return { generate: c2M2211 };
  }
};
