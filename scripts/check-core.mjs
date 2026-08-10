/**
 * Verify src/core has not drifted, and that its boundary holds.
 *
 * Two checks, both cheap:
 *
 * 1. Every file in src/core hashes to the value recorded in MANIFEST.sha256.
 *    Every consuming repo carries the same manifest, so a change made in one
 *    repo and not propagated to the others fails here instead of turning into
 *    the silent divergence that made this extraction necessary.
 *
 * 2. No core file imports from an app directory. Core describes the shape it
 *    needs and receives data; the moment it reaches into src/data it has become
 *    specific to one exam.
 *
 * `--regen` rewrites the manifest after a deliberate change.
 */

import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CORE = resolve(__dirname, '..', 'src', 'core');
const MANIFEST = join(CORE, 'MANIFEST.sha256');
const REGEN = process.argv.includes('--regen');

/** Directories a core file must never import from. */
const FORBIDDEN = ['../data', '../hooks', '../pages', '../components', '../lib'];

const files = readdirSync(CORE)
  .filter((f) => f !== 'MANIFEST.sha256')
  .sort();

const hash = (name) =>
  createHash('sha256').update(readFileSync(join(CORE, name))).digest('hex');

/* --- 1. boundary ---------------------------------------------------- */

const violations = [];
for (const f of files) {
  if (!f.endsWith('.ts')) continue;
  const src = readFileSync(join(CORE, f), 'utf8');
  for (const bad of FORBIDDEN) {
    // Matches both `from '../data/x'` and `import '../data/x'`.
    if (new RegExp(`from\\s+['"]${bad.replace('.', '\\.')}/`).test(src)) {
      violations.push(`${f} imports from ${bad}/`);
    }
  }
}

if (violations.length) {
  console.error('core boundary violated — these belong in src/lib, not src/core:');
  violations.forEach((v) => console.error(`  ${v}`));
  process.exit(1);
}

/* --- 2. drift ------------------------------------------------------- */

if (REGEN) {
  const body =
    files.map((f) => `${hash(f)}  ${f}`).join('\n') + '\n';
  writeFileSync(MANIFEST, body);
  console.log(`wrote manifest for ${files.length} files`);
  console.log('copy src/core/ AND this manifest to every consuming repo');
  process.exit(0);
}

let recorded;
try {
  recorded = new Map(
    readFileSync(MANIFEST, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [h, name] = line.split(/\s+/);
        return [name, h];
      })
  );
} catch {
  console.error('no MANIFEST.sha256 — run `npm run core:regen` to create it');
  process.exit(1);
}

const problems = [];
for (const f of files) {
  if (!recorded.has(f)) problems.push(`${f} is not in the manifest`);
  else if (recorded.get(f) !== hash(f)) problems.push(`${f} has changed`);
}
for (const name of recorded.keys()) {
  if (!files.includes(name)) problems.push(`${name} is in the manifest but missing`);
}

if (problems.length) {
  console.error('src/core has drifted from the manifest:');
  problems.forEach((p) => console.error(`  ${p}`));
  console.error('\nIf the change was deliberate: propagate it to every consuming');
  console.error('repo, then run `npm run core:regen` and copy the new manifest.');
  process.exit(1);
}

console.log(`core OK — ${files.length} files, boundary clean, no drift`);
