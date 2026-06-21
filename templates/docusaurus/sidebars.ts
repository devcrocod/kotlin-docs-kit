import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// Standard scope: Home + Getting Started + Guides + Reference + Examples.
// Mirrors the Hugo flavour of kotlin-docs-kit so the two live
// demos read identically.
const sidebars: SidebarsConfig = {
  default: [
    'intro',
    {
      type: 'category',
      label: 'Getting started',
      link: { type: 'doc', id: 'getting-started/installation' },
      collapsed: false,
      items: [
        'getting-started/installation',
        'getting-started/first-page',
        'getting-started/deploy',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: ['guides/basic-usage', 'guides/customization'],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      items: ['reference/tokens', 'reference/components'],
    },
    {
      type: 'category',
      label: 'Examples',
      collapsed: false,
      items: ['examples/callouts', 'examples/code-tabs', 'examples/cards'],
    },
  ],
};

export default sidebars;
