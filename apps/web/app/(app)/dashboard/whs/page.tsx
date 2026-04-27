"use client";
import { RoleHomeScreen, type RoleHomeConfig } from "@/components/dashboard/RoleHomeScreen";
import { WCFinancialPanel } from "@/components/financial/WCFinancialPanel";

const config: RoleHomeConfig = {
  greeting: "Good morning, Karen",
  subtitle: "Mt Gib Gardens · Workforce Safety & PSH",
  todaysPicture: "The overall PSH picture is improving this cycle — 2 teams elevated, down from 4 last cycle. However, Round Table Wing still has a critical convergence: PSH_01 and PSH_08 have both been above threshold for 3 cycles. CHRIS has flagged a WC risk — this pattern has a 68% correlation with claims within 4-6 weeks, estimated exposure $288K. A DON-level intervention is recommended. ISO 45003 evidence is current across all 4 categories — the evidence pack is exportable if needed.",
  domains: [
    { name: "Elevated Teams", status: "watch", summary: "2 teams · down from 4 · improving trend", href: "/dashboard/whs/hazard-map" },
    { name: "Convergence", status: "act", summary: "1 critical · Round Table Wing · 3 cycles", href: "/dashboard/whs/convergence" },
    { name: "ISO 45003", status: "clear", summary: "All 4 categories current ✅ · exportable", href: "/dashboard/whs/evidence" },
    { name: "WC Risk", status: "watch", summary: "Predictive signal active · est. $288K exposure", href: "/dashboard/psh" },
    { name: "Interventions", status: "clear", summary: "6 practices active · 3 outcomes measured this cycle", href: "/dashboard/whs/interventions" },
  ],
  topActions: [
    { priority: "act", label: "Round Table Wing critical convergence — DON escalation recommended", actionLabel: "Escalate →", href: "/dashboard/psh" },
    { priority: "watch", label: "WC exposure $288K — Level 3 control (task rotation) recommended", actionLabel: "Prescribe control →", href: "/dashboard/whs/interventions" },
    { priority: "clear", label: "2 teams moved from elevated to monitoring this cycle", actionLabel: "View improvement →", href: "/dashboard/whs/hazard-map" },
  ],
  intelligence: {
    type: "PREDICTIVE", confidence: "STRONG", domains: ["PSH", "Workforce", "Financial"],
    headline: "Workers comp exposure building — 6-week window",
    detail: "PSH_10 + PSH_08 co-elevated 3 cycles. Historically precedes WC claims within 4-6 weeks in 68% of comparable teams. Est. average claim: $288K. Task rotation is the recommended Level 3 control.",
  },
  briefing: { label: "WHS Committee Pack · April", sub: "CHRIS draft ready · PSH scores + convergence + WC signals", href: "/dashboard/reporting" },
  notificationCount: 1,
};

export default function WHSHome() {
  return (
    <RoleHomeScreen config={config}>
      <WCFinancialPanel />
    </RoleHomeScreen>
  );
}
