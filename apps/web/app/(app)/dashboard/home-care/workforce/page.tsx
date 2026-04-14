"use client";

import { useRouter } from "next/navigation";
import {
  Users,
  ChevronRight,
  TrendingDown,
  GraduationCap,
  Briefcase,
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

/* ── colours ── */
const forest = "#1B4332";
const teal = "#2D7D73";
const amber = "#D4A017";
const terracotta = "#C4704A";
const keeperOrange = "#E07B39";

/* ── Stat cards ── */
const statCards = [
  {
    label: "Total Workers",
    value: "89",
    sub: "Camelot 48 · Avalon 41",
    color: forest,
    icon: Users,
  },
  {
    label: "Agency Use",
    value: "7.9%",
    sub: "Below 10% threshold — healthy",
    color: teal,
    icon: Briefcase,
  },
  {
    label: "Turnover",
    value: "31.2%",
    sub: "Sector average 31%",
    color: amber,
    icon: TrendingDown,
  },
  {
    label: "Training Compliance",
    value: "88%",
    sub: "Mandatory modules current",
    color: teal,
    icon: GraduationCap,
  },
];

/* ── Keeper signals ── */
const keeperSignals = [
  {
    severity: "act" as const,
    text: "Avalon turnover at 34.6% — above sector average",
    detail: "Rolling 12-month turnover exceeds the 31% sector benchmark. Exit interview themes: scheduling inflexibility and travel burden.",
  },
  {
    severity: "act" as const,
    text: "James's team PSH composite at 2.7 — lowest across coordinators",
    detail: "PSH_10 (Violence & Aggression) and PSH_09 (Remote Work) are primary drivers. 3 workers flagged for elevated risk.",
  },
  {
    severity: "watch" as const,
    text: "11 workers with training compliance gaps",
    detail: "Managing Challenging Behaviour (71.9%) and Dementia Care (76.4%) are the most common gaps.",
  },
];

/* ── Service comparison ── */
const services = [
  { name: "Camelot", workers: 48, agency: "6.3%", turnover: "28.4%", psh: 3.2 },
  { name: "Avalon", workers: 41, agency: "9.8%", turnover: "34.6%", psh: 3.0 },
];

/* ── PSH by coordinator ── */
const coordinators = [
  { name: "Sarah", score: 3.5, participation: 88 },
  { name: "Michelle", score: 3.4, participation: 85 },
  { name: "David", score: 3.2, participation: 79 },
  { name: "Karen", score: 3.1, participation: 82 },
  { name: "Tom", score: 2.9, participation: 76 },
  { name: "James", score: 2.7, participation: 73 },
];

function scoreColor(score: number) {
  if (score < 3.0) return terracotta;
  if (score < 3.5) return amber;
  return teal;
}

function severityColor(severity: "act" | "watch") {
  return severity === "act" ? terracotta : amber;
}

export default function WorkforcePage() {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <button
          onClick={() => router.push("/dashboard/home-care")}
          className="text-xs text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1"
        >
          Home Care <ChevronRight className="w-3 h-3" /> Workforce
        </button>

        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-gray-900">
            Workforce Control Centre
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            89 support workers · Camelot and Avalon · Knights of the Holy Grail
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">{card.label}</span>
                <card.icon className="w-4 h-4" style={{ color: card.color }} />
              </div>
              <p className="text-[28px] font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Keeper Signals */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: keeperOrange }}
            >
              K
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Keeper Signals</h2>
          </div>
          <div className="space-y-3">
            {keeperSignals.map((sig, i) => (
              <div
                key={i}
                className="rounded-xl p-4 border-l-4"
                style={{
                  borderColor: severityColor(sig.severity),
                  backgroundColor: `${severityColor(sig.severity)}08`,
                }}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: severityColor(sig.severity) }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{sig.text}</p>
                    <p className="text-xs text-gray-600 mt-1">{sig.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Service Table */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">By Service</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 pb-3">Service</th>
                  <th className="text-right text-xs font-medium text-gray-500 pb-3">Workers</th>
                  <th className="text-right text-xs font-medium text-gray-500 pb-3">Agency %</th>
                  <th className="text-right text-xs font-medium text-gray-500 pb-3">Turnover</th>
                  <th className="text-right text-xs font-medium text-gray-500 pb-3">PSH</th>
                </tr>
              </thead>
              <tbody>
                {services.map((svc) => (
                  <tr key={svc.name} className="border-b border-gray-50">
                    <td className="py-3 font-medium text-gray-900">{svc.name}</td>
                    <td className="py-3 text-right text-gray-700">{svc.workers}</td>
                    <td className="py-3 text-right text-gray-700">{svc.agency}</td>
                    <td className="py-3 text-right">
                      <span style={{ color: parseFloat(svc.turnover) > 31 ? terracotta : teal }}>
                        {svc.turnover}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="font-bold" style={{ color: scoreColor(svc.psh) }}>
                        {svc.psh.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PSH by Coordinator */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">PSH by Coordinator</h2>
          <div className="space-y-3">
            {coordinators.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-20 shrink-0">{c.name}</span>
                <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(c.score / 5) * 100}%`,
                      backgroundColor: scoreColor(c.score),
                    }}
                  />
                </div>
                <span className="text-sm font-bold w-8 text-right" style={{ color: scoreColor(c.score) }}>
                  {c.score.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400 w-12 text-right">{c.participation}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Credentials */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Credentials &amp; Compliance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* WWVP */}
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4" style={{ color: teal }} />
                <p className="text-sm font-semibold text-gray-900">WWVP</p>
              </div>
              <p className="text-lg font-bold" style={{ color: teal }}>86 / 89</p>
              <div className="flex items-center gap-1.5 mt-1">
                <AlertTriangle className="w-3.5 h-3.5" style={{ color: amber }} />
                <p className="text-xs" style={{ color: amber }}>3 expiring within 60 days</p>
              </div>
            </div>
            {/* AHPRA */}
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4" style={{ color: teal }} />
                <p className="text-sm font-semibold text-gray-900">AHPRA</p>
              </div>
              <p className="text-lg font-bold" style={{ color: teal }}>12 / 12</p>
              <p className="text-xs text-gray-500 mt-1">All registrations current</p>
            </div>
            {/* Training */}
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-4 h-4" style={{ color: teal }} />
                <p className="text-sm font-semibold text-gray-900">Training</p>
              </div>
              <p className="text-lg font-bold" style={{ color: amber }}>88%</p>
              <p className="text-xs text-gray-500 mt-1">Mandatory compliance rate</p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/dashboard/home-care/workforce/psh")}
            className="bg-card rounded-xl border border-border p-5 flex items-center justify-between hover:shadow-sm transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${keeperOrange}15` }}
              >
                <BarChart3 className="w-5 h-5" style={{ color: keeperOrange }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Full PSH Dashboard</p>
                <p className="text-xs text-gray-500">All 16 domains, service comparison, practices</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => router.push("/dashboard/home-care/workforce/training")}
            className="bg-card rounded-xl border border-border p-5 flex items-center justify-between hover:shadow-sm transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${teal}15` }}
              >
                <GraduationCap className="w-5 h-5" style={{ color: teal }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Training Compliance</p>
                <p className="text-xs text-gray-500">9 modules, credential status, gaps</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
    </div>
  );
}
