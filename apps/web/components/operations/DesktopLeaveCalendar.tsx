"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { AgentPulse } from "@/components/chris/AgentPulse";
import { SituationReport } from "@/components/chris/SituationReport";
import { leave_current, facility } from "@/lib/seed-data";

const LEAVE_COLORS: Record<string, string> = {
  annual: "#3B82F6", sick: "#F97316", training: "#8B5CF6", carer: "#EC4899", rdo: "#6B7280", wc: "#EF4444",
};

const LEAVE_LABELS: Record<string, string> = {
  annual: "Annual", sick: "Sick", training: "Training", carer: "Carer's", rdo: "RDO", wc: "Workers comp",
};

function getCareMinutesColor(m: number) {
  if (m >= 215) return "#2D7D73";
  if (m >= 205) return "#D4A017";
  return "#C4704A";
}

// Build 14-day leave map from seed data
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

// Care minutes projection: 216 base, subtract per leave
function projectCareMinutes(leaveItems: { role: string }[]) {
  let minutes = 216;
  for (const l of leaveItems) {
    if (l.role === "RN") minutes -= 44;
    else if (l.role === "EN") minutes -= 11;
    else minutes -= 12;
  }
  return Math.max(minutes, 0);
}

function StatCard({ label, value, urgency = "good" }: { label: string; value: string; urgency?: "good" | "watch" | "act" }) {
  const border = urgency === "act" ? "border-l-[#C4704A]" : urgency === "watch" ? "border-l-[#D4A017]" : "border-l-[#2D7D73]";
  return (
    <div className={`bg-card rounded-xl border border-border border-l-4 ${border} p-3`}>
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

export function DesktopLeaveCalendar() {
  const router = useRouter();
  const leaveMap = buildLeaveMap();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return { date: d.toISOString().split("T")[0], dayLabel: d.toLocaleDateString("en-AU", { weekday: "short" }), dateLabel: d.getDate(), isToday: i === 0 };
  });

  const allLeave = [...leave_current.approved, ...leave_current.pending];
  const onLeaveToday = allLeave.filter((l) => l.start_date <= days[0].date && l.end_date >= days[0].date && l.status === "approved").length;
  const approvedNext14 = allLeave.filter((l) => l.status === "approved").length;
  const pendingCount = leave_current.pending.length;
  const riskDays = days.filter((d) => { const items = leaveMap[d.date]; return items && projectCareMinutes(items) < 215; }).length;

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-3xl mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-foreground">Leave & Calendar</h1>
        <p className="text-xs text-muted-foreground">{facility.name} · Employment Hero · Updated 1h ago</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        <StatCard label="On leave today" value={String(onLeaveToday)} />
        <StatCard label="Approved next 14d" value={String(approvedNext14)} />
        <StatCard label="Pending requests" value={String(pendingCount)} urgency={pendingCount > 0 ? "watch" : "good"} />
        <StatCard label="Care minutes risk days" value={String(riskDays)} urgency={riskDays > 0 ? "act" : "good"} />
        <StatCard label="Accrued liability" value={`$${(leave_current.accrued_liability.total_dollars / 1000).toFixed(0)}K`} urgency={leave_current.accrued_liability.total_dollars > 50000 ? "watch" : "good"} />
      </div>

      <AgentPulse domain="workforce" />

      {/* Situation Report */}
      <div className="mb-5">
        <SituationReport
          domain="operations"
          narrative="Leave coverage is stable this week with one exception: Sunday 19 April has three AINs on approved leave in Grevillea Wing simultaneously — projected care minutes drop to 200, 15 below the 215 regulatory target. The Steward has flagged this as the third Sunday in a row with care minutes risk from leave concentration. Two leave requests are pending DON approval — neither creates immediate coverage risk if approved."
          refreshedAt="1h ago"
          context={`${onLeaveToday} on leave today · ${pendingCount} pending`}
          signals={[{ domain: "Workforce", active: true }, { domain: "Clinical", active: true }, { domain: "Financial", active: false }, { domain: "Governance", active: false }]}
        />
      </div>

      {/* 14-day calendar strip */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Leave calendar — next 14 days</p>
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <div className="grid grid-cols-14 gap-1 mb-3" style={{ gridTemplateColumns: "repeat(14, 1fr)" }}>
          {days.map((d) => {
            const items = leaveMap[d.date] ?? [];
            const minutes = items.length > 0 ? projectCareMinutes(items) : null;
            const hasGap = minutes !== null && minutes < 200;
            const isSelected = selectedDate === d.date;

            return (
              <button
                key={d.date}
                onClick={() => setSelectedDate(isSelected ? null : d.date)}
                className={`flex flex-col items-center py-2 rounded-lg transition-all ${
                  isSelected ? "bg-[#1B4332] text-white" :
                  d.isToday ? "bg-[#F0F4F2] border border-[#2D7D73]" :
                  hasGap ? "bg-[#FEF7F0] border border-[#C4704A]" :
                  "hover:bg-muted"
                }`}
              >
                <span className={`text-[9px] ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>{d.dayLabel}</span>
                <span className={`text-sm font-bold ${isSelected ? "text-white" : "text-foreground"}`}>{d.dateLabel}</span>
                {items.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {items.slice(0, 3).map((item, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isSelected ? "white" : LEAVE_COLORS[item.type] ?? "#6B7280" }} />
                    ))}
                  </div>
                )}
                {minutes !== null && (
                  <div className="w-6 h-1 bg-muted rounded-full mt-1 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min((minutes / 215) * 100, 100)}%`, backgroundColor: isSelected ? "white" : getCareMinutesColor(minutes) }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 text-[10px] text-muted-foreground">
          {Object.entries(LEAVE_LABELS).slice(0, 5).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: LEAVE_COLORS[key] }} />
              <span>{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#C4704A]" /><span>Gap risk</span></div>
        </div>

        {/* Selected day detail */}
        {selectedDate && (leaveMap[selectedDate]?.length ?? 0) > 0 && (
          <div className={`mt-3 rounded-lg p-3 border ${projectCareMinutes(leaveMap[selectedDate] ?? []) < 200 ? "border-[#C4704A] bg-[#FEF7F0]" : "border-border bg-muted/30"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">
                {new Date(selectedDate).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "short" })}
              </span>
              <span className={`text-sm font-bold`} style={{ color: getCareMinutesColor(projectCareMinutes(leaveMap[selectedDate] ?? [])) }}>
                {projectCareMinutes(leaveMap[selectedDate] ?? [])} min projected
              </span>
            </div>
            {(leaveMap[selectedDate] ?? []).map((item, i) => (
              <div key={i} className="flex items-center gap-2 py-1">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: LEAVE_COLORS[item.type] }} />
                <span className="text-xs text-foreground">{item.role} — {item.wing}</span>
                <span className="text-[10px] text-muted-foreground ml-auto capitalize">{item.type}</span>
              </div>
            ))}
            {projectCareMinutes(leaveMap[selectedDate] ?? []) < 200 && (
              <button className="w-full mt-2 py-2 rounded-lg text-xs font-medium bg-[#1B4332] text-white hover:opacity-90">Source cover for this day →</button>
            )}
          </div>
        )}
      </div>

      {/* Staff leave detail */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Staff leave — next 14 days</p>
      <div className="space-y-3 mb-5">
        {(["RN", "EN", "AIN"] as const).map((role) => {
          const roleLeave = allLeave.filter((l) => l.worker_role === role);
          return (
            <div key={role} className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-4 py-2 bg-muted/30 border-b border-border">
                <span className="text-xs font-semibold text-foreground">{role}</span>
              </div>
              {roleLeave.length > 0 ? roleLeave.map((l) => (
                <div key={l.id} className="flex items-center gap-2 px-4 py-2.5 border-b border-border last:border-b-0">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: LEAVE_COLORS[l.leave_type] }} />
                  <span className="text-xs text-foreground flex-1">{l.worker_role} — {l.wing}</span>
                  <span className="text-xs text-muted-foreground capitalize">{l.leave_type}</span>
                  <span className="text-xs text-muted-foreground">{l.start_date === l.end_date ? l.start_date.slice(5) : `${l.start_date.slice(5)} – ${l.end_date.slice(5)}`}</span>
                  {l.status === "pending" && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">Pending</span>}
                </div>
              )) : (
                <div className="px-4 py-2.5 text-xs text-muted-foreground/50">No leave scheduled</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Concentration alert */}
      {riskDays > 0 && (
        <div className="rounded-xl border-l-4 border-l-[#D4A017] bg-[#FFFBF0] border border-border p-4 mb-5">
          <p className="text-sm font-semibold text-foreground mb-1">⚠ 3 AINs on leave same day (Sunday 19 Apr)</p>
          <p className="text-xs text-muted-foreground mb-2">Grevillea Wing afternoon shift affected · Projected care minutes: 180</p>
          <button onClick={() => router.push("/dashboard/operations/rostering")} className="text-xs font-medium text-[hsl(var(--brand-teal))]">View rostering impact →</button>
        </div>
      )}

      {/* Pending requests */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Pending leave requests</p>
      <div className="space-y-3 mb-5">
        {leave_current.pending.map((req) => (
          <div key={req.id} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-sm font-semibold text-foreground">{req.worker_role} — {req.wing}</p>
                <p className="text-xs text-muted-foreground">{req.start_date} · {req.days} day{req.days > 1 ? "s" : ""}</p>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Pending</span>
            </div>
            <p className={`text-xs mb-3 ${req.creates_gap ? "text-[#C4704A]" : "text-[#2D7D73]"}`}>
              {req.creates_gap ? "⚠ " : "✓ "}{req.impact_assessment}
            </p>
            <button className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted">
              View in Employment Hero →
            </button>
          </div>
        ))}
      </div>

      {/* Keeper intelligence */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Keeper — leave intelligence</p>
      <div className="space-y-3 mb-5">
        <div className="rounded-xl border-l-4 border-l-[#D4A017] bg-[#FFFBF0] border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-[#C4704A] flex items-center justify-center"><span className="text-white text-[9px] font-bold">K</span></div>
            <span className="text-xs font-semibold text-foreground">Sick leave trend</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
            Unplanned sick leave in Grevillea Wing has increased 40% over the last 4 cycles. This pattern has preceded voluntary turnover in comparable teams in 71% of historical cases. The PSH_08 elevation in this wing is the likely driver.
          </p>
          <button onClick={() => router.push("/dashboard/psh")} className="text-xs font-medium text-[hsl(var(--brand-teal))]">View PSH data →</button>
        </div>

        <div className="rounded-xl border-l-4 border-l-[#D4A017] bg-[#FFFBF0] border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-[#C4704A] flex items-center justify-center"><span className="text-white text-[9px] font-bold">K</span></div>
            <span className="text-xs font-semibold text-foreground">Leave concentration</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            3 staff from the same wing have leave on the same Sunday for the third consecutive month. This may indicate a coordinated pattern worth discussing with the team leader.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-[#C4704A] flex items-center justify-center"><span className="text-white text-[9px] font-bold">K</span></div>
            <span className="text-xs font-semibold text-foreground">Leave liability</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            ${leave_current.accrued_liability.total_dollars.toLocaleString()} in accrued leave liability across the team. {leave_current.accrued_liability.staff_not_taken_leave_6m} staff have not taken leave in 6+ months — forced leave risk if not managed.
          </p>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
