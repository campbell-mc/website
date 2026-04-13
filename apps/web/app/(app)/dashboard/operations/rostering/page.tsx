"use client";

import { useRouter } from "next/navigation";
import { Users, Clock, DollarSign, AlertTriangle, Calendar } from "lucide-react";
import { ShiftCard } from "@/components/operations/ShiftCard";
import { AgentPulse } from "@/components/chris/AgentPulse";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { operationsReport } from "@/lib/chris/situation-reports";
import { SituationReport } from "@/components/chris/SituationReport";
import { roster_today, steward_structural_finding, facility } from "@/lib/seed-data";
import { useMobile } from "@/lib/hooks/useMobile";
import MobileRostering from "@/components/mobile/MobileRostering";

function StatCard({ label, value, sub, urgency = "good" }: { label: string; value: string; sub?: string; urgency?: "good" | "watch" | "act" }) {
  const border = urgency === "act" ? "border-l-[#C4704A]" : urgency === "watch" ? "border-l-[#D4A017]" : "border-l-[#2D7D73]";
  return (
    <div className={`bg-card rounded-xl border border-border border-l-4 ${border} p-3`}>
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      {sub && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function RosteringPage() {
  const router = useRouter();
  const mobile = useMobile();
  if (mobile) return <MobileRostering />;

  const { shifts, week, weekly_agency_cost, weekly_agency_pct, next_7_days_gaps } = roster_today;
  const totalShiftsToday = shifts.morning.total_rostered + shifts.afternoon.total_rostered + shifts.night.total_rostered;
  const totalGapsToday = shifts.morning.gaps + shifts.afternoon.gaps + shifts.night.gaps;
  const agencyPct = Math.round(weekly_agency_pct * 100);

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[22px] md:text-xl font-semibold text-foreground">Rostering</h1>
        <p className="text-xs text-muted-foreground">{facility.name} · Deputy · Updated 8 min ago ✓</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        <StatCard label="Shifts filled today" value={`${totalShiftsToday - totalGapsToday}/${totalShiftsToday}`} urgency={totalGapsToday > 0 ? "watch" : "good"} />
        <StatCard label="RN tonight" value={shifts.night.rn_confirmed ? "✓ Confirmed" : "⚠ Gap"} urgency={shifts.night.rn_confirmed ? "good" : "act"} />
        <StatCard label="Agency % this week" value={`${agencyPct}%`} urgency={agencyPct > 25 ? "act" : agencyPct > 15 ? "watch" : "good"} />
        <StatCard label="Agency cost this week" value={`$${weekly_agency_cost}`} />
        <StatCard label="Next 7d gaps" value={String(next_7_days_gaps)} urgency={next_7_days_gaps > 0 ? "watch" : "good"} />
      </div>

      <AgentPulse domain="operations" />

      {/* Situation Report */}
      <div className="mb-5">
        <SituationReport
          domain="operations"
          narrative={operationsReport.narrative}
          refreshedAt={operationsReport.refreshedAt}
          context={operationsReport.context}
          signals={operationsReport.signals}
        />
      </div>

      {/* Needs your attention */}
      {totalGapsToday > 0 && (
        <>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Needs your attention</p>
          <div className="space-y-3 mb-5">
            <div className="rounded-xl border-l-4 border-l-[#D4A017] bg-[#FFFBF0] border border-border p-4">
              <p className="text-sm font-semibold text-foreground mb-1">Tonight&apos;s unfilled AIN shift — Grevillea Wing</p>
              <p className="text-xs text-muted-foreground mb-2">Afternoon shift 2pm–10pm · Care minutes impact: 14 minutes at risk</p>
              <div className="flex gap-2">
                <button className="text-xs font-medium px-3 py-2 rounded-lg bg-[#1B4332] text-white hover:opacity-90">Find agency cover →</button>
                <button className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted">Post to internal pool →</button>
              </div>
            </div>
            <div className="rounded-xl border-l-4 border-l-[#D4A017] bg-[#FFFBF0] border border-border p-4">
              <p className="text-sm font-semibold text-foreground mb-1">Structural Sunday PM RN gap — 6 of last 8 weeks</p>
              <p className="text-xs text-muted-foreground mb-2">Running $190 agency premium per shift · Steward recommendation ready</p>
              <button className="text-xs font-medium px-3 py-2 rounded-lg bg-[#1B4332] text-white hover:opacity-90">View Steward analysis →</button>
            </div>
          </div>
        </>
      )}

      {/* Today's roster by shift */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Today&apos;s roster — by shift</p>
      <div className="space-y-3 mb-5">
        <ShiftCard shift="morning" timeRange={shifts.morning.time} totalRostered={shifts.morning.total_rostered} gaps={shifts.morning.gaps} rnConfirmed={shifts.morning.rn_confirmed} agencyCount={shifts.morning.agency_count} staff={shifts.morning.staff} />
        <ShiftCard shift="afternoon" timeRange={shifts.afternoon.time} totalRostered={shifts.afternoon.total_rostered} gaps={shifts.afternoon.gaps} rnConfirmed={shifts.afternoon.rn_confirmed} agencyCount={shifts.afternoon.agency_count} staff={shifts.afternoon.staff} defaultExpanded />
        <ShiftCard shift="night" timeRange={shifts.night.time} totalRostered={shifts.night.total_rostered} gaps={shifts.night.gaps} rnConfirmed={shifts.night.rn_confirmed} agencyCount={shifts.night.agency_count} staff={shifts.night.staff} />
      </div>

      {/* This week overview */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">This week</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-5">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-border">
            <th className="text-left p-3 text-muted-foreground font-medium">Day</th>
            <th className="text-center p-3 text-muted-foreground font-medium">Shifts</th>
            <th className="text-center p-3 text-muted-foreground font-medium">Gaps</th>
            <th className="text-center p-3 text-muted-foreground font-medium">Agency</th>
            <th className="text-right p-3 text-muted-foreground font-medium">Cost</th>
          </tr></thead>
          <tbody>
            {week.map((d) => (
              <tr key={d.day} className={`border-b border-border last:border-b-0 ${d.gaps > 0 ? "bg-[#FFFBF0]" : ""}`}>
                <td className="p-3 font-medium text-foreground">{d.day}</td>
                <td className="p-3 text-center text-muted-foreground">{d.shifts}</td>
                <td className={`p-3 text-center font-medium ${d.gaps > 0 ? "text-[#D4A017]" : "text-muted-foreground"}`}>{d.gaps}</td>
                <td className="p-3 text-center text-muted-foreground">{d.agency}</td>
                <td className="p-3 text-right font-medium text-foreground">${d.cost}</td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr className="bg-muted/50">
            <td colSpan={4} className="p-3 text-xs font-medium text-muted-foreground">Total agency cost</td>
            <td className="p-3 text-right text-xs font-bold text-foreground">${week.reduce((s, d) => s + d.cost, 0)}</td>
          </tr></tfoot>
        </table>
      </div>

      {/* Steward analysis */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-[hsl(var(--brand-teal))] flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">S</span>
          </div>
          <p className="text-sm font-semibold text-foreground">Steward analysis</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed font-serif-accent mb-3">
          {steward_structural_finding.evidence}. Cost: ${steward_structural_finding.agency_cost_per_shift}/shift
          (${steward_structural_finding.premium_per_shift} premium). Annualised: ${steward_structural_finding.annualised_cost.toLocaleString()}.
        </p>
        <p className="text-xs text-muted-foreground mb-3">{steward_structural_finding.recommendation}</p>
        <div className="flex gap-2">
          <button className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">View full analysis →</button>
          <button className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted">Add to action plan →</button>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
