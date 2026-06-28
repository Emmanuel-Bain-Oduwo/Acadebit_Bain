"use client";
import { STAFF } from "@/lib/data";
import { statusColor } from "@/lib/utils";
import { useStore } from "@/store";

export default function StaffView() {
  const { addToast } = useStore();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ color: "var(--text)", fontSize: 22, fontWeight: 800 }}>Staff & AutoTable™</h1>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>Staff directory, attendance & smart timetable</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
        {[
          { label: "Total Staff", value: "24", color: "var(--blue)" },
          { label: "Present", value: "22", color: "var(--green)" },
          { label: "Timetable", value: "Active", color: "var(--purple)" },
          { label: "Substitutes", value: "2", color: "var(--amber)" },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ textAlign: "center" }}>
            <p style={{ color: s.color, fontSize: 26, fontWeight: 800, fontFamily: "DM Mono" }}>{s.value}</p>
            <p style={{ color: "var(--muted)", fontSize: 12 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Staff Table */}
      <div className="card" style={{ overflowX: "auto" }}>
        <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>👥 Staff Directory</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Name", "Role", "Subjects", "Class", "TSC Number", "Status"].map((h) => (
                <th key={h} style={{ color: "var(--muted)", fontSize: 11, fontWeight: 600, padding: "8px 12px", textAlign: "left", borderBottom: "1px solid var(--border)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STAFF.map((s, i) => (
              <tr key={s.id} style={{ background: i % 2 === 0 ? "transparent" : "var(--card2)" }}>
                <td style={{ color: "var(--text)", fontSize: 13, fontWeight: 500, padding: "10px 12px" }}>{s.name}</td>
                <td style={{ color: "var(--muted)", fontSize: 12, padding: "10px 12px" }}>{s.role}</td>
                <td style={{ color: "var(--muted)", fontSize: 12, padding: "10px 12px" }}>{s.subjects}</td>
                <td style={{ color: "var(--muted)", fontSize: 12, padding: "10px 12px" }}>{s.class}</td>
                <td style={{ color: "var(--muted)", fontSize: 11, fontFamily: "DM Mono", padding: "10px 12px" }}>{s.tsc}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span className="badge" style={{ background: `${statusColor(s.status)}20`, color: statusColor(s.status) }}>
                    {s.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AutoTable info */}
      <div style={{ padding: 16, background: "rgba(168,85,247,.05)", border: "1px solid rgba(168,85,247,.2)", borderRadius: "var(--radius)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 20 }}>🗓️</span>
          <p style={{ color: "var(--purple)", fontWeight: 700, fontSize: 14 }}>AutoTable™ — AI Timetable Engine</p>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>
          AutoTable™ automatically generates conflict-free timetables considering teacher availability, subject loads, CBC strand requirements, and room capacities. When a teacher is absent, it instantly reassigns periods to available substitutes — no manual rescheduling needed.
        </p>
        <button
          onClick={() => addToast("info", "Regenerating timetable for Week 8...")}
          className="btn btn-secondary"
          style={{ marginTop: 12, fontSize: 12 }}
        >
          ⚡ Regenerate Timetable for Week 8
        </button>
      </div>
    </div>
  );
}
