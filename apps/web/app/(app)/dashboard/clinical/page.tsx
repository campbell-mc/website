"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Mic, AlertTriangle, Activity, BarChart2, Shield, CheckCircle, FileText, MoreHorizontal, Sparkles } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

// ============================================================================
// CLINICAL CONTROL CENTRE
// Actions front and centre. Sub-features are navigation, not where you act.
// ============================================================================

function ActionCard({ urgency, icon, title, chris, actionLabel, onAction, deadline, meta }: {
  urgency: "critical" | "warning" | "info" | "positive";
  icon: React.ReactNode; title: string; chris: string; actionLabel: string;
  onAction: () => void; deadline?: string; meta?: string;
}) {
  const styles = {
    critical: { border: "border-l-[hsl(var(--brand-terracotta))]", bg: "rgba(196,112,74,0.06)", shadow: "0 4px 24px rgba(0,0,0,0.10)" },
    warning: { border: "border-l-[hsl(var(--brand-amber))]", bg: "rgba(212,160,23,0.06)", shadow: "0 4px 24px rgba(0,0,0,0.10)" },
    info: { border: "border-l-[hsl(var(--brand-forest))]", bg: "", shadow: "" },
    positive: { border: "border-l-[hsl(var(--brand-teal))]", bg: "", shadow: "" },
  }[urgency];

  return (
    <div className={`rounded-xl p-4 border border-border border-l-4 ${styles.border} mb-3`} style={{ background: styles.bg || "hsl(var(--card))", boxShadow: styles.shadow || undefined }}>
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
            <button onClick={onAction} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
              {actionLabel}
            </button>
            <button className="text-xs text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClinicalControlCentre() {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard")} className="p-1 -ml-1 hover:bg-muted rounded-lg">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Clinical Control Centre</p>
            <p className="text-[10px] text-muted-foreground">Harbison Bowral</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">
          <Mic className="w-3.5 h-3.5" /> Ask CHRIS
        </button>
      </div>

      {/* Live status strip */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {[
          { label: "Care Min", value: "186", sub: "/200", color: "text-[hsl(var(--brand-terracotta))]" },
          { label: "RN", value: "37", sub: "/40", color: "text-[hsl(var(--brand-amber))]" },
          { label: "SIRS", value: "1 Cat 1", sub: "6h left", color: "text-[hsl(var(--brand-terracotta))]" },
          { label: "QI", value: "84%", sub: "vs 85%", color: "text-[hsl(var(--brand-amber))]" },
          { label: "Audits", value: "1 due", sub: "overdue", color: "text-[hsl(var(--brand-terracotta))]" },
        ].map((m) => (
          <div key={m.label} className="bg-card rounded-lg px-3 py-2 border border-border min-w-[75px] text-center flex-1">
            <p className={`text-base font-bold ${m.color}`}>{m.value}</p>
            <p className="text-[8px] text-muted-foreground">{m.label} {m.sub}</p>
          </div>
        ))}
      </div>

      {/* === ALL CLINICAL ACTIONS — front and centre === */}

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Needs your attention</p>

      <ActionCard
        urgency="critical"
        icon={<AlertTriangle className="w-5 h-5 text-[hsl(var(--brand-terracotta))]" />}
        title="SIRS Cat 1 · Submit by 2:23pm"
        chris="Unexpected fall – Wing B. CHRIS draft ready. Add resident details and submit to ACQSC. Penalty risk: $783K per contravention."
        actionLabel="Review draft →"
        onAction={() => router.push("/dashboard/sirs")}
        deadline="6h 14m"
      />

      <ActionCard
        urgency="warning"
        icon={<Activity className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="Care minutes breach · RN gap tonight"
        chris="You're 14 minutes short. Tonight's RN shift is unfilled — that's the gap. CHRIS can generate the agency shift brief now."
        actionLabel="Find agency cover →"
        onAction={() => router.push("/dashboard/care-minutes")}
        meta="186 actual · 200 target · RN: 37/40 · Day 3 at risk"
      />

      <ActionCard
        urgency="warning"
        icon={<Shield className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="Medication audit · 3 days overdue"
        chris="CHRIS can guide you through it now by voice. 45 min. Non-conformances queue automatically to corrective actions."
        actionLabel="Start audit now →"
        onAction={() => router.push("/dashboard/audits")}
      />

      <ActionCard
        urgency="warning"
        icon={<BarChart2 className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="QI_03 Falls · 3rd consecutive quarter trending up"
        chris="Allied health hours dropped 18% in the period. Physio assessment completion rate may be contributing. CHRIS has prepared a QI analysis."
        actionLabel="Review QI analysis →"
        onAction={() => router.push("/dashboard/quality")}
        meta="8.2 per 100 residents · benchmark: 7.8"
      />

      <ActionCard
        urgency="info"
        icon={<FileText className="w-5 h-5 text-[hsl(var(--brand-forest))]" />}
        title="Clinical Governance Pack · Ready for review"
        chris="CHRIS draft complete. 6 sections. Care minutes, QI snapshot, SIRS, audits, corrective actions, PSH summary. Est. 25 min."
        actionLabel="Start review →"
        onAction={() => router.push("/dashboard/reporting")}
        deadline="10 days"
      />

      {/* CHRIS cross-domain insight */}
      <div className="bg-card rounded-xl p-4 shadow-warm border border-border mb-4">
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]">CAUSAL</span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dashed border-[hsl(var(--brand-amber))] text-muted-foreground">STRONG</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Clinical</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Workforce</span>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Medication incidents linked to agency coverage rate</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">3 incidents in 14 days. All on shifts with &gt;35% agency coverage. Permanent staff shifts: zero incidents. This is an onboarding gap, not a process failure.</p>
        <div className="flex items-center gap-2">
          <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Act</button>
          <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted">Monitor</button>
          <button className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground ml-auto">Not relevant</button>
        </div>
      </div>

      {/* Positive signal */}
      <ActionCard
        urgency="positive"
        icon={<CheckCircle className="w-5 h-5 text-[hsl(var(--brand-teal))]" />}
        title="QI_06 COVID infections · Zero this quarter"
        chris="Infection control protocols are working. Worth acknowledging in the next clinical governance meeting."
        actionLabel="Add to governance pack →"
        onAction={() => router.push("/dashboard/quality")}
      />

      {/* Navigate to detail views */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2 mt-6">Detail views</p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
        {[
          { label: "Care Minutes", summary: "Today + week + month", href: "/dashboard/care-minutes" },
          { label: "Quality Indicators", summary: "All 14 QIs", href: "/dashboard/quality" },
          { label: "SIRS Register", summary: "Open + closed + trends", href: "/dashboard/sirs" },
          { label: "Clinical Audits", summary: "Status + schedule", href: "/dashboard/audits" },
          { label: "Corrective Actions", summary: "Clinical source", href: "/dashboard/compliance" },
          { label: "Clinical Risk", summary: "Risk register", href: "/dashboard/quality" },
        ].map((f) => (
          <button key={f.label} onClick={() => router.push(f.href)} className="bg-card rounded-lg p-3 border border-border hover:shadow-warm transition-shadow text-left">
            <p className="text-xs font-semibold text-foreground">{f.label}</p>
            <p className="text-[10px] text-muted-foreground">{f.summary}</p>
          </button>
        ))}
      </div>

      {/* Quick actions */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Quick actions</p>
      <div className="grid grid-cols-2 gap-2 mb-16">
        {[
          { label: "+ Report incident", icon: "📋" },
          { label: "Start audit", icon: "✅" },
          { label: "Check SIRS deadlines", icon: "⏱" },
          { label: "View care minutes week", icon: "����" },
        ].map((a) => (
          <button key={a.label} className="bg-card rounded-lg px-3 py-2.5 shadow-warm-sm border border-border hover:shadow-warm transition-shadow text-left flex items-center gap-2">
            <span className="text-sm">{a.icon}</span>
            <span className="text-xs font-medium text-foreground">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
