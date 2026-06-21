---
title: Deploy
description: First-time GitHub Pages setup for the bundled workflow.
---

# Deploy

The bundled GitHub Actions workflow ships your site to GitHub Pages on every
push to `main`. Here's the one-time setup.

## First-time setup

After clicking **Use this template** on
[`kotlin-docs-docusaurus-template`](https://github.com/devcrocod/kotlin-docs-docusaurus-template):

1. Go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push any change to `main` — the
   [`deploy.yml`](https://github.com/devcrocod/kotlin-docs-docusaurus-template/blob/main/.github/workflows/deploy.yml)
   workflow runs and publishes to `https://<you>.github.io/<repo>/`.

:::tip Custom domain
Want `docs.example.com`? Add a `static/CNAME` file containing your domain,
then configure the **Custom domain** field in Settings → Pages. Docusaurus
copies `static/` verbatim into the build output.

If you switch to a root domain, also update `url` / `baseUrl` in
`docusaurus.config.ts` — otherwise asset paths will be prefixed with the
old repo name.
:::

## How the workflow works

The bundled workflow is intentionally short:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

`pnpm build` runs Docusaurus with `onBrokenLinks: 'throw'`, so a bad PR can
never quietly ship a 404.

## Updating after a template release

Mirror-repo updates are _force-push_, by design — the canonical content
lives in the
[`kotlin-docs-kit`](https://github.com/devcrocod/kotlin-docs-kit) monorepo
under `templates/docusaurus/`. Your _clone_ of the template (the new repo
created via "Use this template") is yours; the template repo itself can be
re-synced upstream without disturbing your fork.

To pull a new starter feature into your repo, cherry-pick it from upstream
or copy the file manually — there's no automatic upstream merge.

## Build locally before pushing

```bash
pnpm build
```

Same command CI uses. If it passes locally, the workflow will pass too.
