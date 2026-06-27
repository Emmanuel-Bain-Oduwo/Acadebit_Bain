"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { FEE_DATA } from "@/lib/data";
import { formatKES } from "@/lib/utils";
import { useStore } from "@/store";

const GATE_LOG = [
  { name: "Brian Omondi", time: "7:02 AM", badge: "IN" },
  { name: "Grace Achieng (Staff)", time: "7:15 AM", badge: "IN" },
  { name: "Kevin Njoroge", time: "7:44 AM", badge: "LATE" },
  { name: "Unknown Visitor", time: "9:31 AM", badge: "BLOCKED" },
  { name: "Daniel Kimani (parent)", time: "10:05 AM", badge: "IN" },
  { name: "Peter Mutua (Staff)", time: "10:22 AM", badge: "OUT" },
];

const CLASS_ATTENDANCE = [
  { class: "Gr 8A", present: 43, absent: 2 },
  { class: "Gr 8B", present: 40, absent: 5 },
  { class: "Gr 7A", present: 45, absent: 0 },
  { class: "Gr 7B", present: 38, absent: 7 },
  { class: "Gr 6A", present: 41, absent: 4 },
  { class: "Gr 6B", present: 36, absent: 9 },
];

const BADGE_COLORS: Record<string, string> = {
  IN: "var(--green)",
  LATE: "var(--amber)",
  OUT: "var(--blue)",
  BLOCKED: "var(--red)",
};

export default function PrincipalDashboard() {
  const { addToast } = useStore();

  const stats = [
    { label: "Enrolment", value: "255", sub: "Learners", color: "var(--blue)", icon: "👥" },
    { label: "Present Today", value: "243", sub: "95.3% attendance", color: "var(--green)", icon: "✅" },
    { label: "Fee Collection", value: "79%", sub: "KES 960K / 1.2M", color: "var(--amber)", icon: "💳" },
    { label: "Staff On Duty", value: "22/24", sub: "2 on leave", color: "var(--purple)", icon: "👩‍🏫" },
  ];

  const atRisk = [
    { name: "Daniel Kimani", issue: "73% attendance · BE in Maths", severity: "HIGH" },
    { name: "Kevin Njoroge", issue: "81% attendance · AE overall", severity: "MED" },
    { name: "Grace Odhiambo", issue: "Missing 3 assignments", severity: "MED" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ color: "var(--text)", fontSize: 22, fontWeight: 800 }}>Mwangaza Junior Academy</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Term 2, Week 7 · Friday, 27 June 2026</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="badge" style={{ background: "rgba(34,197,94,.1)", color: "var(--green)" }}>● 243 Present</span>
          <span className="badge" style={{ background: "rgba(239,68,68,.1)", color: "var(--red)" }}>● 12 Absent</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 4 }}>{s.label}</p>
                <p style={{ color: s.color, fontSize: 28, fontWeight: 800, fontFamily: "DM Mono, monospace" }}>{s.value}</p>
                <p style={{ color: "var(--text-muted)", fontSize: 11 }}>{s.sub}</p>
              </div>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
        {/* Fee Collection Chart */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📊 Fee Collection — Jan to Jun 2026</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={FEE_DATA} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${v / 1000}K`} tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 8 }}
                formatter={(v) => [formatKES(Number(v)), ""]}
              />
              <Bar dataKey="expected" fill="var(--border)" radius={[4, 4, 0, 0]} name="Expected" />
              <Bar dataKey="collected" fill="var(--green)" radius={[4, 4, 0, 0]} name="Collected" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI At-Risk Alerts */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🤖 AI At-Risk Alerts</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {atRisk.map((s) => (
              <button
                key={s.name}
                onClick={() => addToast("warning", `Viewing ${s.name}'s full profile — ${s.issue}`)}
                style={{
                  background: "var(--card2)",
                  border: `1px solid ${s.severity === "HIGH" ? "var(--red)" : "var(--amber)"}30`,
                  borderRadius: 8,
                  padding: "10px 12px",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = s.severity === "HIGH" ? "var(--red)" : "var(--amber)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = `${s.severity === "HIGH" ? "var(--red)" : "var(--amber)"}30`}
              >
                <div>
                  <p style={{ color: "var(--text)", fontSize: 13, fontWeight: 600 }}>{s.name}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: 11 }}>{s.issue}</p>
                </div>
                <span className="badge" style={{
                  background: s.severity === "HIGH" ? "rgba(239,68,68,.1)" : "rgba(245,158,11,.1)",
                  color: s.severity === "HIGH" ? "var(--red)" : "var(--amber)",
                }}>{s.severity}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Gate Log */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🚪 Biometric Gate Log</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {GATE_LOG.map((g, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <p style={{ color: "var(--text)", fontSize: 12, fontWeight: 500 }}>{g.name}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: 10, fontFamily: "DM Mono, monospace" }}>{g.time}</p>
                </div>
                <span className="badge" style={{ background: `${BADGE_COLORS[g.badge]}20`, color: BADGE_COLORS[g.badge] }}>{g.badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance by Class */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📋 Attendance by Class</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {CLASS_ATTENDANCE.map((c) => {
              const total = c.present + c.absent;
              const pct = Math.round((c.present / total) * 100);
              return (
                <div key={c.class}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: "var(--text)", fontSize: 12 }}>{c.class}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{c.present}/{total} · {pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 95 ? "var(--green)" : pct >= 85 ? "var(--amber)" : "var(--red)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
