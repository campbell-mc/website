// lib/agents/town-crier.ts
// Maintained by Ivan Sanchez
// The Town Crier — coordination and conflict resolution layer for CHRIS
//
// Two jobs:
// 1. Merge related findings from multiple agents into one recommendation
// 2. Resolve conflicts when agents compete for the same resource
//
// Invisible to facility users — they only experience its output.
// Called via publishEvent() when any agent produces a finding,
// and runTownCrier() after each agent cycle.

import { callClaudeText } from '@/lib/anthropic/client';
import {
  TOWN_CRIER_SYSTEM_PROMPT,
  TOWN_CRIER_PROMPTS,
  type AgentFinding,
} from '@/lib/agents/prompts/town-crier';

// ── TYPES ─────────────────────────────────────────────────────

export type AgentName = 'sentinel' | 'oracle' | 'steward' | 'chronicler' | 'keeper';

export type EventType =
  // Sentinel
  | 'sentinel.care_minutes_at_risk' | 'sentinel.rn_gap_tonight'
  | 'sentinel.sirs_deadline_approaching' | 'sentinel.corrective_action_overdue'
  | 'sentinel.psh_convergence' | 'sentinel.psh_wc_risk'
  | 'sentinel.compliance_deadline' | 'sentinel.audit_overdue'
  // Oracle
  | 'oracle.annacc_opportunity' | 'oracle.accommodation_opportunity'
  | 'oracle.occupancy_revenue_at_risk' | 'oracle.helf_opportunity'
  // Steward
  | 'steward.structural_roster_gap' | 'steward.care_minutes_buffer_critical'
  | 'steward.scheduling_window_available' | 'steward.credential_expiry_risk'
  | 'steward.overtime_concentration'
  // Keeper
  | 'keeper.turnover_precursor' | 'keeper.high_flight_risk'
  | 'keeper.absenteeism_concentration' | 'keeper.composition_drift'
  | 'keeper.systematic_overtime' | 'keeper.leader_support_needed';

export type Priority = 'safety' | 'compliance' | 'care_quality' | 'financial' | 'operational';

export interface AgentEvent {
  id: string;
  source_agent: AgentName;
  event_type: EventType;
  facility_id: string;
  priority: Priority;
  payload: Record<string, unknown>;
  published_at: Date;
  processed: boolean;
}

export interface ConflictResolution {
  conflict_type: string;
  winner: AgentName | 'human';
  loser?: AgentName;
  strategy: 'automatic_safety' | 'automatic_compliance' | 'automatic_quality' | 'human_decision';
  human_decision_required: boolean;
  recommendation?: string;
  reasoning: string;
  lower_priority_action: 'reschedule' | 'defer' | 'human_decides';
  safety_preserved: boolean;
}

export interface MergedRecommendation {
  contributing_agents: AgentName[];
  event_ids: string[];
  narrative: string;
  severity: string;
  target_roles: string[];
  route: string;
}

// ── AGENT SUBSCRIPTIONS ───────────────────────────────────────

export const AGENT_SUBSCRIPTIONS: Record<AgentName, EventType[]> = {
  sentinel: [
    'oracle.annacc_opportunity', 'oracle.occupancy_revenue_at_risk',
    'steward.care_minutes_buffer_critical', 'steward.credential_expiry_risk',
    'keeper.turnover_precursor',
  ],
  steward: [
    'oracle.annacc_opportunity', 'oracle.helf_opportunity',
    'sentinel.psh_convergence', 'sentinel.sirs_deadline_approaching',
    'keeper.turnover_precursor', 'keeper.systematic_overtime',
  ],
  chronicler: [
    'sentinel.sirs_deadline_approaching', 'sentinel.audit_overdue',
    'sentinel.psh_wc_risk', 'oracle.annacc_opportunity',
    'steward.structural_roster_gap',
  ],
  oracle: [
    'sentinel.care_minutes_at_risk', 'sentinel.psh_wc_risk',
    'keeper.turnover_precursor', 'keeper.composition_drift',
  ],
  keeper: [
    'sentinel.psh_convergence', 'sentinel.psh_wc_risk',
    'oracle.annacc_opportunity', 'steward.overtime_concentration',
    'steward.structural_roster_gap',
  ],
};

// ── IN-MEMORY EVENT BUS ───────────────────────────────────────
// In production this is backed by the agent_events table.
// For now: in-memory store that the Town Crier reads.

const eventStore: AgentEvent[] = [];

// ── MAIN ENTRY POINTS ─────────────────────────────────────────

/**
 * Called after each agent run cycle.
 * Looks for related events to merge and conflicts to resolve.
 */
export async function runTownCrier(facilityId: string): Promise<{
  coordinationsMerged: number;
  conflictsResolved: number;
}> {
  const startTime = Date.now();

  const recentEvents = eventStore.filter(
    (e) => e.facility_id === facilityId && !e.processed &&
    e.published_at.getTime() > Date.now() - 2 * 60 * 60 * 1000
  );

  if (recentEvents.length === 0) return { coordinationsMerged: 0, conflictsResolved: 0 };

  const clusters = clusterRelatedEvents(recentEvents);
  let coordinationsMerged = 0;
  let conflictsResolved = 0;

  for (const cluster of clusters) {
    if (cluster.length === 1) continue;

    const conflicts = detectConflicts(cluster);

    if (conflicts.length > 0) {
      for (const [eventA, eventB] of conflicts) {
        await resolveConflict(eventA, eventB, facilityId);
        conflictsResolved++;
      }
    } else {
      await mergeFindings(cluster, facilityId);
      coordinationsMerged++;
    }
  }

  // Mark processed
  for (const event of recentEvents) {
    event.processed = true;
  }

  const durationMs = Date.now() - startTime;
  console.log(`[Town Crier] ${facilityId} | ${coordinationsMerged} merged, ${conflictsResolved} conflicts | ${durationMs}ms`);

  return { coordinationsMerged, conflictsResolved };
}

/**
 * Called immediately when any agent publishes an event.
 * Stores the event and handles safety events immediately.
 */
export async function publishEvent(event: Omit<AgentEvent, 'id' | 'published_at' | 'processed'>): Promise<void> {
  const fullEvent: AgentEvent = {
    ...event,
    id: crypto.randomUUID(),
    published_at: new Date(),
    processed: false,
  };

  eventStore.push(fullEvent);

  // TODO: Ivan — write to agent_events table

  // Safety events fire immediately — bypass merge cycle
  if (event.priority === 'safety') {
    await handleSafetyEvent(fullEvent);
  }
}

// ── CONFLICT DETECTION ────────────────────────────────────────

function detectConflicts(events: AgentEvent[]): [AgentEvent, AgentEvent][] {
  const conflicts: [AgentEvent, AgentEvent][] = [];

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      if (eventsConflict(events[i], events[j])) {
        conflicts.push([events[i], events[j]]);
      }
    }
  }

  return conflicts;
}

function eventsConflict(eventA: AgentEvent, eventB: AgentEvent): boolean {
  const resourceA = getRequiredResource(eventA);
  const resourceB = getRequiredResource(eventB);

  if (!resourceA || !resourceB) return false;

  return resourceA.role === resourceB.role && resourceA.window === resourceB.window;
}

function getRequiredResource(event: AgentEvent): { role: string; window: string } | null {
  const p = event.payload;

  if (event.event_type === 'oracle.annacc_opportunity') {
    return { role: 'rn', window: (p.preferred_window as string) ?? '' };
  }
  if (event.event_type === 'steward.structural_roster_gap') {
    return { role: (p.role as string) ?? '', window: (p.gap_window as string) ?? '' };
  }
  if (event.event_type === 'sentinel.sirs_deadline_approaching') {
    return { role: 'don', window: (p.deadline_window as string) ?? '' };
  }

  return null;
}

// ── CONFLICT RESOLUTION — THE ORDER OF PRECEDENCE ────────────

async function resolveConflict(
  eventA: AgentEvent,
  eventB: AgentEvent,
  facilityId: string
): Promise<ConflictResolution> {

  // PRIORITY 1: Safety vs anything — automatic, silent
  if (eventA.priority === 'safety' || eventB.priority === 'safety') {
    const safetyEvent = eventA.priority === 'safety' ? eventA : eventB;
    const otherEvent = eventA.priority === 'safety' ? eventB : eventA;

    const resolution: ConflictResolution = {
      conflict_type: `safety_vs_${otherEvent.priority}`,
      winner: safetyEvent.source_agent,
      loser: otherEvent.source_agent,
      strategy: 'automatic_safety',
      human_decision_required: false,
      reasoning: `Safety obligation (${safetyEvent.event_type}) takes absolute priority under the Aged Care Act 2024. ${otherEvent.event_type} has been automatically rescheduled.`,
      lower_priority_action: 'reschedule',
      safety_preserved: true,
    };

    otherEvent.processed = true; // Superseded
    console.log(`[Town Crier] SAFETY override: ${safetyEvent.event_type} > ${otherEvent.event_type}`);
    return resolution;
  }

  // PRIORITY 2: Compliance vs non-compliance — automatic
  if (eventA.priority === 'compliance' && eventB.priority !== 'compliance') {
    const resolution: ConflictResolution = {
      conflict_type: `compliance_vs_${eventB.priority}`,
      winner: eventA.source_agent,
      loser: eventB.source_agent,
      strategy: 'automatic_compliance',
      human_decision_required: false,
      reasoning: `Compliance deadline (${eventA.event_type}) takes automatic priority. ${eventB.event_type} rescheduled to next available window.`,
      lower_priority_action: 'reschedule',
      safety_preserved: true,
    };

    eventB.processed = true;
    console.log(`[Town Crier] COMPLIANCE override: ${eventA.event_type} > ${eventB.event_type}`);
    return resolution;
  }

  if (eventB.priority === 'compliance' && eventA.priority !== 'compliance') {
    const resolution: ConflictResolution = {
      conflict_type: `compliance_vs_${eventA.priority}`,
      winner: eventB.source_agent,
      loser: eventA.source_agent,
      strategy: 'automatic_compliance',
      human_decision_required: false,
      reasoning: `Compliance deadline (${eventB.event_type}) takes automatic priority. ${eventA.event_type} rescheduled to next available window.`,
      lower_priority_action: 'reschedule',
      safety_preserved: true,
    };

    eventA.processed = true;
    console.log(`[Town Crier] COMPLIANCE override: ${eventB.event_type} > ${eventA.event_type}`);
    return resolution;
  }

  // PRIORITY 3 & 4: Equal priority — CHRIS recommends, human decides
  const recommendation = await callClaudeText({
    system: TOWN_CRIER_SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: TOWN_CRIER_PROMPTS.conflict_resolution(
        eventToFinding(eventA),
        eventToFinding(eventB)
      ),
    }],
    maxTokens: 400,
    facilityId,
    agentName: 'town_crier',
    callType: 'conflict_resolution',
  });

  console.log(`[Town Crier] HUMAN DECISION required: ${eventA.event_type} vs ${eventB.event_type}`);

  return {
    conflict_type: `${eventA.priority}_vs_${eventB.priority}`,
    winner: 'human',
    strategy: 'human_decision',
    human_decision_required: true,
    recommendation,
    reasoning: recommendation,
    lower_priority_action: 'human_decides',
    safety_preserved: true,
  };
}

// ── MERGE FINDINGS ────────────────────────────────────────────

async function mergeFindings(events: AgentEvent[], facilityId: string): Promise<MergedRecommendation> {
  const findings = events.map(eventToFinding);

  const narrative = await callClaudeText({
    system: TOWN_CRIER_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: TOWN_CRIER_PROMPTS.merged_recommendation(findings) }],
    maxTokens: 400,
    facilityId,
    agentName: 'town_crier',
    callType: 'merge',
  });

  const targetRoles = [...new Set(events.flatMap((e) => getTargetRoles(e)))];
  const severity = events.some((e) => e.priority === 'safety') ? 'immediate'
    : events.some((e) => e.priority === 'compliance') ? 'urgent' : 'routine';

  const agents = [...new Set(events.map((e) => e.source_agent))];

  const result: MergedRecommendation = {
    contributing_agents: agents,
    event_ids: events.map((e) => e.id),
    narrative,
    severity,
    target_roles: targetRoles,
    route: getLeadRoute(events),
  };

  console.log(`[Town Crier] MERGED: ${agents.map(formatAgentName).join(' + ')} → one recommendation`);

  // TODO: Ivan — write to queue_items table as coordinated_recommendation
  // TODO: Ivan — write to coordination_log table

  return result;
}

// ── SAFETY EVENT HANDLER ──────────────────────────────────────

async function handleSafetyEvent(event: AgentEvent): Promise<void> {
  // Safety events bypass merge — fire immediately
  // Find and supersede any conflicting pending events
  const pending = eventStore.filter(
    (e) => e.facility_id === event.facility_id && !e.processed && e.id !== event.id
  );

  for (const p of pending) {
    if (eventsConflict(event, p)) {
      p.processed = true;
      console.log(`[Town Crier] SAFETY immediate: superseded ${p.event_type}`);
    }
  }
}

// ── CLUSTER DETECTION ─────────────────────────────────────────

function clusterRelatedEvents(events: AgentEvent[]): AgentEvent[][] {
  const clusters: AgentEvent[][] = [];
  const assigned = new Set<string>();

  for (const event of events) {
    if (assigned.has(event.id)) continue;

    const cluster = [event];
    assigned.add(event.id);

    for (const other of events) {
      if (assigned.has(other.id)) continue;
      if (eventsAreRelated(event, other)) {
        cluster.push(other);
        assigned.add(other.id);
      }
    }

    clusters.push(cluster);
  }

  return clusters;
}

function eventsAreRelated(eventA: AgentEvent, eventB: AgentEvent): boolean {
  const aSubscribes = AGENT_SUBSCRIPTIONS[eventA.source_agent]?.includes(eventB.event_type);
  const bSubscribes = AGENT_SUBSCRIPTIONS[eventB.source_agent]?.includes(eventA.event_type);
  return aSubscribes || bSubscribes;
}

// ── HELPERS ───────────────────────────────────────────────────

function eventToFinding(event: AgentEvent): AgentFinding {
  return {
    agent: event.source_agent,
    event_type: event.event_type,
    priority: event.priority,
    title: (event.payload.title as string) || event.event_type,
    description: (event.payload.description as string) || '',
    estimated_value: event.payload.estimated_value as number | undefined,
    estimated_risk: event.payload.estimated_risk as number | undefined,
    requires_resource: event.payload.requires_resource as string | undefined,
    requires_window: event.payload.requires_window as string | undefined,
    payload: event.payload,
  };
}

function getTargetRoles(event: AgentEvent): string[] {
  const map: Partial<Record<EventType, string[]>> = {
    'sentinel.care_minutes_at_risk': ['don', 'facility_manager'],
    'sentinel.rn_gap_tonight': ['don', 'facility_manager'],
    'sentinel.sirs_deadline_approaching': ['don', 'quality_lead'],
    'sentinel.psh_wc_risk': ['don', 'whs_lead', 'facility_manager'],
    'oracle.annacc_opportunity': ['cfo', 'ceo', 'facility_manager'],
    'oracle.occupancy_revenue_at_risk': ['facility_manager', 'cfo'],
    'steward.structural_roster_gap': ['facility_manager', 'hr_manager'],
    'steward.care_minutes_buffer_critical': ['don', 'facility_manager'],
    'keeper.turnover_precursor': ['facility_manager', 'hr_manager'],
    'keeper.high_flight_risk': ['facility_manager', 'don', 'whs_lead'],
    'keeper.composition_drift': ['facility_manager', 'hr_manager'],
    'keeper.leader_support_needed': ['facility_manager', 'don'],
  };
  return map[event.event_type] || ['facility_manager'];
}

function getLeadRoute(events: AgentEvent[]): string {
  const sorted = [...events].sort((a, b) => getPriorityRank(a.priority) - getPriorityRank(b.priority));
  return (sorted[0].payload.route as string) || '/dashboard';
}

function getPriorityRank(priority: Priority): number {
  return { safety: 1, compliance: 2, care_quality: 3, financial: 4, operational: 4 }[priority];
}

function formatAgentName(name: AgentName): string {
  return { sentinel: 'Sentinel', oracle: 'Oracle', steward: 'Steward', chronicler: 'Chronicler', keeper: 'Keeper' }[name];
}
