/**
 * The progress store: everything about loading, saving, quarantining and
 * cross-tab reconciliation of the student's record. NO REACT IN THIS FILE —
 * that is the point. The logic here used to live inside the useProgress hook,
 * where no Node harness could reach it, which is exactly where two data-loss
 * bugs survived every review: the harness covered src/core/storage.ts and
 * stopped at the hook boundary.
 */
import {
  classifyWriteFailure,
  clearRecovery,
  reportHistoryTrimmed,
  reportUnreadableRecord,
  reportWriteFailure,
  reportWriteOk,
} from '../core/storage';

const STORAGE_KEY = 'series63_progress';
const SCHEMA_VERSION = 1 as const;

export interface MockAttempt {
  ts: number;
  correct: number;
  total: number;
  pct: number;
  timeUsed: number;
  answers: { qid: number; selected: number; correct: boolean }[];
}

export interface Progress {
  schemaVersion: typeof SCHEMA_VERSION;
  /**
   * `box` and `due` drive spaced repetition and are OPTIONAL on purpose. They
   * were added after the schema was already in the field, and making them
   * required would have meant bumping schemaVersion — which sends every
   * existing record through the unreadable-record quarantine path. That path is
   * right for a genuinely incompatible change and wrong for an additive one, so
   * records written before this feature simply arrive without them and are
   * treated as due. See src/core/spacedRepetition.ts.
   */
  answers: Record<
    number,
    { correct: boolean; ts: number; selected?: number; box?: number; due?: number }
  >;
  topicsRead: Record<string, number>;
  mockAttempts: MockAttempt[];
  /**
   * When the student last chose "reset everything", ms epoch. OPTIONAL and
   * additive — no schemaVersion bump, same reasoning as box/due above. It
   * exists for cross-tab merges: without it, a reset in one tab is merged
   * straight back from the other tab's memory, and "reset" silently becomes
   * "restore". Entries recorded AFTER the reset survive a merge; entries from
   * before it stay gone.
   */
  resetAt?: number;
  preferences: {
    fontSize: 'sm' | 'md' | 'lg';
    theme: 'system' | 'light' | 'dark';
  };
}

const defaultProgress: Progress = {
  schemaVersion: SCHEMA_VERSION,
  answers: {},
  topicsRead: {},
  mockAttempts: [],
  preferences: { fontSize: 'md', theme: 'system' },
};

/**
 * Where an unreadable record is set aside instead of being destroyed.
 *
 * The obvious way to handle a record this version cannot parse is to fall back
 * to an empty default. That is quietly catastrophic: the next answer triggers a
 * save, the save overwrites the original, and weeks of study are gone without a
 * click, a prompt, or any way back. Merely opening the app was enough.
 *
 * So an unreadable record is copied here and left alone under the main key
 * until something deliberately replaces it, and the UI offers to download it.
 * A record we cannot read is not the same as a record that does not matter.
 */
const QUARANTINE_KEY = 'series63_progress_unreadable';

/** Below this, a record is too small to be anything worth preserving. */
const RESCUE_MIN_CHARS = 256;

/** The raw text of a quarantined record, for download. */
export function readQuarantinedRecord(): string | null {
  try {
    return window.localStorage.getItem(QUARANTINE_KEY);
  } catch {
    return null;
  }
}

export function discardQuarantinedRecord(): void {
  try {
    window.localStorage.removeItem(QUARANTINE_KEY);
  } catch {
    // Nothing useful to do; the notice clears either way.
  }
  clearRecovery();
}

/**
 * Report a copy held from an earlier session, if there is one.
 *
 * Called on every load, not only on a failed one: once anything saves, the main
 * key holds a readable record again, and without this the notice — and the only
 * route to removing the copy — would disappear while the bytes stayed.
 */
function noteExistingQuarantine(): boolean {
  if (typeof window === 'undefined') return false;
  let existing: string | null = null;
  try {
    existing = window.localStorage.getItem(QUARANTINE_KEY);
  } catch {
    return false;
  }
  if (existing === null) return false;
  reportUnreadableRecord({ key: QUARANTINE_KEY, bytes: existing.length, preserved: true });
  return true;
}

/**
 * Copy an unreadable record out of the way, once, and say that it happened.
 *
 * Best effort by necessity — the copy needs room, and a record too big to parse
 * cleanly is often one written when room was already short. A failed copy is
 * not a reason to refuse to save from here on, which would turn one lost record
 * into an app that cannot be used at all; it is a reason to say so while the
 * original is still there to be rescued by hand.
 */
function quarantine(raw: string): void {
  // Too small to be a real study record — a stray value or a truncated stub.
  // Raising an alarm over these would train the user to dismiss the alarm.
  if (raw.length < RESCUE_MIN_CHARS) return;

  // One slot, possibly already occupied from an earlier session. The old rule
  // was "never overwrite" — which silently DROPPED any second unreadable
  // record: no copy anywhere, destroyed by the next save. With one slot the
  // policy is keep-whichever-is-larger, because months of study are bytes and
  // a bigger record is more record. THIS IS A HEURISTIC, NOT A PRESERVATION
  // GUARANTEE: if the slot holds large junk and the new casualty is small and
  // valuable, the valuable one is the one lost. Code cannot tell junk from
  // value; a second slot would just move the same choice one step later. The
  // real mitigation is the download-the-quarantine UI, which exists.
  // Identical contents are the same trouble seen twice and need nothing.
  let existing: string | null = null;
  try {
    existing = window.localStorage.getItem(QUARANTINE_KEY);
  } catch {
    reportUnreadableRecord({ key: QUARANTINE_KEY, bytes: raw.length, preserved: false });
    return;
  }
  if (existing !== null && (existing === raw || existing.length >= raw.length)) {
    reportUnreadableRecord({ key: QUARANTINE_KEY, bytes: existing.length, preserved: true });
    return;
  }
  try {
    window.localStorage.setItem(QUARANTINE_KEY, raw);
    reportUnreadableRecord({ key: QUARANTINE_KEY, bytes: raw.length, preserved: true });
  } catch {
    reportUnreadableRecord({ key: QUARANTINE_KEY, bytes: raw.length, preserved: false });
  }
}

function load(): Progress {
  if (typeof window === 'undefined') return defaultProgress;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage unreadable entirely - private mode, or blocked by policy.
    return defaultProgress;
  }
  if (!raw) return defaultProgress;

  let parsed: Progress;
  try {
    parsed = JSON.parse(raw) as Progress;
  } catch {
    quarantine(raw);
    return defaultProgress;
  }

  if (parsed?.schemaVersion !== SCHEMA_VERSION) {
    quarantine(raw);
    return defaultProgress;
  }

  // A readable record now, but a copy from an earlier session may still be
  // sitting there with no other route to it.
  noteExistingQuarantine();

  return {
    ...defaultProgress,
    ...parsed,
    preferences: { ...defaultProgress.preferences, ...parsed.preferences },
  };
}

/** Mock attempts kept when a full quota forces a rescue write. */
const TRIM_KEEP_ATTEMPTS = 25;

/**
 * Persist the record, and say so when it does not work.
 *
 * The failure this guards against is not data loss on its own — it is data loss
 * that looks like success. Answers are also held in memory, so after a refused
 * write the screen still ticks up, the accuracy still moves, and nothing seems
 * wrong until a reload throws the lot away. A silent catch here turns a bad
 * afternoon into weeks of invisible loss.
 *
 * Returns the record that actually reached storage, which is not always the one
 * passed in: a quota rescue writes a trimmed record, and the caller adopts that
 * so memory and disk keep telling the same story.
 */
function save(p: Progress): Progress {
  if (typeof window === 'undefined') return p;

  const json = JSON.stringify(p);
  try {
    window.localStorage.setItem(STORAGE_KEY, json);
    reportWriteOk(json.length);
    return p;
  } catch (err) {
    const kind = classifyWriteFailure(err);

    // One recovery attempt before giving up. Trimming when there is nothing to
    // trim would only fail identically, so it is not tried in that case — the
    // student gets the honest failure instead of a pointless retry.
    if (kind === 'quota' && p.mockAttempts.length > TRIM_KEEP_ATTEMPTS) {
      // mockAttempts is newest-first everywhere it is built, so this keeps the
      // most recent sittings and drops the oldest.
      const trimmed: Progress = {
        ...p,
        mockAttempts: p.mockAttempts.slice(0, TRIM_KEEP_ATTEMPTS),
      };
      const dropped = p.mockAttempts.length - trimmed.mockAttempts.length;
      const trimmedJson = JSON.stringify(trimmed);
      try {
        window.localStorage.setItem(STORAGE_KEY, trimmedJson);
        reportHistoryTrimmed(TRIM_KEEP_ATTEMPTS, dropped, trimmedJson.length);
        return trimmed;
      } catch (retryErr) {
        reportWriteFailure(classifyWriteFailure(retryErr));
        return p;
      }
    }

    reportWriteFailure(kind);
    return p;
  }
}

type Listener = (p: Progress) => void;
const listeners = new Set<Listener>();
let current: Progress = load();

function setProgress(updater: (p: Progress) => Progress) {
  // Adopt whatever actually reached storage. When a quota rescue drops the
  // oldest mock attempts, keeping the untrimmed record here would leave the UI
  // listing history that no longer exists on disk, and every later write would
  // re-attempt the same oversized payload.
  current = save(updater(current));
  listeners.forEach((l) => l(current));
}


/**
 * A non-reactive read of the current progress.
 *
 * Quiz sets are built once at mount and must not shift underneath the student:
 * recording an answer changes `answers`, and a reactive read would rebuild the
 * "missed" or "due" queue mid-session, dropping the question being worked on.
 */
export function getProgress(): Progress {
  return current;
}

export function subscribeProgress(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function updateProgress(updater: (p: Progress) => Progress): void {
  setProgress(updater);
}

export { defaultProgress };


/**
 * Merge two records after a cross-tab write. Union, newest-wins per entry:
 * answers by per-question timestamp, topics by timestamp, mock attempts by
 * identity, preferences from the remote record because the storage event means
 * the other tab wrote LAST and preferences are a deliberate choice.
 *
 * `localContributed` is the termination guarantee for the save loop below:
 * tab B saves its merge only if it added something the disk record lacked, so
 * when A re-merges B's result nothing is missing, nothing is contributed, and
 * nobody saves again.
 */
function mergeProgress(local: Progress, remote: Progress): Progress {
  const resetAt = Math.max(local.resetAt ?? 0, remote.resetAt ?? 0);
  // An entry without a timestamp cannot be placed relative to a reset. With no
  // reset anywhere, keep it (dropping data over a missing field is the bug this
  // module exists to prevent); once a reset exists, it counts as pre-reset.
  const keep = (ts: number | undefined) => (resetAt === 0 ? true : (ts ?? 0) >= resetAt);

  const answers: Progress['answers'] = {};
  for (const [qid, a] of Object.entries(remote.answers)) {
    if (keep(a.ts)) answers[Number(qid)] = a;
  }
  for (const [qid, a] of Object.entries(local.answers)) {
    if (!keep(a.ts)) continue;
    const r = answers[Number(qid)];
    if (!r || a.ts > r.ts) answers[Number(qid)] = a;
  }

  const topicsRead: Progress['topicsRead'] = {};
  for (const [t, ts] of Object.entries(remote.topicsRead)) {
    if (keep(ts)) topicsRead[t] = ts;
  }
  for (const [t, ts] of Object.entries(local.topicsRead)) {
    if (!keep(ts)) continue;
    if (!(t in topicsRead) || ts > topicsRead[t]) topicsRead[t] = ts;
  }

  // timeUsed joins the identity: two sittings finishing in the same millisecond
  // with the same score is already remote across devices, but identity is cheap
  // and a dropped sitting is not.
  const attemptKey = (m: MockAttempt) => `${m.ts}:${m.total}:${m.correct}:${m.timeUsed}`;
  const remoteKept = remote.mockAttempts.filter((m) => keep(m.ts));
  const seen = new Set(remoteKept.map(attemptKey));
  const extra = local.mockAttempts.filter((m) => keep(m.ts) && !seen.has(attemptKey(m)));
  const mockAttempts = [...remoteKept, ...extra].sort((x, y) => y.ts - x.ts).slice(0, 50);

  return {
    ...remote,
    answers,
    topicsRead,
    mockAttempts,
    ...(resetAt > 0 ? { resetAt } : {}),
  };
}

/**
 * Order-independent equality for two records. JSON.stringify key order depends
 * on construction history, so comparing raw strings would re-save records that
 * differ only in key order — and a save fires a storage event, so a spurious
 * difference is a spurious write loop.
 */
function canonical(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value !== null && typeof value === 'object') {
    return (
      '{' +
      Object.keys(value as Record<string, unknown>)
        .sort()
        .map((k) => JSON.stringify(k) + ':' + canonical((value as Record<string, unknown>)[k]))
        .join(',') +
      '}'
    );
  }
  return JSON.stringify(value);
}

let crossTabInitialised = false;

/**
 * Adopt writes made by OTHER TABS. Without this, two open tabs each hold the
 * whole record in memory and every save is a whole-record write: last writer
 * wins and the other tab's answers are silently destroyed — proven by
 * scripts/storage-regression.mjs against the unfixed store.
 *
 * The `storage` event fires only in tabs that did NOT write, which is exactly
 * the delivery we need. Parse failures are ignored here rather than
 * quarantined: the writing tab owns that record's trouble, and a reader
 * quarantining a record it merely observed would fight the owner for the slot.
 */
export function initCrossTabSync(): void {
  if (crossTabInitialised || typeof window === 'undefined') return;
  crossTabInitialised = true;
  window.addEventListener('storage', (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY || typeof e.newValue !== 'string') return;
    let remote: Progress;
    try {
      remote = JSON.parse(e.newValue) as Progress;
    } catch {
      return;
    }
    if (remote?.schemaVersion !== SCHEMA_VERSION) return;
    const merged = mergeProgress(current, remote);
    // Save exactly when the merge produced something the DISK record is not —
    // one rule covering three failure shapes a per-entry "contributed" flag
    // missed: a reset tombstone that existed only in memory (a stale tab's
    // write resurrected pre-reset data on the next reload), preferences adopted
    // in memory while disk said otherwise, and a pre-cap count that forced
    // byte-identical re-saves. Termination is by convergence: a save publishes
    // merged; the other tab's merge of (its current, merged) yields merged
    // again, which equals its disk view, so nobody saves twice.
    if (canonical(merged) !== canonical(remote)) {
      current = save(merged);
    } else {
      current = merged;
    }
    listeners.forEach((l) => l(current));
  });
}
