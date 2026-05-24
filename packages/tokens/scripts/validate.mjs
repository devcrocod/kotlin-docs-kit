// Validate every src/**/*.json against the DTCG subset schema in
// schemas/dtcg.schema.json. Walker logic: a node is a leaf iff it has $value.
// Reference strings (`{path.to.token}`) are accepted for any $type.

import Ajv from 'ajv';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const schema = JSON.parse(
  await readFile(resolve(root, 'schemas/dtcg.schema.json'), 'utf8'),
);

const ajv = new Ajv({ allErrors: true, strict: false });
const validators = Object.fromEntries(
  Object.entries(schema.definitions.valueByType).map(([type, sub]) => [
    type,
    ajv.compile(sub),
  ]),
);

const REF_RE = /^\{[A-Za-z0-9_.-]+\}$/;
const isLeaf = (node) =>
  node !== null && typeof node === 'object' && !Array.isArray(node) && '$value' in node;

let errorCount = 0;

function reportError(file, path, message, details) {
  errorCount++;
  const where = path.length ? path.join('.') : '<root>';
  console.error(`[${file}] ${where}: ${message}`);
  if (details) console.error('  ', JSON.stringify(details));
}

function validateTree(node, path, file) {
  if (node === null || typeof node !== 'object') return;
  if (Array.isArray(node)) return;

  if (isLeaf(node)) {
    const type = node.$type;
    if (!type) {
      reportError(file, path, 'missing $type on leaf token');
      return;
    }
    const validator = validators[type];
    if (!validator) {
      reportError(file, path, `unknown $type "${type}"`);
      return;
    }
    if (typeof node.$value === 'string' && REF_RE.test(node.$value)) return;
    if (!validator(node.$value)) {
      reportError(file, path, `invalid $value for $type=${type}`, validator.errors);
    }
    return;
  }

  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    validateTree(child, [...path, key], file);
  }
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      yield full;
    }
  }
}

let fileCount = 0;
for await (const file of walk(resolve(root, 'src'))) {
  fileCount++;
  const rel = relative(root, file);
  const data = JSON.parse(await readFile(file, 'utf8'));
  validateTree(data, [], rel);
}

if (errorCount > 0) {
  console.error(`\n${errorCount} validation error(s) across ${fileCount} files.`);
  process.exit(1);
}

console.log(`All token files valid (${fileCount} files).`);
