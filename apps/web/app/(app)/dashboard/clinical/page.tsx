"use client";

import { DomainControlCentre, type DomainConfig } from "@/components/dashboard/DomainControlCentre";

const config: DomainConfig = {
  name: "Clinical",
  facility: "Harbison Bowral",
  dominant: {
    type: "SIRS · CAT 1",
    title: "SIRS deadline",
    chris: "Unexpected fall – Wing B – Tuesday 2:15pm. CHRIS has the draft ready. You need to add resident details and submit to ACQSC.",
    urgency: "critical",
    deadline: "6h 14m remaining",
    deadlinePct: 80,
    actionLabel: "Review draft →",
  },
  metrics: [
    { label: "Care Min", value: "186", sub: "vs 200 · RN: 37/40", status: "bad", actionLabel: "Fix gap →", href: "/dashboard/care-minutes" },
    { label: "QI Score", value: "84%", sub: "vs 85% benchmark", status: "warn", actionLabel: "Review QIs →", href: "/dashboard/quality" },
    { label: "SIRS", value: "1 Cat 1", sub: "6h remaining", status: "bad", actionLabel: "Review →", href: "/dashboard/sirs" },
    { label: "Audits", value: "1 overdue", sub: "Medication mgmt", status: "bad", actionLabel: "Start audit →", href: "/dashboard/audits" },
  ],
  queueTotal: 4,
  queue: [
    { urgency: "immediate", title: "SIRS Cat 1 · 6h 14m", chris: "Fall – Wing B. CHRIS draft ready. Add resident details.", actionLabel: "Review draft →" },
    { urgency: "urgent", title: "Medication audit · 3 days overdue", chris: "CHRIS can guide you through it now by voice.", actionLabel: "Start audit →" },
  ],
  insights: [
    { type: "CAUSAL", confidence: "STRONG", domains: ["Clinical", "Workforce"], headline: "Medication incidents linked to agency coverage rate", detail: "3 incidents in 14 days. All on shifts with >35% agency. Permanent staff shifts: zero incidents. This is an onboarding gap, not a process failure." },
    { type: "EXONERATING", confidence: "EMERGING", domains: ["Clinical", "Operational"], headline: "QI_01 decline — acuity cohort context", detail: "Unplanned weight loss elevated this quarter. 14 high-acuity admissions in the period with documented pre-existing nutritional compromise." },
  ],
  subFeatures: [
    { label: "Care Minutes", summary: "186 today · RN: 37 · 3rd at-risk day", status: "terracotta", actionLabel: "Fix gap →", href: "/dashboard/care-minutes" },
    { label: "Quality Indicators", summary: "14 QIs · 2 below benchmark", status: "amber", actionLabel: "Review →", href: "/dashboard/quality" },
    { label: "Clinical Audits", summary: "1 overdue · 2 due this week", status: "terracotta", actionLabel: "Start →", href: "/dashboard/audits" },
    { label: "SIRS Register", summary: "1 Cat 1 · 6h 14m remaining", status: "terracotta", href: "/dashboard/sirs" },
    { label: "Clinical Risk", summary: "Risk register · 3 open items", status: "amber", href: "/dashboard/quality" },
    { label: "Corrective Actions", summary: "Clinical source · 4 open · 1 overdue", status: "terracotta", actionLabel: "Review →", href: "/dashboard/compliance" },
  ],
  quickActions: [
    { label: "+ Report incident", icon: "📋" },
    { label: "Start audit", icon: "✅" },
    { label: "Check SIRS deadlines", icon: "⏱" },
    { label: "View care minutes week", icon: "📊" },
  ],
};

export default function ClinicalControlCentre() {
  return <DomainControlCentre config={config} />;
}
