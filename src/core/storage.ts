/**
 * Storage durability and storage health.
 *
 * The entire study record — every answered question, every topic read, every
 * mock attempt — lives in one localStorage key. There is no account and no
 * server by default, so if that key stops being writable the work has nowhere
 * else to go. Two things follow from that, and this module owns both.
 *
 * 1. A failed write must be loud. Answers are held in memory as well, so the
 *    screen keeps updating after storage has stopped accepting anything; from
 *    the inside a broken write and a healthy one look identical. Somebody can
 *    study for days on a record that will not survive the next reload. So
 *    every write outcome is published to an observable that the UI reads.
 *
 * 2. Storage can also be taken away while nothing is wrong. On iOS, storage
 *    written by a site opened in a browsing context is eligible for eviction
 *    after roughly seven days without interaction. A study cycle runs eight to
 *    twelve weeks; one holiday is long enough. Installing to the home screen
 *    changes that, and navigator.storage.persist() asks for durability where
 *    it exists. Neither is something the app can do silently on the student's
 *    behalf, so the app asks for what it can and explains the rest.
 *
 * Everything here feature-detects. navigator.storage is absent on older Safari
 * — precisely the browser most likely to evict — so the honest answer in that
 * case is "unknown", never a throw and never a false reassurance.
 */

/** Why a write failed. The two need different advice, so they stay distinct. */
export type StorageFailureKind =
  /** Storage exists and is writable, but the budget is exhausted. */
  | 'quota'
  /** The browser is refusing site data outright — private mode, blocked cookies. */
  | 'unavailable';

export type PersistenceOutcome = 'persisted' | 'denied' | 'unsupported';

export interface UsageEstimate {
  usedBytes: number;
  quotaBytes: number;
}

export interface TrimRecord {
  /** When the trim happened. */
  at: number;
  /** How many mock attempts were kept. */
  kept: number;
  /** How many were dropped to get the write through. */
  dropped: number;
}

export interface RecoveryRecord {
  /** The key the original bytes were set aside under. */
  key: string;
  /** Size of the value that could not be read, in characters. */
  bytes: number;
  /**
   * Whether those bytes were successfully copied out of the way. False means
   * storage refused the copy, so the original will be overwritten by the first
   * thing that saves — which the student needs telling, since at that point
   * nothing can be recovered.
   */
  preserved: boolean;
}

export interface StorageState {
  /**
   * 'unknown' until something has actually been written or probed. It is a
   * distinct state from 'ok' on purpose: claiming progress is saved before
   * anything has been saved would be the same class of lie this module exists
   * to prevent.
   */
  writeStatus: 'unknown' | 'ok' | 'failing';
  /** Set whenever writeStatus is 'failing', null otherwise. */
  failureKind: StorageFailureKind | null;
  lastFailureAt: number | null;
  /**
   * Present once mock history has been trimmed to recover from a full quota.
   * It survives later successful writes, because the student still needs to be
   * told that attempts were dropped even though saving is working again.
   */
  trim: TrimRecord | null;
  /** Result of navigator.storage.persist(), or 'unknown' before it has run. */
  persistence: PersistenceOutcome | 'unknown';
  /** True when running installed rather than in a browser tab. */
  standalone: boolean;
  /** Origin-wide usage from navigator.storage.estimate(); null where unsupported. */
  estimate: UsageEstimate | null;
  /**
   * Approximate size of the progress record itself, in bytes, as last written.
   * Taken from the serialised string length rather than measured, so it is a
   * close approximation for this mostly-ASCII JSON rather than an exact figure.
   * Worth showing separately from `estimate`, which covers the whole origin
   * including the offline copy of the app and is quoted against a much larger
   * budget than the few megabytes localStorage itself allows.
   */
  recordBytes: number | null;
  /**
   * Set when a record was found in storage that this build could not read — a
   * half-written value, or one left by a different schema version. The session
   * starts from an empty record in that case, which looks exactly like a wiped
   * device, so it is never left unexplained.
   */
  recovery: RecoveryRecord | null;
}

const initialState: StorageState = {
  writeStatus: 'unknown',
  failureKind: null,
  lastFailureAt: null,
  trim: null,
  persistence: 'unknown',
  standalone: false,
  estimate: null,
  recordBytes: null,
  recovery: null,
};

let state: StorageState = initialState;

type StorageListener = (s: StorageState) => void;
const listeners = new Set<StorageListener>();

function emit(patch: Partial<StorageState>): void {
  state = { ...state, ...patch };
  listeners.forEach((l) => l(state));
}

export function getStorageState(): StorageState {
  return state;
}

/** Subscribe to storage-health changes. Returns the unsubscribe function. */
export function subscribeStorage(listener: StorageListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/* ------------------------------------------------------------------ */
/* Availability                                                        */
/* ------------------------------------------------------------------ */

const PROBE_KEY = '__series65_storage_probe__';

/**
 * Classify a thrown storage error.
 *
 * Browsers have never agreed on how a full quota presents. Modern engines throw
 * a DOMException named QuotaExceededError; older WebKit used the legacy code 22
 * with the name QUOTA_EXCEEDED_ERR; Firefox has its own
 * NS_ERROR_DOM_QUOTA_REACHED with code 1014. Anything else — a browser refusing
 * site data altogether — is a different problem with a different remedy, so it
 * must not be folded in with a full disk.
 */
export function isQuotaError(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false;
  const e = err as { name?: unknown; code?: unknown };
  return (
    e.name === 'QuotaExceededError' ||
    e.name === 'QUOTA_EXCEEDED_ERR' ||
    e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    e.code === 22 ||
    e.code === 1014
  );
}

export function classifyWriteFailure(err: unknown): StorageFailureKind {
  return isQuotaError(err) ? 'quota' : 'unavailable';
}

/**
 * Probe by writing and deleting a throwaway key.
 *
 * The presence of window.localStorage proves nothing: Safari in private mode
 * historically exposed the object and threw on every write, so any check that
 * stops at `typeof window.localStorage !== 'undefined'` reports healthy storage
 * on exactly the configuration that has none.
 */
function probeStorage(): { ok: true } | { ok: false; kind: StorageFailureKind } {
  if (typeof window === 'undefined') return { ok: false, kind: 'unavailable' };
  try {
    window.localStorage.setItem(PROBE_KEY, 'probe');
    window.localStorage.removeItem(PROBE_KEY);
    return { ok: true };
  } catch (err) {
    return { ok: false, kind: classifyWriteFailure(err) };
  }
}

export function isStorageAvailable(): boolean {
  return probeStorage().ok;
}

/* ------------------------------------------------------------------ */
/* Durability                                                          */
/* ------------------------------------------------------------------ */

/**
 * Ask the browser to keep this origin's storage rather than evicting it under
 * pressure. persisted() is checked first so an already-granted permission is
 * never re-requested — on engines that prompt, asking again would be a second
 * unexplained dialog for something the student already agreed to.
 *
 * 'denied' is a normal answer, not an error: Chrome grants persistence on
 * engagement heuristics and may simply not be convinced yet. 'unsupported'
 * covers Safari, which has no Storage Manager at all.
 */
export async function requestPersistence(): Promise<PersistenceOutcome> {
  if (typeof navigator === 'undefined') return 'unsupported';
  const manager = navigator.storage as StorageManager | undefined;
  if (
    !manager ||
    typeof manager.persist !== 'function' ||
    typeof manager.persisted !== 'function'
  ) {
    return 'unsupported';
  }
  try {
    if (await manager.persisted()) return 'persisted';
    return (await manager.persist()) ? 'persisted' : 'denied';
  } catch {
    return 'unsupported';
  }
}

/**
 * Origin-wide usage. Null where the browser does not report it, which is a
 * legitimate answer to render as "not reported" rather than as zero.
 */
export async function estimateUsage(): Promise<UsageEstimate | null> {
  if (typeof navigator === 'undefined') return null;
  const manager = navigator.storage as StorageManager | undefined;
  if (!manager || typeof manager.estimate !== 'function') return null;
  try {
    const est = await manager.estimate();
    if (typeof est.usage !== 'number' || typeof est.quota !== 'number') return null;
    return { usedBytes: est.usage, quotaBytes: est.quota };
  } catch {
    return null;
  }
}

/**
 * True when the app is running installed rather than in a browser tab.
 *
 * Both checks are needed. The display-mode media query is the standard signal
 * and is what Android and desktop answer to; iOS Safari predates it for home
 * screen apps and answers only on the non-standard navigator.standalone. iOS is
 * the case that matters most here, since it is the platform that evicts.
 */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const nav = window.navigator as
      | (Navigator & { standalone?: boolean })
      | undefined;
    if (nav?.standalone === true) return true;
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(display-mode: standalone)').matches
    );
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Reporting, called from the save path                                */
/* ------------------------------------------------------------------ */

/** A write landed. Clears any standing failure; a trim notice deliberately survives. */
export function reportWriteOk(recordBytes: number): void {
  emit({
    writeStatus: 'ok',
    failureKind: null,
    recordBytes,
  });
}

/** A write was lost. Nothing recovered it, so the record on disk is now stale. */
export function reportWriteFailure(kind: StorageFailureKind): void {
  emit({
    writeStatus: 'failing',
    failureKind: kind,
    lastFailureAt: Date.now(),
  });
  void refreshEstimate();
}

/**
 * A write only succeeded after mock history was cut back. Saving works again,
 * so this is not a failure state — but attempts were destroyed to get here and
 * that is never allowed to happen quietly.
 */
export function reportHistoryTrimmed(
  kept: number,
  dropped: number,
  recordBytes: number
): void {
  const previous = state.trim;
  emit({
    writeStatus: 'ok',
    failureKind: null,
    recordBytes,
    trim: {
      at: Date.now(),
      kept,
      // Repeated trims accumulate, so the number shown is always the total lost
      // rather than however many the most recent write happened to drop.
      dropped: (previous?.dropped ?? 0) + dropped,
    },
  });
  void refreshEstimate();
}

/**
 * A stored record could not be read, so this session starts empty.
 *
 * On screen that is indistinguishable from a device that was wiped, and the
 * difference matters enormously: the bytes may still be there and worth
 * rescuing. Reported rather than logged, for the same reason a failed write is.
 */
export function reportUnreadableRecord(recovery: RecoveryRecord): void {
  emit({ recovery });
}

/** The quarantined copy was deliberately discarded, so stop mentioning it. */
export function clearRecovery(): void {
  emit({ recovery: null });
}

/* ------------------------------------------------------------------ */
/* Initialisation                                                      */
/* ------------------------------------------------------------------ */

/** Re-read the origin estimate into the observable. Safe to call at any time. */
export async function refreshEstimate(): Promise<void> {
  const estimate = await estimateUsage();
  if (estimate) emit({ estimate });
}

let initialised = false;

/**
 * Run the one-time health checks: probe, ask for durability, take a usage
 * reading. Fire and forget — nothing waits on the result, because a student
 * opening the app to answer questions should not be held up by a permission
 * round trip, and a denied request changes nothing about how the app works.
 *
 * The probe runs first and synchronously so that a browser refusing storage is
 * surfaced immediately, rather than after the first answer is lost.
 */
export function initStorageHealth(recordBytes?: number): void {
  if (initialised) return;
  initialised = true;

  emit({ standalone: isStandalone() });

  const probe = probeStorage();
  if (probe.ok) {
    // A write and a delete just succeeded, which is direct evidence that this
    // browser accepts site data — enough to report health before the student
    // has answered anything this session.
    emit({
      writeStatus: 'ok',
      failureKind: null,
      recordBytes: recordBytes ?? state.recordBytes,
    });
  } else {
    reportWriteFailure(probe.kind);
  }

  void requestPersistence().then((persistence) => emit({ persistence }));
  void refreshEstimate();
}

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

/** Human-readable byte size, in the units a phone screen has room for. */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return 'unknown';
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
  const gb = mb / 1024;
  return `${gb < 10 ? gb.toFixed(1) : Math.round(gb)} GB`;
}
