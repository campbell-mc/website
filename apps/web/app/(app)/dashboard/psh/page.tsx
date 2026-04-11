"use client";

import { DomainControlCentre, type DomainConfig } from "@/components/dashboard/DomainControlCentre";

const config: DomainConfig = {
  name: "PSH / Workforce Safety",
  facility: "Harbison Bowral",
  dominant: {
    type: "CRITICAL CONVERGENCE",
    title: "PSH_01 + PSH_08 — Cottage Team",
    chris: "High Job Demands and Traumatic Exposure both above critical threshold for 3rd consecutive cycle. Team practices are insufficient. DON-level structural intervention required. Historical WC claim correlation: 68% within 4-6 weeks.",
    urgency: "critical",
    actionLabel: "Escalate to DON →",
  },
  metrics: [
    { label: "Elevated", value: "3 teams", sub: "vs 2 prior cycle", status: "bad", actionLabel: "View heatmap →", href: "/dashboard/risk" },
    { label: "Convergence", value: "1 critical", sub: "2 moderate", status: "bad", actionLabel: "Review →", href: "/dashboard/risk" },
    { label: "ISO 45003", value: "Current", sub: "All 4 categories ✅", status: "ok", href: "/dashboard/risk" },
    { label: "WC Exposure", value: "$288K", sub: "Estimated risk", status: "warn", actionLabel: "View signal →", href: "/dashboard/risk" },
  ],
  queueTotal: 3,
  queue: [
    { urgency: "immediate", title: "Cottage Team convergence — DON escalation", chris: "3 cycles critical. Team practices insufficient. Needs facility-level response.", actionLabel: "Escalate →" },
    { urgency: "routine", title: "Advocacy brief draft", chris: "Level 2-3 intervention case for Team B. CHRIS has drafted the brief.", actionLabel: "Review brief →" },
  ],
  insights: [
    { type: "CAUSAL", confidence: "STRONG", domains: ["PSH", "Clinical", "Workforce"], headline: "PSH_08 suppressing incident reporting — compliance risk", detail: "Traumatic Exposure elevated 4 cycles in dementia wing. Incident reporting dropped 34% in same period — consistent with fear-of-reporting suppression. Under-reporting is a SIRS risk." },
    { type: "PREDICTIVE", confidence: "STRONG", domains: ["PSH", "Workforce", "Financial"], headline: "Workers comp exposure building — 6-week window", detail: "PSH_10 + PSH_08 co-elevated 3 cycles. Historically precedes WC claims within 4-6 weeks in 68% of comparable teams. Est. average claim: $288K." },
  ],
  subFeatures: [
    { label: "Hazard Heatmap", summary: "16 domains · all teams · 2 critical", status: "terracotta", href: "/dashboard/risk" },
    { label: "Convergence Events", summary: "1 critical · 2 moderate", status: "terracotta", href: "/dashboard/risk" },
    { label: "Intervention Library", summary: "Prescribe practice · history · outcomes", status: "clear", href: "/dashboard/risk" },
    { label: "ISO 45003 Evidence", summary: "4 categories · all current ✅", status: "clear", href: "/dashboard/risk" },
    { label: "WC Risk Monitor", summary: "Predictive signals · Est. $288K exposure", status: "amber", href: "/dashboard/risk" },
    { label: "Advocacy Briefs", summary: "Level 2-3 cases · 1 draft ready", status: "amber", href: "/dashboard/risk" },
  ],
  quickActions: [
    { label: "Prescribe practice", icon: "💊" },
    { label: "Escalate to DON", icon: "⚡" },
    { label: "Export evidence pack", icon: "📦" },
    { label: "Build advocacy brief", icon: "📄" },
  ],
};

export default function PSHControlCentre() {
  return <DomainControlCentre config={config} />;
}
