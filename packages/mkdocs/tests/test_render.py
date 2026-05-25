"""End-to-end render test.

Builds a minimal in-process mkdocs site that uses kotlin_docs_mkdocs as its
custom_dir, then asserts that the generated HTML contains the BEM classes
our contract promises. Acceptance criterion #2 of ISSUES #6.
"""

from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

import pytest

import kotlin_docs_mkdocs


pytestmark = pytest.mark.skipif(
    shutil.which("mkdocs") is None,
    reason="mkdocs CLI not on PATH; install with `uv sync --group dev` first",
)


MKDOCS_YML = """\
site_name: kt-test
site_url: https://example.invalid/
theme:
  name: material
  custom_dir: {overrides}
  font: false
  features:
    - navigation.footer
markdown_extensions:
  - admonition
  - attr_list
  - md_in_html
  - pymdownx.details
  - pymdownx.superfences
  - pymdownx.tabbed:
      alternate_style: true
plugins:
  - search
"""

INDEX_MD = """\
# Hello Kotlin

!!! tip "Pro tip"
    You can pass `--watch` to rebuild on save.

!!! deprecated "Going away"
    This API will be removed in v2.

```kotlin
fun main() = println("Hello")
```

=== "Kotlin"
    ```kotlin
    fun main() = println("Hello")
    ```
=== "Java"
    ```java
    System.out.println("Hello");
    ```
"""

NEXT_MD = """\
# Next page

Body.
"""


def _build_site(tmp_path: Path) -> Path:
    site_root = tmp_path / "site_src"
    docs = site_root / "docs"
    docs.mkdir(parents=True)
    (docs / "index.md").write_text(INDEX_MD, encoding="utf-8")
    (docs / "next.md").write_text(NEXT_MD, encoding="utf-8")
    (site_root / "mkdocs.yml").write_text(
        MKDOCS_YML.format(overrides=kotlin_docs_mkdocs.overrides),
        encoding="utf-8",
    )
    subprocess.run(
        ["mkdocs", "build", "--strict", "--site-dir", str(tmp_path / "out")],
        cwd=site_root,
        check=True,
    )
    return tmp_path / "out"


def test_build_emits_bem_classes(tmp_path: Path) -> None:
    out = _build_site(tmp_path)
    index = (out / "index.html").read_text(encoding="utf-8")

    # Header + sidebar + TOC wrappers carry the BEM contract classes.
    assert "kt-topnav" in index
    assert "kt-sidenav" in index
    assert "kt-toc" in index

    # CSS shim + theme-sync get injected by main.html.
    assert "assets/stylesheets/mkdocs-overrides.css" in index
    assert "assets/javascripts/theme-sync.js" in index

    # Custom admonition kind we register via mkdocs-overrides.css.
    assert "admonition deprecated" in index or 'class="admonition deprecated"' in index


def test_build_emits_pager(tmp_path: Path) -> None:
    out = _build_site(tmp_path)
    index = (out / "index.html").read_text(encoding="utf-8")
    assert "kt-docs-pager" in index
    assert "kt-docs-pager__link--next" in index


def test_assets_copied_into_site(tmp_path: Path) -> None:
    out = _build_site(tmp_path)
    # MkDocs auto-copies the custom_dir tree into the built site, so the
    # stylesheets/javascripts referenced by main.html are reachable.
    assert (out / "assets" / "stylesheets" / "mkdocs-overrides.css").is_file()
    assert (out / "assets" / "javascripts" / "theme-sync.js").is_file()
