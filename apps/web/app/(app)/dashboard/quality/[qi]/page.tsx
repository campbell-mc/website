"use client";

import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Mic, TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { getQIByCode, getQIStatus, type QIDefinition } from "@/components/quality/qi-data";

// 6-quarter trend data (demo)
const TREND_DATA: Record<string, number[]> = {
  QI_01: [11.2, 10.5, 9.8, 9.1, 9.1, 6.4],
  QI_03: [35.2, 36.8, 38.1, 38.5, 38.5, 40.4],
  QI_04: [2.8, 3.1, 2.5, 2.1, 2.1, 6.4],
  QI_14: [0.35, 0.33, 0.32, 0.31, 0.31, 0.25],
};

// Falls breakdown (demo for QI_03/QI_04)
const FALLS_BREAKDOWN = {
  byLocation: [
    { location: "Wing B — Bathroom", count: 8, pct: 42, flag: true },
    { location: "Wing A — Bedroom", count: 5, pct: 26 },
    { location: "Common areas", count: 4, pct: 21 },
    { location: "Wing B — Corridor", count: 2, pct: 11 },
  ],
  byShift: [
    { shift: "Morning", count: 4, pct: 21 },
    { shift: "Afternoon", count: 6, pct: 32 },
    { shift: "Night", count: 9, pct: 47, flag: true },
  ],
  byStaffType: [
    { type: "Permanent staff", count: 3, pct: 16 },
    { type: "Agency/casual", count: 16, pct: 84, flag: true },
  ],
  byOutcome: [
    { outcome: "No injury", count: 11 },
    { outcome: "Minor injury", count: 5 },
    { outcome: "Major injury (QI_04)", count: 3, flag: true },
  ],
};

export default function QIDetailPage() {
  const router = useRouter();
  const params = useParams();
  const code = (params.qi as string)?.toUpperCase();
  const qi = getQIByCode(code);

  if (!qi) {
    return (
      <div className="p-8 text-center">
        <p className="text-foreground">QI not found: {code}</p>
        <button onClick={() => router.push("/dashboard/quality")} className="mt-4 text-sm text-[hsl(var(--brand-teal))] hover:underline">← Back to Quality Indicators</button>
      </div>
    );
  }

  const status = getQIStatus(qi);
  const statusColor = status === "good" ? "hsl(var(--brand-teal))" : status === "watch" ? "hsl(var(--brand-amber))" : "hsl(var(--brand-terracotta))";
  const statusLabel = status === "good" ? (qi.higherIsBetter ? "Above benchmark ✅" : "Below benchmark ✅") : status === "watch" ? "At benchmark ⚠️" : (qi.higherIsBetter ? "Below benchmark 🔴" : "Above benchmark 🔴");
  const trend = TREND_DATA[code] ?? [qi.prior, qi.current];
  const isFallsQI = code === "QI_03" || code === "QI_04";

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard/quality")} className="p-1 -ml-1 hover:bg-muted rounded-lg"><ChevronLeft className="w-5 h-5 text-foreground" /></button>
          <div>
            <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">{code} — {qi.name}</p>
            <p className="text-[10px] text-muted-foreground">{qi.description}</p>
          </div>
        </div>
        <button onClick={() => router.push("/dashboard/coach")} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted"><Mic className="w-3.5 h-3.5" /> Ask CHRIS</button>
      </div>

      {/* Section 1: Status */}
      <div className="flex items-end gap-4 mb-5">
        <div>
          <span className="text-4xl font-extrabold leading-none" style={{ color: statusColor }}>{qi.current}{qi.category === "staffing" ? "" : "%"}</span>
          <p className="text-xs text-muted-foreground mt-1">This quarter</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-muted-foreground">{qi.benchmark}{qi.category === "staffing" ? "" : "%"} benchmark</p>
          <p className="text-sm text-muted-foreground">{qi.prior}{qi.category === "staffing" ? "" : "%"} prior quarter</p>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full ml-auto" style={{ color: statusColor, background: `${statusColor}15` }}>{statusLabel}</span>
      </div>

      {/* Section 2: Trend */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">6-quarter trend</p>
      <div className="bg-card rounded-xl p-4 border border-border mb-5">
        <div className="flex items-end gap-1 h-24">
          {trend.map((val, i) => {
            const isLast = i === trend.length - 1;
            const s = qi.higherIsBetter
              ? (val >= qi.benchmark ? "hsl(var(--brand-teal))" : "hsl(var(--brand-amber))")
              : (val <= qi.benchmark ? "hsl(var(--brand-teal))" : val <= qi.benchmark * 1.1 ? "hsl(var(--brand-amber))" : "hsl(var(--brand-terracotta))");
            const maxVal = Math.max(...trend, qi.benchmark) * 1.2;
            const height = Math.max(10, (val / maxVal) * 100);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className={`text-[9px] font-medium ${isLast ? "font-bold" : "text-muted-foreground"}`} style={isLast ? { color: statusColor } : undefined}>{val}</span>
                <div className="w-full rounded-t" style={{ height: `${height}%`, background: s, opacity: isLast ? 1 : 0.6 }} />
                <span className="text-[8px] text-muted-foreground">Q{i + 1}</span>
              </div>
            );
          })}
        </div>
        <div className="border-t border-dashed border-muted-foreground/20 mt-1 pt-1">
          <span className="text-[8px] text-muted-foreground">Dashed = {qi.benchmark}{qi.category === "staffing" ? "" : "%"} benchmark</span>
        </div>
      </div>

      {/* Section 3: CHRIS Analysis */}
      {qi.chrisNote && (
        <div className="rounded-xl p-4 mb-5" style={{ background: "rgba(27,67,50,0.05)" }}>
          <div className="flex items-start gap-2 mb-2">
            <ChrisAvatar size="small" showGlow className="shrink-0" />
            <p className="text-[10px] font-semibold text-muted-foreground uppercase">CHRIS Analysis</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{qi.chrisNote}</p>
          {isFallsQI && (
            <div className="mt-3 bg-card rounded-lg p-3 border border-border">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]">CAUSAL</span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dashed border-[hsl(var(--brand-amber))] text-muted-foreground">EMERGING</span>
              </div>
              <p className="text-xs font-medium text-foreground mb-1">Falls rate correlates with agency coverage</p>
              <p className="text-xs text-muted-foreground">Falls on permanent-staff shifts: 1.2%. Falls on high-agency shifts: 4.8%. Workforce-clinical convergence signal.</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setModal({ variant: "form", title: "Add to corrective action", chris: "CHRIS will create a corrective action linking this signal to the falls pattern. It will appear in the DON queue and the corrective actions register.", label: "Create corrective action →" })} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Add to corrective action</button>
                <button onClick={() => router.push("/dashboard/coach")} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted">Discuss with CHRIS</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Section 4: Breakdown (falls QIs) */}
      {isFallsQI && (
        <div className="mb-5">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Breakdown — {qi.numerator} events this quarter</p>

          {[
            { title: "By Location", data: FALLS_BREAKDOWN.byLocation, keyField: "location" },
            { title: "By Shift", data: FALLS_BREAKDOWN.byShift, keyField: "shift" },
            { title: "By Staff Type", data: FALLS_BREAKDOWN.byStaffType, keyField: "type" },
            { title: "By Outcome", data: FALLS_BREAKDOWN.byOutcome, keyField: "outcome" },
          ].map((section) => (
            <div key={section.title} className="bg-card rounded-xl border border-border mb-2 overflow-hidden">
              <p className="px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase border-b border-border">{section.title}</p>
              {section.data.map((row: any, i: number) => (
                <div key={i} className={`flex items-center justify-between px-4 py-2 text-xs ${i < section.data.length - 1 ? "border-b border-border" : ""} ${row.flag ? "bg-[rgba(196,112,74,0.04)]" : ""}`}>
                  <span className="text-foreground">{row[section.keyField]}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{row.count} events</span>
                    {row.pct !== undefined && <span className={`font-bold ${row.flag ? "text-[hsl(var(--brand-terracotta))]" : "text-foreground"}`}>{row.pct}%</span>}
                    {row.flag && <span className="text-[hsl(var(--brand-terracotta))] text-[9px]">🔴</span>}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {code === "QI_03" && (
            <div className="bg-card rounded-xl p-3 border border-border border-l-4 border-l-[hsl(var(--brand-amber))]">
              <p className="text-xs text-foreground mb-1 font-medium">Wing B Bathroom — location pattern</p>
              <p className="text-[10px] text-muted-foreground mb-2">8 of 19 falls in Wing B bathroom. Environmental risk assessment last done 6 months ago.</p>
              <button onClick={() => setModal({ variant: "schedule", title: "Schedule environmental assessment", chris: "Wing B bathroom environmental risk assessment. Last assessed 6 months ago. 8 of 19 falls occurred here.", label: "Schedule →" })} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Schedule assessment →</button>
            </div>
          )}
        </div>
      )}

      {/* Section 5: Corrective Actions */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Corrective actions & next steps</p>
      <div className="bg-card rounded-xl border border-border mb-4 overflow-hidden">
        {status !== "good" ? (
          <>
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-foreground">Falls prevention audit — Wing B</p>
                <p className="text-[10px] text-muted-foreground">Overdue 7 days</p>
              </div>
              <button onClick={() => router.push("/dashboard/compliance")} className="text-xs text-[hsl(var(--brand-teal))] font-medium">Review →</button>
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-foreground">Physio assessment completion</p>
                <p className="text-[10px] text-muted-foreground">In progress</p>
              </div>
              <button onClick={() => router.push("/dashboard/compliance")} className="text-xs text-[hsl(var(--brand-teal))] font-medium">View →</button>
            </div>
          </>
        ) : (
          <div className="px-4 py-4 text-center">
            <p className="text-xs text-muted-foreground">No open corrective actions for this QI</p>
            <button onClick={() => setModal({ variant: "form", title: "Create monitoring action", chris: "This creates a routine monitoring action for this QI to ensure sustained good performance.", label: "Create action →" })} className="mt-2 text-xs font-medium text-[hsl(var(--brand-teal))] hover:underline">+ Create monitoring action</button>
          </div>
        )}
      </div>

      {modal && <ActionModal open={true} onClose={() => setModal(null)} variant={modal.variant} title={modal.title} chrisMessage={modal.chris} primaryLabel={modal.label} />}

      <p className="text-[10px] text-muted-foreground mb-16">
        GPMS Q1 2026: Submitted ✅ · Q2 collection: 1 Oct – 31 Dec · Due: 21 Jan 2026
      </p>
    </div>
  );
}
