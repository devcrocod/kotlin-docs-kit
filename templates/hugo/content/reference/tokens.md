---
title: Design tokens
description: All CSS custom properties shipped by the theme.
weight: 10
---

The starter inherits every CSS custom property from the kit's design tokens,
shipped inside the theme module. Override any variable in your own stylesheet to
re-skin the site without touching HTML.

## Where they live

The theme bundles these stylesheets into one fingerprinted file via Hugo
Pipes:

| File                  | What's in it                                              |
| --------------------- | --------------------------------------------------------- |
| `fonts.css`           | `@font-face` for IBM Plex Sans + JetBrains Mono.          |
| `colors_and_type.css` | Brand palette + light/dark semantic colours + type scale. |
| `tokens.css`          | Spacing, radius, shadow, motion, z-index, layout.         |
| `components.css`      | All 16 component groups (BEM, `kt-` prefixed).            |
| `chroma.css`          | Chroma → `kt-tok-*` remap for syntax highlighting.        |

## Brand colour scales

Six brand ramps follow the Kotlin palette:

| Variable                       | Range                         |
| ------------------------------ | ----------------------------- |
| `--kt-color-purple-{50..900}`  | Primary brand (purple).       |
| `--kt-color-magenta-{50..700}` | Accent — gradients, callouts. |
| `--kt-color-red-{50..700}`     | Danger, errors.               |
| `--kt-color-pink-{50..700}`    | Highlights.                   |
| `--kt-color-orange-{50..600}`  | Warning.                      |
| `--kt-color-blue-{50..600}`    | Info, links.                  |

Neutral scale: `--gray-{0..950}` in 50-step increments.

Semantic primitives: `--green-*`, `--amber-*`, `--red-*`, `--cyan-*` at
`100/300/500/600` stops.

## Semantic tokens (light / dark)

These are the variables you'll override most often:

| Group       | Variables                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------ |
| Surface     | `--surface-page`, `--surface-default`, `--surface-raised`, `--surface-sunken`, `--surface-overlay`                 |
| Foreground  | `--fg-default`, `--fg-muted`, `--fg-subtle`, `--fg-inverse`                                                        |
| Border      | `--border-default`, `--border-muted`, `--border-strong`                                                            |
| Action      | `--color-primary`, `--color-primary-hover`, `--color-primary-active`, `--color-primary-soft`                       |
| Accent      | `--color-accent`, `--color-accent-soft`                                                                            |
| Link        | `--color-link`, `--color-link-hover`, `--color-link-visited`                                                       |
| Focus       | `--color-focus`                                                                                                    |
| Callouts    | `--color-{note,info,tip,success,warning,caution,danger,important,quote,example,deprecated,experimental}` + `-soft` |
| Code syntax | `--code-bg`, `--code-fg`, `--code-line-bg`, `--code-line-hl`, `--kt-tok-{k,s,n,c,f,t,p,a}`                         |

## Typography

| Variable      | Default                                     |
| ------------- | ------------------------------------------- |
| `--font-sans` | `"IBM Plex Sans", system-ui, sans-serif`    |
| `--font-mono` | `"JetBrains Mono", ui-monospace, monospace` |

The 8-token type scale (`--type-display`, `--type-h1`, `--type-h2`,
`--type-h3`, `--type-body`, `--type-small`, `--type-caption`,
`--type-code`) drives every heading and body size.

## Spacing

4-px grid via `--space-{0, px, 0_5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24}`
(values: 0, 1px, 2px, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96).

## Radius, shadow, motion

| Variable                                | Values                       |
| --------------------------------------- | ---------------------------- |
| `--radius-{none, sm, md, lg, xl, full}` | 0 / 4 / 6 / 8 / 12 / 9999 px |
| `--shadow-{xs, sm, md, lg, brand-glow}` | Light + dark variants.       |
| `--motion-{fast, base, slow}`           | 120 / 200 / 320 ms           |
| `--motion-ease`                         | `cubic-bezier(0.2, 0, 0, 1)` |

## Layout

| Variable               | Default |
| ---------------------- | ------- |
| `--docs-sidebar-width` | 260px   |
| `--docs-toc-width`     | 220px   |
| `--docs-content-max`   | 720px   |
| `--docs-shell-max`     | 1440px  |
| `--docs-header-height` | 60px    |
| `--reading-measure`    | 72ch    |

## Overriding

Drop `assets/css/brand.css` into your site, then chain it from a custom
`layouts/partials/head.html` (see
[Customisation → CSS variable overrides](../../guides/customization/#css-variable-overrides)).

```css
:root {
  --color-primary: #ff6b35;
  --color-link: var(--color-primary);
}
```

Overrides apply across both palettes via the `[data-theme]` mechanism the
kit uses for dark mode.
