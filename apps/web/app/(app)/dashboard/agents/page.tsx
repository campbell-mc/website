"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Activity } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { agent_activity, agent_activity_log, coordination_log, type AgentState, type AgentStatus } from "@/lib/seed-data";

// ============================================================================
// AGENT ACTIVITY — visible to ALL roles
// Every person using CHRIS sees that six agents are running on their behalf.
// ============================================================================

const STATUS_DOT: Record<AgentStatus, { color: string; label: string }> = {
  active: { color: 'bg-[#2D7D73]', label: 'Active' },
  awaiting_action: { color: 'bg-[#D4A017]', label: 'Awaiting action' },
  idle: { color: 'bg-[#9CA3AF]', label: 'Idle' },
};

const LOG_STATUS_ICON: Record<string, string> = {
  success: '✅',
  delivered: '📨',
  awaiting: '⏳',
  failed: '🔴',
};

const COORD_BORDER: Record<string, string> = {
  coordination: 'border-l-[#2D7D73]',
  safety: 'border-l-[#C4704A]',
  conflict: 'border-l-[#D4A017]',
};

function AgentCard({ agent }: { agent: AgentState }) {
  const router = useRouter();
  const dot = STATUS_DOT[agent.status];
  const isAwaiting = agent.status === 'awaiting_action';
  const isIdle = agent.status === 'idle';

  return (
    <div className={`bg-white rounded-2xl border border-[#E5E7EB] p-5 ${isAwaiting ? 'border-l-4 border-l-[#D4A017] bg-[#FFFBF0]' : ''} ${isIdle ? 'opacity-60' : ''}`}>
      {/* Row 1: Name + tagline + status */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold text-[#1B4332]">The {agent.name}</p>
          <p className="text-[13px] italic text-[#6B7280] hidden lg:inline">{agent.tagline}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-3 h-3 rounded-full ${dot.color}`} />
          <span className="text-[11px] text-[#9CA3AF]">{dot.label}</span>
        </div>
      </div>

      {/* Row 2: Schedule */}
      <p className="text-[12px] text-[#9CA3AF] uppercase tracking-wider mb-2">{agent.schedule}</p>

      {/* Row 3: Last action + time */}
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-[#374151] flex-1">{agent.last_action}</p>
        <span className="text-[12px] text-[#9CA3AF] shrink-0 ml-3">
          {new Date(agent.last_action_at).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Row 4: Next run */}
      <p className="text-[13px] text-[#6B7280] mb-3">Next: {agent.next_run_label}</p>

      {/* Row 5: Action button if awaiting */}
      {isAwaiting && agent.action_label && agent.action_route && (
        <button
          data-has-handler="true"
          onClick={() => router.push(agent.action_route!)}
          className="w-full py-3 rounded-xl text-sm font-semibold border-[1.5px] border-[#2D7D73] text-[#2D7D73] hover:bg-[#F0F7F4] transition-colors flex items-center justify-center gap-2"
        >
          {agent.action_label}
          {agent.documents_awaiting && agent.documents_awaiting > 0 && (
            <span className="bg-[#D4A017] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {agent.documents_awaiting}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

export default function AgentActivityPage() {
  const router = useRouter();
  const [logFilter, setLogFilter] = useState<string>('All');
  const [showAllCoordination, setShowAllCoordination] = useState(false);

  const totalAwaiting = agent_activity.reduce((s, a) => s + (a.documents_awaiting ?? 0), 0);
  const filteredLog = logFilter === 'All'
    ? agent_activity_log
    : agent_activity_log.filter((e) => e.agent === logFilter);
  const visibleCoordination = showAllCoordination ? coordination_log : coordination_log.slice(0, 3);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button data-has-handler="true" onClick={() => router.push('/dashboard')} className="p-1 -ml-1 hover:bg-[#F3F4F6] rounded-lg">
            <ChevronLeft className="w-5 h-5 text-[#1A1A1A]" />
          </button>
          <div>
            <p className="text-[30px] font-bold text-[#1A1A1A] tracking-tight leading-tight">Agent Activity</p>
            <p className="text-[13px] text-[#6B7280]">6 agents · {totalAwaiting} items awaiting your review · All systems running</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#2D7D73]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#2D7D73] animate-pulse" />
        </div>
      </div>

      {/* Agent cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-8">
        {agent_activity.map((agent) => (
          <AgentCard key={agent.name} agent={agent} />
        ))}
      </div>

      {/* How agents work together */}
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7280] mb-3">How the agents are working together</p>
      <div className="space-y-3 mb-8">
        {visibleCoordination.map((entry, i) => (
          <div key={i} className={`bg-white rounded-xl p-4 border border-[#E5E7EB] border-l-4 ${COORD_BORDER[entry.type]}`}>
            <div className="flex items-start gap-2.5">
              <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[#374151] leading-relaxed">{entry.narrative}</p>
                <p className="text-[12px] text-[#9CA3AF] mt-1.5">{entry.date} · {entry.shift}</p>
              </div>
            </div>
          </div>
        ))}
        {!showAllCoordination && coordination_log.length > 3 && (
          <button onClick={() => setShowAllCoordination(true)} className="text-[13px] text-[#2D7D73] font-medium hover:underline">
            View full coordination history →
          </button>
        )}
      </div>

      {/* Activity log */}
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7280] mb-2">What the agents have been doing</p>

      {/* Filter bar */}
      <div className="flex items-center gap-1.5 mb-3 overflow-x-auto">
        {['All', 'Sentinel', 'Oracle', 'Steward', 'Chronicler', 'Keeper', 'Town Crier'].map((name) => (
          <button
            key={name}
            onClick={() => setLogFilter(name)}
            className={`text-[11px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
              logFilter === name
                ? 'bg-[#1B4332] text-white'
                : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Log entries */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden mb-16">
        {filteredLog.map((entry, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-[#F3F4F6] last:border-b-0">
            <span className="text-[12px] font-mono text-[#9CA3AF] w-12 shrink-0">{entry.time}</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1B4332] w-20 shrink-0">{entry.agent}</span>
            <span className="text-sm text-[#374151] flex-1">{entry.action}</span>
            <span className="text-sm shrink-0">{LOG_STATUS_ICON[entry.status] ?? '●'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
