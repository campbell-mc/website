"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Mic, FileText, AlertTriangle, MessageSquare, MoreHorizontal, CheckCircle, Sparkles } from "lucide-react";
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

const FACILITIES = [
  { name: "Harbison — Burradoo", status: "warn" as const, summary: "Care min at risk · 1 SIRS · PSH convergence", signals: 3 },
  { name: "Harbison — Moss Vale", status: "ok" as const, summary: "All clear · Pulse participation improving", signals: 0 },
];

export default function PortfolioDashboard() {
  const router = useRouter();
  const [expandedFacility, setExpandedFacility] = useState<string | null>(null);

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard")} className="p-1 -ml-1 hover:bg-muted rounded-lg"><ChevronLeft className="w-5 h-5 text-foreground" /></button>
          <div><p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Portfolio Command</p><p className="text-[10px] text-muted-foreground">Harbison · 2 facilities</p></div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted"><Mic className="w-3.5 h-3.5" /> Ask CHRIS</button>
      </div>

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Needs your attention</p>

      <ActionCard urgency="info" icon={<FileText className="w-5 h-5 text-[hsl(var(--brand-forest))]" />}
        title="Q1 Board Pack — ready for your approval"
        chris="CHRIS has drafted all 8 sections. Meeting in 8 days. Estimated review: 35 minutes. 3 decisions need your framing."
        actionLabel="Start review →" onAction={() => router.push("/dashboard/reporting")} deadline="8 days" />

      <ActionCard urgency="critical" icon={<AlertTriangle className="w-5 h-5 text-[hsl(var(--brand-terracotta))]" />}
        title="Facility C: three-domain reinforcing loop"
        chris="Falls rate, agency dependency, and traumatic exposure are co-elevated and reinforcing. Agency instability reduces care consistency → increasing fall risk → increasing traumatic exposure → driving turnover. Breaking the loop at workforce stability is the highest-leverage intervention."
        actionLabel="Add to ELT agenda →" onAction={() => {}} meta="Clinical · Workforce · PSH · AMPLIFYING · STRONG" />

      <ActionCard urgency="warning" icon={<Sparkles className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="Harbison Bowral: turnover risk building"
        chris="PSH_02 + PSH_16 co-elevated for 3 cycles in Wing B. Historically precedes voluntary turnover within 2-4 cycles in 71% of comparable teams. No turnover yet — intervention window is open."
        actionLabel="Share with HR →" onAction={() => {}} meta="Workforce · PSH · PREDICTIVE · EMERGING" />

      <ActionCard urgency="info" icon={<FileText className="w-5 h-5 text-[hsl(var(--brand-forest))]" />}
        title="ELT Pack — draft ready"
        chris="April ELT pack complete. Cross-domain intelligence section includes 3 signals. CEO review before distribution to ELT."
        actionLabel="Review ELT pack →" onAction={() => router.push("/dashboard/reporting")} />

      {/* Facility cards */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2 mt-4">Facilities</p>
      {FACILITIES.map((f) => (
        <div key={f.name} className="bg-card rounded-xl border border-border shadow-warm-sm mb-2 overflow-hidden">
          <button onClick={() => setExpandedFacility(expandedFacility === f.name ? null : f.name)} className="w-full px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${f.status === "ok" ? "bg-[hsl(var(--brand-teal))]" : "bg-[hsl(var(--brand-amber))]"}`} />
              <span className="text-sm font-medium text-foreground">{f.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {f.signals > 0 && <span className="text-[10px] text-muted-foreground">{f.signals} signals</span>}
              <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expandedFacility === f.name ? "rotate-90" : ""}`} />
            </div>
          </button>
          {expandedFacility === f.name && (
            <div className="px-4 pb-3 border-t border-border pt-2">
              <p className="text-xs text-muted-foreground mb-2">{f.summary}</p>
              <div className="flex gap-2">
                <button className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Open facility →</button>
                <button className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">
                  <MessageSquare className="w-3 h-3 inline mr-1" />Message DON
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2 mt-4">On track</p>
      <div className="flex gap-2 mb-4">
        {[
          { label: "Care min", value: "100%", ok: true },
          { label: "SIRS Cat 1", value: "0", ok: true },
          { label: "Compliance", value: "87", ok: true },
        ].map((m) => (
          <div key={m.label} className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
            <p className="text-base font-bold text-[hsl(var(--brand-teal))]">{m.value}</p>
            <p className="text-[9px] text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-16">
        {[{ label: "Message DON", icon: "💬" }, { label: "ELT agenda item +", icon: "📋" }, { label: "Board notification", icon: "📢" }, { label: "View all approvals", icon: "✅" }].map((a) => (
          <button key={a.label} className="bg-card rounded-lg px-3 py-2.5 border border-border hover:shadow-warm text-left flex items-center gap-2">
            <span className="text-sm">{a.icon}</span><span className="text-xs font-medium text-foreground">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
