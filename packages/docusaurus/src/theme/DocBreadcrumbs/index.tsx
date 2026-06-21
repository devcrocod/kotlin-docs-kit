import React from 'react';
import OriginalDocBreadcrumbs from '@theme-init/DocBreadcrumbs';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof OriginalDocBreadcrumbs>;

/**
 * Wrap DocBreadcrumbs in a `.kt-crumbs` host. The Infima `.breadcrumbs` DOM
 * is re-skinned via CSS in docusaurus-overrides.css.
 */
export default function DocBreadcrumbs(props: Props): React.ReactElement {
  return (
    <div className="kt-crumbs">
      <OriginalDocBreadcrumbs {...props} />
    </div>
  );
}
