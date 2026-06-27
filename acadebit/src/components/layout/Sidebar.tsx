"use client";
import { useStore } from "@/store";
import { PORTALS } from "@/lib/data";
import { X, ArrowLeft, GraduationCap } from "lucide-react";

export default function Sidebar() {
  const { currentPortal, currentView, setView, setSidebar, sidebarOpen, setPortal } = useStore();
  const portal = PORTALS.find((p) => p.id === currentPortal);

  if (!portal) return null;

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebar(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{ width: 210, background: "var(--card)", borderRight: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}
      >
        {/* Brand */}
        <div className="p-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div style={{
                width: 32, height: 32, borderRadius: 9, background: "var(--navy)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <GraduationCap size={16} color="#f5a623" />
              </div>
              <div>
                <div style={{ color: "var(--navy)", fontSize: 13, fontWeight: 800, letterSpacing: "-0.01em" }}>Acadebit</div>
                <div style={{ color: "var(--muted2)", fontSize: 9, fontWeight: 600, letterSpacing: "0.08em" }}>KENYA SCHOOL OS</div>
              </div>
            </div>
            <button className="md:hidden" onClick={() => setSidebar(false)}
              style={{ color: "var(--muted)", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <X size={16} />
            </button>
          </div>

          {/* Active portal chip */}
          <div style={{
            background: `${portal.color}12`, border: `1.5px solid ${portal.color}30`,
            borderRadius: 10, padding: "7px 10px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>{portal.icon}</span>
            <div>
              <div style={{ color: portal.color, fontSize: 11, fontWeight: 700 }}>{portal.name}</div>
              <div style={{ color: "var(--muted)", fontSize: 10 }}>{portal.role}</div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <div style={{ color: "var(--muted2)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", padding: "4px 8px 8px" }}>MENU</div>
          {portal.views.map((v) => (
            <button
              key={v.id}
              onClick={() => { setView(v.id); setSidebar(false); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "9px 10px", borderRadius: 9, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: currentView === v.id ? 700 : 500,
                background: currentView === v.id ? "var(--navy)" : "transparent",
                color: currentView === v.id ? "#fff" : "var(--muted)",
                transition: "all 0.15s", textAlign: "left", marginBottom: 2,
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => { if (currentView !== v.id) (e.currentTarget as HTMLElement).style.background = "var(--bg2)"; }}
              onMouseLeave={(e) => { if (currentView !== v.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <span style={{ fontSize: 15 }}>{v.icon}</span>
              {v.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => setPortal(null)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 8,
              padding: "8px 10px", borderRadius: 9, fontFamily: "inherit",
              border: "1.5px solid var(--border)", background: "transparent",
              color: "var(--muted)", fontSize: 12, fontWeight: 600, cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--navy)"; (e.currentTarget as HTMLElement).style.color = "var(--navy)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
          >
            <ArrowLeft size={14} />
            All Portals
          </button>
          <p style={{ color: "var(--muted2)", fontSize: 10, textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
            Mwangaza Junior Academy<br />Term 2 · 2026
          </p>
        </div>
      </aside>
    </>
  );
}
