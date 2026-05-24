// Copy only the woff2 weights we ship from @fontsource/* into dist/fonts/.
// Also copies src/fonts.css to dist/fonts.css so the @font-face declarations
// sit next to the woff2 files (relative `./fonts/*.woff2` paths resolve).

import { copyFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, '..');

const SUBSET = 'latin';
const STYLE = 'normal';

const SPEC = [
  { family: 'ibm-plex-sans', weights: [400, 500, 600, 700] },
  { family: 'jetbrains-mono', weights: [400, 500, 700] },
];

const distFonts = resolve(pkgRoot, 'dist/fonts');
await mkdir(distFonts, { recursive: true });

let copied = 0;
for (const { family, weights } of SPEC) {
  const srcDir = resolve(pkgRoot, 'node_modules/@fontsource', family, 'files');
  for (const weight of weights) {
    const filename = `${family}-${SUBSET}-${weight}-${STYLE}.woff2`;
    const from = resolve(srcDir, filename);
    if (!existsSync(from)) {
      throw new Error(
        `Missing @fontsource asset: ${from}. ` +
          `Check that @fontsource/${family} is installed and its file layout matches.`,
      );
    }
    await copyFile(from, resolve(distFonts, filename));
    copied++;
  }
}

await copyFile(resolve(pkgRoot, 'src/fonts.css'), resolve(pkgRoot, 'dist/fonts.css'));

console.log(`Copied ${copied} font files + fonts.css.`);
