import React from 'react';
import OriginalTOC from '@theme-init/TOC';
import type { WrapperProps } from '@docusaurus/types';
import KtIcon from '../Icon';

type Props = WrapperProps<typeof OriginalTOC>;

/**
 * Wrap TOC in a `.kt-toc` host and prepend the "☰ On this page" label
 * (list glyph + mono uppercase text — toc.css). The host itself is the sticky
 * box (docusaurus-overrides.css) so the label sticks together with the list;
 * the inner .theme-doc-toc-desktop is made static there.
 */
export default function TOC(props: Props): React.ReactElement {
  return (
    <div className="kt-toc">
      <div className="kt-toc__label">
        <KtIcon name="list" className="kt-toc__label-icon" size={14} />
        <span>On this page</span>
      </div>
      <OriginalTOC {...props} />
    </div>
  );
}
