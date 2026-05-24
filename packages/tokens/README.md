# @ktdocs/tokens

Kotlin-styled design tokens, fonts and component CSS for [kotlin-docs-kit](https://github.com/devcrocod/kotlin-docs-kit). DTCG W3C JSON in source, [Style Dictionary](https://styledictionary.com) at build time, plain CSS / SCSS / JSON / WOFF2 at the output.

Engine packages (`@ktdocs/docusaurus-preset`, `kotlin-docs-mkdocs`, `kotlin-docs-hugo`) consume this package and re-export its CSS into their own asset trees. Most users do not import this package directly — they pick an engine.

## Install

```bash
# Direct consumption (advanced).
pnpm add -D @ktdocs/tokens

# Or, via an engine package:
pnpm add -D @ktdocs/docusaurus-preset
pip install kotlin-docs-mkdocs
hugo mod get github.com/devcrocod/kotlin-docs-kit/packages/hugo
```

## What's in `dist`

| Path | What it is |
| ---- | ---------- |
| `dist/colors_and_type.css` | Primitive colors + light/dark semantic palette + typography scale + element defaults. `@import`s `fonts.css`. |
| `dist/tokens.css` | Spacing, radius, shadow (light + dark + auto-dark), motion, z-index, layout vars + `prefers-reduced-motion` reset. |
| `dist/components.css` | Concatenated CSS for all 17 BEM `kt-*` components: buttons, inputs, badges, tags, methods, callouts (12 kinds), code blocks (premium), cards, tabs, hero, breadcrumbs, navigation (top/side/toc), pager, params, article, shell, states. |
| `dist/fonts.css` | `@font-face` for IBM Plex Sans (400/500/600/700) + JetBrains Mono (400/500/700). Paths point at `./fonts/*.woff2` next to this CSS. |
| `dist/fonts/*.woff2` | 7 woff2 files. OFL 1.1. |
| `dist/assets/*.svg` | 5 Kotlin brand SVGs — see `dist/assets/NOTICE.md` for attribution. |
| `dist/scss/_tokens.scss` | All non-dark tokens as Sass variables (`$kt-purple-500`, `$space-4`, …). Dark theme overrides not exported here — use CSS cascade. |
| `dist/json/tokens.json` | Flat `{ name: value }` map of the same. For tooling. |

## CSS variable reference

### Brand (`--kt-*`)
Six ramps used by semantic tokens. Don't consume directly in components; use semantic aliases instead.
- `--kt-purple-{50..900}` — primary, K-mark canonical at 500.
- `--kt-magenta-{50..700}` — gradient midpoint at 500.
- `--kt-red-{50..700}` — gradient endpoint at 400.
- `--kt-pink-{50..700}`, `--kt-orange-{50..600}`, `--kt-blue-{50..600}`.
- `--kt-gradient`, `--kt-gradient-linear`, `--kt-gradient-soft` — the Kotlin K-mark gradient.

### Neutrals (`--gray-*`)
Mintlify-style cool gray ramp: `--gray-{0,50,100,150,200,300,400,500,600,700,800,850,900,950}`.

### Semantic primitives
Non-brand ramps backing success/warning/error states (consumed by semantic aliases, not directly):
`--green-{100,300,500,600}`, `--amber-{100,300,500,600}`, `--red-{100,300,500,600}`, `--cyan-{100,300,500,600}`.

### Surfaces / foreground / borders
- `--surface-{0,1,2,3,code,inverse}` — page bg, panels, code-block bg, inverse.
- `--fg-{1,2,3,disabled,on-brand}` — text colors.
- `--border-{1,2,strong}` — separator/divider lines.

### Brand semantics
- `--color-primary{,-hover,-active,-soft}`, `--color-accent{,-hover,-soft}`.
- `--color-link{,-hover,-visited}`.
- `--color-focus`, `--focus-ring` (`color-mix()` ring expression).

### Callout palette
Twelve kinds, each as a `(kind, kind-soft)` pair: `note`, `info`, `tip`, `success`, `warning`, `caution`, `danger`, `important`, `quote`, `example`, `deprecated`, `experimental`. E.g. `--color-warning`, `--color-warning-soft`.

### Code syntax
`--code-{bg,fg,line-bg,line-hl,keyword,string,number,comment,function,type,punctuation,tag}`.

### Typography
- `--font-sans`, `--font-mono` — family stacks (IBM Plex Sans / JetBrains Mono with system fallbacks).
- 8-step scale: `--type-{display,h1,h2,h3,body,small,caption,code}-{size,line,weight,tracking}`.
- Utility classes: `.t-display`, `.t-h1`, …, `.t-code`.

### Spacing / radius / shadow / motion / z-index
- `--space-{0,px,0_5,1,2,3,4,5,6,8,10,12,16,20,24}` — 4px base grid.
- `--radius-{none,sm,md,lg,xl,full}` — 0 / 4 / 6 / 8 / 12 / 9999px.
- `--shadow-{xs,sm,md,lg}` + `--shadow-brand-glow`. Dark overrides applied automatically.
- `--motion-{fast,base,slow}` + `--motion-ease`.
- `--z-{base,raised,sticky,overlay,modal,popover,toast,tooltip}` — 0 … 1400.

### Layout
- `--docs-sidebar-width` (260), `--docs-toc-width` (220), `--docs-content-max` (720), `--docs-shell-max` (1440), `--docs-header-height` (60).
- `--reading-measure` (72ch).

## Light / dark mechanics

Three selector tiers, listed by priority (high → low):

1. `[data-theme="light"]` / `[data-theme="dark"]` — explicit pin via `<html data-theme="light">`.
2. `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` — auto dark unless the user pinned light.
3. `:root` — default (light values).

So:
- Setting `<html data-theme="light">` always renders light, even in OS dark mode.
- Setting `<html data-theme="dark">` always renders dark.
- Leaving the attribute off follows the OS preference.

Engine packages wire a toggle that flips this attribute and persists the choice.

## Override patterns

Every variable can be re-pointed at `:root`. Some examples:

```css
/* Change the brand color to a custom hue */
:root { --color-primary: #FF7700; }

/* Stronger focus ring */
:root { --focus-ring: 0 0 0 4px var(--color-focus); }

/* Replace the prose font stack */
:root { --font-sans: "Inter", system-ui, sans-serif; }

/* Disable the bundled fonts entirely */
/* Don't import fonts.css — bring your own @font-face. */
```

The 17 components consume only semantic and `--kt-*` tokens, so overrides at this layer propagate everywhere.

## Components contract

The BEM `kt-*` class structure is the contract between the three engine packages. See [`docs/contracts/components.md`](../../docs/contracts/components.md) (issue #5) for the full reference, and the [Claude Design System preview specimens](../../docs/contracts/preview/) for live HTML examples.

## Build & validate

```bash
pnpm install                              # one-time
pnpm --filter @ktdocs/tokens run validate # DTCG schema check
pnpm --filter @ktdocs/tokens run build    # clean + validate + emit dist/
# or, from the repo root:
task tokens:build
```

The build runs in five stages:
1. `clean` — remove `dist/`.
2. `validate` — DTCG schema check on `src/**/*.json`.
3. `build:tokens` — Style Dictionary → CSS / SCSS / JSON.
4. `build:fonts` — copy seven woff2 from `@fontsource/*` + `src/fonts.css`.
5. `build:components` + `build:assets` — concat component CSS, copy SVGs.

## License

Apache-2.0 for the kit. Bundled fonts are OFL 1.1 (IBM Plex Sans, JetBrains Mono). Kotlin brand assets are used per the kotlinlang.org brand guidelines — see [`src/assets/NOTICE.md`](src/assets/NOTICE.md) (also copied to `dist/assets/NOTICE.md`).

This is a personal project, not officially affiliated with JetBrains or Kotlin Foundation.
