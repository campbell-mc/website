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
      { label: "WHS Incidents", href: "/dashboard/whs/incidents", icon: "AlertTriangle" },
      { label: "ISO 45003", href: "/dashboard/risk", icon: "Shield" },
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
    title: "CARE MANAGEMENT",
    href: "/dashboard/clinical",
    items: [
      { label: "Visit Compliance", href: "/dashboard/visits", icon: "Activity" },
      { label: "Incident Register", href: "/dashboard/incidents", icon: "AlertTriangle" },
      { label: "Care Plans", href: "/dashboard/residents/care-plans", icon: "FileText" },
    ],
  },
  clients: {
    title: "CLIENTS",
    href: "/dashboard/residents",
    items: [
      { label: "Client Intelligence", href: "/dashboard/residents", icon: "Users" },
      { label: "Care Plans", href: "/dashboard/residents/care-plans", icon: "FileText" },
      { label: "Family Engagement", href: "/dashboard/residents/families", icon: "Users" },
      { label: "Feedback", href: "/dashboard/residents/feedback", icon: "AlertTriangle" },
    ],
  },
  budget_management: {
    title: "BUDGET",
    href: "/dashboard/budget",
    items: [
      { label: "Budget Management", href: "/dashboard/budget", icon: "DollarSign" },
    ],
  },
  lone_worker: {
    title: "WORKER SAFETY",
    items: [
      { label: "Lone Worker Safety", href: "/dashboard/workers/lone", icon: "Shield" },
    ],
  },

  // ── NDIS NAV SECTIONS ───────────────────────────────────
  supports: {
    title: "SUPPORTS",
    href: "/dashboard/supports",
    items: [
      { label: "Support Delivery", href: "/dashboard/supports", icon: "Activity" },
      { label: "Goal Progress", href: "/dashboard/supports/goals", icon: "BarChart2" },
      { label: "Incident Register", href: "/dashboard/incidents", icon: "AlertTriangle" },
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
    href: "/dashboard/plans",
    items: [
      { label: "Plan Budgets", href: "/dashboard/plans", icon: "DollarSign" },
      { label: "Claiming", href: "/dashboard/plans/claiming", icon: "FileText" },
    ],
  },
  worker_screening: {
    title: "WORKER SCREENING",
    items: [
      { label: "Worker Screening", href: "/dashboard/worker-screening", icon: "Shield" },
    ],
  },

  governance: {
    title: "GOVERNANCE",
    href: "/dashboard/compliance",
    items: [
      { label: "Compliance Register", href: "/dashboard/compliance", icon: "Shield" },
      { label: "Reporting Cycles", href: "/dashboard/reporting", icon: "Calendar" },
      { label: "Corrective Actions", href: "/dashboard/corrective-actions", icon: "CheckSquare" },
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
    items: [], // Items are in teamLoop/leaderLoop sub-sections
    teamLoop: {
      label: "Team Loop",
      items: [
        { label: "Pulse Check-In", href: "/team-loop/pulse", icon: "Heart" },
        { label: "Briefing & Practice", href: "/team-loop/briefing", icon: "FileText" },
        { label: "Reflection", href: "/team-loop/reflection", icon: "BookOpen" },
        { label: "Close Loop", href: "/team-loop/close", icon: "CheckCircle" },
      ],
    },
    leaderLoop: {
      label: "Leader Loop",
      items: [
        { label: "Arrive", href: "/leader-loop/arrive", icon: "Heart" },
        { label: "360 Profile", href: "/leader-loop/profile", icon: "Users" },
        { label: "Insights", href: "/leader-loop/insights", icon: "Sparkles" },
        { label: "One Big Practice", href: "/leader-loop/obp", icon: "Star" },
        { label: "Complete", href: "/leader-loop/complete", icon: "CheckCircle" },
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
