"use client";
import { RoleHomeScreen, type RoleHomeConfig } from "@/components/dashboard/RoleHomeScreen";
import { WorkforceFinancialPanel } from "@/components/financial/WorkforceFinancialPanel";

const config: RoleHomeConfig = {
  greeting: "Good morning, Rachel",
  subtitle: "Knights of the Holy Grail · People & Culture",
  todaysPicture: "AIN turnover is running at 34% annualised — 8 points above sector median. CHRIS has cross-referenced this with PSH data: the highest-churn teams consistently show PSH_13 (Recognition) and PSH_02 (Support) declining 4+ cycles before exit events. This is a culture signal, not a recruitment problem. 6 AHPRA registrations expire in the next 3 weeks — if not renewed, Facility B's care minutes will be at risk. Leader Loop completion is at 57% — 6 leaders haven't started Cycle 8. On a positive note, agency dependency is at 14%, below the 15% target.",
  domains: [
    { name: "Turnover", status: "watch", summary: "28% rolling · AIN 34% · above sector", href: "/dashboard/hr/workforce" },
    { name: "Agency", status: "clear", summary: "14% of care hours · below 15% target ✅", href: "/dashboard/workforce" },
    { name: "Training", status: "watch", summary: "91% complete · 6 AHPRA expiring in 3 weeks", href: "/dashboard/hr/training" },
    { name: "Leader Loop", status: "watch", summary: "57% completion · 6 not started", href: "/dashboard/hr/leader-loop" },
    { name: "Absenteeism", status: "clear", summary: "7.2% · stable vs 90-day baseline", href: "/dashboard/workforce" },
  ],
  topActions: [
    { priority: "act", label: "6 AHPRA registrations expiring — care minutes at risk if not renewed", actionLabel: "Send reminders →", href: "/dashboard/hr/training" },
    { priority: "watch", label: "Identify at-risk teams for turnover — PSH_13 + PSH_02 pattern", actionLabel: "View teams →", href: "/dashboard/workforce" },
    { priority: "watch", label: "Chase 6 leaders who haven't started Leader Loop Cycle 8", actionLabel: "Send chase →", href: "/dashboard/hr/leader-loop" },
  ],
  intelligence: {
    type: "CAUSAL", confidence: "STRONG", domains: ["Workforce", "PSH", "Financial"],
    headline: "Turnover is a PSH outcome, not a recruitment problem",
    detail: "Teams with highest turnover show PSH_13 (Low Recognition) + PSH_02 (Lack of Support) elevated 4+ cycles before resignation. Targeted recognition practices are the highest-ROI HR intervention.",
  },
  briefing: { label: "P&C Committee Pack · Q1", sub: "CHRIS draft ready · turnover analysis + PSH root cause", href: "/dashboard/reporting" },
  queueCount: 3, queueHref: "/don/queue", notificationCount: 2,
};

export default function HRHome() {
  return (
    <RoleHomeScreen config={config}>
      <WorkforceFinancialPanel />
    </RoleHomeScreen>
  );
}
