# Mapping to Hugo

Hugo is template-driven (Go templates) rather than configuration-driven, so the kit ships a **standalone Hugo theme module** (`packages/hugo`, imported via `hugo mod get`) that owns the baseof layout, partials, and shortcodes — it is not a wrapper around Doks, Geekdoc, or any other theme. This spec maps the design-system contract onto that module.

## 1. Theme module layout

```
packages/hugo/
├── assets/
│   ├── css/                     # bundled into one fingerprinted file (§ 2)
│   │   ├── colors_and_type.css  # rsynced from @ktdocs/tokens
│   │   ├── tokens.css           # rsynced from @ktdocs/tokens
│   │   ├── components.css       # rsynced from @ktdocs/tokens
│   │   ├── chroma.css           # hand-written Hugo-only delta (Chroma map, TOC items, …)
│   │   └── fonts.css            # rsynced; font URLs rewritten to ../fonts/
│   └── js/
│       ├── theme.js             # tri-state theme toggle + code/content tab switching + copy
│       ├── nav.js               # sidenav collapse + sessionStorage persistence + drawer (0.2.0)
│       ├── search.js            # Pagefind modal + ⌘K binding
│       └── copy-page.js         # copy-page dropdown
├── static/
│   ├── fonts/                   # woff2, served at /fonts/*
│   └── img/                     # Kotlin logos + icons, served at /img/*
└── layouts/
    ├── _default/
    │   ├── baseof.html
    │   ├── single.html
    │   ├── list.html
    │   ├── single.md / list.md  # plain-markdown output twins (copy-page / AI consumption)
    │   └── _markup/
    │       └── render-codeblock.html  # fence → .kt-codeblock (§ 9)
    ├── partials/
    │   ├── head.html
    │   ├── header.html
    │   ├── tab-active.html      # boolean helper: is a menus.tabs entry active for this page
    │   ├── sidebar.html
    │   ├── sidebar-tree.html    # recursive tree body (0.2.0)
    │   ├── toc.html
    │   ├── eyebrow.html         # replaces breadcrumbs.html (deleted in 0.2.0)
    │   ├── drawer.html          # mobile drawer (0.2.0, § 7a)
    │   ├── copy-page.html
    │   ├── pager.html           # prev/next cards (0.2.0)
    │   ├── related.html         # Related topics (0.2.0)
    │   ├── kt-icon.html         # icon dispatcher
    │   ├── kt-icons.generated.html  # generated from @ktdocs/tokens icons.json (committed)
    │   └── footer.html
    └── shortcodes/              # callout, code-tabs / code-tab, tabs / tab, accordion,
                                 # accordion-group, card, card-grid, feature-grid, hero,
                                 # badge, method, tag, pill, toggle, segmented, params, state
```

## 2. `layouts/partials/head.html` — pre-paint theme + CSS bundle

`head.html` first runs the **pre-paint theme script** (§ 10) so the first paint carries the right theme, then concatenates the five CSS files into one fingerprinted bundle — order matters: `chroma.css` loads after `components.css` so the Hugo-only delta wins, and `fonts.css` loads last with its URLs rewritten to `../fonts/` (sub-path baseURL safety). The favicon resolves via `relURL` for the same reason:

```go-html-template
{{ $colors     := resources.Get "css/colors_and_type.css" }}
{{ $tokens     := resources.Get "css/tokens.css" }}
{{ $components := resources.Get "css/components.css" }}
{{ $chroma     := resources.Get "css/chroma.css" }}
{{ $fonts      := resources.Get "css/fonts.css" }}
{{ $bundle := slice $colors $tokens $components $chroma $fonts
              | resources.Concat "css/bundle.css"
              | resources.Minify
              | resources.Fingerprint }}
<link rel="stylesheet" href="{{ $bundle.RelPermalink }}" integrity="{{ $bundle.Data.Integrity }}">
<link rel="icon" href="{{ "img/kotlin-icon-color.svg" | relURL }}" type="image/svg+xml">
```

## 3. `layouts/_default/baseof.html` — 3-column shell

`<html>` carries **no** `data-theme` attribute in the template — the pre-paint script in `head.html` sets it (or leaves it off for auto, § 10). The drawer partial sits right after the header, `data-pagefind-body` scopes the Pagefind index to the article, and the four JS modules load deferred as fingerprinted resources:

```go-html-template
<!doctype html>
<html lang="{{ default "en" site.Language.Lang }}">
  <head>
    {{ partial "head.html" . }}
    <title>{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} · {{ .Site.Title }}{{ end }}</title>
  </head>
  <body>
    {{ partial "header.html" . }}
    {{ partial "drawer.html" . }}
    <div class="kt-docs-shell">
      <aside class="kt-docs-shell__side">{{ partial "sidebar.html" . }}</aside>
      <main class="kt-docs-shell__main">
        <article class="kt-docs-article" data-pagefind-body>
          {{ block "main" . }}{{ end }}
        </article>
      </main>
      <aside class="kt-docs-shell__toc">{{ partial "toc.html" . }}</aside>
    </div>
    {{ partial "footer.html" . }}
    {{/* theme.js, nav.js, copy-page.js, search.js — each Minify | Fingerprint, defer: */}}
    {{ $theme := resources.Get "js/theme.js" | resources.Minify | resources.Fingerprint }}
    <script defer src="{{ $theme.RelPermalink }}" integrity="{{ $theme.Data.Integrity }}"></script>
    {{/* …same pattern for js/nav.js, js/copy-page.js, js/search.js */}}
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

## 8. Admonition mapping — `callout` shortcode

Hugo doesn't have built-in admonitions; the theme ships `layouts/shortcodes/callout.html`. It emits the contract's callout DOM: an `<aside class="kt-callout kt-callout--<kind>">` hosting an inline stroke icon (`.kt-callout__icon` — one `if`/`else` SVG branch per kind inside the shortcode) and a `.kt-callout__body` with the optional `<strong class="kt-callout__title">` and the `.kt-callout__content`. The body renders via `{{ .Inner | .Page.RenderString }}` so Markdown inside the shortcode works:

```go-html-template
{{- $kind := .Get "type" | default "note" -}}
{{- $title := .Get "title" -}}
<aside class="kt-callout kt-callout--{{ $kind }}">
  <svg class="kt-callout__icon" …>{{/* per-kind icon branch */}}</svg>
  <div class="kt-callout__body">
    {{- with $title -}}<strong class="kt-callout__title">{{ . }}</strong>{{- end -}}
    <div class="kt-callout__content">{{ .Inner | .Page.RenderString }}</div>
  </div>
</aside>
```

Use in Markdown:

```markdown
{{</* callout type="tip" title="Pro tip" */>}}
You can pass `--watch` to rebuild on save.
{{</* /callout */>}}
```

### Supported `type` values

All 12 callout kinds:

| `type=`          | Callout class               |
| ---------------- | --------------------------- |
| `note` (default) | `.kt-callout--note`         |
| `info`           | `.kt-callout--info`         |
| `tip`            | `.kt-callout--tip`          |
| `success`        | `.kt-callout--success`      |
| `warning`        | `.kt-callout--warning`      |
| `caution`        | `.kt-callout--caution`      |
| `danger`         | `.kt-callout--danger`       |
| `important`      | `.kt-callout--important`    |
| `quote`          | `.kt-callout--quote`        |
| `example`        | `.kt-callout--example`      |
| `deprecated`     | `.kt-callout--deprecated`   |
| `experimental`   | `.kt-callout--experimental` |

## 8a. Accordion, related topics & pager cards (0.2.0)

**Accordion** is a pair of shortcodes. `shortcodes/accordion.html` emits the contract's `<details class="kt-accordion">` DOM — `title` becomes the summary label after the `chevron-right` icon (`kt-icon.html` partial), `open=true` maps to the native `open` attribute, and the body is `{{ .Inner | .Page.RenderString }}` so Markdown inside the accordion renders normally. `shortcodes/accordion-group.html` wraps its children in `<div class="kt-accordion-group">` and passes `{{ .Inner }}` through raw — the children are already-rendered `accordion` shortcode output.

**Related topics** is `partials/related.html`, wired in `_default/single.html` between `{{ .Content }}` and the pager partial. It reads `.Params.related` — page paths under `[params]` in front matter — resolves each via `site.GetPage`, and renders `.RelPermalink` links (never the verbatim path — sub-path baseURL safety) with the resolved page's title as link text and a `file-text` icon per row. Paths that don't resolve `warnf` at build time and are skipped; with nothing resolved the partial emits no section at all.

**Pager** (`partials/pager.html`) emits the card DOM from `.PrevInSection` / `.NextInSection`: each card is `.kt-docs-pager__link--prev|--next` with a `kt-icon.html` `arrow-left` / `arrow-right` (`.kt-docs-pager__arrow`) on the outer edge and the direction label + title inside `.kt-docs-pager__text`. A missing neighbour renders an empty `<span></span>` so the grid keeps the remaining card in its correct column.

## 9. Code blocks

Hugo highlights with Chroma. Every fenced block goes through the **render hook** `layouts/_default/_markup/render-codeblock.html`, which wraps the Chroma output in the `.kt-codeblock` contract DOM (matching `shortcodes/code-tabs.html` for single-file blocks):

- `.kt-codeblock__header` carries either `.kt-codeblock__title` (a `title=` / `file=` fence attribute → `file-text` icon + filename; 0.2.0 — this used to be a lone fake tab) or `.kt-codeblock__lang`, plus `.kt-codeblock__actions` with the `[data-copy]` button (wired by `assets/js/theme.js` — Chroma line-number-table aware).
- Terminal languages (`bash`, `sh`, `shell`, `zsh`, `console`, `terminal`) add `.kt-codeblock--terminal`.
- Highlighting is delegated to `transform.HighlightCodeBlock`, honouring `.Options` merged with the site's `[markup.highlight]` config — `lineNos = false` makes line numbers opt-in per fence (`{linenos=table}`); `{hl_lines="2 4-5"}` works too.

Hugo emits Chroma class markup (not the per-line `.kt-codeblock__line` structure Docusaurus renders), so the hand-written `assets/css/chroma.css` — the Hugo-only delta sheet, loads after `components.css` in the bundle and survives the tokens rsync — maps Chroma's Pygments token classes onto the same `--code-*` tokens that `.kt-tok-*` uses (no full generated Chroma stylesheet is shipped):

```css
.chroma .k,
.chroma .kc,
.chroma .kd,
.chroma .kn,
.chroma .kp,
.chroma .kr,
.chroma .kt {
  color: var(--code-keyword);
  font-weight: 500;
}
.chroma .s, .chroma .s1, .chroma .s2 /* … */ {
  color: var(--code-string);
}
.chroma .c, .chroma .c1, .chroma .cm /* … */ {
  color: var(--code-comment);
  font-style: italic;
}
.chroma .nf,
.chroma .nb,
.chroma .nx {
  color: var(--code-function);
}
.chroma .nc,
.chroma .nn {
  color: var(--code-type);
}
.chroma .p,
.chroma .o,
.chroma .ow {
  color: var(--code-punctuation);
}
```

`chroma.css` also flattens Chroma's wrapper (transparent background, compact line-number gutter) and pads `.kt-codeblock__body` once, since the Chroma markup carries no padded line spans.

For multi-file tabs use the `code-tabs` / `code-tab` shortcodes (§ 8a table in [components.md](../components.md)) — they emit `.kt-codeblock__tabs` / `.kt-codeblock__tab` in the same header; `assets/js/theme.js` switches the panels.

## 10. Theme toggle

The toggle is **tri-state** (`auto → light → dark`), split across two files shipped by the theme:

- `partials/head.html` runs a pre-paint inline script: a saved `localStorage.theme` of `light`/`dark` pins `data-theme` on `<html>` before the body renders (no flash); `auto` (or no saved value) **removes the attribute** so the `prefers-color-scheme` block in `colors_and_type.css` follows the OS live. `baseof.html` itself emits `<html>` with no `data-theme`.
- `assets/js/theme.js` (loaded deferred from `baseof.html`) drives the topnav button (`#theme-toggle`): each click advances the mode cycle, persists it to `localStorage`, applies/removes `data-theme`, and stamps the button's `data-theme-mode` attribute, which selects the visible icon of three (`.kt-theme-icon`).

## 11. Done

Build:

```bash
hugo server -D
```

Check: header has Kotlin wordmark + version pill (and the tab pills when `menus.tabs` has ≥ 2 entries), the sidebar tree shows mono section headers with icons and a teal-text active item, the article opens with a teal eyebrow above the H1 + Copy page row, `{{</* callout */>}}` shortcodes render the callout colors, Chroma uses JetBrains Mono with the kit code palette.
