import React from 'react';
import clsx from 'clsx';

export interface FeatureGridProps {
  /**
   * Number of columns at desktop width. Mobile collapses to a single column
   * (see the `.kt-feature-grid` rule in docusaurus-overrides.css).
   */
  cols?: 2 | 3 | 4;
  className?: string;
  children?: React.ReactNode;
}

/**
 * FeatureGrid is a thin wrapper over `.kt-card-grid` with a fixed-column hint.
 * Use plain `<CardGrid>` when the auto-fit layout is preferred.
 *
 * The column count is passed as the `--kt-feature-cols` custom property (not an
 * inline `grid-template-columns`, which has higher specificity than any
 * stylesheet rule and would block the mobile single-column media query).
 */
export default function FeatureGrid({
  cols = 3,
  className,
  children,
}: FeatureGridProps): React.ReactElement {
  return (
    <div
      className={clsx('kt-card-grid', 'kt-feature-grid', className)}
      style={{ '--kt-feature-cols': cols } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
