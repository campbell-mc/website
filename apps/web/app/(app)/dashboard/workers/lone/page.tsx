"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Shield, AlertTriangle, Users, CheckCircle } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { home_care_data } from "@/lib/seed-data";

const loneWorker = home_care_data.lone_worker;
const psh = home_care_data.psh_current;

const STATUS_CONFIG: Record<string, { dot: string; label: string; pulse?: boolean }> = {
  ok: { dot: "bg-[#2D7D73]", label: "OK" },
  overdue: { dot: "bg-[#C4704A]", label: "Overdue", pulse: true },
};

function formatCheckinTime(datetime: string): string {
  const time = datetime.split(" ")[1];
  if (!time) return datetime;
  const [h, m] = time.split(":");
  return `${h}:${m}`;
}

export default function LoneWorkerSafetyPage() {
  const router = useRouter();

  const statCards = [
    { label: "Workers Active", value: loneWorker.workers_active_now, color: "text-foreground" },
    { label: "Check-ins Completed", value: loneWorker.checkins_completed, color: "text-foreground" },
    { label: "Overdue", value: loneWorker.checkins_overdue, color: "text-[#C4704A]" },
    { label: "High-Risk Visits", value: loneWorker.high_risk_visits_today, color: "text-[#D4A017]" },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
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
            Lone Worker Safety
          </p>
          <p className="text-[10px] text-muted-foreground">
            {home_care_data.name} &middot; Real-time status
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
              {loneWorker.workers_active_now} workers currently in the field.
              {" "}{loneWorker.checkins_completed} of {loneWorker.workers_active_now} have completed their scheduled check-ins.
              W-003 (CSW) check-in is overdue &mdash; last contact at 08:30 while visiting HC-007.
              {loneWorker.high_risk_visits_today} high-risk visits are scheduled today requiring enhanced monitoring protocols.
              Escalation protocol should be reviewed if W-003 does not respond within 30 minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Worker status table */}
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7280] mb-2">
        Worker status
      </p>

      <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
        {/* Table header */}
        <div className="grid grid-cols-[0.6fr_0.5fr_0.8fr_0.8fr_0.5fr] gap-2 px-4 py-2.5 border-b border-border">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Worker</p>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Role</p>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Client</p>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Last Check-in</p>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Status</p>
        </div>

        {/* Table rows */}
        {loneWorker.workers.map((w) => {
          const config = STATUS_CONFIG[w.status];
          return (
            <div
              key={w.id}
              className="grid grid-cols-[0.6fr_0.5fr_0.8fr_0.8fr_0.5fr] gap-2 px-4 py-3 border-b border-border last:border-b-0 items-center"
            >
              <p className="text-sm font-medium text-foreground">{w.id}</p>
              <p className="text-xs text-muted-foreground">{w.role}</p>
              <p className="text-xs text-muted-foreground">{w.current_client}</p>
              <p className="text-xs text-muted-foreground font-mono">{formatCheckinTime(w.last_checkin)}</p>
              <div className="flex items-center justify-end gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${config.dot} ${config.pulse ? "animate-pulse" : ""}`}
                />
                <span
                  className={`text-[10px] font-medium ${
                    w.status === "ok" ? "text-[#2D7D73]" : "text-[#C4704A]"
                  }`}
                >
                  {config.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* PSH_09 callout */}
      <div className="bg-card rounded-xl p-4 border border-border border-l-4 border-l-[#D4A017] mb-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#D4A017] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              PSH_09 (Lone Worker) elevated at {psh.PSH_09_lone_worker}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {psh.note} Participation rate at {Math.round(psh.participation_rate * 100)}%.
              This is a home-care-specific psychosocial hazard that requires ongoing monitoring
              and intervention through regular check-in protocols and peer support structures.
            </p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2 mb-16">
        <button
          data-has-handler="true"
          onClick={() => router.push("/dashboard/psh")}
          className="bg-card rounded-lg px-3 py-2.5 border border-border hover:shadow-sm text-left flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-[#D4A017]" />
          <span className="text-xs font-medium text-foreground">View PSH dashboard</span>
        </button>
        <button
          data-has-handler="true"
          onClick={() => router.push("/dashboard/workforce")}
          className="bg-card rounded-lg px-3 py-2.5 border border-border hover:shadow-sm text-left flex items-center gap-2"
        >
          <Users className="w-4 h-4 text-[#1B4332]" />
          <span className="text-xs font-medium text-foreground">Workforce overview</span>
        </button>
      </div>
    </div>
  );
}
