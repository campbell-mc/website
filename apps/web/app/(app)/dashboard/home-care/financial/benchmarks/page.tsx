"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, AlertTriangle } from "lucide-react";

/* ── colours ── */
const forest = "#1B4332";
const teal = "#2D7D73";
const amber = "#D4A017";
const terracotta = "#C4704A";

/* ── Benchmark data ── */
type Metric = {
  label: string;
  kothg: number;
  sectorAvg: number;
  topQuartile?: number;
  unit: string;
  higherIsBetter: boolean;
  serviceSplit?: { camelot: number; avalon: number; flagged?: boolean };
};

const categories: { title: string; metrics: Metric[] }[] = [
  {
    title: "Revenue",
    metrics: [
      {
        label: "Revenue per Client per Day",
        kothg: 84.2,
        sectorAvg: 84.89,
        topQuartile: 91.2,
        unit: "$",
        higherIsBetter: true,
      },
      {
        label: "Care Management Cost %",
        kothg: 19.1,
        sectorAvg: 18.7,
        topQuartile: 16.5,
        unit: "%",
        higherIsBetter: false,
        serviceSplit: { camelot: 21.4, avalon: 16.2, flagged: true },
      },
      {
        label: "Package Management Cost %",
        kothg: 13.8,
        sectorAvg: 13.2,
        topQuartile: 11.8,
        unit: "%",
        higherIsBetter: false,
      },
    ],
  },
  {
    title: "Profitability",
    metrics: [
      {
        label: "EBITDA Margin",
        kothg: 6.8,
        sectorAvg: 6.4,
        topQuartile: 9.2,
        unit: "%",
        higherIsBetter: true,
      },
      {
        label: "NPBT per Client per Day",
        kothg: 4.61,
        sectorAvg: 4.33,
        topQuartile: 6.1,
        unit: "$",
        higherIsBetter: true,
      },
    ],
  },
  {
    title: "Operational",
    metrics: [
      {
        label: "Unspent Funds %",
        kothg: 18.3,
        sectorAvg: 18.7,
        topQuartile: 14.0,
        unit: "%",
        higherIsBetter: false,
      },
      {
        label: "Travel Cost %",
        kothg: 14.2,
        sectorAvg: 12.0,
        topQuartile: 9.5,
        unit: "%",
        higherIsBetter: false,
        serviceSplit: { camelot: 11.4, avalon: 17.8, flagged: true },
      },
      {
        label: "Visit Compliance",
        kothg: 96.2,
        sectorAvg: 97.0,
        topQuartile: 98.5,
        unit: "%",
        higherIsBetter: true,
      },
    ],
  },
  {
    title: "Client",
    metrics: [
      {
        label: "Client Experience Measure (CEM)",
        kothg: 81.3,
        sectorAvg: 79.1,
        topQuartile: 85.0,
        unit: "",
        higherIsBetter: true,
      },
    ],
  },
];

function metricStatus(m: Metric): "good" | "watch" | "behind" {
  if (m.higherIsBetter) {
    if (m.kothg >= (m.topQuartile ?? m.sectorAvg)) return "good";
    if (m.kothg >= m.sectorAvg) return "watch";
    return "behind";
  } else {
    if (m.kothg <= (m.topQuartile ?? m.sectorAvg)) return "good";
    if (m.kothg <= m.sectorAvg) return "watch";
    return "behind";
  }
}

function statusColor(status: "good" | "watch" | "behind") {
  if (status === "good") return teal;
  if (status === "watch") return amber;
  return terracotta;
}

function formatVal(val: number, unit: string) {
  if (unit === "$") return `$${val.toFixed(2)}`;
  if (unit === "%") return `${val.toFixed(1)}%`;
  return val.toFixed(1);
}

export default function BenchmarksPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <button
          onClick={() => router.push("/dashboard/home-care/financial")}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          Home Care <ChevronRight className="w-3 h-3" /> Financial <ChevronRight className="w-3 h-3" /> Benchmarks
        </button>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Home Care Benchmarks</h1>
          <p className="text-sm text-gray-500 mt-1">
            StewartBrown ACFPS FY25 Home Care · 247 providers
          </p>
          <p className="text-sm text-gray-500">Knights of the Holy Grail</p>
        </div>

        {/* Categories */}
        {categories.map((cat) => (
          <div key={cat.title} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5">
            <h2 className="text-sm font-semibold text-gray-900">{cat.title}</h2>

            {cat.metrics.map((m) => {
              const status = metricStatus(m);
              const barMax = Math.max(m.kothg, m.sectorAvg, m.topQuartile ?? 0) * 1.15;

              return (
                <div key={m.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{m.label}</span>
                    <span className="text-lg font-bold" style={{ color: statusColor(status) }}>
                      {formatVal(m.kothg, m.unit)}
                    </span>
                  </div>

                  {/* Benchmark bar */}
                  <div className="relative h-6 bg-gray-100 rounded-full overflow-visible">
                    {/* KOTHG bar */}
                    <div
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{
                        width: `${(m.kothg / barMax) * 100}%`,
                        backgroundColor: statusColor(status),
                        opacity: 0.8,
                      }}
                    />
                    {/* Sector avg marker */}
                    <div
                      className="absolute top-0 h-full w-0.5 bg-gray-500"
                      style={{ left: `${(m.sectorAvg / barMax) * 100}%` }}
                    >
                      <span className="absolute -top-5 -translate-x-1/2 text-[10px] text-gray-500 whitespace-nowrap">
                        Sector avg
                      </span>
                    </div>
                    {/* Top quartile marker */}
                    {m.topQuartile && (
                      <div
                        className="absolute top-0 h-full w-0.5"
                        style={{ left: `${(m.topQuartile / barMax) * 100}%`, backgroundColor: teal }}
                      >
                        <span
                          className="absolute -bottom-5 -translate-x-1/2 text-[10px] whitespace-nowrap"
                          style={{ color: teal }}
                        >
                          Top quartile
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                    <span>
                      KOTHG: <strong>{formatVal(m.kothg, m.unit)}</strong>
                    </span>
                    <span>
                      Sector: <strong>{formatVal(m.sectorAvg, m.unit)}</strong>
                    </span>
                    {m.topQuartile && (
                      <span style={{ color: teal }}>
                        Top quartile: <strong>{formatVal(m.topQuartile, m.unit)}</strong>
                      </span>
                    )}
                  </div>

                  {/* Service split */}
                  {m.serviceSplit && (
                    <div
                      className="rounded-xl p-3 mt-2 flex items-center gap-4"
                      style={{
                        backgroundColor: m.serviceSplit.flagged ? `${amber}10` : "#f9fafb",
                        border: m.serviceSplit.flagged ? `1px solid ${amber}30` : "1px solid #f3f4f6",
                      }}
                    >
                      {m.serviceSplit.flagged && (
                        <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: amber }} />
                      )}
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-gray-700">
                          Camelot:{" "}
                          <strong
                            style={{
                              color:
                                m.serviceSplit.flagged &&
                                ((m.higherIsBetter && m.serviceSplit.camelot < m.sectorAvg) ||
                                  (!m.higherIsBetter && m.serviceSplit.camelot > m.sectorAvg))
                                  ? terracotta
                                  : forest,
                            }}
                          >
                            {formatVal(m.serviceSplit.camelot, m.unit)}
                          </strong>
                        </span>
                        <span className="text-gray-400">vs</span>
                        <span className="text-gray-700">
                          Avalon:{" "}
                          <strong
                            style={{
                              color:
                                m.serviceSplit.flagged &&
                                ((m.higherIsBetter && m.serviceSplit.avalon < m.sectorAvg) ||
                                  (!m.higherIsBetter && m.serviceSplit.avalon > m.sectorAvg))
                                  ? terracotta
                                  : forest,
                            }}
                          >
                            {formatVal(m.serviceSplit.avalon, m.unit)}
                          </strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
