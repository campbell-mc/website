"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mic, MoreHorizontal, CheckCircle, AlertTriangle, FileText, Activity, Shield, Users, Clock } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

// ============================================================================
// Review Queue — same design language as everywhere else.
// CHRIS speaks first on every card. Action on the card.
// Demo items matching the home screen's top actions.
// ============================================================================

interface QueueItem {
  id: string;
  urgency: "immediate" | "urgent" | "routine";
  type: string;
  title: string;
  chris: string;
  actionLabel: string;
  href: string;
  deadline?: string;
  meta?: string;
}

const QUEUE_ITEMS: QueueItem[] = [
  // Immediate
  {
    id: "q1", urgency: "immediate", type: "SIRS",
    title: "SIRS Cat 2 · Review draft",
    chris: "Fall with hip fracture — Wing A. CHRIS draft is ready. Add resident details and approve before submission. 22 days remaining but best reviewed promptly.",
    actionLabel: "Review draft →", href: "/dashboard/sirs", deadline: "22 days",
  },
  // Urgent
  {
    id: "q2", urgency: "urgent", type: "Care Minutes",
    title: "Care minutes gap · Tonight's AIN shift",
    chris: "1 AIN shift unfilled tonight. Care minutes will stay compliant but the margin is thin. Post to internal pool or accept the gap.",
    actionLabel: "View roster →", href: "/dashboard/care-minutes",
  },
  {
    id: "q3", urgency: "urgent", type: "Governance",
    title: "Board Pack · Awaiting your review",
    chris: "CHRIS has drafted all 8 sections. Meeting in 8 days. Estimated review: 35 minutes. 3 decisions need your framing before CEO approval.",
    actionLabel: "Start review →", href: "/dashboard/reporting", deadline: "8 days",
  },
  {
    id: "q4", urgency: "urgent", type: "Audit",
    title: "Medication audit · 3 days overdue",
    chris: "CHRIS can guide you through it by voice. Takes about 45 minutes. Non-conformances will queue as corrective actions automatically.",
    actionLabel: "Start audit →", href: "/dashboard/audits",
  },
  // Routine
  {
    id: "q5", urgency: "routine", type: "Governance",
    title: "Clinical Governance Pack · Ready for review",
    chris: "CHRIS draft complete. 6 sections. Care minutes, QI snapshot, SIRS summary, audits, corrective actions, PSH summary. Est. 25 min.",
    actionLabel: "Start review →", href: "/dashboard/reporting", deadline: "10 days",
  },
  {
    id: "q6", urgency: "routine", type: "Compliance",
    title: "QS 2.8.2 evidence gap · 2 min fix",
    chris: "Worker consultation record needs updating. Pulse participation data from last cycle satisfies this requirement. CHRIS can do it now.",
    actionLabel: "Fix now →", href: "/dashboard/compliance",
  },
  {
    id: "q7", urgency: "routine", type: "Practice",
    title: "Wattle Wing practice outcome · Acknowledge",
    chris: "'Protect breaks under pressure' reduced hazard score by 0.08 — above the 0.05 success threshold. Worth reinforcing with the team.",
    actionLabel: "View outcome →", href: "/dashboard/psh",
  },
];

export default function ReviewQueuePage() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const items = QUEUE_ITEMS.filter((i) => !dismissed.has(i.id));
  const immediate = items.filter((i) => i.urgency === "immediate");
  const urgent = items.filter((i) => i.urgency === "urgent");
  const routine = items.filter((i) => i.urgency === "routine");

  function handleDismiss(id: string) {
    setDismissed((prev) => new Set([...prev, id]));
  }

  function renderItem(item: QueueItem) {
    const borderColor = item.urgency === "immediate"
      ? "border-l-[hsl(var(--brand-terracotta))]"
      : item.urgency === "urgent"
        ? "border-l-[hsl(var(--brand-amber))]"
        : "border-l-[hsl(var(--brand-teal))]";

    const bgStyle = item.urgency === "immediate"
      ? { background: "rgba(196,112,74,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }
      : item.urgency === "urgent"
        ? { background: "rgba(212,160,23,0.06)" }
        : undefined;

    return (
      <div key={item.id} className={`rounded-xl p-4 border border-border border-l-4 ${borderColor} mb-3 bg-card`} style={bgStyle}>
        <div className="flex items-start gap-3">
          <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{item.type}</span>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
              </div>
              {item.deadline && <span className="text-[10px] text-muted-foreground font-mono shrink-0 ml-2">{item.deadline}</span>}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{item.chris}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => { handleDismiss(item.id); router.push(item.href); }} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
                {item.actionLabel}
              </button>
              <button onClick={() => handleDismiss(item.id)} className="text-xs text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard")} className="p-1 -ml-1 hover:bg-muted rounded-lg">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Review Queue</p>
            <p className="text-[10px] text-muted-foreground">The Holy Grail Bowral · {items.length} items pending</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">
          <Mic className="w-3.5 h-3.5" /> Ask CHRIS
        </button>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[hsl(150_25%_96%)] flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-[hsl(var(--brand-teal))]" />
          </div>
          <p className="text-base font-semibold text-foreground mb-1">All clear</p>
          <p className="text-sm text-muted-foreground">No items require your attention right now.</p>
        </div>
      )}

      {/* Immediate */}
      {immediate.length > 0 && (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-2 text-[hsl(var(--brand-terracotta))]">
            🔴 Immediate · {immediate.length}
          </p>
          {immediate.map(renderItem)}
        </>
      )}

      {/* Urgent */}
      {urgent.length > 0 && (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-2 mt-4 text-[hsl(var(--brand-amber))]">
            🟡 Urgent · {urgent.length}
          </p>
          {urgent.map(renderItem)}
        </>
      )}

      {/* Routine */}
      {routine.length > 0 && (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-2 mt-4 text-[hsl(var(--brand-teal))]">
            🟢 Routine · {routine.length}
          </p>
          {routine.map(renderItem)}
        </>
      )}

      <div className="mb-16" />
    </div>
  );
}
