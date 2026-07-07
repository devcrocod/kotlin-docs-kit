# Mapping to Docusaurus

This spec describes how the kit applies the Kotlin Docs Theme System to a **Docusaurus 3** site. Docusaurus uses Infima as its CSS framework; the kit overrides Infima's custom properties and layers the `.kt-*` BEM components on top. Everything ships as one package — [`@ktdocs/docusaurus-preset`](../../../packages/docusaurus/README.md) — nothing is copied into a consumer site by hand.

## 1. Packaging — `@ktdocs/docusaurus-preset`

The token CSS from `@ktdocs/tokens` (`fonts.css`, `colors_and_type.css`, `tokens.css`, `components.css`) is bundled into the preset at build time (`scripts/copy-css.mjs` → `lib/tokens/`) and injected automatically via `theme.customCss` — consumers never copy CSS into `static/css/` or list token files in their config. The preset embeds `@docusaurus/preset-classic` (replace it in `presets`; do not list both). Install and consumer configuration live in the [preset README](../../../packages/docusaurus/README.md).

## 2. CSS chain (`src/index.ts` — `resolveKitCss`)

The preset assembles `theme.customCss` in this order:

1. `tokens/fonts.css` — `@font-face` (IBM Plex Sans, JetBrains Mono).
2. `tokens/colors_and_type.css` — palette, semantic colors, typography.
3. `tokens/tokens.css` — spacing, radius, motion, layout dims.
4. `tokens/components.css` — the `.kt-*` BEM contract.
5. `css/custom.css` — Infima remap + admonition re-skin + Prism token map (§§ 3–5).
6. `css/docusaurus-overrides.css` — Docusaurus DOM re-skin (navbar, menu, TOC, pager, …).
7. `css/copy-page-article.css` — appended **only when the `copyPage` option is on** (§ 10).
8. `css/search.css` — `@easyops-cn/docusaurus-search-local` re-skin (§ 7).

Consumer CSS passed through the preset's `theme.customCss` option is appended after all of these, so it overrides everything. The preset also unions the seven extra admonition keywords into `docs.admonitions` (§ 4) and wires the opt-in features (`seo`, `llmsTxt`, `copyPage`, `search`, `mermaid`) behind lazy resolution, so an unused feature's optional peer dependency never needs installing; the `theme-shim` theme stays last in `themes`.

## 3. `src/css/custom.css` — Infima variables

The primary ramp is **teal** (`--kt-teal-*`), the kit's interaction accent — Kotlin purple lives only in the brand gradient. Key mappings (the file is the source of truth):

```css
:root {
  --ifm-color-primary: var(--kt-teal-500); /* full ramp: teal 200–700 */

  --ifm-background-color: var(--surface-0);
  --ifm-background-surface-color: var(--surface-1);

  --ifm-font-family-base: var(--font-sans);
  --ifm-font-family-monospace: var(--font-mono);

  --ifm-code-background: var(--code-bg);
  --ifm-code-color: var(--code-fg);

  --ifm-navbar-background-color: color-mix(in srgb, var(--surface-1) 86%, transparent);
  --ifm-navbar-height: var(--docs-header-height);
  --ifm-navbar-link-color: var(--fg-2);
  --ifm-toc-link-color: var(--fg-3);
  --ifm-toc-link-color-active: var(--color-interactive);
  --ifm-menu-color: var(--fg-2);
  --ifm-menu-color-active: var(--color-interactive);
  /* Mintlify minimalism: the active nav item is teal TEXT only. Must be unset
     at the var level — Infima's .menu__link--active:not(.menu__link--sublist)
     outranks any single-class override (the known specificity gotcha). */
  --ifm-menu-color-background-active: transparent;

  /* Keep Infima's content-width reservation in sync with the kit token, or a
     dead gap opens beside the sidebar. */
  --doc-sidebar-width: var(--docs-sidebar-width);

  --ifm-link-color: var(--color-link);
  --ifm-link-hover-color: var(--color-link-hover);
}
```

The dark override block must be `html[data-theme='dark']` (specificity 0-1-1), **not** the bare attribute selector: Infima's own dark block sets `--ifm-background-color: #1b1b1d` at 0-1-1, and a bare `[data-theme='dark']` (0-1-0) loses to it — the page background resolves to Infima's grey instead of the kit's `--surface-0` (the "black→grey" symptom). Docusaurus toggles `data-theme` on `<html>` natively, so the kit token files just work; `color-scheme` is pinned per mode.

## 4. Admonition mapping

MDX admonitions (`:::note` …) render as `<div class="theme-admonition theme-admonition-<kind>">`; `custom.css` re-skins all 12 kinds onto the kit callout palette (`--color-<kind>-soft` background, `--color-<kind>` left border) so they match `.kt-callout--<kind>`.

Docusaurus ships note / tip / info / warning / danger. The preset registers the other seven **automatically** — consumers do not add `admonitions.keywords`; user-supplied keywords are unioned with the kit list, never replacing it. The `Admonition/Types` swizzle maps each extra keyword to a real admonition type with the kit `CalloutIcon`, and corrects theme-classic's legacy aliases (`:::success` → Tip, `:::important` → Info), which would otherwise emit the wrong host class and miss the kit palette.

### Full mapping table

| MDX               | Re-skinned to               | Registered by            |
| ----------------- | --------------------------- | ------------------------ |
| `:::note`         | `.kt-callout--note`         | Docusaurus builtin       |
| `:::info`         | `.kt-callout--info`         | Docusaurus builtin       |
| `:::tip`          | `.kt-callout--tip`          | Docusaurus builtin       |
| `:::warning`      | `.kt-callout--warning`      | Docusaurus builtin       |
| `:::danger`       | `.kt-callout--danger`       | Docusaurus builtin       |
| `:::success`      | `.kt-callout--success`      | preset (alias corrected) |
| `:::caution`      | `.kt-callout--caution`      | preset                   |
| `:::important`    | `.kt-callout--important`    | preset (alias corrected) |
| `:::quote`        | `.kt-callout--quote`        | preset                   |
| `:::example`      | `.kt-callout--example`      | preset                   |
| `:::deprecated`   | `.kt-callout--deprecated`   | preset                   |
| `:::experimental` | `.kt-callout--experimental` | preset                   |

## 5. Code blocks

Fenced code renders through the preset's **swizzled CodeBlock** (`src/theme/CodeBlock`), which emits the `.kt-codeblock` contract DOM directly:

- `.kt-codeblock__header` carries either `.kt-codeblock__title` (blocks with `title="…"` — `file-text` icon + filename; 0.2.0, formerly a lone fake active tab) or `.kt-codeblock__lang`, plus `.kt-codeblock__actions` with the copy button.
- The body is `<pre class="kt-codeblock__body">` of `.kt-codeblock__line` spans (`--hl` for `{2,4-5}` metastring highlights, `.kt-codeblock__lineno` with `showLineNumbers`).
- Terminal languages (`bash`, `shell`, `sh`, `zsh`, `console`, `terminal`) add `.kt-codeblock--terminal`.

Prism token colors map to the `--code-*` tokens in `custom.css`, scoped to `.kt-codeblock__body .token.*` — **not** Prism's native `.prism-code` wrapper, which the swizzle does not render.

`docusaurus-overrides.css` keeps a fallback re-skin of the stock `[class^='codeBlockContainer']` / `[class^='codeBlockTitle']` DOM for anything rendered outside the swizzle, and themes inline code via `:not(pre) > code`.

**Multi-file tabs** are the `<CodeTabs items={[{label, language, code}]}>` MDX global — `.kt-codeblock__tabs` (`role="tablist"`) inside the same header. For content tabs keep Docusaurus's `<Tabs>` / `<TabItem>`; their DOM is re-skinned via CSS to match `.kt-tabs`.

## 6. Cards on docs homepages

Use the globally registered MDX components (no imports needed): `<CardGrid>` emits `.kt-card-grid`; `<Card>` emits `.kt-card` with `.kt-card__icon` / `.kt-card__title` / `.kt-card__body` / `.kt-card__arrow`. With `href` the card renders as a `@docusaurus/Link` anchor (baseUrl-safe, SPA navigation) and defaults to `--hoverable`:

```mdx
<CardGrid>
  <Card href="/quickstart" icon="⚡" title="Quickstart" arrow>
    Get a Kotlin server running in 5 minutes.
  </Card>
</CardGrid>
```

## 7. Navbar tabs & search (0.2.0)

**Tabs need no preset option** — they are native navbar items; each `docSidebar` item owns a sidebar tree (split `sidebars.ts` accordingly), and a single-page tab is a plain `doc` link:

```js
navbar: {
  items: [
    { type: 'docSidebar', sidebarId: 'docs', label: 'Docs', position: 'left' },
    { type: 'docSidebar', sidebarId: 'reference', label: 'Reference', position: 'left' },
    { type: 'doc', docId: 'changelog', label: 'Changelog', position: 'left' },
  ],
},
```

The preset styles the emitted `.navbar__link` / `.navbar__link--active` as neutral `surface-2` pills in `docusaurus-overrides.css` — the Mintlify pattern, **no teal**: the interaction accent stays reserved for the nav tree / TOC / links. Mind Infima specificity for active states (known gotcha: var-level overrides were needed for nav-active theming). The GitHub icon button stays a `type: 'html'` navbar item wrapping an inline `fill="currentColor"` SVG (`.header-github-link` — a CSS-mask `::before` did not render).

**Search** (the preset's `search` option = `@easyops-cn/docusaurus-search-local`) is a **CSS-only re-skin** in the preset's `src/css/search.css`. The backend renders `.navbar__search > .navbar__search-input` plus its own kbd hint chips (already platform-sniffed: ⌘ K on mac, ctrl K elsewhere); those stable classes are themed onto the kit trigger contract, and the results dropdown (hashed CSS-module classes) is themed via `[class*='…']` attribute selectors scoped under `.navbar__search` — an accepted risk pinned by the easyops peer range. The backend renders **no** `.DocSearch-*` DOM and reads no `--docsearch-*` vars — the previous rules targeting those were dead code and were pruned in 0.2.0.

**Mobile drawer** is Docusaurus' native `.navbar-sidebar`, themed onto kit surfaces in `docusaurus-overrides.css`: the primary menu mirrors all navbar items (the tabs appear automatically as the stacked block; the mirrored GitHub html item gets a row box), the secondary menu is the doc tree with the same `.menu` re-skin as desktop, and the GitHub icon leaves the top bar below 997 px. Gotcha (fixed in 0.2.0): a `backdrop-filter` on `.navbar` itself makes it the containing block for the fixed-position `.navbar-sidebar`, collapsing the drawer into the 60 px bar — the blur lives on a `.navbar::before` pseudo instead.

## 8. Sidebar tree & section icons

The preset ships an **ejected** `DocSidebarItem/Category` (ported from theme-classic, pinned by the `^3.5.0` peer range) whose functional change is icon injection: categories opt in via `customProps` in `sidebars.ts`, rendered with `KtIcon` before the label:

```js
{
  type: 'category',
  label: 'Getting started',
  customProps: { icon: 'rocket' },
  items: [
    /* … */
  ],
}
```

`KtIcon` (`src/theme/Icon`) renders an inline SVG (24 × 24 viewBox, stroke 1.5, `currentColor`) from `src/theme/Icon/data.generated.ts` — generated from `@ktdocs/tokens` `dist/icons.json`, the same source of truth as the Hugo theme's `kt-icons.generated.html`. Unknown names render nothing (console warning in dev builds). Fallback if the ejected Category ever proves brittle across Docusaurus minors: `className`-based icons via CSS `mask-image` data URIs (note the earlier CSS-mask navbar failure before choosing it).

The tree's visual mapping stays CSS over `.menu__*` (`docusaurus-overrides.css`): level-1 categories render as mono uppercase group headers with carets hidden (use `collapsible: false` — group headers are not toggles), nested lists get the hairline indent rail, the active item is **teal text only** (the 0.1.x soft background is removed), and an active nested item paints its 2 px rail segment teal. Collapse is native and multi-open — keep `autoCollapseCategories: false`.

## 9. TOC

The `TOC` wrapper (`src/theme/TOC`) wraps the native TOC in a `.kt-toc` host and prepends the real label row — `list` glyph (`KtIcon`) + "On this page" (`.kt-toc__label` / `.kt-toc__label-icon`). The **host itself is the sticky box** (`docusaurus-overrides.css`): label and list stick together, and the inner `.theme-doc-toc-desktop` sticky is neutralized with `position: static` — this replaces the old `.kt-toc { display: contents }` fix. Items are themed on `.table-of-contents__link`: quiet 13 px links, ellipsized; the active item (Docusaurus's own scroll-spy sets `--active`) gets teal text plus the 4 px teal gutter dot.

## 10. Article header — eyebrow + copy page

`DocBreadcrumbs` is no longer a thin wrapper: it is a **full custom component** rendering the eyebrow (`<p class="kt-eyebrow theme-doc-breadcrumbs">`) instead of a breadcrumb trail. Label derivation: `useSidebarBreadcrumbs()` (the entry before the current page = its immediate parent) → the owning navbar tab (matching `useDocsSidebar().name` against `type: 'docSidebar'` navbar items) → hidden; also hidden when the label equals `useDoc().metadata.title`. All three hooks come from `@docusaurus/plugin-content-docs/client` — an unstable API surface pinned by the `^3.5.0` peer range. The `theme-doc-breadcrumbs` class is deliberately kept on the element: the copy-page plugin anchors its article-mode injection "after breadcrumbs" when that class is a direct child of `<article>`.

Copy-page placement lives in `src/css/copy-page-article.css`, appended to the preset CSS chain **only when the `copyPage` option is on** (see `src/index.ts`). The plugin injects `#copy-page-button-container` into `<article>` post-hydration; the sheet pins it absolutely onto the H1 row (`<article>` is the positioning context via `docusaurus-overrides.css`), drops it onto the H1 baseline when an eyebrow is present (`article:has(> .kt-eyebrow)`), reserves 150 px beside the H1 at ≥ 997 px so hydration causes no layout shift, and returns the control to static right-aligned flow below 997 px. Button/menu skinning stays on the `.kt-copy-page*` classes passed through the plugin's `customStyles` (keep the `right: auto` menu reset — known dropdown-stretch gotcha).

## 11. Accordion, Related topics & pager cards (0.2.0)

**Accordion / AccordionGroup** are plain MDX components (`src/theme/components/Accordion*`), registered globally in `MDXComponents.tsx` and exported by name from the `./components` barrel (`@ktdocs/docusaurus-preset/components`). They emit the contract's `<details class="kt-accordion">` / `<div class="kt-accordion-group">` DOM directly — no swizzle, no JS: `title` renders the summary label after the `chevron-right` `KtIcon`, `defaultOpen` maps to the native `open` attribute.

**Related topics** live in the `DocItem/Footer` **wrapper** — DocItem/Footer sits exactly between the content and the paginator, so the `.kt-related` section renders before the original footer (`@theme-init/DocItem/Footer`). The wrapper reads `useDoc().frontMatter.related` (an array of **doc IDs**) and resolves each entry twice: the title from `useDocsVersion().docs` (the version's docs map) and the permalink from `useActivePluginAndVersion()` global data. IDs missing from either source are skipped with a dev-only console warning — never a build failure; with no resolvable entries the section is omitted and only the original footer renders.

**Pager cards** are a **CSS-only re-skin** of Infima's `.pagination-nav` in `docusaurus-overrides.css` — the native DocPaginator DOM is untouched. `.pagination-nav__sublabel` / `__label` are themed onto the direction-label / title anatomy, and the `arrow-left` / `arrow-right` chevrons are masked `::before` / `::after` pseudos (SVG `mask-image` data URIs) replacing Infima's `«` / `»` label pseudos (`content: none`). The `DocPaginator` wrapper hosts it all in a `.kt-docs-pager` div for contract addressability, but that host is `display: contents` — `.kt-docs-pager` is itself a 2-column grid in `components.css`, and nesting it around `.pagination-nav`'s own grid would quarter the cards; `.pagination-nav` carries the rhythm (top border, 48 px margin) instead.

## 12. Done

Build & serve:

```bash
npm run start
```

Check: navbar shows the Kotlin wordmark with neutral tab pills, the sidebar tree shows mono section headers with icons and a teal-text active item, the article opens with a teal eyebrow above the H1 + Copy page row, admonitions look like our callouts, and code blocks render in JetBrains Mono with the kit code palette.
