"use client";
import { useStore } from "@/store";
import { useState, useEffect } from "react";
import { Shield, AlertTriangle } from "lucide-react";

const HEADCOUNT = [
  { class: "Grade 8A", present: 43, total: 45, status: "SAFE" },
  { class: "Grade 8B", present: 40, total: 45, status: "SAFE" },
  { class: "Grade 7A", present: 45, total: 45, status: "SAFE" },
  { class: "Grade 7B", present: 38, total: 45, status: "CHECK" },
  { class: "Grade 6A", present: 41, total: 45, status: "SAFE" },
  { class: "Grade 6B", present: 36, total: 45, status: "ALERT" },
];

const FEATURES = [
  { icon: "👁️", title: "Facial Recognition Entry", desc: "All 4 gates monitored 24/7" },
  { icon: "📱", title: "Instant Parent SMS", desc: "Arrival & departure alerts" },
  { icon: "🗺️", title: "Campus Heatmap", desc: "Real-time learner location zones" },
  { icon: "🚨", title: "Panic Button Network", desc: "In every classroom & office" },
  { icon: "📹", title: "CCTV Integration", desc: "16-camera AI-reviewed feed" },
];

const STATUS_COLORS: Record<string, string> = {
  SAFE: "var(--green)",
  CHECK: "var(--amber)",
  ALERT: "var(--red)",
};

export default function SafetyCore() {
  const { emergencyActive, toggleEmergency } = useStore();
  const [elapsed, setElapsed] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!emergencyActive) { setElapsed(0); return; }
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(id);
  }, [emergencyActive, startTime]);

  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Shield size={22} style={{ color: "var(--green)" }} />
        <div>
          <h1 style={{ color: "var(--text)", fontSize: 22, fontWeight: 800 }}>SafetyCore™</h1>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Campus Safety & Security Management</p>
        </div>
      </div>

      {/* Emergency Banner */}
      {emergencyActive && (
        <div style={{
          background: "rgba(239,68,68,.1)",
          border: "1px solid var(--red)",
          borderRadius: "var(--radius)",
          padding: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AlertTriangle size={20} style={{ color: "var(--red)" }} />
            <div>
              <p style={{ color: "var(--red)", fontWeight: 700, fontSize: 14 }}>🚨 EMERGENCY ACTIVE — {fmtTime(elapsed)}</p>
              <p style={{ color: "var(--muted)", fontSize: 12 }}>Notifying 255 parents · Security alerted · Gates locked</p>
            </div>
          </div>
          <span className="badge" style={{ background: "rgba(239,68,68,.1)", color: "var(--red)" }}>LIVE</span>
        </div>
      )}

      {/* Big Emergency Button */}
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <button
          onClick={toggleEmergency}
          className={emergencyActive ? "pulse-emergency" : ""}
          style={{
            width: 160, height: 160, borderRadius: "50%",
            background: emergencyActive ? "var(--red)" : "rgba(239,68,68,.1)",
            border: `3px solid ${emergencyActive ? "var(--red)" : "rgba(239,68,68,.4)"}`,
            color: emergencyActive ? "#fff" : "var(--red)",
            fontSize: 14, fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            margin: "0 auto",
            transition: "all 0.3s ease",
          }}
        >
          <span style={{ fontSize: 32 }}>🚨</span>
          {emergencyActive ? "DEACTIVATE" : "ACTIVATE"}<br />EMERGENCY
        </button>
        <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 12 }}>
          {emergencyActive ? "Click to clear emergency alert" : "Click to trigger campus-wide emergency"}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
        {[
          { label: "On Campus", value: "263", color: "var(--blue)" },
          { label: "Accounted", value: "243", color: "var(--green)" },
          { label: "Unaccounted", value: "20", color: "var(--red)" },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ textAlign: "center" }}>
            <p style={{ color: s.color, fontSize: 32, fontWeight: 800, fontFamily: "DM Mono" }}>{s.value}</p>
            <p style={{ color: "var(--muted)", fontSize: 12 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {/* Live Headcount */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📋 Live Headcount</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {HEADCOUNT.map((c) => {
              const pct = Math.round((c.present / c.total) * 100);
              return (
                <div key={c.class}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: "var(--text)", fontSize: 12 }}>{c.class}</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ color: "var(--muted)", fontSize: 11 }}>{c.present}/{c.total}</span>
                      <span className="badge" style={{ background: `${STATUS_COLORS[c.status]}20`, color: STATUS_COLORS[c.status], fontSize: 10 }}>{c.status}</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: STATUS_COLORS[c.status] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prevention Features */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🛡️ SafetyCore™ Features</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 10px", background: "var(--card2)", borderRadius: 8 }}>
                <span style={{ fontSize: 20 }}>{f.icon}</span>
                <div>
                  <p style={{ color: "var(--text)", fontSize: 13, fontWeight: 600 }}>{f.title}</p>
                  <p style={{ color: "var(--muted)", fontSize: 11 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
