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
          editUrl: `https://github.com/${ORG}/${PROJECT}/edit/main/`,
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
        { to: '/getting-started/installation', label: 'Getting started', position: 'left' },
        { to: '/guides/basic-usage', label: 'Guides', position: 'left' },
        { to: '/reference/components', label: 'Reference', position: 'left' },
        { to: '/examples/callouts', label: 'Examples', position: 'left' },
        {
          href: `https://github.com/${ORG}/${PROJECT}`,
          label: 'GitHub',
          position: 'right',
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
