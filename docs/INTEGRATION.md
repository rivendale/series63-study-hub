# Integration and maintenance

How this app is built, what breaks it, and the order to do things in. Written
from a handover, so it records what actually failed rather than what should
work in theory.

**Sibling app.** A second study hub for a different exam shares `src/core/`
byte-for-byte. Anything here about core applies to both.

## The stack, and the whole local setup

Vite 7 · React 18.3 · TypeScript strict · Tailwind 3 · React Router 6
(HashRouter) · `vite-plugin-pwa` (Workbox). Six runtime dependencies:
`react`, `react-dom`, `react-router-dom`, `react-markdown`, `remark-gfm`,
`lucide-react`.

```bash
git clone <repo> && npm install && npm run dev
```

That is all of it for the **app**: no environment variables, no secrets, no
services, no backend. (CI is separate — the review workflow consumes a secret.
Nothing in the application runtime does.) Progress lives in `localStorage`. That property is worth defending:
client-side-only means no credentials to leak, no server to patch, and a study
record that works offline.

## Commands

```bash
npm run dev                 local dev server
npm run typecheck           tsc --noEmit — the fastest signal
npm run lint                eslint, --max-warnings 0
npm run build               tsc -b && vite build
npm run core:check          core boundary + manifest drift
npm run core:regen          rewrite the manifest after a DELIBERATE core change
npm run review:md           regenerate REVIEW.md and the README counts
npm run rebalance:answers   flatten the answer key (--dry to preview)
```

## Layout

```
src/
├── core/          shared engine — byte-identical with the sibling app
├── data/
│   ├── examInfo.ts        exam constants; never hard-code these elsewhere
│   ├── categories.ts      blueprint weights + topic→category map
│   ├── reviewItems.ts     content flagged for professional review
│   ├── topics/            one chapter per file
│   └── questions/         one question module per topic
├── hooks/         useProgress (localStorage), useQuiz (state machine)
├── lib/           app-specific logic; may import core, never the reverse
├── components/
└── pages/
```

## Four design decisions worth keeping

**Content is typed modules, not a CMS.** Chapters and questions are TypeScript,
type-checked at build. A malformed question fails `tsc` rather than rendering
wrong at 2am. One file per topic keeps contributions non-conflicting.

**The blueprint drives sampling.** `categories.ts` holds the official category
weights. Mock exams sample in those proportions rather than uniformly, and
progress reports per category — so a student sees where the exam will actually
hurt them, not which topics they happened to open.

**The review manifest.** `reviewItems.ts` is the single source for every passage
flagged for review; the in-app page and `REVIEW.md` both render from it. Each
entry carries `questionIds` where the rule is keyed to questions — those are the
questions that must change if the rule does. Not every entry has them.

**The shared core.** `src/core/` holds the exam-agnostic engine: structural
types, shuffle/sample, the five-box Leitner scheduler, storage health. One rule,
mechanically checked by `npm run core:check`:

> Nothing in `src/core` may import from `src/data`, `src/hooks`, `src/pages`,
> `src/components` or `src/lib`.

Core declares the shape it needs; the host passes data in.

**`MANIFEST.sha256` does NOT detect cross-repository drift, and it is worth being
precise about what it does.** `core:check` hashes the local `src/core` files
against the manifest *in the same repo*. It catches an **unintended local edit**
to core. It cannot see the sibling app at all — so after `npm run core:regen` in
one repo, **both repos pass their own check while holding different cores.**
Keeping the two in step is a manual diff:

```bash
diff -r <this-repo>/src/core <sibling-repo>/src/core
```

Run that before trusting that a core change propagated. The manifest is a
tamper-check, not a synchronisation mechanism.

## Guardrails — every one of these has actually failed here

| do not | because |
|---|---|
| Upgrade to Vite 8 | `vite-plugin-pwa` does not support it. Close the Dependabot PR. |
| Add `cache: npm` to `setup-node` | **No lockfile is committed** and CI runs `npm install`, not `npm ci`. The cache step fails without a lockfile. If you want reproducible installs, commit the lockfile and change all three together. |
| Bump `SCHEMA_VERSION` for an additive change | A version mismatch sends existing progress down the **quarantine** path instead of loading it. Read the `quarantine()` implementation before assuming what survives (grep `QUARANTINE_KEY`; it lives with the progress store, not in core) — the behaviour has conditions. Additive means optional fields and no bump; incompatible means bump *and write the migration first*. |
| Put a backtick or `${` in a chapter body | Chapter bodies are template literals — either one ends or hijacks it. Plain `$50,000` is fine. |
| Fix a rule in a chapter and stop there | See the sweep list below. |
| Trust a local clone without fetching | Some pushes commit server-side without moving the local ref, so `git rev-parse origin/<branch>` can report a branch missing that the API shows present. Start with `git fetch`. |
| Add a backend because a domain exists | See the stack note above. Sync was designed bring-your-own-endpoint with browser-side encryption, so the endpoint never sees plaintext. |

## Changing a rule: the sweep list

**A chapter fix that leaves the other surfaces alone is worse than no fix** — the
app then contradicts itself and the student cannot tell which half is right.
When a rule changes, sweep **all** of:

1. the chapter body
2. `pitfalls`
3. `keyTerms` — the glossary shorthand goes stale silently
4. every question in that entry's `questionIds`, **and its explanation**
5. the cheat sheet
6. **prose that generalises over a table** — add a row and the sentence beneath
   saying "the pattern here is…" quietly stops being true

Items 3, 4 and 6 each caught a real miss during a single correction. Item 6 is
the one no checklist had, and it is the least visible: the table is right, the
paragraph under it is wrong, and both are in the same file two lines apart.

**Search for phrasings, not your phrasing.** One sweep reported a surface clean
because it grepped `3 years` while the file said `3 yrs`. A false negative from a
too-specific pattern is indistinguishable from a clean result.

## Verifying content

**Verify by execution, not by reading.** The scheduler, the category weighting,
the answer-key rotation and the storage paths were each checked by running them
against fixtures. That caught a bug review had missed: a rotation pass scrambled
an ascending money list because a guard only matched bare numerals, and the
script reported success both times. Only looking at the output revealed it.

**Check the edition, not just the rule.** A single statutory rule was "corrected"
three times in opposite directions before anyone noticed the sources were
different editions of the same act — an amendment had renumbered the clause and
widened the period, while a later act's commentary still described the original
figure. Every pass looked like it was reversing the last. When two authorities
disagree, ask which document each is quoting before deciding either is wrong.

**Cite the governing text, and say what you did not check.** A confident wrong
citation is worse than the vague figure it replaces, because it survives review.
One correction was caught only because its author flagged an unverified claim
rather than letting it pass as settled.

## Base path: six lines, and missing one half-breaks the app

Moving off a subpath is not the three-place change the original handover
recorded. Measured on this repo:

```bash
grep -n "$(node -p "require('./package.json').name")" vite.config.ts index.html
```

```
index.html:5        <link rel="icon" href="/<repo-name>/icon.svg">
index.html:12       <link rel="apple-touch-icon" href="/<repo-name>/icon-192.png">
vite.config.ts:6    base: '/<repo-name>/'
vite.config.ts:19   manifest scope
vite.config.ts:20   manifest start_url
vite.config.ts:34   workbox navigateFallback
```

**`navigateFallback` is the one that gets missed**, and it fails in the worst
way: the app works online and breaks only offline, because the service worker
falls back to an `index.html` at a path that no longer exists. Change all six in
one commit and verify the built `dist/index.html` references resolve.

## Still outside core, with reasons

`stats.ts` needs its dependency inverted — it imports questions, topics and
categories, and also `examInfo` and `Progress` from hooks. All of those become
arguments. That single change is what blocks sharing
it, and it is the same reason the two copies drifted. Sync (`mergeProgress`,
`syncClient`, `syncCrypto`) moves when a second app needs it.

**Sync lives in the sibling app, not here.** This repo has no `syncClient`,
`syncCrypto` or `mergeProgress`. If sync is ever ported in, read that
implementation rather than this paragraph — its merge semantics are its own and
are documented there.