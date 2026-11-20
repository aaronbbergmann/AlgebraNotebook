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

Every activity page (`1-1a/index.html` … `2-4b/index.html`, `3-1a/` … `3-4b/`, `playsolve/`, `playgraph/`, `playdata/`, `revq2/`, `revt1/`) is the same file. The root `index.html` differs from them only in its icon paths (no `../`).

Make a change in one copy, then copy it to the others. Apply the same patch to the root `index.html`.

## Copies log

An exercise that lives in more than one place is listed here. A change to one copy is made to every copy. Starting mode is shared between copies; stars are not.

**Always, for every change to an exercise:**
1. Look the exercise up in this table (and in C3SV in the page, for the Chapter 3 equation exercises).
2. Make the same change in every copy. A change to shared engine code (Play Solve's solver, the box method, the quiz engine) reaches every copy once the page copies are synced; a change to one exercise's own generator or settings must be repeated for each copy.
3. Test the change in at least one copy besides the one in the screenshot, and name the copies in the reply to the user.
4. When a new copy is made (an exercise added to a review, a second day, a Playground), add a row here in the same commit.
5. Starting mode is shared automatically when the copies have the same section and exercise number (VIEWS) or are review questions. A copy under a different section or exercise number (2.4 lesson 6 and 3.1 lesson 15) must also be added to `COPYG` in the page, or it will not share its starting mode.

| Exercise | Original | Copies |
|---|---|---|
| Memorizing Parents | 1.1A (act 1.1, lesson 1) | RevT1 Q1 |
| Graphing and Describing Translations | 1.1A (1.1, lesson 2) | RevT1 Q3; Play Graph |
| Estimating a Value from a Graph | 1.1B (1.1, lesson 3) | Play Data |
| Combining Transformations | 1.2C (1.2, lesson 4) | RevT1 Q4 |
| Equation from a Graph | 1.3B (1.3, lesson 1) | RevT1 Q5 |
| Graphing (systems; word problem) | 1.4A (1.4D, lesson 4) | RevT1 Q6 Graphing, Q8 Word Problem |
| One Variable | 1.4B (1.4D, lesson 1) | Play Solve |
| Substitution | 1.4B (1.4D, lesson 2, subx) | RevT1 Q6 Substitution |
| 2x2 Systems (solutions, elimination) | 1.4C (1.4D, lesson 2) | RevT1 Q2, Q6 Elimination |
| 3x3 Systems | 1.4D (1.4D, lesson 3) | RevT1 Q7 |
| Transformations with a and h, k | 2.1A (2.1) | Play Graph |
| Graphing Vertex Form | 2.2A (2.2, lesson 1) | RevQ2 Q3 |
| Graphing Standard Form | 2.2A (2.2, lesson 2) | RevQ2 Q1 |
| Minimum and Maximum Values | 2.2C (2.2, lesson 3) | RevQ2 Q2 |
| Characteristics of a Parabola | 2.2C (2.2, lesson 12) | RevQ2 Q4 |
| Graphing Intercept Form | 2.2C (2.2, lesson 4) | RevQ2 Q5 |
| Comparing Different Forms | 2.2C (2.2, lesson 5) | RevQ2 Q6 |
| 3-Step Equations | 2.4A (2.4, lesson 5) | 2.4B; Play Solve |
| Box Method, Distributing, Square Roots | 2.4A/2.4B (2.4, lessons 6, 8, 7) | Play Solve; 3.1B Simplify Roots, 3.1D Box Method and 3.1A Binomials (3.1, lessons 2, 5 and 15) use the same generators |
| Multiplying Binomials (box method) | 2.4A Box Method (2.4, lesson 6) | 3.1A and 3.1B Binomials (3.1, lesson 15); 3.1D Box Method (3.1, lesson 5). Different section numbers: listed in COPYG in the page |
| Square Roots (solve, x² = 36, (x + 6)² = 63) | 3.1B (3.1, lesson 3) | Play Solve (sq, sqg levels); 3.1B Square Roots: Simplify (lesson 17) and 3.3A Complete the Square use the same solver steps (± and √, dragging terms, the exponent) |
| Chapter 3 equation exercises (3.1B, 3.1D–G, 3.3A, 3.4A) | Play Solve levels (sq, sqg, zp, grp, fm, cs, qu; expression levels 5, 13) | C3SV in the page maps each 3.1 lesson to its levels |
