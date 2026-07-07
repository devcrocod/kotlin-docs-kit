import React from 'react';
import clsx from 'clsx';

export interface AccordionGroupProps {
  children?: React.ReactNode;
  className?: string;
}

/** Bordered stack of <Accordion> items with hairline dividers. */
export default function AccordionGroup({
  children,
  className,
}: AccordionGroupProps): React.ReactElement {
  return <div className={clsx('kt-accordion-group', className)}>{children}</div>;
}
