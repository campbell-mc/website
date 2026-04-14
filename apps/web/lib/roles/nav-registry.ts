// lib/roles/nav-registry.ts
// Maps nav_sections strings from role config to actual navigation items
// The role config says WHAT sections to show. This file says WHAT'S IN each section.

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export interface NavSection {
  title: string;
  href?: string;
  items: NavItem[];
  /** If true, this section is always expanded and has no collapse toggle */
  alwaysOpen?: boolean;
  /** Special section type for weekly loops */
  type?: 'standard' | 'weekly_loops';
}

export interface WeeklyLoopSection extends NavSection {
  type: 'weekly_loops';
  teamLoop: { label: string; items: NavItem[] };
  leaderLoop: { label: string; items: NavItem[] };
}

const NAV_SECTIONS: Record<string, NavSection | WeeklyLoopSection> = {
  overview: {
    title: "OVERVIEW",
    alwaysOpen: true,
    items: [
      { label: "Home", href: "/dashboard", icon: "Home" },
      { label: "Review Queue", href: "/don/queue", icon: "ClipboardList" },
      { label: "Documents", href: "/dashboard/documents", icon: "FileText" },
      { label: "CHRIS Coach", href: "/dashboard/coach", icon: "Sparkles" },
      { label: "Agents", href: "/dashboard/agents", icon: "Activity" },
      { label: "iMessage Demo", href: "/dashboard/demo/imessage", icon: "FileText" },
    ],
  },
  operations: {
    title: "OPERATIONS",
    href: "/dashboard/operations",
    items: [
      { label: "Rostering", href: "/dashboard/operations/rostering", icon: "Calendar" },
      { label: "Handovers", href: "/dashboard/operations/handovers", icon: "FileText" },
      { label: "Incidents", href: "/dashboard/operations/incidents", icon: "AlertTriangle" },
      { label: "Leave & Calendar", href: "/dashboard/operations/leave", icon: "Calendar" },
    ],
  },
  clinical: {
    title: "CLINICAL",
    href: "/dashboard/clinical",
    items: [
      { label: "Care Minutes", href: "/dashboard/care-minutes", icon: "Activity" },
      { label: "Quality Indicators", href: "/dashboard/quality", icon: "BarChart2" },
      { label: "Clinical Audits", href: "/dashboard/audits", icon: "CheckSquare" },
      { label: "SIRS Register", href: "/dashboard/sirs", icon: "AlertTriangle" },
    ],
  },
  quality: {
    title: "QUALITY",
    href: "/dashboard/quality",
    items: [
      { label: "Quality Indicators", href: "/dashboard/quality", icon: "BarChart2" },
      { label: "SIRS Register", href: "/dashboard/sirs", icon: "AlertTriangle" },
      { label: "Clinical Audits", href: "/dashboard/audits", icon: "CheckSquare" },
    ],
  },
  residents: {
    title: "RESIDENTS",
    href: "/dashboard/residents",
    items: [
      { label: "Resident Intelligence", href: "/dashboard/residents", icon: "Users" },
      { label: "Care Plans", href: "/dashboard/residents/care-plans", icon: "FileText" },
      { label: "Resident Voice", href: "/dashboard/residents/voice", icon: "Heart" },
      { label: "Families", href: "/dashboard/residents/families", icon: "Users" },
      { label: "Feedback", href: "/dashboard/residents/feedback", icon: "AlertTriangle" },
    ],
  },
  workforce: {
    title: "WORKFORCE",
    href: "/dashboard/workforce",
    items: [
      { label: "PSH Dashboard", href: "/dashboard/psh", icon: "Heart" },
      { label: "Team Pulse", href: "/team-loop/pulse", icon: "Users" },
      { label: "Training", href: "/dashboard/training", icon: "GraduationCap" },
    ],
  },
  psh: {
    title: "PSH & WHS",
    href: "/dashboard/psh",
    items: [
      { label: "PSH Dashboard", href: "/dashboard/psh", icon: "Heart" },
      { label: "ISO 45003 Evidence", href: "/dashboard/risk", icon: "Shield" },
    ],
  },
  whs: {
    title: "WHS",
    items: [
      { label: "WHS Incidents", href: "/dashboard/operations/incidents", icon: "AlertTriangle" },
      { label: "ISO 45003", href: "/dashboard/workforce/psh/iso45003", icon: "Shield" },
    ],
  },
  financial: {
    title: "FINANCIAL",
    href: "/dashboard/financial",
    items: [
      { label: "Revenue", href: "/dashboard/financial/revenue", icon: "DollarSign" },
      { label: "Care Ratio", href: "/dashboard/financial/care-ratio", icon: "BarChart2" },
      { label: "Agency Cost", href: "/dashboard/financial/agency", icon: "Users" },
      { label: "Benchmarks", href: "/dashboard/financial/benchmarks", icon: "BarChart2" },
      { label: "Oracle Report", href: "/dashboard/financial/oracle", icon: "TrendingUp" },
      { label: "Budget", href: "/dashboard/financial/budget", icon: "FileText" },
    ],
  },
  financial_ops: {
    title: "FINANCIAL",
    href: "/dashboard/financial",
    items: [
      { label: "Agency Cost", href: "/dashboard/financial/agency", icon: "Users" },
    ],
  },
  // ── HOME CARE NAV SECTIONS ────────────────────────────────
  care_management: {
    title: "VISITS",
    href: "/dashboard/home-care/visits",
    items: [
      { label: "Visit Compliance", href: "/dashboard/home-care/visits", icon: "Activity" },
      { label: "Lone Worker Safety", href: "/dashboard/home-care/visits/lone-worker", icon: "Shield" },
      { label: "SIRS Register", href: "/dashboard/home-care/sirs", icon: "AlertTriangle" },
      { label: "Incidents", href: "/dashboard/home-care/incidents", icon: "AlertTriangle" },
    ],
  },
  clients: {
    title: "CLIENTS",
    href: "/dashboard/home-care/clients",
    items: [
      { label: "Client Intelligence", href: "/dashboard/home-care/clients", icon: "Users" },
      { label: "Care Plans", href: "/dashboard/home-care/clients/care-plans", icon: "FileText" },
      { label: "Feedback & Complaints", href: "/dashboard/home-care/clients/feedback", icon: "AlertTriangle" },
    ],
  },
  budget_management: {
    title: "PACKAGES",
    href: "/dashboard/home-care/packages",
    items: [
      { label: "Package Intelligence", href: "/dashboard/home-care/packages", icon: "DollarSign" },
      { label: "Budget Statements", href: "/dashboard/home-care/packages/statements", icon: "FileText" },
      { label: "Unspent Funds", href: "/dashboard/home-care/packages/unspent", icon: "AlertTriangle" },
    ],
  },
  lone_worker: {
    title: "WORKER SAFETY",
    items: [
      { label: "Lone Worker Safety", href: "/dashboard/home-care/visits/lone-worker", icon: "Shield" },
    ],
  },

  // ── HOME CARE ADDITIONAL SECTIONS ───────────────────────
  hc_overview: {
    title: "OVERVIEW",
    alwaysOpen: true,
    items: [
      { label: "Home", href: "/dashboard/home-care", icon: "Home" },
      { label: "Review Queue", href: "/don/queue", icon: "ClipboardList" },
      { label: "Morning Briefing", href: "/dashboard/home-care/briefing", icon: "FileText" },
      { label: "Documents", href: "/dashboard/home-care/documents", icon: "FileText" },
      { label: "CHRIS Coach", href: "/dashboard/coach", icon: "Sparkles" },
      { label: "Agents", href: "/dashboard/agents", icon: "Activity" },
      { label: "iMessage Demo", href: "/dashboard/home-care/demo/imessage", icon: "FileText" },
    ],
  },
  hc_workforce: {
    title: "WORKFORCE",
    href: "/dashboard/home-care/workforce",
    items: [
      { label: "Workforce Control Centre", href: "/dashboard/home-care/workforce", icon: "Users" },
      { label: "PSH Dashboard", href: "/dashboard/home-care/workforce/psh", icon: "Heart" },
      { label: "Keeper Signals", href: "/dashboard/home-care/workforce/keeper", icon: "Activity" },
      { label: "Training Compliance", href: "/dashboard/home-care/workforce/training", icon: "GraduationCap" },
    ],
  },
  hc_financial: {
    title: "FINANCIAL",
    href: "/dashboard/home-care/financial",
    items: [
      { label: "Financial Dashboard", href: "/dashboard/home-care/financial", icon: "DollarSign" },
      { label: "Oracle Report", href: "/dashboard/home-care/financial/oracle", icon: "TrendingUp" },
      { label: "Benchmarks", href: "/dashboard/home-care/financial/benchmarks", icon: "BarChart2" },
    ],
  },
  hc_compliance: {
    title: "COMPLIANCE",
    href: "/dashboard/home-care/compliance",
    items: [
      { label: "Compliance Register", href: "/dashboard/home-care/compliance", icon: "Shield" },
      { label: "SIRS Register", href: "/dashboard/home-care/sirs", icon: "AlertTriangle" },
      { label: "Corrective Actions", href: "/dashboard/home-care/compliance/corrective-actions", icon: "CheckSquare" },
    ],
  },

  // ── NDIS NAV SECTIONS (routes point to shared screens until NDIS is built) ──
  supports: {
    title: "SUPPORTS",
    href: "/dashboard/residents",
    items: [
      { label: "Support Delivery", href: "/dashboard/residents", icon: "Activity" },
      { label: "Incident Register", href: "/dashboard/operations/incidents", icon: "AlertTriangle" },
    ],
  },
  participants: {
    title: "PARTICIPANTS",
    href: "/dashboard/residents",
    items: [
      { label: "Participant Intelligence", href: "/dashboard/residents", icon: "Users" },
      { label: "Support Plans", href: "/dashboard/residents/care-plans", icon: "FileText" },
      { label: "Feedback", href: "/dashboard/residents/feedback", icon: "AlertTriangle" },
    ],
  },
  plan_budgets: {
    title: "PLAN BUDGETS",
    href: "/dashboard/financial",
    items: [
      { label: "Plan Budgets", href: "/dashboard/financial", icon: "DollarSign" },
    ],
  },
  worker_screening: {
    title: "WORKER SCREENING",
    items: [
      { label: "Worker Screening", href: "/dashboard/workforce", icon: "Shield" },
    ],
  },

  governance: {
    title: "GOVERNANCE",
    href: "/dashboard/governance",
    items: [
      { label: "Compliance Register", href: "/dashboard/governance", icon: "Shield" },
      { label: "Reporting Cycles", href: "/dashboard/reporting", icon: "Calendar" },
      { label: "Corrective Actions", href: "/dashboard/governance/corrective-actions/CA-2026-004", icon: "CheckSquare" },
    ],
  },
  compliance: {
    title: "COMPLIANCE",
    href: "/dashboard/compliance",
    items: [
      { label: "Compliance Register", href: "/dashboard/compliance", icon: "Shield" },
      { label: "Corrective Actions", href: "/dashboard/corrective-actions", icon: "CheckSquare" },
    ],
  },
  portfolio: {
    title: "PORTFOLIO",
    href: "/dashboard/portfolio",
    items: [
      { label: "Portfolio Command", href: "/dashboard/portfolio", icon: "BarChart2" },
    ],
  },
  loops: {
    title: "WEEKLY LOOPS",
    type: 'weekly_loops',
    href: "/dashboard/weekly-loops",
    items: [], // Items are in teamLoop/leaderLoop sub-sections
    teamLoop: {
      label: "Team Loop",
      items: [
        { label: "Team Pulse", href: "/dashboard/weekly-loops/team-pulse", icon: "Heart" },
        { label: "Team Briefings", href: "/dashboard/weekly-loops/team-briefings", icon: "FileText" },
        { label: "Leadership Session", href: "/dashboard/weekly-loops/leadership-session", icon: "Users" },
        { label: "Micro Practice", href: "/dashboard/weekly-loops/practice", icon: "Sparkles" },
      ],
    },
    leaderLoop: {
      label: "Leader Loop",
      items: [
        { label: "Leader Pulse", href: "/dashboard/weekly-loops/leader-pulse", icon: "Heart" },
        { label: "Leader Briefing", href: "/dashboard/weekly-loops/leader-briefing", icon: "FileText" },
        { label: "Self-Reflection", href: "/dashboard/weekly-loops/self-reflection", icon: "BookOpen" },
      ],
    },
  } as WeeklyLoopSection,
  team: {
    title: "MY TEAM",
    items: [
      { label: "Team Dashboard", href: "/dashboard/team-leader", icon: "Users" },
      { label: "Team Loop", href: "/team-loop/briefing", icon: "Heart" },
      { label: "Leader Loop", href: "/leader-loop/arrive", icon: "Star" },
    ],
  },
  briefing: {
    title: "BRIEFING",
    items: [],
  },
  coach: {
    title: "COACH",
    items: [
      { label: "CHRIS Coach", href: "/dashboard/coach", icon: "Sparkles" },
    ],
  },
  pulse: {
    title: "PULSE",
    items: [
      { label: "Team Pulse", href: "/team-loop/pulse", icon: "Heart" },
    ],
  },
  operator: {
    title: "OPERATOR",
    items: [
      { label: "Operator Dashboard", href: "/dashboard/operator", icon: "Shield" },
    ],
  },
  providers: {
    title: "PROVIDERS",
    items: [
      { label: "All Providers", href: "/dashboard/operator/providers", icon: "Users" },
    ],
  },
  agents: {
    title: "AGENTS",
    items: [
      { label: "Agent Activity", href: "/dashboard/agents", icon: "Activity" },
    ],
  },
  connectors: {
    title: "CONNECTORS",
    items: [
      { label: "Connector Health", href: "/dashboard/operator/connectors", icon: "Activity" },
    ],
  },
};

/**
 * Resolve nav_sections string array from role config into full NavSection objects
 */
export function resolveNavSections(sectionNames: string[]): (NavSection | WeeklyLoopSection)[] {
  const names = sectionNames.includes('overview') ? sectionNames : ['overview', ...sectionNames];
  return names
    .map((name) => NAV_SECTIONS[name])
    .filter((s): s is NavSection | WeeklyLoopSection => s !== undefined);
}

/** Type guard for weekly loops section */
export function isWeeklyLoops(section: NavSection | WeeklyLoopSection): section is WeeklyLoopSection {
  return section.type === 'weekly_loops';
}

/**
 * Get the current active loop week.
 * In production this reads from the cycles table.
 * For now: derive from the current date — odd weeks = Team Loop (1), even weeks = Leader Loop (2).
 */
export function getActiveLoopWeek(): 1 | 2 {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  return (weekNumber % 2 === 1) ? 1 : 2;
}

export default NAV_SECTIONS;
