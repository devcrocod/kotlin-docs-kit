import type { Options as ClassicOptions } from '@docusaurus/preset-classic';
import type { SeoPluginOptions } from './plugins/seo';

/**
 * Options accepted by `@ktdocs/docusaurus-preset`.
 *
 * Pass-through fields delegate to `@docusaurus/preset-classic` after the preset
 * has injected its own customCss, swizzle theme, and admonition keywords.
 */
export interface Options {
  /** Forwarded to `@docusaurus/plugin-content-docs`. Use `false` to disable. */
  docs?: ClassicOptions['docs'];
  /** Forwarded to `@docusaurus/plugin-content-blog`. Use `false` to disable. */
  blog?: ClassicOptions['blog'];
  /** Forwarded to `@docusaurus/plugin-content-pages`. Use `false` to disable. */
  pages?: ClassicOptions['pages'];
  /** Forwarded to `@docusaurus/plugin-sitemap`. Use `false` to disable. */
  sitemap?: ClassicOptions['sitemap'];
  /** Forwarded to `@docusaurus/plugin-svgr`. */
  svgr?: ClassicOptions['svgr'];
  /**
   * Extra CSS files appended after the kit's stylesheets. Use this to layer
   * project-specific overrides on top of the Kotlin theme.
   */
  theme?: {
    customCss?: string | string[];
  };
  googleAnalytics?: ClassicOptions['googleAnalytics'];
  gtag?: ClassicOptions['gtag'];
  googleTagManager?: ClassicOptions['googleTagManager'];
  /** Enable `@docusaurus/plugin-debug` in production. */
  debug?: ClassicOptions['debug'];

  /* ---- Opt-in features (default off). Each lazily loads its package only when
   * enabled; install the matching optional peer dependency to use it. -------- */

  /**
   * Offline local search via `@easyops-cn/docusaurus-search-local`. `true` uses
   * sensible defaults; an object is passed straight through as theme options.
   * Leave off (and set `themeConfig.algolia`) to use Algolia DocSearch instead —
   * both are re-skinned by the kit. Requires the optional peer dependency.
   */
  search?: boolean | Record<string, unknown>;
  /**
   * Enable themed Mermaid diagrams (`@docusaurus/theme-mermaid`). You must also
   * set `markdown: { mermaid: true }` in your config (a top-level field a preset
   * cannot set) and spread `ktMermaidThemeConfig` into `themeConfig.mermaid`.
   * Requires the optional peer dependency.
   */
  mermaid?: boolean;
  /**
   * Generate `llms.txt` / `llms-full.txt` via
   * `@signalwire/docusaurus-plugin-llms-txt`. `true` derives title/description
   * from `siteConfig`; an object is merged over those defaults. Requires the
   * optional peer dependency.
   */
  llmsTxt?: boolean | Record<string, unknown>;
  /**
   * Add a themed "Copy page / view as Markdown" button via
   * `docusaurus-plugin-copy-page-button` (auto-injected, no swizzle). `true`
   * uses kit-themed defaults; an object is merged over them. Requires the
   * optional peer dependency.
   */
  copyPage?: boolean | Record<string, unknown>;
  /**
   * Inject site-level structured data (`WebSite` JSON-LD + `SearchAction`) and
   * social-card meta defaults derived from `siteConfig`. `true` emits the
   * JSON-LD only; an object adds an image, Twitter handle, etc. No extra
   * dependency.
   */
  seo?: boolean | SeoPluginOptions;
}
