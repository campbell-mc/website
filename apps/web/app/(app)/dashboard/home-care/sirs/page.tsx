"use client";

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  Shield,
  ShieldCheck,
} from "lucide-react";

/* ── Design tokens ─────────────────────────────────────────────── */
const FOREST = "#1B4332";
const TEAL = "#2D7D73";
const AMBER = "#D4A017";
const TERRACOTTA = "#C4704A";

/* ── Types ─────────────────────────────────────────────────────── */

interface Incident {
  id: string;
  date: string;
  category: "Cat 1" | "Cat 2";
  description: string;
  status: "submitted";
  submitted_date: string;
  acqsc_ref: string;
  days_to_submit: number;
}

interface SirsTrigger {
  id: string;
  description: string;
}

/* ── Data ──────────────────────────────────────────────────────── */

const stats = [
  { label: "Open Incidents", value: 0, color: TEAL },
  { label: "Cat 1 YTD", value: 0, color: TEAL },
  { label: "Cat 2 YTD", value: 2, color: AMBER },
  { label: "On Time", value: "100%", color: TEAL },
];

const incidents: Incident[] = [
  {
    id: "SIRS-HC-001",
    date: "14 February 2026",
    category: "Cat 2",
    description:
      "Unreasonable use of force during personal care — worker used excessive physical guidance transferring client from wheelchair. Client reported discomfort. No injury sustained.",
    status: "submitted",
    submitted_date: "18 February 2026",
    acqsc_ref: "ACQSC-2026-HC-04821",
    days_to_submit: 4,
  },
  {
    id: "SIRS-HC-002",
    date: "28 January 2026",
    category: "Cat 2",
    description:
      "Neglect — missed medication prompt during morning visit. Client self-administered but reported the omission. No adverse outcome.",
    status: "submitted",
    submitted_date: "30 January 2026",
    acqsc_ref: "ACQSC-2026-HC-03192",
    days_to_submit: 2,
  },
];

const cat1Triggers: SirsTrigger[] = [
  { id: "C1-1", description: "Unreasonable use of force causing serious injury" },
  { id: "C1-2", description: "Sexual abuse or assault" },
  { id: "C1-3", description: "Psychological or emotional abuse causing serious harm" },
  { id: "C1-4", description: "Stealing or coercion to change legal documents" },
  { id: "C1-5", description: "Neglect causing serious injury or illness" },
  { id: "C1-6", description: "Restrictive practice — unlawful or unregulated" },
  { id: "C1-7", description: "Unexpected death or serious injury connected to care" },
];

const cat2Triggers: SirsTrigger[] = [
  { id: "C2-1", description: "Unreasonable use of force not causing serious injury" },
  { id: "C2-2", description: "Psychological or emotional abuse" },
  { id: "C2-3", description: "Financial exploitation below threshold" },
  { id: "C2-4", description: "Neglect not resulting in serious injury" },
  { id: "C2-5", description: "Inappropriate restrictive practice — documented" },
];

/* ── Page ──────────────────────────────────────────────────────── */

export default function SirsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#111827]">SIRS Register</h1>
        <p className="text-sm text-[#6B7280]">
          Support at Home &middot; Aged Care Act 2024 &middot; Mt Gib Gardens
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
            All home care visits monitored in real-time. 0 open reportable incidents.
            Sentinel scans visit notes, incident forms, and worker check-ins for SIRS triggers automatically.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-[#E5E7EB] rounded-xl bg-white px-4 py-4">
            <p className="text-xs text-[#6B7280]">{s.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Historical incidents */}
      <div className="border border-[#E5E7EB] rounded-xl bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-sm font-semibold text-[#111827] flex items-center gap-2">
            <FileText className="w-4 h-4" style={{ color: TEAL }} />
            Incident History — YTD 2026
          </h2>
        </div>
        <div className="divide-y divide-[#F3F4F6]">
          {incidents.map((inc) => (
            <div key={inc.id} className="px-5 py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-[#6B7280]">{inc.id}</span>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700"
                    >
                      {inc.category}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Submitted
                    </span>
                  </div>
                  <p className="text-sm text-[#374151] mt-2 leading-relaxed">
                    {inc.description}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Incident: {inc.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" style={{ color: TEAL }} />
                      Submitted: {inc.submitted_date}
                    </span>
                    <span className="flex items-center gap-1">
                      <ExternalLink className="w-3.5 h-3.5" />
                      ACQSC: {inc.acqsc_ref}
                    </span>
                    <span className="flex items-center gap-1 font-semibold" style={{ color: TEAL }}>
                      {inc.days_to_submit} days to submit
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SIRS trigger reference */}
      <div className="border border-[#E5E7EB] rounded-xl bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-sm font-semibold text-[#111827] flex items-center gap-2">
            <Shield className="w-4 h-4" style={{ color: FOREST }} />
            Home Care SIRS Trigger Reference
          </h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Aged Care Act 2024 — Support at Home reportable incident categories
          </p>
        </div>

        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#F3F4F6]">
          {/* Category 1 */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: TERRACOTTA }}>
                Category 1 — Priority 1
              </h3>
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700"
              >
                24h reporting
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mb-3">
              {cat1Triggers.length} triggers &middot; Report within 24 hours &middot;
              Max penalty{" "}
              <span className="font-semibold" style={{ color: TERRACOTTA }}>
                $783,000
              </span>
            </p>
            <div className="space-y-2">
              {cat1Triggers.map((t) => (
                <div key={t.id} className="flex items-start gap-2">
                  <AlertTriangle
                    className="w-3.5 h-3.5 shrink-0 mt-0.5"
                    style={{ color: TERRACOTTA }}
                  />
                  <span className="text-xs text-[#374151]">{t.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category 2 */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: AMBER }}>
                Category 2 — Priority 2
              </h3>
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700"
              >
                30 day reporting
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mb-3">
              {cat2Triggers.length} triggers &middot; Report within 30 days &middot;
              Max penalty{" "}
              <span className="font-semibold" style={{ color: AMBER }}>
                $78,300
              </span>
            </p>
            <div className="space-y-2">
              {cat2Triggers.map((t) => (
                <div key={t.id} className="flex items-start gap-2">
                  <AlertTriangle
                    className="w-3.5 h-3.5 shrink-0 mt-0.5"
                    style={{ color: AMBER }}
                  />
                  <span className="text-xs text-[#374151]">{t.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
