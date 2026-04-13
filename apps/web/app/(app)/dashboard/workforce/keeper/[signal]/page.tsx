"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

interface ChrisAction {
  id: string;
  label: string;
  description: string;
  type: "draft" | "review" | "email" | "imessage" | "submit" | "schedule";
  icon: string;
  committed: boolean;
}

const SIGNALS: Record<string, {
  title: string;
  severity: "urgent" | "routine";
  metric: string;
  narrative: string;
  driver: string;
  suggestedActions: string[];
  chrisActions: ChrisAction[];
  relatedData: { label: string; value: string; route?: string }[];
}> = {
  "turnover-precursor": {
    title: "Turnover precursor — Wattle Wing Team B",
    severity: "urgent",
    metric: "71% probability within 4-6 cycles",
    narrative: "PSH_13 (Low Recognition) has been declining for 3 consecutive cycles in Wattle Wing Team B. When PSH_13 declines at this rate for 3+ cycles, voluntary turnover follows within 4-6 cycles in 71% of comparable teams across the CHRIS network. This is not a sudden event — it's a slow withdrawal that becomes visible in the data before the resignation letter arrives. The current absenteeism spike in this team (40% above target) is consistent with the pre-exit pattern: staff disengage emotionally before they disengage physically.",
    driver: "PSH_13 (Low Recognition) declining 3 consecutive cycles. Convergence with absenteeism spike (40% above target) and PSH_08 (Traumatic Exposure) co-elevation. The team has experienced 3 resident deaths in 6 weeks with no structured debrief — cumulative grief is compounding the recognition deficit.",
    suggestedActions: [
      "Team Leader conversation with Wattle Wing Team B lead — this week",
      "Micro-practice focus: specific recognition for observed behaviour (MP_012)",
      "Review rostering for this team — are the same people carrying the hardest shifts?",
      "Check if the 3 resident deaths triggered any debrief or support",
    ],
    chrisActions: [
      { id: "a1", label: "Draft a leadership conversation brief", description: "CHRIS prepares a private brief for the DON/FM — what the data shows, what to listen for, suggested conversation approach. Not a script — a preparation document.", type: "draft", icon: "📄", committed: false },
      { id: "a2", label: "Send iMessage to Team Leader", description: "A warm, non-alarming check-in via iMessage: 'CHRIS has noticed something in your team's data worth a conversation. When's a good time this week?'", type: "imessage", icon: "💬", committed: false },
      { id: "a3", label: "Schedule recognition micro-practice (MP_012)", description: "Prescribe MP_012 (Specific praise for observed behaviour) as the Team Loop practice for Cycle 9. Replaces the current selection.", type: "schedule", icon: "🎯", committed: false },
      { id: "a4", label: "Draft email to HR — retention risk flag", description: "Confidential email to HR flagging the retention risk signal. No names — role and team only. Recommends proactive engagement.", type: "email", icon: "✉️", committed: false },
    ],
    relatedData: [
      { label: "PSH_13 score", value: "3.7 (↑ from 3.2)", route: "/dashboard/workforce/psh/wattle-wing" },
      { label: "Absenteeism", value: "40% above target", route: "/dashboard/operations/leave" },
      { label: "Resident deaths", value: "3 in 6 weeks" },
      { label: "Team tenure avg", value: "14 months" },
      { label: "Replacement cost", value: "$28K per RN exit" },
    ],
  },
  "ahpra-expiry": {
    title: "6 AHPRA registrations expiring in 3 weeks",
    severity: "urgent",
    metric: "6 registrations · 3 weeks",
    narrative: "Six registered nurses have AHPRA registrations expiring within the next 21 days. If any lapse, the affected staff cannot legally work in an RN capacity. At current staffing levels, even one lapsed registration would force agency cover for those shifts at $190/shift premium. If multiple lapse simultaneously, care minutes compliance is at immediate risk — the facility cannot meet the 40-minute RN minimum without these registrations being current.",
    driver: "Employment Hero shows 6 RN AHPRA registrations with expiry dates between 27 April and 4 May 2026. Renewal reminders were sent 60 days ago but no renewals have been recorded in the system. This may indicate staff haven't actioned the renewal, or renewals are in progress but not yet reflected in Employment Hero.",
    suggestedActions: [
      "Verify with each affected RN whether renewal is in progress",
      "Check AHPRA online register for any already renewed",
      "If not renewed: assist with renewal paperwork this week",
      "Contingency: identify agency cover for worst case of 2+ simultaneous lapses",
    ],
    chrisActions: [
      { id: "a1", label: "Send renewal reminder via iMessage", description: "Individual iMessage to each of the 6 RNs with their specific expiry date and a link to the AHPRA renewal portal.", type: "imessage", icon: "💬", committed: false },
      { id: "a2", label: "Draft email to HR — AHPRA expiry alert", description: "Email to HR Manager with the 6 names, expiry dates, and recommended actions. Flagged as time-sensitive.", type: "email", icon: "✉️", committed: false },
      { id: "a3", label: "Add to DON review queue", description: "Create a high-priority queue item for the DON to personally verify renewal status with each affected RN.", type: "review", icon: "📋", committed: false },
      { id: "a4", label: "Pre-book agency contingency", description: "Source agency RN cover for the shifts most at risk if registrations lapse. No commitment — just availability confirmed.", type: "schedule", icon: "📅", committed: false },
    ],
    relatedData: [
      { label: "Affected shifts/week", value: "6 RN shifts" },
      { label: "Agency cost if lapsed", value: "$1,140/week premium" },
      { label: "Care minutes risk", value: "40 RN min/day at risk" },
      { label: "Source", value: "Employment Hero" },
    ],
  },
  "composition-drift": {
    title: "Composition drift — Grevillea Wing RN:AIN ratio 1:6",
    severity: "routine",
    metric: "Current ratio 1:6 · Target 1:5",
    narrative: "The RN to AIN ratio in Grevillea Wing has shifted from 1:4 to 1:6 over the past 3 months. This has happened gradually through a combination of AIN recruitment (positive) and RN leave/turnover (negative). While the current ratio is still technically compliant, it is approaching the 1:5 threshold below which award compliance becomes a concern. More importantly, Grevillea Wing is the dementia wing — higher acuity residents require closer RN supervision.",
    driver: "Two contributing factors: (1) Successful AIN recruitment added 3 staff without corresponding RN increase. (2) One permanent RN transitioned to part-time, reducing effective RN hours by 20%. The Steward's rostering analysis confirms the gap is structural, not episodic.",
    suggestedActions: [
      "Review RN allocation for Grevillea Wing at next rostering cycle",
      "Consider whether the part-time RN transition can be backfilled",
      "Monitor care outcomes — falls and medication errors in this wing",
    ],
    chrisActions: [
      { id: "a1", label: "Draft rostering review brief", description: "Prepare a brief for the FM showing the composition change over 3 months with the operational impact. Includes the Steward's recommendation.", type: "draft", icon: "📄", committed: false },
      { id: "a2", label: "Schedule Steward rostering review", description: "Task the Steward to run a full composition analysis for Grevillea Wing and recommend an optimal roster architecture.", type: "schedule", icon: "📅", committed: false },
      { id: "a3", label: "Add to governance register", description: "Record the composition drift as a monitored risk in the governance register. Review in 4 weeks.", type: "review", icon: "📋", committed: false },
    ],
    relatedData: [
      { label: "Current ratio", value: "1:6 (target 1:5)" },
      { label: "3 months ago", value: "1:4" },
      { label: "Wing acuity", value: "Dementia — high" },
      { label: "Steward status", value: "Recommendation ready", route: "/dashboard/operations/steward-analysis" },
    ],
  },
  "leave-liability": {
    title: "$48K accrued leave liability",
    severity: "routine",
    metric: "$48,000 accrued",
    narrative: "Four staff members have not taken annual leave in more than 6 months. Combined accrued leave liability is $48,000 and growing. Under the National Employment Standards, employers must ensure annual leave is taken within a reasonable period. If staff do not take leave voluntarily, the facility may need to direct leave — which creates rostering challenges and potential conflict. The financial liability is manageable now but becomes a risk if it continues to grow, particularly approaching the financial year end.",
    driver: "4 staff: 2 RNs (38 days and 32 days accrued), 1 EN (28 days), 1 AIN (22 days). All have had leave applications available but not submitted. The Keeper has cross-referenced this with PSH data — two of the four are in teams with elevated PSH_01 (High Job Demands), suggesting they may feel they cannot take leave without creating coverage problems for their colleagues.",
    suggestedActions: [
      "Have a supportive conversation with each of the 4 staff about leave planning",
      "Ensure coverage plans are visible — staff need to know their leave won't burden others",
      "Set target: all 4 to have leave booked within 4 weeks",
    ],
    chrisActions: [
      { id: "a1", label: "Send leave planning iMessage", description: "Individual iMessage to each of the 4 staff: warm, supportive, encouraging them to book leave. Include their accrual balance and a note that coverage will be managed.", type: "imessage", icon: "💬", committed: false },
      { id: "a2", label: "Draft leave planning summary for FM", description: "One-page summary showing the 4 staff, their accrued balances, team coverage implications, and recommended leave windows.", type: "draft", icon: "📄", committed: false },
      { id: "a3", label: "Add to monthly financial review", description: "Include the leave liability figure in the next financial summary for the CFO/FM with a trend line showing growth.", type: "review", icon: "📋", committed: false },
    ],
    relatedData: [
      { label: "Staff affected", value: "4 (2 RN, 1 EN, 1 AIN)" },
      { label: "Highest accrual", value: "38 days (RN)" },
      { label: "Monthly growth", value: "~$3K/month" },
      { label: "Leave calendar", value: "View →", route: "/dashboard/operations/leave" },
    ],
  },
};

const ACTION_TYPE_LABELS: Record<string, string> = {
  draft: "CHRIS will draft", review: "Add to review queue", email: "CHRIS will draft email",
  imessage: "Send via iMessage", submit: "Prepare for submission", schedule: "CHRIS will schedule",
};

export default function KeeperSignalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.signal as string;
  const signal = SIGNALS[slug];
  const [actions, setActions] = useState<ChrisAction[]>(signal?.chrisActions ?? []);

  if (!signal) {
    return (
      <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-muted-foreground mb-4"><ChevronLeft className="w-4 h-4" /> Back</button>
        <p className="text-muted-foreground">Signal not found.</p>
      </div>
    );
  }

  function commitAction(id: string) {
    setActions((prev) => prev.map((a) => a.id === id ? { ...a, committed: true } : a));
  }

  const committedCount = actions.filter((a) => a.committed).length;

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-3xl mx-auto">
      <button onClick={() => router.push("/dashboard/workforce/keeper")} className="flex items-center gap-1 text-sm text-muted-foreground mb-4"><ChevronLeft className="w-4 h-4" /> Keeper signals</button>

      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-[#C4704A] flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-white text-sm font-bold">K</span>
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">{signal.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${signal.severity === "urgent" ? "bg-[#FFFBF0] text-[#D4A017] border border-[#D4A017]" : "bg-[#F0F7F4] text-[#2D7D73] border border-[#2D7D73]"}`}>
              {signal.metric}
            </span>
          </div>
        </div>
      </div>

      {/* Narrative — what's happening */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <div className="flex items-start gap-3">
          <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">What&apos;s happening</p>
            <p className="text-sm text-muted-foreground leading-relaxed font-serif-accent">{signal.narrative}</p>
          </div>
        </div>
      </div>

      {/* Driver — why */}
      <div className={`rounded-xl border-l-4 ${signal.severity === "urgent" ? "border-l-[#D4A017] bg-[#FFFBF0]" : "border-l-[#2D7D73] bg-[#F0F7F4]"} border border-border p-4 mb-5`}>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">What&apos;s driving it</p>
        <p className="text-sm text-foreground leading-relaxed">{signal.driver}</p>
      </div>

      {/* Related data */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Related data</p>
        <div className="space-y-2">
          {signal.relatedData.map((d) => (
            <div key={d.label} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{d.label}</span>
              {d.route ? (
                <button onClick={() => router.push(d.route!)} className="text-xs font-medium text-[hsl(var(--brand-teal))]">{d.value}</button>
              ) : (
                <span className="text-xs font-medium text-foreground">{d.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Suggested actions */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Suggested actions</p>
        <div className="space-y-2">
          {signal.suggestedActions.map((a, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-xs font-bold text-[#2D7D73] mt-0.5">{i + 1}.</span>
              <p className="text-xs text-foreground leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CHRIS Actions — committable */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Commit actions for CHRIS to execute</p>
          {committedCount > 0 && <span className="text-xs text-[#2D7D73] font-medium">{committedCount} committed</span>}
        </div>
        <div className="space-y-3">
          {actions.map((action) => (
            <div key={action.id} className={`rounded-xl border p-4 transition-all ${action.committed ? "border-[#2D7D73] bg-[#F0F7F4]" : "border-border bg-card"}`}>
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">{action.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground mb-0.5">{action.label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">{action.description}</p>
                  <p className="text-[10px] text-muted-foreground/60">{ACTION_TYPE_LABELS[action.type]}</p>
                </div>
                {action.committed ? (
                  <span className="text-xs font-medium text-[#2D7D73] bg-[#D4EDDD] px-2.5 py-1 rounded-full shrink-0">✓ Committed</span>
                ) : (
                  <button onClick={() => commitAction(action.id)} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#1B4332] text-white hover:opacity-90 shrink-0">
                    Commit →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Execute all */}
      {committedCount > 0 && committedCount < actions.length && (
        <button onClick={() => setActions((prev) => prev.map((a) => ({ ...a, committed: true })))} className="w-full py-3 border border-[#1B4332] text-[#1B4332] rounded-xl text-sm font-medium mb-3">
          Commit all remaining actions
        </button>
      )}

      {committedCount === actions.length && (
        <div className="bg-[#F0F7F4] rounded-xl border border-[#2D7D73] p-4 text-center mb-5">
          <p className="text-sm font-semibold text-[#1B4332] mb-1">All actions committed</p>
          <p className="text-xs text-muted-foreground">CHRIS will execute these actions and report back in your next morning briefing.</p>
        </div>
      )}

      <div className="h-16" />
    </div>
  );
}
