"use client";
import { create } from "zustand";
import type { CartItem, Toast, Notification } from "@/lib/types";
import { PORTALS } from "@/lib/data";

interface AppState {
  currentPortal: string | null;
  currentView: string;
  sidebarOpen: boolean;
  theme: "dark" | "light";
  emergencyActive: boolean;
  cart: CartItem[];
  cartOpen: boolean;
  toasts: Toast[];
  notifications: Notification[];
  notifOpen: boolean;
  payOpen: boolean;

  setPortal: (portal: string | null) => void;
  setView: (view: string) => void;
  setSidebar: (open: boolean) => void;
  toggleTheme: () => void;
  toggleEmergency: () => void;

  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;

  addToast: (type: Toast["type"], message: string) => void;
  removeToast: (id: string) => void;

  setNotifOpen: (open: boolean) => void;
  markAllRead: () => void;
  setPayOpen: (open: boolean) => void;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "SafetyCore™ Alert", message: "Kevin Njoroge marked unaccounted for at 10:42 AM", time: "10 min ago", read: false, type: "warning" },
  { id: "n2", title: "Fee Payment Received", message: "M-Pesa: KES 6,250 from Mary Wanjiku — Brian", time: "32 min ago", read: false, type: "success" },
  { id: "n3", title: "NEMIS Sync Complete", message: "498 learner records synced successfully", time: "2 hrs ago", read: true, type: "info" },
];

export const useStore = create<AppState>((set, get) => ({
  currentPortal: null,
  currentView: "",
  sidebarOpen: false,
  theme: "dark",
  emergencyActive: false,
  cart: [],
  cartOpen: false,
  toasts: [],
  notifications: INITIAL_NOTIFICATIONS,
  notifOpen: false,
  payOpen: false,

  setPortal: (portal) => {
    const p = PORTALS.find((x) => x.id === portal);
    set({ currentPortal: portal, currentView: p ? p.views[0].id : "" });
  },
  setView: (view) => set({ currentView: view }),
  setSidebar: (open) => set({ sidebarOpen: open }),

  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("light", next === "light");
    set({ theme: next });
  },

  toggleEmergency: () => {
    const next = !get().emergencyActive;
    set({ emergencyActive: next });
    get().addToast(next ? "error" : "success", next ? "🚨 Emergency mode activated! Parents being notified." : "✅ Emergency cleared. All systems normal.");
  },

  addToCart: (item) => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ cart: [...s.cart, { ...item, id }] }));
    get().addToast("success", `Added "${item.name}" to cart`);
  },
  removeFromCart: (id) => set((s) => ({ cart: s.cart.filter((x) => x.id !== id) })),
  clearCart: () => set({ cart: [] }),
  setCartOpen: (open) => set({ cartOpen: open }),

  addToast: (type, message) => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts.slice(-4), { id, type, message }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.map((t) => t.id === id ? { ...t, exiting: true } : t) }));
      setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 350);
    }, 3500);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  setNotifOpen: (open) => set({ notifOpen: open }),
  markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  setPayOpen: (open) => set({ payOpen: open }),
}));
