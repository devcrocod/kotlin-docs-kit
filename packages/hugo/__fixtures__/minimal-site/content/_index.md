---
title: 'Welcome'
description: 'kotlin-docs-hugo smoke fixture exercising every shortcode.'
---

{{< hero title="Kotlin docs in Hugo" gradient="docs" subtitle="Smoke fixture for the engine package." >}}
[Get started](#install) · [GitHub](https://github.com/devcrocod/kotlin-docs-kit)
{{< /hero >}}

## Install

{{< card-grid >}}
{{< card title="Docusaurus" href="/docusaurus" >}}React preset.{{< /card >}}
{{< card title="Hugo" href="/hugo" >}}This package.{{< /card >}}
{{< /card-grid >}}

## Features

{{< feature-grid cols="3" >}}
{{< card title="Fast" >}}Built on Hugo Pipes.{{< /card >}}
{{< card title="Themed" >}}kt-* BEM contract.{{< /card >}}
{{< card title="Searchable" >}}Pagefind index.{{< /card >}}
{{< /feature-grid >}}

## Callouts

{{< callout type="tip" title="Pro tip" >}}
You can pass `--watch` to rebuild on save.
{{< /callout >}}

{{< callout type="warning" >}}
Don't run this in production without testing.
{{< /callout >}}

## Code

{{< code-tabs >}}
{{< code-tab title="build.gradle.kts" lang="kotlin" >}}
plugins {
kotlin("jvm") version "2.0.0"
}

fun main() {
println("Hello, Hugo!")
}
{{< /code-tab >}}
{{< code-tab title="settings.gradle.kts" lang="kotlin" >}}
rootProject.name = "kt-test"
{{< /code-tab >}}
{{< /code-tabs >}}

## Content tabs

{{< tabs >}}
{{< tab title="Kotlin" >}}

```kotlin
fun greet(name: String) = "Hello, $name"
```

{{< /tab >}}
{{< tab title="Java" >}}

```java
String greet(String name) { return "Hello, " + name; }
```

{{< /tab >}}
{{< /tabs >}}

## Tags and methods

A status: {{< badge variant="success" >}}stable{{< /badge >}} and an HTTP method:
{{< method type="get" >}}.

## Controls

{{< pill variant="primary" >}}Follow{{< /pill >}} {{< pill >}}All{{< /pill >}}

{{< toggle on="true" >}}Wrap lines{{< /toggle >}}

{{< segmented options="Preview, Code" active="0" label="View" >}}

## Parameters

{{< params >}}
timeout|number · ms|Request timeout. Defaults to 30000.
retries|integer|How many times to retry on 5xx.
{{< /params >}}

## State

{{< state kind="empty" title="No results" >}}
Try a different search term.
{{< /state >}}
