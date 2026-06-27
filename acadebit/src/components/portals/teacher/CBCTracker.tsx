"use client";
import { STUDENTS } from "@/lib/data";
import { competencyColor } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const SCHEME = [
  { week: "Wk 5", topic: "Introduction to Algebra", done: true },
  { week: "Wk 6", topic: "Linear Equations", done: true },
  { week: "Wk 7", topic: "Quadratic Equations", done: false, current: true },
  { week: "Wk 8", topic: "Coordinate Geometry", done: false },
  { week: "Wk 9", topic: "Statistics & Probability", done: false },
];

const SUBJECT_PERF = [
  { subject: "Maths", score: 68 },
  { subject: "English", score: 74 },
  { subject: "Science", score: 71 },
  { subject: "Kiswahili", score: 66 },
  { subject: "Social", score: 80 },
];

export default function CBCTracker() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div>
          <h1 style={{ color: "var(--text)", fontSize: 22, fontWeight: 800 }}>CBC Tracker & Classes</h1>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Mr. James Mwangi · Mathematics · Grade 8A · Term 2</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { l: "My Students", v: "178", c: "var(--blue)" },
            { l: "Lessons Done", v: "16", c: "var(--green)" },
            { l: "Tests Pending", v: "2", c: "var(--amber)" },
            { l: "Parent Messages", v: "7", c: "var(--purple)" },
          ].map((s) => (
            <div key={s.l} className="card2" style={{ padding: "8px 14px", textAlign: "center" }}>
              <p style={{ color: s.c, fontSize: 18, fontWeight: 800, fontFamily: "DM Mono" }}>{s.v}</p>
              <p style={{ color: "var(--muted)", fontSize: 10 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Competency Table */}
      <div className="card" style={{ overflowX: "auto" }}>
        <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
          📊 CBC Competency — Grade 8A · Week 7
          <span style={{ marginLeft: 8, fontSize: 11, color: "var(--muted)", fontWeight: 400 }}>
            EE=Exceeds ME=Meets AE=Approaching BE=Below
          </span>
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Student", "Algebra", "Geometry", "Statistics", "Overall", "Attendance"].map((h) => (
                <th key={h} style={{ color: "var(--muted)", fontSize: 11, fontWeight: 600, padding: "8px 12px", textAlign: "left", borderBottom: "1px solid var(--border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STUDENTS.map((s, i) => (
              <tr key={s.id} style={{ background: i % 2 === 0 ? "transparent" : "var(--card2)" }}>
                <td style={{ color: "var(--text)", fontSize: 13, fontWeight: 500, padding: "10px 12px" }}>{s.name}</td>
                {[s.competencies.algebra, s.competencies.geometry, s.competencies.stats, s.competencies.overall].map((c, j) => (
                  <td key={j} style={{ padding: "10px 12px" }}>
                    <span className="badge" style={{ background: `${competencyColor(c)}20`, color: competencyColor(c) }}>{c}</span>
                  </td>
                ))}
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ color: s.competencies.attendance >= 90 ? "var(--green)" : s.competencies.attendance >= 80 ? "var(--amber)" : "var(--red)", fontFamily: "DM Mono", fontSize: 13 }}>
                    {s.competencies.attendance}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {/* Scheme of Work */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📅 Scheme of Work</h3>
          {SCHEME.map((w) => (
            <div
              key={w.week}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 8,
                marginBottom: 6,
                background: w.current ? "rgba(59,130,246,.1)" : "var(--card2)",
                border: w.current ? "1px solid rgba(59,130,246,.3)" : "1px solid transparent",
              }}
            >
              <span style={{ color: "var(--muted)", fontSize: 11, fontFamily: "DM Mono", width: 30 }}>{w.week}</span>
              <span style={{ color: w.current ? "var(--blue)" : "var(--text)", fontSize: 13, flex: 1, fontWeight: w.current ? 600 : 400 }}>{w.topic}</span>
              {w.done ? <span style={{ color: "var(--green)" }}>✓</span> : w.current ? <span className="badge" style={{ background: "rgba(59,130,246,.1)", color: "var(--blue)", fontSize: 10 }}>NOW</span> : null}
            </div>
          ))}
        </div>

        {/* Class Performance Chart */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📈 Class Performance by Subject</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SUBJECT_PERF} layout="vertical">
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "var(--muted)", fontSize: 11 }} />
              <YAxis dataKey="subject" type="category" tick={{ fill: "var(--muted)", fontSize: 11 }} width={60} />
              <Tooltip contentStyle={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="score" fill="var(--blue)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
