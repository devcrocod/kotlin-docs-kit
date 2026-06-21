---
title: Versioning
sidebar_position: 6
---

# Docusaurus · Versioning

Versioning is plain Docusaurus — the kit does not change how it works. It only **styles** the versioning UI so the banner, badge, and version dropdown match the rest of your site.

## Cut a version

When you're ready to freeze the current docs as a release:

```bash
pnpm docusaurus docs:version 1.0
```

This snapshots `docs/` into `versioned_docs/version-1.0/`, writes `versioned_sidebars/`, and adds `1.0` to `versions.json`. The live `docs/` folder becomes the "next" (unreleased) version.

## Wire up the navbar dropdown

Add a `docsVersionDropdown` item so readers can switch versions:

```ts
themeConfig: {
  navbar: {
    items: [
      { type: 'docsVersionDropdown', position: 'left' },
      // ...other items
    ],
  },
}
```

The dropdown reuses the kit's `.navbar__link` styling automatically.

## What the kit styles for you

| Element                    | Class                             | When it shows                  |
| -------------------------- | --------------------------------- | ------------------------------ |
| Outdated/unreleased banner | `.theme-doc-version-banner`       | reading a non-current version  |
| Version badge by the title | `.theme-doc-version-badge`        | when `versions[x].badge` is on |
| Version dropdown           | `docsVersionDropdown` navbar item | always, once added             |

The banner is wrapped by the kit's `DocVersionBanner` swizzle in a `.kt-version-banner` host and re-skinned to the kit's warning tokens; you don't configure anything.

## Tune which versions build

In the preset's `docs` options (inside the `presets` entry) you can control the banner copy and badges:

```ts
const docsOptions = {
  lastVersion: 'current',
  versions: {
    current: { label: '1.1 (next)' },
    '1.0': { badge: true },
  },
};
```

See the [official Docusaurus versioning guide](https://docusaurus.io/docs/versioning) for the full option set.
