"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { FloatingChrisButton } from "@/components/chris/FloatingChrisButton";
import { useRouter } from "next/navigation";
import { shouldShowCoach } from "@/components/access/FeatureGate";
import { getRoleConfig } from "@/lib/roles/config";
import type { Role } from "@/lib/roles/types";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // TODO: Replace with real user from session/JWT
  const user = {
    name: "Sarah Mitchell",
    role: "don" as Role,
    providerName: "Harbison",
  };

  const config = getRoleConfig(user.role);
  const showCoach = shouldShowCoach(user.role);

  return (
    <div className="min-h-screen flex" style={{ background: "hsl(var(--background))" }}>
      {/* Desktop sidebar — reads from role config */}
      <Sidebar userName={user.name} userRole={user.role} providerName={user.providerName} />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden">
          <Header title="Culture Crunch" subtitle={user.providerName} showSettings />
        </div>

        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Mobile bottom nav — reads from role config */}
        <div className="lg:hidden">
          <BottomNav userRole={user.role} />
        </div>
      </div>

      {/* Floating CHRIS button — hidden for readonly persona (Board) */}
      {showCoach && (
        <FloatingChrisButton onClick={() => router.push("/dashboard/coach")} />
      )}
    </div>
  );
}
