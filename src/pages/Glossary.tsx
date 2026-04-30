import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { topics } from '../data/curriculum';

interface Entry {
  term: string;
  definition: string;
  topicId: string;
  topicTitle: string;
}

export default function Glossary() {
  const [query, setQuery] = useState('');

  const entries = useMemo<Entry[]>(() => {
    const all: Entry[] = [];
    for (const t of topics) {
      for (const kt of t.keyTerms) {
        all.push({
          term: kt.term,
          definition: kt.definition,
          topicId: t.id,
          topicTitle: t.title,
        });
      }
    }
    return all.sort((a, b) =>
      a.term.toLowerCase().localeCompare(b.term.toLowerCase())
    );
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.term.toLowerCase().includes(q) ||
        e.definition.toLowerCase().includes(q)
    );
  }, [entries, query]);

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold">Glossary</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {entries.length} key terms across {topics.length} topics. Search across terms and
          definitions.
        </p>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms or definitions..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 min-h-[44px]"
          aria-label="Search glossary"
        />
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Showing {filtered.length} of {entries.length}
      </p>

      <ul className="space-y-3">
        {filtered.map((e, i) => (
          <li
            key={`${e.topicId}-${i}`}
            className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4"
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                {e.term}
              </h2>
              <Link
                to={`/curriculum/${e.topicId}`}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                {e.topicTitle}
              </Link>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {e.definition}
            </p>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-center py-10 text-slate-500 dark:text-slate-400">
            No matches for &ldquo;{query}&rdquo;.
          </li>
        )}
      </ul>
    </div>
  );
}
