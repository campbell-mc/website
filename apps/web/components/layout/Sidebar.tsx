"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Home, MessageSquare, FileText, ClipboardList, LayoutDashboard,
  Shield, Activity, BarChart2, BookOpen, Users, DollarSign,
  Calendar, AlertTriangle, CheckSquare, Sparkles, Heart, GraduationCap,
} from "lucide-react";
import { ChrisAvatar } from "../chris/ChrisAvatar";

type UserRole =
  | "board_member" | "ceo" | "cfo" | "clinical_director" | "don"
  | "facility_gm" | "quality_lead" | "whs_lead" | "hr_manager"
  | "elt_member" | "team_leader" | "frontline_staff" | "operator";

interface SidebarProps {
  userName: string;
  userRole: UserRole;
  providerName?: string;
  className?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: typeof Home;
  roles: UserRole[] | "all";
  badge?: number;
}

interface NavSection {
  title: string;
  href?: string; // Domain Control Centre route
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Home", href: "/dashboard", icon: Home, roles: "all" },
      { label: "CHRIS Coach", href: "/dashboard/coach", icon: Sparkles, roles: "all" },
    ],
  },
  {
    title: "OPERATIONS",
    href: "/dashboard/operations",
    items: [
      { label: "Monday Briefing", href: "/dashboard/briefing", icon: FileText, roles: ["don", "facility_gm", "ceo", "operator"] },
      { label: "Review Queue", href: "/don/queue", icon: ClipboardList, roles: ["don", "facility_gm", "ceo", "operator"] },
    ],
  },
  {
    title: "CLINICAL",
    href: "/dashboard/clinical",
    items: [
      { label: "Care Minutes", href: "/dashboard/care-minutes", icon: Activity, roles: ["don", "clinical_director", "quality_lead", "ceo", "operator"] },
      { label: "Quality Indicators", href: "/dashboard/quality", icon: BarChart2, roles: ["don", "clinical_director", "quality_lead", "ceo", "operator"] },
      { label: "Clinical Audits", href: "/dashboard/audits", icon: CheckSquare, roles: ["don", "clinical_director", "quality_lead", "operator"] },
      { label: "SIRS Register", href: "/dashboard/sirs", icon: AlertTriangle, roles: ["don", "clinical_director", "quality_lead", "ceo", "operator"] },
    ],
  },
  {
    title: "WORKFORCE",
    href: "/dashboard/workforce",
    items: [
      { label: "PSH Dashboard", href: "/dashboard/psh", icon: Heart, roles: ["whs_lead", "hr_manager", "don", "ceo", "operator"] },
      { label: "Training Compliance", href: "/dashboard/training", icon: GraduationCap, roles: ["hr_manager", "don", "quality_lead", "operator"] },
    ],
  },
  {
    title: "FINANCIAL",
    href: "/dashboard/financial",
    items: [],
  },
  {
    title: "GOVERNANCE",
    href: "/dashboard/compliance",
    items: [
      { label: "Reporting Cycles", href: "/dashboard/reporting", icon: Calendar, roles: ["don", "quality_lead", "whs_lead", "hr_manager", "clinical_director", "cfo", "ceo", "operator"] },
      { label: "Governance Packs", href: "/dashboard/packs", icon: BookOpen, roles: ["don", "quality_lead", "ceo", "cfo", "operator"] },
      { label: "Corrective Actions", href: "/dashboard/actions", icon: CheckSquare, roles: ["don", "quality_lead", "whs_lead", "operator"] },
    ],
  },
  {
    title: "LOOPS",
    items: [
      { label: "Team Briefing", href: "/dashboard/team-briefing", icon: FileText, roles: ["team_leader", "don", "facility_gm", "operator"] },
      { label: "Leader Loop", href: "/dashboard/journey", icon: BarChart2, roles: ["team_leader", "don", "facility_gm", "operator"] },
    ],
  },
];

export function Sidebar({ userName, userRole, providerName, className = "" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  function isVisible(roles: UserRole[] | "all"): boolean {
    if (roles === "all") return true;
    if (userRole === "operator") return true; // Operator sees everything
    return roles.includes(userRole);
  }

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  const visibleSections = NAV_SECTIONS
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => isVisible(item.roles)),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <aside className={`sidebar w-60 h-screen overflow-y-auto shrink-0 hidden lg:block ${className}`}>
      {/* Provider branding */}
      <div className="px-4 py-5 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-3">
          <ChrisAvatar size="small" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--brand-forest)] truncate">
              {providerName ?? "Culture Crunch"}
            </p>
            <p className="text-[10px] text-gray-400 truncate">{userName}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="py-3 px-2">
        {visibleSections.map((section) => (
          <div key={section.title} className="mb-4">
            {section.href ? (
              <button
                onClick={() => router.push(section.href!)}
                className={`px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest w-full text-left hover:text-[var(--brand-forest)] transition-colors ${
                  pathname.startsWith(section.href) ? "text-[var(--brand-forest)]" : "text-gray-400"
                }`}
              >
                {section.title} →
              </button>
            ) : (
              <p className="px-3 mb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`sidebar-item w-full flex items-center gap-2.5 rounded-lg text-left ${
                    active ? "sidebar-item-active" : ""
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto text-[10px] font-bold bg-[var(--brand-terracotta)] text-white w-5 h-5 flex items-center justify-center rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
