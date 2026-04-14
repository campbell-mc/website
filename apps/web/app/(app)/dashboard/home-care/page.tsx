"use client";

import { useRouter } from "next/navigation";
import {
  Users,
  Clock,
  Wallet,
  FileCheck,
  AlertTriangle,
  ChevronRight,
  Shield,
  DollarSign,
  Briefcase,
  Activity,
} from "lucide-react";
import { holy_grail_home_care } from "@/lib/seed-data";

const org = holy_grail_home_care.organisation;
const combined = holy_grail_home_care.combined;
const metrics = combined.metrics;
const financial = combined.financial;

const statCards = [
  {
    label: "Visit Compliance",
    value: `${metrics.visit_compliance_pct}%`,
    target: "Target 97%",
    color: metrics.visit_compliance_pct >= 97 ? "#2D7D73" : "#D4A017",
    icon: Clock,
  },
  {
    label: "Hours Utilised",
    value: `${metrics.hours_utilised_pct}%`,
    target: "Package hours delivered",
    color: metrics.hours_utilised_pct >= 90 ? "#2D7D73" : "#D4A017",
    icon: Activity,
  },
  {
    label: "Unspent Funds",
    value: `${metrics.unspent_funds_pct}%`,
    target: `$${(financial.unspent_liability / 1000).toFixed(0)}K liability`,
    color: metrics.unspent_funds_pct <= 15 ? "#2D7D73" : "#D4A017",
    icon: Wallet,
  },
  {
    label: "Care Plans Current",
    value: `${metrics.care_plans_current_pct}%`,
    target: `${metrics.care_plans_overdue} overdue`,
    color: metrics.care_plans_current_pct >= 95 ? "#2D7D73" : "#D4A017",
    icon: FileCheck,
  },
];

type DomainStatus = "good" | "watch" | "act";

const domains: { label: string; status: DomainStatus; detail: string; href: string; icon: React.ElementType }[] = [
  { label: "Clients", status: "watch", detail: `${metrics.high_risk_clients} high risk`, href: "/dashboard/home-care/clients", icon: Users },
  { label: "Visits", status: "watch", detail: `${metrics.lone_worker_overdue} lone worker alerts`, href: "/dashboard/home-care/visits", icon: Clock },
  { label: "Packages", status: "good", detail: `${metrics.hours_utilised_pct}% utilised`, href: "/dashboard/home-care/packages", icon: Wallet },
  { label: "Workforce", status: "watch", detail: `${combined.workforce.agency_pct}% agency`, href: "/dashboard/home-care/workforce", icon: Briefcase },
  { label: "Compliance", status: "good", detail: "15/18 obligations met", href: "/dashboard/home-care/compliance", icon: Shield },
  { label: "Financial", status: "good", detail: `EBITDA ${financial.ebitda_return_pct}%`, href: "/dashboard/home-care/financial", icon: DollarSign },
];

const statusColors: Record<DomainStatus, { bg: string; text: string; dot: string }> = {
  good: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  watch: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  act: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

const attentionItems = [
  {
    urgency: "critical" as const,
    title: "2 lone worker check-ins overdue",
    detail: "Leichhardt (45min overdue, high risk) · Manly (15min overdue, standard risk)",
    href: "/dashboard/home-care/visits",
  },
  {
    urgency: "warning" as const,
    title: "3 budget statements due",
    detail: "Quarterly budget statements outstanding — due within 14 days",
    href: "/dashboard/home-care/packages",
  },
  {
    urgency: "warning" as const,
    title: "14 care plans overdue for review",
    detail: "94.1% currency — target 100%. Longest overdue: 42 days",
    href: "/dashboard/home-care/clients",
  },
];

export default function HomeCareDashboard() {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-6">
        {/* Demo role switcher */}
        <div className="bg-[#1B4332] rounded-xl p-3 overflow-hidden">
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "white" }}>Demo — switch role</p>
          <div className="flex gap-1.5">
            {[
              { label: "HC Manager", href: "/dashboard/home-care?care=home_care" },
              { label: "Care Coordinator", href: "/dashboard/care-coordinator?care=home_care" },
              { label: "CEO", href: "/dashboard/ceo?care=home_care" },
              { label: "CFO", href: "/dashboard/cfo?care=home_care" },
              { label: "← Residential", href: "/dashboard" },
            ].map((r) => (
              <button key={r.label} onClick={() => router.push(r.href)} className="bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 text-[11px] font-medium text-white transition-colors">
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: "rgba(27,67,50,0.08)", color: "#1B4332" }}>
              Support at Home
            </span>
          </div>
          <h1 className="text-[28px] font-bold text-gray-900">Good morning, Guinevere</h1>
          <p className="text-sm text-gray-500 mt-1">
            {org.name} · {org.location} · {combined.active_clients} active clients
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">{card.label}</span>
                <card.icon className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-[28px] font-bold text-gray-900">{card.value}</p>
              <p className="text-xs mt-1" style={{ color: card.color }}>{card.target}</p>
            </div>
          ))}
        </div>

        {/* Domain Strip */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Domain Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {domains.map((d) => {
              const sc = statusColors[d.status];
              return (
                <button
                  key={d.label}
                  onClick={() => router.push(d.href)}
                  className="flex flex-col items-start gap-2 rounded-xl border border-gray-100 p-3 hover:border-gray-200 hover:shadow-sm transition-all text-left"
                >
                  <div className="flex items-center gap-2 w-full">
                    <d.icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{d.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    <span className={`text-xs font-medium ${sc.text}`}>{d.status}</span>
                  </div>
                  <p className="text-[11px] text-gray-500">{d.detail}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Needs Attention
          </h2>
          <div className="space-y-3">
            {attentionItems.map((item, i) => (
              <button
                key={i}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center justify-between rounded-xl border p-4 text-left transition-all hover:shadow-sm ${
                  item.urgency === "critical"
                    ? "border-l-4 border-l-[#C4704A] border-gray-100 bg-[rgba(196,112,74,0.04)]"
                    : "border-l-4 border-l-[#D4A017] border-gray-100 bg-[rgba(212,160,23,0.04)]"
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Financial Snapshot */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Financial Snapshot</h2>
            <button
              onClick={() => router.push("/dashboard/home-care/financial")}
              className="text-xs font-medium flex items-center gap-1 hover:underline"
              style={{ color: "#1B4332" }}
            >
              View details <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500 mb-1">Revenue per client per day</p>
              <p className="text-[28px] font-bold text-gray-900">${financial.revenue_per_client_per_day.toFixed(2)}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500 mb-1">Care Management</p>
              <p className="text-[28px] font-bold text-gray-900">{financial.care_management_pct}%</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500 mb-1">EBITDA Return</p>
              <p className="text-[28px] font-bold text-gray-900">{financial.ebitda_return_pct}%</p>
            </div>
          </div>
        </div>
    </div>
  );
}
