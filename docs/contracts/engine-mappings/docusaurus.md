# Mapping to Docusaurus

This guide explains how to apply the Kotlin Docs Theme System to a **Docusaurus 3** site. Docusaurus already uses Infima as its CSS framework; we override Infima's custom properties and add our own.

## 1. Files to copy into `static/css/`

```
your-site/
├── static/
│   └── css/
│       ├── colors_and_type.css
│       ├── tokens.css
│       └── components.css
├── static/
│   └── img/
│       ├── kotlin-icon-color.svg
│       ├── kotlin-logo.svg
│       └── kotlin-logo-dark.svg
└── src/
    └── css/
        └── custom.css       # the override file below
```

## 2. `docusaurus.config.js` — wire CSS & logo

```js
module.exports = {
  title: 'Your Project Docs',
  themeConfig: {
    navbar: {
      logo: {
        alt: 'Kotlin',
        src: 'img/kotlin-logo.svg',
        srcDark: 'img/kotlin-logo-dark.svg',
      },
      // ...
    },
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    prism: {
      theme: require('prism-react-renderer/themes/vsLight'),
      darkTheme: require('prism-react-renderer/themes/vsDark'),
      additionalLanguages: ['kotlin', 'java', 'groovy'],
    },
  },
  presets: [
    [
      'classic',
      {
        theme: {
          customCss: [
            require.resolve('./static/css/colors_and_type.css'),
            require.resolve('./static/css/tokens.css'),
            require.resolve('./static/css/components.css'),
            require.resolve('./src/css/custom.css'),
          ],
        },
      },
    ],
  ],
};
```

## 3. `src/css/custom.css` — translate Infima variables

```css
:root {
  --ifm-color-primary: var(--kt-purple-500);
  --ifm-color-primary-dark: var(--kt-purple-600);
  --ifm-color-primary-darker: var(--kt-purple-700);
  --ifm-color-primary-darkest: var(--kt-purple-800);
  --ifm-color-primary-light: var(--kt-purple-400);
  --ifm-color-primary-lighter: var(--kt-purple-300);
  --ifm-color-primary-lightest: var(--kt-purple-200);

  --ifm-background-color: var(--surface-0);
  --ifm-background-surface-color: var(--surface-1);

  --ifm-font-family-base: 'IBM Plex Sans', system-ui, sans-serif;
  --ifm-font-family-monospace: 'JetBrains Mono', monospace;
  --ifm-font-size-base: var(--type-body-size);
  --ifm-line-height-base: var(--type-body-line);
  --ifm-heading-font-weight: 600;

  --ifm-code-background: var(--code-bg);
  --ifm-code-color: var(--code-fg);
  --ifm-code-font-size: var(--type-code-size);
  --ifm-code-border-radius: var(--radius-sm);

  --ifm-navbar-background-color: color-mix(in srgb, var(--surface-1) 86%, transparent);
  --ifm-navbar-height: var(--docs-header-height);
  --ifm-toc-border-color: var(--border-1);
  --ifm-toc-link-color: var(--fg-2);
  --ifm-toc-link-color-active: var(--color-primary);
  --ifm-menu-color-active: var(--color-primary);
  --ifm-menu-color-background-active: var(--color-primary-soft);

  --ifm-link-color: var(--color-link);
  --ifm-link-hover-color: var(--color-link-hover);

  --ifm-global-radius: var(--radius-md);
  --ifm-card-border-radius: var(--radius-lg);
}

[data-theme='dark'] {
  --ifm-color-primary: var(--kt-purple-400);
  --ifm-color-primary-dark: var(--kt-purple-500);
  --ifm-color-primary-darker: var(--kt-purple-600);
  --ifm-color-primary-darkest: var(--kt-purple-700);
  --ifm-color-primary-light: var(--kt-purple-300);
  --ifm-color-primary-lighter: var(--kt-purple-200);
  --ifm-color-primary-lightest: var(--kt-purple-100);
}
```

Docusaurus already sets `data-theme="dark"` on `<html>` for dark mode — so our token file just works.

## 4. Admonition mapping

Docusaurus uses MDX admonitions: `:::note`, `:::tip`, `:::info`, `:::warning`, `:::danger`. They render as `<div class="theme-admonition theme-admonition-note">`. Add CSS that re-skins them to our callouts:

```css
.theme-admonition {
  border-radius: var(--radius-md);
  border-left: 3px solid;
  padding: 14px 16px;
  margin: 16px 0;
  font-family: var(--font-sans);
  font-size: var(--type-body-size);
}
.theme-admonition-note {
  background: var(--color-note-soft);
  border-left-color: var(--color-note);
}
.theme-admonition-info {
  background: var(--color-info-soft);
  border-left-color: var(--color-info);
}
.theme-admonition-tip {
  background: var(--color-tip-soft);
  border-left-color: var(--color-tip);
}
.theme-admonition-success {
  background: var(--color-success-soft);
  border-left-color: var(--color-success);
}
.theme-admonition-warning {
  background: var(--color-warning-soft);
  border-left-color: var(--color-warning);
}
.theme-admonition-caution {
  background: var(--color-caution-soft);
  border-left-color: var(--color-caution);
}
.theme-admonition-danger {
  background: var(--color-danger-soft);
  border-left-color: var(--color-danger);
}
.theme-admonition-important {
  background: var(--color-important-soft);
  border-left-color: var(--color-important);
}
.theme-admonition-quote {
  background: var(--color-quote-soft);
  border-left-color: var(--color-quote);
}
.theme-admonition-example {
  background: var(--color-example-soft);
  border-left-color: var(--color-example);
}
.theme-admonition-deprecated {
  background: var(--color-deprecated-soft);
  border-left-color: var(--color-deprecated);
}
.theme-admonition-experimental {
  background: var(--color-experimental-soft);
  border-left-color: var(--color-experimental);
}
```

Docusaurus ships note / tip / info / warning / danger out of the box. Register the other seven as custom admonitions in `docusaurus.config.js`:

```js
themeConfig: {
  admonitions: {
    keywords: [
      "success", "caution", "important",
      "quote", "example", "deprecated", "experimental",
    ],
    extendDefaults: true,
  },
},
```

### Full mapping table

| MDX               | Callout class           | Builtin?                |
| ----------------- | ----------------------- | ----------------------- |
| `:::note`         | `.callout-note`         | ✓                       |
| `:::info`         | `.callout-info`         | ✓                       |
| `:::tip`          | `.callout-tip`          | ✓                       |
| `:::warning`      | `.callout-warning`      | ✓                       |
| `:::danger`       | `.callout-danger`       | ✓                       |
| `:::success`      | `.callout-success`      | register via `keywords` |
| `:::caution`      | `.callout-caution`      | register via `keywords` |
| `:::important`    | `.callout-important`    | register via `keywords` |
| `:::quote`        | `.callout-quote`        | register via `keywords` |
| `:::example`      | `.callout-example`      | register via `keywords` |
| `:::deprecated`   | `.callout-deprecated`   | register via `keywords` |
| `:::experimental` | `.callout-experimental` | register via `keywords` |

## 5. Code blocks

Docusaurus uses Prism for syntax highlighting via `prism-react-renderer`. Map Prism's token classes to ours in `custom.css`:

```css
.prism-code .token.keyword,
.prism-code .token.builtin {
  color: var(--code-keyword);
}
.prism-code .token.string {
  color: var(--code-string);
}
.prism-code .token.number {
  color: var(--code-number);
}
.prism-code .token.comment {
  color: var(--code-comment);
  font-style: italic;
}
.prism-code .token.function {
  color: var(--code-function);
}
.prism-code .token.class-name,
.prism-code .token.type {
  color: var(--code-type);
}
.prism-code .token.punctuation {
  color: var(--code-punctuation);
}
```

Re-skin the code block wrapper to match `.codeblock`:

```css
[class^='codeBlockContainer'] {
  background: var(--code-bg) !important;
  border: 1px solid var(--border-1);
  border-radius: var(--radius-lg);
}
[class^='codeBlockTitle'] {
  background: var(--surface-2);
  border-bottom: 1px solid var(--border-1);
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--fg-2);
}
```

For **file tabs** above multiple code blocks, use Docusaurus's built-in `<Tabs>` component and re-style `.tabs__item` to match `.codeblock-tab`.

## 6. Cards on docs homepages

Use plain MDX with our `.card-grid` + `.k-card`:

```mdx
<div className="card-grid">
  <a className="k-card is-hoverable" href="/quickstart">
    <div className="card-icon">⚡</div>
    <h3 className="card-title">Quickstart</h3>
    <p className="card-body">Get a Kotlin server running in 5 minutes.</p>
  </a>
</div>
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
