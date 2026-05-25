# kotlin-docs-mkdocs

Kotlin-styled override theme for [mkdocs-material](https://squidfunk.github.io/mkdocs-material/),
part of the [kotlin-docs-kit](https://github.com/devcrocod/kotlin-docs-kit) monorepo.

This package is **not** a standalone MkDocs theme — it layers on top of
`mkdocs-material` via `theme.custom_dir` and re-skins Material's emitted DOM
to match the BEM contract defined in
[`docs/contracts/components.md`](https://github.com/devcrocod/kotlin-docs-kit/blob/main/docs/contracts/components.md).

## Install

```bash
pip install kotlin-docs-mkdocs
# or with uv
uv add kotlin-docs-mkdocs
```

The package depends on `mkdocs >= 1.6` and `mkdocs-material >= 9.5`.

## Usage

Add the override to your `mkdocs.yml`:

```yaml
site_name: My Project Docs

theme:
  name: material
  custom_dir: !!python/name:kotlin_docs_mkdocs.overrides
  logo: assets/img/kotlin-icon-color.svg
  favicon: assets/img/kotlin-icon-color.svg
  font: false                         # disable Google Fonts — our CSS ships IBM Plex Sans + JetBrains Mono
  palette:
    - media: "(prefers-color-scheme: light)"
      scheme: default
      toggle:
        icon: material/weather-night
        name: Switch to dark mode
    - media: "(prefers-color-scheme: dark)"
      scheme: slate
      toggle:
        icon: material/weather-sunny
        name: Switch to light mode
  features:
    - navigation.tabs
    - navigation.sections
    - navigation.indexes
    - navigation.top
    - navigation.footer
    - content.code.copy
    - content.tabs.link

markdown_extensions:
  - admonition
  - attr_list
  - md_in_html
  - pymdownx.details
  - pymdownx.superfences
  - pymdownx.tabbed:
      alternate_style: true

plugins:
  - search
```

That's it. Your site picks up:

- Kotlin brand palette (purple primary, magenta accent, gradient hero text).
- IBM Plex Sans + JetBrains Mono bundled — no Google Fonts request at runtime.
- All 12 admonition kinds remapped to `kt-callout--{kind}`, including the
  four Kotlin-extras Material doesn't ship (`caution`, `important`,
  `deprecated`, `experimental`).
- Premium code blocks with `pymdownx.tabbed` file tabs styled as
  `kt-codeblock__tabs`, and Pygments classes mapped onto the 8 `kt-tok-*`
  syntax tokens.
- 3-column docs shell (260 / content / 220) that drops the TOC at 1024 px
  and the sidebar at 720 px.
- Material's palette toggle automatically flipping `[data-theme]` on
  `<html>` so the design tokens follow.

## What's inside

```
kotlin_docs_mkdocs/
└── overrides/                       # → theme.custom_dir
    ├── main.html                    # extends base.html; injects CSS + theme sync
    ├── partials/
    │   ├── header.html              # wraps Material header in .kt-topnav
    │   ├── nav.html                 # wraps primary sidebar in .kt-sidenav
    │   ├── toc.html                 # wraps right rail in .kt-toc
    │   ├── footer.html              # .kt-docs-pager prev/next
    │   └── components/
    │       ├── card.html            # .kt-card
    │       ├── hero.html            # .kt-docs-hero
    │       ├── feature-grid.html    # .kt-card-grid
    │       └── params.html          # .kt-params
    └── assets/
        ├── stylesheets/             # synced from @ktdocs/tokens via Taskfile
        │   ├── fonts.css
        │   ├── colors_and_type.css
        │   ├── tokens.css
        │   ├── components.css
        │   └── mkdocs-overrides.css # the only hand-written CSS in this package
        ├── javascripts/
        │   └── theme-sync.js
        ├── fonts/                   # IBM Plex Sans + JetBrains Mono woff2 (OFL 1.1)
        └── img/                     # 5 Kotlin SVGs (kotlin-icon-color, …)
```

## Authoring

The full DOM contract is in
[`docs/contracts/components.md`](https://github.com/devcrocod/kotlin-docs-kit/blob/main/docs/contracts/components.md).
Engine-idiomatic syntax for each component (Material admonitions, pymdownx
tabbed code blocks, plain Markdown tables with `attr_list`) is summarised in
SPEC §7.3.

For the four component partials (`card`, `hero`, `feature-grid`, `params`)
that don't have a native Material syntax, use
[`mkdocs-macros-plugin`](https://mkdocs-macros-plugin.readthedocs.io/) and
`{% include %}` the partial with the appropriate context variables — see the
header comment inside each `partials/components/*.html`.

## License

Apache-2.0. Bundled fonts (IBM Plex Sans, JetBrains Mono) ship under their
own OFL 1.1 license; Kotlin brand SVGs are unmodified copies from
[kotlinlang.org](https://kotlinlang.org/). See `NOTICE` at the repo root.
