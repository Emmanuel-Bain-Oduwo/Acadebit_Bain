"use client";
import { useStore } from "@/store";
import { PORTALS } from "@/lib/data";
import { ArrowRight, Sun, Moon } from "lucide-react";

const STATS = ["155+ Features", "17 Modules", "8 Portals", "CBC 100%", "M-Pesa", "Offline First"];

export default function Landing() {
  const { setPortal, theme, toggleTheme } = useStore();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "var(--card)", borderBottom: "1px solid var(--border)",
        padding: "0 24px", height: 56,
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, var(--green), var(--blue))",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: 16,
          }}>A</div>
          <div>
            <div style={{ color: "var(--text)", fontWeight: 800, fontSize: 14, lineHeight: 1 }}>Acadebit</div>
            <div style={{ color: "var(--text-muted)", fontSize: 8, letterSpacing: "0.12em" }}>KENYA SCHOOL OS</div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div className="hidden md:flex" style={{ gap: 8 }}>
          {PORTALS.slice(0, 4).map((p) => (
            <button
              key={p.id}
              onClick={() => setPortal(p.id)}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: 100,
                padding: "4px 12px",
                color: "var(--text-muted)",
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = p.color; (e.currentTarget as HTMLElement).style.color = p.color; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
            >
              {p.icon} {p.name}
            </button>
          ))}
        </div>

        <button onClick={toggleTheme} style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </nav>

      {/* Hero */}
      <section style={{ padding: "80px 24px 60px", textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
        <div className="badge" style={{ background: "rgba(34,197,94,.1)", color: "var(--green)", border: "1px solid rgba(34,197,94,.2)", marginBottom: 20, display: "inline-flex" }}>
          ✦ Kenya&apos;s Complete School OS · 17 Modules · 155+ Features
        </div>

        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
          <span className="gradient-text">Every person.</span><br />
          <span className="gradient-text">Every process.</span><br />
          <span className="gradient-text">One platform.</span>
        </h1>

        <p style={{ color: "var(--text-muted)", fontSize: 17, lineHeight: 1.7, maxWidth: 600, margin: "0 auto 36px" }}>
          Acadebit is Kenya&apos;s complete school operating system — CBC-aligned, M-Pesa integrated, offline-first. Serving principals, teachers, students, parents, boards, and the Ministry of Education in one unified platform.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 60 }}>
          {STATS.map((s, i) => (
            <div key={i} className="badge" style={{ background: "var(--card2)", color: "var(--text)", border: "1px solid var(--border)", fontSize: 12 }}>
              {s}
            </div>
          ))}
        </div>
      </section>

      {/* Portal Grid */}
      <section style={{ padding: "0 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ color: "var(--text)", fontSize: 20, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Choose Your Portal</h2>
        <p style={{ color: "var(--text-muted)", textAlign: "center", marginBottom: 32, fontSize: 14 }}>Select your role to access your personalised workspace</p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
        }}>
          {PORTALS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPortal(p.id)}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setPortal(p.id)}
              style={{
                background: "var(--card)",
                border: `1px solid var(--border)`,
                borderRadius: "var(--radius)",
                padding: 20,
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-4px)";
                el.style.boxShadow = `0 8px 32px ${p.color}30`;
                el.style.borderColor = p.color + "60";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "";
                el.style.boxShadow = "";
                el.style.borderColor = "var(--border)";
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `${p.color}15`,
                  border: `1px solid ${p.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, transition: "transform 0.2s",
                }}>
                  {p.icon}
                </div>
                <ArrowRight size={16} style={{ color: "var(--text-muted)" }} />
              </div>

              <div className="badge" style={{ background: `${p.color}15`, color: p.color, marginBottom: 8, fontSize: 10 }}>{p.role}</div>
              <h3 style={{ color: "var(--text)", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{p.name}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: 12, lineHeight: 1.5 }}>{p.desc}</p>

              <div style={{ marginTop: 14, display: "flex", gap: 4, flexWrap: "wrap" }}>
                {p.views.map((v) => (
                  <span key={v.id} style={{ background: "var(--card2)", color: "var(--text-muted)", borderRadius: 4, padding: "2px 6px", fontSize: 10 }}>
                    {v.icon} {v.label}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Shop CTA */}
      <section style={{
        background: "linear-gradient(135deg, rgba(249,115,22,.1), rgba(249,115,22,.05))",
        border: "1px solid rgba(249,115,22,.2)",
        borderRadius: "var(--radius)",
        padding: 32,
        margin: "0 24px 60px",
        maxWidth: 1152,
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center",
      }}>
        <span style={{ fontSize: 32 }}>🛒</span>
        <h3 style={{ color: "var(--text)", fontSize: 20, fontWeight: 700, margin: "8px 0 6px" }}>Acadebit Shop</h3>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 16 }}>
          Textbooks, lab equipment & school uniforms — all payable via M-Pesa. Delivered to school or home.
        </p>
        <button
          onClick={() => setPortal("shop")}
          className="btn btn-primary"
          style={{ margin: "0 auto" }}
        >
          Browse Shop →
        </button>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "20px 24px", borderTop: "1px solid var(--border)", color: "var(--text-muted)", fontSize: 12 }}>
        © 2026 Acadebit — Kenya School OS · Term 2, 2026
      </footer>
    </div>
  );
}
