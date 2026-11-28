# Per-level / per-exercise rule switches in engine/app.js

Read-only inventory, engine/app.js as of 2026-11-28 (15,769 lines). Line numbers are for that file.
"Student sees" = what changes on screen or in what a move does. Plain setters/resets
(solverEqBuild 3769, c3Make 3727/3733/3738, svMake0 3749/3753, qfSetup 1730, cmpSetup 2557,
exBegin 1230) are listed once in section 0 and not repeated per flag.

## 0. Where the flags come from

| Source | Line | Flags it sets |
|---|---|---|
| `solverEqBuild(st)` (Play Solve "eq" rungs, and c3Make's fallback) | 3769 | cmp=c3=qf=qu=null, grUser=false, quad=false; `quq=!!st.qu`, `lit=!!st.lit`, `av=!!st.av`, `sq=!!st.sq`, `dvq=!!st.dv`, `zpq=!!st.zp`, `grq=!!st.grp\|\|!!st.fm`, `qd=!!st.cs\|\|!!st.sf\|\|!!st.qu`, `sf=!!st.sf`; then `cmpSetup` (st.cmp), `qfSetup` (st.qf) |
| `c3Make()` (3.1 exercises, from C3SV[lesson]) | 3720-3741 | `sqh` (3.1B Simplify): all false but `sq: !grp` (3727); `lin4` (3.1A): all false (3733); `ex`: `fac: lv===5\|\|6, lit: lv===6, grp: lv===10\|\|lv>=13, rad:false` (3735); `eq` rungs: same mapping as solverEqBuild for quq/sq/zpq/grq/qd/sf, but lit/av/dvq hard-coded false (3738) |
| `svMake0()` (2.4 lessons 5-8; 3.1 lessons 2/5/15 re-made as 2.4 lesson 7/6/8) | 3744-3753 | lesson 5: every eq flag false (3749); expressions: `fac:false, lit:false, grp:false, rad: lesson===7` (3753) |
| `solverGo` expression rungs (EXLAD) | 3757 | `fac = lvl===5\|\|6`, `lit = lvl===6`, `grp = lvl===10\|\|lvl>=13` |
| `eqCreate` (Create; derived from what was typed = from the screen) | 3334-3389 | `grq` when R=0 and grAny/fmOnly (3350); `qd`+`sf=sfOK(roots)` for products not =0 (3365); `qd` for x²+x (3371); `sq` when the only variable is x² (3380); otherwise `zpq=!!zpOf`, `dvq=!!(rel=="=" && dvOK(L,R))` (3388). `eqCreateLit`: `lit:true, quad` (3404). `eqCreateAbs`: `av:true` (2677+). |
| `exCreate` (expressions) | 1356-1366 | `fac` = letters or facAll>=2; `lit`; `grp` = grAny\|\|fmFits |
| `rdCreate` | 1342-1348 | `rad:true` |
| Moves that change flags mid-problem | | `grDown` sets grq=grUser=true (2047); `sfOn` recomputes grq every render when sf (1471); `fmFinish` sets zpq=true, sq=false, grq=true (2168) or expression grp=true (2171); `grApply` zpq=true (2258); `eqPm` zpq=true (2476); `cmpSplit` zpq=true (2563); `simFactor` zpq=true, grq=false, sf=false (3101); `eqUndo` recomputes zpq from grq/sq/av/cmp (3148) |

Note: `cqPane()` (4094) is defined but never called (dead). `EXP.quad` is always false except in `eqCreateLit` (letters + x²).
The main solver's own code (lines ~850-3330) never tests `lesson` or `act` directly; it reaches them only through
`svL()`, `svWr()` and `BUILT[act].solver` (a getter that returns `svL()` for 2.4 and 3.1, 4999-5000, and `true` for Play Solve, 4974).

---

## 1. Main solver (EXP): flag by flag

### zpq - "this equation is solved with the zero product property" (19 reading places)
Set by zp rungs, Create (zpOf), and by factoring moves (fmFinish, grApply, simFactor, eqPm, cmpSplit, eqCheckSolo).
- 1230 exBegin: `if (EXP.grq) EXP.zpq = false` - restarting a grouping problem clears zpq; any other problem keeps a zpq left over from a split (see conflict C14).
- 1236 exBegin: Write's placeholder becomes "e.g. 3, -2" (with grq).
- 1243 exBegin: instruction "Drag one of the parentheses up or down..." instead of the generic "Drag a term across the =".
- 1383 zpPaint: the split layout (rows above/below) is used only when zpq.
- 1402 zpPick: with zpq false a product = 0 cannot be split at all (every split action returns null).
- 1421 zpWire: dragging the exponent of (A)² across = briefly turns zpq off to run eqRootG.
- 1469 sfOn: standard form never switches on factoring while zpq.
- 1507 quBtnUpd: the Quadratic Formula button is hidden while zpq.
- 1847 grAvail / 2041 grDown: the grouping box (and drop-below-to-factor) is not offered while zpq.
- 2722 eqSideHtml: parentheses lose the "click to distribute" (pend) look while zpq.
- 2743 eqRenderRow: `un = EXP.zpq && zpOf(...)`: when zpq and the screen is (A)(B)=0, the row is wired ONLY for splitting (zpWire) and combining by clicking a sign; nothing can be dragged across =, the = is not grabbable and the = click (multiply both sides) is off (2748).
- 2782 eqRenderRow: dragging one set of parentheses onto the other to MULTIPLY them is offered only when zpq is false.
- 2785 eqRenderRow: dragging (A)(A) together to write (A)² is offered only when zpq is false.
- 3117 wkSim: Show-work replay runs simFactor only while zpq false.
- 3148 eqUndo: zpq is recomputed (grq: from zp or zpOf; sq/av: from zp; cmp: from zp; otherwise left as is).
- 3184-3195 eqCheckSolo: Write expects a SET of answers ("3, -2"), and the key is zpRoots of the original product.
- 3262 eqNextStep: the "divide every term first" Demo step is skipped while zpq.
- 3265 eqNextStep: Demo/Hint "split into two equations" only when zpq.
- wkSim 3114 recomputes `X.zpq = !!zpOf(X.L,X.R) && !X.grq` from the screen (unlike exBegin).

### grq - "factor this quadratic with the grouping box" (12 places)
Set by grp/fm rungs, Create (trinomial/four terms = 0), grDown (student drops x² below), sfOn (standard form reached in an sf level), fmFinish.
- 1236 exBegin: Write placeholder "e.g. 3, -2".
- 1242 exBegin: instruction to drag terms into the square.
- 1471 sfOn: recomputed whenever sf: grq = right side is 0 and the left side factors (or grUser).
- 1507 quBtnUpd: Quadratic Formula button shown when grq (or qd).
- 1847 grAvail: the grouping square can open (with x² still on screen).
- 2743/2753 eqRenderRow: `gq = grq && !zpq && grSq()`: the row is wired ONLY by grWire (2191): left-side terms go into the box, like terms can be combined, a coefficient can still divide all; terms can NOT be moved across =, the exponent of x² is not draggable, parentheses not multiplied, etc.
- 3117 wkSim: Show work factors with simFactor.
- 3148 eqUndo: zpq recomputed from zp or zpOf.
- 3184-3186 eqCheckSolo: Write's answer set, key = grRoots(grAny(orig.L)) or fmRoots(fmFits(orig.L)) (from the ORIGINAL left side only).
- 3217 eqDemoStep: Demo goes to grDemoStep (fill the box) instead of eqNextStep.
- 3241 eqNextStep: the standard-form Demo step (sfStep) is skipped once grq.

### quq - "use the quadratic formula" (2 places)
Set by qu rungs (3.4A) only. Create never sets it.
- 3241 eqNextStep: Demo first brings the equation to standard form (sfStep).
- 3242 eqNextStep: Demo/Hint then taps the Quadratic Formula button ("Standard form: a = .., b = .., c = ..").

### sq - "x² = number, take the square root" (4 places, + 1 via sqSides)
Set by sq rungs, 3.1B Simplify (`sq: !grp`), Create (only variable x²); fmFinish turns it off.
- 2331 sqSides: returns null unless sq, so eqRoot ("exponent crossed the =") refuses, and the Demo step "Undo the exponent" (3289-3290) never appears.
- 2755 eqRenderRow: the exponent 2 of x² is draggable across = (becomes √) ONLY when sq.
- 3148 eqUndo: zpq reset to !!zp.
- 3184-3186 eqCheckSolo: Write expects a set; key from sqVal (±√q).

### av - "absolute value" (9 places)
Set by av rungs and Create with |...|. Tapping a bar (eqAvOpen, 2803) is wired by the screen, not by av.
- 1236 exBegin: placeholder "e.g. -2 < x < 4 or x < -2 or x > 4" for av inequalities.
- 2478 eqPm: the ± message talks about "what is inside the absolute value" instead of "two answers".
- 2617 avIneqEnd: the final "between / outside" answer of an av inequality is only built when av.
- 3139 eqEnd: "No solution" message wording (distance from 0).
- 3148 eqUndo: zpq reset.
- 3158-3174 eqCheckSolo: av inequality answers typed as -2 < x < 4 / x < -2 or x > 4.
- 3176-3181 eqCheckSolo: av equation with no roots accepts "no solution".
- 3184-3186 eqCheckSolo: av equation answers as a set (avRoots).
- 3246 eqNextStep: Demo's absolute-value sequence (move numbers, divide, tap bar, click ±) only when av.

### lit - "letters as coefficients" (26 places)
Set by lit rungs, Create with letters other than x, expression level 6.
- 858 exLines: Show work writes the right side with litSay.
- 950 bxOnT: no box method when lit (products are distributed instantly).
- 1153/1160 exAskOK: expression answers parsed with letters.
- 1201-1206 exCheckSolo0: expression with letters must be fully factored.
- 1236/1244 exBegin: placeholder "e.g. b/a"; extra instruction sentence.
- 2315 eqKind: "solved" means x alone with letter terms on the other side (litAlone), not x = number.
- 2705 eqDivReady: different test for "one side is a single x term" (letters allowed in the coefficient).
- 2717 eqSideHtml: a finished lit answer is drawn as one fraction.
- 2791 eqRenderRow: the number in front of parentheses does NOT get the "÷ while crossing" handle when lit.
- 2841 dvHandle: a whole coefficient is NOT draggable across = (exCoA) when lit.
- 2846 eqDivAll: dividing with letters goes through eqMul (lit OR letters on screen).
- 2864/2873/2874 eqDivGroup: (x-2)/3 multiply-across and divide-by-the-number-in-front are refused with letters ("works without letters for now").
- 2924 eqDivide: divides letters (b ÷ a = b/a), Calculate asks the whole new equation.
- 2950-2952 eqAmt: the = pop-up accepts letter amounts (2a) only when lit; without lit a letter amount is rejected.
- 3002 cqLit: Calculate asks the whole new equation instead of term-by-term arithmetic (lit OR letters on screen).
- 3056-3080 eqAskOK: answers parsed/compared with letters.
- 3139 eqEnd: final message uses litSay.
- 3197 eqCheckSolo: Write answer is an expression (b/a).
- 3256 eqNextStep: (x-2)/3 Demo sequence skipped when lit.
- 3272 eqNextStep: x on both sides: lit always moves the right x term onto the left; otherwise the smaller onto the larger.
- 4073 amtPop: error text mentions letters.
- 5501 nlEq: no number line for a lit inequality.

### cmp - compound inequality (5 places; data-derived: comes from EXP.orig.cmp)
- 1236 placeholder; 2530/2535 cmpEnd/cmpWant final answer; 3148 eqUndo zpq=!!zp; 3151-3156 eqCheckSolo compound answer.
### c3 - three-part inequality not yet split (6 places; data-derived)
- 857 exLines; 2312 eqKind never solved; 2560 cmpSplit; 2567/2736 cmpRender replaces the row; 3148 eqUndo restores; 3244 Demo "split it".

### qf - deriving the quadratic formula (10 places; a separate mini-engine)
- 855 exLines; 1507 hides formula button; 1668-1727 qfRender/qfStep/qfDemoStep; 2041 grDown off; 2313 eqKind never solved; 2737 eqRender0 draws qfRender instead of the equation; 3110 wkSim off; 3148 eqUndo; 3183 Write expects the formula typed; 3233 Demo uses qfDemoStep.

### dvq - "divide every term by the number in front first" (1 place)
Set by the dv rung and by Create (dvOK on the typed equation).
- 3262 eqNextStep: Demo/Hint divides every term by the number in front of the parentheses before distributing. The move itself (dragging the number across, eqDivGroup 2873) does not look at dvq.

### qd - "quadratic: complete the square / formula available" (3 places)
Set by cs, sf, qu rungs and Create (products ≠ 0, x² with x).
- 1507 quBtnUpd: Quadratic Formula button shown (with grq).
- 3184 eqCheckSolo: Write key for a plain quadratic is qdRoots (else sqgRoots).
- 3243 eqNextStep: Demo/Hint completes the square (qdStep 1978) once there are no parentheses.

### sf - "standard form first, then factor" (2 places)
- 1469-1471 sfOn: when sf and one side becomes 0, swaps 0 to the right and switches grq on (box appears).
- 3241 eqNextStep: Demo brings every term to the x² side (sfStep) before anything else.

### quad - letters with x² (Create only) (2 places)
- 3223 eqDemoStep: "That is as far as the demo goes with x squared for now."
- 6166 showPick: Write mode not offered.

### fac - expression: factor out the GCF (10 places)
- 1082 exDone: finished only when fully factored (facDone), instead of fully simplified (exFin).
- 1087/1088 exEnd: "Fully factored" message.
- 1176 svWrong: no "simplified form" answer shown.
- 1210 exCheckSolo0: Write answer must be fully factored.
- 1236/1247/1249/1252 exBegin: label "Factored:", instructions.
- 1300 exDemoStep: Demo factors (drag the coefficient onto a term) instead of distributing/combining.

### grp - expression: factor by grouping / trinomials / special products (12 places)
- 905 exRender0: the coefficient of x (exK) can NOT be dragged onto another term to factor out a GCF when grp.
- 906 exRender0: terms get the extra drop target "gb:" (grouping square) and dragging a term opens the square (grShow) only when grp.
- 1082 exDone: a product of binomials counts as finished.
- 1087/1088 exEnd; 1176 svWrong; 1209 exCheckSolo0 (binomials must be prime); 1236/1247/1249/1251 exBegin labels/notes.
- 1283 exDemoStep: Demo fills the grouping box.
- 1847 grAvail: the grouping square can open.

### rad - expression: simplify a square root (10 places)
- 874 exRender0: √ key shown in Write; box-method x keys hidden.
- 1082 exDone: finished when no root can be simplified.
- 1176 svWrong; 1193 exCheckSolo0 (typed root like 10√2); 1247/1249/1250 exBegin notes.
- 1284 exDemoStep: Demo clicks roots.
- 5398 exOneStart: "Demo next step" played as the Demo, not Sequence.

### svk (1 place) - 5818 newProblem: a new problem is made when the exercise (lesson) changes. Not a rule.
### grUser (1 place) - 1471 sfOn: keeps grq on after the student opened the box with grDown.

### svL() / svWr() / BUILT[act].solver inside the solver (exercise vs Play Solve)
- 874 exRender0: x/x² keys in Write: in an exercise only for expressions (`svL() ? !EXP.eq : ...`); in Play Solve also for equations with products or x².
- 874 exRender0: √ key in Write for quadratic equations only in exercises (svWr).
- 950 bxOnT: box method only when BUILT[act].solver (Play Solve and the 2.4/3.1 exercises), and not in Write/Create, not lit, not in a split.
- 1168-1171 svWr / exCheckSolo: exercise Write: a wrong answer calls svWrong (1173): locks the problem, shows the answer, counts an error. Play Solve Write: just "Not quite", try again.
- 1223-1224 exBegin: exercise Write button is "Submit"; Play Solve "Check".
- 1234-1235 exBegin: exercise Write gives TWO answer boxes for a quadratic; Play Solve one box ("3, -2").
- 1240/1248 exBegin: exercises show no instructions.
- 6300 exSoloIn input: Play Solve checks the answer automatically as it is typed; exercises wait for Submit.
- 5362 tally / 6069 eqwTa: in exercises any error message in Sequence/Calculate means no progress and "Try another"; not in Play Solve.
- 3755 solverGo / 5383 nxShow / 5569 / 5581: exercises have no Level Up/Easier.
- 5501 nlEq / 5495 nlPane: number line only when BUILT[act].solver.
- 3745 svMake0: 3.1 lessons 2/5/15 temporarily switch `act="2.4"` and `lesson=7/6/8` to make the problem (generation only).

---

## 2. Candidate CONFLICTS (same screen, different handling)

C1. **(A)(B) = 0, e.g. (x+2)(x-3) = 0**
- A: zpq true (zp rungs, 3.1E, Create): only splitting; parentheses cannot be multiplied; = inert (2743-2749, 2782).
- B: zpq false (any other level where it appears, e.g. after an Undo in a level without grq/sq/av/cmp - see C14): dragging one parenthesis onto the other multiplies them (box) (2782); the = can be clicked; no split (zpPick 1402 returns null).
- Mitigation that already exists: wkSim recomputes zpq from the screen (3114), eqUndo does for grq levels (3148). Elsewhere zpq is level-set.

C2. **x² alone with a number, e.g. x² = 49 or x² − 16 = 0**
- A: sq true (sq rungs, 3.1B, Create): exponent drags across = (2755), Demo "Undo the exponent" (3289).
- B: sq false (e.g. a cs/sf/qu/zp level that reaches x² = 16; or sqg rung): exponent not draggable; eqRoot refuses (2331); Demo has no step (eqNextStep returns null after division).
- C: grq true, fm:1 rung (3.1F, fmGen0(1) "x² − 49 = 0"): row wired only by grWire: terms cannot be moved across =, factoring via formula/box only (2753).
- Create sends "x² − 49 = 0" to the sq path on purpose (fmOnly excludes difference of squares with a perfect-square root, 3346), while LADDER fm:1 / 3.1F give the same screen the grq path. sq:3 rung (eqSq(3), 2481) can also produce x² − 9 = 0 (sq path).

C3. **Trinomial = 0, e.g. x² + 5x + 6 = 0**
- grp/fm rungs, Create (gq), 3.1E/3.1G: grq → box only (2753), Demo grDemoStep (3217), quBtn shown.
- sf rungs: free moves until standard form, then sfOn flips grq on automatically (1471).
- cs rungs (qd only): free moves; Demo completes the square (qdStep, 3243); box only via the drop-below gesture (grDown 2040); quBtn shown.
- qu rungs (quq): Demo taps the Quadratic Formula (3242).
- sq / plain levels: free moves, no quBtn (1507), Demo has no quadratic step; drop-below still opens the box (grDown is not flag-gated except zpq/qu/qf).

C4. **Quadratic Formula button availability**: shown iff (qd || grq) && !zpq && !zp && !qu && !qf (1507). Same quadratic on screen: shown in cs/sf/qu/grp/fm levels, hidden in sq levels and after any split.

C5. **A number in front of parentheses with every term divisible, e.g. 2(x+1) = 4x + 6 or 8 + 4(x+3) = 36**
- dv rung and Create (dvq = dvOK, 3388): Demo/Hint divides every term first (3262).
- eq lv 3 rung (eqGen lv 3 can make it), 2.4A 3-step, 3.1A 4-step (dvq hard-coded false, 3749/3733): Demo distributes first (box).
- The student's drag is the same in both (eqDivGroup, flag-free).

C6. **A number in front of parentheses: distributing**
- Play Solve and exercises (BUILT.solver), Sequence/Calculate/Demo: the box opens (bxOnT 950, eqDistribute 2915), Calculate asks each box product.
- lit levels: no box (950); instant distribution; Calculate asks the whole result ("3(x + 2) =", eqAskOK "dist").
- Write/Create modes: no box.
- Inside a split (EXP.zp): no box.
- 1.4 substitution engine (SUB): click to distribute; Calculate asks each product separately (subDist 6377).

C7. **A whole-number coefficient, e.g. 3x + 6 = 12 (drag the 3 across)**
- main solver, non-lit: exCoA handle (2841) divides every term on both sides, leaving 6/3, 12/3 to click (eqDivAll 2844).
- lit level: no handle (2841), only the = menu.
- row engine, Play Solve pane rungs: coefDrop → paneDivAll switches the problem INTO the main engine mid-problem (4182, 4175).
- row engine, 1.4 One Variable: refused with a shake while a number is still on the x side (4183).

C8. **Two expressions that are "done" differently**
- "5x + 5" / "6x + 9": finished (exFin) in simplify levels (EXLAD 0-4, 2.4B Distributing); NOT finished in fac levels (EXLAD 5, 3.1D) until factored (exDone 1082).
- "3(2x + 3)": in a simplify level clicking it distributes (box); in a fac level it is the finished answer.
- "x² + 5x + 3x + 15": grp levels: coefficient-drag factoring is disabled (905), grouping square opens on drag (906), Demo uses grouping (1283); other levels: combine like terms, coefficient drag factors a GCF.

C9. **The answer in Write**
- set-answer path ("3, -2", any order) only when zpq/grq/sq/av or sgW (3184-3186); otherwise a single value (3205-3210). The answer key also comes from the flag: grq → roots of the ORIGINAL left side (grAny/fmFits of orig.L), sq → sqVal, av → avRoots, qd → qdRoots, else sqgRoots. A level whose original is not of that shape would get the wrong key (e.g. if grq were ever set on an original whose left side does not factor). Unsure whether any current level reaches that.
- Exercises: two boxes, Submit, one try (svWrong locks and shows the answer) (1234, 1170, 6300). Play Solve: one box, auto-check while typing, unlimited tries.
- Placeholder/label text depends on cmp/av/zpq/grq/lit (1236).

C10. **Calculate's questions**
- main solver: per-term arithmetic (cqScale/cqRun 3004-3020) except with letters (cqLit 3002: type the whole new equation) and eqDivide with several terms on the other side (2935: type the whole new equation); dividing by a whole number in eqDivAll asks NOTHING (leaves 8/2 to click, 2858).
- row engine: mulEq asks each product (4113); constDrop/coefDrop leave a raw "12 − 6" / "6/3" and ask the simplified value (4205, 4194, openAsk "simp").
- substitution engine: each product / sum asked; moving asks "Simplify 12 − 6:" accepting a number or the equation (6418).
- systems lessons (lesson 2/3): confirmAsk "calc" asks the whole equation typed (4411-4413), and lesson 1 also accepts the equation multiplied by −1.

C11. **Demo's step order** (eqNextStep 3232-3292) is reordered by flags: qf → qu → (A)² → roots → ± → fractions → [sf/quq: standard form] → [quq: formula] → [qd: complete the square] → c3 → [av sequence] → [non-lit: (x-2)/3] → [dvq: divide first] → [zpq: split] → distribute → combine → x both sides (lit: always right onto left) → move number → divide → [sq: exponent] → ± → roots. So the same screen gets a different first step depending on sf/quq/qd/av/dvq/zpq/lit. Also eqDemoStep jumps to grDemoStep when grq (3217); exDemoStep picks grp/rad/fac branches (1283-1300).

C12. **x on both sides**: Demo moves the smaller x term onto the larger (non-lit) but always R onto L when lit (3272).

C13. **The = click**
- main solver: + − × ÷ menu, amount (eqMulAsk 2986); amount with letters only when lit (2950-2952); off while the row is a zpq product, or has roots (2748).
- row engine Play Solve (lesson 1 + solver): same 4-op menu (4085); 1.4 lessons: "Multiply the outlined equation by:" only (openAsk "mul", 4090); systems: = is a button that also drags onto another equation to add (328).

C14. **Stale zpq after a ± split + Undo** (probable bug): eqPm sets zpq=true (2476). eqUndo only recomputes zpq for cmp/grq/sq/av levels (3148); exBegin only clears it for grq (1230). In a cs (3.3A), sqg or sqh-with-(x−h)² problem, after splitting x + 3 = ±4 and pressing Undo, zpq stays true: the Quadratic Formula button stays hidden (1507), grDown is off (2041), parentheses lose "pend" (2722), and dvq/split Demo steps change. Not tested in a browser - reading of the code only.

C15. **lit flag vs letters on screen**: some checks use `EXP.lit` only (dvHandle 2841, eqDivReady 2705, eqKind 2315, eqDivide 2924, 2791, eqAmt 2950), others `EXP.lit || litAny(...)` (eqDivAll 2846, eqDivGroup 2864/2873, cqLit 3002). Today every path that puts letters on screen also sets lit (eqCreate → eqCreateLit, lit rungs), so this is probably harmless, but it is two rules for one fact.

C16. **One-variable linear equation, two engines**: Play Solve "pane" rungs and 1.4 One Variable use the row engine; "eq" rungs, Create with x on both sides/fractions/parentheses (eqWanted 3408), 2.4A/3.1A exercises use the main solver. Differences listed in section 3.

---

## 3. Row-equation engine (ws, q = {a, b, e, ks, c, flip, rel}) and the substitution engine

### Switches
- 3781 `mvOn()` = `BUILT[act].solver && lesson === 1 && !SUB()` (Play Solve's pane only): turns on rearranging terms on one side (moveK/mvDropK/mvDropX, 3784-3797) and dragging the x term across = (xAcross via mvXCell 3797-3807). In 1.4 One Variable the x term cannot be moved and constants cannot be reordered.
- 3804 / 3850 `q.flip && lesson === 1`: the "past the =" drop zone is on the LEFT for a flipped equation (10 = 3x − 2), only in lesson 1.
- 3825 mvWire / 4085 eqClick: = click opens + − × ÷ only for Play Solve (solver && lesson 1); otherwise "Multiply by" (openAsk "mul").
- 3855 wire: coefficient drag shows the "÷" crossing animation only when BUILT.solver (divCross).
- 4175 paneDivAll / 4182 coefDrop: Play Solve only - dividing while a number is still on the x side converts the problem to the main EXP engine (exBegin + eqDivAll). Elsewhere: shake.
- 4089 eqClick: ÷ in Play Solve with numbers on the x side also goes through paneDivAll.
- 323/330 fmt/mkRow, 372 paneRelFlip, 378 flipped, 4171 paneEq: flip layout only in lesson 1.
- 328 mkRow: the = is a button (click multiply, drag to add equations) only when lesson ≠ 1.
- 357 render: in Write (solo), Play Solve rows can still be rearranged (mvWire).
- 261 curVs: lesson decides the columns (p x s / x y / x y z).
- 4133 addEq, 4213 substitute, 4429-4454 hintText, 4499-4515 nextStep, 4637 dm4After: lesson 3 (3x3) rules: which pairs may be added, when a value may be substituted, demo pauses.
- 4411-4413 confirmAsk: lesson 1 accepts an equation typed without variables on one side (parseEqN) and the whole equation times −1.
- 4491-4497 nextStep (lesson 1): combine numbers on one side first, then move a constant, then divide.
- 6317 `SUB()` = `act === "1.4D" && subx && lesson === 2`: replaces the whole row engine with the substitution engine (render 343, fmt 323, substitute 4211, hintText 4423, nextStep 4487).
- 200-205 makeProblem: lesson 1 + solver → LADDER pane rung generators; lesson 1 → bank 1.4B-one-variable; SUB → bank 1.4B-substitution; lesson 3/2 → systems banks.
- 4094 cqPane: defined, never used.

### Same move, different engine
| Move | Row engine (Play Solve pane / 1.4 One Variable) | Substitution engine (1.4 lesson 2, subx) | Main solver (EXP) |
|---|---|---|---|
| Drag a number across = | Only constants on the variable side, only rightward past = (leftward if flipped, lesson 1) (3850, 3871). The right side is combined at once (constDrop 4198); Calculate shows "12 − 6" and asks for it. | Only numbers from L, only rightward, only when R is one number with no variable (subMove 6397); Calculate asks "Simplify ..". | Any term, either direction, onto = or onto a term (eqBuild 2806). Sign changes; it stays a separate term unless dropped on a like term (combined; Calculate asks the sum). |
| Drag the x term across = | Play Solve only (mvOn), only with ≤ 1 number on that side ("Combine the numbers on that side first.") (xAcross 3809-3818); the sides swap roles (flip). | Not possible (a variable term dragged right divides instead). | Always possible, like any term. |
| Drag the coefficient across = | Only when the variable is alone (coefDrop 4183), result written as a fraction to click if reducible; Play Solve with numbers still there → main engine. | subDiv: only when L is one variable term and R one number (6405). | exCoA handle on any whole coefficient > 1 (non-lit): every term on both sides divided, fractions left to click (eqDivAll); or eqDivide when one side is just the x term. |
| Combine two numbers | drop on any number of the same row, or click the sign between neighbours (3864-3889); Calculate asks the sum. | drop on a like term or click the sign (subComb). | drop on a like term or click the sign (eqDrop/eqOpWire); Calculate asks the sum. |
| Parentheses | n/a (no parentheses in the pane). | click to distribute; Calculate asks each product (subDist). | drag the multiplier onto them / click; Play Solve: box (bxOnT); Calculate: box cells, or whole result. |
| Click = | Play Solve: + − × ÷ menu; 1.4: "Multiply by"; systems: button/drag-to-add. | n/a | + − × ÷ menu (eqMulAsk). |
| No solution / all numbers | kindAsk (4017) | - | kindAsk (3126) - consistent. |
| Demo order | combine → move constant → divide (4491). | substitute → distribute → multiply values → combine → move → divide (subNext 6535). | see C11. |
