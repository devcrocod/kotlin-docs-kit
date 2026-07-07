import path from 'node:path';
import presetClassic, { type Options as ClassicOptions } from '@docusaurus/preset-classic';
import type { LoadContext, Preset } from '@docusaurus/types';
import type { Options } from './types';

export type { Options } from './types';
export { ktMermaidThemeConfig } from './mermaid';

const KIT_ADMONITION_KEYWORDS = [
  'success',
  'caution',
  'important',
  'quote',
  'example',
  'deprecated',
  'experimental',
];

function resolveKitCss(opts: Options): string[] {
  const extra = opts.theme;
  const userCss = extra?.customCss
    ? Array.isArray(extra.customCss)
      ? extra.customCss
      : [extra.customCss]
    : [];
  return [
    // Design tokens are bundled into the preset at build time (see
    // scripts/copy-css.mjs); they live in lib/tokens next to this file.
    path.join(__dirname, 'tokens', 'fonts.css'),
    path.join(__dirname, 'tokens', 'colors_and_type.css'),
    path.join(__dirname, 'tokens', 'tokens.css'),
    path.join(__dirname, 'tokens', 'components.css'),
    path.join(__dirname, 'css', 'custom.css'),
    path.join(__dirname, 'css', 'docusaurus-overrides.css'),
    // Copy-page article placement (H1-row pinning) only makes sense when the
    // plugin is on — keep the sheet out of the chain otherwise.
    ...(opts.copyPage ? [path.join(__dirname, 'css', 'copy-page-article.css')] : []),
    path.join(__dirname, 'css', 'search.css'),
    ...userCss,
  ];
}

function mergeDocs(docs: Options['docs']): ClassicOptions['docs'] {
  if (docs === false) return false;
  const base = docs ?? {};
  const baseAdmonitions = (base as { admonitions?: Record<string, unknown> }).admonitions ?? {};
  const userKeywords = Array.isArray(baseAdmonitions.keywords)
    ? (baseAdmonitions.keywords as string[])
    : [];
  return {
    ...base,
    admonitions: {
      extendDefaults: true,
      ...baseAdmonitions,
      // Union kit + user keywords last so a consumer that passes its own
      // `keywords` *adds* to the kit list instead of silently replacing it
      // (which would drop the kit's admonition styling for :::deprecated etc.).
      keywords: Array.from(new Set([...KIT_ADMONITION_KEYWORDS, ...userKeywords])),
    },
  } as ClassicOptions['docs'];
}

export default function preset(context: LoadContext, opts: Options = {}): Preset {
  const classicOptions: ClassicOptions = {
    docs: mergeDocs(opts.docs),
    blog: opts.blog,
    pages: opts.pages,
    sitemap: opts.sitemap,
    svgr: opts.svgr,
    theme: { customCss: resolveKitCss(opts) },
    googleAnalytics: opts.googleAnalytics,
    gtag: opts.gtag,
    googleTagManager: opts.googleTagManager,
    debug: opts.debug,
  };

  const classic = presetClassic(context, classicOptions);

  // Opt-in features. Each external package is resolved lazily *inside* its
  // guard, so a consumer who leaves a feature off never needs its (optional
  // peer) dependency installed. theme-shim must stay last in `themes`.
  const extraPlugins: NonNullable<Preset['plugins']> = [];
  const extraThemes: NonNullable<Preset['themes']> = [];

  if (opts.seo) {
    // Local plugin (compiled to lib/plugins/seo.js); no external dependency.
    // Cast to the loose plugin-options shape: SeoPluginOptions is a named
    // interface without an index signature, which PluginConfig requires.
    extraPlugins.push([
      path.join(__dirname, 'plugins', 'seo'),
      (typeof opts.seo === 'object' ? opts.seo : {}) as { [key: string]: unknown },
    ]);
  }

  if (opts.llmsTxt) {
    extraPlugins.push([
      require.resolve('@signalwire/docusaurus-plugin-llms-txt'),
      {
        siteTitle: context.siteConfig.title,
        siteDescription: context.siteConfig.tagline,
        ...(typeof opts.llmsTxt === 'object' ? opts.llmsTxt : {}),
      },
    ]);
  }

  if (opts.copyPage) {
    extraPlugins.push([
      require.resolve('docusaurus-plugin-copy-page-button'),
      {
        // Emit plain-markdown routes (pairs well with llmsTxt) and tag the
        // auto-injected button with kit classes re-skinned in
        // docusaurus-overrides.css (.kt-copy-page*).
        generateMarkdownRoutes: true,
        // Inject inline after the breadcrumbs / above the H1 instead of the
        // default "auto" placement, which mounts into the desktop TOC column
        // whenever a sidebar is visible.
        placement: 'article',
        customStyles: {
          container: { className: 'kt-copy-page' },
          button: { className: 'kt-copy-page__btn' },
          dropdown: { className: 'kt-copy-page__menu' },
          dropdownItem: { className: 'kt-copy-page__item' },
        },
        ...(typeof opts.copyPage === 'object' ? opts.copyPage : {}),
      },
    ]);
  }

  if (opts.search) {
    // A theme (not a plugin); re-skinned by css/search.css. Sites whose docs
    // are not at `/docs` should pass `{ docsRouteBasePath: '/' }` etc.
    extraThemes.push([
      require.resolve('@easyops-cn/docusaurus-search-local'),
      typeof opts.search === 'object' ? opts.search : { hashed: true },
    ]);
  }

  if (opts.mermaid) {
    extraThemes.push(require.resolve('@docusaurus/theme-mermaid'));
  }

  return {
    plugins: [...(classic.plugins ?? []), ...extraPlugins],
    themes: [...(classic.themes ?? []), ...extraThemes, path.join(__dirname, 'theme-shim')],
  };
}
