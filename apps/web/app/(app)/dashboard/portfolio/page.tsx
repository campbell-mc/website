"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, FileText, AlertTriangle, MessageSquare, Sparkles } from "lucide-react";
import { ActionCard } from "@/components/dashboard/ActionCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { facility, governance_packs, workforce_monthly, financial_monthly, compliance_obligations } from "@/lib/seed-data";
import { ALL_FACILITIES, portfolio_summary } from "@/lib/seed-facilities";

const FACILITIES = ALL_FACILITIES.map((f) => ({
  name: f.name,
  type: f.type === "residential" ? `Residential · ${f.beds} beds` : `Home Care · ${f.packages} packages`,
  status: f.status === "critical" ? "warn" as const : f.status as "ok" | "warn",
  summary: f.summary,
  signals: f.signals,
}));

export default function PortfolioDashboard() {
  const router = useRouter();
  const [expandedFacility, setExpandedFacility] = useState<string | null>(null);

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      <PageHeader title="Portfolio Command" subtitle={`${facility.provider_name} · 4 residential · 2 home care · 365 beds · 84 HCP`} />

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Needs your attention</p>

      <ActionCard urgency="info" icon={<FileText className="w-5 h-5 text-[hsl(var(--brand-forest))]" />}
        title="Q1 Board Pack — ready for your approval"
        chris="CHRIS has drafted all 8 sections. Meeting in 8 days. Estimated review: 35 minutes. 3 decisions need your framing."
        actionLabel="Start review →" onAction={() => router.push("/dashboard/reporting")} deadline="8 days" />

      <ActionCard urgency="critical" icon={<AlertTriangle className="w-5 h-5 text-[hsl(var(--brand-terracotta))]" />}
        title="Facility C: three-domain reinforcing loop"
        chris="Falls rate, agency dependency, and traumatic exposure are co-elevated and reinforcing. Agency instability reduces care consistency → increasing fall risk → increasing traumatic exposure → driving turnover. Breaking the loop at workforce stability is the highest-leverage intervention."
        actionLabel="Add to ELT agenda →" onAction={() => router.push("/dashboard/coach")} meta="Clinical · Workforce · PSH · AMPLIFYING · STRONG" />

      <ActionCard urgency="warning" icon={<Sparkles className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="The Holy Grail Bowral: turnover risk building"
        chris="PSH_02 + PSH_16 co-elevated for 3 cycles in Wing B. Historically precedes voluntary turnover within 2-4 cycles in 71% of comparable teams. No turnover yet — intervention window is open."
        actionLabel="Share with HR →" onAction={() => router.push("/dashboard/coach")} meta="Workforce · PSH · PREDICTIVE · EMERGING" />

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
          { label: "Compliance", value: `${compliance_obligations.filter((o) => o.status === "compliant").length}/${compliance_obligations.length}`, ok: true },
        ].map((m) => (
          <div key={m.label} className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
            <p className="text-base font-bold text-[hsl(var(--brand-teal))]">{m.value}</p>
            <p className="text-[9px] text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-16">
        {[{ label: "Message DON", icon: "💬" }, { label: "ELT agenda item +", icon: "📋" }, { label: "Board notification", icon: "📢" }, { label: "View all approvals", icon: "✅" }].map((a) => (
          <button key={a.label} onClick={() => router.push("/dashboard/coach")} className="bg-card rounded-lg px-3 py-2.5 border border-border hover:shadow-warm text-left flex items-center gap-2">
            <span className="text-sm">{a.icon}</span><span className="text-xs font-medium text-foreground">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
