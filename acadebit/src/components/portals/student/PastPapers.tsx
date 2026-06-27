"use client";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useStore } from "@/store";
import { Download } from "lucide-react";

const PAPERS = [
  { title: "KCSE 2023 Mathematics Paper 1", marks: 100, duration: "2.5 hrs", status: "New", year: 2023, type: "KCSE" },
  { title: "KCSE 2022 Mathematics Paper 2", marks: 100, duration: "2.5 hrs", status: "Best: 74%", year: 2022, type: "KCSE" },
  { title: "KCPE 2022 Mathematics", marks: 50, duration: "1.5 hrs", status: "Not attempted", year: 2022, type: "KCPE" },
  { title: "CBC Grade 8 Maths Assessment 2024", marks: 40, duration: "1 hr", status: "Best: 82%", year: 2024, type: "CBC" },
];

const HISTORY = [
  { year: "2019", score: 58 },
  { year: "2020", score: 63 },
  { year: "2021", score: 67 },
  { year: "2022", score: 71 },
  { year: "2023", score: 74 },
];

const FILTERS = ["KCSE", "KCPE", "CBC"];
const SUBJ_FILTERS = ["Mathematics", "English", "Science"];

export default function PastPapers() {
  const { addToast } = useStore();
  const [activeType, setActiveType] = useState("KCSE");
  const [activeSubj, setActiveSubj] = useState("Mathematics");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ color: "var(--text)", fontSize: 22, fontWeight: 800 }}>Past Papers Hub</h1>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
        {[
          { label: "KCPE", value: "2000–23", color: "var(--blue)" },
          { label: "KCSE", value: "2000–23", color: "var(--green)" },
          { label: "CBC", value: "2019–24", color: "var(--purple)" },
          { label: "AI Marking", value: "All", color: "var(--orange)" },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ textAlign: "center" }}>
            <p style={{ color: s.color, fontSize: 18, fontWeight: 800 }}>{s.value}</p>
            <p style={{ color: "var(--text-muted)", fontSize: 11 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveType(f)}
            style={{
              background: activeType === f ? "rgba(168,85,247,.1)" : "var(--card2)",
              border: `1px solid ${activeType === f ? "var(--purple)" : "var(--border)"}`,
              borderRadius: 100,
              padding: "5px 14px",
              color: activeType === f ? "var(--purple)" : "var(--text-muted)",
              fontSize: 12, fontWeight: activeType === f ? 600 : 400,
              cursor: "pointer",
            }}
          >
            {f} {activeType === f ? "✓" : ""}
          </button>
        ))}
        {SUBJ_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveSubj(f)}
            style={{
              background: activeSubj === f ? "rgba(59,130,246,.1)" : "var(--card2)",
              border: `1px solid ${activeSubj === f ? "var(--blue)" : "var(--border)"}`,
              borderRadius: 100,
              padding: "5px 14px",
              color: activeSubj === f ? "var(--blue)" : "var(--text-muted)",
              fontSize: 12, fontWeight: activeSubj === f ? 600 : 400,
              cursor: "pointer",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
        {/* Paper List */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📄 {activeSubj} Papers</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PAPERS.filter((p) => p.type === activeType || true).map((p) => (
              <div key={p.title} style={{ padding: "12px", background: "var(--card2)", borderRadius: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p style={{ color: "var(--text)", fontSize: 13, fontWeight: 600, flex: 1 }}>{p.title}</p>
                  <span className="badge" style={{ background: "rgba(59,130,246,.1)", color: "var(--blue)", fontSize: 9, flexShrink: 0 }}>
                    <Download size={9} /> PDF
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{p.marks} marks · {p.duration}</span>
                  <span className="badge" style={{
                    background: p.status === "New" ? "rgba(168,85,247,.1)" : p.status.includes("Best") ? "rgba(34,197,94,.1)" : "rgba(30,35,48,1)",
                    color: p.status === "New" ? "var(--purple)" : p.status.includes("Best") ? "var(--green)" : "var(--text-muted)",
                    fontSize: 9,
                  }}>{p.status}</span>
                </div>
                <button
                  onClick={() => addToast("info", `Loading ${p.title}...`)}
                  className="btn btn-secondary"
                  style={{ fontSize: 11, padding: "4px 10px", alignSelf: "flex-start" }}
                >
                  Practice →
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* AI Intelligence */}
          <div style={{ padding: 14, background: "rgba(245,158,11,.05)", border: "1px solid rgba(245,158,11,.2)", borderRadius: "var(--radius)" }}>
            <p style={{ color: "var(--amber)", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>🤖 AI Topic Intelligence</p>
            <p style={{ color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6 }}>
              <strong style={{ color: "var(--text)" }}>Quadratic Equations</strong> has appeared in <strong style={{ color: "var(--amber)" }}>14 of the last 20 KCSE papers</strong> (70%). Focus on factorisation, completing the square, and the quadratic formula. Likely to appear in Paper 1.
            </p>
          </div>

          {/* Score History Chart */}
          <div className="card">
            <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📈 Practice Score History</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={HISTORY}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="year" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                <YAxis domain={[40, 100]} tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="score" stroke="var(--purple)" strokeWidth={2} dot={{ fill: "var(--purple)", r: 4 }} name="Score %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
