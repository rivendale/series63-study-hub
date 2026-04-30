import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronRight, Clock, RotateCcw } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import { useQuiz, type QuizMode } from '../hooks/useQuiz';
import { useProgress } from '../hooks/useProgress';
import { topics } from '../data/curriculum';
import { questions } from '../data/questions';
import { examInfo } from '../data/examInfo';

interface Props {
  mode: QuizMode;
}

export default function Quiz({ mode }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recordAnswer, recordMockAttempt } = useProgress();
  const topic = mode === 'topic' ? topics.find((t) => t.id === id) : undefined;

  const quiz = useQuiz({ mode, topicId: id });

  const [startedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const totalMs = examInfo.timeMinutes * 60 * 1000;
  const remaining = mode === 'mock' ? Math.max(0, totalMs - (now - startedAt)) : 0;

  useEffect(() => {
    if (mode !== 'mock' || quiz.finished) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [mode, quiz.finished]);

  useEffect(() => {
    if (mode === 'mock' && remaining === 0 && !quiz.finished) {
      quiz.finishNow();
    }
  }, [mode, remaining, quiz]);

  useEffect(() => {
    const last = quiz.answers[quiz.answers.length - 1];
    if (last) {
      recordAnswer(last.qid, last.selected, last.correct);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz.answers.length]);

  useEffect(() => {
    if (quiz.finished && mode === 'mock' && quiz.answers.length > 0) {
      const correct = quiz.answers.filter((a) => a.correct).length;
      const total = quiz.items.length;
      recordMockAttempt({
        ts: Date.now(),
        correct,
        total,
        pct: Math.round((correct / total) * 100),
        timeUsed: Date.now() - startedAt,
        answers: quiz.answers,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz.finished]);

  if (mode === 'topic' && !topic) {
    return (
      <div className="text-center py-10">
        <p>Topic not found.</p>
        <Link to="/topics" className="text-blue-600 underline mt-2 inline-block">Back to topics</Link>
      </div>
    );
  }

  if (quiz.items.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-600 dark:text-slate-400">No questions available for this topic yet.</p>
        <Link to="/topics" className="text-blue-600 underline mt-2 inline-block">Back to topics</Link>
      </div>
    );
  }

  if (quiz.finished) {
    const pct = Math.round((quiz.correctCount / quiz.items.length) * 100);
    const passed = mode === 'mock' && pct >= examInfo.passPercentage;
    const wrong = quiz.answers
      .map((a) => ({ a, q: questions.find((q) => q.id === a.qid)! }))
      .filter((x) => !x.a.correct);

    return (
      <div className="max-w-2xl mx-auto space-y-5 py-2">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            {mode === 'mock' ? 'Mock exam complete' : `${topic?.title}`}
          </p>
          <div className="mt-2 text-5xl font-bold">{pct}%</div>
          <p className="mt-1 text-slate-600 dark:text-slate-400">{quiz.correctCount} correct of {quiz.items.length}</p>
          {mode === 'mock' && (
            <span className={`mt-3 inline-block text-sm font-semibold px-3 py-1 rounded-full ${
              passed
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
            }`}>
              {passed ? `Pass (${examInfo.passPercentage}%+)` : `Below pass (${examInfo.passPercentage}%)`}
            </span>
          )}
          <ProgressBar
            value={pct}
            color={pct >= 80 ? 'emerald' : pct >= 60 ? 'blue' : pct >= 40 ? 'amber' : 'red'}
            className="mt-4"
          />
        </div>

        {wrong.length > 0 && (
          <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="font-semibold mb-3">Review incorrect answers</h2>
            <ol className="space-y-4">
              {wrong.map(({ q, a }) => (
                <li key={q.id} className="border-t border-slate-100 dark:border-slate-800 pt-3 first:border-0 first:pt-0">
                  <p className="font-medium">{q.q}</p>
                  <p className="text-sm mt-1 text-red-700 dark:text-red-300">Your answer: {q.choices[a.selected]}</p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">Correct: {q.choices[q.answer]}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{q.exp}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button type="button" onClick={() => navigate(0)} className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 min-h-[44px]">
            <RotateCcw className="w-4 h-4" />
            Retake
          </button>
          <Link to="/topics" className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 min-h-[44px]">
            More quizzes
          </Link>
        </div>
      </div>
    );
  }

  const current = quiz.current;
  const progressPct = ((quiz.index + (quiz.submitted ? 1 : 0)) / quiz.items.length) * 100;

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const timeWarning = mode === 'mock' && remaining < 5 * 60 * 1000;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <Link to={mode === 'topic' ? '/topics' : '/'} className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600">
          <ArrowLeft className="w-4 h-4" />
          {mode === 'topic' ? 'Topics' : 'Home'}
        </Link>
        {mode === 'mock' && (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
              timeWarning
                ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
            aria-live="polite"
          >
            <Clock className="w-4 h-4" />
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        )}
      </div>

      <ProgressBar value={progressPct} />

      <QuestionCard
        question={current}
        index={quiz.index}
        total={quiz.items.length}
        selected={quiz.selected}
        submitted={quiz.submitted}
        showFeedback={mode === 'topic'}
        onSelect={quiz.select}
      />

      <div className="flex justify-end">
        {mode === 'topic' ? (
          quiz.submitted ? (
            <button type="button" onClick={quiz.next} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 min-h-[44px]">
              {quiz.index >= quiz.items.length - 1 ? 'See score' : 'Next question'}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" onClick={quiz.submit} disabled={quiz.selected === null} className="px-5 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed min-h-[44px]">
              Submit
            </button>
          )
        ) : (
          <button type="button" onClick={quiz.recordAndAdvanceMock} disabled={quiz.selected === null} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed min-h-[44px]">
            {quiz.index >= quiz.items.length - 1 ? 'Finish exam' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
