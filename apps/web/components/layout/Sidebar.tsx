"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, FileText, ClipboardList, Shield, Activity, BarChart2,
  Users, DollarSign, Calendar, AlertTriangle, CheckSquare,
  Sparkles, Heart, GraduationCap, BookOpen, X, TrendingUp,
  ChevronRight, ChevronDown,
  Stethoscope, Briefcase, Building2, Scale, UserCheck, LayoutDashboard,
} from "lucide-react";
import { ChrisAvatar } from "../chris/ChrisAvatar";
import type { RoleName } from "@/lib/roles/config";
import { getRoleConfig } from "@/lib/roles/config";
import { resolveNavSections, isWeeklyLoops, getActiveLoopWeek, type NavSection, type NavItem, type WeeklyLoopSection } from "@/lib/roles/nav-registry";
import { useFacility } from "@/lib/context/facility";
import { getLabel } from "@/lib/care-type/labels";

const ICONS: Record<string, typeof Home> = {
  Home, FileText, ClipboardList, Shield, Activity, BarChart2,
  Users, DollarSign, Calendar, AlertTriangle, CheckSquare,
  Sparkles, Heart, GraduationCap, BookOpen, TrendingUp,
  Stethoscope, Briefcase, Building2, Scale, UserCheck, LayoutDashboard,
};

// Section heading icons — makes them pop like Home and CHRIS Coach
const SECTION_ICONS: Record<string, typeof Home> = {
  OPERATIONS: Briefcase,
  CLINICAL: Stethoscope,
  RESIDENTS: UserCheck,
  WORKFORCE: Users,
  FINANCIAL: DollarSign,
  GOVERNANCE: Scale,
  COMPLIANCE: Shield,
  PORTFOLIO: Building2,
  "PSH & WHS": Heart,
  WHS: Shield,
  QUALITY: BarChart2,
  "WEEKLY LOOPS": Activity,
  "MY TEAM": Users,
  OPERATOR: LayoutDashboard,
  PROVIDERS: Building2,
  AGENTS: Activity,
  CONNECTORS: Activity,
  // Home care sections
  "CARE MANAGEMENT": Stethoscope,
  CLIENTS: UserCheck,
  BUDGET: DollarSign,
  "BUDGET MANAGEMENT": DollarSign,
  "WORKER SAFETY": Shield,
  // NDIS sections
  SUPPORTS: Activity,
  PARTICIPANTS: UserCheck,
  "PLAN BUDGETS": DollarSign,
  "WORKER SCREENING": Shield,
};

interface SidebarProps {
  userName: string;
  userRole: RoleName;
  providerName?: string;
  className?: string;
  mobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ userName, userRole, providerName, className = "", mobile = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { careType } = useFacility();
  const config = getRoleConfig(userRole);
  const sections = resolveNavSections(config.nav_sections);
  const activeLoopWeek = getActiveLoopWeek();

  // Track which sections are expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // On mount and route change: expand the section containing the active route
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    for (const section of sections) {
      if (section.alwaysOpen) {
        initial[section.title] = true;
        continue;
      }
      if (isWeeklyLoops(section)) {
        const allLoopHrefs = [...section.teamLoop.items, ...section.leaderLoop.items].map((i) => i.href);
        if (allLoopHrefs.some((href) => pathname.startsWith(href))) {
          initial[section.title] = true;
        }
        continue;
      }
      const hasActiveItem = section.items.some((item) => pathname.startsWith(item.href) && item.href !== "/dashboard");
      if (hasActiveItem || (section.href && pathname.startsWith(section.href))) {
        initial[section.title] = true;
      }
    }
    setExpanded(initial);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (sections.length === 0) return null;

  function toggleSection(title: string) {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname === config.home_route;
    return pathname.startsWith(href);
  }

  function navigate(href: string) {
    router.push(href);
    if (mobile && onClose) onClose();
  }

  function renderNavItem(item: NavItem) {
    const active = isActive(item.href);
    const Icon = ICONS[item.icon] ?? Home;
    return (
      <button
        key={item.href}
        onClick={() => navigate(item.href)}
        className={`sidebar-item w-full flex items-center gap-2.5 rounded-lg text-left ${active ? "sidebar-item-active" : ""}`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span className="truncate">{item.label}</span>
      </button>
    );
  }

  function renderStandardSection(section: NavSection) {
    const isOpen = section.alwaysOpen || expanded[section.title];
    const SectionIcon = SECTION_ICONS[section.title];
    const sectionActive = section.href ? pathname.startsWith(section.href) : section.items.some((item) => pathname.startsWith(item.href) && item.href !== "/dashboard");

    return (
      <div key={section.title} className="mb-1">
        {section.alwaysOpen ? (
          /* Overview — always open, no chevron */
          <>
            <p className="px-3 mb-1 pt-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">
              {section.title}
            </p>
            {section.items.map(renderNavItem)}
          </>
        ) : (
          <>
            {/* Big tappable section heading — same size as Home/Coach */}
            <div className="flex items-center gap-1">
              {/* Main heading — taps to control centre */}
              <button
                onClick={() => {
                  if (section.href) { navigate(section.href); }
                  toggleSection(section.title);
                }}
                className={`sidebar-item flex-1 w-full flex items-center gap-2.5 rounded-lg text-left ${sectionActive ? "sidebar-item-active" : ""}`}
              >
                {SectionIcon && <SectionIcon className="w-4 h-4 shrink-0" />}
                <span className="truncate">{section.title.charAt(0) + section.title.slice(1).toLowerCase()}</span>
              </button>
              {/* Chevron toggle — expands sub-items */}
              <button
                onClick={() => toggleSection(section.title)}
                className="p-1.5 rounded-lg hover:bg-muted/50 shrink-0 transition-colors"
              >
                {isOpen
                  ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/50" />
                  : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />}
              </button>
            </div>

            {/* Collapsible sub-items */}
            <div
              className="overflow-hidden transition-all duration-200 ease-in-out ml-2"
              style={{ maxHeight: isOpen ? `${section.items.length * 40 + 8}px` : "0px", opacity: isOpen ? 1 : 0 }}
            >
              {section.items.map(renderNavItem)}
            </div>
          </>
        )}
      </div>
    );
  }

  function renderWeeklyLoops(section: WeeklyLoopSection) {
    const isOpen = expanded[section.title];
    const teamActive = activeLoopWeek === 1;
    const leaderActive = activeLoopWeek === 2;

    // Sub-section expand state
    const teamExpanded = expanded["__team_loop"] ?? teamActive;
    const leaderExpanded = expanded["__leader_loop"] ?? leaderActive;

    const SectionIcon = SECTION_ICONS[section.title];
    const loopRouteActive = [...section.teamLoop.items, ...section.leaderLoop.items].some((item) => pathname.startsWith(item.href));

    return (
      <div key={section.title} className="mb-1">
        {/* Big tappable heading — same style as Clinical, Operations, etc. */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleSection(section.title)}
            className={`sidebar-item flex-1 w-full flex items-center gap-2.5 rounded-lg text-left ${loopRouteActive ? "sidebar-item-active" : ""}`}
          >
            {SectionIcon && <SectionIcon className="w-4 h-4 shrink-0" />}
            <span className="truncate">Weekly Loops</span>
          </button>
          <button
            onClick={() => toggleSection(section.title)}
            className="p-1.5 rounded-lg hover:bg-muted/50 shrink-0 transition-colors"
          >
            {isOpen
              ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/50" />
              : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />}
          </button>
        </div>

        <div
          className="overflow-hidden transition-all duration-200 ease-in-out ml-2"
          style={{ maxHeight: isOpen ? "500px" : "0px", opacity: isOpen ? 1 : 0 }}
        >
          {/* Team Loop card */}
          <div className="mt-1 mb-2">
            <button
              onClick={() => setExpanded((prev) => ({ ...prev, __team_loop: !teamExpanded }))}
              className={`w-full rounded-lg p-3 text-left transition-all ${
                teamActive
                  ? "bg-[rgba(27,67,50,0.08)] border border-[hsl(var(--brand-teal)/0.3)]"
                  : "bg-muted/40 border border-transparent opacity-60 hover:opacity-80"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full shrink-0 ${
                  teamActive ? "bg-[hsl(var(--brand-teal))]" : "border-2 border-muted-foreground/30"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${teamActive ? "text-[hsl(var(--brand-forest))]" : "text-muted-foreground"}`}>
                    {section.teamLoop.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {teamActive ? "Active this week" : "Next week"}
                  </p>
                </div>
                {teamExpanded
                  ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                  : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />}
              </div>
            </button>
            <div
              className="overflow-hidden transition-all duration-200 ease-in-out"
              style={{ maxHeight: teamExpanded ? "180px" : "0px", opacity: teamExpanded ? 1 : 0 }}
            >
              <div className={`mt-1 ${teamActive ? "" : "opacity-50"}`}>
                {section.teamLoop.items.map(renderNavItem)}
              </div>
            </div>
          </div>

          {/* Leader Loop card */}
          <div className="mb-1">
            <button
              onClick={() => setExpanded((prev) => ({ ...prev, __leader_loop: !leaderExpanded }))}
              className={`w-full rounded-lg p-3 text-left transition-all ${
                leaderActive
                  ? "bg-[rgba(27,67,50,0.08)] border border-[hsl(var(--brand-teal)/0.3)]"
                  : "bg-muted/40 border border-transparent opacity-60 hover:opacity-80"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full shrink-0 ${
                  leaderActive ? "bg-[hsl(var(--brand-teal))]" : "border-2 border-muted-foreground/30"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${leaderActive ? "text-[hsl(var(--brand-forest))]" : "text-muted-foreground"}`}>
                    {section.leaderLoop.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {leaderActive ? "Active this week" : "Next week"}
                  </p>
                </div>
                {leaderExpanded
                  ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                  : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />}
              </div>
            </button>
            <div
              className="overflow-hidden transition-all duration-200 ease-in-out"
              style={{ maxHeight: leaderExpanded ? "180px" : "0px", opacity: leaderExpanded ? 1 : 0 }}
            >
              <div className={`mt-1 ${leaderActive ? "" : "opacity-50"}`}>
                {section.leaderLoop.items.map(renderNavItem)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside className={`sidebar w-60 h-screen overflow-y-auto shrink-0 ${mobile ? "block" : "hidden lg:block"} ${className}`}>
      {/* Provider branding */}
      <div className="px-4 py-5 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-3">
          <ChrisAvatar size="small" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[hsl(var(--sidebar-foreground))] truncate">
              {providerName ?? "Culture Crunch"}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">{userName} · {config.display_name}</p>
          </div>
          {mobile && onClose && (
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted shrink-0">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="py-3 px-2">
        {sections.map((section) =>
          isWeeklyLoops(section)
            ? renderWeeklyLoops(section)
            : renderStandardSection(section)
        )}
      </nav>
    </aside>
  );
}
