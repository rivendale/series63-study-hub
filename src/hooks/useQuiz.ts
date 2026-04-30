import { useCallback, useMemo, useState } from 'react';
import { questions, type Question } from '../data/questions';
import { topics } from '../data/curriculum';
import { sample, shuffle } from '../lib/shuffle';

export type QuizMode = 'topic' | 'mock';

export interface QuizConfig {
  mode: QuizMode;
  topicId?: string;
  totalMock?: number;
}

export interface SessionAnswer {
  qid: number;
  selected: number;
  correct: boolean;
}

const MOCK_TOTAL = 60;

const MOCK_DISTRIBUTION: Record<string, number> = {
  'usa-foundations': 3,
  'agent-registration': 10,
  'bd-registration': 4,
  'ia-registration': 5,
  'securities-registration': 3,
  'exempt-securities': 4,
  'exempt-transactions': 6,
  'security-definition': 2,
  'unethical-bd': 8,
  'unethical-ia': 6,
  fraud: 4,
  'admin-actions': 3,
  communications: 2,
};

function buildMockSet(): Question[] {
  const out: Question[] = [];
  for (const t of topics) {
    const want = MOCK_DISTRIBUTION[t.id] ?? 0;
    const pool = questions.filter((q) => q.topic === t.id);
    out.push(...sample(pool, want));
  }
  // Top up if any topic was short on questions
  while (out.length < MOCK_TOTAL) {
    const remaining = questions.filter((q) => !out.includes(q));
    if (remaining.length === 0) break;
    out.push(...sample(remaining, MOCK_TOTAL - out.length));
  }
  return shuffle(out).slice(0, MOCK_TOTAL);
}

export function useQuiz(config: QuizConfig) {
  const initialQuestions = useMemo(() => {
    if (config.mode === 'topic' && config.topicId) {
      return shuffle(questions.filter((q) => q.topic === config.topicId));
    }
    return buildMockSet();
  }, [config.mode, config.topicId]);

  const [items] = useState<Question[]>(initialQuestions);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<SessionAnswer[]>([]);
  const [finished, setFinished] = useState(false);

  const current = items[index];

  const submit = useCallback(() => {
    if (selected === null || !current) return;
    const correct = selected === current.answer;
    setAnswers((prev) => [
      ...prev,
      { qid: current.id, selected, correct },
    ]);
    setSubmitted(true);
  }, [selected, current]);

  const next = useCallback(() => {
    if (index >= items.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setSubmitted(false);
  }, [index, items.length]);

  const select = useCallback(
    (i: number) => {
      if (!submitted) setSelected(i);
    },
    [submitted]
  );

  // Mock mode: record without showing per-question feedback
  const recordAndAdvanceMock = useCallback(() => {
    if (selected === null || !current) return;
    const correct = selected === current.answer;
    setAnswers((prev) => [
      ...prev,
      { qid: current.id, selected, correct },
    ]);
    if (index >= items.length - 1) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setSubmitted(false);
    }
  }, [selected, current, index, items.length]);

  const finishNow = useCallback(() => {
    setFinished(true);
  }, []);

  const correctCount = answers.filter((a) => a.correct).length;
  const total = items.length;

  return {
    items,
    current,
    index,
    selected,
    submitted,
    answers,
    finished,
    correctCount,
    total,
    select,
    submit,
    next,
    recordAndAdvanceMock,
    finishNow,
  };
}
