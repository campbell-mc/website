"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle, TrendingUp, TrendingDown, Minus, Sparkles, Calendar, MessageSquare } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge, StatusDot } from "@/components/ui/status-badge";
import { ScoreRing } from "@/components/ui/score-ring";

// Demo multi-facility data
const FACILITIES = [
  {
    id: "1", name: "Harbison — Burradoo", type: "Residential",
    health: "at-risk" as const, careMinutes: 198, careMinutesPct: 99,
    rnCoverage: "confirmed", sirsOpen: 1, sirsUrgent: false,
    pshElevated: 3, pshAmber: 2, compliance: 82,
    financial: -1.2, lastBriefing: 1,
    topSignal: "Wattle Wing evening team — workload pressure 3rd consecutive cycle",
  },
  {
    id: "2", name: "Harbison — Moss Vale", type: "Residential",
    health: "compliant" as const, careMinutes: 214, careMinutesPct: 100,
    rnCoverage: "confirmed", sirsOpen: 0, sirsUrgent: false,
    pshElevated: 1, pshAmber: 1, compliance: 91,
    financial: 2.3, lastBriefing: 1,
    topSignal: "All teams within normal range. Pulse participation improving.",
  },
];

const CROSS_FACILITY_INSIGHTS = [
  {
    pattern: "Agency dependency spike at both sites correlating with upcoming Easter roster — pattern seen sector-wide.",
    facilities: ["Burradoo", "Moss Vale"],
    recommendation: "Consider cross-facility agency pre-booking for the holiday period.",
  },
  {
    pattern: "PSH_12 (Emotional Demands) trending up at Burradoo following three resident deaths in 6 weeks. Not yet flagged at Moss Vale.",
    facilities: ["Burradoo"],
    recommendation: "Monitor Burradoo closely. Consider grief support for affected teams.",
  },
];

export default function PortfolioDashboardPage() {
  const [expandedFacility, setExpandedFacility] = useState<string | null>(null);

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--brand-forest)]">Portfolio — Harbison</h1>
          <p className="text-sm text-gray-500">{FACILITIES.length} facilities · Last updated 6 minutes ago</p>
        </div>
        <ScoreRing score={87} size="md" label="Portfolio" delta={3} />
      </div>

      {/* Alert strip */}
      <div className="card-amber rounded-xl p-4 mb-6 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-[var(--brand-amber)] shrink-0" />
        <p className="text-sm text-[var(--brand-forest)]">
          <strong>2 items</strong> requiring your attention
        </p>
        <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
      </div>

      {/* Critical Status Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MetricCard
          label="Care Minutes"
          value="100%"
          subtitle="All facilities compliant"
          trend="stable"
          status="compliant"
        />
        <MetricCard
          label="SIRS Status"
          value="1 open"
          subtitle="0 Cat 1 · 1 Cat 2"
          status="at-risk"
        />
        <MetricCard
          label="PSH Risk"
          value="4 elevated"
          subtitle="1 convergence event"
          status="at-risk"
        />
        <MetricCard
          label="Compliance"
          value="87"
          subtitle="2 obligations at risk"
          trend="up"
          trendLabel="+3"
          status="compliant"
        />
      </div>

      {/* Facility Scorecard */}
      <div className="bg-white rounded-xl shadow-warm border border-[var(--border-default)] mb-6 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-[var(--brand-forest)]">Facility Scorecard</h2>
        </div>

        {/* Table header */}
        <div className="hidden lg:grid grid-cols-[200px_80px_100px_80px_80px_100px_80px_80px_60px] gap-2 px-5 py-2.5 bg-[var(--brand-forest)] text-white text-[10px] font-semibold uppercase tracking-wider">
          <span>Facility</span>
          <span className="text-center">Health</span>
          <span className="text-center">Care Min</span>
          <span className="text-center">RN</span>
          <span className="text-center">SIRS</span>
          <span className="text-center">PSH</span>
          <span className="text-center">Compliance</span>
          <span className="text-center">Financial</span>
          <span></span>
        </div>

        {/* Facility rows */}
        {FACILITIES.map((f) => (
          <div key={f.id}>
            <button
              onClick={() => setExpandedFacility(expandedFacility === f.id ? null : f.id)}
              className="w-full"
            >
              {/* Desktop row */}
              <div className="hidden lg:grid grid-cols-[200px_80px_100px_80px_80px_100px_80px_80px_60px] gap-2 px-5 py-3 border-b border-gray-100 hover:bg-[rgba(27,67,50,0.02)] transition-colors items-center text-sm">
                <span className="font-medium text-[var(--brand-forest)] text-left truncate">{f.name}</span>
                <span className="text-center"><StatusDot status={f.health} /></span>
                <span className="text-center">{f.careMinutes} min</span>
                <span className="text-center">{f.rnCoverage === "confirmed" ? "✅" : "⚠️"}</span>
                <span className="text-center">{f.sirsOpen > 0 ? <StatusBadge status={f.sirsUrgent ? "non-compliant" : "at-risk"} label={`${f.sirsOpen}`} size="xs" /> : "—"}</span>
                <span className="text-center">{f.pshElevated > 0 ? `${f.pshElevated} elevated` : "Clear"}</span>
                <span className="text-center">{f.compliance}</span>
                <span className={`text-center text-xs font-medium ${f.financial >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {f.financial >= 0 ? "+" : ""}{f.financial}%
                </span>
                <span className="text-center">
                  {expandedFacility === f.id ? <ChevronDown className="w-4 h-4 mx-auto text-gray-400" /> : <ChevronRight className="w-4 h-4 mx-auto text-gray-400" />}
                </span>
              </div>

              {/* Mobile card */}
              <div className="lg:hidden p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <StatusDot status={f.health} />
                    <span className="text-sm font-semibold text-[var(--brand-forest)]">{f.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-gray-500">
                  <div>Care: {f.careMinutes}</div>
                  <div>SIRS: {f.sirsOpen}</div>
                  <div>PSH: {f.pshElevated}</div>
                  <div>Score: {f.compliance}</div>
                </div>
              </div>
            </button>

            {/* Expanded detail */}
            {expandedFacility === f.id && (
              <div className="px-5 py-4 bg-[rgba(27,67,50,0.02)] border-b border-gray-100 animate-slideUp">
                <p className="text-sm text-gray-600 mb-2">
                  <Sparkles className="w-3.5 h-3.5 inline mr-1 text-[var(--brand-amber)]" />
                  <strong>Top signal:</strong> {f.topSignal}
                </p>
                <div className="flex gap-2">
                  <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[var(--brand-forest)] text-white hover:opacity-90">
                    Open full site view →
                  </button>
                  <button className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[var(--border-default)] text-[var(--brand-forest)] hover:bg-[rgba(27,67,50,0.04)]">
                    <MessageSquare className="w-3 h-3 inline mr-1" />
                    Message DON via CHRIS
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Cross-Facility Intelligence */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-[var(--brand-forest)] mb-3">Cross-Facility Intelligence</h2>
        <div className="space-y-3">
          {CROSS_FACILITY_INSIGHTS.map((insight, i) => (
            <div key={i} className="card-amber rounded-xl p-4">
              <p className="text-sm text-[var(--brand-forest)] mb-2">{insight.pattern}</p>
              <div className="flex items-center gap-2 mb-2">
                {insight.facilities.map((f) => (
                  <StatusBadge key={f} status="info" label={f} size="xs" />
                ))}
              </div>
              <p className="text-xs text-gray-500 italic">{insight.recommendation}</p>
              <button className="mt-2 text-xs font-medium text-[var(--brand-teal)] hover:underline">
                Discuss with CHRIS →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Trends (placeholder for charts) */}
      <div className="bg-white rounded-xl p-5 shadow-warm border border-[var(--border-default)]">
        <h2 className="text-base font-semibold text-[var(--brand-forest)] mb-4">Portfolio Trends — 90 Days</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-[rgba(45,125,115,0.04)]">
            <p className="text-2xl font-bold text-[var(--brand-teal)]">96%</p>
            <p className="text-[10px] text-gray-500 mt-1">Care Minutes Compliance</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-[rgba(212,160,23,0.04)]">
            <p className="text-2xl font-bold text-[var(--brand-amber)]">2.1</p>
            <p className="text-[10px] text-gray-500 mt-1">SIRS Events / Month</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-[rgba(196,112,74,0.04)]">
            <p className="text-2xl font-bold text-[var(--brand-terracotta)]">4</p>
            <p className="text-[10px] text-gray-500 mt-1">PSH Convergence Events</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-[rgba(27,67,50,0.04)]">
            <p className="text-2xl font-bold text-[var(--brand-forest)]">87</p>
            <p className="text-[10px] text-gray-500 mt-1">Compliance Score</p>
          </div>
        </div>
      </div>
    </div>
  );
}
