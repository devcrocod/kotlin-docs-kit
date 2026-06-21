---
title: Customisation
description: Site identity, CSS variable overrides, swizzling components.
---

# Customisation

`@ktdocs/docusaurus-preset` is opinionated by design — the whole point is
visual parity with the Hugo flavour of kotlin-docs-kit. But the
common knobs are still exposed.

## Site identity

The cheapest layer is `docusaurus.config.ts`:

```ts
const config: Config = {
  title: 'My project',
  url: 'https://example.com',
  baseUrl: '/',
  organizationName: 'me',
  projectName: 'my-project',

  themeConfig: {
    navbar: {
      title: 'My project',
      logo: {
        alt: 'My project',
        src: 'img/my-logo.svg',
      },
    },
  },
};
```

Drop your own logo SVG into `static/img/` and point `navbar.logo.src` at
`img/my-logo.svg`. Docusaurus copies the `static/` tree into the built
site verbatim.

## CSS variable overrides

The lightest _visual_ override is your own stylesheet on top of the kit's
tokens. Pass it through the preset's `theme.customCss` option — files
listed here are appended _after_ the kit's CSS, so they win on cascade:

```ts
presets: [
  [
    '@ktdocs/docusaurus-preset',
    {
      docs: { sidebarPath: './sidebars.ts' },
      theme: {
        customCss: './src/css/brand.css',
      },
    },
  ],
],
```

```css
/* src/css/brand.css */
:root {
  --color-primary: #ff6b35;
  --color-link: var(--color-primary);
}

[data-theme='dark'] {
  --color-primary: #ffa371;
}
```

See the [tokens reference](../reference/tokens.mdx) for the full list of
overridable variables.

## Swizzling theme components

To override a React component shipped by the preset (e.g. the Navbar or
Footer), use Docusaurus' standard `swizzle` command:

```bash
pnpm docusaurus swizzle @ktdocs/docusaurus-preset Footer --wrap
```

`--wrap` is almost always what you want — it generates a thin wrapper
around the original component so you keep upstream improvements. `--eject`
copies the source verbatim and detaches you from upgrades.

:::caution
Heavy swizzling defeats the visual-parity guarantee. Prefer CSS variable
overrides for _visual_ tweaks, and only reach for swizzling when you need
behavioural changes (custom navbar links, footer content, etc.).
:::

## Layering on top of admonitions

The 12 callout kinds are wired through Docusaurus admonitions and styled by
the kit's CSS. To add your own kind, register the keyword and add CSS:

```ts
presets: [
  [
    '@ktdocs/docusaurus-preset',
    {
      docs: {
        admonitions: {
          keywords: ['my-kind'],
          extendDefaults: true,
        },
      },
    },
  ],
],
```

The seven kit-extras (`success`, `caution`, `important`, `quote`,
`example`, `deprecated`, `experimental`) are already registered — you can
extend, but the preset preserves them via `extendDefaults: true` when you
pass your own `admonitions` block.

## What you should _not_ override

The BEM contract — class names, DOM structure of the 16 component groups —
is fixed. Changing it means forking the preset; visual parity with the
Hugo flavour is the whole point of the kit.
