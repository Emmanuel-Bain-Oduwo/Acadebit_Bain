"use client";
import { useState } from "react";
import { TEXTBOOKS, LAB_EQUIPMENT, UNIFORMS } from "@/lib/data";
import { formatKES } from "@/lib/utils";
import { useStore } from "@/store";

const TABS = ["Textbooks", "Lab Equipment", "Uniforms"];

const LPO_STEPS = [
  { icon: "🏫", label: "Principal selects items" },
  { icon: "📋", label: "LPO auto-generated" },
  { icon: "✅", label: "Supplier confirms" },
  { icon: "🚚", label: "Delivered to school" },
];

const PARENT_STEPS = [
  { icon: "📱", label: "Parent orders via app" },
  { icon: "💳", label: "M-Pesa payment" },
  { icon: "📦", label: "School confirms size" },
  { icon: "🎒", label: "Collected at gate" },
];

export default function ShopView() {
  const [tab, setTab] = useState("Textbooks");
  const { addToCart } = useStore();

  const products = tab === "Textbooks" ? TEXTBOOKS : tab === "Lab Equipment" ? LAB_EQUIPMENT : UNIFORMS;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ color: "var(--text)", fontSize: 22, fontWeight: 800 }}>Acadebit Shop 🛒</h1>
        {tab === "Textbooks" && <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Recommended for Grade 8 · Brian Omondi</p>}
        {tab === "Uniforms" && <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Uniforms — Mwangaza Junior Academy</p>}
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: tab === t ? "var(--orange)" : "var(--card2)",
              color: tab === t ? "#fff" : "var(--text-muted)",
              border: `1px solid ${tab === t ? "var(--orange)" : "var(--border)"}`,
              borderRadius: 100, padding: "6px 16px", fontSize: 13, fontWeight: tab === t ? 600 : 400, cursor: "pointer",
            }}
          >
            {t}
          </button>
        ))}
        {["Stationery", "Sports"].map((t) => (
          <button key={t} style={{ background: "var(--card2)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 100, padding: "6px 16px", fontSize: 13, cursor: "not-allowed", opacity: 0.5 }}>
            {t} <span style={{ fontSize: 9 }}>Soon</span>
          </button>
        ))}
      </div>

      {/* LPO Flow (Lab) */}
      {tab === "Lab Equipment" && (
        <div style={{ padding: 16, background: "rgba(59,130,246,.05)", border: "1px solid rgba(59,130,246,.2)", borderRadius: "var(--radius)" }}>
          <p style={{ color: "var(--blue)", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>🏫 School Purchase Order Flow</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-around" }}>
            {LPO_STEPS.map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "10px 16px", background: "var(--card2)", borderRadius: 8, minWidth: 120 }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
                <p style={{ color: "var(--text)", fontSize: 11, fontWeight: 500 }}>Step {i + 1}</p>
                <p style={{ color: "var(--text-muted)", fontSize: 10 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parent Flow (Uniforms) */}
      {tab === "Uniforms" && (
        <div style={{ padding: 16, background: "rgba(20,184,166,.05)", border: "1px solid rgba(20,184,166,.2)", borderRadius: "var(--radius)" }}>
          <p style={{ color: "var(--teal)", fontWeight: 700, fontSize: 13, marginBottom: 12 }}>👨‍👩‍👧 How it works for Parents</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-around" }}>
            {PARENT_STEPS.map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "10px 16px", background: "var(--card2)", borderRadius: 8, minWidth: 120 }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
                <p style={{ color: "var(--text)", fontSize: 11, fontWeight: 500 }}>Step {i + 1}</p>
                <p style={{ color: "var(--text-muted)", fontSize: 10 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
        {products.map((p) => (
          <div
            key={p.id}
            className="card"
            style={{ transition: "all 0.2s ease" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--orange)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.transform = ""; }}
          >
            <div style={{ textAlign: "center", fontSize: 36, marginBottom: 12 }}>{p.icon}</div>
            {p.publisher && <p style={{ color: "var(--text-muted)", fontSize: 10, marginBottom: 4 }}>{p.publisher}</p>}
            <p style={{ color: "var(--text)", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{p.name}</p>
            <p style={{ color: "var(--orange)", fontSize: 18, fontWeight: 800, fontFamily: "DM Mono", marginBottom: 12 }}>{formatKES(p.price)}</p>
            <button
              onClick={() => addToCart({ name: p.name, price: p.price })}
              className="btn"
              style={{
                width: "100%",
                justifyContent: "center",
                background: p.id.endsWith("6") ? "var(--orange)" : "var(--card2)",
                color: p.id.endsWith("6") ? "#fff" : "var(--text)",
                border: `1px solid ${p.id.endsWith("6") ? "var(--orange)" : "var(--border)"}`,
                fontSize: 12,
              }}
            >
              {tab === "Lab Equipment" ? "Add to School Order" : "Add to Cart — M-Pesa"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
