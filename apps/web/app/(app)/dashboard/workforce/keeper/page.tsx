"use client";

import { useRouter } from "next/navigation";

interface WorkforceSignal {
  id: string;
  title: string;
  severity: "urgent" | "routine";
  metric: string;
  description: string;
  recommendedAction: string;
  route?: string;
  ctaLabel: string;
}

const SEVERITY_STYLES: Record<string, { border: string; badge: string }> = {
  urgent: { border: "border-l-[#D4A017]", badge: "bg-[#D4A017]/10 text-[#D4A017]" },
  routine: { border: "border-l-[#2D7D73]", badge: "bg-[#2D7D73]/10 text-[#2D7D73]" },
};

const SIGNALS: WorkforceSignal[] = [
  {
    id: "turnover-wattle",
    title: "Turnover precursor detected — Wattle Wing",
    severity: "urgent",
    metric: "71% probability",
    description: "Keeper has identified a turnover precursor pattern in Wattle Wing. PSH Cycle 8 data shows elevated psychosocial load combined with 3 consecutive months of overtime above threshold.",
    recommendedAction: "Review Wattle Wing PSH briefing and consider targeted intervention before next roster cycle.",
    route: "/dashboard/workforce/keeper/turnover-precursor",
    ctaLabel: "View detail and commit actions →",
  },
  {
    id: "composition-grevillea",
    title: "Composition drift — Grevillea Unit",
    severity: "routine",
    metric: "1:6 RN ratio",
    description: "RN-to-resident ratio in Grevillea has drifted to 1:6 on PM shifts, above the 1:5 target. Two casual RNs have reduced availability since March.",
    recommendedAction: "Review rostering allocation for Grevillea PM shifts and consider backfill options.",
    route: "/dashboard/workforce/keeper/composition-drift",
    ctaLabel: "View detail and commit actions →",
  },
  {
    id: "ahpra-expiry",
    title: "6 AHPRA registrations expiring",
    severity: "urgent",
    metric: "3 weeks",
    description: "Six staff members have AHPRA registrations expiring within 3 weeks. Keeper has sent automated reminders but no renewals have been confirmed.",
    recommendedAction: "Escalate to HR coordinator and confirm renewal status for all 6 registrations.",
    route: "/dashboard/workforce/keeper/ahpra-expiry",
    ctaLabel: "View detail and commit actions →",
  },
  {
    id: "leave-liability",
    title: "Leave liability accumulation",
    severity: "routine",
    metric: "$48K accrued",
    description: "Annual leave liability has reached $48,000 across 12 staff members with balances exceeding 6 weeks. This represents a financial risk and potential fatigue concern.",
    recommendedAction: "Initiate leave management conversations and schedule planned leave to reduce exposure.",
    route: "/dashboard/workforce/keeper/leave-liability",
    ctaLabel: "View detail and commit actions →",
  },
];

export default function KeeperPage() {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-[#E07B39] flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">K</span>
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-foreground tracking-tight leading-tight">
            Workforce Signals
          </h1>
          <p className="text-[10px] text-muted-foreground">
            {SIGNALS.length} signals from The Keeper
          </p>
        </div>
      </div>

      {/* Signal cards */}
      <div className="space-y-3">
        {SIGNALS.map((signal) => {
          const style = SEVERITY_STYLES[signal.severity];
          return (
            <div
              key={signal.id}
              className={`bg-card rounded-xl border border-border border-l-4 ${style.border} p-5`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-sm font-semibold text-foreground">{signal.title}</h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${style.badge}`}>
                  {signal.metric}
                </span>
              </div>

              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{signal.description}</p>

              {/* Recommended action */}
              <div className="bg-muted/30 rounded-lg p-3 mb-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-1">
                  Recommended action
                </p>
                <p className="text-xs text-foreground leading-relaxed">{signal.recommendedAction}</p>
              </div>

              <button
                onClick={() => signal.route && router.push(signal.route)}
                className="text-xs font-medium text-[#1B4332] hover:underline"
              >
                {signal.ctaLabel} &rarr;
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
