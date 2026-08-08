#!/usr/bin/env node
/**
 * Generates REVIEW.md from src/data/reviewItems.ts.
 *
 * The in-app /review page and REVIEW.md render from the same data file so the
 * two cannot drift apart. Nothing about an item is written here — this script
 * only formats what the data file already says.
 *
 * The source is TypeScript, so it is transpiled with esbuild (already present
 * as a Vite dependency) and imported, rather than parsed by hand. A regex
 * reader would quietly drop an item the day someone reformats the file, and a
 * review list that silently loses an entry is the worst failure this repo has.
 *
 * Run: npm run review:md
 * Deliberately NOT wired into `npm run build` — a generated file that rewrites
 * itself on every build produces noisy diffs.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const SOURCE = join(repoRoot, 'src', 'data', 'reviewItems.ts');
const OUTPUT = join(repoRoot, 'REVIEW.md');
const README = join(repoRoot, 'README.md');
const TOPICS_DIR = join(repoRoot, 'src', 'data', 'topics');
const QUESTIONS_DIR = join(repoRoot, 'src', 'data', 'questions');

const relTopic = (id) => `src/data/topics/${id}.ts`;
const relQuestions = (file) => `src/data/questions/${file}`;

/* ------------------------------------------------------------------ */
/* Transpile + import                                                  */
/* ------------------------------------------------------------------ */

function esbuildArgs(input, outfile) {
  return [input, '--format=esm', '--platform=node', `--outfile=${outfile}`, '--log-level=error'];
}

function transpile(input, outfile, quiet = false) {
  const local = join(
    repoRoot,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'esbuild.cmd' : 'esbuild',
  );
  const args = esbuildArgs(input, outfile);
  const stdio = ['ignore', 'ignore', quiet ? 'ignore' : 'inherit'];
  if (existsSync(local)) {
    execFileSync(local, args, { stdio });
  } else {
    // esbuild ships with Vite; --no-install keeps this from reaching the network.
    execFileSync('npx', ['--no-install', 'esbuild', ...args], { stdio });
  }
}

async function loadModule(tsPath, workDir, name, quiet = false) {
  const out = join(workDir, `${name}.mjs`);
  transpile(tsPath, out, quiet);
  return import(pathToFileURL(out).href);
}

/* ------------------------------------------------------------------ */
/* Validation — loud failure beats a short list                        */
/* ------------------------------------------------------------------ */

const REQUIRED_TEXT_FIELDS = ['id', 'topic', 'title', 'category', 'status', 'asserted', 'concern', 'verify'];
const STATUSES = ['open', 'confirmed', 'corrected'];

function validate({ reviewItems, REVIEW_CATEGORY_LABELS, REVIEW_CATEGORY_NOTES }) {
  const fail = (msg) => {
    throw new Error(`${SOURCE}: ${msg}`);
  };

  if (!Array.isArray(reviewItems) || reviewItems.length === 0) fail('reviewItems is not a non-empty array');
  if (!REVIEW_CATEGORY_LABELS || !REVIEW_CATEGORY_NOTES) fail('missing REVIEW_CATEGORY_LABELS or REVIEW_CATEGORY_NOTES');

  for (const key of Object.keys(REVIEW_CATEGORY_LABELS)) {
    if (!REVIEW_CATEGORY_NOTES[key]) fail(`category "${key}" has a label but no note`);
  }

  const seen = new Set();
  for (const [i, item] of reviewItems.entries()) {
    const where = `item ${i} (${item?.id ?? 'no id'})`;
    for (const field of REQUIRED_TEXT_FIELDS) {
      if (typeof item?.[field] !== 'string' || item[field].trim() === '') {
        fail(`${where} is missing a non-empty "${field}"`);
      }
    }
    if (seen.has(item.id)) fail(`duplicate item id "${item.id}"`);
    seen.add(item.id);
    if (!REVIEW_CATEGORY_LABELS[item.category]) fail(`${where} has unknown category "${item.category}"`);
    if (!STATUSES.includes(item.status)) fail(`${where} has unknown status "${item.status}"`);
    if (item.questionIds !== undefined) {
      if (!Array.isArray(item.questionIds) || item.questionIds.some((n) => !Number.isFinite(n))) {
        fail(`${where} has a malformed questionIds`);
      }
    }
    if (item.resolution !== undefined && typeof item.resolution !== 'string') {
      fail(`${where} has a non-string resolution`);
    }
    if (item.status !== 'open' && !item.resolution) {
      console.warn(`warning: ${where} is "${item.status}" but has no resolution text`);
    }
  }
}

/* ------------------------------------------------------------------ */
/* Lookups: chapter titles and question modules                        */
/* ------------------------------------------------------------------ */

const humanize = (id) => id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Chapter titles come from the topic modules, transpiled one at a time so that
 * a topic file someone else is mid-edit on costs a title, not the document.
 */
async function loadChapterTitles(topicIds, workDir) {
  const titles = new Map();
  for (const id of topicIds) {
    const path = join(TOPICS_DIR, `${id}.ts`);
    if (!existsSync(path)) {
      console.warn(`warning: no topic module for "${id}" at ${relTopic(id)}`);
      titles.set(id, { title: humanize(id), hasFile: false });
      continue;
    }
    try {
      // Quiet: a chapter title is a nicety, and another contributor may be
      // mid-edit in this file. Never let it take down the document.
      const mod = await loadModule(path, workDir, `topic-${id}`, true);
      const title = mod?.topic?.title;
      titles.set(id, {
        title: typeof title === 'string' && title.trim() ? title : humanize(id),
        hasFile: true,
      });
    } catch {
      console.warn(`warning: could not read a title from ${relTopic(id)}; using the topic id`);
      titles.set(id, { title: humanize(id), hasFile: true });
    }
  }
  return titles;
}

/**
 * Question id -> module filename. A convenience index for the reviewer, built
 * by scanning the question modules for their id fields; an id that does not
 * resolve is simply printed without a file, never dropped.
 */
function buildQuestionIndex() {
  const index = new Map();
  if (!existsSync(QUESTIONS_DIR)) return index;
  for (const file of readdirSync(QUESTIONS_DIR).filter((n) => n.endsWith('.ts'))) {
    const text = readFileSync(join(QUESTIONS_DIR, file), 'utf8');
    for (const match of text.matchAll(/(?:^|[{\s])id:\s*(\d+)\s*,/g)) {
      index.set(Number(match[1]), file);
    }
  }
  return index;
}

/* ------------------------------------------------------------------ */
/* Markdown helpers                                                    */
/* ------------------------------------------------------------------ */

/** Keep prose from being reinterpreted: $ starts GitHub math, < starts HTML. */
const md = (s) => String(s).replace(/</g, '&lt;').replace(/\$/g, '\\$');
const cell = (s) => md(s).replace(/\|/g, '\\|');

const STATUS_LABELS = { open: 'Open', confirmed: 'Confirmed', corrected: 'Corrected' };

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

function questionsPhrase(item, questionIndex) {
  const ids = item.questionIds ?? [];
  if (ids.length === 0) return null;
  const byFile = new Map();
  for (const id of ids) {
    const file = questionIndex.get(id) ?? null;
    if (!byFile.has(file)) byFile.set(file, []);
    byFile.get(file).push(id);
  }
  return [...byFile.entries()]
    .map(([file, group]) => {
      const list = group.join(', ');
      return file ? `${list} in [\`${relQuestions(file)}\`](${relQuestions(file)})` : `${list} (module not found)`;
    })
    .join('; ');
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

function render({ items, labels, notes, titles, questionIndex, homepage }) {
  const byCategory = new Map(Object.keys(labels).map((k) => [k, []]));
  for (const item of items) byCategory.get(item.category).push(item);

  const counts = {
    total: items.length,
    open: items.filter((i) => i.status === 'open').length,
    confirmed: items.filter((i) => i.status === 'confirmed').length,
    corrected: items.filter((i) => i.status === 'corrected').length,
  };
  const allQuestionIds = [...new Set(items.flatMap((i) => i.questionIds ?? []))].sort((a, b) => a - b);
  const chapters = [...new Set(items.map((i) => i.topic))];

  const appLink = (topic) =>
    homepage ? `${homepage.replace(/\/$/, '')}/#/curriculum/${topic}` : null;

  const out = [];
  const push = (...lines) => out.push(...lines);

  /* --- Preamble ------------------------------------------------- */

  push(
    '# Content review queue',
    '',
    'The curriculum and question bank in this app are original work, written from public sources: the Uniform Securities Act model law, NASAA model rules and Statements of Policy, and the Investment Advisers Act of 1940 and the rules under it. The material is internally consistent — chapters agree with the questions written from them, and a figure is stated the same way everywhere it appears.',
    '',
    'This file lists the places where internal consistency was not enough. Entries arrive here two ways, and the status on each says which.',
    '',
    '**Open** items are points where the writer or the auditor stopped short of asserting something flatly: sources disagree about what is actually tested, a figure will drift, a rule varies by adopting state, or the answer is a matter of judgment on which competent advisors differ. Nothing in an open item is known to be wrong — these are the points where certainty ran out, and where a licensed reviewer\'s judgment is worth more than another pass through the same public sources.',
    '',
    '**Confirmed** and **corrected** items have been resolved. A corrected entry means something *was* wrong and has been fixed, with the resolution recording what changed and why; several were found by comparing the same rule across files rather than by reading any file on its own. They stay in the list because the reasoning is worth keeping, and because anyone reopening the question should be able to see what was already decided.',
    '',
    'Each item states exactly what the app currently tells a student, why it was flagged, and the single specific thing to check. The intent is that a review is an hour or two of targeted checking rather than a re-read of the whole curriculum.',
    '',
  );

  /* --- Summary --------------------------------------------------- */

  const statusBits = [
    `${counts.open} open`,
    counts.confirmed ? `${counts.confirmed} confirmed` : null,
    counts.corrected ? `${counts.corrected} corrected` : null,
  ].filter(Boolean);

  push(
    `**${plural(counts.total, 'item')} — ${statusBits.join(', ')} — across ${plural(chapters.length, 'chapter')} and ${plural(allQuestionIds.length, 'question')}.**`,
    '',
    '| Category | Items | Open | What the category means |',
    '|---|---:|---:|---|',
  );
  for (const [key, label] of Object.entries(labels)) {
    const group = byCategory.get(key);
    const open = group.filter((i) => i.status === 'open').length;
    push(`| ${cell(label)} | ${group.length} | ${open} | ${cell(notes[key])} |`);
  }
  push(
    '',
    '*Generated from [`src/data/reviewItems.ts`](src/data/reviewItems.ts) by `npm run review:md`. Edit that file, not this one — the in-app `/review` page renders the same data, so the two cannot disagree.*',
    '',
  );

  /* --- Checklist -------------------------------------------------- */

  push(
    '## Checklist',
    '',
    'Paste this section into a GitHub issue or a PR body to track the review there; the boxes are live task-list syntax. Items already resolved are pre-ticked and listed for the record rather than for action.',
    '',
  );
  for (const [key, label] of Object.entries(labels)) {
    const group = byCategory.get(key);
    if (group.length === 0) continue;
    push(`**${md(label)}**`, '');
    for (const item of group) {
      const box = item.status === 'open' ? '[ ]' : '[x]';
      const chapter = titles.get(item.topic)?.title ?? humanize(item.topic);
      const ids = item.questionIds ?? [];
      const tail =
        item.status === 'open'
          ? ids.length
            ? ` — ${md(chapter)} · ${ids.map((n) => `Q${n}`).join(', ')}`
            : ` — ${md(chapter)} · chapter text only`
          : ` — ${md(chapter)} · ${STATUS_LABELS[item.status].toLowerCase()}, no action needed`;
      push(`- ${box} [${md(item.title)}](#${item.id})${tail}`);
    }
    push('');
  }

  /* --- Items ------------------------------------------------------ */

  for (const [key, label] of Object.entries(labels)) {
    const group = byCategory.get(key);
    if (group.length === 0) continue;

    push(`## ${md(label)}`, '', `> ${md(notes[key])}`, '');

    for (const item of group) {
      const info = titles.get(item.topic) ?? { title: humanize(item.topic), hasFile: false };
      const chapterLink = info.hasFile
        ? `[${md(info.title)}](${relTopic(item.topic)})`
        : `${md(info.title)} (no module found)`;
      const app = appLink(item.topic);

      push(
        `<a id="${item.id}"></a>`,
        '',
        `### ${md(item.title)}`,
        '',
        `**Status:** ${STATUS_LABELS[item.status]} · **Item id:** \`${item.id}\``,
        '',
        `**Chapter:** ${chapterLink} — topic id \`${item.topic}\`${app ? ` · [read in the app](${app})` : ''}`,
        '',
        `**The app asserts.** ${md(item.asserted)}`,
        '',
        `**Why it is flagged.** ${md(item.concern)}`,
        '',
        `**To verify.** ${md(item.verify)}`,
        '',
      );

      const phrase = questionsPhrase(item, questionIndex);
      push(
        phrase
          ? `**Questions that change with it.** ${phrase}`
          : '**Questions that change with it.** None — this one is chapter text only.',
        '',
      );

      if (item.resolution) push(`**Resolution.** ${md(item.resolution)}`, '');
    }
  }

  /* --- Feeding corrections back ----------------------------------- */

  push(
    '## Feeding corrections back',
    '',
    'A correction is not finished when the chapter is right. Every question written from a rule repeats it — in the stem, in the keyed answer index, and in the explanation — and the explanation is the part a student reads most carefully.',
    '',
    'This is not hypothetical. One chapter stated the oral-discretion grace period backwards. The error propagated into a question that keyed the wrong choice and then taught the reversal in its explanation, so a student who read the chapter, answered the question, and read the feedback met the same mistake three times and had it confirmed twice. The `questionIds` field exists because of that.',
    '',
    '**A half-applied correction is worse than no correction.** Fix the chapter and leave the question, and the surviving instance now stands alone and unqualified — the student has no contradiction to notice, just a wrong rule delivered with the app\'s full authority in the one place they are being graded on it.',
    '',
    '### Where each piece lives',
    '',
    '| What | File |',
    '|---|---|',
    '| The rule, as taught | `src/data/topics/<topic-id>.ts` — linked on every item above |',
    '| The questions built on it | `src/data/questions/<module>.ts` — the ids are listed on every item |',
    '| The flag itself | [`src/data/reviewItems.ts`](src/data/reviewItems.ts) |',
    '| Thresholds repeated out of context | [`src/pages/CheatSheet.tsx`](src/pages/CheatSheet.tsx), plus any `keyTerms` or `formulas` entry in the topic module |',
    '',
    '### The loop',
    '',
    '1. **Correct the chapter** in its topic module. If the point is genuinely contested, say so in the text rather than picking a side silently.',
    '2. **Work every id in `questionIds`.** For each one check the stem, the `answer` index, and the `exp` string. A rule reversal usually means all three move; changing only `answer` leaves an explanation that argues for the old answer.',
    '3. **Grep for the figure.** A dollar threshold or day count often also appears on the cheat sheet, in a `confusions` row, or in a chapter that cross-references this one.',
    '4. **Update the item** in `src/data/reviewItems.ts`: set `status` to `confirmed` (the app was right) or `corrected` (it was not), and write a `resolution` saying what was checked and against what. A confirmed item is a finding worth keeping — it stops the same question being reopened next year.',
    '5. **Regenerate this file:** `npm run review:md`. It is not part of `npm run build`, so it will not update itself.',
    '6. **Build:** `npm run lint && npm run build`.',
    '',
    'Do not edit `REVIEW.md` by hand — the next regeneration discards it, and the in-app `/review` page would never have shown the change anyway.',
    '',
    '### Every affected question, in one place',
    '',
    `${plural(allQuestionIds.length, 'question')} across the whole list. If a question appears against two items, both rules have to be settled before it is safe to touch.`,
    '',
    '| Question | Module | Item |',
    '|---:|---|---|',
  );

  for (const id of allQuestionIds) {
    const owners = items.filter((i) => (i.questionIds ?? []).includes(id));
    const file = questionIndex.get(id);
    const fileCell = file ? `[\`${relQuestions(file)}\`](${relQuestions(file)})` : '*module not found*';
    const itemCell = owners.map((i) => `[${cell(i.title)}](#${i.id})`).join('<br>');
    push(`| ${id} | ${fileCell} | ${itemCell} |`);
  }

  push('');

  return out.join('\n');
}

/* ------------------------------------------------------------------ */
/* README counts                                                       */
/* ------------------------------------------------------------------ */

const README_START = '<!-- review-counts:start (generated by `npm run review:md` — do not edit by hand) -->';
const README_END = '<!-- review-counts:end -->';

/**
 * The README quotes the size of the queue. Counting by hand there means the
 * number is wrong the first time someone adds an item, so it is regenerated
 * from the same data as everything else. A missing marker is a warning, not a
 * failure — REVIEW.md is the deliverable and must still be written.
 */
function syncReadme(items) {
  if (!existsSync(README)) return;
  const text = readFileSync(README, 'utf8');
  const start = text.indexOf(README_START);
  const end = text.indexOf(README_END);
  if (start === -1 || end === -1 || end < start) {
    console.warn('warning: README.md has no review-counts markers; its numbers were left alone');
    return;
  }

  const questions = new Set(items.flatMap((i) => i.questionIds ?? [])).size;
  const chapters = new Set(items.map((i) => i.topic)).size;
  const sentence =
    `**${plural(items.length, 'item')} are currently flagged**, spanning ` +
    `${plural(questions, 'question')} across ${plural(chapters, 'chapter')}.`;

  const next = `${text.slice(0, start)}${README_START}\n${sentence}\n${text.slice(end)}`;
  if (next !== text) {
    writeFileSync(README, next, 'utf8');
    console.log('Updated the review counts in README.md');
  }
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

async function main() {
  if (!existsSync(SOURCE)) {
    throw new Error(`Cannot find ${SOURCE}`);
  }

  const workDir = mkdtempSync(join(tmpdir(), 'review-md-'));
  try {
    const mod = await loadModule(SOURCE, workDir, 'reviewItems');
    validate(mod);

    const { reviewItems: items, REVIEW_CATEGORY_LABELS: labels, REVIEW_CATEGORY_NOTES: notes } = mod;

    const titles = await loadChapterTitles([...new Set(items.map((i) => i.topic))], workDir);
    const questionIndex = buildQuestionIndex();

    let homepage = null;
    try {
      homepage = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8')).homepage ?? null;
    } catch {
      /* the app links are a convenience; the document works without them */
    }

    const markdown = render({ items, labels, notes, titles, questionIndex, homepage });

    // Last guard: every item must have made it into the page.
    const anchors = (markdown.match(/^<a id="/gm) ?? []).length;
    if (anchors !== items.length) {
      throw new Error(`rendered ${anchors} item sections for ${items.length} items — refusing to write a short list`);
    }
    for (const item of items) {
      if (!markdown.includes(`<a id="${item.id}"></a>`)) {
        throw new Error(`item "${item.id}" is missing from the rendered document`);
      }
    }

    writeFileSync(OUTPUT, markdown, 'utf8');
    syncReadme(items);

    const open = items.filter((i) => i.status === 'open').length;
    const questions = new Set(items.flatMap((i) => i.questionIds ?? [])).size;
    console.log(
      `REVIEW.md — ${items.length} items (${open} open), ${Object.keys(labels).length} categories, ` +
        `${new Set(items.map((i) => i.topic)).size} chapters, ${questions} questions.`,
    );
    console.log(`Wrote ${OUTPUT}`);
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(`generate-review: ${err.message}`);
  process.exit(1);
});
