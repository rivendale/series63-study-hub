/**
 * Regression harness for src/lib/progressStore.ts. Plain Node, no browser.
 *
 *   node --experimental-strip-types --import ./scripts/ts-resolve-register.mjs \\
 *        scripts/storage-regression.mjs
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
let pauseDelivery = false;
let quotaLimit = null;
const queued = [];
// Close every open "tab" between scenarios. Without this, a tab from an
// earlier scenario keeps merging into later ones — scenario I's reset
// tombstone destroyed scenario K's legacy answer, which is a fact about the
// harness, not the store: real browsers close tabs.
const closeAllTabs = () => { tabListeners.length = 0; queued.length = 0; pauseDelivery = false; };
const flushDelivery = () => {
  pauseDelivery = false;
  while (queued.length) {
    const { writer, ev } = queued.shift();
    for (const { tag, fn } of tabListeners) {
      if (tag === writer) continue;
      const before = currentTab;
      currentTab = tag;
      fn(ev);
      currentTab = before;
    }
  }
};
const tabListeners = []; // {tag, fn}

const localStorageStub = {
  getItem: (k) => (backing.has(k) ? backing.get(k) : null),
  setItem: (k, v) => {
    const oldValue = backing.has(k) ? backing.get(k) : null;
    // Browser-accurate quota: throw before storing when a limit is armed.
    if (quotaLimit !== null && String(v).length > quotaLimit) {
      const err = new Error('QuotaExceededError'); err.name = 'QuotaExceededError';
      throw err;
    }
    backing.set(k, String(v));
    // HTML spec: the storage event MUST NOT fire when the new value equals the
    // old. This suppression is load-bearing for termination — the stub fired
    // unconditionally at first, which manufactured an infinite loop the
    // browser cannot exhibit (and would have hidden the fact that termination
    // DEPENDS on this suppression plus deterministic merges).
    if (oldValue === String(v)) return;
    const ev = { key: k, oldValue, newValue: String(v) };
    // A write from inside tab B's storage handler is B's write, even though it
    // happens during A's dispatch. Without re-tagging around each handler call,
    // a nested save was attributed to the ORIGINAL writer — delivered back to
    // the tab that made it and hidden from the tab it should reach. Browsers
    // attribute by document, so the stub must too.
    const writer = currentTab;
    if (pauseDelivery) { queued.push({ writer, ev }); return; }
    for (const { tag, fn } of tabListeners) {
      if (tag === writer) continue;
      const before = currentTab;
      currentTab = tag;
      fn(ev);
      currentTab = before;
    }
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

closeAllTabs();
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

closeAllTabs();
// ---- reset semantics across tabs -------------------------------------------
// A reset in one tab must not be silently undone by the other tab's memory —
// and an answer recorded AFTER the reset must survive the merge.
backing.set('series63_progress', JSON.stringify(seed));
const E = await asTab('E', () => import(`${modPath}?tab=E`));
const F = await asTab('F', () => import(`${modPath}?tab=F`));
await asTab('E', () => E.initCrossTabSync());
await asTab('F', () => F.initCrossTabSync());
check('reset setup: both tabs hold the seed', !!E.getProgress().answers[1] && !!F.getProgress().answers[1]);
// E resets (as the hook does: default + resetAt)
await asTab('E', () => E.updateProgress(() => ({
  schemaVersion: 1, answers: {}, topicsRead: {}, mockAttempts: [],
  preferences: { fontSize: 'md', theme: 'system' }, resetAt: 5000,
})));
check('reset: F adopted the reset instead of resurrecting old answers',
  !F.getProgress().answers[1],
  'F merged its pre-reset memory back; reset became restore');
const disk2 = JSON.parse(backing.get('series63_progress'));
check('reset: disk stays reset', !disk2.answers?.[1]);
// F answers something new, after the reset
await asTab('F', () => F.updateProgress((p) => ({
  ...p, answers: { ...p.answers, 300: { correct: true, ts: 6000, selected: 1 } },
})));
check('reset: post-reset answer in F reaches disk',
  !!JSON.parse(backing.get('series63_progress')).answers[300]);
check('reset: post-reset answer visible in E', !!E.getProgress().answers[300]);

closeAllTabs();
// ---- racing writes: delivery paused so BOTH tabs write before either merges --
backing.set('series63_progress', JSON.stringify(seed));
const G = await asTab('G', () => import(`${modPath}?tab=G`));
const H = await asTab('H', () => import(`${modPath}?tab=H`));
await asTab('G', () => G.initCrossTabSync());
await asTab('H', () => H.initCrossTabSync());
pauseDelivery = true;
await asTab('G', () => G.updateProgress((p) => ({
  ...p, answers: { ...p.answers, 400: { correct: true, ts: 7000, selected: 0 } },
})));
await asTab('H', () => H.updateProgress((p) => ({
  ...p, answers: { ...p.answers, 500: { correct: true, ts: 7001, selected: 1 } },
})));
flushDelivery();
const disk3 = JSON.parse(backing.get('series63_progress'));
check('race: both racing answers reach disk', !!disk3.answers[400] && !!disk3.answers[500],
  `disk has 400=${!!disk3.answers[400]} 500=${!!disk3.answers[500]}`);
check('race: both tabs converge in memory',
  !!G.getProgress().answers[500] && !!H.getProgress().answers[400]);

closeAllTabs();
// ---- stale writer vs reset: the tombstone must reach DISK, not just memory ---
backing.set('series63_progress', JSON.stringify(seed));
const I = await asTab('I', () => import(`${modPath}?tab=I`));
const J = await asTab('J', () => import(`${modPath}?tab=J`));
await asTab('I', () => I.initCrossTabSync());
await asTab('J', () => J.initCrossTabSync());
pauseDelivery = true;                      // J will not hear about the reset
await asTab('I', () => I.updateProgress(() => ({
  schemaVersion: 1, answers: {}, topicsRead: {}, mockAttempts: [],
  preferences: { fontSize: 'md', theme: 'system' }, resetAt: 8000,
})));
queued.length = 0; pauseDelivery = false;  // drop the reset event: J stays stale
await asTab('J', () => J.updateProgress((p) => p)); // stale J re-writes pre-reset record
const disk4 = JSON.parse(backing.get('series63_progress'));
check('stale-writer: tombstone is back on DISK after I merges', disk4.resetAt === 8000,
  `disk resetAt=${disk4.resetAt}; a reload would resurrect pre-reset data`);
check('stale-writer: pre-reset answer stays gone on disk', !disk4.answers?.[1]);

closeAllTabs();
// ---- missing ts must survive a merge when no reset exists --------------------
backing.set('series63_progress', JSON.stringify({
  ...seed, answers: { 9: { correct: true, selected: 1 } } })); // no ts at all
const K = await asTab('K', () => import(`${modPath}?tab=K`));
const L = await asTab('L', () => import(`${modPath}?tab=L`));
await asTab('K', () => K.initCrossTabSync());
await asTab('L', () => L.initCrossTabSync());
await asTab('K', () => K.updateProgress((p) => ({
  ...p, answers: { ...p.answers, 600: { correct: false, ts: 9000, selected: 2 } },
})));
check('missing-ts: legacy answer without ts survives the cross-tab merge',
  !!JSON.parse(backing.get('series63_progress')).answers[9],
  'an entry was dropped over a missing field');

closeAllTabs();
// ---- attempt identity: same ms+score, different timeUsed = two sittings ------
backing.set('series63_progress', JSON.stringify(seed));
const M2 = await asTab('M', () => import(`${modPath}?tab=M`));
const N2 = await asTab('N', () => import(`${modPath}?tab=N`));
await asTab('M', () => M2.initCrossTabSync());
await asTab('N', () => N2.initCrossTabSync());
pauseDelivery = true;
await asTab('M', () => M2.updateProgress((p) => ({
  ...p, mockAttempts: [{ ts: 12000, correct: 50, total: 60, pct: 83, timeUsed: 3000, answers: [] }, ...p.mockAttempts] })));
await asTab('N', () => N2.updateProgress((p) => ({
  ...p, mockAttempts: [{ ts: 12000, correct: 50, total: 60, pct: 83, timeUsed: 4500, answers: [] }, ...p.mockAttempts] })));
flushDelivery();
const att = JSON.parse(backing.get('series63_progress')).mockAttempts.filter((m) => m.ts === 12000);
check('attempt identity: same ms + same score but different timeUsed are BOTH kept',
  att.length === 2, `kept ${att.length} of 2`);
// EQUAL-TS DETERMINISM: both tabs and the disk must converge on ONE ordering.
// Sorting by ts alone left equal-ts attempts in remote-first insertion order,
// so the tabs derived mirror-ordered arrays and oscillated forever.
const dumpM = JSON.stringify(M2.getProgress().mockAttempts.map((m) => m.timeUsed));
const dumpN = JSON.stringify(N2.getProgress().mockAttempts.map((m) => m.timeUsed));
const dumpD = JSON.stringify(JSON.parse(backing.get('series63_progress')).mockAttempts.map((m) => m.timeUsed));
check('equal-ts determinism: both tabs and disk share one attempt ordering',
  dumpM === dumpN && dumpN === dumpD, `M=${dumpM} N=${dumpN} disk=${dumpD}`);

// ---- undefined-valued keys must not cause a write loop ----------------------
closeAllTabs();
backing.set('series63_progress', JSON.stringify(seed));
const O = await asTab('O', () => import(`${modPath}?tab=O`));
const P2 = await asTab('P', () => import(`${modPath}?tab=P`));
await asTab('O', () => O.initCrossTabSync());
await asTab('P', () => P2.initCrossTabSync());
let writesBefore = 0;
const countKey = 'series63_progress';
const origSet = localStorageStub.setItem;
let writeCount = 0;
localStorageStub.setItem = (k, v) => { if (k === countKey) writeCount++; return origSet(k, v); };
await asTab('O', () => O.updateProgress((p) => ({
  ...p, answers: { ...p.answers, 700: { correct: true, ts: 13000, selected: undefined } },
})));
localStorageStub.setItem = origSet;
check('undefined-key: no write storm (bounded writes after one update)', writeCount <= 3,
  `saw ${writeCount} writes to the progress key for ONE update — canonical() disagrees with JSON round-trip`);
check('undefined-key: tabs converge', !!P2.getProgress().answers[700]);

// ---- quota-pressure cycle must reach a fixed point ---------------------------
closeAllTabs();
const bigAttempt = (ts, tag) => ({ ts, correct: 40, total: 60, pct: 67, timeUsed: 3000 + ts,
  answers: Array.from({ length: 40 }, (_, i) => ({ qid: i, selected: 1, correct: true })), });
backing.set('series63_progress', JSON.stringify({ ...seed, mockAttempts: [] }));
const Q2 = await asTab('Q', () => import(`${modPath}?tab=Q`));
const R2 = await asTab('R', () => import(`${modPath}?tab=R`));
await asTab('Q', () => Q2.initCrossTabSync());
await asTab('R', () => R2.initCrossTabSync());
pauseDelivery = true;
await asTab('Q', () => Q2.updateProgress((p) => ({
  ...p, mockAttempts: Array.from({ length: 30 }, (_, i) => bigAttempt(20000 + i, 'q')) })));
await asTab('R', () => R2.updateProgress((p) => ({
  ...p, mockAttempts: Array.from({ length: 30 }, (_, i) => bigAttempt(30000 + i, 'r')) })));
// Arm a quota that forces the trim path on merge (union of 60 big attempts).
quotaLimit = JSON.stringify({ ...seed,
  mockAttempts: Array.from({ length: 40 }, (_, i) => bigAttempt(40000 + i)) }).length;
let cycleWrites = 0;
localStorageStub.setItem = (k, v) => { if (k === countKey) cycleWrites++; return origSet(k, v); };
flushDelivery();
localStorageStub.setItem = origSet;
quotaLimit = null;
check('quota-cycle: the exchange reaches a fixed point (bounded writes)', cycleWrites <= 6,
  `saw ${cycleWrites} writes — tabs are oscillating between two trims`);
const disk5 = JSON.parse(backing.get('series63_progress'));
check('quota-cycle: disk record is a valid trimmed record',
  Array.isArray(disk5.mockAttempts) && disk5.mockAttempts.length <= 50);

console.log(`\n${pass} ok, ${fail} failed`);
process.exit(fail ? 1 : 0);
