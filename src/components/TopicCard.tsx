import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import type { Topic } from '../data/curriculum';
import ProgressBar from './ProgressBar';

interface Props {
  topic: Topic;
  to: string;
  read?: boolean;
  pct?: number;
  answered?: number;
  total?: number;
}

export default function TopicCard({
  topic,
  to,
  read,
  pct,
  answered,
  total,
}: Props) {
  return (
    <Link
      to={to}
      className="block rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 hover:border-blue-400 hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {topic.weight}
            </span>
            {read && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Read
              </span>
            )}
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            {topic.title}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {topic.summary}
          </p>
          {typeof pct === 'number' && typeof total === 'number' && total > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>
                  {answered ?? 0}/{total} answered
                </span>
                <span>{pct}%</span>
              </div>
              <ProgressBar
                value={pct}
                color={pct >= 80 ? 'emerald' : pct >= 60 ? 'blue' : pct >= 40 ? 'amber' : 'red'}
              />
            </div>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
      </div>
    </Link>
  );
}
