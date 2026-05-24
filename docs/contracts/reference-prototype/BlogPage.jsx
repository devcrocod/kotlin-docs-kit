/* global React, Icon, Callout */

const BlogPage = () => (
  <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 32px 80px" }}>
    <nav className="crumbs" style={{ marginBottom: 18 }}>
      <a>Blog</a><span className="sep">/</span>
      <span className="current">Why we shipped K2</span>
    </nav>
    <span className="t-caption" style={{ color: "var(--color-primary)" }}>engineering · jan 14, 2026</span>
    <h1 className="t-display" style={{ marginTop: 12, fontSize: 44, lineHeight: 1.08 }}>
      Why we shipped K2 by default.
    </h1>
    <p style={{ fontSize: 18, color: "var(--fg-2)", lineHeight: 1.55, marginTop: 16, maxWidth: "62ch" }}>
      A four-year project to rewrite the Kotlin compiler from the ground up. Here's what it bought us, and what it took.
    </p>

    {/* Byline */}
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28, marginBottom: 36, paddingBottom: 24, borderBottom: "1px solid var(--border-1)" }}>
      <div style={{
        width: 40, height: 40, borderRadius: 999,
        background: "var(--kt-gradient)",
        color: "white", display: "grid", placeItems: "center",
        fontFamily: "var(--font-sans)", fontWeight: 600,
      }}>SA</div>
      <div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, color: "var(--fg-1)" }}>Stanislav Aslanyan</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-3)" }}>Tech lead, Kotlin compiler · 9 min read</div>
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
        <span className="tag">compiler</span>
        <span className="tag">k2</span>
      </div>
    </div>

    {/* Body */}
    <article className="docs-article">
      <p style={{ fontSize: 16 }}>
        When we started Kotlin in 2010, the compiler was a pragmatic choice — a parser that understood the syntax we'd designed, a type system that mostly worked, and a backend that emitted reasonable bytecode. It was good enough to ship 1.0 in 2016. By 2020 it was holding us back.
      </p>

      <h2 className="t-h2">The shape of the old compiler</h2>
      <p>The original frontend used a tree-walking analyzer. Every pass — name resolution, type inference, smart-cast tracking — re-traversed the AST. For small files this was fine. For the 4-million-line monorepo at one of our enterprise customers, a clean build took 40 minutes.</p>

      <Callout kind="info" title="Old frontend, in numbers">
        ~600k lines of compiler code. ~7 distinct passes over the AST. Worst-case cold-cache build on Spring's codebase: 6m 12s.
      </Callout>

      <h2 className="t-h2">What K2 changes</h2>
      <p>The new frontend, K2, replaces the tree-walking design with a typed IR ("FIR") and lazy resolution. Three things fell out of that:</p>
      <ol>
        <li><strong>Faster cold builds.</strong> Resolution is incremental at the declaration level, not the file level.</li>
        <li><strong>Better diagnostics.</strong> Errors carry the source range of the offending expression, not the enclosing statement.</li>
        <li><strong>A foundation for compiler plugins.</strong> Plugins now see the same FIR the compiler does — no shadow IR.</li>
      </ol>

      <div className="codeblock">
        <div className="codeblock-header">
          <div className="codeblock-lang"><Icon name="code" size={13}/>kotlin</div>
          <div className="codeblock-actions">
            <button className="action-btn"><Icon name="copy" size={13}/></button>
          </div>
        </div>
        <pre className="codeblock-body" style={{ padding: "16px 20px" }}>
          <span className="tok-c">// K2 produces a precise diagnostic here.</span>{"\n"}
          <span className="tok-k">fun</span>{" "}<span className="tok-f">demo</span>(x: <span className="tok-t">Int</span>?){" {\n"}
          {"  "}<span className="tok-k">if</span> (x != <span className="tok-k">null</span>) {"{\n"}
          {"    "}println(x.<span className="tok-f">inv</span>())  <span className="tok-c">// smart-cast survives across the lambda</span>{"\n"}
          {"    "}list.<span className="tok-f">forEach</span> {"{ "}println(x.<span className="tok-f">inv</span>()) {"}\n"}
          {"  "}{"}\n"}
          {"}"}
        </pre>
      </div>

      <Callout kind="tip" title="Try the new diagnostics">
        Run <code>kotlinc -X-use-k2 your.kt</code> on a sample with a tricky null-check chain. The error spans are noticeably tighter.
      </Callout>

      <h2 className="t-h2">What it cost</h2>
      <p>Four years. Roughly 40 engineers across compiler, IDE, and tooling. A long and patient series of preview releases starting in 1.7 — each one taking real-world feedback and rolling it into the next. Three deprecations we eventually walked back.</p>

      <Callout kind="warning" title="Migration is mostly automatic">
        Most projects rebuild without changes. The breakages we couldn't avoid are listed in the <a href="#">2.0 migration guide</a>. Run <code>kotlin migrate</code> to apply mechanical fixes.
      </Callout>

      <h2 className="t-h2">What's next</h2>
      <p>The compiler is now small enough to iterate on quickly. Next on the list: Wasm GC as a stable target, expanded compose-stable analysis, and giving plugin authors the ability to add custom diagnostics. We'd love your feedback on any of it.</p>

      <Callout kind="success" title="Get involved">
        Join us on the <a href="#">Kotlin Slack</a> in #compiler, or open an issue in <a href="#">YouTrack</a>. We read everything.
      </Callout>
    </article>
  </main>
);

window.BlogPage = BlogPage;
