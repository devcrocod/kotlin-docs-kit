/* kotlin-docs-mkdocs — theme sync.
 *
 * Mirrors Material's [data-md-color-scheme] onto [data-theme] so the
 * @ktdocs/tokens CSS (which keys dark mode off [data-theme="dark"]) follows
 * Material's palette toggle.
 *
 * The initial value is set inline in main.html before paint to avoid FOUC;
 * this script keeps the two attributes in sync afterwards via MutationObserver.
 */
(function () {
  "use strict";

  var root = document.documentElement;

  function sync() {
    var scheme = root.getAttribute("data-md-color-scheme");
    root.setAttribute("data-theme", scheme === "slate" ? "dark" : "light");
  }

  sync();

  new MutationObserver(sync).observe(root, {
    attributes: true,
    attributeFilter: ["data-md-color-scheme"],
  });
})();
