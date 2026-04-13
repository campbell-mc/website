"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { IncidentLogForm, type IncidentFormData } from "@/components/operations/IncidentLogForm";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { incidents_closed_ytd, sirs_events } from "@/lib/seed-data";

export default function MobileIncidents() {
  const [showForm, setShowForm] = useState(false);

  const closedThisMonth = incidents_closed_ytd.filter((i) => i.date >= "2026-03-01").length;
  const avgDays = Math.round(incidents_closed_ytd.reduce((s, i) => s + i.days_to_close, 0) / incidents_closed_ytd.length * 10) / 10;
  const agencyIncidents = incidents_closed_ytd.filter((i) => i.agency_shift).length;

  function handleSubmit(data: IncidentFormData) {
    console.log("[Incidents] New incident:", data);
    setShowForm(false);
  }

  return (
    <div className="px-4 py-4 pb-24">
      <h1 className="text-lg font-semibold text-foreground mb-4">Incidents</h1>

      {/* Stat grid 2x2 */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-2xl font-bold text-foreground">0</p>
          <p className="text-[10px] text-muted-foreground">Open</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-2xl font-bold text-foreground">0</p>
          <p className="text-[10px] text-muted-foreground">Requiring SIRS</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{closedThisMonth}</p>
          <p className="text-[10px] text-muted-foreground">Closed MTD</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{avgDays}</p>
          <p className="text-[10px] text-muted-foreground">Avg days</p>
        </div>
      </div>

      {/* Log incident CTA */}
      <button
        onClick={() => setShowForm(true)}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-white bg-[#1B4332] hover:opacity-90 mb-4"
        style={{ minHeight: "56px" }}
      >
        <Plus className="w-4 h-4" /> Log new incident
      </button>

      {/* Pattern analysis */}
      <div className="rounded-xl p-4 border border-border bg-card mb-4">
        <div className="flex items-start gap-2 mb-2">
          <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-foreground">Pattern analysis</p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
          {agencyIncidents} of {incidents_closed_ytd.length} incidents on agency-covered shifts. Consistent with Keeper&apos;s finding on unfamiliar staff in dementia wings.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]">CAUSAL</span>
          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border border-dashed border-[hsl(var(--brand-amber))] text-muted-foreground">STRONG</span>
        </div>
      </div>

      {/* Closed this month */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recent incidents</p>
      <div className="space-y-2">
        {incidents_closed_ytd.slice(0, 5).map((inc) => (
          <div key={inc.id} className="bg-card rounded-xl border border-border p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-foreground">{inc.type}</span>
              {inc.sirs_category && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${inc.sirs_category === 1 ? "bg-[#C4704A] text-white" : "bg-[#D4A017] text-white"}`}>
                  Cat {inc.sirs_category}
                </span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">{inc.id} · {inc.date} · {inc.wing} · {inc.days_to_close}d to close</p>
            {inc.agency_shift && <span className="text-[10px] text-[#D4A017] font-medium mt-0.5 block">Agency shift</span>}
          </div>
        ))}
      </div>

      {/* Full-screen incident form */}
      {showForm && (
        <IncidentLogForm onClose={() => setShowForm(false)} onSubmit={handleSubmit} mobile />
      )}
    </div>
  );
}
