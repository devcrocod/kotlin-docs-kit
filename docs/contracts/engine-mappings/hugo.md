# Mapping to Hugo

Hugo is template-driven (Go templates) rather than configuration-driven, so we wire the design system in by overriding the **baseof** layout and a few partials. Works with the Doks, Geekdoc, or any standard Hugo theme — and equally well as a from-scratch theme.

## 1. Files to copy into `assets/css/` and `static/img/`

```
your-site/
├── assets/
│   ├── css/
│   │   ├── colors_and_type.css
│   │   ├── tokens.css
│   │   └── components.css
│   └── js/
│       ├── theme.js
│       ├── nav.js          # sidenav collapse + sessionStorage persistence (0.2.0)
│       ├── search.js
│       └── copy-page.js
├── static/
│   └── img/
│       ├── kotlin-icon-color.svg
│       ├── kotlin-logo.svg
│       └── kotlin-logo-dark.svg
└── layouts/
    ├── _default/
    │   ├── baseof.html
    │   ├── single.html
    │   └── list.html
    └── partials/
        ├── head.html
        ├── header.html
        ├── tab-active.html    # boolean helper: is a menus.tabs entry active for this page
        ├── sidebar.html
        ├── sidebar-tree.html  # recursive tree body (0.2.0)
        ├── toc.html
        ├── eyebrow.html       # replaces breadcrumbs.html (deleted in 0.2.0)
        ├── footer.html
        └── callout.html
```

## 2. `layouts/partials/head.html` — load CSS

```go-html-template
{{ $colors := resources.Get "css/colors_and_type.css" }}
{{ $tokens := resources.Get "css/tokens.css" }}
{{ $components := resources.Get "css/components.css" }}
{{ $bundle := slice $colors $tokens $components | resources.Concat "css/bundle.css" | resources.Minify | resources.Fingerprint }}

<link rel="stylesheet" href="{{ $bundle.RelPermalink }}" integrity="{{ $bundle.Data.Integrity }}">
<link rel="icon" href="/img/kotlin-icon-color.svg" type="image/svg+xml">
```

## 3. `layouts/_default/baseof.html` — 3-column shell

```go-html-template
<!doctype html>
<html lang="{{ .Site.LanguageCode }}" data-theme="light">
  <head>
    {{ partial "head.html" . }}
    <title>{{ .Title }} · {{ .Site.Title }}</title>
  </head>
  <body>
    {{ partial "header.html" . }}
    <div class="docs-shell">
      <aside class="docs-shell-side">{{ partial "sidebar.html" . }}</aside>
      <main class="docs-shell-main">
        <article class="docs-article">{{ block "main" . }}{{ end }}</article>
      </main>
      <aside class="docs-shell-toc">{{ partial "toc.html" . }}</aside>
    </div>
    {{ partial "footer.html" . }}
  </body>
</html>
```

## 4. `layouts/partials/header.html` — top nav (tabs, search trigger, GitHub)

The header emits `.kt-topnav` and renders, left to right: the **burger** (`.kt-topnav__icon-btn.kt-topnav__burger`, drawer trigger — visible below 997 px only; see § 7a for the drawer), the **brand** cluster (logo + `.kt-topnav__brand-name` + `.kt-topnav__version` from `params.version`), the **tab group or flat links**, and the **right cluster** (search trigger, optional GitHub button, tri-state theme toggle).

**Navbar tabs** are an optional feature driven by a `[[menus.tabs]]` menu. The tab bar renders only at ≥ 2 entries; with 0–1 entries the theme falls back to the flat `menus.main` links (`.kt-topnav__links` / `.kt-topnav__link` — the 0.1.x behavior, so existing sites upgrade with no config change):

```toml
[[menus.tabs]]
  name = "Docs"
  pageRef = "/guides"
  weight = 1
  [menus.tabs.params]
    sections = ["getting-started", "guides"]

[[menus.tabs]]
  name = "Changelog"
  pageRef = "/changelog"
  weight = 2
```

- A tab owns the top-level content sections listed in `params.sections`; an entry without `params.sections` owns only its `pageRef` section.
- Active detection lives in `partials/tab-active.html` (a boolean `return` partial, context `dict "page" PAGE "entry" ENTRY`): Hugo's `IsMenuCurrent`, then `pageRef` equality / `.IsDescendant`, then `params.sections` containment — so any page inside a tab's section set marks that tab active.
- Markup: `<nav class="kt-topnav__tabs" aria-label="Sections">` with one `<a class="kt-topnav__tab">` per entry; the active tab adds `kt-topnav__tab--active` and `aria-current="true"`.

**Search trigger:** the header renders `.kt-docs-search` (magnifier + `Search…` + `⌘K` chip) with `role="button"`, `tabindex="0"`, and the `data-pagefind-base` / `data-site-base` attributes consumed by `assets/js/search.js`, which opens the Pagefind modal (`.kt-search-modal`, themed by `search-ui.css`). Below 997 px the same element collapses to an icon button (CSS only).

**GitHub button** (new in 0.2.0, config-driven): set `params.github` to the repository URL to render an icon-only `.kt-topnav__icon-btn` link in the right cluster (inline SVG, `fill="currentColor"` — not a CSS mask, so it paints reliably in both color modes):

```toml
[params]
  github = "https://github.com/you/your-repo"
```

## 5. `layouts/partials/sidebar.html` + `sidebar-tree.html` — recursive tree

`sidebar.html` picks the **section set**: with tabs configured (≥ 2 entries) it renders only the active tab's sections (`params.sections`, else the `pageRef` section alone); without tabs it renders all top-level sections (0.1.x behavior, the upgrade path). It emits:

```go-html-template
<nav class="kt-sidenav" aria-label="Section navigation" data-nav-key="{{ $navKey }}">
  {{ range $sections }}
    <div class="kt-sidenav__section">
      <a class="kt-sidenav__sec-label{{ if eq $current .RelPermalink }} kt-sidenav__sec-label--active{{ end }}" href="{{ .RelPermalink }}">
        {{ with .Params.icon }}{{ partial "kt-icon.html" (dict "name" . "class" "kt-sidenav__sec-icon" "size" 16) }}{{ end }}
        <span>{{ .Title }}</span>
      </a>
      {{ partial "sidebar-tree.html" (dict "node" . "page" $page "nested" false "open" true) }}
    </div>
  {{ end }}
</nav>
```

- `data-nav-key` scopes collapse persistence per tab tree: the active tab root's `RelPermalink` (stable under sub-path baseURLs), or `_root` without tabs.
- **Section icons** are opt-in front matter on the section's `_index.md` — rendered through the `kt-icon.html` dispatcher over the generated icon map (unknown names warn at build time and render nothing):

```toml
# content/guides/_index.md
[params]
  icon = "book-open"
```

`sidebar-tree.html` is the recursive body: it walks `.Pages` (child sections + regular pages, weight-ordered). Regular pages render as `<li><a class="kt-sidenav__item">` (active = `kt-sidenav__item--active`, teal text only); child sections render as collapsible groups:

```go-html-template
<div class="kt-sidenav__group" data-key="{{ .RelPermalink }}">
  <div class="kt-sidenav__group-row">
    <a class="kt-sidenav__item kt-sidenav__group-link" href="{{ .RelPermalink }}">{{ .Title }}</a>
    <button class="kt-sidenav__group-toggle" type="button" aria-expanded="{{ $expanded }}" aria-label="Toggle {{ .Title }}">
      {{ partial "kt-icon.html" (dict "name" "chevron-right" "size" 14) }}
    </button>
  </div>
  {{/* recurse: nested=true → ul.kt-sidenav__list--nested, hidden unless expanded */}}
</div>
```

The active ancestor chain is pre-expanded server-side (`eq $page .` / `$page.IsDescendant .`), so the tree renders correctly without JS and with no FOUC.

**`assets/js/nav.js`** (new module, loaded from `baseof.html`) adds collapse toggling and persistence:

- Click on `.kt-sidenav__group-toggle` flips `aria-expanded` on the button and `hidden` on the sibling nested list; every tree sharing the same `data-nav-key` is kept in sync.
- The open-group set is persisted per tree in `sessionStorage["kt.sidenav.<navKey>"]` (a JSON array of `data-key` values) because every Hugo navigation is a full page load. Stored state is applied as a **union** with the server-expanded chain, so the active path never collapses on load.
- The mobile drawer is part of the same module and arrives in the next slice.

## 6. `layouts/partials/toc.html` — on-this-page

The label row carries the `list` UI glyph next to the mono text (0.2.0):

```go-html-template
{{ if .TableOfContents }}
  <nav class="kt-toc" aria-label="On this page">
    <div class="kt-toc__label">
      {{ partial "kt-icon.html" (dict "name" "list" "class" "kt-toc__label-icon" "size" 14) }}
      <span>On this page</span>
    </div>
    {{ .TableOfContents }}
  </nav>
{{ end }}
```

Hugo's `.TableOfContents` emits bare `<nav id="TableOfContents"><ul><li><a>` without classes, so `chroma.css` (the Hugo-only delta sheet — loads last, survives the rsync propagation) maps those anchors to the `.kt-toc__item` visual via descendant selectors:

```css
.kt-toc nav#TableOfContents ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.kt-toc nav#TableOfContents > ul > li > a {
  /* .kt-toc__item */
}
.kt-toc nav#TableOfContents ul ul > li > a {
  /* .kt-toc__item--nested */
}
```

Hugo has no scroll-spy, so the teal active dot (`.kt-toc__item--active`) only appears in engines that track the active heading (Docusaurus) — an accepted parity divergence.

## 7. `layouts/partials/eyebrow.html` — article header (replaces breadcrumbs.html)

`partials/breadcrumbs.html` was **deleted** in 0.2.0 (with the `.kt-crumbs` CSS). `_default/single.html` now renders the article-header anatomy:

```go-html-template
<header class="kt-article-header">
  {{ partial "eyebrow.html" . }}
  <div class="kt-article-header__titlebar">
    <h1>{{ .Title }}</h1>
    {{ partial "copy-page.html" . }}
  </div>
</header>
```

`eyebrow.html` emits `<p class="kt-eyebrow">` with the immediate parent's title (`.Parent.Title`, skipped when the parent is home); if empty, it falls back to the active tab's name (via `tab-active.html`); it renders nothing when the label would equal the page title (tab-root index pages). The 0.1.x `.kt-doc-titlebar` flex row is renamed to `.kt-article-header__titlebar` (migration notes) — the copy-page control keeps its `.kt-copy-page*` classes and simply sits in the new row.

## 7a. `layouts/partials/drawer.html` — mobile drawer

`baseof.html` includes `partials/drawer.html` right after the header: the `.kt-drawer` overlay panel (see `components.md § Mobile drawer`) containing the brand row, the stacked tab block (same `tab-active.html` logic and fallback as the topnav), and a second `{{ partial "sidebar.html" . }}` copy of the current tab's tree. `js/nav.js` drives it — burger toggle (`#kt-drawer-toggle`), overlay/`Esc`/close dismissal, body scroll lock, focus handling — and syncs collapse state between the drawer and desktop trees via the shared `data-nav-key`/`data-key` attributes. Desktop (≥ 997 px) hides `.kt-drawer` entirely via CSS, whatever its `hidden` state.

## 8. Admonition mapping — custom Hugo shortcode

Hugo doesn't have built-in admonitions, but `layouts/shortcodes/callout.html` plugs the gap. Add this file:

```go-html-template
{{- $kind := .Get "type" | default "note" -}}
{{- $title := .Get "title" -}}
<div class="callout callout-{{ $kind }}">
  <svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    {{- if   eq $kind "info"         -}}<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
    {{- else if eq $kind "tip"       -}}<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 1 7 7c0 3-2 5-3 6.5V18H8v-2.5C7 14 5 12 5 9a7 7 0 0 1 7-7z"/>
    {{- else if eq $kind "success"   -}}<path d="M20 6 9 17l-5-5"/>
    {{- else if eq $kind "warning"   -}}<path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
    {{- else if eq $kind "caution"   -}}<circle cx="12" cy="12" r="10"/><path d="M12 9v4"/><path d="M12 17h.01"/>
    {{- else if eq $kind "danger"    -}}<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
    {{- else if eq $kind "important" -}}<path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/><path d="M12 8v4"/><path d="M12 16h.01"/>
    {{- else if eq $kind "quote"     -}}<path d="M3 21c3-1 5-3 5-6V8H4v7h4"/><path d="M15 21c3-1 5-3 5-6V8h-4v7h4"/>
    {{- else if eq $kind "example"   -}}<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    {{- else if eq $kind "deprecated"-}}<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    {{- else if eq $kind "experimental" -}}<path d="M9 2v6L3.5 18a2.5 2.5 0 0 0 2 4h13a2.5 2.5 0 0 0 2-4L15 8V2"/><path d="M7 2h10"/><path d="M7 16h10"/>
    {{- else -}}<path d="M3 5h18"/><path d="M3 12h18"/><path d="M3 19h12"/>
    {{- end -}}
  </svg>
  <div>
    {{- if $title }}<strong class="callout-title">{{ $title }}</strong>{{ end -}}
    {{ .Inner | markdownify }}
  </div>
</div>
```

Use in Markdown:

```markdown
{{</* callout type="tip" title="Pro tip" */>}}
You can pass `--watch` to rebuild on save.
{{</* /callout */>}}
```

### Supported `type` values

All 12 callout kinds:

| `type=`          | Callout class           |
| ---------------- | ----------------------- |
| `note` (default) | `.callout-note`         |
| `info`           | `.callout-info`         |
| `tip`            | `.callout-tip`          |
| `success`        | `.callout-success`      |
| `warning`        | `.callout-warning`      |
| `caution`        | `.callout-caution`      |
| `danger`         | `.callout-danger`       |
| `important`      | `.callout-important`    |
| `quote`          | `.callout-quote`        |
| `example`        | `.callout-example`      |
| `deprecated`     | `.callout-deprecated`   |
| `experimental`   | `.callout-experimental` |

## 9. Code blocks

Hugo uses Chroma for syntax highlighting. Generate a Chroma stylesheet once and replace its token colors with ours:

```bash
hugo gen chromastyles --style=onedark > assets/css/chroma.css
```

Then edit `chroma.css` and re-map:

```css
.chroma .k,
.chroma .kd,
.chroma .kt {
  color: var(--code-keyword);
  font-weight: 500;
}
.chroma .s,
.chroma .s1,
.chroma .s2 {
  color: var(--code-string);
}
.chroma .m,
.chroma .mi,
.chroma .mf {
  color: var(--code-number);
}
.chroma .c,
.chroma .c1,
.chroma .cm {
  color: var(--code-comment);
  font-style: italic;
}
.chroma .nf,
.chroma .nb {
  color: var(--code-function);
}
.chroma .nc,
.chroma .nn {
  color: var(--code-type);
}
.chroma .p {
  color: var(--code-punctuation);
}
```

Wrap Chroma's `<pre class="chroma">` in our `.codeblock`:

```go-html-template
<div class="codeblock">
  <div class="codeblock-header">
    <span class="codeblock-lang">{{ .Get "lang" }}</span>
    <div class="codeblock-actions">
      <button class="action-btn" data-copy>copy</button>
    </div>
  </div>
  {{ highlight (trim .Inner "\n") (.Get "lang") "linenos=table,style=github" }}
</div>
```

For multi-file tabs, write a `tabs` shortcode that emits `.codeblock-tabs` and `.codeblock-tab` markup.

## 10. Theme toggle

Add to `static/js/theme.js` and include in `head.html`:

```js
const root = document.documentElement;
const saved = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
root.setAttribute('data-theme', saved);
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});
```

## 11. Done

Build:

```bash
hugo server -D
```

Check: header has Kotlin wordmark + version pill (and the tab pills when `menus.tabs` has ≥ 2 entries), the sidebar tree shows mono section headers with icons and a teal-text active item, the article opens with a teal eyebrow above the H1 + Copy page row, `{{</* callout */>}}` shortcodes render the callout colors, Chroma uses JetBrains Mono with the kit code palette.
