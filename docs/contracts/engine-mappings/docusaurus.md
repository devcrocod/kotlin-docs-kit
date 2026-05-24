# Mapping to Docusaurus

This guide explains how to apply the Kotlin Docs Theme System to a **Docusaurus 3** site. Docusaurus already uses Infima as its CSS framework; we override Infima's custom properties and add our own.

## 1. Files to copy into `static/css/`

```
your-site/
├── static/
│   └── css/
│       ├── colors_and_type.css
│       ├── tokens.css
│       └── components.css
├── static/
│   └── img/
│       ├── kotlin-icon-color.svg
│       ├── kotlin-logo.svg
│       └── kotlin-logo-dark.svg
└── src/
    └── css/
        └── custom.css       # the override file below
```

## 2. `docusaurus.config.js` — wire CSS & logo

```js
module.exports = {
  title: "Your Project Docs",
  themeConfig: {
    navbar: {
      logo: {
        alt: "Kotlin",
        src: "img/kotlin-logo.svg",
        srcDark: "img/kotlin-logo-dark.svg",
      },
      // ...
    },
    colorMode: {
      defaultMode: "light",
      respectPrefersColorScheme: true,
    },
    prism: {
      theme: require("prism-react-renderer/themes/vsLight"),
      darkTheme: require("prism-react-renderer/themes/vsDark"),
      additionalLanguages: ["kotlin", "java", "groovy"],
    },
  },
  presets: [["classic", {
    theme: {
      customCss: [
        require.resolve("./static/css/colors_and_type.css"),
        require.resolve("./static/css/tokens.css"),
        require.resolve("./static/css/components.css"),
        require.resolve("./src/css/custom.css"),
      ],
    },
  }]],
};
```

## 3. `src/css/custom.css` — translate Infima variables

```css
:root {
  --ifm-color-primary:               var(--kt-purple-500);
  --ifm-color-primary-dark:          var(--kt-purple-600);
  --ifm-color-primary-darker:        var(--kt-purple-700);
  --ifm-color-primary-darkest:       var(--kt-purple-800);
  --ifm-color-primary-light:         var(--kt-purple-400);
  --ifm-color-primary-lighter:       var(--kt-purple-300);
  --ifm-color-primary-lightest:      var(--kt-purple-200);

  --ifm-background-color:            var(--surface-0);
  --ifm-background-surface-color:    var(--surface-1);

  --ifm-font-family-base:            "IBM Plex Sans", system-ui, sans-serif;
  --ifm-font-family-monospace:       "JetBrains Mono", monospace;
  --ifm-font-size-base:              var(--type-body-size);
  --ifm-line-height-base:            var(--type-body-line);
  --ifm-heading-font-weight:         600;

  --ifm-code-background:             var(--code-bg);
  --ifm-code-color:                  var(--code-fg);
  --ifm-code-font-size:              var(--type-code-size);
  --ifm-code-border-radius:          var(--radius-sm);

  --ifm-navbar-background-color:     color-mix(in srgb, var(--surface-1) 86%, transparent);
  --ifm-navbar-height:               var(--docs-header-height);
  --ifm-toc-border-color:            var(--border-1);
  --ifm-toc-link-color:              var(--fg-2);
  --ifm-toc-link-color-active:       var(--color-primary);
  --ifm-menu-color-active:           var(--color-primary);
  --ifm-menu-color-background-active: var(--color-primary-soft);

  --ifm-link-color:                  var(--color-link);
  --ifm-link-hover-color:             var(--color-link-hover);

  --ifm-global-radius:               var(--radius-md);
  --ifm-card-border-radius:          var(--radius-lg);
}

[data-theme="dark"] {
  --ifm-color-primary:               var(--kt-purple-400);
  --ifm-color-primary-dark:          var(--kt-purple-500);
  --ifm-color-primary-darker:        var(--kt-purple-600);
  --ifm-color-primary-darkest:       var(--kt-purple-700);
  --ifm-color-primary-light:         var(--kt-purple-300);
  --ifm-color-primary-lighter:       var(--kt-purple-200);
  --ifm-color-primary-lightest:      var(--kt-purple-100);
}
```

Docusaurus already sets `data-theme="dark"` on `<html>` for dark mode — so our token file just works.

## 4. Admonition mapping

Docusaurus uses MDX admonitions: `:::note`, `:::tip`, `:::info`, `:::warning`, `:::danger`. They render as `<div class="theme-admonition theme-admonition-note">`. Add CSS that re-skins them to our callouts:

```css
.theme-admonition {
  border-radius: var(--radius-md);
  border-left: 3px solid;
  padding: 14px 16px;
  margin: 16px 0;
  font-family: var(--font-sans);
  font-size: var(--type-body-size);
}
.theme-admonition-note         { background: var(--color-note-soft);         border-left-color: var(--color-note);         }
.theme-admonition-info         { background: var(--color-info-soft);         border-left-color: var(--color-info);         }
.theme-admonition-tip          { background: var(--color-tip-soft);          border-left-color: var(--color-tip);          }
.theme-admonition-success      { background: var(--color-success-soft);      border-left-color: var(--color-success);      }
.theme-admonition-warning      { background: var(--color-warning-soft);      border-left-color: var(--color-warning);      }
.theme-admonition-caution      { background: var(--color-caution-soft);      border-left-color: var(--color-caution);      }
.theme-admonition-danger       { background: var(--color-danger-soft);       border-left-color: var(--color-danger);       }
.theme-admonition-important    { background: var(--color-important-soft);    border-left-color: var(--color-important);    }
.theme-admonition-quote        { background: var(--color-quote-soft);        border-left-color: var(--color-quote);        }
.theme-admonition-example      { background: var(--color-example-soft);      border-left-color: var(--color-example);      }
.theme-admonition-deprecated   { background: var(--color-deprecated-soft);   border-left-color: var(--color-deprecated);   }
.theme-admonition-experimental { background: var(--color-experimental-soft); border-left-color: var(--color-experimental); }
```

Docusaurus ships note / tip / info / warning / danger out of the box. Register the other seven as custom admonitions in `docusaurus.config.js`:

```js
themeConfig: {
  admonitions: {
    keywords: [
      "success", "caution", "important",
      "quote", "example", "deprecated", "experimental",
    ],
    extendDefaults: true,
  },
},
```

### Full mapping table

| MDX | Callout class | Builtin? |
|---|---|---|
| `:::note`         | `.callout-note`         | ✓ |
| `:::info`         | `.callout-info`         | ✓ |
| `:::tip`          | `.callout-tip`          | ✓ |
| `:::warning`      | `.callout-warning`      | ✓ |
| `:::danger`       | `.callout-danger`       | ✓ |
| `:::success`      | `.callout-success`      | register via `keywords` |
| `:::caution`      | `.callout-caution`      | register via `keywords` |
| `:::important`    | `.callout-important`    | register via `keywords` |
| `:::quote`        | `.callout-quote`        | register via `keywords` |
| `:::example`      | `.callout-example`      | register via `keywords` |
| `:::deprecated`   | `.callout-deprecated`   | register via `keywords` |
| `:::experimental` | `.callout-experimental` | register via `keywords` |

## 5. Code blocks

Docusaurus uses Prism for syntax highlighting via `prism-react-renderer`. Map Prism's token classes to ours in `custom.css`:

```css
.prism-code .token.keyword,
.prism-code .token.builtin   { color: var(--code-keyword); }
.prism-code .token.string    { color: var(--code-string); }
.prism-code .token.number    { color: var(--code-number); }
.prism-code .token.comment   { color: var(--code-comment); font-style: italic; }
.prism-code .token.function  { color: var(--code-function); }
.prism-code .token.class-name,
.prism-code .token.type      { color: var(--code-type); }
.prism-code .token.punctuation { color: var(--code-punctuation); }
```

Re-skin the code block wrapper to match `.codeblock`:

```css
[class^="codeBlockContainer"] {
  background: var(--code-bg) !important;
  border: 1px solid var(--border-1);
  border-radius: var(--radius-lg);
}
[class^="codeBlockTitle"] {
  background: var(--surface-2);
  border-bottom: 1px solid var(--border-1);
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--fg-2);
}
```

For **file tabs** above multiple code blocks, use Docusaurus's built-in `<Tabs>` component and re-style `.tabs__item` to match `.codeblock-tab`.

## 6. Cards on docs homepages

Use plain MDX with our `.card-grid` + `.k-card`:

```mdx
<div className="card-grid">
  <a className="k-card is-hoverable" href="/quickstart">
    <div className="card-icon">⚡</div>
    <h3 className="card-title">Quickstart</h3>
    <p className="card-body">Get a Kotlin server running in 5 minutes.</p>
  </a>
</div>
```

## 7. Done

Build & serve:

```bash
npm run start
```

Check: navbar shows the Kotlin wordmark, sidebar items have purple-soft backgrounds when active, admonitions look like our six callouts, and code blocks render in JetBrains Mono with Kotlin-keyword purple highlighting.
