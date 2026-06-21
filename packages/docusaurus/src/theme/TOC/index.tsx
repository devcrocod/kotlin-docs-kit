import React from 'react';
import OriginalTOC from '@theme-init/TOC';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof OriginalTOC>;

/**
 * Wrap TOC in a `.kt-toc` host. Visual styling is done in
 * docusaurus-overrides.css against `.table-of-contents` and `.table-of-contents__link`.
 */
export default function TOC(props: Props): React.ReactElement {
  return (
    <div className="kt-toc">
      <OriginalTOC {...props} />
    </div>
  );
}
