import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Title page (home) for the kit. A standalone Docusaurus page — navbar + footer,
 * no docs sidebar — distinct from the Introduction doc (docs/content/intro.mdx).
 *
 * Uses the kit's BEM classes directly (kt-docs-hero, kt-button, kt-card,
 * kt-card-grid) plus homepage-only classes (home-hero, home-section,
 * home-engine*, home-explore) that ship from docs/src/css/homepage.css, wired
 * globally via the preset's theme.customCss. No cross-package TS import.
 *
 * Engine cards are screenshot-led: each shows a live preview of the template
 * (light/dark PNGs swapped by theme) so visitors can judge the result at a
 * glance. Capture/refresh those PNGs with `pnpm shots` (see
 * docs/scripts/capture-template-shots.mjs).
 */
export default function Home(): React.ReactElement {
  return (
    <Layout
      title="Kotlin-styled docs for Docusaurus and Hugo"
      description="A Kotlin-styled documentation kit: one design system, two doc engines (Docusaurus and Hugo)."
    >
      {/* HERO — left-aligned, text only, blends into the page; content in .container */}
      <header className="kt-docs-hero home-hero">
        <div className="container">
          <span className="kt-docs-hero__eyebrow home-hero__eyebrow">kotlin-docs-kit</span>
          <h1 className="home-hero__title">
            Kotlin-styled docs in <span className="kt-docs-hero__grad-text">2 engines</span>
          </h1>
          <p className="home-hero__lead">
            One design system. Two doc engines. Ship a Kotlin-flavored documentation site on
            Docusaurus or Hugo without re-theming from scratch.
          </p>
          <div className="kt-docs-hero__actions">
            <Link
              className="kt-button kt-button--primary kt-button--lg"
              to="/getting-started/choose-engine"
            >
              Choose your engine
            </Link>
            <a
              className="kt-button kt-button--ghost kt-button--lg"
              href="https://github.com/devcrocod/kotlin-docs-kit"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* SECTION: Choose your engine — no eyebrow, plain h2 + lead */}
        <section className="container home-section">
          <div className="home-section__head">
            <h2>Choose your engine</h2>
            <p className="home-section__lead">
              Pick the doc engine you already know. The Kotlin look-and-feel comes with the package.
            </p>
          </div>

          <div className="home-engines">
            {/* Docusaurus */}
            <article className="kt-card home-engine">
              <a
                className="home-engine__shot"
                href="https://devcrocod.github.io/kotlin-docs-docusaurus-template/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open the Docusaurus live demo"
              >
                <img
                  className="home-engine__img home-engine__img--light"
                  src={useBaseUrl('/img/templates/docusaurus-light.png')}
                  alt="Docusaurus template homepage built with the Kotlin docs kit"
                  loading="lazy"
                  width="1600"
                  height="1000"
                />
                <img
                  className="home-engine__img home-engine__img--dark"
                  src={useBaseUrl('/img/templates/docusaurus-dark.png')}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  width="1600"
                  height="1000"
                />
              </a>
              <div className="home-engine__body">
                <header className="home-engine__head">
                  <span className="home-engine__icon" aria-hidden="true">
                    D
                  </span>
                  <span className="home-engine__name">Docusaurus</span>
                  <span className="home-engine__stack">NODE · MDX · REACT</span>
                </header>
                <p className="home-engine__desc">
                  A preset on top of <code>preset-classic</code> — swaps the Infima theme for the
                  Kotlin design system, ships swizzled shell components, and registers MDX
                  components globally.
                </p>
                <code className="home-engine__cmd">pnpm add @ktdocs/docusaurus-preset</code>
                <hr className="home-engine__rule" />
                <footer className="home-engine__actions">
                  <a
                    className="kt-button kt-button--primary kt-button--sm"
                    href="https://github.com/devcrocod/kotlin-docs-docusaurus-template/generate"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Use this template
                  </a>
                  <a
                    className="kt-button kt-button--ghost kt-button--sm"
                    href="https://devcrocod.github.io/kotlin-docs-docusaurus-template/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live demo ↗
                  </a>
                </footer>
              </div>
            </article>

            {/* Hugo */}
            <article className="kt-card home-engine">
              <a
                className="home-engine__shot"
                href="https://devcrocod.github.io/kotlin-docs-hugo-template/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open the Hugo live demo"
              >
                <img
                  className="home-engine__img home-engine__img--light"
                  src={useBaseUrl('/img/templates/hugo-light.png')}
                  alt="Hugo template homepage built with the Kotlin docs kit"
                  loading="lazy"
                  width="1600"
                  height="1000"
                />
                <img
                  className="home-engine__img home-engine__img--dark"
                  src={useBaseUrl('/img/templates/hugo-dark.png')}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  width="1600"
                  height="1000"
                />
              </a>
              <div className="home-engine__body">
                <header className="home-engine__head">
                  <span className="home-engine__icon" aria-hidden="true">
                    H
                  </span>
                  <span className="home-engine__name">Hugo</span>
                  <span className="home-engine__stack">GO · HUGO PIPES</span>
                </header>
                <p className="home-engine__desc">
                  A Hugo Module with layouts, shortcodes, and Hugo Pipes. Import it in{' '}
                  <code>hugo.toml</code> to get callouts, code tabs, cards, and a pre-styled
                  3-column docs shell.
                </p>
                <code className="home-engine__cmd">
                  hugo mod get github.com/devcrocod/kotlin-docs-kit/packages/hugo@latest
                </code>
                <hr className="home-engine__rule" />
                <footer className="home-engine__actions">
                  <a
                    className="kt-button kt-button--primary kt-button--sm"
                    href="https://github.com/devcrocod/kotlin-docs-hugo-template/generate"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Use this template
                  </a>
                  <a
                    className="kt-button kt-button--ghost kt-button--sm"
                    href="https://devcrocod.github.io/kotlin-docs-hugo-template/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live demo ↗
                  </a>
                </footer>
              </div>
            </article>
          </div>
        </section>

        {/* SECTION: Explore the docs — no eyebrow, plain h2; 6 cards in a fixed 3-up grid */}
        <section className="container home-section">
          <div className="home-section__head">
            <h2>Explore the docs</h2>
            <p className="home-section__lead">
              Everything you need to install, customize, and contribute.
            </p>
          </div>
          <div className="kt-card-grid home-explore">
            <Link className="kt-card kt-card--hoverable" to="/intro">
              <h3 className="kt-card__title">Introduction</h3>
              <p className="kt-card__body">
                What the kit is, the three pillars, and the shared design-token model.
              </p>
              <span className="kt-card__arrow">→</span>
            </Link>
            <Link className="kt-card kt-card--hoverable" to="/getting-started/installation">
              <h3 className="kt-card__title">Getting started</h3>
              <p className="kt-card__body">
                Install the engine package, wire it into your config, and ship your first page.
              </p>
              <span className="kt-card__arrow">→</span>
            </Link>
            <Link className="kt-card kt-card--hoverable" to="/reference/components/overview">
              <h3 className="kt-card__title">Components</h3>
              <p className="kt-card__body">
                The shared BEM component contract, identical across both engines.
              </p>
              <span className="kt-card__arrow">→</span>
            </Link>
            <Link className="kt-card kt-card--hoverable" to="/reference/tokens">
              <h3 className="kt-card__title">Design tokens</h3>
              <p className="kt-card__body">
                Every color, type, spacing, radius, and motion variable in one table.
              </p>
              <span className="kt-card__arrow">→</span>
            </Link>
            <Link className="kt-card kt-card--hoverable" to="/customization/layers">
              <h3 className="kt-card__title">Customization</h3>
              <p className="kt-card__body">
                Override tokens, swap the logo, layer your own theme components.
              </p>
              <span className="kt-card__arrow">→</span>
            </Link>
            <Link className="kt-card kt-card--hoverable" to="/contributing/getting-started">
              <h3 className="kt-card__title">Contributing</h3>
              <p className="kt-card__body">
                Local dev, conventional commits, and how the monorepo fits together.
              </p>
              <span className="kt-card__arrow">→</span>
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
