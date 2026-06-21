module github.com/devcrocod/kotlin-docs-kit/templates/hugo

go 1.22

// Theme resolution: the kotlin-docs-hugo theme is declared in hugo.toml
// ([[module.imports]]) and resolved at build time by `hugo mod get -u`
// (see .github/workflows/deploy.yml). For local dev inside the kotlin-docs-kit
// monorepo, the placeholder require + replace below wire it to the in-repo
// package; sync-templates.yml strips both before mirroring, since the
// placeholder version is unresolvable for standalone consumers.
require github.com/devcrocod/kotlin-docs-kit/packages/hugo v0.0.0-unpublished

replace github.com/devcrocod/kotlin-docs-kit/packages/hugo => ../../packages/hugo
