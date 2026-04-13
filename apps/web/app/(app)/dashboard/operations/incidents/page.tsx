"use client";

import { useState } from "react";
import { Plus, AlertTriangle } from "lucide-react";
import { IncidentCard } from "@/components/operations/IncidentCard";
import { IncidentLogForm, type IncidentFormData } from "@/components/operations/IncidentLogForm";
import { AgentPulse } from "@/components/chris/AgentPulse";
import { SituationReport } from "@/components/chris/SituationReport";
import { operationsReport } from "@/lib/chris/situation-reports";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { incidents_closed_ytd, facility, sirs_events } from "@/lib/seed-data";
import { useMobile } from "@/lib/hooks/useMobile";
import MobileIncidents from "@/components/mobile/MobileIncidents";

function StatCard({ label, value, urgency = "good" }: { label: string; value: string; urgency?: "good" | "watch" | "act" }) {
  const border = urgency === "act" ? "border-l-[#C4704A]" : urgency === "watch" ? "border-l-[#D4A017]" : "border-l-[#2D7D73]";
  return (
    <div className={`bg-card rounded-xl border border-border border-l-4 ${border} p-3`}>
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

export default function IncidentsPage() {
  const mobile = useMobile();
  if (mobile) return <MobileIncidents />;

  const [showForm, setShowForm] = useState(false);

  const openIncidents = 0;
  const requiresSirs = 0;
  const closedThisMonth = incidents_closed_ytd.filter((i) => i.date >= "2026-03-01").length;
  const avgDaysToClose = Math.round(incidents_closed_ytd.reduce((s, i) => s + i.days_to_close, 0) / incidents_closed_ytd.length * 10) / 10;
  const sirsYtd = sirs_events.length;
  const agencyIncidents = incidents_closed_ytd.filter((i) => i.agency_shift).length;

  function handleSubmit(data: IncidentFormData) {
    console.log("[Incidents] New incident logged:", data);
  }

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[22px] md:text-xl font-semibold text-foreground">Incidents</h1>
          <p className="text-xs text-muted-foreground">{facility.name} · Aged Care Act 2024</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-xs font-medium px-4 py-2.5 rounded-xl bg-[#1B4332] text-white hover:opacity-90"
        >
          <Plus className="w-3.5 h-3.5" /> Log new incident
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        <StatCard label="Open incidents" value={String(openIncidents)} urgency={openIncidents > 0 ? "act" : "good"} />
        <StatCard label="Requiring SIRS" value={String(requiresSirs)} urgency={requiresSirs > 0 ? "act" : "good"} />
        <StatCard label="Closed this month" value={String(closedThisMonth)} />
        <StatCard label="Avg days to close" value={String(avgDaysToClose)} />
        <StatCard label="SIRS notifications YTD" value={String(sirsYtd)} />
      </div>

      <AgentPulse domain="operations" />

      {/* Situation Report */}
      <div className="mb-5">
        <SituationReport
          domain="operations"
          narrative="No open incidents requiring urgent action. SIRS pattern analysis shows 2 of 4 notifications linked to agency shift coverage — review the Steward's structural recommendation."
          refreshedAt="2h ago"
          context="0 open · 4 SIRS YTD"
          signals={[
            { domain: "Clinical", active: false },
            { domain: "Workforce", active: true },
            { domain: "Financial", active: false },
            { domain: "Governance", active: false },
          ]}
        />
      </div>

      {/* Open incidents */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Open incidents</p>
      {openIncidents === 0 ? (
        <div className="bg-card rounded-xl border border-border p-6 text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-[#D4EDDD] flex items-center justify-center mx-auto mb-3">
            <span className="text-lg">✓</span>
          </div>
          <p className="text-sm text-foreground font-medium mb-1">No open incidents</p>
          <p className="text-xs text-muted-foreground">All current incidents have been assessed and closed.</p>
        </div>
      ) : null}

      {/* Pattern analysis */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <ChrisAvatar size="small" />
          <p className="text-sm font-semibold text-foreground">Pattern analysis</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed font-serif-accent mb-2">
          {agencyIncidents} of {incidents_closed_ytd.length} incidents occurred on agency-covered shifts. This correlation is consistent with the Keeper&apos;s finding that unfamiliar staff in dementia wings have higher incident rates.
        </p>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]">CAUSAL</span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dashed border-[hsl(var(--brand-amber))] text-muted-foreground">STRONG</span>
        </div>
        <button className="text-xs font-medium text-[hsl(var(--brand-teal))]">Add to corrective action →</button>
      </div>

      {/* Closed this month */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Incident register</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-5">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 text-muted-foreground font-medium">ID</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Type</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Date</th>
              <th className="text-left p-3 text-muted-foreground font-medium">Wing</th>
              <th className="text-center p-3 text-muted-foreground font-medium">SIRS</th>
              <th className="text-center p-3 text-muted-foreground font-medium">Days</th>
              <th className="text-center p-3 text-muted-foreground font-medium">Agency</th>
            </tr>
          </thead>
          <tbody>
            {incidents_closed_ytd.map((inc) => (
              <tr key={inc.id} className="border-b border-border last:border-b-0">
                <td className="p-3 font-medium text-foreground">{inc.id}</td>
                <td className="p-3 text-muted-foreground">{inc.type}</td>
                <td className="p-3 text-muted-foreground">{inc.date}</td>
                <td className="p-3 text-muted-foreground">{inc.wing}</td>
                <td className="p-3 text-center">
                  {inc.sirs_category ? (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${inc.sirs_category === 1 ? "bg-[#C4704A] text-white" : "bg-[#D4A017] text-white"}`}>
                      Cat {inc.sirs_category}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )}
                </td>
                <td className="p-3 text-center text-muted-foreground">{inc.days_to_close}</td>
                <td className="p-3 text-center">
                  {inc.agency_shift && <span className="w-[18px] h-[18px] rounded-full bg-[#D4A017] text-white text-[10px] font-bold inline-flex items-center justify-center">A</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="h-16" />

      {/* Incident log form — slide-out panel */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowForm(false)} />
          <IncidentLogForm onClose={() => setShowForm(false)} onSubmit={handleSubmit} />
        </>
      )}
    </div>
  );
}
