import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Two named sidebars — one per navbar tab (type: 'docSidebar' items in
 * docusaurus.config.ts). Changelog is a single-page tab (type: 'doc' item,
 * no sidebar). Doc IDs and URLs are unchanged from the single-sidebar era.
 *
 * Top-level categories are section group headers (Mintlify pattern):
 * `collapsible: false` + a curated icon via `customProps.icon`
 * (rendered by the DocSidebarItem/Category swizzle).
 */
const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Getting started',
      collapsible: false,
      customProps: { icon: 'rocket' },
      items: ['getting-started/choose-engine', 'getting-started/installation'],
    },
    {
      type: 'category',
      label: 'Engine guides',
      collapsible: false,
      customProps: { icon: 'book-open' },
      items: [
        {
          type: 'category',
          label: 'Docusaurus',
          items: [
            'guides/docusaurus/installation',
            'guides/docusaurus/configuration',
            'guides/docusaurus/variant-tabs',
            'guides/docusaurus/diagrams',
            'guides/docusaurus/versioning',
            'guides/docusaurus/seo',
            'guides/docusaurus/ai-friendly',
            'guides/docusaurus/customization',
            'guides/docusaurus/deploy',
          ],
        },
        {
          type: 'category',
          label: 'Hugo',
          items: [
            'guides/hugo/installation',
            'guides/hugo/configuration',
            'guides/hugo/customization',
            'guides/hugo/deploy',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Customization',
      collapsible: false,
      customProps: { icon: 'palette' },
      items: [
        'customization/layers',
        'customization/css-overrides',
        'customization/token-overrides',
        'customization/swizzling',
      ],
    },
    'roadmap',
    {
      type: 'category',
      label: 'Contributing',
      collapsible: false,
      customProps: { icon: 'users' },
      items: [
        'contributing/getting-started',
        'contributing/conventional-commits',
        'contributing/local-dev',
      ],
    },
    {
      type: 'category',
      label: 'Maintainer',
      collapsible: false,
      customProps: { icon: 'shield' },
      items: ['maintainer/mirrors'],
    },
  ],
  reference: [
    'reference/tokens',
    {
      type: 'category',
      label: 'Components',
      collapsible: false,
      customProps: { icon: 'layers' },
      items: [
        'reference/components/overview',
        'reference/components/brand',
        'reference/components/colors',
        'reference/components/type',
        'reference/components/spacing',
      ],
    },
  ],
};

export default sidebars;
