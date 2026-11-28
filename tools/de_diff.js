// Drag Equation: compare two records (tools/de_record.js output): which instances changed, and how. Used after each step-4 change to confirm
// that only the differences the teacher chose appear.
//   node tools/de_diff.js migration/drag-equation/before.json after.json [-v]
const fs = require('fs'); const [A, B] = process.argv.slice(2).filter(a => a[0] !== '-'), V = process.argv.includes('-v');
const a = JSON.parse(fs.readFileSync(A, 'utf8')), b = JSON.parse(fs.readFileSync(B, 'utf8'));
let same = 0, changed = 0; const out = [];
for (const id of Object.keys(a)) {
  if (!b[id]) { out.push(id + ': missing in the new record'); changed++; continue; }
  const d = [];
  a[id].runs.forEach((r, k) => {
    const s = b[id].runs[k]; if (!s) { d.push('seed ' + r.seed + ': no run'); return; }
    if (r.problem !== s.problem) d.push('seed ' + r.seed + ': problem ' + JSON.stringify(r.problem.slice(0, 60)) + ' -> ' + JSON.stringify(s.problem.slice(0, 60)));
    else if (JSON.stringify(r.states) !== JSON.stringify(s.states)) {
      let i = 0; while (i < r.states.length && r.states[i] === s.states[i]) i++;
      d.push('seed ' + r.seed + ': Demo differs from step ' + i + ' (' + r.states.length + ' -> ' + s.states.length + ' states)' + (V ? '\n      before: ' + r.states.slice(i, i + 3).map(t => t.slice(0, 90)).join(' => ') + '\n      after : ' + s.states.slice(i, i + 3).map(t => t.slice(0, 90)).join(' => ') : ''));
    } else if (JSON.stringify(r.moves) !== JSON.stringify(s.moves)) d.push('seed ' + r.seed + ': moves offered differ');
    if (r.finished !== s.finished) d.push('seed ' + r.seed + ': Demo ' + (s.finished ? 'now finishes' : 'NO LONGER FINISHES'));
    if (s.errors.length && !r.errors.length) d.push('seed ' + r.seed + ': NEW ERRORS ' + s.errors[0]);
  });
  if (d.length) { changed++; out.push(id + ' (' + a[id].spec + ')\n    ' + d.join('\n    ')); } else same++;
}
Object.keys(b).filter(id => !a[id]).forEach(id => out.push(id + ': new instance'));
console.log(out.join('\n')); console.log('\n' + same + ' instances unchanged, ' + changed + ' changed');
