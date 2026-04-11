"use client";

import { Activity, Clock, Users, AlertTriangle } from "lucide-react";
import { ScoreRing } from "@/components/ui/score-ring";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";

const WEEK_DATA = [
  { day: "Mon", total: 203, rn: 42, status: "compliant" as const },
  { day: "Tue", total: 198, rn: 39, status: "at-risk" as const },
  { day: "Wed", total: 201, rn: 41, status: "compliant" as const },
  { day: "Thu", total: 186, rn: 37, status: "non-compliant" as const },
  { day: "Fri", total: 189, rn: 38, status: "at-risk" as const },
  { day: "Sat", total: 191, rn: 39, status: "at-risk" as const },
  { day: "Today", total: 198, rn: 41, status: "at-risk" as const },
];

const SHIFT_DATA = [
  { shift: "Morning", rn: 16.2, en: 5.4, ain: 42.1, status: "compliant" as const },
  { shift: "Afternoon", rn: 14.8, en: 4.8, ain: 38.5, status: "at-risk" as const },
  { shift: "Night", rn: 10.2, en: 0, ain: 18.4, status: "compliant" as const },
];

export default function CareMinutesPage() {
  const todayTotal = 198;
  const todayRn = 41;
  const target = 200;
  const rnTarget = 40;
  const compliancePct = Math.round((todayTotal / target) * 100);

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--brand-forest)]">Care Minutes</h1>
          <p className="text-sm text-gray-500">AN-ACC Compliance · Target: 200 total / 40 RN · Updated hourly</p>
        </div>
      </div>

      {/* Today hero */}
      <div className="bg-white rounded-xl p-6 shadow-warm border border-[var(--border-default)] mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-[var(--brand-forest)]">Today</h2>
          <StatusBadge status={todayTotal >= 200 && todayRn >= 40 ? "compliant" : todayTotal >= 190 ? "at-risk" : "non-compliant"} />
        </div>
        <div className="flex items-center gap-8">
          <ScoreRing score={compliancePct} size="lg" label="of 200 target" />
          <div className="flex-1 space-y-4">
            {[
              { label: "RN", value: todayRn, target: rnTarget, color: todayRn >= rnTarget ? "var(--brand-teal)" : "var(--brand-amber)" },
              { label: "EN", value: 10.2, target: null, color: "var(--brand-forest)" },
              { label: "AIN", value: 136.8, target: null, color: "var(--brand-forest)" },
            ].map((role) => (
              <div key={role.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-10">{role.label}</span>
                <div className="flex-1 mx-3 bg-gray-100 rounded-full h-2.5">
                  <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (role.value / (role.target ?? todayTotal * 0.7)) * 100)}%`, background: role.color }} />
                </div>
                <span className="text-sm font-medium w-20 text-right">{role.value} min{role.target ? ` / ${role.target}` : ""}</span>
              </div>
            ))}
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> CHRIS projection: Today will finish at ~{todayTotal + 4} min/resident — {todayTotal + 4 >= 200 ? "compliant" : "at risk"}.
            </p>
          </div>
        </div>
      </div>

      {/* By shift */}
      <div className="bg-white rounded-xl p-5 shadow-warm border border-[var(--border-default)] mb-6">
        <h2 className="text-base font-semibold text-[var(--brand-forest)] mb-4">By Shift</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--brand-forest)] text-white text-[10px] font-semibold uppercase">
                <th className="text-left px-3 py-2">Shift</th>
                <th className="text-center px-3 py-2">RN min</th>
                <th className="text-center px-3 py-2">EN min</th>
                <th className="text-center px-3 py-2">AIN min</th>
                <th className="text-center px-3 py-2">Total</th>
                <th className="text-center px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {SHIFT_DATA.map((s) => (
                <tr key={s.shift} className="border-b border-gray-50">
                  <td className="px-3 py-2.5 font-medium text-[var(--brand-forest)]">{s.shift}</td>
                  <td className="text-center px-3 py-2.5">{s.rn}</td>
                  <td className="text-center px-3 py-2.5">{s.en}</td>
                  <td className="text-center px-3 py-2.5">{s.ain}</td>
                  <td className="text-center px-3 py-2.5 font-semibold">{(s.rn + s.en + s.ain).toFixed(1)}</td>
                  <td className="text-center px-3 py-2.5"><StatusBadge status={s.status} size="xs" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Week view */}
      <div className="bg-white rounded-xl p-5 shadow-warm border border-[var(--border-default)]">
        <h2 className="text-base font-semibold text-[var(--brand-forest)] mb-4">This Week</h2>
        <div className="flex items-end gap-2 h-40">
          {WEEK_DATA.map((d) => {
            const height = Math.max(10, (d.total / 220) * 100);
            const color = d.status === "compliant" ? "var(--brand-teal)" : d.status === "at-risk" ? "var(--brand-amber)" : "var(--brand-terracotta)";
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-semibold" style={{ color }}>{d.total}</span>
                <div className="w-full rounded-t-md transition-all duration-500" style={{ height: `${height}%`, background: color }} />
                <span className="text-[10px] text-gray-500">{d.day}</span>
              </div>
            );
          })}
        </div>
        {/* Threshold line */}
        <div className="relative -mt-[60%] border-t-2 border-dashed border-gray-300 mb-4">
          <span className="absolute -top-3 right-0 text-[9px] text-gray-400 bg-white px-1">200 target</span>
        </div>
      </div>
    </div>
  );
}
