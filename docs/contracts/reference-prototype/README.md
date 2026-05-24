# Docs Theme — UI kit

A click-thru demonstration of the design system as a working **documentation theme**. Same components a real engine theme would emit — just rendered in React for fast iteration.

## Screens

- **Home** — docs landing: hero + card grid + getting-started block
- **Article** — a tutorial page with all six callouts, multiple code blocks, TOC
- **API** — endpoint reference, parameter table, request/response panel
- **Changelog** — version history with badges and admonitions
- **Blog post** — long-form prose article

## How to read it

This kit shows what the **rendered output** should look like in MkDocs, Docusaurus, or Hugo once you apply the design system. The component classes used here (`.callout-*`, `.codeblock`, `.docs-shell`, etc.) are the same ones documented in `engine-mappings/` for each engine.

The theme toggle in the top nav flips `data-theme` on `<html>` — try it to see dark mode.

## Components

- `TopNav` — sticky header, version pill, search, theme toggle, GitHub link
- `Sidebar` — section + page list with active state
- `TOC` — on-this-page right rail with scroll-spy active indicator
- `Footer` — bottom links
- `Icon` — Lucide-style inline SVGs
