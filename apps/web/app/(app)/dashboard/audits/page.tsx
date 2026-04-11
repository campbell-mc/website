"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Mic, AlertTriangle } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { AUDIT_TYPES, type AuditType } from "@/components/audits/audit-data";

export default function AuditsPage() {
  const router = useRouter();
  const overdue = AUDIT_TYPES.filter((a) => a.status === "overdue");
  const dueSoon = AUDIT_TYPES.filter((a) => a.status === "due_soon");
  const onSchedule = AUDIT_TYPES.filter((a) => a.status === "on_schedule");

  function renderRow(audit: AuditType) {
    const dot = audit.status === "overdue" ? "bg-[hsl(var(--brand-terracotta))]" : audit.status === "due_soon" ? "bg-[hsl(var(--brand-amber))]" : "bg-[hsl(var(--brand-teal))]";
    const dueText = audit.daysUntilDue < 0
      ? `${Math.abs(audit.daysUntilDue)} days overdue`
      : audit.daysUntilDue <= 7
        ? `Due in ${audit.daysUntilDue} days`
        : `Due in ${audit.daysUntilDue} days`;

    return (
      <button
        key={audit.id}
        onClick={() => router.push(`/dashboard/audits/${audit.id}`)}
        className={`w-full text-left px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors ${audit.status === "overdue" ? "bg-[rgba(196,112,74,0.04)]" : ""}`}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shrink-0 ${dot} ${audit.status === "overdue" ? "animate-pulse" : ""}`} />
            <span className="text-sm font-medium text-foreground">{audit.name}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
        </div>
        <div className="ml-4 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">
            {audit.frequency} · Last: {audit.lastCompleted} · Score: {audit.lastScore}%
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-medium ${audit.status === "overdue" ? "text-[hsl(var(--brand-terracotta))]" : audit.status === "due_soon" ? "text-[hsl(var(--brand-amber))]" : "text-muted-foreground"}`}>
              {dueText}
            </span>
            {audit.openNonConformances > 0 && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.12)] text-[hsl(var(--brand-amber))]">
                {audit.openNonConformances} open
              </span>
            )}
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard/clinical")} className="p-1 -ml-1 hover:bg-muted rounded-lg"><ChevronLeft className="w-5 h-5 text-foreground" /></button>
          <div>
            <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Clinical Audits</p>
            <p className="text-[10px] text-muted-foreground">The Holy Grail Bowral · Mandatory audit suite</p>
          </div>
        </div>
        <button onClick={() => router.push("/dashboard/coach")} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted"><Mic className="w-3.5 h-3.5" /> Ask CHRIS</button>
      </div>

      {/* Overdue */}
      {overdue.length > 0 && (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-2 text-[hsl(var(--brand-terracotta))]">🔴 Overdue · {overdue.length}</p>
          {overdue.map((a) => (
            <div key={a.id} className="rounded-xl p-4 border border-border border-l-4 border-l-[hsl(var(--brand-terracotta))] mb-3" style={{ background: "rgba(196,112,74,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[hsl(var(--brand-terracotta))] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{a.name} · {Math.abs(a.daysUntilDue)} days overdue</p>
                  <p className="text-xs text-muted-foreground mb-2">{a.frequency} · Last: {a.lastCompleted} · Score: {a.lastScore}%</p>
                  <div className="flex items-start gap-2 p-2 rounded-lg mb-2" style={{ background: "rgba(27,67,50,0.05)" }}>
                    <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">CHRIS can guide you through this audit now by voice. Takes about 45 minutes. Non-conformances queue automatically.</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => router.push(`/dashboard/audits/${a.id}`)} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Start audit now →</button>
                    <button onClick={() => router.push(`/dashboard/audits/${a.id}`)} className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">View detail →</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Due soon */}
      {dueSoon.length > 0 && (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-2 mt-4 text-[hsl(var(--brand-amber))]">🟡 Due soon · {dueSoon.length}</p>
          <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
            {dueSoon.map(renderRow)}
          </div>
        </>
      )}

      {/* On schedule */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2 mt-4">All audits</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-16">
        {AUDIT_TYPES.map(renderRow)}
      </div>
    </div>
  );
}
