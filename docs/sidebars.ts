import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  main: [
    'intro',
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      items: ['getting-started/choose-engine', 'getting-started/installation'],
    },
    {
      type: 'category',
      label: 'Engine guides',
      collapsed: false,
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
      label: 'Reference',
      collapsed: false,
      items: [
        'reference/tokens',
        {
          type: 'category',
          label: 'Components',
          items: [
            'reference/components/overview',
            'reference/components/brand',
            'reference/components/colors',
            'reference/components/type',
            'reference/components/spacing',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Customization',
      items: [
        'customization/layers',
        'customization/css-overrides',
        'customization/token-overrides',
        'customization/swizzling',
      ],
    },
    'roadmap',
    'changelog',
    {
      type: 'category',
      label: 'Contributing',
      items: [
        'contributing/getting-started',
        'contributing/conventional-commits',
        'contributing/local-dev',
      ],
    },
    {
      type: 'category',
      label: 'Maintainer',
      items: ['maintainer/mirrors'],
    },
  ],
};

export default sidebars;
