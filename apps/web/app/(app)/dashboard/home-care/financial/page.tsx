"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Lightbulb,
  PieChart,
  CheckCircle,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AgentPulse } from "@/components/chris/AgentPulse";
import { SituationReport } from "@/components/chris/SituationReport";
import { hcFinancialReport } from "@/lib/chris/situation-reports";
import { mt_gib_home_care } from "@/lib/seed-data";

const financial = mt_gib_home_care.combined.financial;

const statCards = [
  {
    label: "Revenue / Client / Day",
    value: `$${financial.revenue_per_client_per_day.toFixed(2)}`,
    sector: "$84.89",
    delta: -0.69,
    icon: DollarSign,
  },
  {
    label: "Care Management %",
    value: `${financial.care_management_pct}%`,
    sector: "18.7%",
    delta: 0.4,
    icon: PieChart,
  },
  {
    label: "EBITDA Return",
    value: `${financial.ebitda_return_pct}%`,
    sector: "6.4%",
    delta: 0.4,
    icon: TrendingUp,
  },
  {
    label: "NPBT / Client / Day",
    value: `$${financial.npbt_per_client_per_day.toFixed(2)}`,
    sector: "$4.33",
    delta: 0.28,
    icon: BarChart3,
  },
];

const opportunities = [
  {
    title: "Increase allied health utilisation",
    detail: "Allied health at 79.3% — moving to 85% would recover $12.8K/quarter in unspent allocations.",
    uplift: "$12.8K",
  },
  {
    title: "Reduce travel time in Leichhardt cluster",
    detail: "Travel time 16.1% in Leichhardt vs 12.3% in Manly. Route optimisation could save $8.2K/quarter.",
    uplift: "$8.2K",
  },
  {
    title: "Convert agency to permanent — 3 roles",
    detail: "3 ongoing agency roles at 1.4x cost. Converting to permanent saves $7.4K/quarter with improved continuity.",
    uplift: "$7.4K",
  },
];

const costStructure = [
  { label: "Labour", value: financial.labour_cost_pct, target: 70, unit: "%" },
  { label: "Travel", value: financial.travel_cost_pct, target: 10, unit: "%" },
  { label: "Admin", value: financial.admin_cost_pct, target: 15, unit: "%" },
];

export default function FinancialDashboardPage() {
  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <PageHeader title="Financial Dashboard" subtitle="Mt Gib Home Care Southern Highlands" backHref="/dashboard/home-care" />

        {/* Stat Cards vs StewartBrown */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const positive = card.delta >= 0;
            return (
              <div key={card.label} className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
                  <card.icon className="w-4 h-4 text-muted-foreground/60" />
                </div>
                <p className="text-[28px] font-bold text-foreground">{card.value}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  {positive ? (
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-amber-500" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    vs sector {card.sector}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <AgentPulse domain="hc_financial" />
        <SituationReport domain="financial" narrative={hcFinancialReport.narrative} refreshedAt={hcFinancialReport.refreshedAt} context={hcFinancialReport.context} signals={hcFinancialReport.signals} />

        {/* StewartBrown benchmark label */}
        <p className="text-[10px] text-muted-foreground/60 -mt-3">
          Sector benchmarks: StewartBrown Home Care Financial Performance Survey 2025-26
        </p>

        {/* Oracle Opportunities */}
        <div className="bg-card rounded-xl border border-border border-l-4 border-l-[#1B4332] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5" style={{ color: "#D4A017" }} />
            <h2 className="text-sm font-bold text-foreground">Oracle Opportunities</h2>
            <span className="ml-2 text-xs font-semibold" style={{ color: "#2D7D73" }}>
              $28.4K estimated uplift
            </span>
          </div>
          <div className="space-y-3">
            {opportunities.map((opp, i) => (
              <div
                key={i}
                className="rounded-xl border border-border p-4 hover:shadow-warm transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{opp.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{opp.detail}</p>
                  </div>
                  <span className="shrink-0 ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                    +{opp.uplift}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Structure */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Cost Structure</h2>
          <div className="space-y-4">
            {costStructure.map((item) => {
              const withinTarget = item.value <= item.target;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      {withinTarget && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-600">
                          <CheckCircle className="w-3 h-3" /> &lt;{item.target}% target
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {item.value}{item.unit}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden relative">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.value / item.target) * 100}%`,
                        maxWidth: "100%",
                        backgroundColor: withinTarget ? "#2D7D73" : "#C4704A",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue / Cost / Unspent Summary */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Month to Date Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground mb-1">Revenue MTD</p>
              <p className="text-[28px] font-bold text-foreground">
                ${(financial.total_revenue_mtd / 1000000).toFixed(2)}M
              </p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground mb-1">Cost MTD</p>
              <p className="text-[28px] font-bold text-foreground">
                ${(financial.total_cost_mtd / 1000000).toFixed(2)}M
              </p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground mb-1">Unspent Liability</p>
              <p className="text-xl font-bold" style={{ color: "#D4A017" }}>
                ${(financial.unspent_liability / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}
