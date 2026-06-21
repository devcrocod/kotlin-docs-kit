#!/usr/bin/env node
/**
 * Copy the design-system preview specimens from docs/contracts/preview/
 * into docs/static/specimen/, rewriting asset paths so each iframe can be
 * loaded standalone from Docusaurus' /specimen/ route. Each specimen pulls
 * the kit's compiled CSS + fonts + brand SVGs from /specimen/ as well, so
 * the Docusaurus host page and the specimen iframes are visually isolated
 * but share the same token values.
 *
 * Inputs:
 *   docs/contracts/preview/*.html
 *   docs/contracts/preview/_card.css
 *   packages/tokens/dist/{colors_and_type,tokens,components,fonts}.css
 *   packages/tokens/dist/fonts/
 *   packages/tokens/dist/assets/
 *
 * Output:
 *   docs/static/specimen/<slug>/index.html  (path-rewritten; emitted as a dir
 *                                            index so the extensionless route
 *                                            /specimen/<slug> resolves in every
 *                                            environment — see the write loop)
 *   docs/static/specimen/_card.css          (copied verbatim)
 *   docs/static/specimen/css/*.css          (copied from tokens dist)
 *   docs/static/specimen/fonts/             (copied from tokens dist)
 *   docs/static/specimen/assets/            (copied from tokens dist)
 */

import { mkdir, readFile, writeFile, cp, readdir, rm } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(DOCS_ROOT, '..');
const PREVIEW_SRC = path.join(DOCS_ROOT, 'contracts', 'preview');
const TOKENS_DIST = path.join(REPO_ROOT, 'packages', 'tokens', 'dist');
const OUT_DIR = path.join(DOCS_ROOT, 'static', 'specimen');

// Docusaurus serves the site (and these specimens) under `baseUrl`. The iframe
// host loads each specimen at the extensionless route `<baseUrl>specimen/<slug>`
// with NO trailing slash (trailingSlash: false in docusaurus.config), so a
// relative `../css/x` href resolves one level too high — to `<baseUrl>css/x`, a
// 404 — under `docusaurus start`. Emitting ABSOLUTE asset URLs makes them
// resolve identically in every environment (start, serve, GitHub Pages),
// independent of whether the host URL has a trailing slash.
function resolveBaseUrl() {
  try {
    const cfg = readFileSync(path.join(DOCS_ROOT, 'docusaurus.config.ts'), 'utf8');
    const m = cfg.match(/baseUrl:\s*['"]([^'"]+)['"]/);
    if (m && m[1]) return m[1].endsWith('/') ? m[1] : `${m[1]}/`;
  } catch {
    /* fall through to default */
  }
  return '/kotlin-docs-kit/';
}
const SPECIMEN_BASE = `${resolveBaseUrl()}specimen/`;

const THEME_BRIDGE_SCRIPT = `<script>
  (function () {
    var params = new URLSearchParams(window.location.search);
    var theme = params.get('theme');
    if (theme === 'dark' || theme === 'light') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  })();
</script>`;

const REPLACEMENTS = [
  // Specimens are served at `<baseUrl>specimen/<slug>`; the shared assets live
  // at `<baseUrl>specimen/{css,assets}` and `<baseUrl>specimen/_card.css`. Emit
  // ABSOLUTE URLs (SPECIMEN_BASE) so they resolve regardless of any trailing
  // slash on the host URL — see the note on SPECIMEN_BASE above.
  [/href=["']\.\.\/colors_and_type\.css["']/g, `href="${SPECIMEN_BASE}css/colors_and_type.css"`],
  [/href=["']\.\.\/tokens\.css["']/g, `href="${SPECIMEN_BASE}css/tokens.css"`],
  [/href=["']\.\.\/components\.css["']/g, `href="${SPECIMEN_BASE}css/components.css"`],
  [/href=["']\.\.\/fonts\.css["']/g, `href="${SPECIMEN_BASE}css/fonts.css"`],
  [/src=["']\.\.\/assets\//g, `src="${SPECIMEN_BASE}assets/`],
  [/href=["']\.\.\/assets\//g, `href="${SPECIMEN_BASE}assets/`],
  [/href=["']_card\.css["']/g, `href="${SPECIMEN_BASE}_card.css"`],
];

function patchHtml(html) {
  let out = html;
  for (const [pattern, replacement] of REPLACEMENTS) {
    out = out.replace(pattern, replacement);
  }
  // Always ensure the kit's three core stylesheets are present, even if a
  // specimen forgot one. (Order matters: fonts → palette → primitives →
  // components.)
  if (!/fonts\.css/.test(out)) {
    out = out.replace(
      /<head>/i,
      `<head>\n<link rel="stylesheet" href="${SPECIMEN_BASE}css/fonts.css"/>`,
    );
  }
  if (!/components\.css/.test(out)) {
    const componentsLink = `<link rel="stylesheet" href="${SPECIMEN_BASE}css/components.css"/>`;
    // Keep load order (components after the token sheets): slot it right after
    // tokens.css. If a specimen omits that link, fall back to the end of <head>
    // so components.css still loads last instead of being dropped silently.
    out = /tokens\.css/i.test(out)
      ? out.replace(/(<link[^>]+tokens\.css[^>]*>)/i, `$1\n${componentsLink}`)
      : out.replace(/<\/head>/i, `${componentsLink}\n</head>`);
  }
  // Inject the theme bridge once, right before </head>.
  if (!/theme-bridge-injected/.test(out)) {
    const tag = THEME_BRIDGE_SCRIPT.replace('<script>', '<script data-theme-bridge-injected>');
    out = out.replace(/<\/head>/i, `${tag}\n</head>`);
  }
  return out;
}

async function copyDir(src, dest) {
  if (!existsSync(src)) {
    console.warn(`[prepare-specimens] skip missing source: ${src}`);
    return;
  }
  await cp(src, dest, { recursive: true });
}

async function main() {
  if (!existsSync(PREVIEW_SRC)) {
    throw new Error(`preview source not found: ${PREVIEW_SRC}`);
  }
  if (!existsSync(TOKENS_DIST)) {
    throw new Error(
      `tokens dist not found: ${TOKENS_DIST}. Run \`pnpm --filter @ktdocs/tokens build\` first.`,
    );
  }

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.join(OUT_DIR, 'css'), { recursive: true });

  // 1. Copy tokens dist artefacts.
  for (const css of ['colors_and_type.css', 'tokens.css', 'components.css', 'fonts.css']) {
    const from = path.join(TOKENS_DIST, css);
    if (!existsSync(from)) {
      console.warn(`[prepare-specimens] missing ${from}`);
      continue;
    }
    await cp(from, path.join(OUT_DIR, 'css', css));
  }
  await copyDir(path.join(TOKENS_DIST, 'fonts'), path.join(OUT_DIR, 'fonts'));
  await copyDir(path.join(TOKENS_DIST, 'assets'), path.join(OUT_DIR, 'assets'));

  // 2. Copy shared _card.css.
  const cardCss = path.join(PREVIEW_SRC, '_card.css');
  if (existsSync(cardCss)) {
    await cp(cardCss, path.join(OUT_DIR, '_card.css'));
  }

  // 3. Walk preview HTMLs. Each is emitted as <slug>/index.html so the
  //    extensionless route /specimen/<slug> resolves as a directory index in
  //    every environment (docusaurus start, docusaurus serve, GitHub Pages).
  //    A bare <slug>.html does not: `start` falls back to the SPA and `serve`
  //    (trailingSlash:false) redirects the .html URL off-base to the homepage.
  const entries = await readdir(PREVIEW_SRC);
  let count = 0;
  for (const name of entries) {
    if (!name.endsWith('.html')) continue;
    const html = await readFile(path.join(PREVIEW_SRC, name), 'utf8');
    const patched = patchHtml(html);
    const slug = name.replace(/\.html$/, '');
    await mkdir(path.join(OUT_DIR, slug), { recursive: true });
    await writeFile(path.join(OUT_DIR, slug, 'index.html'), patched, 'utf8');
    count += 1;
  }

  console.log(
    `[prepare-specimens] wrote ${count} specimens to ${path.relative(REPO_ROOT, OUT_DIR)}`,
  );
}

main().catch((err) => {
  console.error('[prepare-specimens] failed:', err);
  process.exit(1);
});
