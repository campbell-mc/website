"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { FloatingChrisButton } from "@/components/chris/FloatingChrisButton";
import BottomTabBar from "@/components/mobile/BottomTabBar";
import { ActionCatcher } from "@/components/ActionCatcher";
import { useRouter, usePathname } from "next/navigation";
import { shouldShowCoach } from "@/components/access/FeatureGate";
import { getRoleConfig } from "@/lib/roles/config";
import type { RoleName } from "@/lib/roles/config";
import { FacilityProvider } from "@/lib/context/facility";
import type { CareType } from "@/lib/types";

// Demo user mapping — each role route shows a different person
const DEMO_USERS: Record<string, { name: string; role: RoleName }> = {
  "/dashboard/ceo": { name: "James Whitfield", role: "ceo" },
  "/dashboard/cfo": { name: "Michelle Park", role: "cfo" },
  "/dashboard/fm": { name: "James Okonkwo", role: "facility_manager" },
  "/dashboard/clinical-director": { name: "Dr Lisa Chen", role: "clinical_director" },
  "/dashboard/quality-lead": { name: "Lisa Morales", role: "quality_lead" },
  "/dashboard/whs": { name: "Priya Sharma", role: "whs_lead" },
  "/dashboard/hr": { name: "Rachel Kim", role: "hr_manager" },
  "/dashboard/board": { name: "Margaret Wilson", role: "board_member" },
  "/dashboard/team-leader": { name: "Anika Patel", role: "team_leader" },
  "/dashboard/hc-manager": { name: "Tom Nguyen", role: "home_care_manager" },
  "/dashboard/care-coordinator": { name: "Emily Santos", role: "care_coordinator" },
  "/dashboard/ndis-manager": { name: "David Okafor", role: "ndis_manager" },
};

function getDemoUser(pathname: string): { name: string; role: RoleName } {
  // Check for exact match first
  for (const [route, user] of Object.entries(DEMO_USERS)) {
    if (pathname.startsWith(route)) return user;
  }
  // Default: DON
  return { name: "Sarah Mitchell", role: "don" };
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Demo user based on current route
  const user = {
    ...getDemoUser(pathname),
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

          <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>
        </div>

        {/* Floating CHRIS button — desktop only (mobile has bottom tab) */}
        {showCoach && (
          <div className="hidden md:block">
            <FloatingChrisButton onClick={() => router.push("/dashboard/coach")} />
          </div>
        )}

        {/* Bottom tab bar — mobile only */}
        <BottomTabBar />
      </div>
    </ActionCatcher>
    </FacilityProvider>
  );
}
