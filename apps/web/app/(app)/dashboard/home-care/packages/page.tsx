"use client";

import { useRouter } from "next/navigation";
import {
  Wallet,
  AlertTriangle,
  ChevronRight,
  TrendingDown,
  FileText,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import { holy_grail_home_care } from "@/lib/seed-data";

const combined = holy_grail_home_care.combined;
const metrics = combined.metrics;
const financial = combined.financial;
const packages = combined.packages;

const statCards = [
  {
    label: "Hours Utilised",
    value: `${metrics.hours_utilised_pct}%`,
    sub: "Package hours delivered",
    color: "#2D7D73",
    icon: BarChart3,
  },
  {
    label: "Unspent Funds",
    value: `${metrics.unspent_funds_pct}%`,
    sub: `$${(financial.unspent_liability / 1000).toFixed(0)}K liability`,
    color: "#D4A017",
    icon: Wallet,
  },
  {
    label: "Underspend Risk",
    value: `${packages.underspend_risk}`,
    sub: "Clients <75% utilisation",
    color: "#C4704A",
    icon: TrendingDown,
  },
  {
    label: "Budget Statements",
    value: "244/247",
    sub: `${metrics.budget_statements_due} outstanding`,
    color: metrics.budget_statements_due > 0 ? "#D4A017" : "#2D7D73",
    icon: FileText,
  },
];

export default function PackageIntelligencePage() {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => router.push("/dashboard/home-care")}
            className="text-xs text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1"
          >
            Home Care <ChevronRight className="w-3 h-3" /> Packages
          </button>
          <h1 className="text-[28px] font-bold text-gray-900">Package Intelligence</h1>
          <p className="text-sm text-gray-500 mt-1">
            Support at Home · {combined.active_clients} active clients
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">{card.label}</span>
                <card.icon className="w-4 h-4" style={{ color: card.color }} />
              </div>
              <p className="text-[28px] font-bold text-gray-900">{card.value}</p>
              <p className="text-xs mt-1" style={{ color: card.color }}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Oracle Underspend Risk Alert */}
        <div className="bg-card rounded-xl border border-border border-l-4 border-l-[#D4A017] p-5" style={{ background: "rgba(212,160,23,0.04)" }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-[#D4A017]" />
            <h2 className="text-sm font-bold text-gray-900">Oracle Underspend Risk</h2>
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: "rgba(27,67,50,0.08)", color: "#1B4332" }}>
              CHRIS Oracle
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">{packages.underspend_risk} clients</span> are tracking below 75% utilisation this quarter.
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Estimated <span className="font-semibold text-[#C4704A]">$47.2K at risk</span> of returning to government if utilisation is not addressed within the current quarter.
          </p>
          <button
            onClick={() => router.push("/dashboard/home-care/clients")}
            className="text-xs font-medium px-3 py-2 rounded-lg text-white hover:opacity-90"
            style={{ backgroundColor: "#1B4332" }}
          >
            View At-Risk Clients
          </button>
        </div>

        {/* Utilisation by Service Category */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Utilisation by Service Category</h2>
          <div className="space-y-4">
            {packages.by_service_category.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{cat.category}</span>
                    <span className="text-[10px] text-gray-400">{cat.budget_pct}% of budget</span>
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: cat.delivered_pct >= 85 ? "#2D7D73" : cat.delivered_pct >= 75 ? "#D4A017" : "#C4704A" }}
                  >
                    {cat.delivered_pct}%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${cat.delivered_pct}%`,
                      backgroundColor: cat.delivered_pct >= 85 ? "#2D7D73" : cat.delivered_pct >= 75 ? "#D4A017" : "#C4704A",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quarterly Budget Statements */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Quarterly Budget Statements</h2>
            <span className="text-xs text-gray-500">Q3 FY2026</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${(244 / 247) * 100}%`, backgroundColor: "#2D7D73" }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-900">244/247</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>244 issued</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>{metrics.budget_statements_due} outstanding</span>
            </div>
          </div>
        </div>
    </div>
  );
}
