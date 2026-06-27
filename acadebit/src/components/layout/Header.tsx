"use client";
import { useStore } from "@/store";
import { PORTALS } from "@/lib/data";
import { Menu, Sun, Moon, Bell, ShoppingCart, Search } from "lucide-react";
import { useState, useEffect } from "react";

const NOTIF_COLORS: Record<string, string> = {
  success: "#22c55e", warning: "#f59e0b", error: "#ef4444", info: "#3b82f6",
};

export default function Header() {
  const { currentPortal, theme, toggleTheme, setSidebar, cart, setCartOpen, notifications, notifOpen, setNotifOpen, markAllRead } = useStore();
  const portal = PORTALS.find((p) => p.id === currentPortal);
  const [time, setTime] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  const iconBtn: React.CSSProperties = {
    position: "relative", color: "var(--muted)", background: "none",
    border: "none", cursor: "pointer", padding: 6, borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.15s",
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-2 px-4"
      style={{ height: 56, background: "var(--card)", borderBottom: "1px solid var(--border)", boxShadow: "0 1px 4px rgba(26,51,101,.06)" }}
    >
      <button className="md:hidden" onClick={() => setSidebar(true)} style={iconBtn}>
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 relative max-w-xs hidden sm:flex items-center">
        <Search size={13} style={{ position: "absolute", left: 10, color: "var(--muted2)", pointerEvents: "none" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search anything…"
          id="global-search"
          style={{
            width: "100%", background: "var(--bg)", border: "1.5px solid var(--border)",
            borderRadius: 100, padding: "6px 14px 6px 30px",
            color: "var(--text)", fontSize: 13, outline: "none", fontFamily: "inherit",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--navy)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        />
      </div>

      <div className="flex-1" />

      {/* Clock */}
      <span style={{ color: "var(--muted)", fontSize: 12, fontFamily: "monospace", letterSpacing: "0.04em" }}>{time}</span>

      {/* Notifications */}
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markAllRead(); }}
          style={iconBtn}
        >
          <Bell size={18} />
          {unread > 0 && (
            <span style={{
              position: "absolute", top: 4, right: 4,
              width: 7, height: 7, borderRadius: "50%",
              background: "var(--red)", border: "2px solid var(--card)",
            }} />
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 mt-1 w-72" style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", boxShadow: "var(--shadow-lg)", zIndex: 100,
          }}>
            <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text)", fontSize: 13, fontWeight: 700 }}>Notifications</span>
              {unread > 0 && (
                <span style={{ background: "#fef2f2", color: "var(--red)", borderRadius: 100, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
                  {unread} new
                </span>
              )}
            </div>
            {notifications.map((n) => (
              <div key={n.id} className="px-3 py-2" style={{ borderBottom: "1px solid var(--border)", opacity: n.read ? 0.55 : 1 }}>
                <div className="flex items-start gap-2">
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: NOTIF_COLORS[n.type], marginTop: 5, flexShrink: 0 }} />
                  <div>
                    <p style={{ color: "var(--text)", fontSize: 12, fontWeight: 600 }}>{n.title}</p>
                    <p style={{ color: "var(--muted)", fontSize: 11, marginTop: 1 }}>{n.message}</p>
                    <p style={{ color: "var(--muted2)", fontSize: 10, marginTop: 2 }}>{n.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Theme toggle */}
      <button onClick={toggleTheme} style={iconBtn} title="Toggle theme">
        {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
      </button>

      {/* Cart */}
      <button onClick={() => setCartOpen(true)} style={iconBtn}>
        <ShoppingCart size={17} />
        {cart.length > 0 && (
          <span style={{
            position: "absolute", top: 3, right: 3,
            background: "var(--yellow)", color: "#fff", borderRadius: "50%",
            width: 14, height: 14, fontSize: 9, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {cart.length}
          </span>
        )}
      </button>

      {/* Portal badge */}
      {portal && (
        <div className="hidden md:flex items-center gap-2 px-3 py-1" style={{
          background: `${portal.color}12`, border: `1.5px solid ${portal.color}30`, borderRadius: 100,
        }}>
          <span style={{ fontSize: 13 }}>{portal.icon}</span>
          <span style={{ color: portal.color, fontSize: 11, fontWeight: 700 }}>{portal.name}</span>
        </div>
      )}
    </header>
  );
}
