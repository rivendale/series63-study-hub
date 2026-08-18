/**
 * Node resolve hook so the regression harness can import Vite-style
 * extensionless TS specifiers ('../core/storage') under
 * --experimental-strip-types, which requires explicit extensions.
 * Registered via:  node --import ./scripts/ts-resolve-register.mjs ...
 */
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('.') && !/\.[a-z]+(\?|$)/i.test(specifier)) {
    const [bare, query] = specifier.split('?');
    const base = new URL(bare, context.parentURL);
    for (const ext of ['.ts', '.tsx']) {
      const candidate = fileURLToPath(base.href + ext);
      if (existsSync(candidate)) {
        return nextResolve(pathToFileURL(candidate).href + (query ? '?' + query : ''), context);
      }
    }
  }
  return nextResolve(specifier, context);
}
