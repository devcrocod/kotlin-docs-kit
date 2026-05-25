"""kotlin-docs-mkdocs — Kotlin-styled override theme for mkdocs-material.

The package ships an ``overrides/`` directory that mkdocs-material consumes via
``theme.custom_dir``. Bundled fonts, stylesheets, JavaScript and image assets
live under ``overrides/assets/`` so MkDocs's static-file copier picks them up
without any plugin.

Usage (``mkdocs.yml``):

.. code-block:: yaml

    theme:
      name: material
      custom_dir: !python/name:kotlin_docs_mkdocs.overrides

The ``overrides`` attribute below is a plain string path so PyYAML's
``!python/name:`` tag resolves it directly to a value MkDocs accepts.
"""

from pathlib import Path

_HERE = Path(__file__).resolve().parent

#: Filesystem path to the bundled overrides directory.
overrides: str = str(_HERE / "overrides")

#: Stylesheets that ``overrides/main.html`` injects, in load order. Listed here
#: so callers can introspect (and tests can assert) which CSS files ship.
stylesheets: tuple[str, ...] = (
    "assets/stylesheets/fonts.css",
    "assets/stylesheets/colors_and_type.css",
    "assets/stylesheets/tokens.css",
    "assets/stylesheets/components.css",
    "assets/stylesheets/mkdocs-overrides.css",
)

#: JavaScript files that ``overrides/main.html`` injects.
javascripts: tuple[str, ...] = (
    "assets/javascripts/theme-sync.js",
)

__all__ = ["overrides", "stylesheets", "javascripts"]
