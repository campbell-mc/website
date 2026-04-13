"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

const SECTIONS = [
  { heading: "Clinical", items: [
    { label: "Care Minutes", route: "/dashboard/care-minutes", icon: "⏱" },
    { label: "Quality Indicators", route: "/dashboard/quality", icon: "📊" },
    { label: "Clinical Audits", route: "/dashboard/audits", icon: "✓" },
    { label: "SIRS Register", route: "/dashboard/sirs", icon: "⚠" },
  ]},
  { heading: "Operations", items: [
    { label: "Rostering", route: "/dashboard/workforce/roster", icon: "📅" },
    { label: "Handovers", route: "/dashboard/operations/handovers", icon: "🔄" },
    { label: "Incidents", route: "/dashboard/operations/incidents", icon: "🚨" },
  ]},
  { heading: "Residents", items: [
    { label: "Resident Intelligence", route: "/dashboard/residents", icon: "🏠" },
    { label: "Care Plans", route: "/dashboard/residents/care-plans", icon: "📋" },
    { label: "Resident Voice", route: "/dashboard/residents/voice", icon: "💬" },
    { label: "Families", route: "/dashboard/residents/families", icon: "👥" },
    { label: "Feedback", route: "/dashboard/residents/feedback", icon: "📝" },
  ]},
  { heading: "Workforce", items: [
    { label: "PSH Dashboard", route: "/dashboard/psh", icon: "🧠" },
    { label: "Team Pulse", route: "/team-loop/pulse", icon: "💓" },
    { label: "Training", route: "/dashboard/training", icon: "🎓" },
  ]},
  { heading: "Financial", items: [
    { label: "Agency Cost", route: "/dashboard/financial/agency", icon: "💰" },
  ]},
  { heading: "Governance", items: [
    { label: "Compliance Register", route: "/dashboard/compliance", icon: "📌" },
    { label: "Reporting Cycles", route: "/dashboard/reporting", icon: "🗓" },
    { label: "Corrective Actions", route: "/dashboard/corrective-actions", icon: "🔧" },
  ]},
  { heading: "Weekly Loops", items: [
    { label: "Team Loop", route: "/team-loop/briefing", icon: "🔁" },
    { label: "Leader Loop", route: "/leader-loop/arrive", icon: "⭐" },
  ]},
  { heading: "Demo", items: [
    { label: "Agent Activity", route: "/dashboard/agents", icon: "🤖" },
    { label: "iMessage Demo", route: "/dashboard/demo/imessage", icon: "💬" },
  ]},
];

export default function MorePage() {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto pb-24">
      <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight mb-4">More</p>

      {SECTIONS.map((section) => (
        <div key={section.heading} className="mb-2">
          <p className="px-1 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">
            {section.heading}
          </p>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {section.items.map((item, i) => (
              <button
                key={item.route}
                data-has-handler="true"
                onClick={() => router.push(item.route)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/50 transition-colors ${
                  i < section.items.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <span className="text-base w-7 text-center">{item.icon}</span>
                <span className="text-sm font-medium text-foreground flex-1">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
