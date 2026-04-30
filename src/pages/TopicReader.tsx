import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, BookmarkCheck, Brain, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { topics } from '../data/curriculum';
import { useProgress } from '../hooks/useProgress';
import { useEffect, useState } from 'react';

export default function TopicReader() {
  const { id } = useParams<{ id: string }>();
  const topic = topics.find((t) => t.id === id);
  const { progress, markTopicRead } = useProgress();
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const handler = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      setScrollPct(max > 0 ? Math.min(100, (scrolled / max) * 100) : 0);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [id]);

  if (!topic) return <Navigate to="/curriculum" replace />;

  const isRead = Boolean(progress.topicsRead[topic.id]);

  return (
    <article className="max-w-3xl mx-auto">
      <div className="sticky top-0 -mx-4 md:-mx-6 px-4 md:px-6 py-3 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur z-20 border-b border-slate-200 dark:border-slate-800">
        <Link
          to="/curriculum"
          className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Curriculum
        </Link>
        <div className="mt-2 h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${scrollPct}%` }}
          />
        </div>
      </div>

      <header className="mt-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {topic.weight}
          </span>
          <span className="text-slate-400">&middot;</span>
          <span className="text-slate-600 dark:text-slate-400">
            Topic {topic.order} of {topics.length}
          </span>
        </div>
        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">
          {topic.title}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{topic.summary}</p>
      </header>

      <div className="mt-6 prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-h2:mt-8 prose-h2:mb-3 prose-h3:mt-6 prose-h3:mb-2 prose-p:leading-relaxed prose-table:text-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{topic.body}</ReactMarkdown>
      </div>

      {topic.pitfalls.length > 0 && (
        <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30 p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-5 h-5" />
            Common pitfalls
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-amber-900 dark:text-amber-100/90">
            {topic.pitfalls.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden="true">&bull;</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {topic.keyTerms.length > 0 && (
        <section className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h2 className="text-lg font-semibold">Key terms</h2>
          <dl className="mt-3 space-y-3">
            {topic.keyTerms.map((kt, i) => (
              <div key={i}>
                <dt className="font-semibold text-slate-900 dark:text-slate-100">
                  {kt.term}
                </dt>
                <dd className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  {kt.definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => markTopicRead(topic.id)}
          className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition min-h-[44px] ${
            isRead
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200'
          }`}
        >
          <BookmarkCheck className="w-5 h-5" />
          {isRead ? 'Marked as read' : 'Mark as read'}
        </button>
        <Link
          to={`/quiz/topic/${topic.id}`}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition min-h-[44px]"
        >
          <Brain className="w-5 h-5" />
          Quiz this topic
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
