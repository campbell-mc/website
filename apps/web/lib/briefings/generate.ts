// lib/briefings/generate.ts
// Maintained by Ivan Sanchez
// Full briefing generation engine for CHRIS
//
// All briefings are generated from live data, role-specific, and delivered
// at the right moment to the right person. No briefing is a static report —
// each is a synthesised intelligence narrative generated fresh from the
// canonical data layer.
//
// 4 briefing types:
//   morning  — every day, all enabled roles, from live data
//   evening  — daily after 5pm, all enabled roles, 7 days/week
//   team     — fortnightly, Team Leaders, from pulse cycle data
//   leader   — alternate weeks, Leader Loop active leaders only

import { callClaudeText } from '@/lib/anthropic/client';
import { ROLE_CONFIG, getRoleConfig, type RoleName } from '@/lib/roles/config';
import AGED_CARE_KNOWLEDGE from '@/lib/chris/aged-care-knowledge';
import { generateConvergenceInsights, type ConvergenceInsight } from '@/lib/chris/convergence';

// ── TYPES ─────────────────────────────────────────────────────

export type BriefingType = 'morning' | 'evening' | 'team' | 'leader';

export interface GeneratedBriefing {
  facility_id: string;
  role: RoleName;
  briefing_type: BriefingType;
  team_id?: string;
  leader_id?: string;
  cycle_id?: string;
  narrative: string;
  selected_practice?: Record<string, unknown>;
  data_snapshot: Record<string, unknown>;
  generated_at: Date;
}

interface TeamConfig {
  id: string;
  name: string;
  wing: string;
  facility_id: string;
}

interface LeaderConfig {
  id: string;
  name: string;
  team_id: string;
  facility_id: string;
  leader_loop_active: boolean;
}

// ── MAIN ENTRY POINTS ─────────────────────────────────────────

export async function generateMorningBriefings(facilityId: string): Promise<GeneratedBriefing[]> {
  const roles = (Object.keys(ROLE_CONFIG) as RoleName[]).filter((r) => ROLE_CONFIG[r].briefings.morning.enabled);
  const results = await Promise.all(roles.map((role) => generateBriefing(facilityId, role, 'morning')));
  console.log(`[Briefings] Morning briefings generated for ${results.length} roles — ${facilityId}`);
  return results;
}

export async function generateEveningBriefings(facilityId: string): Promise<GeneratedBriefing[]> {
  const roles = (Object.keys(ROLE_CONFIG) as RoleName[]).filter((r) => ROLE_CONFIG[r].briefings.evening.enabled);
  const results = await Promise.all(roles.map((role) => generateBriefing(facilityId, role, 'evening')));
  console.log(`[Briefings] Evening briefings generated for ${results.length} roles — ${facilityId}`);
  return results;
}

export async function generateTeamBriefings(facilityId: string, cycleId: string, teams: TeamConfig[]): Promise<GeneratedBriefing[]> {
  const results = await Promise.all(teams.map((team) => generateTeamBriefing(facilityId, cycleId, team)));
  console.log(`[Briefings] Team Briefings generated for ${results.length} teams — Cycle ${cycleId}`);
  return results;
}

export async function generateLeaderBriefings(facilityId: string, cycleId: string, leaders: LeaderConfig[]): Promise<GeneratedBriefing[]> {
  const active = leaders.filter((l) => l.leader_loop_active);
  const results = await Promise.all(active.map((leader) => generateLeaderBriefing(facilityId, cycleId, leader)));
  console.log(`[Briefings] Leader Briefings generated for ${results.length} leaders — Cycle ${cycleId}`);
  return results;
}

// ── MORNING / EVENING BRIEFING ────────────────────────────────

async function generateBriefing(facilityId: string, role: RoleName, type: 'morning' | 'evening'): Promise<GeneratedBriefing> {
  const config = getRoleConfig(role);
  const briefingConfig = config.briefings[type];

  const dataSnapshot: Record<string, unknown> = {
    data_inputs: briefingConfig.data_inputs,
    facility_id: facilityId,
    generated_for: role,
    // TODO: Ivan — replace with actual data gathering from canonical layer
    // Each data_input string maps to a DB query
  };

  const systemPrompt = getBriefingSystemPrompt(role, type);
  const userPrompt = buildBriefingPrompt(role, type, dataSnapshot);

  const narrative = await callClaudeText({
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    maxTokens: briefingConfig.max_tokens,
    facilityId,
    agentName: 'briefing_engine',
    callType: `${type}_briefing`,
  });

  // TODO: Ivan — write to briefings table
  // TODO: Ivan — deliver via queue item + iMessage based on briefingConfig.delivery

  return {
    facility_id: facilityId,
    role,
    briefing_type: type,
    narrative,
    data_snapshot: dataSnapshot,
    generated_at: new Date(),
  };
}

// ── TEAM BRIEFING ─────────────────────────────────────────────

async function generateTeamBriefing(facilityId: string, cycleId: string, team: TeamConfig): Promise<GeneratedBriefing> {
  const systemPrompt = `You are CHRIS — generating a Team Briefing for a Team Leader in an Australian aged care facility. This briefing is delivered fortnightly when the pulse cycle closes. It synthesises pulse data and operational signals into a clear, actionable briefing the Team Leader can use in their Monday huddle.

VOICE:
Warm, direct, and practical. Written for the Team Leader, not for management.
Acknowledge the team's experience honestly. Be specific about what the data shows.
One recommended practice — not a list of options.
The Team Leader's job is to read this and lead. Make it easy.`;

  const userPrompt = `Generate the Team Briefing for ${team.name}.

Cycle: ${cycleId}
Team: ${team.name} (${team.wing})
Facility: ${facilityId}

Structure the Team Briefing:

1. WHAT THE PULSE IS SHOWING (2-3 sentences)
   What the data tells us about this team right now.
   What has improved. What needs attention.
   Be honest — if it is hard, say so with care.

2. WHAT THIS MEANS (1-2 sentences)
   The human interpretation behind the numbers.
   Connect the PSH signal to what staff might be experiencing.

3. THE PRACTICE THIS FORTNIGHT (2-3 sentences)
   Name the practice clearly.
   Why this practice for this team right now.
   How to introduce it — one specific way to open the conversation.

4. ONE THING TO WATCH
   The single signal worth monitoring this fortnight.

5. HUDDLE AGENDA (3 bullet points only)
   - Opening check-in question
   - One team update
   - Close: one thing we are doing differently

Keep under 400 words. Warm, honest, practical tone throughout.`;

  const narrative = await callClaudeText({
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    maxTokens: 800,
    facilityId,
    agentName: 'briefing_engine',
    callType: 'team_briefing',
  });

  // TODO: Ivan — write to briefings table with team_id and cycle_id
  // TODO: Ivan — deliver via queue item + iMessage to Team Leader

  return {
    facility_id: facilityId,
    role: 'team_leader',
    briefing_type: 'team',
    team_id: team.id,
    cycle_id: cycleId,
    narrative,
    data_snapshot: { team, cycleId },
    generated_at: new Date(),
  };
}

// ── LEADER BRIEFING ───────────────────────────────────────────

async function generateLeaderBriefing(facilityId: string, cycleId: string, leader: LeaderConfig): Promise<GeneratedBriefing> {
  const systemPrompt = `You are CHRIS — generating a Leader Briefing for a Team Leader in an Australian aged care facility as part of their Leader Loop.

The Leader Loop runs in alternate weeks between pulse cycles. This briefing supports the leader's ongoing leadership development — it is not an operational briefing. It is a reflective, developmental conversation prompt that helps the leader grow as they lead.

VOICE:
Coaching tone. Curious rather than directive.
Invite reflection. Surface questions rather than answers.
Warm, honest, and genuinely interested in the leader's development.
The Genos EI framework underpins the coaching approach.`;

  const userPrompt = `Generate the Leader Briefing for ${leader.name}.

Cycle: ${cycleId}
Team: ${leader.team_id}

Structure the Leader Briefing:

1. REFLECTION ON THE PRACTICE (2-3 sentences)
   How did the micro-practice land with the team?
   What did you notice? What was harder than expected?

2. WHAT CHRIS IS NOTICING ABOUT YOUR TEAM (1-2 sentences)
   One signal worth reflecting on. Not a problem to fix — something to be curious about.

3. YOUR DEVELOPMENT FOCUS THIS WEEK (2-3 sentences)
   One leadership development prompt connected to the Genos EI framework.
   A specific situation to practice this week. One question to sit with.

4. PREPARING FOR THE NEXT CYCLE (1-2 sentences)
   What to watch for before the next pulse closes.

Keep under 300 words. Coaching tone throughout — invite, don't instruct.`;

  const narrative = await callClaudeText({
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    maxTokens: 600,
    facilityId,
    agentName: 'briefing_engine',
    callType: 'leader_briefing',
  });

  // TODO: Ivan — write to briefings table with leader_id and cycle_id
  // TODO: Ivan — deliver via queue item + iMessage

  return {
    facility_id: facilityId,
    role: 'team_leader',
    briefing_type: 'leader',
    team_id: leader.team_id,
    leader_id: leader.id,
    cycle_id: cycleId,
    narrative,
    data_snapshot: { leader, cycleId },
    generated_at: new Date(),
  };
}

// ── SYSTEM PROMPTS ────────────────────────────────────────────

function getBriefingSystemPrompt(role: RoleName, type: 'morning' | 'evening'): string {
  const base = `You are CHRIS — the operational intelligence system for Australian aged care. You generate ${type} briefings for facility leaders.

Your briefings are not reports. They are synthesised intelligence narratives that tell each leader what the data means for their domain and what to do about it.

VOICE: Direct. Specific. Warm but not sycophantic. Always name the metric, the wing, the deadline, the dollar amount. Never generic. Never hedging. No preamble. Write as if briefing a senior professional who has 3 minutes. No bullet points in the opening narrative. End with one clear recommended action for today.`;

  const roleContext: Record<RoleName, string> = {
    facility_manager: '\nYou are briefing the Facility Manager — accountable for everything across all domains simultaneously. Lead with what is most urgent. Name the financial impact of operational decisions.',
    don: '\nYou are briefing the Director of Nursing — responsible for clinical governance, care minutes, SIRS, and the clinical team. Lead with safety and compliance. Be specific about care minutes and SIRS deadlines.',
    ceo: '\nYou are briefing the CEO — responsible for the portfolio across all facilities. Aggregate across facilities. Flag outliers. Connect operational signals to strategic risk.',
    cfo: '\nYou are briefing the CFO — responsible for financial sustainability. Always quantify in dollar terms. Reference StewartBrown benchmarks. Flag Oracle findings.',
    clinical_director: '\nYou are briefing the Clinical Director — responsible for clinical quality across all facilities. Lead with AN-ACC and care minutes.',
    quality_lead: '\nYou are briefing the Quality and Risk Lead — responsible for compliance, SIRS, QI, corrective actions, and audit evidence. Be precise about days remaining and penalty exposure.',
    whs_lead: '\nYou are briefing the WHS Lead — responsible for psychosocial safety and ISO 45003. Reference specific PSH domain numbers. Quantify WC risk in dollar terms.',
    hr_manager: '\nYou are briefing the HR Manager — responsible for workforce health. Lead with the highest risk workforce signal. Name turnover precursors and composition drift.',
    board_member: '\nYou are briefing a Board Member — governance oversight. Keep concise. Governance-level signals only.',
    team_leader: '\nYou are briefing a Team Leader — responsible for a specific care team. Warm, supportive, practical. No jargon.',
    frontline_staff: '\nYou are CHRIS — a supportive presence for a care team member. Brief, warm, encouraging.',
    elt_member: '\nYou are briefing an ELT Member — senior leader with portfolio responsibility. Synthesise across domains.',
    operator: '\nYou are briefing the CHRIS Operator — platform health, agent performance, connector status, API costs.',
    // Home Care roles
    home_care_manager: '\nYou are briefing the Home Care Manager — accountable for the home care service. Visit compliance, client budgets, lone worker safety, DSS claiming. No care minutes or SIRS — this is home care.',
    care_coordinator: '\nYou are briefing the Care Coordinator — manages client care plans, visit scheduling, worker-client matching, lone worker check-ins. Warm and operational.',
    support_coordinator_hc: '\nYou are briefing the Support Coordinator — manages individual client budgets and plans under Support at Home. Focus on budget utilisation and claiming.',
    community_support_worker: '\nYou are CHRIS — a supportive companion for a community support worker delivering home care visits. Brief, warm, practical. Aware of the isolation of home-based work.',
    // NDIS roles
    ndis_manager: '\nYou are briefing the NDIS Manager — NDIS Practice Standards compliance, worker screening, plan budget management, myplace claiming. Regulatory-fluent.',
    support_coordinator_ndis: '\nYou are briefing the NDIS Support Coordinator — participant plans, goal progress, plan budget management across Core/Capacity Building/Capital. Person-centred.',
    behaviour_support_practitioner: '\nYou are briefing the Behaviour Support Practitioner — BSP development, restrictive practice compliance, NDIS Commission reporting. Specialist and precise.',
    support_worker_ndis: '\nYou are CHRIS — a supportive companion for an NDIS support worker. Warm, person-centred, practical. Aware of the emotional demands of disability support.',
  };

  const typeContext = type === 'morning'
    ? '\n\nMORNING BRIEFING — delivered before the leader arrives. What needs attention today, what is coming up this week, one action to take first.'
    : '\n\nEVENING BRIEFING — delivered after 5pm, 7 days a week. What happened today, what needs attention overnight or tomorrow, what to hand over.';

  return base + roleContext[role] + typeContext;
}

function buildBriefingPrompt(role: RoleName, type: 'morning' | 'evening', data: Record<string, unknown>): string {
  const timeLabel = type === 'morning' ? 'morning' : 'end of day';
  const now = new Date();

  return `Generate the ${timeLabel} briefing for this leader.

Date: ${now.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
Time: ${now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}

LIVE FACILITY DATA:
${JSON.stringify(data, null, 2)}

REGULATORY CONTEXT:
- Care minutes: ${AGED_CARE_KNOWLEDGE.care_minutes.total_minutes_per_resident_day} min/resident/day (${AGED_CARE_KNOWLEDGE.care_minutes.rn_minutes_per_resident_day} RN)
- SIRS Cat 1: ${AGED_CARE_KNOWLEDGE.sirs.cat1_notification_hours}h deadline
- SIRS Cat 2: ${AGED_CARE_KNOWLEDGE.sirs.cat2_notification_days}d deadline
- QI submission: ${AGED_CARE_KNOWLEDGE.quality_indicators.submission_deadline_days_after_quarter_end}d after quarter end

CONVERGENCE CONTEXT (where two independent signal streams agree on the cause):
When convergence is detected, include one sentence explaining the "why" — what's driving the metric, not just what the metric says. Convergence insights are high-confidence because two independent sources agree.

Write 4-5 sentences. Lead with the most important deterministic signal. Add convergence "why" where detected. End with one clear recommended action. No bullet points. No preamble.`;
}
