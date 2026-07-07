# kotlin-docs-hugo

Kotlin-styled Hugo theme module — part of [kotlin-docs-kit](https://github.com/devcrocod/kotlin-docs-kit).

It wraps Hugo's native output in the `kt-*` BEM contract published by [`@ktdocs/tokens`](../tokens/README.md), so a Hugo site looks identical to the Docusaurus sibling in the same repository.

## Install

The theme ships as a [Hugo Module](https://gohugo.io/hugo-modules/). You need Hugo `>= 0.128.0` (extended is not required) and the Go toolchain `>= 1.22` on PATH for module resolution.

```bash
cd my-docs
hugo mod init github.com/me/my-docs
hugo mod get github.com/devcrocod/kotlin-docs-kit/packages/hugo@latest
```

Then in `hugo.toml`:

```toml
[module]
  [[module.imports]]
    path = "github.com/devcrocod/kotlin-docs-kit/packages/hugo"

[params]
  version = "1.0.0"   # rendered into the topnav version pill

[markup]
  [markup.highlight]
    codeFences = true
    lineNos = false   # line numbers are opt-in per fence ({linenos=table})
    lineNumbersInTable = true
    noClasses = false
    style = "github"
  [markup.goldmark.renderer]
    unsafe = true     # required for shortcodes that emit inline HTML

[[menu.main]]
  name = "Docs"
  url = "/"
```

The topnav exposes `.Site.Menus.main` automatically. Add more `[[menu.main]]` entries to populate the primary nav row. Alternatively, since 0.2.0 the topnav can render Mintlify-style tabs that each own their own sidebar tree — see [Navbar tabs & sidebar](#navbar-tabs--sidebar).

## What's inside

```
packages/hugo/
├── assets/
│   ├── css/         # bundled into one fingerprinted file via Hugo Pipes
│   │   ├── colors_and_type.css   ← rsynced from @ktdocs/tokens
│   │   ├── tokens.css            ← rsynced from @ktdocs/tokens
│   │   ├── components.css        ← rsynced from @ktdocs/tokens
│   │   ├── chroma.css            ← hand-written kt-tok ↔ Chroma mapping
│   │   └── fonts.css             ← rsynced, URLs rewritten to /fonts/
│   └── js/
│       ├── theme.js              ← toggle + tab interactivity
│       ├── nav.js                ← sidenav collapse + sessionStorage memory
│       ├── search.js             ← Pagefind modal + ⌘K binding
│       └── copy-page.js          ← copy-page dropdown
├── static/
│   ├── fonts/       # woff2 served at /fonts/*.woff2
│   └── img/         # Kotlin SVG icons + logos, served at /img/*
├── layouts/
│   ├── _default/
│   │   ├── baseof.html           ← 3-col kt-docs-shell
│   │   ├── single.html
│   │   └── list.html
│   ├── partials/
│   │   ├── head.html
│   │   ├── header.html           ← .kt-topnav (tabs / flat links + search + GitHub)
│   │   ├── tab-active.html       ← menus.tabs active-state helper
│   │   ├── sidebar.html          ← .kt-sidenav (per-tab section set)
│   │   ├── sidebar-tree.html     ← recursive collapsible tree
│   │   ├── toc.html              ← .kt-toc
│   │   ├── eyebrow.html          ← .kt-eyebrow (parent-section label)
│   │   ├── kt-icon.html          ← icon dispatcher (over the generated map)
│   │   ├── kt-icons.generated.html ← built by @ktdocs/tokens (committed)
│   │   ├── pager.html            ← .kt-docs-pager prev/next cards
│   │   ├── related.html          ← .kt-related (params.related front matter)
│   │   └── footer.html
│   └── shortcodes/               ← the authoring surface (see below)
├── i18n/                         ← reserved for future translations
├── go.mod
├── theme.toml
└── README.md
```

## Shortcode catalog

All 16 shortcodes emit the BEM DOM specified in [`docs/contracts/components.md`](../../docs/contracts/components.md). The table below lists representative usage; full DOM is in the contract.

| Shortcode                | Example                                                                                                               | Emits                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `callout`                | `{{</* callout type="tip" title="Pro tip" */>}}body{{</* /callout */>}}`                                              | `.kt-callout kt-callout--tip` + icon + body                          |
| `code-tabs` / `code-tab` | `{{</* code-tabs */>}}{{</* code-tab lang="kotlin" title="Main.kt" */>}}…{{</* /code-tab */>}}{{</* /code-tabs */>}}` | `.kt-codeblock` premium block with tabs                              |
| `card`                   | `{{</* card title="Quickstart" href="/start" */>}}…{{</* /card */>}}`                                                 | `.kt-card` (link card when `href` set)                               |
| `card-grid`              | `{{</* card-grid */>}}…cards…{{</* /card-grid */>}}`                                                                  | `.kt-card-grid` auto-fit wrapper                                     |
| `hero`                   | `{{</* hero title="Kotlin docs" gradient="docs" */>}}actions{{</* /hero */>}}`                                        | `.kt-docs-hero` + `.kt-docs-hero__grad-text`                         |
| `feature-grid`           | `{{</* feature-grid */>}}…cards…{{</* /feature-grid */>}}`                                                            | alias of `.kt-card-grid`                                             |
| `badge`                  | `{{</* badge variant="success" */>}}stable{{</* /badge */>}}`                                                         | `.kt-badge kt-badge--success`                                        |
| `method`                 | `{{</* method type="get" */>}}`                                                                                       | `.kt-method kt-method--get` (GET)                                    |
| `tag`                    | `{{</* tag */>}}prerelease{{</* /tag */>}}`                                                                           | `.kt-tag`                                                            |
| `tabs` / `tab`           | `{{</* tabs */>}}{{</* tab title="Kotlin" */>}}…{{</* /tab */>}}{{</* /tabs */>}}`                                    | `.kt-tabs` content switcher (distinct from code tabs)                |
| `accordion`              | `{{</* accordion title="Why is my build failing?" */>}}body{{</* /accordion */>}}`                                    | `.kt-accordion` `<details>` disclosure; `open=true` renders expanded |
| `accordion-group`        | `{{</* accordion-group */>}}…accordions…{{</* /accordion-group */>}}`                                                 | `.kt-accordion-group` bordered stack with hairline dividers          |
| `params`                 | `{{</* params */>}}timeout\|number · ms\|Request timeout.{{</* /params */>}}`                                         | `.kt-params` table; rows are `name\|type\|desc`                      |
| `state`                  | `{{</* state kind="empty" title="No results" */>}}body{{</* /state */>}}`                                             | `.kt-state` empty/loading placeholder                                |

The `code-tabs` shortcode wraps Hugo's `transform.Highlight` (Chroma) — pass `lang` and `title` to each `code-tab`. Single-file premium code blocks can be rendered with one `code-tab` inside a `code-tabs`.

For inline syntax tokens authored by hand the eight `.kt-tok-*` classes from the contract are available: `<span class="kt-tok-k">fun</span>` etc.

## Navbar tabs & sidebar

Tabs are optional. With no `menus.tabs` (or a single entry) the topnav renders
the flat `menus.main` links and the sidebar shows **all** top-level sections —
the 0.1.x behavior. With **two or more** `menus.tabs` entries the tab bar
renders and each tab owns its own sidebar tree:

```toml
[[menus.tabs]]
  name = "Docs"
  pageRef = "/getting-started"
  weight = 1
  [menus.tabs.params]
    # Optional: a tab may own several top-level sections. Without this the
    # tab owns only its pageRef section.
    sections = ["getting-started", "guides", "reference", "examples"]

[[menus.tabs]]
  name = "Changelog"
  pageRef = "/changelog"
  weight = 2
```

- A tab is **active** when the current page lives inside its `pageRef` section
  or any of its `params.sections`.
- Section headers can carry an icon from the kit's curated set — set
  `params.icon` in the section's `_index.md` front matter
  (`icon: rocket`, `book-open`, `map`, `layers`, `palette`, `code`,
  `terminal`, `settings`, `wrench`, `puzzle`, `flag`, `file-text`, `history`,
  `users`, `shield`, `sparkles`). Unknown names warn at build time and render
  no icon.
- Nested sub-sections render as collapsible groups (multi-open); the open set
  is remembered per tab in `sessionStorage` (`js/nav.js`). The active ancestor
  chain is pre-expanded server-side, so the tree works without JavaScript.
- Set `params.github = "https://github.com/you/repo"` to render the GitHub
  icon button in the topnav's right cluster.

## Related topics

Add a manual "Related topics" list after any article's content (before the
pager) via front matter. The page paths **must** live under `[params]` — a
top-level `related` key collides with Hugo's native related-content config
and draws a deprecation warning:

```toml
[params]
  related = ["/getting-started/install/", "/reference/tokens/"]
```

Entries resolve via `site.GetPage`; the resolved page's title becomes the
link text. Unresolvable paths warn at build time and are skipped — with
nothing resolved the section is omitted entirely.

## Theme toggle

`baseof.html` emits `<html>` with **no** `data-theme` attribute. A pre-paint inline script in `head.html` runs before the body paints (so there is no flash): a saved `localStorage.theme` of `light`/`dark` pins `data-theme` explicitly; otherwise the attribute stays off and the `prefers-color-scheme` CSS follows the OS live. The topnav theme button (`#theme-toggle`, `assets/js/theme.js`) cycles three modes — `auto → light → dark` — persisting the choice to `localStorage` and updating `data-theme` (removed again for `auto`).

## What this package is NOT

- It is not a wrapper around `doks`, `geekdoc`, or any other Hugo theme — it is a standalone theme module.
- It does not build a search index. The theme ships the search **UI** — `assets/js/search.js` opens a [Pagefind](https://pagefind.app) modal from the `.kt-docs-search` trigger (click or ⌘K/Ctrl K) and lazy-loads the Pagefind UI from `<baseURL>/pagefind/` — but the index itself is produced by the consumer site by running `npx pagefind --site public` after `hugo`. If the index is missing, the modal shows a notice instead of throwing.
- It does not bundle an i18n bundle — `i18n/` is reserved.

## Customizing

You can override anything in this theme by placing a file with the same path in your own site:

- Override the topnav: `your-site/layouts/partials/header.html`
- Override a shortcode: `your-site/layouts/shortcodes/callout.html`
- Change token values: redeclare CSS custom properties in your own stylesheet loaded after the bundle. See [`@ktdocs/tokens` README](../tokens/README.md) for the full token list.

The BEM contract is a hard boundary — see [`docs/contracts/components.md`](../../docs/contracts/components.md). If you need DOM that differs from the contract, fork the theme.

## Migrating to hugo-v0.2.0

hugo-v0.2.0 is the Mintlify-inspired shell redesign. Breaking changes and new
conventions:

- **`partials/breadcrumbs.html` is deleted** (with the `.kt-crumbs` CSS);
  articles render a teal `.kt-eyebrow` (immediate parent section label) above
  the H1 via the new `partials/eyebrow.html`. Sites overriding
  `breadcrumbs.html` should drop the override; custom CSS targeting
  `.kt-crumbs` must be removed.
- **`.kt-doc-titlebar` is renamed** to `.kt-article-header__titlebar` inside
  the new `<header class="kt-article-header">` anatomy (`single.html` /
  `list.html`).
- **`partials/sidebar.html` is rewritten** (per-tab section sets + the new
  recursive `sidebar-tree.html`) — custom overrides of `sidebar.html` must be
  rebased. The active item is teal text only (the filled background is gone).
- **New theme asset `js/nav.js`** ships in the bundle (sidenav collapse +
  sessionStorage memory + the mobile drawer); `baseof.html` registers it —
  custom `baseof.html` overrides need the new script and the
  `{{ partial "drawer.html" . }}` include.
- **Single titled code blocks emit `.kt-codeblock__title`** instead of a lone
  active `.kt-codeblock__tab`.
- **Icons are unified at stroke 1.5** and dispatch over a generated map
  (`kt-icons.generated.html`); the legacy names `book` and `file` remain as
  aliases of `book-open` / `file-text`.
- **New conventions:** `[[menus.tabs]]` navbar tabs (see
  [Navbar tabs & sidebar](#navbar-tabs--sidebar)), section icons via
  `params.icon` in `_index.md`, `params.related` for Related topics,
  `params.github` for the topnav GitHub button, and the
  `accordion` / `accordion-group` shortcodes.

## License

- This package: Apache-2.0 — see [LICENSE](../../LICENSE).
- Bundled fonts: IBM Plex Sans + JetBrains Mono — both [SIL Open Font License 1.1](https://openfontlicense.org/).
- Bundled Kotlin brand SVGs: see [`static/img/NOTICE.md`](static/img/NOTICE.md).

## Development

Inside the kotlin-docs-kit monorepo:

```bash
task tokens:build       # rebuilds @ktdocs/tokens
task hugo:build         # syncs tokens → packages/hugo/{assets,static}
bash packages/hugo/tests/e2e.sh   # builds fixture + greps BEM markers
```

The fixture site at `packages/hugo/__fixtures__/minimal-site/` exercises every shortcode and is used as the smoke target in `tests/e2e.sh`.
