"use client";

import { useRouter } from "next/navigation";

interface NavItem {
  emoji: string;
  label: string;
  route: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: "Clinical",
    items: [
      { emoji: "🕐", label: "Care Minutes", route: "/dashboard/care-minutes" },
      {
        emoji: "📊",
        label: "Quality Indicators",
        route: "/dashboard/quality-indicators",
      },
      { emoji: "📋", label: "Audits", route: "/dashboard/audits" },
      { emoji: "🚨", label: "SIRS", route: "/dashboard/sirs" },
    ],
  },
  {
    title: "Operations",
    items: [
      { emoji: "📅", label: "Rostering", route: "/dashboard/operations/rostering" },
      { emoji: "🔄", label: "Handovers", route: "/dashboard/operations/handovers" },
      { emoji: "🚨", label: "Incidents", route: "/dashboard/operations/incidents" },
    ],
  },
  {
    title: "Residents",
    items: [
      {
        emoji: "👥",
        label: "Resident Overview",
        route: "/dashboard/residents",
      },
      {
        emoji: "📝",
        label: "Care Plans",
        route: "/dashboard/residents/care-plans",
      },
      {
        emoji: "💬",
        label: "Resident Voice",
        route: "/dashboard/residents/voice",
      },
      {
        emoji: "👨‍👩‍👧",
        label: "Family Communications",
        route: "/dashboard/residents/families",
      },
      {
        emoji: "🏥",
        label: "AN-ACC Portfolio",
        route: "/dashboard/residents/an-acc",
      },
    ],
  },
  {
    title: "Workforce",
    items: [
      {
        emoji: "🧠",
        label: "Psychosocial Hazards",
        route: "/dashboard/psh",
      },
      { emoji: "💚", label: "Team Pulse", route: "/dashboard/pulse" },
      { emoji: "🎓", label: "Training", route: "/dashboard/training" },
    ],
  },
  {
    title: "Financial",
    items: [
      {
        emoji: "💰",
        label: "Agency Cost Tracker",
        route: "/dashboard/financial/agency",
      },
    ],
  },
  {
    title: "Governance",
    items: [
      {
        emoji: "✅",
        label: "Compliance Register",
        route: "/dashboard/compliance",
      },
      { emoji: "📄", label: "Reporting Packs", route: "/dashboard/reporting" },
      {
        emoji: "🔧",
        label: "Corrective Actions",
        route: "/dashboard/corrective-actions",
      },
    ],
  },
  {
    title: "Weekly Loops",
    items: [
      { emoji: "🔄", label: "Team Loop — Briefing", route: "/team-loop/briefing" },
      { emoji: "💚", label: "Team Loop — Pulse", route: "/team-loop/pulse" },
      { emoji: "🎯", label: "Leader Loop", route: "/leader-loop/arrive" },
    ],
  },
  {
    title: "Demo",
    items: [
      { emoji: "🤖", label: "Agents", route: "/dashboard/agents" },
      {
        emoji: "💬",
        label: "iMessage Preview",
        route: "/dashboard/imessage",
      },
    ],
  },
];

export default function MobileMore() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAF9F7] pb-20">
      {/* Header */}
      <div className="px-4 pt-12 pb-2">
        <h1 className="text-[22px] font-bold text-[#1B4332]">More</h1>
      </div>

      {/* Navigation sections */}
      <div className="mt-2">
        {sections.map((section) => (
          <div key={section.title}>
            {/* Section header */}
            <div className="px-4 py-2.5 bg-gray-50">
              <h2 className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
                {section.title}
              </h2>
            </div>

            {/* Items */}
            <div className="bg-white divide-y divide-gray-50">
              {section.items.map((item) => (
                <button
                  key={item.route}
                  data-has-handler="true"
                  onClick={() => router.push(item.route)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 min-h-[44px] active:bg-gray-50 transition-colors"
                >
                  <span className="text-[18px] w-7 text-center flex-shrink-0">
                    {item.emoji}
                  </span>
                  <span className="text-[15px] text-[#1B4332] flex-1 text-left">
                    {item.label}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-300 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
