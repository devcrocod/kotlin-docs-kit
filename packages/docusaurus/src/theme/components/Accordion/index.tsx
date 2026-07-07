import React from 'react';
import clsx from 'clsx';
import KtIcon from '../../Icon';

export interface AccordionProps {
  /** Summary label. */
  title: React.ReactNode;
  /** Render expanded on first paint. */
  defaultOpen?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/**
 * `<details>`-based disclosure block — zero JS, SSR-safe, multi-open by
 * default. The chevron sits left of the label and rotates when open
 * (accordion.css). Stack several inside <AccordionGroup> for the bordered
 * hairline-divided container.
 */
export default function Accordion({
  title,
  defaultOpen,
  children,
  className,
}: AccordionProps): React.ReactElement {
  return (
    <details className={clsx('kt-accordion', className)} open={defaultOpen}>
      <summary className="kt-accordion__summary">
        <KtIcon name="chevron-right" className="kt-accordion__chevron" size={16} />
        {title}
      </summary>
      <div className="kt-accordion__body">{children}</div>
    </details>
  );
}
