# HTML/CSS components contract

This document defines the **public HTML and CSS contract** that every engine theme in `kotlin-docs-kit` MUST satisfy. The kit ships tokens and a single `dist/components.css` from [`@ktdocs/tokens`](../../packages/tokens/README.md); each engine package wraps its native markup in the BEM classes specified here so that both engines (Docusaurus, Hugo) render visually identical sites.

This is a specification, not a tutorial. It does not explain authoring syntax beyond the summary table at the end, and it does not describe how a particular engine remaps its native classes — see [engine-mappings/](./engine-mappings/) for those internal specs. The list below covers 22 atomic component sections, derived from the 16 component families in [SPEC §7.1](../../SPEC.md).

## How to read this document

Every component subsection follows the same shape:

- **DOM** — the exact HTML structure the engine MUST emit.
- **Classes** — the BEM blocks and elements, each with a one-line purpose.
- **Modifiers** — variant suffixes (omitted if the component has none).
- **ARIA** — role/state attributes mandated by this contract (omitted if none).
- **Notes** — breakpoints, token dependencies, usage rules, specimen links.

Markdown authoring syntax differs across engines (Material admonition, MDX, Hugo shortcode) — the [Authoring syntax across engines](#authoring-syntax-across-engines) table summarises the recommended forms. The DOM contract here is what those syntaxes MUST produce.

## BEM conventions

All classes use BEM with the `kt-` prefix:

- **Block:** `.kt-callout`, `.kt-codeblock`, `.kt-card`, `.kt-topnav`.
- **Element:** `.kt-callout__icon`, `.kt-codeblock__tab`, `.kt-card__title`.
- **Modifier:** `.kt-callout--note`, `.kt-codeblock__tab--active`, `.kt-button--primary`.

State suffixes follow a fixed convention: `--active` (selected nav item, tab, link), `--hl` (highlighted code line), `--hoverable` (opt-in card hover), `--terminal` (code block terminal variant), `--nested` (indented TOC entry), `--prev`/`--next` (pager direction).

Element selectors inside a block (`.kt-callout p`, `.kt-docs-article > h2`) operate on plain markup the engine does not classify and use the renamed parent. See [claude-ds-rename.md](./claude-ds-rename.md) for the full mapping from the original flat Claude DS names to the BEM names used here.

## What is NOT customizable

The kit exposes design tokens, theme overrides, and engine-native plugin/preset configuration as customization surfaces — see [SPEC §10.1](../../SPEC.md). The following are fixed by this contract and **changing them means forking the kit**:

- **HTML structure of content components.** The DOM of every component listed below is part of the contract. Reshuffling elements, adding wrappers, or replacing tag names breaks visual parity across engines.
- **CSS class names and their semantics.** The classes below are the public API. Renaming a class, redefining what a modifier means, or repurposing an element selector are breaking changes.
- **System fonts loading mechanism.** Font families are exposed via `--font-sans` and `--font-mono` tokens and can be re-pointed; the `@font-face` loader for the bundled IBM Plex Sans and JetBrains Mono is fixed.

---

## Button

Action surface with five style variants and three sizes. Use `--brand` at most once per page (it carries the brand gradient and a glow on hover).

### DOM

```html
<a class="kt-button kt-button--primary">Primary</a>
<a class="kt-button kt-button--secondary">Secondary</a>
<a class="kt-button kt-button--ghost">Ghost</a>
<a class="kt-button kt-button--link">Link</a>
<a class="kt-button kt-button--brand">Brand gradient (use once per page)</a>
<a class="kt-button kt-button--primary kt-button--sm">Small</a>
<a class="kt-button kt-button--primary kt-button--lg">Large</a>
```

The element may be `<a>` or `<button>` depending on whether the action is a navigation or an in-page command.

### Classes

| Class        | Kind  | Purpose                                                             |
| ------------ | ----- | ------------------------------------------------------------------- |
| `.kt-button` | block | Base button surface, padding, transitions, focus and active states. |

### Modifiers

| Modifier                | Meaning                                                    |
| ----------------------- | ---------------------------------------------------------- |
| `.kt-button--primary`   | Solid brand background, white text. Default CTA.           |
| `.kt-button--secondary` | Surface background, neutral border. Secondary action.      |
| `.kt-button--ghost`     | Transparent background, surface on hover. Tertiary action. |
| `.kt-button--link`      | Underlined link style with no padding box.                 |
| `.kt-button--brand`     | Full brand gradient with hover glow. Use once per page.    |
| `.kt-button--sm`        | Compact size (13 px text).                                 |
| `.kt-button--lg`        | Prominent size (15 px text, larger radius).                |

### Notes

- Disabled state is styled via `:disabled` and `[aria-disabled="true"]`; both yield 0.5 opacity and `not-allowed` cursor. Setting `aria-disabled="true"` is the canonical way to disable non-`<button>` elements.
- Specimen: [`preview/components-buttons.html`](./preview/components-buttons.html).

---

## Pill

Compact full-radius action chip. Quiet by default; `--primary` carries the brand. In dark mode the default fill is a translucent white overlay rather than a solid surface.

### DOM

```html
<button class="kt-pill">All</button>
<button class="kt-pill kt-pill--primary">Follow</button>
<a class="kt-pill" href="/tags/stable">stable</a>
```

The element may be `<button>` or `<a>`.

### Classes

| Class      | Kind  | Purpose                                                    |
| ---------- | ----- | ---------------------------------------------------------- |
| `.kt-pill` | block | Full-radius compact button. Surface fill, hairline border. |

### Modifiers

| Modifier            | Meaning                                         |
| ------------------- | ----------------------------------------------- |
| `.kt-pill--primary` | Solid brand background, white text. Emphasised. |

### Notes

- Focus shows the two-layer `--focus-ring` (teal in dark, purple in light).
- Specimen: [`preview/components-pill.html`](./preview/components-pill.html).

---

## Toggle

Binary on/off button. The pressed state uses the interaction accent (`--color-interactive*`) — teal in dark, purple in light.

### DOM

```html
<button class="kt-toggle" aria-pressed="false">Wrap lines</button>
<button class="kt-toggle" aria-pressed="true">Wrap lines</button>
```

### Classes

| Class        | Kind  | Purpose                                               |
| ------------ | ----- | ----------------------------------------------------- |
| `.kt-toggle` | block | Toggle button. Quiet when off; accent-tinted when on. |

### Modifiers

| Modifier         | Meaning                                                         |
| ---------------- | --------------------------------------------------------------- |
| `.kt-toggle--on` | Forces the on state for engines that cannot set `aria-pressed`. |

### ARIA

- Drive the state with `aria-pressed="true|false"` (canonical). `.kt-toggle--on` is the class-only fallback.

### Notes

- Specimen: [`preview/components-toggle.html`](./preview/components-toggle.html).

---

## Segmented control

A compact track of mutually-exclusive segments. The selected segment is accent-tinted (teal in dark, purple in light). Distinct from content tabs (`.kt-tabs`): a small inline switch, not a page-section selector.

### DOM

```html
<div class="kt-segmented" role="tablist" aria-label="View">
  <button class="kt-segmented__segment kt-segmented__segment--active" role="tab" aria-selected="true" type="button">
    Preview
  </button>
  <button class="kt-segmented__segment" role="tab" aria-selected="false" type="button">Code</button>
</div>
```

### Classes

| Class                    | Kind    | Purpose                                          |
| ------------------------ | ------- | ------------------------------------------------ |
| `.kt-segmented`          | block   | The track. Inline-flex, padded, hairline border. |
| `.kt-segmented__segment` | element | A single segment button.                         |

### Modifiers

| Modifier                         | Meaning                                        |
| -------------------------------- | ---------------------------------------------- |
| `.kt-segmented__segment--active` | Selected segment. Accent-tinted fill and text. |

### ARIA

- The track carries `role="tablist"`; each segment carries `role="tab"` with `aria-selected`.

### Notes

- Specimen: [`preview/components-segmented.html`](./preview/components-segmented.html).

---

## Input and search

Text inputs, textareas, selects, and the signature documentation search field with leading icon and trailing `⌘K` hint.

### DOM

```html
<input class="kt-input" type="text" placeholder="Search…" />
<textarea class="kt-textarea" rows="3"></textarea>
<select class="kt-select">
  <!-- options -->
</select>

<div class="kt-input-group">
  <svg class="kt-input-group__lead-icon"><!-- icon --></svg>
  <input class="kt-input" type="text" />
</div>

<div class="kt-docs-search">
  <svg class="kt-docs-search__icon"><!-- magnifier --></svg>
  <span class="kt-docs-search__text">Search…</span>
  <span class="kt-docs-search__kbd">⌘K</span>
</div>
```

### Classes

| Class                        | Kind    | Purpose                                                                          |
| ---------------------------- | ------- | -------------------------------------------------------------------------------- |
| `.kt-input`                  | block   | Text input. Width 100%, surface background, neutral border, focus ring.          |
| `.kt-textarea`               | block   | Multi-line input. Same surface and focus styling as `.kt-input`.                 |
| `.kt-select`                 | block   | Native `<select>` styled to match `.kt-input`.                                   |
| `.kt-input-group`            | block   | Wrapper that positions a leading icon over an inset `.kt-input`.                 |
| `.kt-input-group__lead-icon` | element | The leading icon (16 × 16), absolutely positioned at the left padding.           |
| `.kt-docs-search`            | block   | Topnav search trigger. Flex row containing the icon, placeholder, and `⌘K` hint. |
| `.kt-docs-search__icon`      | element | Leading magnifier icon (14 × 14).                                                |
| `.kt-docs-search__text`      | element | Placeholder text node; flex-grows to push the kbd hint to the right.             |
| `.kt-docs-search__kbd`       | element | Trailing keyboard shortcut chip rendered in monospace.                           |

### Notes

- The focus ring on `.kt-input`, `.kt-textarea`, and `.kt-select` is a 3 px outer glow built with `color-mix(in srgb, var(--color-primary) 22%, transparent)`.
- `.kt-docs-search` is a presentational trigger — engines wire the click handler to their native results surface (`@easyops-cn/docusaurus-search-local` dropdown on Docusaurus, the Pagefind `.kt-search-modal` on Hugo).
- Below 997 px the trigger collapses to a 32 × 32 icon button (same classes; media query only) — the placeholder text and kbd chip are hidden.
- Specimen: [`preview/components-topnav.html`](./preview/components-topnav.html), [`preview/components-search.html`](./preview/components-search.html).

---

## Badge

Compact pill-shaped label for statuses and metadata.

### DOM

```html
<span class="kt-badge kt-badge--purple">v2.0</span>
<span class="kt-badge kt-badge--pink">experimental</span>
<span class="kt-badge kt-badge--success">since 2.0</span>
<span class="kt-badge kt-badge--warning">preview</span>
<span class="kt-badge kt-badge--danger">deprecated</span>
<span class="kt-badge kt-badge--info">info</span>
<span class="kt-badge"><span class="kt-badge__dot"></span>online</span>
```

### Classes

| Class            | Kind    | Purpose                                                     |
| ---------------- | ------- | ----------------------------------------------------------- |
| `.kt-badge`      | block   | Pill container. Inline-flex, full radius, 12 px sans label. |
| `.kt-badge__dot` | element | 5 × 5 status dot using `currentColor`. Optional.            |

### Modifiers

| Modifier             | Meaning                                                     |
| -------------------- | ----------------------------------------------------------- |
| `.kt-badge--purple`  | Brand-soft background, `kt-purple-700` text.                |
| `.kt-badge--pink`    | Accent-soft background, `kt-pink-700` text.                 |
| `.kt-badge--success` | Green-soft background, `green-600` text.                    |
| `.kt-badge--warning` | Amber-soft background, `amber-600` text.                    |
| `.kt-badge--danger`  | Red-soft background, `red-600` text.                        |
| `.kt-badge--info`    | Blue-soft background, `kt-blue-600` text.                   |
| `.kt-badge--accent`  | Accent (magenta) soft background.                           |
| `.kt-badge--blue`    | Blue-soft background.                                       |
| `.kt-badge--green`   | Green-soft background.                                      |
| `.kt-badge--red`     | Red-soft background.                                        |
| `.kt-badge--yellow`  | Amber-soft background.                                      |
| `.kt-badge--violet`  | Violet (purple) soft background.                            |
| `.kt-badge--teal`    | Teal-soft background — matches the dark interaction accent. |
| `.kt-badge--orange`  | Orange-soft background.                                     |

### Notes

- The full colour set is `purple`/`violet`, `pink`, `accent`, `blue`/`info`, `green`/`success`, `red`/`danger`, `yellow`/`warning`, `teal`, `orange`. In dark mode the text lifts to the lighter ramp step for contrast on the translucent fills.
- Specimen: [`preview/components-badges.html`](./preview/components-badges.html).

---

## Tag

Square-radius monospace label for short metadata snippets (e.g. release channel, environment, build target).

### DOM

```html
<span class="kt-tag">prerelease</span>
```

### Classes

| Class     | Kind  | Purpose                                                               |
| --------- | ----- | --------------------------------------------------------------------- |
| `.kt-tag` | block | Square-radius monospace chip, 11 px font, neutral surface and border. |

### Modifiers

Optional colour variants tint the chip; the neutral form (no modifier) is the default. Same colour family as Badge: `--accent`, `--blue`, `--green`, `--red`, `--yellow`, `--purple`, `--violet`, `--teal`, `--orange`. In dark mode the text lifts to the lighter ramp step.

```html
<span class="kt-tag kt-tag--teal">native</span>
```

---

## HTTP method

Coloured method tag for API reference docs.

### DOM

```html
<span class="kt-method kt-method--get">GET</span>
<span class="kt-method kt-method--post">POST</span>
<span class="kt-method kt-method--put">PUT</span>
<span class="kt-method kt-method--patch">PATCH</span>
<span class="kt-method kt-method--delete">DELETE</span>
```

### Classes

| Class        | Kind  | Purpose                                                                       |
| ------------ | ----- | ----------------------------------------------------------------------------- |
| `.kt-method` | block | Method label. 11 px monospace, 700 weight, square radius, uppercase tracking. |

### Modifiers

| Modifier             | Meaning                                             |
| -------------------- | --------------------------------------------------- |
| `.kt-method--get`    | Green-soft background, `green-600` text.            |
| `.kt-method--post`   | Blue-soft background, `kt-blue-600` text.           |
| `.kt-method--put`    | Amber-soft background, `amber-600` text.            |
| `.kt-method--patch`  | Tip-soft (purple) background, `kt-purple-700` text. |
| `.kt-method--delete` | Red-soft background, `red-600` text.                |

---

## Callout

Inline boxed note with a leading icon, optional bold title, and body content. Twelve semantic kinds.

### DOM

```html
<aside class="kt-callout kt-callout--tip">
  <svg class="kt-callout__icon" viewBox="0 0 24 24"><!-- Lucide lightbulb --></svg>
  <div class="kt-callout__body">
    <strong class="kt-callout__title">Pro tip</strong>
    <div class="kt-callout__content">You can pass <code>--watch</code> to rebuild on save.</div>
  </div>
</aside>
```

### Classes

| Class                  | Kind    | Purpose                                                                     |
| ---------------------- | ------- | --------------------------------------------------------------------------- |
| `.kt-callout`          | block   | Box with grid layout, 3 px left border, tinted background, padding.         |
| `.kt-callout__icon`    | element | Leading 20 × 20 SVG icon. The kind-specific Lucide glyph belongs here.      |
| `.kt-callout__body`    | element | Vertical stack holding the title and content.                               |
| `.kt-callout__title`   | element | Bold label (14 px, 600 weight). Optional.                                   |
| `.kt-callout__content` | element | Body text. Inherits article typography. Optional when the title is omitted. |

### Modifiers

| Modifier                    | Meaning                                                   |
| --------------------------- | --------------------------------------------------------- |
| `.kt-callout--note`         | Neutral note — generic side remark.                       |
| `.kt-callout--info`         | Information — neutral fact the reader should be aware of. |
| `.kt-callout--tip`          | Tip — recommended practice or shortcut.                   |
| `.kt-callout--success`      | Success — confirmation that something worked.             |
| `.kt-callout--warning`      | Warning — non-blocking caution.                           |
| `.kt-callout--caution`      | Caution — orange escalation between warning and danger.   |
| `.kt-callout--danger`       | Danger — destructive or breaking operation.               |
| `.kt-callout--important`    | Important — must-read for correct behaviour.              |
| `.kt-callout--quote`        | Quote — italicised pull quote.                            |
| `.kt-callout--example`      | Example — illustrative example block.                     |
| `.kt-callout--deprecated`   | Deprecated — API or feature scheduled for removal.        |
| `.kt-callout--experimental` | Experimental — feature still in flux.                     |

### Notes

- Each kind has its own border-left, background, icon colour, and (in dark mode) title colour, driven by the `--color-{kind}` and `--color-{kind}-soft` tokens declared in `colors_and_type.css`.
- Recommended icons are the Lucide glyphs listed in [engine-mappings/](./engine-mappings/) per engine.
- Specimen: [`preview/components-callouts.html`](./preview/components-callouts.html).

---

## Code block

Premium code block with file tabs, copy / wrap actions, line numbers, line highlighting, and a terminal variant. Syntax tokens are exposed as `.kt-tok-*` classes so highlighters (Prism, Chroma, Pygments, highlight.js) can be remapped to a single visual vocabulary.

### DOM

```html
<div class="kt-codeblock">
  <div class="kt-codeblock__header">
    <div class="kt-codeblock__tabs">
      <button class="kt-codeblock__tab kt-codeblock__tab--active">
        <svg class="kt-codeblock__file-icon"><!-- file icon --></svg>build.gradle.kts
      </button>
      <button class="kt-codeblock__tab">settings.gradle.kts</button>
    </div>
    <div class="kt-codeblock__actions">
      <button class="kt-codeblock__action-btn" data-copy>copy</button>
      <button class="kt-codeblock__action-btn" data-wrap>wrap</button>
    </div>
  </div>
  <pre class="kt-codeblock__body"><code>
<span class="kt-codeblock__line"><span class="kt-codeblock__lineno">1</span><span class="kt-codeblock__code"><span class="kt-tok-k">fun</span> <span class="kt-tok-f">main</span>() = <span class="kt-tok-f">println</span>(<span class="kt-tok-s">"Hello"</span>)</span></span>
<span class="kt-codeblock__line kt-codeblock__line--hl"><span class="kt-codeblock__lineno">2</span><span class="kt-codeblock__code"><span class="kt-tok-c">// highlighted line</span></span></span>
  </code></pre>
</div>
```

When the block has no tabs, `.kt-codeblock__tabs` is replaced with `.kt-codeblock__lang` showing the language name:

```html
<div class="kt-codeblock__header">
  <span class="kt-codeblock__lang">kotlin</span>
  <div class="kt-codeblock__actions">…</div>
</div>
```

### Classes

| Class                         | Kind    | Purpose                                                                    |
| ----------------------------- | ------- | -------------------------------------------------------------------------- |
| `.kt-codeblock`               | block   | Outer container. Code background, border, large radius, overflow hidden.   |
| `.kt-codeblock__header`       | element | Header bar holding tabs (or language label) and actions.                   |
| `.kt-codeblock__tabs`         | element | Horizontal tab list for multi-file snippets. Scrollable, no scrollbar.     |
| `.kt-codeblock__tab`          | element | A single file tab button.                                                  |
| `.kt-codeblock__file-icon`    | element | Optional file-type SVG icon inside a tab (13 × 13).                        |
| `.kt-codeblock__lang`         | element | Language label when no tabs are present. 11 px monospace, lowercase.       |
| `.kt-codeblock__actions`      | element | Right-aligned action button group (copy, wrap, fullscreen, …).             |
| `.kt-codeblock__action-btn`   | element | A single action button. Transparent background, surface on hover.          |
| `.kt-codeblock__body`         | element | The `<pre>` wrapper. Owns scroll-x overflow, code typography.              |
| `.kt-codeblock__line`         | element | One logical line. Two-column grid: gutter + code.                          |
| `.kt-codeblock__lineno`       | element | Gutter number. Right-aligned, monospace, dimmed.                           |
| `.kt-codeblock__code`         | element | The code text within a line.                                               |
| `.kt-codeblock__term-prompt`  | element | Terminal prompt segment. Purple, non-selectable. Only inside `--terminal`. |
| `.kt-codeblock__term-comment` | element | Dimmed in-terminal comment. Only inside `--terminal`.                      |

### Modifiers

| Modifier                     | Meaning                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------ |
| `.kt-codeblock--terminal`    | Terminal variant. Hardcoded deep-purple-black surface (`#0E0B16`) regardless of theme.           |
| `.kt-codeblock__tab--active` | Currently selected file tab. Background matches code surface and gains a 2 px primary underline. |
| `.kt-codeblock__line--hl`    | Highlighted line. Background tint plus 2 px inset shadow in `--color-primary`.                   |

### Syntax tokens

Highlighter classes (`prism-token-keyword`, Chroma `.k`, `.s`, etc.) MUST be remapped to these eight classes in engine packages. The mapping table per engine lives in [engine-mappings/](./engine-mappings/).

| Class       | Token kind                                           |
| ----------- | ---------------------------------------------------- |
| `.kt-tok-k` | Keyword (`fun`, `val`, `class`). 500 weight.         |
| `.kt-tok-s` | String literal.                                      |
| `.kt-tok-n` | Number literal.                                      |
| `.kt-tok-c` | Comment. Italic.                                     |
| `.kt-tok-f` | Function or method name.                             |
| `.kt-tok-t` | Type name.                                           |
| `.kt-tok-p` | Punctuation.                                         |
| `.kt-tok-a` | Annotation / decorator (`@Deprecated`, `@Override`). |

### Notes

- The block also accepts inline syntax tokens authored by hand (`<span class="kt-tok-k">fun</span>`) — the same eight classes serve both highlighter output and hand-tagged snippets.
- Specimens: [`preview/code-tabs.html`](./preview/code-tabs.html), [`preview/code-terminal.html`](./preview/code-terminal.html), [`preview/code-linehighlight.html`](./preview/code-linehighlight.html).

---

## Card

Generously padded surface for feature grids, quickstart entries, tutorial selectors. Pair with `.kt-card-grid` for auto-fit layouts.

### DOM

```html
<div class="kt-card-grid">
  <a class="kt-card kt-card--hoverable" href="/quickstart">
    <div class="kt-card__icon">
      <svg><!-- icon --></svg>
    </div>
    <h3 class="kt-card__title">Quickstart</h3>
    <p class="kt-card__body">Get a Kotlin server running in 5 minutes.</p>
    <span class="kt-card__arrow">→</span>
  </a>
</div>
```

### Classes

| Class             | Kind    | Purpose                                                                 |
| ----------------- | ------- | ----------------------------------------------------------------------- |
| `.kt-card`        | block   | Card surface. Border, large radius, 20 px padding, vertical flex stack. |
| `.kt-card__icon`  | element | 32 × 32 leading icon with primary-soft background. Optional.            |
| `.kt-card__title` | element | Card heading. 16 px sans, 600 weight.                                   |
| `.kt-card__body`  | element | Body text. 14 px sans, secondary foreground.                            |
| `.kt-card__arrow` | element | Mono arrow indicator pinned to the card foot. Optional.                 |
| `.kt-card-grid`   | block   | Auto-fit grid wrapper. `repeat(auto-fit, minmax(220px, 1fr))`.          |

### Modifiers

| Modifier              | Meaning                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| `.kt-card--hoverable` | Opt-in hover lift: purple border, medium shadow, –1 px translate. Add only on actionable cards (links). |

### Notes

- Specimen: [`preview/components-cards.html`](./preview/components-cards.html).

---

## Hero

Docs landing surface. Combines a large heading with optional gradient text and an actions row.

### DOM

```html
<section class="kt-docs-hero">
  <h1>Kotlin <span class="kt-hero__grad-text">docs</span> in two engines</h1>
  <p>Apache 2.0 themed starter kit. Pick Docusaurus or Hugo.</p>
  <div class="kt-hero__actions">
    <a class="kt-button kt-button--primary kt-button--lg">Get started</a>
    <a class="kt-button kt-button--brand kt-button--lg">View demo</a>
  </div>
</section>
```

### Classes

| Class                 | Kind                      | Purpose                                                                               |
| --------------------- | ------------------------- | ------------------------------------------------------------------------------------- |
| `.kt-docs-hero`       | block                     | Hero section. Padding 56 / 32 / 48, bottom border, surface-1 background.              |
| `.kt-hero__grad-text` | element (`kt-hero` block) | Inline span whose text fill is the brand radial gradient via `background-clip: text`. |
| `.kt-hero__actions`   | element (`kt-hero` block) | Actions row holding hero buttons.                                                     |

### Notes

- The hero `<h1>` uses the `--type-display-*` token set (44 px / 1.1 line / 700 weight).
- `.kt-hero__grad-text` and `.kt-hero__actions` are elements of an implicit `kt-hero` block that lives inside `.kt-docs-hero`; this is a deliberate seam so the gradient text and actions can be reused outside the hero in the future.

---

## Content tabs

Tabbed content switcher for "Kotlin / Java / Groovy" style choices. Visually and semantically distinct from code-block tabs (`.kt-codeblock__tab`).

### DOM

```html
<div class="kt-tabs" role="tablist">
  <button class="kt-tabs__tab kt-tabs__tab--active" role="tab">Kotlin</button>
  <button class="kt-tabs__tab" role="tab">Java</button>
  <button class="kt-tabs__tab" role="tab">Groovy</button>
</div>
<div class="kt-tabs__panel kt-tabs__panel--active" role="tabpanel">…</div>
<div class="kt-tabs__panel" role="tabpanel">…</div>
```

### Classes

| Class             | Kind    | Purpose                                                                                          |
| ----------------- | ------- | ------------------------------------------------------------------------------------------------ |
| `.kt-tabs`        | block   | Tab list row. Flex, bottom border.                                                               |
| `.kt-tabs__tab`   | element | A tab trigger. Transparent button, 14 px sans, 500 weight.                                       |
| `.kt-tabs__panel` | element | A tab panel. Shown only when active. Visibility is engine-controlled (JS or CSS-only `:target`). |

### Modifiers

| Modifier                  | Meaning                                                       |
| ------------------------- | ------------------------------------------------------------- |
| `.kt-tabs__tab--active`   | Selected tab. Primary text colour and 2 px primary underline. |
| `.kt-tabs__panel--active` | Visible panel. Engines hide non-active panels.                |

### ARIA

- The tab list wrapper carries `role="tablist"`.
- Each `.kt-tabs__tab` carries `role="tab"`.
- Each `.kt-tabs__panel` carries `role="tabpanel"`.

---

## Article header

Article header anatomy (Mintlify pattern): a teal **eyebrow** — the immediate parent section label — above the H1 titlebar row that also seats the copy-page control. Replaces the 0.1.x breadcrumbs row: the `.kt-crumbs` DOM and CSS were removed in 0.2.0 (**breaking**); the mono aesthetic lives on in the eyebrow.

### DOM

```html
<header class="kt-article-header">
  <p class="kt-eyebrow">Guides</p>
  <div class="kt-article-header__titlebar">
    <h1>Install the CLI</h1>
    <div class="kt-copy-page"><!-- copy-page control --></div>
  </div>
</header>
```

### Classes

| Class                          | Kind    | Purpose                                                                                          |
| ------------------------------ | ------- | ------------------------------------------------------------------------------------------------ |
| `.kt-article-header`           | block   | Header stack above the article body. Vertical flex, 6 px gap.                                    |
| `.kt-eyebrow`                  | block   | Parent section label. `--font-label` 11 px, 600 weight, uppercase, teal (`--color-interactive`). |
| `.kt-article-header__titlebar` | element | Flex row seating the H1 (takes the remaining width) and the copy-page control.                   |

### Notes

- Eyebrow content fallback chain: immediate parent category/section label → owning tab label → hidden. Also hidden when it would equal the page title (tab-root index pages).
- Below 997 px the titlebar wraps: the copy-page control drops under the H1, right-aligned.
- `.kt-article-header__titlebar` replaces the 0.1.x Hugo-only `.kt-doc-titlebar` (class rename, migration notes).
- Specimens: [`preview/components-eyebrow.html`](./preview/components-eyebrow.html), [`preview/components-shell.html`](./preview/components-shell.html).

---

## Topnav

Sticky blurred header containing the burger (mobile drawer trigger), brand, version chip, navbar tabs (or the flat-links fallback), search trigger, and icon buttons (GitHub link, theme toggle).

### DOM

```html
<header class="kt-topnav">
  <button
    class="kt-topnav__icon-btn kt-topnav__burger"
    type="button"
    aria-label="Open navigation"
    aria-expanded="false"
  >
    <svg><!-- menu glyph --></svg>
  </button>
  <a class="kt-topnav__brand" href="/">
    <img src="/assets/kotlin-icon-color.svg" width="28" height="28" alt="" />
    <span class="kt-topnav__brand-name">Project</span>
    <span class="kt-topnav__version">v2.0</span>
  </a>
  <nav class="kt-topnav__tabs" aria-label="Sections">
    <a class="kt-topnav__tab kt-topnav__tab--active" href="/docs" aria-current="true">Docs</a>
    <a class="kt-topnav__tab" href="/reference">Reference</a>
    <a class="kt-topnav__tab" href="/changelog">Changelog</a>
  </nav>
  <div class="kt-topnav__right">
    <div class="kt-docs-search" role="button" tabindex="0" aria-label="Search">
      <svg class="kt-docs-search__icon"><!-- magnifier --></svg>
      <span class="kt-docs-search__text">Search…</span>
      <span class="kt-docs-search__kbd">⌘K</span>
    </div>
    <a class="kt-topnav__icon-btn" href="…" aria-label="GitHub repository"><!-- GitHub mark --></a>
    <button class="kt-topnav__icon-btn"><!-- theme toggle --></button>
  </div>
</header>
```

When no tabs are configured (or only one — the tab bar renders at ≥ 2 tabs), `.kt-topnav__tabs` is replaced by the 0.1.x flat links row:

```html
<nav class="kt-topnav__links">
  <a class="kt-topnav__link kt-topnav__link--active" href="/docs">Docs</a>
  <a class="kt-topnav__link" href="/api">API</a>
</nav>
```

### Classes

| Class                    | Kind    | Purpose                                                                                      |
| ------------------------ | ------- | -------------------------------------------------------------------------------------------- |
| `.kt-topnav`             | block   | Header bar. Sticky, blurred translucent surface, bottom border, `--docs-header-height` tall. |
| `.kt-topnav__brand`      | element | Brand cluster (logo + name + version).                                                       |
| `.kt-topnav__brand-name` | element | Product or project name. 17 px sans, 600 weight.                                             |
| `.kt-topnav__version`    | element | Version chip. 11 px `--font-label` inside a small surface-2 box.                             |
| `.kt-topnav__tabs`       | element | Navbar tab group — each tab owns a sidebar tree. Never wraps.                                |
| `.kt-topnav__tab`        | element | A single tab. 14.5 px sans, 500 weight; ellipsizes at 160 px max-width.                      |
| `.kt-topnav__links`      | element | Flat nav link row — the fallback when no tabs are configured.                                |
| `.kt-topnav__link`       | element | A single flat nav link.                                                                      |
| `.kt-topnav__right`      | element | Right-aligned cluster holding search and icon buttons.                                       |
| `.kt-topnav__icon-btn`   | element | 32 × 32 icon button (theme toggle, GitHub link, burger).                                     |
| `.kt-topnav__burger`     | element | Mobile drawer trigger. Hidden at ≥ 997 px; shown as an icon button below.                    |

### Modifiers

| Modifier                   | Meaning                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------- |
| `.kt-topnav__tab--active`  | Active tab. Neutral `surface-2` pill, `--fg-1` text — **no teal** (accent discipline). |
| `.kt-topnav__link--active` | Current section indicator in the flat-links fallback. Interaction-accent text.         |

### ARIA

- The tab group carries `aria-label="Sections"`; the active tab carries `aria-current="true"`.
- The burger carries `aria-label`, `aria-expanded`, and (when the drawer is in the DOM) `aria-controls`.
- The search trigger is a `role="button"` with `tabindex="0"` and `aria-label="Search"`.

### Notes

- Tab hover shows the same `surface-2` pill as the active state; the interaction accent (teal) stays reserved for the nav tree / TOC / links.
- The tab bar renders only with ≥ 2 tabs configured; with 0–1 tabs, engines fall back to the flat `.kt-topnav__links` row (upgrade path for 0.1.0 sites).
- The header background uses `color-mix(in srgb, var(--surface-1) 86%, transparent)` with `backdrop-filter: blur(14px)` for the signature translucent effect.
- Below 997 px the topnav collapses to burger + brand + search icon + theme toggle (tabs, links, and version chip are hidden; the search field becomes an icon button).
- Specimen: [`preview/components-topnav.html`](./preview/components-topnav.html).

---

## Sidenav

Left navigation tree (quiet Mintlify pattern). Top-level sections are group headers — icon + mono uppercase label, non-collapsible; nested groups collapse and indent on a hairline rail; the active item is teal text only, with no filled background.

### DOM

```html
<nav class="kt-sidenav" aria-label="Section navigation" data-nav-key="/docs/">
  <div class="kt-sidenav__section">
    <a class="kt-sidenav__sec-label" href="/docs/">
      <svg class="kt-sidenav__sec-icon"><!-- section icon --></svg>
      <span>Getting started</span>
    </a>
    <ul class="kt-sidenav__list">
      <li><a class="kt-sidenav__item kt-sidenav__item--active" href="/install">Installation</a></li>
      <li>
        <div class="kt-sidenav__group" data-key="/docs/guides/">
          <div class="kt-sidenav__group-row">
            <a class="kt-sidenav__item kt-sidenav__group-link" href="/docs/guides/">Guides</a>
            <button class="kt-sidenav__group-toggle" type="button" aria-expanded="false" aria-label="Toggle Guides">
              <svg><!-- chevron-right glyph --></svg>
            </button>
          </div>
          <ul class="kt-sidenav__list kt-sidenav__list--nested" hidden>
            <li><a class="kt-sidenav__item" href="/docs/guides/routing">Routing</a></li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</nav>
```

### Classes

| Class                       | Kind    | Purpose                                                                                                                                        |
| --------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `.kt-sidenav`               | block   | Sidebar wrapper. Vertical flex column, 20 / 16 padding. Carries `data-nav-key`.                                                                |
| `.kt-sidenav__section`      | element | A top-level section. Adjacent sections are spaced by 22 px.                                                                                    |
| `.kt-sidenav__sec-label`    | element | Section group header: icon + mono uppercase label (`--font-label` 11 px / 600, 0.07em tracking). A link to the section root, **not** a toggle. |
| `.kt-sidenav__sec-icon`     | element | 16 × 16 section icon (curated Lucide-derived set, stroke 1.5), `--fg-3`; lifts to `currentColor` on hover/active.                              |
| `.kt-sidenav__list`         | element | Item list (`<ul>`, list-style reset, 1 px gaps).                                                                                               |
| `.kt-sidenav__item`         | element | A nav link. 14 px sans / 500, `--fg-2`, hover `surface-2` + `--fg-1`.                                                                          |
| `.kt-sidenav__item-icon`    | element | Optional 14 × 14 leading icon inside an item, `currentColor`.                                                                                  |
| `.kt-sidenav__group`        | element | A nested collapsible group (level ≥ 2). Carries `data-key`.                                                                                    |
| `.kt-sidenav__group-row`    | element | Flex row seating the group link and its collapse toggle.                                                                                       |
| `.kt-sidenav__group-link`   | element | The group's own page link (an `.kt-sidenav__item` that flexes to fill the row).                                                                |
| `.kt-sidenav__group-toggle` | element | 24 × 24 chevron button. Chevron rotates 90° when expanded.                                                                                     |

### Modifiers

| Modifier                         | Meaning                                                                                            |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| `.kt-sidenav__sec-label--active` | Current page is the section root. Interaction-accent (teal) label text.                            |
| `.kt-sidenav__item--active`      | Current page link. **Teal text only** — the 0.1.x soft background and inset left bar were removed. |
| `.kt-sidenav__list--nested`      | Nested list: indented on a 1 px hairline rail (`--sidenav-rail-color`, defaults to `--border-2`).  |

### ARIA

- The wrapper carries `aria-label="Section navigation"`.
- Each `.kt-sidenav__group-toggle` carries `aria-expanded="true|false"` and an `aria-label` naming the group; the collapsed nested list carries the `hidden` attribute.

### Notes

- Active item inside a nested list additionally paints its 2 px segment of the rail teal (`::before` spanning the item's full box, wrapped labels included).
- Collapse is **multi-open**: opening a group never closes siblings. Engines pre-expand the active ancestor chain server-side (no FOUC, works without JS).
- Persistence contract: the open-group set is stored per tree in `sessionStorage["kt.sidenav.<navKey>"]`, where `navKey` = `data-nav-key` on `.kt-sidenav` (the active tab's root path, or `_root` without tabs) and each group is identified by its `data-key` (a stable path such as `RelPermalink` — safe under sub-path deployments).
- Section headers are group headers at every width (desktop and drawer) — collapse applies to nested groups only.
- `.kt-sidenav__sec-sub` (0.1.x uppercase sub-label) was removed in 0.2.0; the section label itself is now the mono uppercase row.
- Long item labels wrap (max 2 lines).
- Specimens: [`preview/components-nav.html`](./preview/components-nav.html), [`preview/components-shell.html`](./preview/components-shell.html).

---

## Mobile drawer

Full-height left navigation panel below 997 px, opened by the topnav burger. Contains the brand row with a close button, the tab group as a stacked block (Mintlify pattern), then the current tab's sidenav tree.

### DOM

```html
<div class="kt-drawer" id="kt-drawer" hidden>
  <div class="kt-drawer__overlay" data-drawer-close></div>
  <div class="kt-drawer__panel" role="dialog" aria-modal="true" aria-label="Navigation">
    <div class="kt-drawer__head">
      <a class="kt-topnav__brand" href="/">…</a>
      <button class="kt-topnav__icon-btn" data-drawer-close aria-label="Close navigation">…</button>
    </div>
    <nav class="kt-drawer__tabs" aria-label="Sections">
      <a class="kt-drawer__tab kt-drawer__tab--active" href="/docs/" aria-current="true">Docs</a>
      <a class="kt-drawer__tab" href="/changelog/">Changelog</a>
    </nav>
    <nav class="kt-sidenav">…current tab's tree…</nav>
  </div>
</div>
```

### Classes

| Class                 | Type    | Purpose                                                                                               |
| --------------------- | ------- | ----------------------------------------------------------------------------------------------------- |
| `.kt-drawer`          | block   | Fixed full-viewport wrapper; `[hidden]` when closed; `display: none` at ≥ 997 px regardless of state. |
| `.kt-drawer__overlay` | element | Dimmed, blurred backdrop; carries `data-drawer-close`.                                                |
| `.kt-drawer__panel`   | element | The sliding panel: `surface-1`, hairline right border, scrollable.                                    |
| `.kt-drawer__head`    | element | Brand + close button row (header-height, hairline bottom).                                            |
| `.kt-drawer__tabs`    | element | Stacked tab block; omitted when no tabs are configured (the flat links render here instead).          |
| `.kt-drawer__tab`     | element | Tab row; `--active` = `surface-2` + `--fg-1` (no teal, same as topnav tabs).                          |

### ARIA

- The panel is `role="dialog"` `aria-modal="true"` with an `aria-label`.
- The topnav burger toggles `aria-expanded` and points at the drawer via `aria-controls="kt-drawer"`.

### Notes

- Tapping a tab **navigates to the tab root** (full navigation) — no in-place tree swap; the destination page's drawer shows that tab's tree.
- Body scroll locks while open; `Esc`, the overlay, and the close button dismiss; focus moves to the first link on open and returns to the burger on close.
- Engine mapping: Hugo renders `partials/drawer.html` driven by `js/nav.js`; Docusaurus uses its native `.navbar-sidebar` drawer themed to the same family (tabs appear in the primary menu automatically as navbar items).
- Specimen: [`preview/components-nav.html`](./preview/components-nav.html) (frozen-open snapshot).

---

## TOC

Right rail "On this page" list. Quiet items; the active item is teal text plus a 4 px teal dot in the left gutter (replaces the 0.1.x left-border indicator).

### DOM

```html
<nav class="kt-toc" aria-label="On this page">
  <div class="kt-toc__label">
    <svg class="kt-toc__label-icon"><!-- list glyph --></svg>
    <span>On this page</span>
  </div>
  <a class="kt-toc__item kt-toc__item--active" href="#install">Installation</a>
  <a class="kt-toc__item kt-toc__item--nested" href="#install-macos">macOS</a>
</nav>
```

### Classes

| Class                 | Kind    | Purpose                                                                                  |
| --------------------- | ------- | ---------------------------------------------------------------------------------------- |
| `.kt-toc`             | block   | TOC wrapper. Vertical flex column, 24 / 20 padding.                                      |
| `.kt-toc__label`      | element | "On this page" label row: list glyph + mono uppercase text (`--font-label` 11 px / 600). |
| `.kt-toc__label-icon` | element | 14 × 14 list glyph, `--fg-3`.                                                            |
| `.kt-toc__item`       | element | A heading link. 13 px sans, `--fg-3`, ellipsized (no wrap), hover `--fg-1`.              |

### Modifiers

| Modifier                | Meaning                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `.kt-toc__item--active` | Currently viewed heading. Teal text plus a 4 px teal dot in the left gutter (`::before`).                           |
| `.kt-toc__item--nested` | Indented sub-heading (h3). Larger left padding, 12.5 px font. The dot column stays aligned — only the text indents. |

### Notes

- Specimen: [`preview/components-shell.html`](./preview/components-shell.html).

---

## Parameter table

Table used in API references to document parameter names, types, and descriptions.

### DOM

```html
<table class="kt-params">
  <thead>
    <tr>
      <th>Parameter</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code class="kt-params__name">timeout</code>
        <span class="kt-params__type">number · ms</span>
      </td>
      <td>Request timeout. Defaults to 30000.</td>
    </tr>
  </tbody>
</table>
```

### Classes

| Class              | Kind    | Purpose                                                                           |
| ------------------ | ------- | --------------------------------------------------------------------------------- |
| `.kt-params`       | block   | Parameter table. 100% width, collapsed borders, 14 px sans body.                  |
| `.kt-params__name` | element | Parameter identifier. 13 px monospace, 500 weight.                                |
| `.kt-params__type` | element | Type signature. 12 px monospace, `--code-type` colour, displayed on its own line. |

### Notes

- `thead th` is styled by element selector inside `.kt-params` — engines that wrap headers in `<th>` get the styling automatically. Headers are uppercase monospace with `surface-2` background.
- Specimen: [`preview/components-params.html`](./preview/components-params.html).

---

## Pagination

Prev / next link pair at the foot of an article.

### DOM

```html
<nav class="kt-docs-pager">
  <a class="kt-docs-pager__link kt-docs-pager__link--prev" href="/intro">
    <span class="kt-docs-pager__direction">← Previous</span>
    <span class="kt-docs-pager__title">Introduction</span>
  </a>
  <a class="kt-docs-pager__link kt-docs-pager__link--next" href="/install">
    <span class="kt-docs-pager__direction">Next →</span>
    <span class="kt-docs-pager__title">Installation</span>
  </a>
</nav>
```

### Classes

| Class                       | Kind    | Purpose                                                                        |
| --------------------------- | ------- | ------------------------------------------------------------------------------ |
| `.kt-docs-pager`            | block   | Pager wrapper. Two-column equal grid, 12 px gap, top border, top margin 48 px. |
| `.kt-docs-pager__link`      | element | A single prev or next card. Border-1, medium radius, vertical flex.            |
| `.kt-docs-pager__direction` | element | Tiny mono uppercase direction label ("Previous" / "Next").                     |
| `.kt-docs-pager__title`     | element | Page title. 14 px sans, 600 weight.                                            |

### Modifiers

| Modifier                     | Meaning                                             |
| ---------------------------- | --------------------------------------------------- |
| `.kt-docs-pager__link--prev` | Previous link card. Left-aligned content (default). |
| `.kt-docs-pager__link--next` | Next link card. Right-aligned content.              |

### Notes

- Specimen: [`preview/components-nav.html`](./preview/components-nav.html).

---

## Docs shell

Canonical three-column documentation layout: sidebar, main, TOC. The shell handles sticky positioning, max width, and the responsive collapse of the right and left columns.

### DOM

```html
<div class="kt-docs-shell">
  <aside class="kt-docs-shell__side"><!-- sidenav --></aside>
  <main class="kt-docs-shell__main">
    <article class="kt-docs-article">
      <!-- article header (eyebrow + h1 + copy page), content, pager -->
    </article>
  </main>
  <aside class="kt-docs-shell__toc"><!-- toc --></aside>
</div>
```

### Classes

| Class                  | Kind    | Purpose                                                                          |
| ---------------------- | ------- | -------------------------------------------------------------------------------- |
| `.kt-docs-shell`       | block   | Three-column grid. Sidebar / main / TOC. Centered, max width `--docs-shell-max`. |
| `.kt-docs-shell__side` | element | Left column. Sticky to header, right border, scrolls within viewport height.     |
| `.kt-docs-shell__main` | element | Middle column. Article content background, 36 / 48 / 80 padding.                 |
| `.kt-docs-shell__toc`  | element | Right column. Sticky to header, scrolls within viewport height.                  |

### Notes

- Breakpoints: max width is `--docs-shell-max` (1440). Below 1024 px the TOC column is removed (the layout becomes two columns); below 720 px the sidebar is also removed and the main column takes the full width with reduced padding (24 / 20 / 60).
- Sticky offset for the side and TOC columns is `--docs-header-height` (60 px by default).
- Layout dimensions come from `--docs-sidebar-width`, `--docs-toc-width`, `--docs-content-max`, `--docs-shell-max`, and `--docs-header-height`.
- Specimen: [`preview/components-shell.html`](./preview/components-shell.html).

---

## Article

Reading column inside the main content slot. Owns the vertical rhythm and the maximum reading measure.

### DOM

```html
<article class="kt-docs-article">
  <h1>Installation</h1>
  <p>kotlin-docs-kit ships two engine packages…</p>
  <h2>Prerequisites</h2>
  <ul>
    <li>Node.js 20+</li>
    <li>Python 3.10+</li>
  </ul>
  <blockquote>Quote from the language reference.</blockquote>
</article>
```

### Classes

| Class              | Kind  | Purpose                                                                                                         |
| ------------------ | ----- | --------------------------------------------------------------------------------------------------------------- |
| `.kt-docs-article` | block | Article wrapper. Reading column with max width `--docs-content-max` (720 px) and 16 px default sibling spacing. |

### Notes

- The vertical rhythm is implemented through child-combinator selectors: `> * + *` (16 px), `> h2` (36 px before), `> h3` (24 px before), `> h2 + p` / `> h3 + p` (8 px after heading). Engines that wrap content in additional layers may need to apply the same rules.
- `ul`, `ol`, `li`, `blockquote` inherit kit defaults from the article scope. List padding is 24 px with 1.7 line-height; blockquotes carry a 3 px left border in `--border-2`.
- The reading measure for prose is `--reading-measure` (72ch), enforced at the engine level for paragraphs where appropriate.

---

## States

Centered empty or loading state with icon, title, and body. Light touch — used as a placeholder, not a hero.

### DOM

```html
<div class="kt-state">
  <div class="kt-state__icon">
    <svg><!-- icon --></svg>
  </div>
  <h4 class="kt-state__title">No results</h4>
  <p class="kt-state__body">Try a different search term.</p>
</div>
```

The class form is canonical; the kit also styles plain `<h4>` and `<p>` inside `.kt-state` as a fallback for engines that cannot inject classes onto those nodes.

### Classes

| Class              | Kind    | Purpose                                                     |
| ------------------ | ------- | ----------------------------------------------------------- |
| `.kt-state`        | block   | Centered vertical stack. 32 / 20 padding, center alignment. |
| `.kt-state__icon`  | element | 38 × 38 icon tile. Surface-2 background, medium radius.     |
| `.kt-state__title` | element | Heading line. 15 px sans, 600 weight.                       |
| `.kt-state__body`  | element | Description line. 13 px sans, max reading measure 38ch.     |

---

## Authoring syntax across engines

Authoring syntax differs across engines, but every form below MUST produce the DOM defined above. This table is ported verbatim from [SPEC §7.3](../../SPEC.md). The native-first principle ([SPEC §1](../../SPEC.md)) means engines keep their idiomatic authoring forms instead of unifying around a single one.

| Component            | Docusaurus                                                        | Hugo                                         |
| -------------------- | ----------------------------------------------------------------- | -------------------------------------------- |
| Callout (12 kinds)   | `<Callout type="tip" title="Pro tip">` (MDX, globally registered) | `{{< callout type="tip" title="Pro tip" >}}` |
| Code block with tabs | `<Tabs>` + `<TabItem>` or Docusaurus-native code tabs             | `{{< code-tabs >}}` + `{{< code-tab >}}`     |
| Card / CardGrid      | `<Card>` + `<CardGrid>` (MDX, global)                             | `{{< card-grid >}}` + `{{< card >}}`         |
| Hero                 | `<Hero>` (MDX)                                                    | `{{< hero >}}`                               |
| FeatureGrid          | `<FeatureGrid>`                                                   | `{{< feature-grid >}}`                       |
| Badge                | `<Badge variant="experimental">`                                  | `{{< badge variant="experimental" >}}`       |
| HTTP method          | `<Method type="get">`                                             | `{{< method type="get" >}}`                  |
| Content tabs         | `<Tabs>` + `<TabItem>`                                            | `{{< tabs >}}` + `{{< tab >}}`               |
| Parameter table      | `<Params>` MDX component with array prop                          | `{{< params >}}`                             |

---

## Related documents

- [`claude-ds-rename.md`](./claude-ds-rename.md) — Mapping from the original flat Claude DS class names to the BEM names used here.
- [`engine-mappings/docusaurus.md`](./engine-mappings/docusaurus.md) — Internal spec for how `@ktdocs/docusaurus-preset` swizzles theme components and remaps Infima variables.
- [`engine-mappings/hugo.md`](./engine-mappings/hugo.md) — Internal spec for how the Hugo module wires shortcodes and Chroma classes.
- [`preview/`](./preview/) — Frozen HTML specimens covering brand, colors, typography, spacing, and components. Used as the visual reference for self-docs and regression checks.
- [`../../packages/tokens/README.md`](../../packages/tokens/README.md) — CSS custom properties consumed by these components (`--kt-*`, `--surface-*`, `--fg-*`, `--type-*`, `--space-*`, `--docs-*`, `--code-*`).
- [`../../SPEC.md`](../../SPEC.md) — Architecture specification. §6 covers the token system; §7 covers the components and authoring contract; §10 covers customization layers.
