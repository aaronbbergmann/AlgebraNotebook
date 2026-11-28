# Drag Equation migration: tracker

Goal: one definition of a solve-by-dragging equation, the **Drag Equation engine**. Every Play Solve level and every exercise that solves
by dragging is an **instance**: a string handed to that engine (a fixed problem, `3(x - 2) + 4 = 19`, or a pattern for random problems).
A change to the engine reaches every instance. The rules depend only on what is on the screen, never on the level or exercise.

## Decisions (2026-11-28)

| Question | Decision |
|---|---|
| Random problems | Pattern strings (notation decided in step 3) |
| Systems (1.4 2×2, 3×3, Substitution) | Drag Equations too |
| Expressions with no "=" (box method, distributing, factoring, simplifying roots) | Drag Equations too |
| Rule conflicts | Settled by the teacher from a table (step 2) |
| Tracking | This file (no Claude Doc) |

## Steps

| # | Step | Status |
|---|---|---|
| 1 | Record the "before": every instance, 3 fixed seeds, its problem, each settled Demo state and the moves offered at each | Done 2026-11-28 |
| 2 | Rulebook: every per-level switch listed; where the same thing on screen follows different rules, a conflict table for the teacher | Done 2026-11-28 (all A) |
| 3 | `DragEquation` entry point taking a string; pattern notation; Play Solve's ladder as strings in one bank file (no behaviour change) | Done 2026-11-28 |
| 4 | Remove the per-level switches, one rule at a time, compared with the record after each | Done 2026-11-28 (main solver; 1–4 in step 5) |
| 5 | Row equations onto the engine: Play Solve's first 14 rungs, 1.4 One Variable, then Substitution, 2×2, 3×3 | Done 2026-11-28 |
| 6 | The word problems' built-in solvers (2.4A Vertex & Point and Intercepts, 3.1C Real Life, 3.1A) become instances | Next |
| 7 | Delete the old code and generators; CLAUDE.md and the copies log; the whole record again | Not started |

The site keeps working after every step; new behaviour stays behind a switch until it matches the record.

## What exists today (the starting point)

| Code | Used by |
|---|---|
| Row equations (columns per term) | Play Solve rungs 0, 3–9 and the inequality rungs (14 in all); 1.4B One Variable and Substitution, 1.4C 2×2, 1.4D 3×3, RevT1 copies |
| The main solver (EXP) | Play Solve's other 68 rungs and 18 expression levels; 2.4A/2.4B 3-Step, Box Method, Square Roots, Distributing; 3.1A–3.4B bank questions; Create mode |
| Built-in solvers inside word problems | 2.4A Vertex & Point and Intercepts, 3.1C Real Life, 3.1A |

The main solver's rules are switched per level by about a dozen flags (zpq, grq, quq, sq, av, lit, cmp, qf, dvq, qd, sf, c3), checked in 115 places;
problems are assembled by hand in 21 places; each level has its own generator.

## The record (step 1)

- Recorder: `tools/de_record.js` (Playwright, a fake clock and a seeded Math.random, so a run is exact and repeatable).
- Output: `migration/drag-equation/before.json` (one entry per instance: spec, and per seed the problem, the Demo's states, the moves offered).

- What it holds: 143 instances (82 Play Solve rungs, 18 expression levels, 43 assignment questions that solve by dragging: 1.4B–D, 2.4A–B,
  3.1A–3.4B, RevT1), 3 seeds each, 429 runs. 426 Demos finish; 3 do not (below).

## Step 3: the entry point (done) and the instance strings

- `deParse(string)` in engine/app.js reads an instance with Create's readers (the same code a typed problem goes through), with no change to the screen;
  `deText()` writes a problem back as its string. Create mode now shares the readers (`crSrc()`, `crErrEl()`), with no change for students.
- Instance strings: `3(x - 2) + 4 = 19`; a system with commas, `2x + y = 5, x - y = 1`; an expression with no "=", `3(x + 2) - 4x`;
  an optional goal or method after `;`, `x^2 + 6x + 5 = 0 ; complete the square`.
- Proof: `node tools/de_roundtrip.js` makes every recorded instance's problem (3 seeds), writes it, reads it back and compares:
  369 identical; 1 problem (rung 47) reads into the row equations instead of the main solver (step 5); 60 word-problem runs skipped (step 6).
- Pattern notation: `dePattern()` (described above it in engine/app.js): `[2..9]`, `[a=±2..9]`, `{r=±1..12}`, `{a*(r+b)+c}`, `{? gcd(a,b)=1}`,
  `[<|≤|>|≥]`, `<terms in random order>`.
- Play Solve's ladder as patterns: `bank/play-solve.js` (82 rungs, 18 expression levels). `node tools/de_patterns.js` compares each with its old
  generator (60 problems each, sorted by Play Solve's classifier): all 100 match (a rare kind can make one fail now and then; re-run).
- Variety the notation does not reproduce exactly (accepted for now): absolute value never on the right side; letter rungs use 6–8 fixed letter sets;
  some side-swap and term-order weights approximate; e1–e4 and e7 never use y; 51 always writes the ">" part first.

## Step 5: progress

5a, single equations (done 2026-11-28, behind the switch): Play Solve's 14 row-equation rungs and 1.4 One Variable are solved in the main
solver (each problem written as its string and read with `deParse(…, { main: true })`). That carries out decisions 1–4, which chose the main
solver's way: a term lands as its own term, an x term can cross the =, the coefficient divides every term at any time, and = offers + − × ÷.
Checked: with the switch on, exactly these 15 instances changed (every Demo finishes, no errors); with it off, the record is as before.
1.4 One Variable takes its rules from Chapters 2.4 and 3.1 exercises (svL), so moving to Substitution and back works (tools/de_tests/one_variable.js).

5b, systems (done 2026-11-28, behind the switch; the teacher chose "a system built on Drag Equations"): a system is a thin layer, its own
moves (multiply an equation, add two equations, put a known value or y = … in) unchanged. When a row comes down to one equation in one variable,
the system pauses (its state kept) and the Drag Equation solves that equation with its rules (written in x, shown with the system's letter);
the value goes back and the system carries on. Works for 2×2 elimination, the 3×3 (both stages) and Substitution, in Sequence, Demo (the
Demo hands over and takes back) and Calculate (the Drag Equation asks each step's arithmetic). Write still types each new equation, as before.
Also: a product of two numbers, 3(4), is multiplied without the box (the box is for multiplying into parentheses).
Fixed on the way: deRules read a plain linear equation into the row equations, so its rules were not worked out (a Demo could divide first).
Checked: switch on, exactly the 7 system instances changed (1.4B Substitution, 1.4C, 1.4D and their RevT1 copies), every Demo finishes, no
errors; switch off, as before. Tests: tools/de_tests/systems_*.js.

## Step 4: progress

| Change | Decision | Checked (record with the switch on vs before) |
|---|---|---|
| Rules from the screen: each problem's string read back by Create's readers; the level only names a goal | all | 5 instances changed, each traced to a decision below |
| Divide-first switched off everywhere | 12 | rung 15's Demo now distributes first |
| Quadratic Formula button whenever x² is on the screen | 8 | rungs 63, 71–74, 78, 3.1B, 3.1C, 3.1F, 3.4A |
| A level can name "divide first" (Play Solve's 1.2 rung keeps its lesson); "factor" steers Demo to factor whatever the default | 10, 12 | rungs 10, 63, 3.1F: the same Demo as before |
| While factoring, terms keep every move (dragging one down still opens the square) | 8 | grouping rungs 61, 66: the same Demo as before |
| A product = 0: dropping one factor onto the other multiplies them (the box) | 9 | tools/de_tests/moves.js |
| x² alone: the exponent can always be dragged across | 7 | moves.js (factoring rung 63) |
| Letters: dragging a coefficient divides every term; the box takes letters (a(x + 2), 2(x + a)), in Sequence and Calculate | 5, 6 | moves.js, box_letters.js |
| x on both sides with letters: the smaller onto the larger | 13 | moves.js |

| Calculate with letters: one term at a time (adding: nothing asked, as with numbers; multiplying and dividing by a letter: each term) | 14 | tools/de_tests/calculate_letters.js; dividing by a sum like (a + b) still types the new equation (its answer is not one number) |
| One answer box everywhere; a quadratic takes its set of answers ("4, -1/2"); tries still follow the place (assignment: one, Play Solve: unlimited) | 15 | tools/de_tests/one_box.js |
| Bug: √1 is now 1 (the Demo stopped at ±√1) | — | for everyone: rungs 75–77 seed 22 now finish |
| Bug: undoing a ± split turns split mode off (the Quadratic Formula button came back hidden) | — | for everyone: tools/de_tests/undo_split.js |

Step 4 is done for the main solver. Decisions 1–4 (dragging terms across the =, the x term, the coefficient, clicking the =) are about the row
equations, so they are done in step 5, when the row equations move onto this engine.

Full record after these (switch on): 30 instances changed, every one traced to a decision (new moves offered: 48 runs; the Quadratic Formula
button: 21; letters into the box: rungs 29, 31; smaller onto larger with letters: rung 28). Switch off: identical to before.

Bugs fixed on the way (they would have shown once letters reached the box): multiplying terms lost their letters (2 · a gave 2);
Calculate's check ignored letters on an x term (2x would have passed for 2ax).

With the switch off the record is identical to before (134 instances). The 9 graphing and data questions (RevT1 Q1, Q3–Q6, Q10, 2.4B Regression,
3.1A Graphing, 3.1C Desmos) are not drag equations and were taken out of the record.

## Step 4: the plan (prepared while step 3 finishes)

- One function works out every rule from what is on the screen and the instance's goal word; no level sets a rule any more.
- With no goal word, the method for Demo and Hint is what Create already infers from the content (factor a trinomial that factors, square roots for
  x² = 49, complete the square for x² + 6x = 7, ...); a goal word overrides it.
- The A choices then remove gates: letters limits (5, 6), factoring-only wiring (8), the zero-product lock (9), divide-first (12), the letters
  exception in Demo's order (13); Calculate one number at a time (14); one answer box (15).
- After each change: `node tools/de_record.js after.json`, then `node tools/de_diff.js migration/drag-equation/before.json after.json -v`;
  only the chosen differences may appear.

## Step 2: the rule conflicts (settled 2026-11-28: all A)

The full inventory of every switch is in `switches.md` (16 conflicts, C1–C16, with line numbers). As decisions:

| # | On the screen | Option A | Option B | Recommended | Chosen |
|---|---|---|---|---|---|
| 1 | A term dragged across the = | It lands as its own term; the student combines it (main solver) | It combines on landing (row equations) | A | A |
| 2 | An x term dragged across the = | Allowed everywhere | Only in Play Solve's first levels | A | A |
| 3 | The number in front of x dragged across the = | Allowed any time: every term on both sides is divided, fractions left to simplify | Only once the x term is alone on its side | A | A |
| 4 | Clicking the = | + − × ÷ everywhere (systems keep dragging one equation onto another to add) | 1.4 keeps "Multiply by" only | A | A |
| 5 | A number times parentheses | The box everywhere (letters and substitution too); Calculate asks each cell | Instant in some places | A | A |
| 6 | Letters as coefficients (ax + b = c) | The same moves as numbers | Keep today's limits (no coefficient drag, no box) | A | A |
| 7 | x² alone on its side (x² = 49) | The exponent can always be dragged across (square root) | Only in square-root levels | A | A |
| 8 | A quadratic = 0 | Every tool always there: the box (drag a term down), the Quadratic Formula button, completing the square, moving terms | Each level shows only its own tool | A | A |
| 9 | A product = 0, (x + 2)(x − 3) = 0 | Split it, or multiply it out (both allowed) | Split only | A | A |
| 10 | More than one way to solve (x² − 49 = 0; x² + 6x + 5 = 0) | The instance string names the method for Demo and Hint, e.g. `x^2+6x+5=0 ; complete the square`; every move stays allowed | One fixed order everywhere (factor if it factors, else the formula) | A | A |
| 11 | When an expression is finished (6x + 9) | The instance string names the goal: `6x+9 ; factor` or `; simplify` | Fixed by level | A | A |
| 12 | Divisible parentheses, 2(x + 1) = 4x + 6: Demo's first step | Distribute first | Divide every term first | A | A |
| 13 | Demo's order for a linear equation | One order: distribute, combine, x terms to one side (smaller onto larger, letters too), numbers to the other side, divide | Per engine | A | A |
| 14 | Calculate's questions | One number at a time everywhere (also when dividing by a whole number, with letters, in systems) | Some ask the whole new equation, some nothing | A | A |
| 15 | Write's answer | One box everywhere taking any answer ("3, −2", "no solution"); tries follow the place (assignment: one try; Play Solve: unlimited) | A box per answer in exercises, one box in Play Solve | A | A |

## Bugs found on the way (fixed by the new engine, or earlier if you ask)

| Where | What happens |
|---|---|
| Play Solve rungs 75–77 (completing the square), when it leads to ±√1 | Fixed 2026-11-28: the Demo stopped at `z − 3 = ±√1` ("√1 is already simplified") |
| After splitting x + 3 = ±4 and pressing Undo (3.3A, rungs with (x − h)²) | Fixed 2026-11-28 (confirmed first): split mode stayed on, so the Quadratic Formula button stayed hidden |

## Log

- 2026-11-28: plan agreed; recorder written and checked (two runs give identical records).
- 2026-11-28: step 5b done: systems hand each one-variable equation to the Drag Equation.
- 2026-11-28: step 5a done: single row equations solved in the main solver (decisions 1–4).
- 2026-11-28: step 4 done for the main solver (decisions 5–15 behind DE_ON; two bugs fixed for everyone).
- 2026-11-28: step 3 done: all 100 Play Solve patterns match their old generators.
- 2026-11-28: step 3 (first half): deParse/deText and the round-trip proof (369 identical).
- 2026-11-28: step 2 done: the teacher chose A for all 15 decisions.
- 2026-11-28: step 1 done: before.json recorded (the 3×3 Demos pause themselves once; the recorder presses Resume).
