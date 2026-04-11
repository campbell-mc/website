"use client";

import { DomainControlCentre, type DomainConfig } from "@/components/dashboard/DomainControlCentre";

const config: DomainConfig = {
  name: "Financial",
  facility: "Harbison",
  dominant: {
    type: "CARE RATIO",
    title: "Care ratio below target",
    chris: "Care ratio is at 53% — below the 55% target. Primary driver: agency cost surge following 2 Wing B resignations. CHRIS has identified this as a culture signal, not labour market.",
    urgency: "warning",
    actionLabel: "See full analysis →",
  },
  metrics: [
    { label: "Revenue", value: "-1.2%", sub: "$2.1M vs $2.13M budget", status: "warn", actionLabel: "View variance →", href: "/dashboard/financial" },
    { label: "Care Ratio", value: "53%", sub: "vs 55% target", status: "bad", actionLabel: "Analyse →", href: "/dashboard/financial" },
    { label: "Agency", value: "$47K", sub: "22% of workforce cost", status: "bad", actionLabel: "Reduce →", href: "/dashboard/financial" },
    { label: "Budget Var.", value: "-2.1%", sub: "YTD adverse", status: "warn", actionLabel: "Review →", href: "/dashboard/financial" },
  ],
  queueTotal: 2,
  queue: [
    { urgency: "routine", title: "QFR Q2 · Draft ready", chris: "CHRIS has compiled QFR data. CFO review: 15 min.", actionLabel: "Review QFR →" },
    { urgency: "routine", title: "ELT Finance Section", chris: "P&L commentary drafted. Includes agency context.", actionLabel: "Review draft →" },
  ],
  insights: [
    { type: "CAUSAL", confidence: "STRONG", domains: ["Financial", "Workforce", "PSH"], headline: "Agency cost spike — workforce and culture root cause", detail: "Agency cost $47K above budget. Follows 2 resignations from Wing B where PSH_13 (Low Recognition) declined for 4 cycles. Culture-driven financial exposure." },
    { type: "PREDICTIVE", confidence: "EMERGING", domains: ["Financial", "Clinical"], headline: "AN-ACC revenue at risk — reassessment window", detail: "3 residents approaching reassessment. Moderate risk of downward reclassification. Est. impact: $8.2K/month." },
  ],
  subFeatures: [
    { label: "AN-ACC Revenue", summary: "$2.1M YTD · -1.2% vs budget · 3 at risk", status: "amber", href: "/dashboard/financial" },
    { label: "Cost Analysis", summary: "Labour · Agency · Hotel · Admin", status: "terracotta", href: "/dashboard/financial" },
    { label: "Budget Performance", summary: "By cost centre · 3 adverse items", status: "amber", href: "/dashboard/financial" },
    { label: "QFR Submissions", summary: "Q1 submitted ✅ · Q2 due 28 Jul", status: "clear", href: "/dashboard/financial" },
    { label: "Financial Reporting", summary: "ELT pack · Board pack · drafts ready", status: "amber", href: "/dashboard/reporting" },
    { label: "Benchmarking", summary: "Care ratio percentile · sector comparison", status: "clear", href: "/dashboard/financial" },
  ],
  quickActions: [
    { label: "Draft P&L commentary", icon: "📝" },
    { label: "Check QFR status", icon: "📊" },
    { label: "AN-ACC risk review", icon: "💰" },
    { label: "Review budget variance", icon: "📉" },
  ],
};

export default function FinancialControlCentre() {
  return <DomainControlCentre config={config} />;
}
