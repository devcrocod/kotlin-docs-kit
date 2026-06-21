import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'Kotlin Docs Kit — Minimal Smoke Fixture',
  tagline: 'Disposable site for verifying @ktdocs/docusaurus-preset',
  url: 'http://localhost',
  baseUrl: '/',
  organizationName: 'devcrocod',
  projectName: 'kotlin-docs-kit',
  trailingSlash: false,
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  presets: [
    [
      '@ktdocs/docusaurus-preset',
      {
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        pages: false,
        seo: { organization: 'kotlin-docs-kit' },
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'kotlin-docs-kit',
      items: [
        { to: '/components/callouts', label: 'Components', position: 'left' },
        { to: '/tabs', label: 'Tabs', position: 'left' },
      ],
    },
    prism: {
      additionalLanguages: ['kotlin', 'java', 'groovy', 'bash'],
    },
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
  },
};

export default config;
