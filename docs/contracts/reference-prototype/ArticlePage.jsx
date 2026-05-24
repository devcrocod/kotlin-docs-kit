/* global React, Icon, Sidebar, TOC, Callout */
const { useState } = React;

const tocItems = [
  { id: "create-project", t: "Create a project" },
  { id: "add-route",      t: "Add a route" },
  { id: "path-params",    t: "Path parameters", nested: true },
  { id: "queries",        t: "Query strings",   nested: true },
  { id: "run-locally",    t: "Run locally" },
  { id: "next",           t: "What's next" },
];

const ArticlePage = ({ active, onPick }) => {
  const [tocActive, setTocActive] = useState("add-route");

  return (
    <div className="docs-shell">
      <aside className="docs-shell-side">
        <Sidebar active={active} onPick={onPick}/>
      </aside>

      <main className="docs-shell-main">
        <article className="docs-article">
          <nav className="crumbs" style={{ marginBottom: 18 }}>
            <a>Docs</a><span className="sep">/</span>
            <a>Getting started</a><span className="sep">/</span>
            <span className="current">Quickstart</span>
          </nav>

          <h1 className="t-h1" style={{ marginBottom: 10 }}>Quickstart</h1>
          <p style={{ fontSize: 17, color: "var(--fg-2)", lineHeight: 1.55, marginBottom: 8 }}>
            Build a working Kotlin server in five minutes. By the end you'll have a route that returns JSON, hot reload running locally, and a deploy-ready binary on disk.
          </p>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 32 }}>
            <span className="badge badge-success"><span className="dot"></span>5 min</span>
            <span className="badge"><span className="dot"></span>beginner</span>
            <span className="tag" style={{ marginLeft: 6 }}>last updated 3d ago</span>
          </div>

          {/* Section 1 */}
          <h2 id="create-project" className="t-h2">Create a project</h2>
          <p>Use the Kotlin CLI to scaffold a new project. It creates a single-file server, a build script, and a sample test.</p>

          <div className="codeblock">
            <div className="codeblock-header">
              <div className="codeblock-lang"><Icon name="terminal" size={13}/>bash</div>
              <div className="codeblock-actions">
                <button className="action-btn"><Icon name="copy" size={13}/>copy</button>
              </div>
            </div>
            <pre className="codeblock-body" style={{ padding: "16px 18px" }}>
              <span className="tok-k">$</span> kotlin init my-api{"\n"}
              <span className="tok-k">$</span> cd my-api && kotlin dev{"\n\n"}
              <span className="tok-c">✓ listening on http://localhost:8080</span>
            </pre>
          </div>

          <Callout kind="info" title="Requires Kotlin 1.9.20 or later">
            Older versions work but you'll miss out on K2 incremental compilation. Run <code>kotlinc -version</code> to check.
          </Callout>

          {/* Section 2 */}
          <h2 id="add-route" className="t-h2">Add a route</h2>
          <p>Routes live as top-level functions. Drop a file in <code>src/routes/</code> and the CLI picks it up.</p>

          {/* Multi-tab code block */}
          <div className="codeblock">
            <div className="codeblock-header">
              <div className="codeblock-tabs">
                <button className="codeblock-tab is-active">
                  <Icon name="code" size={13} className="file-icon"/>
                  Routes.kt
                </button>
                <button className="codeblock-tab">
                  <Icon name="code" size={13} className="file-icon"/>
                  User.kt
                </button>
                <button className="codeblock-tab">
                  <Icon name="file" size={13} className="file-icon"/>
                  build.gradle.kts
                </button>
              </div>
              <div className="codeblock-actions">
                <button className="action-btn"><Icon name="copy" size={13}/>copy</button>
              </div>
            </div>
            <pre className="codeblock-body" style={{ padding: "16px 18px" }}>
              <span className="tok-c">// src/routes/Routes.kt</span>{"\n"}
              <span className="tok-k">fun</span>{" "}<span className="tok-f">Routing</span>.<span className="tok-f">users</span>(){" {\n"}
              {"  "}<span className="tok-f">get</span>(<span className="tok-s">"/users/{"{id}"}"</span>){" {\n"}
              {"    "}<span className="tok-k">val</span>{" "}id = call.<span className="tok-f">params</span>.<span className="tok-f">required</span>(<span className="tok-s">"id"</span>){"\n"}
              {"    "}call.<span className="tok-f">respond</span>(userRepo.<span className="tok-f">find</span>(id)){"\n"}
              {"  "}{"}\n"}
              {"}"}
            </pre>
          </div>

          <h3 id="path-params" className="t-h3">Path parameters</h3>
          <p>Path parameters are available via <code>call.params</code>. They're typed strings; use <code>.toInt()</code> or your parser of choice to convert.</p>

          <Callout kind="tip" title="Pro tip">
            Use <code>call.params.intOrNull("id")</code> to skip the conversion and return null on bad input — pairs nicely with <code>?.let</code>.
          </Callout>

          <h3 id="queries" className="t-h3">Query strings</h3>
          <p>Query string values live on <code>call.query</code>. Multi-value keys come back as lists.</p>

          <Callout kind="success" title="Hot reload is on by default">
            Save the file. The dev server reloads without dropping connections.
          </Callout>

          {/* Section 3 */}
          <h2 id="run-locally" className="t-h2">Run locally</h2>
          <p>Open <code>http://localhost:8080/users/1</code>. You should see a JSON response. If you don't, check the terminal — compile errors show up there as they happen.</p>

          <Callout kind="warning" title="Port already in use?">
            Set <code>KOTLIN_PORT=3000</code>, or pass <code>--port 3000</code> to the CLI.
          </Callout>

          <Callout kind="danger" title="Don't ship dev credentials">
            The <code>kotlin init</code> template includes a placeholder API key in <code>.env</code>. Replace it before deploying or rotate from your provider's dashboard.
          </Callout>

          <Callout kind="important" title="Pin your Kotlin version">
            Add <code>kotlin.version=2.0.0</code> to <code>gradle.properties</code> so teammates and CI build against the same compiler. Floating versions cause subtle drift.
          </Callout>

          <Callout kind="experimental" title="K2 IDE plugin">
            The K2-based IntelliJ plugin is available in 2026.1 EAP. Faster indexing and more accurate inspections, but expect occasional false positives. Toggle it under <em>Settings → Kotlin → K2 mode</em>.
          </Callout>

          <Callout kind="deprecated" title="Old reflection APIs">
            <code>kotlin.reflect.full.memberProperties()</code> on JVM is scheduled for removal in 3.0. Use <code>kClass.declaredMemberProperties</code> instead.
          </Callout>

          {/* Section 4 */}
          <h2 id="next" className="t-h2">What's next</h2>
          <div className="card-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <a className="k-card is-hoverable" onClick={() => onPick("routing")}>
              <div className="card-icon"><Icon name="code" size={18}/></div>
              <h3 className="card-title">Routing</h3>
              <p className="card-body">Path params, query strings, nested routers, and middleware.</p>
              <span className="card-arrow">Guide · 12 min →</span>
            </a>
            <a className="k-card is-hoverable" onClick={() => onPick("auth")}>
              <div className="card-icon" style={{ background: "var(--color-accent-soft)", color: "var(--color-accent)" }}>
                <Icon name="shield" size={18}/>
              </div>
              <h3 className="card-title">Authentication</h3>
              <p className="card-body">API keys, OAuth, JWT — built into the type system.</p>
              <span className="card-arrow">Guide · 8 min →</span>
            </a>
          </div>

          {/* Pager */}
          <div className="docs-pager">
            <a className="pager-link prev" onClick={() => onPick("install")}>
              <span className="pager-direction">← Previous</span>
              <span className="pager-title">Installation</span>
            </a>
            <a className="pager-link next" onClick={() => onPick("structure")}>
              <span className="pager-direction">Next →</span>
              <span className="pager-title">Project structure</span>
            </a>
          </div>

          {/* Edit footer */}
          <div style={{ marginTop: 24, fontSize: 13, color: "var(--fg-2)", textAlign: "right" }}>
            <a style={{ color: "var(--fg-2)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Icon name="edit" size={13}/> Edit this page on GitHub
            </a>
          </div>
        </article>
      </main>

      <aside className="docs-shell-toc">
        <TOC items={tocItems} activeId={tocActive} onPick={setTocActive}/>
      </aside>
    </div>
  );
};

window.ArticlePage = ArticlePage;
