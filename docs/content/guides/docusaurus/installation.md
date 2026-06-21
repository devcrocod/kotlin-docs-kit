---
title: Installation
sidebar_position: 1
---

# Docusaurus · Installation

`@ktdocs/docusaurus-preset` is a regular Docusaurus preset. It wraps `@docusaurus/preset-classic` and adds the kit's tokens, MDX components, and a handful of theme swizzles.

## Requirements

- Node.js 20 or newer
- pnpm 9+ (or npm / yarn — pnpm recommended)
- Docusaurus 3.5+ and React 18

## Install

```bash
# In an existing Docusaurus site
pnpm add @ktdocs/docusaurus-preset

# Or scaffold a new site first
pnpm create docusaurus my-docs classic --typescript
cd my-docs
pnpm add @ktdocs/docusaurus-preset
```

## Minimal docusaurus.config.ts

```ts
import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'My docs',
  url: 'https://example.org',
  baseUrl: '/',
  organizationName: 'your-org',
  projectName: 'my-docs',
  onBrokenLinks: 'throw',

  presets: [
    [
      '@ktdocs/docusaurus-preset',
      {
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/your-org/my-docs/edit/main/',
        },
        blog: false,
        pages: false,
      },
    ],
  ],

  themeConfig: {
    prism: {
      additionalLanguages: ['kotlin', 'java', 'bash', 'toml'],
    },
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
  },
};

export default config;
```

The preset auto-injects the kit's CSS (fonts, palette, primitives, components) and the Infima override shim — you don't need to add `customCss` for any of that.

## Run a dev server

```bash
pnpm start
```

`docusaurus start` watches `docs/`, `sidebars.ts`, and your config. Edit `docs/intro.md` to start writing.

## Author content with kit components

Components are registered globally — use them in any MDX file without an import:

````mdx
<Callout type="tip" title="Heads up">
  Inline callouts work in any MDX page.
</Callout>

<CodeTabs>
  <CodeTabItem value="kt" label="Kotlin">
    ```kotlin fun main() = println("hi") ```
  </CodeTabItem>
</CodeTabs>
````

## Next

- [Configuration](./configuration.md) — site identity, navbar, footer, search
- [Customization](./customization.mdx) — CSS overrides and React swizzles
- [Deploy](./deploy.md) — GitHub Pages and other hosts
