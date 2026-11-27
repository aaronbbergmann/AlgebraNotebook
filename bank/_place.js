// Where each bank question runs: its section (the engine's activity id) and exercise number, [act, lesson, substitution?, variant name, copy?].
// A question with several exercises (1.2 Writing Transformations, 2.1 Transformations) lists each; a fifth entry, 1, marks a copy placed in
// another activity (the copies log), which practice leaves out.  Read by the engine (practice /q/, assignments /a/) and the builder.
window.AN_QPLACE = {
  "1.1A-parents": [["1.1", 1]], "1.1A-graph-describe": [["1.1", 2]], "1.1B-estimate": [["1.1", 3]],
  "1.2-write-transformations": [["1.2", 1, 0, "Translations"], ["1.2", 3, 0, "Stretches"], ["1.2", 2, 0, "Reflections"], ["1.2", 4, 0, "Combining"], ["1.2", 5, 0, "Profit"]],
  "1.3B-equation": [["1.3", 1]], "1.3B-compare": [["1.3", 2]], "1.3B-line-of-fit": [["1.3", 3]], "1.3B-best-fit": [["1.3", 4]],
  "1.4A-graphing": [["1.4D", 4]], "1.4B-one-variable": [["1.4D", 1]], "1.4B-substitution": [["1.4D", 2, 1]], "1.4C-2x2-systems": [["1.4D", 2]], "1.4D-3x3-systems": [["1.4D", 3]],
  "2.1A-graph-transformations": [["2.1", 1, 0, "Translations"], ["2.1", 2, 0, "Reflect & Stretch"], ["2.1", 3, 0, "Write g"]], "2.1B-real-life": [["2.1", 4]],
  "2.2A-vertex-form": [["2.2", 1]], "2.2A-standard-form": [["2.2", 2]], "2.2C-min-max": [["2.2", 3]], "2.2C-intercept-form": [["2.2", 4]], "2.2C-compare": [["2.2", 5]],
  "2.2B-interval-notation": [["2.2", 6]], "2.2B-domain": [["2.2", 7]], "2.2B-range": [["2.2", 8]], "2.2B-increasing": [["2.2", 9]], "2.2B-decreasing": [["2.2", 10]],
  "2.2C-memorize": [["2.2", 11]], "2.2C-characteristics": [["2.2", 12]],
  "2.4A-vertex-point": [["2.4", 1], ["3.1", 18, 0, "", 1]], "2.4A-point-intercepts": [["2.4", 2]], "2.4B-quadratic-regression": [["2.4", 4]], "2.4A-3step-equations": [["2.4", 5]],
  "2.4A-box-method": [["2.4", 6], ["3.1", 15, 0, "", 1], ["3.1", 5, 0, "", 1]], "2.4A-square-roots": [["2.4", 7]], "2.4B-distributing": [["2.4", 8]],
  "3.1A-graphing": [["3.1", 1]], "3.1B-square-roots": [["3.1", 3]], "3.1C-real-life": [["3.1", 4]], "3.1D-factoring": [["3.1", 6]], "3.1E-solve-factoring": [["3.1", 7]],
  "3.1F-special-products": [["3.1", 8]], "3.1G-factor-ac": [["3.1", 9]], "3.3A-complete-square": [["3.1", 10]], "3.3B-vertex-form": [["3.1", 11]], "3.4A-quadratic-formula": [["3.1", 12]],
  "3.4B-discriminant": [["3.1", 13]], "3.1A-4step-equations": [["3.1", 14]], "3.1B-simplify-roots": [["3.1", 16]], "3.1B-square-roots-simplify": [["3.1", 17]], "3.1C-real-life-desmos": [["3.1", 19]]
};
