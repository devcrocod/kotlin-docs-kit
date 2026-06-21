import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'Kotlin Docs Kit',
  tagline: 'Kotlin-styled docs for Docusaurus and Hugo',
  favicon: 'img/favicon.svg',
  url: 'https://devcrocod.github.io',
  // Markdown is permissive in this dogfood site — reference docs link out to
  // contracts/preview files that live outside the routed docs root.
  onBrokenAnchors: 'warn',
  baseUrl: '/kotlin-docs-kit/',
  organizationName: 'devcrocod',
  projectName: 'kotlin-docs-kit',
  trailingSlash: false,
  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      '@ktdocs/docusaurus-preset',
      {
        docs: {
          path: 'content',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/devcrocod/kotlin-docs-kit/edit/master/docs/',
          showLastUpdateTime: true,
        },
        blog: false,
        // Pages plugin on: src/pages/index.tsx is the title page (home at /).
        pages: {},
        theme: {
          // Title-page layout (engine cards). Appended after the kit CSS by
          // the preset's resolveKitCss, so it can extend the shared tokens.
          customCss: './src/css/homepage.css',
        },
        // Dogfood the kit's opt-in features on its own site. (Mermaid is wired
        // and documented but left off here: this workspace resolves multiple
        // @docusaurus/theme-common instances — local preset + peer deps — which
        // trips theme-mermaid's SSG color-mode context. A normal published
        // install dedupes to one instance and renders fine.)
        search: { hashed: true, docsRouteBasePath: '/' },
        seo: { organization: 'kotlin-docs-kit' },
        llmsTxt: true,
        copyPage: true,
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Kotlin Docs Kit',
      logo: {
        alt: 'Kotlin Docs Kit',
        src: 'img/logo.svg',
      },
      items: [
        { to: '/intro', label: 'Docs', position: 'left' },
        { to: '/reference/components/overview', label: 'Components', position: 'left' },
        { to: '/reference/tokens', label: 'Tokens', position: 'left' },
        {
          type: 'html',
          position: 'right',
          // Icon-only GitHub link rendered as an inline SVG (not a CSS-mask
          // ::before), so it reliably paints and tints with currentColor in
          // both color modes. Box/hover styling: .header-github-link in
          // docusaurus-overrides.css.
          value:
            '<a class="header-github-link" href="https://github.com/devcrocod/kotlin-docs-kit" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">' +
            '<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">' +
            '<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>' +
            '</svg></a>',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Project',
          items: [
            { label: 'GitHub', href: 'https://github.com/devcrocod/kotlin-docs-kit' },
            {
              label: 'License (Apache 2.0)',
              href: 'https://github.com/devcrocod/kotlin-docs-kit/blob/master/LICENSE',
            },
          ],
        },
        {
          title: 'Engines',
          items: [
            { label: 'Docusaurus guide', to: '/guides/docusaurus/installation' },
            { label: 'Hugo guide', to: '/guides/hugo/installation' },
          ],
        },
        {
          title: 'Reference',
          items: [
            { label: 'Tokens', to: '/reference/tokens' },
            { label: 'Components', to: '/reference/components/overview' },
          ],
        },
      ],
      copyright: `kotlin-docs-kit · personal project · not officially affiliated with JetBrains or Kotlin Foundation`,
    },
    prism: {
      additionalLanguages: ['kotlin', 'java', 'groovy', 'bash', 'toml', 'yaml'],
    },
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
  },
};

export default config;
