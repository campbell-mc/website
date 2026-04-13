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

const SIGNALS: Record<
  string,
  {
    title: string;
    severity: "urgent" | "watch";
    metric: string;
    narrative: string;
    driver: string;
    suggestedActions: string[];
    chrisActions: ChrisAction[];
    relatedData: { label: string; value: string; route?: string }[];
  }
> = {
  "lone-worker-pattern": {
    title: "Lone worker safety pattern — Camelot Leichhardt",
    severity: "urgent",
    metric: "3 overdue check-ins in 2 weeks",
    narrative:
      "Three support workers have recorded overdue safety check-ins in the Leichhardt service zone over the past two weeks. All three occurred during morning visits in the inner west corridor — Balmain, Rozelle, and Lilyfield. The pattern is not random: visit time allocations in AlayaCare for this zone average 45 minutes, but actual visit durations (from check-in to check-out) average 58 minutes. Workers are running behind schedule from the first visit, and by mid-morning the cumulative delay means check-ins are missed because the worker is already en route to the next client. This is a structural problem — visit time estimates are too tight for the Leichhardt zone, where parking, building access, and client complexity consistently add time that the schedule does not account for.",
    driver:
      "AlayaCare visit time allocations for the Leichhardt zone are set at 45 minutes average. Actual visit duration data (last 90 days) shows a mean of 58 minutes — a 29% underestimate. The 3 overdue check-ins all occurred between 10:00 AM and 11:30 AM, consistent with cumulative schedule drift. No worker misconduct or negligence — this is a scheduling issue, not a performance issue.",
    suggestedActions: [
      "Review and adjust AlayaCare visit time allocations for all Leichhardt zone clients",
      "Add a 15-minute travel and buffer allowance between visits in this zone",
      "Brief coordinators on the pattern — ensure they are not over-scheduling this corridor",
      "Consider whether the zone boundary needs adjustment to reduce travel density",
    ],
    chrisActions: [
      {
        id: "a1",
        label: "Adjust AlayaCare visit times for Leichhardt zone",
        description:
          "CHRIS prepares an adjustment request for all Leichhardt zone visit allocations — increasing from 45 to 55 minutes and adding 15-minute inter-visit buffers. Ready for coordinator approval.",
        type: "schedule",
        icon: "📅",
        committed: false,
      },
      {
        id: "a2",
        label: "Send coordinator iMessage",
        description:
          "Message to the Leichhardt coordinator: 'CHRIS has identified a pattern of overdue check-ins linked to visit time estimates. A schedule adjustment is ready for your review in AlayaCare. Can we discuss this week?'",
        type: "imessage",
        icon: "💬",
        committed: false,
      },
      {
        id: "a3",
        label: "Add 15-minute buffer to Leichhardt visits",
        description:
          "Apply a standing 15-minute buffer between all consecutive visits in the Leichhardt zone. This accounts for parking, building access, and transition time that the current schedule ignores.",
        type: "schedule",
        icon: "🕐",
        committed: false,
      },
    ],
    relatedData: [
      { label: "Overdue check-ins (2 weeks)", value: "3" },
      { label: "Avg visit allocation", value: "45 min" },
      { label: "Avg actual duration", value: "58 min" },
      { label: "Zone", value: "Leichhardt (Balmain, Rozelle, Lilyfield)" },
      { label: "Source", value: "AlayaCare check-in data" },
    ],
  },
  "avalon-turnover": {
    title: "Avalon turnover precursor — Northern Beaches travel burden",
    severity: "urgent",
    metric: "34.6% turnover — 6pp above Camelot",
    narrative:
      "Avalon Home Care (Manly) is running at 34.6% annualised turnover — 6 percentage points above Camelot Leichhardt. PSH_09 (Commute and Travel Burden) is elevated at 4.2, the highest of any team across both services. Exit interviews from the last 3 departures all cited travel time as a contributing factor. The Northern Beaches geography is uniquely challenging: clients are spread across a wide, low-density area from Manly to Palm Beach, and public transport options are limited. Workers are spending 30-40% of their rostered time travelling between clients, which compresses actual care delivery time and creates a sense of constant rush. This is not a motivation problem — it is a structural geography problem that manifests as burnout and resignation.",
    driver:
      "PSH_09 (Commute and Travel Burden) at 4.2 — highest across both services. 3 of last 4 exits cited travel as a factor. Average inter-client travel time: 28 minutes (vs. 14 minutes at Camelot Leichhardt). Workers in the Avalon zone spend an estimated 2.5 hours per day in transit. Travel reimbursement rate has not been reviewed in 18 months.",
    suggestedActions: [
      "Draft a retention brief for the Avalon team addressing travel burden directly",
      "Ask The Oracle to remap travel routes for optimal clustering",
      "Review travel reimbursement rates — benchmark against sector",
      "Schedule PSH debrief with Avalon coordinators to surface additional friction points",
    ],
    chrisActions: [
      {
        id: "a1",
        label: "Draft retention brief for Avalon team",
        description:
          "CHRIS prepares a brief for management: what the data shows about travel burden, the connection to turnover, and 3 recommended interventions (route remapping, reimbursement review, zone boundary adjustment).",
        type: "draft",
        icon: "📄",
        committed: false,
      },
      {
        id: "a2",
        label: "Remap travel routes per Oracle analysis",
        description:
          "Request The Oracle to run a geographic clustering analysis for Northern Beaches clients — recommending route groups that minimise inter-client travel time. Output: proposed visit sequences for each day.",
        type: "schedule",
        icon: "🗺️",
        committed: false,
      },
      {
        id: "a3",
        label: "Schedule PSH debrief with Avalon coordinators",
        description:
          "Set up a structured debrief session with Avalon coordinators to review PSH_09 data, discuss worker feedback, and co-design solutions. CHRIS prepares the data pack.",
        type: "schedule",
        icon: "📅",
        committed: false,
      },
    ],
    relatedData: [
      { label: "Avalon turnover", value: "34.6% annualised" },
      { label: "Camelot turnover", value: "28.4% annualised" },
      { label: "PSH_09 (Travel Burden)", value: "4.2 (elevated)" },
      { label: "Avg inter-client travel", value: "28 min (vs. 14 min Camelot)" },
      { label: "Travel reimbursement last review", value: "18 months ago" },
      { label: "Replacement cost per worker", value: "$18K average" },
    ],
  },
  "training-gap": {
    title: "Training gap — Managing Challenging Behaviour",
    severity: "watch",
    metric: "71.9% current — 25 workers not current",
    narrative:
      "Managing Challenging Behaviour (MCB) training currency across both services sits at 71.9% — 25 support workers are not current. This matters because home care workers operate alone in clients' homes, without the immediate backup available in a residential facility. When a client becomes agitated or aggressive, the worker's response depends entirely on their training and confidence. PSH_10 (Exposure to Aggression) is elevated at 3.8 across the workforce, and workers who are not MCB-current report significantly higher PSH_10 scores (4.3 vs. 3.4 for current workers). The training gap is not just a compliance issue — it compounds the psychological safety risk for workers who are already managing difficult situations without on-site support.",
    driver:
      "25 of 89 active support workers have MCB training that expired more than 6 months ago. PSH_10 (Exposure to Aggression) is elevated at 3.8 overall, and 4.3 among MCB-lapsed workers. 3 of the 25 non-current workers are rostered to clients flagged as having a history of aggressive behaviour. The training gap correlates directly with higher psychological safety risk.",
    suggestedActions: [
      "Schedule an MCB training session for the 25 non-current workers — prioritise those rostered to high-risk clients",
      "Send training reminder to affected workers with booking link",
      "Review client risk flags — ensure high-aggression-risk clients are matched to MCB-current workers",
      "Add MCB training currency to the compliance review queue for monthly monitoring",
    ],
    chrisActions: [
      {
        id: "a1",
        label: "Schedule MCB training session",
        description:
          "CHRIS identifies available training dates from the approved provider and prepares a booking request for the 25 non-current workers. Prioritises the 3 workers rostered to high-risk clients for the earliest available session.",
        type: "schedule",
        icon: "📅",
        committed: false,
      },
      {
        id: "a2",
        label: "Send training reminder iMessage",
        description:
          "Individual iMessage to each of the 25 non-current workers: 'Your MCB training is due for renewal. CHRIS has identified an upcoming session — details and booking link to follow from your coordinator.'",
        type: "imessage",
        icon: "💬",
        committed: false,
      },
      {
        id: "a3",
        label: "Add to compliance review queue",
        description:
          "Add MCB training currency as a standing item on the monthly compliance review. CHRIS will track progress toward 100% and alert if any worker rostered to a high-risk client is non-current.",
        type: "review",
        icon: "📋",
        committed: false,
      },
    ],
    relatedData: [
      { label: "MCB currency rate", value: "71.9% (64 of 89)" },
      { label: "Workers not current", value: "25" },
      { label: "PSH_10 (Aggression)", value: "3.8 overall / 4.3 lapsed" },
      { label: "High-risk client assignments", value: "3 non-current workers" },
      {
        label: "Training provider",
        value: "Dementia Australia (approved)",
      },
    ],
  },
  "casual-correlation": {
    title: "Casual worker incident correlation",
    severity: "watch",
    metric: "2/2 YTD incidents — casual relief workers",
    narrative:
      "Both reportable incidents in 2026 — the client fall in Balmain (February) and the medication error in Dee Why (January) — involved casual relief workers who had not previously visited the affected clients. This is not a coincidence: it is a pattern that reflects a structural gap in how casual workers are onboarded to individual client care requirements. Home care is different from residential — each client's home is a unique care environment with specific routines, mobility requirements, medication protocols, and environmental hazards. A casual worker arriving at a client's home for the first time is operating with significantly less situational awareness than a regular worker, and the absence of colleagues to consult means mistakes are more likely and harder to catch in real time.",
    driver:
      "2 of 2 YTD SIRS-reportable incidents involved casual relief workers on their first visit to the affected client. Neither worker had reviewed the client's care plan before the visit (care plans were available in AlayaCare but not flagged as mandatory pre-visit reading for casuals). The Balmain fall involved a transfer technique that was contra-indicated in the client's mobility plan. The Dee Why medication error was a missed prompt that was documented in the client's routine but not communicated to the casual worker.",
    suggestedActions: [
      "Create a mandatory casual orientation checklist for first-visit clients",
      "Brief coordinators on flagging high-risk clients for permanent worker allocation only",
      "Review AlayaCare workflow — ensure care plans are surfaced to casual workers before first visits",
      "Add casual worker incident correlation to the governance register as a monitored risk",
    ],
    chrisActions: [
      {
        id: "a1",
        label: "Create casual orientation checklist",
        description:
          "CHRIS drafts a pre-visit checklist for casual workers assigned to a new client: care plan review, key contacts, mobility requirements, medication schedule, environmental hazards. Designed to be completed in AlayaCare before check-in is permitted.",
        type: "draft",
        icon: "📄",
        committed: false,
      },
      {
        id: "a2",
        label: "Draft coordinator brief on high-risk client flagging",
        description:
          "Prepare a brief for all coordinators: which clients should be flagged as 'permanent worker only' based on complexity, and how to manage the allocation when permanent workers are unavailable.",
        type: "draft",
        icon: "📋",
        committed: false,
      },
      {
        id: "a3",
        label: "Add to governance register",
        description:
          "Record 'casual worker familiarity gap' as a monitored risk in the governance register with quarterly review cadence. Link to both YTD incidents as evidence.",
        type: "review",
        icon: "📋",
        committed: false,
      },
    ],
    relatedData: [
      { label: "YTD incidents", value: "2 (both casual workers)" },
      { label: "Casual workforce %", value: "22% of active workers" },
      { label: "First-visit incidents", value: "2 of 2 (100%)" },
      {
        label: "Balmain incident",
        value: "Client fall — Feb 2026",
        route: "/dashboard/home-care/sirs",
      },
      {
        label: "Dee Why incident",
        value: "Medication error — Jan 2026",
        route: "/dashboard/home-care/sirs",
      },
    ],
  },
};

const ACTION_TYPE_LABELS: Record<string, string> = {
  draft: "CHRIS will draft",
  review: "Add to review queue",
  email: "CHRIS will draft email",
  imessage: "Send via iMessage",
  submit: "Prepare for submission",
  schedule: "CHRIS will schedule",
};

export default function HomeCareKeeperSignalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.signal as string;
  const signal = SIGNALS[slug];
  const [actions, setActions] = useState<ChrisAction[]>(
    signal?.chrisActions ?? []
  );

  if (!signal) {
    return (
      <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-muted-foreground mb-4"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <p className="text-muted-foreground">Signal not found.</p>
      </div>
    );
  }

  function commitAction(id: string) {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, committed: true } : a))
    );
  }

  const committedCount = actions.filter((a) => a.committed).length;

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-3xl mx-auto">
      <button
        onClick={() =>
          router.push("/dashboard/home-care/workforce/keeper")
        }
        className="flex items-center gap-1 text-sm text-muted-foreground mb-4"
      >
        <ChevronLeft className="w-4 h-4" /> Keeper signals
      </button>

      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-[#E07B39] flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-white text-sm font-bold">K</span>
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">
            {signal.title}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                signal.severity === "urgent"
                  ? "bg-[#FFFBF0] text-[#D4A017] border border-[#D4A017]"
                  : "bg-[#F0F7F4] text-[#2D7D73] border border-[#2D7D73]"
              }`}
            >
              {signal.metric}
            </span>
          </div>
        </div>
      </div>

      {/* Narrative */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <div className="flex items-start gap-3">
          <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              What&apos;s happening
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed font-serif-accent">
              {signal.narrative}
            </p>
          </div>
        </div>
      </div>

      {/* Driver */}
      <div
        className={`rounded-xl border-l-4 ${
          signal.severity === "urgent"
            ? "border-l-[#D4A017] bg-[#FFFBF0]"
            : "border-l-[#2D7D73] bg-[#F0F7F4]"
        } border border-border p-4 mb-5`}
      >
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          What&apos;s driving it
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          {signal.driver}
        </p>
      </div>

      {/* Related data */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Related data
        </p>
        <div className="space-y-2">
          {signal.relatedData.map((d) => (
            <div
              key={d.label}
              className="flex items-center justify-between"
            >
              <span className="text-xs text-muted-foreground">
                {d.label}
              </span>
              {d.route ? (
                <button
                  onClick={() => router.push(d.route!)}
                  className="text-xs font-medium text-[hsl(var(--brand-teal))]"
                >
                  {d.value}
                </button>
              ) : (
                <span className="text-xs font-medium text-foreground">
                  {d.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Suggested actions */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Suggested actions
        </p>
        <div className="space-y-2">
          {signal.suggestedActions.map((a, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-xs font-bold text-[#2D7D73] mt-0.5">
                {i + 1}.
              </span>
              <p className="text-xs text-foreground leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CHRIS Actions */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Commit actions for CHRIS to execute
          </p>
          {committedCount > 0 && (
            <span className="text-xs text-[#2D7D73] font-medium">
              {committedCount} committed
            </span>
          )}
        </div>
        <div className="space-y-3">
          {actions.map((action) => (
            <div
              key={action.id}
              className={`rounded-xl border p-4 transition-all ${
                action.committed
                  ? "border-[#2D7D73] bg-[#F0F7F4]"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">{action.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground mb-0.5">
                    {action.label}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                    {action.description}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60">
                    {ACTION_TYPE_LABELS[action.type]}
                  </p>
                </div>
                {action.committed ? (
                  <span className="text-xs font-medium text-[#2D7D73] bg-[#D4EDDD] px-2.5 py-1 rounded-full shrink-0">
                    Committed
                  </span>
                ) : (
                  <button
                    onClick={() => commitAction(action.id)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#1B4332] text-white hover:opacity-90 shrink-0"
                  >
                    Commit →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commit all */}
      {committedCount > 0 && committedCount < actions.length && (
        <button
          onClick={() =>
            setActions((prev) =>
              prev.map((a) => ({ ...a, committed: true }))
            )
          }
          className="w-full py-3 border border-[#1B4332] text-[#1B4332] rounded-xl text-sm font-medium mb-3"
        >
          Commit all remaining actions
        </button>
      )}

      {committedCount === actions.length && (
        <div className="bg-[#F0F7F4] rounded-xl border border-[#2D7D73] p-4 text-center mb-5">
          <p className="text-sm font-semibold text-[#1B4332] mb-1">
            All actions committed
          </p>
          <p className="text-xs text-muted-foreground">
            CHRIS will execute these actions and report back in your next
            morning briefing.
          </p>
        </div>
      )}

      <div className="h-16" />
    </div>
  );
}
