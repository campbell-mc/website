"use client";

import { useRouter } from "next/navigation";

interface Obligation {
  id: string;
  title: string;
  status: "met" | "at_risk" | "upcoming";
  deadline: string;
  description: string;
}

interface CorrectiveAction {
  id: string;
  title: string;
  status: "open" | "in_progress";
  dueDate: string;
}

const STATUS_DOT: Record<string, string> = {
  met: "bg-[#2D7D73]",
  at_risk: "bg-[#D4A017]",
  upcoming: "bg-muted-foreground/40",
};

const STATUS_LABEL: Record<string, string> = {
  met: "Met",
  at_risk: "At risk",
  upcoming: "Upcoming",
};

const OBLIGATIONS: Obligation[] = [
  {
    id: "obl-qi-q2",
    title: "QI Submission — Q2 2025-26",
    status: "met",
    deadline: "21 Oct 2025",
    description: "15 mandatory quality indicators submitted to GPMS.",
  },
  {
    id: "obl-sirs",
    title: "SIRS Reporting — Current Period",
    status: "met",
    deadline: "Ongoing",
    description: "All SIRS notifications submitted within required timeframes.",
  },
  {
    id: "obl-care-minutes",
    title: "Care Minutes — Q3 Target",
    status: "at_risk",
    deadline: "30 Jun 2026",
    description: "Current trajectory 210 min/day against 215 min target. RN component at risk.",
  },
  {
    id: "obl-star-ratings",
    title: "Star Ratings Reassessment",
    status: "upcoming",
    deadline: "Jul 2026",
    description: "Next star ratings publication expected July 2026. Current overall: 3 stars.",
  },
];

const CORRECTIVE_ACTIONS: CorrectiveAction[] = [
  {
    id: "CA-2026-003",
    title: "Medication management — storage temperatures",
    status: "in_progress",
    dueDate: "15 Apr 2026",
  },
  {
    id: "CA-2026-004",
    title: "Medication management — PRN protocols",
    status: "open",
    dueDate: "28 Apr 2026",
  },
];

const STATS = [
  { label: "Total obligations", value: 20, color: "text-foreground" },
  { label: "Met", value: 16, color: "text-[#2D7D73]" },
  { label: "At risk", value: 2, color: "text-[#D4A017]" },
  { label: "Upcoming", value: 2, color: "text-muted-foreground" },
];

export default function GovernancePage() {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[28px] font-bold text-foreground tracking-tight leading-tight">
          Governance
        </h1>
        <p className="text-[10px] text-muted-foreground">
          Compliance obligations, corrective actions, and governance documents
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Compliance obligations */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">
        Compliance obligations
      </p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
        {OBLIGATIONS.map((obl, i) => (
          <div
            key={obl.id}
            className={`flex items-start gap-3 px-4 py-3 ${i < OBLIGATIONS.length - 1 ? "border-b border-border" : ""}`}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${STATUS_DOT[obl.status]}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-foreground">{obl.title}</p>
                <span className="text-[10px] text-muted-foreground shrink-0">{obl.deadline}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">{obl.description}</p>
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
              {STATUS_LABEL[obl.status]}
            </span>
          </div>
        ))}
      </div>

      {/* Corrective actions */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">
        Corrective actions
      </p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
        {CORRECTIVE_ACTIONS.map((ca, i) => (
          <button
            key={ca.id}
            onClick={() => router.push(`/dashboard/governance/corrective-actions/${ca.id}`)}
            className={`w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left ${i < CORRECTIVE_ACTIONS.length - 1 ? "border-b border-border" : ""}`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className={`w-2 h-2 rounded-full shrink-0 ${ca.status === "in_progress" ? "bg-[#D4A017]" : "bg-muted-foreground/40"}`} />
              <div>
                <p className="text-xs font-medium text-foreground">{ca.title}</p>
                <p className="text-[10px] text-muted-foreground">{ca.id} · Due {ca.dueDate}</p>
              </div>
            </div>
            <span className="text-muted-foreground/40 text-sm">&rsaquo;</span>
          </button>
        ))}
      </div>

      {/* Quick links */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">
        Quick links
      </p>
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button
          onClick={() => router.push("/dashboard/governance/board-pack")}
          className="bg-card rounded-xl border border-border p-4 text-left hover:bg-muted/50 transition-colors"
        >
          <p className="text-sm font-semibold text-foreground mb-0.5">Board Pack</p>
          <p className="text-[10px] text-muted-foreground">Q3 2025-26 governance pack</p>
        </button>
        <button
          onClick={() => router.push("/dashboard/reporting")}
          className="bg-card rounded-xl border border-border p-4 text-left hover:bg-muted/50 transition-colors"
        >
          <p className="text-sm font-semibold text-foreground mb-0.5">Reporting Cycles</p>
          <p className="text-[10px] text-muted-foreground">QI, SIRS, Star Ratings schedules</p>
        </button>
      </div>
    </div>
  );
}
