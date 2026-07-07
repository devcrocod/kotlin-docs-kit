import React from 'react';
import {
  useSidebarBreadcrumbs,
  useDocsSidebar,
  useDoc,
} from '@docusaurus/plugin-content-docs/client';
import { useThemeConfig } from '@docusaurus/theme-common';

/**
 * Eyebrow — the immediate parent section label in teal mono above the H1
 * (Mintlify article-header anatomy). Replaces the 0.1.x breadcrumbs row.
 *
 * Label fallback chain: parent sidebar category → the navbar tab
 * (type:'docSidebar' item) owning this doc's sidebar → hidden. Hidden when it
 * would equal the page title (tab-root index pages).
 *
 * The `theme-doc-breadcrumbs` class is kept on the element: the copy-page
 * plugin anchors its article-mode injection "after breadcrumbs" when this is
 * a direct child of <article>.
 *
 * Unstable-API note: useSidebarBreadcrumbs/useDocsSidebar/useDoc come from
 * @docusaurus/plugin-content-docs/client — pinned via the ^3.5.0 peer range.
 */
export default function DocBreadcrumbs(): React.ReactElement | null {
  const breadcrumbs = useSidebarBreadcrumbs();
  const sidebar = useDocsSidebar();
  const { metadata } = useDoc();
  const { navbar } = useThemeConfig();

  let label: string | undefined;
  if (breadcrumbs && breadcrumbs.length > 1) {
    // The last breadcrumb is the current page; the one before is its parent.
    label = breadcrumbs[breadcrumbs.length - 2]?.label;
  }
  if (!label && sidebar?.name) {
    const tab = navbar.items.find(
      (item) =>
        item.type === 'docSidebar' && (item as { sidebarId?: string }).sidebarId === sidebar.name,
    );
    const tabLabel = (tab as { label?: unknown } | undefined)?.label;
    if (typeof tabLabel === 'string') label = tabLabel;
  }

  if (!label || label === metadata.title) return null;
  return <p className="kt-eyebrow theme-doc-breadcrumbs">{label}</p>;
}
