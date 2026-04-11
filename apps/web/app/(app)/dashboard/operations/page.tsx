"use client";

import { DomainControlCentre, type DomainConfig } from "@/components/dashboard/DomainControlCentre";

const config: DomainConfig = {
  name: "Operations",
  facility: "Harbison Bowral",
  dominant: {
    type: "ROSTER GAP",
    title: "RN shift unfilled tonight",
    chris: "Tonight's evening RN shift is unfilled. Care minutes will breach if not resolved. CHRIS can generate the agency shift brief.",
    urgency: "warning",
    actionLabel: "Find agency cover →",
  },
  metrics: [
    { label: "Roster", value: "2 gaps", sub: "tonight + tomorrow", status: "warn", actionLabel: "View roster →", href: "/dashboard/care-minutes" },
    { label: "Handovers", value: "3 pending", sub: "CHRIS captures available", status: "ok", href: "/dashboard/care-minutes" },
    { label: "Incidents", value: "0 today", sub: "2 this week · no SIRS", status: "ok", href: "/dashboard/sirs" },
    { label: "Briefing", value: "Unread", sub: "3 signals · 8 min", status: "warn", actionLabel: "Read →", href: "/dashboard/briefing" },
  ],
  queueTotal: 4,
  queue: [
    { urgency: "urgent", title: "Monday Briefing · Unread", chris: "3 signals this week. Practice attached. 8 min read.", actionLabel: "Read briefing →" },
    { urgency: "routine", title: "Huddle agenda · Not confirmed", chris: "3 pre-written questions. Copy to clipboard or run with CHRIS.", actionLabel: "View agenda →" },
  ],
  insights: [
    { type: "CAUSAL", confidence: "STRONG", domains: ["Operational", "Clinical"], headline: "Roster gap + care minutes risk — same root cause", detail: "2 RN gaps this week. Care minutes at risk for 3rd day. The permanent RN roster has insufficient buffer for unplanned absence — structural, not isolated." },
  ],
  subFeatures: [
    { label: "Monday Briefing", summary: "Unread · 3 signals · 3 actions · 8 min", status: "amber", href: "/dashboard/briefing" },
    { label: "Review Queue", summary: "4 items · 1 immediate", status: "terracotta", href: "/don/queue" },
    { label: "Roster Today", summary: "2 gaps tonight · RN unfilled", status: "terracotta", actionLabel: "Fix gap →", href: "/dashboard/care-minutes" },
    { label: "Handover Notes", summary: "CHRIS Coach · voice capture · 3 pending", status: "clear", href: "/dashboard/coach" },
    { label: "Family Comms", summary: "1 follow-up flagged · Draft ready", status: "amber", href: "/dashboard/coach" },
    { label: "Incident Log", summary: "Today: 0 · This week: 2 · No SIRS", status: "clear", href: "/dashboard/sirs" },
  ],
  quickActions: [
    { label: "+ Report incident", icon: "📋" },
    { label: "+ Handover note", icon: "📝" },
    { label: "Find agency cover", icon: "👤" },
    { label: "Run CHRIS huddle 🎤", icon: "🎙" },
  ],
};

export default function OperationsControlCentre() {
  return <DomainControlCentre config={config} />;
}
