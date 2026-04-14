"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, AlertTriangle, DollarSign, TrendingDown, Clock, Phone } from "lucide-react";
import { holy_grail_home_care } from "@/lib/seed-data";

const combined = holy_grail_home_care.combined;
const metrics = combined.metrics;

interface UnspentClient {
  id: string;
  name: string;
  packageLevel: string;
  annualBudget: number;
  utilisationPct: number;
  unspentAmount: number;
  quarterEnd: string;
  risk: "high" | "medium" | "low";
  reason: string;
  action: string;
}

const UNSPENT_CLIENTS: UnspentClient[] = [
  { id: "HC-008", name: "Patricia L.", packageLevel: "Level 4", annualBudget: 54800, utilisationPct: 48, unspentAmount: 14230, quarterEnd: "30 Jun 2026", risk: "high", reason: "Declined additional services after hospital discharge. Family preference for informal care.", action: "Care coordinator meeting scheduled 18 Apr to discuss service options." },
  { id: "HC-012", name: "Kenneth R.", packageLevel: "Level 3", annualBudget: 38400, utilisationPct: 52, unspentAmount: 9210, quarterEnd: "30 Jun 2026", risk: "high", reason: "Services reduced by client choice. Mobility improved post-physio program.", action: "Reassessment due — may qualify for lower package level." },
  { id: "HC-019", name: "Florence H.", packageLevel: "Level 4", annualBudget: 54800, utilisationPct: 61, unspentAmount: 10670, quarterEnd: "30 Jun 2026", risk: "high", reason: "Service area coverage gaps — limited weekend availability.", action: "Workforce planning to address weekend capacity in Southern Highlands." },
  { id: "HC-027", name: "George A.", packageLevel: "Level 2", annualBudget: 18200, utilisationPct: 64, unspentAmount: 3275, quarterEnd: "30 Jun 2026", risk: "medium", reason: "Seasonal variation — client travels interstate during winter months.", action: "Budget statement updated to reflect seasonal pattern." },
  { id: "HC-033", name: "Barbara N.", packageLevel: "Level 3", annualBudget: 38400, utilisationPct: 67, unspentAmount: 6330, quarterEnd: "30 Jun 2026", risk: "medium", reason: "New to package — services still being established. Started Feb 2026.", action: "Service plan fully implemented by end of April." },
  { id: "HC-041", name: "Harold D.", packageLevel: "Level 4", annualBudget: 54800, utilisationPct: 58, unspentAmount: 11500, quarterEnd: "30 Jun 2026", risk: "high", reason: "Carer reluctance — primary carer prefers to provide care personally.", action: "Carer support session and respite options discussed." },
];

const RISK_BADGE: Record<string, { bg: string; text: string }> = {
  high: { bg: "bg-[hsl(var(--brand-terracotta)/0.1)]", text: "text-[hsl(var(--brand-terracotta))]" },
  medium: { bg: "bg-[hsl(var(--brand-amber)/0.1)]", text: "text-[hsl(var(--brand-amber))]" },
  low: { bg: "bg-[hsl(var(--brand-teal)/0.1)]", text: "text-[hsl(var(--brand-teal))]" },
};

export default function UnspentFundsPage() {
  const router = useRouter();
  const totalUnspent = UNSPENT_CLIENTS.reduce((s, c) => s + c.unspentAmount, 0);
  const highRisk = UNSPENT_CLIENTS.filter((c) => c.risk === "high").length;

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => router.push("/dashboard/home-care/packages")} className="p-1 -ml-1 hover:bg-muted rounded-lg">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Unspent Funds</p>
          <p className="text-[10px] text-muted-foreground">KHG Home Care · Clients at risk of fund clawback</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-[hsl(var(--brand-terracotta))]">${(totalUnspent / 1000).toFixed(0)}K</p>
          <p className="text-[10px] text-muted-foreground">Total At Risk</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-[hsl(var(--brand-amber))]">{UNSPENT_CLIENTS.length}</p>
          <p className="text-[10px] text-muted-foreground">Clients Below 75%</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-[hsl(var(--brand-terracotta))]">{highRisk}</p>
          <p className="text-[10px] text-muted-foreground">High Risk</p>
        </div>
      </div>

      {/* Oracle insight */}
      <div className="bg-card rounded-xl border border-border border-l-4 border-l-[hsl(var(--brand-amber))] p-4 mb-5" style={{ background: "rgba(212,160,23,0.04)" }}>
        <div className="flex items-start gap-2">
          <DollarSign className="w-4 h-4 text-[hsl(var(--brand-amber))] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">CHRIS Oracle:</span> ${(totalUnspent / 1000).toFixed(0)}K at risk of returning to government under Support at Home rules if utilisation is not addressed before quarter end. {highRisk} clients need immediate care coordinator intervention.
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Under Support at Home, unspent funds above the retention threshold are returned to the Commonwealth. Proactive service planning can recover an estimated 60-70% of at-risk funds.
            </p>
          </div>
        </div>
      </div>

      {/* Client list */}
      {UNSPENT_CLIENTS.map((client) => {
        const badge = RISK_BADGE[client.risk];
        return (
          <div key={client.id} className="bg-card rounded-xl border border-border p-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">{client.name}</p>
                <span className="text-[10px] text-muted-foreground">{client.packageLevel}</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
                  {client.risk} risk
                </span>
              </div>
              <span className="text-sm font-bold text-[hsl(var(--brand-terracotta))]">
                ${client.unspentAmount.toLocaleString()}
              </span>
            </div>

            {/* Utilisation bar */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${client.utilisationPct}%`,
                    backgroundColor: client.utilisationPct >= 75 ? "#2D7D73" : client.utilisationPct >= 60 ? "#D4A017" : "#C4704A",
                  }}
                />
              </div>
              <span className="text-[10px] font-medium text-foreground">{client.utilisationPct}%</span>
            </div>

            <p className="text-[10px] text-muted-foreground leading-relaxed mb-1">{client.reason}</p>
            <p className="text-[10px] text-foreground font-medium">{client.action}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Annual budget: ${client.annualBudget.toLocaleString()} · Quarter ends {client.quarterEnd}</p>
          </div>
        );
      })}
    </div>
  );
}
