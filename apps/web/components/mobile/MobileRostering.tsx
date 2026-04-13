"use client";

import { useState } from "react";
import { ShiftCard } from "@/components/operations/ShiftCard";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { roster_today, steward_structural_finding } from "@/lib/seed-data";

export default function MobileRostering() {
  const { shifts, week, weekly_agency_cost } = roster_today;
  const totalShifts = shifts.morning.total_rostered + shifts.afternoon.total_rostered + shifts.night.total_rostered;
  const totalGaps = shifts.morning.gaps + shifts.afternoon.gaps + shifts.night.gaps;

  return (
    <div className="px-4 py-4">
      <h1 className="text-[28px] font-bold text-foreground mb-4">Rostering</h1>

      {/* Tonight hero */}
      <div className="rounded-xl p-4 mb-4 border border-border bg-card">
        <p className="text-2xl font-bold text-foreground">{totalShifts - totalGaps}/{totalShifts} shifts filled</p>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-xs text-muted-foreground">RN tonight: {shifts.night.rn_confirmed ? "✓ Confirmed" : "⚠ Gap"}</span>
          <span className="text-xs text-muted-foreground">Agency: 1 shift ($480)</span>
        </div>
      </div>

      {/* Gap alert */}
      {totalGaps > 0 && (
        <div className="rounded-xl border-l-4 border-l-[#D4A017] bg-[#FFFBF0] border border-border p-4 mb-4">
          <p className="text-sm font-semibold text-foreground mb-1">AIN gap — Grevillea Wing afternoon</p>
          <p className="text-xs text-muted-foreground mb-2">2pm–10pm · Care minutes at risk</p>
          <div className="flex gap-2">
            <button className="flex-1 text-xs font-medium py-2.5 rounded-lg bg-[#1B4332] text-white">Find cover →</button>
            <button className="flex-1 text-xs font-medium py-2.5 rounded-lg border border-border text-muted-foreground">Internal pool →</button>
          </div>
        </div>
      )}

      {/* Shifts */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">By shift</p>
      <div className="space-y-2 mb-4">
        <ShiftCard shift="morning" timeRange={shifts.morning.time} totalRostered={shifts.morning.total_rostered} gaps={shifts.morning.gaps} rnConfirmed={shifts.morning.rn_confirmed} agencyCount={shifts.morning.agency_count} staff={shifts.morning.staff} />
        <ShiftCard shift="afternoon" timeRange={shifts.afternoon.time} totalRostered={shifts.afternoon.total_rostered} gaps={shifts.afternoon.gaps} rnConfirmed={shifts.afternoon.rn_confirmed} agencyCount={shifts.afternoon.agency_count} staff={shifts.afternoon.staff} defaultExpanded />
        <ShiftCard shift="night" timeRange={shifts.night.time} totalRostered={shifts.night.total_rostered} gaps={shifts.night.gaps} rnConfirmed={shifts.night.rn_confirmed} agencyCount={shifts.night.agency_count} staff={shifts.night.staff} />
      </div>

      {/* This week mini table */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">This week</p>
      <div className="overflow-x-auto mb-4 -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          {week.map((d) => (
            <div key={d.day} className={`rounded-xl border p-3 text-center min-w-[70px] ${d.gaps > 0 ? "border-[#D4A017] bg-[#FFFBF0]" : "border-border bg-card"}`}>
              <p className="text-xs font-medium text-foreground">{d.day}</p>
              <p className="text-lg font-bold text-foreground">{d.shifts - d.gaps}/{d.shifts}</p>
              <p className="text-[10px] text-muted-foreground">${d.cost}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Steward */}
      <div className="rounded-xl p-4 border border-border bg-card">
        <div className="flex items-start gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-[hsl(var(--brand-teal))] flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-white text-[9px] font-bold">S</span>
          </div>
          <p className="text-sm font-semibold text-foreground">Steward analysis</p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
          Sunday PM RN gap is structural — {steward_structural_finding.occurrences_last_8_weeks} of 8 weeks.
          Annualised cost: ${steward_structural_finding.annualised_cost.toLocaleString()}.
        </p>
        <button className="text-xs font-medium text-[hsl(var(--brand-teal))]">View analysis →</button>
      </div>

      <div className="h-24" />
    </div>
  );
}
