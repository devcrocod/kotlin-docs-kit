# SPEC: Mintlify-inspired shell & navigation redesign

- **Status:** Draft, approved by interview (2026-07-04)
- **Target release:** `@ktdocs/docusaurus-preset` **0.2.0** + `kotlin-docs-hugo` **hugo-v0.2.0** (single combined release)
- **Working branch:** `redesign/mintlify` (epic branch; master untouched until fully ready)
- **Reference:** mintlify.com/docs — navbar, nav tree, accent discipline, restrained style

---

## 1. Background & goals

The kit's docs shell (navbar, sidebar, TOC, article header) should adopt the _structure and
restraint_ of Mintlify's documentation UI while keeping the kit's own identity:

**Adopt from Mintlify:**

- Top-level **tabs** in the navbar, each tab owning its own sidebar tree.
- A quieter navigation tree: section headers with icons, nested items on a vertical rail,
  active state expressed by color — not by filled backgrounds.
- Visible **search field trigger** with a `⌘K` hint in the navbar.
- Article header anatomy: colored **eyebrow** (parent section) above the H1, page actions
  aligned with the H1 row, no breadcrumbs.
- Unified **code block header**: tabs/title on the left, actions on the right, one thin frame.
- Content components: **Accordion**, **prev/next pager cards**, **Related topics**.

**Keep (kit identity, explicitly confirmed):**

- Fleet neutral palette in dark mode (no shift to near-black).
- Teal as the single interaction accent in both themes; Kotlin gradient only for brand.
- IBM Plex Mono label DNA (`--font-label`) for eyebrows, section labels, meta.
- JetBrains "Dark-Teal" code palette — untouched.

**Non-goals:** see §18.

---

## 2. Decision log (interview, 2026-07-04)

| #   | Topic                 | Decision                                                                                                                                      |
| --- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Engine sync           | **Strict lockstep** — every change lands in both Docusaurus and Hugo within the same PR                                                       |
| 2   | IA                    | **Full tabs**: each navbar tab switches both content scope and sidebar tree                                                                   |
| 3   | Dark palette          | **Keep Fleet neutrals**; no near-black shift                                                                                                  |
| 4   | Search presentation   | **Visible field trigger** with ⌘K chip in the navbar, both engines                                                                            |
| 5   | Sidebar section icons | **Curated built-in set** (Lucide-derived inline SVG), same names in both engines                                                              |
| 6   | Collapse behavior     | **Multi-open + memory** (Docusaurus native; Hugo vanilla JS + `sessionStorage`)                                                               |
| 7   | Active-state language | **Mintlify minimalism**: teal text only; rail segment for nested items; TOC dot; hover keeps `surface-2`                                      |
| 8   | Search backend        | **Unchanged per engine** (`@easyops-cn/docusaurus-search-local` / Pagefind); UI contract unified                                              |
| 9   | New components        | **Accordion/AccordionGroup, pager cards, Related topics**. No feedback widget, no Ask-AI                                                      |
| 10  | Article header        | **Eyebrow replaces breadcrumbs**; Copy page moves into the H1 row                                                                             |
| 11  | Typography            | **Mono label DNA stays** (deliberate divergence from Mintlify)                                                                                |
| 12  | Code blocks           | **Unified header** (title/lang or tabs left, actions right, single frame)                                                                     |
| 13  | Rollout               | **Epic branch** until fully ready; then one merge to master                                                                                   |
| 14  | Versioning            | **0.2.0**, honest breaking changes, migration notes in changelog                                                                              |
| 15  | Mobile                | **Tabs inside the drawer**; Hugo gets a from-scratch vanilla-JS drawer                                                                        |
| 16  | QA                    | **Specimens for every new/changed component + manual light/dark screenshot pass** (existing headless-Chrome harness); no CI visual regression |
| 17  | Dogfood tabs          | **Docs / Reference / Changelog**                                                                                                              |
| 18  | Homepage              | **Inherits tokens only**; no structural redesign; re-shoot template screenshots at the end                                                    |
| 19  | Spec language         | English (this document)                                                                                                                       |

Two deliberate refinements were made while writing this spec (not interview decisions,
called out here for transparency): top-level sidebar sections are group headers, not
toggles (§6); configs with fewer than two tabs render no tab bar (§5).

---

## 3. Design language

- **Accent discipline.** Teal (`--color-interactive*`, `--kt-teal-*`) marks exactly one thing
  per region: the active nav item, the active TOC item, the eyebrow, links. Navbar tabs do
  **not** use teal (see §4) — matching Mintlify, where the active top tab is a neutral pill
  and color is reserved for the tree.
- **Depth via hairlines.** `--border-1` hairlines and `surface-2` hovers, not filled blocks.
  Existing Fleet surface scale is unchanged.
- **Mono DNA.** `--font-label` (IBM Plex Mono) stays on: eyebrow, sidebar section labels,
  "On this page", pager direction labels, ⌘K chip, badges. Everything else is Plex Sans.
- **Density.** Layout tokens keep current values (`--docs-sidebar-width: 280px`,
  `--docs-toc-width: 240px`, `--docs-content-max: 860px`, `--docs-header-height: 60px`).
  Article content typography is untouched in this release (see §18); shell token values
  do not change either.

---

## 4. Top navigation bar (`kt-topnav`)

Layout (desktop ≥ 997px), left → right:

1. **Brand**: logo + title (unchanged; Hugo keeps the version chip).
2. **Tab group** (`kt-topnav__tabs`): text tabs, `--font-sans` 14–15px / 500.
   - Inactive: `--fg-2`; hover: `--fg-1` + `surface-2` pill.
   - Active: `--fg-1` on a `surface-2` pill (dark mode: the existing `--overlay-white-*`
     equivalent). **No teal.**
   - Pill radius: `--radius-md` full-height pill, 8–10px horizontal padding.
   - Overflow: the tab group **never wraps** (header height is fixed at 60px); each tab
     truncates with ellipsis at ~160px max-width.
3. **Right cluster**: search trigger (§11), GitHub icon button, theme toggle. The GitHub
   button is **new on the Hugo side** (config-driven via a site param); Docusaurus keeps
   the existing `type: 'html'` inline-SVG item.

Existing translucent `surface-1` + `backdrop-filter: blur(14px)` background and the 1px
bottom hairline stay.

### Engine mapping

- **Docusaurus:** tabs are native `type: 'docSidebar'` navbar items — no new preset option
  needed for the mechanism. The preset styles them: navbar items that link to sidebars get
  the pill treatment via the existing `Navbar` wrapper (`.kt-topnav`) + CSS on
  `.navbar__item.navbar__link--active`. Verify Infima specificity (known gotcha: Infima
  nav-active needed var-level overrides, see `docs-kit-docusaurus-ui-gotchas`).
- **Hugo:** new `[[menus.tabs]]` menu (entries point at section roots via `pageRef`).
  `partials/header.html` renders the tab group; active detection via
  `$page.IsMenuCurrent "tabs" .` with an `.IsAncestor`-based fallback so any page inside a
  section marks its tab active. Zero-config behavior: if `menus.tabs` is absent, the tab
  group is not rendered and the theme falls back to the current flat `menus.main` links —
  tabs are an **optional feature** in both engines.

---

## 5. Tabs ↔ sidebar mapping & dogfood IA

### Docusaurus (dogfood + template)

`docs/sidebars.ts` splits the single `main` sidebar into three:

| Tab       | Sidebar id      | Content                                                                                                               |
| --------- | --------------- | --------------------------------------------------------------------------------------------------------------------- |
| Docs      | `docs`          | intro, getting-started, guides (docusaurus/hugo), customization, roadmap, contributing, maintainer                    |
| Reference | `reference`     | tokens, components/\* (largest subtree — showcases per-tab sidebar switching)                                         |
| Changelog | — (single page) | `changelog.mdx` as a plain `to:` navbar item styled as a tab; sidebar hidden on it (Mintlify single-page-tab pattern) |

Doc IDs and URLs do not change — only sidebar assignment. `navbar.items` switches from
plain links (Docs / Components / Tokens) to two `docSidebar` items + one doc link.

The `templates/docusaurus` starter mirrors the pattern with two tabs (Docs / Changelog)
so the feature is exercised in both starters, not just the dogfood site.

### Hugo (theme + template)

Tabs map to top-level content sections, but a tab may own **several** sections: each
`[[menus.tabs]]` entry lists its sections via `params.sections = ["getting-started",
"guides", ...]`; an entry without `params.sections` owns only its `pageRef` section.
`partials/sidebar.html` renders the tree of the current tab's section set (today it
renders all of `.Site.Sections`). This avoids restructuring content directories — the
Hugo starter keeps its four existing top-level sections and groups them into two tabs
(Docs = getting-started + guides + reference + examples; Changelog) with **no URL
changes**.

**Fallback contract (both engines, upgrade path for 0.1.0 sites):**

- No tabs configured → tab group not rendered; Hugo sidebar renders all top-level
  sections (current behavior); Docusaurus keeps its single sidebar; the mobile drawer
  omits the tab block. Top navigation falls back to the flat `menus.main` links (Hugo) /
  plain navbar items (Docusaurus).
- Exactly one tab configured → treated as no tabs (the tab bar appears only at ≥ 2 tabs).

### Sidebar tree depth (Hugo)

Current `sidebar.html` is flat (section → pages). Rewrite as a **recursive partial**
(`partials/sidebar-tree.html`) walking `.Sections` + `.RegularPages` by weight, so nested
groups render and collapse like Docusaurus categories. This is a prerequisite for §6.

---

## 6. Sidebar nav tree (`kt-sidenav`)

### Structure

- **Section label row** (top-level groups): icon (16px) + mono uppercase label
  (`--font-label` 11px / 600, letter-spacing 0.07em) — the existing eyebrow-divider style
  gains an icon. **Non-collapsible at every width** (desktop and drawer): they are group
  headers, not toggles — the Mintlify pattern. Collapse (decision #6) applies to nested
  groups only; this narrowing is called out in §2.
- **Items**: `--font-sans` 14px / 500, `--fg-2`, padding ~6px 10px, `--radius-sm`.
- **Nested groups** (level ≥ 2): collapsible; children indented on a 1px vertical rail
  (`--border-2`).

### Icons

Two distinct sets, one pipeline:

- **Section icons** (user-configurable, curated): **16 Lucide-derived inline SVGs**
  (ISC license, attribution in `NOTICE`/readme): `rocket, book-open, map, layers,
palette, code, terminal, settings, wrench, puzzle, flag, file-text, history, users,
shield, sparkles`.
- **UI glyphs** (fixed, not user-configurable — the shell needs them): `list` (TOC
  label), `search` (trigger), `chevron-right`/`chevron-down` (collapse, accordion,
  Copy-page caret), `menu`/`x` (drawer), `arrow-left`/`arrow-right` (pager), `copy`.
- **Source of truth:** `packages/tokens/src/icons/*.svg` (24×24 viewBox,
  `stroke="currentColor"`, `fill="none"`). **Stroke-width unified at 1.5 for the entire
  set** — the existing hand-drawn icons in `kt-icon.html` use stroke 2 / 18px render, so
  icons already used by cards and code blocks get slightly lighter (accepted visual
  change, listed in migration notes).
- **Build outputs:** `dist/icons.json` (name → inner SVG markup) and a generated Hugo
  partial `kt-icons.generated.html`. Getting them to consumers requires **new plumbing**
  (the existing pipelines don't cover either artifact):
  - Docusaurus: extend `packages/docusaurus/scripts/copy-css.mjs` (today it hardcodes
    4 CSS files + fonts) to also copy `dist/icons.json` into `lib/tokens/`, and add a
    `./icons.json` entry to `@ktdocs/tokens`' `exports` map — otherwise the published
    preset ships without icons even though the workspace dogfood works.
  - Hugo: add a **new rsync line** to the Taskfile `hugo:build` propagation (the current
    filter is `--include='*.css'` into `assets/css/` and can never deliver an `.html`
    into `layouts/partials/`). The generated partial is **committed** to `packages/hugo`
    (like the propagated CSS) because the theme ships from git tags via the Go proxy;
    do not gitignore it. Optional: a drift check in `task ci` (regenerate +
    `git diff --exit-code`).
- **Single dispatch on the Hugo side:** the existing `kt-icon.html` (hardcoded 11-icon
  dict: `rocket, edit, sliders, grid, palette, upload, book, code, terminal, file,
copy`) becomes a thin dispatcher over the generated map. The generated set must be a
  **superset of the names already used** by the card shortcode and `render-codeblock`
  (`file`, `copy`, `book`, `edit`, `sliders`, `grid`, `upload`) — either keep those
  names as aliases (`book` → `book-open` markup, `file` → `file-text`) or migrate the
  call sites to the new names in the same PR (tokens groundwork, §16 PR 1).
- **Config surface:**
  - Docusaurus: `customProps: { icon: 'rocket' }` on sidebar categories/sections.
  - Hugo: `params.icon = "rocket"` in the section's `_index.md` front matter, rendered
    via the `kt-icon.html` dispatch.
- Unknown icon name → render no icon (graceful), log a build warning where cheap to do.

### Collapse behavior

- **Multi-open** everywhere; opening a group never closes siblings.
- Docusaurus: native collapsible categories; ensure `autoCollapseCategories: false` stays
  the effective default in preset docs/config.
- Hugo: `nav.js` (new vanilla module, see §12) toggles `aria-expanded`/`hidden`;
  server-side rendering pre-expands the active ancestor chain (no FOUC, works without JS).
  Open/closed state persisted per tree in `sessionStorage`
  (`kt.sidenav.<tab>` → array of open group ids) because every Hugo navigation is a full
  page load. Group id = the group page's `RelPermalink` (stable under sub-path
  deployments); with no tabs configured the key falls back to `kt.sidenav._root`.

### Active & hover states (Mintlify minimalism)

- Active item: **teal text only** (`--color-interactive`), weight 500 — the current
  `--color-interactive-soft` background and inset left bar are **removed**.
- Active item inside a nested group: additionally, its 2px segment of the vertical rail is
  teal (rail alignment with the item's box).
- Hover (any item): `surface-2` background, `--fg-1` text — unchanged, deliberately kept
  visible for clickability.
- Focus-visible: existing `--focus-ring`.
- Overflow: long item labels **wrap** (max 2 lines); the rail's active segment spans the
  item's full box height, including wrapped items.

---

## 7. Table of contents (`kt-toc`)

- "On this page" label: keeps mono style; gains the small `list` UI glyph (§6) to match
  Mintlify's `☰ On this page`.
- Items: 13px, `--fg-3`; hover `--fg-1`; long items ellipsize (no wrap).
- Active item: teal text + a **4px teal dot** on the left gutter (replaces the current
  left-border indicator). Nested (h3) items indent one step; the dot column stays aligned.
- Keep `.kt-toc { display: contents }` sticky fix (known gotcha).

---

## 8. Article header (`kt-article-header`)

New anatomy, replacing the breadcrumbs row:

```
[eyebrow — parent section label, teal, --font-label 11px uppercase]
[H1 ..................................................] [Copy page ▾]
[lead paragraph — unchanged]
```

- **Eyebrow content:** the _immediate parent_ group label (Mintlify shows the direct
  parent: page "Install the CLI" in group "CLI" → eyebrow `CLI`).
  - Fallback chain: parent category label → tab label → hidden.
  - Hidden when it would equal the page title (e.g. tab-root index pages).
- **Copy page**: moves from above-breadcrumbs into the H1 row (flex row, H1 takes the
  remaining width; on mobile the button wraps under the H1, right-aligned). Keep the
  `right: auto` dropdown reset (known gotcha).
- **Breadcrumbs are removed**: `.kt-crumbs` DOM and CSS deleted in both engines
  (**breaking**, §16). The mono/`/`-separator aesthetic lives on in the eyebrow.

### Engine mapping

- Docusaurus: the existing `DocBreadcrumbs` wrapper becomes a full custom component
  rendering the eyebrow. It derives the parent via the **internal**
  `useSidebarBreadcrumbs` hook from `@docusaurus/plugin-content-docs/client` (the current
  wrapper receives no data props) — one more unstable API to pin (§15).
- Docusaurus copy-page (verified against `docusaurus-plugin-copy-page-button@0.8.3`):
  with `placement: 'article'` the plugin's client JS injects a
  `div#copy-page-button-container` — after `.theme-doc-breadcrumbs` only when that is a
  _direct child_ of the article (the kit's wrapper already breaks this), otherwise as
  the article's **first child**, with inline styles, post-hydration. So pure CSS cannot
  place it into the H1 flex row. Plan: **primary** — position it via the plugin's
  `customStyles.button.style` positioning props (the client honors them and skips its
  inline defaults), with the header grid reserving space for it to avoid hydration
  layout shift; **fallback** — disable the plugin's article placement and render the
  kit's own button inside the header component.
- Hugo: `single.html` **already** renders H1 + copy-page in a `.kt-doc-titlebar` flex
  row — the Hugo side is restyle-only. Rename/absorb `.kt-doc-titlebar` into the new
  `.kt-article-header` anatomy (class rename → migration notes), and add the eyebrow
  partial above it: `partials/breadcrumbs.html` → `partials/eyebrow.html`
  (parent = `.Parent.Title` / `.CurrentSection.Title`).

---

## 9. Code blocks — unified header (`kt-codeblock__header`)

One frame (`--border-1`, `--radius-md`), header strip visually distinct within the same
frame (hairline bottom border; background = `--surface-code` with a subtle overlay).

- **Single block:** header shows `title` (filename) or language label — `--font-label`
  12px, `--fg-2` — left; **copy button** right. Baseline fact: **both engines already
  render a header on every block** (the custom CodeBlock falls back to a language label;
  Hugo's render hook defaults `$lang` to `text`) — this stays; no header-less state is
  introduced.
- **CodeTabs:** the tab row (npm/pnpm-style) _is_ the header — tabs left, actions right,
  no separate stripe above the frame. Active tab: `--fg-1` + 2px teal underline
  (consistent with existing `kt-tabs`).
- Code palette, line highlight, line numbers, terminal blocks: unchanged.

### Engine mapping

- Docusaurus: `CodeBlock/index.tsx` is already fully custom — restructure its header;
  merge `CodeTabs` header rendering with it.
- Hugo: `_markup/render-codeblock.html` + `code-tabs`/`code-tab` shortcodes produce the
  same DOM; Hugo-only CSS deltas stay in `chroma.css` (loads last, survives rsync — known
  contract). Copy-to-clipboard **already exists** on the Hugo side (delegated
  `[data-copy]` handler in `theme.js`, wired to the button emitted by
  `render-codeblock.html`) — only the button's placement/styling inside the unified
  header changes.

---

## 10. New content components

### 10.1 Accordion / AccordionGroup

- `<details>`-based in **both** engines — zero JS, SSR-safe, multi-open by default.
- DOM: `.kt-accordion` (details) > `.kt-accordion__summary` (summary: chevron **left**,
  Mintlify-style, rotates 90° when open) + `.kt-accordion__body`.
- `.kt-accordion-group`: stacked accordions in one bordered container with hairline
  dividers (the Mintlify troubleshooting look).
- Docusaurus: MDX components `Accordion`, `AccordionGroup` registered in
  `MDXComponents.tsx`. Hugo: `accordion.html`, `accordion-group.html` shortcodes.
- Open-state animation: CSS-only, best-effort (`::details-content` /
  `interpolate-size` where supported; instant elsewhere). No JS polyfill.

### 10.2 Pager cards (`kt-docs-pager`)

Restyle existing pager into two bordered cards (grid: 2 columns desktop, 1 column
< 640px):

- Card: `--border-1`, `--radius-md`, padding ~16px; direction label
  (`Previous` / `Next`) in `--font-label` 11px `--fg-3`; page title 15px / 600 `--fg-1`;
  chevron aligned to the outer edge.
- Hover: teal border + arrow nudge — reuse the existing kt-card hover DNA (corner glow
  optional; keep it consistent with `kt-card`, do not invent a new hover).
- Engine mapping: `DocPaginator` wrapper (Docusaurus) / `partials/pager.html` (Hugo) —
  markup change + `pager.css` rewrite.

### 10.3 Related topics (`kt-related`)

- Front matter driven, **manual only** (no similarity automation):
  - Docusaurus: `related: [guides/hugo/install, reference/tokens]` (doc IDs).
  - Hugo: `related: ["/guides/install/"]` (page paths; note Hugo has a native `related`
    front-matter concept — namespace ours as `kt_related` if it conflicts; verify during
    implementation). Entries are resolved via `.Site.GetPage` and rendered with
    `.RelPermalink` — never emitted verbatim (sub-path baseURL gotcha) — which also
    supplies the page title for the link text; unresolvable paths are skipped.
- Rendering: after content, before the pager. Heading "Related topics" in mono label
  style; each entry = file-text icon + link.
- Docusaurus: `DocItem/Footer` wrapper reads front matter. Hugo: partial in
  `single.html`. Invalid/missing ids: skip silently at render, warn at build where cheap.

---

## 11. Search UI (`kt-search`)

Backends stay as they are (decision #8): `@easyops-cn/docusaurus-search-local` on
Docusaurus (works in dev), Pagefind on Hugo (post-build index). What unifies is the
**visual contract**:

- **Trigger** (navbar, right cluster): input-lookalike button — magnifier icon,
  `Search…` placeholder in `--fg-3`, `⌘K` chip in `--font-label` (`Ctrl K` on
  non-mac via JS `navigator.platform` sniff, static `⌘K` acceptable fallback);
  `surface-1` bg, `--border-1`, `--radius-md`; width ~200–240px.
  **Breakpoint contract (fixed, aligns with §12):** the full field trigger renders at
  ≥ 997px _always_; below 997px the mobile navbar shows a search **icon button** opening
  the same results surface. The drawer contains **no** search field.
- **Results surface:** each engine keeps its own mechanism (easyops dropdown vs Pagefind
  modal) — an accepted behavioral divergence — but both are themed to the same visual
  family: `surface-1` panel, hairline borders, teal highlight for matches/active row,
  mono meta labels.
- **Hugo side: already implemented** — `header.html` renders `.kt-docs-search` with
  magnifier, `Search…`, ⌘K chip, and `search.js` binds ⌘/Ctrl-K. Restyle only.
- **Docusaurus side is the gap.** Verified: `@easyops-cn/docusaurus-search-local`
  renders `.navbar__search`/`.navbar__search-input` plus hashed CSS-module classes — it
  does **not** render `.DocSearch-*` DOM and does not consume `--docsearch-*` vars, so
  the existing `--docsearch-*`/`.DocSearch-Button` rules in the preset's
  `src/css/search.css` are dead code for this backend (prune them). The trigger contract
  therefore needs a **swizzle/wrap of the easyops `SearchBar`** (or styling
  `.navbar__search-input` + a CSS-injected ⌘K chip on stable classes only) — this is
  not a CSS-only restyle. Added to the §15 inventory.
- New specimen `components-search` freezes the trigger + one result-list state.

---

## 12. Mobile (< 997px)

Breakpoint unified at Docusaurus' 996px boundary for both engines.

- **Navbar collapses to:** burger, brand, search (icon), theme toggle.
- **Drawer** (left panel, full height): tab group rendered as a stacked block at the top
  (Mintlify pattern), then the current tab's tree. Tapping a tab **navigates to the tab
  root** (full navigation; the destination page's drawer shows that tab's tree) — no
  in-place tree swap. This matches both engines' nature: Docusaurus' native drawer
  navigates-and-closes, and every Hugo navigation is a full page load with only the
  current tab's tree in the DOM (§5).
- Docusaurus: native drawer; ensure tabs (docSidebar navbar items) appear in the drawer's
  primary menu and the kt styling applies inside it.
- Hugo: **new from-scratch drawer** in `nav.js` (single vanilla module shared with §6
  collapse logic): burger toggle, overlay, body scroll-lock, `Esc`/overlay close, focus
  trap kept minimal (focus first link on open, restore on close). Budget: one file,
  ~200–250 lines, no dependencies.
- TOC on mobile: unchanged (collapsible "On this page" — current behavior per engine).

---

## 13. Tokens & CSS changes

`packages/tokens/src/components/` (compact CSS stays **out of Prettier scope** — known
contract):

| File                      | Change                                                                                                                                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `topnav.css`              | **new** — `.kt-topnav` split out of `nav.css` (no such file exists today): tab pills, search trigger, right-cluster spacing. Existing trigger styles in `nav.css`/`inputs.css` move here (extended, not created) |
| `nav.css`                 | rewrite: section icon row, rail, minimal active states, collapse chevrons, drawer styles                                                                                                                         |
| `toc.css` (or within nav) | dot indicator, icon in label                                                                                                                                                                                     |
| `crumbs.css`              | **deleted**                                                                                                                                                                                                      |
| `eyebrow.css`             | **new** — `.kt-eyebrow`, `.kt-article-header`                                                                                                                                                                    |
| `codeblock.css`           | unified header structure                                                                                                                                                                                         |
| `tabs.css`                | CodeTabs-in-header variant                                                                                                                                                                                       |
| `accordion.css`           | **new**                                                                                                                                                                                                          |
| `pager.css`               | rewrite to cards                                                                                                                                                                                                 |
| `related.css`             | **new** (may fold into article.css if tiny)                                                                                                                                                                      |
| `search-ui.css`           | **new** — shared results-surface theming only (the trigger lives in `topnav.css`). Named to avoid confusion with the preset's `src/css/search.css`                                                               |
| `copy-page.css`           | reposition into the H1 row; keep the `right: auto` dropdown reset                                                                                                                                                |
| `shell.css`               | mobile drawer layout, header responsive behavior                                                                                                                                                                 |

- `scripts/build-components.mjs`: update the fixed concat ORDER for the new/removed
  files (the script hard-fails on any file-set mismatch — this is deliberate).
- **New build step** for icons: `src/icons/*.svg` → `dist/icons.json` + generated Hugo
  partial. Wire into `build:assets` or a new `build:icons`. Consumer plumbing (extend
  the preset's `copy-css.mjs` + tokens `exports`; new rsync line for the partial;
  partial is committed) is specified in §6.
- **No palette/typography token changes.** New component-level custom properties only
  where a value repeats (e.g. `--sidenav-rail-color`), defined inside component CSS, not
  in the semantic token JSON — the semantic layer is stable in this release.
- Hugo propagation (Taskfile rsync + sed) gains the generated-partial copy; the
  fonts-path sed and sub-path `url()` rules stay as-is (known sub-path gotchas: relative
  `../fonts/`, `relURL` for assets).

---

## 14. Specimens & QA

Contract: every kt component keeps an HTML specimen in `docs/contracts/preview/` using
**kt- BEM names verbatim** (specimens are copied, not transformed — flat names render
unstyled; known contract).

**New specimens:** `components-accordion`, `components-pager`, `components-related`,
`components-search`, `components-eyebrow` (article header anatomy).
**Updated specimens:** `components-topnav` (tabs + trigger), `components-nav` (icons,
rail, active/hover/collapsed states, drawer snapshot), `components-shell` (new header
anatomy, mobile layout, **and the TOC dot/active/nested states** — kt-toc markup lives
here), `code-tabs` (unified header), `code-linehighlight` and `code-terminal` (both
contain the current `kt-codeblock` header markup being restructured — specimens are
copied verbatim, so stale markup renders broken), `components-cards` only if pager
reuses card hover tokens.

Each specimen lands **in the same PR as its component** (see §16) — PR 7 is a final
sweep, not the specimen dump.

- Regenerate `docs/static/specimen/` via `prepare-specimens.mjs` (prebuild) after every
  specimen change.
- **Screenshot pass** (manual, existing headless-Chrome harness on a dist build): key
  pages of both engines — homepage, one Docs article, one Reference article, changelog
  tab, search open — light + dark, 1440px and 390px widths. Run before the epic merge;
  attach to the epic PR description.
- `docs/contracts/components.md` and `engine-mappings/{docusaurus,hugo}.md` updated in
  the same PRs as the code (the mappings are the parity contract that lockstep PRs are
  reviewed against).

---

## 15. Engine parity — implementation inventory

**Docusaurus (`packages/docusaurus`):**

- New/changed swizzles: `DocBreadcrumbs` (wrapper → full custom eyebrow, depends on the
  internal `useSidebarBreadcrumbs` hook), `DocItem/Footer` (new wrapper: related
  topics), `DocSidebarItem/Category` (new wrapper: icon rendering from
  `customProps.icon`), easyops `SearchBar` (trigger contract, §11). Honest framing:
  **both** `DocSidebarItem/Category` and `DocItem/Footer` are outside theme-classic's
  safe-swizzle list (as are several wrappers the kit already ships) — pin the supported
  Docusaurus peer range (currently `^3.5.0`) and the easyops version, and document
  them. Fallback if the Category wrapper proves brittle: `className`-based icons
  (`sidebars.ts` `className` + CSS `mask-image` data-URIs) — note the earlier CSS-mask
  navbar failure before choosing this path.
- `CodeBlock` restructure; `MDXComponents` + `Accordion`/`AccordionGroup`/`RelatedTopics`.
- CSS: `custom.css` / `docusaurus-overrides.css` — navbar tab pills, sidebar active-state
  removal of soft bg, TOC dot, drawer theming. Mind Infima specificity gotchas
  (`html[data-theme='dark']` pattern stays).
- No new preset options required for tabs (native `docSidebar` items); preset README
  documents the conventions (`customProps.icon`, `related` front matter, tabs recipe).

**Hugo (`packages/hugo`):**

- Partials: `header.html` (tabs, trigger restyle — the field trigger already exists,
  burger, **new GitHub icon button** via site param), `sidebar.html` → recursive
  `sidebar-tree.html`, `breadcrumbs.html` → `eyebrow.html`, `pager.html` (cards),
  new `related.html`, `kt-icons.generated.html` (committed build artifact),
  `kt-icon.html` → thin dispatcher over the generated map (§6).
- Shortcodes: `accordion.html`, `accordion-group.html`.
- JS: new `nav.js` (drawer + collapse + sessionStorage; ≤ ~250 lines); `search.js`,
  `theme.js` (incl. the existing `[data-copy]` code-copy handler), `copy-page.js`
  unchanged in behavior, restyled only.
- `chroma.css`: unified code header deltas.
- Config: `[[menus.tabs]]` convention documented in theme README; graceful no-tabs
  fallback.

---

## 16. Rollout plan

1. **Branch:** create `redesign/mintlify` off master. Rebase on master **weekly**
   (renovate and release-please keep landing there; `pnpm-lock.yaml` is the likely
   conflict hotspot).
2. **PR slicing inside the epic** (each PR lockstep across engines, reviewable alone;
   specimens ship in the same PR as their component, per §14):
   1. tokens groundwork: icons pipeline, `kt-icon.html` dispatch migration, component
      CSS skeletons, concat-order update;
   2. shell **+ dogfood IA re-cut in the same PR** (tab styling and per-tab sidebars
      are unreviewable until at least one site configures tabs): navbar tabs + search
      trigger + sidebar (icons/rail/states/recursion) + TOC + article header/eyebrow +
      `sidebars.ts` split / navbar items / Hugo `menus.tabs`;
   3. mobile drawer (both engines);
   4. code block unified header;
   5. accordion + pager cards + related topics;
   6. starter templates: tabs in both `templates/docusaurus` and `templates/hugo`;
   7. final sweep: contracts/engine-mappings + preset/theme READMEs + migration notes.
3. **Pre-merge checklist:**
   - screenshot pass (§14) green;
   - `task ci` + `task lint` + `task typecheck` green (three separate tasks matching
     the three CI jobs — `task ci` alone only covers the builds);
   - `.release-please-config.json`: **set `bump-minor-pre-major: true`** (both packages)
     _before_ merging — otherwise the `feat!` commits bump 0.1.0 → 1.0.0 instead of
     0.2.0;
   - migration notes drafted (see below).
4. **Merge** epic → master (merge commit or rebase-merge — preserve the conventional
   commits so release-please builds a real changelog; do **not** squash the epic into one
   commit).
5. **Release:** release-please PR → 0.2.0 for both packages; npm publish (preset) +
   `hugo-v0.2.0` tag (Go proxy) happen via the existing workflow.
6. **Post-merge:** deploy-docs publishes the dogfood site; sync-templates mirrors the
   starters; re-shoot the homepage template screenshots
   (`docs/static/img/templates/*`, light + dark) and land them in a follow-up PR.

### Migration notes (changelog, 0.2.0)

- `.kt-crumbs` removed → `.kt-eyebrow` (custom CSS targeting crumbs breaks).
- Hugo: `.kt-doc-titlebar` renamed/absorbed into `.kt-article-header` (§8).
- Sidebar active-item soft background removed (visual change, no action needed).
- Icon set: stroke-width unified at 1.5 (existing card/codeblock icons get lighter);
  legacy icon names (`book`, `file`, …) either aliased or migrated (§6, open question 4).
- New conventions: `customProps.icon` / section `params.icon`; `related` front matter;
  navbar tabs recipe (`docSidebar` items / `[[menus.tabs]]`).
- Hugo sites: new `nav.js` asset is part of the theme bundle; sidebar markup changed —
  custom overrides of `sidebar.html` must be rebased.

---

## 17. Risks & mitigations

| Risk                                                                                                                             | Mitigation                                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Unstable-API surface grows (`DocSidebarItem/Category`, `DocItem/Footer`, `useSidebarBreadcrumbs`, easyops `SearchBar`)           | Pin Docusaurus peer range (`^3.5.0`) and the easyops version; keep wrappers thin; documented CSS-mask fallback for icons                    |
| Copy-page plugin injects as the article's first child with inline styles (verified, §8) — pure CSS can't move it into the H1 row | Primary: plugin `customStyles` positioning + reserved space in the header grid; fallback: kit-own button, plugin article placement disabled |
| Icon stroke unification (2 → 1.5) subtly changes existing card/codeblock icons                                                   | Accepted; called out in migration notes; verified in the screenshot pass                                                                    |
| easyops vs Pagefind results UX drift confuses the parity story                                                                   | Freeze the shared visual contract in the `components-search` specimen; document the behavioral divergence explicitly                        |
| Hugo JS scope creep (drawer + collapse + clipboard)                                                                              | Hard budget: one `nav.js` ≤ ~250 lines, no framework, no bundler additions                                                                  |
| Epic branch rots against renovate/release-please traffic                                                                         | Weekly rebase; lockfile conflicts resolved by regenerating (`pnpm install`)                                                                 |
| release-please jumps to 1.0.0 on `feat!`                                                                                         | `bump-minor-pre-major: true` before merge (checklist item)                                                                                  |
| Removing breadcrumbs loses orientation on deep trees                                                                             | Eyebrow (immediate parent) + always-expanded active ancestor chain in the sidebar; revisit only if real feedback demands it                 |
| No Pages preview for the epic branch                                                                                             | Local builds + screenshot harness are the review surface; acceptable for a solo project                                                     |
| Recursive Hugo sidebar hits sub-path/baseURL link bugs                                                                           | Reuse `RelPermalink`-based patterns (known gotchas file); render smoke test in CI already builds with a sub-path                            |
| Prettier reformats compact component CSS                                                                                         | CSS remains excluded from Prettier scope (existing config; don't "fix" it)                                                                  |

---

## 18. Out of scope (explicit)

- Ask-AI input / assistant integration (needs a backend).
- Feedback widget ("Was this page helpful?").
- Near-black dark palette; sans-serif label migration.
- Homepage structural redesign (tokens-level refresh only; screenshots re-shot).
- Search backend migration (Pagefind-everywhere or preset dual-backend option).
- Article content typography-rhythm changes (heading margins, list spacing) — revisit
  after 0.2.0.
- CI visual regression infrastructure.
- Per-tab versioning/language dropdowns, CTA button in navbar.

---

## 19. Open questions (to resolve during implementation, not blockers)

1. Hugo `related` front-matter key: `related` vs `kt_related` (check collision with
   Hugo's native related-content engine).
2. Exact icon list may grow/shrink ±4 names once the dogfood sections pick their icons.
3. `⌘K`/`Ctrl K` label: static vs platform-sniffed (start static, enhance if trivial).
4. Whether the existing icon aliases (`book`, `file`, …) are kept permanently or the
   card/codeblock call sites migrate to the new names in PR 1 (§6 allows either).
