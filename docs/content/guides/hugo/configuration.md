---
title: Configuration
sidebar_position: 2
---

# Hugo · Configuration

All knobs are plain Hugo config. The kit only adds a few new params under `[params]`.

## Site identity

```toml
baseURL    = "https://example.org/"
languageCode = "en-us"
title      = "My docs"
description = "Documentation for My project"
copyright  = "Copyright © 2025 Your Org"

[params]
  brandName = "My project"
  repoURL   = "https://github.com/your-org/my-project"
  editURL   = "https://github.com/your-org/my-project/edit/main/content/"
```

## Top navigation

```toml
[menu]
  [[menu.main]]
    name = "Docs"
    url  = "/"
    weight = 1
  [[menu.main]]
    name = "Reference"
    url  = "/reference/"
    weight = 2
  [[menu.main]]
    name = "GitHub"
    url  = "https://github.com/your-org/my-project"
    weight = 99
```

## Sidenav

The kit's `sidebar.html` partial walks `Site.Sections` automatically. For finer control, set `weight` and `cascade` on section index pages:

```yaml
# content/guides/_index.md
---
title: Guides
weight: 10
cascade:
  type: docs
---
```

## Markup

```toml
[markup]
  [markup.highlight]
    noClasses = false           # class-based highlight (required)
    lineNos = false             # toggled per-fenced-block via `{linenos=table}`

  [markup.goldmark.renderer]
    unsafe = true               # let kit shortcodes emit raw HTML

  [markup.tableOfContents]
    startLevel = 2
    endLevel   = 4
```

## Build options

```toml
[build]
  writeStats = true

[outputs]
  home    = ["HTML", "RSS"]
  section = ["HTML", "RSS"]
  page    = ["HTML"]
```

## Search

The kit does not bundle a search backend. For client-side search, [Pagefind](https://pagefind.app/) is the lowest-friction option — it indexes the built site after `hugo` runs. The kit's topnav partial already includes a search input slot that you can wire up with Pagefind's UI.
