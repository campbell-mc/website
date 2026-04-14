"use client";
import { useMobile } from "@/lib/hooks/useMobile";
import { MobileDomainScreen } from "@/components/mobile/MobileDomainScreen";

import { useRouter } from "next/navigation";
import { Shield, FileText, Calendar, CheckCircle, AlertTriangle } from "lucide-react";
import { SituationReport } from "@/components/chris/SituationReport";
import { governanceReport } from "@/lib/chris/situation-reports";
import { AgentPulse } from "@/components/chris/AgentPulse";
import { ActionCard } from "@/components/dashboard/ActionCard";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function GovernanceControlCentre() {
  const mobile = useMobile();
  if (mobile) return <MobileDomainScreen domain="governance" />;

  const router = useRouter();
  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      <PageHeader title="Governance Control Centre" subtitle="The Holy Grail Bowral" />

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

      <AgentPulse domain="governance" />
      <SituationReport domain="governance" narrative={governanceReport.narrative} refreshedAt={governanceReport.refreshedAt} context={governanceReport.context} signals={governanceReport.signals} />

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Needs your attention</p>

      <ActionCard urgency="warning" icon={<Shield className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="QS 2.8.2 — evidence gap"
        chris="Worker consultation record needs updating. Pulse participation data from last cycle satisfies this. Takes 2 minutes."
        actionLabel="Fix now — 2 min →" onAction={() => router.push("/dashboard/coach")} />

      <ActionCard urgency="warning" icon={<AlertTriangle className="w-5 h-5 text-[hsl(var(--brand-terracotta))]" />}
        title="2 corrective actions overdue"
        chris="Medication audit non-conformance (5 days overdue) and SIRS corrective action (3 days overdue). Both assigned to Quality Lead."
        actionLabel="Review overdue items →" onAction={() => router.push("/dashboard/corrective-actions")} />

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
        actionLabel="Export pack →" onAction={() => router.push("/dashboard/workforce/psh/iso45003")} />

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
          <button key={a.label} onClick={() => router.push("/dashboard/coach")} className="bg-card rounded-lg px-3 py-2.5 border border-border hover:shadow-warm text-left flex items-center gap-2">
            <span className="text-sm">{a.icon}</span><span className="text-xs font-medium text-foreground">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
