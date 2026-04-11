"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Mic, AlertTriangle, Clock, CheckCircle, MoreHorizontal } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

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
            <p className="text-[10px] text-muted-foreground">The Holy Grail Bowral · Aged Care Act 2024</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">
          <Mic className="w-3.5 h-3.5" /> Ask CHRIS
        </button>
      </div>

      {/* Status strip */}
      <div className="flex gap-2 mb-4">
        <div className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
          <p className="text-lg font-bold text-[hsl(var(--brand-terracotta))]">0</p>
          <p className="text-[9px] text-muted-foreground">Open Cat 1</p>
        </div>
        <div className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
          <p className="text-lg font-bold text-[hsl(var(--brand-amber))]">1</p>
          <p className="text-[9px] text-muted-foreground">Open Cat 2</p>
        </div>
        <div className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
          <p className="text-lg font-bold text-[hsl(var(--brand-teal))]">2</p>
          <p className="text-[9px] text-muted-foreground">Closed 90d</p>
        </div>
      </div>

      {/* OPEN ITEMS — each is an action card */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Open items</p>

      {/* Cat 2 — open */}
      <div className="bg-card rounded-xl p-4 shadow-warm border border-border border-l-4 border-l-[hsl(var(--brand-amber))] mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.12)] text-[hsl(var(--brand-amber))]">Category 2 · 30 day</span>
          <span className="text-xs text-muted-foreground font-mono">22 days remaining</span>
        </div>
        <div className="flex items-start gap-3 mb-3">
          <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground leading-relaxed mb-1">
              Fall with hip fracture — Wing A resident. Reported 8 days ago. CHRIS draft is ready. You need to add resident details and approve before submission.
            </p>
            <p className="text-[10px] text-muted-foreground">Incident: 3 Apr · Reported: 3 Apr · Deadline: 3 May</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard/sirs/cat2-hip")} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
            Review draft →
          </button>
          <button className="text-xs text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* No more open items message */}
      <div className="bg-card rounded-xl p-4 border border-border mb-6 text-center">
        <CheckCircle className="w-5 h-5 text-[hsl(var(--brand-teal))] mx-auto mb-1" />
        <p className="text-xs text-muted-foreground">No Category 1 items open. All Cat 1 deadlines met.</p>
      </div>

      {/* CHRIS cross-domain signal */}
      <div className="bg-card rounded-xl p-4 shadow-warm border border-border mb-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]">CAUSAL</span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dashed border-[hsl(var(--brand-amber))] text-muted-foreground">STRONG</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Clinical</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Workforce</span>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">SIRS cluster on agency shifts — pattern, not systemic failure</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">2 of 3 SIRS incidents this quarter occurred on afternoon shifts with &gt;35% agency coverage. Permanent staff shifts: zero SIRS events. This is an agency onboarding gap presenting as a SIRS risk.</p>
        <div className="flex items-center gap-2">
          <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Add to corrective action →</button>
          <button className="text-[11px] text-muted-foreground hover:text-foreground">Not relevant</button>
        </div>
      </div>

      {/* CLOSED — compact */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Closed — last 90 days</p>
      {[
        { type: "Fall with injury", date: "15 Mar", ref: "SIRS-2026-0412", outcome: "Corrective action complete" },
        { type: "Medication error", date: "28 Feb", ref: "SIRS-2026-0389", outcome: "Process updated" },
      ].map((item) => (
        <div key={item.ref} className="bg-card rounded-lg px-4 py-3 border border-border mb-2 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-foreground">{item.type} · {item.date}</p>
            <p className="text-[10px] text-muted-foreground">{item.ref} · {item.outcome}</p>
          </div>
          <CheckCircle className="w-4 h-4 text-[hsl(var(--brand-teal))] shrink-0" />
        </div>
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
