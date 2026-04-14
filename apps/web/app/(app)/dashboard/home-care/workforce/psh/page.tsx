"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from "lucide-react";

/* ── colours ── */
const forest = "#1B4332";
const teal = "#2D7D73";
const amber = "#D4A017";
const terracotta = "#C4704A";
const keeperOrange = "#E07B39";

/* ── All 16 PSH domains ── */
const allDomains = [
  { id: "PSH_09", label: "Remote / Isolated Work", score: 2.6, prev: 2.8, trend: "improving" as const },
  { id: "PSH_10", label: "Violence & Aggression", score: 2.7, prev: 2.9, trend: "improving" as const },
  { id: "PSH_01", label: "Job Demands", score: 2.8, prev: 2.7, trend: "worsening" as const },
  { id: "PSH_02", label: "Job Control", score: 3.0, prev: 3.0, trend: "stable" as const },
  { id: "PSH_03", label: "Role Clarity", score: 3.1, prev: 3.0, trend: "improving" as const },
  { id: "PSH_04", label: "Manager Support", score: 3.1, prev: 3.2, trend: "worsening" as const },
  { id: "PSH_05", label: "Peer Support", score: 3.2, prev: 3.1, trend: "improving" as const },
  { id: "PSH_06", label: "Change Management", score: 3.2, prev: 3.3, trend: "worsening" as const },
  { id: "PSH_07", label: "Recognition & Reward", score: 3.3, prev: 3.2, trend: "improving" as const },
  { id: "PSH_08", label: "Organisational Justice", score: 3.3, prev: 3.3, trend: "stable" as const },
  { id: "PSH_11", label: "Emotional Demands", score: 3.4, prev: 3.4, trend: "stable" as const },
  { id: "PSH_12", label: "Work-Life Balance", score: 3.4, prev: 3.3, trend: "improving" as const },
  { id: "PSH_13", label: "Bullying", score: 3.5, prev: 3.5, trend: "stable" as const },
  { id: "PSH_14", label: "Environmental Conditions", score: 3.6, prev: 3.5, trend: "improving" as const },
  { id: "PSH_15", label: "Workload Management", score: 3.7, prev: 3.6, trend: "improving" as const },
  { id: "PSH_16", label: "Training & Development", score: 3.8, prev: 3.7, trend: "improving" as const },
];

const elevatedDomains = [
  {
    id: "PSH_09",
    label: "Remote / Isolated Work",
    score: 2.6,
    explanation:
      "Home care workers frequently operate alone in client homes with limited supervisor contact. Lone worker protocols and check-in systems are critical safety controls.",
    practice: "MP_178",
    practiceLabel: "Structured lone worker check-in protocol with GPS-enabled welfare alerts",
  },
  {
    id: "PSH_10",
    label: "Violence & Aggression",
    score: 2.7,
    explanation:
      "In-home aggression risk is elevated — workers enter private residences where environmental controls are limited. Behavioural escalation plans and duress systems are essential.",
    practice: "MP_204",
    practiceLabel: "Client behavioural risk assessment with dynamic visit pairing triggers",
  },
  {
    id: "PSH_01",
    label: "Job Demands",
    score: 2.8,
    explanation:
      "Travel time between visits compresses care delivery windows. Visit intensity and geographic spread compound physical and cognitive load across split shifts.",
    practice: "MP_064",
    practiceLabel: "Travel-adjusted roster modelling with maximum consecutive visit caps",
  },
];

const serviceComparison = [
  {
    name: "Camelot",
    composite: 3.2,
    elevated: ["PSH_01", "PSH_10"],
  },
  {
    name: "Avalon",
    composite: 3.0,
    elevated: ["PSH_09", "PSH_10", "PSH_01", "PSH_04", "PSH_06", "PSH_02"],
  },
];

function TrendIcon({ trend }: { trend: "improving" | "worsening" | "stable" }) {
  if (trend === "improving") return <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />;
  if (trend === "worsening") return <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground/60" />;
}

function scoreColor(score: number) {
  if (score < 3.0) return terracotta;
  if (score < 3.5) return amber;
  return teal;
}

export default function PSHDashboardPage() {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <button
          onClick={() => router.push("/dashboard/home-care/workforce")}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          Home Care <ChevronRight className="w-3 h-3" /> Workforce <ChevronRight className="w-3 h-3" /> PSH
        </button>

        {/* Keeper Agent Header */}
        <div className="flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: keeperOrange }}
          >
            K
          </div>
          <div>
            <h1 className="text-[28px] font-bold text-foreground">
              People, Safety &amp; Happiness — Home Care
            </h1>
            <p className="text-sm text-muted-foreground">
              Keeper · Cycle 8 · Knights of the Holy Grail
            </p>
          </div>
        </div>

        {/* 3 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm font-medium text-muted-foreground mb-1">Composite Score</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold" style={{ color: amber }}>3.1</p>
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> improving
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">out of 5.0</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm font-medium text-muted-foreground mb-1">Participation</p>
            <p className="text-3xl font-bold" style={{ color: teal }}>81%</p>
            <p className="text-xs text-muted-foreground mt-1">72 of 89 workers responded</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm font-medium text-muted-foreground mb-1">Elevated Domains</p>
            <p className="text-3xl font-bold" style={{ color: terracotta }}>6</p>
            <p className="text-xs text-muted-foreground mt-1">scoring below 3.0</p>
          </div>
        </div>

        {/* HC PSH Context Box */}
        <div className="rounded-2xl border-l-4 p-5 bg-amber-50" style={{ borderColor: amber }}>
          <p className="text-sm font-semibold text-foreground mb-2">Home Care PSH Context</p>
          <p className="text-[15px] md:text-sm text-foreground leading-relaxed">
            <strong>PSH_09</strong> (Remote/Isolated Work), <strong>PSH_10</strong> (Violence &amp; Aggression),
            and <strong>PSH_01</strong> (Job Demands) are the highest-risk domains in home care — driven by
            lone worker exposure, in-home aggression risk, and travel-plus-visit intensity.
            <strong> Avalon</strong> carries higher risk than <strong>Camelot</strong> across all three domains.
          </p>
        </div>

        {/* 3 Elevated Domain Detail Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Elevated Domain Details</h2>
          {elevatedDomains.map((d) => (
            <div key={d.id} className="bg-card rounded-xl border border-border p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-mono font-bold px-2 py-1 rounded"
                    style={{ backgroundColor: `${terracotta}18`, color: terracotta }}
                  >
                    {d.id}
                  </span>
                  <span className="text-sm font-semibold text-foreground">{d.label}</span>
                </div>
                <span className="text-2xl font-bold" style={{ color: terracotta }}>
                  {d.score.toFixed(1)}
                </span>
              </div>
              <p className="text-[15px] md:text-sm text-muted-foreground leading-relaxed">{d.explanation}</p>
              <div className="rounded-xl bg-muted/50 p-3 flex items-start gap-3">
                <span
                  className="text-xs font-mono font-medium px-2 py-0.5 rounded shrink-0"
                  style={{ backgroundColor: `${teal}18`, color: teal }}
                >
                  {d.practice}
                </span>
                <p className="text-xs text-foreground">{d.practiceLabel}</p>
              </div>
            </div>
          ))}
        </div>

        {/* All 16 Domains */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">All 16 Domains — Sorted by Score</h2>
          <div className="space-y-2.5">
            {allDomains.map((d) => (
              <div key={d.id} className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground/60 w-14 shrink-0">{d.id}</span>
                <span className="text-xs text-foreground w-40 shrink-0 truncate">{d.label}</span>
                <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden relative">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(d.score / 5) * 100}%`,
                      backgroundColor: scoreColor(d.score),
                    }}
                  />
                </div>
                <span className="text-sm font-bold w-8 text-right" style={{ color: scoreColor(d.score) }}>
                  {d.score.toFixed(1)}
                </span>
                <TrendIcon trend={d.trend} />
              </div>
            ))}
          </div>
        </div>

        {/* By Service */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">By Service</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {serviceComparison.map((svc) => (
              <div key={svc.name} className="rounded-xl bg-muted/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground">{svc.name}</p>
                  <p className="text-2xl font-bold" style={{ color: scoreColor(svc.composite) }}>
                    {svc.composite.toFixed(1)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {svc.elevated.map((eid) => (
                    <span
                      key={eid}
                      className="text-xs font-mono px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${terracotta}18`, color: terracotta }}
                    >
                      {eid}
                    </span>
                  ))}
                  {svc.elevated.length === 0 && (
                    <span className="text-xs text-muted-foreground/60">No elevated domains</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
