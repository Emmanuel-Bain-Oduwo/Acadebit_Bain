"use client";
import { useStore } from "@/store";
import Sidebar from "./Sidebar";
import Header from "./Header";
import CartModal from "@/components/shared/CartModal";
import ToastContainer from "@/components/shared/Toast";
import { useEffect } from "react";

// Portal view imports
import PrincipalDashboard from "@/components/portals/principal/Dashboard";
import SafetyCore from "@/components/portals/principal/SafetyCore";
import FeeSmart from "@/components/portals/principal/FeeSmart";
import StaffView from "@/components/portals/principal/Staff";
import GovBridge from "@/components/portals/principal/GovBridge";
import CBCTracker from "@/components/portals/teacher/CBCTracker";
import AIStudio from "@/components/portals/teacher/AIStudio";
import LearningDash from "@/components/portals/student/Learning";
import AITutor from "@/components/portals/student/AITutor";
import PastPapers from "@/components/portals/student/PastPapers";
import MyChild from "@/components/portals/parent/MyChild";
import Governance from "@/components/portals/bom/Governance";
import NationalDash from "@/components/portals/moe/National";
import ShopView from "@/components/portals/shop/ShopView";
import VendorDash from "@/components/portals/vendor/VendorDash";

const VIEW_MAP: Record<string, React.ComponentType> = {
  dashboard: PrincipalDashboard,
  safetycore: SafetyCore,
  feesmart: FeeSmart,
  staff: StaffView,
  govbridge: GovBridge,
  cbctracker: CBCTracker,
  aistudio: AIStudio,
  learning: LearningDash,
  aitutor: AITutor,
  pastpapers: PastPapers,
  mychild: MyChild,
  buytextbooks: ShopView,
  buyuniforms: ShopView,
  governance: Governance,
  national: NationalDash,
  textbooks: ShopView,
  labequip: ShopView,
  uniforms: ShopView,
  vendordash: VendorDash,
};

export default function AppShell() {
  const { currentView, notifOpen, setNotifOpen } = useStore();

  const ViewComponent = VIEW_MAP[currentView] || PrincipalDashboard;

  // Close notification dropdown on outside click
  useEffect(() => {
    const handle = () => { if (notifOpen) setNotifOpen(false); };
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, [notifOpen, setNotifOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 0, display: "flex", flexDirection: "column" }} className="md:ml-[210px]">
        <Header />
        <main style={{ flex: 1, padding: "20px 20px", overflowY: "auto", maxWidth: 1400 }}>
          <ViewComponent />
        </main>
      </div>
      <CartModal />
      <ToastContainer />
    </div>
  );
}
