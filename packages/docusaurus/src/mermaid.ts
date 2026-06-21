/**
 * Token-aware Mermaid config for the kit. Spread into `themeConfig.mermaid`:
 *
 * ```ts
 * import { ktMermaidThemeConfig } from '@ktdocs/docusaurus-preset';
 * // ...
 * themeConfig: { mermaid: ktMermaidThemeConfig },
 * ```
 *
 * Uses Mermaid's built-in `neutral` (light) / `dark` themes for legible
 * defaults and switches the diagram font to the kit's sans stack. `fontFamily`
 * is applied to the rendered SVG in the browser, so a CSS variable resolves
 * correctly; finer color control is possible via `options.themeVariables` with
 * concrete hex values (see the Diagrams guide).
 */
export const ktMermaidThemeConfig = {
  theme: { light: 'neutral', dark: 'dark' },
  options: {
    fontFamily: 'var(--font-sans)',
  },
} as const;
