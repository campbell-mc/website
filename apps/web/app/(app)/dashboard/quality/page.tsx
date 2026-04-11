"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Mic, TrendingUp, TrendingDown, Minus, MoreHorizontal } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

const QI_DATA = [
  { code: "QI_01", name: "Unplanned weight loss", current: 2.1, benchmark: 2.5, trend: "up", needsAction: false },
  { code: "QI_02", name: "Pressure injuries", current: 0.8, benchmark: 1.2, trend: "down", needsAction: false },
  { code: "QI_03", name: "Falls", current: 8.2, benchmark: 7.8, trend: "up", needsAction: true },
  { code: "QI_04", name: "Falls — major injury", current: 1.8, benchmark: 2.1, trend: "up", needsAction: false },
  { code: "QI_05", name: "Medication incidents", current: 3.1, benchmark: 3.5, trend: "up", needsAction: false },
  { code: "QI_06", name: "Infections — COVID-19", current: 0.0, benchmark: 0.8, trend: "down", needsAction: false },
  { code: "QI_07", name: "Infections — influenza", current: 0.3, benchmark: 0.5, trend: "up", needsAction: false },
  { code: "QI_08", name: "Infections — respiratory", current: 1.2, benchmark: 1.8, trend: "down", needsAction: false },
  { code: "QI_09", name: "Infections — gastro", current: 0.5, benchmark: 0.6, trend: "up", needsAction: false },
  { code: "QI_10", name: "Infections — AMR", current: 0.0, benchmark: 0.2, trend: "stable", needsAction: false },
  { code: "QI_11", name: "Hospitalisation", current: 4.5, benchmark: 5.2, trend: "down", needsAction: false },
  { code: "QI_12", name: "Physical restraint", current: 0.2, benchmark: 0.5, trend: "down", needsAction: false },
  { code: "QI_13", name: "Chemical restraint", current: 1.1, benchmark: 1.5, trend: "down", needsAction: false },
  { code: "QI_14", name: "Consumer experience", current: 8.5, benchmark: 8.0, trend: "up", needsAction: false },
];

export default function QualityPage() {
  const router = useRouter();
  const belowBenchmark = QI_DATA.filter((qi) => qi.code !== "QI_14" ? qi.current > qi.benchmark : qi.current < qi.benchmark);
  const aboveBenchmark = QI_DATA.filter((qi) => qi.code !== "QI_14" ? qi.current <= qi.benchmark : qi.current >= qi.benchmark);

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard/clinical")} className="p-1 -ml-1 hover:bg-muted rounded-lg">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <p className="text-base font-semibold text-foreground">Quality Indicators</p>
            <p className="text-[10px] text-muted-foreground">14 Mandatory QIs · Q1 2026 · Harbison Bowral</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">
          <Mic className="w-3.5 h-3.5" /> Ask CHRIS
        </button>
      </div>

      {/* GPMS status */}
      <div className="bg-card rounded-lg px-4 py-3 border border-border mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-foreground">Q1 QI Submission</p>
          <p className="text-[10px] text-muted-foreground">CHRIS has compiled data. Ready for review.</p>
        </div>
        <button className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
          Review submission →
        </button>
      </div>

      {/* QIs NEEDING ATTENTION — action cards first */}
      {belowBenchmark.length > 0 && (
        <>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Below benchmark — needs attention</p>
          {belowBenchmark.map((qi) => (
            <div key={qi.code} className="bg-card rounded-xl p-4 shadow-warm-sm border border-border border-l-4 border-l-[hsl(var(--brand-amber))] mb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground font-mono">{qi.code}</span>
                  <span className="text-sm font-medium text-foreground">{qi.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {qi.trend === "up" && <TrendingUp className="w-3.5 h-3.5 text-[hsl(var(--brand-terracotta))]" />}
                  {qi.trend === "down" && <TrendingDown className="w-3.5 h-3.5 text-[hsl(var(--brand-teal))]" />}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Current: <strong>{qi.current}</strong> · Benchmark: {qi.benchmark} · {qi.current > qi.benchmark ? "Above" : "Below"} benchmark
              </p>
              {qi.needsAction && (
                <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 mb-2">
                  <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">Falls trending up 3rd consecutive quarter. Allied health hours dropped 18%. Physio assessment completion may be contributing.</p>
                </div>
              )}
              <button className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
                {qi.needsAction ? "Review analysis →" : "View detail →"}
              </button>
            </div>
          ))}
        </>
      )}

      {/* QIs ON TRACK — compact list */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 mt-4">On track</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-16">
        {aboveBenchmark.map((qi, i) => (
          <div key={qi.code} className={`flex items-center justify-between px-4 py-2.5 ${i < aboveBenchmark.length - 1 ? "border-b border-border" : ""}`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--brand-teal))]" />
              <span className="text-[10px] text-muted-foreground font-mono">{qi.code}</span>
              <span className="text-xs text-foreground">{qi.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[hsl(var(--brand-teal))]">{qi.current}</span>
              {qi.trend === "down" && <TrendingDown className="w-3 h-3 text-[hsl(var(--brand-teal))]" />}
              {qi.trend === "up" && <TrendingUp className="w-3 h-3 text-[hsl(var(--brand-teal))]" />}
              {qi.trend === "stable" && <Minus className="w-3 h-3 text-muted-foreground" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
