"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav, type NavTab } from "@/components/layout/BottomNav";
import { FloatingChrisButton } from "@/components/chris/FloatingChrisButton";
import { useRouter, usePathname } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const router = useRouter();
  const pathname = usePathname();

  // TODO: Replace with real user from session
  const user = {
    name: "Mary Thompson",
    role: "don" as const,
    providerName: "Harbison",
  };

  // Sync active tab with URL
  useEffect(() => {
    if (pathname.includes("/journey")) setActiveTab("journey");
    else if (pathname.includes("/risk")) setActiveTab("risk");
    else if (pathname.includes("/todo") || pathname.includes("/actions")) setActiveTab("todo");
    else if (pathname.includes("/coach")) setActiveTab("coach");
    else setActiveTab("home");
  }, [pathname]);

  function handleNavigate(tab: NavTab) {
    setActiveTab(tab);
    switch (tab) {
      case "home": router.push("/dashboard"); break;
      case "journey": router.push("/dashboard/journey"); break;
      case "risk": router.push("/dashboard/risk"); break;
      case "todo": router.push("/don/queue"); break;
      case "coach": router.push("/dashboard/coach"); break;
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--background)" }}>
      {/* Desktop sidebar */}
      <Sidebar
        userName={user.name}
        userRole={user.role}
        providerName={user.providerName}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header (hidden on desktop — sidebar replaces it) */}
        <div className="lg:hidden">
          <Header title="Culture Crunch" subtitle={user.providerName} showSettings />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Mobile bottom nav (hidden on desktop — sidebar replaces it) */}
        <div className="lg:hidden">
          <BottomNav activeTab={activeTab} onNavigate={handleNavigate} todoCount={2} />
        </div>
      </div>

      {/* Floating CHRIS button (both mobile and desktop) */}
      <FloatingChrisButton onClick={() => router.push("/dashboard/coach")} />
    </div>
  );
}
