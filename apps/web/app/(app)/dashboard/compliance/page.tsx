"use client";

import { DomainControlCentre, type DomainConfig } from "@/components/dashboard/DomainControlCentre";

const config: DomainConfig = {
  name: "Governance",
  facility: "Harbison Bowral",
  dominant: {
    type: "COMPLIANCE GAP",
    title: "QS 2.8.2 evidence gap",
    chris: "Worker consultation record needs updating. Pulse participation data from last cycle satisfies this requirement. This takes 2 minutes.",
    urgency: "warning",
    actionLabel: "Fix now — 2 min →",
  },
  metrics: [
    { label: "Compliance", value: "78", sub: "3 at risk · 1 non-compliant", status: "warn", actionLabel: "Fix gaps →", href: "/dashboard/compliance" },
    { label: "Packs", value: "2", sub: "awaiting approval", status: "warn", actionLabel: "Review →", href: "/dashboard/reporting" },
    { label: "GPMS", value: "QI due", sub: "28 Apr", status: "ok", href: "/dashboard/compliance" },
    { label: "Corrective", value: "2 overdue", sub: "of 12 open", status: "bad", actionLabel: "Review →", href: "/dashboard/compliance" },
  ],
  queueTotal: 5,
  queue: [
    { urgency: "urgent", title: "Board Pack · Needs CEO approval", chris: "CHRIS draft ready. 8 sections. Est. 35 min review.", actionLabel: "Start review →" },
    { urgency: "routine", title: "Clinical Governance Pack", chris: "CHRIS draft ready. 6 sections. Est. 25 min.", actionLabel: "Start review →" },
  ],
  insights: [
    { type: "AMPLIFYING", confidence: "EMERGING", domains: ["Governance", "Workforce", "PSH"], headline: "Corrective action completion rate dropping — workload signal", detail: "Overdue rate risen from 12% to 31% over 3 months. PSH_01 elevated for Quality Lead and DON. Driver may be capacity, not intent." },
  ],
  subFeatures: [
    { label: "Compliance Register", summary: "78 score · 3 at risk · 1 non-compliant", status: "terracotta", actionLabel: "Fix gaps →", href: "/dashboard/compliance" },
    { label: "Reporting Cycles", summary: "Board Pack ready · 8 days · 35 min", status: "amber", href: "/dashboard/reporting" },
    { label: "Governance Packs", summary: "4 packs · 2 awaiting approval", status: "amber", href: "/dashboard/packs" },
    { label: "Corrective Actions", summary: "12 open · 2 overdue", status: "terracotta", href: "/dashboard/compliance" },
    { label: "Risk Register", summary: "Strategic + operational · 5 open", status: "clear", href: "/dashboard/compliance" },
    { label: "GPMS Submissions", summary: "QI Q1 ✅ · Care min due 28 Apr", status: "clear", href: "/dashboard/compliance" },
  ],
  quickActions: [
    { label: "Fix compliance gap", icon: "🔧" },
    { label: "Start pack review", icon: "📋" },
    { label: "Export evidence pack", icon: "📦" },
    { label: "View risk register", icon: "⚠️" },
  ],
};

export default function GovernanceControlCentre() {
  return <DomainControlCentre config={config} />;
}
