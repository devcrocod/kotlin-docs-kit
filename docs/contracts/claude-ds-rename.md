# Claude DS → BEM rename table

Mapping from the flat class names used in `Claude Design System/components.css` (frozen snapshot) to the BEM names with the `kt-` prefix used in `packages/tokens/src/components/`. Each row shows the source selector, the renamed selector, and the component file the rule lives in after the split.

State suffixes follow the convention: `.is-active` → `--active`, `.is-hl` → `--hl`, `.is-hoverable` → `--hoverable`, `.is-terminal` → `--terminal`. Element selectors inside a component (`.callout p`, `.docs-article > h2`) remain element-selectors with the renamed parent.

## Buttons — `buttons.css`

| Flat (Claude DS) | BEM (`kt-*`) |
|---|---|
| `.btn` | `.kt-button` |
| `.btn-sm` | `.kt-button--sm` |
| `.btn-lg` | `.kt-button--lg` |
| `.btn-primary` | `.kt-button--primary` |
| `.btn-secondary` | `.kt-button--secondary` |
| `.btn-ghost` | `.kt-button--ghost` |
| `.btn-link` | `.kt-button--link` |
| `.btn-brand` | `.kt-button--brand` |

## Inputs — `inputs.css`

| Flat | BEM |
|---|---|
| `.input` | `.kt-input` |
| `.textarea` | `.kt-textarea` |
| `.select` | `.kt-select` |
| `.input-group` | `.kt-input-group` |
| `.input-group .lead-icon` | `.kt-input-group__lead-icon` |
| `.docs-search` | `.kt-docs-search` |
| `.docs-search .ds-ico` | `.kt-docs-search__icon` |
| `.docs-search .ds-text` | `.kt-docs-search__text` |
| `.docs-search .ds-kbd` | `.kt-docs-search__kbd` |

## Badges — `badges.css`

| Flat | BEM |
|---|---|
| `.badge` | `.kt-badge` |
| `.badge-purple` | `.kt-badge--purple` |
| `.badge-pink` | `.kt-badge--pink` |
| `.badge-success` | `.kt-badge--success` |
| `.badge-warning` | `.kt-badge--warning` |
| `.badge-danger` | `.kt-badge--danger` |
| `.badge-info` | `.kt-badge--info` |
| `.badge .dot` | `.kt-badge__dot` |

## Tags — `tags.css`

| Flat | BEM |
|---|---|
| `.tag` | `.kt-tag` |

## Methods — `methods.css`

| Flat | BEM |
|---|---|
| `.method` | `.kt-method` |
| `.method-get` | `.kt-method--get` |
| `.method-post` | `.kt-method--post` |
| `.method-put` | `.kt-method--put` |
| `.method-patch` | `.kt-method--patch` |
| `.method-delete` | `.kt-method--delete` |

## Callouts — `callouts.css`

| Flat | BEM |
|---|---|
| `.callout` | `.kt-callout` |
| `.callout-icon` | `.kt-callout__icon` |
| `.callout-title` | `.kt-callout__title` |
| `.callout-note` | `.kt-callout--note` |
| `.callout-info` | `.kt-callout--info` |
| `.callout-tip` | `.kt-callout--tip` |
| `.callout-warning` | `.kt-callout--warning` |
| `.callout-danger` | `.kt-callout--danger` |
| `.callout-success` | `.kt-callout--success` |
| `.callout-caution` | `.kt-callout--caution` |
| `.callout-important` | `.kt-callout--important` |
| `.callout-quote` | `.kt-callout--quote` |
| `.callout-example` | `.kt-callout--example` |
| `.callout-deprecated` | `.kt-callout--deprecated` |
| `.callout-experimental` | `.kt-callout--experimental` |

## Cards — `cards.css`

| Flat | BEM |
|---|---|
| `.k-card` | `.kt-card` |
| `.k-card.is-hoverable` | `.kt-card--hoverable` |
| `.k-card .card-icon` | `.kt-card__icon` |
| `.k-card .card-title` | `.kt-card__title` |
| `.k-card .card-body` | `.kt-card__body` |
| `.k-card .card-arrow` | `.kt-card__arrow` |
| `.card-grid` | `.kt-card-grid` |

## Code block — `codeblock.css`

| Flat | BEM |
|---|---|
| `.codeblock` | `.kt-codeblock` |
| `.codeblock.is-terminal` | `.kt-codeblock--terminal` |
| `.codeblock-header` | `.kt-codeblock__header` |
| `.codeblock-tabs` | `.kt-codeblock__tabs` |
| `.codeblock-tab` | `.kt-codeblock__tab` |
| `.codeblock-tab.is-active` | `.kt-codeblock__tab--active` |
| `.codeblock-tab .file-icon` | `.kt-codeblock__file-icon` |
| `.codeblock-actions` | `.kt-codeblock__actions` |
| `.codeblock-actions .action-btn` | `.kt-codeblock__action-btn` |
| `.codeblock-lang` | `.kt-codeblock__lang` |
| `.codeblock-body` | `.kt-codeblock__body` |
| `.codeblock-line` | `.kt-codeblock__line` |
| `.codeblock-line.is-hl` | `.kt-codeblock__line--hl` |
| `.codeblock-line .lineno` | `.kt-codeblock__lineno` |
| `.codeblock-line .ln-code` | `.kt-codeblock__code` |
| `.codeblock.is-terminal .term-prompt` | `.kt-codeblock__term-prompt` |
| `.codeblock.is-terminal .term-comment` | `.kt-codeblock__term-comment` |
| `.tok-k` / `-s` / `-n` / `-c` / `-f` / `-t` / `-p` / `-a` | `.kt-tok-k` / `-s` / `-n` / `-c` / `-f` / `-t` / `-p` / `-a` |

## Content tabs — `tabs.css`

| Flat | BEM |
|---|---|
| `.tabs` | `.kt-tabs` |
| `.tab` | `.kt-tabs__tab` |
| `.tab.is-active` | `.kt-tabs__tab--active` |

> Distinct from code-block tabs (`.kt-codeblock__tab`).

## Breadcrumbs — `crumbs.css`

| Flat | BEM |
|---|---|
| `.crumbs` | `.kt-crumbs` |
| `.crumbs .sep` | `.kt-crumbs__sep` |
| `.crumbs .current` | `.kt-crumbs__current` |

## Navigation — `nav.css`

### Topnav

| Flat | BEM |
|---|---|
| `.topnav` | `.kt-topnav` |
| `.topnav .brand` | `.kt-topnav__brand` |
| `.topnav .brand-name` | `.kt-topnav__brand-name` |
| `.topnav .nav-version` | `.kt-topnav__version` |
| `.topnav .navlinks` | `.kt-topnav__links` |
| `.topnav .navlink` | `.kt-topnav__link` |
| `.topnav .navlink.is-active` | `.kt-topnav__link--active` |
| `.topnav .nav-right` | `.kt-topnav__right` |
| `.topnav .icon-btn` | `.kt-topnav__icon-btn` |

### Sidenav

| Flat | BEM |
|---|---|
| `.sidenav` | `.kt-sidenav` |
| `.sidenav-section` | `.kt-sidenav__section` |
| `.sidenav .sec-label` | `.kt-sidenav__sec-label` |
| `.sidenav .sec-sub` | `.kt-sidenav__sec-sub` |
| `.sidenav-item` | `.kt-sidenav__item` |
| `.sidenav-item.is-active` | `.kt-sidenav__item--active` |
| `.sidenav-item .si-icon` | `.kt-sidenav__item-icon` |

### TOC

| Flat | BEM |
|---|---|
| `.toc` | `.kt-toc` |
| `.toc-label` | `.kt-toc__label` |
| `.toc-item` | `.kt-toc__item` |
| `.toc-item.is-active` | `.kt-toc__item--active` |
| `.toc-item.is-nested` | `.kt-toc__item--nested` |

## Parameters — `params.css`

| Flat | BEM |
|---|---|
| `.params` | `.kt-params` |
| `.params .param-name` | `.kt-params__name` |
| `.params .param-type` | `.kt-params__type` |

## Pagination — `pager.css`

| Flat | BEM |
|---|---|
| `.docs-pager` | `.kt-docs-pager` |
| `.pager-link` | `.kt-docs-pager__link` |
| `.pager-link.next` | `.kt-docs-pager__link--next` |
| `.pager-link .pager-direction` | `.kt-docs-pager__direction` |
| `.pager-link .pager-title` | `.kt-docs-pager__title` |

## Hero — `hero.css`

| Flat | BEM |
|---|---|
| `.docs-hero` | `.kt-docs-hero` |
| `.docs-hero .hero-grad-text` | `.kt-hero__grad-text` |

## Article — `article.css`

| Flat | BEM |
|---|---|
| `.docs-article` | `.kt-docs-article` |

> Element selectors inside (`> h2`, `> h3`, `ul`, `ol`, `li`, `blockquote`) follow the renamed parent.

## Shell — `shell.css`

| Flat | BEM |
|---|---|
| `.docs-shell` | `.kt-docs-shell` |
| `.docs-shell-side` | `.kt-docs-shell__side` |
| `.docs-shell-main` | `.kt-docs-shell__main` |
| `.docs-shell-toc` | `.kt-docs-shell__toc` |

## States — `states.css`

| Flat | BEM |
|---|---|
| `.state` | `.kt-state` |
| `.state .state-ico` | `.kt-state__icon` |
| `.state h4` | `.kt-state__title` (BEM-form) — `.kt-state h4` element-form kept as fallback |
| `.state p` | `.kt-state__body` (BEM-form) — `.kt-state p` element-form kept as fallback |
