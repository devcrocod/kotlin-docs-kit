import React from 'react';
import { ICONS } from './data.generated';

/**
 * Inline line-icon for kit chrome (Lucide-derived, ISC). The markup map is
 * generated from @ktdocs/tokens (single source of truth shared with the Hugo
 * theme's kt-icons.generated.html). Sizing is a default — component CSS may
 * override it. Unknown names render nothing so call sites can skip the icon
 * box; the miss is warned once at render in dev builds.
 */
export interface KtIconProps {
  name?: string;
  className?: string;
  size?: number;
}

export default function KtIcon({
  name,
  className,
  size = 18,
}: KtIconProps): React.ReactElement | null {
  if (!name) return null;
  const markup = ICONS[name];
  if (!markup) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`KtIcon: unknown icon "${name}"`);
    }
    return null;
  }
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
