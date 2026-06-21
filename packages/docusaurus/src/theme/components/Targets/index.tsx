import React from 'react';
import clsx from 'clsx';
import { TargetIcon, TARGET_LABELS } from './icons';

/**
 * Kotlin Multiplatform targets supported by an API. Mirrors the role of React
 * Native's `<PlatformSupport>` — a compact row of badges authors drop at the
 * top of a reference page to show where a symbol is available.
 */
export type KmpTarget =
  | 'jvm'
  | 'js'
  | 'wasmJs'
  | 'native'
  | 'android'
  | 'ios'
  | 'macos'
  | 'watchos'
  | 'tvos'
  | 'linux'
  | 'mingw';

export interface TargetsProps {
  /** Targets to show, in display order. */
  targets: KmpTarget[];
  /** Leading label. Pass `null` to hide it. Defaults to "Targets". */
  title?: React.ReactNode;
  className?: string;
}

export default function Targets({
  targets,
  title = 'Targets',
  className,
}: TargetsProps): React.ReactElement {
  return (
    <div className={clsx('kt-targets', className)}>
      {title ? <strong className="kt-targets__label">{title}</strong> : null}
      <div className="kt-targets__list">
        {targets.map((target) => (
          <span key={target} className="kt-targets__item">
            <TargetIcon target={target} />
            {TARGET_LABELS[target] ?? target}
          </span>
        ))}
      </div>
    </div>
  );
}
