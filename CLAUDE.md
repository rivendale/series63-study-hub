# CLAUDE.md

Project-specific guidance for Claude Code (and other AI coding assistants) working on this repository.

## What this project is

A static, client-side React + TypeScript PWA that serves as a study companion for the **Series 63** (Uniform Securities Agent State Law) exam. Deployed to GitHub Pages at `https://rivendale.github.io/series63-study-hub/`. No backend, no API keys, no database. Progress persists in `localStorage`.

## Critical project facts

- **Exam structure (2026, NASAA):** 65 total questions = 60 scored + 5 unscored pretest, randomly distributed; 75 minutes; pass = 43 of 60 (72%). Use `examInfo.ts` constants — never hard-code these.
- **NASAA category blueprint** (used by mock-exam sampling): BD/Agents 28 (47%), Remedies/Admin 21 (35%), Securities/Issuers 6 (10%), Investment Advisers/IARs 5 (8%). Defined in `src/data/categories.ts` (`OFFICIAL_CATEGORIES`, `TOPIC_TO_CATEGORY`).
- **Curriculum** lives in `src/data/topics/<id>.ts` (one file per topic, 14 total). The index `src/data/curriculum.ts` imports and concatenates them.
- **Questions** live in `src/data/questions/<id>.ts` (one file per topic, 14 total; **272 questions**). The index `src/data/questions.ts` imports and concatenates them.
- **Theme:** Tailwind, mobile-first, dark mode via `class` strategy, 44×44 px minimum tap targets.
- **Routing:** HashRouter (required for GitHub Pages SPA without 404 config).
- **Study modes:** topic drill, redo-missed (`/quiz/missed`), spaced-repetition review (`/quiz/review`), and the blueprint-weighted mock (`/quiz/mock`). All but the mock give immediate feedback.
- **Scripts:** `npm run review:md` regenerates `REVIEW.md` and the README counts; `npm run rebalance:answers` flattens the answer-key distribution (`--dry` to preview).

## Repository conventions

### Adding curriculum content

Each topic file exports a single `topic: Topic`. The `Topic` interface lives in `src/data/curriculum.ts`. Body text uses TypeScript template literals (backticks) and is rendered via `react-markdown` + `remark-gfm`.

When editing topic files:
- Apostrophes inside single-quoted strings need an escape: write `it's` as `"it's"` (use double quotes) or as `'it\\'s'` (escape — but this is error-prone). Prefer **double quotes** for strings that contain apostrophes.
- Em-dashes (—) and section signs (§) are fine as literal Unicode.
- Topic-id strings must match between curriculum and `TOPIC_TO_CATEGORY` in `categories.ts`.

### Adding questions

Each question module exports `items: Question[]`. The `Question` interface lives in `src/data/questions.ts`. Schema:

```typescript
{
  id: number,
  topic: string,                     // must match a curriculum topic id
  q: string,
  choices: [string, string, string, string],
  answer: 0 | 1 | 2 | 3,              // index of correct choice
  exp: string,                        // 1–3 sentence explanation
  difficulty?: 'easy' | 'medium' | 'hard',
}
```

Mix: ~25% easy / 60% medium / 15% hard. Include realistic distractors (common misconceptions). For roman-numeral compound questions, embed `\n\n` and `\nI.` etc. inside the `q` string.

**Never copy questions from commercial prep providers (Kaplan, STC, Solomon, etc.) or actual exam content.** All questions must be original, written from publicly available USA model law and NASAA Statements of Policy.

Typographic apostrophes (`’`, U+2019) are safe inside single-quoted TS strings and read better than the escaped ASCII form. Use them.

#### Answer-key balance is a correctness property, not cosmetics

Run `npm run rebalance:answers` after any sizeable batch. The bank was once **63% index 1**, which meant a student could beat chance by always picking the second choice — a habit the real exam punishes, and one that makes practice scores meaningless. The target is ~25% per position; `--dry` previews without writing.

The script rotates choice order and moves the answer index with it, so no text changes. It **skips** questions whose order carries meaning and reports why: numeric choice sets (exams list figures ascending), roman-numeral groupings, self-referential choices, and explanations that name a position ("the first distractor"). If you add a question whose choices must stay in a given order, make sure it trips one of those guards — or the rebalancer will happily scramble it.

### Why per-topic files instead of monolithic data files?

The original spec called for one big `curriculum.ts` and one big `questions.ts`. We refactored to per-topic modules because:

1. Each file stays small (~3–6 KB), which is critical when pushing through proxies that fail on large blobs.
2. Contributors can add a topic or a batch of questions in isolation without merge conflicts.
3. Tree-shaking still works (Vite inlines the imports at build time).

If you add a new topic, create both `src/data/topics/<id>.ts` and `src/data/questions/<id>.ts`, then update the imports in `src/data/curriculum.ts`, `src/data/questions.ts`, and `src/data/categories.ts` (`TOPIC_TO_CATEGORY`).

### Pushing to GitHub

**Plain `git push` works from this clone.** Earlier sessions used the `mcp__github__push_files` MCP tool because SSH had no binary and HTTPS had no credentials; that is no longer the constraint, and ordinary git is preferable.

**Start every session with `git fetch && git reset --hard origin/main`.** MCP `push_files` commits server-side *without moving the local ref*, so any work done that way in the past left this clone silently behind `main`. On one occasion the remote held the better version of a file while local was stale, and pushing local would have reverted it. Diff against origin before committing rather than assuming the working tree is current.

Don't commit `package-lock.json` (it's 360 KB and churns on every dependabot bump). The deploy workflow uses `npm install`, not `npm ci`, so a lockfile isn't required.

The CI deploy workflow (`.github/workflows/deploy.yml`) uses `actions/setup-node@v4` **without** `cache: npm` — adding `cache: npm` will fail because there is no lockfile.

### Branch strategy

Develop on `claude/series63-study-hub-MHtTX`, push to `main` for the live site. The deploy workflow runs on every push to `main` and publishes `dist/` to GitHub Pages.

### The content review manifest

`src/data/reviewItems.ts` is the single source of truth for every passage flagged for professional review. Both the in-app `/review` page and `REVIEW.md` render from it, so they cannot drift apart. Regenerate the markdown with `npm run review:md`, which also refreshes the counts between the `review-counts` markers in `README.md`.

An item is `open`, `confirmed` or `corrected`. **Open means uncertain, not wrong; corrected means it *was* wrong and has been fixed.** The `resolution` field records what changed and why — keep writing it, because the next person to reopen a question deserves to know what was already decided.

`questionIds` is the field that earns the file its keep. When a rule changes, the chapter fix is the easy half; every question written from that rule has to change too. **A chapter fix that leaves the questions alone is worse than no fix, because the app then contradicts itself and the student cannot tell which half is right.** Validate the ids exist before trusting them — one entry once pointed at a question in the right chapter about an entirely different rule, and a topic-match check passed it.

### Finding content errors: compare across files, not within them

Every content error found in this repo was invisible to reading a file. The disqualification rule was stated backwards, the 15-day hearing clock ran the wrong way, the DPOA requirement was an unscoped absolute, and the private-placement limit counted buyers instead of offerees — and **every file involved was internally coherent.**

The method that works: extract every assertion touching a given rule across all topics, all questions and the cheat sheet, then read them side by side. Contradictions live *between* files. A per-file review will not find them.

When you do correct a rule, fix the chapter body, the `pitfalls`, the `keyTerms`, every question in `questionIds`, and the cheat sheet in the same pass. A half-applied correction leaves the app disagreeing with itself two lines apart, which happened here more than once.

### Progress schema and spaced repetition

`useProgress` persists to `localStorage` under `series63_progress` at `SCHEMA_VERSION = 1`. A record whose version does not match is **quarantined**, not overwritten — `load()` sets it aside under `series63_progress_unreadable` and the Progress page offers to download it. That path exists because the original code returned defaults on a version mismatch and the next save destroyed the original: opening the app was enough to lose a study history.

**This makes schema changes consequential.** Adding spaced repetition needed two new per-answer fields, and they were added as **optional** (`box?`, `due?`) precisely so the version did not have to move. Bumping to 2 would have sent every existing progress file through the quarantine path — correct for a genuinely incompatible change, badly wrong for an additive one, and the user would have opened the app to a recovery banner and an apparently empty history.

Rule of thumb: **additive → optional fields, no bump. Incompatible → bump, and write the migration before you do.**

`src/lib/spacedRepetition.ts` holds the scheduler: five Leitner boxes at 1 / 3 / 7 / 16 / 35 days, correct promotes one box, wrong drops straight to box 1. Records without a `due` are treated as due, so pre-feature history flows into the queue instead of being stranded. Quiz sets are built from `getProgress()` — a deliberately **non-reactive** read — and frozen at mount, because a reactive read rebuilds the queue as answers are recorded and drops the question being worked on.

### Verify by execution, not by reading

The scheduler, the category weighting and the answer-key rotation were each checked by running them against fixtures rather than by inspection. That caught a real bug the code review missed: the first rotation pass scrambled an ascending money list because the numeric guard only matched bare numerals. The script reported success both times — only looking at the output revealed it.

Pure logic in `src/lib/` is cheap to test this way: transpile with `esbuild`, import, assert. Worth doing for anything where a wrong answer looks plausible.

## Common gotchas

- **Vite version pin:** stay on Vite **^7.x**. `vite-plugin-pwa` (currently 1.x) does not yet support Vite 8. Dependabot may try to bump to v8 — reject that PR or revert.
- **PWA icons:** `public/icon.svg` is committed; PNG icons (`icon-192.png`, `icon-512.png`, `favicon.ico`) are generated at build time by `scripts/generate-icons.mjs` and are gitignored. Don't try to commit binary PNGs through MCP `push_files` — it expects UTF-8 string content.
- **Base path:** `vite.config.ts` has `base: '/series63-study-hub/'` and the manifest `scope` / `start_url` match. Changing the repo name requires updating all three.
- **HashRouter:** all internal links use `#/path` URLs (e.g., `/curriculum/usa-foundations` becomes `https://rivendale.github.io/series63-study-hub/#/curriculum/usa-foundations`). This is intentional for GitHub Pages.
- **`tsconfig.json`** has `noUnusedLocals: true` and `noUnusedParameters: true`. Unused imports break the build. Use `void someImport;` if a side-effect import is unavoidable.
- **Apostrophes in TS strings:** see "Adding curriculum content" above. The build will fail at `tsc -b` before vite runs if there's an unterminated string.

## Build and verify

```bash
npm install
npm run typecheck     # tsc --noEmit — fastest signal
npm run lint          # eslint, --max-warnings 0
npm run build         # tsc -b && vite build
```

A successful build produces:
- `dist/index.html` (~1 KB)
- `dist/assets/index-*.{js,css}` (hashed)
- `dist/manifest.webmanifest`
- `dist/sw.js` + `dist/workbox-*.js`
- `dist/icon.svg`, `dist/icon-192.png`, `dist/icon-512.png`, `dist/favicon.ico`

## When in doubt

- **Bank size: 272 questions**, matching the NASAA blueprint within 1.1 points on every category (BD/Agents 46.7%, Remedies/Admin 35.3%, Securities/Issuers 9.9%, IAs/IARs 8.1%) and balanced at 25% per answer position. The v0.3 target of 250–300 is met. Further growth should preserve both properties — check with the analysis snippet in the git history or re-derive it, and re-run `npm run rebalance:answers`.
- The `CheatSheet` page in `src/pages/CheatSheet.tsx` is the canonical source for exam thresholds and the most-tested rules. Keep it in sync with curriculum content — it has twice been the file left behind by a correction applied everywhere else.
- Before committing rule changes, double-check the current law. Things like the qualified-client thresholds, commercial paper limits, and IAR CE adoption status drift over time.

### Rules previously stated wrongly in this repo — do not reintroduce

- **Qualified client** is **$1.4M AUM with the IA or $2.7M net worth excluding the primary residence**, raised from $1.1M/$2.2M by SEC order effective **2026-06-29**, with existing contracts grandfathered. The SEC re-indexes Rule 205-3 about every five years — this repo carried the stale pair for roughly six weeks, so re-check it before each content revision rather than trusting the number in this file.
- **Statutory disqualification.** The app once had this inverted. The **1956 act** (§204(a)(2)(B)) reaches convictions within the past 10 years for qualifying misdemeanors *and* felonies alike; the **2002 act** (§412(d)(3)) reaches **any felony with no time limit** plus a qualifying misdemeanor within 10 years. Neither act says securities misdemeanors are unlimited. Safe ground under either: a conviction within the past 10 years.
- **Civil statute of limitations.** This entry previously said the opposite, and the correction cost two bad commits in the sibling repo before anyone opened the act. The "3 years / 2 years" pairing is **not** a prep-industry convention — it is **§410(f)** of the 1956 act verbatim: no suit more than **3 years after the contract of sale, or the rendering of investment advice**, or more than **2 years after discovery**, **whichever first occurs**. The limitations provision is **§410(f)**; §410(e) is survival of the cause of action after death. The phrase "four years" appears nowhere in the act — there is no outer cap by claim type and no split between §410(a)(1) and §410(a)(2). 2002 act: earlier of two years after discovery or **five** years after the violation. Criminal is separate again — five years. **If a content pass concludes this rule is a myth, that conclusion is the myth.** Read §410(f) before editing.
- **The 15-day hearing clock** is the Administrator's deadline to set a matter down **after receiving a written request**, not a countdown for the registrant to ask. The model act sets no deadline for making the request.
- **Discretion.** A **BD agent** needs the written DPOA in hand first. An **investment adviser** may begin on oral authority with written authorisation due within **10 business days of the first transaction** (NASAA Model Rule 102(a)(4)-1). Stating the agent rule as an unscoped absolute is how this went wrong.
- **Private placement** counts **offerees, not buyers** — an eleventh retail person merely *offered* the security breaks the exemption even if they never purchase.
- **Registration by coordination** is simultaneous with federal effectiveness only if three conditions hold: statement on file 10 days, pricing statement on file 2 full business days, no stop order pending.
