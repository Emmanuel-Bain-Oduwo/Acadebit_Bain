"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { FEE_DATA } from "@/lib/data";
import { formatKES } from "@/lib/utils";
import { useStore } from "@/store";

const PAYMENTS = [
  { name: "Mary Wanjiku (Brian)", amount: 6250, time: "9:04 AM", mpesa: "QKP2B3R1A9" },
  { name: "Joseph Kamau (Aisha)", amount: 4167, time: "8:47 AM", mpesa: "QKP2A1R8B7" },
  { name: "Hassan Abdi (Fatuma)", amount: 12500, time: "8:23 AM", mpesa: "QKP1Z9R3C2" },
  { name: "Wanjiku Njoroge (Kevin)", amount: 4167, time: "Yesterday", mpesa: "QKP1Y8R2D1" },
];

export default function FeeSmart() {
  const { addToast } = useStore();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ color: "var(--text)", fontSize: 22, fontWeight: 800 }}>FeeSmart™</h1>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>Fee Management & M-Pesa Integration</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
        {[
          { label: "Collected", value: "KES 960K", color: "var(--green)", icon: "✅" },
          { label: "Outstanding", value: "KES 252K", color: "var(--red)", icon: "⚠️" },
          { label: "M-Pesa Payments", value: "187", color: "var(--blue)", icon: "📱" },
          { label: "Reminders Sent", value: "312", color: "var(--amber)", icon: "📣" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "var(--muted)", fontSize: 12 }}>{s.label}</p>
                <p style={{ color: s.color, fontSize: 22, fontWeight: 800, fontFamily: "DM Mono" }}>{s.value}</p>
              </div>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
        {/* Trend Chart */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📈 Monthly Collection Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={FEE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${v / 1000}K`} tick={{ fill: "var(--muted)", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 8 }}
                formatter={(v) => [formatKES(Number(v)), ""]}
              />
              <Line type="monotone" dataKey="collected" stroke="var(--green)" strokeWidth={2} dot={{ fill: "var(--green)" }} name="Collected" />
              <Line type="monotone" dataKey="expected" stroke="var(--border)" strokeWidth={2} strokeDasharray="5 5" name="Expected" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Payments */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700 }}>💳 Recent Payments</h3>
            <button onClick={() => addToast("info", "Sending payment reminders to 45 defaulters...")} className="btn btn-secondary" style={{ fontSize: 11, padding: "4px 10px" }}>
              Send Reminders
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PAYMENTS.map((p) => (
              <div key={p.mpesa} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "var(--card2)", borderRadius: 8 }}>
                <div>
                  <p style={{ color: "var(--text)", fontSize: 12, fontWeight: 500 }}>{p.name}</p>
                  <p style={{ color: "var(--muted)", fontSize: 10, fontFamily: "DM Mono" }}>{p.mpesa} · {p.time}</p>
                </div>
                <span style={{ color: "var(--green)", fontWeight: 700, fontSize: 13, fontFamily: "DM Mono" }}>+{formatKES(p.amount)}</span>
              </div>
            ))}
          </div>

          {/* M-Pesa info box */}
          <div style={{ marginTop: 12, padding: 12, background: "rgba(34,197,94,.05)", border: "1px solid rgba(34,197,94,.15)", borderRadius: 8 }}>
            <p style={{ color: "var(--green)", fontSize: 11, fontWeight: 600 }}>M-Pesa Flow</p>
            <p style={{ color: "var(--muted)", fontSize: 11 }}>Parent pays → MPESA confirms → Acadebit auto-allocates → SMS receipt sent → Balance updated in real-time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
