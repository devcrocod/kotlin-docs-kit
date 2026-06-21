---
title: Getting started
sidebar_position: 1
---

# Contributing · Getting started

The repo is a monorepo with two language ecosystems (Node + Go) wired together by `pnpm` and `go-task`. Bootstrap should be a single command once you have the runtimes installed.

## Prerequisites

- **Node.js 20+** and **pnpm 9+**
- **Hugo extended 0.110+** and **Go 1.21+**
- **`go-task`** (`brew install go-task` on macOS; see [taskfile.dev](https://taskfile.dev/installation/) for other platforms)

## Clone and install

```bash
git clone https://github.com/devcrocod/kotlin-docs-kit.git
cd kotlin-docs-kit
task install                # runs pnpm install
```

## Common tasks

```bash
task --list                 # list all available tasks

task tokens:build           # build @ktdocs/tokens (Style Dictionary)
task docusaurus:build       # build the Docusaurus preset
task hugo:build             # build the Hugo module

task ci                     # full pipeline: install → tokens → engines → templates → docs
```

## Run the docs site locally

```bash
pnpm --filter @ktdocs/docs-site start
```

Visit `http://localhost:3000/kotlin-docs-kit/`.

## Repo layout

```
packages/                   # publishable packages
├── tokens/                 # design tokens (DTCG → CSS / SCSS / JSON)
├── docusaurus/             # @ktdocs/docusaurus-preset
└── hugo/                   # Hugo Module

templates/                  # starter sites (synced to mirror template repos)
├── docusaurus/
└── hugo/

docs/                       # this site + landing homepage (Docusaurus, dogfood)
```

## Where to file issues and PRs

- **Bugs / feature requests** — [GitHub issues](https://github.com/devcrocod/kotlin-docs-kit/issues)
- **PRs** — fork, branch off `master`, follow [conventional commits](./conventional-commits.md), open against `master`
- **Security** — see [`SECURITY.md`](https://github.com/devcrocod/kotlin-docs-kit/blob/master/SECURITY.md)
