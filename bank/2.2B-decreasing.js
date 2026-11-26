// Bank question 2.2B-decreasing: Decreasing (Algebra 2, 2.2 Example 10).
(window.AN_BANK || (window.AN_BANK = {}))["2.2B-decreasing"] = {
  id: "2.2B-decreasing",
  title: "Decreasing",
  section: "2.2",
  example: 10,
  skills: ["increasing and decreasing", "interval notation"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 1,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    function c2M2210(tier) { return ivMono(tier, -1); }
    return { generate: c2M2210 };
  }
};
