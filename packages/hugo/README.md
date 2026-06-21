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

The topnav exposes `.Site.Menus.main` automatically. Add more `[[menu.main]]` entries to populate the primary nav row.

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
│       └── theme.js              ← toggle + tab interactivity
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
│   │   ├── header.html           ← .kt-topnav
│   │   ├── sidebar.html          ← .kt-sidenav
│   │   ├── toc.html              ← .kt-toc
│   │   ├── breadcrumbs.html      ← .kt-crumbs
│   │   ├── pager.html            ← .kt-docs-pager
│   │   └── footer.html
│   └── shortcodes/               ← the authoring surface (see below)
├── i18n/                         ← reserved for future translations
├── go.mod
├── theme.toml
└── README.md
```

## Shortcode catalog

All 14 shortcodes emit the BEM DOM specified in [`docs/contracts/components.md`](../../docs/contracts/components.md). The table below lists representative usage; full DOM is in the contract.

| Shortcode                | Example                                                                                                               | Emits                                                 |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `callout`                | `{{</* callout type="tip" title="Pro tip" */>}}body{{</* /callout */>}}`                                              | `.kt-callout kt-callout--tip` + icon + body           |
| `code-tabs` / `code-tab` | `{{</* code-tabs */>}}{{</* code-tab lang="kotlin" title="Main.kt" */>}}…{{</* /code-tab */>}}{{</* /code-tabs */>}}` | `.kt-codeblock` premium block with tabs               |
| `card`                   | `{{</* card title="Quickstart" href="/start" */>}}…{{</* /card */>}}`                                                 | `.kt-card` (link card when `href` set)                |
| `card-grid`              | `{{</* card-grid */>}}…cards…{{</* /card-grid */>}}`                                                                  | `.kt-card-grid` auto-fit wrapper                      |
| `hero`                   | `{{</* hero title="Kotlin docs" gradient="docs" */>}}actions{{</* /hero */>}}`                                        | `.kt-docs-hero` + `.kt-docs-hero__grad-text`          |
| `feature-grid`           | `{{</* feature-grid */>}}…cards…{{</* /feature-grid */>}}`                                                            | alias of `.kt-card-grid`                              |
| `badge`                  | `{{</* badge variant="success" */>}}stable{{</* /badge */>}}`                                                         | `.kt-badge kt-badge--success`                         |
| `method`                 | `{{</* method type="get" */>}}`                                                                                       | `.kt-method kt-method--get` (GET)                     |
| `tag`                    | `{{</* tag */>}}prerelease{{</* /tag */>}}`                                                                           | `.kt-tag`                                             |
| `tabs` / `tab`           | `{{</* tabs */>}}{{</* tab title="Kotlin" */>}}…{{</* /tab */>}}{{</* /tabs */>}}`                                    | `.kt-tabs` content switcher (distinct from code tabs) |
| `params`                 | `{{</* params */>}}timeout\|number · ms\|Request timeout.{{</* /params */>}}`                                         | `.kt-params` table; rows are `name\|type\|desc`       |
| `state`                  | `{{</* state kind="empty" title="No results" */>}}body{{</* /state */>}}`                                             | `.kt-state` empty/loading placeholder                 |

The `code-tabs` shortcode wraps Hugo's `transform.Highlight` (Chroma) — pass `lang` and `title` to each `code-tab`. Single-file premium code blocks can be rendered with one `code-tab` inside a `code-tabs`.

For inline syntax tokens authored by hand the eight `.kt-tok-*` classes from the contract are available: `<span class="kt-tok-k">fun</span>` etc.

## Theme toggle

`baseof.html` emits `<html data-theme="light">`. A pre-paint inline script in `head.html` reads `localStorage.theme` (or `prefers-color-scheme`) before the body paints, so there is no flash. Clicking the topnav theme button (`#theme-toggle`) flips `data-theme` and writes the new value to `localStorage`.

## What this package is NOT

- It is not a wrapper around `doks`, `geekdoc`, or any other Hugo theme — it is a standalone theme module.
- It does not bundle a search backend; `.kt-docs-search` is a presentational trigger. Wire up Algolia DocSearch, Pagefind, or Hugo's offline JSON search at the consumer site.
- It does not bundle an i18n bundle — `i18n/` is reserved.

## Customizing

You can override anything in this theme by placing a file with the same path in your own site:

- Override the topnav: `your-site/layouts/partials/header.html`
- Override a shortcode: `your-site/layouts/shortcodes/callout.html`
- Change token values: redeclare CSS custom properties in your own stylesheet loaded after the bundle. See [`@ktdocs/tokens` README](../tokens/README.md) for the full token list.

The BEM contract is a hard boundary — see [`docs/contracts/components.md`](../../docs/contracts/components.md). If you need DOM that differs from the contract, fork the theme.

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
