(function () {
  'use strict';

  var root = document.documentElement;

  // --- Theme toggle (tri-state: auto → light → dark → auto) ---
  // head.html's pre-paint already applied the saved mode. "auto" leaves
  // data-theme unset so the prefers-color-scheme CSS follows the OS live;
  // "light"/"dark" pin an explicit choice. The button's data-theme-mode drives
  // which of its three icons shows (see .kt-theme-icon in the nav CSS).
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    var MODES = ['auto', 'light', 'dark'];
    var savedMode = function () {
      try {
        var s = localStorage.getItem('theme');
        return s === 'light' || s === 'dark' ? s : 'auto';
      } catch (_e) {
        return 'auto';
      }
    };
    var applyMode = function (mode) {
      if (mode === 'light' || mode === 'dark') root.setAttribute('data-theme', mode);
      else root.removeAttribute('data-theme');
      toggle.setAttribute('data-theme-mode', mode);
      toggle.setAttribute('aria-label', 'Switch theme (current: ' + mode + ')');
    };
    applyMode(savedMode()); // sync the icon with the pre-painted mode on load
    toggle.addEventListener('click', function () {
      var next = MODES[(MODES.indexOf(savedMode()) + 1) % MODES.length];
      try {
        localStorage.setItem('theme', next);
      } catch (_e) {
        /* storage blocked */
      }
      applyMode(next);
    });
  }

  // --- Code-block tabs ---
  // Delegated click on .kt-codeblock__tab toggles --active on siblings
  // and the matching panel inside the same .kt-codeblock.
  document.addEventListener('click', function (ev) {
    var tab = ev.target.closest('.kt-codeblock__tab');
    if (!tab) return;
    var block = tab.closest('.kt-codeblock');
    if (!block) return;
    var idx = tab.getAttribute('data-tab');
    block.querySelectorAll('.kt-codeblock__tab').forEach(function (t) {
      t.classList.toggle('kt-codeblock__tab--active', t === tab);
    });
    block.querySelectorAll('.kt-codeblock__panel').forEach(function (p) {
      p.hidden = p.getAttribute('data-tab') !== idx;
    });
  });

  // --- Code-block copy ---
  // Delegated click on a [data-copy] button inside a .kt-codeblock copies the
  // code to the clipboard. Handles the Chroma line-number table layout (code
  // sits in the last .lntd; the first holds the gutter numbers, which we must
  // not copy) and the plain <pre><code> layout, and for tabbed blocks copies
  // only the visible panel.
  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest('[data-copy]');
    if (!btn) return;
    var block = btn.closest('.kt-codeblock');
    if (!block || typeof navigator === 'undefined' || !navigator.clipboard) return;
    var scope = block.querySelector('.kt-codeblock__panel:not([hidden])') || block;
    var codeEl =
      scope.querySelector('.lntable .lntd:last-child code') ||
      scope.querySelector('pre > code') ||
      scope.querySelector('pre');
    if (!codeEl) return;
    var text = (codeEl.textContent || '').replace(/\n$/, '');
    navigator.clipboard
      .writeText(text)
      .then(function () {
        var label = btn.querySelector('[data-copy-label]') || btn;
        var prev = label.textContent;
        label.textContent = 'copied';
        window.setTimeout(function () {
          label.textContent = prev;
        }, 1400);
      })
      .catch(function () {
        /* clipboard blocked */
      });
  });

  // --- Content tabs ---
  // Same idea for .kt-tabs__tab ↔ .kt-tabs__panel pairs. shortcodes/tabs.html
  // emits the panels as siblings immediately after the .kt-tabs tablist, so we
  // walk only this group's consecutive panel siblings — scoping by the shared
  // parent would cross-toggle every tab group on the page.
  document.addEventListener('click', function (ev) {
    var tab = ev.target.closest('.kt-tabs__tab');
    if (!tab) return;
    var list = tab.closest('.kt-tabs');
    if (!list) return;
    var idx = tab.getAttribute('data-tab');
    list.querySelectorAll('.kt-tabs__tab').forEach(function (t) {
      var on = t === tab;
      t.classList.toggle('kt-tabs__tab--active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    var panel = list.nextElementSibling;
    while (panel && panel.classList.contains('kt-tabs__panel')) {
      var match = panel.getAttribute('data-tab') === idx;
      panel.classList.toggle('kt-tabs__panel--active', match);
      panel.hidden = !match;
      panel = panel.nextElementSibling;
    }
  });
})();
