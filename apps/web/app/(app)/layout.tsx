"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { FloatingChrisButton } from "@/components/chris/FloatingChrisButton";
import { ActionCatcher } from "@/components/ActionCatcher";
import { useRouter } from "next/navigation";
import { shouldShowCoach } from "@/components/access/FeatureGate";
import { getRoleConfig } from "@/lib/roles/config";
import type { RoleName } from "@/lib/roles/config";
import { FacilityProvider } from "@/lib/context/facility";
import type { CareType } from "@/lib/types";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // TODO: Replace with real user from session/JWT
  const user = {
    name: "Sarah Mitchell",
    role: "don" as RoleName,
    providerName: "Knights of the Holy Grail",
  };

  // TODO: Replace with real facility from session
  const facilityContext = {
    facilityId: "FAC-001",
    facilityName: "The Holy Grail Bowral",
    careType: "residential" as CareType,
    providerName: "Knights of the Holy Grail",
  };

  const config = getRoleConfig(user.role);
  const showCoach = config.chris_coach.enabled;

  return (
    <FacilityProvider value={facilityContext}>
    <ActionCatcher>
      <div className="min-h-screen flex" style={{ background: "hsl(var(--background))" }}>
        {/* Desktop sidebar — always visible */}
        <Sidebar userName={user.name} userRole={user.role} providerName={user.providerName} />

        {/* Mobile sidebar — slide-out drawer */}
        {sidebarOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 z-50 lg:hidden animate-slideIn">
              <Sidebar userName={user.name} userRole={user.role} providerName={user.providerName} mobile onClose={() => setSidebarOpen(false)} />
            </div>
          </>
        )}

        <div className="flex-1 flex flex-col min-h-screen">
          <div className="lg:hidden">
            <MobileHeader
              providerName={user.providerName}
              onMenuClick={() => setSidebarOpen(true)}
            />
          </div>

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>

        {showCoach && (
          <FloatingChrisButton onClick={() => router.push("/dashboard/coach")} />
        )}
      </div>
    </ActionCatcher>
    </FacilityProvider>
  );
}
