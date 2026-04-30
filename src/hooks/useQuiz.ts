import { useCallback, useMemo, useState } from 'react';
import { questions, type Question } from '../data/questions';
import { topics } from '../data/curriculum';
import { sample, shuffle } from '../lib/shuffle';
import {
  OFFICIAL_CATEGORIES,
  TOPIC_TO_CATEGORY,
  type OfficialCategoryId,
} from '../data/categories';
import { examInfo } from '../data/examInfo';

export type QuizMode = 'topic' | 'mock';

export interface QuizConfig {
  mode: QuizMode;
  topicId?: string;
}

export interface SessionAnswer {
  qid: number;
  selected: number;
  correct: boolean;
}

// Build a 65-question mock: 60 scored items sampled by NASAA category
// blueprint (28/21/6/5), plus 5 unscored "pretest" items mixed in
// randomly to mirror the real exam experience.
function buildMockSet(): Question[] {
  const scored: Question[] = [];

  for (const catId of Object.keys(OFFICIAL_CATEGORIES) as OfficialCategoryId[]) {
    const want = OFFICIAL_CATEGORIES[catId].questions;
    const pool = questions.filter(
      (q) => TOPIC_TO_CATEGORY[q.topic] === catId
    );
    scored.push(...sample(pool, want));
  }

  while (scored.length < examInfo.scoredQuestions) {
    const remaining = questions.filter((q) => !scored.includes(q));
    if (remaining.length === 0) break;
    scored.push(...sample(remaining, examInfo.scoredQuestions - scored.length));
  }

  const pretestPool = questions.filter((q) => !scored.includes(q));
  const pretest = sample(pretestPool, examInfo.pretestQuestions);

  return shuffle([...scored, ...pretest]).slice(0, examInfo.totalQuestions);
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
    setAnswers((prev) => [...prev, { qid: current.id, selected, correct }]);
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

  const recordAndAdvanceMock = useCallback(() => {
    if (selected === null || !current) return;
    const correct = selected === current.answer;
    setAnswers((prev) => [...prev, { qid: current.id, selected, correct }]);
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

  const scoredAnswers =
    config.mode === 'mock'
      ? answers.slice(0, examInfo.scoredQuestions)
      : answers;
  const scoredCorrect = scoredAnswers.filter((a) => a.correct).length;
  const scoredTotal = config.mode === 'mock' ? examInfo.scoredQuestions : total;

  void topics;

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
    scoredCorrect,
    scoredTotal,
    select,
    submit,
    next,
    recordAndAdvanceMock,
    finishNow,
  };
}
