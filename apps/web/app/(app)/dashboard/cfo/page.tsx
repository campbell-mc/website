"use client";
import { RoleHomeScreen, type RoleHomeConfig } from "@/components/dashboard/RoleHomeScreen";

const config: RoleHomeConfig = {
  greeting: "Good morning, David",
  subtitle: "Knights of the Holy Grail · Financial Command",
  todaysPicture: "Care ratio is sitting at 53% — below the 55% target. The driver is agency cost, which is up 23% this month following two Wing B resignations. CHRIS has traced this to a 4-cycle decline in PSH_13 in that team — this is a culture cost, not a labour market event. The Q1 QFR has been submitted and confirmed. Board finance section is ready for your review — 25 minutes estimated.",
  domains: [
    { name: "Revenue", status: "watch", summary: "YTD -1.2% vs budget · $2.1M actual", href: "/dashboard/financial" },
    { name: "Care Ratio", status: "watch", summary: "53% · below 55% target · agency-driven", href: "/dashboard/financial" },
    { name: "Agency Cost", status: "act", summary: "$47K this month · +23% vs prior · trending up", href: "/dashboard/financial" },
    { name: "Budget", status: "clear", summary: "Overall -2.1% YTD · 2 cost centres at risk", href: "/dashboard/cfo/budget" },
    { name: "QFR", status: "clear", summary: "Q1 submitted ✅ · Q2 due Jul 28", href: "/dashboard/cfo/qfr" },
  ],
  topActions: [
    { priority: "watch", label: "Review Board finance section — 25 min · meeting in 8 days", actionLabel: "Start review →", href: "/dashboard/reporting" },
    { priority: "watch", label: "3 residents approaching AN-ACC reassessment — $8.2K/month at risk", actionLabel: "Alert DON →", href: "/dashboard/cfo/annacc" },
    { priority: "clear", label: "Q1 QFR submitted and confirmed by ACQSC", actionLabel: "View confirmation →", href: "/dashboard/cfo/qfr" },
  ],
  intelligence: {
    type: "CAUSAL", confidence: "STRONG", domains: ["Financial", "Workforce", "PSH"],
    headline: "Agency cost spike — workforce and culture root cause",
    detail: "Agency cost $47K above budget. Follows 2 resignations from Wing B where PSH_13 (Low Recognition) declined for 4 cycles. This is a culture-driven financial exposure. Addressing recognition patterns is the most cost-effective response.",
  },
  notificationCount: 1,
};

export default function CFOHome() { return <RoleHomeScreen config={config} />; }
