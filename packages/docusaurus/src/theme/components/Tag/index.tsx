import React from 'react';
import clsx from 'clsx';

export interface TagProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Tag({ className, children }: TagProps): React.ReactElement {
  return <span className={clsx('kt-tag', className)}>{children}</span>;
}
