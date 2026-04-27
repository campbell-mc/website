"use client";

import { useState, useEffect, Suspense } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { FloatingChrisButton } from "@/components/chris/FloatingChrisButton";
import BottomTabBar from "@/components/mobile/BottomTabBar";
import { ActionCatcher } from "@/components/ActionCatcher";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getRoleConfig } from "@/lib/roles/config";
import type { RoleName } from "@/lib/roles/config";
import { FacilityProvider } from "@/lib/context/facility";
import type { CareType } from "@/lib/types";

// ── CARE TYPE → FACILITY + DEFAULT ROLE ─────────────────────

const CARE_TYPE_FACILITIES: Record<string, {
  facilityId: string;
  facilityName: string;
  careType: CareType;
  providerName: string;
  defaultUser: { name: string; role: RoleName };
}> = {
  residential: {
    facilityId: "FAC-001",
    facilityName: "Mt Gib Gardens Bowral",
    careType: "residential",
    providerName: "Mt Gib Gardens",
    defaultUser: { name: "Sarah Mitchell", role: "don" },
  },
  home_care: {
    facilityId: "FAC-005",
    facilityName: "Mt Gib Home Care Southern Highlands",
    careType: "home_care",
    providerName: "Mt Gib Gardens",
    defaultUser: { name: "Tom Nguyen", role: "home_care_manager" },
  },
  ndis: {
    facilityId: "FAC-007",
    facilityName: "Mt Gib NDIS Services",
    careType: "ndis",
    providerName: "Mt Gib Gardens",
    defaultUser: { name: "David Okafor", role: "ndis_manager" },
  },
};

// ── ROLE ENTRY POINTS ───────────────────────────────────────
// These are the URLs that SET a user's role. Once you visit one of these,
// you stay in that role until you visit a different entry point.

const ROLE_ENTRY_POINTS: Record<string, { name: string; role: RoleName }> = {
  "/dashboard": { name: "Sarah Mitchell", role: "don" },
  "/dashboard/ceo": { name: "James Whitfield", role: "ceo" },
  "/dashboard/cfo": { name: "Michelle Park", role: "cfo" },
  "/dashboard/fm": { name: "James Okonkwo", role: "facility_manager" },
  "/dashboard/clinical-director": { name: "Dr Lisa Chen", role: "clinical_director" },
  "/dashboard/quality-lead": { name: "Lisa Morales", role: "quality_lead" },
  "/dashboard/whs": { name: "Priya Sharma", role: "whs_lead" },
  "/dashboard/hr": { name: "Rachel Kim", role: "hr_manager" },
  "/dashboard/board": { name: "Margaret Wilson", role: "board_member" },
  "/dashboard/team-leader": { name: "Anika Patel", role: "team_leader" },
  "/dashboard/hc-manager": { name: "Guinevere Walsh", role: "home_care_manager" },
  "/dashboard/home-care": { name: "Guinevere Walsh", role: "home_care_manager" },
  "/dashboard/care-coordinator": { name: "Emily Santos", role: "care_coordinator" },
  "/dashboard/ndis-manager": { name: "David Okafor", role: "ndis_manager" },
  "/dashboard/support-coordinator-ndis": { name: "Maya Reeves", role: "support_coordinator_ndis" },
};

const STORAGE_KEY = "chris-demo-role";

function getStoredRole(): { name: string; role: RoleName } | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

function storeRole(user: { name: string; role: RoleName }) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {}
}

function resolveUser(pathname: string, careType: string): { name: string; role: RoleName } {
  // 1. Check if current path is a role entry point (most specific match first)
  //    Sort by length descending so /dashboard/cfo matches before /dashboard
  const sorted = Object.entries(ROLE_ENTRY_POINTS).sort(([a], [b]) => b.length - a.length);
  for (const [route, user] of sorted) {
    // Exact match for /dashboard, prefix match for everything else
    if (route === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(route)) {
      storeRole(user);
      return user;
    }
  }

  // 2. If navigating to a shared screen (e.g. /dashboard/financial),
  //    keep the role from the last entry point
  const stored = getStoredRole();
  if (stored) return stored;

  // 3. Default based on care type (first visit, no entry point hit yet)
  const defaultUser = CARE_TYPE_FACILITIES[careType]?.defaultUser ?? { name: "Sarah Mitchell", role: "don" };
  storeRole(defaultUser);
  return defaultUser;
}

// ── LAYOUT ───────────────────────────────────────────────────

function AppLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Detect care type from URL param OR pathname
  const careFromParam = searchParams.get("care");
  const careFromPath = pathname.includes("/home-care") ? "home_care" : pathname.includes("/ndis") ? "ndis" : null;
  const careType = careFromParam ?? careFromPath ?? "residential";
  const facilityConfig = CARE_TYPE_FACILITIES[careType] ?? CARE_TYPE_FACILITIES.residential;

  const user = {
    ...resolveUser(pathname, careType),
    providerName: facilityConfig.providerName,
  };

  const facilityContext = {
    facilityId: facilityConfig.facilityId,
    facilityName: facilityConfig.facilityName,
    careType: facilityConfig.careType,
    providerName: facilityConfig.providerName,
  };

  const config = getRoleConfig(user.role);
  const showCoach = config.chris_coach.enabled;

  return (
    <FacilityProvider value={facilityContext}>
    <ActionCatcher>
      <div className="min-h-screen flex" style={{ background: "hsl(var(--background))" }}>
        <Sidebar userName={user.name} userRole={user.role} providerName={user.providerName} />

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
            <MobileHeader providerName={user.providerName} onMenuClick={() => setSidebarOpen(true)} />
          </div>
          <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>
        </div>

        {showCoach && (
          <div className="hidden md:block">
            <FloatingChrisButton onClick={() => router.push("/dashboard/coach")} />
          </div>
        )}

        <BottomTabBar />
      </div>
    </ActionCatcher>
    </FacilityProvider>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "hsl(var(--background))" }} />}>
      <AppLayoutInner>{children}</AppLayoutInner>
    </Suspense>
  );
}
