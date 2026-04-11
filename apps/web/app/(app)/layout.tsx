"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav, type NavTab } from "@/components/layout/BottomNav";
import { FloatingChrisButton } from "@/components/chris/FloatingChrisButton";
import { useRouter } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const router = useRouter();

  function handleNavigate(tab: NavTab) {
    setActiveTab(tab);
    switch (tab) {
      case "home": router.push("/dashboard"); break;
      case "journey": router.push("/dashboard/journey"); break;
      case "risk": router.push("/dashboard/risk"); break;
      case "todo": router.push("/dashboard/todo"); break;
      case "coach": router.push("/dashboard/coach"); break;
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--cream, #FAF7F2)" }}>
      <Header title="Culture Crunch" showSettings />
      <main>{children}</main>
      <FloatingChrisButton onClick={() => handleNavigate("coach")} />
      <BottomNav activeTab={activeTab} onNavigate={handleNavigate} todoCount={2} />
    </div>
  );
}
