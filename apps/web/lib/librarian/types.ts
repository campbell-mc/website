// lib/librarian/types.ts
// All shared types for the Librarian knowledge layer.

import type { ConnectorDataType } from '@/lib/agents/sentinel-router';

// ── OBSERVE ──────────────────────────────────────────────────

export interface LibrarianEvent {
  facility_id: string;
  event_type: ConnectorDataType | string;
  source: string;                // 'connector:deputy' | 'agent:sentinel' | 'user:don'
  domain: EventDomain;
  payload: Record<string, unknown>;
  observed_at?: Date;            // defaults to now
  metadata?: Record<string, unknown>; // correlation_id, connector_pull_id, etc.
}

export type EventDomain = 'clinical' | 'workforce' | 'financial' | 'governance' | 'residents' | 'operations';

export interface ObserveResult {
  event_id: string;
  recorded_at: Date;
  threshold_crossed: boolean;
  agents_notified: string[];
}

// ── QUERY ────────────────────────────────────────────────────

export type QueryKind =
  | 'psh_scores'
  | 'care_minutes_trend'
  | 'sirs_open'
  | 'workforce_snapshot'
  | 'incident_trend'
  | 'financial_snapshot'
  | 'convergence_active'
  | 'practice_history'
  | 'compliance_obligations'
  | 'agent_findings'
  | 'resident_intelligence'
  | 'briefing_history'
  | 'events_since'
  | 'roster_pattern';

export interface QueryParamsMap {
  psh_scores: { facility_id: string; team_id?: string; wing?: string; cycles?: number };
  care_minutes_trend: { facility_id: string; days?: number };
  sirs_open: { facility_id: string };
  workforce_snapshot: { facility_id: string };
  incident_trend: { facility_id: string; days?: number; type?: string };
  financial_snapshot: { facility_id: string };
  convergence_active: { facility_id: string; team_id?: string };
  practice_history: { facility_id: string; team_id?: string; cycles?: number };
  compliance_obligations: { facility_id: string; status?: string };
  agent_findings: { facility_id: string; agent?: string; days?: number };
  resident_intelligence: { facility_id: string };
  briefing_history: { facility_id: string; role?: string; days?: number };
  events_since: { facility_id: string; since: Date; event_type?: string };
  roster_pattern: { facility_id: string; days?: number };
}

export interface QueryResultMap {
  psh_scores: PSHScoreResult[];
  care_minutes_trend: CareMinutesResult[];
  sirs_open: SIRSOpenResult[];
  workforce_snapshot: WorkforceSnapshotResult;
  incident_trend: IncidentTrendResult[];
  financial_snapshot: FinancialSnapshotResult;
  convergence_active: ConvergenceActiveResult[];
  practice_history: PracticeHistoryResult[];
  compliance_obligations: ComplianceResult[];
  agent_findings: AgentFindingResult[];
  resident_intelligence: ResidentResult[];
  briefing_history: BriefingResult[];
  events_since: LedgerEventResult[];
  roster_pattern: RosterPatternResult[];
}

// Result shapes
export interface PSHScoreResult {
  cycle_id: string;
  team_id: string;
  wing: string;
  domain_scores: Record<string, number>;
  participation_rate: number;
  elevated: string[];
  monitoring: string[];
  convergence_detected: boolean;
}

export interface CareMinutesResult {
  date: string;
  total_minutes: number;
  rn_minutes: number;
  en_minutes: number;
  pcw_minutes: number;
  compliant: boolean;
  agency_pct: number;
}

export interface SIRSOpenResult {
  id: string;
  category: number;
  incident_type: string;
  occurred_at: string;
  deadline: string;
  hours_remaining: number;
  draft_status: string;
  wing: string;
}

export interface WorkforceSnapshotResult {
  turnover_pct: number;
  voluntary_turnover_pct: number;
  absenteeism_pct: number;
  unplanned_leave_pct: number;
  agency_pct: number;
  agency_cost_week: number;
  permanent_ratio: number;
  rn_ratio: number;
  avg_tenure_days: number;
  training_compliance_pct: number;
  ahpra_current_pct: number;
  credentials_expiring_30d: number;
  leave_liability: number;
  psh_composite_score: number;
  psh_participation_pct: number;
}

export interface IncidentTrendResult {
  month: string;
  total: number;
  by_type: Record<string, number>;
  sirs_count: number;
  agency_shift_pct: number;
}

export interface FinancialSnapshotResult {
  period: string;
  ebitda_pbd: number;
  care_ratio: number;
  occupancy_pct: number;
  agency_cost_month: number;
  revenue_total: number;
  labour_cost_pbd: number;
  vacant_beds: number;
}

export interface ConvergenceActiveResult {
  hazard_domain: string;
  pulse_severity: number;
  operational_severity: number;
  final_score: number;
  confidence: string;
  narrative: string;
  cycles_persisting: number;
  team_id?: string;
}

export interface PracticeHistoryResult {
  cycle_id: string;
  team_id: string;
  practice_id: string;
  practice_name: string;
  hazard_targeted: string;
  pre_score: number | null;
  post_score: number | null;
  delta: number | null;
  outcome: string | null;
  delivered: boolean;
}

export interface ComplianceResult {
  id: string;
  name: string;
  domain: string;
  status: string;
  deadline: string;
  days_remaining: number;
  penalty_exposure: string | null;
}

export interface AgentFindingResult {
  agent: string;
  run_id: string;
  trigger: string;
  findings: unknown[];
  narrative: string | null;
  created_at: string;
}

export interface ResidentResult {
  id: string;
  wing: string;
  annacc_class: number;
  last_assessment_date: string | null;
  days_since_assessment: number;
  is_supported: boolean;
  helf_enrolled: boolean;
  clinical_signals: string[];
}

export interface BriefingResult {
  type: string;
  role: string;
  narrative: string;
  generated_at: string;
}

export interface LedgerEventResult {
  event_id: string;
  event_type: string;
  source: string;
  domain: string;
  payload: Record<string, unknown>;
  observed_at: string;
}

export interface RosterPatternResult {
  date: string;
  shift: string;
  total_staff: number;
  gaps: number;
  agency_count: number;
  agency_cost: number;
  rn_confirmed: boolean;
}

// ── SEARCH ───────────────────────────────────────────────────

export interface SearchFilters {
  source_type?: 'practice' | 'knowledge' | 'finding' | 'situation_report';
  care_type?: string;
  domain?: string;
  signals?: string[];
  limit?: number;
  min_score?: number;
}

export interface SearchResult {
  source_type: string;
  source_id: string;
  score: number;
  content: string;
  metadata: Record<string, unknown>;
}

// ── ASSEMBLE ─────────────────────────────────────────────────

export type AgentType = 'sentinel' | 'oracle' | 'steward' | 'keeper' | 'chronicler' | 'town_crier';

export interface AssemblyTrigger {
  event_type?: string;
  event_id?: string;
  scheduled?: boolean;
}

// Agent-specific context shapes
export interface SentinelContext {
  knowledge: {
    care_minutes: Record<string, unknown>;
    sirs: Record<string, unknown>;
    psh: Record<string, unknown>;
  };
  care_minutes_today: CareMinutesResult | null;
  sirs_open: SIRSOpenResult[];
  compliance_obligations: ComplianceResult[];
  convergence_active: ConvergenceActiveResult[];
  recent_findings: AgentFindingResult[];
  facility_meta: { name: string; beds: number; care_type: string };
}

export interface OracleContext {
  knowledge: {
    financial: Record<string, unknown>;
    stewartbrown: Record<string, unknown>;
  };
  residents: ResidentResult[];
  financial: FinancialSnapshotResult;
  prior_opportunities: AgentFindingResult[];
  facility_meta: { name: string; beds: number; care_type: string };
}

export interface StewardContext {
  knowledge: {
    care_minutes: Record<string, unknown>;
    workforce: Record<string, unknown>;
  };
  roster_28d: RosterPatternResult[];
  care_minutes_7d: CareMinutesResult[];
  credentials_expiring: number;
  prior_findings: AgentFindingResult[];
  facility_meta: { name: string; beds: number; care_type: string };
}

export interface KeeperContext {
  knowledge: {
    psh: Record<string, unknown>;
    workforce: Record<string, unknown>;
  };
  psh_cycles: PSHScoreResult[];
  practice_outcomes: PracticeHistoryResult[];
  workforce: WorkforceSnapshotResult;
  convergence_active: ConvergenceActiveResult[];
  facility_meta: { name: string; beds: number; care_type: string };
}

export interface ChroniclerContext {
  knowledge: Record<string, unknown>;
  trigger_event: LedgerEventResult | null;
  facility_meta: { name: string; beds: number; care_type: string };
}

export interface TownCrierContext {
  unprocessed_events: LedgerEventResult[];
  recent_coordinations: AgentFindingResult[];
  facility_meta: { name: string; beds: number; care_type: string };
}

export type AgentContextMap = {
  sentinel: SentinelContext;
  oracle: OracleContext;
  steward: StewardContext;
  keeper: KeeperContext;
  chronicler: ChroniclerContext;
  town_crier: TownCrierContext;
};

// ── KNOWLEDGE ────────────────────────────────────────────────

export type KnowledgeDomain =
  | 'care_minutes' | 'sirs' | 'psh' | 'financial' | 'qi'
  | 'whs' | 'workforce' | 'stewartbrown' | 'legislation'
  | 'quality_standards' | 'reporting_cycles' | 'connectors';

export interface KnowledgeResult {
  source: 'database' | 'static_fallback';
  version: number;
  domain: string;
  data: Record<string, unknown>;
}

// ── RECORD ───────────────────────────────────────────────────

export interface ReasoningTraceInput {
  facility_id: string;
  agent: AgentType;
  trigger: 'scheduled' | 'threshold_crossing' | 'event_driven' | 'manual';
  knowledge_used: { domain: string; key: string }[];
  data_queried: { kind: QueryKind; params: Record<string, unknown> }[];
  findings_count: number;
  findings?: unknown[];
  narrative?: string;
  actions_recommended?: unknown[];
  model?: string;
  input_tokens?: number;
  output_tokens?: number;
  estimated_cost_usd?: number;
  duration_ms?: number;
}

// ── LEARN ────────────────────────────────────────────────────

export interface PracticeOutcomeInput {
  facility_id: string;
  team_id: string;
  cycle_id: string;
  practice_id: string;
  signal_targeted: string;
  hazard_domain: string;
  pre_score: number | null;
  post_score: number | null;
  leader_effectiveness_rating?: number;
  practice_delivered: boolean;
  contextual_factors?: Record<string, unknown>;
}

// ── LIBRARIAN INTERFACE ──────────────────────────────────────

export interface Librarian {
  observe(event: LibrarianEvent): Promise<ObserveResult>;
  query<K extends QueryKind>(kind: K, params: QueryParamsMap[K]): Promise<QueryResultMap[K]>;
  search(text: string, filters?: SearchFilters): Promise<SearchResult[]>;
  assemble<A extends AgentType>(agentType: A, facilityId: string, trigger?: AssemblyTrigger): Promise<AgentContextMap[A]>;
  getKnowledge(domain: KnowledgeDomain, careType?: string): Promise<KnowledgeResult>;
  record(trace: ReasoningTraceInput): Promise<void>;
  learn(outcome: PracticeOutcomeInput): Promise<void>;
}
