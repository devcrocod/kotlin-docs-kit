# Mapping to MkDocs (Material)

This guide explains how to apply the Kotlin Docs Theme System to a **MkDocs** site, with or without the Material theme. The system is delivered as four CSS files; you load them as `extra_css` and override Material's default custom properties.

## 1. Files to copy into `docs/assets/`

```
docs/
└── assets/
    ├── kotlin-icon-color.svg
    ├── kotlin-logo.svg
    ├── kotlin-logo-dark.svg
    ├── colors_and_type.css
    ├── tokens.css
    └── components.css
```

## 2. `mkdocs.yml` — load CSS, configure logo & palette

```yaml
site_name: Your Project Docs
theme:
  name: material
  logo: assets/kotlin-icon-color.svg
  favicon: assets/kotlin-icon-color.svg
  font: false                          # disable Google Fonts; our CSS imports its own
  features:
    - navigation.tabs
    - navigation.sections
    - navigation.indexes
    - navigation.top
    - content.code.copy
    - content.code.annotate
    - search.suggest
  palette:
    - media: "(prefers-color-scheme: light)"
      scheme: default
      toggle: { icon: material/weather-night, name: "Switch to dark mode" }
    - media: "(prefers-color-scheme: dark)"
      scheme: slate
      toggle: { icon: material/weather-sunny, name: "Switch to light mode" }

extra_css:
  - assets/colors_and_type.css
  - assets/tokens.css
  - assets/components.css
  - assets/mkdocs-overrides.css        # the small file below
```

## 3. `mkdocs-overrides.css` — re-map Material variables to our tokens

Material uses its own custom-property names (`--md-primary-fg-color`, etc.). This file translates ours into theirs so Material's components render in our palette without us touching its CSS.

```css
:root,
[data-md-color-scheme="default"] {
  --md-primary-fg-color:        var(--kt-purple-500);
  --md-primary-fg-color--light:  var(--kt-purple-400);
  --md-primary-fg-color--dark:   var(--kt-purple-700);
  --md-accent-fg-color:         var(--kt-pink-500);

  --md-default-bg-color:        var(--surface-0);
  --md-default-fg-color:        var(--fg-1);
  --md-default-fg-color--light: var(--fg-2);
  --md-default-fg-color--lighter: var(--fg-3);

  --md-code-bg-color:           var(--code-bg);
  --md-code-fg-color:           var(--code-fg);
  --md-code-hl-keyword-color:   var(--code-keyword);
  --md-code-hl-string-color:    var(--code-string);
  --md-code-hl-number-color:    var(--code-number);
  --md-code-hl-comment-color:   var(--code-comment);
  --md-code-hl-function-color:  var(--code-function);

  --md-text-font:               "IBM Plex Sans", sans-serif;
  --md-code-font:               "JetBrains Mono", monospace;
}

[data-md-color-scheme="slate"] {
  /* token file already swaps on [data-theme="dark"] — propagate Material's switch */
  &:root { color-scheme: dark; }
}
```

Add this snippet to your root layout (or the `extra_javascript`) so Material's theme toggle also flips our tokens:

```html
<script>
  // Sync Material's [data-md-color-scheme] with our [data-theme]
  const sync = () => {
    const scheme = document.documentElement.getAttribute("data-md-color-scheme");
    document.documentElement.setAttribute("data-theme", scheme === "slate" ? "dark" : "light");
  };
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ["data-md-color-scheme"] });
  sync();
</script>
```

## 4. Admonition mapping

Material/MkDocs admonitions emit `<div class="admonition note">`. Map them to our `.callout-*` classes via CSS — no Markdown rewriting needed.

```css
.md-typeset .admonition.note,
.md-typeset details.note         { /* re-style with .callout-note rules */ }
.md-typeset .admonition.info,
.md-typeset .admonition.abstract { /* .callout-info */ }
.md-typeset .admonition.tip,
.md-typeset .admonition.hint     { /* .callout-tip */ }
.md-typeset .admonition.success,
.md-typeset .admonition.check,
.md-typeset .admonition.done     { /* .callout-success */ }
.md-typeset .admonition.warning,
.md-typeset .admonition.attention { /* .callout-warning */ }
.md-typeset .admonition.caution  { /* .callout-caution */ }
.md-typeset .admonition.danger,
.md-typeset .admonition.failure,
.md-typeset .admonition.bug      { /* .callout-danger */ }
.md-typeset .admonition.important { /* .callout-important */ }
.md-typeset .admonition.quote,
.md-typeset .admonition.cite     { /* .callout-quote */ }
.md-typeset .admonition.example  { /* .callout-example */ }
.md-typeset .admonition.deprecated { /* .callout-deprecated — custom type */ }
.md-typeset .admonition.experimental { /* .callout-experimental — custom type */ }
```

For the **deprecated** and **experimental** kinds, register custom admonition types in `mkdocs.yml`:

```yaml
markdown_extensions:
  - admonition
  - pymdownx.details
  - pymdownx.superfences
  - attr_list
```

Then add to your CSS:

```css
:root {
  --md-admonition-icon--deprecated:   url('data:image/svg+xml;charset=utf-8,<svg…ban-circle…>');
  --md-admonition-icon--experimental: url('data:image/svg+xml;charset=utf-8,<svg…flask…>');
}
.md-typeset .admonition.deprecated > .admonition-title::before,
.md-typeset details.deprecated > summary::before
  { background-color: var(--color-deprecated); mask-image: var(--md-admonition-icon--deprecated); }
```

### Full mapping table

| Markdown | Callout class |
|---|---|
| `!!! note`        | `.callout-note` |
| `!!! info` / `!!! abstract` | `.callout-info` |
| `!!! tip` / `!!! hint` | `.callout-tip` |
| `!!! success` / `!!! check` / `!!! done` | `.callout-success` |
| `!!! warning` / `!!! attention` | `.callout-warning` |
| `!!! caution`     | `.callout-caution` |
| `!!! danger` / `!!! failure` / `!!! bug` | `.callout-danger` |
| `!!! important`   | `.callout-important` |
| `!!! quote` / `!!! cite` | `.callout-quote` |
| `!!! example`     | `.callout-example` |
| `!!! deprecated`  | `.callout-deprecated` *(custom — register in CSS)* |
| `!!! experimental`| `.callout-experimental` *(custom — register in CSS)* |

## 5. Code blocks

Material wraps fenced code in `<div class="highlight"><pre>...`. Add a tiny CSS shim:

```css
.md-typeset .highlight {
  /* extend our .codeblock styles */
  background: var(--code-bg);
  border: 1px solid var(--border-1);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.md-typeset .highlight > pre {
  margin: 0;
  padding: 16px 18px;
  background: transparent;
  font-family: var(--font-mono);
  font-size: var(--type-code-size);
}
```

For **file tabs** above multiple code blocks, Material's `pymdownx.tabbed` is the canonical way:

```markdown
=== "Kotlin"
    ```kotlin
    fun main() = println("Hello")
    ```
=== "Java"
    ```java
    System.out.println("Hello");
    ```
```

Restyle `.tabbed-set` and `.tabbed-content` to match `.codeblock-tabs` / `.codeblock-tab`.

## 6. Search

Keep MkDocs Material's built-in search. Style its `.md-search__input` to look like our `.docs-search` class:

```css
.md-search__form {
  background: var(--surface-1);
  border: 1px solid var(--border-1);
  border-radius: var(--radius-md);
  height: 36px;
}
```

## 7. Done

Build & serve:

```bash
mkdocs serve
```

Verify the K-mark renders, that primary buttons are Kotlin purple, that admonitions show our six callout styles, and that fenced code uses JetBrains Mono.
