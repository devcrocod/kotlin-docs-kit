import React from 'react';
import clsx from 'clsx';

export interface ToggleProps {
  /** Controlled pressed state. Omit for uncontrolled behaviour. */
  pressed?: boolean;
  /** Initial pressed state when uncontrolled. */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  className?: string;
  children?: React.ReactNode;
}

export default function Toggle({
  pressed,
  defaultPressed,
  onPressedChange,
  className,
  children,
}: ToggleProps): React.ReactElement {
  const isControlled = pressed !== undefined;
  const [internal, setInternal] = React.useState(defaultPressed ?? false);
  const on = isControlled ? pressed : internal;
  const toggle = (): void => {
    const next = !on;
    if (!isControlled) setInternal(next);
    onPressedChange?.(next);
  };
  return (
    <button
      type="button"
      className={clsx('kt-toggle', className)}
      aria-pressed={on}
      onClick={toggle}
    >
      {children}
    </button>
  );
}
