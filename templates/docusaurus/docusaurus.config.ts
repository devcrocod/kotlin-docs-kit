// Docusaurus starter for kotlin-docs-kit.
//
// This config doubles as the live demo site at
// https://devcrocod.github.io/kotlin-docs-docusaurus-template/ — anything you
// see rendered there is reproducible from the MDX under docs/.
//
// `@ktdocs/docusaurus-preset` wraps `@docusaurus/preset-classic` — replace
// preset-classic with it, do not list both.

import type { Config } from '@docusaurus/types';

const ORG = 'devcrocod';
const PROJECT = 'kotlin-docs-docusaurus-template';

const config: Config = {
  title: 'Kotlin Docs — Docusaurus starter',
  tagline: 'Standard-scope starter built on @ktdocs/docusaurus-preset.',
  favicon: 'img/kotlin-icon-color.svg',

  url: `https://${ORG}.github.io`,
  baseUrl: `/${PROJECT}/`,
  organizationName: ORG,
  projectName: PROJECT,
  trailingSlash: false,

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
    // mermaid: true, // enable together with the preset `mermaid: true` option
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
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: `https://github.com/${ORG}/${PROJECT}/edit/master/`,
        },
        blog: false,
        pages: false,

        // Opt-in features (each needs its optional peer dependency installed):
        // search: true,    // local offline search; or set themeConfig.algolia
        // seo: true,       // WebSite JSON-LD + social-card meta
        // llmsTxt: true,   // generate llms.txt / llms-full.txt
        // copyPage: true,  // "Copy page as Markdown" button + .md routes
        // mermaid: true,   // also requires `markdown: { mermaid: true }` below
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Kotlin Docs',
      logo: {
        alt: 'Kotlin',
        src: 'img/kotlin-icon-color.svg',
      },
      items: [
        // Navbar tabs: the docSidebar item owns the sidebar tree; Changelog is
        // a single-page tab (plain doc link, no sidebar).
        { type: 'docSidebar', sidebarId: 'default', label: 'Docs', position: 'left' },
        { type: 'doc', docId: 'changelog', label: 'Changelog', position: 'left' },
        {
          type: 'html',
          position: 'right',
          // Icon-only GitHub link as an inline SVG (fill="currentColor") so it
          // paints reliably and tints in both color modes.
          value:
            `<a class="header-github-link" href="https://github.com/${ORG}/${PROJECT}" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">` +
            '<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">' +
            '<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>' +
            '</svg></a>',
        },
      ],
    },
    footer: {
      style: 'light',
      copyright: `Built with <a href="https://github.com/devcrocod/kotlin-docs-kit">kotlin-docs-kit</a>. Personal project, not officially affiliated with JetBrains or Kotlin Foundation.`,
    },
    prism: {
      additionalLanguages: ['kotlin', 'java', 'groovy', 'bash'],
    },
  },
};

export default config;
