# kotlin-docs-docusaurus-template

A Kotlin-styled Docusaurus 3 starter — built on
[`@ktdocs/docusaurus-preset`](https://www.npmjs.com/package/@ktdocs/docusaurus-preset),
part of the [kotlin-docs-kit](https://github.com/devcrocod/kotlin-docs-kit)
family.

This repository is **both the live demo and the GitHub template** for the
Docusaurus flavour of the kit. What you see at
<https://devcrocod.github.io/kotlin-docs-docusaurus-template/> is what
you'll get after clicking **Use this template**.

## Quick start

```bash
git clone https://github.com/devcrocod/kotlin-docs-docusaurus-template.git my-docs
cd my-docs
pnpm install
pnpm start
```

Open <http://localhost:3000/>.

## First-time setup (after "Use this template")

1. **Settings → Pages → Source: GitHub Actions.** That's the only manual
   step. The bundled workflow handles the rest.
2. Update `url`, `baseUrl`, `organizationName`, `projectName` in
   [`docusaurus.config.ts`](./docusaurus.config.ts) so they match your new
   repo (or your custom domain).
3. Push any change to `main`. The
   [`deploy.yml`](.github/workflows/deploy.yml) workflow runs `pnpm build`
   and publishes to `https://<you>.github.io/<repo>/`.
4. _(Optional)_ Add a `static/CNAME` file containing your domain and
   configure Settings → Pages → Custom domain.

Detailed walkthrough: [`docs/getting-started/deploy.md`](docs/getting-started/deploy.md).

## What's in here

```
templates/docusaurus/
├── docusaurus.config.ts      # presets: ['@ktdocs/docusaurus-preset']
├── sidebars.ts               # Standard scope sidebar
├── package.json              # depends on @ktdocs/docusaurus-preset
├── tsconfig.json             # extends @docusaurus/tsconfig
├── static/img/               # bundled Kotlin SVGs (favicon, logo)
├── .github/workflows/deploy.yml
└── docs/
    ├── intro.mdx             # Hero + FeatureGrid
    ├── getting-started/
    │   ├── installation.md
    │   ├── first-page.md
    │   └── deploy.md
    ├── guides/
    │   ├── basic-usage.mdx
    │   └── customization.md
    ├── reference/
    │   ├── tokens.mdx
    │   └── components.mdx
    └── examples/
        ├── callouts.mdx
        ├── code-tabs.mdx
        └── cards.mdx
```

The starter covers the kit's **Standard scope**: Home + Getting Started +
Guides + Reference + Examples. Add, remove or rename pages freely — just
keep the entries in `sidebars.ts` in sync.

## Authoring

Engine-idiomatic MDX — everything that works in Docusaurus 3 works here:

- 12 callout kinds via `:::tip Title` admonition syntax, or `<Callout type="tip">`.
- Premium code blocks via fenced code with title / line highlights / `showLineNumbers`.
- File-tabbed code via `<CodeTabs items={…}/>` for multi-language samples.
- Content tabs via `<Tabs>` / `<TabItem>` from `@theme/Tabs`.
- Cards / hero / feature grid via `<Card>` / `<CardGrid>` / `<FeatureGrid>` / `<Hero>`.

The kit's component set is registered globally — no `import` required in
MDX files. See [`docs/guides/basic-usage.mdx`](docs/guides/basic-usage.mdx)
for the full tour.

## Related

- [`kotlin-docs-kit`](https://github.com/devcrocod/kotlin-docs-kit) —
  monorepo with the preset, design tokens, and the sibling Hugo template.
- [`@ktdocs/docusaurus-preset`](https://www.npmjs.com/package/@ktdocs/docusaurus-preset) —
  the preset this starter uses.
- [`@ktdocs/tokens`](https://github.com/devcrocod/kotlin-docs-kit/tree/main/packages/tokens) —
  the design tokens that drive every CSS custom property (bundled into the preset).

## License

Apache-2.0. Bundled fonts ship under OFL 1.1; Kotlin brand SVGs are
unmodified copies from [kotlinlang.org](https://kotlinlang.org/).

> This is a personal project, not officially affiliated with JetBrains or
> Kotlin Foundation.
