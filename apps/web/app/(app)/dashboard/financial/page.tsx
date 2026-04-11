"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Mic, DollarSign, AlertTriangle, FileText, BarChart2, MoreHorizontal, CheckCircle } from "lucide-react";
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

export default function FinancialControlCentre() {
  const router = useRouter();
  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard")} className="p-1 -ml-1 hover:bg-muted rounded-lg"><ChevronLeft className="w-5 h-5 text-foreground" /></button>
          <div><p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Financial Control Centre</p><p className="text-[10px] text-muted-foreground">Harbison · FY2026 · April</p></div>
        </div>
        <button onClick={() => router.push("/dashboard/coach")} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted"><Mic className="w-3.5 h-3.5" /> Ask CHRIS</button>
      </div>

      <div className="flex gap-2 mb-4">
        {[
          { label: "Revenue", value: "-1.2%", color: "text-[hsl(var(--brand-amber))]" },
          { label: "Care Ratio", value: "53%", color: "text-[hsl(var(--brand-terracotta))]" },
          { label: "Agency", value: "$47K", color: "text-[hsl(var(--brand-terracotta))]" },
          { label: "Budget", value: "-2.1%", color: "text-[hsl(var(--brand-amber))]" },
        ].map((m) => (
          <div key={m.label} className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
            <p className={`text-base font-bold ${m.color}`}>{m.value}</p>
            <p className="text-[9px] text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Needs your attention</p>

      <ActionCard urgency="warning" icon={<DollarSign className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="Care ratio below target — 53% vs 55%"
        chris="Primary driver: agency cost surge following 2 Wing B resignations. CHRIS has identified this as a culture signal, not labour market. Addressing recognition patterns is the most cost-effective response."
        actionLabel="See full analysis →" onAction={() => {}} meta="Financial · Workforce · PSH · CAUSAL · STRONG" />

      <ActionCard urgency="critical" icon={<AlertTriangle className="w-5 h-5 text-[hsl(var(--brand-terracotta))]" />}
        title="Agency cost $47K above budget"
        chris="22% of total workforce cost. Follows 2 RN resignations where PSH_13 (Low Recognition) declined for 4 cycles. The financial exposure is a culture problem presenting as a cost line."
        actionLabel="Reduce agency dependency →" onAction={() => {}} />

      <ActionCard urgency="warning" icon={<AlertTriangle className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="3 residents approaching AN-ACC reassessment"
        chris="Moderate risk of downward reclassification. Estimated revenue impact: $8.2K/month if all reclassify. DON should prioritise clinical review before assessment dates."
        actionLabel="Alert DON →" onAction={() => {}} meta="Est. impact: $8.2K/month" />

      <ActionCard urgency="info" icon={<FileText className="w-5 h-5 text-[hsl(var(--brand-forest))]" />}
        title="QFR Q2 — draft ready"
        chris="CHRIS has compiled QFR data from connectors. Formatted for GPMS. CFO review: 15 min."
        actionLabel="Review QFR →" onAction={() => {}} deadline="14 days" />

      <ActionCard urgency="info" icon={<FileText className="w-5 h-5 text-[hsl(var(--brand-forest))]" />}
        title="ELT finance section — draft ready"
        chris="P&L commentary drafted. Includes agency cost cross-domain context explaining the $47K variance."
        actionLabel="Review draft →" onAction={() => router.push("/dashboard/reporting")} />

      <ActionCard urgency="positive" icon={<CheckCircle className="w-5 h-5 text-[hsl(var(--brand-teal))]" />}
        title="Administration underspend — $12K"
        chris="Admin costs $12K below budget. Partially offsets agency overspend. Worth noting in Board commentary."
        actionLabel="Add to Board pack →" onAction={() => {}} />

      <div className="bg-card rounded-xl p-4 shadow-warm border border-border mb-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-teal)/0.1)] text-[hsl(var(--brand-teal))]">EXONERATING</span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dashed border-[hsl(var(--brand-amber))] text-muted-foreground">STRONG</span>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Care ratio decline — acuity explanation</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">Care ratio dropped from 56% to 53% this quarter. 9 residents admitted at lower AN-ACC classification than expected. The ratio decline reflects appropriate clinical response to acuity, not cost inefficiency. Worth noting in Board financial commentary.</p>
        <div className="flex items-center gap-2">
          <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Add context to Board pack →</button>
          <button className="text-[11px] text-muted-foreground hover:text-foreground">Not relevant</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-16">
        {[{ label: "Draft P&L commentary", icon: "📝" }, { label: "Check QFR status", icon: "📊" }, { label: "AN-ACC risk review", icon: "💰" }, { label: "Budget variance detail", icon: "📉" }].map((a) => (
          <button key={a.label} onClick={() => router.push("/dashboard/coach")} className="bg-card rounded-lg px-3 py-2.5 border border-border hover:shadow-warm text-left flex items-center gap-2">
            <span className="text-sm">{a.icon}</span><span className="text-xs font-medium text-foreground">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
