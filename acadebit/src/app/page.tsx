"use client";
import { useStore } from "@/store";
import Landing from "@/components/landing/Landing";
import AppShell from "@/components/layout/AppShell";
import ToastContainer from "@/components/shared/Toast";
import { useEffect } from "react";

export default function Home() {
  const { currentPortal, theme } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  if (currentPortal) {
    return <AppShell />;
  }

  return (
    <>
      <Landing />
      <ToastContainer />
    </>
  );
}
