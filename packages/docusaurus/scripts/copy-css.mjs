import { cp, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

// 1. The preset's own CSS: src/css -> lib/css.
const src = join(here, '..', 'src', 'css');
const dst = join(here, '..', 'lib', 'css');
await mkdir(dst, { recursive: true });
await cp(src, dst, { recursive: true });
console.log(`copy-css: ${src} -> ${dst}`);

// 2. Vendored design tokens: ../../tokens/dist -> lib/tokens.
// @ktdocs/tokens is a private, build-time-only workspace package — its compiled
// CSS + fonts are bundled into the published preset so consumers never install it.
// fonts/ must sit next to fonts.css: fonts.css uses relative url("./fonts/*.woff2").
const tokensDist = join(here, '..', '..', 'tokens', 'dist');
const tokensDst = join(here, '..', 'lib', 'tokens');

if (!existsSync(tokensDist)) {
  console.error(
    `copy-css: tokens dist not found at ${tokensDist}.\n` +
      'Build the tokens package first: `task tokens:build` (or `pnpm --filter @ktdocs/tokens build`).',
  );
  process.exit(1);
}

const tokenCss = ['fonts.css', 'colors_and_type.css', 'tokens.css', 'components.css'];
await mkdir(tokensDst, { recursive: true });
for (const file of tokenCss) {
  await cp(join(tokensDist, file), join(tokensDst, file));
}
await cp(join(tokensDist, 'fonts'), join(tokensDst, 'fonts'), { recursive: true });
console.log(`copy-css: ${tokensDist} -> ${tokensDst} (${tokenCss.length} css + fonts/)`);
