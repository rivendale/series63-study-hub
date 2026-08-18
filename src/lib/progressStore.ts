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
  // Already held from an earlier session. Overwriting it with a second copy of
  // the same trouble would gain nothing and could cost the first one.
  if (noteExistingQuarantine()) return;
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
