import React from 'react';
import OriginalFooter from '@theme-init/DocItem/Footer';
import type { WrapperProps } from '@docusaurus/types';
import Link from '@docusaurus/Link';
import {
  useDoc,
  useDocsVersion,
  useActivePluginAndVersion,
} from '@docusaurus/plugin-content-docs/client';
import KtIcon from '../../Icon';

type Props = WrapperProps<typeof OriginalFooter>;

interface RelatedEntry {
  path: string;
  title: string;
}

/**
 * Related topics — manual, front-matter driven (`related: [doc-id, …]`).
 * Renders after the content, before the pager (DocItem/Footer sits exactly
 * there). Entries resolve doc IDs against the active version: the title from
 * the version's docs map, the permalink from the plugin's global data.
 * Unresolvable IDs are skipped (dev-only console warning) — never a build
 * failure.
 */
function useRelatedEntries(): RelatedEntry[] {
  const { frontMatter } = useDoc();
  const versionDocs = useDocsVersion().docs;
  const pluginAndVersion = useActivePluginAndVersion();
  const globalDocs = pluginAndVersion?.activeVersion?.docs ?? [];

  const raw = (frontMatter as { related?: unknown }).related;
  if (!Array.isArray(raw)) return [];

  const entries: RelatedEntry[] = [];
  for (const id of raw) {
    if (typeof id !== 'string') continue;
    const meta = versionDocs[id];
    const globalDoc = globalDocs.find((d) => d.id === id);
    if (!meta || !globalDoc) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`related: doc id "${id}" not found in the active docs version — skipped`);
      }
      continue;
    }
    entries.push({ path: globalDoc.path, title: meta.title });
  }
  return entries;
}

export default function DocItemFooter(props: Props): React.ReactElement {
  const related = useRelatedEntries();
  return (
    <>
      {related.length > 0 && (
        <section className="kt-related">
          <h2 className="kt-related__title">Related topics</h2>
          <ul className="kt-related__list">
            {related.map((entry) => (
              <li key={entry.path} className="kt-related__item">
                <KtIcon name="file-text" className="kt-related__icon" size={14} />
                <Link className="kt-related__link" to={entry.path}>
                  {entry.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <OriginalFooter {...props} />
    </>
  );
}
