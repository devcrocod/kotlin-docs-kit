# kotlin-docs-hugo-template

A Kotlin-styled Hugo starter — built on the
[`kotlin-docs-hugo`](https://github.com/devcrocod/kotlin-docs-kit/tree/main/packages/hugo)
theme module, part of the
[kotlin-docs-kit](https://github.com/devcrocod/kotlin-docs-kit) family.

This repository is **both the live demo and the GitHub template** for the
Hugo flavour of the kit. What you see at
<https://devcrocod.github.io/kotlin-docs-hugo-template/> is what you'll get
after clicking **Use this template**.

## Quick start

You need Hugo `>= 0.128.0` (extended is not required) and the Go toolchain
`>= 1.22` on PATH for module resolution.

```bash
git clone https://github.com/devcrocod/kotlin-docs-hugo-template.git my-docs
cd my-docs
hugo mod get -u
hugo server
```

Open <http://localhost:1313/>.

## First-time setup (after "Use this template")

1. **Settings → Pages → Source: GitHub Actions.** That's the only manual
   step. The bundled workflow handles the rest.
2. Update `baseURL` and `title` in [`hugo.toml`](./hugo.toml) so they match
   your new repo (or your custom domain).
3. Re-init the module if you renamed the repo:
   ```bash
   rm go.mod go.sum
   hugo mod init github.com/<you>/<repo>
   hugo mod get github.com/devcrocod/kotlin-docs-kit/packages/hugo@latest
   ```
4. Push any change to `main`. The
   [`deploy.yml`](.github/workflows/deploy.yml) workflow runs
   `hugo --minify` and publishes to `https://<you>.github.io/<repo>/`.
5. _(Optional)_ Add a `static/CNAME` file containing your domain and
   configure Settings → Pages → Custom domain.

Detailed walkthrough: [`content/getting-started/deploy.md`](content/getting-started/deploy.md).

## What's in here

```
templates/hugo/
├── hugo.toml                  # site config + [[module.imports]] for the theme
├── go.mod                     # Hugo module manifest
├── .github/workflows/deploy.yml
└── content/
    ├── _index.md              # Hero + FeatureGrid
    ├── getting-started/
    │   ├── _index.md
    │   ├── installation.md
    │   └── deploy.md
    ├── guides/
    │   ├── _index.md
    │   ├── basic-usage.md
    │   └── customization.md
    ├── reference/
    │   ├── _index.md
    │   ├── tokens.md
    │   └── components.md
    └── examples/
        ├── _index.md
        ├── callouts.md
        ├── code-tabs.md
        └── cards.md
```

The starter covers the kit's **Standard scope**: Home + Getting Started +
Guides + Reference + Examples. Add, remove or rename pages freely — just
keep the menu entries in `hugo.toml` in sync.

## Authoring

Engine-idiomatic Hugo — fenced code blocks, native frontmatter, plus the
kit's 14 shortcodes for the components that have no native syntax:

- 12 callout kinds via `{{</* callout type="tip" title="…" */>}}`.
- Premium multi-file code blocks via `{{</* code-tabs */>}}` + nested `{{</* code-tab */>}}`.
- Content tabs via `{{</* tabs */>}}` + nested `{{</* tab */>}}` (visually distinct from code tabs).
- Cards / hero / feature grid via `{{</* card */>}}`, `{{</* card-grid */>}}`, `{{</* hero */>}}`, `{{</* feature-grid */>}}`.
- Badge / method / tag via `{{</* badge */>}}`, `{{</* method */>}}`, `{{</* tag */>}}`.
- Parameter table via `{{</* params */>}}…name|type|desc…{{</* /params */>}}`.

See [`content/guides/basic-usage.md`](content/guides/basic-usage.md) for the
full tour and the [theme README](https://github.com/devcrocod/kotlin-docs-kit/tree/main/packages/hugo#shortcode-catalog)
for the shortcode catalog.

## Related

- [`kotlin-docs-kit`](https://github.com/devcrocod/kotlin-docs-kit) —
  monorepo with the theme module, design tokens, and the sibling Docusaurus template.
- [`kotlin-docs-hugo`](https://github.com/devcrocod/kotlin-docs-kit/tree/main/packages/hugo) —
  the Hugo Module this starter uses.
- [`@ktdocs/tokens`](https://github.com/devcrocod/kotlin-docs-kit/tree/main/packages/tokens) — the
  design tokens that drive every CSS custom property (rsynced into the theme module).

## License

Apache-2.0. Bundled fonts ship under OFL 1.1; Kotlin brand SVGs are
unmodified copies from [kotlinlang.org](https://kotlinlang.org/).

> This is a personal project, not officially affiliated with JetBrains or
> Kotlin Foundation.
