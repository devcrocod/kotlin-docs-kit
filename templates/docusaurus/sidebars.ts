import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// Standard scope: Home + Getting Started + Guides + Reference + Examples.
// Mirrors the Hugo flavour of kotlin-docs-kit so the two live
// demos read identically.
//
// Top-level categories are section group headers (Mintlify pattern):
// `collapsible: false` plus a curated icon via `customProps.icon`. The
// `default` sidebar backs the "Docs" navbar tab (type: 'docSidebar' in
// docusaurus.config.ts); Changelog is a single-page tab with no sidebar.
const sidebars: SidebarsConfig = {
  default: [
    'intro',
    {
      type: 'category',
      label: 'Getting started',
      link: { type: 'doc', id: 'getting-started/installation' },
      collapsible: false,
      customProps: { icon: 'rocket' },
      items: [
        'getting-started/installation',
        'getting-started/first-page',
        'getting-started/deploy',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsible: false,
      customProps: { icon: 'book-open' },
      items: ['guides/basic-usage', 'guides/customization'],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsible: false,
      customProps: { icon: 'layers' },
      items: ['reference/tokens', 'reference/components'],
    },
    {
      type: 'category',
      label: 'Examples',
      collapsible: false,
      customProps: { icon: 'sparkles' },
      items: ['examples/callouts', 'examples/code-tabs', 'examples/cards'],
    },
  ],
};

export default sidebars;
