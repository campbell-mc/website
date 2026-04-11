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
    name: "Sarah Mitchell",
    role: "don" as const,
    providerName: "Harbison",
  };

  // Sync active tab with URL
  useEffect(() => {
    if (pathname.includes("/clinical") || pathname.includes("/care-minutes") || pathname.includes("/quality") || pathname.includes("/sirs") || pathname.includes("/audits")) {
      setActiveTab("clinical");
    } else if (pathname.includes("/workforce") || pathname.includes("/risk") || pathname.includes("/psh") || pathname.includes("/training") || pathname.includes("/journey")) {
      setActiveTab("workforce");
    } else if (pathname.includes("/compliance") || pathname.includes("/reporting") || pathname.includes("/packs") || pathname.includes("/actions")) {
      setActiveTab("governance");
    } else if (pathname.includes("/coach")) {
      setActiveTab("coach");
    } else {
      setActiveTab("home");
    }
  }, [pathname]);

  function handleNavigate(tab: NavTab) {
    setActiveTab(tab);
    switch (tab) {
      case "home": router.push("/dashboard"); break;
      case "clinical": router.push("/dashboard/clinical"); break;
      case "workforce": router.push("/dashboard/workforce"); break;
      case "governance": router.push("/dashboard/compliance"); break;
      case "coach": router.push("/dashboard/coach"); break;
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--background)" }}>
      <Sidebar userName={user.name} userRole={user.role} providerName={user.providerName} />

      <div className="flex-1 flex flex-col min-h-screen">
        <div className="lg:hidden">
          <Header title="Culture Crunch" subtitle={user.providerName} showSettings />
        </div>

        <main className="flex-1 overflow-y-auto">{children}</main>

        <div className="lg:hidden">
          <BottomNav activeTab={activeTab} onNavigate={handleNavigate} />
        </div>
      </div>

      <FloatingChrisButton onClick={() => router.push("/dashboard/coach")} />
    </div>
  );
}
