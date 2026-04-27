"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  ArrowRight,
} from "lucide-react";
import OperationalThread from "@/components/chris/OperationalThread";

/* ── Design tokens ─────────────────────────────────────────────── */
const FOREST = "#1B4332";
const TEAL = "#2D7D73";
const AMBER = "#D4A017";
const TERRACOTTA = "#C4704A";

/* ── Data ──────────────────────────────────────────────────────── */

const REPORT = {
  generated: "Sunday 12 April 2026, 6:00 AM",
  opportunities: 3,
  total_uplift: 28_400,
  summary:
    "Oracle identified 3 revenue and efficiency opportunities across Mt Gib Gardens home care services. Combined uplift potential of $28,400 this quarter. Highest priority: underspend recovery across 12 clients approaching quarter-end fund expiry.",
};

interface ServiceBreakdown {
  category: string;
  hours: number;
  value: number;
}

interface Opportunity {
  id: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  uplift: number;
  description: string;
  camelot?: number;
  avalon?: number;
  service_breakdown?: ServiceBreakdown[];
  detail: string;
  recommended_action: string;
  coordinated_by: string;
}

const opportunities: Opportunity[] = [
  {
    id: "OPP_001",
    priority: "HIGH",
    title: "Underspend recovery — quarter-end fund expiry",
    uplift: 21_600,
    description:
      "12 clients risk losing unspent package funds at quarter end. Proactive service scheduling can recover $21,600 in billable hours.",
    camelot: 7,
    avalon: 5,
    service_breakdown: [
      { category: "Allied Health", hours: 142, value: 11_360 },
      { category: "Independence & Social Support", hours: 89, value: 7_120 },
      { category: "Daily Living", hours: 39, value: 3_120 },
    ],
    detail:
      "Analysis of current billing trajectory versus remaining package budgets reveals 12 clients with material unspent balances that will lapse at 30 June. Average unspent percentage is 22.4% — well above the 15% sector benchmark.",
    recommended_action:
      "Schedule catch-up services for the 12 identified clients before 30 June. Prioritise Allied Health (largest gap). Chronicler has drafted a personalised outreach letter for each client explaining available services — ready for coordinator review and send.",
    coordinated_by: "Chronicler",
  },
  {
    id: "OPP_002",
    priority: "MEDIUM",
    title: "Avalon care management revenue below benchmark",
    uplift: 4_800,
    description:
      "Avalon (Manly) care management revenue sits at 16.2% of total revenue — below the 18.7% sector average. 18 clients have undocumented coordination contacts.",
    detail:
      "Care management activities (assessments, reviews, coordination calls, case conferences) are under-documented at Avalon. 18 clients have had phone or email coordination contacts in the past 4 weeks that were not recorded as billable care management events.",
    recommended_action:
      "Train Avalon coordinators on documenting all coordination contacts as billable care management. Implement weekly documentation audit for 4 weeks. Target: lift care management revenue to 18.5%+.",
    coordinated_by: "Steward",
  },
  {
    id: "OPP_003",
    priority: "MEDIUM",
    title: "Avalon travel routing — Spit Bridge inefficiency",
    uplift: 2_000,
    description:
      "3 Avalon workers are crossing Spit Bridge unnecessarily between client visits, adding avoidable travel time. 2.1 hours per worker per week recoverable.",
    detail:
      "GPS and roster analysis shows 3 Avalon support workers with visit sequences that cross the Spit Bridge between morning and afternoon rounds. Re-sequencing visits by geographic cluster would eliminate 6.3 hours of unproductive travel per week (2.1h/worker).",
    recommended_action:
      "Re-sequence affected rosters to cluster visits by geographic zone (north vs south of Spit Bridge). Estimated saving: 6.3h/week = $2,000/quarter in productive time recovery.",
    coordinated_by: "Steward",
  },
];

const benchmarks = [
  {
    metric: "Revenue per client / month",
    camelot: "$2,840",
    avalon: "$2,610",
    sector: "$2,720",
  },
  {
    metric: "EBITDA margin",
    camelot: "9.2%",
    avalon: "7.8%",
    sector: "8.5%",
  },
  {
    metric: "Avg travel time / visit",
    camelot: "18 min",
    avalon: "24 min",
    sector: "20 min",
  },
];

/* ── Priority badge ────────────────────────────────────────────── */

function PriorityBadge({ level }: { level: "HIGH" | "MEDIUM" | "LOW" }) {
  const styles: Record<string, { bg: string; text: string }> = {
    HIGH: { bg: "bg-red-50", text: "text-red-700" },
    MEDIUM: { bg: "bg-amber-50", text: "text-amber-700" },
    LOW: { bg: "bg-emerald-50", text: "text-emerald-700" },
  };
  const s = styles[level];
  return (
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>
      {level}
    </span>
  );
}

/* ── Opportunity Card ──────────────────────────────────────────── */

function OpportunityCard({ opp }: { opp: Opportunity }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-[#E5E7EB] rounded-xl bg-white overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-[#F9FAFB] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-mono text-[#6B7280]">{opp.id}</span>
            <PriorityBadge level={opp.priority} />
            <span className="text-xs font-semibold" style={{ color: TEAL }}>
              +${opp.uplift.toLocaleString()}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-[#111827]">{opp.title}</h3>
          <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">{opp.description}</p>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-[#9CA3AF] shrink-0 mt-1" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#9CA3AF] shrink-0 mt-1" />
        )}
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-[#E5E7EB] px-5 py-4 space-y-4">
          <p className="text-sm text-[#374151] leading-relaxed">{opp.detail}</p>

          {/* Service split */}
          {opp.camelot !== undefined && opp.avalon !== undefined && (
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs text-[#374151]">
                <MapPin className="w-3.5 h-3.5" style={{ color: FOREST }} />
                Camelot (Leichhardt): <span className="font-semibold">{opp.camelot} clients</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#374151]">
                <MapPin className="w-3.5 h-3.5" style={{ color: TEAL }} />
                Avalon (Manly): <span className="font-semibold">{opp.avalon} clients</span>
              </div>
            </div>
          )}

          {/* Service category breakdown */}
          {opp.service_breakdown && (
            <div className="bg-[#F9FAFB] rounded-lg p-4">
              <h4 className="text-xs font-semibold text-[#374151] mb-3">
                By service category
              </h4>
              <div className="space-y-2">
                {opp.service_breakdown.map((sb) => (
                  <div key={sb.category} className="flex items-center justify-between text-xs">
                    <span className="text-[#374151]">{sb.category}</span>
                    <span className="text-[#6B7280]">
                      {sb.hours}h &middot;{" "}
                      <span className="font-semibold" style={{ color: TEAL }}>
                        ${sb.value.toLocaleString()}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended action */}
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: `${TEAL}10`, borderLeft: `3px solid ${TEAL}` }}
          >
            <h4 className="text-xs font-semibold mb-1" style={{ color: TEAL }}>
              Recommended action
            </h4>
            <p className="text-sm text-[#374151] leading-relaxed">{opp.recommended_action}</p>
            <p className="text-[11px] text-[#6B7280] mt-2">
              Coordinated by <span className="font-semibold">{opp.coordinated_by}</span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              className="text-xs font-semibold text-white px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: FOREST }}
            >
              Accept &amp; Schedule
            </button>
            <button
              className="text-xs font-semibold px-4 py-2 rounded-lg border transition-colors"
              style={{ color: FOREST, borderColor: FOREST }}
            >
              Modify
            </button>
            <button className="text-xs font-semibold text-[#6B7280] px-4 py-2 rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
              Dismiss
            </button>
          </div>

          {/* Thread */}
          <OperationalThread
            object_type="oracle_opportunity"
            object_id={opp.id}
            facility_id="holy_grail_hc"
            current_user_role="ceo"
            visible_to_roles={["ceo", "cfo", "facility_manager"]}
          />
        </div>
      )}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function OraclePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
          style={{ backgroundColor: TEAL }}
        >
          O
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Oracle Report</h1>
          <p className="text-sm text-[#6B7280]">
            Home Care &middot; Mt Gib Gardens
          </p>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-4 text-xs text-[#6B7280]">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> Generated {REPORT.generated}
        </span>
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> {REPORT.opportunities} opportunities
        </span>
        <span className="flex items-center gap-1 font-semibold" style={{ color: TEAL }}>
          <DollarSign className="w-3.5 h-3.5" /> ${REPORT.total_uplift.toLocaleString()} total
          uplift
        </span>
      </div>

      {/* Summary */}
      <div className="rounded-xl p-5 text-white" style={{ backgroundColor: TEAL }}>
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 shrink-0 mt-0.5 opacity-80" />
          <div>
            <h2 className="text-sm font-semibold mb-1">Summary</h2>
            <p className="text-sm leading-relaxed opacity-90">{REPORT.summary}</p>
          </div>
        </div>
      </div>

      {/* Opportunities */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-[#374151] flex items-center gap-2">
          <ArrowRight className="w-4 h-4" /> Opportunities
        </h2>
        {opportunities.map((opp) => (
          <OpportunityCard key={opp.id} opp={opp} />
        ))}
      </div>

      {/* Benchmark panel */}
      <div className="border border-[#E5E7EB] rounded-xl bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-sm font-semibold text-[#111827]">Benchmark Comparison</h2>
          <p className="text-xs text-[#6B7280]">Camelot (Leichhardt) vs Avalon (Manly) vs sector average</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F9FAFB]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280]">
                  Metric
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold" style={{ color: FOREST }}>
                  Camelot
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold" style={{ color: TEAL }}>
                  Avalon
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-[#6B7280]">
                  Sector Avg
                </th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((b) => (
                <tr key={b.metric} className="border-t border-[#F3F4F6]">
                  <td className="px-5 py-3 text-[#374151]">{b.metric}</td>
                  <td className="px-5 py-3 text-right font-semibold text-[#111827]">
                    {b.camelot}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-[#111827]">
                    {b.avalon}
                  </td>
                  <td className="px-5 py-3 text-right text-[#6B7280]">{b.sector}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
