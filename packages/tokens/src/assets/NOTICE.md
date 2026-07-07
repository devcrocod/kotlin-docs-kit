# Bundled assets — attribution

The files in this directory are bundled with `@ktdocs/tokens` and shipped to end-user sites.

## Kotlin brand assets (`*.svg`)

- `kotlin-icon-color.svg`, `kotlin-icon-black.svg`, `kotlin-icon-white.svg`
- `kotlin-logo.svg`, `kotlin-logo-dark.svg`

Derived from publicly available Kotlin brand assets (kotlinlang.org). The Kotlin name and K-mark are trademarks of the Kotlin Foundation. `kotlin-docs-kit` is a personal project and is **not officially affiliated with JetBrains or the Kotlin Foundation**.

## Fonts

- **IBM Plex Sans** (weights 400/500/600/700) — SIL Open Font License 1.1.
- **IBM Plex Mono** (weights 400/500) — SIL Open Font License 1.1.
- **JetBrains Mono** (weights 400/500/700) — SIL Open Font License 1.1.

The `.woff2` files are bundled in `fonts/` alongside the corresponding `@font-face` declarations in `fonts.css`, sourced from [Fontsource](https://fontsource.org/).

## Icons

The kit icon set (`packages/tokens/src/icons/*.svg`, built into `dist/icons.json` and the generated Hugo partial) is derived from [Lucide](https://lucide.dev/), licensed under ISC (© 2022 Lucide Contributors), with the stroke width normalized to 1.5. Any additional Lucide icons inlined directly into components share the same license.
