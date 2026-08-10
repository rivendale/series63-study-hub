import { useCallback, useEffect, useState } from 'react';
import { scheduleNext } from '../core/spacedRepetition';

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
const RESCUE_FLOOR_CHARS = 256;

export interface RecoveryNotice {
  /** Why the stored record could not be used. */
  reason: 'unreadable' | 'foreign-schema';
  /** False when the copy itself could not be written, so the original is all there is. */
  preserved: boolean;
  bytes: number;
}

let recoveryNotice: RecoveryNotice | null = null;

export function getRecoveryNotice(): RecoveryNotice | null {
  return recoveryNotice;
}

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
  recoveryNotice = null;
}

function quarantine(raw: string, reason: RecoveryNotice['reason']): void {
  // Too small to be a real study record - a stray value or a truncated stub.
  // Raising an alarm over these would train the user to dismiss the alarm.
  if (raw.length < RESCUE_FLOOR_CHARS) return;
  let preserved = true;
  try {
    window.localStorage.setItem(QUARANTINE_KEY, raw);
  } catch {
    // The copy did not fit. The original is still under the main key until the
    // next save replaces it, so say so rather than claiming it was saved.
    preserved = false;
  }
  recoveryNotice = { reason, preserved, bytes: raw.length };
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
    quarantine(raw, 'unreadable');
    return defaultProgress;
  }

  if (parsed?.schemaVersion !== SCHEMA_VERSION) {
    quarantine(raw, 'foreign-schema');
    return defaultProgress;
  }

  return {
    ...defaultProgress,
    ...parsed,
    preferences: { ...defaultProgress.preferences, ...parsed.preferences },
  };
}

/**
 * A write that fails silently is worse than one that throws. Every answer would
 * still appear to be recorded, because the UI renders from memory, and none of
 * it would survive a reload. Track the failure so the Progress page can say so.
 */
export type WriteStatus = 'ok' | 'failing';
let writeStatus: WriteStatus = 'ok';

export function getWriteStatus(): WriteStatus {
  return writeStatus;
}

function save(p: Progress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    writeStatus = 'ok';
  } catch {
    writeStatus = 'failing';
  }
}

type Listener = (p: Progress) => void;
const listeners = new Set<Listener>();
let current: Progress = load();

function setProgress(updater: (p: Progress) => Progress) {
  current = updater(current);
  save(current);
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

export function useProgress() {
  const [state, setState] = useState<Progress>(current);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const recordAnswer = useCallback(
    (qid: number, selected: number, correct: boolean) => {
      setProgress((p) => {
        const now = Date.now();
        // Promote or demote from whatever box this question was already in.
        const { box, due } = scheduleNext(p.answers[qid]?.box, correct, now);
        return {
          ...p,
          answers: {
            ...p.answers,
            [qid]: { correct, ts: now, selected, box, due },
          },
        };
      });
    },
    []
  );

  const markTopicRead = useCallback((topicId: string) => {
    setProgress((p) => ({
      ...p,
      topicsRead: { ...p.topicsRead, [topicId]: Date.now() },
    }));
  }, []);

  const recordMockAttempt = useCallback((attempt: MockAttempt) => {
    setProgress((p) => ({
      ...p,
      mockAttempts: [attempt, ...p.mockAttempts].slice(0, 50),
    }));
  }, []);

  const setPreferences = useCallback(
    (prefs: Partial<Progress['preferences']>) => {
      setProgress((p) => ({
        ...p,
        preferences: { ...p.preferences, ...prefs },
      }));
    },
    []
  );

  const resetAll = useCallback(() => {
    setProgress(() => ({ ...defaultProgress }));
  }, []);

  const exportJson = useCallback(() => {
    return JSON.stringify(current, null, 2);
  }, []);

  return {
    progress: state,
    recordAnswer,
    markTopicRead,
    recordMockAttempt,
    setPreferences,
    resetAll,
    exportJson,
  };
}

export function useTheme() {
  const { progress } = useProgress();
  useEffect(() => {
    const apply = () => {
      const t = progress.preferences.theme;
      const prefersDark =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = t === 'dark' || (t === 'system' && prefersDark);
      document.documentElement.classList.toggle('dark', isDark);
    };
    apply();
    if (progress.preferences.theme === 'system' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, [progress.preferences.theme]);

  useEffect(() => {
    const sizes = { sm: 'font-size-sm', md: 'font-size-md', lg: 'font-size-lg' };
    document.documentElement.classList.remove(
      'font-size-sm',
      'font-size-md',
      'font-size-lg'
    );
    document.documentElement.classList.add(sizes[progress.preferences.fontSize]);
  }, [progress.preferences.fontSize]);
}
