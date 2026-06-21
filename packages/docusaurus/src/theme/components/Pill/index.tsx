import React from 'react';
import clsx from 'clsx';

export interface PillProps {
  variant?: 'primary';
  href?: string;
  onClick?: React.MouseEventHandler;
  className?: string;
  children?: React.ReactNode;
}

export default function Pill({
  variant,
  href,
  onClick,
  className,
  children,
}: PillProps): React.ReactElement {
  const classes = clsx('kt-pill', variant && `kt-pill--${variant}`, className);
  if (typeof href === 'string') {
    return (
      <a className={classes} href={href} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button className={classes} type="button" onClick={onClick}>
      {children}
    </button>
  );
}
