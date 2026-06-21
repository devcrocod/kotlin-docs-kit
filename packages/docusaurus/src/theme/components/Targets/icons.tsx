import React from 'react';
import type { KmpTarget } from './index';

/**
 * Simple line glyphs for Kotlin Multiplatform targets, drawn in the same style
 * as Callout/icons.tsx (24×24 viewBox, stroke="currentColor"). The label is the
 * primary signal; the icon is a small decorative cue.
 */
const targetPaths: Record<KmpTarget, React.ReactNode> = {
  jvm: (
    <>
      <path d="M6 9h10v4a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V9Z" />
      <path d="M16 10h2a2 2 0 0 1 0 4h-2" />
      <path d="M9 3v2" />
      <path d="M13 3v2" />
    </>
  ),
  js: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M11 9v5a2 2 0 0 1-3.2 1.6" />
    </>
  ),
  wasmJs: (
    <>
      <path d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3Z" />
      <path d="M8 12h8" />
    </>
  ),
  native: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3" />
    </>
  ),
  android: (
    <>
      <rect x="6" y="9" width="12" height="9" rx="2" />
      <path d="M8.5 9 7 6M15.5 9 17 6" />
      <path d="M10 13h.01M14 13h.01" />
    </>
  ),
  ios: (
    <>
      <path d="M16 13.5c0 2.8-1.9 5.5-3.4 5.5-1 0-1.5-.6-2.6-.6s-1.6.6-2.6.6C5.8 19 4 15.3 4 12.8 4 10.3 5.7 8.8 7.5 8.8c1 0 1.8.6 2.5.6s1.5-.7 2.7-.6c1 .03 2 .5 2.6 1.4" />
      <path d="M13 6c.5-1 .3-2.3-.6-3" />
    </>
  ),
  macos: (
    <>
      <path d="M16 13.5c0 2.8-1.9 5.5-3.4 5.5-1 0-1.5-.6-2.6-.6s-1.6.6-2.6.6C5.8 19 4 15.3 4 12.8 4 10.3 5.7 8.8 7.5 8.8c1 0 1.8.6 2.5.6s1.5-.7 2.7-.6c1 .03 2 .5 2.6 1.4" />
      <path d="M13 6c.5-1 .3-2.3-.6-3" />
    </>
  ),
  watchos: (
    <>
      <rect x="7" y="8" width="10" height="8" rx="2.5" />
      <path d="M9 8 8.5 4h7L15 8M9 16l-.5 4h7L15 16" />
    </>
  ),
  tvos: (
    <>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  linux: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M9.5 10h.01M14.5 10h.01" />
      <path d="M9.5 14.5c1.2 1.3 3.8 1.3 5 0" />
    </>
  ),
  mingw: (
    <>
      <path d="M4 6.2 11 5.2v6H4V6.2Z" />
      <path d="M13 4.9 20 4v7h-7V4.9Z" />
      <path d="M4 12.8h7v6L4 17.8v-5Z" />
      <path d="M13 12.8h7v7l-7-1v-6Z" />
    </>
  ),
};

export const TARGET_LABELS: Record<KmpTarget, string> = {
  jvm: 'JVM',
  js: 'JS',
  wasmJs: 'Wasm',
  native: 'Native',
  android: 'Android',
  ios: 'iOS',
  macos: 'macOS',
  watchos: 'watchOS',
  tvos: 'tvOS',
  linux: 'Linux',
  mingw: 'Windows',
};

export function TargetIcon({ target }: { target: KmpTarget }): React.ReactElement {
  return (
    <svg
      className="kt-targets__icon"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {targetPaths[target]}
    </svg>
  );
}
