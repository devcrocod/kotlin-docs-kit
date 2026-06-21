import React from 'react';
import OriginalDocSidebar from '@theme-init/DocSidebar';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof OriginalDocSidebar>;

/**
 * Wrap DocSidebar in a `.kt-sidenav` host. The original Infima menu DOM is
 * styled via docusaurus-overrides.css (.menu / .menu__link / .menu__link--active);
 * the wrapper exists so future kit features (collapse indicators, group icons)
 * can scope new styles without touching internals.
 */
export default function DocSidebar(props: Props): React.ReactElement {
  return (
    <div className="kt-sidenav">
      <OriginalDocSidebar {...props} />
    </div>
  );
}
