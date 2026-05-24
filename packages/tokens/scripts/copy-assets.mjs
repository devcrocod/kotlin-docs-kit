// Copy src/assets/ (Kotlin brand SVGs + NOTICE.md) into dist/assets/ verbatim.

import { cp, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, '..');

const distAssets = resolve(pkgRoot, 'dist/assets');
await mkdir(distAssets, { recursive: true });
await cp(resolve(pkgRoot, 'src/assets'), distAssets, { recursive: true });

console.log('Copied src/assets/ -> dist/assets/.');
