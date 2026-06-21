import React from 'react';
import OriginalDocPaginator from '@theme-init/DocPaginator';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof OriginalDocPaginator>;

/**
 * Wrap DocPaginator in a `.kt-docs-pager` host. Visual styling is in
 * docusaurus-overrides.css (.pagination-nav, .pagination-nav__link,
 * .pagination-nav__sublabel, .pagination-nav__label).
 */
export default function DocPaginator(props: Props): React.ReactElement {
  return (
    <div className="kt-docs-pager">
      <OriginalDocPaginator {...props} />
    </div>
  );
}
