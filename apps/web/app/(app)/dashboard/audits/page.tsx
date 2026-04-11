"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Mic, CheckCircle, AlertTriangle, Clock, MoreHorizontal } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

const AUDITS = [
  { name: "Medication Management", freq: "Monthly", lastDone: "12 Mar", nextDue: "12 Apr", status: "overdue", daysOverdue: 3 },
  { name: "Restraint Register", freq: "Monthly", lastDone: "5 Apr", nextDue: "5 May", status: "ok" },
  { name: "Falls Prevention", freq: "Quarterly", lastDone: "15 Jan", nextDue: "15 Apr", status: "due", daysToDue: 4 },
  { name: "Wound Management", freq: "Monthly", lastDone: "8 Apr", nextDue: "8 May", status: "ok" },
  { name: "Infection Control", freq: "Monthly", lastDone: "1 Apr", nextDue: "1 May", status: "ok" },
  { name: "Nutritional Care", freq: "Quarterly", lastDone: "20 Feb", nextDue: "20 May", status: "ok" },
  { name: "Pain Management", freq: "Quarterly", lastDone: "10 Mar", nextDue: "10 Jun", status: "ok" },
];

export default function AuditsPage() {
  const router = useRouter();
  const needsAction = AUDITS.filter((a) => a.status !== "ok");

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard/clinical")} className="p-1 -ml-1 hover:bg-muted rounded-lg"><ChevronLeft className="w-5 h-5 text-foreground" /></button>
          <div><p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Clinical Audits</p><p className="text-[10px] text-muted-foreground">Harbison Bowral · Mandatory audit suite</p></div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted"><Mic className="w-3.5 h-3.5" /> Ask CHRIS</button>
      </div>

      {needsAction.length > 0 && (
        <>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Needs your attention</p>
          {needsAction.map((a) => (
            <div key={a.name} className={`rounded-xl p-4 border border-border border-l-4 mb-3 ${a.status === "overdue" ? "border-l-[hsl(var(--brand-terracotta))]" : "border-l-[hsl(var(--brand-amber))]"}`} style={{ background: a.status === "overdue" ? "rgba(196,112,74,0.06)" : "rgba(212,160,23,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${a.status === "overdue" ? "text-[hsl(var(--brand-terracotta))]" : "text-[hsl(var(--brand-amber))]"}`} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{a.name} · {a.status === "overdue" ? `${a.daysOverdue} days overdue` : `Due in ${a.daysToDue} days`}</p>
                  <p className="text-xs text-muted-foreground mb-2">{a.freq} · Last: {a.lastDone}</p>
                  <div className="flex items-start gap-2 p-2 rounded-lg mb-2" style={{ background: "rgba(27,67,50,0.05)" }}>
                    <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">CHRIS can guide you through this audit now by voice. Takes about 45 minutes. Non-conformances queue automatically.</p>
                  </div>
                  <button className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Start audit now →</button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2 mt-4">All audits</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-16">
        {AUDITS.map((a, i) => (
          <div key={a.name} className={`flex items-center justify-between px-4 py-3 ${i < AUDITS.length - 1 ? "border-b border-border" : ""}`}>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${a.status === "ok" ? "bg-[hsl(var(--brand-teal))]" : a.status === "due" ? "bg-[hsl(var(--brand-amber))]" : "bg-[hsl(var(--brand-terracotta))]"}`} />
              <div><p className="text-xs font-medium text-foreground">{a.name}</p><p className="text-[9px] text-muted-foreground">{a.freq} · Last: {a.lastDone}</p></div>
            </div>
            <span className="text-[10px] text-muted-foreground">{a.nextDue}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
