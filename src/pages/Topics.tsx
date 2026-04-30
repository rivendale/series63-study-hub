import { Link } from 'react-router-dom';
import { Timer } from 'lucide-react';
import { topics } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';
import { statsByTopic } from '../lib/stats';
import TopicCard from '../components/TopicCard';
import { examInfo } from '../data/examInfo';

export default function Topics() {
  const { progress } = useProgress();
  const stats = statsByTopic(progress);
  const ordered = [...topics].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold">Quiz</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Drill a single topic, or take a full mock exam.
        </p>
      </header>

      <Link to="/quiz/mock" className="block rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-3">
          <Timer className="w-6 h-6" />
          <div>
            <h2 className="font-semibold text-lg">Mock exam</h2>
            <p className="text-sm text-white/85">
              {examInfo.totalQuestions} questions &middot; {examInfo.timeMinutes} minutes &middot; pass at {examInfo.passPercentage}%
            </p>
          </div>
        </div>
      </Link>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">By topic</h2>
        <div className="grid grid-cols-1 gap-3">
          {ordered.map((t) => {
            const s = stats.find((x) => x.id === t.id)!;
            return (
              <TopicCard
                key={t.id}
                topic={t}
                to={`/quiz/topic/${t.id}`}
                pct={s.pct}
                answered={s.answered}
                total={s.total}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
