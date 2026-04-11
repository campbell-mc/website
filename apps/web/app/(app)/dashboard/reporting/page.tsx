"use client";

import { Calendar, FileText, CheckCircle, Clock, ChevronRight, AlertTriangle } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

const ACTIVE_CYCLES = [
  { type: "Monthly Clinical Governance", badge: "DON", status: "ready_for_review", sections: 6, dueIn: "3 days", estimate: "25 min", deadline: "Committee meeting 15 Apr" },
  { type: "Q2 QI Submission", badge: "GPMS", status: "assembling", sections: 14, dueIn: "14 days", estimate: "15 min", deadline: "ACQSC deadline 25 Apr" },
];

const UPCOMING = [
  { type: "ELT Intelligence Briefing", date: "1 May", approver: "CEO", chrisPrep: "29 Apr" },
  { type: "Q&R Committee Pack", date: "8 May", approver: "Quality Lead", chrisPrep: "1 May" },
  { type: "WHS Committee Pack", date: "12 May", approver: "WHS Lead", chrisPrep: "5 May" },
  { type: "Board Pack", date: "15 Jun", approver: "CEO", chrisPrep: "1 Jun" },
];

const COMPLETED = [
  { type: "Today's Briefing", period: "7 Apr", approved: "Mary T.", distributed: "14 leaders" },
  { type: "Monthly Clinical Governance", period: "Mar 2026", approved: "Mary T.", distributed: "5 members" },
  { type: "ELT Pack", period: "Mar 2026", approved: "CEO", distributed: "6 ELT members" },
];

const STATUS_MAP: Record<string, { label: string; status: "compliant" | "at-risk" | "info" }> = {
  ready_for_review: { label: "Ready for review", status: "at-risk" },
  assembling: { label: "CHRIS assembling", status: "info" },
  approved: { label: "Approved", status: "compliant" },
  distributed: { label: "Distributed", status: "compliant" },
};

export default function ReportingPage() {
  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--brand-forest)]">Reporting Cycles</h1>
        <p className="text-sm text-gray-500">Your sign-off queue and upcoming cycles</p>
      </div>

      {/* Time savings */}
      <div className="card-teal rounded-xl p-4 mb-6">
        <p className="text-sm text-[var(--brand-forest)]">
          This month, CHRIS generated first drafts for <strong>4 governance packs · 28 sections</strong>. Estimated time saved: <strong>18 hours</strong> of manual assembly. Average review time: <strong>32 minutes</strong> per pack.
        </p>
      </div>

      {/* Active cycles */}
      <h2 className="text-base font-semibold text-[var(--brand-forest)] mb-3">Requiring Your Attention</h2>
      <div className="space-y-3 mb-8">
        {ACTIVE_CYCLES.map((cycle, i) => {
          const st = STATUS_MAP[cycle.status] ?? STATUS_MAP.assembling;
          return (
            <div key={i} className="bg-white rounded-xl p-4 shadow-warm-sm border border-[var(--border-default)] hover:shadow-warm transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={st.status} label={cycle.badge} size="xs" />
                  <span className="text-sm font-semibold text-[var(--brand-forest)]">{cycle.type}</span>
                </div>
                <StatusBadge status={st.status} label={st.label} size="xs" />
              </div>
              <p className="text-xs text-gray-500 mb-3">
                {cycle.sections} sections · Due: {cycle.dueIn} · Est. review: {cycle.estimate}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400">{cycle.deadline}</span>
                <button className="text-xs font-medium px-3 py-2 rounded-lg bg-[var(--brand-forest)] text-white hover:opacity-90">
                  {cycle.status === "ready_for_review" ? "Review and approve →" : "View progress →"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming */}
      <h2 className="text-base font-semibold text-[var(--brand-forest)] mb-3">Upcoming — Next 60 Days</h2>
      <div className="bg-white rounded-xl shadow-warm border border-[var(--border-default)] mb-8 overflow-hidden">
        {UPCOMING.map((item, i) => (
          <div key={i} className={`flex items-center justify-between px-4 py-3 ${i < UPCOMING.length - 1 ? "border-b border-gray-50" : ""}`}>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-[var(--brand-forest)]">{item.type}</p>
                <p className="text-[10px] text-gray-400">Approver: {item.approver} · CHRIS prep: {item.chrisPrep}</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">{item.date}</span>
          </div>
        ))}
      </div>

      {/* Completed */}
      <h2 className="text-base font-semibold text-[var(--brand-forest)] mb-3">Recently Completed</h2>
      <div className="bg-white rounded-xl shadow-warm border border-[var(--border-default)] overflow-hidden">
        {COMPLETED.map((item, i) => (
          <div key={i} className={`flex items-center justify-between px-4 py-3 ${i < COMPLETED.length - 1 ? "border-b border-gray-50" : ""}`}>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-[var(--brand-teal)]" />
              <div>
                <p className="text-sm font-medium text-[var(--brand-forest)]">{item.type}</p>
                <p className="text-[10px] text-gray-400">{item.period} · Approved by {item.approved} · Sent to {item.distributed}</p>
              </div>
            </div>
            <button className="text-xs text-[var(--brand-teal)] hover:underline">View</button>
          </div>
        ))}
      </div>
    </div>
  );
}
