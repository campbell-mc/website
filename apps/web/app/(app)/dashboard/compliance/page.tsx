"use client";

import { Shield, AlertTriangle, CheckCircle, Clock, Download, ChevronRight } from "lucide-react";
import { ScoreRing } from "@/components/ui/score-ring";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";

const FRAMEWORKS = [
  { name: "Aged Care Act 2024", standards: 8, compliant: 7, atRisk: 1, nonCompliant: 0 },
  { name: "ISO 45003 (PSH)", categories: 4, compliant: 3, atRisk: 1, nonCompliant: 0 },
  { name: "SIRS", openCat1: 0, openCat2: 1, completionRate: 92 },
  { name: "AN-ACC / Care Minutes", complianceRate: 96, gpmsStatus: "submitted" },
  { name: "WHS (NSW)", notifiable: 0, openCorrective: 3 },
];

const UPCOMING = [
  { obligation: "Q2 QI Submission", framework: "GPMS", due: "14 days", urgency: "routine" },
  { obligation: "Clinical Audit — Medication", framework: "Quality Standard 5", due: "7 days", urgency: "urgent" },
  { obligation: "SIRS Cat 2 — Corrective Action", framework: "SIRS", due: "5 days", urgency: "urgent" },
  { obligation: "PSH Assessment Review", framework: "ISO 45003", due: "21 days", urgency: "routine" },
];

export default function CompliancePage() {
  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--brand-forest)]">Compliance Register</h1>
          <p className="text-sm text-gray-500">All regulatory obligations · Harbison</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-[var(--border-default)] text-[var(--brand-forest)] hover:bg-[rgba(27,67,50,0.04)]">
          <Download className="w-4 h-4" /> Export Evidence Pack
        </button>
      </div>

      {/* Overall score */}
      <div className="flex items-center gap-6 mb-6">
        <ScoreRing score={82} size="lg" label="Overall" delta={3} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
          <MetricCard label="Compliant" value="34" subtitle="of 42 obligations" status="compliant" />
          <MetricCard label="At Risk" value="6" status="at-risk" />
          <MetricCard label="Non-Compliant" value="0" status="compliant" />
          <MetricCard label="Due This Week" value="2" status="at-risk" />
        </div>
      </div>

      {/* Framework panels */}
      <div className="space-y-3 mb-6">
        {FRAMEWORKS.map((fw) => (
          <div key={fw.name} className="bg-white rounded-xl p-4 shadow-warm-sm border border-[var(--border-default)] flex items-center justify-between hover:shadow-warm transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[var(--brand-forest)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--brand-forest)]">{fw.name}</p>
                <p className="text-xs text-gray-400">
                  {"standards" in fw && `${fw.compliant}/${fw.standards} standards compliant`}
                  {"categories" in fw && `${fw.compliant}/${fw.categories} evidence categories current`}
                  {"completionRate" in fw && `${fw.completionRate}% 30-day completion rate`}
                  {"complianceRate" in fw && `${fw.complianceRate}% monthly compliance`}
                  {"notifiable" in fw && `${fw.notifiable} notifiable incidents YTD`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {("atRisk" in fw && fw.atRisk > 0) && <StatusBadge status="at-risk" label={`${fw.atRisk} at risk`} size="xs" />}
              {("nonCompliant" in fw && fw.nonCompliant > 0) && <StatusBadge status="non-compliant" label={`${fw.nonCompliant}`} size="xs" />}
              {("openCat1" in fw && fw.openCat1 > 0) && <StatusBadge status="non-compliant" label={`${fw.openCat1} Cat 1`} size="xs" />}
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming deadlines */}
      <div className="bg-white rounded-xl p-5 shadow-warm border border-[var(--border-default)]">
        <h2 className="text-base font-semibold text-[var(--brand-forest)] mb-4">
          <Clock className="w-4 h-4 inline mr-2" />Upcoming Deadlines
        </h2>
        <div className="space-y-3">
          {UPCOMING.map((item, i) => (
            <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${item.urgency === "urgent" ? "card-amber" : "card-forest"}`}>
              <div>
                <p className="text-sm font-medium text-[var(--brand-forest)]">{item.obligation}</p>
                <p className="text-xs text-gray-500">{item.framework}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">{item.due}</span>
                <StatusBadge status={item.urgency === "urgent" ? "at-risk" : "info"} label={item.urgency} size="xs" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
