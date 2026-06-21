---
title: Installation
description: Prerequisites, cloning, running the dev server, building for production.
weight: 10
---

## Prerequisites

- **Hugo** 0.128.0 or newer (extended build not required)
- **Go** 1.22 or newer — Hugo uses the Go toolchain to resolve modules

Install Hugo via your platform's package manager. On macOS:

```bash
brew install hugo go
```

## Use this template

The fastest path is the GitHub **Use this template** button on
[`kotlin-docs-hugo-template`](https://github.com/devcrocod/kotlin-docs-hugo-template).
You get a brand-new repository with the deploy workflow already wired up.

{{< callout type="tip" title="Just exploring?" >}}
You can also clone the template repo directly and run it locally:

```bash
git clone https://github.com/devcrocod/kotlin-docs-hugo-template.git my-docs
cd my-docs
hugo mod get -u
hugo server
```

{{< /callout >}}

## Resolve the theme module

The theme is pulled via Hugo Modules. After cloning, fetch it once:

```bash
hugo mod get -u
```

If you renamed the repo, re-init the module first:

```bash
rm go.mod go.sum
hugo mod init github.com/<you>/<repo>
hugo mod get github.com/devcrocod/kotlin-docs-kit/packages/hugo@latest
```

## Run the dev server

```bash
hugo server
```

Open <http://localhost:1313/> — the theme picks up your OS colour scheme by
default, and the toggle in the header switches between light and dark.

## Build for production

```bash
hugo --minify
```

The static site lands in `public/`. The bundled
[`.github/workflows/deploy.yml`](https://github.com/devcrocod/kotlin-docs-hugo-template/blob/main/.github/workflows/deploy.yml)
does the same on every push to `main`, then uploads the result to GitHub
Pages.

## Next steps

- [Authoring guide](../../guides/basic-usage/) — callouts, code tabs, cards.
- [Customisation](../../guides/customization/) — palette overrides, custom logo.
- [Deploy](../deploy/) — first-time GitHub Pages setup.
