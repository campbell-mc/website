"use client";

import { BarChart2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

const QI_DATA = [
  { code: "QI_01", name: "Unplanned weight loss", current: 2.1, prior: 1.8, benchmark: 2.5, trend: "up" },
  { code: "QI_02", name: "Pressure injuries", current: 0.8, prior: 0.9, benchmark: 1.2, trend: "down" },
  { code: "QI_03", name: "Falls", current: 8.2, prior: 7.5, benchmark: 7.8, trend: "up" },
  { code: "QI_04", name: "Falls — major injury", current: 1.8, prior: 1.2, benchmark: 2.1, trend: "up" },
  { code: "QI_05", name: "Medication incidents", current: 3.1, prior: 2.8, benchmark: 3.5, trend: "up" },
  { code: "QI_06", name: "Infections — COVID-19", current: 0.0, prior: 0.5, benchmark: 0.8, trend: "down" },
  { code: "QI_07", name: "Infections — influenza", current: 0.3, prior: 0.1, benchmark: 0.5, trend: "up" },
  { code: "QI_08", name: "Infections — respiratory", current: 1.2, prior: 1.5, benchmark: 1.8, trend: "down" },
  { code: "QI_09", name: "Infections — gastro", current: 0.5, prior: 0.4, benchmark: 0.6, trend: "up" },
  { code: "QI_10", name: "Infections — AMR", current: 0.0, prior: 0.0, benchmark: 0.2, trend: "stable" },
  { code: "QI_11", name: "Hospitalisation", current: 4.5, prior: 4.8, benchmark: 5.2, trend: "down" },
  { code: "QI_12", name: "Physical restraint", current: 0.2, prior: 0.3, benchmark: 0.5, trend: "down" },
  { code: "QI_13", name: "Chemical restraint", current: 1.1, prior: 1.2, benchmark: 1.5, trend: "down" },
  { code: "QI_14", name: "Consumer experience", current: 8.5, prior: 8.3, benchmark: 8.0, trend: "up" },
];

function getQIStatus(current: number, benchmark: number, isHigherBetter: boolean = false): "compliant" | "at-risk" | "non-compliant" {
  if (isHigherBetter) {
    return current >= benchmark ? "compliant" : current >= benchmark * 0.9 ? "at-risk" : "non-compliant";
  }
  return current <= benchmark ? "compliant" : current <= benchmark * 1.1 ? "at-risk" : "non-compliant";
}

export default function QualityPage() {
  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--brand-forest)]">Quality Indicators</h1>
          <p className="text-sm text-gray-500">14 Mandatory QIs · Q1 2026 · Harbison</p>
        </div>
        <StatusBadge status="at-risk" label="GPMS: Draft ready" />
      </div>

      <div className="bg-white rounded-xl shadow-warm border border-[var(--border-default)] overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--brand-forest)] text-white text-[10px] font-semibold uppercase">
                <th className="text-left px-4 py-2.5">QI</th>
                <th className="text-left px-4 py-2.5">Indicator</th>
                <th className="text-center px-3 py-2.5">Current</th>
                <th className="text-center px-3 py-2.5">Prior Q</th>
                <th className="text-center px-3 py-2.5">Benchmark</th>
                <th className="text-center px-3 py-2.5">Trend</th>
                <th className="text-center px-3 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {QI_DATA.map((qi, i) => {
                const isHigherBetter = qi.code === "QI_14";
                const status = getQIStatus(qi.current, qi.benchmark, isHigherBetter);
                return (
                  <tr key={qi.code} className={`border-b border-gray-50 ${i % 2 === 1 ? "bg-[rgba(27,67,50,0.02)]" : ""} ${status === "non-compliant" ? "bg-[rgba(196,112,74,0.04)]" : ""}`}>
                    <td className="px-4 py-2.5 text-xs text-gray-400 font-mono">{qi.code}</td>
                    <td className="px-4 py-2.5 font-medium text-[var(--brand-forest)]">{qi.name}</td>
                    <td className="text-center px-3 py-2.5 font-semibold">{qi.current}</td>
                    <td className="text-center px-3 py-2.5 text-gray-500">{qi.prior}</td>
                    <td className="text-center px-3 py-2.5 text-gray-400">{qi.benchmark}</td>
                    <td className="text-center px-3 py-2.5">
                      {qi.trend === "up" && <TrendingUp className={`w-4 h-4 mx-auto ${isHigherBetter ? "text-emerald-500" : "text-rose-500"}`} />}
                      {qi.trend === "down" && <TrendingDown className={`w-4 h-4 mx-auto ${isHigherBetter ? "text-rose-500" : "text-emerald-500"}`} />}
                      {qi.trend === "stable" && <Minus className="w-4 h-4 mx-auto text-gray-400" />}
                    </td>
                    <td className="text-center px-3 py-2.5"><StatusBadge status={status} size="xs" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CHRIS Commentary */}
      <div className="card-amber rounded-xl p-4">
        <p className="text-sm text-[var(--brand-forest)]">
          <strong>CHRIS:</strong> QI_03 (falls) is trending up — 3rd consecutive quarter. Cross-reference: allied health hours dropped 18% in the period. Physio assessment completion rate may be a contributing factor. QI_04 (falls with injury) also elevated — recommend falls prevention protocol review.
        </p>
      </div>
    </div>
  );
}
