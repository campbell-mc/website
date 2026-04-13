// lib/librarian/assemble.ts
// Per-agent context builders. The assemble() method is the most important
// method in the Librarian — it builds exactly the right context for each
// agent's next decision. Agents never need to know where data came from.

import { query } from './query';
import { getKnowledge } from './knowledge';
import { facility } from '@/lib/seed-data';
import type {
  AgentType, AgentContextMap, AssemblyTrigger,
  SentinelContext, OracleContext, StewardContext,
  KeeperContext, ChroniclerContext, TownCrierContext,
} from './types';

/**
 * Assemble the complete context for an agent's next decision.
 * Each agent gets a specifically shaped context — no more, no less.
 */
export async function assemble<A extends AgentType>(
  agentType: A,
  facilityId: string,
  trigger?: AssemblyTrigger,
): Promise<AgentContextMap[A]> {
  const assembler = ASSEMBLERS[agentType];
  if (!assembler) throw new Error(`Unknown agent type: ${agentType}`);
  return assembler(facilityId, trigger) as Promise<AgentContextMap[A]>;
}

const FACILITY_META = { name: facility.name, beds: facility.beds, care_type: 'residential' };

// ── SENTINEL ─────────────────────────────────────────────────
// Trigger: Every connector event + 30min safety net
// Needs: thresholds, today's care minutes, open SIRS, compliance deadlines, convergences

async function assembleSentinel(facilityId: string, _trigger?: AssemblyTrigger): Promise<SentinelContext> {
  const [careMinutesK, sirsK, pshK, careTrend, sirsOpen, compliance, convergences, recentFindings] = await Promise.all([
    getKnowledge('care_minutes'),
    getKnowledge('sirs'),
    getKnowledge('psh'),
    query('care_minutes_trend', { facility_id: facilityId, days: 1 }),
    query('sirs_open', { facility_id: facilityId }),
    query('compliance_obligations', { facility_id: facilityId }),
    query('convergence_active', { facility_id: facilityId }),
    query('agent_findings', { facility_id: facilityId, agent: 'sentinel', days: 7 }),
  ]);

  return {
    knowledge: {
      care_minutes: careMinutesK.data,
      sirs: sirsK.data,
      psh: pshK.data,
    },
    care_minutes_today: careTrend[0] ?? null,
    sirs_open: sirsOpen,
    compliance_obligations: compliance,
    convergence_active: convergences,
    recent_findings: recentFindings,
    facility_meta: FACILITY_META,
  };
}

// ── ORACLE ───────────────────────────────────────────────────
// Trigger: Sunday 21:00 AEST
// Needs: financial benchmarks, residents with clinical signals, latest financials

async function assembleOracle(facilityId: string, _trigger?: AssemblyTrigger): Promise<OracleContext> {
  const [financialK, stewartbrownK, residents, financial, priorOpps] = await Promise.all([
    getKnowledge('financial'),
    getKnowledge('stewartbrown'),
    query('resident_intelligence', { facility_id: facilityId }),
    query('financial_snapshot', { facility_id: facilityId }),
    query('agent_findings', { facility_id: facilityId, agent: 'oracle', days: 7 }),
  ]);

  return {
    knowledge: {
      financial: financialK.data,
      stewartbrown: stewartbrownK.data,
    },
    residents,
    financial,
    prior_opportunities: priorOpps,
    facility_meta: FACILITY_META,
  };
}

// ── STEWARD ──────────────────────────────────────────────────
// Trigger: Daily 03:30 AEST
// Needs: roster patterns (28d), care minutes (7d), credential expiry

async function assembleSteward(facilityId: string, _trigger?: AssemblyTrigger): Promise<StewardContext> {
  const [careMinutesK, workforceK, roster28d, careMinutes7d, workforce, priorFindings] = await Promise.all([
    getKnowledge('care_minutes'),
    getKnowledge('workforce'),
    query('roster_pattern', { facility_id: facilityId, days: 28 }),
    query('care_minutes_trend', { facility_id: facilityId, days: 7 }),
    query('workforce_snapshot', { facility_id: facilityId }),
    query('agent_findings', { facility_id: facilityId, agent: 'steward', days: 7 }),
  ]);

  return {
    knowledge: {
      care_minutes: careMinutesK.data,
      workforce: workforceK.data,
    },
    roster_28d: roster28d,
    care_minutes_7d: careMinutes7d,
    credentials_expiring: workforce.credentials_expiring_30d,
    prior_findings: priorFindings,
    facility_meta: FACILITY_META,
  };
}

// ── KEEPER ───────────────────────────────────────────────────
// Trigger: Fortnightly (PSH cycle close) + daily lightweight
// Needs: 6 cycles of PSH history, practice outcomes, workforce metrics, convergence

async function assembleKeeper(facilityId: string, _trigger?: AssemblyTrigger): Promise<KeeperContext> {
  const [pshK, workforceK, pshCycles, practiceHistory, workforce, convergences] = await Promise.all([
    getKnowledge('psh'),
    getKnowledge('workforce'),
    query('psh_scores', { facility_id: facilityId, cycles: 6 }),
    query('practice_history', { facility_id: facilityId, cycles: 6 }),
    query('workforce_snapshot', { facility_id: facilityId }),
    query('convergence_active', { facility_id: facilityId }),
  ]);

  return {
    knowledge: {
      psh: pshK.data,
      workforce: workforceK.data,
    },
    psh_cycles: pshCycles,
    practice_outcomes: practiceHistory,
    workforce,
    convergence_active: convergences,
    facility_meta: FACILITY_META,
  };
}

// ── CHRONICLER ───────────────────────────────────────────────
// Trigger: Event-driven (SIRS logged, audit completed, etc.)
// Needs: the trigger event + documentation standards

async function assembleChronicler(facilityId: string, trigger?: AssemblyTrigger): Promise<ChroniclerContext> {
  // Determine which knowledge domain based on trigger
  const domain = trigger?.event_type?.includes('sirs') ? 'sirs'
    : trigger?.event_type?.includes('audit') ? 'qi'
    : trigger?.event_type?.includes('complaint') ? 'legislation'
    : 'sirs'; // default

  const knowledge = await getKnowledge(domain);

  // Get the trigger event from the ledger
  let trigger_event = null;
  if (trigger?.event_id) {
    const events = await query('events_since', { facility_id: facilityId, since: new Date(Date.now() - 24 * 60 * 60 * 1000) });
    trigger_event = events.find((e) => e.event_id === trigger.event_id) ?? null;
  }

  return {
    knowledge: knowledge.data,
    trigger_event,
    facility_meta: FACILITY_META,
  };
}

// ── TOWN CRIER ───────────────────────────────────────────────
// Trigger: After each agent run + every 15 minutes
// Needs: unprocessed events, recent coordinations

async function assembleTownCrier(facilityId: string, _trigger?: AssemblyTrigger): Promise<TownCrierContext> {
  const [events, recentCoordinations] = await Promise.all([
    query('events_since', { facility_id: facilityId, since: new Date(Date.now() - 15 * 60 * 1000) }),
    query('agent_findings', { facility_id: facilityId, days: 1 }),
  ]);

  return {
    unprocessed_events: events,
    recent_coordinations: recentCoordinations,
    facility_meta: FACILITY_META,
  };
}

// ── ASSEMBLER MAP ────────────────────────────────────────────

const ASSEMBLERS: Record<AgentType, (facilityId: string, trigger?: AssemblyTrigger) => Promise<any>> = {
  sentinel: assembleSentinel,
  oracle: assembleOracle,
  steward: assembleSteward,
  keeper: assembleKeeper,
  chronicler: assembleChronicler,
  town_crier: assembleTownCrier,
};
