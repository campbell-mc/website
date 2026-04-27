"use client";

import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Users,
  Activity,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AgentPulse } from "@/components/chris/AgentPulse";
import { SituationReport } from "@/components/chris/SituationReport";
import { hcComplianceReport } from "@/lib/chris/situation-reports";
import { mt_gib_home_care } from "@/lib/seed-data";

const metrics = mt_gib_home_care.combined.metrics;
const workforce = mt_gib_home_care.combined.workforce;

type ObligationStatus = "met" | "at_risk" | "upcoming";

const statusConfig: Record<ObligationStatus, { icon: React.ElementType; bg: string; text: string; dot: string }> = {
  met: { icon: CheckCircle, bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  at_risk: { icon: AlertTriangle, bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  upcoming: { icon: Clock, bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
};

const obligations: {
  name: string;
  status: ObligationStatus;
  detail: string;
  icon: React.ElementType;
}[] = [
  {
    name: "Serious Incident Response Scheme (SIRS)",
    status: "met",
    detail: `${metrics.sirs_open} open incidents · All reportable incidents submitted within timeframe`,
    icon: Shield,
  },
  {
    name: "Quarterly Financial Report (QFR)",
    status: "upcoming",
    detail: "Due in 28 days · Q3 FY2026 submission",
    icon: FileText,
  },
  {
    name: "Budget Statements",
    status: "at_risk",
    detail: `${metrics.budget_statements_due} statements due · 244/247 current`,
    icon: FileText,
  },
  {
    name: "Care Plans",
    status: "at_risk",
    detail: `${metrics.care_plans_overdue} overdue for review · ${metrics.care_plans_current_pct}% currency`,
    icon: Activity,
  },
  {
    name: "Quality Standards",
    status: "met",
    detail: "All 7 Aged Care Quality Standards self-assessed as met",
    icon: CheckCircle,
  },
  {
    name: "Worker Screening",
    status: "met",
    detail: `All current · ${workforce.wwvp_expiring_60d} expiring within 60 days`,
    icon: Users,
  },
];

const totalObligations = 18;
const metCount = 15;
const atRiskCount = 2;
const upcomingCount = 1;

const statCards = [
  { label: "Total Obligations", value: totalObligations, color: "#1B4332", icon: Shield },
  { label: "Met", value: metCount, color: "#2D7D73", icon: CheckCircle },
  { label: "At Risk", value: atRiskCount, color: "#D4A017", icon: AlertTriangle },
  { label: "Upcoming", value: upcomingCount, color: "#2D7D73", icon: Clock },
];

export default function ComplianceRegisterPage() {
  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <PageHeader title="Compliance Register" subtitle="Mt Gib Home Care Southern Highlands" backHref="/dashboard/home-care" />

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
                <card.icon className="w-4 h-4" style={{ color: card.color }} />
              </div>
              <p className="text-[28px] font-bold text-foreground">{card.value}</p>
            </div>
          ))}
        </div>

        <AgentPulse domain="hc_compliance" />
        <SituationReport domain="compliance" narrative={hcComplianceReport.narrative} refreshedAt={hcComplianceReport.refreshedAt} context={hcComplianceReport.context} signals={hcComplianceReport.signals} />

        {/* Obligations List */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Regulatory Obligations</h2>
          <div className="space-y-3">
            {obligations.map((ob) => {
              const config = statusConfig[ob.status];
              const StatusIcon = config.icon;
              return (
                <div
                  key={ob.name}
                  className="flex items-start gap-4 rounded-xl border border-border p-4 hover:shadow-warm transition-all"
                >
                  <div className={`shrink-0 w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                    <ob.icon className={`w-4 h-4 ${config.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground">{ob.name}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${config.bg} ${config.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                        {ob.status === "met" ? "Met" : ob.status === "at_risk" ? "At Risk" : "Upcoming"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{ob.detail}</p>
                  </div>
                  <StatusIcon className={`w-5 h-5 shrink-0 ${config.text}`} />
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
}
