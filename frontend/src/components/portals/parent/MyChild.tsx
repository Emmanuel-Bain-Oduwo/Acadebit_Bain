"use client";
import { useState } from "react";
import { useStore } from "@/store";
import PaymentModal from "@/components/shared/PaymentModal";

const TIMELINE = [
  { time: "7:02 AM", event: "Arrived at school", icon: "✅" },
  { time: "7:30 AM", event: "Morning Assembly", icon: "🏫" },
  { time: "8:00 AM", event: "Mathematics — Quadratic Equations", icon: "📊" },
  { time: "9:00 AM", event: "English — Comprehension", icon: "📖" },
  { time: "10:00 AM", event: "Break Time", icon: "🍎" },
  { time: "10:30 AM", event: "Science — Photosynthesis (Current)", icon: "🔬" },
];

const SUBJECTS = [
  { name: "Mathematics", pct: 82, label: "ME" },
  { name: "English", pct: 74, label: "AE" },
  { name: "Science", pct: 91, label: "EE" },
  { name: "Kiswahili", pct: 67, label: "AE" },
];

const COMP_COLORS: Record<string, string> = {
  EE: "var(--green)", ME: "var(--blue)", AE: "var(--amber)", BE: "var(--red)",
};

export default function MyChild() {
  const { addToast, setPortal } = useStore();
  const [payOpen, setPayOpen] = useState(false);
  const [msg, setMsg] = useState("");

  const sendMsg = () => {
    if (!msg.trim()) return;
    addToast("success", "Message sent to Mr. James Mwangi (Mathematics)");
    setMsg("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {payOpen && <PaymentModal amount={25200} onClose={() => setPayOpen(false)} />}

      <h1 style={{ color: "var(--text)", fontSize: 22, fontWeight: 800 }}>My Child</h1>

      {/* Child Profile Card */}
      <div style={{
        background: "linear-gradient(135deg, rgba(20,184,166,.15), rgba(59,130,246,.1))",
        border: "1px solid rgba(20,184,166,.3)",
        borderRadius: "var(--radius)",
        padding: 20,
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        alignItems: "center",
      }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(20,184,166,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>👦</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ color: "var(--text)", fontSize: 20, fontWeight: 800 }}>Brian Omondi</h2>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Grade 8A · Adm: MJA/2021/045</p>
          <p style={{ color: "var(--muted)", fontSize: 12 }}>Mwangaza Junior Academy · Term 2, 2026</p>
        </div>
        <span className="badge" style={{ background: "rgba(34,197,94,.1)", color: "var(--green)" }}>✅ On Campus · Arrived 7:02 AM</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {/* Subject Progress */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📊 Academic Progress</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SUBJECTS.map((s) => (
              <div key={s.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "var(--text)", fontSize: 12 }}>{s.name}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ color: "var(--muted)", fontSize: 11 }}>{s.pct}%</span>
                    <span className="badge" style={{ background: `${COMP_COLORS[s.label]}20`, color: COMP_COLORS[s.label], fontSize: 9 }}>{s.label}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${s.pct}%`, background: COMP_COLORS[s.label] }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Timeline */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📅 Today&apos;s Timeline</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {TIMELINE.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 12, position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 16 }}>{t.icon}</span>
                  {i < TIMELINE.length - 1 && <div style={{ width: 1, flex: 1, background: "var(--border)", marginTop: 4 }} />}
                </div>
                <div>
                  <p style={{ color: "var(--text)", fontSize: 12, fontWeight: 500 }}>{t.event}</p>
                  <p style={{ color: "var(--muted)", fontSize: 10, fontFamily: "DM Mono" }}>{t.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Payment */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>💳 Fee Balance</h3>
          <div style={{ padding: 14, background: "rgba(239,68,68,.05)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 8, marginBottom: 12 }}>
            <p style={{ color: "var(--muted)", fontSize: 12 }}>Outstanding Balance</p>
            <p style={{ color: "var(--red)", fontSize: 28, fontWeight: 800, fontFamily: "DM Mono" }}>KES 25,200</p>
            <p style={{ color: "var(--muted)", fontSize: 11 }}>Due: 30 June 2026</p>
          </div>
          <button onClick={() => setPayOpen(true)} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            📱 Pay via M-Pesa
          </button>
          <p style={{ color: "var(--muted)", fontSize: 11, textAlign: "center", marginTop: 8 }}>Installment plans available</p>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={() => setPortal("shop")} className="btn btn-secondary" style={{ flex: 1, justifyContent: "center", fontSize: 12 }}>📚 Textbooks</button>
            <button onClick={() => setPortal("shop")} className="btn btn-secondary" style={{ flex: 1, justifyContent: "center", fontSize: 12 }}>👔 Uniforms</button>
          </div>
        </div>

        {/* Message Teacher */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>💬 Message Teacher</h3>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Write a message to Brian's teacher..."
            style={{
              width: "100%", height: 100,
              background: "var(--card2)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "10px 12px",
              color: "var(--text)", fontSize: 13, outline: "none", resize: "none",
            }}
          />
          <button onClick={sendMsg} className="btn btn-primary" style={{ marginTop: 8, width: "100%", justifyContent: "center" }}>
            Send Message
          </button>

          {/* Announcements */}
          <div style={{ marginTop: 16 }}>
            <h4 style={{ color: "var(--text)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>📢 School Announcements</h4>
            {[
              { title: "Parent-Teacher Day", msg: "Friday 4 July 2026, 2–5 PM. All parents welcome." },
              { title: "Term 2 Closing", msg: "School closes 18 July 2026. Report cards via SMS." },
            ].map((a, i) => (
              <div key={i} style={{ padding: "8px 10px", background: "var(--card2)", borderRadius: 8, marginBottom: 6 }}>
                <p style={{ color: "var(--text)", fontSize: 12, fontWeight: 600 }}>{a.title}</p>
                <p style={{ color: "var(--muted)", fontSize: 11 }}>{a.msg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
