"use client";

import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, BarChart2, ChevronRight } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { SignalConvergencePanel } from "@/components/dashboard/SignalConvergencePanel";

const DEMO_SIGNALS = [
  {
    id: "cfo-1", type: "causal" as const, confidence: "strong" as const,
    headline: "Agency cost spike — workforce and culture root cause",
    domains: ["financial", "workforce", "psh"],
    explanation: "Direct care agency cost is $47K above budget this month. Primary driver: 2 resignation events in Wing B. Those resignations follow a 4-cycle decline in PSH_13 (Low Recognition) scores in that team. This is a culture-driven financial exposure, not a labour market event.",
    dataPoints: [
      { domain: "financial", metric: "Agency cost", value: "+$47K", context: "Above monthly budget" },
      { domain: "workforce", metric: "Resignations", value: 2, context: "Wing B, last 30 days" },
      { domain: "psh", metric: "PSH_13", value: "4 cycles declining", context: "Low Recognition" },
    ],
    implication: "Continued turnover will sustain agency dependency. Replacement cost: $18-22K per care worker.",
    recommendedAction: "Address recognition patterns in highest-churn teams. This is the most cost-effective response.",
    ownerRole: "hr_manager",
  },
];

const BUDGET_ROWS = [
  { centre: "Direct Care — Nursing", budget: 285000, actual: 312000, variance: -27000 },
  { centre: "Direct Care — AIN/PCW", budget: 180000, actual: 175000, variance: 5000 },
  { centre: "Agency Labour", budget: 22000, actual: 47000, variance: -25000 },
  { centre: "Hotel Services", budget: 65000, actual: 62000, variance: 3000 },
  { centre: "Administration", budget: 48000, actual: 36000, variance: 12000 },
  { centre: "Maintenance", budget: 18000, actual: 19500, variance: -1500 },
];

export default function FinancialDashboardPage() {
  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--brand-forest)]">Financial Performance</h1>
        <p className="text-sm text-gray-500">FY2026 · April · Harbison</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MetricCard label="Revenue vs Budget" value="-1.2%" subtitle="$2.1M actual · $2.13M budget" trend="down" status="at-risk" />
        <MetricCard label="Care Ratio" value="58%" subtitle="Target: ≥55%" trend="stable" status="compliant" />
        <MetricCard label="Labour / Bed Day" value="$312" subtitle="Sector median: $298" trend="up" trendLabel="+$14" status="at-risk" />
        <MetricCard label="Agency Cost" value="$47K" subtitle="22% of workforce cost" trend="up" trendLabel="+$25K" status="non-compliant" />
      </div>

      {/* AN-ACC Revenue */}
      <div className="bg-white rounded-xl p-5 shadow-warm border border-[var(--border-default)] mb-6">
        <h2 className="text-base font-semibold text-[var(--brand-forest)] mb-4">AN-ACC Revenue</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--brand-forest)]">$2.1M</p>
            <p className="text-[10px] text-gray-500">YTD Revenue</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--brand-amber)]">94%</p>
            <p className="text-[10px] text-gray-500">Occupancy</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--brand-terracotta)]">3</p>
            <p className="text-[10px] text-gray-500">Due Reassessment</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--brand-forest)]">$8.2K</p>
            <p className="text-[10px] text-gray-500">Revenue at Risk / month</p>
          </div>
        </div>
        <div className="card-amber rounded-lg p-3">
          <p className="text-xs text-[var(--brand-forest)]">
            <AlertTriangle className="w-3 h-3 inline mr-1 text-[var(--brand-amber)]" />
            3 residents have not been reassessed in 6+ months. Estimated revenue risk: $8.2K/month if classifications drop. DON has been notified.
          </p>
        </div>
      </div>

      {/* Budget Performance */}
      <div className="bg-white rounded-xl shadow-warm border border-[var(--border-default)] mb-6 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-[var(--brand-forest)]">Budget Performance — This Month</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--brand-forest)] text-white text-[10px] font-semibold uppercase">
                <th className="text-left px-4 py-2">Cost Centre</th>
                <th className="text-right px-4 py-2">Budget</th>
                <th className="text-right px-4 py-2">Actual</th>
                <th className="text-right px-4 py-2">Variance</th>
                <th className="text-center px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {BUDGET_ROWS.map((row, i) => {
                const pct = Math.round((row.variance / row.budget) * 100);
                const status = pct < -5 ? "non-compliant" : pct < -2 ? "at-risk" : "compliant";
                return (
                  <tr key={row.centre} className={`border-b border-gray-50 ${i % 2 === 1 ? "bg-[rgba(27,67,50,0.02)]" : ""}`}>
                    <td className="px-4 py-2.5 font-medium text-[var(--brand-forest)]">{row.centre}</td>
                    <td className="text-right px-4 py-2.5 text-gray-600">${(row.budget / 1000).toFixed(0)}K</td>
                    <td className="text-right px-4 py-2.5 text-gray-600">${(row.actual / 1000).toFixed(0)}K</td>
                    <td className={`text-right px-4 py-2.5 font-medium ${row.variance >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {row.variance >= 0 ? "+" : ""}${(row.variance / 1000).toFixed(0)}K
                    </td>
                    <td className="text-center px-4 py-2.5"><StatusBadge status={status} label={`${pct >= 0 ? "+" : ""}${pct}%`} size="xs" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* QFR Status */}
      <div className="bg-white rounded-xl p-4 shadow-warm-sm border border-[var(--border-default)] mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--brand-forest)]">Q2 QFR Submission</p>
          <p className="text-xs text-gray-500">Due in 14 days</p>
        </div>
        <StatusBadge status="at-risk" label="Draft ready" />
      </div>

      <SignalConvergencePanel signals={DEMO_SIGNALS} title="Financial Signal Convergence" />
    </div>
  );
}
