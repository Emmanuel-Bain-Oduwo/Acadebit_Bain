"use client";
import { COUNTY_DATA, COMPLIANCE_ITEMS } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useStore } from "@/store";
import { statusColor } from "@/lib/utils";

export default function NationalDash() {
  const { addToast } = useStore();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 24 }}>🏛️</span>
          <h1 style={{ color: "var(--text)", fontSize: 22, fontWeight: 800 }}>Ministry of Education</h1>
          <span className="badge" style={{ background: "rgba(99,102,241,.1)", color: "var(--indigo)" }}>GovBridge™</span>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>National CBC Compliance & School Performance Dashboard</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
        {[
          { label: "Schools on Acadebit", value: "1,847", color: "var(--indigo)", icon: "🏫" },
          { label: "Total Learners", value: "412K", color: "var(--blue)", icon: "👥" },
          { label: "CBC Compliance", value: "67%", delta: "+12%", color: "var(--green)", icon: "✅" },
          { label: "NEMIS Sync", value: "98.2%", color: "var(--teal)", icon: "🔄" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "var(--muted)", fontSize: 11 }}>{s.label}</p>
                <p style={{ color: s.color, fontSize: 24, fontWeight: 800, fontFamily: "DM Mono" }}>{s.value}</p>
                {s.delta && <span style={{ color: "var(--green)", fontSize: 11, fontWeight: 600 }}>{s.delta} this year</span>}
              </div>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {/* County Compliance Chart */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📊 CBC Compliance by County</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={COUNTY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="county" tick={{ fill: "var(--muted)", fontSize: 10 }} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fill: "var(--muted)", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 8 }}
                formatter={(v) => [`${v}%`, "Compliance"]}
              />
              <Bar dataKey="compliance" radius={[4, 4, 0, 0]} fill="var(--indigo)"
                label={{ position: "top", fill: "var(--muted)", fontSize: 10, formatter: (v: unknown) => `${v}%` }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* National Compliance Status */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>✅ National Compliance Status</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {COMPLIANCE_ITEMS.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: "var(--card2)", borderRadius: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor(item.status), flexShrink: 0 }} />
                  <span style={{ color: "var(--text)", fontSize: 12 }}>{item.label}</span>
                </div>
                <span className="badge" style={{ background: `${statusColor(item.status)}20`, color: statusColor(item.status), fontSize: 10 }}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={() => addToast("info", "Generating county report...")} className="btn btn-secondary" style={{ flex: 1, justifyContent: "center", fontSize: 12 }}>
              📊 County Report
            </button>
            <button onClick={() => addToast("success", "NEMIS export package prepared!")} className="btn btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 12 }}>
              📦 NEMIS Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
