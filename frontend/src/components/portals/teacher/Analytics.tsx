"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";
import { AlertTriangle, TrendingUp, TrendingDown, Users, BookOpen } from "lucide-react";

const CLASS_SCORES = [
  { name: "Brian O.", maths: 74, english: 82, science: 91, kiswahili: 67, social: 88, risk: false },
  { name: "Cynthia A.", maths: 96, english: 90, science: 88, kiswahili: 85, social: 92, risk: false },
  { name: "Esther W.", maths: 88, english: 76, science: 82, kiswahili: 80, social: 79, risk: false },
  { name: "Kevin N.", maths: 45, english: 52, science: 48, kiswahili: 60, social: 55, risk: true },
  { name: "Amina N.", maths: 82, english: 88, science: 79, kiswahili: 74, social: 85, risk: false },
  { name: "Daniel K.", maths: 38, english: 45, science: 42, kiswahili: 55, social: 50, risk: true },
  { name: "Fatuma H.", maths: 80, english: 84, science: 91, kiswahili: 78, social: 83, risk: false },
  { name: "James M.", maths: 58, english: 61, science: 55, kiswahili: 63, social: 67, risk: false },
];

const WEEKLY_AVG = [
  { week: "Wk 1", avg: 61, target: 70 },
  { week: "Wk 2", avg: 63, target: 70 },
  { week: "Wk 3", avg: 65, target: 70 },
  { week: "Wk 4", avg: 64, target: 70 },
  { week: "Wk 5", avg: 68, target: 70 },
  { week: "Wk 6", avg: 66, target: 70 },
  { week: "Wk 7", avg: 70, target: 70 },
];

const VIDEO_WATCH = [
  { title: "Quadratic Equations", watched: 38, total: 45, pct: 84 },
  { title: "Photosynthesis", watched: 40, total: 45, pct: 89 },
  { title: "Essay Writing Guide", watched: 29, total: 45, pct: 64 },
  { title: "Map Reading", watched: 22, total: 45, pct: 49 },
  { title: "Cell Biology Flashcards", watched: 35, total: 45, pct: 78 },
];

const HEATMAP_SUBJECTS = ["Maths", "English", "Science", "Kiswahili", "Social"];
const SCORE_KEY: Record<string, keyof typeof CLASS_SCORES[0]> = {
  Maths: "maths", English: "english", Science: "science", Kiswahili: "kiswahili", Social: "social",
};

function heatColor(score: number) {
  if (score >= 80) return { bg: "rgba(34,197,94,.18)", color: "var(--green)" };
  if (score >= 65) return { bg: "rgba(59,130,246,.14)", color: "var(--blue)" };
  if (score >= 50) return { bg: "rgba(245,158,11,.18)", color: "var(--yellow)" };
  return { bg: "rgba(239,68,68,.15)", color: "#ef4444" };
}

const AT_RISK = CLASS_SCORES.filter((s) => s.risk);

const AI_RETEACH = [
  { subject: "Mathematics", topic: "Algebra & Quadratics", students: 8, action: "Re-teach factorisation — 8 students scored below 50%", priority: "high" },
  { subject: "English", topic: "Essay Structure", students: 5, action: "Assign Essay Writing podcast for 5 students below 55%", priority: "medium" },
  { subject: "Social Studies", topic: "Map Reading", students: 12, action: "Map Reading video has only 49% watch rate — re-assign", priority: "medium" },
];

export default function Analytics() {
  const [view, setView] = useState<"heatmap" | "trend" | "video">("heatmap");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ color: "var(--navy)", fontSize: 22, fontWeight: 800 }}>📈 Class Analytics</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>Grade 8A · 45 students · Term 2, Week 7</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["heatmap", "trend", "video"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              style={{
                padding: "7px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                background: view === v ? "var(--navy)" : "transparent",
                color: view === v ? "#fff" : "var(--muted)",
                border: "1.5px solid",
                borderColor: view === v ? "var(--navy)" : "var(--border)",
              }}>
              {v === "heatmap" ? "🟥 Heatmap" : v === "trend" ? "📉 Trend" : "🎬 Video Watch"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))", gap: 12 }}>
        {[
          { icon: <Users size={16} />, label: "Class Size", value: "45", sub: "Grade 8A", color: "var(--blue)" },
          { icon: <TrendingUp size={16} />, label: "Avg Score", value: "70%", sub: "↑ vs Wk 6", color: "var(--green)" },
          { icon: <BookOpen size={16} />, label: "CBC: EE+ME", value: "78%", sub: "of students", color: "var(--purple)" },
          { icon: <AlertTriangle size={16} />, label: "At-Risk", value: "2", sub: "need support", color: "#ef4444" },
          { icon: <TrendingDown size={16} />, label: "Video Avg Watch", value: "73%", sub: "this week", color: "var(--yellow)" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ textAlign: "center", padding: "14px 10px" }}>
            <div style={{ color: s.color, display: "flex", justifyContent: "center", marginBottom: 6 }}>{s.icon}</div>
            <p style={{ color: s.color, fontSize: 22, fontWeight: 800 }}>{s.value}</p>
            <p style={{ color: "var(--text)", fontSize: 11, fontWeight: 600, marginTop: 2 }}>{s.label}</p>
            <p style={{ color: "var(--muted)", fontSize: 10, marginTop: 1 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Heatmap View */}
      {view === "heatmap" && (
        <div className="card">
          <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🟥 Competency Heatmap — All Subjects</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "6px 10px", color: "var(--muted)", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>Student</th>
                  {HEATMAP_SUBJECTS.map((s) => (
                    <th key={s} style={{ textAlign: "center", padding: "6px 8px", color: "var(--muted)", fontSize: 11, fontWeight: 600 }}>{s}</th>
                  ))}
                  <th style={{ textAlign: "center", padding: "6px 8px", color: "var(--muted)", fontSize: 11, fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {CLASS_SCORES.map((row) => (
                  <tr key={row.name}>
                    <td style={{ padding: "7px 10px", fontSize: 12, fontWeight: row.risk ? 700 : 500, color: row.risk ? "#ef4444" : "var(--text)", whiteSpace: "nowrap" }}>
                      {row.risk && <AlertTriangle size={11} style={{ marginRight: 4, verticalAlign: "middle" }} />}
                      {row.name}
                    </td>
                    {HEATMAP_SUBJECTS.map((subj) => {
                      const score = row[SCORE_KEY[subj]] as number;
                      const { bg, color } = heatColor(score);
                      return (
                        <td key={subj} style={{ padding: "7px 8px", textAlign: "center" }}>
                          <span style={{ display: "inline-block", background: bg, color, borderRadius: 6, padding: "2px 8px", fontSize: 12, fontWeight: 700 }}>{score}%</span>
                        </td>
                      );
                    })}
                    <td style={{ padding: "7px 8px", textAlign: "center" }}>
                      <span className="badge" style={{
                        background: row.risk ? "rgba(239,68,68,.1)" : "rgba(34,197,94,.1)",
                        color: row.risk ? "#ef4444" : "var(--green)", fontSize: 9,
                      }}>{row.risk ? "⚠ At Risk" : "✅ On Track"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
            {[
              { label: "≥80% Exceeds (EE)", bg: "rgba(34,197,94,.18)", color: "var(--green)" },
              { label: "65–79% Meets (ME)", bg: "rgba(59,130,246,.14)", color: "var(--blue)" },
              { label: "50–64% Approaches (AE)", bg: "rgba(245,158,11,.18)", color: "var(--yellow)" },
              { label: "<50% Below (BE)", bg: "rgba(239,68,68,.15)", color: "#ef4444" },
            ].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: l.bg, border: `1px solid ${l.color}` }} />
                <span style={{ color: "var(--muted)", fontSize: 10 }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trend View */}
      {view === "trend" && (
        <div className="card">
          <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📉 Class Average vs Target — 7 Weeks</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={WEEKLY_AVG}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" tick={{ fill: "var(--muted)", fontSize: 11 }} />
              <YAxis domain={[50, 80]} tick={{ fill: "var(--muted)", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10 }} />
              <Line type="monotone" dataKey="avg" stroke="var(--navy)" strokeWidth={2.5} dot={{ fill: "var(--navy)", r: 4 }} name="Class Avg %" />
              <Line type="monotone" dataKey="target" stroke="var(--yellow)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target %" />
            </LineChart>
          </ResponsiveContainer>
          <div className="card" style={{ marginTop: 16, background: "var(--bg)" }}>
            <h4 style={{ color: "var(--navy)", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>📊 Subject Breakdown — Week 7</h4>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={[
                { subj: "Maths", avg: 70 },
                { subj: "English", avg: 75 },
                { subj: "Science", avg: 72 },
                { subj: "Kiswahili", avg: 68 },
                { subj: "Social", avg: 74 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="subj" tick={{ fill: "var(--muted)", fontSize: 11 }} />
                <YAxis domain={[50, 90]} tick={{ fill: "var(--muted)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10 }} />
                <Bar dataKey="avg" fill="var(--navy)" radius={[6, 6, 0, 0]} name="Class Avg %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Video Watch View */}
      {view === "video" && (
        <div className="card">
          <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🎬 Video & Content Watch Rates</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {VIDEO_WATCH.map((v) => (
              <div key={v.title}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ color: "var(--text)", fontSize: 13, fontWeight: 600 }}>{v.title}</span>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ color: "var(--muted)", fontSize: 11 }}>{v.watched}/{v.total} students</span>
                    <span style={{ color: v.pct >= 75 ? "var(--green)" : v.pct >= 55 ? "var(--yellow)" : "#ef4444", fontWeight: 700, fontSize: 13 }}>{v.pct}%</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${v.pct}%`, background: v.pct >= 75 ? "var(--green)" : v.pct >= 55 ? "var(--yellow)" : "#ef4444" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", gap: 16 }}>
        {/* At-Risk Students */}
        <div className="card" style={{ border: "1.5px solid rgba(239,68,68,.25)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <AlertTriangle size={16} color="#ef4444" />
            <h3 style={{ color: "#ef4444", fontSize: 14, fontWeight: 700 }}>At-Risk Students ({AT_RISK.length})</h3>
          </div>
          {AT_RISK.map((s) => (
            <div key={s.name} style={{ padding: "12px", background: "rgba(239,68,68,.05)", borderRadius: 10, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <p style={{ color: "var(--text)", fontSize: 13, fontWeight: 700 }}>{s.name}</p>
                <span className="badge" style={{ background: "rgba(239,68,68,.1)", color: "#ef4444", fontSize: 9 }}>⚠ Below Target</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {HEATMAP_SUBJECTS.map((subj) => {
                  const score = s[SCORE_KEY[subj]] as number;
                  return (
                    <span key={subj} style={{ fontSize: 10, color: score < 50 ? "#ef4444" : "var(--muted)", fontWeight: score < 50 ? 700 : 400 }}>
                      {subj}: {score}%
                    </span>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button className="btn btn-navy" style={{ fontSize: 11, padding: "5px 12px" }}>Send to Parent</button>
                <button className="btn btn-ghost" style={{ fontSize: 11, padding: "5px 12px" }}>Assign Remedial</button>
              </div>
            </div>
          ))}
        </div>

        {/* AI Re-teach Recommendations */}
        <div className="card" style={{ background: "var(--navy)", border: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 20 }}>🤖</span>
            <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>AI Re-teach Recommendations</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {AI_RETEACH.map((r) => (
              <div key={r.topic} style={{ padding: "12px", background: "rgba(255,255,255,.07)", borderRadius: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <p style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{r.subject} — {r.topic}</p>
                  <span className="badge" style={{
                    background: r.priority === "high" ? "rgba(239,68,68,.25)" : "rgba(245,158,11,.2)",
                    color: r.priority === "high" ? "#fca5a5" : "var(--yellow)", fontSize: 9,
                  }}>{r.priority === "high" ? "🔴 High" : "🟡 Medium"}</span>
                </div>
                <p style={{ color: "rgba(255,255,255,.65)", fontSize: 11, lineHeight: 1.5, marginBottom: 8 }}>{r.action}</p>
                <button className="btn" style={{ background: "var(--yellow)", color: "#fff", fontSize: 11, padding: "5px 12px" }}>
                  Apply →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
