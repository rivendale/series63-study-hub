# CLAUDE.md

Project-specific guidance for Claude Code (and other AI coding assistants) working on this repository.

## What this project is

A static, client-side React + TypeScript PWA that serves as a study companion for the **Series 63** (Uniform Securities Agent State Law) exam. Deployed to GitHub Pages at `https://rivendale.github.io/series63-study-hub/`. No backend, no API keys, no database. Progress persists in `localStorage`.

## Critical project facts

- **Exam structure (2026, NASAA):** 65 total questions = 60 scored + 5 unscored pretest, randomly distributed; 75 minutes; pass = 43 of 60 (72%). Use `examInfo.ts` constants — never hard-code these.
- **NASAA category blueprint** (used by mock-exam sampling): BD/Agents 28 (47%), Remedies/Admin 21 (35%), Securities/Issuers 6 (10%), Investment Advisers/IARs 5 (8%). Defined in `src/data/categories.ts` (`OFFICIAL_CATEGORIES`, `TOPIC_TO_CATEGORY`).
- **Curriculum** lives in `src/data/topics/<id>.ts` (one file per topic, 14 total). The index `src/data/curriculum.ts` imports and concatenates them.
- **Questions** live in `src/data/questions/<id>.ts` (one file per topic, 14 total). The index `src/data/questions.ts` imports and concatenates them.
- **Theme:** Tailwind, mobile-first, dark mode via `class` strategy, 44×44 px minimum tap targets.
- **Routing:** HashRouter (required for GitHub Pages SPA without 404 config).

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

### Why per-topic files instead of monolithic data files?

The original spec called for one big `curriculum.ts` and one big `questions.ts`. We refactored to per-topic modules because:

1. Each file stays small (~3–6 KB), which is critical when pushing through proxies that fail on large blobs.
2. Contributors can add a topic or a batch of questions in isolation without merge conflicts.
3. Tree-shaking still works (Vite inlines the imports at build time).

If you add a new topic, create both `src/data/topics/<id>.ts` and `src/data/questions/<id>.ts`, then update the imports in `src/data/curriculum.ts`, `src/data/questions.ts`, and `src/data/categories.ts` (`TOPIC_TO_CATEGORY`).

### Pushing to GitHub

Use the `mcp__github__push_files` MCP tool. Each push call should keep total payload under ~30 KB to avoid stream timeouts. Rule of thumb:

- Single small file (config, page) — fine in one push
- 3–4 small per-topic files (~3 KB each) — fine in one push
- One large file (~50 KB) — split or refactor

Don't commit `package-lock.json` (it's 360 KB and churns on every dependabot bump). The deploy workflow uses `npm install`, not `npm ci`, so a lockfile isn't required.

The CI deploy workflow (`.github/workflows/deploy.yml`) uses `actions/setup-node@v4` **without** `cache: npm` — adding `cache: npm` will fail because there is no lockfile.

### Branch strategy

Develop on `claude/series63-study-hub-MHtTX`, push to `main` for the live site. The deploy workflow runs on every push to `main` and publishes `dist/` to GitHub Pages.

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
npm run build         # tsc -b && vite build
```

A successful build produces:
- `dist/index.html` (~1 KB)
- `dist/assets/index-*.{js,css}` (hashed)
- `dist/manifest.webmanifest`
- `dist/sw.js` + `dist/workbox-*.js`
- `dist/icon.svg`, `dist/icon-192.png`, `dist/icon-512.png`, `dist/favicon.ico`

## When in doubt

- Section 7 of the original spec defined the question count target (174). Pass-3 spec raised it to ~300. Current bank is 114. Future contributions should grow the bank toward the target, weighted to the NASAA category blueprint (BD/Agents and Remedies/Admin first).
- The `CheatSheet` page in `src/pages/CheatSheet.tsx` is the canonical source for exam thresholds and the most-tested rules. Keep it in sync with curriculum content.
- Before committing rule changes, double-check the current law. Things like the qualified-client thresholds ($1.1M / $2.2M), commercial paper limits, and IAR CE adoption status drift over time. Update `DISCLAIMER.md` (when added) with the content revision date when material changes ship.
