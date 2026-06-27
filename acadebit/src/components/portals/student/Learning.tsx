"use client";

const TASKS = [
  { icon: "📊", subject: "Mathematics", topic: "Quadratic Equations Practice", duration: "30 min", status: "Done" },
  { icon: "🌿", subject: "Science", topic: "Photosynthesis — Lab Report", duration: "45 min", status: "Now" },
  { icon: "📖", subject: "English", topic: "Comprehension — Chapter 4", duration: "20 min", status: "Later" },
  { icon: "🌍", subject: "Social Studies", topic: "Map Reading Exercise", duration: "25 min", status: "Later" },
];

const CBC_PROGRESS = [
  { subject: "Mathematics", pct: 82, label: "ME" },
  { subject: "English", pct: 74, label: "AE" },
  { subject: "Science", pct: 91, label: "EE" },
  { subject: "Kiswahili", pct: 67, label: "AE" },
  { subject: "Social Studies", pct: 88, label: "ME" },
];

const LEADERBOARD = [
  { rank: 1, name: "Fatuma Hassan", score: 89, me: false },
  { rank: 2, name: "Aisha Kamau", score: 85, me: false },
  { rank: 3, name: "Grace Odhiambo", score: 78, me: false },
  { rank: 4, name: "Brian Omondi (You)", score: 74, me: true },
  { rank: 5, name: "James Mutua", score: 72, me: false },
];

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Done: { bg: "rgba(34,197,94,.1)", color: "var(--green)" },
  Now: { bg: "rgba(168,85,247,.1)", color: "var(--purple)" },
  Later: { bg: "rgba(30,35,48,1)", color: "var(--text-muted)" },
};

const COMP_COLORS: Record<string, string> = {
  EE: "var(--green)",
  ME: "var(--blue)",
  AE: "var(--amber)",
  BE: "var(--red)",
};

export default function LearningDash() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Greeting */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <h1 style={{ color: "var(--text)", fontSize: 24, fontWeight: 800 }}>Good Morning, Brian 👋</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Grade 8A · Mwangaza Junior Academy · Term 2, Week 7</p>
        </div>
        <div className="badge" style={{ background: "rgba(245,158,11,.1)", color: "var(--amber)", fontSize: 12 }}>🔥 7-Day Streak</div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
        {[
          { label: "Lessons This Week", value: "12/15", color: "var(--blue)" },
          { label: "Last Test Score", value: "74% +6%", color: "var(--green)" },
          { label: "Class Rank", value: "#4 / 45", color: "var(--purple)" },
          { label: "Due Assignments", value: "3", color: "var(--amber)" },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ textAlign: "center" }}>
            <p style={{ color: s.color, fontSize: 20, fontWeight: 800, fontFamily: "DM Mono" }}>{s.value}</p>
            <p style={{ color: "var(--text-muted)", fontSize: 11 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {/* Study Plan */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🤖 AI Study Plan — Today</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {TASKS.map((t) => (
              <div key={t.topic} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", borderRadius: 8,
                background: STATUS_STYLES[t.status].bg,
                border: `1px solid ${STATUS_STYLES[t.status].color}20`,
              }}>
                <span style={{ fontSize: 18 }}>{t.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "var(--text)", fontSize: 12, fontWeight: 600 }}>{t.subject}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: 11 }}>{t.topic} · {t.duration}</p>
                </div>
                <span className="badge" style={{ background: STATUS_STYLES[t.status].bg, color: STATUS_STYLES[t.status].color, fontSize: 10 }}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CBC Progress */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📊 CBC Progress</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {CBC_PROGRESS.map((p) => (
              <div key={p.subject}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "var(--text)", fontSize: 12 }}>{p.subject}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{p.pct}%</span>
                    <span className="badge" style={{ background: `${COMP_COLORS[p.label]}20`, color: COMP_COLORS[p.label], fontSize: 9 }}>{p.label}</span>
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
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🏆 Class Leaderboard</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {LEADERBOARD.map((l) => (
              <div
                key={l.rank}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: l.me ? "rgba(168,85,247,.1)" : "var(--card2)",
                  border: l.me ? "1px solid rgba(168,85,247,.3)" : "1px solid transparent",
                }}
              >
                <span style={{ color: l.rank <= 3 ? "var(--amber)" : "var(--text-muted)", fontWeight: 700, fontSize: 14, width: 20 }}>
                  {l.rank === 1 ? "🥇" : l.rank === 2 ? "🥈" : l.rank === 3 ? "🥉" : `#${l.rank}`}
                </span>
                <span style={{ color: l.me ? "var(--purple)" : "var(--text)", fontSize: 13, flex: 1, fontWeight: l.me ? 700 : 400 }}>{l.name}</span>
                <span style={{ color: "var(--text-muted)", fontSize: 12, fontFamily: "DM Mono" }}>{l.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
