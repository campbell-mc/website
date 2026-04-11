"use client";
import { RoleHomeScreen, type RoleHomeConfig } from "@/components/dashboard/RoleHomeScreen";

const config: RoleHomeConfig = {
  greeting: "Good morning, Dr Chen",
  subtitle: "Harbison · Clinical Governance",
  todaysPicture: "Clinical performance is mixed across the portfolio this week. QI_04 (falls with injury) is elevated at Facility C — but CHRIS has cross-referenced this with a recent high-acuity admissions cohort, which likely explains the movement. Care minutes are compliant at both facilities. Facility B's RN hours are right on the threshold — worth monitoring. The monthly Clinical Leadership Pack is ready for your review — 30 minutes estimated.",
  domains: [
    { name: "Care Minutes", status: "clear", summary: "100% facilities compliant · RN threshold met", href: "/dashboard/clinical-director/care-minutes" },
    { name: "Quality Indicators", status: "watch", summary: "QI_03 + QI_04 trending up · 12 of 14 on track", href: "/dashboard/quality" },
    { name: "SIRS", status: "watch", summary: "0 Cat 1 · 1 Cat 2 open · 22 days remaining", href: "/dashboard/sirs" },
    { name: "Clinical Audits", status: "watch", summary: "1 overdue across portfolio · 3 due this week", href: "/dashboard/audits" },
    { name: "Clinical Risk", status: "clear", summary: "3 open items · no new escalations", href: "/dashboard/quality" },
  ],
  topActions: [
    { priority: "watch", label: "Review Clinical Leadership Pack — 6 sections, 30 min", actionLabel: "Start review →", href: "/dashboard/reporting" },
    { priority: "watch", label: "QI_04 elevated at Facility C — acuity context available", actionLabel: "View analysis →", href: "/dashboard/quality" },
    { priority: "clear", label: "Care minutes recovered portfolio-wide — 3rd consecutive compliant day", actionLabel: "Acknowledge →", href: "/dashboard/clinical-director/care-minutes" },
  ],
  intelligence: {
    type: "EXONERATING", confidence: "STRONG", domains: ["Clinical", "Operational"],
    headline: "QI_04 decline — acuity cohort, not care quality failure",
    detail: "Falls with injury elevated this quarter. 14 high-acuity admissions in the period with documented mobility limitations. The committee should note this context before drawing conclusions about clinical standards.",
  },
  notificationCount: 1,
};

export default function ClinicalDirectorHome() { return <RoleHomeScreen config={config} />; }
