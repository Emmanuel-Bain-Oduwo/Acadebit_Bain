"use client";
import { useStore } from "@/store";
import { PORTALS } from "@/lib/data";
import { ArrowRight, Phone, Globe, Shield, BookOpen, BarChart3, Zap } from "lucide-react";

const STATS = [
  { value: "1,847", label: "Schools", icon: "🏫" },
  { value: "412K+", label: "Learners", icon: "🎓" },
  { value: "98.2%", label: "NEMIS Sync", icon: "🔄" },
  { value: "CBC", label: "100% Aligned", icon: "✅" },
  { value: "M-Pesa", label: "Integrated", icon: "📱" },
  { value: "Offline", label: "First Design", icon: "⚡" },
];

const WHY = [
  { icon: <BookOpen size={22} />, color: "#1a3365", bg: "#e8edf4", title: "CBC Aligned", desc: "Full EE/ME/AE/BE competency tracking across all strands and subjects" },
  { icon: <Shield size={22} />, color: "#16a34a", bg: "#dcfce7", title: "SafetyCore™", desc: "Biometric gates, real-time headcount, instant parent alerts" },
  { icon: <Phone size={22} />, color: "#f5a623", bg: "#fef3dc", title: "M-Pesa Native", desc: "Fee collection, shop payments, vendor settlements — all via M-Pesa" },
  { icon: <Globe size={22} />, color: "#4f46e5", bg: "#f5f3ff", title: "GovBridge™", desc: "One-click NEMIS, MoE, and KNEC report generation" },
  { icon: <Zap size={22} />, color: "#0d9488", bg: "#f0fdfa", title: "Offline First", desc: "Full functionality even without internet — syncs when reconnected" },
  { icon: <BarChart3 size={22} />, color: "#ec4899", bg: "#fdf2f8", title: "AI Insights", desc: "At-risk learner alerts, smart timetabling, auto lesson plans" },
];

const TESTIMONIALS = [
  {
    name: "Mr. Samuel Kariuki",
    role: "Principal, Mwangaza Junior Academy",
    text: "Acadebit transformed how we manage our school. Fee collection is seamless with M-Pesa and parents get instant updates. Absolutely brilliant!",
    rating: 5,
    avatar: "👨‍💼",
  },
  {
    name: "Ms. Grace Achieng",
    role: "Teacher, CBC Grade 8",
    text: "The AI Teacher Studio saves me 9+ hours a week on lesson planning. I can generate full lesson plans, tests and flashcards in seconds.",
    rating: 5,
    avatar: "👩‍🏫",
  },
  {
    name: "Mary Wanjiku",
    role: "Parent, Mwangaza Junior Academy",
    text: "I can track Brian's attendance, pay fees, and message his teacher — all from my phone. This is exactly what Kenyan schools needed!",
    rating: 5,
    avatar: "👩‍👧",
  },
];

const SERVICES = [
  { icon: "📋", label: "CBC Management" },
  { icon: "💳", label: "Fee Collection" },
  { icon: "🛡️", label: "Campus Safety" },
  { icon: "🤖", label: "AI Tools" },
  { icon: "📱", label: "Parent Portal" },
  { icon: "🏛️", label: "Gov Reports" },
  { icon: "🛒", label: "School Shop" },
  { icon: "📊", label: "Analytics" },
];

export default function Landing() {
  const { setPortal } = useStore();

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{
        background: "#fff",
        borderBottom: "1px solid var(--border)",
        position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 2px 12px rgba(26,51,101,.07)",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", gap: 16 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 24 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "var(--navy)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: 18,
            }}>A</div>
            <div>
              <div style={{ color: "var(--navy)", fontWeight: 800, fontSize: 15, lineHeight: 1 }}>Acadebit</div>
              <div style={{ color: "var(--muted)", fontSize: 9, letterSpacing: "0.1em" }}>KENYA SCHOOL OS</div>
            </div>
          </div>

          {/* Links */}
          <div className="hidden md:flex" style={{ gap: 4, flex: 1 }}>
            {["Portals", "Features", "Schools", "Pricing", "Contact"].map((l) => (
              <button key={l} style={{ background: "none", border: "none", padding: "6px 12px", color: "var(--muted)", fontSize: 13, fontWeight: 600, cursor: "pointer", borderRadius: 6, fontFamily: "inherit" }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "var(--navy)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "var(--muted)"}
              >{l}</button>
            ))}
          </div>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: 13 }} className="hidden md:flex">
              <Phone size={14} />
              <span>+254 700 123 456</span>
            </div>
            <button onClick={() => setPortal("principal")} className="btn btn-navy" style={{ fontSize: 13, padding: "8px 18px" }}>
              Get Started →
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #fff 60%, #e8edf4 100%)", borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
        <div className="hero-grid" style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px 0" }}>
          <div className="hero-text" style={{ paddingBottom: 60, maxWidth: 600 }}>
            <div className="section-label" style={{ marginBottom: 20 }}>⭐ Your School&apos;s Digital Backbone</div>

            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, color: "var(--navy)", lineHeight: 1.15, marginBottom: 20 }}>
              Kenya&apos;s Complete<br />
              <span style={{ color: "var(--yellow)" }}>School Operating</span><br />
              System
            </h1>

            <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.75, marginBottom: 32, maxWidth: 480 }}>
              Acadebit serves 8 user types across 17 modules — principals, teachers, students, parents, boards, and the Ministry of Education. CBC-aligned, M-Pesa integrated, offline-first.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
              <button onClick={() => setPortal("principal")} className="btn btn-navy" style={{ fontSize: 14, padding: "12px 24px" }}>
                Explore Portals →
              </button>
              <button onClick={() => setPortal("shop")} className="btn btn-outline" style={{ fontSize: 14, padding: "12px 24px" }}>
                🛒 School Shop
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex" }}>
                {["👨‍🏫", "👩‍💼", "👦", "👩‍👧"].map((e, i) => (
                  <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--bg2)", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginLeft: i > 0 ? -10 : 0 }}>{e}</div>
                ))}
              </div>
              <div>
                <div style={{ color: "var(--navy)", fontWeight: 700, fontSize: 14 }}>1,847+ Schools Trust Acadebit</div>
                <div style={{ display: "flex", gap: 2 }}>{"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "#f5a623", fontSize: 13 }}>{s}</span>)}</div>
              </div>
            </div>
          </div>

          {/* Hero Card — Portal Picker */}
          <div className="hero-card" style={{
            background: "#fff",
            borderRadius: "16px 16px 0 0",
            boxShadow: "0 -4px 40px rgba(26,51,101,.15)",
            padding: "28px 28px 0",
            width: 320,
            alignSelf: "flex-end",
          }}>
            <div style={{ background: "var(--navy)", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Select Your Portal</p>
              <p style={{ color: "rgba(255,255,255,.6)", fontSize: 11 }}>Choose your role to get started</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 20 }}>
              {PORTALS.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPortal(p.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px", borderRadius: 10,
                    background: "var(--bg)",
                    border: "1.5px solid var(--border)",
                    cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = p.color; el.style.background = "#fff"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border)"; el.style.background = "var(--bg)"; }}
                >
                  <span style={{ fontSize: 20, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, background: `${p.color}18` }}>{p.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "var(--text)", fontSize: 13, fontWeight: 700 }}>{p.name} Portal</div>
                    <div style={{ color: "var(--muted)", fontSize: 10 }}>{p.role}</div>
                  </div>
                  <ArrowRight size={14} color="var(--muted2)" />
                </button>
              ))}
              <button
                onClick={() => setPortal("shop")}
                style={{ background: "var(--yellow)", color: "#fff", border: "none", borderRadius: 10, padding: "11px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
              >
                + View All 8 Portals
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="stats-bar">
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "18px 24px", display: "flex", flexWrap: "wrap", justifyContent: "space-around", gap: 16 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <div>
                <div style={{ color: "var(--yellow)", fontWeight: 800, fontSize: 17 }}>{s.value}</div>
                <div style={{ color: "rgba(255,255,255,.65)", fontSize: 11 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PORTAL GRID */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="section-label" style={{ marginBottom: 12, margin: "0 auto 12px" }}>8 Dedicated Portals</div>
          <h2 style={{ color: "var(--navy)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, marginBottom: 10 }}>One Platform, Every Role</h2>
          <p style={{ color: "var(--muted)", fontSize: 15, maxWidth: 500, margin: "0 auto" }}>Each user type gets a personalised workspace built for their specific needs</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))", gap: 16 }}>
          {PORTALS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPortal(p.id)}
              className="card card-hover"
              style={{ textAlign: "left", border: "1.5px solid var(--border)", position: "relative", overflow: "hidden", padding: "22px", fontFamily: "inherit" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = p.color; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
            >
              {/* Top color bar */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: p.color, borderRadius: "14px 14px 0 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${p.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  {p.icon}
                </div>
                <span style={{ background: `${p.color}15`, color: p.color, borderRadius: 100, padding: "3px 10px", fontSize: 10, fontWeight: 700 }}>{p.role}</span>
              </div>

              <h3 style={{ color: "var(--navy)", fontSize: 16, fontWeight: 800, marginBottom: 6 }}>{p.name} Portal</h3>
              <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>{p.desc}</p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
                {p.views.slice(0, 3).map((v) => (
                  <span key={v.id} style={{ background: "var(--bg2)", color: "var(--muted)", borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 500 }}>
                    {v.icon} {v.label}
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6, color: p.color, fontWeight: 700, fontSize: 13 }}>
                Open Portal <ArrowRight size={14} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* WHY ACADEBIT */}
      <section style={{ background: "var(--navy)", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,166,35,.15)", color: "var(--yellow)", border: "1px solid rgba(245,166,35,.3)", borderRadius: 100, padding: "4px 14px", fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
              ✦ Why Choose Acadebit?
            </div>
            <h2 style={{ color: "#fff", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, marginBottom: 10 }}>Built for Kenyan Schools</h2>
            <p style={{ color: "rgba(255,255,255,.6)", fontSize: 15, maxWidth: 500, margin: "0 auto" }}>Every feature is designed with Kenyan school realities in mind</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: 16 }}>
            {WHY.map((w, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "22px", transition: "all 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.1)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.06)"; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: w.bg, display: "flex", alignItems: "center", justifyContent: "center", color: w.color, marginBottom: 14 }}>
                  {w.icon}
                </div>
                <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{w.title}</h3>
                <p style={{ color: "rgba(255,255,255,.6)", fontSize: 13, lineHeight: 1.6 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="section-label" style={{ margin: "0 auto 12px" }}>What Schools Say</div>
          <h2 style={{ color: "var(--navy)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800 }}>Trusted by Kenyan Schools</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="card" style={{ position: "relative" }}>
              <div style={{ fontSize: 36, color: "var(--yellow)", fontFamily: "Georgia, serif", lineHeight: 1, marginBottom: 12 }}>&ldquo;</div>
              <p style={{ color: "var(--text-2)", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{t.text}</p>
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                {"★★★★★".split("").map((s, j) => <span key={j} style={{ color: "var(--yellow)", fontSize: 14 }}>{s}</span>)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{t.avatar}</div>
                <div>
                  <p style={{ color: "var(--navy)", fontWeight: 700, fontSize: 13 }}>{t.name}</p>
                  <p style={{ color: "var(--muted)", fontSize: 11 }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES STRIP */}
      <section style={{ background: "#fff", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 16 }}>
          {SERVICES.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
              <span style={{ color: "var(--text-2)", fontWeight: 600, fontSize: 13 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: "linear-gradient(135deg, var(--navy), #2a4a8a)", padding: "56px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <span style={{ fontSize: 36 }}>🎓</span>
          <h2 style={{ color: "#fff", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, margin: "12px 0 12px" }}>
            Let Acadebit Power Your School
          </h2>
          <p style={{ color: "rgba(255,255,255,.7)", fontSize: 15, marginBottom: 28 }}>
            Join 1,847 schools already using Acadebit. CBC-compliant, M-Pesa ready, offline-first.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPortal("principal")} className="btn btn-yellow" style={{ fontSize: 14, padding: "13px 28px" }}>
              Get Started Free →
            </button>
            <button onClick={() => setPortal("shop")} style={{ background: "rgba(255,255,255,.15)", border: "1.5px solid rgba(255,255,255,.3)", borderRadius: 100, padding: "13px 28px", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              🛒 Visit School Shop
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--navy-dark)", color: "rgba(255,255,255,.7)", padding: "40px 24px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="footer-grid">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--yellow)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16 }}>A</div>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>Acadebit</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 260 }}>Kenya&apos;s complete school operating system — CBC-aligned, M-Pesa integrated, offline-first.</p>
              <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                {["📘", "🐦", "📺", "💼"].map((e, i) => (
                  <div key={i} style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>{e}</div>
                ))}
              </div>
            </div>
            {[
              { title: "Quick Links", items: ["About Us", "Features", "Pricing", "Schools", "Blog"] },
              { title: "Portals", items: ["Principal", "Teacher", "Student", "Parent", "BOM"] },
              { title: "Contact", items: ["📞 +254 700 123 456", "✉️ info@acadebit.ke", "📍 Nairobi, Kenya", "GovBridge™ Support", "NEMIS Helpline"] },
            ].map((col) => (
              <div key={col.title}>
                <p style={{ color: "#fff", fontWeight: 700, marginBottom: 12, fontSize: 13 }}>{col.title}</p>
                {col.items.map((item) => (
                  <div key={item} style={{ fontSize: 12, marginBottom: 8, cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "#fff"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,.7)"}
                  >{item}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12 }}>© 2026 Acadebit. All Rights Reserved.</span>
            <span style={{ fontSize: 12 }}>Dream · Plan · Build · Achieve 🎯</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
