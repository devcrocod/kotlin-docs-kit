#!/usr/bin/env node
/**
 * Generate docs/content/reference/tokens.mdx from packages/tokens/dist/json/tokens.json.
 *
 * The output is grouped by prefix into ~11 sections. Each section renders an
 * MDX table with three columns: the CSS variable name, the resolved value
 * (as it appears in tokens.css), and a small Preview swatch for color and
 * gradient tokens. The file is git-ignored — CI always regenerates it.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(DOCS_ROOT, '..');
const TOKENS_JSON = path.join(REPO_ROOT, 'packages', 'tokens', 'dist', 'json', 'tokens.json');
const OUT_FILE = path.join(DOCS_ROOT, 'content', 'reference', 'tokens.mdx');

/** Order matters: first matching predicate wins. */
const GROUPS = [
  {
    title: 'Brand palette',
    intro:
      'The Kotlin brand colour ramps. Use the `500` step for default brand surfaces, the lighter steps for soft variants, and the gradients (`--kt-gradient*`) for hero accents.',
    test: (k) => k.startsWith('kt-'),
  },
  {
    title: 'Neutrals',
    intro:
      '14-step gray ramp from pure white (`gray-0`) to near-black (`gray-950`). Surfaces and foregrounds compose from these.',
    test: (k) => k.startsWith('gray-'),
  },
  {
    title: 'Semantic primitive palette',
    intro:
      'Status hue ramps (`green`, `amber`, `red`, `cyan`) used by callouts and badges. The `500` step is the on-brand body colour; the `100` step backs soft callouts.',
    test: (k) =>
      k.startsWith('green-') ||
      k.startsWith('amber-') ||
      k.startsWith('red-') ||
      k.startsWith('cyan-'),
  },
  {
    title: 'Surfaces & foregrounds',
    intro:
      'Theme-aware (`[data-theme]`) layers. `surface-1` is the page background, `surface-2` the elevated background. Foregrounds `fg-1..3` go from most prominent to most muted. Borders `border-1..3` from subtle to strong. Overlay tints (`--overlay-white-*`) layer translucent white over dark surfaces to build elevation in dark mode.',
    test: (k) =>
      k.startsWith('surface-') ||
      k.startsWith('fg-') ||
      k.startsWith('border-') ||
      k.startsWith('overlay-'),
  },
  {
    title: 'Semantic roles',
    intro:
      'Role tokens — these are what components reach for. Prefer these over palette primitives so light/dark theming stays automatic.',
    test: (k) => k.startsWith('color-') || k.startsWith('focus-'),
  },
  {
    title: 'Typography',
    intro:
      'Font families (`--font-sans` IBM Plex Sans, `--font-mono` JetBrains Mono) and 8 type scale steps (display, h1–h3, body, small, caption, code), each with `-size`, `-line`, `-weight`, `-tracking`.',
    test: (k) => k.startsWith('font-') || k.startsWith('type-'),
  },
  {
    title: 'Spacing & radius',
    intro:
      'A 4 px spacing grid (`--space-0` through `--space-24`) plus six corner radii from `--radius-none` to `--radius-full`.',
    test: (k) => k.startsWith('space-') || k.startsWith('radius-'),
  },
  {
    title: 'Shadow & motion',
    intro:
      'Elevation shadows (4 steps + brand glow) and three motion durations with a shared cubic-bezier ease.',
    test: (k) => k.startsWith('shadow-') || k.startsWith('motion-'),
  },
  {
    title: 'Z-index',
    intro: 'Stacking order primitives used by the shell and overlays.',
    test: (k) => k.startsWith('z-'),
  },
  {
    title: 'Layout',
    intro:
      'Documentation shell dimensions — sidebar / TOC widths, content cap, shell max, header height, reading measure.',
    test: (k) => k.startsWith('docs-') || k.startsWith('reading-'),
  },
  {
    title: 'Code highlighting',
    intro:
      'Code-block surfaces (background, foreground, line bg, highlighted line) and 8 Pygments-style token classes (`--code-keyword`, `--code-string`, `--code-number`, `--code-comment`, `--code-function`, `--code-type`, `--code-punctuation`, `--code-tag`).',
    test: (k) => k.startsWith('code-'),
  },
];

function isColor(name, value) {
  const s = String(value);
  // Shadows (incl. `--shadow-brand-glow`) are box-shadow values, not colors —
  // they can't render as a swatch `background`, so never treat them as colors.
  if (name.startsWith('shadow-')) return false;
  if (name.startsWith('kt-gradient')) return true;
  if (/^(kt-|gray-|green-|amber-|red-|cyan-)/.test(name)) return true;
  if (name.startsWith('surface-') || name.startsWith('fg-') || name.startsWith('border-'))
    return true;
  if (name.startsWith('color-') || name.startsWith('focus-')) return true;
  if (name.startsWith('code-') && !/-size|-line|-weight|-tracking/.test(name)) return true;
  // Heuristic on value.
  if (/^#[0-9a-f]{3,8}$/i.test(s)) return true;
  if (/^rgb|^hsl|^color-mix\(|gradient/i.test(s)) return true;
  return false;
}

function escapeMdxValue(v) {
  // MDX table cell — escape pipes and wrap in backticks.
  const s = String(v);
  return '`' + s.replace(/`/g, '\\`').replace(/\|/g, '\\|') + '`';
}

function swatchCell(name, value) {
  if (!isColor(name, value)) return '';
  // Use the css var directly so the swatch tracks light/dark.
  return `<span style={{display:'inline-block',width:24,height:24,background:'var(--${name})',border:'1px solid var(--border-1)',borderRadius:4,verticalAlign:'middle'}} />`;
}

function renderTable(entries) {
  const header = '| Variable | Value | Preview |\n|---|---|---|';
  const rows = entries
    .map(([k, v]) => `| \`--${k}\` | ${escapeMdxValue(v)} | ${swatchCell(k, v)} |`)
    .join('\n');
  return `${header}\n${rows}`;
}

async function main() {
  const raw = await readFile(TOKENS_JSON, 'utf8');
  const tokens = JSON.parse(raw);

  const used = new Set();
  const sections = [];

  for (const group of GROUPS) {
    const entries = Object.entries(tokens).filter(([k]) => group.test(k));
    if (entries.length === 0) continue;
    for (const [k] of entries) used.add(k);
    sections.push({ ...group, entries });
  }

  const leftover = Object.entries(tokens).filter(([k]) => !used.has(k));
  if (leftover.length > 0) {
    console.warn(
      `[generate-tokens-mdx] ${leftover.length} ungrouped tokens: ${leftover
        .map(([k]) => k)
        .join(', ')}`,
    );
    sections.push({
      title: 'Misc',
      intro:
        'Tokens that did not match any prefix — extend `GROUPS` in `scripts/generate-tokens-mdx.mjs`.',
      entries: leftover,
    });
  }

  const body = [
    '---',
    'title: Tokens reference',
    'sidebar_label: Tokens',
    'sidebar_position: 1',
    '---',
    '',
    '<Callout type="info">',
    'This page is generated from `packages/tokens/dist/json/tokens.json` by `docs/scripts/generate-tokens-mdx.mjs`. Do not edit by hand.',
    '</Callout>',
    '',
    `The kit exposes **${Object.keys(tokens).length}** design tokens, surfaced as CSS custom properties under \`:root\`. Light/dark theming is automatic via the \`[data-theme]\` selector. Override any of these in your site's CSS to retheme without forking.`,
    '',
  ];

  for (const section of sections) {
    body.push(`## ${section.title}`);
    body.push('');
    body.push(section.intro);
    body.push('');
    body.push(renderTable(section.entries));
    body.push('');
  }

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, body.join('\n'), 'utf8');

  console.log(
    `[generate-tokens-mdx] wrote ${Object.keys(tokens).length} tokens across ${sections.length} sections to ${path.relative(REPO_ROOT, OUT_FILE)}`,
  );
}

main().catch((err) => {
  console.error('[generate-tokens-mdx] failed:', err);
  process.exit(1);
});
