"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, CheckCircle, XCircle, Clock, AlertTriangle, FileText } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { home_care_data } from "@/lib/seed-data";

const schedule = home_care_data.visit_schedule_today;

const STATUS_DOT: Record<string, React.ReactNode> = {
  completed: <CheckCircle className="w-4 h-4 text-[#2D7D73]" />,
  missed: <XCircle className="w-4 h-4 text-[#C4704A]" />,
  late: <Clock className="w-4 h-4 text-[#D4A017]" />,
};

const STATUS_LABEL: Record<string, string> = {
  completed: "Completed",
  missed: "Missed",
  late: "Late",
};

function formatType(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function VisitCompliancePage() {
  const router = useRouter();

  const statCards = [
    { label: "Scheduled", value: schedule.total_scheduled, color: "text-foreground" },
    { label: "Completed", value: schedule.completed, color: "text-[#2D7D73]" },
    { label: "Missed", value: schedule.missed, color: "text-[#C4704A]" },
    { label: "Late", value: schedule.late, color: "text-[#D4A017]" },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <button
          data-has-handler="true"
          onClick={() => router.push("/dashboard")}
          className="p-1 -ml-1 hover:bg-muted rounded-lg"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">
            Visit Compliance
          </p>
          <p className="text-[10px] text-muted-foreground">
            {home_care_data.name} &middot; {home_care_data.clients} clients &middot; Updated from AlayaCare 2h ago
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="bg-card rounded-xl p-4 border border-border"
          >
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs font-medium text-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* CHRIS interpretation */}
      <div className="bg-card rounded-xl p-4 border border-border mb-4">
        <div className="flex items-start gap-2">
          <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-foreground mb-1">CHRIS interpretation</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Visit compliance is at {Math.round(schedule.compliance_rate * 100)}% today.{" "}
              {schedule.completed} of {schedule.total_scheduled} visits completed on time.
              1 missed visit (HC-041 &mdash; client not home) requires documentation within 24 hours.
              1 visit running 35 minutes late due to traffic &mdash; client has been notified.
              Overall pattern is strong; no systemic scheduling issues detected.
            </p>
          </div>
        </div>
      </div>

      {/* Today's visit schedule */}
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7280] mb-2">
        Today&apos;s visit schedule
      </p>

      <div className="space-y-2 mb-6">
        {schedule.visits.map((v) => (
          <div
            key={v.id}
            className="bg-card rounded-xl p-4 border border-border flex items-center gap-3"
          >
            <div className="shrink-0">{STATUS_DOT[v.status]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-sm font-semibold text-foreground">{v.client_id}</p>
                <span className="text-[10px] text-muted-foreground font-mono">{v.time}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {v.worker} &middot; {formatType(v.type)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                    v.status === "completed"
                      ? "bg-[rgba(45,125,115,0.1)] text-[#2D7D73]"
                      : v.status === "missed"
                        ? "bg-[rgba(196,112,74,0.1)] text-[#C4704A]"
                        : "bg-[rgba(212,160,23,0.1)] text-[#D4A017]"
                  }`}
                >
                  {STATUS_LABEL[v.status]}
                </span>
                {v.duration_min && (
                  <span className="text-[10px] text-muted-foreground">{v.duration_min} min</span>
                )}
                {v.late_minutes && (
                  <span className="text-[10px] text-[#D4A017]">+{v.late_minutes} min late</span>
                )}
              </div>
              {v.note && (
                <p className="text-[10px] text-muted-foreground/70 mt-1 italic">{v.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Needs attention */}
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7280] mb-2">
        Needs attention
      </p>

      <div className="space-y-3 mb-16">
        {/* Missed visit documentation */}
        <div className="bg-card rounded-xl p-4 border border-border border-l-4 border-l-[#C4704A]">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-[#C4704A] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground mb-1">
                Missed visit documentation required
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                HC-041 social support visit missed at 11:00 &mdash; client not home.
                Documentation must be completed within 24 hours per home care package guidelines.
              </p>
              <button
                data-has-handler="true"
                onClick={() => router.push("/dashboard/incidents")}
                className="text-xs font-medium px-3 py-2 rounded-lg bg-[#1B4332] text-white hover:opacity-90"
              >
                Document missed visit
              </button>
            </div>
          </div>
        </div>

        {/* Lone worker check-in overdue */}
        <div className="bg-card rounded-xl p-4 border border-border border-l-4 border-l-[#D4A017]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#D4A017] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground mb-1">
                Lone worker check-in overdue
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                W-003 (CSW) last checked in at 08:30 while visiting HC-007. Check-in is now overdue.
                Escalation protocol should be initiated if no response within 30 minutes.
              </p>
              <button
                data-has-handler="true"
                onClick={() => router.push("/dashboard/workers/lone")}
                className="text-xs font-medium px-3 py-2 rounded-lg bg-[#1B4332] text-white hover:opacity-90"
              >
                View lone worker status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
