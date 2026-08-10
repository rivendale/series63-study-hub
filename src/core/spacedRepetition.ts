import type { AnswerRecord, ProgressLike, QuestionLike } from './types';

/**
 * A deliberately small Leitner scheduler.
 *
 * The goal is not to model memory accurately — it is to stop a student
 * re-drilling what they already know while questions they got wrong quietly
 * never come back. Five boxes, a fixed ladder of intervals, and one rule for
 * moving between them is enough to do that, and it is simple enough that the
 * student can predict what the app will show them next.
 *
 * State lives inside the existing per-answer record as two OPTIONAL fields, so
 * a progress file written before this feature existed still parses. That is
 * deliberate: bumping the schema version would send every existing record
 * through the unreadable-record quarantine path, which is correct behaviour for
 * a genuinely incompatible change and badly wrong for an additive one.
 */

/** Days until a question in each box comes back. Index 0 is unused. */
export const BOX_INTERVALS_DAYS = [0, 1, 3, 7, 16, 35] as const;

export const MAX_BOX = 5;

const DAY_MS = 24 * 60 * 60 * 1000;

export interface ReviewState {
  /** 1..5. Higher means answered correctly more times in a row. */
  box: number;
  /** Epoch ms at which the question becomes due again. */
  due: number;
}

/**
 * Where a question goes after being answered.
 *
 * Correct promotes one box; wrong drops straight back to box 1 rather than
 * demoting by one. A question you just got wrong is not "slightly less known"
 * than it was — the evidence says you do not know it, so it re-enters at the
 * bottom of the ladder.
 */
export function scheduleNext(
  previousBox: number | undefined,
  correct: boolean,
  now: number
): ReviewState {
  const prev = previousBox ?? 0;
  const box = correct ? Math.min(prev + 1, MAX_BOX) : 1;
  return { box, due: now + BOX_INTERVALS_DAYS[box] * DAY_MS };
}

export function isDue(a: AnswerRecord | undefined, now: number): boolean {
  if (!a) return false;
  // A record written before this feature has no due date. Treat it as due, so
  // existing history flows into the queue instead of being stranded.
  if (a.due === undefined) return true;
  return a.due <= now;
}

/** Questions whose most recent answer was wrong, hardest-hit first. */
export function selectMissed<T extends QuestionLike>(progress: ProgressLike, pool: T[]): T[] {
  return pool
    .filter((q) => progress.answers[q.id]?.correct === false)
    .sort((a, b) => (progress.answers[a.id]?.ts ?? 0) - (progress.answers[b.id]?.ts ?? 0));
}

/** Questions that have come due, most overdue first. */
export function selectDue<T extends QuestionLike>(
  progress: ProgressLike,
  pool: T[],
  now: number
): T[] {
  return pool
    .filter((q) => isDue(progress.answers[q.id], now))
    .sort((a, b) => {
      const da = progress.answers[a.id]?.due ?? 0;
      const db = progress.answers[b.id]?.due ?? 0;
      return da - db;
    });
}

export interface ReviewSummary {
  /** Answered, most recent attempt wrong. */
  missed: number;
  /** Due for review right now (includes everything in `missed` that is due). */
  due: number;
  /** Seen, scheduled, not yet at the top box. */
  learning: number;
  /** Reached the top box. */
  mastered: number;
  /** Never answered. */
  unseen: number;
  /** When the next question comes due, or null if none is scheduled ahead. */
  nextDueAt: number | null;
}

export function reviewSummary(
  progress: ProgressLike,
  pool: QuestionLike[],
  now: number
): ReviewSummary {
  let missed = 0;
  let due = 0;
  let learning = 0;
  let mastered = 0;
  let unseen = 0;
  let nextDueAt: number | null = null;

  for (const q of pool) {
    const a = progress.answers[q.id];
    if (!a) {
      unseen++;
      continue;
    }
    if (a.correct === false) missed++;
    if (isDue(a, now)) {
      due++;
    } else if (a.due !== undefined && (nextDueAt === null || a.due < nextDueAt)) {
      nextDueAt = a.due;
    }
    if ((a.box ?? 0) >= MAX_BOX) mastered++;
    else learning++;
  }

  return { missed, due, learning, mastered, unseen, nextDueAt };
}

/** "in 3 days", "tomorrow", "in 4 hours" — for telling the student when to come back. */
export function formatDueIn(due: number, now: number): string {
  const ms = due - now;
  if (ms <= 0) return 'now';
  const hours = Math.round(ms / (60 * 60 * 1000));
  if (hours < 1) return 'in under an hour';
  if (hours < 24) return `in ${hours} hour${hours === 1 ? '' : 's'}`;
  const days = Math.round(ms / DAY_MS);
  if (days === 1) return 'tomorrow';
  return `in ${days} days`;
}
