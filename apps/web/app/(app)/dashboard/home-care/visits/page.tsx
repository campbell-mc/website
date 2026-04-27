"use client";

import {
  Clock,
  CheckCircle,
  Play,
  AlertTriangle,
  XCircle,
  Shield,
  MapPin,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AgentPulse } from "@/components/chris/AgentPulse";
import { SituationReport } from "@/components/chris/SituationReport";
import { hcVisitsReport } from "@/lib/chris/situation-reports";
import { mt_gib_home_care } from "@/lib/seed-data";

const visits = mt_gib_home_care.combined.visits_today;
const metrics = mt_gib_home_care.combined.metrics;
const coordinators = mt_gib_home_care.combined.by_coordinator;

const statCards = [
  { label: "Completed Today", value: visits.completed, icon: CheckCircle, color: "#2D7D73" },
  { label: "In Progress", value: visits.in_progress, icon: Play, color: "#1B4332" },
  { label: "Not Started", value: visits.not_started, icon: Clock, color: "#D4A017" },
  { label: "Cancelled", value: visits.cancelled, icon: XCircle, color: "#C4704A" },
];

export default function VisitCompliancePage() {
  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <PageHeader title="Visit Compliance" subtitle="Mt Gib Home Care Southern Highlands" backHref="/dashboard/home-care" />

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
                <card.icon className="w-4 h-4" style={{ color: card.color }} />
              </div>
              <p className="text-[28px] font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">of {visits.scheduled} scheduled</p>
            </div>
          ))}
        </div>

        <AgentPulse domain="visits" />
        <SituationReport domain="visits" narrative={hcVisitsReport.narrative} refreshedAt={hcVisitsReport.refreshedAt} context={hcVisitsReport.context} signals={hcVisitsReport.signals} />

        {/* Lone Worker Safety Alert */}
        <div className="bg-card rounded-xl border border-border border-l-4 border-l-[#C4704A] p-5" style={{ background: "rgba(196,112,74,0.04)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[#C4704A]" />
            <h2 className="text-sm font-bold text-foreground">Lone Worker Safety Alert</h2>
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
              CRITICAL
            </span>
          </div>
          <div className="space-y-3">
            {visits.lone_worker_alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between rounded-xl border border-border p-4 bg-white"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${alert.client_risk === "high" ? "text-red-500" : "text-amber-500"}`} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {alert.service} · {alert.worker_role}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground/60" />
                      <span className="text-xs text-muted-foreground">{alert.suburb}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Expected checkout {alert.expected_checkout} · <span className="font-semibold text-red-600">{alert.overdue_mins}min overdue</span>
                    </p>
                    {alert.client_risk === "high" && (
                      <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-700">
                        High risk — client history of aggression
                      </span>
                    )}
                    {alert.client_risk === "standard" && (
                      <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                        Standard risk
                      </span>
                    )}
                  </div>
                </div>
                <button className="shrink-0 text-xs font-medium px-3 py-2 rounded-lg text-white hover:opacity-90" style={{ backgroundColor: "#C4704A" }}>
                  Contact Worker
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* This Week Performance */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">This Week Performance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground mb-1">Visit Compliance</p>
              <p className="text-[28px] font-bold text-foreground">{metrics.visit_compliance_pct}%</p>
              <p className="text-xs mt-1" style={{ color: "#D4A017" }}>Target 97%</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground mb-1">Travel Time</p>
              <p className="text-[28px] font-bold text-foreground">{metrics.travel_time_pct}%</p>
              <p className="text-xs text-muted-foreground mt-1">of total visit time</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground mb-1">Avg Visit Duration</p>
              <p className="text-[28px] font-bold text-foreground">64 min</p>
              <p className="text-xs text-muted-foreground mt-1">scheduled avg 60 min</p>
            </div>
          </div>
        </div>

        {/* By Coordinator */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">By Coordinator</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground">Coordinator</th>
                  <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground">Service</th>
                  <th className="text-center py-2 pr-4 text-xs font-medium text-muted-foreground">Clients</th>
                  <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground">Compliance</th>
                  <th className="text-center py-2 text-xs font-medium text-muted-foreground">Alerts</th>
                </tr>
              </thead>
              <tbody>
                {coordinators.map((c) => (
                  <tr key={c.name} className="border-b border-gray-50">
                    <td className="py-3 pr-4 font-medium text-foreground">{c.name}</td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium" style={{
                        backgroundColor: c.service === "Camelot" ? "rgba(27,67,50,0.08)" : "rgba(45,125,115,0.08)",
                        color: c.service === "Camelot" ? "#1B4332" : "#2D7D73",
                      }}>
                        {c.service === "Camelot" ? "Camelot Home Care" : "Avalon Home Care"}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-center text-foreground">{c.clients}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${c.compliance}%`,
                              backgroundColor: c.compliance >= 97 ? "#2D7D73" : c.compliance >= 95 ? "#D4A017" : "#C4704A",
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium text-foreground w-12 text-right">{c.compliance}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      {c.alerts > 0 ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                          {c.alerts}
                        </span>
                      ) : (
                        <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}
