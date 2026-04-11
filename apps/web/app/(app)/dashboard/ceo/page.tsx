"use client";
import { RoleHomeScreen, type RoleHomeConfig } from "@/components/dashboard/RoleHomeScreen";

const config: RoleHomeConfig = {
  greeting: "Good morning, James",
  subtitle: "Knights of the Holy Grail · 4 residential + 2 home care · Portfolio Command",
  todaysPicture: "The network is in reasonable shape this week. Young needs attention — RN care minutes have been at risk for two days and the gap isn't filled for tonight. Temora has a SIRS Cat 2 draft ready for the DON to review — 18 days remaining, no urgency yet. Bowral is the good news story: Wattle Wing PSH improved for the second consecutive cycle and care minutes have been compliant all week. Goulburn and both home care services are running clean. The Board Pack for Q2 covers all four residential facilities and is ready for your review — meeting is in 8 days.",
  domains: [
    { name: "Clinical", status: "watch", summary: "5/6 services compliant · Young RN gap · Temora SIRS Cat 2", href: "/dashboard/clinical" },
    { name: "Workforce", status: "watch", summary: "Agency 12% avg · turnover spike at Bowral AINs", href: "/dashboard/workforce" },
    { name: "Governance", status: "watch", summary: "Board Pack awaiting approval · compliance 87 avg", href: "/dashboard/compliance" },
    { name: "Financial", status: "clear", summary: "Revenue -0.8% vs budget · care ratio 56% on target", href: "/dashboard/financial" },
    { name: "PSH", status: "watch", summary: "1 critical convergence (Bowral) · 5 teams elevated across network", href: "/dashboard/psh" },
  ],
  topActions: [
    { priority: "watch", label: "Review Q2 Board Pack — 8 sections, 35 min · all 4 facilities · meeting in 8 days", actionLabel: "Start review →", href: "/dashboard/reporting" },
    { priority: "watch", label: "Young care minutes at risk — RN gap not filled for tonight", actionLabel: "Alert DON →", href: "/dashboard/portfolio" },
    { priority: "clear", label: "Bowral Wattle Wing PSH improved — second consecutive cycle", actionLabel: "Acknowledge →", href: "/dashboard/portfolio" },
  ],
  intelligence: {
    type: "AMPLIFYING", confidence: "STRONG", domains: ["Clinical", "Workforce", "PSH"],
    headline: "Young: care minutes + agency + PSH_01 loop forming",
    detail: "Young has had RN care minutes at risk for 2 days. Agency dependency at Young is 22% — highest in the network. PSH_01 (High Job Demands) elevated for 2 teams. This pattern precedes sustained care minutes non-compliance in comparable facilities. DON intervention recommended before the loop establishes.",
  },
  briefing: { label: "ELT Pack · April", sub: "Updated overnight · cross-domain intelligence · all 6 services", href: "/dashboard/reporting" },
  queueCount: 3, queueHref: "/dashboard/reporting",
  notificationCount: 3,
};

export default function CEOHome() { return <RoleHomeScreen config={config} />; }
