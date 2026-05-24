# Kotlin Docs Theme System

> **Frozen snapshot (since 2026-05-24).** Source of truth has moved to `packages/tokens/src/` (DTCG tokens, BEM `kt-*` components) and `docs/contracts/` (preview, engine-mappings, reference-prototype). This directory remains as a maintainer reference for the original Claude DS input — do not edit; reverse-engineer changes through `packages/tokens/src/`.

> A portable, **engine-agnostic** documentation theme. Visual language inspired by Kotlin (official palette + standard brand assets). Layout, navigation, cards, callouts, and code blocks inspired by Mintlify. Designed to be implemented as themes for **MkDocs**, **Docusaurus**, and **Hugo**.

---

## 1. What this is

A set of **design tokens, components, and engine-mapping recipes** — *not* a single bespoke documentation website. The goal is a consistent visual identity that can be applied across the three major documentation engines, so a single team can ship product docs, API references, guides, changelogs, blogs, and a docs landing page that all look unmistakably Kotlin.

What you get:

| Layer | Files | Notes |
|---|---|---|
| **Design tokens** | `colors_and_type.css`, `tokens.css` | Color, type, spacing, radius, shadow, motion, layout. Light + dark. |
| **Component CSS** | `components.css` | Class-based components — buttons, callouts, code blocks, nav, cards, tables. |
| **Brand assets** | `assets/kotlin-icon-color.svg`, `assets/kotlin-logo.svg` (+ dark) | Inspired by the official Kotlin K-mark gradient. |
| **Engine recipes** | `engine-mappings/mkdocs.md`, `docusaurus.md`, `hugo.md` | Step-by-step: where to drop the CSS, how to translate per-engine custom properties, how to map admonition syntax. |
| **Preview cards** | `preview/*.html` | Specimen cards that render in the asset review pane. |
| **Reference theme demo** | `ui_kits/docs-theme/` | A click-thru React prototype that shows the theme on five canonical surfaces. |

---

## 2. Index

### Root files

| File | Purpose |
|---|---|
| `README.md` | This file — read first |
| `SKILL.md` | Agent-skill manifest (for use as a Claude Code skill) |
| `colors_and_type.css` | Color + type tokens, light + dark themes, element defaults |
| `tokens.css` | Spacing, radius, shadow, motion, z-index, layout widths |
| `components.css` | All component classes — buttons, callouts, code blocks, nav, etc. |

### Folders

| Folder | Contents |
|---|---|
| `assets/` | `kotlin-icon-color.svg`, `kotlin-logo.svg`, `kotlin-logo-dark.svg` |
| `engine-mappings/` | `mkdocs.md` · `docusaurus.md` · `hugo.md` — implementation guides |
| `preview/` | 24 specimen cards (Brand · Colors · Type · Spacing · Components) |
| `ui_kits/docs-theme/` | Reference theme demo — home, article, API, changelog, blog |

---

## 3. Design direction

### Visual: Kotlin

- **Palette:** the canonical **Kotlin purple** (`#7F52FF`), **magenta** (`#C711E1`), and **red** (`#E44857`) from the official K-mark gradient. Plus secondary **blue** (`#4485FE`) and **orange** (`#FF7B25`) for code syntax, and a calm cool-gray neutral ramp.
- **Brand gradient:** the **official radial** from kotlinlang.org — `radial-gradient(circle at top right, #E44857, #C711E1, #7F52FF)`. A linear-225° variant ships as `--kt-gradient-linear` for rectangular surfaces where a circular wash looks awkward. Use sparingly: on the K-mark, the occasional hero accent, gradient-text on display headlines. Never as a button fill or full-page wash.
- **Logo:** the official Kotlin K-mark — three solid variants (color / black / white) plus the full Kotlin wordmark in light and dark. Sourced from kotlinlang.org brand assets and stored as-is in `assets/`.
- **Mood:** crisp, technical, JetBrains-quality. White (or near-black) backgrounds, generous whitespace, hairline borders.

### Layout: Mintlify

- **Three-column shell:** 260px sidebar · flexible content · 220px on-this-page TOC.
- **Slim top header** with the wordmark + version pill + horizontal nav + a search box that opens a command palette on `⌘K`.
- **Cards** are flat with subtle borders, lifting on hover via a soft shadow + 1px translate. Never colored fills.
- **Admonitions** have a leading icon, a colored left border (3px), a soft tinted background, and a title in the matching tint.
- **Code blocks** are the centerpiece — file tabs, language tag, copy & wrap actions, line numbers, line highlighting, and a terminal variant.

### Typography

Two families only:

| Token | Family | Use |
|---|---|---|
| `--font-sans` | **IBM Plex Sans** (400/500/600/700) | All UI + prose: nav, headings, body, badges, tabs. |
| `--font-mono` | **JetBrains Mono** (400/500/700) | Code, inline code, CLI commands, file names, version pills, technical metadata. |

The type scale is **eight tokens**, intentionally small so engine themes can map cleanly:

| Token | Size · line | Weight | Use |
|---|---|---|---|
| `--type-display-*` | 44 / 1.1   | 700 | Hero / docs-landing title |
| `--type-h1-*`      | 32 / 1.18  | 700 | Page title |
| `--type-h2-*`      | 24 / 1.25  | 600 | Section heading |
| `--type-h3-*`      | 18 / 1.35  | 600 | Sub-section / parameter group |
| `--type-body-*`    | 15 / 1.65  | 400 | Body, paragraphs, table cells |
| `--type-small-*`   | 13 / 1.55  | 400 | Captions, meta lines |
| `--type-caption-*` | 12 / 1.45  | 500 | Eyebrows, table headers, uppercase labels |
| `--type-code-*`    | 13.5 / 1.65 | 400 | All code in `<pre>` and inline `<code>` |

### Radius

Compact and documentation-friendly. Buttons and inputs are 6px. Cards and code blocks are 8px. No heavy 16px+ rounding except on modals.

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 4px | tags, pills, inline code |
| `--radius-md` | 6px | buttons, inputs, callouts |
| `--radius-lg` | 8px | cards, code blocks |
| `--radius-xl` | 12px | modals, hero containers |
| `--radius-full` | ∞ | badges, avatars |

---

## 4. Components

A subset — see `components.css` for the full set and `preview/` for visual specimens.

### Buttons

- `.btn-primary` — Kotlin purple fill, white text
- `.btn-secondary` — neutral background, body color text
- `.btn-ghost` — transparent, hover-fill
- `.btn-link` — looks like a link, behaves like a button
- `.btn-brand` — the brand gradient. Use **once per page** at most (hero CTA / "Try it" surfaces)
- Sizes: `.btn-sm`, default, `.btn-lg`

### Callouts / admonitions

**12 kinds.** Each maps directly to MkDocs, Docusaurus, and Hugo admonition syntax — see the engine recipes for the exact remap. Every callout has the same shape: leading 20px icon, bold title, body. Subtle tinted background, 3px colored left border. Accessible contrast verified in light and dark themes.

| Class | Color | Icon | Use case |
|---|---|---|---|
| `.callout-note`         | gray-700        | list           | Plain clarification, no urgency |
| `.callout-info`         | Kotlin blue     | info-circle    | Background information |
| `.callout-tip`          | Kotlin purple   | lightbulb      | Shortcut or pro move |
| `.callout-success`      | green           | check          | Operation completed cleanly |
| `.callout-warning`      | amber           | triangle       | Behavior that may bite later |
| `.callout-caution`      | Kotlin orange   | circle-info    | Stronger than warning, weaker than danger |
| `.callout-danger`       | red             | x-circle       | Will break things if ignored |
| `.callout-important`    | Kotlin magenta  | shield         | Strong emphasis — read before continuing |
| `.callout-quote`        | gray-500        | quote-marks    | Pull quote or excerpt (italic body) |
| `.callout-example`      | Kotlin blue     | code-brackets  | Worked-through sample code |
| `.callout-deprecated`   | amber-600       | ban-circle     | API removed in a future release |
| `.callout-experimental` | Kotlin pink     | flask          | Preview / unstable feature |

Pick the narrowest one that fits. If you find yourself defaulting to `.callout-note` for everything, the document probably needs more headings instead.

### Code blocks

The premium piece. All of these compose:

- **Bare** — language tag + copy action only
- **Multi-file tabs** — `.codeblock-tabs` with `.codeblock-tab` children, active tab gets a 2px purple underline
- **Line numbers** — render each line in a `.codeblock-line` with a `.lineno` gutter
- **Line highlighting** — add `.is-hl` to a line for a subtle purple-tinted background + 2px purple inset border
- **Terminal variant** — `.codeblock.is-terminal` gives a deep-purple-black surface with prompt styling
- **Syntax tokens** — `.tok-k`, `.tok-s`, `.tok-n`, `.tok-c`, `.tok-f`, `.tok-t`, `.tok-p`, `.tok-a` — hand-tag or re-map your highlighter's classes to these

All Kotlin-leaning: keywords in purple, types/numbers in orange, functions in blue, strings in green, comments italic gray.

### Navigation

- `.topnav` — sticky blurred header with brand, links, search, icon buttons
- `.sidenav` — sectioned sidebar with `.sec-label` / `.sec-sub` headers and `.sidenav-item` rows
- `.toc` + `.toc-item` — right rail with active border-left highlight
- `.crumbs` — breadcrumb chain
- `.tabs` / `.tab` — content tabs
- `.docs-pager` — previous/next pagination at article foot
- `.docs-shell` — the canonical 3-column grid, responsive (drops TOC at 1024, sidebar at 720)

### API reference primitives

- `.method method-{get|post|put|patch|delete}` — colored HTTP method labels
- `.params` table — `.param-name` + `.param-type` for typed parameter rows

---

## 5. CONTENT FUNDAMENTALS

> How the Kotlin docs theme writes.

- **Tone:** plain-spoken, technical, confident. Respect the reader.
- **Headings:** sentence case. *"Getting started with the SDK"* — not *"Getting Started With The SDK"*.
- **Person:** second-person for tutorials and CTAs ("you"). First-person plural ("we") only in announcements and changelogs.
- **No hype words.** Avoid *revolutionary, seamless, unlock, magical, blazing-fast*.
- **Show code early.** A docs landing should have a real code sample in the first viewport.
- **Code identifiers** are exact-case, in `<code>`. Don't translate `kebab-case` to "kebab case" in prose.
- **Product name** — always "Kotlin". Capitalized. Never KOTLIN.

### Emoji

Not part of brand chrome. Don't put emoji in headings, buttons, nav, or callouts. Icons (Lucide-style) do that work. Emoji are fine in user-generated content and changelog markers (✨ for new, 🐛 for fix) if your engine already uses them.

### Microcopy

- **Empty states** tell the reader what to do next. *"No projects yet — create one to start tracking builds."*
- **Errors** say what went wrong and what to try. *"Couldn't reach the registry. Check your network and retry."*
- **Loading states** stay quiet. No "loading the magic…".
- **Confirmation toasts** are five words or fewer. *"Settings saved."*

---

## 6. VISUAL FOUNDATIONS

### Color philosophy

A small palette, used confidently.

- **Kotlin purple** is the workhorse — primary buttons, links, active states, code keywords.
- **Pink + orange** appear in the brand gradient and as code accents. Never as a UI surface fill.
- **Blue** is the secondary brand accent and the code-function color.
- **Neutrals** are slightly cool — pairs with the warm gradient without clashing.

### Backgrounds

- **No stock photography. No hand-drawn illustrations. No mascots.**
- **No full-bleed gradients** outside the K-mark itself. Brand gradient is a surgical tool.
- **Code is the imagery.** A well-styled tabbed code block in the hero is the brand.
- Light theme uses pure white surfaces with a faint `var(--surface-0)` page tint. Dark theme uses gray-950 with a slightly purple-tinted code background.

### Borders

- A single 1px hairline, `var(--border-1)`. They should disappear into the page until you focus on them.
- Dashed borders only on drop zones. Dotted borders only on focus-visible rings.

### Shadow & elevation

Four steps: `--shadow-xs/sm/md/lg`. Light-handed — docs aren't a dashboard. Cards get `--shadow-md` on hover and that's the strongest you should reach for.

### Motion

- `--motion-fast` 120ms (hover/press), `--motion-base` 200ms (panel open, tab switch), `--motion-slow` 320ms (route change).
- Easing: `cubic-bezier(0.2, 0, 0, 1)` — sharp, decelerated. **No bounces.**
- `prefers-reduced-motion` collapses everything to 0ms.

### Focus

Always visible. 2px outline in a brighter purple (`#9D7BFF`), 2px offset. Keyboard-only via `:focus-visible`.

### Hover & press

- Buttons: hover **darkens** the fill ~6%. Press shrinks 1% (`transform: scale(0.985)`). No shadow change.
- Cards: hover bumps shadow to `--shadow-md` + 1px lift, border tints to `--kt-purple-300`.
- Links: hover changes color from `--color-link` to `--color-link-hover` and brightens the underline.
- Icon-only buttons: hover fills the bg with `--surface-2`.

### Transparency & blur

- Sticky headers use `backdrop-filter: blur(14px)` over a semi-transparent surface.
- Popovers, dropdowns, and tooltips are opaque. Blur is a navigation cue, not decoration.

### Corner radii

See section 3. Buttons + inputs 6px; cards + code 8px; modals 12px; badges full-pill.

### Cards

A card is a **flat surface with a subtle border**, padding 20-24px, radius 8px. Hover bumps shadow only. Never use colored card fills except the muted Kotlin-purple-soft for *active* sidebar items.

### Imagery vibe

Cool, technical, monochrome where possible. When product screenshots appear, they're cropped tight with no decorative chrome.

### Layout

- Top header: 60px.
- Docs shell max width: 1440px.
- Reading column max: 720px, capped at 72ch.
- Sidebar: 260px. TOC: 220px.
- Collapses to 2-column at <1024px (drops TOC), to 1-column at <720px (drops sidebar).

---

## 7. ICONOGRAPHY

The system references **Lucide** (https://lucide.dev, ISC license) — same icon style as Mintlify, JetBrains' product UIs, and many modern documentation sites. Why:

- Consistent 2px stroke
- Comprehensive (1500+ icons)
- Open source, tree-shakeable

### Usage

Pull from CDN for static HTML:

```html
<script src="https://unpkg.com/lucide@latest"></script>
<i data-lucide="search"></i>
<script>lucide.createIcons();</script>
```

Or inline SVG directly (what the preview cards and UI kit do):

```html
<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
  <!-- icon path -->
</svg>
```

### Conventions

- Default size 16px in nav, 20px in callouts, 18-22px in card icons, 40px+ in empty states.
- 2px stroke. 1.5px only at 32px+.
- Inherits `currentColor` — never use multi-color icons.
- No mixed icon sets. Pick one (Lucide is the default) and stick with it.
- No emoji as icons in product chrome.

### Brand assets

The official Kotlin assets from kotlinlang.org — drop-in, no reinterpretation.

| File | Use |
|---|---|
| `assets/kotlin-icon-color.svg` | The official K-mark with the radial gradient. Favicon, app icon, social avatar. |
| `assets/kotlin-icon-black.svg` | Solid black K — for monochrome treatments and printing. |
| `assets/kotlin-icon-white.svg` | Solid white K — for use on dark or photographic backgrounds. |
| `assets/kotlin-logo.svg` | Full Kotlin wordmark — gradient K + black "Kotlin" text, tuned for light backgrounds. |
| `assets/kotlin-logo-dark.svg` | Same wordmark with white text, tuned for dark backgrounds. |

These are the unmodified files from the Kotlin brand kit. Do not redraw the K-mark in code; always reference the SVG.

---

## 8. Implementing as an engine theme

Pick the engine, follow the recipe:

- **MkDocs (Material)** → [`engine-mappings/mkdocs.md`](engine-mappings/mkdocs.md). Add three CSS files to `extra_css`, drop in an overrides file that re-maps Material's `--md-*` custom properties to ours, point `logo` and `favicon` at the Kotlin mark. Admonitions remap by class name.
- **Docusaurus 3** → [`engine-mappings/docusaurus.md`](engine-mappings/docusaurus.md). Add three CSS files to `presets.classic.theme.customCss`, override Infima's `--ifm-*` variables in a `custom.css`. Point `navbar.logo` at the wordmark. Admonitions remap by class. Prism token classes get re-mapped to our `.tok-*`.
- **Hugo** → [`engine-mappings/hugo.md`](engine-mappings/hugo.md). Bundle CSS through Hugo Pipes, override `baseof.html`, ship a `callout` shortcode that emits our markup, re-skin Chroma's stylesheet to use our code tokens.

All three guides emit the same DOM shape on the page (`.docs-shell` · `.codeblock` · `.callout-*` · `.sidenav-item`), so the visual result is identical regardless of which engine renders it.

---

## 9. The reference theme demo

`ui_kits/docs-theme/index.html` is a click-thru React prototype that demonstrates every component on five canonical surfaces:

1. **Home** — docs landing with hero, card grid, platform pillars
2. **Article** — tutorial page with all six callouts and three code-block variants
3. **API** — endpoint reference with sidebar method labels, parameter table, request/response panel
4. **Changelog** — version history with badges and admonitions
5. **Blog post** — long-form prose article

The theme toggle in the top nav flips `data-theme` on `<html>`, so dark mode is fully visible. The same DOM shape would be emitted by MkDocs, Docusaurus, or Hugo once the engine recipes are applied.

---

## 10. Substitutions flagged

- **Fonts** are pulled from Google Fonts via `@import` in `colors_and_type.css`. No `.ttf` files are vendored. For air-gapped or production builds, download both families locally and rewrite the `@import` to `@font-face` declarations.
- **Icons** — Lucide is referenced by convention but only as inline SVG paths. No icon font / sprite is bundled.
- **Brand assets** are the official Kotlin SVGs from kotlinlang.org, stored unmodified in `assets/`.
