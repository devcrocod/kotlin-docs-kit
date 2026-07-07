---
title: Configuration
sidebar_position: 2
---

# Docusaurus · Configuration

All Docusaurus configuration knobs stay the same. The kit only adds a small set of options on top of `preset-classic`.

## Preset options

The kit's preset accepts the same options as `@docusaurus/preset-classic` (`docs`, `blog`, `pages`, `sitemap`, `svgr`, `theme`, `googleAnalytics`, `gtag`, `googleTagManager`, `debug`). It then:

- Injects four token CSS files (`fonts.css`, `colors_and_type.css`, `tokens.css`, `components.css`)
- Adds the Docusaurus shim (`custom.css`, `docusaurus-overrides.css`)
- Extends the admonition keyword list with `success`, `caution`, `important`, `quote`, `example`, `deprecated`, `experimental`

Anything you pass to `theme.customCss` is appended **after** the kit's CSS, so you can override any custom property at the page or element level.

```ts
presets: [
  [
    '@ktdocs/docusaurus-preset',
    {
      docs: {/* same as preset-classic */},
      theme: { customCss: './src/css/brand.css' },
    },
  ],
];
```

## Navbar

```ts
themeConfig: {
  navbar: {
    title: 'My docs',
    logo: { alt: 'Logo', src: 'img/logo.svg' },
    items: [
      { to: '/', label: 'Docs', position: 'left' },
      { to: '/reference', label: 'Reference', position: 'left' },
      { href: 'https://github.com/your-org/my-docs', label: 'GitHub', position: 'right' },
    ],
  },
}
```

The kit's `Navbar` swizzle wraps the Infima output in `.kt-topnav`, so the navbar matches the kit's contract without you doing anything.

## Footer

```ts
themeConfig: {
  footer: {
    style: 'light',
    links: [
      {
        title: 'Project',
        items: [
          { label: 'GitHub', href: 'https://github.com/your-org/my-docs' },
        ],
      },
    ],
    copyright: 'Copyright © 2025 Your Org',
  },
}
```

## Code blocks

Set `additionalLanguages` to whatever your codebase uses:

```ts
themeConfig: {
  prism: {
    additionalLanguages: ['kotlin', 'java', 'groovy', 'bash', 'toml', 'yaml'],
  },
}
```

The kit's `CodeBlock` swizzle adds a header strip (language label, copy button) and remaps Prism token classes onto `.kt-tok-*`.

## Search

The kit ships a themed search UI — both the search button and the DocSearch modal are re-skinned to the kit's tokens (light + dark). Pick one of two backends:

### Algolia DocSearch (hosted)

`@docusaurus/preset-classic` (embedded in the kit) already bundles Algolia. Just add credentials:

```ts
themeConfig: {
  algolia: {
    appId: 'YOUR_APP_ID',
    apiKey: 'YOUR_SEARCH_KEY',
    indexName: 'YOUR_INDEX',
    contextualSearch: true,
  },
}
```

Apply for free indexing at [docsearch.algolia.com](https://docsearch.algolia.com/apply/).

### Local offline search (no account)

For sites without Algolia, enable the kit's bundled local-search option. It registers [`@easyops-cn/docusaurus-search-local`](https://github.com/easyops-cn/docusaurus-search-local) (install it as a dependency):

```ts
presets: [
  [
    '@ktdocs/docusaurus-preset',
    {
      search: true, // or pass an options object straight through to the plugin
    },
  ],
];
```

Either way, the search button matches the kit's `.kt-docs-search` field and the modal follows your color mode automatically.

## React 18 & 19

The preset supports both React 18 and React 19 (`react: "^18.0.0 || ^19.0.0"`), matching `@docusaurus/core` 3.6+. New projects can use React 19; existing React 18 sites keep working with no change.

## Faster builds

Docusaurus' [Faster](https://docusaurus.io/blog/releases/3.6) toolchain (Rspack + SWC + Lightning CSS) is fully compatible with the kit. Enable it in your own `docusaurus.config.ts` — it is top-level config the preset cannot set for you:

```ts
const config: Config = {
  future: {
    v4: true, // smooths the eventual Docusaurus v4 upgrade
    faster: true, // Rspack/SWC/Lightning CSS — much faster builds
  },
  // ...
};
```

## Sidebars

`sidebars.ts` is plain Docusaurus. Manual sidebars give the most control:

```ts
const sidebars: SidebarsConfig = {
  main: ['intro', { type: 'category', label: 'Guides', items: ['guides/quickstart', 'guides/auth'] }],
};
export default sidebars;
```
