"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Home, FileText, ClipboardList, Shield, Activity, BarChart2,
  Users, DollarSign, Calendar, AlertTriangle, CheckSquare,
  Sparkles, Heart, GraduationCap, BookOpen,
} from "lucide-react";
import { ChrisAvatar } from "../chris/ChrisAvatar";
import type { Role } from "@/lib/roles/types";
import { getRoleConfig } from "@/lib/roles/config";

// Icon lookup from string name → component
const ICONS: Record<string, typeof Home> = {
  Home, FileText, ClipboardList, Shield, Activity, BarChart2,
  Users, DollarSign, Calendar, AlertTriangle, CheckSquare,
  Sparkles, Heart, GraduationCap, BookOpen,
};

interface SidebarProps {
  userName: string;
  userRole: Role;
  providerName?: string;
  className?: string;
}

export function Sidebar({ userName, userRole, providerName, className = "" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const config = getRoleConfig(userRole);

  // No sidebar for roles with no nav sections (board, frontline)
  if (config.nav.sections.length === 0) return null;

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname === config.nav.homeRoute;
    return pathname.startsWith(href);
  }

  return (
    <aside className={`sidebar w-60 h-screen overflow-y-auto shrink-0 hidden lg:block ${className}`}>
      {/* Provider branding */}
      <div className="px-4 py-5 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-3">
          <ChrisAvatar size="small" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[hsl(var(--sidebar-foreground))] truncate">
              {providerName ?? "Culture Crunch"}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">{userName} · {config.displayName}</p>
          </div>
        </div>
      </div>

      {/* Navigation — driven by role config */}
      <nav className="py-3 px-2">
        {config.nav.sections.map((section) => (
          <div key={section.title} className="mb-4">
            {section.href ? (
              <button
                onClick={() => router.push(section.href!)}
                className={`px-3 mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] w-full text-left hover:text-[hsl(var(--sidebar-foreground))] transition-colors ${
                  pathname.startsWith(section.href) ? "text-[hsl(var(--sidebar-foreground))]" : "text-muted-foreground"
                }`}
              >
                {section.title} →
              </button>
            ) : (
              <p className="px-3 mb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const active = isActive(item.href);
              const Icon = ICONS[item.icon] ?? Home;

              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`sidebar-item w-full flex items-center gap-2.5 rounded-lg text-left ${active ? "sidebar-item-active" : ""}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
