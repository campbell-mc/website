"use client";

import { useState } from "react";
import { FileText, ClipboardList, Activity, AlertTriangle, Shield, Heart, BarChart2, Clock, ChevronRight, Sparkles, Bell } from "lucide-react";
import { ScoreRing } from "@/components/ui/score-ring";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge, StatusDot } from "@/components/ui/status-badge";
import { ChrisMessage } from "@/components/chris/ChrisMessage";

// Demo data — will be replaced by real API calls
const DEMO = {
  facility: "Harbison — Burradoo",
  careMinutes: { total: 198, rn: 41.2, status: "at-risk" as const, trend: "stable" as const },
  sirs: { openCat1: 0, openCat2: 1, approaching: 1 },
  compliance: { score: 82, trend: "up" as const, atRisk: 2 },
  psh: { elevated: 3, convergence: 1 },
  queue: { immediate: 0, urgent: 2, routine: 5 },
  recentActivity: [
    { icon: "alert", text: "Care minutes at-risk alert sent to DON", time: "3 hours ago" },
    { icon: "sirs", text: "SIRS Category 2 draft created for review", time: "Yesterday" },
    { icon: "briefing", text: "Team Briefing delivered to 14 leaders", time: "2 days ago" },
    { icon: "pulse", text: "Cycle 8 pulse closed — 34% response rate", time: "3 days ago" },
    { icon: "practice", text: "Practice outcome measured: hazard reduced in Wattle Wing", time: "4 days ago" },
  ],
};

function getTimeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function SiteDashboardPage() {
  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--brand-forest)]">
          {getTimeGreeting()}, Mary
        </h1>
        <p className="text-sm text-gray-500">{DEMO.facility} · {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>

      {/* Monday Briefing Card (hero) */}
      <div className="rounded-xl p-5 mb-6 text-white" style={{ background: "var(--gradient-hero)" }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 opacity-80" />
              <span className="text-sm font-medium opacity-90">Your Monday Briefing is ready</span>
            </div>
            <p className="text-xs opacity-70 mb-3">3 signals · 3 actions · 8 minutes to read</p>
          </div>
          <FileText className="w-8 h-8 opacity-40" />
        </div>
        <button className="bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-medium px-4 py-2.5 rounded-lg">
          Read now →
        </button>
      </div>

      {/* DON Queue Badge */}
      {(DEMO.queue.immediate + DEMO.queue.urgent) > 0 && (
        <div className="card-terracotta rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--brand-terracotta)] flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--brand-forest)]">
                {DEMO.queue.immediate + DEMO.queue.urgent + DEMO.queue.routine} items in your review queue
              </p>
              <p className="text-xs text-gray-500">
                {DEMO.queue.immediate > 0 && `${DEMO.queue.immediate} immediate · `}
                {DEMO.queue.urgent} urgent · {DEMO.queue.routine} routine
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      )}

      {/* Critical Status Row (4 metric cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MetricCard
          label="Care Minutes"
          value={`${DEMO.careMinutes.total}`}
          subtitle={`RN: ${DEMO.careMinutes.rn} · Target: 200/40`}
          trend={DEMO.careMinutes.trend}
          status={DEMO.careMinutes.status}
        />
        <MetricCard
          label="SIRS Status"
          value={`${DEMO.sirs.openCat1 + DEMO.sirs.openCat2} open`}
          subtitle={`${DEMO.sirs.approaching} approaching deadline`}
          status={DEMO.sirs.openCat1 > 0 ? "non-compliant" : DEMO.sirs.openCat2 > 0 ? "at-risk" : "compliant"}
        />
        <MetricCard
          label="PSH Risk"
          value={`${DEMO.psh.elevated} elevated`}
          subtitle={`${DEMO.psh.convergence} convergence event`}
          status={DEMO.psh.convergence > 0 ? "at-risk" : "compliant"}
        />
        <MetricCard
          label="Compliance"
          value={DEMO.compliance.score}
          subtitle={`${DEMO.compliance.atRisk} obligations at risk`}
          trend={DEMO.compliance.trend}
          trendLabel="+3"
          status={DEMO.compliance.score >= 85 ? "compliant" : DEMO.compliance.score >= 70 ? "at-risk" : "non-compliant"}
        />
      </div>

      {/* Care Minutes Today — large gauge */}
      <div className="bg-white rounded-xl p-6 shadow-warm border border-[var(--border-default)] mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--brand-forest)]">Care Minutes Today</h2>
          <StatusBadge status={DEMO.careMinutes.status} />
        </div>
        <div className="flex items-center gap-8">
          <ScoreRing score={Math.round((DEMO.careMinutes.total / 200) * 100)} size="lg" label="of target" />
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">RN component</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{ width: `${Math.min(100, (DEMO.careMinutes.rn / 40) * 100)}%`, background: DEMO.careMinutes.rn >= 40 ? "var(--brand-teal)" : "var(--brand-amber)" }} />
                </div>
                <span className="text-sm font-medium w-16 text-right">{DEMO.careMinutes.rn} min</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total care</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{ width: `${Math.min(100, (DEMO.careMinutes.total / 200) * 100)}%`, background: DEMO.careMinutes.total >= 200 ? "var(--brand-teal)" : "var(--brand-amber)" }} />
                </div>
                <span className="text-sm font-medium w-16 text-right">{DEMO.careMinutes.total} min</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Target: 200 min/resident (40 RN) · Updated hourly
            </p>
          </div>
        </div>
      </div>

      {/* Quick Status Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <button className="bg-white rounded-xl p-3 shadow-warm-sm border border-[var(--border-default)] hover:shadow-warm transition-shadow text-left">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-[var(--brand-amber)]" />
            <span className="text-xs font-medium text-gray-500">SIRS</span>
          </div>
          <span className="text-sm font-semibold text-[var(--brand-forest)]">{DEMO.sirs.openCat1 + DEMO.sirs.openCat2} open</span>
        </button>
        <button className="bg-white rounded-xl p-3 shadow-warm-sm border border-[var(--border-default)] hover:shadow-warm transition-shadow text-left">
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="w-4 h-4 text-[var(--brand-teal)]" />
            <span className="text-xs font-medium text-gray-500">Audits</span>
          </div>
          <span className="text-sm font-semibold text-[var(--brand-forest)]">2 due this week</span>
        </button>
        <button className="bg-white rounded-xl p-3 shadow-warm-sm border border-[var(--border-default)] hover:shadow-warm transition-shadow text-left">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-[var(--brand-teal)]" />
            <span className="text-xs font-medium text-gray-500">Compliance</span>
          </div>
          <span className="text-sm font-semibold text-[var(--brand-forest)]">{DEMO.compliance.score} score</span>
        </button>
        <button className="bg-white rounded-xl p-3 shadow-warm-sm border border-[var(--border-default)] hover:shadow-warm transition-shadow text-left">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-[var(--brand-amber)]" />
            <span className="text-xs font-medium text-gray-500">PSH</span>
          </div>
          <span className="text-sm font-semibold text-[var(--brand-forest)]">{DEMO.psh.elevated} elevated</span>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-5 shadow-warm border border-[var(--border-default)]">
        <h2 className="text-base font-semibold text-[var(--brand-forest)] mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {DEMO.recentActivity.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <StatusDot status={i === 0 ? "at-risk" : i === 1 ? "non-compliant" : "compliant"} className="mt-1.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-700">{item.text}</p>
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
