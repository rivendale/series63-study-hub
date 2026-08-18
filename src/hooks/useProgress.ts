import { useCallback, useEffect, useState } from 'react';
import { scheduleNext } from '../core/spacedRepetition';
import {
  getStorageState,
  initStorageHealth,
  subscribeStorage,
  type StorageState,
} from '../core/storage';
import {
  defaultProgress,
  getProgress as storeGetProgress,
  subscribeProgress,
  updateProgress,
  type MockAttempt,
  type Progress,
} from '../lib/progressStore';

// The store half of this file — load, save, quarantine, and the record types —
// moved to src/lib/progressStore.ts so a Node harness can drive it without
// React. Everything this module used to export is still exported from here.
export {
  readQuarantinedRecord,
  discardQuarantinedRecord,
  type MockAttempt,
  type Progress,
} from '../lib/progressStore';

/**
 * A non-reactive read of the current progress.
 *
 * Quiz sets are built once at mount and must not shift underneath the student:
 * recording an answer changes `answers`, and a reactive read would rebuild the
 * "missed" or "due" queue mid-session, dropping the question being worked on.
 */
export function getProgress(): Progress {
  return storeGetProgress();
}

export function useProgress() {
  const [state, setState] = useState<Progress>(storeGetProgress);
  const [storage, setStorage] = useState<StorageState>(getStorageState);

  useEffect(() => subscribeProgress(setState), []);

  useEffect(() => {
    const unsubscribe = subscribeStorage(setStorage);
    // Runs once per session and nothing waits on it. The synchronous half means
    // a browser refusing storage is known before the first answer rather than
    // after it has been lost; the persistence request resolves whenever it
    // resolves and changes nothing about how the app behaves meanwhile.
    initStorageHealth();
    setStorage(getStorageState());
    return unsubscribe;
  }, []);

  const recordAnswer = useCallback(
    (qid: number, selected: number, correct: boolean) => {
      updateProgress((p) => {
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
    updateProgress((p) => ({
      ...p,
      topicsRead: { ...p.topicsRead, [topicId]: Date.now() },
    }));
  }, []);

  const recordMockAttempt = useCallback((attempt: MockAttempt) => {
    updateProgress((p) => ({
      ...p,
      mockAttempts: [attempt, ...p.mockAttempts].slice(0, 50),
    }));
  }, []);

  const setPreferences = useCallback(
    (prefs: Partial<Progress['preferences']>) => {
      updateProgress((p) => ({
        ...p,
        preferences: { ...p.preferences, ...prefs },
      }));
    },
    []
  );

  const resetAll = useCallback(() => {
    updateProgress(() => ({ ...defaultProgress }));
  }, []);

  const exportJson = useCallback(() => {
    return JSON.stringify(storeGetProgress(), null, 2);
  }, []);

  return {
    progress: state,
    storage,
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
