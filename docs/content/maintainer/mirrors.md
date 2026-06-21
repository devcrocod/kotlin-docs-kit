---
sidebar_label: Mirror repositories
title: Mirror repositories
description: One-time bootstrap and ongoing maintenance of the two template mirror repos that back the GitHub "Use this template" button.
---

This page is for **maintainers of `kotlin-docs-kit`** only. End users do not need to touch any of this — they just press "Use this template" on the mirror repos.

## Why mirrors exist

The two starters (`templates/docusaurus`, `templates/hugo`) live inside the monorepo so they can share workspace deps and be edited atomically with the engine packages they depend on. But GitHub's "Use this template" flag is a **per-repo** setting — a monorepo cannot expose two independent templates from one root.

The fix: each starter is mirrored into its own public repo. The monorepo is the source of truth; each mirror is an append-only force-pushed view of `templates/<engine>/` produced by `git subtree split`. Users template-copy from the mirror (not fork), so the force-push of the mirror's `master` never rewrites consumer history.

See SPEC §9 and §12.1 (at the repo root) for the rationale; this page focuses on the operational setup.

## One-time setup

Do this once per mirror, for both engines.

### 1. Create the mirror repo

| Engine     | Mirror repo                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| Docusaurus | [`devcrocod/kotlin-docs-docusaurus-template`](https://github.com/devcrocod/kotlin-docs-docusaurus-template) |
| Hugo       | [`devcrocod/kotlin-docs-hugo-template`](https://github.com/devcrocod/kotlin-docs-hugo-template)             |

For each: create an **empty public** repo (no README, no `.gitignore`, no license — the first `sync-templates.yml` run force-pushes a full history, and a non-empty repo causes a non-fast-forward refusal on the very first push).

### 2. Configure the mirror

In each mirror repo's **Settings**:

- **General → Template repository**: ON. (This is the flag that surfaces the "Use this template" button.)
- **Pages → Source**: GitHub Actions. The starter's own `.github/workflows/deploy.yml` (which travels into the mirror as part of the subtree split) will deploy the demo site to `https://devcrocod.github.io/kotlin-docs-<engine>-template/` on first push.
- **Custom domain** (optional): set via CNAME if you want a branded demo URL.

### 3. Mint the sync PAT

One PAT covers both mirrors.

1. Generate a **classic** Personal Access Token (Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token).
2. Scope: `public_repo` only. No other permissions.
3. Save it in the monorepo as repository secret **`TEMPLATES_MIRROR_TOKEN`** (Settings → Secrets and variables → Actions → New repository secret).

Until this secret is set, the workflow stays green but skips the push — see [Troubleshooting](#troubleshooting).

## How sync works

On every push to `master` that touches `templates/**`, `packages/hugo/**`, or `.github/workflows/sync-templates.yml`, the workflow runs two parallel matrix jobs (one per engine). Each job:

1. Checks out the monorepo with full history (`fetch-depth: 0`).
2. For Hugo only: strips the `replace github.com/devcrocod/kotlin-docs-kit/packages/hugo => ../../packages/hugo` line from `templates/hugo/go.mod` and commits the result on a throwaway commit. Outside the monorepo, that `replace` would point at a non-existent path, so consumers of the mirror need it gone.
3. Runs `git subtree split --prefix=templates/<engine> -b split-<engine>`, producing a branch whose root is `templates/<engine>/`.
4. Force-pushes `split-<engine>` → `<mirror>:master` over HTTPS using the PAT.

A manual re-sync is always available via the **Run workflow** button on `.github/workflows/sync-templates.yml` (Actions tab → Sync templates to mirrors → Run workflow).

## Force-push safety

Force-pushing `master` on the mirror is intentional. The mirror's history is derived deterministically from the monorepo's `templates/<engine>/` subtree, so each sync overwrites the same lineage with a refreshed version. This is safe because **users template-copy, they don't fork**: a template-copy creates a new repo with an independent root commit, so the mirror's history doesn't propagate to user clones.

The only thing the force-push affects is the mirror itself + its GitHub Pages deployment. Don't accept PRs against the mirror — they would be overwritten on the next sync. PRs belong on the monorepo, against `templates/<engine>/`.

## Troubleshooting

- **Log shows `TEMPLATES_MIRROR_TOKEN not set — skipping push (CI dry run)`.** The secret hasn't been set on the monorepo. The workflow intentionally treats this as a soft skip so the workflow can land green before the manual setup is complete.
- **Push fails with `non-fast-forward`.** The mirror was created with an initial commit (auto-generated README, license, etc.). Delete the mirror, recreate it empty, and re-run the workflow via `workflow_dispatch`.
- **Push fails with 403.** PAT scope is wrong (needs `public_repo` for public mirrors) or the token has expired. Mint a new one and rotate the secret.
- **Mirror site shows a 404 after first push.** The mirror's `Pages → Source` is still on the default. Switch it to GitHub Actions and re-trigger the deploy from the mirror's Actions tab.
