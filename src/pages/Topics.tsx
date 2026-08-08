import { Link } from 'react-router-dom';
import { RotateCcw, Repeat, Timer } from 'lucide-react';
import { topics } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';
import { statsByTopic } from '../lib/stats';
import TopicCard from '../components/TopicCard';
import { examInfo } from '../data/examInfo';
import { questions } from '../data/questions';
import { formatDueIn, reviewSummary } from '../lib/spacedRepetition';
import { REVIEW_SESSION_LIMIT } from '../hooks/useQuiz';

export default function Topics() {
  const { progress } = useProgress();
  const stats = statsByTopic(progress);
  const ordered = [...topics].sort((a, b) => a.order - b.order);
  const now = Date.now();
  const sr = reviewSummary(progress, questions, now);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          to="/quiz/review"
          aria-disabled={sr.due === 0}
          className={`rounded-xl border p-4 transition ${
            sr.due > 0
              ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400'
              : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70'
          }`}
        >
          <div className="flex items-start gap-3">
            <Repeat className="w-5 h-5 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <h3 className="font-semibold">Review due</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {sr.due > 0 ? (
                  <>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{sr.due}</span>{' '}
                    question{sr.due === 1 ? '' : 's'} ready
                    {sr.due > REVIEW_SESSION_LIMIT ? ` · ${REVIEW_SESSION_LIMIT} per session` : ''}
                  </>
                ) : sr.nextDueAt !== null ? (
                  <>Nothing due &middot; next {formatDueIn(sr.nextDueAt, now)}</>
                ) : (
                  <>Answer some questions to start the schedule</>
                )}
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/quiz/missed"
          aria-disabled={sr.missed === 0}
          className={`rounded-xl border p-4 transition ${
            sr.missed > 0
              ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400'
              : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70'
          }`}
        >
          <div className="flex items-start gap-3">
            <RotateCcw className="w-5 h-5 mt-0.5 text-amber-600 dark:text-amber-400 flex-shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <h3 className="font-semibold">Redo missed</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {sr.missed > 0 ? (
                  <>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{sr.missed}</span>{' '}
                    still wrong on your last attempt
                  </>
                ) : (
                  <>Nothing outstanding</>
                )}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {(sr.mastered > 0 || sr.learning > 0) && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {sr.mastered} mastered &middot; {sr.learning} in progress &middot; {sr.unseen} not yet seen
          &middot; a question moves up a box each time you get it right, and back to the first box when you do not
        </p>
      )}

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
