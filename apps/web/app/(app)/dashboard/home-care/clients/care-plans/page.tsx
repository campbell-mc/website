"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  FileCheck,
  MapPin,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";

/* ── Design tokens ─────────────────────────────────────────────── */
const FOREST = "#1B4332";
const TEAL = "#2D7D73";
const AMBER = "#D4A017";
const TERRACOTTA = "#C4704A";

/* ── Types ─────────────────────────────────────────────────────── */

type RiskLevel = "high" | "medium" | "low";

interface OverdueClient {
  id: string;
  days_overdue: number;
  risk: RiskLevel;
  coordinator: string;
  service: string;
  risk_factors: string[];
}

interface CoordinatorDue {
  name: string;
  service: string;
  due_count: number;
}

/* ── Data ──────────────────────────────────────────────────────── */

const stats = [
  { label: "Current", value: 233, color: TEAL },
  { label: "Overdue", value: 14, color: TERRACOTTA },
  { label: "Due in 30 Days", value: 22, color: AMBER },
];

const overdueClients: OverdueClient[] = [
  {
    id: "C-0087",
    days_overdue: 67,
    risk: "high",
    coordinator: "Marcus Chen",
    service: "Camelot (Leichhardt)",
    risk_factors: ["Complex care needs", "Falls history", "Carer fatigue"],
  },
  {
    id: "C-0134",
    days_overdue: 54,
    risk: "high",
    coordinator: "Priya Sharma",
    service: "Avalon (Manly)",
    risk_factors: ["Dementia diagnosis", "Lives alone"],
  },
  {
    id: "C-0201",
    days_overdue: 48,
    risk: "medium",
    coordinator: "James Okonkwo",
    service: "Avalon (Manly)",
    risk_factors: ["Medication changes"],
  },
  {
    id: "C-0056",
    days_overdue: 42,
    risk: "medium",
    coordinator: "Sandra Liu",
    service: "Camelot (Leichhardt)",
    risk_factors: ["Hospital discharge", "New services"],
  },
  {
    id: "C-0179",
    days_overdue: 38,
    risk: "medium",
    coordinator: "Marcus Chen",
    service: "Camelot (Leichhardt)",
    risk_factors: ["Goal review needed"],
  },
  {
    id: "C-0092",
    days_overdue: 35,
    risk: "low",
    coordinator: "James Okonkwo",
    service: "Avalon (Manly)",
    risk_factors: ["Routine review"],
  },
  {
    id: "C-0215",
    days_overdue: 31,
    risk: "low",
    coordinator: "Priya Sharma",
    service: "Camelot (Leichhardt)",
    risk_factors: ["Routine review"],
  },
  {
    id: "C-0163",
    days_overdue: 28,
    risk: "low",
    coordinator: "Sandra Liu",
    service: "Avalon (Manly)",
    risk_factors: ["Routine review"],
  },
];

const coordinatorsDueSoon: CoordinatorDue[] = [
  { name: "Marcus Chen", service: "Camelot", due_count: 5 },
  { name: "Priya Sharma", service: "Camelot", due_count: 4 },
  { name: "James Okonkwo", service: "Avalon", due_count: 4 },
  { name: "Sandra Liu", service: "Avalon", due_count: 3 },
  { name: "Elena Voss", service: "Camelot", due_count: 3 },
  { name: "Tom Nguyen", service: "Avalon", due_count: 3 },
];

/* ── Risk badge ────────────────────────────────────────────────── */

function RiskBadge({ level }: { level: RiskLevel }) {
  const styles: Record<RiskLevel, { bg: string; text: string }> = {
    high: { bg: "bg-red-50", text: "text-red-700" },
    medium: { bg: "bg-amber-50", text: "text-amber-700" },
    low: { bg: "bg-slate-50", text: "text-slate-600" },
  };
  const s = styles[level];
  return (
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${s.bg} ${s.text}`}>
      {level}
    </span>
  );
}

/* ── Days overdue colour ───────────────────────────────────────── */

function daysColor(days: number): string {
  if (days > 50) return TERRACOTTA;
  if (days > 35) return AMBER;
  return "#6B7280";
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function CarePlansPage() {
  const [showAll, setShowAll] = useState(true);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#111827]">Care Plan Review</h1>
        <p className="text-sm text-[#6B7280]">
          Annual review required under Support at Home &middot; Mt Gib Gardens
        </p>
      </div>

      {/* Compliance alert */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{
          backgroundColor: `${AMBER}12`,
          borderLeft: `3px solid ${AMBER}`,
        }}
      >
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: AMBER }} />
        <div>
          <h3 className="text-sm font-semibold" style={{ color: AMBER }}>
            CHRIS Compliance Risk — 14 care plans overdue
          </h3>
          <p className="text-xs text-[#374151] mt-0.5">
            2 clients are high risk with reviews overdue by more than 54 days. Under the Aged Care
            Act 2024, care plans must be reviewed at least annually and following any significant
            change in care needs.
          </p>
          <p className="text-[11px] text-[#6B7280] mt-1.5 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" style={{ color: TEAL }} />
            Keeper pattern note: Overdue reviews concentrated in Camelot — may indicate coordinator
            capacity issue. Recommend workload review.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-[#E5E7EB] rounded-xl bg-white px-4 py-4">
            <p className="text-xs text-[#6B7280]">{s.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Overdue list */}
      <div className="border border-[#E5E7EB] rounded-xl bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#111827] flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: TERRACOTTA }} />
            Overdue Care Plans
          </h2>
          <span className="text-xs text-[#6B7280]">Sorted by days overdue</span>
        </div>
        <div className="divide-y divide-[#F3F4F6]">
          {overdueClients.map((client) => (
            <div key={client.id} className="px-5 py-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="text-sm font-bold tabular-nums w-12 text-right"
                    style={{ color: daysColor(client.days_overdue) }}
                  >
                    {client.days_overdue}d
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#111827]">
                        {client.id}
                      </span>
                      <RiskBadge level={client.risk} />
                    </div>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      {client.coordinator} &middot; {client.service}
                    </p>
                  </div>
                </div>
                <button
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  style={{ color: FOREST, backgroundColor: `${FOREST}08` }}
                >
                  Assign Review
                </button>
              </div>
              {/* Risk factor badges */}
              <div className="flex flex-wrap gap-1.5 mt-2 ml-15 pl-[60px]">
                {client.risk_factors.map((f) => (
                  <span
                    key={f}
                    className="text-[10px] text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Due soon by coordinator */}
      <div className="border border-[#E5E7EB] rounded-xl bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-sm font-semibold text-[#111827] flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color: AMBER }} />
            Due Within 30 Days — by Coordinator
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F9FAFB]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280]">
                  Coordinator
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280]">
                  Service
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-[#6B7280]">
                  Due
                </th>
              </tr>
            </thead>
            <tbody>
              {coordinatorsDueSoon.map((c) => (
                <tr key={c.name} className="border-t border-[#F3F4F6]">
                  <td className="px-5 py-3 font-medium text-[#374151]">{c.name}</td>
                  <td className="px-5 py-3 text-[#6B7280]">{c.service}</td>
                  <td className="px-5 py-3 text-right">
                    <span className="font-semibold" style={{ color: AMBER }}>
                      {c.due_count}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          className="text-xs font-semibold text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          style={{ backgroundColor: FOREST }}
        >
          <UserCheck className="w-3.5 h-3.5" />
          Bulk Assign Reviews
        </button>
        <button
          className="text-xs font-semibold px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors"
          style={{ color: FOREST, borderColor: FOREST }}
        >
          <Download className="w-3.5 h-3.5" />
          Export Overdue List
        </button>
      </div>
    </div>
  );
}
