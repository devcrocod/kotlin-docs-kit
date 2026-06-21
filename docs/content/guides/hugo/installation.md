---
title: Installation
sidebar_position: 1
---

# Hugo · Installation

The kit ships as a Hugo Module at `github.com/devcrocod/kotlin-docs-kit/packages/hugo`. Module mode (the default since Hugo 0.50) handles distribution — no manual checkout or git submodule needed.

## Requirements

- Hugo extended 0.110 or newer
- Go 1.21 or newer (for module fetching only — your site itself doesn't need Go)

Verify your Hugo install:

```bash
hugo version
# hugo v0.123.0+extended ...
```

## Create a site

```bash
hugo new site my-docs
cd my-docs
hugo mod init github.com/your-org/my-docs
```

## Add the kit

In `hugo.toml`:

```toml
baseURL = "https://example.org/"
title   = "My docs"
theme   = ["kotlin-docs-hugo"]

[module]
  [[module.imports]]
    path = "github.com/devcrocod/kotlin-docs-kit/packages/hugo"

[markup]
  [markup.highlight]
    noClasses = false           # we use class-based highlighting → .kt-tok-*
    style = "github"            # placeholder; remapped by the kit's chroma.css

  [markup.goldmark.renderer]
    unsafe = true               # required for some Hugo shortcodes to emit raw HTML
```

Fetch the module:

```bash
hugo mod get github.com/devcrocod/kotlin-docs-kit/packages/hugo
```

## Run a dev server

```bash
hugo server
```

Visit `http://localhost:1313/`. Drop content under `content/`:

```bash
hugo new content/_index.md
hugo new content/getting-started/installation.md
```

## Author content with kit shortcodes

```markdown
{{< callout type="tip" title="Heads up" >}}
Hugo shortcodes for the kit live under `layouts/shortcodes/` in the module.
{{< /callout >}}

{{< code-tabs >}}
{{< code-tab name="Kotlin" lang="kotlin" >}}
fun main() = println("hi")
{{< /code-tab >}}
{{< /code-tabs >}}
```

## Next

- [Configuration](./configuration.md) — site config, menus, params
- [Customization](./customization.md) — CSS overrides, layout overrides
- [Deploy](./deploy.md) — GitHub Pages and other hosts
