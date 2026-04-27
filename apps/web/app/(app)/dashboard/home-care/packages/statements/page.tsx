"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Send,
  Edit3,
  Loader2,
} from "lucide-react";
import OperationalThread from "@/components/chris/OperationalThread";

/* ── Design tokens ─────────────────────────────────────────────── */
const FOREST = "#1B4332";
const TEAL = "#2D7D73";
const AMBER = "#D4A017";
const TERRACOTTA = "#C4704A";

/* ── Types ─────────────────────────────────────────────────────── */

interface Statement {
  id: string;
  client_id: string;
  service: string;
  coordinator: string;
  budget: number;
  delivered: number;
  unspent: number;
  unspent_pct: number;
  status: "draft_ready" | "generating" | "sent";
}

/* ── Data ──────────────────────────────────────────────────────── */

const QUARTER = "Q1 2026";
const DEADLINE = "14 April 2026";
const TOTAL_SENT = 244;
const TOTAL_STATEMENTS = 247;
const REMAINING = TOTAL_STATEMENTS - TOTAL_SENT;

const statements: Statement[] = [
  {
    id: "STMT_001",
    client_id: "C-0042",
    service: "Camelot (Leichhardt)",
    coordinator: "Priya",
    budget: 8_240,
    delivered: 6_890,
    unspent: 1_350,
    unspent_pct: 16.4,
    status: "draft_ready",
  },
  {
    id: "STMT_002",
    client_id: "C-0118",
    service: "Camelot (Leichhardt)",
    coordinator: "Marcus",
    budget: 6_120,
    delivered: 4_980,
    unspent: 1_140,
    unspent_pct: 18.6,
    status: "draft_ready",
  },
  {
    id: "STMT_003",
    client_id: "C-0203",
    service: "Avalon (Manly)",
    coordinator: "Sandra",
    budget: 9_840,
    delivered: 7_920,
    unspent: 1_920,
    unspent_pct: 19.5,
    status: "generating",
  },
];

/* ── Statement preview ─────────────────────────────────────────── */

function StatementPreview({ stmt }: { stmt: Statement }) {
  return (
    <div className="bg-[#F9FAFB] rounded-lg p-5 border border-[#E5E7EB]">
      <div className="text-center mb-4">
        <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF]">
          Support at Home
        </p>
        <h4 className="text-sm font-bold text-[#111827] mt-1">
          Quarterly Budget Statement
        </h4>
        <p className="text-xs text-[#6B7280]">
          {QUARTER} &middot; {stmt.client_id}
        </p>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-[#6B7280]">Total Budget</span>
          <span className="font-semibold text-[#111827]">
            ${stmt.budget.toLocaleString()}.00
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-[#6B7280]">Services Delivered</span>
          <span className="font-semibold text-[#111827]">
            ${stmt.delivered.toLocaleString()}.00
          </span>
        </div>
        <div className="h-px bg-[#E5E7EB]" />
        <div className="flex justify-between text-xs">
          <span className="text-[#6B7280]">Unspent Funds</span>
          <span className="font-semibold" style={{ color: stmt.unspent_pct > 18 ? AMBER : TEAL }}>
            ${stmt.unspent.toLocaleString()}.00 ({stmt.unspent_pct}%)
          </span>
        </div>
        {/* Visual bar */}
        <div>
          <div className="flex justify-between text-[10px] text-[#9CA3AF] mb-1">
            <span>Delivered</span>
            <span>Unspent</span>
          </div>
          <div className="h-2 rounded-full bg-[#E5E7EB] overflow-hidden flex">
            <div
              className="h-full rounded-l-full"
              style={{
                width: `${((stmt.delivered / stmt.budget) * 100).toFixed(1)}%`,
                backgroundColor: TEAL,
              }}
            />
            <div
              className="h-full rounded-r-full"
              style={{
                width: `${stmt.unspent_pct}%`,
                backgroundColor: stmt.unspent_pct > 18 ? AMBER : `${TEAL}40`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Statement Card ────────────────────────────────────────────── */

function StatementCard({ stmt }: { stmt: Statement }) {
  const [expanded, setExpanded] = useState(false);
  const isDraft = stmt.status === "draft_ready";
  const isGenerating = stmt.status === "generating";

  return (
    <div className="border border-[#E5E7EB] rounded-xl bg-white overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-[#F9FAFB] transition-colors"
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{
            backgroundColor: isDraft ? `${TEAL}15` : isGenerating ? `${AMBER}15` : `${TEAL}15`,
          }}
        >
          {isGenerating ? (
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: AMBER }} />
          ) : (
            <FileText className="w-5 h-5" style={{ color: TEAL }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-[#6B7280]">{stmt.id}</span>
            <span className="text-xs text-[#6B7280]">&middot; {stmt.client_id}</span>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                isDraft
                  ? "bg-emerald-50 text-emerald-700"
                  : isGenerating
                  ? "bg-amber-50 text-amber-700"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              {isDraft ? "Draft ready" : isGenerating ? "Generating..." : "Sent"}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-[#111827] mt-1">
            {stmt.service}
          </h3>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Coordinator: {stmt.coordinator} &middot; Budget ${stmt.budget.toLocaleString()} &middot;{" "}
            <span
              className="font-semibold"
              style={{ color: stmt.unspent_pct > 18 ? AMBER : TEAL }}
            >
              ${stmt.unspent.toLocaleString()} unspent ({stmt.unspent_pct}%)
            </span>
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
          {/* Statement preview */}
          <StatementPreview stmt={stmt} />

          {/* Actions */}
          <div className="flex gap-3">
            {isDraft && (
              <>
                <button
                  className="text-xs font-semibold text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  style={{ backgroundColor: FOREST }}
                >
                  <Send className="w-3.5 h-3.5" />
                  Approve &amp; Send
                </button>
                <button
                  className="text-xs font-semibold px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors"
                  style={{ color: FOREST, borderColor: FOREST }}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Statement
                </button>
              </>
            )}
            {isGenerating && (
              <button
                disabled
                className="text-xs font-semibold text-[#9CA3AF] px-4 py-2 rounded-lg border border-[#E5E7EB] flex items-center gap-2 cursor-not-allowed"
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Generating...
              </button>
            )}
          </div>

          {/* Thread */}
          <OperationalThread
            object_type="budget_statement"
            object_id={stmt.id}
            facility_id="holy_grail_hc"
            current_user_role="ceo"
            visible_to_roles={["ceo", "cfo", "facility_manager"]}
          />
        </div>
      )}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function StatementsPage() {
  const progressPct = ((TOTAL_SENT / TOTAL_STATEMENTS) * 100).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#111827]">
          Quarterly Budget Statements &middot; {QUARTER}
        </h1>
        <p className="text-sm text-[#6B7280]">
          Mt Gib Gardens &middot; Support at Home
        </p>
      </div>

      {/* Deadline alert */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{
          backgroundColor: `${TERRACOTTA}10`,
          borderLeft: `3px solid ${TERRACOTTA}`,
        }}
      >
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: TERRACOTTA }} />
        <div>
          <h3 className="text-sm font-semibold" style={{ color: TERRACOTTA }}>
            Overdue — {REMAINING} statements due
          </h3>
          <p className="text-xs text-[#374151] mt-0.5">
            Deadline: <span className="font-semibold">{DEADLINE}</span>. Quarterly budget
            statements must be sent to all clients under Support at Home requirements.
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="border border-[#E5E7EB] rounded-xl bg-white px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-[#111827]">
            Dispatch Progress
          </span>
          <span className="text-sm font-bold" style={{ color: TEAL }}>
            {TOTAL_SENT}/{TOTAL_STATEMENTS}
          </span>
        </div>
        <div className="h-3 rounded-full bg-[#F3F4F6] overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progressPct}%`,
              backgroundColor: TEAL,
            }}
          />
        </div>
        <p className="text-xs text-[#6B7280] mt-1.5">
          {REMAINING} remaining &middot; {progressPct}% complete
        </p>
      </div>

      {/* Statement cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-[#374151] flex items-center gap-2">
          <Clock className="w-4 h-4" style={{ color: AMBER }} />
          Pending Statements
        </h2>
        {statements.map((stmt) => (
          <StatementCard key={stmt.id} stmt={stmt} />
        ))}
      </div>
    </div>
  );
}
