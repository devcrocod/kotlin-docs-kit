# @ktdocs/docusaurus-preset

Kotlin-styled Docusaurus 3 preset — themed components, swizzled layout, MDX globals.

Part of [kotlin-docs-kit](https://github.com/devcrocod/kotlin-docs-kit). Bundles the kit's
Kotlin-styled design tokens (fonts, palette, component CSS) into a working Docusaurus site,
registers the seven custom admonition keywords
(`success`, `caution`, `important`, `quote`, `example`, `deprecated`, `experimental`) and
makes the 13-component kit MDX surface available globally.

## Install

```bash
pnpm add @ktdocs/docusaurus-preset @docusaurus/core @docusaurus/preset-classic react react-dom
```

The preset embeds `@docusaurus/preset-classic` under the hood — replace it in your `presets`
array; do not list both.

## Configure

`docusaurus.config.ts`:

```ts
import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'My Kotlin Project',
  url: 'https://docs.example.com',
  baseUrl: '/',
  organizationName: 'your-org',
  projectName: 'your-project',

  presets: [
    [
      '@ktdocs/docusaurus-preset',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        pages: false,
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'My Project',
      logo: {
        alt: 'Kotlin',
        // Drop a logo into your site's static/img/ and reference it here. The kit's
        // brand SVGs live in the repo (packages/tokens/src/assets) and in the
        // templates/docusaurus starter — copy one in, or use your own.
        src: 'img/kotlin-logo.svg',
        srcDark: 'img/kotlin-logo-dark.svg',
      },
      items: [{ to: '/getting-started', label: 'Docs', position: 'left' }],
    },
    prism: {
      // Register Prism grammars the kit-styled syntax tokens highlight.
      additionalLanguages: ['kotlin', 'java', 'groovy', 'bash'],
    },
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
  },
};

export default config;
```

## What you get

### Stylesheets

Six CSS files are auto-injected via `customCss`. The first four are the kit's design tokens,
bundled into the preset at build time (you don't install them separately):

1. `fonts.css` — IBM Plex Sans, JetBrains Mono `@font-face`.
2. `colors_and_type.css` — palette, semantic colors, typography defaults.
3. `tokens.css` — spacing, radius, shadow, motion, z-index, layout dims.
4. `components.css` — `.kt-*` BEM contract for all 19 component groups.
5. `<preset>/css/custom.css` — Infima → kit token remap, 12 admonition styles, Prism token map.
6. `<preset>/css/docusaurus-overrides.css` — re-skin `.navbar`, `.menu`, `.table-of-contents`,
   `.breadcrumbs`, `.pagination-nav`, `[class^="codeBlockContainer"]`, `.tabs`, `.footer`.

To layer your own CSS on top, pass `theme.customCss` to the preset — files are appended last
so they override everything.

### Admonitions (12 kinds)

```mdx
:::note A neutral remark :::
:::info Informational detail :::
:::tip Pro tip :::
:::success Operation succeeded :::
:::warning Non-blocking caution :::
:::caution Orange escalation :::
:::danger Destructive action :::
:::important Required reading :::
:::quote Pull quote :::
:::example Illustrative example :::
:::deprecated Scheduled for removal :::
:::experimental Under design :::
```

The latter seven are registered automatically; you don't need to add `admonitions.keywords`
to your config. Each renders as a `.theme-admonition.theme-admonition-<kind>` host that the
kit's CSS re-skins to match `.kt-callout--<kind>`.

### Global MDX components

These are registered globally — no import required in any `.md` / `.mdx`:

| Component          | Description                                                                      |
| ------------------ | -------------------------------------------------------------------------------- | ---- | ---- | ----- | --------- |
| `<Callout>`        | 12-kind callout matching the admonition look. `type`, `title`.                   |
| `<Accordion>`      | `<details>` disclosure block, chevron left. `title`, `defaultOpen`.              |
| `<AccordionGroup>` | Bordered stack of accordions with hairline dividers.                             |
| `<Card>`           | Surface card. `href` (turns into anchor), `icon`, `title`, `arrow`, `hoverable`. |
| `<CardGrid>`       | Auto-fit `kt-card-grid` wrapper.                                                 |
| `<Hero>`           | Docs landing surface. `title`, `gradient`, `tagline`, `actions`.                 |
| `<FeatureGrid>`    | Fixed-column variant of `CardGrid`. `cols={2                                     | 3    | 4}`. |
| `<Badge>`          | 6 variants: `purple`, `pink`, `success`, `warning`, `danger`, `info`. `dot`.     |
| `<Method>`         | HTTP method label. `type="get                                                    | post | put  | patch | delete"`. |
| `<Tag>`            | Square monospace label.                                                          |
| `<Params>`         | Parameter table. `items={[{name, type?, required?, description?}]}`.             |
| `<State>`          | Empty / loading state. `icon`, `title`, `children`.                              |
| `<CodeTabs>`       | Premium multi-file code block. `items={[{label, language, code}]}`.              |

For Docusaurus' built-in `<Tabs>` / `<TabItem>` (content tabs), keep using them — the kit
re-skins their DOM via CSS so they match `.kt-tabs` visually.

### CodeBlock

Fenced code blocks render through the kit's swizzled CodeBlock. It supports the standard
Docusaurus metastring:

````mdx
```kotlin title="App.kt" {2,4-5} showLineNumbers
fun main() {
    val name = "Kotlin"
    println("Hello, $name!")
}
```
````

`bash`, `shell`, `sh`, `zsh`, `console`, and `terminal` language identifiers automatically
get the `.kt-codeblock--terminal` look (deep-purple-black surface).

## Navbar tabs & sidebar icons

The kit's shell follows the Mintlify pattern: top-level **tabs** in the
navbar, each owning its own sidebar tree. No preset option is needed — use
Docusaurus' native `docSidebar` navbar items with one named sidebar per tab
(the kit styles them as neutral pills):

```ts
// sidebars.ts — one named sidebar per tab
const sidebars = { docs: [...], reference: [...] };

// docusaurus.config.ts
navbar: {
  items: [
    { type: 'docSidebar', sidebarId: 'docs', label: 'Docs', position: 'left' },
    { type: 'docSidebar', sidebarId: 'reference', label: 'Reference', position: 'left' },
    // Single-page tab (no sidebar) — e.g. a changelog:
    { type: 'doc', docId: 'changelog', label: 'Changelog', position: 'left' },
  ],
}
```

Top-level sidebar categories act as section group headers — give them
`collapsible: false` and an icon from the kit's curated set via
`customProps`:

```ts
{
  type: 'category',
  label: 'Getting started',
  collapsible: false,
  customProps: { icon: 'rocket' },
  items: [...],
}
```

Available icon names: `rocket`, `book-open`, `map`, `layers`, `palette`,
`code`, `terminal`, `settings`, `wrench`, `puzzle`, `flag`, `file-text`,
`history`, `users`, `shield`, `sparkles`. Unknown names render no icon.

Nested categories stay collapsible and multi-open — keep
`themeConfig.docs.sidebar.autoCollapseCategories` at its default (`false`).

## Related topics

Add a manual "Related topics" list after any article's content (before the
prev/next pager) via the `related` front-matter key — a list of **doc IDs**
from the active docs version:

```md
---
title: Install the CLI
related:
  - getting-started/quickstart
  - reference/tokens
---
```

Titles and links resolve automatically from the docs metadata. Unresolvable
IDs are skipped (console warning in dev builds only) — never a build failure;
with nothing resolved the section doesn't render.

## Named imports (no MDX)

For TSX / JSX files outside MDX, import components by name:

```tsx
import { Callout, Card, CardGrid, Hero, Badge } from '@ktdocs/docusaurus-preset/components';
```

## Customization layers

In order of precedence (later overrides earlier):

1. The preset's bundled token CSS (fonts, palette, primitives, components) — base kit tokens.
2. `<preset>/css/custom.css` and `docusaurus-overrides.css` — Infima remap and Docusaurus
   DOM re-skin.
3. Your CSS passed via `theme.customCss` in preset options.
4. Per-page or per-component overrides in your `src/css/` or component-level styles.

To override a CSS token globally:

```css
:root {
  --kt-purple-500: #8e68ff; /* shift brand hue */
  --docs-shell-max: 1600px; /* widen the layout */
}
```

To override a theme component, swizzle it from your site as usual:

```bash
pnpm docusaurus swizzle @ktdocs/docusaurus-preset Navbar --wrap
```

## Compatibility

| Preset | Docusaurus | Tested against |
| ------ | ---------- | -------------- |
| 0.x    | 3.5 – 3.10 | 3.10.1         |

## License

Apache-2.0.
