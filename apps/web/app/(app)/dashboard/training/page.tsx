"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Mic, GraduationCap, AlertTriangle, CheckCircle, MoreHorizontal } from "lucide-react";

const TRAINING = [
  { type: "Manual Handling", role: "AIN", rate: 94, expiring: 2, status: "ok" },
  { type: "Medication Management", role: "RN/EN", rate: 88, expiring: 4, status: "warn" },
  { type: "Infection Control", role: "All", rate: 91, expiring: 1, status: "ok" },
  { type: "Fire Safety", role: "All", rate: 97, expiring: 0, status: "ok" },
  { type: "Dementia Care", role: "AIN/RN", rate: 76, expiring: 3, status: "bad" },
  { type: "First Aid", role: "All", rate: 92, expiring: 1, status: "ok" },
  { type: "Elder Abuse", role: "All", rate: 89, expiring: 2, status: "warn" },
  { type: "AHPRA Registration", role: "RN/EN", rate: 100, expiring: 6, status: "warn" },
];

export default function TrainingPage() {
  const router = useRouter();
  const needsAction = TRAINING.filter((t) => t.status !== "ok");

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard/workforce")} className="p-1 -ml-1 hover:bg-muted rounded-lg"><ChevronLeft className="w-5 h-5 text-foreground" /></button>
          <div><p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Training Compliance</p><p className="text-[10px] text-muted-foreground">The Holy Grail Bowral · All mandatory training</p></div>
        </div>
        <button onClick={() => router.push("/dashboard/coach")} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted"><Mic className="w-3.5 h-3.5" /> Ask CHRIS</button>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
          <p className="text-lg font-bold text-[hsl(var(--brand-teal))]">91%</p><p className="text-[9px] text-muted-foreground">Overall</p>
        </div>
        <div className="bg-card rounded-lg px-3 py-2 border border-border flex-1 text-center">
          <p className="text-lg font-bold text-[hsl(var(--brand-amber))]">19</p><p className="text-[9px] text-muted-foreground">Expiring 30d</p>
        </div>
      </div>

      {needsAction.length > 0 && (
        <>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Needs attention</p>
          {needsAction.map((t) => (
            <div key={t.type} className={`rounded-xl p-4 border border-border border-l-4 mb-2 ${t.status === "bad" ? "border-l-[hsl(var(--brand-terracotta))]" : "border-l-[hsl(var(--brand-amber))]"}`} style={{ background: t.status === "bad" ? "rgba(196,112,74,0.06)" : "rgba(212,160,23,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-foreground">{t.type}</p>
                <span className="text-xs font-bold" style={{ color: t.rate < 80 ? "hsl(var(--brand-terracotta))" : "hsl(var(--brand-amber))" }}>{t.rate}%</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{t.role} · {t.expiring} expiring in 30 days</p>
              <button className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Send reminders →</button>
            </div>
          ))}
        </>
      )}

      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2 mt-4">All training</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-16">
        {TRAINING.map((t, i) => (
          <div key={t.type} className={`flex items-center justify-between px-4 py-3 ${i < TRAINING.length - 1 ? "border-b border-border" : ""}`}>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${t.status === "ok" ? "bg-[hsl(var(--brand-teal))]" : t.status === "warn" ? "bg-[hsl(var(--brand-amber))]" : "bg-[hsl(var(--brand-terracotta))]"}`} />
              <div><p className="text-xs font-medium text-foreground">{t.type}</p><p className="text-[9px] text-muted-foreground">{t.role}</p></div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-foreground">{t.rate}%</p>
              {t.expiring > 0 && <p className="text-[9px] text-muted-foreground">{t.expiring} expiring</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
