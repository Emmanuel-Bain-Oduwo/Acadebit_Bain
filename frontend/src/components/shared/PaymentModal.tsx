"use client";
import { useState } from "react";
import { useStore } from "@/store";
import { X, Smartphone } from "lucide-react";
import { formatKES } from "@/lib/utils";

export default function PaymentModal({ amount = 25200, onClose }: { amount?: number; onClose: () => void }) {
  const { addToast } = useStore();
  const [phone, setPhone] = useState("0712 345 678");
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const quick = [4167, 6250, amount];

  const pay = () => {
    setLoading(true);
    addToast("info", "📱 STK Push sent to " + phone + ". Enter PIN.");
    setTimeout(() => {
      setLoading(false);
      addToast("success", "✅ Payment of " + formatKES(selected ?? amount) + " confirmed!");
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-lg)" }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2" style={{ color: "var(--text)" }}>
            <Smartphone size={18} style={{ color: "var(--green)" }} />
            <span className="font-semibold">Pay via M-Pesa</span>
          </div>
          <button onClick={onClose} style={{ color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
        </div>

        <div className="p-4 flex flex-col gap-3">
          <div>
            <label style={{ color: "var(--muted)", fontSize: 12, display: "block", marginBottom: 4 }}>M-Pesa Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: "100%", background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontSize: 14, outline: "none" }}
            />
          </div>

          <div>
            <label style={{ color: "var(--muted)", fontSize: 12, display: "block", marginBottom: 6 }}>Quick Amount</label>
            <div className="flex gap-2">
              {quick.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(q)}
                  style={{
                    flex: 1,
                    padding: "6px 8px",
                    borderRadius: 8,
                    border: `1px solid ${selected === q ? "var(--green)" : "var(--border)"}`,
                    background: selected === q ? "rgba(34,197,94,.1)" : "var(--card2)",
                    color: selected === q ? "var(--green)" : "var(--text)",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {i === 2 ? "Full" : `KES ${q.toLocaleString()}`}
                </button>
              ))}
            </div>
          </div>

          <button onClick={pay} disabled={loading} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="spinner" style={{ width: 14, height: 14, border: "2px solid #000", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block" }} />
                Sending...
              </span>
            ) : (
              `Send STK Push — ${formatKES(selected ?? amount)}`
            )}
          </button>
          <p style={{ color: "var(--muted)", fontSize: 11, textAlign: "center" }}>Installment plans available · Contact school bursar</p>
        </div>
      </div>
    </div>
  );
}
