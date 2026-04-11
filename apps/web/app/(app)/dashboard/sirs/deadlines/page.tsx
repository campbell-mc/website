"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Mic } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

export default function SIRSDeadlinesPage() {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard/sirs")} className="p-1 -ml-1 hover:bg-muted rounded-lg"><ChevronLeft className="w-5 h-5 text-foreground" /></button>
          <div>
            <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">SIRS Deadlines</p>
            <p className="text-[10px] text-muted-foreground">Harbison Bowral · Active and upcoming</p>
          </div>
        </div>
        <button onClick={() => router.push("/dashboard/coach")} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted"><Mic className="w-3.5 h-3.5" /> Ask CHRIS</button>
      </div>

      {/* Active */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Active deadlines</p>
      <div className="bg-card rounded-xl p-4 border border-border border-l-4 border-l-[hsl(var(--brand-amber))] mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.12)] text-[hsl(var(--brand-amber))]">Cat 2</span>
          <span className="text-xs text-muted-foreground font-mono">22 days remaining ✅</span>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Fall with hip fracture</p>
        <p className="text-xs text-muted-foreground mb-2">Incident: 3 Apr · Deadline: 3 May · Status: Draft ready</p>
        <button onClick={() => router.push("/dashboard/sirs/cat2-hip")} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Review draft →</button>
      </div>

      {/* Completed */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2 mt-4">Completed this quarter</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
        {[
          { type: "Fall with injury", date: "15 Mar", submitted: "18 Mar", ref: "SIRS-2026-0412", days: 3 },
          { type: "Medication error", date: "28 Feb", submitted: "5 Mar", ref: "SIRS-2026-0389", days: 5 },
        ].map((item, i) => (
          <div key={i} className={`flex items-center justify-between px-4 py-3 ${i === 0 ? "border-b border-border" : ""}`}>
            <div>
              <p className="text-xs font-medium text-foreground">{item.type} · {item.date}</p>
              <p className="text-[10px] text-muted-foreground">Submitted {item.submitted} · {item.ref} · {item.days} days</p>
            </div>
            <span className="text-xs text-[hsl(var(--brand-teal))]">✅</span>
          </div>
        ))}
      </div>

      {/* YTD summary */}
      <div className="bg-card rounded-xl p-4 border border-border mb-4">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Year to date</p>
        <div className="grid grid-cols-2 gap-3">
          <div><p className="text-lg font-bold text-foreground">4</p><p className="text-[9px] text-muted-foreground">Total SIRS events</p></div>
          <div><p className="text-lg font-bold text-[hsl(var(--brand-teal))]">0</p><p className="text-[9px] text-muted-foreground">Cat 1 events</p></div>
          <div><p className="text-lg font-bold text-foreground">4</p><p className="text-[9px] text-muted-foreground">Cat 2 events</p></div>
          <div><p className="text-lg font-bold text-[hsl(var(--brand-teal))]">8.2d</p><p className="text-[9px] text-muted-foreground">Avg submission time</p></div>
        </div>
      </div>

      {/* CHRIS */}
      <div className="rounded-xl p-4 mb-16" style={{ background: "rgba(27,67,50,0.05)" }}>
        <div className="flex items-start gap-2">
          <ChrisAvatar size="small" className="shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">All current SIRS obligations are on track. Your average submission time of 8.2 days is well within the 30-day window. No Category 1 events this year — all deadlines met.</p>
        </div>
        <button className="mt-2 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">Export SIRS history for audit →</button>
      </div>
    </div>
  );
}
