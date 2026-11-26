#!/usr/bin/env python3
"""Move one exercise out of engine/app.js into a bank question file (Question Bank migration, step 4).

  python3 tools/bank_convert.py spec.json

spec.json:
{
  "id": "2.4A-point-intercepts", "title": "...", "section": "2.4", "example": 2, "skills": [...], "tiers": [0, 1, 2],
  "modes": ["demo", "sequence", "calculate", "solo"], "engine": "word", "writeRounds": 1, "showWork": "GUESS",
  "patterns": {"solo": "Submit"}, "about": "one or two comment lines",
  "ranges": [["  var C2S242 = [", "  function c2M242(tier) {"], ["  function c2M242(tier) {", "  function vpFrmOkI(raw) {"]],
  "exports": {"generate": "c2M242", "scenarios": "C2S242", "makePb": "c2M242Pb"},
  "engineEdits": [["old text", "new text"], ...]     (engine lines changed to reach the question through the bank)
}
Each range runs from the line that starts with its first prefix up to (not including) the line that starts with its second.
The moved code keeps working unchanged: it runs inside the definition's build(), which the engine calls the first time the question is used.
"""
import json, os, sys

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = json.load(open(sys.argv[1]))
p = os.path.join(R, 'engine/app.js')
L = open(p, encoding='utf-8').read().split('\n')


def find(prefix, start=0):
    m = [i for i in range(start, len(L)) if L[i].startswith(prefix)]
    assert m, 'not found: ' + prefix
    return m[0]


import re


def fn_range(name):
    """A top-level engine function: its comment lines just above it, the function, through its closing "  }"."""
    i = find('  function %s(' % name)
    if L[i].count('{') and L[i].count('{') == L[i].count('}'):   # a one-line function
        j = i + 1
    else:
        j = next(k for k in range(i + 1, len(L)) if L[k] == '  }') + 1
    while i > 0 and L[i - 1].startswith('  //') and 'moved to the question bank' not in L[i - 1]:
        i -= 1
    return i, j


def var_range(name):
    """A top-level engine var (a scenarios list): its comment lines, the var line, through its closing line."""
    i = find('  var %s = ' % name)
    if L[i].rstrip().endswith(';'):
        j = i + 1
    else:
        j = next(k for k in range(i + 1, len(L)) if L[k].startswith('  ]') or L[k].startswith('  }'))+ 1
    while i > 0 and L[i - 1].startswith('  //') and not L[i - 1].startswith('  // ===='):
        i -= 1
    return i, j


moved, cuts = [], []
for name in spec.get('functions', []):
    i, j = fn_range(name)
    body = '\n'.join(L[i:j])
    # a scenarios list (C2S...) used only by this function moves with it
    if spec.get('vars') == 'auto':
        for v in sorted(set(re.findall(r'\b(C2S\w+|C2[A-Z][A-Z0-9_]*)\b', body))):
            try:
                vi, vj = var_range(v)
            except AssertionError:
                continue
            rest = '\n'.join(L[:vi] + L[vj:i] + L[j:])
            if not re.search(r'\b%s\b' % v, rest):
                moved += L[vi:vj]; cuts.append((vi, vj)); spec.setdefault('exports', {}).setdefault('scenarios', v)
    moved += L[i:j]; cuts.append((i, j))
for a, b in spec.get('ranges', []):
    i = find(a); j = find(b, i + 1)
    moved += L[i:j]; cuts.append((i, j))
for i, j in sorted(cuts, reverse=True):
    del L[i:j]
first = sorted(cuts)[0][0]
L.insert(first, '  // %s: moved to the question bank, bank/%s.js' % (spec['title'], spec['id']))
s = '\n'.join(L)
for old, new in spec.get('engineEdits', []):
    assert s.count(old) == 1, ('engine text found %d times: ' % s.count(old)) + old[:80]
    s = s.replace(old, new)
open(p, 'w', encoding='utf-8').write(s)

meta = {k: spec[k] for k in ('id', 'version', 'title', 'section', 'example', 'skills', 'tiers', 'modes', 'engine', 'writeRounds', 'showWork', 'patterns') if k in spec}
meta.setdefault('version', 1)
head = ''.join('  %s: %s,\n' % (k, json.dumps(v, ensure_ascii=False)) for k, v in meta.items())
body = '\n'.join(('  ' + l if l.strip() else l) for l in moved)
ret = ', '.join('%s: %s' % (k, v) for k, v in spec['exports'].items())
out = ('// Bank question %s: %s (Algebra 2, %s Example %s).\n' % (spec['id'], spec['title'], spec['section'], spec.get('example', '?'))
       + ''.join('// ' + l + '\n' for l in spec.get('about', '').split('\n') if l)
       + '(window.AN_BANK || (window.AN_BANK = {}))[%s] = {\n' % json.dumps(spec['id'])
       + head
       + '  build: function () {\n' + body + '\n    return { ' + ret + ' };\n  }\n};\n')
os.makedirs(os.path.join(R, 'bank'), exist_ok=True)
open(os.path.join(R, 'bank', spec['id'] + '.js'), 'w', encoding='utf-8').write(out)
print('%s: moved %d lines into bank/%s.js' % (spec['title'], len(moved), spec['id']))
