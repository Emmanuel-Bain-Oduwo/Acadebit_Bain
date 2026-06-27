"use client";
import { useStore } from "@/store";
import { PORTALS } from "@/lib/data";
import { Menu, Sun, Moon, Bell, ShoppingCart, Search } from "lucide-react";
import { useState, useEffect } from "react";

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

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-3 px-4"
      style={{
        height: 56,
        background: "var(--card)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Hamburger (mobile) */}
      <button
        className="md:hidden"
        onClick={() => setSidebar(true)}
        style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 relative max-w-xs hidden sm:block">
        <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search anything..."
          id="global-search"
          style={{
            width: "100%",
            background: "var(--card2)",
            border: "1px solid var(--border)",
            borderRadius: 100,
            padding: "6px 12px 6px 30px",
            color: "var(--text)",
            fontSize: 13,
            outline: "none",
          }}
        />
      </div>

      <div className="flex-1" />

      {/* Clock */}
      <span style={{ color: "var(--text-muted)", fontSize: 12, fontFamily: "DM Mono, monospace" }}>{time}</span>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setNotifOpen(!notifOpen); if (notifOpen) markAllRead(); }}
          style={{ position: "relative", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <Bell size={18} />
          {unread > 0 && (
            <span style={{
              position: "absolute", top: 0, right: 0,
              width: 8, height: 8, borderRadius: "50%",
              background: "var(--red)", border: "2px solid var(--card)"
            }} />
          )}
        </button>

        {notifOpen && (
          <div
            className="absolute right-0 mt-2 w-72"
            style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "0 8px 32px rgba(0,0,0,.5)", zIndex: 100 }}
          >
            <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
              <span style={{ color: "var(--text)", fontSize: 13, fontWeight: 600 }}>Notifications</span>
              <span className="badge" style={{ background: "var(--red)20", color: "var(--red)" }}>{unread} new</span>
            </div>
            {notifications.map((n) => (
              <div key={n.id} className="p-3 border-b" style={{ borderColor: "var(--border)", opacity: n.read ? 0.6 : 1 }}>
                <p style={{ color: "var(--text)", fontSize: 12, fontWeight: 600 }}>{n.title}</p>
                <p style={{ color: "var(--text-muted)", fontSize: 11 }}>{n.message}</p>
                <p style={{ color: "var(--text-muted)", fontSize: 10, marginTop: 2 }}>{n.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 4 }}
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Cart */}
      <button
        onClick={() => setCartOpen(true)}
        style={{ position: "relative", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 4 }}
      >
        <ShoppingCart size={18} />
        {cart.length > 0 && (
          <span style={{
            position: "absolute", top: 0, right: 0,
            background: "var(--orange)",
            color: "#fff",
            borderRadius: "50%",
            width: 14, height: 14,
            fontSize: 9, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {cart.length}
          </span>
        )}
      </button>

      {/* Portal badge */}
      {portal && (
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1"
          style={{ background: `${portal.color}15`, border: `1px solid ${portal.color}30`, borderRadius: 100 }}
        >
          <span style={{ fontSize: 13 }}>{portal.icon}</span>
          <span style={{ color: portal.color, fontSize: 11, fontWeight: 700 }}>{portal.name}</span>
        </div>
      )}
    </header>
  );
}
