---
title: 'Setup'
description: 'Install and configure the theme — exercises single.md and the per-page MD twin.'
weight: 10
params:
  related:
    - '/guides/advanced/tuning/'
    - '/next/'
---

## Steps

Install the module, point `hugo.toml` at it, and build.

```toml {title="hugo.toml"}
[[module.imports]]
  path = "github.com/devcrocod/kotlin-docs-kit/packages/hugo"
```

{{< accordion-group >}}
{{< accordion title="Why does the module fail to resolve?" >}}
Run `hugo mod tidy` — the fixture uses a local `replace`, published sites resolve via the Go proxy.
{{< /accordion >}}
{{< accordion title="Where do the styles come from?" open="true" >}}
From `@ktdocs/tokens`, rsynced into `assets/css/` by the Taskfile.
{{< /accordion >}}
{{< /accordion-group >}}
