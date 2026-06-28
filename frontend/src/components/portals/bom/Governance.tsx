"use client";
import { RESOLUTIONS } from "@/lib/data";
import { useStore } from "@/store";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatKES } from "@/lib/utils";

const BUDGET = [
  { cat: "Salaries", budget: 2100000, spent: 2050000 },
  { cat: "Infra", budget: 800000, spent: 420000 },
  { cat: "Learning", budget: 450000, spent: 380000 },
  { cat: "Ops", budget: 350000, spent: 290000 },
  { cat: "Security", budget: 200000, spent: 175000 },
];

const DOCS = [
  { name: "Agenda — BOM Meeting July 2026", status: "ready" },
  { name: "Audited Accounts — Term 1", status: "ready" },
  { name: "Infrastructure Progress Report", status: "ready" },
  { name: "Staff Appraisal Summary", status: "ready" },
  { name: "CBC Implementation Status", status: "in-progress" },
  { name: "Strategic Plan 2026–2030", status: "in-progress" },
];

const RES_COLORS: Record<string, string> = {
  PASSED: "var(--green)",
  DEFERRED: "var(--amber)",
  PENDING: "var(--blue)",
};

export default function Governance() {
  const { addToast } = useStore();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div>
          <h1 style={{ color: "var(--text)", fontSize: 22, fontWeight: 800 }}>Governance Dashboard</h1>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Mr. Samuel Kariuki (Chairman) · Mwangaza Junior Academy</p>
          <p style={{ color: "var(--muted)", fontSize: 12 }}>Next Meeting: Friday 4 July 2026</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
        {[
          { label: "Fee Collection", value: "79%", delta: "+4%", color: "var(--green)" },
          { label: "Staff Attendance", value: "94%", delta: "+1%", color: "var(--blue)" },
          { label: "Student Performance", value: "68%", delta: "-2%", color: "var(--red)" },
          { label: "Compliance", value: "91%", delta: "+6%", color: "var(--purple)" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <p style={{ color: "var(--muted)", fontSize: 12 }}>{s.label}</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <p style={{ color: s.color, fontSize: 26, fontWeight: 800, fontFamily: "DM Mono" }}>{s.value}</p>
              <span style={{ color: s.delta.startsWith("+") ? "var(--green)" : "var(--red)", fontSize: 11, fontWeight: 600 }}>{s.delta}</span>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 10 }}>vs last term</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(320px, 100%), 1fr))", gap: 16 }}>
        {/* Budget Chart */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>💰 Budget vs Expenditure</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={BUDGET} layout="vertical" barGap={4}>
              <XAxis type="number" tickFormatter={(v) => `${v / 1000}K`} tick={{ fill: "var(--muted)", fontSize: 10 }} />
              <YAxis dataKey="cat" type="category" tick={{ fill: "var(--muted)", fontSize: 11 }} width={55} />
              <Tooltip
                contentStyle={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 8 }}
                formatter={(v) => [formatKES(Number(v)), ""]}
              />
              <Bar dataKey="budget" fill="var(--border)" radius={[0, 4, 4, 0]} name="Budget" />
              <Bar dataKey="spent" fill="var(--amber)" radius={[0, 4, 4, 0]} name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Resolutions */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>⚖️ Board Resolutions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {RESOLUTIONS.map((r) => (
              <div key={r.id} style={{ padding: "10px 12px", background: "var(--card2)", borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <p style={{ color: "var(--text)", fontSize: 12, fontWeight: 500, flex: 1 }}>{r.title}</p>
                  <span className="badge" style={{ background: `${RES_COLORS[r.status]}20`, color: RES_COLORS[r.status], fontSize: 10, flexShrink: 0 }}>{r.status}</span>
                </div>
                <p style={{ color: "var(--muted)", fontSize: 11, marginTop: 4 }}>Votes: {r.votes}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Board Meeting Pack */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700 }}>📁 Board Meeting Pack</h3>
            <button onClick={() => addToast("success", "Downloading all documents...")} className="btn btn-secondary" style={{ fontSize: 11, padding: "4px 10px" }}>
              Download All
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {DOCS.map((d) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: "var(--card2)", borderRadius: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>📄</span>
                  <span style={{ color: "var(--text)", fontSize: 12 }}>{d.name}</span>
                </div>
                <span className="badge" style={{
                  background: d.status === "ready" ? "rgba(34,197,94,.1)" : "rgba(245,158,11,.1)",
                  color: d.status === "ready" ? "var(--green)" : "var(--amber)",
                  fontSize: 9,
                }}>
                  {d.status === "ready" ? "✓ Ready" : "In Progress"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
