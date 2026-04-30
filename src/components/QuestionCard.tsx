import { Check, X } from 'lucide-react';
import type { Question } from '../data/questions';
import { topics } from '../data/curriculum';

interface Props {
  question: Question;
  index: number;
  total: number;
  selected: number | null;
  submitted: boolean;
  showFeedback: boolean;
  onSelect: (i: number) => void;
}

export default function QuestionCard({
  question,
  index,
  total,
  selected,
  submitted,
  showFeedback,
  onSelect,
}: Props) {
  const topic = topics.find((t) => t.id === question.topic);
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
          {topic?.title ?? question.topic}
        </span>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {index + 1} of {total}
        </span>
      </div>

      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-snug">
        {question.q}
      </h2>

      <div className="mt-4 space-y-2" role="radiogroup" aria-label="Answer choices">
        {question.choices.map((choice, i) => {
          const isSelected = selected === i;
          const isCorrect = i === question.answer;
          const showCorrect = showFeedback && submitted && isCorrect;
          const showWrong = showFeedback && submitted && isSelected && !isCorrect;

          let classes =
            'w-full text-left p-3 sm:p-4 rounded-lg border transition flex items-start gap-3 min-h-[56px]';
          if (showCorrect) {
            classes += ' border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
          } else if (showWrong) {
            classes += ' border-red-500 bg-red-50 dark:bg-red-950/40';
          } else if (isSelected) {
            classes += ' border-blue-600 bg-blue-50 dark:bg-blue-950/40 ring-2 ring-blue-600/20';
          } else {
            classes += ' border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700';
          }

          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={submitted && showFeedback}
              onClick={() => onSelect(i)}
              className={classes}
            >
              <span
                className={`flex items-center justify-center w-7 h-7 rounded-full border text-sm font-semibold flex-shrink-0 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300'
                }`}
                aria-hidden="true"
              >
                {letters[i]}
              </span>
              <span className="flex-1 text-slate-800 dark:text-slate-200">
                {choice}
              </span>
              {showCorrect && (
                <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              )}
              {showWrong && (
                <X className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {showFeedback && submitted && (
        <div
          className={`mt-4 rounded-lg p-3 text-sm ${
            selected === question.answer
              ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
              : 'bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200'
          }`}
          role="status"
          aria-live="polite"
        >
          <p className="font-semibold mb-1">
            {selected === question.answer ? 'Correct' : 'Incorrect'}
          </p>
          <p className="leading-relaxed">{question.exp}</p>
        </div>
      )}
    </div>
  );
}
