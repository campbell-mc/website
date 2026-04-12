"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, DollarSign, AlertTriangle, Clock } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { home_care_data } from "@/lib/seed-data";

const budget = home_care_data.budget_summary;

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  on_track: { bg: "bg-[rgba(45,125,115,0.1)]", text: "text-[#2D7D73]", label: "On Track" },
  at_risk: { bg: "bg-[rgba(212,160,23,0.1)]", text: "text-[#D4A017]", label: "At Risk" },
  critical: { bg: "bg-[rgba(196,112,74,0.1)]", text: "text-[#C4704A]", label: "Critical" },
};

export default function BudgetManagementPage() {
  const router = useRouter();

  const statCards = [
    { label: "Total Budgets", value: `$${(budget.total_monthly_budgets / 1000).toFixed(1)}K`, color: "text-foreground" },
    { label: "Claimed", value: `$${(budget.claimed_to_date / 1000).toFixed(1)}K`, color: "text-foreground" },
    { label: "Unspent", value: `$${(budget.unspent / 1000).toFixed(1)}K`, color: "text-[#D4A017]" },
    { label: "Care Mgmt Revenue", value: `${Math.round(budget.care_management_revenue_pct * 100)}%`, color: "text-foreground" },
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
            Budget Management
          </p>
          <p className="text-[10px] text-muted-foreground">
            {home_care_data.name}
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
              Budget utilisation is at {Math.round((1 - budget.unspent_pct) * 100)}% across {home_care_data.clients} clients.
              ${(budget.unspent / 1000).toFixed(1)}K remains unspent with {budget.claiming_deadline_days} days until the monthly claim deadline.
              {budget.clients_above_threshold} clients have utilisation below 50% &mdash; these require coordinator review to ensure
              care needs are being met and funding is not at risk of clawback. Care management revenue at {Math.round(budget.care_management_revenue_pct * 100)}%
              is within acceptable range.
            </p>
          </div>
        </div>
      </div>

      {/* Client budget table */}
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7280] mb-2">
        Client budget utilisation
      </p>

      <div className="bg-card rounded-xl border border-border overflow-hidden mb-4">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_0.8fr_0.8fr_0.6fr_0.7fr] gap-2 px-4 py-2.5 border-b border-border">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Client</p>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Budget</p>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Claimed</p>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Remain</p>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Status</p>
        </div>

        {/* Table rows */}
        {budget.clients_by_utilisation.map((c) => {
          const style = STATUS_STYLES[c.status];
          return (
            <div
              key={c.client_id}
              className="grid grid-cols-[1fr_0.8fr_0.8fr_0.6fr_0.7fr] gap-2 px-4 py-3 border-b border-border last:border-b-0 items-center"
            >
              <p className="text-sm font-medium text-foreground">{c.client_id}</p>
              <p className="text-xs text-muted-foreground text-right">${c.budget.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground text-right">${c.claimed.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground text-right">{Math.round(c.remaining_pct * 100)}%</p>
              <div className="flex justify-end">
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                  {style.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Claiming deadline banner */}
      <div className="bg-card rounded-xl p-4 border border-border border-l-4 border-l-[#D4A017] mb-4">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-[#D4A017] shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Monthly claim due in {budget.claiming_deadline_days} days</p>
            <p className="text-xs text-muted-foreground">
              Ensure all service records are verified and approved before submission deadline.
            </p>
          </div>
        </div>
      </div>

      {/* Prepare claim button */}
      <div className="mb-16">
        <button
          data-has-handler="true"
          onClick={() => router.push("/dashboard/budget/claim")}
          className="w-full text-sm font-medium px-4 py-3 rounded-xl bg-[#1B4332] text-white hover:opacity-90 flex items-center justify-center gap-2"
        >
          <DollarSign className="w-4 h-4" />
          Prepare claim
        </button>
      </div>
    </div>
  );
}
