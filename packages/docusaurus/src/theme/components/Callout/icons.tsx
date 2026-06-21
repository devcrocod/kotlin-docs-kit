import React from 'react';
import type { CalloutType } from './index';

const calloutPaths: Record<CalloutType, React.ReactNode> = {
  note: (
    <>
      <path d="M3 5h18" />
      <path d="M3 12h18" />
      <path d="M3 19h12" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </>
  ),
  tip: (
    <>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 1 7 7c0 3-2 5-3 6.5V18H8v-2.5C7 14 5 12 5 9a7 7 0 0 1 7-7z" />
    </>
  ),
  success: <path d="M20 6 9 17l-5-5" />,
  warning: (
    <>
      <path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  caution: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  danger: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </>
  ),
  important: (
    <>
      <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </>
  ),
  quote: (
    <>
      <path d="M3 21c3-1 5-3 5-6V8H4v7h4" />
      <path d="M15 21c3-1 5-3 5-6V8h-4v7h4" />
    </>
  ),
  example: (
    <>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </>
  ),
  deprecated: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </>
  ),
  experimental: (
    <>
      <path d="M9 2v6L3.5 18a2.5 2.5 0 0 0 2 4h13a2.5 2.5 0 0 0 2-4L15 8V2" />
      <path d="M7 2h10" />
      <path d="M7 16h10" />
    </>
  ),
};

export function CalloutIcon({ type }: { type: CalloutType }): React.ReactElement {
  return (
    <svg
      className="kt-callout__icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {calloutPaths[type]}
    </svg>
  );
}
