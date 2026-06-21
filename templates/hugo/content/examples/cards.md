---
title: Cards & feature grids
description: Single cards, card grids, hero variants.
weight: 30
---

Cards and feature grids are first-class shortcodes — pass `title`, `href`
and a body. The body is markdown-rendered, so links and inline formatting
work inside.

## Feature grid

A row of hoverable cards — same DOM as the `card-grid` on the home page.

{{< feature-grid >}}
{{< card title="Author guide" href="../../guides/basic-usage/" >}}
Callouts, code tabs, content tabs, parameter tables.
{{< /card >}}
{{< card title="Customise" href="../../guides/customization/" >}}
CSS variable overrides, logo swap.
{{< /card >}}
{{< card title="Deploy" href="../../getting-started/deploy/" >}}
Ship to GitHub Pages on every push.
{{< /card >}}
{{< card title="Tokens" href="../../reference/tokens/" >}}
All `--kt-*` variables, in one table.
{{< /card >}}
{{< card title="Components" href="../../reference/components/" >}}
16 BEM groups shared across engines.
{{< /card >}}
{{< card title="Callouts" href="../callouts/" >}}
12 variants — note, tip, warning, danger, deprecated, …
{{< /card >}}
{{< /feature-grid >}}

## Single card

A standalone card outside a grid uses the same `card` shortcode:

{{< card title="Get started in 60 seconds" href="../../getting-started/installation/" >}}
Install the theme module, point `hugo.toml` at it, and ship your first page.
{{< /card >}}

## Source

```markdown
{{</* card-grid */>}}
{{</* card title="Title" href="/somewhere/" */>}}
Body text. **Markdown** works.
{{</* /card */>}}
{{</* card title="Another" href="/elsewhere/" */>}}
Another card body.
{{</* /card */>}}
{{</* /card-grid */>}}
```

Pass `href` to make the whole card a link (and apply `kt-card--hoverable`
automatically); omit it for a static card. `feature-grid` is an alias of
`card-grid` — both emit `.kt-card-grid`.
