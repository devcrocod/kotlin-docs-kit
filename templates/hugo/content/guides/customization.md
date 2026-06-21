---
title: Customisation
description: Site identity, CSS variable overrides, overriding partials and shortcodes.
weight: 20
---

`kotlin-docs-hugo` is opinionated by design — the whole point is visual
parity with the Docusaurus flavour of kotlin-docs-kit. But the
common knobs are still exposed.

## Site identity

The cheapest layer is `hugo.toml`:

```toml
title = "My project"
baseURL = "https://example.com/"

[params]
  version = "1.0.0"
  description = "Docs for my project."

[[menu.main]]
  name = "GitHub"
  url = "https://github.com/me/project"
  weight = 100
```

Drop your own logo SVG into `static/img/` and reference it from a custom
`partials/header.html` (see "Overriding partials" below).

## CSS variable overrides

The lightest _visual_ override is your own stylesheet on top of the kit's
tokens. Drop it into `assets/css/brand.css` and pipe it through Hugo's
asset pipeline:

```css
/* assets/css/brand.css */
:root {
  --color-primary: #ff6b35;
  --color-link: var(--color-primary);
}

[data-theme='dark'] {
  --color-primary: #ffa371;
}
```

Then add this to a custom `layouts/partials/head.html` that extends the
theme's:

```go-html-template
{{- partial "head.html" . -}}
{{- with (resources.Get "css/brand.css" | minify | fingerprint) -}}
  <link rel="stylesheet" href="{{ .RelPermalink }}" integrity="{{ .Data.Integrity }}">
{{- end -}}
```

See the [tokens reference](../../reference/tokens/) for the full list of
overridable variables.

## Overriding partials and shortcodes

Hugo's layout lookup walks your site first, then the theme. To override
anything, drop a file at the same path under your site root:

- Override the topnav: `layouts/partials/header.html`
- Override a shortcode: `layouts/shortcodes/callout.html`
- Override the base layout: `layouts/_default/baseof.html`

Start by copying the file you want to change from the theme module, then
edit. The BEM contract is a hard boundary — see the
[components reference](../../reference/components/) — so prefer CSS
variables and `extra_css` whenever a tweak is purely visual.

## Palette toggle

The theme ships `<html data-theme="light">` by default. A pre-paint inline
script in `head.html` reads `localStorage.theme` (or
`prefers-color-scheme`) before the body paints, so there's no flash.

If you want to default to `dark`, override `_default/baseof.html` and flip
the attribute. The CSS tokens then resolve to the dark palette
automatically.

## What you should _not_ override

The BEM contract — class names, DOM structure of the 16 component groups —
is fixed. Changing it means forking the theme; visual parity with the
Docusaurus flavour is the whole point of the kit.
