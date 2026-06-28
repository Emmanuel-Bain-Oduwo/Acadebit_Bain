"use client";

const TASKS = [
  { icon: "✅", subject: "English", topic: "Reading Comprehension", type: "Video · 12 min", status: "Done", color: "var(--green)" },
  { icon: "🔵", subject: "Maths", topic: "Quadratic Equations — Weekly Test", type: "Test · 20 min", status: "Now", color: "var(--purple)" },
  { icon: "⬜", subject: "Science", topic: "Photosynthesis Flashcards", type: "Flashcards · 8 min", status: "Pending", color: "var(--muted)" },
  { icon: "⬜", subject: "Kiswahili", topic: "Insha — AI Tutor Practice", type: "AI Tutor · 15 min", status: "Pending", color: "var(--muted)" },
  { icon: "⬜", subject: "Social Studies", topic: "Map Reading Notes", type: "Notes · 10 min", status: "Pending", color: "var(--muted)" },
];

const CBC_PROGRESS = [
  { subject: "Mathematics", pct: 74, label: "AE", trend: "+6%" },
  { subject: "English", pct: 82, label: "ME", trend: "+3%" },
  { subject: "Science", pct: 91, label: "EE", trend: "+8%" },
  { subject: "Kiswahili", pct: 67, label: "AE", trend: "-2%" },
  { subject: "Social Studies", pct: 88, label: "ME", trend: "+4%" },
];

const LEADERBOARD = [
  { rank: 1, name: "Cynthia Auma", score: 96, xp: 1840, me: false },
  { rank: 2, name: "Esther Wambua", score: 88, xp: 1720, me: false },
  { rank: 3, name: "Amina Njoroge", score: 82, xp: 1650, me: false },
  { rank: 4, name: "Brian Omondi (You)", score: 74, xp: 1480, me: true },
  { rank: 5, name: "Baraka Otieno", score: 61, xp: 1210, me: false },
];

const COMP_COLORS: Record<string, string> = {
  EE: "var(--green)", ME: "var(--blue)", AE: "var(--yellow)", BE: "var(--red)",
};

const BADGES = [
  { icon: "🔥", label: "7-Day Streak", color: "var(--yellow)" },
  { icon: "🏅", label: "Top in Science", color: "var(--green)" },
  { icon: "✅", label: "First 100%", color: "var(--purple)" },
];

export default function LearningDash() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Greeting + badges */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div>
          <h1 style={{ color: "var(--navy)", fontSize: 22, fontWeight: 800 }}>Good morning, Brian 👋</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>Grade 8A · Mwangaza Junior Academy · Term 2, Week 7</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {BADGES.map((b) => (
            <div key={b.label} className="badge" style={{ background: `${b.color}18`, color: b.color, border: `1px solid ${b.color}30`, fontSize: 11, fontWeight: 700 }}>
              {b.icon} {b.label}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))", gap: 12 }}>
        {[
          { label: "Lessons this week", value: "12", sub: "of 15", color: "var(--purple)" },
          { label: "Last test score", value: "74%", sub: "+6% vs last week", color: "var(--green)" },
          { label: "Class rank", value: "#4", sub: "out of 45", color: "var(--blue)" },
          { label: "XP Points", value: "1,480", sub: "Level 6 Scholar", color: "var(--yellow)" },
          { label: "Assignments due", value: "3", sub: "by Friday", color: "var(--red)" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ textAlign: "center", padding: "14px 10px" }}>
            <p style={{ color: s.color, fontSize: 22, fontWeight: 800 }}>{s.value}</p>
            <p style={{ color: "var(--text)", fontSize: 11, fontWeight: 600, marginTop: 2 }}>{s.label}</p>
            <p style={{ color: "var(--muted)", fontSize: 10, marginTop: 1 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", gap: 16 }}>

        {/* AI Study Plan */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700 }}>🤖 AI Learning Path — Today</h3>
            <span className="badge" style={{ background: "rgba(168,85,247,.1)", color: "var(--purple)", fontSize: 10 }}>AI Generated</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {TASKS.map((t, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 8,
                background: t.status === "Done" ? "rgba(34,197,94,.06)" : t.status === "Now" ? "rgba(168,85,246,.06)" : "var(--bg)",
                border: t.status === "Now" ? "1px solid rgba(168,85,247,.25)" : "1px solid transparent",
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{t.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: t.status === "Pending" ? "var(--muted)" : "var(--text)", fontSize: 12, fontWeight: t.status === "Now" ? 700 : 500 }}>{t.subject} — {t.topic}</p>
                  <p style={{ color: "var(--muted2)", fontSize: 11 }}>{t.type}</p>
                </div>
                <span className="badge" style={{ background: `${t.color}15`, color: t.color, fontSize: 9, fontWeight: 700 }}>{t.status}</span>
              </div>
            ))}
          </div>
          <p style={{ color: "var(--muted2)", fontSize: 11, marginTop: 10, textAlign: "center" }}>
            3 of 5 tasks done · 43 mins left today
          </p>
        </div>

        {/* CBC Progress */}
        <div className="card">
          <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📊 CBC Competency Progress</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {CBC_PROGRESS.map((p) => (
              <div key={p.subject}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "var(--text-2)", fontSize: 12, fontWeight: 500 }}>{p.subject}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ color: p.trend.startsWith("+") ? "var(--green)" : "var(--red)", fontSize: 10, fontWeight: 600 }}>{p.trend}</span>
                    <span style={{ color: "var(--muted)", fontSize: 11 }}>{p.pct}%</span>
                    <span className="badge" style={{ background: `${COMP_COLORS[p.label]}18`, color: COMP_COLORS[p.label], fontSize: 9, padding: "2px 6px" }}>{p.label}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${p.pct}%`, background: COMP_COLORS[p.label] }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700 }}>🏆 Class Leaderboard</h3>
            <span style={{ color: "var(--muted)", fontSize: 11 }}>Grade 8A · Week 7</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {LEADERBOARD.map((l) => (
              <div key={l.rank} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 9,
                background: l.me ? "var(--navy)" : "var(--bg)",
                border: l.me ? "none" : "1px solid var(--border)",
              }}>
                <span style={{ fontWeight: 700, fontSize: 14, width: 22, textAlign: "center", color: l.me ? "#fff" : l.rank <= 3 ? "var(--yellow)" : "var(--muted)" }}>
                  {l.rank === 1 ? "🥇" : l.rank === 2 ? "🥈" : l.rank === 3 ? "🥉" : `#${l.rank}`}
                </span>
                <span style={{ color: l.me ? "#fff" : "var(--text)", fontSize: 13, flex: 1, fontWeight: l.me ? 700 : 400 }}>{l.name}</span>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: l.me ? "#fff" : "var(--text)", fontSize: 12, fontWeight: 700 }}>{l.score}%</p>
                  <p style={{ color: l.me ? "rgba(255,255,255,.6)" : "var(--muted2)", fontSize: 10 }}>{l.xp.toLocaleString()} XP</p>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-navy" style={{ width: "100%", marginTop: 12, justifyContent: "center" }}>
            View Full Competition →
          </button>
        </div>

      </div>

      {/* Weekly report card */}
      <div className="card" style={{ background: "var(--navy)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>📩 Weekly Parent Report — Sent Friday 5PM</h3>
            <p style={{ color: "rgba(255,255,255,.6)", fontSize: 12, marginTop: 4 }}>Via app notification · WhatsApp · SMS fallback</p>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { label: "Subjects studied", value: "5 / 6" },
              { label: "Avg test score", value: "74% ↑" },
              { label: "Study streak", value: "7 days 🔥" },
              { label: "CBC: Meets in", value: "4 / 6 subjects" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <p style={{ color: "var(--yellow)", fontSize: 16, fontWeight: 800 }}>{s.value}</p>
                <p style={{ color: "rgba(255,255,255,.55)", fontSize: 10 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
