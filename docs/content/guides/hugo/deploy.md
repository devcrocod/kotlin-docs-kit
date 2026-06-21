---
title: Deploy
sidebar_position: 4
---

# Hugo · Deploy

The `templates/hugo/` starter ships a GitHub Actions workflow that builds and deploys to GitHub Pages on every push to `main`.

## GitHub Pages via Actions

`.github/workflows/deploy.yml`:

```yaml
name: Deploy Hugo

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
    env:
      HUGO_VERSION: 0.128.0
    steps:
      - uses: actions/checkout@v4
        with: { submodules: recursive, fetch-depth: 0 }
      - name: Install Hugo
        run: |
          wget -O hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb
          sudo dpkg -i hugo.deb
      - uses: actions/setup-go@v5
        with: { go-version: '1.22' }
      - name: Configure Pages
        id: pages
        uses: actions/configure-pages@v5
      - name: Build
        run: |
          hugo \
            --gc \
            --minify \
            --baseURL "${{ steps.pages.outputs.base_url }}/"
      - uses: actions/upload-pages-artifact@v3
        with:
          path: public

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deploy.outputs.page_url }}
    steps:
      - id: deploy
        uses: actions/deploy-pages@v4
```

## Repo settings

1. Settings → Pages → Source: **GitHub Actions**
2. (Optional) Custom domain → add `static/CNAME` so it ends up in the built site.

## Other hosts

Hugo's `public/` is plain static. Netlify, Cloudflare Pages, S3, nginx — all work. Make sure `baseURL` matches the URL you'll serve from.

```bash
hugo --minify --baseURL "https://my-domain.example/"
```
