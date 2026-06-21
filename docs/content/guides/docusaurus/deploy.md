---
title: Deploy
sidebar_position: 4
---

# Docusaurus · Deploy

The `templates/docusaurus/` starter ships a GitHub Actions workflow that builds and deploys to GitHub Pages on every push to `main`.

## GitHub Pages via Actions

`.github/workflows/deploy.yml`:

```yaml
name: Deploy Docusaurus

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
        with: { version: 9 }
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
      url: ${{ steps.deploy.outputs.page_url }}
    steps:
      - id: deploy
        uses: actions/deploy-pages@v4
```

## Repo settings

1. Settings → Pages → Source: **GitHub Actions**
2. (Optional) Custom domain → add a `static/CNAME` so the file ends up in the build output

## Base URL

For a project page like `https://your-org.github.io/my-docs/`, set:

```ts
const config: Config = {
  url: 'https://your-org.github.io',
  baseUrl: '/my-docs/',
};
```

For a user/org site or a custom domain at the apex, use `baseUrl: '/'`.

## Other hosts

Docusaurus emits a plain static `build/` directory. Anything that serves static files works:

- **Netlify** — add a `netlify.toml` with `command = "pnpm build"`, `publish = "build"`
- **Vercel** — point at the repo, set framework to Docusaurus
- **Cloudflare Pages** — build command `pnpm build`, output `build`
