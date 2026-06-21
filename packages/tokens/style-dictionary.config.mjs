// Style Dictionary build for @ktdocs/tokens.
// Reads DTCG W3C JSON in src/ and emits:
//   dist/colors_and_type.css   — primitives + light/dark semantics + typography
//   dist/tokens.css            — spacing/radius/shadow/motion/z/layout
//   dist/scss/_tokens.scss     — all tokens as Sass variables
//   dist/json/tokens.json      — flat JSON for tooling
//
// Run directly with `node style-dictionary.config.mjs`.

import StyleDictionary from 'style-dictionary';

import { cssNameFromPath } from './scripts/name-utils.mjs';
import { kitColorsAndTypeFormat } from './scripts/format-colors-and-type.mjs';
import { kitTokensCssFormat } from './scripts/format-tokens-css.mjs';

const REF_RE = /^\{([A-Za-z0-9_.-]+)\}$/;

// --- parsers ---------------------------------------------------------------

// One parser handles all per-file pre-processing:
//   1. Strip file-level $description — it doesn't survive merge and only
//      generates noisy collision warnings.
//   2. shadow.json: drop the `shadow.dark` subtree. After our name transform
//      those would collide with the light variants on the same CSS variable
//      name. The dark block is emitted directly from JSON by the formatter.
//   3. semantic.dark.json: drop entirely — it overlaps semantic.light on every
//      path. Also emitted directly from JSON by the formatter.
StyleDictionary.registerParser({
  name: 'kit/preprocess',
  pattern: /\.json$/,
  parser: ({ contents, filePath }) => {
    if (/semantic\.dark\.json$/.test(filePath)) {
      return {};
    }
    const data = JSON.parse(contents);
    if (data && typeof data === 'object' && '$description' in data) {
      delete data.$description;
    }
    if (/shadow\.json$/.test(filePath) && data.shadow?.dark) {
      delete data.shadow.dark;
    }
    return data;
  },
});

// --- transforms ------------------------------------------------------------

// `{color.kt-purple.500}` -> `var(--kt-purple-500)` instead of resolving to the
// hex. Preserves the cascade so theme overrides at the variable layer work.
StyleDictionary.registerTransform({
  name: 'value/kit/refToVar',
  type: 'value',
  transitive: true,
  filter: (token) =>
    typeof token.original?.$value === 'string' && REF_RE.test(token.original.$value),
  transform: (token) => {
    const match = token.original.$value.match(REF_RE);
    const segments = match[1].split('.');
    return `var(--${cssNameFromPath(segments)})`;
  },
});

// fontFamily array -> CSS-safe joined string. Families containing spaces are
// quoted; everything else stays bare.
StyleDictionary.registerTransform({
  name: 'value/kit/fontFamily',
  type: 'value',
  filter: (token) => token.$type === 'fontFamily',
  transform: (token) =>
    token.$value.map((family) => (/\s/.test(family) ? `"${family}"` : family)).join(', '),
});

// cubicBezier array -> CSS `cubic-bezier(...)` literal.
StyleDictionary.registerTransform({
  name: 'value/kit/cubicBezier',
  type: 'value',
  filter: (token) => token.$type === 'cubicBezier',
  transform: (token) => `cubic-bezier(${token.$value.join(', ')})`,
});

// Custom name builder — see scripts/name-utils.mjs for the rules.
StyleDictionary.registerTransform({
  name: 'name/kit/css',
  type: 'name',
  transform: (token) => cssNameFromPath(token.path),
});

// --- transform groups ------------------------------------------------------

StyleDictionary.registerTransformGroup({
  name: 'kit/css',
  transforms: [
    'attribute/cti',
    'name/kit/css',
    'value/kit/refToVar',
    'value/kit/fontFamily',
    'value/kit/cubicBezier',
  ],
});

// For SCSS and JSON we want fully-resolved values (consumers don't have the
// CSS variable cascade), so we omit refToVar but keep our naming.
StyleDictionary.registerTransformGroup({
  name: 'kit/scss',
  transforms: ['attribute/cti', 'name/kit/css', 'value/kit/fontFamily', 'value/kit/cubicBezier'],
});

StyleDictionary.registerTransformGroup({
  name: 'kit/json',
  transforms: ['attribute/cti', 'name/kit/css', 'value/kit/fontFamily', 'value/kit/cubicBezier'],
});

// --- formats ---------------------------------------------------------------

StyleDictionary.registerFormat({
  name: 'css/kit-colors-and-type',
  format: kitColorsAndTypeFormat,
});

StyleDictionary.registerFormat({
  name: 'css/kit-tokens',
  format: kitTokensCssFormat,
});

// --- build -----------------------------------------------------------------

const sd = new StyleDictionary({
  source: ['src/**/*.json'],
  parsers: ['kit/preprocess'],
  log: { warnings: 'warn', verbosity: 'default' },
  platforms: {
    css: {
      transformGroup: 'kit/css',
      buildPath: 'dist/',
      files: [
        { destination: 'colors_and_type.css', format: 'css/kit-colors-and-type' },
        { destination: 'tokens.css', format: 'css/kit-tokens' },
      ],
    },
    scss: {
      transformGroup: 'kit/scss',
      buildPath: 'dist/scss/',
      files: [{ destination: '_tokens.scss', format: 'scss/variables' }],
    },
    json: {
      transformGroup: 'kit/json',
      buildPath: 'dist/json/',
      files: [{ destination: 'tokens.json', format: 'json/flat' }],
    },
  },
});

await sd.hasInitialized;
await sd.buildAllPlatforms();
