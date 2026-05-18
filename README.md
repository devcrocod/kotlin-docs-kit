# kotlin-docs-kit

Kotlin-styled documentation kit for MkDocs, Docusaurus, and Hugo.

> **Disclaimer:** This is a personal project, not officially affiliated with JetBrains or the Kotlin Foundation.

## Status

Pre-alpha · v0.1 in development. APIs and package names will change before the first stable release.

## What it is

`kotlin-docs-kit` packages a shared set of design tokens and content components (callouts, code tabs, cards, hero, badges) into themes/presets for three popular documentation engines. The same Kotlin-styled look and feel is available whether you author docs in MkDocs (Markdown), Docusaurus (MDX/React), or Hugo (shortcodes), with a single CSS variable contract underneath.

## Engines

| Engine | Package (working name) | Notes |
|---|---|---|
| MkDocs theme | `kotlin-docs-mkdocs` (PyPI) | Overrides on top of `mkdocs-material`. |
| Docusaurus preset | `@ktdocs/docusaurus-preset` (npm) | Preset on top of `@docusaurus/preset-classic`. |
| Hugo module | `github.com/devcrocod/kotlin-docs-kit/packages/hugo` (Go modules) | Hugo Module / theme. |

Package names above are working names and may change.

## Repository layout

```
packages/        # publishable artifacts: tokens + 3 engine themes
templates/       # 3 template projects (one per engine), also live demos
landing/         # static landing page
docs/            # self-docs site (Docusaurus, dogfood)
.github/         # CI workflows, issue and PR templates
```

## Contributing

Contributions welcome. Read [CONTRIBUTING.md](./CONTRIBUTING.md) for the Conventional Commits convention and PR process.

## Security

To report a vulnerability privately, see [SECURITY.md](./SECURITY.md). Please do **not** open public issues for security reports.

## License

Apache License 2.0. See [LICENSE](./LICENSE).

## Acknowledgements

- Fonts bundled with the kit: [JetBrains Mono](https://www.jetbrains.com/lp/mono/) and [Inter](https://rsms.me/inter/), both under the SIL Open Font License 1.1.
- Brand colors are derived from publicly available Kotlin / JetBrains assets. The official Kotlin logo is **not** bundled with this kit.
