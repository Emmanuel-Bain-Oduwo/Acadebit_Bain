"use client";
import { useStore } from "@/store";
import { X, ShoppingCart, Trash2 } from "lucide-react";
import { formatKES } from "@/lib/utils";
import { useState } from "react";

export default function CartModal() {
  const { cart, cartOpen, setCartOpen, removeFromCart, clearCart, addToast } = useStore();
  const [paying, setPaying] = useState(false);
  const total = cart.reduce((s, i) => s + i.price, 0);

  if (!cartOpen) return null;

  const handleCheckout = () => {
    if (!cart.length) return;
    setPaying(true);
    addToast("info", "📱 M-Pesa STK Push sent. Enter your PIN to confirm.");
    setTimeout(() => {
      setPaying(false);
      clearCart();
      setCartOpen(false);
      addToast("success", "✅ Payment successful! Order confirmed.");
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
      <div className="relative w-full max-w-sm" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "0 8px 32px rgba(0,0,0,.5)" }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2" style={{ color: "var(--text)" }}>
            <ShoppingCart size={18} style={{ color: "var(--orange)" }} />
            <span className="font-semibold">Cart ({cart.length})</span>
          </div>
          <button onClick={() => setCartOpen(false)} style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
            <X size={18} />
          </button>
        </div>

        <div className="p-4" style={{ maxHeight: 300, overflowY: "auto" }}>
          {cart.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0", fontSize: 14 }}>Your cart is empty</p>
          ) : (
            <div className="flex flex-col gap-2">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3" style={{ background: "var(--card2)", borderRadius: 8 }}>
                  <div>
                    <p style={{ color: "var(--text)", fontSize: 13, fontWeight: 500 }}>{item.name}</p>
                    <p style={{ color: "var(--green)", fontSize: 12, fontFamily: "DM Mono, monospace" }}>{formatKES(item.price)}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ color: "var(--red)", background: "none", border: "none", cursor: "pointer" }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
            <div className="flex justify-between mb-3">
              <span style={{ color: "var(--text-muted)", fontSize: 13 }}>Total</span>
              <span style={{ color: "var(--green)", fontWeight: 700, fontFamily: "DM Mono, monospace" }}>{formatKES(total)}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => clearCart()} className="btn btn-secondary" style={{ flex: 1 }}>Clear</button>
              <button onClick={handleCheckout} className="btn btn-primary" style={{ flex: 2, justifyContent: "center" }} disabled={paying}>
                {paying ? <span className="spinner" style={{ width: 14, height: 14, border: "2px solid #000", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block" }} /> : "Pay via M-Pesa"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
