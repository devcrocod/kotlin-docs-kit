---
title: Local development
sidebar_position: 3
---

# Local development

Day-to-day workflow patterns once you've completed the [Getting started](./getting-started.md) bootstrap.

## Iterating on tokens

The tokens package builds CSS, SCSS, and JSON from DTCG sources. Watch mode is not built in; rebuild after each edit:

```bash
pnpm --filter @ktdocs/tokens build
```

The other packages consume `@ktdocs/tokens/dist/*` directly — pnpm's workspace symlinks pick up new builds without re-installing.

## Iterating on the Docusaurus preset

```bash
pnpm --filter @ktdocs/docusaurus-preset build:watch     # TypeScript watch
pnpm --filter @ktdocs/docs-site start                   # this site, hot reload
```

The minimal smoke fixture is a faster feedback loop than the full docs site when you're debugging the preset itself:

```bash
pnpm --filter @ktdocs-fixture/minimal-site start
```

## Iterating on Hugo

```bash
cd templates/hugo
hugo server
```

The `templates/hugo/go.mod` has a `replace` directive pointing at `../../packages/hugo`, so changes in the module are picked up immediately.

## Running tests

```bash
task ci                     # full pipeline
pnpm test                   # node-side tests
```

## Style and linting

The repo uses **ESLint** + **Prettier** for JS/TS/MDX, **gofmt** for Go, and **prettier** for JSON/YAML/Markdown.

```bash
pnpm lint
pnpm format
```

## Commit hooks

There are no commit hooks today — the CI workflow runs the linters on every PR. Run `pnpm lint && task ci` locally before pushing if you want to catch failures early.
