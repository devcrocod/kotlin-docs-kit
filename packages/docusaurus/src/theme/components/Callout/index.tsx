import React from 'react';
import clsx from 'clsx';
import { CalloutIcon } from './icons';

export type CalloutType =
  | 'note'
  | 'info'
  | 'tip'
  | 'success'
  | 'warning'
  | 'caution'
  | 'danger'
  | 'important'
  | 'quote'
  | 'example'
  | 'deprecated'
  | 'experimental';

export interface CalloutProps {
  type?: CalloutType;
  title?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export default function Callout({
  type = 'note',
  title,
  className,
  children,
}: CalloutProps): React.ReactElement {
  return (
    <aside className={clsx('kt-callout', `kt-callout--${type}`, className)}>
      <CalloutIcon type={type} />
      <div className="kt-callout__body">
        {title ? <strong className="kt-callout__title">{title}</strong> : null}
        <div className="kt-callout__content">{children}</div>
      </div>
    </aside>
  );
}
