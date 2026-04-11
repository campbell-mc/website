"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Mic, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { QI_DATA, getQIStatus, type QIDefinition } from "@/components/quality/qi-data";

// GPMS Submission Panel (slide-over)
function SubmissionPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"data" | "analysis" | "submit">("data");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-end lg:items-center lg:justify-end">
        <div className="bg-card w-full lg:w-[520px] lg:h-full lg:max-h-screen overflow-y-auto rounded-t-2xl lg:rounded-none p-6 animate-slideUp">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[hsl(150_25%_96%)] flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-lg font-bold text-foreground mb-1">Submitted to GPMS</p>
            <p className="text-xs text-muted-foreground mb-1">Reference: GPMS-2026-Q1-0847</p>
            <p className="text-xs text-muted-foreground mb-4">Submitted by Sarah Mitchell · {new Date().toLocaleString("en-AU")}</p>
            <button onClick={onClose} className="text-sm font-medium px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90">Close panel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end lg:items-center lg:justify-end">
      <div className="bg-card w-full lg:w-[520px] lg:h-full lg:max-h-screen overflow-y-auto rounded-t-2xl lg:rounded-none">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-4 py-3 z-10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-base font-bold text-foreground">GPMS QI Submission · Q1 2026</p>
            <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">✕ Close</button>
          </div>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {(["data", "analysis", "submit"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 text-[10px] font-medium py-1.5 rounded-md ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                {t === "data" ? "Data Review" : t === "analysis" ? "CHRIS Analysis" : "Submit"}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {tab === "data" && (
            <div>
              <div className="bg-[hsl(150_25%_96%)] rounded-lg p-3 mb-4">
                <p className="text-xs text-foreground font-medium">15/15 QIs have data · Last collected: 30 Sep 2025 · Q1 2026</p>
              </div>
              <div className="space-y-1">
                {QI_DATA.map((qi) => {
                  const status = getQIStatus(qi);
                  return (
                    <div key={qi.code} className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs ${status === "bad" ? "bg-[rgba(196,112,74,0.06)]" : ""}`}>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={`w-1.5 h-1.5 rounded-full ${status === "good" ? "bg-[hsl(var(--brand-teal))]" : status === "watch" ? "bg-[hsl(var(--brand-amber))]" : "bg-[hsl(var(--brand-terracotta))]"}`} />
                        <span className="text-muted-foreground font-mono w-10 shrink-0">{qi.code}</span>
                        <span className="text-foreground truncate">{qi.name}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-2">
                        {qi.numerator !== undefined && <span className="text-muted-foreground">{qi.numerator}/{qi.denominator}</span>}
                        <span className="font-bold w-12 text-right">{qi.current}%</span>
                        <span className="text-muted-foreground w-12 text-right">{qi.benchmark}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "analysis" && (
            <div>
              <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(27,67,50,0.05)" }}>
                <div className="flex items-start gap-2 mb-2">
                  <ChrisAvatar size="small" showGlow className="shrink-0" />
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">CHRIS Q1 Analysis</p>
                </div>
                <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                  <div>
                    <p className="font-semibold text-foreground text-[10px] uppercase mb-1">What went well</p>
                    <p>Pressure injuries dropped from 9.1% to 6.4% — below the national average for the first time this year. Wound care audit changes from August appear to have made a difference. Restrictive practices, incontinence care, and hospitalisation all improved.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-[10px] uppercase mb-1">What needs attention</p>
                    <p>Falls (40.4%) remain above benchmark — 3rd consecutive quarter. Major-injury falls tripled (2.1% → 6.4%). 2 of 3 major-injury falls occurred on night shifts with agency cover. Allied health hours dropped 18% — correlates with falls trend.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-[10px] uppercase mb-1">Submission risk</p>
                    <p>Low overall. No outliers beyond 2 standard deviations of national mean. Falls trend is consistent with prior quarters and will not trigger ACQSC attention in isolation. The major-injury falls spike may attract a follow-up question — ensure corrective action documentation is current.</p>
                  </div>
                </div>
              </div>
              <button className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted flex items-center justify-center gap-1.5">
                <Mic className="w-3.5 h-3.5" /> Ask CHRIS about any QI
              </button>
            </div>
          )}

          {tab === "submit" && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-3">Pre-submission checklist</p>
              <div className="space-y-2 mb-4">
                {[
                  { ok: true, text: "All 15 QIs have data for the reporting period" },
                  { ok: true, text: "Data reviewed by DON" },
                  { ok: true, text: "Collection methodology matches QI Program Manual" },
                  { ok: false, text: "QI_04 (Falls — Major Injury) is above benchmark — confirm accurate" },
                  { ok: true, text: "Submission within 21-day window (due 21 Oct, today 15 Oct)" },
                  { ok: true, text: "GPMS portal accessible (CHRIS verified connectivity)" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className={`text-sm mt-0.5 ${item.ok ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-amber))]"}`}>{item.ok ? "✅" : "⚠️"}</span>
                    <p className="text-xs text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="bg-card rounded-xl p-4 border border-border mb-4">
                <p className="text-xs text-muted-foreground mb-2">I confirm the data in this submission is accurate to the best of my knowledge.</p>
                <p className="text-sm font-medium text-foreground">Sarah Mitchell · Director of Nursing</p>
              </div>

              <button onClick={() => setSubmitted(true)} className="w-full py-3.5 rounded-xl font-medium text-white bg-primary hover:opacity-90">
                Submit to GPMS →
              </button>
              <p className="text-[10px] text-muted-foreground text-center mt-2">15 quality indicators · Q1 2026 · Harbison Bowral · Will be publicly reported</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Main QI List ---

export default function QualityPage() {
  const router = useRouter();
  const [showSubmission, setShowSubmission] = useState(false);

  const needsAttention = QI_DATA.filter((qi) => qi.category === "clinical" && getQIStatus(qi) !== "good");
  const onTrack = QI_DATA.filter((qi) => qi.category === "clinical" && getQIStatus(qi) === "good");
  const experience = QI_DATA.filter((qi) => qi.category === "experience");
  const staffing = QI_DATA.filter((qi) => qi.category === "staffing");

  function renderQIRow(qi: QIDefinition) {
    const status = getQIStatus(qi);
    const trendIcon = qi.trend === "improving"
      ? <TrendingDown className={`w-3.5 h-3.5 ${qi.higherIsBetter ? "text-[hsl(var(--brand-terracotta))]" : "text-[hsl(var(--brand-teal))]"}`} />
      : qi.trend === "worsening"
        ? <TrendingUp className={`w-3.5 h-3.5 ${qi.higherIsBetter ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-terracotta))]"}`} />
        : <Minus className="w-3.5 h-3.5 text-muted-foreground" />;

    return (
      <button
        key={qi.code}
        onClick={() => router.push(`/dashboard/quality/${qi.code}`)}
        className={`w-full flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors text-left ${status === "bad" ? "bg-[rgba(196,112,74,0.04)]" : ""}`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className={`w-2 h-2 rounded-full shrink-0 ${status === "good" ? "bg-[hsl(var(--brand-teal))]" : status === "watch" ? "bg-[hsl(var(--brand-amber))]" : "bg-[hsl(var(--brand-terracotta))]"}`} />
          <span className="text-[10px] text-muted-foreground font-mono w-10 shrink-0">{qi.code}</span>
          <span className="text-xs font-medium text-foreground truncate">{qi.name}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className={`text-xs font-bold ${status === "good" ? "text-[hsl(var(--brand-teal))]" : status === "watch" ? "text-[hsl(var(--brand-amber))]" : "text-[hsl(var(--brand-terracotta))]"}`}>
            {qi.current}{qi.category === "staffing" ? "" : "%"}
          </span>
          {trendIcon}
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
        </div>
      </button>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard/clinical")} className="p-1 -ml-1 hover:bg-muted rounded-lg"><ChevronLeft className="w-5 h-5 text-foreground" /></button>
          <div>
            <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Quality Indicators</p>
            <p className="text-[10px] text-muted-foreground">15 Mandatory QIs · Q1 2026 · Harbison Bowral</p>
          </div>
        </div>
        <button onClick={() => router.push("/dashboard/coach")} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted"><Mic className="w-3.5 h-3.5" /> Ask CHRIS</button>
      </div>

      {/* GPMS status */}
      <div className="bg-card rounded-xl p-4 border border-border mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-foreground">Q1 QI Submission</p>
          <p className="text-[10px] text-muted-foreground">CHRIS has compiled all 15 QIs. Due 21 Oct. Data reviewed.</p>
        </div>
        <button onClick={() => setShowSubmission(true)} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
          Review submission →
        </button>
      </div>

      {/* Needs Attention */}
      {needsAttention.length > 0 && (
        <>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Below benchmark — needs attention</p>
          <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
            {needsAttention.map(renderQIRow)}
          </div>
        </>
      )}

      {/* On Track */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">On track</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
        {onTrack.map(renderQIRow)}
      </div>

      {/* Experience */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Consumer experience</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
        {experience.map(renderQIRow)}
      </div>

      {/* Staffing — New from April 2025 */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-1">Staffing quality indicators — new from April 2025</p>
      <p className="text-[9px] text-muted-foreground mb-2">National benchmarks are establishing. Data sourced from QFR.</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-16">
        {staffing.map(renderQIRow)}
      </div>

      {/* Submission panel */}
      {showSubmission && <SubmissionPanel onClose={() => setShowSubmission(false)} />}
    </div>
  );
}
