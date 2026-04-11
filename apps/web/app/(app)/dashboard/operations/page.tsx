"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Mic, Users, FileText, Bell, Sparkles, MoreHorizontal, CheckCircle, Clipboard, MessageSquare } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

function ActionCard({ urgency, icon, title, chris, actionLabel, onAction, deadline, meta }: {
  urgency: "critical" | "warning" | "info" | "positive"; icon: React.ReactNode; title: string;
  chris: string; actionLabel: string; onAction: () => void; deadline?: string; meta?: string;
}) {
  const styles = { critical: { border: "border-l-[hsl(var(--brand-terracotta))]", bg: "rgba(196,112,74,0.06)", shadow: "0 4px 24px rgba(0,0,0,0.10)" }, warning: { border: "border-l-[hsl(var(--brand-amber))]", bg: "rgba(212,160,23,0.06)", shadow: "0 4px 24px rgba(0,0,0,0.10)" }, info: { border: "border-l-[hsl(var(--brand-forest))]", bg: "transparent", shadow: "" }, positive: { border: "border-l-[hsl(var(--brand-teal))]", bg: "transparent", shadow: "" } }[urgency]; const border = styles.border;
  return (
    <div className={`rounded-xl p-4 border border-border border-l-4 ${border} mb-3`} style={{ background: styles.bg || "var(--color-card)", boxShadow: styles.shadow || "" }}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            {deadline && <span className="text-[10px] text-muted-foreground font-mono shrink-0">{deadline}</span>}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2">{chris}</p>
          {meta && <p className="text-[10px] text-muted-foreground/60 mb-2">{meta}</p>}
          <div className="flex items-center gap-2">
            <button onClick={onAction} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">{actionLabel}</button>
            <button className="text-xs text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OperationsControlCentre() {
  const router = useRouter();
  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard")} className="p-1 -ml-1 hover:bg-muted rounded-lg"><ChevronLeft className="w-5 h-5 text-foreground" /></button>
          <div><p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Operations Control Centre</p><p className="text-[10px] text-muted-foreground">Harbison Bowral · Day shift</p></div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted"><Mic className="w-3.5 h-3.5" /> Ask CHRIS</button>
      </div>

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
        actionLabel="View agenda →" onAction={() => {}} />

      <ActionCard urgency="info" icon={<MessageSquare className="w-5 h-5 text-[hsl(var(--brand-forest))]" />}
        title="Family follow-up flagged"
        chris="1 family communication follow-up outstanding from Tuesday's incident. CHRIS has drafted a response."
        actionLabel="Review draft →" onAction={() => {}} />

      <ActionCard urgency="positive" icon={<CheckCircle className="w-5 h-5 text-[hsl(var(--brand-teal))]" />}
        title="Handover notes captured"
        chris="3 voice handover notes captured via CHRIS Coach today. All confirmed by staff."
        actionLabel="View notes →" onAction={() => router.push("/dashboard/coach")} />

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2 mt-4">Quick actions</p>
      <div className="grid grid-cols-2 gap-2 mb-16">
        {[{ label: "+ Report incident", icon: "📋" }, { label: "+ Handover note", icon: "📝" }, { label: "Find agency cover", icon: "👤" }, { label: "Run CHRIS huddle 🎤", icon: "🎙" }].map((a) => (
          <button key={a.label} className="bg-card rounded-lg px-3 py-2.5 border border-border hover:shadow-warm text-left flex items-center gap-2">
            <span className="text-sm">{a.icon}</span><span className="text-xs font-medium text-foreground">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
