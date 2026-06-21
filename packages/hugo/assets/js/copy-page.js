// Copy-page dropdown: toggle the menu, and copy the page's Markdown twin to the
// clipboard. Progressive enhancement — the links work without JS.
(function () {
  function init(el) {
    var btn = el.querySelector('.kt-copy-page__btn');
    var menu = el.querySelector('.kt-copy-page__menu');
    var copyItem = el.querySelector('[data-action="copy"]');
    var mdUrl = el.getAttribute('data-md-url');
    if (!btn || !menu) return;

    function close() {
      menu.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    }
    function open() {
      menu.removeAttribute('hidden');
      btn.setAttribute('aria-expanded', 'true');
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menu.hasAttribute('hidden')) open();
      else close();
    });
    document.addEventListener('click', function (e) {
      if (!el.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    if (copyItem && mdUrl) {
      copyItem.addEventListener('click', function () {
        var label = copyItem.textContent;
        fetch(mdUrl)
          .then(function (r) {
            return r.text();
          })
          .then(function (text) {
            return navigator.clipboard.writeText(text);
          })
          .then(function () {
            copyItem.textContent = 'Copied!';
            setTimeout(function () {
              copyItem.textContent = label;
              close();
            }, 1200);
          })
          .catch(function () {
            copyItem.textContent = 'Copy failed';
            setTimeout(function () {
              copyItem.textContent = label;
            }, 1200);
          });
      });
    }
  }

  document.querySelectorAll('.kt-copy-page').forEach(init);
})();
