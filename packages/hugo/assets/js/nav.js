// Sidenav collapse + per-tab persistence (and, below the 997px breakpoint,
// the mobile drawer — added by the drawer section). No dependencies.
//
// Collapse: nested sidenav groups toggle via .kt-sidenav__group-toggle
// (aria-expanded on the button, hidden on the sibling list). The server
// pre-expands the active ancestor chain, so the tree works without JS.
//
// Persistence: the open-group set is stored per tree in
// sessionStorage["kt.sidenav.<navKey>"] (navKey = data-nav-key on
// .kt-sidenav — the active tab's root RelPermalink, or "_root" without
// tabs), because every Hugo navigation is a full page load. Stored state is
// applied as a union with the server-expanded chain, so the active path
// never collapses on load.
(function () {
  'use strict';

  var PREFIX = 'kt.sidenav.';

  function storageKey(nav) {
    return PREFIX + (nav.getAttribute('data-nav-key') || '_root');
  }

  function readState(key) {
    try {
      var parsed = JSON.parse(sessionStorage.getItem(key));
      return Array.isArray(parsed) ? parsed : [];
    } catch (_e) {
      return [];
    }
  }

  function writeState(key, keys) {
    try {
      sessionStorage.setItem(key, JSON.stringify(keys));
    } catch (_e) {
      /* storage unavailable (private mode etc.) — collapse still works */
    }
  }

  function groupToggle(group) {
    return group.querySelector(':scope > .kt-sidenav__group-row > .kt-sidenav__group-toggle');
  }

  function groupList(group) {
    return group.querySelector(':scope > .kt-sidenav__list');
  }

  function setOpen(group, open) {
    var toggle = groupToggle(group);
    var list = groupList(group);
    if (!toggle || !list) return;
    toggle.setAttribute('aria-expanded', String(open));
    list.hidden = !open;
  }

  function openKeys(nav) {
    var keys = [];
    nav.querySelectorAll('.kt-sidenav__group').forEach(function (group) {
      var toggle = groupToggle(group);
      if (toggle && toggle.getAttribute('aria-expanded') === 'true') {
        keys.push(group.getAttribute('data-key'));
      }
    });
    return keys;
  }

  function applyStored(nav) {
    readState(storageKey(nav)).forEach(function (key) {
      nav.querySelectorAll('.kt-sidenav__group').forEach(function (group) {
        if (group.getAttribute('data-key') === key) setOpen(group, true);
      });
    });
  }

  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('.kt-sidenav__group-toggle');
    if (!toggle) return;
    var group = toggle.closest('.kt-sidenav__group');
    var nav = toggle.closest('.kt-sidenav');
    if (!group || !nav) return;
    var open = toggle.getAttribute('aria-expanded') !== 'true';
    var key = group.getAttribute('data-key');
    var navKey = nav.getAttribute('data-nav-key');
    // Sync every tree sharing this nav key (desktop sidebar + drawer copy).
    document.querySelectorAll('.kt-sidenav').forEach(function (other) {
      if (other.getAttribute('data-nav-key') !== navKey) return;
      other.querySelectorAll('.kt-sidenav__group').forEach(function (g) {
        if (g.getAttribute('data-key') === key) setOpen(g, open);
      });
    });
    writeState(storageKey(nav), openKeys(nav));
  });

  document.querySelectorAll('.kt-sidenav').forEach(applyStored);
})();
