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

## The shared engine (since 2026-11-26, Question Bank migration step 2)

The app lives in three files:
- `engine/app.js`: all of the app's code.
- `engine/styles.css`: the app's styles.
- `engine/page.html`: the page shell (head, font block, the page's HTML), with the markers `<!--ENGINE_CSS-->` and `<!--ENGINE_JS-->`.

Make every change in these files, then run `python3 tools/build_pages.py`. It writes every activity page (`1-1a/index.html` … `3-4b/`, `playsolve/`, `playgraph/`, `playdata/`, `revq2/`, `revt1/`) and the root `index.html` (icon paths without `../`). Each page loads `engine/` with a version stamp, so browsers fetch the new code after a change. Never edit a page's `index.html` by hand; `python3 tools/build_pages.py --check` reports any page that is out of date. Commit `engine/` and the rebuilt pages together.

Every activity, 1.1A to 3.4B (with RevT1 and RevQ2), is an assignment now (`P-<abbreviation>`, written into the Assignments tab by the server: `CONVERTED` and `CONVERTED2` in server/Code.gs). New work is made as assignments in the builder (teacher/build/). The activities' folders (`1-1a` … `3-4b`, `revt1`, `revq2`) are redirect pages that the build script writes from tools/redirects.json (each old `?ex=` to the assignment and question that has it now); the engine keeps their definitions (VIEWS, the reviews) for the presets and for copying old progress, and `GONE` keeps them out of the activity menu. The rows below that name these activities still describe the exercises' copies.

Folders that are not activity pages (`1-1`, `1-2`, `2-1`, `2-4`, `1-1play`, `playsolver`, `teacher`) are not built from the engine.

- `bank/`: the question bank. Each converted question is one file, `bank/<id>.js`, that registers its definition in `AN_BANK` (id, version, title, section, Example, skills, tiers, modes, engine, Write rounds, Show work, patterns) and a `build()` returning its generator and scenarios. The engine finds it with `bankQ(id)` / `bankGen(id)`; the build script loads every file in `bank/`. A question used in two activities (2.4A and 3.1C Vertex & Point) is one file. Raise `version` on every content change. A Chapter 3 equation exercise drawn from Play Solve's levels keeps its levels in its bank file's `solve` (the generators stay shared engine code, since Play Solve uses them too).
- Seeds: every problem made by the 2.x / 3.1 word-problem engine has `pb.seed`; `withSeed(seed, fn)` makes the same problem again. All randomness goes through `rnd()` (never `Math.random()` in a generator).
- Converting a question: record problems from fixed seeds first (old code), move it, and check the same seeds give identical problems; only the intended changes may differ.

No file or folder name may start with `_`: GitHub Pages does not publish them (the site then misses the file). `bank/place.js` holds where each bank question runs (read by the engine and the builder, `teacher/build/`, which tools/build_pages.py writes from `engine/build.html`).

Preset assignments (`/a/?id=P-<activity>`) must match their activities: `node tools/check_presets.js` (run it after any change to levels, exercises or bank/place.js).

Syntax check before a commit: `node --check engine/app.js` (and each changed file in `bank/`).

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
| Multiplying Binomials (box method) | 2.4A Box Method (2.4, lesson 6) | 3.1A, 3.1B and 3.1C Binomials (3.1, lesson 15); 3.1D Box Method (3.1, lesson 5). Different section numbers: listed in COPYG in the page |
| Vertex and a Point | 2.4A Vertex & Point (2.4, lesson 1) | 3.1C Vertex & Point (3.1, lesson 18, the same generator c2M241). Different section numbers: listed in COPYG in the page |
| Square Roots: Simplify | 3.1B (3.1, lesson 17) | 3.1C |
| Square Roots (solve, x² = 36, (x + 6)² = 63) | 3.1B (3.1, lesson 3) | Play Solve (sq, sqg levels); 3.1B Square Roots: Simplify (lesson 17) and 3.3A Complete the Square use the same solver steps (± and √, dragging terms, the exponent) |
| Chapter 3 equation exercises (3.1B, 3.1D–G, 3.3A, 3.4A) | Play Solve levels (sq, sqg, zp, grp, fm, cs, qu; expression levels 5, 13) | Each exercise's bank file (`solve`) names its levels; C3SV in engine/app.js maps each 3.1 lesson to them |
