import React from 'react';
import clsx from 'clsx';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface MethodProps {
  type: HttpMethod;
  className?: string;
  children?: React.ReactNode;
}

export default function Method({ type, className, children }: MethodProps): React.ReactElement {
  return (
    <span className={clsx('kt-method', `kt-method--${type}`, className)}>
      {children ?? type.toUpperCase()}
    </span>
  );
}
