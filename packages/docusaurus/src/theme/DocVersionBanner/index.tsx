import React from 'react';
import OriginalDocVersionBanner from '@theme-init/DocVersionBanner';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof OriginalDocVersionBanner>;

/**
 * Wrap DocVersionBanner in a `.kt-version-banner` host. The Infima
 * `.theme-doc-version-banner` (alert--warning) DOM is re-skinned via
 * docusaurus-overrides.css; the wrapper is a seam for future kit decoration
 * (e.g. a brand icon or a "latest" CTA) without touching internals.
 */
export default function DocVersionBanner(props: Props): React.ReactElement {
  return (
    <div className="kt-version-banner">
      <OriginalDocVersionBanner {...props} />
    </div>
  );
}
