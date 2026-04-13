"use client";

import { useRouter } from "next/navigation";
import {
  Users,
  AlertTriangle,
  ChevronRight,
  FileCheck,
  MessageSquare,
  TrendingUp,
  Heart,
  ShieldAlert,
} from "lucide-react";
import { holy_grail_home_care } from "@/lib/seed-data";

const combined = holy_grail_home_care.combined;
const metrics = combined.metrics;

const statCards = [
  {
    label: "Active Clients",
    value: `${combined.active_clients}`,
    sub: "+6 this month",
    color: "#1B4332",
    icon: Users,
  },
  {
    label: "High Risk",
    value: `${metrics.high_risk_clients}`,
    sub: "Requiring enhanced monitoring",
    color: "#C4704A",
    icon: ShieldAlert,
  },
  {
    label: "Care Plans Overdue",
    value: `${metrics.care_plans_overdue}`,
    sub: `${metrics.care_plans_current_pct}% currency`,
    color: "#D4A017",
    icon: FileCheck,
  },
  {
    label: "Open Complaints",
    value: `${metrics.complaints_open}`,
    sub: "Under investigation",
    color: metrics.complaints_open > 0 ? "#D4A017" : "#2D7D73",
    icon: MessageSquare,
  },
];

const highRiskClients = [
  {
    id: "HC-001",
    name: "Margaret T.",
    service: "Camelot Home Care",
    riskFactors: ["Falls risk", "Lives alone", "Medication complexity"],
    lastVisit: "Today 9:30am",
    carePlanStatus: "Current",
  },
  {
    id: "HC-002",
    name: "Harold W.",
    service: "Avalon Home Care",
    riskFactors: ["History of aggression", "Recent hospitalisation"],
    lastVisit: "Yesterday 2:15pm",
    carePlanStatus: "Overdue",
  },
  {
    id: "HC-003",
    name: "Dorothy M.",
    service: "Camelot Home Care",
    riskFactors: ["Falls risk", "Recent hospitalisation", "Lives alone"],
    lastVisit: "Today 8:00am",
    carePlanStatus: "Current",
  },
];

const riskBadgeColors: Record<string, { bg: string; text: string }> = {
  "Falls risk": { bg: "bg-red-50", text: "text-red-700" },
  "Lives alone": { bg: "bg-amber-50", text: "text-amber-700" },
  "Medication complexity": { bg: "bg-purple-50", text: "text-purple-700" },
  "History of aggression": { bg: "bg-red-50", text: "text-red-700" },
  "Recent hospitalisation": { bg: "bg-orange-50", text: "text-orange-700" },
};

export default function ClientIntelligencePage() {
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
            Home Care <ChevronRight className="w-3 h-3" /> Clients
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Client Intelligence</h1>
          <p className="text-sm text-gray-500 mt-1">
            {combined.active_clients} active clients
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
              <p className="text-xs mt-1" style={{ color: card.color }}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* High Risk Clients */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-4 h-4 text-[#C4704A]" />
            <h2 className="text-sm font-semibold text-gray-900">High Risk Clients</h2>
            <span className="text-xs text-gray-500 ml-auto">{metrics.high_risk_clients} total</span>
          </div>
          <div className="space-y-3">
            {highRiskClients.map((client) => (
              <div
                key={client.id}
                className="rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{client.name}</p>
                    <p className="text-xs text-gray-500">{client.service} · Last visit: {client.lastVisit}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      client.carePlanStatus === "Overdue"
                        ? "bg-red-50 text-red-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    Care plan: {client.carePlanStatus}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {client.riskFactors.map((factor) => {
                    const colors = riskBadgeColors[factor] || { bg: "bg-gray-50", text: "text-gray-700" };
                    return (
                      <span
                        key={factor}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${colors.bg} ${colors.text}`}
                      >
                        {factor}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Care Plan Currency */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Care Plan Currency</h2>
            <span className="text-xs font-medium" style={{ color: "#D4A017" }}>
              {metrics.care_plans_overdue} overdue
            </span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${metrics.care_plans_current_pct}%`,
                  backgroundColor: metrics.care_plans_current_pct >= 95 ? "#2D7D73" : "#D4A017",
                }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-900">{metrics.care_plans_current_pct}%</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800">
              {metrics.care_plans_overdue} care plans are overdue for review. Target is 100% currency under Support at Home requirements.
            </p>
          </div>
        </div>

        {/* Client Satisfaction */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-4 h-4 text-[#2D7D73]" />
            <h2 className="text-sm font-semibold text-gray-900">Client Satisfaction</h2>
          </div>
          <div className="flex items-end gap-4">
            <div>
              <p className="text-3xl font-bold text-gray-900">{metrics.client_satisfaction}</p>
              <p className="text-xs text-gray-500">/100</p>
            </div>
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600">Above sector average (79.1)</span>
            </div>
          </div>
          <div className="mt-3 h-2.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${metrics.client_satisfaction}%`, backgroundColor: "#2D7D73" }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] text-gray-400">
            <span>0</span>
            <span className="text-gray-500 font-medium">Sector avg 79.1</span>
            <span>100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
