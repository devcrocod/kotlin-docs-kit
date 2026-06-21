import React from 'react';
import OriginalNavbar from '@theme-init/Navbar';
import type { WrapperProps } from '@docusaurus/types';

/**
 * Wrap the original Navbar. The `.kt-topnav` host class lets us reach the
 * Infima-emitted `.navbar` from CSS in docusaurus-overrides.css for visual
 * parity with the BEM contract (components.md §Topnav). All interactive
 * behaviour (mobile drawer, search, theme toggle) keeps coming from the
 * upstream Navbar — we only decorate the DOM.
 */
type Props = WrapperProps<typeof OriginalNavbar>;

export default function Navbar(props: Props): React.ReactElement {
  return (
    <div className="kt-topnav">
      <OriginalNavbar {...props} />
    </div>
  );
}
