# `src/core` — the shared engine

Everything in this directory is **exam-agnostic** and is kept **byte-identical**
across every study hub that uses it. It is the thing a new exam app forks
*without* modification.

## The boundary rule

> A file in `src/core` may not import from `src/data`, `src/hooks`,
> `src/pages`, `src/components`, or `src/lib`.

That is the whole rule, and it is mechanically checkable. Core describes the
*shape* it needs in `types.ts` (`QuestionLike`, `ProgressLike`, `AnswerRecord`,
`CategoryLike`) and the host app passes data in. The moment a core module reaches
into `src/data` it has become specific to one exam and has left the boundary.

App-specific logic lives in `src/lib` instead. The two directories are not
interchangeable: `src/lib` may import from `src/core`, never the reverse.

## Staying in sync

`MANIFEST.sha256` lists a hash for every file here. Run:

```bash
npm run core:check
```

It fails if any local file no longer matches the manifest. Because every
consuming repo carries the *same* manifest, a change made in one repo and not
propagated to the others shows up as a failure rather than as silent drift —
which is exactly how these two apps diverged in the first place.

When you deliberately change a core module:

1. Make the change in one repo and verify it there.
2. Copy the changed files to every other consuming repo.
3. Run `npm run core:regen` in one of them and copy the new manifest across.
4. Verify each repo builds.

## Why a directory and not an npm package

A published package would be better and is the intended destination. It was not
possible at the time of extraction — creating the shared repository requires
permissions the automation did not have. The boundary here is deliberately
package-shaped so that promoting it later is a file move plus a `package.json`,
not a redesign.

## What is here

| File | What it does |
| --- | --- |
| `types.ts` | Structural types the host app must satisfy. No behaviour. |
| `shuffle.ts` | `shuffle` and `sample`, used by mock construction and topic drills. |
| `spacedRepetition.ts` | Five-box Leitner scheduler, plus due/missed selection and the review summary. |
| `storage.ts` | Storage health as an observable: write status and failure kind, quota-trim notices, durability, usage, and the unreadable-record report. Holds no keys — the host passes them in. |

## What is *not* here yet

Deliberately deferred rather than forgotten:

- **`stats.ts`** — both apps have one, and they have diverged. Sharing it
  requires inverting the dependency so the functions take questions, topics and
  categories as arguments instead of importing them. Straightforward, but it
  touches every call site.
- **`mergeProgress` / `syncClient` / `syncCrypto`** — Series 65 only, and
  self-contained. They can move as-is once a second app actually needs sync.
