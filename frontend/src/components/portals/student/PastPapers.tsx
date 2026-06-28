"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Download, Clock, Target, TrendingUp, Zap } from "lucide-react";
import { useStore } from "@/store";

const PAPERS = [
  { id: "p1", title: "KCSE 2023 Mathematics Paper 1", marks: 100, duration: "2.5 hrs", durationMin: 150, status: "New", year: 2023, type: "KCSE", subject: "Mathematics" },
  { id: "p2", title: "KCSE 2022 Mathematics Paper 2", marks: 100, duration: "2.5 hrs", durationMin: 150, status: "Best: 74%", year: 2022, type: "KCSE", subject: "Mathematics" },
  { id: "p3", title: "KCSE 2021 Mathematics Paper 1", marks: 100, duration: "2.5 hrs", durationMin: 150, status: "Best: 69%", year: 2021, type: "KCSE", subject: "Mathematics" },
  { id: "p4", title: "KCPE 2023 Mathematics", marks: 50, duration: "1.5 hrs", durationMin: 90, status: "Not attempted", year: 2023, type: "KCPE", subject: "Mathematics" },
  { id: "p5", title: "KCPE 2022 Mathematics", marks: 50, duration: "1.5 hrs", durationMin: 90, status: "Best: 82%", year: 2022, type: "KCPE", subject: "Mathematics" },
  { id: "p6", title: "CBC Grade 8 Maths Assessment 2024", marks: 40, duration: "1 hr", durationMin: 60, status: "Best: 86%", year: 2024, type: "CBC", subject: "Mathematics" },
  { id: "p7", title: "KCSE 2023 English Paper 1", marks: 80, duration: "2 hrs", durationMin: 120, status: "Not attempted", year: 2023, type: "KCSE", subject: "English" },
  { id: "p8", title: "KCSE 2022 Science Paper", marks: 80, duration: "2 hrs", durationMin: 120, status: "New", year: 2022, type: "KCSE", subject: "Science" },
];

const HISTORY = [
  { year: "2019", score: 58 },
  { year: "2020", score: 63 },
  { year: "2021", score: 67 },
  { year: "2022", score: 71 },
  { year: "2023", score: 74 },
];

const AI_TOPICS: { topic: string; pct: number; papers: number; total: number; priority: "high" | "medium" | "low"; tip: string }[] = [
  { topic: "Quadratic Equations", pct: 91, papers: 18, total: 20, priority: "high", tip: "Master factorisation, completing the square, and the quadratic formula. Usually Paper 1." },
  { topic: "Linear Equations & Inequalities", pct: 85, papers: 17, total: 20, priority: "high", tip: "Focus on simultaneous equations and graphical representation." },
  { topic: "Geometry — Circles & Angles", pct: 80, papers: 16, total: 20, priority: "high", tip: "Circle theorems are frequently tested. Draw diagrams for every question." },
  { topic: "Statistics & Data Analysis", pct: 75, papers: 15, total: 20, priority: "medium", tip: "Mean, mode, median, frequency tables and cumulative frequency graphs." },
  { topic: "Algebra — Indices & Surds", pct: 70, papers: 14, total: 20, priority: "medium", tip: "Simplification of surds and laws of indices — often combined with other algebra." },
  { topic: "Trigonometry", pct: 60, papers: 12, total: 20, priority: "medium", tip: "Sine rule, cosine rule, and area of triangle — usually Paper 2." },
  { topic: "Vectors", pct: 50, papers: 10, total: 20, priority: "low", tip: "Column vectors, magnitude, and vector paths." },
];

const FILTERS = ["KCSE", "KCPE", "CBC"];
const SUBJ_FILTERS = ["Mathematics", "English", "Science"];

export default function PastPapers() {
  const { addToast } = useStore();
  const [activeType, setActiveType] = useState("KCSE");
  const [activeSubj, setActiveSubj] = useState("Mathematics");
  const [timedMode, setTimedMode] = useState(false);
  const [timedPaper, setTimedPaper] = useState<typeof PAPERS[0] | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRef, setTimerRef] = useState<ReturnType<typeof setInterval> | null>(null);

  const filtered = PAPERS.filter((p) => p.type === activeType && p.subject === activeSubj);

  const startTimed = (paper: typeof PAPERS[0]) => {
    if (timerRef) clearInterval(timerRef);
    setTimedPaper(paper);
    setTimedMode(true);
    const secs = paper.durationMin * 60;
    setTimeLeft(secs);
    const iv = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(iv);
          setTimedMode(false);
          setTimedPaper(null);
          addToast("warning", "Time's up! Paper submitted automatically.");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    setTimerRef(iv);
    addToast("info", `Started timed practice: ${paper.title}`);
  };

  const stopTimed = () => {
    if (timerRef) clearInterval(timerRef);
    setTimedMode(false);
    setTimedPaper(null);
    addToast("success", "Practice session saved.");
  };

  const fmt = (s: number) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ color: "var(--navy)", fontSize: 22, fontWeight: 800 }}>📄 Past Papers Hub</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>KCSE · KCPE · CBC — AI-marked with topic frequency analysis</p>
        </div>
        {timedMode && timedPaper && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#ef4444", borderRadius: 12, padding: "8px 16px" }}>
            <Clock size={16} color="#fff" />
            <span style={{ color: "#fff", fontSize: 16, fontWeight: 800, fontFamily: "monospace" }}>{fmt(timeLeft)}</span>
            <span style={{ color: "rgba(255,255,255,.75)", fontSize: 11 }}>{timedPaper.title.split(" ").slice(0, 4).join(" ")}...</span>
            <button className="btn" style={{ background: "rgba(255,255,255,.2)", color: "#fff", fontSize: 11, padding: "4px 10px" }} onClick={stopTimed}>Submit</button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
        {[
          { icon: <Target size={14} />, label: "KCSE Papers", value: "2000–23", color: "var(--green)" },
          { icon: <TrendingUp size={14} />, label: "KCPE Papers", value: "2000–23", color: "var(--blue)" },
          { icon: <Zap size={14} />, label: "CBC Assessments", value: "2019–24", color: "var(--purple)" },
          { icon: <Clock size={14} />, label: "AI Marking", value: "All subjects", color: "var(--yellow)" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ textAlign: "center", padding: "12px 10px" }}>
            <div style={{ color: s.color, display: "flex", justifyContent: "center", marginBottom: 6 }}>{s.icon}</div>
            <p style={{ color: s.color, fontSize: 16, fontWeight: 800 }}>{s.value}</p>
            <p style={{ color: "var(--muted)", fontSize: 11, marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setActiveType(f)} style={{
            background: activeType === f ? "var(--navy)" : "transparent",
            border: `1.5px solid ${activeType === f ? "var(--navy)" : "var(--border)"}`,
            borderRadius: 100, padding: "6px 14px",
            color: activeType === f ? "#fff" : "var(--muted)",
            fontSize: 12, fontWeight: activeType === f ? 700 : 500, cursor: "pointer", fontFamily: "inherit",
          }}>{f} {activeType === f ? "✓" : ""}</button>
        ))}
        <div style={{ width: 1, background: "var(--border)", margin: "0 4px" }} />
        {SUBJ_FILTERS.map((f) => (
          <button key={f} onClick={() => setActiveSubj(f)} style={{
            background: activeSubj === f ? "rgba(59,130,246,.1)" : "transparent",
            border: `1.5px solid ${activeSubj === f ? "var(--blue)" : "var(--border)"}`,
            borderRadius: 100, padding: "6px 14px",
            color: activeSubj === f ? "var(--blue)" : "var(--muted)",
            fontSize: 12, fontWeight: activeSubj === f ? 700 : 500, cursor: "pointer", fontFamily: "inherit",
          }}>{f}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))", gap: 16 }}>

        {/* Paper List */}
        <div className="card">
          <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📄 {activeSubj} — {activeType} Papers</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No papers available for this filter.</p>
            ) : filtered.map((p) => (
              <div key={p.id} style={{ padding: "12px", background: "var(--bg)", borderRadius: 10, border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <p style={{ color: "var(--navy)", fontSize: 13, fontWeight: 600, flex: 1, marginRight: 8 }}>{p.title}</p>
                  <span className="badge" style={{ background: "rgba(59,130,246,.1)", color: "var(--blue)", fontSize: 9, flexShrink: 0 }}>
                    <Download size={9} /> PDF
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
                  <span style={{ color: "var(--muted)", fontSize: 11 }}>{p.marks} marks · {p.duration}</span>
                  <span className="badge" style={{
                    background: p.status === "New" ? "rgba(168,85,247,.1)" : p.status.includes("Best") ? "rgba(34,197,94,.1)" : "var(--bg)",
                    color: p.status === "New" ? "var(--purple)" : p.status.includes("Best") ? "var(--green)" : "var(--muted)",
                    fontSize: 9,
                  }}>{p.status}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => addToast("info", `Opening ${p.title}...`)}
                    className="btn btn-navy" style={{ fontSize: 11, padding: "5px 12px" }}>
                    Practice →
                  </button>
                  <button onClick={() => startTimed(p)}
                    className="btn btn-ghost" style={{ fontSize: 11, padding: "5px 12px", display: "flex", alignItems: "center", gap: 5 }}>
                    <Clock size={10} /> Timed Mode
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* AI Topic Frequency */}
          <div className="card" style={{ background: "var(--navy)", border: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 20 }}>🤖</span>
              <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>AI Topic Frequency Analysis</h3>
            </div>
            <p style={{ color: "rgba(255,255,255,.6)", fontSize: 11, marginBottom: 14 }}>
              Topics ranked by appearance frequency in the last 20 {activeType} {activeSubj} papers
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {AI_TOPICS.map((t) => (
                <div key={t.topic}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span className="badge" style={{
                        background: t.priority === "high" ? "rgba(239,68,68,.25)" : t.priority === "medium" ? "rgba(245,158,11,.2)" : "rgba(255,255,255,.1)",
                        color: t.priority === "high" ? "#fca5a5" : t.priority === "medium" ? "var(--yellow)" : "rgba(255,255,255,.5)",
                        fontSize: 8, padding: "2px 6px",
                      }}>
                        {t.priority === "high" ? "🔴 HIGH" : t.priority === "medium" ? "🟡 MED" : "🟢 LOW"}
                      </span>
                      <span style={{ color: "#fff", fontSize: 12, fontWeight: t.priority === "high" ? 700 : 500 }}>{t.topic}</span>
                    </div>
                    <span style={{ color: "var(--yellow)", fontWeight: 800, fontSize: 13 }}>{t.pct}%</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,.12)", borderRadius: 100, height: 5, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 100, width: `${t.pct}%`, background: t.priority === "high" ? "#ef4444" : t.priority === "medium" ? "var(--yellow)" : "var(--green)" }} />
                  </div>
                  <p style={{ color: "rgba(255,255,255,.5)", fontSize: 10, marginTop: 3 }}>
                    Appeared in {t.papers}/{t.total} papers · {t.tip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Score History */}
          <div className="card">
            <h3 style={{ color: "var(--navy)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📈 Your Practice Score History</h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={HISTORY}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="year" tick={{ fill: "var(--muted)", fontSize: 10 }} />
                <YAxis domain={[40, 100]} tick={{ fill: "var(--muted)", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, fontSize: 11 }} />
                <Line type="monotone" dataKey="score" stroke="var(--navy)" strokeWidth={2.5} dot={{ fill: "var(--navy)", r: 4 }} name="Score %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Timed Mode Info */}
          <div style={{ padding: "14px 16px", background: "rgba(245,158,11,.08)", border: "1.5px solid rgba(245,158,11,.25)", borderRadius: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Clock size={14} color="var(--yellow)" />
              <p style={{ color: "var(--yellow)", fontWeight: 700, fontSize: 12 }}>Timed Practice Mode</p>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 11, lineHeight: 1.6 }}>
              Click <strong style={{ color: "var(--text)" }}>Timed Mode</strong> on any paper to simulate exam conditions. The countdown timer runs in the header. Your answer is auto-submitted when time expires.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
