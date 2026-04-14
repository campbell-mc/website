"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const shiftData = [
  { shift: "Morning", minutes: 78, target: 70, status: "good" as const },
  { shift: "Afternoon", minutes: 65, target: 70, status: "warning" as const },
  { shift: "Night", minutes: 58, target: 60, status: "immediate" as const },
];

const STATUS_STYLES = {
  good: { border: "border-l-4 border-l-[#2D7D73]", bg: "bg-white", valueColor: "text-[#1B4332]", badge: "bg-[#E8F5F0] text-[#2D7D73]", badgeLabel: "On track" },
  warning: { border: "border-l-4 border-l-[#D4A017]", bg: "bg-[#FFFBF0]", valueColor: "text-[#D4A017]", badge: "bg-[#FFFBF0] text-[#D4A017]", badgeLabel: "5 mins short" },
  immediate: { border: "border-l-4 border-l-[#C4704A]", bg: "bg-[#FEF7F0]", valueColor: "text-[#C4704A]", badge: "bg-[#FEF7F0] text-[#C4704A]", badgeLabel: "2 mins short" },
};

export default function MobileCareMinutes() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAF9F7] pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <button
            data-has-handler="true"
            onClick={() => router.push("/dashboard/clinical")}
            className="p-2 -ml-2 active:bg-gray-100 rounded-xl"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-[28px] font-bold text-gray-900">Care Minutes</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Sunrise Aged Care · Today</p>
          </div>
        </div>
      </div>

      {/* Hero card */}
      <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 p-6 text-center">
        <p className="text-[12px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
          Total care minutes today
        </p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-[64px] font-bold text-[#1B4332] leading-none">216</span>
          <span className="text-[24px] text-gray-400 font-medium">/215</span>
        </div>
        <p className="text-[13px] text-[#2D7D73] font-medium mt-2">Compliant</p>
      </div>

      {/* Breakdown bars */}
      <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
          By role
        </p>

        {[
          { role: "RN", value: 48, target: 44, pct: 100 },
          { role: "EN", value: 62, target: 60, pct: 85 },
          { role: "AIN", value: 91, target: 96, pct: 72 },
        ].map((row) => (
          <div key={row.role} className="mb-4 last:mb-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[15px] font-semibold text-gray-900">{row.role}</span>
              <span className="text-[15px] font-bold text-gray-900">
                {row.value}{" "}
                <span className="text-gray-400 font-normal">/ {row.target}</span>
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, (row.value / row.target) * 100)}%`,
                  backgroundColor: row.value >= row.target ? "#2D7D73" : "#D4A017",
                }}
              />
            </div>
          </div>
        ))}

        {/* CHRIS note */}
        <div className="mt-4 pt-3 border-t border-gray-50">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#1B4332] to-[#C9A84C] flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-white text-[9px] font-bold">C</span>
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              AIN minutes are 5 short of target. Tonight shift has a 2-minute gap that agency
              cover would resolve. RN and EN are both compliant.
            </p>
          </div>
        </div>
      </div>

      {/* By shift */}
      <div className="px-4 mt-4">
        <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          By shift
        </p>
        <div className="flex flex-col gap-3">
          {shiftData.map((shift) => {
            const style = STATUS_STYLES[shift.status];
            return (
              <div
                key={shift.shift}
                className={`rounded-2xl border border-gray-100 ${style.border} ${style.bg} p-4`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[15px] font-semibold text-gray-900">{shift.shift}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
                    {style.badgeLabel}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-[28px] font-bold ${style.valueColor}`}>{shift.minutes}</span>
                  <span className="text-[14px] text-gray-400">/ {shift.target} mins</span>
                </div>
                {shift.status === "immediate" && (
                  <button
                    data-has-handler="true"
                    onClick={() => router.push("/dashboard/workforce/agency")}
                    className="mt-3 w-full py-3.5 rounded-xl text-[15px] font-semibold bg-[#1B4332] text-white flex items-center justify-center active:opacity-80 transition-opacity min-h-[56px]"
                  >
                    Find agency cover
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
