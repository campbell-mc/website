"use client";
import { RoleHomeScreen, type RoleHomeConfig } from "@/components/dashboard/RoleHomeScreen";

const config: RoleHomeConfig = {
  greeting: "Good morning, James",
  subtitle: "Harbison · 2 facilities · Portfolio Command",
  todaysPicture: "Two facilities need your attention today. Facility C has been running a three-domain loop — falls, agency instability, and traumatic exposure — for three cycles now. Harbison Bowral recovered care minutes compliance yesterday after the agency RN was confirmed. The Board Pack is ready for your review — meeting is in 8 days and estimated review is 35 minutes. Overall portfolio health is stable with improving trend.",
  domains: [
    { name: "Clinical", status: "watch", summary: "96% facilities compliant · QI_03 trending at Facility C", href: "/dashboard/clinical" },
    { name: "Workforce", status: "watch", summary: "Agency 14% avg · turnover spike at Bowral AINs", href: "/dashboard/workforce" },
    { name: "Governance", status: "watch", summary: "Board Pack awaiting approval · compliance 84 avg", href: "/dashboard/compliance" },
    { name: "Financial", status: "clear", summary: "Revenue -1.2% vs budget · care ratio 56% on target", href: "/dashboard/financial" },
    { name: "PSH", status: "watch", summary: "1 critical convergence · 4 teams elevated across portfolio", href: "/dashboard/psh" },
  ],
  topActions: [
    { priority: "watch", label: "Review Q1 Board Pack — 8 sections, 35 min · meeting in 8 days", actionLabel: "Start review →", href: "/dashboard/reporting" },
    { priority: "watch", label: "Facility C three-domain loop — COO + DON + HR response needed", actionLabel: "Add to ELT agenda →", href: "/dashboard/portfolio" },
    { priority: "clear", label: "Bowral care minutes recovered — agency RN confirmed", actionLabel: "Acknowledge →", href: "/dashboard/portfolio" },
  ],
  intelligence: {
    type: "AMPLIFYING", confidence: "STRONG", domains: ["Clinical", "Workforce", "PSH"],
    headline: "Provider-wide culture signal detected",
    detail: "Facility A and Facility C are showing the same PSH_02 + turnover pattern 6 weeks apart. This may be a provider-wide culture signal, not facility-specific. Recommend ELT-level discussion.",
  },
  briefing: { label: "ELT Pack · April", sub: "Updated overnight · cross-domain intelligence · 5 signals", href: "/dashboard/reporting" },
  queueCount: 3, queueHref: "/dashboard/ceo/approvals",
  notificationCount: 2,
};

export default function CEOHome() { return <RoleHomeScreen config={config} />; }
