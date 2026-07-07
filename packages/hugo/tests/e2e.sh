#!/usr/bin/env bash
# End-to-end smoke test for the kotlin-docs-hugo theme module.
# Builds the minimal fixture site with `hugo --minify` and greps the
# generated HTML for the BEM contract markers from
# docs/contracts/components.md. Skips cleanly when hugo or go is missing
# so this test is safe to run in environments that lack the Go toolchain.

set -euo pipefail

if ! command -v hugo >/dev/null 2>&1; then
  echo "SKIP: hugo binary not found on PATH"
  exit 0
fi
if ! command -v go >/dev/null 2>&1; then
  echo "SKIP: go binary not found on PATH (required by hugo mod)"
  exit 0
fi

PKG_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SITE_DIR="$PKG_DIR/__fixtures__/minimal-site"
PUB_DIR="$SITE_DIR/public"

echo "==> Building fixture site at $SITE_DIR"
rm -rf "$PUB_DIR" "$SITE_DIR/public-sub" "$SITE_DIR/resources" "$SITE_DIR/.hugo_build.lock"
( cd "$SITE_DIR" && hugo --minify --quiet )

INDEX="$PUB_DIR/index.html"
NEXT="$PUB_DIR/next/index.html"

if [[ ! -f "$INDEX" ]]; then
  echo "FAIL: $INDEX not produced"
  exit 1
fi
if [[ ! -f "$NEXT" ]]; then
  echo "FAIL: $NEXT not produced"
  exit 1
fi

# BEM markers that MUST appear in the rendered HTML. Drawn from
# docs/contracts/components.md and the shortcodes/layouts we ship.
MARKERS=(
  "kt-docs-shell"
  "kt-docs-shell__side"
  "kt-docs-shell__main"
  "kt-docs-shell__toc"
  "kt-docs-article"
  "kt-topnav"
  "kt-topnav__brand"
  "kt-topnav__version"
  "kt-topnav__tabs"
  "kt-docs-search"
  "aria-label=\"GitHub repository\""
  "kt-sidenav"
  "kt-sidenav__sec-label"
  "kt-callout"
  "kt-callout--tip"
  "kt-callout__icon"
  "kt-callout__body"
  "kt-codeblock"
  "kt-codeblock__tab--active"
  "kt-codeblock__panel"
  "kt-card-grid"
  "kt-card"
  "kt-card--hoverable"
  "kt-feature-grid"
  "kt-docs-hero"
  "kt-docs-hero__grad-text"
  "kt-tabs"
  "kt-tabs__tab--active"
  "kt-tabs__panel--active"
  "kt-badge"
  "kt-badge--success"
  "kt-pill"
  "kt-toggle"
  "kt-segmented"
  "kt-segmented__segment"
  "kt-method--get"
  "kt-params"
  "kt-params__name"
  "kt-state"
  "kt-state__icon"
  "kt-state__title"
)

echo "==> Verifying BEM markers in $INDEX"
fail=0
for m in "${MARKERS[@]}"; do
  if ! grep -q "$m" "$INDEX"; then
    echo "MISS: $m"
    fail=$((fail + 1))
  fi
done

# Pager + article header should appear on next.md (it has _index.md as a sibling).
echo "==> Verifying pager and article header on $NEXT"
for m in kt-docs-pager kt-article-header kt-article-header__titlebar; do
  if ! grep -q "$m" "$NEXT"; then
    echo "MISS: $m (in next/index.html)"
    fail=$((fail + 1))
  fi
done

# Shell redesign markers: eyebrow + active tab + tab-scoped sidebar on a page
# inside the Docs tab; recursive tree (nested group, rail list, active nested
# item, pre-expanded ancestor chain) on the deeply nested page.
SETUP="$PUB_DIR/guides/setup/index.html"
TUNING="$PUB_DIR/guides/advanced/tuning/index.html"
echo "==> Verifying eyebrow, tabs and recursive sidebar on $SETUP"
for m in kt-eyebrow kt-topnav__tab--active kt-sidenav__sec-icon; do
  if ! grep -q "$m" "$SETUP"; then
    echo "MISS: $m (in guides/setup/index.html)"
    fail=$((fail + 1))
  fi
done
# --minify may strip attribute quotes, so match both forms.
if ! grep -Eq 'data-nav-key="?/guides/"?' "$SETUP"; then
  echo "MISS: tab-scoped sidebar nav key (in guides/setup/index.html)"
  fail=$((fail + 1))
fi
for m in kt-sidenav__group kt-sidenav__group-toggle kt-sidenav__list--nested; do
  if ! grep -q "$m" "$TUNING"; then
    echo "MISS: $m (in guides/advanced/tuning/index.html)"
    fail=$((fail + 1))
  fi
done
if ! grep -Eq 'aria-expanded="?true"?' "$TUNING"; then
  echo "MISS: pre-expanded active ancestor chain (in guides/advanced/tuning/index.html)"
  fail=$((fail + 1))
fi

# Asset files that should exist in public/.
echo "==> Verifying published assets"
shopt -s nullglob
bundles=("$PUB_DIR"/css/bundle.*.css)
if [[ ${#bundles[@]} -eq 0 ]]; then
  echo "MISS: $PUB_DIR/css/bundle.*.css"
  fail=$((fail + 1))
fi
for f in img/kotlin-icon-color.svg fonts/ibm-plex-sans-latin-400-normal.woff2; do
  if [[ ! -f "$PUB_DIR/$f" ]]; then
    echo "MISS: $PUB_DIR/$f"
    fail=$((fail + 1))
  fi
done

# AI-friendly endpoints — wired by [outputs] in the fixture hugo.toml. These are
# a headline feature (parity with the Docusaurus llms.txt + copy-page), and Hugo
# does NOT merge [outputs] from a module, so this guards that the opt-in keeps
# producing the copy-page control, the llms.txt/llms-full.txt corpora and the
# per-page/per-section Markdown twins (single.md / list.md output templates).
echo "==> Verifying AI endpoints (copy-page, llms.txt, MD twins)"
if ! grep -q "kt-copy-page" "$NEXT"; then
  echo "MISS: kt-copy-page (in next/index.html — page MD twin / [outputs] not wired?)"
  fail=$((fail + 1))
fi
for f in llms.txt llms-full.txt; do
  if [[ ! -s "$PUB_DIR/$f" ]]; then
    echo "MISS: $PUB_DIR/$f (empty or absent)"
    fail=$((fail + 1))
  fi
done
# llms.txt must index the guides section — validates the section-iterating template.
if ! grep -q "Guides" "$PUB_DIR/llms.txt"; then
  echo "MISS: 'Guides' section entry in llms.txt"
  fail=$((fail + 1))
fi
# Markdown twins: page (single.md) and section landing (list.md).
for f in next/index.md guides/index.md guides/setup/index.md; do
  if [[ ! -f "$PUB_DIR/$f" ]]; then
    echo "MISS: $PUB_DIR/$f (MD twin not produced)"
    fail=$((fail + 1))
  fi
done
# Card links inside a section MD twin must resolve to the canonical URL, not the
# .md output path — guards card.html resolving hrefs against the HTML permalink
# rather than the per-output-format RelPermalink (…/index.md/setup/ regression).
if grep -q "index.md/setup" "$PUB_DIR/guides/index.md"; then
  echo "MISS: card href in guides/index.md leaked the .md path (expected /guides/setup/)"
  fail=$((fail + 1))
fi

# Sub-path regression guard: the topnav brand/logo must resolve under the
# baseURL sub-path, not the domain root. Catches `"/" | relURL` (which renders a
# bare "/") creeping back into partials/header.html. Built without --minify so
# the href quoting stays grep-stable.
echo "==> Verifying brand link resolves under a sub-path baseURL"
( cd "$SITE_DIR" && hugo --quiet --baseURL https://example.com/sub/ --destination public-sub )
if ! grep -q 'kt-topnav__brand" href="/sub/"' "$SITE_DIR/public-sub/index.html"; then
  echo "MISS: brand link not under /sub/ (relURL \"/\" regression in header.html?)"
  fail=$((fail + 1))
fi

if (( fail > 0 )); then
  echo "FAIL: $fail marker(s) missing"
  exit 1
fi
echo "PASS: all BEM markers and assets present"
