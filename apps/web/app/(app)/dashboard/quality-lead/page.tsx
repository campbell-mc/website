"use client";
import { RoleHomeScreen, type RoleHomeConfig } from "@/components/dashboard/RoleHomeScreen";

const config: RoleHomeConfig = {
  greeting: "Good morning, Lisa",
  subtitle: "Knights of the Holy Grail · Quality & Compliance",
  todaysPicture: "Compliance score is 84 — up 3 points from last month. Two obligations are at risk: QS 2.8.2 has an evidence gap that CHRIS can fix from pulse data in about 2 minutes, and one corrective action from the March medication audit is 3 days overdue. The SIRS Cat 2 draft from last Tuesday is ready for your review — 22 days remaining. One note: the QI_01 movement this quarter reflects the high-acuity admissions cohort, not a care quality issue — worth including that context in the Q&R pack.",
  domains: [
    { name: "Compliance Score", status: "watch", summary: "84 · up 3 pts · 2 obligations at risk", href: "/dashboard/compliance" },
    { name: "SIRS", status: "watch", summary: "0 Cat 1 · 1 Cat 2 open · draft ready · 22 days", href: "/dashboard/sirs" },
    { name: "Audits", status: "watch", summary: "1 overdue · 2 due this week", href: "/dashboard/audits" },
    { name: "Corrective Actions", status: "watch", summary: "12 open · 1 overdue", href: "/dashboard/compliance" },
    { name: "ISO 45003", status: "clear", summary: "All 4 evidence categories current ✅", href: "/dashboard/risk" },
  ],
  topActions: [
    { priority: "watch", label: "Fix QS 2.8.2 evidence gap — 2 min from pulse data", actionLabel: "Fix now →", href: "/dashboard/compliance" },
    { priority: "watch", label: "Review SIRS Cat 2 draft — 22 days remaining", actionLabel: "Review draft →", href: "/dashboard/sirs" },
    { priority: "watch", label: "Chase overdue corrective action — medication audit March", actionLabel: "Review →", href: "/dashboard/compliance" },
  ],
  intelligence: {
    type: "EXONERATING", confidence: "STRONG", domains: ["Clinical", "Operational"],
    headline: "QI_01 decline — acuity intake, not care failure",
    detail: "Unplanned weight loss elevated this quarter. 14 high-acuity admissions with pre-existing nutritional compromise. Worth including this context in the Q&R pack.",
  },
  briefing: { label: "Q&R Committee Pack · Q1", sub: "CHRIS draft ready · 6 sections · 45 min review", href: "/dashboard/reporting" },
  queueCount: 2, queueHref: "/don/queue", notificationCount: 1,
};

export default function QualityLeadHome() { return <RoleHomeScreen config={config} />; }
