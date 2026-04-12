"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Mic, AlertTriangle, Clock, CheckCircle, MoreHorizontal } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { sirs_events, facility } from "@/lib/seed-data";

const openEvents = sirs_events.filter((e) => e.status !== "closed");
const closedEvents = sirs_events.filter((e) => e.status === "closed");
const cat1Open = openEvents.filter((e) => e.category === 1).length;
const cat2Open = openEvents.filter((e) => e.category === 2).length;

export default function SIRSPage() {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      {/* Header — back to Clinical CC */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard/clinical")} className="p-1 -ml-1 hover:bg-muted rounded-lg">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">SIRS Register</p>
            <p className="text-[10px] text-muted-foreground">{facility.name} · Aged Care Act 2024</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">
          <Mic className="w-3.5 h-3.5" /> Ask CHRIS
        </button>
      </div>

      {/* Status strip */}
      <div className="flex gap-2 mb-4">
        <div className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
          <p className="text-lg font-bold text-[hsl(var(--brand-terracotta))]">{cat1Open}</p>
          <p className="text-[9px] text-muted-foreground">Open Cat 1</p>
        </div>
        <div className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
          <p className="text-lg font-bold text-[hsl(var(--brand-amber))]">{cat2Open}</p>
          <p className="text-[9px] text-muted-foreground">Open Cat 2</p>
        </div>
        <div className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
          <p className="text-lg font-bold text-[hsl(var(--brand-teal))]">{closedEvents.length}</p>
          <p className="text-[9px] text-muted-foreground">Closed YTD</p>
        </div>
      </div>

      {/* OPEN ITEMS */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Open items</p>

      {openEvents.length > 0 ? openEvents.map((evt) => (
        <div key={evt.id} className="bg-card rounded-xl p-4 shadow-warm border border-border border-l-4 border-l-[hsl(var(--brand-amber))] mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.12)] text-[hsl(var(--brand-amber))]">Category {evt.category} · {evt.category === 1 ? "24h" : "30 day"}</span>
            <span className="text-xs text-muted-foreground font-mono">{Math.max(0, Math.ceil((new Date(evt.deadline).getTime() - Date.now()) / 86400000))} days remaining</span>
          </div>
          <div className="flex items-start gap-3 mb-3">
            <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground leading-relaxed mb-1">
                {evt.incident_type.replace(/_/g, " ")} — {evt.wing}. CHRIS draft is ready for review.
              </p>
              <p className="text-[10px] text-muted-foreground">Incident: {evt.incident_date} · Deadline: {evt.deadline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push(`/dashboard/sirs/${evt.id}`)} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Review draft →</button>
            <button className="text-xs text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
        </div>
      )) : (
        <div className="bg-card rounded-xl p-4 border border-border mb-6 text-center">
          <CheckCircle className="w-5 h-5 text-[hsl(var(--brand-teal))] mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">No open SIRS items. All {sirs_events.length} events this period submitted on time. Average days to submit: {Math.round(sirs_events.reduce((sum, e) => sum + (e.days_to_submit || 0), 0) / sirs_events.length)}.</p>
        </div>
      )}

      {/* CHRIS cross-domain signal */}
      <div className="bg-card rounded-xl p-4 shadow-warm border border-border mb-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]">CAUSAL</span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dashed border-[hsl(var(--brand-amber))] text-muted-foreground">STRONG</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Clinical</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Workforce</span>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">SIRS cluster on agency shifts — workforce-clinical convergence</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">{sirs_events.filter((e) => e.agency_shift).length} of {sirs_events.length} SIRS events occurred on shifts with agency coverage. Wing B bathroom falls pattern: 3 of 5 Wing B falls occurred in bathrooms on high-agency shifts. Agency onboarding corrective action from SIRS-003 is still in progress.</p>
        <div className="flex items-center gap-2">
          <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Add to corrective action →</button>
          <button className="text-[11px] text-muted-foreground hover:text-foreground">Not relevant</button>
        </div>
      </div>

      {/* CLOSED — compact */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Closed — YTD ({closedEvents.length})</p>
      {closedEvents.map((evt) => (
        <button key={evt.id} onClick={() => router.push(`/dashboard/sirs/${evt.id}`)} className="w-full bg-card rounded-lg px-4 py-3 border border-border mb-2 flex items-center justify-between hover:bg-muted/50 text-left">
          <div>
            <p className="text-xs font-medium text-foreground">{evt.incident_type.replace(/_/g, " ")} · {evt.incident_date} · {evt.wing}</p>
            <p className="text-[10px] text-muted-foreground">{evt.id} · Submitted {evt.submitted_date} ({evt.days_to_submit}d){evt.agency_shift ? " · Agency shift" : ""}</p>
          </div>
          <CheckCircle className="w-4 h-4 text-[hsl(var(--brand-teal))] shrink-0" />
        </button>
      ))}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2 mt-4 mb-16">
        <button onClick={() => router.push("/dashboard/sirs/new")} className="bg-card rounded-lg px-3 py-2.5 border border-border hover:shadow-warm text-left flex items-center gap-2">
          <span className="text-sm">📋</span>
          <span className="text-xs font-medium text-foreground">+ Report incident</span>
        </button>
        <button onClick={() => router.push("/dashboard/sirs/deadlines")} className="bg-card rounded-lg px-3 py-2.5 border border-border hover:shadow-warm text-left flex items-center gap-2">
          <span className="text-sm">⏱</span>
          <span className="text-xs font-medium text-foreground">All SIRS deadlines</span>
        </button>
      </div>
    </div>
  );
}
