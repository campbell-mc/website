"use client";
import { useMobile } from "@/lib/hooks/useMobile";
import { MobileDomainScreen } from "@/components/mobile/MobileDomainScreen";

import { useRouter } from "next/navigation";
import { Users, FileText, Bell, Sparkles, CheckCircle, Clipboard, MessageSquare } from "lucide-react";
import { ActionCard } from "@/components/dashboard/ActionCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SituationReport } from "@/components/chris/SituationReport";
import { operationsReport } from "@/lib/chris/situation-reports";
import { AgentPulse } from "@/components/chris/AgentPulse";

export default function OperationsControlCentre() {
  const mobile = useMobile();
  if (mobile) return <MobileDomainScreen domain="operations" />;

  const router = useRouter();
  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      <PageHeader title="Operations Control Centre" subtitle="Mt Gib Gardens Bowral · Day shift" />

      <div className="flex gap-2 mb-4">
        {[
          { label: "Roster", value: "2 gaps", color: "text-[hsl(var(--brand-amber))]" },
          { label: "Handovers", value: "3", color: "text-[hsl(var(--brand-teal))]" },
          { label: "Incidents", value: "0 today", color: "text-[hsl(var(--brand-teal))]" },
          { label: "Queue", value: "4 items", color: "text-[hsl(var(--brand-amber))]" },
        ].map((m) => (
          <div key={m.label} className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
            <p className={`text-base font-bold ${m.color}`}>{m.value}</p>
            <p className="text-[9px] text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      <AgentPulse domain="operations" />
      <SituationReport domain="operations" narrative={operationsReport.narrative} refreshedAt={operationsReport.refreshedAt} context={operationsReport.context} signals={operationsReport.signals} />

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Needs your attention</p>

      <ActionCard urgency="warning" icon={<Users className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="RN shift unfilled tonight"
        chris="Tonight's evening RN shift has no cover. Care minutes will breach if not resolved. CHRIS can generate the agency shift brief now."
        actionLabel="Find agency cover →" onAction={() => router.push("/dashboard/care-minutes")} />

      <ActionCard urgency="info" icon={<Sparkles className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="Today's Briefing · Unread"
        chris="3 signals this week. Practice attached. 8 minutes to read. 3 actions for this week."
        actionLabel="Read briefing →" onAction={() => router.push("/dashboard/briefing")} />

      <ActionCard urgency="info" icon={<Bell className="w-5 h-5 text-[hsl(var(--brand-forest))]" />}
        title="Review Queue · 4 items"
        chris="1 immediate (SIRS). 2 urgent. 1 routine. Estimated 15 min to clear."
        actionLabel="Open queue →" onAction={() => router.push("/don/queue")} />

      <ActionCard urgency="info" icon={<Clipboard className="w-5 h-5 text-[hsl(var(--brand-forest))]" />}
        title="Huddle agenda · Not confirmed"
        chris="3 pre-written questions based on this week's data. Copy to clipboard or run the huddle with CHRIS by voice."
        actionLabel="View agenda →" onAction={() => router.push("/dashboard/coach")} />

      <ActionCard urgency="info" icon={<MessageSquare className="w-5 h-5 text-[hsl(var(--brand-forest))]" />}
        title="Family follow-up flagged"
        chris="1 family communication follow-up outstanding from Tuesday's incident. CHRIS has drafted a response."
        actionLabel="Review draft →" onAction={() => router.push("/dashboard/coach")} />

      <ActionCard urgency="positive" icon={<CheckCircle className="w-5 h-5 text-[hsl(var(--brand-teal))]" />}
        title="Handover notes captured"
        chris="3 voice handover notes captured via CHRIS Coach today. All confirmed by staff."
        actionLabel="View notes →" onAction={() => router.push("/dashboard/coach")} />

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2 mt-4">Quick actions</p>
      <div className="grid grid-cols-2 gap-2 mb-16">
        {[{ label: "+ Report incident", icon: "📋" }, { label: "+ Handover note", icon: "📝" }, { label: "Find agency cover", icon: "👤" }, { label: "Run CHRIS huddle 🎤", icon: "🎙" }].map((a) => (
          <button key={a.label} onClick={() => router.push("/dashboard/coach")} className="bg-card rounded-lg px-3 py-2.5 border border-border hover:shadow-warm text-left flex items-center gap-2">
            <span className="text-sm">{a.icon}</span><span className="text-xs font-medium text-foreground">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
