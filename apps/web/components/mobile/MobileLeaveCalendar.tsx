"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { leave_current } from "@/lib/seed-data";

type ViewMode = "calendar" | "list" | "alerts";

const LEAVE_COLORS: Record<string, string> = {
  annual: "#3B82F6", sick: "#F97316", training: "#8B5CF6", carer: "#EC4899", rdo: "#6B7280", pending: "#D4A017",
};

function getCareMinutesColor(m: number) {
  if (m >= 200) return "#2D7D73";
  if (m >= 190) return "#D4A017";
  return "#C4704A";
}

function getLeaveTypeColor(type: string) { return LEAVE_COLORS[type] ?? "#6B7280"; }

// Build leave map from seed data
function buildLeaveMap() {
  const map: Record<string, { role: string; type: string; wing: string }[]> = {};
  for (const l of [...leave_current.approved, ...leave_current.pending]) {
    const start = new Date(l.start_date);
    const end = new Date(l.end_date);
    const cur = new Date(start);
    while (cur <= end) {
      const key = cur.toISOString().split("T")[0];
      if (!map[key]) map[key] = [];
      map[key].push({ role: l.worker_role, type: l.leave_type, wing: l.wing ?? "" });
      cur.setDate(cur.getDate() + 1);
    }
  }
  return map;
}

function projectCareMinutes(items: { role: string }[]) {
  let m = 201;
  for (const l of items) { m -= l.role === "RN" ? 40 : l.role === "EN" ? 11 : 12; }
  return Math.max(m, 0);
}

export default function MobileLeaveCalendar() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const router = useRouter();
  const leaveMap = buildLeaveMap();

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return { date: d.toISOString().split("T")[0], dayLabel: d.toLocaleDateString("en-AU", { weekday: "short" }), dateLabel: d.getDate().toString(), isToday: i === 0 };
  });

  const selectedDayData = selectedDate ? leaveMap[selectedDate] : null;
  const selectedMinutes = selectedDayData ? projectCareMinutes(selectedDayData) : null;

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-[28px] font-bold text-[#1B4332]">Leave & Calendar</h1>
        <p className="text-[13px] text-gray-500">Employment Hero · Updated 1h ago</p>
      </div>

      {/* Stats */}
      <div className="flex gap-3 px-4 pb-4 overflow-x-auto">
        {[
          { label: "On leave today", value: "1", urgency: "none" },
          { label: "Next 14 days", value: "12", urgency: "none" },
          { label: "Pending", value: "2", urgency: "urgent" },
          { label: "Risk days", value: "2", urgency: "immediate" },
        ].map((s) => (
          <div key={s.label} className={`shrink-0 rounded-xl border p-3 min-w-[100px] text-center ${
            s.urgency === "immediate" ? "border-l-4 border-l-[#C4704A] bg-[#FEF7F0] border-gray-100" :
            s.urgency === "urgent" ? "border-l-4 border-l-[#D4A017] bg-[#FFFBF0] border-gray-100" :
            "border-gray-100 bg-white"
          }`}>
            <p className="text-[24px] font-bold text-gray-900">{s.value}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* View mode toggle */}
      <div className="flex gap-2 px-4 pb-4">
        {(["calendar", "list", "alerts"] as const).map((mode) => (
          <button key={mode} onClick={() => setViewMode(mode)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${viewMode === mode ? "bg-[#1B4332] text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
            {mode === "calendar" ? "Calendar" : mode === "list" ? "By staff" : "Alerts"}
          </button>
        ))}
      </div>

      {/* CALENDAR VIEW */}
      {viewMode === "calendar" && (
        <div className="px-4">
          <div className="flex gap-2 overflow-x-auto pb-3">
            {days.map((d) => {
              const items = leaveMap[d.date] ?? [];
              const hasGap = items.length > 0 && projectCareMinutes(items) < 200;
              const isSelected = selectedDate === d.date;
              const minutes = items.length > 0 ? projectCareMinutes(items) : null;

              return (
                <button key={d.date} onClick={() => setSelectedDate(isSelected ? null : d.date)}
                  className={`shrink-0 flex flex-col items-center gap-1 w-14 py-3 rounded-xl border transition-all ${
                    isSelected ? "bg-[#1B4332] border-[#1B4332]" :
                    d.isToday ? "bg-[#F0F4F2] border-[#2D7D73]" :
                    hasGap ? "bg-[#FEF7F0] border-[#C4704A]" :
                    "bg-white border-gray-100"
                  }`}>
                  <span className={`text-[11px] font-medium ${isSelected ? "text-white" : d.isToday ? "text-[#2D7D73]" : "text-gray-400"}`}>{d.dayLabel}</span>
                  <span className={`text-[17px] font-bold ${isSelected ? "text-white" : "text-gray-900"}`}>{d.dateLabel}</span>
                  {items.length > 0 && (
                    <div className="flex gap-0.5">
                      {items.slice(0, 3).map((item, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isSelected ? "white" : getLeaveTypeColor(item.type) }} />
                      ))}
                    </div>
                  )}
                  {minutes !== null && (
                    <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.min((minutes / 215) * 100, 100)}%`, backgroundColor: isSelected ? "white" : getCareMinutesColor(minutes) }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-3 flex-wrap mb-4">
            {[{ label: "Annual", color: "#3B82F6" }, { label: "Sick", color: "#F97316" }, { label: "Training", color: "#8B5CF6" }, { label: "Gap risk", color: "#C4704A" }].map((item) => (
              <div key={item.label} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[11px] text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Selected day detail */}
          {selectedDate && selectedDayData && selectedDayData.length > 0 && (
            <div className={`rounded-2xl border p-4 mb-4 ${selectedMinutes !== null && selectedMinutes < 200 ? "border-l-4 border-l-[#C4704A] bg-[#FEF7F0] border-gray-100" : "border-gray-100 bg-white"}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[15px] font-semibold text-gray-900">
                  {new Date(selectedDate).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "short" })}
                </p>
                {selectedMinutes !== null && (
                  <span className="text-[13px] font-bold" style={{ color: getCareMinutesColor(selectedMinutes) }}>{selectedMinutes} min</span>
                )}
              </div>
              {selectedDayData.map((item, i) => (
                <div key={i} className="flex items-center gap-2 py-1">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getLeaveTypeColor(item.type) }} />
                  <span className="text-[14px] text-gray-700">{item.role} — {item.wing}</span>
                  <span className="text-[12px] text-gray-400 capitalize ml-auto">{item.type}</span>
                </div>
              ))}
              {selectedMinutes !== null && selectedMinutes < 200 && (
                <button className="w-full py-3 bg-[#1B4332] text-white rounded-xl text-[15px] font-semibold mt-3">Source cover →</button>
              )}
            </div>
          )}

          {/* Risk days */}
          <div className="bg-[#FEF7F0] rounded-2xl border border-[#C4704A] border-l-4 p-4">
            <p className="text-[13px] font-semibold text-[#C4704A] uppercase tracking-wide mb-2">Care minutes risk days</p>
            {[
              { date: "Saturday 18 Apr", minutes: 195, reason: "1 RN on annual leave" },
              { date: "Sunday 19 Apr", minutes: 188, reason: "3 AINs on leave — Grevillea Wing" },
            ].map((d) => (
              <div key={d.date} className="flex items-center justify-between py-2 border-b border-[#F5D5C5] last:border-0">
                <div>
                  <p className="text-[14px] font-medium text-gray-900">{d.date}</p>
                  <p className="text-[12px] text-gray-500">{d.reason}</p>
                </div>
                <span className="text-[14px] font-bold text-[#C4704A]">{d.minutes} min</span>
              </div>
            ))}
            <button onClick={() => router.push("/dashboard/operations/rostering")} className="w-full mt-3 py-2.5 border border-[#1B4332] text-[#1B4332] rounded-xl text-[14px] font-semibold">
              View rostering →
            </button>
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="px-4">
          {(["RN", "EN", "AIN"] as const).map((role) => {
            const staff: { name: string; leave: string; type: string | null }[] = role === "RN" ? [
              { name: "RN — Wing A", leave: "Annual leave 18–22 Apr", type: "annual" },
              { name: "RN — Wing B", leave: "No leave scheduled", type: null },
              { name: "RN — Night", leave: "Pending — 25 Apr (1 day)", type: "pending" },
            ] : role === "EN" ? [
              { name: "EN — Wattle Wing", leave: "Sick leave today", type: "sick" },
              { name: "EN — Grevillea Wing", leave: "No leave scheduled", type: null },
            ] : [
              { name: "AIN — Grevillea Wing", leave: "Annual leave 19 Apr", type: "annual" },
              { name: "AIN — Grevillea Wing", leave: "Annual leave 19 Apr", type: "annual" },
              { name: "AIN — Grevillea Wing", leave: "Annual leave 19 Apr", type: "annual" },
              { name: "AIN — Wattle Wing", leave: "Training 21 Apr", type: "training" },
              { name: "AIN — Wing B", leave: "No leave scheduled", type: null },
            ];

            return (
              <div key={role} className="mb-4">
                <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-2">{role}</p>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  {staff.map((m, i) => (
                    <div key={i} className={`flex items-center gap-3 px-4 py-3.5 ${i < staff.length - 1 ? "border-b border-gray-50" : ""}`}>
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: m.type ? getLeaveTypeColor(m.type) : "#E5E7EB" }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-gray-900 truncate">{m.name}</p>
                        <p className={`text-[12px] ${m.type === "pending" ? "text-[#D4A017]" : m.type === "sick" ? "text-[#F97316]" : m.type ? "text-gray-500" : "text-gray-300"}`}>{m.leave}</p>
                      </div>
                      {m.type === "pending" && <span className="text-[11px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full shrink-0">Pending</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="bg-[#F0F4F2] rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold text-gray-900">Approve leave requests</p>
              <p className="text-[12px] text-gray-500">Opens Employment Hero</p>
            </div>
            <button className="px-4 py-2 bg-[#1B4332] text-white rounded-xl text-[13px] font-semibold">Open →</button>
          </div>
        </div>
      )}

      {/* ALERTS VIEW */}
      {viewMode === "alerts" && (
        <div className="px-4 flex flex-col gap-3">
          <div className="bg-white rounded-2xl border border-l-4 border-l-[#C4704A] border-gray-100 p-4">
            <p className="text-[13px] font-semibold text-[#C4704A] uppercase tracking-wide mb-1">Care minutes risk</p>
            <p className="text-[15px] font-semibold text-gray-900 mb-1">Sunday 19 Apr — 188 min projected</p>
            <p className="text-[14px] text-gray-600 leading-relaxed mb-3">3 AINs from Grevillea Wing on annual leave simultaneously. 12 minutes below the 200 minute regulatory minimum.</p>
            <button className="w-full py-3 bg-[#1B4332] text-white rounded-xl text-[15px] font-semibold">Source cover for Sunday →</button>
          </div>

          <div className="bg-white rounded-2xl border border-l-4 border-l-[#D4A017] border-gray-100 p-4">
            <p className="text-[13px] font-semibold text-[#D4A017] uppercase tracking-wide mb-1">Leave concentration — Keeper</p>
            <p className="text-[15px] font-semibold text-gray-900 mb-1">3 Grevillea Wing AINs — same Sunday</p>
            <p className="text-[14px] text-gray-600 leading-relaxed">Third consecutive month with this pattern. May indicate a coordinated preference. Worth a conversation with the Team Leader.</p>
          </div>

          <div className="bg-white rounded-2xl border border-l-4 border-l-[#D4A017] border-gray-100 p-4">
            <p className="text-[13px] font-semibold text-[#D4A017] uppercase tracking-wide mb-1">Sick leave trend — Keeper</p>
            <p className="text-[15px] font-semibold text-gray-900 mb-1">Grevillea Wing — 40% increase in 4 cycles</p>
            <p className="text-[14px] text-gray-600 leading-relaxed mb-3">Unplanned sick leave spike correlates with PSH_08 elevation. Pattern has preceded turnover in 71% of comparable teams.</p>
            <button onClick={() => router.push("/dashboard/psh")} className="w-full py-2.5 border border-[#1B4332] text-[#1B4332] rounded-xl text-[14px] font-semibold">View PSH data →</button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Leave liability — Keeper</p>
            <p className="text-[15px] font-semibold text-gray-900 mb-1">$48K accrued across team</p>
            <p className="text-[14px] text-gray-600 leading-relaxed">4 staff have not taken leave in 6+ months. Forced leave or payout risk if not managed before year end.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Pending leave requests</p>
            {leave_current.pending.map((req, i) => (
              <div key={req.id} className={`py-3 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-[14px] font-medium text-gray-900">{req.worker_role} — {req.wing}</p>
                  <span className="text-[12px] text-gray-400 shrink-0">{req.start_date.slice(5)} · {req.days}d</span>
                </div>
                <p className={`text-[13px] ${req.creates_gap ? "text-[#C4704A]" : "text-[#2D7D73]"}`}>
                  {req.creates_gap ? "⚠ " : "✓ "}{req.impact_assessment}
                </p>
              </div>
            ))}
            <button className="w-full mt-3 py-2.5 bg-[#1B4332] text-white rounded-xl text-[14px] font-semibold">Approve in Employment Hero →</button>
          </div>
        </div>
      )}
    </div>
  );
}
