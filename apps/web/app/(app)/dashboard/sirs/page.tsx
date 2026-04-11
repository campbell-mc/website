"use client";

import { AlertTriangle, Clock, CheckCircle, ChevronRight } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { DeadlineCountdown } from "@/components/don/DeadlineCountdown";

const OPEN_SIRS = [
  { id: "1", category: 2, description: "Fall with hip fracture — Wing A resident", daysAgo: 8, deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(), status: "in_review" },
];

const CLOSED_SIRS = [
  { id: "2", category: 2, type: "Fall with injury", date: "2026-03-15", submitted: "2026-03-22", acqscRef: "SIRS-2026-0412", outcome: "Corrective action complete" },
  { id: "3", category: 2, type: "Medication error", date: "2026-02-28", submitted: "2026-03-05", acqscRef: "SIRS-2026-0389", outcome: "Process updated" },
];

export default function SIRSPage() {
  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--brand-forest)]">SIRS Register</h1>
        <p className="text-sm text-gray-500">Serious Incident Response Scheme · Harbison</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <MetricCard label="Open Cat 1" value="0" status="compliant" />
        <MetricCard label="Open Cat 2" value="1" subtitle="22 days remaining" status="at-risk" />
        <MetricCard label="90-Day Total" value="3" subtitle="2 closed, 1 open" />
      </div>

      {/* Open SIRS */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-[var(--brand-forest)] mb-3">Open Items</h2>
        {OPEN_SIRS.map((item) => (
          <div key={item.id} className={`bg-white rounded-xl p-4 shadow-warm-sm border-l-4 ${item.category === 1 ? "border-l-[var(--brand-terracotta)]" : "border-l-[var(--brand-amber)]"} border border-[var(--border-default)] mb-3`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <StatusBadge status={item.category === 1 ? "non-compliant" : "at-risk"} label={`Category ${item.category}`} size="sm" />
                <span className="text-xs text-gray-400">{item.daysAgo} days ago</span>
              </div>
              <DeadlineCountdown deadline={item.deadline} />
            </div>
            <p className="text-sm text-[var(--brand-forest)] mb-2">{item.description}</p>
            <div className="flex items-center justify-between">
              <StatusBadge status="info" label={item.status.replace("_", " ")} size="xs" />
              <button className="text-xs font-medium text-[var(--brand-forest)] hover:underline flex items-center gap-1">
                Review draft <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Closed SIRS */}
      <div className="bg-white rounded-xl shadow-warm border border-[var(--border-default)] overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-[var(--brand-forest)]">Closed — Last 90 Days</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--brand-forest)] text-white text-[10px] font-semibold uppercase">
              <th className="text-left px-4 py-2">Type</th>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">Submitted</th>
              <th className="text-left px-4 py-2">ACQSC Ref</th>
              <th className="text-left px-4 py-2">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {CLOSED_SIRS.map((item, i) => (
              <tr key={item.id} className={`border-b border-gray-50 ${i % 2 === 1 ? "bg-[rgba(27,67,50,0.02)]" : ""}`}>
                <td className="px-4 py-2.5 font-medium text-[var(--brand-forest)]">{item.type}</td>
                <td className="px-4 py-2.5 text-gray-600">{item.date}</td>
                <td className="px-4 py-2.5 text-gray-600">{item.submitted}</td>
                <td className="px-4 py-2.5 text-gray-500 text-xs">{item.acqscRef}</td>
                <td className="px-4 py-2.5"><StatusBadge status="compliant" label={item.outcome} size="xs" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
