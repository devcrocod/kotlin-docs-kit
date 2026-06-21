---
title: Customization
sidebar_position: 3
---

# Hugo · Customization

The kit follows a [layered model](../../customization/layers.mdx). Start with the cheapest layer that fits.

## Layer 1 — Hugo config

Site title, menu, params, output formats — all in `hugo.toml`. No kit-specific changes required.

## Layer 2 — CSS variable override

Drop a CSS file under `assets/css/` of your site and pipe it through Hugo Pipes after the kit's CSS:

```toml
# hugo.toml
[params.css]
  brand = "css/brand.css"
```

```css
/* assets/css/brand.css */
:root {
  --kt-purple-500: #7b61ff;
  --font-sans: 'Inter', system-ui, sans-serif;
}
[data-theme='dark'] {
  --surface-1: #0c0d11;
}
```

Hugo's layout lookup ensures your `head.html` partial (if you override it) loads `brand.css` after the kit's `colors_and_type.css` / `tokens.css` / `components.css`.

## Layer 3 — Override a layout or partial

Hugo's layout lookup is **your project's `layouts/` before the theme's**. Just put a file with the matching path in your site:

```
layouts/
  partials/
    footer.html                 # wins over the module's footer
  shortcodes/
    myhero.html                 # custom shortcode
```

## Layer 4 — Custom shortcode

Hugo shortcodes are the most ergonomic way to ship custom inline content:

```go-html-template
{{/* layouts/shortcodes/myhero.html */}}
<section class="kt-docs-hero">
  <h1 class="kt-hero__grad-text">{{ .Get "title" }}</h1>
  <p>{{ .Get "subtitle" }}</p>
</section>
```

```markdown
{{< myhero title="Welcome" subtitle="Kotlin docs in Hugo." >}}
```

## What you should not override

- BEM class names (`.kt-callout`, `.kt-codeblock`, `.kt-docs-shell` …) — the shared contract.
- The kit's chroma overrides (`chroma.css`) — those map Pygments classes onto `.kt-tok-*`. If you really need different syntax colours, override the `--code-*` token values instead.
