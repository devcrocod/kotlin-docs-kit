---
title: Deploy
description: First-time GitHub Pages setup for the bundled workflow.
weight: 20
---

The bundled GitHub Actions workflow ships your site to GitHub Pages on every
push to `main`. Here's the one-time setup.

## First-time setup

After clicking **Use this template** on
[`kotlin-docs-hugo-template`](https://github.com/devcrocod/kotlin-docs-hugo-template):

1. Go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Update `baseURL` in [`hugo.toml`](https://github.com/devcrocod/kotlin-docs-hugo-template/blob/main/hugo.toml)
   so it matches your repo URL (or your custom domain).
4. Push any change to `main` — the
   [`deploy.yml`](https://github.com/devcrocod/kotlin-docs-hugo-template/blob/main/.github/workflows/deploy.yml)
   workflow runs and publishes to `https://<you>.github.io/<repo>/`.

{{< callout type="tip" title="Custom domain" >}}
Want `docs.example.com`? Add a `static/CNAME` file containing your domain,
then configure the **Custom domain** field in Settings → Pages. Hugo copies
`static/` verbatim into the build output.

If you switch to a root domain, also update `baseURL` in `hugo.toml` —
otherwise asset paths will be prefixed with the old repo name.
{{< /callout >}}

## How the workflow works

The bundled workflow is intentionally short — install Go and Hugo, resolve
the theme module, build with the Pages-supplied `baseURL`, then upload.

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

env:
  HUGO_VERSION: 0.128.0

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'
      - name: Install Hugo CLI
        run: |
          wget -O "${RUNNER_TEMP}/hugo.deb" "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb"
          sudo dpkg -i "${RUNNER_TEMP}/hugo.deb"
      - id: pages
        uses: actions/configure-pages@v5
      - name: Resolve theme module
        run: hugo mod get -u
      - name: Build with Hugo
        env:
          HUGO_ENVIRONMENT: production
        run: hugo --minify --gc --baseURL "${{ steps.pages.outputs.base_url }}/"
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

`actions/configure-pages` injects the right `baseURL` automatically, so the
same workflow works for `*.github.io` and custom domains without edits.

## Updating after a template release

Mirror-repo updates are _force-push_, by design — the canonical content
lives in the
[`kotlin-docs-kit`](https://github.com/devcrocod/kotlin-docs-kit) monorepo
under `templates/hugo/`. Your _clone_ of the template (the new repo created
via "Use this template") is yours; the template repo itself can be
re-synced upstream without disturbing your fork.

To pull a new starter feature into your repo, cherry-pick it from upstream
or copy the file manually — there's no automatic upstream merge.

## Build locally before pushing

```bash
hugo --minify
```

Same command CI uses. If it passes locally, the workflow will pass too.
