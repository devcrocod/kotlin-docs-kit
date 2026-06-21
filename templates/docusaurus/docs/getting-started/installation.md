---
title: Installation
description: Clone the template, install dependencies, run the dev server.
---

# Installation

This starter is a working Docusaurus 3 site that uses
[`@ktdocs/docusaurus-preset`](https://www.npmjs.com/package/@ktdocs/docusaurus-preset) —
a Kotlin-styled preset that wraps `@docusaurus/preset-classic`. Clone it,
edit `docs/`, push.

## Prerequisites

- Node.js 20 or newer
- [`pnpm`](https://pnpm.io/) (recommended) — `npm` and `yarn` also work

## Use this template

The fastest path is the GitHub **Use this template** button on
[`kotlin-docs-docusaurus-template`](https://github.com/devcrocod/kotlin-docs-docusaurus-template).
You get a brand-new repository with the deploy workflow already wired up.

:::tip Just exploring?
You can also clone the template repo directly and run it locally:

```bash
git clone https://github.com/devcrocod/kotlin-docs-docusaurus-template.git my-docs
cd my-docs
pnpm install
pnpm start
```

:::

## Install dependencies

From the project root:

```bash
pnpm install
```

Or with `npm` / `yarn`:

```bash
npm install
# or
yarn install
```

## Run the dev server

```bash
pnpm start
```

Open [http://localhost:3000/](http://localhost:3000/). The theme picks up your OS colour scheme by
default; the toggle in the navbar flips between `kotlin-light` and
`kotlin-dark` (Docusaurus `colorMode.respectPrefersColorScheme` is on).

## Build for production

```bash
pnpm build
```

The static site lands in `build/`. The bundled
[`deploy.yml`](https://github.com/devcrocod/kotlin-docs-docusaurus-template/blob/main/.github/workflows/deploy.yml)
workflow runs the same command on every push to `main` and uploads the
result to GitHub Pages.

## Next steps

- [Write your first page](first-page.md) — frontmatter, sidebar, MDX components.
- [Author guide](../guides/basic-usage.mdx) — admonitions, code tabs, cards.
- [Deploy](deploy.md) — first-time GitHub Pages setup.
