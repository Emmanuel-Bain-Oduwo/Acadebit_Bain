"use client";
import { COMPLIANCE_ITEMS } from "@/lib/data";
import { statusColor } from "@/lib/utils";
import { useStore } from "@/store";
import { useState } from "react";

const REPORTS = [
  { name: "NEMIS Learner Register", icon: "📋" },
  { name: "CBC Assessment Summary", icon: "📊" },
  { name: "Teacher Deployment Report", icon: "👩‍🏫" },
  { name: "Infrastructure Audit", icon: "🏗️" },
  { name: "Financial Returns (Term 2)", icon: "💰" },
];

export default function GovBridge() {
  const { addToast } = useStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());

  const generate = (name: string) => {
    setLoading(name);
    setTimeout(() => {
      setLoading(null);
      setDone((d) => new Set(Array.from(d).concat(name)));
      addToast("success", `✅ "${name}" generated successfully!`);
    }, 1800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ color: "var(--text)", fontSize: 22, fontWeight: 800 }}>GovBridge™ Reports</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Ministry compliance, NEMIS sync & government reporting</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
        {[
          { label: "NEMIS Sync", value: "98.2%", color: "var(--green)" },
          { label: "MoE Score", value: "91%", color: "var(--blue)" },
          { label: "Pending", value: "2", color: "var(--amber)" },
          { label: "Generated", value: "14", color: "var(--purple)" },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ textAlign: "center" }}>
            <p style={{ color: s.color, fontSize: 26, fontWeight: 800, fontFamily: "DM Mono" }}>{s.value}</p>
            <p style={{ color: "var(--text-muted)", fontSize: 12 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {/* Compliance Checklist */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>✅ Compliance Checklist</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {COMPLIANCE_ITEMS.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: "var(--card2)", borderRadius: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor(item.status), flexShrink: 0 }} />
                  <span style={{ color: "var(--text)", fontSize: 13 }}>{item.label}</span>
                </div>
                <span className="badge" style={{
                  background: `${statusColor(item.status)}20`,
                  color: statusColor(item.status),
                  fontSize: 10,
                }}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* One-Click Reports */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🖨️ One-Click Reports</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {REPORTS.map((r) => (
              <div key={r.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "var(--card2)", borderRadius: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{r.icon}</span>
                  <span style={{ color: "var(--text)", fontSize: 13 }}>{r.name}</span>
                </div>
                <button
                  onClick={() => generate(r.name)}
                  disabled={loading === r.name}
                  className="btn btn-secondary"
                  style={{ fontSize: 11, padding: "4px 10px", color: done.has(r.name) ? "var(--green)" : undefined, borderColor: done.has(r.name) ? "var(--green)" : undefined }}
                >
                  {loading === r.name ? (
                    <span className="spinner" style={{ width: 12, height: 12, border: "2px solid var(--text-muted)", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block" }} />
                  ) : done.has(r.name) ? "✓ Done" : "Generate"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
