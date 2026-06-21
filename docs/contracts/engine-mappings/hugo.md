# Mapping to Hugo

Hugo is template-driven (Go templates) rather than configuration-driven, so we wire the design system in by overriding the **baseof** layout and a few partials. Works with the Doks, Geekdoc, or any standard Hugo theme — and equally well as a from-scratch theme.

## 1. Files to copy into `assets/css/` and `static/img/`

```
your-site/
├── assets/
│   └── css/
│       ├── colors_and_type.css
│       ├── tokens.css
│       └── components.css
├── static/
│   └── img/
│       ├── kotlin-icon-color.svg
│       ├── kotlin-logo.svg
│       └── kotlin-logo-dark.svg
└── layouts/
    ├── _default/
    │   ├── baseof.html
    │   ├── single.html
    │   └── list.html
    └── partials/
        ├── head.html
        ├── header.html
        ├── sidebar.html
        ├── toc.html
        ├── footer.html
        └── callout.html
```

## 2. `layouts/partials/head.html` — load CSS

```go-html-template
{{ $colors := resources.Get "css/colors_and_type.css" }}
{{ $tokens := resources.Get "css/tokens.css" }}
{{ $components := resources.Get "css/components.css" }}
{{ $bundle := slice $colors $tokens $components | resources.Concat "css/bundle.css" | resources.Minify | resources.Fingerprint }}

<link rel="stylesheet" href="{{ $bundle.RelPermalink }}" integrity="{{ $bundle.Data.Integrity }}">
<link rel="icon" href="/img/kotlin-icon-color.svg" type="image/svg+xml">
```

## 3. `layouts/_default/baseof.html` — 3-column shell

```go-html-template
<!doctype html>
<html lang="{{ .Site.LanguageCode }}" data-theme="light">
  <head>
    {{ partial "head.html" . }}
    <title>{{ .Title }} · {{ .Site.Title }}</title>
  </head>
  <body>
    {{ partial "header.html" . }}
    <div class="docs-shell">
      <aside class="docs-shell-side">{{ partial "sidebar.html" . }}</aside>
      <main class="docs-shell-main">
        <article class="docs-article">{{ block "main" . }}{{ end }}</article>
      </main>
      <aside class="docs-shell-toc">{{ partial "toc.html" . }}</aside>
    </div>
    {{ partial "footer.html" . }}
  </body>
</html>
```

## 4. `layouts/partials/header.html` — top nav

```go-html-template
<header class="topnav">
  <a class="brand" href="{{ "/" | relURL }}">
    <img src="/img/kotlin-icon-color.svg" width="28" height="28" alt="">
    <span class="brand-name">{{ .Site.Title }}</span>
    <span class="nav-version">v{{ .Site.Params.version }}</span>
  </a>
  <nav class="navlinks">
    {{ range .Site.Menus.main }}
      <a class="navlink {{ if $.IsMenuCurrent "main" . }}is-active{{ end }}" href="{{ .URL }}">{{ .Name }}</a>
    {{ end }}
  </nav>
  <div class="nav-right">
    <div class="docs-search" style="width: 280px;">
      <svg class="ds-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
      <span class="ds-text">Search…</span>
      <span class="ds-kbd">⌘K</span>
    </div>
    <button class="icon-btn" id="theme-toggle">🌗</button>
  </div>
</header>
```

## 5. `layouts/partials/sidebar.html` — section list

```go-html-template
<nav class="sidenav">
  {{ range .Site.Sections }}
    <div class="sidenav-section">
      <div class="sec-label">{{ .Title }}</div>
      {{ range .Pages }}
        <a class="sidenav-item {{ if eq $.RelPermalink .RelPermalink }}is-active{{ end }}" href="{{ .RelPermalink }}">{{ .Title }}</a>
      {{ end }}
    </div>
  {{ end }}
</nav>
```

## 6. `layouts/partials/toc.html` — on-this-page

```go-html-template
<nav class="toc">
  <div class="toc-label">On this page</div>
  {{ .TableOfContents }}
</nav>
```

Re-style Hugo's `.TableOfContents` `<ul>` to match `.toc-item`:

```css
.toc nav#TableOfContents ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.toc nav#TableOfContents > ul > li > a {
  /* .toc-item */
}
.toc nav#TableOfContents ul ul > li > a {
  /* .toc-item.is-nested */
}
```

## 7. Admonition mapping — custom Hugo shortcode

Hugo doesn't have built-in admonitions, but `layouts/shortcodes/callout.html` plugs the gap. Add this file:

```go-html-template
{{- $kind := .Get "type" | default "note" -}}
{{- $title := .Get "title" -}}
<div class="callout callout-{{ $kind }}">
  <svg class="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    {{- if   eq $kind "info"         -}}<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
    {{- else if eq $kind "tip"       -}}<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 1 7 7c0 3-2 5-3 6.5V18H8v-2.5C7 14 5 12 5 9a7 7 0 0 1 7-7z"/>
    {{- else if eq $kind "success"   -}}<path d="M20 6 9 17l-5-5"/>
    {{- else if eq $kind "warning"   -}}<path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
    {{- else if eq $kind "caution"   -}}<circle cx="12" cy="12" r="10"/><path d="M12 9v4"/><path d="M12 17h.01"/>
    {{- else if eq $kind "danger"    -}}<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
    {{- else if eq $kind "important" -}}<path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/><path d="M12 8v4"/><path d="M12 16h.01"/>
    {{- else if eq $kind "quote"     -}}<path d="M3 21c3-1 5-3 5-6V8H4v7h4"/><path d="M15 21c3-1 5-3 5-6V8h-4v7h4"/>
    {{- else if eq $kind "example"   -}}<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    {{- else if eq $kind "deprecated"-}}<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    {{- else if eq $kind "experimental" -}}<path d="M9 2v6L3.5 18a2.5 2.5 0 0 0 2 4h13a2.5 2.5 0 0 0 2-4L15 8V2"/><path d="M7 2h10"/><path d="M7 16h10"/>
    {{- else -}}<path d="M3 5h18"/><path d="M3 12h18"/><path d="M3 19h12"/>
    {{- end -}}
  </svg>
  <div>
    {{- if $title }}<strong class="callout-title">{{ $title }}</strong>{{ end -}}
    {{ .Inner | markdownify }}
  </div>
</div>
```

Use in Markdown:

```markdown
{{</* callout type="tip" title="Pro tip" */>}}
You can pass `--watch` to rebuild on save.
{{</* /callout */>}}
```

### Supported `type` values

All 12 callout kinds:

| `type=`          | Callout class           |
| ---------------- | ----------------------- |
| `note` (default) | `.callout-note`         |
| `info`           | `.callout-info`         |
| `tip`            | `.callout-tip`          |
| `success`        | `.callout-success`      |
| `warning`        | `.callout-warning`      |
| `caution`        | `.callout-caution`      |
| `danger`         | `.callout-danger`       |
| `important`      | `.callout-important`    |
| `quote`          | `.callout-quote`        |
| `example`        | `.callout-example`      |
| `deprecated`     | `.callout-deprecated`   |
| `experimental`   | `.callout-experimental` |

## 8. Code blocks

Hugo uses Chroma for syntax highlighting. Generate a Chroma stylesheet once and replace its token colors with ours:

```bash
hugo gen chromastyles --style=onedark > assets/css/chroma.css
```

Then edit `chroma.css` and re-map:

```css
.chroma .k,
.chroma .kd,
.chroma .kt {
  color: var(--code-keyword);
  font-weight: 500;
}
.chroma .s,
.chroma .s1,
.chroma .s2 {
  color: var(--code-string);
}
.chroma .m,
.chroma .mi,
.chroma .mf {
  color: var(--code-number);
}
.chroma .c,
.chroma .c1,
.chroma .cm {
  color: var(--code-comment);
  font-style: italic;
}
.chroma .nf,
.chroma .nb {
  color: var(--code-function);
}
.chroma .nc,
.chroma .nn {
  color: var(--code-type);
}
.chroma .p {
  color: var(--code-punctuation);
}
```

Wrap Chroma's `<pre class="chroma">` in our `.codeblock`:

```go-html-template
<div class="codeblock">
  <div class="codeblock-header">
    <span class="codeblock-lang">{{ .Get "lang" }}</span>
    <div class="codeblock-actions">
      <button class="action-btn" data-copy>copy</button>
    </div>
  </div>
  {{ highlight (trim .Inner "\n") (.Get "lang") "linenos=table,style=github" }}
</div>
```

For multi-file tabs, write a `tabs` shortcode that emits `.codeblock-tabs` and `.codeblock-tab` markup.

## 9. Theme toggle

Add to `static/js/theme.js` and include in `head.html`:

```js
const root = document.documentElement;
const saved = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
root.setAttribute('data-theme', saved);
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});
```

## 10. Done

Build:

```bash
hugo server -D
```

Check: header has Kotlin wordmark + version pill, sidebar uses purple-soft active background, `{{</* callout */>}}` shortcodes render the six callout colors, Chroma uses JetBrains Mono with Kotlin-purple keywords.
