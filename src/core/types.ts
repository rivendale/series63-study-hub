/**
 * Structural types for the shared core.
 *
 * These deliberately describe the SHAPE a host app must provide rather than
 * importing the app's own types. That inversion is the whole point: core cannot
 * import from `src/data` or `src/hooks` without becoming exam-specific, and any
 * module in here that does has left the boundary.
 *
 * Both study hubs' real `Question` and `Progress` types are structurally
 * compatible with these, so no casting is needed at the call site.
 */

/** The minimum a question must expose for core scheduling and selection. */
export interface QuestionLike {
  id: number;
  topic: string;
}

/**
 * One recorded answer.
 *
 * `box` and `due` drive spaced repetition and are optional because they were
 * added after the storage schema was already in the field — see the schema note
 * in each app's CLAUDE.md. A record without them is treated as due.
 */
export interface AnswerRecord {
  correct: boolean;
  ts: number;
  selected?: number;
  box?: number;
  due?: number;
}

/** The minimum a progress record must expose for core to read it. */
export interface ProgressLike {
  answers: Record<number, AnswerRecord>;
}

/** One official exam category, with the weight that drives mock sampling. */
export interface CategoryLike {
  id: string;
  name: string;
  /** Scored questions this category contributes to the real exam. */
  questions: number;
  /** Share of the scored exam, as a percentage. */
  pct: number;
}
