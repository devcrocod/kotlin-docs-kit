---
title: Callouts
description: All 12 callout kinds rendered side by side.
weight: 10
---

The theme exposes one `callout` shortcode with 12 `type` values. Below —
all of them.

{{< callout type="note" title="Note" >}}
Use for neutral asides — context that's nice to know but not critical.
{{< /callout >}}

{{< callout type="info" title="Info" >}}
A blue-tinted variant for purely informational content.
{{< /callout >}}

{{< callout type="tip" title="Tip" >}}
Press <kbd>⌘</kbd>+<kbd>K</kbd> to focus the search input.
{{< /callout >}}

{{< callout type="success" title="Success" >}}
All migrations completed without rollback.
{{< /callout >}}

{{< callout type="warning" title="Warning" >}}
Pair `hugo --minify` with a link checker in CI.
{{< /callout >}}

{{< callout type="caution" title="Caution" >}}
Running this destroys the database — there is no undo.
{{< /callout >}}

{{< callout type="danger" title="Danger" >}}
Hardcoded credentials are committed to history.
{{< /callout >}}

{{< callout type="important" title="Important" >}}
Bump the major version when changing the public API.
{{< /callout >}}

{{< callout type="quote" title="Quote" >}}
"Simplicity is a great virtue but it requires hard work to achieve it." — Edsger Dijkstra
{{< /callout >}}

{{< callout type="example" title="Example" >}}
Below is a worked example you can copy into your own project.
{{< /callout >}}

{{< callout type="deprecated" title="Deprecated" >}}
`oldHelper()` is going away in v2. Migrate to `newHelper()`.
{{< /callout >}}

{{< callout type="experimental" title="Experimental" >}}
This API is unstable. Expect breaking changes before v1.
{{< /callout >}}

## Source

```markdown
{{</* callout type="note" title="Note" */>}}
Use for neutral asides.
{{</* /callout */>}}

{{</* callout type="deprecated" title="Deprecated" */>}}
`oldHelper()` is going away in v2.
{{</* /callout */>}}
```

Both standard and Kotlin-extras (`caution`, `important`, `quote`,
`example`, `deprecated`, `experimental`) are emitted by the same shortcode
— `type` selects the variant.
