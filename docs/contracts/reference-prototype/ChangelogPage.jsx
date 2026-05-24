/* global React, Icon, Callout */

const releases = [
  {
    version: "2.0.0",
    date: "2026-01-14",
    tag: "Major",
    tagKind: "purple",
    intro: "K2 compiler ships as default. New compose-stable analysis, smarter incremental builds, and a string templates rework.",
    items: [
      { kind: "feature", t: "K2 compiler is now the default", desc: "Up to 2× faster incremental builds on large codebases." },
      { kind: "feature", t: "String templates with expressions", desc: "Embed full expressions inline: \"${user.name.uppercase()}\"." },
      { kind: "fix",     t: "Resolver: rare crash with type aliases", desc: "Affects nested generic aliases under contracts." },
      { kind: "break",   t: "Removed deprecated APIs",                desc: "kotlin.experimental.* moved to kotlin.* with stable contracts." },
    ],
  },
  {
    version: "1.9.20",
    date: "2025-11-02",
    tag: "Minor",
    tagKind: "info",
    intro: "Improved Native bundling on Apple Silicon, expanded coroutines test utilities.",
    items: [
      { kind: "feature", t: "Native: 30% smaller binaries on arm64", desc: "Dead-code elimination across module boundaries." },
      { kind: "feature", t: "TestCoroutineScheduler.runTimeout()",   desc: "Cleaner timeouts in suspending tests." },
      { kind: "fix",     t: "JS: source maps for inline functions",   desc: "Stack traces now point to original .kt files." },
    ],
  },
  {
    version: "1.9.10",
    date: "2025-09-18",
    tag: "Patch",
    tagKind: null,
    intro: "Bug fixes for the new sealed-interface inference and a Gradle metadata issue.",
    items: [
      { kind: "fix", t: "Sealed interfaces: incorrect when-exhaustiveness with type projections", desc: "Reported in #KT-58392." },
      { kind: "fix", t: "Gradle: missing transitive metadata for MPP libraries",                  desc: "Affects projects using JitPack." },
    ],
  },
];

const kindMap = {
  feature: { lab: "Added",   c: "badge-success" },
  fix:     { lab: "Fixed",   c: "badge-info" },
  break:   { lab: "Breaking", c: "badge-danger" },
};

const ChangelogPage = () => (
  <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 32px 80px" }}>
    <span className="t-caption" style={{ color: "var(--color-primary)" }}>changelog</span>
    <h1 className="t-display" style={{ marginTop: 12, fontSize: 44 }}>What's new in Kotlin</h1>
    <p style={{ fontSize: 17, color: "var(--fg-2)", lineHeight: 1.55, marginTop: 12, marginBottom: 14, maxWidth: "60ch" }}>
      Every release, summarized. <a href="#">Subscribe to the RSS feed</a> or follow{" "}
      <a href="#">@kotlin</a> for announcements.
    </p>
    <button className="btn btn-secondary btn-sm"><Icon name="rss" size={13}/> Subscribe</button>

    <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 48 }}>
      {releases.map(r => (
        <section key={r.version}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
            <h2 className="t-h2" style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 22 }}>{r.version}</h2>
            <span className={"badge " + (r.tagKind ? "badge-" + r.tagKind : "")}>{r.tag}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-3)", marginLeft: 4 }}>{r.date}</span>
          </div>
          <p style={{ fontSize: 15, color: "var(--fg-2)", lineHeight: 1.6, marginBottom: 16 }}>{r.intro}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {r.items.map((it, i) => {
              const meta = kindMap[it.kind];
              return (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: "90px 1fr",
                  gap: 14,
                  padding: "10px 0",
                  borderTop: "1px solid var(--border-1)",
                  alignItems: "baseline",
                }}>
                  <span className={"badge " + meta.c} style={{ justifySelf: "start" }}>{meta.lab}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 14.5, fontWeight: 500, color: "var(--fg-1)" }}>{it.t}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: "var(--fg-2)", marginTop: 3, lineHeight: 1.55 }}>{it.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  </main>
);

window.ChangelogPage = ChangelogPage;
