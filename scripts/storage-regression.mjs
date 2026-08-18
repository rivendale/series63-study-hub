/**
 * Regression harness for src/lib/progressStore.ts. Plain Node, no browser.
 *
 *   node --experimental-strip-types scripts/storage-regression.mjs
 *
 * Simulates TWO TABS sharing one localStorage. Each "tab" is a separate module
 * instance (query-string import). The window stub tags each tab's storage
 * listeners and delivers events the way browsers do: to every tab EXCEPT the
 * writer.
 *
 * These sequences exist because review found them and nothing could prove
 * them: the previous harness drove src/core/storage.ts and stopped at the hook
 * boundary, which is precisely where both bugs lived.
 */
const backing = new Map();
let currentTab = 'boot';
const tabListeners = []; // {tag, fn}

const localStorageStub = {
  getItem: (k) => (backing.has(k) ? backing.get(k) : null),
  setItem: (k, v) => {
    const oldValue = backing.has(k) ? backing.get(k) : null;
    backing.set(k, String(v));
    const ev = { key: k, oldValue, newValue: String(v) };
    const writer = currentTab;
    for (const { tag, fn } of tabListeners) if (tag !== writer) fn(ev);
  },
  removeItem: (k) => backing.delete(k),
};

globalThis.window = {
  localStorage: localStorageStub,
  addEventListener: (type, fn) => {
    if (type === 'storage') tabListeners.push({ tag: currentTab, fn });
  },
  removeEventListener: () => {},
};

let pass = 0, fail = 0;
const check = (name, cond, detail = '') => {
  if (cond) { pass++; console.log(`  ok     ${name}`); }
  else { fail++; console.log(`  FAIL   ${name}${detail ? ' — ' + detail : ''}`); }
};

const asTab = async (tag, fn) => { currentTab = tag; const r = await fn(); currentTab = 'boot'; return r; };
const modPath = '../src/lib/progressStore.ts';

// ---- seed a real record on "disk" before any tab opens --------------------
const seed = {
  schemaVersion: 1,
  answers: { 1: { correct: true, ts: 1000, selected: 2 } },
  topicsRead: { intro: 900 },
  mockAttempts: [{ ts: 800, correct: 40, total: 60, pct: 67, timeUsed: 3000, answers: [] }],
  preferences: { fontSize: 'md', theme: 'system' },
};
backing.set('series63_progress', JSON.stringify(seed));

// ---- open two tabs --------------------------------------------------------
const A = await asTab('A', () => import(`${modPath}?tab=A`));
const B = await asTab('B', () => import(`${modPath}?tab=B`));
if (typeof A.initCrossTabSync === 'function') { await asTab('A', () => A.initCrossTabSync()); }
if (typeof B.initCrossTabSync === 'function') { await asTab('B', () => B.initCrossTabSync()); }

check('both tabs load the seeded record',
  A.getProgress().answers[1] && B.getProgress().answers[1]);

// ---- BUG 1: multi-tab last-writer-wins -----------------------------------
await asTab('A', () => A.updateProgress((p) => ({
  ...p, answers: { ...p.answers, 100: { correct: true, ts: 2000, selected: 0 } },
})));
await asTab('B', () => B.updateProgress((p) => ({
  ...p, answers: { ...p.answers, 200: { correct: false, ts: 2001, selected: 3 } },
})));
const disk1 = JSON.parse(backing.get('series63_progress'));
check('cross-tab: tab A answer survives tab B write', !!disk1.answers[100],
  'B overwrote the whole record; A\'s answer 100 is gone from disk');
check('cross-tab: tab B answer on disk too', !!disk1.answers[200]);
check('cross-tab: tab A memory learned of B\'s answer', !!A.getProgress().answers[200],
  'A never saw B\'s write');

// ---- BUG 2: second unreadable record is dropped when quarantine occupied ---
const bigGarbage1 = 'x'.repeat(300) + '{not json';
const bigGarbage2 = 'y'.repeat(4000) + '{worse json — months of study, corrupted differently';
backing.set('series63_progress', bigGarbage1);
currentTab = 'C';
const C = await import(`${modPath}?tab=C`);   // fresh load hits garbage 1 -> quarantines it
check('first unreadable record quarantined',
  backing.get('series63_progress_unreadable') === bigGarbage1);
backing.set('series63_progress', bigGarbage2);
currentTab = 'D';
const D = await import(`${modPath}?tab=D`);   // fresh load hits garbage 2, slot occupied
const q = backing.get('series63_progress_unreadable');
check('larger second unreadable record is preserved somewhere', q === bigGarbage2,
  `quarantine still holds the FIRST (${q?.length} chars); the 4000-char record has no copy and the next save destroys it`);
void C; void D;

console.log(`\n${pass} ok, ${fail} failed`);
process.exit(fail ? 1 : 0);
