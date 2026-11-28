// Bank: Play Solve's difficulty ladder as Drag Equation pattern strings (migration/drag-equation/PLAN.md, step 3).
// ladder[i] is rung i of LADDER in engine/app.js (the same order, Larson & Boswell, Big Ideas Math Algebra 1); expr[i] is expression level EXLAD[i].
// The notation is described above dePattern() in engine/app.js. Checked by tools/de_patterns.js: every problem a pattern makes is read by the
// Drag Equation and classified by Play Solve onto its own rung. (Play Solve still uses its old generators until step 4 switches it over.)
(window.AN_BANK || (window.AN_BANK = {}))["play-solve"] = {
  id: "play-solve", version: 1, title: "Play Solve", engine: "drag",
  ladder: [],
  expr: []
};
