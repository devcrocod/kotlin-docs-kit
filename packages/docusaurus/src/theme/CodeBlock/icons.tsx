import React from 'react';

/**
 * Inline line-icons for the CodeBlock / CodeTabs chrome (Lucide, ISC).
 * Mirrors the SVGs in docs/contracts/preview/code-*.html. Sizing comes from
 * components.css (`.kt-codeblock__lang svg`, `.kt-codeblock__file-icon`,
 * `.kt-codeblock__action-btn svg` → 13px), so the width/height here are just
 * sensible defaults that those rules override.
 */
export type CodeIconName = 'code' | 'terminal' | 'file' | 'copy';

const paths: Record<CodeIconName, React.ReactNode> = {
  code: (
    <>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </>
  ),
  terminal: (
    <>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ),
};

export function CodeIcon({
  name,
  className,
}: {
  name: CodeIconName;
  className?: string;
}): React.ReactElement {
  return (
    <svg
      className={className}
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
      {paths[name]}
    </svg>
  );
}
