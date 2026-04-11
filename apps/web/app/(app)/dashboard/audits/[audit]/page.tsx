"use client";

import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Mic, ChevronDown } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { getAuditById } from "@/components/audits/audit-data";
import { useState } from "react";

export default function AuditDetailPage() {
  const router = useRouter();
  const params = useParams();
  const auditId = params.audit as string;
  const audit = getAuditById(auditId);
  const [showHistory, setShowHistory] = useState(false);

  if (!audit) {
    return <div className="p-8 text-center"><p>Audit not found: {auditId}</p><button onClick={() => router.push("/dashboard/audits")} className="mt-4 text-sm text-[hsl(var(--brand-teal))]">← Back</button></div>;
  }

  const statusColor = audit.status === "overdue" ? "hsl(var(--brand-terracotta))" : audit.status === "due_soon" ? "hsl(var(--brand-amber))" : "hsl(var(--brand-teal))";
  const statusLabel = audit.status === "overdue" ? `🔴 OVERDUE · ${Math.abs(audit.daysUntilDue)} days` : audit.status === "due_soon" ? `⚠️ Due in ${audit.daysUntilDue} days` : `✅ On schedule`;

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard/audits")} className="p-1 -ml-1 hover:bg-muted rounded-lg"><ChevronLeft className="w-5 h-5 text-foreground" /></button>
          <div>
            <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">{audit.name}</p>
            <p className="text-[10px] text-muted-foreground">Harbison Bowral · {audit.frequency} · Next due: {audit.nextDue}</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted"><Mic className="w-3.5 h-3.5" /> Ask CHRIS</button>
      </div>

      {/* Status */}
      <div className="flex items-baseline gap-4 mb-5">
        <span className="text-3xl font-extrabold" style={{ color: statusColor }}>{audit.lastScore}%</span>
        <div>
          <p className="text-xs font-medium" style={{ color: statusColor }}>{statusLabel}</p>
          <p className="text-[10px] text-muted-foreground">Last: {audit.lastCompleted} · {audit.lastCriteria.met}/{audit.lastCriteria.total} criteria</p>
        </div>
      </div>

      {/* Section 1: Last Audit Results */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Last audit results</p>
      <div className="bg-card rounded-xl border border-border mb-4 overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-xs font-medium text-foreground">{audit.lastCompleted} · {audit.lastCriteria.met}/{audit.lastCriteria.total} · {audit.lastScore}%</p>
          <p className="text-[10px] text-muted-foreground">Completed via CHRIS Coach voice audit · 38 min</p>
        </div>
        {audit.domains.map((domain, i) => {
          const isOk = Math.random() > 0.2; // Demo: most domains pass
          return (
            <div key={i} className={`flex items-center justify-between px-4 py-2 text-xs ${i < audit.domains.length - 1 ? "border-b border-border" : ""}`}>
              <span className="text-foreground">{domain}</span>
              <span className={isOk ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-amber))]"}>{isOk ? "✅ Met" : "⚠️ 1 gap"}</span>
            </div>
          );
        })}
      </div>

      {/* Section 2: Trend */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Trend</p>
      <div className="bg-card rounded-xl p-4 border border-border mb-4">
        <div className="flex items-end gap-1 h-20">
          {audit.history.map((h, i) => {
            const isLast = i === audit.history.length - 1;
            const color = h.score >= 95 ? "hsl(var(--brand-teal))" : h.score >= 85 ? "hsl(var(--brand-amber))" : "hsl(var(--brand-terracotta))";
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <span className={`text-[8px] ${isLast ? "font-bold" : "text-muted-foreground"}`} style={isLast ? { color } : undefined}>{h.score}%</span>
                <div className="w-full rounded-t" style={{ height: `${Math.max(10, ((h.score - 70) / 30) * 100)}%`, background: color, opacity: isLast ? 1 : 0.6 }} />
                <span className="text-[7px] text-muted-foreground">{h.date.split(" ")[0]}</span>
              </div>
            );
          })}
        </div>
        {audit.chrisNote && (
          <div className="mt-3 flex items-start gap-2 p-2 rounded-lg" style={{ background: "rgba(27,67,50,0.05)" }}>
            <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">{audit.chrisNote}</p>
          </div>
        )}
      </div>

      {/* Section 3: Conduct */}
      <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(27,67,50,0.05)" }}>
        <div className="flex items-start gap-2 mb-3">
          <ChrisAvatar size="small" className="shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            CHRIS can guide you through this audit now by voice. Takes approximately 45 minutes. Non-conformances queue automatically as corrective actions. The completed report feeds your clinical governance pack.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="text-xs font-medium px-3 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 flex-1">Start audit now →</button>
          <button className="text-xs font-medium px-3 py-2.5 rounded-lg border border-border text-foreground hover:bg-muted">Schedule</button>
          <button className="text-xs font-medium px-3 py-2.5 rounded-lg border border-border text-foreground hover:bg-muted">Assign</button>
        </div>
      </div>

      {/* Section 4: Open Non-Conformances */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Open non-conformances · {audit.openNonConformances}</p>
      {audit.openNonConformances > 0 ? (
        <div className="bg-card rounded-xl border border-border mb-4 overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-foreground">Incident review process</p>
              <p className="text-[10px] text-muted-foreground">From: {audit.lastCompleted} · Overdue 17 days</p>
            </div>
            <div className="flex gap-1">
              <button className="text-[10px] font-medium px-2 py-1 rounded bg-primary text-primary-foreground">Mark complete</button>
            </div>
          </div>
          {audit.openNonConformances > 1 && (
            <div className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-foreground">Temperature monitoring protocol</p>
                <p className="text-[10px] text-muted-foreground">From: 12 Feb · Not started · Overdue 45 days</p>
              </div>
              <button className="text-[10px] font-medium px-2 py-1 rounded border border-border text-foreground">Assign owner</button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-card rounded-xl p-4 border border-border mb-4 text-center">
          <p className="text-xs text-muted-foreground">No open non-conformances ✅</p>
        </div>
      )}

      {/* Section 5: History */}
      <button onClick={() => setShowHistory(!showHistory)} className="flex items-center justify-between w-full mb-2">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">Audit history · {audit.history.length} audits</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showHistory ? "rotate-180" : ""}`} />
      </button>
      {showHistory && (
        <div className="bg-card rounded-xl border border-border mb-4 overflow-hidden">
          {audit.history.map((h, i) => (
            <div key={i} className={`flex items-center justify-between px-4 py-2.5 text-xs ${i < audit.history.length - 1 ? "border-b border-border" : ""}`}>
              <span className="text-foreground">{h.date}</span>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{h.met}/{h.total}</span>
                <span className={`font-bold ${h.score >= 95 ? "text-[hsl(var(--brand-teal))]" : h.score >= 85 ? "text-[hsl(var(--brand-amber))]" : "text-[hsl(var(--brand-terracotta))]"}`}>{h.score}%</span>
                <button className="text-[10px] text-[hsl(var(--brand-teal))] hover:underline">View</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section 6: Regulatory */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Regulatory links</p>
      <div className="bg-card rounded-xl p-4 border border-border mb-16">
        <div className="space-y-1.5 mb-3">
          {audit.regulatoryLinks.map((link, i) => (
            <p key={i} className="text-xs text-muted-foreground">✅ {link}</p>
          ))}
          {audit.qiLinks.map((link, i) => (
            <p key={i} className="text-xs text-muted-foreground">📋 {link}</p>
          ))}
        </div>
        <button className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">Export audit evidence →</button>
      </div>
    </div>
  );
}
