---
title: Conventional commits
sidebar_position: 2
---

# Conventional commits

The kit uses [conventional commits](https://www.conventionalcommits.org/) for every commit on `master`. Release Please reads commit history to determine the next version, generate the changelog, and open release PRs.

## Format

```
<type>(<scope>): <subject>

[body]

[footer]
```

## Types

| Type       | Bumps | When to use                                 |
| ---------- | ----- | ------------------------------------------- |
| `feat`     | minor | A user-visible new capability.              |
| `fix`      | patch | A user-visible bug fix.                     |
| `docs`     | none  | Documentation-only change.                  |
| `refactor` | none  | Code change with no behavioural change.     |
| `perf`     | patch | Performance improvement.                    |
| `test`     | none  | Adding or fixing tests.                     |
| `build`    | none  | Build-system, package config.               |
| `ci`       | none  | CI workflow changes.                        |
| `chore`    | none  | Maintenance — dep bumps, repo housekeeping. |
| `style`    | none  | Formatting only.                            |

## Scopes

Use the package or area name:

- `tokens` — `@ktdocs/tokens`
- `docusaurus` — `@ktdocs/docusaurus-preset`
- `hugo` — `kotlin-docs-hugo`
- `docs` — this docs site
- `templates` — starter sites

## Breaking changes

A breaking change bumps the **major** version. Mark it either by appending `!` to the type/scope, or by adding a `BREAKING CHANGE:` footer:

```
feat(tokens)!: rename --kt-purple-* to --brand-purple-*

BREAKING CHANGE: The kt-purple-* CSS custom properties have been renamed.
Engine packages that consume tokens@2 need to update their selectors.
```

## Examples

```
feat(docusaurus): add <Specimen/> MDX component

fix(tokens): correct contrast on color-callout-warning-soft in dark mode

docs(docs): expand customization layers explanation

chore(deps): bump @docusaurus/core to 3.5.2
```
