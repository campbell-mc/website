"use client";

import { Home, Activity, Users, Shield, Sparkles, FileText, BarChart2, DollarSign, Heart, Calendar } from "lucide-react";
import { ChrisAvatar } from "../chris/ChrisAvatar";
import { useRouter, usePathname } from "next/navigation";
import type { Role } from "@/lib/roles/types";
import { getRoleConfig } from "@/lib/roles/config";

const ICONS: Record<string, typeof Home> = {
  Home, Activity, Users, Shield, Sparkles, FileText, BarChart2, DollarSign, Heart, Calendar,
};

interface BottomNavProps {
  userRole: Role;
}

export function BottomNav({ userRole }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const config = getRoleConfig(userRole);

  // No bottom nav for roles with no tabs (board, frontline)
  if (config.nav.bottomTabs.length === 0) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[200] bg-white/95 backdrop-blur-md border-t border-[hsl(var(--border))]">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {config.nav.bottomTabs.map((tab) => {
          const isActive = tab.href === "/dashboard" || tab.href === config.nav.homeRoute
            ? pathname === "/dashboard" || pathname === config.nav.homeRoute
            : pathname.startsWith(tab.href);

          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.href)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[56px] ${
                isActive
                  ? "bg-[rgba(27,67,50,0.08)] text-[hsl(var(--brand-forest))]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.id === "coach" ? (
                <ChrisAvatar size="small" />
              ) : (
                (() => {
                  const Icon = ICONS[tab.label] ?? Home;
                  return <Icon className="w-5 h-5" />;
                })()
              )}
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
