/**
 * Storage durability.
 *
 * The whole study record — every answered question, every topic read, every
 * mock attempt — lives in one localStorage key, and with no account and no
 * server there is nowhere else for it to go. Write FAILURE is already handled
 * in `useProgress` (see `getWriteStatus` and the quarantine path); this module
 * covers the other half, which is storage being taken away while nothing is
 * wrong.
 *
 * Browsers evict site data under storage pressure. Chrome on Android — the
 * primary target here — only does so when the device is genuinely short of
 * space, and it grants persistence automatically, without a prompt, once a
 * site is installed to the home screen or has enough engagement. Persisted
 * storage is exempt from eviction. So asking costs nothing and the answer is
 * usually yes; the app just has to actually ask.
 *
 * Everything feature-detects. `navigator.storage` is absent on older Safari —
 * precisely the engine most likely to evict — so the honest answer there is
 * "unsupported", never a throw and never a false reassurance.
 */

export type PersistenceOutcome = 'persisted' | 'denied' | 'unsupported';

export interface UsageEstimate {
  usedBytes: number;
  quotaBytes: number;
}

/**
 * Ask the browser to keep this origin's data rather than evicting it.
 *
 * `persisted()` is checked first so an already-granted permission is never
 * re-requested — on engines that show a dialog, asking twice would be a second
 * unexplained prompt for something already agreed to.
 *
 * `denied` is a normal answer rather than an error: Chrome decides on
 * engagement heuristics and may simply not be convinced yet, which installing
 * to the home screen usually fixes.
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

/** Current persistence state without requesting it. */
export async function isPersisted(): Promise<boolean | null> {
  if (typeof navigator === 'undefined') return null;
  const manager = navigator.storage as StorageManager | undefined;
  if (!manager || typeof manager.persisted !== 'function') return null;
  try {
    return await manager.persisted();
  } catch {
    return null;
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
 * True when running installed rather than in a browser tab.
 *
 * Both checks are needed. The display-mode media query is the standard signal
 * and is what Android and desktop answer to; iOS Safari predates it for home
 * screen apps and answers only on the non-standard `navigator.standalone`.
 */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const nav = window.navigator as (Navigator & { standalone?: boolean }) | undefined;
    if (nav?.standalone === true) return true;
    return (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(display-mode: standalone)').matches
    );
  } catch {
    return false;
  }
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
