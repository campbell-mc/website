"use client";

import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

/* ── Design tokens ─────────────────────────────────────────────── */
const FOREST = "#1B4332";
const TEAL = "#2D7D73";
const AMBER = "#D4A017";
const TERRACOTTA = "#C4704A";

/* ── Data ──────────────────────────────────────────────────────── */

const stats = [
  { label: "Open", value: 0, color: TEAL },
  { label: "Requiring SIRS", value: 0, color: TEAL },
  { label: "Closed this month", value: 1, color: AMBER },
  { label: "Avg days to close", value: 6, color: TEAL },
];

interface ClosedIncident {
  id: string;
  date: string;
  description: string;
  sirsCat: "Cat 2";
  service: string;
  closedDate: string;
}

const closedIncidents: ClosedIncident[] = [
  {
    id: "INC-HC-003",
    date: "14 February 2026",
    description: "Client fall during visit — Balmain",
    sirsCat: "Cat 2",
    service: "Camelot Home Care · Leichhardt",
    closedDate: "22 February 2026",
  },
  {
    id: "INC-HC-004",
    date: "28 January 2026",
    description: "Medication error — Dee Why",
    sirsCat: "Cat 2",
    service: "Avalon Home Care · Manly",
    closedDate: "4 February 2026",
  },
];

/* ── Page ──────────────────────────────────────────────────────── */

export default function HomeCarIncidentsPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#111827]">
          Incidents &middot; Knights of the Holy Grail &middot; Support at Home
        </h1>
        <p className="text-sm text-[#6B7280]">
          All home care incident records &middot; Camelot Leichhardt &amp; Avalon Manly
        </p>
      </div>

      {/* Sentinel monitoring status */}
      <div
        className="rounded-xl p-4 flex items-center gap-3"
        style={{
          backgroundColor: `${TEAL}10`,
          borderLeft: `3px solid ${TEAL}`,
        }}
      >
        <ShieldCheck className="w-5 h-5 shrink-0" style={{ color: TEAL }} />
        <div>
          <h3 className="text-sm font-semibold" style={{ color: TEAL }}>
            Sentinel Monitoring Active
          </h3>
          <p className="text-xs text-[#374151]">
            All visits monitored in real-time. Visit notes, check-in logs, and
            worker reports scanned continuously for incident triggers. 0 open
            reportable incidents.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="border border-[#E5E7EB] rounded-xl bg-white px-4 py-4"
          >
            <p className="text-xs text-[#6B7280]">{s.label}</p>
            <p
              className="text-2xl font-bold mt-1"
              style={{ color: s.color }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Log new incident */}
      <button
        className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
        style={{ backgroundColor: FOREST }}
      >
        <Plus className="w-4 h-4" />
        Log new incident
      </button>

      {/* Closed YTD */}
      <div className="border border-[#E5E7EB] rounded-xl bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-sm font-semibold text-[#111827] flex items-center gap-2">
            <FileText className="w-4 h-4" style={{ color: TEAL }} />
            Closed Incidents — YTD 2026
          </h2>
        </div>
        <div className="divide-y divide-[#F3F4F6]">
          {closedIncidents.map((inc) => (
            <div key={inc.id} className="px-5 py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-[#6B7280]">
                      {inc.id}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                      SIRS {inc.sirsCat}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Closed
                    </span>
                  </div>
                  <p className="text-sm text-[#374151] mt-2 font-medium">
                    {inc.description}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Incident: {inc.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle
                        className="w-3.5 h-3.5"
                        style={{ color: TEAL }}
                      />
                      Closed: {inc.closedDate}
                    </span>
                    <span className="text-xs text-[#6B7280]">
                      {inc.service}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern analysis */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{
          backgroundColor: `${AMBER}10`,
          borderLeft: `3px solid ${AMBER}`,
        }}
      >
        <TrendingUp
          className="w-5 h-5 shrink-0 mt-0.5"
          style={{ color: AMBER }}
        />
        <div>
          <h3
            className="text-sm font-semibold mb-1"
            style={{ color: AMBER }}
          >
            Pattern Analysis
          </h3>
          <p className="text-xs text-[#374151] leading-relaxed">
            Both incidents occurred during visits with casual relief workers
            — correlation with worker familiarity flagged by The Keeper.
          </p>
        </div>
      </div>

      {/* SIRS trigger reference link */}
      <button
        onClick={() => router.push("/dashboard/home-care/sirs")}
        className="w-full py-3 rounded-xl text-sm font-medium border flex items-center justify-center gap-2"
        style={{ borderColor: FOREST, color: FOREST }}
      >
        <AlertTriangle className="w-4 h-4" />
        SIRS trigger reference and register
      </button>

      <div className="h-16" />
    </div>
  );
}
