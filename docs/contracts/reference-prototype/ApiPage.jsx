/* global React, Icon, Sidebar, Callout */

const apiTree = [
  { sec: "Authentication", items: [
    { id: "apikeys", t: "API keys" },
    { id: "oauth",   t: "OAuth 2.0" },
  ]},
  { sec: "Resources", items: [
    { id: "projects-list", t: "List projects",      method: "GET" },
    { id: "projects-get",  t: "Retrieve a project", method: "GET", active: true },
    { id: "projects-post", t: "Create a project",   method: "POST" },
    { id: "projects-del",  t: "Delete a project",   method: "DELETE" },
    { id: "deploys-list",  t: "List deploys",       method: "GET" },
    { id: "deploys-post",  t: "Create a deploy",    method: "POST" },
  ]},
  { sec: "Errors", sub: true, items: [
    { id: "error-codes", t: "Error codes" },
    { id: "rate-limits", t: "Rate limits" },
  ]},
];

const ApiPage = () => (
  <div className="docs-shell" style={{ gridTemplateColumns: "260px minmax(0, 1fr) 360px" }}>
    {/* Sidebar — custom API tree with method labels */}
    <aside className="docs-shell-side">
      <nav className="sidenav">
        <div className="docs-search" style={{ marginBottom: 16 }}>
          <Icon name="search" size={14} className="ds-ico"/>
          <span className="ds-text">Filter API…</span>
          <span className="ds-kbd">⌘K</span>
        </div>
        {apiTree.map(g => (
          <div key={g.sec} className="sidenav-section">
            <div className={g.sub ? "sec-sub" : "sec-label"}>{g.sec}</div>
            {g.items.map(it => (
              <a key={it.id} className={"sidenav-item " + (it.active ? "is-active" : "")} style={{ gap: 8 }}>
                {it.method && (
                  <span className={"method method-" + it.method.toLowerCase()} style={{ fontSize: 9, padding: "1px 5px", flexShrink: 0 }}>{it.method}</span>
                )}
                <span style={{ fontFamily: it.method ? "var(--font-mono)" : "var(--font-sans)", fontSize: it.method ? 12 : 13.5 }}>{it.t}</span>
              </a>
            ))}
          </div>
        ))}
      </nav>
    </aside>

    {/* Article (mid column) */}
    <main className="docs-shell-main" style={{ padding: "36px 40px 60px", borderRight: "1px solid var(--border-1)" }}>
      <nav className="crumbs" style={{ marginBottom: 14 }}>
        <a>API</a><span className="sep">/</span>
        <a>Projects</a><span className="sep">/</span>
        <span className="current">Retrieve a project</span>
      </nav>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <span className="method method-get">GET</span>
        <code style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "var(--fg-1)", background: "transparent", border: 0, padding: 0 }}>
          /v1/projects/&#123;id&#125;
        </code>
      </div>
      <h1 className="t-h1" style={{ marginBottom: 12 }}>Retrieve a project</h1>
      <p style={{ fontSize: 15, color: "var(--fg-2)", lineHeight: 1.6, marginBottom: 24, maxWidth: "60ch" }}>
        Returns a single project by its identifier. The caller must have <code>projects:read</code> scope.
      </p>

      <h3 className="t-h3" style={{ marginTop: 28, marginBottom: 12 }}>Path parameters</h3>
      <table className="params">
        <thead><tr><th>Name</th><th>Description</th></tr></thead>
        <tbody>
          <tr>
            <td>
              <span className="param-name">id</span>
              <span className="param-type">string</span>
              <span className="badge badge-danger" style={{ fontSize: 10, padding: "1px 6px", marginTop: 6, display: "inline-flex" }}>required</span>
            </td>
            <td>The project's unique identifier, e.g. <code>prj_2N4kQ</code>.</td>
          </tr>
        </tbody>
      </table>

      <h3 className="t-h3" style={{ marginTop: 28, marginBottom: 12 }}>Query parameters</h3>
      <table className="params">
        <thead><tr><th>Name</th><th>Description</th></tr></thead>
        <tbody>
          <tr>
            <td>
              <span className="param-name">expand</span>
              <span className="param-type">string[]</span>
            </td>
            <td>Comma-separated list of relations to expand. Supported: <code>builds</code>, <code>members</code>, <code>integrations</code>.</td>
          </tr>
          <tr>
            <td>
              <span className="param-name">include_archived</span>
              <span className="param-type">boolean</span>
            </td>
            <td>Default <code>false</code>. When <code>true</code>, includes archived projects.</td>
          </tr>
        </tbody>
      </table>

      <h3 className="t-h3" style={{ marginTop: 28, marginBottom: 12 }}>Returns</h3>
      <p style={{ fontSize: 15, lineHeight: 1.65 }}>
        A <a href="#"><code>Project</code></a> object on success. <code>404</code> if the project doesn't exist or the caller can't see it.
      </p>

      <Callout kind="info" title="Rate limit">
        120 req/min per API key. See <a href="#">rate limits</a>.
      </Callout>
    </main>

    {/* Right panel — request / response */}
    <aside style={{
      position: "sticky", top: "var(--docs-header-height)",
      height: "calc(100vh - var(--docs-header-height))", overflowY: "auto",
      padding: "36px 28px 60px",
      background: "var(--surface-2)",
    }}>
      <div className="t-caption" style={{ marginBottom: 10 }}>Request</div>
      <div className="codeblock" style={{ marginBottom: 22 }}>
        <div className="codeblock-header">
          <div className="codeblock-lang"><Icon name="terminal" size={13}/>curl</div>
          <div className="codeblock-actions">
            <button className="action-btn"><Icon name="copy" size={13}/></button>
          </div>
        </div>
        <pre className="codeblock-body" style={{ padding: "14px 16px", fontSize: 12.5 }}>
          <span className="tok-k">curl</span>{" "}<span className="tok-s">https://api.kotlin.dev/v1/projects/prj_2N4kQ</span> \{"\n"}
          {"  "}-H <span className="tok-s">"Authorization: Bearer $KEY"</span> \{"\n"}
          {"  "}-H <span className="tok-s">"Accept: application/json"</span>
        </pre>
      </div>

      <div className="t-caption" style={{ marginBottom: 10 }}>Response · 200 OK</div>
      <div className="codeblock">
        <div className="codeblock-header">
          <div className="codeblock-lang"><Icon name="code" size={13}/>json</div>
          <div className="codeblock-actions">
            <button className="action-btn"><Icon name="copy" size={13}/></button>
          </div>
        </div>
        <pre className="codeblock-body" style={{ padding: "14px 16px", fontSize: 12.5 }}>
          {"{\n"}
          {"  "}<span className="tok-s">"id"</span>: <span className="tok-s">"prj_2N4kQ"</span>,{"\n"}
          {"  "}<span className="tok-s">"name"</span>: <span className="tok-s">"backend-api"</span>,{"\n"}
          {"  "}<span className="tok-s">"runtime"</span>: <span className="tok-s">"kotlin-2.0.0"</span>,{"\n"}
          {"  "}<span className="tok-s">"region"</span>: <span className="tok-s">"eu-west-1"</span>,{"\n"}
          {"  "}<span className="tok-s">"status"</span>: <span className="tok-s">"live"</span>,{"\n"}
          {"  "}<span className="tok-s">"created_at"</span>: <span className="tok-s">"2025-08-14T09:21:00Z"</span>{"\n"}
          {"}"}
        </pre>
      </div>

      <button className="btn btn-primary" style={{ width: "100%", marginTop: 22 }}>
        <Icon name="play" size={14}/> Try it
      </button>
    </aside>
  </div>
);

window.ApiPage = ApiPage;
