"use client";

import { useRouter } from "next/navigation";
import { Heart, AlertTriangle, Shield, FileText, CheckCircle, Users } from "lucide-react";
import { ActionCard } from "@/components/dashboard/ActionCard";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function PSHControlCentre() {
  const router = useRouter();
  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      <PageHeader title="PSH / Workforce Safety" subtitle="The Holy Grail Bowral · ISO 45003" />

      <div className="flex gap-2 mb-4">
        {[
          { label: "Elevated", value: "3 teams", color: "text-[hsl(var(--brand-terracotta))]" },
          { label: "Convergence", value: "1 critical", color: "text-[hsl(var(--brand-terracotta))]" },
          { label: "ISO 45003", value: "Current ✅", color: "text-[hsl(var(--brand-teal))]" },
          { label: "WC Risk", value: "$288K", color: "text-[hsl(var(--brand-amber))]" },
        ].map((m) => (
          <div key={m.label} className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
            <p className={`text-base font-bold ${m.color}`}>{m.value}</p>
            <p className="text-[9px] text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Needs your attention</p>

      <ActionCard urgency="critical" icon={<AlertTriangle className="w-5 h-5 text-[hsl(var(--brand-terracotta))]" />}
        title="Critical convergence — Round Table Wing"
        chris="PSH_01 (High Job Demands) + PSH_08 (Traumatic Exposure) both above critical threshold for 3rd consecutive cycle. Team practices are insufficient. DON-level structural intervention required. Historical WC claim correlation: 68% within 4-6 weeks."
        actionLabel="Escalate to DON →" onAction={() => router.push("/dashboard/coach")} />

      <ActionCard urgency="critical" icon={<Heart className="w-5 h-5 text-[hsl(var(--brand-terracotta))]" />}
        title="Excalibur Wing — 5 domains elevated"
        chris="Highest hazard load in facility. PSH_01, PSH_04, PSH_06, PSH_08, PSH_12 all above threshold. Level 4 practices prescribed for 2 cycles with insufficient improvement. Level 2-3 intervention needed."
        actionLabel="Build advocacy brief →" onAction={() => router.push("/dashboard/coach")} />

      <ActionCard urgency="warning" icon={<Users className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="WC exposure building — $288K estimated"
        chris="PSH_10 (Violence & Aggression) + PSH_08 (Traumatic Exposure) co-elevated 3 cycles. Historically precedes WC claims within 4-6 weeks in 68% of comparable teams. Task rotation is the recommended Level 3 control."
        actionLabel="Prescribe Level 3 control →" onAction={() => router.push("/dashboard/coach")} meta="PREDICTIVE · STRONG" />

      <ActionCard urgency="warning" icon={<Heart className="w-5 h-5 text-[hsl(var(--brand-amber))]" />}
        title="PSH_08 suppressing incident reporting"
        chris="Traumatic Exposure elevated 4 cycles in dementia wing. Incident reporting dropped 34% in same period — consistent with fear-of-reporting suppression. Under-reporting is a SIRS compliance risk. The PSH intervention is the compliance intervention."
        actionLabel="Alert DON + Quality Lead →" onAction={() => router.push("/dashboard/coach")} meta="CAUSAL · STRONG" />

      <ActionCard urgency="info" icon={<FileText className="w-5 h-5 text-[hsl(var(--brand-forest))]" />}
        title="Advocacy brief draft ready"
        chris="Level 2-3 intervention case for Team B. CHRIS has drafted the brief with evidence from 4 cycles of data. Ready for WHS Lead review."
        actionLabel="Review brief →" onAction={() => router.push("/dashboard/coach")} />

      <ActionCard urgency="positive" icon={<CheckCircle className="w-5 h-5 text-[hsl(var(--brand-teal))]" />}
        title="ISO 45003 evidence — all 4 categories current"
        chris="Identification, assessment, controls, and effectiveness review all up to date. Evidence pack exportable for ACQSC audit or SafeWork inspection."
        actionLabel="Export evidence pack →" onAction={() => router.push("/dashboard/coach")} />

      <ActionCard urgency="positive" icon={<Shield className="w-5 h-5 text-[hsl(var(--brand-teal))]" />}
        title="Avalon Kitchen — all domains within range"
        chris="Only team at this facility with zero elevated domains. Pulse participation at 95%. Worth recognising."
        actionLabel="Acknowledge in briefing →" onAction={() => router.push("/dashboard/coach")} />

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2 mt-4">Detail views</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[{ label: "Hazard Heatmap", href: "/dashboard/risk" }, { label: "Convergence Events", href: "/dashboard/risk" }, { label: "Intervention Library", href: "/dashboard/risk" }, { label: "WC Risk Monitor", href: "/dashboard/risk" }].map((f) => (
          <button key={f.label} onClick={() => router.push(f.href)} className="bg-card rounded-lg p-3 border border-border hover:shadow-warm text-left"><p className="text-xs font-semibold text-foreground">{f.label}</p></button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-16">
        {[{ label: "Prescribe practice", icon: "💊" }, { label: "Escalate to DON", icon: "⚡" }, { label: "Export evidence", icon: "📦" }, { label: "Build advocacy brief", icon: "📄" }].map((a) => (
          <button key={a.label} onClick={() => router.push("/dashboard/coach")} className="bg-card rounded-lg px-3 py-2.5 border border-border hover:shadow-warm text-left flex items-center gap-2">
            <span className="text-sm">{a.icon}</span><span className="text-xs font-medium text-foreground">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
