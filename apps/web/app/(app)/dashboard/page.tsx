"use client";

import { useState } from "react";
import { HomeDashboard, type CycleState } from "@/components/dashboard/HomeDashboard";

// Demo: cycle through states to show all dashboard variants
const CYCLE_STATES: CycleState[] = [
  "pulse_in_progress",
  "briefing_ready",
  "actions_in_progress",
  "end_of_cycle",
  "steady",
];

export default function DashboardPage() {
  const [stateIndex, setStateIndex] = useState(0);
  const cycleState = CYCLE_STATES[stateIndex];

  return (
    <>
      {/* Dev toggle — remove in production */}
      <div className="max-w-lg mx-auto px-4 pt-3">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {CYCLE_STATES.map((state, i) => (
            <button
              key={state}
              onClick={() => setStateIndex(i)}
              className={`flex-1 text-[9px] font-medium py-1.5 rounded-md transition-colors ${
                i === stateIndex
                  ? "bg-white text-[#1B4332] shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {state.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      <HomeDashboard
        cycleState={cycleState}
        loopNumber={3}
        currentWeek={cycleState === "end_of_cycle" ? 2 : 1}
        userName="Mary"
        teamName="Wattle Wing"
        responseRate={0.34}
        onViewBriefing={() => alert("Team Briefing — coming soon")}
        onViewTeamLoop={() => alert("Team Loop — coming soon")}
        onViewLeaderLoop={() => alert("Leader Loop — coming soon")}
        onViewCoach={() => alert("CHRIS Coach — coming soon")}
        onStartReflection={() => alert("Reflection — coming soon")}
      />
    </>
  );
}
