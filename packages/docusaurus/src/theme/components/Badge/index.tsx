import React from 'react';
import clsx from 'clsx';

export type BadgeVariant = 'purple' | 'pink' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps {
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function Badge({
  variant,
  dot,
  className,
  children,
}: BadgeProps): React.ReactElement {
  return (
    <span className={clsx('kt-badge', variant && `kt-badge--${variant}`, className)}>
      {dot ? <span className="kt-badge__dot" /> : null}
      {children}
    </span>
  );
}
