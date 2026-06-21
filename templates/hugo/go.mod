module github.com/devcrocod/kotlin-docs-kit/templates/hugo

go 1.22

require github.com/devcrocod/kotlin-docs-kit/packages/hugo v0.0.0-unpublished

// Stripped by .github/workflows/sync-templates.yml when mirrored —
// consumers resolve the theme via `hugo mod get` against the published
// version instead.
replace github.com/devcrocod/kotlin-docs-kit/packages/hugo => ../../packages/hugo
