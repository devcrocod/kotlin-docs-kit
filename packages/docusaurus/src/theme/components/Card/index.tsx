import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';

export interface CardProps {
  href?: string;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  arrow?: React.ReactNode | boolean;
  hoverable?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function Card({
  href,
  icon,
  title,
  arrow,
  hoverable,
  className,
  children,
}: CardProps): React.ReactElement {
  const isLink = typeof href === 'string';
  const effectiveHoverable = hoverable ?? isLink;
  const classes = clsx('kt-card', effectiveHoverable && 'kt-card--hoverable', className);
  const body = (
    <>
      {icon ? <div className="kt-card__icon">{icon}</div> : null}
      {title ? <h3 className="kt-card__title">{title}</h3> : null}
      {/* `<div>` (not `<p>`) so block-level MDX children — lists, code blocks,
          nested grids — stay valid HTML and don't trigger a hydration mismatch. */}
      {children ? <div className="kt-card__body">{children}</div> : null}
      {arrow ? <span className="kt-card__arrow">{arrow === true ? '→' : arrow}</span> : null}
    </>
  );
  if (isLink) {
    // `@docusaurus/Link` resolves `to` against baseUrl and uses SPA client-side
    // navigation for internal links (a raw <a> would 404 under a non-root
    // baseUrl and force a full reload); it also adds rel/target for external URLs.
    return (
      <Link className={classes} to={href}>
        {body}
      </Link>
    );
  }
  return <div className={classes}>{body}</div>;
}
