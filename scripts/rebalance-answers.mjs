/**
 * Flatten the answer-key distribution across the question bank.
 *
 * A bank where one index holds half the correct answers is a defect: a student
 * can score well above chance by always picking it, which rewards a habit that
 * the real exam punishes. This script cyclically rotates the CHOICES of eligible
 * questions and moves the answer index with them, so the content of every
 * question is untouched and only the presentation order changes.
 *
 * A question is INELIGIBLE where choice order carries meaning, because rotating
 * it would produce something a human would notice as wrong:
 *
 *   - roman-numeral grouping answers ("I and III only") — these enumerate the
 *     stem's numbered items and are conventionally ordered
 *   - ordered numeric or duration lists ("10 days" / "15 days" / "30 days") —
 *     scrambling reads as a typo even though no answer changes
 *   - any choice referring to the others ("all of the above", "both A and B")
 *   - explanations that point at a position ("the first distractor", "the last
 *     option"), which a rotation would silently falsify
 *
 * Run with --dry to preview. Run with no flag to write.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const QDIR = resolve(__dirname, '..', 'src', 'data', 'questions');
const DRY = process.argv.includes('--dry');

const ROMAN = /^\s*(I{1,3}V?|IV|V)\b|^\s*'?(I|II|III|IV)[,\s]/;
const ROMAN_GROUP = /\b(I|II|III|IV)\b.*\bonly\b|\bI,\s*II\b|\bI\s+and\s+I/i;
const SELF_REF = /\ball of the above\b|\bnone of the above\b|\bboth of\b|\bneither of\b/i;
const ORDERED_NUM =
  /^\$?[\d,.]+(\s*(days?|business days?|years?|months?|hours?|%|million|billion))?$/i;
const POSITIONAL =
  /first (distractor|option|choice|answer)|last (option|choice|answer)|second (option|choice)|third (option|choice)|choice [A-D]\b|option [A-D]\b/i;

/** Split a file into question blocks, preserving everything between them. */
function parseBlocks(src) {
  const out = [];
  const re = /\{\s*\n\s*id: (\d+),[\s\S]*?\n  \},/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    out.push({ text: m[0], start: m.index, end: m.index + m[0].length, id: Number(m[1]) });
  }
  return out;
}

function getChoices(block) {
  const m = block.match(/choices: \[([\s\S]*?)\n?\s*\],/);
  if (!m) return null;
  const raw = m[1];
  // Split on top-level commas that end a quoted string.
  const items = [];
  const re = /\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")\s*,?/g;
  let mm;
  while ((mm = re.exec(raw)) !== null) items.push(mm[1]);
  return items.length === 4 ? { items, full: m[0], inner: m[1] } : null;
}

function unquote(s) {
  return s.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"');
}

function eligible(block, choices) {
  const texts = choices.items.map(unquote);
  if (texts.some((t) => SELF_REF.test(t))) return 'self-referential choice';
  if (texts.some((t) => ROMAN_GROUP.test(t))) return 'roman-numeral grouping';
  if (texts.every((t) => ORDERED_NUM.test(t.trim()))) return 'ordered numeric list';
  const exp = block.match(/exp:\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/);
  if (exp && POSITIONAL.test(exp[1])) return 'explanation names a position';
  return null;
}

/* ------------------------------------------------------------------ */

const files = readdirSync(QDIR).filter((f) => f.endsWith('.ts'));
const all = [];
for (const f of files) {
  const src = readFileSync(join(QDIR, f), 'utf8');
  for (const b of parseBlocks(src)) {
    const ansM = b.text.match(/answer: (\d)/);
    const choices = getChoices(b.text);
    if (!ansM || !choices) continue;
    all.push({
      file: f,
      id: b.id,
      answer: Number(ansM[1]),
      choices,
      block: b,
      skip: eligible(b.text, choices),
    });
  }
}

const before = [0, 0, 0, 0];
all.forEach((q) => before[q.answer]++);

const movable = all.filter((q) => !q.skip);
const target = Math.round(all.length / 4);

// Greedy: process movable questions, each time shifting the answer onto
// whichever index is currently furthest below target.
const counts = [...before];
const plan = new Map();
for (const q of movable) {
  let best = q.answer;
  let bestDeficit = counts[q.answer] - target;
  for (let i = 0; i < 4; i++) {
    const deficit = counts[i] - target;
    if (deficit < bestDeficit) {
      bestDeficit = deficit;
      best = i;
    }
  }
  if (best !== q.answer) {
    counts[q.answer]--;
    counts[best]++;
    plan.set(`${q.file}#${q.id}`, best);
  }
}

console.log(`questions: ${all.length}`);
console.log(`skipped as order-meaningful: ${all.length - movable.length}`);
const reasons = {};
all.filter((q) => q.skip).forEach((q) => (reasons[q.skip] = (reasons[q.skip] || 0) + 1));
for (const [r, n] of Object.entries(reasons)) console.log(`    ${r}: ${n}`);
console.log(`rotations planned: ${plan.size}`);
console.log(`before: ${before.join(' / ')}`);
console.log(`after:  ${counts.join(' / ')}   (target ~${target} each)`);

if (DRY) process.exit(0);

/* Apply, file by file, rewriting each affected block. */
let written = 0;
for (const f of files) {
  let src = readFileSync(join(QDIR, f), 'utf8');
  const blocks = parseBlocks(src);
  let changed = false;
  // Rewrite from the end so earlier offsets stay valid.
  for (let i = blocks.length - 1; i >= 0; i--) {
    const b = blocks[i];
    const key = `${f}#${b.id}`;
    if (!plan.has(key)) continue;
    const q = all.find((x) => x.file === f && x.id === b.id);
    const newAnswer = plan.get(key);
    const shift = (newAnswer - q.answer + 4) % 4;
    const rotated = [];
    for (let j = 0; j < 4; j++) rotated[j] = q.choices.items[(j - shift + 4) % 4];

    // Rebuild the choices array preserving the original indentation style.
    const multiline = q.choices.inner.includes('\n');
    const body = multiline
      ? '\n' + rotated.map((c) => `      ${c},`).join('\n') + '\n    '
      : rotated.join(', ');
    const newChoices = `choices: [${body}],`;
    let text = b.text.replace(q.choices.full, newChoices);
    text = text.replace(/answer: \d/, `answer: ${newAnswer}`);
    src = src.slice(0, b.start) + text + src.slice(b.end);
    changed = true;
    written++;
  }
  if (changed) writeFileSync(join(QDIR, f), src);
}
console.log(`rewrote ${written} questions`);
