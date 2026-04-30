import { Link } from 'react-router-dom';
import { BookOpen, Brain, Timer, BarChart3 } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { overallStats } from '../lib/stats';
import { topics } from '../data/curriculum';
import { questions } from '../data/questions';
import { examInfo } from '../data/examInfo';
import ProgressBar from '../components/ProgressBar';

export default function Home() {
  const { progress } = useProgress();
  const overall = overallStats(progress);
  const topicsReadCount = Object.keys(progress.topicsRead).length;
  const lastMock = progress.mockAttempts[0];

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 sm:p-6 shadow-sm">
        <p className="text-sm font-medium text-white/80">Welcome back</p>
        <h1 className="text-2xl sm:text-3xl font-bold mt-1">Series 63 Study Hub</h1>
        <p className="mt-2 text-sm text-white/90 max-w-prose">
          Read the curriculum, drill topic quizzes, and take a {examInfo.timeMinutes}-minute mock when
          you&rsquo;re ready. Pass mark is {examInfo.passPercentage}%.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white/10 p-3">
            <div className="text-xs uppercase tracking-wide text-white/70">Answered</div>
            <div className="text-xl font-semibold mt-0.5">{overall.answered}</div>
          </div>
          <div className="rounded-xl bg-white/10 p-3">
            <div className="text-xs uppercase tracking-wide text-white/70">Accuracy</div>
            <div className="text-xl font-semibold mt-0.5">{overall.pct}%</div>
          </div>
          <div className="rounded-xl bg-white/10 p-3">
            <div className="text-xs uppercase tracking-wide text-white/70">Topics read</div>
            <div className="text-xl font-semibold mt-0.5">
              {topicsReadCount}/{topics.length}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link to="/curriculum" className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:border-blue-400 transition">
          <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="mt-3 font-semibold">Read curriculum</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            13 topics covering the full Series 63 outline.
          </p>
        </Link>

        <Link to="/topics" className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:border-blue-400 transition">
          <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="mt-3 font-semibold">Topic quiz</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Drill {questions.length} questions with immediate feedback.
          </p>
        </Link>

        <Link to="/quiz/mock" className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:border-blue-400 transition">
          <Timer className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="mt-3 font-semibold">Mock exam</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {examInfo.totalQuestions} questions, {examInfo.timeMinutes} minutes, full review at the end.
          </p>
        </Link>

        <Link to="/progress" className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:border-blue-400 transition">
          <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="mt-3 font-semibold">Progress</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            By-topic stats and mock history.
          </p>
        </Link>
      </section>

      {lastMock && (
        <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Last mock exam</h2>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                lastMock.pct >= examInfo.passPercentage
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
              }`}
            >
              {lastMock.pct >= examInfo.passPercentage ? 'Pass' : 'Below pass'}
            </span>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {lastMock.correct}/{lastMock.total} correct &middot; {lastMock.pct}% &middot;{' '}
            {Math.round(lastMock.timeUsed / 60000)} min used
          </div>
          <ProgressBar
            value={lastMock.pct}
            color={lastMock.pct >= examInfo.passPercentage ? 'emerald' : 'amber'}
            className="mt-3"
          />
        </section>
      )}
    </div>
  );
}
