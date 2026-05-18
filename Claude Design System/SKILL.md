---
name: kotlin-docs-theme
description: Use this skill to apply the Kotlin Docs Theme System — a portable documentation design system inspired by kotlinlang.org's visual identity and Mintlify's documentation layout. Suitable for product documentation, API references, tutorials, changelogs, blog posts, and docs landing pages. Ships as design tokens + component CSS + engine recipes for MkDocs, Docusaurus, and Hugo.
user-invocable: true
---

Read the `README.md` file within this skill — it contains the brand context, content fundamentals, visual foundations, iconography rules, type scale, and the implementation recipes for each documentation engine. Then explore:

| File | Purpose |
|---|---|
| `README.md` | Full system docs (start here) |
| `colors_and_type.css` | Kotlin color palette, IBM Plex Sans + JetBrains Mono, 8-token type scale, light + dark themes |
| `tokens.css` | Spacing (4px grid), radius (compact: 4/6/8/12), shadows, motion, z-index, docs layout widths |
| `components.css` | Class-based components: buttons, badges, callouts, code blocks, tabs, breadcrumbs, sidebar, TOC, parameter table, docs shell |
| `assets/` | Kotlin K-mark and wordmark SVGs (light + dark) |
| `engine-mappings/mkdocs.md` | Step-by-step: apply the theme to MkDocs (Material) |
| `engine-mappings/docusaurus.md` | Step-by-step: apply the theme to Docusaurus 3 |
| `engine-mappings/hugo.md` | Step-by-step: apply the theme to Hugo |
| `preview/` | 24 specimen cards covering Brand, Colors, Type, Spacing, Components |
| `ui_kits/docs-theme/` | Reference React demo showing all components on home / article / API / changelog / blog |

## How to use this skill

**If creating visual artifacts** (slides, mocks, throwaway documentation prototypes, or static HTML):
- Copy `colors_and_type.css`, `tokens.css`, and `components.css` into your output folder.
- Copy assets (`kotlin-icon-color.svg`, `kotlin-logo.svg`, `kotlin-logo-dark.svg`) into a sibling `assets/` folder.
- Build your HTML using the class-based components in `components.css` (`.callout-tip`, `.codeblock`, `.docs-shell`, `.btn-primary`, etc.) — don't reinvent them.
- Match the content guidelines in `README.md` § 5: sentence-case headings, no hype words, no emoji in chrome.

**If implementing as a theme for a real documentation engine:**
- Pick the engine (MkDocs / Docusaurus / Hugo).
- Open the corresponding file in `engine-mappings/`.
- Copy the three CSS files into the project's static-asset folder.
- Add the engine-specific overrides file from the recipe.
- Map admonition syntax → `.callout-*` classes per the recipe.
- Map syntax-highlighter token classes → `.tok-*` per the recipe.
- Update the navbar logo to one of the `kotlin-wordmark*` SVGs.

**If working on production code:**
- Treat the CSS files as design tokens. Port the custom properties into your codebase's token format (CSS Modules, Tailwind config, design-tokens.json, etc.).
- The JSX in `ui_kits/docs-theme/` is a *visual reference*, not a production component library. Read it, then rewrite for your stack.

**If the user invokes this skill without other guidance:**
Ask them what they want to build or design. Useful starter questions:
- Which engine is the target — MkDocs, Docusaurus, Hugo, or something else?
- Is this for the product docs landing, a single article, an API reference, a changelog, or a blog post?
- Light theme only, or both light + dark?
- Any specific components needed beyond what the system ships?

Then act as an expert designer and produce HTML artifacts, engine theme files, or design-token JSON depending on the need.

## Quick visual primer

- **Primary color** is Kotlin **purple** `#7F52FF`. The K-mark and brand gradient use the **official radial** — red `#E44857` → magenta `#C711E1` → purple `#7F52FF`, top-right to bottom-left.
- **Two type families only:** IBM Plex Sans (`--font-sans`) for all UI and prose; JetBrains Mono (`--font-mono`) for code, CLI, file names, and technical metadata.
- **Compact radius:** buttons + inputs are 6px; cards + code blocks are 8px.
- **Twelve callout kinds:** note, info, tip, success, warning, caution, danger, important, quote, example, deprecated, experimental — each mapping to MkDocs / Docusaurus / Hugo admonition syntax (see README and the engine recipes).
- **Code blocks** are the centerpiece — file tabs, language tag, copy + wrap actions, line numbers, line highlighting, plus a dark terminal variant.
- **Layout:** Mintlify-style 3-column shell (260px sidebar · flexible content · 220px TOC). Slim 60px top header with version pill.
- **Voice:** confident, plain-spoken, technical. Sentence case. No emoji in chrome.

When unsure about how something looks, open the matching preview card or the reference theme demo in `ui_kits/docs-theme/`.
