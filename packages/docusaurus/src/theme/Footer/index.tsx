import React from 'react';
import OriginalFooter from '@theme-init/Footer';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof OriginalFooter>;

/**
 * Wrap the original Footer. Visual styling is handled in docusaurus-overrides
 * (`.footer`, `.footer__title`, `.footer__link-item`). The wrapper is kept as
 * a seam for future Kotlin-branded footer elements (status badges, build info).
 */
export default function Footer(props: Props): React.ReactElement | null {
  if (!OriginalFooter) return null;
  return <OriginalFooter {...props} />;
}
