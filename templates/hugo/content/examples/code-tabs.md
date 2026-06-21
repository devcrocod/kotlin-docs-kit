---
title: Code & terminal blocks
description: Premium code block, file tabs, terminal session.
weight: 20
---

The kit's premium code block ships with a copy button, language label, file
tabs (via `code-tabs`) and 8 syntax colours mapped onto `--kt-tok-*`.

## Plain code block

```kotlin
fun greet(name: String) {
    val message = "Hello, $name"
    println(message)
}

fun main() = greet("Kotlin")
```

## Code tabs (multi-language)

{{< code-tabs >}}
{{< code-tab title="Kotlin" lang="kotlin" >}}
data class User(val id: Int, val name: String)

fun greet(user: User) = println("Hello, ${user.name}")
{{< /code-tab >}}
{{< code-tab title="Java" lang="java" >}}
public record User(int id, String name) { }

public static void greet(User user) {
System.out.println("Hello, " + user.name());
}
{{< /code-tab >}}
{{< code-tab title="Swift" lang="swift" >}}
struct User { let id: Int; let name: String }

func greet(\_ user: User) {
print("Hello, \(user.name)")
}
{{< /code-tab >}}
{{< /code-tabs >}}

## Terminal session

The kit styles bash blocks with a terminal vibe — prompt, comment, and
output colours from the same `--kt-tok-*` palette:

```bash
# install the kit's theme
hugo mod get github.com/devcrocod/kotlin-docs-kit/packages/hugo@latest

# run the dev server
hugo server
```

## Inline code

Inline `code` uses JetBrains Mono and the syntax tokens. Combine with the
HTTP method shortcode for endpoint pills:
{{< method type="get" >}} `/users/{id}`.

## Source

```markdown
{{</* code-tabs */>}}
{{</* code-tab title="Kotlin" lang="kotlin" */>}}
fun main() = println("Hello")
{{</* /code-tab */>}}
{{</* code-tab title="Java" lang="java" */>}}
System.out.println("Hello");
{{</* /code-tab */>}}
{{</* /code-tabs */>}}
```
