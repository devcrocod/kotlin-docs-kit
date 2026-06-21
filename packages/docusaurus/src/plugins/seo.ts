import type { LoadContext, Plugin, HtmlTags } from '@docusaurus/types';

/**
 * Options for the kit's opt-in SEO plugin (`seo` preset option).
 * All fields are optional; sensible values are derived from `siteConfig`.
 */
export interface SeoPluginOptions {
  /** Social share image. Absolute URL, or a site-root path like `/img/og.png`. */
  image?: string;
  /** Twitter/X handle for `twitter:site`, e.g. `@kotlin`. */
  twitterSite?: string;
  /** Publisher name for the JSON-LD `publisher` field. */
  organization?: string;
  /**
   * URL template for the JSON-LD `SearchAction`. `{query}` is substituted by
   * search engines. Defaults to `<siteHref>search?q={query}` (the route the
   * local search theme adds). Pass `false` to omit the SearchAction entirely.
   */
  searchUrlTemplate?: string | false;
}

/** Join a site-root path against the site base; pass absolute or protocol-relative URLs through. */
function absolute(base: string, maybePath: string): string {
  if (/^(https?:)?\/\//.test(maybePath)) return maybePath;
  return `${base.replace(/\/+$/, '')}/${maybePath.replace(/^\/+/, '')}`;
}

/**
 * Injects site-level structured data and social-card meta defaults derived from
 * `siteConfig`. Kept as a standalone plugin (rather than folded into the theme
 * shim) so it is only added to the build when the `seo` option is enabled.
 *
 * Emits a `WebSite` JSON-LD node (with an optional `SearchAction`) plus
 * `og:image` / `twitter:*` meta tags. Per-page `WebPage` structured data stays
 * the consumer's call via `headTags` — it needs page metadata this site-level
 * plugin doesn't have.
 */
export default function ktdocsSeo(
  context: LoadContext,
  options: SeoPluginOptions = {},
): Plugin<void> {
  const { title, url, tagline } = context.siteConfig;
  const { image, twitterSite, organization, searchUrlTemplate } = options;

  // Site root including baseUrl (e.g. `https://host` + `/repo/`). `siteConfig.url`
  // is the bare origin, so canonical/image URLs and the JSON-LD `url`/`@id` must
  // join `baseUrl` to stay correct on sub-path deployments. `baseUrl` always
  // starts and ends with `/`, so `siteHref` ends with `/`.
  const siteHref = `${url.replace(/\/+$/, '')}${context.baseUrl}`;

  return {
    name: 'ktdocs-seo',
    injectHtmlTags(): { headTags: HtmlTags } {
      const webSite: Record<string, unknown> = {
        '@context': 'https://schema.org/',
        '@type': 'WebSite',
        '@id': siteHref,
        url: siteHref,
        name: title,
        description: tagline,
      };
      if (organization) {
        webSite.publisher = organization;
      }
      if (searchUrlTemplate !== false) {
        webSite.potentialAction = [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: searchUrlTemplate ?? `${siteHref}search?q={query}`,
            },
            'query-input': {
              '@type': 'PropertyValueSpecification',
              valueRequired: true,
              valueName: 'query',
            },
          },
        ];
      }

      const headTags: HtmlTags = [
        {
          tagName: 'script',
          attributes: { type: 'application/ld+json' },
          // Docusaurus only escapes tag *attributes*, not innerHTML, and
          // `JSON.stringify` does not escape `<`. Escape `<` so a `</script>`
          // sequence in any value (title, tagline, organization) cannot break
          // out of the JSON-LD <script> block.
          innerHTML: JSON.stringify(webSite).replace(/</g, '\\u003c'),
        },
      ];

      if (image) {
        const imageUrl = absolute(siteHref, image);
        headTags.push(
          { tagName: 'meta', attributes: { property: 'og:image', content: imageUrl } },
          { tagName: 'meta', attributes: { name: 'twitter:image', content: imageUrl } },
          { tagName: 'meta', attributes: { name: 'twitter:card', content: 'summary_large_image' } },
        );
      }
      if (twitterSite) {
        headTags.push({
          tagName: 'meta',
          attributes: { name: 'twitter:site', content: twitterSite },
        });
      }

      return { headTags };
    },
  };
}
