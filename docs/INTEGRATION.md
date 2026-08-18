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

That is all of it. **No environment variables, no secrets, no services, no
backend.** Progress lives in `localStorage`. That property is worth defending:
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
entry carries `questionIds` — the questions that must change if the rule does.

**The shared core.** `src/core/` holds the exam-agnostic engine: structural
types, shuffle/sample, the five-box Leitner scheduler, storage health. One rule,
mechanically checked by `npm run core:check`:

> Nothing in `src/core` may import from `src/data`, `src/hooks`, `src/pages`,
> `src/components` or `src/lib`.

Core declares the shape it needs; the host passes data in. A shared
`MANIFEST.sha256` means a change made in one app and not propagated to the other
**fails the check** rather than becoming silent drift — which is exactly how the
two apps diverged before the extraction.

## Guardrails — every one of these has actually failed here

| do not | because |
|---|---|
| Upgrade to Vite 8 | `vite-plugin-pwa` does not support it. Close the Dependabot PR. |
| Add `cache: npm` to `setup-node` | **No lockfile is committed** and CI runs `npm install`, not `npm ci`. The cache step fails without a lockfile. If you want reproducible installs, commit the lockfile and change all three together. |
| Bump `SCHEMA_VERSION` for an additive change | A version mismatch **quarantines every existing progress record**. Additive means optional fields and no bump; incompatible means bump *and write the migration first*. |
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

## Base path: a three-place change

Moving off a subpath touches three places, and changing one leaves the app
half-working, which is worse than not working:

```
vite.config.ts    base: '/<repo-name>/'  →  '/'
vite.config.ts    manifest scope + start_url
index.html        icon href and apple-touch-icon href
```

## Still outside core, with reasons

`stats.ts` needs its dependency inverted — take questions, topics and categories
as arguments instead of importing them. That single change is what blocks sharing
it, and it is the same reason the two copies drifted. Sync (`mergeProgress`,
`syncClient`, `syncCrypto`) moves when a second app needs it.

**On sync merge behaviour:** the merge keeps a fixed total of mock attempts, not
that many *per device*. A long history on one device loses its excess. It also
resolves answers by timestamp, so check device clocks before the first sync, and
export from the device with the longer history first.
