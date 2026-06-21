import React from 'react';
import clsx from 'clsx';

export interface CardGridProps {
  className?: string;
  children?: React.ReactNode;
}

export default function CardGrid({ className, children }: CardGridProps): React.ReactElement {
  return <div className={clsx('kt-card-grid', className)}>{children}</div>;
}
