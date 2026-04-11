"use client";

import { useState } from "react";
import { Heart, TrendingUp, TrendingDown, Minus, ChevronRight, AlertTriangle, Shield, Download, Sparkles } from "lucide-react";
import { ScoreRing } from "@/components/ui/score-ring";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";

// 16 ISO 45003 PSH Domains
const PSH_DOMAINS = [
  { code: "PSH_01", name: "High Job Demands", category: "Work Design" },
  { code: "PSH_02", name: "Lack of Support", category: "Work Design" },
  { code: "PSH_03", name: "Poor Org Justice", category: "Work Design" },
  { code: "PSH_04", name: "Low Job Control", category: "Work Design" },
  { code: "PSH_05", name: "Poor Relationships", category: "Work Relationships" },
  { code: "PSH_06", name: "Role Conflict", category: "Work Relationships" },
  { code: "PSH_07", name: "Change Management", category: "Work Relationships" },
  { code: "PSH_08", name: "Traumatic Exposure", category: "Work Context" },
  { code: "PSH_09", name: "Remote / Isolated", category: "Work Context" },
  { code: "PSH_10", name: "Violence & Aggression", category: "Work Context" },
  { code: "PSH_11", name: "Harassment & Bullying", category: "Work Relationships" },
  { code: "PSH_12", name: "Emotional Demands", category: "Work Context" },
  { code: "PSH_13", name: "Low Recognition", category: "Reward & Recognition" },
  { code: "PSH_14", name: "Poor Environment", category: "Work Design" },
  { code: "PSH_15", name: "Job Insecurity", category: "Reward & Recognition" },
  { code: "PSH_16", name: "Work-Life Imbalance", category: "Work Context" },
];

const TEAMS = ["Merlin Wing", "Galahad Wing", "Camelot Kitchen", "Avalon Kitchen", "Excalibur Wing", "Round Table Wing"];

// Demo hazard scores
const DEMO_SCORES: Record<string, Record<string, number>> = {
  "Merlin Wing": { PSH_01: 0.72, PSH_02: 0.45, PSH_03: 0.31, PSH_04: 0.55, PSH_05: 0.28, PSH_06: 0.41, PSH_07: 0.38, PSH_08: 0.68, PSH_09: 0.12, PSH_10: 0.35, PSH_11: 0.18, PSH_12: 0.71, PSH_13: 0.52, PSH_14: 0.25, PSH_15: 0.22, PSH_16: 0.48 },
  "Galahad Wing": { PSH_01: 0.45, PSH_02: 0.32, PSH_03: 0.28, PSH_04: 0.38, PSH_05: 0.25, PSH_06: 0.33, PSH_07: 0.29, PSH_08: 0.42, PSH_09: 0.15, PSH_10: 0.22, PSH_11: 0.12, PSH_12: 0.44, PSH_13: 0.35, PSH_14: 0.20, PSH_15: 0.18, PSH_16: 0.31 },
  "Camelot Kitchen": { PSH_01: 0.55, PSH_02: 0.48, PSH_03: 0.42, PSH_04: 0.62, PSH_05: 0.30, PSH_06: 0.25, PSH_07: 0.45, PSH_08: 0.15, PSH_09: 0.10, PSH_10: 0.18, PSH_11: 0.22, PSH_12: 0.38, PSH_13: 0.65, PSH_14: 0.55, PSH_15: 0.32, PSH_16: 0.58 },
  "Avalon Kitchen": { PSH_01: 0.38, PSH_02: 0.35, PSH_03: 0.30, PSH_04: 0.42, PSH_05: 0.22, PSH_06: 0.20, PSH_07: 0.35, PSH_08: 0.10, PSH_09: 0.08, PSH_10: 0.15, PSH_11: 0.10, PSH_12: 0.25, PSH_13: 0.40, PSH_14: 0.38, PSH_15: 0.25, PSH_16: 0.35 },
  "Excalibur Wing": { PSH_01: 0.82, PSH_02: 0.58, PSH_03: 0.45, PSH_04: 0.65, PSH_05: 0.42, PSH_06: 0.55, PSH_07: 0.48, PSH_08: 0.75, PSH_09: 0.20, PSH_10: 0.52, PSH_11: 0.35, PSH_12: 0.78, PSH_13: 0.62, PSH_14: 0.38, PSH_15: 0.42, PSH_16: 0.68 },
  "Round Table Wing": { PSH_01: 0.88, PSH_02: 0.72, PSH_03: 0.65, PSH_04: 0.78, PSH_05: 0.58, PSH_06: 0.62, PSH_07: 0.55, PSH_08: 0.82, PSH_09: 0.18, PSH_10: 0.48, PSH_11: 0.42, PSH_12: 0.85, PSH_13: 0.72, PSH_14: 0.45, PSH_15: 0.52, PSH_16: 0.75 },
};

const CONVERGENCE_EVENTS = [
  { domains: ["PSH_01", "PSH_12"], team: "Round Table Wing", cycles: 3, severity: "critical" as const, recommendation: "Facility-level response required. Team-level practices insufficient at this threshold." },
  { domains: ["PSH_08", "PSH_12"], team: "Excalibur Wing", cycles: 2, severity: "high" as const, recommendation: "Review grief support. 3 resident deaths in 6 weeks driving traumatic exposure + emotional demands convergence." },
];

function getHazardColor(score: number): string {
  if (score <= 0.35) return "var(--brand-teal)";
  if (score <= 0.60) return "var(--brand-amber)";
  return "var(--brand-terracotta)";
}

function getHazardBg(score: number): string {
  if (score <= 0.35) return "rgba(45,125,115,0.15)";
  if (score <= 0.60) return "rgba(212,160,23,0.20)";
  return "rgba(196,112,74,0.25)";
}

function getStatus(score: number): "compliant" | "at-risk" | "non-compliant" {
  if (score <= 0.35) return "compliant";
  if (score <= 0.60) return "at-risk";
  return "non-compliant";
}

export default function PSHDashboardPage() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const totalElevated = Object.values(DEMO_SCORES).flatMap((t) => Object.values(t)).filter((s) => s > 0.60).length;
  const totalAmber = Object.values(DEMO_SCORES).flatMap((t) => Object.values(t)).filter((s) => s > 0.35 && s <= 0.60).length;

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--brand-forest)]">PSH Hazard Dashboard</h1>
          <p className="text-sm text-gray-500">ISO 45003 · 16 domains · {TEAMS.length} teams · Cycle 8</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-[var(--border-default)] hover:bg-[rgba(27,67,50,0.04)] transition-colors text-[var(--brand-forest)]">
          <Download className="w-4 h-4" /> Export Evidence Pack
        </button>
      </div>

      {/* Overall status */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <MetricCard label="Elevated (RED)" value={totalElevated} subtitle="Score > 0.60" status="non-compliant" />
        <MetricCard label="Monitoring (AMBER)" value={totalAmber} subtitle="Score 0.35 – 0.60" status="at-risk" />
        <MetricCard label="Convergence Events" value={CONVERGENCE_EVENTS.length} subtitle="Active this cycle" status={CONVERGENCE_EVENTS.length > 0 ? "at-risk" : "compliant"} />
      </div>

      {/* Hazard Matrix */}
      <div className="bg-white rounded-xl shadow-warm border border-[var(--border-default)] mb-6 overflow-x-auto">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-[var(--brand-forest)]">Hazard Matrix — All Teams × All Domains</h2>
          <p className="text-xs text-gray-400 mt-1">Each cell shows hazard score (0.00–1.00). Colour: teal = healthy, amber = watch, terracotta = act.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px]" style={{ minWidth: "900px" }}>
            <thead>
              <tr className="bg-[var(--brand-forest)] text-white">
                <th className="text-left px-3 py-2 sticky left-0 bg-[var(--brand-forest)] z-10 min-w-[140px]">Domain</th>
                {TEAMS.map((t) => (
                  <th key={t} className="text-center px-2 py-2 min-w-[90px]">{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PSH_DOMAINS.map((domain, i) => (
                <tr key={domain.code} className={`border-b border-gray-50 ${i % 2 === 0 ? "" : "bg-[rgba(27,67,50,0.02)]"}`}>
                  <td
                    className="px-3 py-2 font-medium text-[var(--brand-forest)] sticky left-0 bg-white z-10 cursor-pointer hover:underline"
                    style={i % 2 !== 0 ? { background: "rgba(27,67,50,0.02)" } : undefined}
                    onClick={() => setSelectedDomain(selectedDomain === domain.code ? null : domain.code)}
                  >
                    <span className="text-gray-400 mr-1">{domain.code.replace("PSH_", "")}</span>
                    {domain.name}
                  </td>
                  {TEAMS.map((team) => {
                    const score = DEMO_SCORES[team]?.[domain.code] ?? 0;
                    return (
                      <td key={team} className="text-center px-2 py-2">
                        <span
                          className="inline-block w-full py-1 rounded font-semibold"
                          style={{
                            background: getHazardBg(score),
                            color: getHazardColor(score),
                          }}
                        >
                          {score.toFixed(2)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Convergence Events */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-[var(--brand-forest)] mb-3">
          <AlertTriangle className="w-4 h-4 inline mr-2 text-[var(--brand-amber)]" />
          Convergence Events
        </h2>
        <div className="space-y-3">
          {CONVERGENCE_EVENTS.map((event, i) => (
            <div key={i} className={`rounded-xl p-4 ${event.severity === "critical" ? "card-terracotta" : "card-amber"}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={event.severity === "critical" ? "non-compliant" : "at-risk"} label={event.severity.toUpperCase()} size="xs" />
                  <span className="text-sm font-semibold text-[var(--brand-forest)]">{event.team}</span>
                </div>
                <span className="text-[10px] text-gray-400">{event.cycles} consecutive cycles</span>
              </div>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Domains:</strong> {event.domains.map((d) => PSH_DOMAINS.find((p) => p.code === d)?.name).join(" + ")}
              </p>
              <p className="text-xs text-gray-500 italic mb-2">{event.recommendation}</p>
              <button className="text-xs font-medium text-[var(--brand-teal)] hover:underline">
                <Sparkles className="w-3 h-3 inline mr-1" />Discuss with CHRIS →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ISO 45003 Evidence */}
      <div className="bg-white rounded-xl p-5 shadow-warm border border-[var(--border-default)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--brand-forest)]">
            <Shield className="w-4 h-4 inline mr-2" />
            ISO 45003 Evidence Status
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: "Identification", status: "compliant" as const, detail: "16 domains, 6 teams, systematic" },
            { label: "Assessment", status: "compliant" as const, detail: "Convergence detection active" },
            { label: "Controls", status: "at-risk" as const, detail: "2 teams need escalation" },
            { label: "Effectiveness", status: "compliant" as const, detail: "Outcome measurement automated" },
            { label: "Consultation", status: "compliant" as const, detail: "8 cycles completed" },
          ].map((item) => (
            <div key={item.label} className={`rounded-lg p-3 text-center ${item.status === "compliant" ? "card-teal" : "card-amber"}`}>
              <StatusBadge status={item.status} size="xs" className="mb-1" />
              <p className="text-xs font-semibold text-[var(--brand-forest)]">{item.label}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
