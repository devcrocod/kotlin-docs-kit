# Contributing to kotlin-docs-kit

Thanks for your interest in contributing. This is a personal project, not officially affiliated with JetBrains or the Kotlin Foundation, but contributions from the community are very welcome.

## How to contribute

- **Bugs and feature requests** — open a [GitHub issue](https://github.com/devcrocod/kotlin-docs-kit/issues/new/choose). For anything non-trivial, please open an issue and agree on the approach **before** sending a PR.
- **Small fixes** (typos, dead links, obvious bugs) — a PR straight against `master` is fine.

## Branching

- Work happens on `master`.
- Feature branches: `feat/<short-desc>`, `fix/<short-desc>`, `docs/<short-desc>`, etc.
- Open a pull request against `master` when ready.

## Commit convention — Conventional Commits (required)

All commits **must** follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). [Release Please](https://github.com/googleapis/release-please) parses these to drive versioning and changelog generation across the packages.

**Format:**

```
<type>(<scope>)<!>: <subject>

[optional body]

[optional footer(s)]
```

**Allowed types:**

| Type | Purpose |
|---|---|
| `feat` | New feature (minor version bump) |
| `fix` | Bug fix (patch version bump) |
| `docs` | Documentation only |
| `chore` | Tooling, deps, no production code change |
| `refactor` | Code change that does not change behavior |
| `test` | Add or update tests |
| `build` | Build system or external deps |
| `ci` | CI configuration |
| `style` | Formatting only |
| `perf` | Performance improvement |

**Allowed scopes:** `tokens`, `mkdocs`, `docusaurus`, `hugo`, `landing`, `docs`, `ci`, `release`. The scope is optional but encouraged. Omit it for cross-cutting changes.

**Breaking changes:** append `!` after the type/scope (`feat(tokens)!: …`) **and/or** include a `BREAKING CHANGE:` footer.

**Examples:**

```
feat(tokens): add motion tokens
fix(docusaurus): hero alignment in dark mode
feat(mkdocs)!: drop support for Material 9.4
docs: update README
chore(ci): bump actions/checkout to v4
```

A commit that does not match Conventional Commits will not be accepted into `master`.

## Pull request process

1. Branch from `master`.
2. Make changes, keep commits small and Conventional.
3. Open a PR, fill out the [PR template](./.github/PULL_REQUEST_TEMPLATE.md), link the related issue (`Closes #N`).
4. CI must be green.
5. Request review from `@devcrocod`.

## Security

Do **not** report security vulnerabilities in public issues or PRs. Follow the process in [SECURITY.md](./SECURITY.md).

## License & CLA

By submitting a contribution, you agree that your contribution is licensed under the [Apache License 2.0](./LICENSE), the same license as the project. There is no CLA at this time.
