// Search modal backed by Pagefind (https://pagefind.app).
// The topnav .kt-docs-search box is the trigger; the real input + results
// render inside a modal via PagefindUI, lazy-loaded from <baseURL>/pagefind/
// on first open (so the wasm/index cost is paid only when search is used).
//
// Progressive enhancement: the index is produced by `pagefind --site public`
// AFTER `hugo` builds (see Taskfile + deploy workflow). If it is missing
// (pagefind-ui.js 404s) the modal shows a notice instead of throwing.
(function () {
  'use strict';

  var trigger = document.querySelector('.kt-docs-search');
  if (!trigger) return;

  // Platform-appropriate shortcut label; the static ⌘K in header.html is the
  // SSR / no-JS fallback.
  var kbd = trigger.querySelector('.kt-docs-search__kbd');
  var platform =
    (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
  if (kbd && !/mac|iphone|ipad|ipod/i.test(platform)) kbd.textContent = 'Ctrl K';

  // Paths injected by header.html via Hugo's relURL, so they resolve under
  // both a root and a sub-path baseURL (e.g. /kotlin-docs-hugo-template/).
  var base = trigger.getAttribute('data-pagefind-base') || '/pagefind/';
  var siteBase = (trigger.getAttribute('data-site-base') || '').replace(/\/$/, '');

  var modal,
    uiMount,
    state = 'idle'; // idle | loading | ready | failed

  function loadCss(href) {
    return new Promise(function (resolve, reject) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function buildModal() {
    modal = document.createElement('div');
    modal.className = 'kt-search-modal';
    modal.hidden = true;
    modal.innerHTML =
      '<div class="kt-search-modal__backdrop" data-close></div>' +
      '<div class="kt-search-modal__dialog" role="dialog" aria-modal="true" aria-label="Search">' +
      '<div class="kt-search-modal__ui" id="kt-search-ui"></div>' +
      '<div class="kt-search-modal__hint"><kbd>Esc</kbd> to close · <kbd>↑</kbd><kbd>↓</kbd> to navigate</div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close')) close();
    });
    uiMount = modal.querySelector('#kt-search-ui');
  }

  function ensurePagefind() {
    if (state === 'ready' || state === 'failed') return Promise.resolve();
    state = 'loading';
    return Promise.all([loadCss(base + 'pagefind-ui.css'), loadScript(base + 'pagefind-ui.js')])
      .then(function () {
        if (typeof window.PagefindUI === 'undefined') throw new Error('PagefindUI missing');
        new window.PagefindUI({
          element: '#kt-search-ui',
          showSubResults: true,
          showImages: false,
          resetStyles: false,
          bundlePath: base,
          processResult: function (result) {
            // Pagefind stores URLs relative to the indexed root (public/).
            // Under a sub-path baseURL those are missing the prefix — restore it.
            if (siteBase && result.url && result.url.indexOf(siteBase + '/') !== 0) {
              result.url = siteBase + result.url;
            }
            return result;
          },
        });
        state = 'ready';
      })
      .catch(function () {
        state = 'failed';
        uiMount.innerHTML =
          '<p class="kt-search-modal__empty">Search isn’t available yet. The index is built by ' +
          '<code>pagefind --site public</code> after <code>hugo</code> — run a full build or deploy.</p>';
      });
  }

  function open() {
    if (!modal) buildModal();
    if (!modal.hidden) return;
    modal.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    ensurePagefind().then(function () {
      var input = modal.querySelector('input');
      if (input) input.focus();
    });
  }

  function close() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.documentElement.style.overflow = '';
    trigger.focus();
  }

  // The topnav box is the trigger (role=button / tabindex set in header.html).
  trigger.addEventListener('click', open);
  trigger.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });

  // Global shortcuts: ⌘/Ctrl-K opens anywhere; "/" opens unless typing in a field.
  document.addEventListener('keydown', function (e) {
    var open_ = modal && !modal.hidden;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      open();
    } else if (e.key === 'Escape' && open_) {
      close();
    } else if (e.key === '/' && !open_) {
      var tag = (e.target && e.target.tagName) || '';
      if (!/^(input|textarea|select)$/i.test(tag) && !e.target.isContentEditable) {
        e.preventDefault();
        open();
      }
    }
  });
})();
