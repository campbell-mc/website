"use client";

import { Users, TrendingDown, TrendingUp, GraduationCap, BarChart2 } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { SignalConvergencePanel } from "@/components/dashboard/SignalConvergencePanel";

const DEMO_SIGNALS = [
  {
    id: "hr-1", type: "causal" as const, confidence: "strong" as const,
    headline: "Turnover is a PSH outcome, not a recruitment problem",
    domains: ["workforce", "psh", "financial"],
    explanation: "Rolling 12-month AIN turnover is 34% — 8 points above sector median. Teams with highest turnover show a consistent PSH signature: PSH_13 (Low Recognition) and PSH_02 (Lack of Support) elevated for 4+ cycles before resignation events. The recruitment pipeline is not the constraint. The retention environment is.",
    dataPoints: [
      { domain: "workforce", metric: "AIN turnover", value: "34%", context: "vs 26% sector median" },
      { domain: "psh", metric: "PSH_13", value: "4+ cycles", context: "Low Recognition in high-churn teams" },
      { domain: "psh", metric: "PSH_02", value: "4+ cycles", context: "Lack of Support co-elevated" },
    ],
    implication: "Targeted recognition and support practices in highest-churn teams are the highest-ROI HR intervention.",
    recommendedAction: "Review Team Loop practices — address recognition, not just workload.",
    ownerRole: "hr_manager",
  },
];

const COMPOSITION = [
  { role: "RN", permFT: 12, permPT: 8, casual: 3, agency: 2, total: 25 },
  { role: "EN", permFT: 6, permPT: 4, casual: 2, agency: 1, total: 13 },
  { role: "AIN/PCW", permFT: 35, permPT: 28, casual: 18, agency: 12, total: 93 },
  { role: "Allied Health", permFT: 4, permPT: 3, casual: 0, agency: 0, total: 7 },
  { role: "Admin", permFT: 6, permPT: 2, casual: 1, agency: 0, total: 9 },
  { role: "Management", permFT: 5, permPT: 0, casual: 0, agency: 0, total: 5 },
];

export default function WorkforcePage() {
  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--brand-forest)]">P&C Scoreboard</h1>
        <p className="text-sm text-gray-500">Workforce performance · Harbison</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MetricCard label="Turnover Rate" value="28%" subtitle="vs 26% sector" trend="down" trendLabel="-2%" status="at-risk" />
        <MetricCard label="Absenteeism" value="7.2%" subtitle="vs 6.8% prior 90 days" trend="up" trendLabel="+0.4%" status="at-risk" />
        <MetricCard label="Agency Dependency" value="14%" subtitle="Target: <15%" trend="stable" status="compliant" />
        <MetricCard label="Training Compliance" value="91%" subtitle="3 expiring in 30 days" trend="stable" status="compliant" />
      </div>

      {/* Workforce Composition */}
      <div className="bg-white rounded-xl shadow-warm border border-[var(--border-default)] mb-6 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[var(--brand-forest)]">Workforce Composition</h2>
          <span className="text-xs text-gray-400">152 total staff</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--brand-forest)] text-white text-[10px] font-semibold uppercase">
                <th className="text-left px-4 py-2">Role</th>
                <th className="text-center px-3 py-2">Perm FT</th>
                <th className="text-center px-3 py-2">Perm PT</th>
                <th className="text-center px-3 py-2">Casual</th>
                <th className="text-center px-3 py-2">Agency</th>
                <th className="text-center px-3 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {COMPOSITION.map((row, i) => (
                <tr key={row.role} className={`border-b border-gray-50 ${i % 2 === 1 ? "bg-[rgba(27,67,50,0.02)]" : ""}`}>
                  <td className="px-4 py-2.5 font-medium text-[var(--brand-forest)]">{row.role}</td>
                  <td className="text-center px-3 py-2.5">{row.permFT}</td>
                  <td className="text-center px-3 py-2.5">{row.permPT}</td>
                  <td className="text-center px-3 py-2.5">{row.casual}</td>
                  <td className="text-center px-3 py-2.5">{row.agency > 0 ? <span className="text-[var(--brand-amber)] font-medium">{row.agency}</span> : "—"}</td>
                  <td className="text-center px-3 py-2.5 font-semibold">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 bg-[rgba(27,67,50,0.02)] text-xs text-gray-500">
          Movement this month: +3 new starters · -2 terminations · Net: +1
        </div>
      </div>

      {/* Leader Loop Analytics */}
      <div className="bg-white rounded-xl p-5 shadow-warm border border-[var(--border-default)] mb-6">
        <h2 className="text-base font-semibold text-[var(--brand-forest)] mb-4">Leader Development (Aggregate)</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg card-forest">
            <p className="text-xl font-bold text-[var(--brand-forest)]">78%</p>
            <p className="text-[10px] text-gray-500">Loop completion rate</p>
          </div>
          <div className="text-center p-3 rounded-lg card-forest">
            <p className="text-xl font-bold text-[var(--brand-forest)]">24</p>
            <p className="text-[10px] text-gray-500">Leaders with OBP set</p>
          </div>
          <div className="text-center p-3 rounded-lg card-teal">
            <p className="text-xl font-bold text-[var(--brand-teal)]">+0.12</p>
            <p className="text-[10px] text-gray-500">Avg PS score improvement</p>
          </div>
          <div className="text-center p-3 rounded-lg card-amber">
            <p className="text-xl font-bold text-[var(--brand-amber)]">68%</p>
            <p className="text-[10px] text-gray-500">Gap: Inspiring Performance</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3 italic">
          Leaders completing 3+ cycles show an average improvement of 0.12 in their team's Psychological Safety score.
        </p>
      </div>

      <SignalConvergencePanel signals={DEMO_SIGNALS} title="Workforce Signal Convergence" />
    </div>
  );
}
