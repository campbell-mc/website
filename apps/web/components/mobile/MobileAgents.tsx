"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface AgentCard {
  name: string;
  tagline: string;
  schedule: string;
  status: "active" | "awaiting" | "idle";
  lastAction: string;
  nextRun: string;
  color: string;
  awaitingCount?: number;
  actionLabel?: string;
  actionRoute?: string;
}

const agents: AgentCard[] = [
  {
    name: "Sentinel",
    tagline: "Always watching. Nothing slips through.",
    schedule: "Always on · 2h cycle",
    status: "active",
    lastAction: "Care minutes compliant · RN confirmed tonight · 0 immediate findings",
    nextRun: "In 1h 47m",
    color: "#1B4332",
  },
  {
    name: "Oracle",
    tagline: "Finding the revenue that's already there.",
    schedule: "Weekly · Sunday 21:00",
    status: "awaiting",
    lastAction: "3 AN-ACC opportunities · $11.4K/month identified · CFO notified",
    nextRun: "Sunday 21:00 · 1 day",
    color: "#2D7D73",
    awaitingCount: 1,
    actionLabel: "View Oracle report",
    actionRoute: "/dashboard/financial/revenue",
  },
  {
    name: "Steward",
    tagline: "Catching structural problems before they're crises.",
    schedule: "Daily · 03:30 AEST",
    status: "active",
    lastAction: "2 structural findings · 1 episodic · Sunday PM RN gap confirmed",
    nextRun: "Tomorrow 03:30",
    color: "#6BAF92",
  },
  {
    name: "Chronicler",
    tagline: "Nothing goes undocumented.",
    schedule: "Event-driven",
    status: "awaiting",
    lastAction: "SIRS Cat 2 draft ready · awaiting DON review",
    nextRun: "On next event",
    color: "#D4A017",
    awaitingCount: 3,
    actionLabel: "3 documents awaiting review",
    actionRoute: "/don/queue",
  },
  {
    name: "Keeper",
    tagline: "Watching over the people who deliver the care.",
    schedule: "Fortnightly + daily",
    status: "awaiting",
    lastAction: "Turnover precursor detected — Wattle Wing · PSH_13 declining 4 cycles",
    nextRun: "Cycle close · 8 days",
    color: "#C4704A",
    awaitingCount: 1,
    actionLabel: "View workforce signals",
    actionRoute: "/dashboard/psh",
  },
  {
    name: "Town Crier",
    tagline: "Making sure they all talk to each other.",
    schedule: "Continuous",
    status: "active",
    lastAction: "Oracle + Steward merged — 1 coordinated recommendation delivered",
    nextRun: "Always running",
    color: "#7C5CBF",
  },
];

export default function MobileAgents() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAF9F7] pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <button
            data-has-handler="true"
            onClick={() => router.push("/dashboard")}
            className="p-2 -ml-2 active:bg-gray-100 rounded-xl"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-[28px] font-bold text-gray-900">Agents</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">6 agents · All systems running</p>
          </div>
        </div>
      </div>

      {/* Agent cards */}
      <div className="px-4 mt-4 flex flex-col gap-3">
        {agents.map((agent) => {
          const isAwaiting = agent.status === "awaiting";

          return (
            <div
              key={agent.name}
              className={`bg-white rounded-2xl border border-gray-100 p-5 ${
                isAwaiting ? "border-l-4 border-l-[#D4A017]" : ""
              }`}
            >
              {/* Name + status dot */}
              <div className="flex items-center gap-2.5 mb-1">
                {agent.status === "active" && (
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse"
                    style={{ backgroundColor: "#2D7D73" }}
                  />
                )}
                {isAwaiting && (
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: "#D4A017" }}
                  />
                )}
                {agent.status === "idle" && (
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-gray-300" />
                )}
                <span className="text-[16px] font-bold text-gray-900">{agent.name}</span>
              </div>

              {/* Tagline */}
              <p className="text-[13px] italic text-gray-400 mb-3 ml-5">{agent.tagline}</p>

              {/* Details */}
              <div className="ml-5 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] uppercase tracking-wider text-gray-400 font-semibold w-16">
                    Schedule
                  </span>
                  <span className="text-[13px] text-gray-600">{agent.schedule}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[12px] uppercase tracking-wider text-gray-400 font-semibold w-16 shrink-0 mt-0.5">
                    Last
                  </span>
                  <span className="text-[13px] text-gray-600 leading-snug">{agent.lastAction}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] uppercase tracking-wider text-gray-400 font-semibold w-16">
                    Next
                  </span>
                  <span className="text-[13px] text-gray-600">{agent.nextRun}</span>
                </div>
              </div>

              {/* Action button for awaiting agents */}
              {isAwaiting && agent.actionLabel && agent.actionRoute && (
                <button
                  data-has-handler="true"
                  onClick={() => router.push(agent.actionRoute!)}
                  className="mt-4 ml-5 w-[calc(100%-20px)] py-3.5 rounded-xl text-[14px] font-semibold border-2 border-[#2D7D73] text-[#2D7D73] flex items-center justify-center gap-2 active:opacity-80 transition-opacity min-h-[56px]"
                >
                  {agent.actionLabel}
                  {agent.awaitingCount && (
                    <span className="bg-[#D4A017] text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {agent.awaitingCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
