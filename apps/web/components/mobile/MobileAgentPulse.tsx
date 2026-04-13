"use client";

import { useState } from "react";

const AGENT_COLORS: Record<string, string> = {
  sentinel: "#1B4332",
  oracle: "#2D7D73",
  steward: "#6BAF92",
  chronicler: "#D4A017",
  keeper: "#C4704A",
  town_crier: "#7C5CBF",
};

const LAST_ACTIONS: Record<string, string> = {
  sentinel: "Care minutes compliant · RN confirmed tonight · 0 immediate findings",
  oracle: "3 AN-ACC opportunities · $11.4K/month identified · CFO notified",
  steward: "2 structural findings · 1 episodic · Sunday PM RN gap confirmed",
  chronicler: "SIRS Cat 2 draft ready · awaiting DON review",
  keeper: "Turnover precursor detected — Wattle Wing · PSH_13 declining 4 cycles",
  town_crier: "Oracle + Steward merged — 1 coordinated recommendation delivered",
};

function getAgentKey(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "_");
}

export function MobileAgentPulse({ agents, domain }: { agents: string[]; domain: string }) {
  const [expanded, setExpanded] = useState(false);
  const primary = agents[0];
  const remaining = agents.slice(1);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <p className="text-[12px] uppercase tracking-wider text-gray-400 font-semibold mb-3">
        Agents · {domain}
      </p>

      {/* Primary agent */}
      <div className="flex items-center gap-2.5">
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: AGENT_COLORS[getAgentKey(primary)] || "#1B4332" }}
        />
        <span className="text-[15px] font-semibold text-gray-900">{primary}</span>
        <span className="text-[13px] text-gray-400 truncate flex-1">
          {LAST_ACTIONS[getAgentKey(primary)]?.substring(0, 40) ?? "Running"}...
        </span>
      </div>

      {/* Expand toggle */}
      {remaining.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-[13px] font-medium text-[#2D7D73] active:opacity-70"
          >
            {expanded ? "Collapse" : `All ${agents.length} ↓`}
          </button>

          {expanded && (
            <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-gray-50">
              {remaining.map((agent) => {
                const key = getAgentKey(agent);
                return (
                  <div key={agent} className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: AGENT_COLORS[key] || "#1B4332" }}
                    />
                    <span className="text-[14px] font-medium text-gray-800">{agent}</span>
                    <span className="text-[12px] text-gray-400 truncate flex-1">
                      {LAST_ACTIONS[key]?.substring(0, 35) ?? "Idle"}...
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
