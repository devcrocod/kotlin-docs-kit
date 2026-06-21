import React from 'react';
import clsx from 'clsx';

export interface StateProps {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export default function State({
  icon,
  title,
  className,
  children,
}: StateProps): React.ReactElement {
  return (
    <div className={clsx('kt-state', className)}>
      {icon ? <div className="kt-state__icon">{icon}</div> : null}
      {title ? <h4 className="kt-state__title">{title}</h4> : null}
      {children ? <p className="kt-state__body">{children}</p> : null}
    </div>
  );
}
