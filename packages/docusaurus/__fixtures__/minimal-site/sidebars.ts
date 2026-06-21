import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  default: [
    'intro',
    {
      type: 'category',
      label: 'Components',
      collapsed: false,
      items: [
        'components/callouts',
        'components/cards',
        'components/code',
        'components/inline',
        'components/api',
      ],
    },
    'tabs',
    'exports',
  ],
};

export default sidebars;
