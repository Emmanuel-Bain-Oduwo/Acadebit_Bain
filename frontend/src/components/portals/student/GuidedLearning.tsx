"use client";
import { useState } from "react";
import { Check, Lock } from "lucide-react";

const WEEKS = [
  { week: 1, label: "Week 1 — Foundations", done: true },
  { week: 2, label: "Week 2 — Core Concepts", done: true },
  { week: 3, label: "Week 3 — Application", done: false, active: true },
  { week: 4, label: "Week 4 — Advanced", done: false },
  { week: 5, label: "Week 5 — Revision", done: false },
];

const TODAY_STEPS = [
  { id: 1, type: "video", icon: "🎬", title: "Watch: Quadratic Equations (14 min)", subject: "Mathematics", done: true, xp: 10 },
  { id: 2, type: "notes", icon: "📄", title: "Read: Study Notes — Factorisation", subject: "Mathematics", done: true, xp: 5 },
  { id: 3, type: "flashcards", icon: "🃏", title: "Practice: Algebra Flashcards (30 cards)", subject: "Mathematics", done: false, active: true, xp: 15 },
  { id: 4, type: "podcast", icon: "🎙️", title: "Listen: Forces & Motion Podcast", subject: "Science", done: false, xp: 10 },
  { id: 5, type: "quiz", icon: "✍️", title: "Quiz: Mathematics Week 3 Check", subject: "Mathematics", done: false, xp: 50 },
  { id: 6, type: "video", icon: "🎬", title: "Watch: Insha Writing Techniques", subject: "Kiswahili", done: false, xp: 10 },
];

const SUBJECTS = [
  { name: "Mathematics", progress: 68, color: "var(--blue)", topics: ["Quadratic Equations", "Factorisation", "Linear Graphs"] },
  { name: "Science", progress: 74, color: "var(--green)", topics: ["Photosynthesis", "Cell Biology", "Forces & Motion"] },
  { name: "English", progress: 61, color: "#ef4444", topics: ["Reading Comprehension", "Essay Writing", "Grammar"] },
  { name: "Kiswahili", progress: 55, color: "var(--yellow)", topics: ["Insha Writing", "Fasihi", "Sarufi"] },
  { name: "Social Studies", progress: 70, color: "var(--purple)", topics: ["Map Reading", "Kenya Counties", "Trade Routes"] },
];

const AI_RECS = [
  { icon: "⚠️", text: "You haven't reviewed Factorisation in 5 days — revision due", action: "Review Now", color: "var(--yellow)" },
  { icon: "🔥", text: "Science watch rate is 84% — you're on track! Keep it up", action: "Continue", color: "var(--green)" },
  { icon: "📌", text: "Essay Writing scores dipped 9% — extra practice suggested", action: "Practice", color: "#ef4444" },
  { icon: "🎯", text: "Complete today's quiz to unlock Week 4 content", action: "Take Quiz", color: "var(--blue)" },
];

export default function GuidedLearning() {
  const [activeWeek, setActiveWeek] = useState(3);
  const [activeSubject, setActiveSubject] = useState("All");

  const completedToday = TODAY_STEPS.filter((s) => s.done).length;
  const totalXpToday = TODAY_STEPS.filter((s) => s.done).reduce((a, s) => a + s.xp, 0);
  const activeIdx = TODAY_STEPS.findIndex((s) => (s as { active?: boolean }).active);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ color: "var(--navy)", fontSize: 22, fontWeight: 800 }}>🗺️ Guided Learning Path</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>Your personalised day-by-day curriculum — CBC Grade 8, Term 2</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span className="badge" style={{ background: "rgba(168,85,247,.1)", color: "var(--purple)", fontSize: 11 }}>
            {completedToday}/{TODAY_STEPS.length} today
          </span>
          <span className="badge" style={{ background: "rgba(245,158,11,.1)", color: "var(--yellow)", fontSize: 11 }}>
            ⭐ +{totalXpToday} XP earned
          </span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(140px, 100%), 1fr))", gap: 12 }}>
        {[
          { label: "Week Progress", value: "60%", icon: "📅", color: "var(--blue)" },
          { label: "Term Progress", value: "47%", icon: "📆", color: "var(--purple)" },
          { label: "Streak", value: "7 days", icon: "🔥", color: "var(--yellow)" },
          { label: "Avg Score", value: "74%", icon: "📊", color: "var(--green)" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "14px", textAlign: "center" }}>
            <span style={{ fontSize: 22 }}>{s.icon}</span>
            <p style={{ color: s.color, fontSize: 20, fontWeight: 800, marginTop: 6 }}>{s.value}</p>
            <p style={{ color: "var(--muted)", fontSize: 11, marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))", gap: 16 }}>
        {/* Today's Steps */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700 }}>📅 Today&apos;s Learning Steps</h3>
            <span className="badge" style={{ background: "rgba(34,197,94,.1)", color: "var(--green)", fontSize: 10 }}>
              Week 3 · Day {new Date().getDay() || 7}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {TODAY_STEPS.map((step, i) => {
              const isActive = (step as { active?: boolean }).active;
              const isLocked = !step.done && !isActive && i > activeIdx + 1;
              return (
                <div key={step.id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10,
                  background: isActive ? "rgba(168,85,247,.06)" : "var(--bg)",
                  border: isActive ? "1.5px solid rgba(168,85,247,.25)" : "1px solid var(--border)",
                  opacity: isLocked ? 0.5 : 1,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    background: step.done ? "var(--green)" : isActive ? "var(--purple)" : "var(--border)",
                  }}>
                    {step.done
                      ? <Check size={14} color="#fff" />
                      : isActive
                        ? <span style={{ color: "#fff", fontSize: 12 }}>▶</span>
                        : <span style={{ color: "var(--muted)", fontSize: 12 }}>{i + 1}</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: step.done ? "var(--muted)" : "var(--text)", fontSize: 13, fontWeight: isActive ? 700 : 500, textDecoration: step.done ? "line-through" : "none" }}>
                      {step.title}
                    </p>
                    <p style={{ color: "var(--muted2)", fontSize: 11, marginTop: 2 }}>{step.subject}</p>
                  </div>
                  <span className="badge" style={{ background: "rgba(245,158,11,.1)", color: "var(--yellow)", fontSize: 10, flexShrink: 0 }}>
                    +{step.xp} XP
                  </span>
                  {(isActive || (!step.done && !isLocked)) && !step.done && (
                    <button className="btn btn-navy" style={{ padding: "5px 12px", fontSize: 11, flexShrink: 0 }}>
                      {isActive ? "Start" : "Open"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* AI Study Coach */}
          <div className="card">
            <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🤖 AI Study Coach</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {AI_RECS.map((r, i) => (
                <div key={i} style={{ padding: "10px 12px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)", display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{r.icon}</span>
                  <p style={{ color: "var(--text)", fontSize: 12, lineHeight: 1.5, flex: 1 }}>{r.text}</p>
                  <button className="btn btn-ghost" style={{ fontSize: 10, padding: "4px 8px", flexShrink: 0 }}>{r.action}</button>
                </div>
              ))}
            </div>
          </div>

          {/* Term Timeline */}
          <div className="card">
            <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📆 Term Timeline</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {WEEKS.map((w) => (
                <button key={w.week} onClick={() => setActiveWeek(w.week)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8,
                    border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                    background: activeWeek === w.week ? "var(--navy)" : "var(--bg)",
                  }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    background: w.done ? "var(--green)" : activeWeek === w.week ? "rgba(255,255,255,.2)" : "var(--border)",
                    flexShrink: 0,
                  }}>
                    {w.done
                      ? <Check size={12} color="#fff" />
                      : <span style={{ color: activeWeek === w.week ? "#fff" : "var(--muted)", fontSize: 11 }}>{w.week}</span>}
                  </div>
                  <span style={{ color: activeWeek === w.week ? "#fff" : w.done ? "var(--muted)" : "var(--text)", fontSize: 12, fontWeight: activeWeek === w.week ? 700 : 400 }}>
                    {w.label}
                  </span>
                  {w.done && <span style={{ marginLeft: "auto", color: "var(--green)", fontSize: 10 }}>✅</span>}
                  {!w.done && w.week > activeWeek && <Lock size={11} style={{ marginLeft: "auto", color: "var(--muted)" }} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subject Progress */}
      <div className="card">
        <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>📚 Subject Progress — Term 2</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {["All", ...SUBJECTS.map((s) => s.name)].map((s) => (
            <button key={s} onClick={() => setActiveSubject(s)}
              style={{
                padding: "5px 12px", borderRadius: 100, fontSize: 11, cursor: "pointer", fontFamily: "inherit", border: "1.5px solid",
                background: activeSubject === s ? "var(--navy)" : "transparent",
                color: activeSubject === s ? "#fff" : "var(--muted)",
                borderColor: activeSubject === s ? "var(--navy)" : "var(--border)",
              }}>
              {s}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SUBJECTS.filter((s) => activeSubject === "All" || s.name === activeSubject).map((s) => (
            <div key={s.name}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div>
                  <span style={{ color: "var(--text)", fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                  <span style={{ color: "var(--muted)", fontSize: 11, marginLeft: 8 }}>
                    {s.topics.slice(0, 2).join(" · ")}
                  </span>
                </div>
                <span style={{ color: s.color, fontSize: 13, fontWeight: 700 }}>{s.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${s.progress}%`, background: s.color, transition: "width 0.6s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
