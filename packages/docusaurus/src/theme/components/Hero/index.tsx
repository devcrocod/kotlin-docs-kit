import React from 'react';
import clsx from 'clsx';

export interface HeroProps {
  title?: React.ReactNode;
  /**
   * Inline span at the end of the title rendered with the brand gradient text.
   * If `title` is omitted but `gradient` is set, the heading will be just the
   * gradient span.
   */
  gradient?: React.ReactNode;
  tagline?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export default function Hero({
  title,
  gradient,
  tagline,
  actions,
  className,
  children,
}: HeroProps): React.ReactElement {
  const hasHeading = title !== undefined || gradient !== undefined;
  return (
    <section className={clsx('kt-docs-hero', className)}>
      {hasHeading ? (
        <h1>
          {title}
          {title && gradient ? ' ' : null}
          {gradient ? <span className="kt-docs-hero__grad-text">{gradient}</span> : null}
        </h1>
      ) : null}
      {tagline ? <p>{tagline}</p> : null}
      {children}
      {actions ? <div className="kt-docs-hero__actions">{actions}</div> : null}
    </section>
  );
}
