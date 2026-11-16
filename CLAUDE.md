# Algebra Notebook — notes for building

## Show work: two formats

Every word problem's **Show work** uses one of two formats. Pick the one that fits each new exercise.

- **GUESS** (Given, Unknown, Equation, Substitute, Solve, then the answer sentence): problems that use a formula and solve an equation.
  - Examples: 1.3 Equation from a Graph, Comparing Linear Equations and Line of Fit; 2.4A Vertex and a Point and Point and x-Intercepts.
  - Set `pb.guess = { G, U, E, S1, S2, A }`. Each part is a list of `[line, when]`. The renderer is `guessHTML(w)`.
- **QWA** (Question, Work, Answer): problems answered from a graph.
  - Question: the question, the data and the unknown.
  - Work: the graph, such as the regression and its curve. Once the question is answered, the answer's point is plotted on this same graph.
  - Answer: the point, and what it means. Don't draw the graph a second time.
  - Example: 2.4B Quadratic Regression.
  - Set `pb.qwa = { Q, W, A }`. Each part is a list of `[line, when]`. The renderer is `qwaHTML(w)`.

For both formats, `when` is one of:
- `null`: always shown.
- A list of step ids: shown once one of those steps is done.
- A function `(x, done)`.

Show work fills in as the work is done, and a finished problem shows all of it.

## Copies of the page

Every activity page (`1-1a/index.html` … `2-4b/index.html`, `playsolve/`, `playgraph/`, `playdata/`, `revq2/`, `revt1/`) is the same file. The root `index.html` differs from them only in its icon paths (no `../`).

Make a change in one copy, then copy it to the others. Apply the same patch to the root `index.html`.
