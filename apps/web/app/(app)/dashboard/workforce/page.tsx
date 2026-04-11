"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Mic, Users, Heart, GraduationCap, BarChart2, AlertTriangle, MoreHorizontal, CheckCircle } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

function ActionCard({ urgency, icon, title, chris, actionLabel, onAction, meta }: {
  urgency: "critical" | "warning" | "info" | "positive"; icon: React.ReactNode; title: string;
  chris: string; actionLabel: string; onAction: () => void; meta?: string;
}) {
  const styles = { critical: { border: "border-l-[hsl(var(--brand-terracotta))]", bg: "rgba(196,112,74,0.06)", shadow: "0 4px 24px rgba(0,0,0,0.10)" }, warning: { border: "border-l-[hsl(var(--brand-amber))]", bg: "rgba(212,160,23,0.06)", shadow: "0 4px 24px rgba(0,0,0,0.10)" }, info: { border: "border-l-[hsl(var(--brand-forest))]", bg: "transparent", shadow: "" }, positive: { border: "border-l-[hsl(var(--brand-teal))]", bg: "transparent", shadow: "" } }[urgency]; const border = styles.border;
  return (
    <div className={`rounded-xl p-4 border border-border border-l-4 ${border} mb-3`} style={{ background: styles.bg || "var(--color-card)", boxShadow: styles.shadow || "" }}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
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

export default function WorkforceControlCentre() {
  const router = useRouter();
  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard")} className="p-1 -ml-1 hover:bg-muted rounded-lg"><ChevronLeft className="w-5 h-5 text-foreground" /></button>
          <div><p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Workforce Control Centre</p><p className="text-[10px] text-muted-foreground">Harbison Bowral</p></div>
        </div>
        <button onClick={() => router.push("/dashboard/coach")} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted"><Mic className="w-3.5 h-3.5" /> Ask CHRIS</button>
      </div>

      <div className="flex gap-2 mb-4">
        {[
          { label: "Turnover", value: "28%", color: "text-[hsl(var(--brand-amber))]" },
          { label: "Agency", value: "14%", color: "text-[hsl(var(--brand-teal))]" },
          { label: "Absentee", value: "7.2%", color: "text-[hsl(var(--brand-amber))]" },
          { label: "Training", value: "91%", color: "text-[hsl(var(--brand-teal))]" },
        ].map((m) => (
          <div key={m.label} className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
            <p className={`text-base font-bold ${m.color}`}>{m.value}</p>
            <p className="text-[9px] text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Needs your attention</p>

      <ActionCard urgency="warning" icon={<AlertTriangle className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="6 AHPRA registrations expiring in 3 weeks"
        chris="If not renewed, care minutes at risk — 6 RN shifts per week become non-compliant for rostering. Send reminders now or alert DON."
        actionLabel="Send reminders →" onAction={() => {}} />

      <ActionCard urgency="warning" icon={<Users className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="AIN turnover 34% — 8 points above sector"
        chris="Teams with highest churn show PSH_13 + PSH_02 declining 4+ cycles before exits. This is a culture problem. Targeted recognition practices in highest-churn teams are the highest-ROI intervention."
        actionLabel="Identify at-risk teams →" onAction={() => {}} meta="Workforce · PSH · CAUSAL · STRONG" />

      <ActionCard urgency="warning" icon={<Heart className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="PSH convergence — Cottage Team critical"
        chris="PSH_01 + PSH_12 co-elevated 3 cycles. Team practices are insufficient. DON-level structural intervention recommended."
        actionLabel="View PSH dashboard →" onAction={() => router.push("/dashboard/psh")} />

      <ActionCard urgency="info" icon={<GraduationCap className="w-5 h-5 text-[hsl(var(--brand-forest))]" />}
        title="Leader Loop — 3 leaders not started"
        chris="8 of 14 leaders are active. 3 haven't started their first cycle. Automated reminder available."
        actionLabel="Send chase →" onAction={() => {}} />

      <ActionCard urgency="positive" icon={<CheckCircle className="w-5 h-5 text-[hsl(var(--brand-teal))]" />}
        title="Agency dependency below target"
        chris="14% vs 15% target. Stable trend. Worth acknowledging at the next ELT meeting."
        actionLabel="Add to ELT pack →" onAction={() => {}} />

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2 mt-4">Detail views</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { label: "PSH Dashboard", href: "/dashboard/psh" }, { label: "Training", href: "/dashboard/training" },
          { label: "Leader Loop", href: "/dashboard/journey" }, { label: "Turnover Analysis", href: "/dashboard/workforce" },
        ].map((f) => (
          <button key={f.label} onClick={() => router.push(f.href)} className="bg-card rounded-lg p-3 border border-border hover:shadow-warm text-left">
            <p className="text-xs font-semibold text-foreground">{f.label}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-16">
        {[{ label: "Send training reminder", icon: "📧" }, { label: "Check credentials", icon: "🪪" }, { label: "Alert DON", icon: "⚡" }, { label: "View agency cost", icon: "💰" }].map((a) => (
          <button key={a.label} onClick={() => router.push("/dashboard/coach")} className="bg-card rounded-lg px-3 py-2.5 border border-border hover:shadow-warm text-left flex items-center gap-2">
            <span className="text-sm">{a.icon}</span><span className="text-xs font-medium text-foreground">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
