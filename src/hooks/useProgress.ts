import { useCallback, useEffect, useState } from 'react';

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
  answers: Record<number, { correct: boolean; ts: number; selected?: number }>;
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

function load(): Progress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw) as Progress;
    if (parsed.schemaVersion !== SCHEMA_VERSION) return defaultProgress;
    return { ...defaultProgress, ...parsed, preferences: { ...defaultProgress.preferences, ...parsed.preferences } };
  } catch {
    return defaultProgress;
  }
}

function save(p: Progress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // storage full or unavailable; ignore
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
      setProgress((p) => ({
        ...p,
        answers: {
          ...p.answers,
          [qid]: { correct, ts: Date.now(), selected },
        },
      }));
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
