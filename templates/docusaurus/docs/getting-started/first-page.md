---
title: Your first page
description: Add a new MDX page, register it in the sidebar, link from the home.
---

# Your first page

A page in this starter is one `.md` or `.mdx` file under `docs/`, plus an
entry in `sidebars.ts`. That's it.

## Create the file

```bash
mkdir -p docs/guides
touch docs/guides/hello.md
```

Add frontmatter and content:

````markdown
---
title: Hello, Kotlin
description: My first page in the starter.
---

# Hello, Kotlin

Plain markdown — headings, lists, links, fenced code blocks.

```kotlin
fun main() = println("Hello, Kotlin")
```
````

## Register it in the sidebar

`sidebars.ts` controls the left rail. Add the new id:

```ts
const sidebars: SidebarsConfig = {
  default: [
    'intro',
    {
      type: 'category',
      label: 'Guides',
      items: ['guides/basic-usage', 'guides/customization', 'guides/hello'],
    },
  ],
};
```

The id is the file path under `docs/`, sans extension.

## Cross-link

From any markdown file, reference another page by relative path. Docusaurus
resolves the link and warns at build time if it's broken:

```markdown
See the [author guide](../guides/basic-usage.mdx) for more.
```

## Use MDX components

Rename the file `.mdx` and you can mix React components into prose. The
preset exposes the kit's component set globally — no `import` required:

```mdx
---
title: API reference
---

# API reference

<Callout type="important" title="Required reading">
  Bump the major version when changing the public API.
</Callout>

<Params
  items={[
    { name: 'timeout', type: 'number · ms', required: true, description: 'Request timeout.' },
    { name: 'retry', type: 'number', description: 'Retries on transient failure.' },
  ]}
/>
```

See the [components reference](../reference/components.mdx) for the full
authoring surface.

## Restart not required

`pnpm start` rebuilds on save — your new page shows up in the sidebar as
soon as you save `sidebars.ts`.
