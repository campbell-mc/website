"use client";

import { useRouter } from "next/navigation";
import { agent_activity, type AgentState, type AgentStatus } from "@/lib/seed-data";

/**
 * AgentPulse — animated scrolling ribbon showing which agents
 * are active in this domain. Continuously scrolls like a news
 * ticker — makes CHRIS feel alive and always working.
 */

const DOMAIN_AGENTS: Record<string, string[]> = {
  clinical: ['Sentinel', 'Chronicler', 'Oracle'],
  operations: ['Sentinel', 'Steward', 'Town Crier'],
  financial: ['Oracle', 'Steward', 'Keeper'],
  workforce: ['Keeper', 'Sentinel', 'Town Crier'],
  governance: ['Sentinel', 'Chronicler'],
  residents: ['Sentinel', 'Chronicler', 'Oracle'],
  loops: ['Keeper', 'Sentinel'],
  all: ['Sentinel', 'Oracle', 'Steward', 'Chronicler', 'Keeper', 'Town Crier'],
};

const STATUS_DOT: Record<AgentStatus, string> = {
  active: 'bg-[#2D7D73]',
  awaiting_action: 'bg-[#D4A017]',
  idle: 'bg-[#9CA3AF]',
};

interface AgentPulseProps {
  domain: keyof typeof DOMAIN_AGENTS;
}

export function AgentPulse({ domain }: AgentPulseProps) {
  const router = useRouter();
  const relevantNames = DOMAIN_AGENTS[domain] ?? [];
  const agents = agent_activity.filter((a) => relevantNames.includes(a.name));

  if (agents.length === 0) return null;

  // Double the items for seamless loop
  const pills = [...agents, ...agents];

  return (
    <div className="rounded-xl mb-4 overflow-hidden relative" style={{ background: '#F0F4F2' }}>
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 z-10" style={{ background: 'linear-gradient(to right, #F0F4F2, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-8 z-10" style={{ background: 'linear-gradient(to left, #F0F4F2, transparent)' }} />

      {/* Scrolling track */}
      <div className="flex items-center py-3 animate-agent-scroll">
        {pills.map((agent, i) => (
          <AgentPill key={`${agent.name}-${i}`} agent={agent} onAction={agent.action_route ? () => router.push(agent.action_route!) : undefined} />
        ))}
        <button
          data-has-handler="true"
          onClick={() => router.push('/dashboard/agents')}
          className="text-[11px] text-[#2D7D73] font-medium whitespace-nowrap hover:underline shrink-0 px-4"
        >
          All agents →
        </button>
        {/* Duplicate the link for seamless loop */}
        {pills.map((agent, i) => (
          <AgentPill key={`dup-${agent.name}-${i}`} agent={agent} onAction={agent.action_route ? () => router.push(agent.action_route!) : undefined} />
        ))}
        <button
          data-has-handler="true"
          onClick={() => router.push('/dashboard/agents')}
          className="text-[11px] text-[#2D7D73] font-medium whitespace-nowrap hover:underline shrink-0 px-4"
        >
          All agents →
        </button>
      </div>
    </div>
  );
}

function AgentPill({ agent, onAction }: { agent: AgentState; onAction?: () => void }) {
  const isAwaiting = agent.status === 'awaiting_action';
  const isActive = agent.status === 'active';
  const lastAction = agent.last_action.length > 50 ? agent.last_action.substring(0, 47) + '...' : agent.last_action;

  return (
    <div className={`flex items-center gap-2 shrink-0 mx-3 ${isAwaiting ? 'bg-[rgba(212,160,23,0.1)] rounded-full px-3 py-1' : ''}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[agent.status]} ${isActive ? 'animate-pulse' : ''}`} />
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B4332] whitespace-nowrap">
        {agent.name}
      </span>
      <span className="text-[11px] text-[#6B7280] whitespace-nowrap">{lastAction}</span>
      {isAwaiting && agent.action_label && onAction && (
        <button
          data-has-handler="true"
          onClick={(e) => { e.stopPropagation(); onAction(); }}
          className="text-[11px] font-medium text-[#2D7D73] whitespace-nowrap hover:underline"
        >
          {agent.documents_awaiting && agent.documents_awaiting > 1
            ? `${agent.documents_awaiting} awaiting →`
            : 'Review →'}
        </button>
      )}
    </div>
  );
}
