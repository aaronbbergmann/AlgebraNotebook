// The bank check, in report mode (Question Bank migration, steps 3 and 4).
// Opens every exercise of every activity in each of its modes, in a hidden browser, and lists what the side panel shows
// beyond the standard slots: an extra button, an input or a choice in the panel, or notes text other than Explain.
//   node tools/bank_check.js            writes migration/bank-check-report.md (and .json), exits 1 if anything fails
// Needs Playwright (preinstalled in the cloud session). Pages are opened from the files on disk; sign-in is skipped.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const acts = JSON.parse(fs.readFileSync(path.join(ROOT, 'migration/backup-2026-11-26/activities.json'), 'utf8'));
// the standard slots: what may show in the panel (account bar, where you are, Main button, Demo controls, Demo next step / Undo / Show work, notes)
const SLOT = new Set(['actBtn', 'lesson', 'modeSel', 'progLnk', 'next', 'again', 'qzGo', 'qzNext', 'qzAgain', 'exSoloGo', 'eqSub',
  'dmBtn', 'dmHard', 'dmEnd', 'dmLink', 'dmEasy', 'pgDemo', 'pgEnd', 'pgLink', 'hint', 'undo', 'show']);
const MODE = { demo: 'Demo', sequence: 'Sequence', calculate: 'Calculate', solo: 'Write' };

(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1400, height: 900 } });
  await pg.route(/^https?:/, r => r.abort()); await pg.route(/auth\.js$/, r => r.fulfill({ body: '', contentType: 'text/javascript' }));
  const rows = [], errors = [];
  pg.on('pageerror', e => errors.push(e.message));
  for (const v of acts.views) {
    const dir = v.abbreviation.toLowerCase().replace('.', '-');
    for (const ex of v.exercises) for (const m of ex.modes) {
      const before = errors.length;
      await pg.goto('file://' + path.join(ROOT, dir, 'index.html')); await pg.waitForTimeout(900);
      await pg.evaluate(k => { const s = $("lesson"); if (s && [...s.options].some(o => o.value === k)) { s.value = k; s.dispatchEvent(new Event('change', { bubbles: true })); } }, ex.key); await pg.waitForTimeout(500);
      await pg.evaluate(m => { try { setMode0(m); } catch (e) { } }, m); await pg.waitForTimeout(900);
      const found = await pg.evaluate(slots => {
        const S = new Set(slots), out = [], vis = e => !!(e.offsetParent || e.getClientRects().length) && getComputedStyle(e).visibility !== 'hidden' && !e.closest('[hidden]');
        const A = document.querySelector('aside.chat'); if (!A) return out;
        A.querySelectorAll('button, select, input, textarea, [role=option]').forEach(e => {
          if (!vis(e) || e.closest('#anAcct, .anIn, [data-an-chip]')) return;
          const id = e.id || ''; if (S.has(id)) return;
          const kind = /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName) ? 'input in the panel' : 'button outside the slots';
          out.push({ part: (id ? '#' + id + ' ' : '') + '"' + ((e.textContent || e.value || e.placeholder || '').trim().replace(/\s+/g, ' ').slice(0, 40)) + '"', kind });
        });
        const log = document.getElementById('log'); const t = log && vis(log) ? log.innerText.trim().replace(/\s+/g, ' ') : '';
        if (t) out.push({ part: '"' + t.slice(0, 90) + (t.length > 90 ? '…' : '') + '"', kind: 'notes text' });
        return out;
      }, [...SLOT]);
      found.forEach(f => rows.push({ activity: v.abbreviation, exercise: ex.name, mode: MODE[m] || m, part: f.part, kind: f.kind }));
      if (errors.length > before) rows.push({ activity: v.abbreviation, exercise: ex.name, mode: MODE[m] || m, part: errors.slice(before).join(' | ').slice(0, 120), kind: 'page error' });
    }
  }
  await b.close();
  const md = ['# Bank check report', '', 'Generated ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC by `node tools/bank_check.js`. Each row is one part of the side panel that is not a standard slot.', '',
    rows.length ? '| Activity | Exercise | Mode | Part | Kind |\n| --- | --- | --- | --- | --- |\n' + rows.map(r => '| ' + [r.activity, r.exercise, r.mode, r.part.replace(/\|/g, '\\|'), r.kind].join(' | ') + ' |').join('\n') : 'No failures: every question passes.', ''];
  fs.writeFileSync(path.join(ROOT, 'migration/bank-check-report.md'), md.join('\n'));
  fs.writeFileSync(path.join(ROOT, 'migration/bank-check-report.json'), JSON.stringify(rows, null, 1));
  console.log(rows.length + ' failures in ' + new Set(rows.map(r => r.activity + '|' + r.exercise)).size + ' exercises; report: migration/bank-check-report.md');
  process.exit(rows.length ? 1 : 0);
})();
