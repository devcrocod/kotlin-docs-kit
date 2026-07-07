import path from 'node:path';
import { createRequire } from 'node:module';
import type { LoadContext, Plugin } from '@docusaurus/types';

export default function ktdocsThemeShim(_context: LoadContext): Plugin<void> {
  return {
    name: 'ktdocs-theme',
    getThemePath() {
      return path.join(__dirname, 'theme');
    },
    getTypeScriptThemePath() {
      return path.resolve(__dirname, '..', 'src', 'theme');
    },
    configureWebpack() {
      // The kit's swizzles import @docusaurus/plugin-content-docs/client
      // (useDoc, useSidebarBreadcrumbs, useDocSidebarItemsExpandedState, …).
      // Those hooks read React contexts whose providers are rendered by
      // theme-classic components — so both sides MUST resolve to the same
      // module instance. In a pnpm workspace the preset's own node_modules
      // link can be a *different* store instance than theme-classic's
      // dependency (distinct peer-resolution hashes), which duplicates the
      // context objects and crashes SSG with "hook called outside provider".
      // Alias the specifier to the instance reachable from theme-classic —
      // the one that renders the providers. On flat (published) installs the
      // alias is a no-op pointing at the single hoisted copy.
      try {
        const themeClassicRequire = createRequire(
          require.resolve('@docusaurus/theme-classic/package.json'),
        );
        return {
          resolve: {
            alias: {
              '@docusaurus/plugin-content-docs/client': themeClassicRequire.resolve(
                '@docusaurus/plugin-content-docs/client',
              ),
            },
          },
        };
      } catch {
        return {};
      }
    },
  };
}
