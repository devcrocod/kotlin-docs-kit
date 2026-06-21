import React from 'react';
import clsx from 'clsx';

export interface SegmentedOption {
  value: string;
  label: React.ReactNode;
}

export interface SegmentedProps {
  options: SegmentedOption[];
  /** Controlled selected value. Omit for uncontrolled behaviour. */
  value?: string;
  /** Initial value when uncontrolled. Defaults to the first option. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  ariaLabel?: string;
  className?: string;
}

/**
 * A single-choice segmented selector. Modelled as a WAI-ARIA radio group
 * (`radiogroup`/`radio` + `aria-checked` + arrow-key roving focus) rather than
 * a tablist, because it selects a value and is not wired to tab panels.
 */
export default function Segmented({
  options,
  value,
  defaultValue,
  onChange,
  ariaLabel,
  className,
}: SegmentedProps): React.ReactElement {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? options[0]?.value);
  const selected = isControlled ? value : internal;
  const segmentRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const select = (next: string): void => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    const current = options.findIndex((opt) => opt.value === selected);
    if (current < 0) return;
    let next = current;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (current + 1) % options.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      next = (current - 1 + options.length) % options.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = options.length - 1;
    else return;
    event.preventDefault();
    const nextValue = options[next]?.value;
    if (nextValue != null) {
      select(nextValue);
      segmentRefs.current[next]?.focus();
    }
  };

  return (
    <div
      className={clsx('kt-segmented', className)}
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
    >
      {options.map((opt, idx) => {
        const active = opt.value === selected;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              segmentRefs.current[idx] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            className={clsx('kt-segmented__segment', active && 'kt-segmented__segment--active')}
            onClick={() => select(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
