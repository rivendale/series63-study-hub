import type { Progress } from '../hooks/useProgress';
import { questions } from '../data/questions';
import { topics } from '../data/curriculum';
import {
  OFFICIAL_CATEGORIES,
  TOPIC_TO_CATEGORY,
  type OfficialCategoryId,
} from '../data/categories';
import { examInfo } from '../data/examInfo';

export interface TopicStat {
  id: string;
  title: string;
  total: number;
  answered: number;
  correct: number;
  pct: number;
}

export function overallStats(progress: Progress) {
  const ids = Object.keys(progress.answers);
  const answered = ids.length;
  const correct = ids.filter((id) => progress.answers[Number(id)].correct)
    .length;
  const pct = answered === 0 ? 0 : Math.round((correct / answered) * 100);
  return { answered, correct, pct };
}

export interface CategoryStat {
  id: OfficialCategoryId;
  name: string;
  /** Scored questions this category contributes to the real exam. */
  examQuestions: number;
  /** Share of the scored exam, as a percentage. */
  weight: number;
  total: number;
  answered: number;
  correct: number;
  pct: number;
}

/**
 * Progress against the four official NASAA categories.
 *
 * By-topic progress answers "what have I studied"; this answers the more
 * useful question, "where will the exam actually hurt me". A topic worth six
 * questions and a topic worth thirty look identical in a by-topic list, and a
 * student optimising the wrong one is a real failure mode.
 */
export function statsByCategory(progress: Progress): CategoryStat[] {
  return (Object.keys(OFFICIAL_CATEGORIES) as OfficialCategoryId[]).map((id) => {
    const cat = OFFICIAL_CATEGORIES[id];
    const pool = questions.filter((q) => TOPIC_TO_CATEGORY[q.topic] === id);
    let answered = 0;
    let correct = 0;
    for (const q of pool) {
      const a = progress.answers[q.id];
      if (a) {
        answered += 1;
        if (a.correct) correct += 1;
      }
    }
    return {
      id,
      name: cat.name,
      examQuestions: cat.questions,
      weight: cat.pct,
      total: pool.length,
      answered,
      correct,
      pct: answered === 0 ? 0 : Math.round((correct / answered) * 100),
    };
  });
}

export interface WeightedReadiness {
  /** Blueprint-weighted accuracy, 0-100, or null when too little has been answered. */
  pct: number | null;
  /** That percentage expressed as scored questions out of the exam total. */
  projectedScore: number | null;
  /** Categories with no answered questions, which the estimate cannot see. */
  blindCategories: string[];
  /** True once every category has at least one answered question. */
  complete: boolean;
}

/** Below this many answered questions in a category, its accuracy is noise. */
const MIN_SAMPLE = 5;

/**
 * A blueprint-weighted readiness figure.
 *
 * This is an ESTIMATE and flatters the student in three known ways: practice
 * questions are untimed, may have been seen before, and give feedback as you
 * go. It is reported alongside its blind spots rather than as a prediction,
 * because a single confident number is exactly what a student would over-trust.
 */
export function weightedReadiness(progress: Progress): WeightedReadiness {
  const cats = statsByCategory(progress);
  const blind = cats.filter((c) => c.answered < MIN_SAMPLE);
  const usable = cats.filter((c) => c.answered >= MIN_SAMPLE);

  if (usable.length === 0) {
    return { pct: null, projectedScore: null, blindCategories: blind.map((c) => c.name), complete: false };
  }

  // Re-normalise over the categories we can actually see, so a missing
  // category drags the estimate toward zero rather than silently counting as 0%.
  const weightSeen = usable.reduce((s, c) => s + c.weight, 0);
  const weighted = usable.reduce((s, c) => s + c.pct * c.weight, 0) / weightSeen;
  const pct = Math.round(weighted);

  return {
    pct,
    projectedScore: Math.round((pct / 100) * examInfo.scoredQuestions),
    blindCategories: blind.map((c) => c.name),
    complete: blind.length === 0,
  };
}

export function statsByTopic(progress: Progress): TopicStat[] {
  return topics.map((t) => {
    const topicQuestions = questions.filter((q) => q.topic === t.id);
    let answered = 0;
    let correct = 0;
    for (const q of topicQuestions) {
      const a = progress.answers[q.id];
      if (a) {
        answered += 1;
        if (a.correct) correct += 1;
      }
    }
    const pct = answered === 0 ? 0 : Math.round((correct / answered) * 100);
    return {
      id: t.id,
      title: t.title,
      total: topicQuestions.length,
      answered,
      correct,
      pct,
    };
  });
}
