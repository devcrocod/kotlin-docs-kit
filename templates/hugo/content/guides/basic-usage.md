---
title: Basic usage
description: Authoring tour — pages, callouts, code tabs, content tabs, cards, parameter tables.
weight: 10
---

The starter is engine-idiomatic Hugo — anything that works in Hugo works
here, plus 14 shortcodes for the components that have no native syntax.
This page is a fast tour; for the visual spec see the
[components reference](../../reference/components/).

## Pages and navigation

Drop files under `content/` and add menu entries to `hugo.toml`. Section
landing pages use `_index.md`:

```toml
[[menu.main]]
  name = "Guides"
  url = "/guides/"
  weight = 30
```

```
content/
├── _index.md                   # Home
└── guides/
    ├── _index.md               # /guides/
    ├── basic-usage.md
    └── customization.md
```

## Callouts

All 12 callout kinds come from a single `callout` shortcode — pass `type`
to pick the variant. Standard kinds plus the kit's extras (`caution`,
`important`, `quote`, `example`, `deprecated`, `experimental`):

```markdown
{{</* callout type="tip" title="Pro tip" */>}}
Press <kbd>⌘</kbd>+<kbd>K</kbd> to focus the search input.
{{</* /callout */>}}

{{</* callout type="deprecated" title="Going away in v2" */>}}
This API will be removed. Migrate to `newApi()`.
{{</* /callout */>}}
```

{{< callout type="note" >}}
A bare note with no title.
{{< /callout >}}

{{< callout type="tip" title="Pro tip" >}}
Press <kbd>⌘</kbd>+<kbd>K</kbd> to focus the search input.
{{< /callout >}}

{{< callout type="warning" title="Watch out" >}}
`hugo --minify` will not fail on broken internal links by itself — pair it
with [`htmltest`](https://github.com/wjdp/htmltest) in CI for that.
{{< /callout >}}

{{< callout type="deprecated" title="Going away in v2" >}}
This helper will be removed once we ship the typed API.
{{< /callout >}}

## Code blocks

Fenced blocks render as **premium code blocks** with copy button, language
label and line numbers — Chroma classes are remapped onto the kit's 8
`--kt-tok-*` palette tokens, so highlighting stays on-palette in both light
and dark mode:

```kotlin
fun greet(name: String) = println("Hello, $name")
```

For multi-file file-tabbed code blocks, wrap with `code-tabs`:

```markdown
{{</* code-tabs */>}}
{{</* code-tab title="build.gradle.kts" lang="kotlin" */>}}
plugins {
kotlin("jvm") version "2.0.0"
}
{{</* /code-tab */>}}
{{</* code-tab title="settings.gradle.kts" lang="kotlin" */>}}
rootProject.name = "my-app"
{{</* /code-tab */>}}
{{</* /code-tabs */>}}
```

{{< code-tabs >}}
{{< code-tab title="build.gradle.kts" lang="kotlin" >}}
plugins {
kotlin("jvm") version "2.0.0"
}
{{< /code-tab >}}
{{< code-tab title="settings.gradle.kts" lang="kotlin" >}}
rootProject.name = "my-app"
{{< /code-tab >}}
{{< /code-tabs >}}

## Content tabs

A separate `tabs` shortcode renders content tabs (visually distinct from
code tabs):

```markdown
{{</* tabs */>}}
{{</* tab title="macOS" */>}}
Use Homebrew: `brew install hugo`.
{{</* /tab */>}}
{{</* tab title="Linux" */>}}
Use your distro's package manager.
{{</* /tab */>}}
{{</* tab title="Windows" */>}}
Use Scoop or winget.
{{</* /tab */>}}
{{</* /tabs */>}}
```

{{< tabs >}}
{{< tab title="macOS" >}}
Use Homebrew: `brew install hugo`.
{{< /tab >}}
{{< tab title="Linux" >}}
Use your distro's package manager.
{{< /tab >}}
{{< tab title="Windows" >}}
Use Scoop or winget.
{{< /tab >}}
{{< /tabs >}}

## Parameter tables

For typed parameter lists, the `params` shortcode reads `name|type|desc`
lines:

```markdown
{{</* params */>}}
timeout|number · ms|Request timeout. Defaults to 30000.
retries|integer|How many times to retry on 5xx.
{{</* /params */>}}
```

{{< params >}}
timeout|number · ms|Request timeout. Defaults to 30000.
retries|integer|How many times to retry on 5xx.
{{< /params >}}

## Cards, hero, feature grid

```markdown
{{</* card-grid */>}}
{{</* card title="Quickstart" href="/getting-started/installation/" */>}}
Install and ship your first page.
{{</* /card */>}}
{{</* card title="Customise" href="/guides/customization/" */>}}
CSS variable overrides, logo swap.
{{</* /card */>}}
{{</* /card-grid */>}}
```

See the [cards example](../../examples/cards/) for hero, feature-grid and
single-card variants.
