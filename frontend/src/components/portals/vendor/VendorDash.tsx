"use client";
import { VENDOR_ORDERS, VENDOR_REVENUE } from "@/lib/data";
import { formatKES, statusColor } from "@/lib/utils";
import { useStore } from "@/store";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useState } from "react";

export default function VendorDash() {
  const { addToast } = useStore();
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");

  const listProduct = () => {
    if (!productName.trim() || !price) { addToast("warning", "Fill in product name and price"); return; }
    addToast("success", `"${productName}" listed at ${formatKES(Number(price))}!`);
    setProductName("");
    setPrice("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ color: "var(--text)", fontSize: 22, fontWeight: 800 }}>Vendor Dashboard</h1>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>Acadebit Marketplace · M-Pesa Settlements</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
        {[
          { label: "Revenue (Jun)", value: "KES 84K", delta: "+23%", color: "var(--green)" },
          { label: "Orders", value: "127", sub: "18 pending", color: "var(--blue)" },
          { label: "Products", value: "84", color: "var(--purple)" },
          { label: "Rating", value: "4.8 ⭐", color: "var(--amber)" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <p style={{ color: "var(--muted)", fontSize: 11 }}>{s.label}</p>
            <p style={{ color: s.color, fontSize: 22, fontWeight: 800, fontFamily: "DM Mono" }}>{s.value}</p>
            {s.delta && <span style={{ color: "var(--green)", fontSize: 11, fontWeight: 600 }}>{s.delta}</span>}
            {s.sub && <span style={{ color: "var(--muted)", fontSize: 11 }}>{s.sub}</span>}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(320px, 100%), 1fr))", gap: 16 }}>
        {/* Revenue Chart */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📈 Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={VENDOR_REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 10 }} />
              <YAxis tickFormatter={(v) => `${v / 1000}K`} tick={{ fill: "var(--muted)", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 8 }} formatter={(v) => [formatKES(Number(v)), "Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke="var(--pink)" strokeWidth={2} dot={{ fill: "var(--pink)", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Table */}
        <div className="card" style={{ overflowX: "auto" }}>
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📦 Recent Orders</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Order #", "Product", "Buyer", "Amount", "Status"].map((h) => (
                  <th key={h} style={{ color: "var(--muted)", fontSize: 10, fontWeight: 600, padding: "6px 8px", textAlign: "left", borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VENDOR_ORDERS.map((o, i) => (
                <tr key={o.id} style={{ background: i % 2 === 0 ? "transparent" : "var(--card2)" }}>
                  <td style={{ color: "var(--muted)", fontSize: 11, fontFamily: "DM Mono", padding: "8px" }}>{o.id}</td>
                  <td style={{ color: "var(--text)", fontSize: 11, padding: "8px" }}>{o.product}</td>
                  <td style={{ color: "var(--muted)", fontSize: 11, padding: "8px" }}>{o.buyer}</td>
                  <td style={{ color: "var(--pink)", fontSize: 11, fontFamily: "DM Mono", padding: "8px" }}>{formatKES(o.amount)}</td>
                  <td style={{ padding: "8px" }}>
                    <span className="badge" style={{ background: `${statusColor(o.status)}20`, color: statusColor(o.status), fontSize: 9 }}>
                      {o.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Product */}
        <div className="card">
          <h3 style={{ color: "var(--text)", fontSize: 14, fontWeight: 700, marginBottom: 12 }}>➕ List New Product</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Product name"
              style={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontSize: 13, outline: "none" }}
            />
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price (KES)"
              type="number"
              style={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text)", fontSize: 13, outline: "none" }}
            />
            <button onClick={listProduct} className="btn btn-primary" style={{ justifyContent: "center" }}>
              List Product
            </button>
          </div>

          {/* M-Pesa Settlement */}
          <div style={{ marginTop: 16, padding: 12, background: "rgba(34,197,94,.05)", border: "1px solid rgba(34,197,94,.15)", borderRadius: 8 }}>
            <p style={{ color: "var(--green)", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>💰 M-Pesa Settlement</p>
            <p style={{ color: "var(--muted)", fontSize: 11, lineHeight: 1.5 }}>
              Payments settle to your registered Safaricom M-Pesa number within 24 hours of order delivery confirmation. No bank account required.
            </p>
            <p style={{ color: "var(--muted)", fontSize: 11, marginTop: 6 }}>Next settlement: <strong style={{ color: "var(--text)" }}>Monday 30 June 2026</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
