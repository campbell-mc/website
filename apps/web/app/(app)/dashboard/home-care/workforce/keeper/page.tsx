"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, ChevronRight, Eye, ShieldAlert } from "lucide-react";

/* ── Design tokens ─────────────────────────────────────────────── */
const FOREST = "#1B4332";
const TEAL = "#2D7D73";
const AMBER = "#D4A017";
const TERRACOTTA = "#E07B39";

/* ── Types ─────────────────────────────────────────────────────── */

interface KeeperSignal {
  id: string;
  slug: string;
  title: string;
  severity: "urgent" | "watch";
  metric: string;
  summary: string;
  recommendedAction: string;
}

/* ── Data ──────────────────────────────────────────────────────── */

const signals: KeeperSignal[] = [
  {
    id: "KS-HC-001",
    slug: "lone-worker-pattern",
    title: "Lone worker safety pattern",
    severity: "urgent",
    metric: "3 overdue check-ins in 2 weeks",
    summary:
      "3 overdue check-ins in 2 weeks — Camelot Leichhardt area. Pattern suggests visit time estimates too tight for this zone.",
    recommendedAction:
      "Review AlayaCare visit time allocations for Leichhardt zone. Adjust buffer times and confirm coordinator is monitoring check-in compliance.",
  },
  {
    id: "KS-HC-002",
    slug: "avalon-turnover",
    title: "Avalon turnover precursor",
    severity: "urgent",
    metric: "34.6% turnover — 6pp above Camelot",
    summary:
      "34.6% turnover — 6pp above Camelot. PSH_09 elevated. Correlation with Northern Beaches travel burden.",
    recommendedAction:
      "Conduct retention analysis for Avalon team. Review travel reimbursement and route mapping. Schedule PSH debrief with Avalon coordinators.",
  },
  {
    id: "KS-HC-003",
    slug: "training-gap",
    title: "Training gap — challenging behaviour",
    severity: "watch",
    metric: "71.9% current — 25 workers not current",
    summary:
      "Managing Challenging Behaviour at 71.9% — 25 workers not current. PSH_10 elevated — training gap compounds in-home aggression risk.",
    recommendedAction:
      "Schedule MCB training session for the 25 non-current workers. Prioritise those rostered to high-risk clients.",
  },
  {
    id: "KS-HC-004",
    slug: "casual-correlation",
    title: "Casual worker incident correlation",
    severity: "watch",
    metric: "2/2 YTD incidents — casual relief workers",
    summary:
      "Both YTD incidents involved casual relief workers. Familiarity gap is a pattern — not a coincidence.",
    recommendedAction:
      "Create casual orientation checklist for high-risk clients. Flag clients with complex needs for permanent worker allocation only.",
  },
];

const SEVERITY_CONFIG: Record<
  string,
  { bg: string; border: string; text: string; icon: typeof AlertTriangle; label: string }
> = {
  urgent: {
    bg: "#FFFBF0",
    border: AMBER,
    text: AMBER,
    icon: AlertTriangle,
    label: "Urgent",
  },
  watch: {
    bg: "#F0F7F4",
    border: TEAL,
    text: TEAL,
    icon: Eye,
    label: "Watch",
  },
};

/* ── Page ──────────────────────────────────────────────────────── */

export default function HomeCareKeeperPage() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Keeper header */}
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: TERRACOTTA }}
        >
          <span className="text-white text-sm font-bold">K</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#111827]">
            The Keeper &middot; Home Care Signals
          </h1>
          <p className="text-sm text-[#6B7280]">
            Workforce intelligence &middot; Knights of the Holy Grail &middot;
            Support at Home
          </p>
        </div>
      </div>

      {/* Signal cards */}
      <div className="space-y-4">
        {signals.map((signal) => {
          const sev = SEVERITY_CONFIG[signal.severity];
          const Icon = sev.icon;

          return (
            <div
              key={signal.id}
              className="rounded-xl border bg-white overflow-hidden"
              style={{
                borderLeftWidth: "4px",
                borderLeftColor: sev.border,
                borderColor: "#E5E7EB",
              }}
            >
              <div className="px-5 py-4">
                {/* Top row */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                    style={{ backgroundColor: sev.bg, color: sev.text }}
                  >
                    <Icon className="w-3 h-3" />
                    {sev.label}
                  </span>
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${TERRACOTTA}15`, color: TERRACOTTA }}
                  >
                    <ShieldAlert className="w-3 h-3 inline mr-1" />
                    Keeper
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-[#111827] mb-1">
                  {signal.title}
                </h3>

                {/* Metric */}
                <p
                  className="text-xs font-bold mb-2"
                  style={{ color: sev.text }}
                >
                  {signal.metric}
                </p>

                {/* Summary */}
                <p className="text-xs text-[#6B7280] leading-relaxed mb-3">
                  {signal.summary}
                </p>

                {/* Recommended action box */}
                <div
                  className="rounded-lg p-3 mb-3"
                  style={{ backgroundColor: sev.bg }}
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-wider mb-1"
                    style={{ color: sev.text }}
                  >
                    Recommended action
                  </p>
                  <p className="text-xs text-[#374151] leading-relaxed">
                    {signal.recommendedAction}
                  </p>
                </div>

                {/* CTA */}
                <button
                  onClick={() =>
                    router.push(
                      `/dashboard/home-care/workforce/keeper/${signal.slug}`
                    )
                  }
                  className="text-sm font-medium flex items-center gap-1"
                  style={{ color: FOREST }}
                >
                  View full signal
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-16" />
    </div>
  );
}
