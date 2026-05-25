"""Smoke tests for the package layout.

Ensures that the path string we expose via ``kotlin_docs_mkdocs.overrides``
points at a directory containing all the files mkdocs-material's
``theme.custom_dir`` will need at runtime. Acceptance criterion #1 of ISSUES #6.
"""

from pathlib import Path

import kotlin_docs_mkdocs


def test_overrides_attr_is_a_string_path() -> None:
    # PyYAML's `!python/name:kotlin_docs_mkdocs.overrides` tag resolves to this
    # value verbatim; MkDocs expects a string for theme.custom_dir, so we
    # promise that here.
    assert isinstance(kotlin_docs_mkdocs.overrides, str)
    assert Path(kotlin_docs_mkdocs.overrides).is_dir()


def test_main_template_present() -> None:
    root = Path(kotlin_docs_mkdocs.overrides)
    assert (root / "main.html").is_file()


def test_required_partials_present() -> None:
    root = Path(kotlin_docs_mkdocs.overrides) / "partials"
    for partial in ("header.html", "nav.html", "toc.html", "footer.html"):
        assert (root / partial).is_file(), f"missing partial: {partial}"
    components = root / "components"
    for partial in ("card.html", "hero.html", "feature-grid.html", "params.html"):
        assert (components / partial).is_file(), f"missing component partial: {partial}"


def test_mkdocs_overrides_css_present() -> None:
    css = Path(kotlin_docs_mkdocs.overrides) / "assets" / "stylesheets" / "mkdocs-overrides.css"
    assert css.is_file()
    # Sanity-check the file actually carries Material variable remap.
    contents = css.read_text(encoding="utf-8")
    assert "--md-primary-fg-color" in contents
    assert "--md-code-bg-color" in contents
    # Custom admonition kinds Material doesn't ship — we register them here.
    for kind in ("caution", "important", "deprecated", "experimental"):
        assert f"--md-admonition-icon--{kind}" in contents, f"missing icon for {kind}"


def test_theme_sync_js_present() -> None:
    js = Path(kotlin_docs_mkdocs.overrides) / "assets" / "javascripts" / "theme-sync.js"
    assert js.is_file()
    assert "data-md-color-scheme" in js.read_text(encoding="utf-8")


def test_stylesheets_metadata_matches_disk() -> None:
    # The tuple we expose in __init__.py must stay in sync with what main.html
    # actually injects — guard against drift.
    root = Path(kotlin_docs_mkdocs.overrides)
    main = (root / "main.html").read_text(encoding="utf-8")
    for css in kotlin_docs_mkdocs.stylesheets:
        assert css in main, f"{css} declared in __init__ but missing from main.html"
    for js in kotlin_docs_mkdocs.javascripts:
        assert js in main, f"{js} declared in __init__ but missing from main.html"
