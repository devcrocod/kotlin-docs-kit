/* global React, Icon */

const HomePage = ({ onPick }) => (
  <main>
    {/* Hero */}
    <section className="docs-hero" style={{ padding: "72px 32px 60px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 48, alignItems: "center" }}>
        <div>
          <span className="t-caption" style={{ color: "var(--color-primary)", textTransform: "uppercase" }}>v2.0.0 · ships K2 by default</span>
          <h1 className="t-display" style={{ marginTop: 14, fontSize: 56, lineHeight: 1.05 }}>
            Concise. Multi-platform.{" "}
            <span className="hero-grad-text">Fun.</span>
          </h1>
          <p style={{ fontSize: 18, color: "var(--fg-2)", lineHeight: 1.55, marginTop: 18, maxWidth: 460 }}>
            Build server, web, mobile, and desktop apps with one language. The Kotlin docs theme — Mintlify layout, JetBrains-quality code blocks.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
            <button className="btn btn-primary btn-lg" onClick={() => onPick("quickstart")}>
              Quickstart <Icon name="arrowR" size={14}/>
            </button>
            <button className="btn btn-secondary btn-lg">
              <Icon name="play" size={14}/> Try online
            </button>
          </div>
        </div>

        {/* Hero code panel */}
        <div className="codeblock" style={{ margin: 0, boxShadow: "var(--shadow-md)" }}>
          <div className="codeblock-header">
            <div className="codeblock-tabs">
              <button className="codeblock-tab is-active">
                <Icon name="code" size={13} className="file-icon"/>
                Hello.kt
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
          <pre className="codeblock-body" style={{ padding: "16px 20px", fontSize: 13 }}>
            <span className="tok-c">// Top-level function. No class boilerplate.</span>{"\n"}
            <span className="tok-k">fun</span>{" "}<span className="tok-f">main</span>(){" {\n"}
            {"  "}<span className="tok-k">val</span>{" "}name = <span className="tok-s">"Kotlin"</span>{"\n"}
            {"  "}<span className="tok-f">println</span>(<span className="tok-s">"Hello, $name!"</span>){"\n"}
            {"}\n\n"}
            <span className="tok-c">// Sealed types · null safety · coroutines built-in.</span>{"\n"}
            <span className="tok-k">suspend fun</span>{" "}<span className="tok-f">fetchUser</span>(id: <span className="tok-t">String</span>): <span className="tok-t">User</span>? = withContext(<span className="tok-t">IO</span>) {"{\n"}
            {"  "}repo.<span className="tok-f">find</span>(id){"\n"}
            {"}"}
          </pre>
        </div>
      </div>
    </section>

    {/* Card grid */}
    <section style={{ maxWidth: 960, margin: "48px auto 32px", padding: "0 32px" }}>
      <h2 className="t-h2" style={{ marginBottom: 8 }}>Start here</h2>
      <p style={{ fontSize: 15, color: "var(--fg-2)", marginBottom: 24 }}>Four ways into the docs. Pick the one that matches what you're trying to do.</p>
      <div className="card-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          { i: "zap",     h: "Quickstart",   p: "Run your first Kotlin program in five minutes.", k: "quickstart" },
          { i: "book",    h: "Concepts",     p: "Null safety, coroutines, sealed types, multiplatform.", k: "intro" },
          { i: "code",    h: "API reference", p: "Standard library + framework APIs.", k: "api" },
          { i: "layers",  h: "Tutorials",    p: "Build a server, an Android app, a CLI tool.", k: "intro" },
        ].map((c, i) => (
          <a key={i} className="k-card is-hoverable" onClick={() => onPick(c.k)}>
            <div className="card-icon"><Icon name={c.i} size={18}/></div>
            <h3 className="card-title">{c.h}</h3>
            <p className="card-body">{c.p}</p>
            <span className="card-arrow">Read →</span>
          </a>
        ))}
      </div>
    </section>

    {/* Platform pillars */}
    <section style={{ maxWidth: 960, margin: "32px auto 64px", padding: "0 32px" }}>
      <h2 className="t-h2" style={{ marginBottom: 8 }}>One language. Every platform.</h2>
      <p style={{ fontSize: 15, color: "var(--fg-2)", marginBottom: 24 }}>Share code where it makes sense; write platform-specific code where it matters.</p>
      <div className="card-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {[
          { i: "shield",  h: "Server",   p: "Spring, Ktor, http4k. Native binary, JVM jar, or container.", tag: "JVM" },
          { i: "package", h: "Mobile",   p: "Compose Multiplatform for iOS + Android from a single codebase.", tag: "Multiplatform" },
          { i: "layers",  h: "Web",      p: "Kotlin/JS with React, or Compose for Web.", tag: "JS / Wasm" },
        ].map((c, i) => (
          <div key={i} className="k-card">
            <div className="card-icon" style={{
              background: i === 0 ? "var(--color-primary-soft)" :
                          i === 1 ? "var(--color-accent-soft)" :
                                    "var(--color-info-soft)",
              color: i === 0 ? "var(--color-primary)" :
                     i === 1 ? "var(--color-accent)" :
                               "var(--color-info)",
            }}>
              <Icon name={c.i} size={18}/>
            </div>
            <h3 className="card-title">{c.h}</h3>
            <p className="card-body">{c.p}</p>
            <span className="tag" style={{ marginTop: 4, alignSelf: "flex-start" }}>{c.tag}</span>
          </div>
        ))}
      </div>
    </section>
  </main>
);

window.HomePage = HomePage;
