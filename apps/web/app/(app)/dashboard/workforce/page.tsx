"use client";

import { DomainControlCentre, type DomainConfig } from "@/components/dashboard/DomainControlCentre";

const config: DomainConfig = {
  name: "Workforce",
  facility: "Harbison Bowral",
  dominant: {
    type: "RETENTION ALERT",
    title: "AIN turnover spike",
    chris: "AIN turnover is 34% annualised — 8 points above sector. Teams with highest churn show PSH_13 + PSH_02 declining 4+ cycles before exits. This is a culture problem, not a recruitment problem.",
    urgency: "warning",
    actionLabel: "Identify at-risk teams →",
  },
  metrics: [
    { label: "Turnover", value: "28%", sub: "vs 26% sector", status: "warn", actionLabel: "View teams →", href: "/dashboard/workforce" },
    { label: "Agency", value: "14%", sub: "vs 15% target", status: "ok", href: "/dashboard/workforce" },
    { label: "Absenteeism", value: "7.2%", sub: "vs 6.8% baseline", status: "warn", actionLabel: "Identify patterns →", href: "/dashboard/workforce" },
    { label: "Training", value: "91%", sub: "3 expiring in 30d", status: "ok", href: "/dashboard/training" },
  ],
  queueTotal: 3,
  queue: [
    { urgency: "urgent", title: "6 AHPRA registrations expiring", chris: "If not renewed in 3 weeks, care minutes at risk.", actionLabel: "Send reminders →" },
    { urgency: "routine", title: "Leader Loop — 3 leaders not started", chris: "Automated reminder available.", actionLabel: "Chase →", meta: "8 of 14 active" },
  ],
  insights: [
    { type: "CAUSAL", confidence: "STRONG", domains: ["Workforce", "PSH", "Financial"], headline: "Turnover is a PSH outcome, not a recruitment problem", detail: "Teams with highest turnover show PSH_13 + PSH_02 elevated 4+ cycles before resignation. Recruitment pipeline is not the constraint." },
  ],
  subFeatures: [
    { label: "PSH Dashboard", summary: "16 domains · 2 elevated · 1 convergence", status: "terracotta", href: "/dashboard/risk" },
    { label: "Team Pulse", summary: "Cycle 8 · 14/17 responses · Closes Fri", status: "clear", href: "/dashboard/risk" },
    { label: "Training Compliance", summary: "91% · 6 expiring in 30 days", status: "amber", actionLabel: "Send reminders →", href: "/dashboard/training" },
    { label: "Leader Loop", summary: "8 of 14 active · 3 not started", status: "amber", href: "/dashboard/journey" },
    { label: "Turnover Analysis", summary: "34% AIN annualised · above sector", status: "terracotta", href: "/dashboard/workforce" },
    { label: "Workforce Forecast", summary: "Upcoming leave · roster risk 4 weeks", status: "clear", href: "/dashboard/workforce" },
  ],
  quickActions: [
    { label: "Send training reminder", icon: "📧" },
    { label: "Check credential expiry", icon: "🪪" },
    { label: "Alert DON to PSH signal", icon: "⚡" },
    { label: "View agency cost", icon: "💰" },
  ],
};

export default function WorkforceControlCentre() {
  return <DomainControlCentre config={config} />;
}
