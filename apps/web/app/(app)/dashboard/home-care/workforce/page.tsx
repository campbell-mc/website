"use client";

import { useRouter } from "next/navigation";
import {
  Users,
  ChevronRight,
  TrendingDown,
  BarChart3,
  GraduationCap,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { holy_grail_home_care } from "@/lib/seed-data";

const workforce = holy_grail_home_care.combined.workforce;

const statCards = [
  {
    label: "Total Workers",
    value: workforce.total_workers,
    sub: `${workforce.permanent} permanent · ${workforce.casual} casual · ${workforce.agency} agency`,
    color: "#1B4332",
    icon: Users,
  },
  {
    label: "Agency Use",
    value: `${workforce.agency_pct}%`,
    sub: `${workforce.agency} agency workers`,
    color: "#D4A017",
    icon: Briefcase,
  },
  {
    label: "Turnover",
    value: `${workforce.turnover_pct}%`,
    sub: "Rolling 12 months",
    color: "#C4704A",
    icon: TrendingDown,
  },
  {
    label: "Training Compliance",
    value: `${workforce.training_compliance}%`,
    sub: "Mandatory modules current",
    color: "#2D7D73",
    icon: GraduationCap,
  },
];

export default function WorkforcePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => router.push("/dashboard/home-care")}
            className="text-xs text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1"
          >
            Home Care <ChevronRight className="w-3 h-3" /> Workforce
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Workforce</h1>
          <p className="text-sm text-gray-500 mt-1">
            Knights of the Holy Grail
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">{card.label}</span>
                <card.icon className="w-4 h-4" style={{ color: card.color }} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* PSH Composite */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">People, Safety & Happiness (PSH)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500 mb-1">PSH Composite Score</p>
              <p className="text-3xl font-bold text-gray-900">{workforce.psh_composite}</p>
              <p className="text-xs text-gray-500 mt-1">/5.0 · Participation {workforce.psh_participation}%</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500 mb-1">Worker Screening</p>
              <p className="text-3xl font-bold text-gray-900">{workforce.rn_count} RNs</p>
              <p className="text-xs mt-1" style={{ color: workforce.wwvp_expiring_60d > 0 ? "#D4A017" : "#2D7D73" }}>
                {workforce.wwvp_expiring_60d} screenings expiring within 60 days
              </p>
            </div>
          </div>
        </div>

        {/* Link to PSH Dashboard */}
        <button
          onClick={() => router.push("/dashboard/psh")}
          className="w-full bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-sm transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(27,67,50,0.08)" }}>
              <BarChart3 className="w-5 h-5" style={{ color: "#1B4332" }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">PSH Dashboard</p>
              <p className="text-xs text-gray-500">View detailed People, Safety & Happiness metrics</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
