import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  Check,
  CheckSquare,
  ChevronDown,
  CircleDot,
  Copy,
  Filter,
  HelpCircle,
  Info,
  ListChecks,
  PenLine,
  RotateCcw,
  ScrollText,
  ShieldCheck,
  Square,
} from 'lucide-react';
import {
  reviewItems,
  REVIEW_CATEGORY_LABELS,
  REVIEW_CATEGORY_NOTES,
  type ReviewCategory,
  type ReviewItem,
  type ReviewStatus,
} from '../data/reviewItems';
import { topics } from '../data/curriculum';
import { questions } from '../data/questions';

/**
 * The review queue.
 *
 * Every figure on this page is derived from src/data/reviewItems.ts, which is
 * also what REVIEW.md is generated from. Nothing about an item is written down
 * here, so the page and the document cannot drift apart, and adding an item to
 * the data file is the whole of adding it to this page.
 */

/* ------------------------------------------------------------------ */
/* Marks: which items the reviewer has worked through on this device   */
/* ------------------------------------------------------------------ */

/**
 * Deliberately its own localStorage key rather than a field on the progress
 * record. Progress is exported, imported and synced between devices; who has
 * checked which citation is a different job with a different lifetime, and
 * folding it in would put it in every progress file and every sync payload.
 */
const MARKS_KEY = 'series63_review_marks';
const MARKS_SCHEMA = 1 as const;

const STORAGE_ERROR =
  'This browser would not let the app save that. Check that site data is allowed for this page — until then, marks will not survive a reload.';

type Marks = Record<string, number>;

const ITEM_IDS = new Set(reviewItems.map((i) => i.id));

function loadMarks(): Marks {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(MARKS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as {
      schemaVersion?: number;
      marks?: Record<string, unknown>;
    };
    if (parsed.schemaVersion !== MARKS_SCHEMA || !parsed.marks) return {};
    // Drop marks for items that no longer exist. A renamed or retired id would
    // otherwise sit in storage forever and inflate the "N of M checked" count
    // past the number of items actually on the page.
    const out: Marks = {};
    Object.entries(parsed.marks).forEach(([id, ts]) => {
      if (ITEM_IDS.has(id) && typeof ts === 'number') out[id] = ts;
    });
    return out;
  } catch {
    return {};
  }
}

function saveMarks(marks: Marks): boolean {
  try {
    window.localStorage.setItem(
      MARKS_KEY,
      JSON.stringify({ schemaVersion: MARKS_SCHEMA, marks })
    );
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Derived data                                                        */
/* ------------------------------------------------------------------ */

const TOPIC_TITLES = new Map(topics.map((t) => [t.id, t.title]));

function chapterName(topicId: string): string {
  return TOPIC_TITLES.get(topicId) ?? topicId;
}

const QUESTIONS_BY_ID = new Map(questions.map((q) => [q.id, q]));

/** Category order comes from the labels record, so the data file sets it. */
const CATEGORY_ORDER = Object.keys(REVIEW_CATEGORY_LABELS) as ReviewCategory[];

function uniqueQuestionCount(items: ReviewItem[]): number {
  const seen = new Set<number>();
  items.forEach((i) => (i.questionIds ?? []).forEach((q) => seen.add(q)));
  return seen.size;
}

const TOTAL = reviewItems.length;
const OPEN_ITEMS = reviewItems.filter((i) => i.status === 'open');
const REVIEWED_ITEMS = reviewItems.filter((i) => i.status !== 'open');
const CONFIRMED_COUNT = reviewItems.filter((i) => i.status === 'confirmed').length;
const CORRECTED_COUNT = reviewItems.filter((i) => i.status === 'corrected').length;
const QUESTIONS_AFFECTED = uniqueQuestionCount(reviewItems);
const QUESTIONS_AFFECTED_OPEN = uniqueQuestionCount(OPEN_ITEMS);

const CATEGORY_COUNTS: Record<ReviewCategory, number> = CATEGORY_ORDER.reduce(
  (acc, c) => {
    acc[c] = reviewItems.filter((i) => i.category === c).length;
    return acc;
  },
  {} as Record<ReviewCategory, number>
);

/* ------------------------------------------------------------------ */
/* Presentation helpers                                                */
/* ------------------------------------------------------------------ */

interface StatusMeta {
  label: string;
  icon: typeof CircleDot;
  badge: string;
  /** Sentence shown under the badge, so the state is never colour alone. */
  meaning: string;
}

const STATUS_META: Record<ReviewStatus, StatusMeta> = {
  open: {
    label: 'Open',
    icon: CircleDot,
    badge:
      'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
    meaning: 'Not yet reviewed.',
  },
  confirmed: {
    label: 'Confirmed',
    icon: ShieldCheck,
    badge:
      'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200',
    meaning: 'Checked and left as written.',
  },
  corrected: {
    label: 'Corrected',
    icon: PenLine,
    badge: 'bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200',
    meaning: 'Checked and the content was changed.',
  },
};

type StatusFilter = 'all' | 'open' | 'reviewed';
type CategoryFilter = 'all' | ReviewCategory;

const STATUS_FILTERS: { id: StatusFilter; label: string; count: number }[] = [
  { id: 'open', label: 'Open', count: OPEN_ITEMS.length },
  { id: 'reviewed', label: 'Reviewed', count: REVIEWED_ITEMS.length },
  { id: 'all', label: 'All', count: TOTAL },
];

const CHOICE_LETTERS = ['A', 'B', 'C', 'D'] as const;

/** Short markdown block for pasting into an email or a commit message. */
function notesFor(item: ReviewItem): string {
  const lines: string[] = [
    '### ' + item.title,
    '',
    '- Chapter: ' + chapterName(item.topic) + ' (' + item.topic + ')',
    '- Category: ' + REVIEW_CATEGORY_LABELS[item.category],
    '- Status: ' + STATUS_META[item.status].label,
  ];
  if (item.questionIds && item.questionIds.length > 0) {
    lines.push('- Affected questions: ' + item.questionIds.join(', '));
  }
  lines.push(
    '',
    '**The app asserts:** ' + item.asserted,
    '',
    '**Why it was flagged:** ' + item.concern,
    '',
    '**To verify:** ' + item.verify
  );
  if (item.resolution) {
    lines.push('', '**Resolution so far:** ' + item.resolution);
  }
  lines.push('', '**Finding:** ');
  return lines.join('\n');
}

const chipBase =
  'inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium min-h-[44px] transition';
const chipOn =
  'border-blue-600 bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:border-blue-400 dark:text-blue-200';
const chipOff =
  'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400';

const secondaryButtonClass =
  'inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-blue-400 min-h-[44px]';

/* ------------------------------------------------------------------ */
/* Affected questions                                                  */
/* ------------------------------------------------------------------ */

function AffectedQuestions({ ids }: { ids: number[] }) {
  return (
    <details className="group mt-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
      <summary className="flex items-center gap-2 px-3 min-h-[44px] cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-200 list-none [&::-webkit-details-marker]:hidden">
        <ChevronDown
          className="w-4 h-4 flex-shrink-0 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
        <HelpCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span>
          {ids.length} affected question{ids.length === 1 ? '' : 's'}:{' '}
          <span className="font-mono font-normal">{ids.join(', ')}</span>
        </span>
      </summary>
      <ul className="px-3 pb-3 space-y-4">
        {ids.map((id) => {
          const q = QUESTIONS_BY_ID.get(id);
          if (!q) {
            return (
              <li
                key={id}
                className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2"
              >
                <Info
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>
                  Question {id} is not in the current bank. Either it was
                  renumbered or the item needs updating.
                </span>
              </li>
            );
          }
          return (
            <li
              key={id}
              className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Q{q.id}
                </span>
                <Link
                  to={'/quiz/topic/' + q.topic}
                  className="text-xs font-medium text-blue-700 dark:text-blue-300 underline underline-offset-2"
                >
                  {chapterName(q.topic)} quiz
                </Link>
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line">
                {q.q}
              </p>
              <ol className="mt-2 space-y-1">
                {q.choices.map((choice, idx) => {
                  const keyed = idx === q.answer;
                  return (
                    <li
                      key={idx}
                      className={
                        'flex items-start gap-2 text-sm rounded px-2 py-1 ' +
                        (keyed
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-medium'
                          : 'text-slate-600 dark:text-slate-400')
                      }
                    >
                      <span className="font-mono text-xs mt-0.5 flex-shrink-0">
                        {CHOICE_LETTERS[idx]}
                      </span>
                      <span className="flex-1">{choice}</span>
                      {keyed && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold flex-shrink-0">
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          Keyed
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Explanation:{' '}
                </span>
                {q.exp}
              </p>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Review() {
  const [marks, setMarks] = useState<Marks>(() => loadMarks());
  const [storageError, setStorageError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('open');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [hideMarked, setHideMarked] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyFailedId, setCopyFailedId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const copyTimer = useRef<number | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    };
  }, []);

  const markedCount = Object.keys(marks).length;

  function toggleMark(id: string) {
    const next: Marks = { ...marks };
    if (next[id]) delete next[id];
    else next[id] = Date.now();
    setMarks(next);
    setStorageError(saveMarks(next) ? null : STORAGE_ERROR);
  }

  function resetMarks() {
    setMarks({});
    setConfirmReset(false);
    setStorageError(saveMarks({}) ? null : STORAGE_ERROR);
  }

  async function copyNotes(item: ReviewItem) {
    try {
      await navigator.clipboard.writeText(notesFor(item));
      if (!mounted.current) return;
      setCopyFailedId(null);
      setCopiedId(item.id);
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => {
        if (mounted.current) setCopiedId(null);
      }, 2500);
    } catch {
      // Clipboard access can be refused outright. Everything the block would
      // have contained is already on the card, so say so rather than leaving a
      // dead button.
      if (!mounted.current) return;
      setCopiedId(null);
      setCopyFailedId(item.id);
    }
  }

  const visible = useMemo(() => {
    return reviewItems.filter((item) => {
      if (statusFilter === 'open' && item.status !== 'open') return false;
      if (statusFilter === 'reviewed' && item.status === 'open') return false;
      if (categoryFilter !== 'all' && item.category !== categoryFilter)
        return false;
      if (hideMarked && marks[item.id]) return false;
      return true;
    });
  }, [statusFilter, categoryFilter, hideMarked, marks]);

  const groups = useMemo(
    () =>
      CATEGORY_ORDER.map((category) => ({
        category,
        items: visible.filter((i) => i.category === category),
      })).filter((g) => g.items.length > 0),
    [visible]
  );

  const visibleQuestionCount = uniqueQuestionCount(visible);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* ---------------------------------------------------------- */}
      {/* Header                                                      */}
      {/* ---------------------------------------------------------- */}
      <header>
        <div className="flex items-center gap-2">
          <ScrollText
            className="w-6 h-6 text-blue-600 dark:text-blue-400"
            aria-hidden="true"
          />
          <h1 className="text-2xl font-bold">Flagged for review</h1>
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Every chapter and question in this app was written from public
          sources &mdash; the Uniform Securities Act model law, NASAA model
          rules and Statements of Policy, the Advisers Act and the rules under
          it &mdash; and the content is internally consistent. This is the
          other side of that ledger: {TOTAL} places where the writer or the
          auditor was not confident enough to state something flatly, collected
          so they can be checked in an hour or two instead of found by
          re-reading the curriculum. Signing them off is what moves the app
          from carefully researched to professionally verified.
        </p>
      </header>

      {/* ---------------------------------------------------------- */}
      {/* Summary                                                     */}
      {/* ---------------------------------------------------------- */}
      <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
        <div className="flex items-center gap-2 mb-3">
          <ListChecks
            className="w-5 h-5 text-blue-600 dark:text-blue-400"
            aria-hidden="true"
          />
          <h2 className="font-semibold text-lg">The queue</h2>
        </div>

        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Flagged
            </dt>
            <dd className="font-semibold text-lg">{TOTAL}</dd>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Open
            </dt>
            <dd className="font-semibold text-lg">{OPEN_ITEMS.length}</dd>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Reviewed
            </dt>
            <dd className="font-semibold text-lg">{REVIEWED_ITEMS.length}</dd>
            <dd className="text-xs text-slate-500 dark:text-slate-400">
              {CONFIRMED_COUNT} confirmed &middot; {CORRECTED_COUNT} corrected
            </dd>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Questions at stake
            </dt>
            <dd className="font-semibold text-lg">{QUESTIONS_AFFECTED}</dd>
            <dd className="text-xs text-slate-500 dark:text-slate-400">
              {QUESTIONS_AFFECTED_OPEN} tied to open items
            </dd>
          </div>
        </dl>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-sm font-medium">
              Worked through on this device
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
              {markedCount} of {TOTAL} marked
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden"
            role="progressbar"
            aria-valuenow={markedCount}
            aria-valuemin={0}
            aria-valuemax={TOTAL}
            aria-label="Items marked reviewed on this device"
          >
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: (TOTAL ? (markedCount / TOTAL) * 100 : 0) + '%' }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Marks are a bookmark, not a verdict. They stay in this browser,
            outside the progress record, so they are never exported or synced.
            The status on each card only changes when the data file does.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Why the question ids are there                              */}
      {/* ---------------------------------------------------------- */}
      <section className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-5">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle
            className="w-5 h-5 text-amber-700 dark:text-amber-300"
            aria-hidden="true"
          />
          <h2 className="font-semibold text-amber-900 dark:text-amber-200">
            Why each item lists its questions
          </h2>
        </div>
        <p className="text-sm text-amber-900 dark:text-amber-100/90">
          One error already got through: a chapter stated the oral-discretion
          grace period backwards, and the reversal propagated into a question
          that keyed the wrong answer and then taught the reversal in its
          explanation. A rule that turns out to be wrong is never wrong in one
          place, so every item carries the question ids built on it. Expand the
          list on a card to read those questions as a candidate sees them
          &mdash; stem, keyed answer and explanation &mdash; before deciding
          whether anything has to change.
        </p>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Filters                                                     */}
      {/* ---------------------------------------------------------- */}
      <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Filter
            className="w-5 h-5 text-blue-600 dark:text-blue-400"
            aria-hidden="true"
          />
          <h2 className="font-semibold text-lg">Filter</h2>
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by status"
        >
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              aria-pressed={statusFilter === f.id}
              className={
                chipBase + ' ' + (statusFilter === f.id ? chipOn : chipOff)
              }
            >
              {statusFilter === f.id && (
                <Check className="w-4 h-4" aria-hidden="true" />
              )}
              {f.label}
              <span className="text-xs opacity-70">({f.count})</span>
            </button>
          ))}
        </div>

        <div
          className="mt-3 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by category"
        >
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            aria-pressed={categoryFilter === 'all'}
            className={
              chipBase + ' ' + (categoryFilter === 'all' ? chipOn : chipOff)
            }
          >
            {categoryFilter === 'all' && (
              <Check className="w-4 h-4" aria-hidden="true" />
            )}
            Every category
            <span className="text-xs opacity-70">({TOTAL})</span>
          </button>
          {CATEGORY_ORDER.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategoryFilter(c)}
              aria-pressed={categoryFilter === c}
              className={
                chipBase + ' ' + (categoryFilter === c ? chipOn : chipOff)
              }
            >
              {categoryFilter === c && (
                <Check className="w-4 h-4" aria-hidden="true" />
              )}
              {REVIEW_CATEGORY_LABELS[c]}
              <span className="text-xs opacity-70">
                ({CATEGORY_COUNTS[c]})
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setHideMarked((v) => !v)}
          aria-pressed={hideMarked}
          className={
            'mt-3 ' + chipBase + ' ' + (hideMarked ? chipOn : chipOff)
          }
        >
          {hideMarked ? (
            <CheckSquare className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Square className="w-4 h-4" aria-hidden="true" />
          )}
          Hide what I have marked
        </button>

        <p
          className="mt-3 text-sm text-slate-600 dark:text-slate-400"
          role="status"
          aria-live="polite"
        >
          Showing {visible.length} of {TOTAL} items
          {visibleQuestionCount > 0 &&
            ', covering ' +
              visibleQuestionCount +
              ' question' +
              (visibleQuestionCount === 1 ? '' : 's') +
              '.'}
          {visibleQuestionCount === 0 && '.'}
        </p>
      </section>

      {storageError && (
        <p
          role="alert"
          className="flex items-start gap-2 text-sm rounded-lg px-3 py-2 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200"
        >
          <AlertCircle
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <span>{storageError}</span>
        </p>
      )}

      {/* ---------------------------------------------------------- */}
      {/* Items                                                       */}
      {/* ---------------------------------------------------------- */}
      {groups.length === 0 ? (
        <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-start gap-2">
            <Info
              className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-500 dark:text-slate-400"
              aria-hidden="true"
            />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Nothing matches this filter. Widen it above &mdash; or, if you
              have been marking as you go and hidden the marked items, you have
              cleared the queue.
            </p>
          </div>
        </section>
      ) : (
        groups.map((group) => (
          <section key={group.category} className="space-y-3">
            <div>
              <h2 className="font-semibold text-lg">
                {REVIEW_CATEGORY_LABELS[group.category]}{' '}
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                  ({group.items.length}
                  {group.items.length !== CATEGORY_COUNTS[group.category] &&
                    ' of ' + CATEGORY_COUNTS[group.category]}
                  )
                </span>
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {REVIEW_CATEGORY_NOTES[group.category]}
              </p>
            </div>

            {group.items.map((item) => {
              const meta = STATUS_META[item.status];
              const StatusIcon = meta.icon;
              const marked = Boolean(marks[item.id]);
              return (
                <article
                  key={item.id}
                  className={
                    'rounded-xl border p-5 ' +
                    (marked
                      ? 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900')
                  }
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={
                        'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ' +
                        meta.badge
                      }
                    >
                      <StatusIcon className="w-3 h-3" aria-hidden="true" />
                      {meta.label}
                    </span>
                    {marked && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <Check className="w-3 h-3" aria-hidden="true" />
                        Marked reviewed
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>{meta.meaning}</span>
                    <Link
                      to={'/curriculum/' + item.topic}
                      className="inline-flex items-center gap-1 font-medium text-blue-700 dark:text-blue-300 underline underline-offset-2"
                    >
                      <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                      {chapterName(item.topic)}
                    </Link>
                  </div>

                  <dl className="mt-3 space-y-3 text-sm">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        What the app asserts
                      </dt>
                      <dd className="mt-0.5 text-slate-800 dark:text-slate-200">
                        {item.asserted}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Why it was flagged
                      </dt>
                      <dd className="mt-0.5 text-slate-700 dark:text-slate-300">
                        {item.concern}
                      </dd>
                    </div>
                    <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 p-3">
                      <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-800 dark:text-blue-300">
                        <ListChecks
                          className="w-3.5 h-3.5"
                          aria-hidden="true"
                        />
                        To verify
                      </dt>
                      <dd className="mt-0.5 text-blue-900 dark:text-blue-100">
                        {item.verify}
                      </dd>
                    </div>
                    {item.resolution && (
                      <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 p-3">
                        <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          Resolution
                        </dt>
                        <dd className="mt-0.5 text-emerald-900 dark:text-emerald-100">
                          {item.resolution}
                        </dd>
                      </div>
                    )}
                  </dl>

                  {item.questionIds && item.questionIds.length > 0 ? (
                    <AffectedQuestions ids={item.questionIds} />
                  ) : (
                    <p className="mt-3 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Info
                        className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>
                        No question is keyed to this one &mdash; a change here
                        affects the chapter text only.
                      </span>
                    </p>
                  )}

                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => toggleMark(item.id)}
                      aria-pressed={marked}
                      className={
                        'flex-1 ' +
                        (marked
                          ? 'inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold border border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 min-h-[44px]'
                          : secondaryButtonClass)
                      }
                    >
                      {marked ? (
                        <CheckSquare className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Square className="w-4 h-4" aria-hidden="true" />
                      )}
                      {marked ? 'Reviewed' : 'Mark reviewed'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void copyNotes(item)}
                      className={'flex-1 ' + secondaryButtonClass}
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Copy className="w-4 h-4" aria-hidden="true" />
                      )}
                      {copiedId === item.id ? 'Copied' : 'Copy notes'}
                    </button>
                  </div>

                  {copyFailedId === item.id && (
                    <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <Info
                        className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>
                        This browser blocked the copy. Everything the block
                        would have held is on this card &mdash; select it by
                        hand.
                      </span>
                    </p>
                  )}
                </article>
              );
            })}
          </section>
        ))
      )}

      {/* ---------------------------------------------------------- */}
      {/* Reset                                                       */}
      {/* ---------------------------------------------------------- */}
      <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="font-semibold mb-2">Reset review marks</h2>
        {!confirmReset ? (
          <>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Clears the {markedCount} mark{markedCount === 1 ? '' : 's'} on
              this device and starts the pass again. It touches nothing else
              &mdash; not the items, not your study progress.
            </p>
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              disabled={markedCount === 0}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-white dark:bg-slate-900 border border-red-300 dark:border-red-900 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              Reset review marks
            </button>
          </>
        ) : (
          <>
            <p className="flex items-start gap-2 text-sm rounded-lg px-3 py-2 mb-3 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200">
              <AlertCircle
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>
                This forgets which {markedCount} item
                {markedCount === 1 ? '' : 's'} you had already worked through.
                There is no undo.
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={resetMarks}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                Yes, clear the marks
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className={secondaryButtonClass}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </section>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        This page and REVIEW.md are both generated from{' '}
        <span className="font-mono">src/data/reviewItems.ts</span>. Record a
        finding by editing that file &mdash; set the status, write the
        resolution, and check the question ids listed against it.
      </p>
    </div>
  );
}
