"use client";
import { useStore } from "@/store";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const ICONS = {
  success: <CheckCircle size={16} />,
  error: <XCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info: <Info size={16} />,
};

const COLORS = {
  success: "var(--green)",
  error: "var(--red)",
  warning: "var(--amber)",
  info: "var(--blue)",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 360 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className={t.exiting ? "toast-exit" : "toast-enter"}
          style={{
            background: "var(--card)",
            border: `1px solid ${COLORS[t.type]}40`,
            borderLeft: `3px solid ${COLORS[t.type]}`,
            borderRadius: "var(--radius)",
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 8px 32px rgba(0,0,0,.5)",
            pointerEvents: "all",
            color: "var(--text)",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <span style={{ color: COLORS[t.type], flexShrink: 0 }}>{ICONS[t.type]}</span>
          <span style={{ flex: 1 }}>{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            style={{ color: "var(--text-muted)", cursor: "pointer", background: "none", border: "none", padding: 2, flexShrink: 0 }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
