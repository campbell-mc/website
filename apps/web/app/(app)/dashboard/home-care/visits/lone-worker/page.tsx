"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Shield,
  ChevronDown,
  ChevronUp,
  MapPin,
  User,
  Radio,
} from "lucide-react";

/* ── Design tokens ─────────────────────────────────────────────── */
const FOREST = "#1B4332";
const TEAL = "#2D7D73";
const AMBER = "#D4A017";
const TERRACOTTA = "#C4704A";

/* ── Types ─────────────────────────────────────────────────────── */

interface RiskFactor {
  label: string;
  severity: "high" | "medium" | "low";
}

interface EscalationStep {
  step: number;
  label: string;
  detail: string;
  completed: boolean;
  time?: string;
}

interface Alert {
  id: string;
  severity: "CRITICAL" | "WARNING";
  location: string;
  service: string;
  overdue_minutes: number;
  risk_level: "High" | "Standard";
  risk_factors: RiskFactor[];
  coordinator: string;
  coordinator_notified: string;
  contact_attempts: number;
  escalation: EscalationStep[];
}

interface ResolvedAlert {
  id: string;
  location: string;
  duration_minutes: number;
  resolved_by: string;
}

/* ── Data ──────────────────────────────────────────────────────── */

const stats = [
  { label: "Active Alerts", value: 2, color: TERRACOTTA },
  { label: "Resolved Today", value: 3, color: TEAL },
  { label: "High Risk Clients", value: 18, color: AMBER },
];

const activeAlerts: Alert[] = [
  {
    id: "LW001",
    severity: "CRITICAL",
    location: "Leichhardt",
    service: "Camelot",
    overdue_minutes: 45,
    risk_level: "High",
    risk_factors: [
      { label: "Aggression history", severity: "high" },
      { label: "Lives alone", severity: "medium" },
      { label: "Dementia diagnosis", severity: "high" },
    ],
    coordinator: "Marcus Chen",
    coordinator_notified: "11:45 AM",
    contact_attempts: 2,
    escalation: [
      { step: 1, label: "Auto-alert to coordinator", detail: "System notification sent to Marcus Chen", completed: true, time: "11:45 AM" },
      { step: 2, label: "SMS & call to worker", detail: "2 contact attempts — no response", completed: true, time: "11:48 AM" },
      { step: 3, label: "Coordinator attempts contact", detail: "Marcus Chen calling client landline", completed: false },
      { step: 4, label: "Escalate to service manager", detail: "If no contact within 15 minutes", completed: false },
      { step: 5, label: "Welfare check / emergency services", detail: "Dispatch welfare check to client address", completed: false },
    ],
  },
  {
    id: "LW002",
    severity: "WARNING",
    location: "Manly",
    service: "Avalon",
    overdue_minutes: 15,
    risk_level: "Standard",
    risk_factors: [
      { label: "First visit with client", severity: "low" },
    ],
    coordinator: "James Okonkwo",
    coordinator_notified: "12:05 PM",
    contact_attempts: 0,
    escalation: [
      { step: 1, label: "Auto-alert to coordinator", detail: "System notification sent to James Okonkwo", completed: true, time: "12:05 PM" },
      { step: 2, label: "SMS & call to worker", detail: "Pending — 10 min grace for standard risk", completed: false },
      { step: 3, label: "Coordinator attempts contact", detail: "If no response to SMS/call", completed: false },
      { step: 4, label: "Escalate to service manager", detail: "If no contact within 15 minutes", completed: false },
      { step: 5, label: "Welfare check / emergency services", detail: "Dispatch welfare check to client address", completed: false },
    ],
  },
];

const resolvedToday: ResolvedAlert[] = [
  { id: "LW-R1", location: "Glebe", duration_minutes: 8, resolved_by: "Worker checked in late" },
  { id: "LW-R2", location: "Dee Why", duration_minutes: 12, resolved_by: "Client rescheduled — coordinator confirmed" },
  { id: "LW-R3", location: "Balmain", duration_minutes: 6, resolved_by: "Worker phone was off — checked in on arrival" },
];

/* ── Risk badge ────────────────────────────────────────────────── */

function RiskBadge({ factor }: { factor: RiskFactor }) {
  const colors = {
    high: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    low: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
  };
  const c = colors[factor.severity];
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
      {factor.label}
    </span>
  );
}

/* ── Escalation protocol ───────────────────────────────────────── */

function EscalationProtocol({ steps }: { steps: EscalationStep[] }) {
  const completedCount = steps.filter((s) => s.completed).length;

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div key={step.step} className="flex gap-3">
            {/* Connector line + circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  step.completed
                    ? "bg-[#2D7D73] text-white"
                    : "bg-[#F3F4F6] text-[#9CA3AF] border border-[#E5E7EB]"
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  step.step
                )}
              </div>
              {!isLast && (
                <div
                  className={`w-px flex-1 min-h-[24px] ${
                    step.completed ? "bg-[#2D7D73]" : "bg-[#E5E7EB]"
                  }`}
                />
              )}
            </div>
            {/* Content */}
            <div className="pb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold ${
                    step.completed ? "text-[#111827]" : "text-[#9CA3AF]"
                  }`}
                >
                  {step.label}
                </span>
                {step.time && (
                  <span className="text-[10px] text-[#9CA3AF]">{step.time}</span>
                )}
              </div>
              <p className={`text-xs mt-0.5 ${step.completed ? "text-[#6B7280]" : "text-[#D1D5DB]"}`}>
                {step.detail}
              </p>
            </div>
          </div>
        );
      })}
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#F3F4F6]">
        <div className="flex-1 h-1.5 rounded-full bg-[#F3F4F6] overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(completedCount / steps.length) * 100}%`,
              backgroundColor: TEAL,
            }}
          />
        </div>
        <span className="text-[10px] text-[#6B7280] font-medium">
          {completedCount}/{steps.length}
        </span>
      </div>
    </div>
  );
}

/* ── Alert Card ────────────────────────────────────────────────── */

function AlertCard({ alert }: { alert: Alert }) {
  const [expanded, setExpanded] = useState(true);
  const isCritical = alert.severity === "CRITICAL";

  return (
    <div
      className="border rounded-xl bg-white overflow-hidden"
      style={{
        borderColor: isCritical ? TERRACOTTA : AMBER,
        borderWidth: "1.5px",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-[#FAFAFA] transition-colors"
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            isCritical ? "bg-red-50" : "bg-amber-50"
          }`}
        >
          <AlertTriangle
            className="w-5 h-5"
            style={{ color: isCritical ? TERRACOTTA : AMBER }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white"
              style={{
                backgroundColor: isCritical ? TERRACOTTA : AMBER,
              }}
            >
              {alert.severity}
            </span>
            <span className="text-xs font-mono text-[#6B7280]">{alert.id}</span>
            <span className="text-xs text-[#6B7280]">
              &middot; {alert.overdue_minutes}min overdue
            </span>
          </div>
          <h3 className="text-sm font-semibold text-[#111827] mt-1">
            {alert.location} &middot; {alert.service}
          </h3>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Risk level: <span className="font-semibold">{alert.risk_level}</span>
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-[#9CA3AF] shrink-0 mt-1" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#9CA3AF] shrink-0 mt-1" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-[#E5E7EB] px-5 py-4 space-y-4">
          {/* Risk factors */}
          <div>
            <h4 className="text-xs font-semibold text-[#374151] mb-2">Risk Factors</h4>
            <div className="flex flex-wrap gap-1.5">
              {alert.risk_factors.map((f) => (
                <RiskBadge key={f.label} factor={f} />
              ))}
            </div>
          </div>

          {/* Coordinator status */}
          <div className="bg-[#F9FAFB] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-[#6B7280]" />
              <span className="text-xs font-semibold text-[#374151]">
                Coordinator: {alert.coordinator}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-[#6B7280]">
              <div>
                Notified: <span className="font-medium text-[#374151]">{alert.coordinator_notified}</span>
              </div>
              <div>
                Contact attempts: <span className="font-medium text-[#374151]">{alert.contact_attempts}</span>
              </div>
            </div>
          </div>

          {/* Escalation */}
          <div>
            <h4 className="text-xs font-semibold text-[#374151] mb-3">
              Escalation Protocol
            </h4>
            <EscalationProtocol steps={alert.escalation} />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              className="text-xs font-semibold text-white px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: TEAL }}
            >
              Resolve Alert
            </button>
            <button
              className="text-xs font-semibold text-white px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: TERRACOTTA }}
            >
              Escalate Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function LoneWorkerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Shield className="w-8 h-8" style={{ color: TERRACOTTA }} />
          {/* Pulse dot */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Lone Worker Safety</h1>
          <p className="text-sm text-[#6B7280]">
            Sentinel Live Monitoring &middot; Mt Gib Gardens
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

      {/* Active alerts */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-[#374151] flex items-center gap-2">
          <Radio className="w-4 h-4" style={{ color: TERRACOTTA }} />
          Active Alerts
        </h2>
        {activeAlerts.map((a) => (
          <AlertCard key={a.id} alert={a} />
        ))}
      </div>

      {/* Resolved today */}
      <div className="border border-[#E5E7EB] rounded-xl bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-sm font-semibold text-[#111827] flex items-center gap-2">
            <CheckCircle className="w-4 h-4" style={{ color: TEAL }} />
            Resolved Today
          </h2>
        </div>
        <div className="divide-y divide-[#F3F4F6]">
          {resolvedToday.map((r) => (
            <div key={r.id} className="px-5 py-3 flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-[#374151]">{r.location}</span>
                <span className="text-xs text-[#6B7280] ml-2">{r.resolved_by}</span>
              </div>
              <span className="text-xs font-medium" style={{ color: TEAL }}>
                {r.duration_minutes}min
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol info */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: `${FOREST}08`, borderLeft: `3px solid ${FOREST}` }}
      >
        <h3 className="text-sm font-semibold mb-2" style={{ color: FOREST }}>
          Lone Worker Protocol
        </h3>
        <p className="text-xs text-[#374151] leading-relaxed">
          Under the Support at Home framework and WHS legislation, all lone workers visiting
          clients must check in at arrival and departure. If a check-in is missed, Sentinel
          automatically initiates the 5-step escalation protocol. High risk clients (aggression
          history, cognitive impairment, isolated location) trigger immediate coordinator
          notification. All escalation actions are logged for audit and regulatory review.
        </p>
      </div>
    </div>
  );
}
