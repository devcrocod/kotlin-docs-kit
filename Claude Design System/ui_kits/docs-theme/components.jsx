/* global React */
const { useState, useEffect } = React;

// ============================================================================
// Icons — minimal Lucide-style inline SVGs
// ============================================================================
const Icon = ({ name, size = 16, className = "" }) => {
  const paths = {
    search:   <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>,
    chevron:  <polyline points="9 18 15 12 9 6"/>,
    chevronDown: <polyline points="6 9 12 15 18 9"/>,
    arrowR:   <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
    book:     <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
    zap:      <path d="M13 2 3 14h9l-1 8 10-12h-9z"/>,
    code:     <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
    file:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    terminal: <><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></>,
    copy:     <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    note:     <><path d="M3 5h18"/><path d="M3 12h18"/><path d="M3 19h12"/></>,
    info:     <><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></>,
    tip:      <><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 1 7 7c0 3-2 5-3 6.5V18H8v-2.5C7 14 5 12 5 9a7 7 0 0 1 7-7z"/></>,
    warn:     <><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>,
    caution:  <><circle cx="12" cy="12" r="10"/><path d="M12 9v4"/><path d="M12 17h.01"/></>,
    danger:   <><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></>,
    check:    <path d="M20 6 9 17l-5-5"/>,
    important:<><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/><path d="M12 8v4"/><path d="M12 16h.01"/></>,
    quote:    <><path d="M3 21c3-1 5-3 5-6V8H4v7h4"/><path d="M15 21c3-1 5-3 5-6V8h-4v7h4"/></>,
    flask:    <><path d="M9 2v6L3.5 18a2.5 2.5 0 0 0 2 4h13a2.5 2.5 0 0 0 2-4L15 8V2"/><path d="M7 2h10"/><path d="M7 16h10"/></>,
    ban:      <><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></>,
    github:   <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>,
    sun:      <><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></>,
    moon:     <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>,
    menu:     <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    shield:   <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    package:  <><path d="m7.5 4.27 9 5.15"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.3 7 12 12 20.7 7"/><line x1="12" y1="22" x2="12" y2="12"/></>,
    layers:   <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    rss:      <><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></>,
    edit:     <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></>,
    play:     <polygon points="6 4 20 12 6 20 6 4"/>,
    plus:     <><path d="M12 5v14"/><path d="M5 12h14"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         className={className}>
      {paths[name] || null}
    </svg>
  );
};

// ============================================================================
// TopNav
// ============================================================================
const TopNav = ({ route, setRoute, theme, setTheme }) => (
  <header className="topnav">
    <a className="brand" onClick={() => setRoute("home")} style={{ cursor: "pointer" }}>
      <img
        src={theme === "dark" ? "../../assets/kotlin-logo-dark.svg" : "../../assets/kotlin-logo.svg"}
        height="28" alt="Kotlin Docs"
      />
      <span className="nav-version">v2.0.0</span>
    </a>
    <nav className="navlinks">
      <a className={"navlink " + (route === "home" || route === "article" ? "is-active" : "")} onClick={() => setRoute("home")}>Docs</a>
      <a className={"navlink " + (route === "api" ? "is-active" : "")} onClick={() => setRoute("api")}>API</a>
      <a className="navlink">Playground</a>
      <a className={"navlink " + (route === "changelog" ? "is-active" : "")} onClick={() => setRoute("changelog")}>Changelog</a>
      <a className={"navlink " + (route === "blog" ? "is-active" : "")} onClick={() => setRoute("blog")}>Blog</a>
    </nav>
    <div className="nav-right">
      <div className="docs-search" style={{ width: 240 }}>
        <Icon name="search" size={14} className="ds-ico"/>
        <span className="ds-text">Search docs</span>
        <span className="ds-kbd">⌘K</span>
      </div>
      <button className="icon-btn" title="GitHub"><Icon name="github" size={16}/></button>
      <button className="icon-btn" title="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        <Icon name={theme === "dark" ? "sun" : "moon"} size={16}/>
      </button>
    </div>
  </header>
);

// ============================================================================
// Sidebar
// ============================================================================
const docsTree = [
  { sec: "Getting started", items: [
    { id: "intro",       t: "Introduction" },
    { id: "install",     t: "Installation" },
    { id: "quickstart",  t: "Quickstart" },
    { id: "structure",   t: "Project structure" },
  ]},
  { sec: "Concepts", items: [
    { id: "routing",     t: "Routing" },
    { id: "data",        t: "Data fetching" },
    { id: "plugins",     t: "Plugins" },
    { id: "auth",        t: "Authentication" },
    { id: "errors",      t: "Error handling" },
  ]},
  { sec: "Reference", sub: true, items: [
    { id: "cli",         t: "CLI" },
    { id: "config",      t: "Configuration" },
    { id: "env",         t: "Environment vars" },
  ]},
];

const Sidebar = ({ active = "quickstart", onPick }) => (
  <nav className="sidenav">
    <div className="docs-search" style={{ marginBottom: 16 }}>
      <Icon name="search" size={14} className="ds-ico"/>
      <span className="ds-text">Filter…</span>
      <span className="ds-kbd">⌘K</span>
    </div>
    {docsTree.map(group => (
      <div key={group.sec} className="sidenav-section">
        <div className={group.sub ? "sec-sub" : "sec-label"}>{group.sec}</div>
        {group.items.map(it => (
          <a key={it.id}
             className={"sidenav-item " + (active === it.id ? "is-active" : "")}
             onClick={() => onPick && onPick(it.id)}>{it.t}</a>
        ))}
      </div>
    ))}
  </nav>
);

// ============================================================================
// TOC right rail
// ============================================================================
const TOC = ({ items, activeId, onPick }) => (
  <nav className="toc">
    <div className="toc-label">On this page</div>
    {items.map(it => (
      <a key={it.id}
         className={"toc-item " + (it.nested ? "is-nested " : "") + (activeId === it.id ? "is-active" : "")}
         onClick={() => onPick && onPick(it.id)}>
        {it.t}
      </a>
    ))}
  </nav>
);

// ============================================================================
// Footer
// ============================================================================
const Footer = () => (
  <footer style={{
    borderTop: "1px solid var(--border-1)",
    padding: "32px 28px",
    background: "var(--surface-1)",
    fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg-2)",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src="../../assets/kotlin-icon-color.svg" width="22" height="22" alt=""/>
        <span style={{ color: "var(--fg-1)", fontWeight: 500 }}>Kotlin Docs</span>
        <span style={{ fontFamily: "var(--font-mono)", color: "var(--fg-3)", fontSize: 12 }}>built with the docs theme system</span>
      </div>
      <div style={{ display: "flex", gap: 22, fontSize: 13 }}>
        <a style={{ color: "var(--fg-2)", textDecoration: "none" }}>GitHub</a>
        <a style={{ color: "var(--fg-2)", textDecoration: "none" }}>Discord</a>
        <a style={{ color: "var(--fg-2)", textDecoration: "none" }}>X</a>
        <a style={{ color: "var(--fg-2)", textDecoration: "none" }}>Status</a>
      </div>
    </div>
  </footer>
);

// ============================================================================
// Callout — re-used across pages. 12 supported kinds.
// ============================================================================
const Callout = ({ kind = "note", title, children }) => {
  const icoMap = {
    note: "note", info: "info", tip: "tip",
    warning: "warn", caution: "caution", danger: "danger",
    success: "check", important: "important",
    quote: "quote", example: "code",
    deprecated: "ban", experimental: "flask",
  };
  return (
    <div className={"callout callout-" + kind}>
      <Icon name={icoMap[kind] || "note"} size={20} className="callout-icon"/>
      <div>
        {title && <strong className="callout-title">{title}</strong>}
        {children}
      </div>
    </div>
  );
};

Object.assign(window, { Icon, TopNav, Sidebar, TOC, Footer, Callout });
