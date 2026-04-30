import type { Progress } from '../hooks/useProgress';
import { questions } from '../data/questions';
import { topics } from '../data/curriculum';

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
