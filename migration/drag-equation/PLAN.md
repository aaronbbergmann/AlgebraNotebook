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
| 2 | Rulebook: every per-level switch listed; where the same thing on screen follows different rules, a conflict table for the teacher | In progress |
| 3 | `DragEquation` entry point taking a string; pattern notation; Play Solve's ladder as strings in one bank file (no behaviour change) | Not started |
| 4 | Remove the per-level switches, one rule at a time, compared with the record after each | Not started |
| 5 | Row equations onto the engine: Play Solve's first 14 rungs, 1.4 One Variable, then Substitution, 2×2, 3×3 | Not started |
| 6 | The word problems' built-in solvers (2.4A Vertex & Point and Intercepts, 3.1C Real Life, 3.1A) become instances | Not started |
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

## Bugs found on the way (fixed by the new engine, or earlier if you ask)

| Where | What happens |
|---|---|
| Play Solve rungs 75–77 (completing the square), when it leads to ±√1 | The Demo stops at `z − 3 = ±√1`: it says "√1 is already simplified" and never goes on |

## Log

- 2026-11-28: plan agreed; recorder written and checked (two runs give identical records).
- 2026-11-28: step 1 done: before.json recorded (the 3×3 Demos pause themselves once; the recorder presses Resume).
