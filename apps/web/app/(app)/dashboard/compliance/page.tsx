"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Mic, Shield, FileText, Calendar, CheckCircle, AlertTriangle, MoreHorizontal } from "lucide-react";
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

export default function GovernanceControlCentre() {
  const router = useRouter();
  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard")} className="p-1 -ml-1 hover:bg-muted rounded-lg"><ChevronLeft className="w-5 h-5 text-foreground" /></button>
          <div><p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Governance Control Centre</p><p className="text-[10px] text-muted-foreground">Harbison Bowral</p></div>
        </div>
        <button onClick={() => router.push("/dashboard/coach")} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted"><Mic className="w-3.5 h-3.5" /> Ask CHRIS</button>
      </div>

      <div className="flex gap-2 mb-4">
        {[
          { label: "Compliance", value: "78", color: "text-[hsl(var(--brand-amber))]" },
          { label: "Packs", value: "2", color: "text-[hsl(var(--brand-amber))]" },
          { label: "Corrective", value: "2 overdue", color: "text-[hsl(var(--brand-terracotta))]" },
          { label: "GPMS", value: "QI due", color: "text-[hsl(var(--brand-teal))]" },
        ].map((m) => (
          <div key={m.label} className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
            <p className={`text-base font-bold ${m.color}`}>{m.value}</p>
            <p className="text-[9px] text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Needs your attention</p>

      <ActionCard urgency="warning" icon={<Shield className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="QS 2.8.2 — evidence gap"
        chris="Worker consultation record needs updating. Pulse participation data from last cycle satisfies this. Takes 2 minutes."
        actionLabel="Fix now — 2 min →" onAction={() => {}} />

      <ActionCard urgency="warning" icon={<AlertTriangle className="w-5 h-5 text-[hsl(var(--brand-terracotta))]" />}
        title="2 corrective actions overdue"
        chris="Medication audit non-conformance (5 days overdue) and SIRS corrective action (3 days overdue). Both assigned to Quality Lead."
        actionLabel="Review overdue items →" onAction={() => {}} />

      <ActionCard urgency="info" icon={<FileText className="w-5 h-5 text-[hsl(var(--brand-forest))]" />}
        title="Board Pack — needs CEO approval"
        chris="CHRIS draft ready. 8 sections. Est. 35 min review. Meeting in 8 days. 3 decisions need framing."
        actionLabel="Start review →" onAction={() => router.push("/dashboard/reporting")} deadline="8 days" />

      <ActionCard urgency="info" icon={<FileText className="w-5 h-5 text-[hsl(var(--brand-forest))]" />}
        title="Clinical Governance Pack — ready for review"
        chris="CHRIS draft complete. 6 sections. Care minutes, QI, SIRS, audits, corrective actions. Est. 25 min."
        actionLabel="Start review →" onAction={() => router.push("/dashboard/reporting")} deadline="10 days" />

      <ActionCard urgency="info" icon={<Calendar className="w-5 h-5 text-[hsl(var(--brand-forest))]" />}
        title="QI submission — due 28 Apr"
        chris="CHRIS has compiled all 14 QIs for the quarter. Data formatted for GPMS. 15 min review."
        actionLabel="Review submission →" onAction={() => router.push("/dashboard/quality")} deadline="14 days" />

      <ActionCard urgency="positive" icon={<CheckCircle className="w-5 h-5 text-[hsl(var(--brand-teal))]" />}
        title="ISO 45003 evidence — all current"
        chris="All 4 evidence categories up to date. Evidence pack exportable for audit."
        actionLabel="Export pack →" onAction={() => {}} />

      <div className="bg-card rounded-xl p-4 shadow-warm border border-border mb-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]">AMPLIFYING</span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dashed border-[hsl(var(--brand-amber))] text-muted-foreground">EMERGING</span>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Corrective action completion rate dropping — workload signal</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">Overdue rate risen from 12% to 31% over 3 months. PSH_01 elevated for Quality Lead and DON. Driver may be capacity, not intent.</p>
        <div className="flex items-center gap-2">
          <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Redistribute workload →</button>
          <button className="text-[11px] text-muted-foreground hover:text-foreground">Not relevant</button>
        </div>
      </div>

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2 mt-4">Detail views</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[{ label: "Compliance Register", href: "/dashboard/compliance" }, { label: "Reporting Cycles", href: "/dashboard/reporting" }, { label: "Corrective Actions", href: "/dashboard/compliance" }, { label: "Risk Register", href: "/dashboard/compliance" }].map((f) => (
          <button key={f.label} onClick={() => router.push(f.href)} className="bg-card rounded-lg p-3 border border-border hover:shadow-warm text-left"><p className="text-xs font-semibold text-foreground">{f.label}</p></button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-16">
        {[{ label: "Fix compliance gap", icon: "🔧" }, { label: "Export evidence pack", icon: "📦" }, { label: "Start pack review", icon: "📋" }, { label: "View risk register", icon: "⚠️" }].map((a) => (
          <button key={a.label} className="bg-card rounded-lg px-3 py-2.5 border border-border hover:shadow-warm text-left flex items-center gap-2">
            <span className="text-sm">{a.icon}</span><span className="text-xs font-medium text-foreground">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
