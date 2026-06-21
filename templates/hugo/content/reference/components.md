---
title: Components
description: A visual tour of every component — see it rendered, then open the linked example for the source.
weight: 20
---

Every component shares one BEM contract across both engines (Hugo and
Docusaurus), so a page authored here looks identical in either. This page
shows each one **rendered** — open the linked example for copy-paste source.
For the full
[BEM contract](https://github.com/devcrocod/kotlin-docs-kit/blob/master/docs/contracts/components.md)
(class names, nesting, ARIA), see the repo.

## Content blocks

### Callout

Twelve kinds (`note`, `info`, `tip`, `success`, `warning`, `caution`, `danger`,
`important`, `quote`, `example`, `deprecated`, `experimental`) — one shortcode,
`type` picks the variant.

{{< callout type="tip" title="Tip" >}}
Press <kbd>⌘</kbd>+<kbd>K</kbd> to focus search. Bodies are markdown, so
**formatting** and `code` work inside.
{{< /callout >}}

All twelve → [callouts example](../../examples/callouts/).

### Code block

Any fenced block becomes a premium code block — language label, copy button,
theme-aware syntax colours. Add `title=` / `file=` for a filename tab;
bash-family languages render as a terminal session.

```kotlin
fun greet(name: String) = "Hello, $name"
```

```bash
hugo server -D
```

More → [code & terminal example](../../examples/code-tabs/).

### Code tabs

Group several files behind tabs — one tab per file:

{{< code-tabs >}}
{{< code-tab title="Kotlin" lang="kotlin" >}}
fun greet(name: String) = println("Hello, $name")
{{< /code-tab >}}
{{< code-tab title="Java" lang="java" >}}
void greet(String name) {
    System.out.println("Hello, " + name);
}
{{< /code-tab >}}
{{< /code-tabs >}}

Full example → [code & terminal example](../../examples/code-tabs/).

### Content tabs

For prose (not code) — e.g. per-OS steps. Visually distinct from code tabs:

{{< tabs >}}
{{< tab title="macOS" >}}
Use Homebrew: `brew install hugo`.
{{< /tab >}}
{{< tab title="Linux" >}}
Use your distro's package manager.
{{< /tab >}}
{{< /tabs >}}

More → [basic usage](../../guides/basic-usage/).

### Parameter table

Typed parameter lists from `name|type|description` lines — ideal for API
reference:

{{< params >}}
name|string|The user's display name.
id|string · required|Unique identifier.
roles|string[]|List of role strings. Defaults to `[]`.
{{< /params >}}

## Cards & layout

### Card

A titled block with a markdown body. Pass `href` to make the whole card a link
(it gains a hover state and arrow); pass `icon` for a leading glyph.

{{< card title="Get started in 60 seconds" href="../../getting-started/installation/" icon="rocket" >}}
Install the theme module, point `hugo.toml` at it, and ship your first page.
{{< /card >}}

### Card grid / feature grid

A responsive row of cards — `feature-grid` is an alias of `card-grid` (both
emit `.kt-card-grid`):

{{< feature-grid >}}
{{< card title="Callouts" href="../../examples/callouts/" icon="edit" >}}
Twelve kinds, side by side.
{{< /card >}}
{{< card title="Code & terminal" href="../../examples/code-tabs/" icon="terminal" >}}
Blocks, file tabs, sessions.
{{< /card >}}
{{< card title="Cards" href="../../examples/cards/" icon="grid" >}}
Grids and single cards.
{{< /card >}}
{{< /feature-grid >}}

### Hero

The page-top banner with a gradient highlight word and call-to-action buttons —
see it live on the [home page](../../).

## Inline elements

A badge {{< badge variant="info" >}}new{{< /badge >}}, a tag
{{< tag >}}prerelease{{< /tag >}}, an HTTP method {{< method type="get" >}}
`/users/{id}`, and a button:

<a class="kt-button kt-button--primary" href="../../getting-started/">Get started</a>

A **state** block fills empty or loading areas:

{{< state kind="empty" title="No results" >}}
Try a different search term.
{{< /state >}}

## Page chrome (automatic)

These render themselves from your content and `hugo.toml` — there's no shortcode
to write.

- **Docs shell** (`.kt-docs-shell`) — the three-column layout (sidebar · content · TOC).
- **Breadcrumbs** (`.kt-crumbs`) — the ancestor trail at the top of each page.
- **Top nav** (`.kt-topnav`) — the header nav row, from `[[menu.main]]` in `hugo.toml`.
- **Side nav** (`.kt-sidenav`) — the left rail, built from `content/`.
- **Table of contents** (`.kt-toc`) — the right rail, from the page's `##` / `###` headings.
- **Pagination** (`.kt-docs-pager`) — the prev/next links at the foot of a page.
- **Footer** (`.kt-docs-footer`) — the site footer below the shell.

## Customising

The DOM these emit (classes, nesting, ARIA) is fixed by contract; the look is
fully driven by CSS variables — see the [tokens reference](../tokens/).
