// Bank question 2.2B-increasing: Increasing (Algebra 2, 2.2 Example 9).
(window.AN_BANK || (window.AN_BANK = {}))["2.2B-increasing"] = {
  id: "2.2B-increasing",
  title: "Increasing",
  section: "2.2",
  example: 9,
  skills: ["increasing and decreasing", "interval notation"],
  tiers: [0, 1, 2],
  modes: ["demo", "sequence", "calculate", "solo"],
  engine: "word",
  writeRounds: 1,
  showWork: "steps",
  patterns: {"solo": "Submit"},
  version: 1,
  build: function () {
    function c2M229(tier) { return ivMono(tier, 1); }
    return { generate: c2M229 };
  }
};
