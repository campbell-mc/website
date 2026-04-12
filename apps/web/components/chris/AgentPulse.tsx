"use client";

import { useRouter } from "next/navigation";
import { agent_activity, type AgentState, type AgentStatus } from "@/lib/seed-data";

/**
 * AgentPulse — compact horizontal strip showing which agents
 * are active in this domain. Sits between stat cards and
 * CHRIS intelligence block on every domain control centre.
 *
 * Makes the agents feel present and working even when the user
 * is not on the Agent Activity screen.
 */

// Domain-to-agent mapping
const DOMAIN_AGENTS: Record<string, string[]> = {
  clinical: ['Sentinel', 'Chronicler', 'Oracle'],
  operations: ['Sentinel', 'Steward', 'Town Crier'],
  financial: ['Oracle', 'Steward', 'Keeper'],
  workforce: ['Keeper', 'Sentinel', 'Town Crier'],
  governance: ['Sentinel', 'Chronicler'],
  residents: ['Sentinel', 'Chronicler', 'Oracle'],
  loops: ['Keeper', 'Sentinel'],
};

const STATUS_DOT: Record<AgentStatus, { bg: string; ring: string }> = {
  active: { bg: 'bg-[#2D7D73]', ring: '' },
  awaiting_action: { bg: 'bg-[#D4A017]', ring: '' },
  idle: { bg: 'bg-[#9CA3AF]', ring: '' },
};

interface AgentPulseProps {
  domain: keyof typeof DOMAIN_AGENTS;
}

export function AgentPulse({ domain }: AgentPulseProps) {
  const router = useRouter();
  const relevantNames = DOMAIN_AGENTS[domain] ?? [];
  const agents = agent_activity.filter((a) => relevantNames.includes(a.name));

  if (agents.length === 0) return null;

  return (
    <div className="rounded-xl px-4 py-3 mb-4 flex items-center gap-4 overflow-x-auto" style={{ background: '#F0F4F2' }}>
      {agents.map((agent) => (
        <AgentPill key={agent.name} agent={agent} onAction={agent.action_route ? () => router.push(agent.action_route!) : undefined} />
      ))}
      <button
        data-has-handler="true"
        onClick={() => router.push('/dashboard/agents')}
        className="text-[11px] text-[#2D7D73] font-medium whitespace-nowrap hover:underline shrink-0"
      >
        All agents →
      </button>
    </div>
  );
}

function AgentPill({ agent, onAction }: { agent: AgentState; onAction?: () => void }) {
  const dot = STATUS_DOT[agent.status];
  const isAwaiting = agent.status === 'awaiting_action';
  const lastAction = agent.last_action.length > 45 ? agent.last_action.substring(0, 42) + '...' : agent.last_action;

  return (
    <div className={`flex items-center gap-2 shrink-0 ${isAwaiting ? 'bg-[rgba(212,160,23,0.08)] rounded-lg px-2.5 py-1' : ''}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${dot.bg}`} />
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B4332] whitespace-nowrap">
        {agent.name}
      </span>
      <span className="text-[12px] text-[#6B7280] whitespace-nowrap">{lastAction}</span>
      {isAwaiting && agent.action_label && onAction && (
        <button
          data-has-handler="true"
          onClick={onAction}
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
