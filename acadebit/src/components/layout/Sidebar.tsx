"use client";
import { useStore } from "@/store";
import { PORTALS } from "@/lib/data";
import { X, ArrowLeft } from "lucide-react";

export default function Sidebar() {
  const { currentPortal, currentView, setView, setSidebar, sidebarOpen, setPortal } = useStore();
  const portal = PORTALS.find((p) => p.id === currentPortal);

  if (!portal) return null;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebar(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{
          width: 210,
          background: "var(--card)",
          borderRight: "1px solid var(--border)",
        }}
      >
        {/* Logo */}
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span style={{
                width: 30, height: 30, borderRadius: 8,
                background: `${portal.color}20`,
                border: `1px solid ${portal.color}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14
              }}>A</span>
              <div>
                <div style={{ color: "var(--text)", fontSize: 13, fontWeight: 700 }}>Acadebit</div>
                <div style={{ color: "var(--text-muted)", fontSize: 9, letterSpacing: "0.1em" }}>KENYA SCHOOL OS</div>
              </div>
            </div>
            <button className="md:hidden" onClick={() => setSidebar(false)} style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
              <X size={16} />
            </button>
          </div>

          {/* Portal badge */}
          <div style={{
            background: `${portal.color}15`,
            border: `1px solid ${portal.color}30`,
            borderRadius: 8,
            padding: "6px 10px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>{portal.icon}</span>
            <div>
              <div style={{ color: portal.color, fontSize: 11, fontWeight: 700 }}>{portal.name}</div>
              <div style={{ color: "var(--text-muted)", fontSize: 10 }}>{portal.role}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <div style={{ color: "var(--text-muted)", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", padding: "4px 8px 8px" }}>NAVIGATION</div>
          {portal.views.map((v) => (
            <button
              key={v.id}
              onClick={() => { setView(v.id); setSidebar(false); }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: currentView === v.id ? 600 : 400,
                background: currentView === v.id ? `${portal.color}15` : "transparent",
                color: currentView === v.id ? portal.color : "var(--text-muted)",
                transition: "all 0.15s ease",
                textAlign: "left",
                marginBottom: 2,
              }}
              onMouseEnter={(e) => { if (currentView !== v.id) (e.currentTarget as HTMLElement).style.background = "var(--card2)"; }}
              onMouseLeave={(e) => { if (currentView !== v.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <span style={{ fontSize: 15 }}>{v.icon}</span>
              {v.label}
            </button>
          ))}
        </nav>

        {/* Back to portals */}
        <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={() => setPortal(null)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text-muted)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={14} />
            All Portals
          </button>
          <p style={{ color: "var(--text-muted)", fontSize: 10, textAlign: "center", marginTop: 8 }}>
            Mwangaza Junior Academy<br />Term 2, 2026
          </p>
        </div>
      </aside>
    </>
  );
}
