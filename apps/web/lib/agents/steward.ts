// lib/agents/steward.ts
// Maintained by Ivan Sanchez
// The Steward — daily capacity and operational architecture agent for CHRIS
//
// Runs daily at 03:30 AEST after connector pull.
// Reads the structural operational picture — not tonight's problem,
// but the systemic patterns that create tonight's problems.
// Distinguishes structural failures from episodic gaps.
//
// Triggered by calling runSteward(facilityId, data)
// Ivan wires to the 03:30 AEST cron schedule.

import { callClaudeText } from '@/lib/anthropic/client';
import { getStewardPrompt } from '@/lib/agents/prompts/steward';
import AGED_CARE_KNOWLEDGE from '@/lib/chris/aged-care-knowledge';

// ── TYPES ─────────────────────────────────────────────────────

export interface StewardFinding {
  type: string;
  classification: 'structural' | 'episodic';
  severity: 'immediate' | 'urgent' | 'routine';
  domain: 'roster' | 'care_minutes' | 'training' | 'operations';
  title: string;
  description: string;
  facility_id: string;
  shift?: string;
  day_of_week?: string;
  role?: string;
  wing?: string;
  weeks_analysed?: number;
  agency_frequency?: number;
  monthly_cost?: number;
  annual_cost?: number;
  recommended_action: string;
  route?: string;
  notify_roles: string[];
  notify_via: 'imessage' | 'in_app' | 'both';
  publish_event?: string;
  event_payload?: Record<string, unknown>;
}

export interface RosterShift {
  shift_date: string;
  shift_type: string;
  day_of_week: string;
  role: string;
  wing?: string;
  filled_by: 'permanent' | 'agency' | 'casual';
  agency_pct: number;
  staff_count: number;
  minimum_required: number;
  staff_roster?: string[];
  competing_obligations: number;
  historical_absenteeism_rate: number;
}

export interface LeaveRequest {
  role: string;
  leave_start: string;
  leave_end: string;
  status: string;
  cover_arranged: boolean;
}

export interface StaffCredential {
  credential_type: string;
  role: string;
  expiry_date: string;
}

export interface CareMinutesDay {
  date: string;
  shift_type: string;
  total_minutes_delivered: number;
  rn_minutes_delivered: number;
}

export interface QueueItem {
  created_at: string;
  status: string;
  item_type: string;
}

export interface HandoverItem {
  created_at: string;
  cleared_at?: string;
  status: string;
}

export interface AuditScheduleItem {
  id: string;
  audit_type: string;
  scheduled_date: string;
  required_role: string;
}

export interface StewardData {
  careType: 'residential' | 'home_care' | 'ndis';
  rosterHistory?: RosterShift[];
  leaveRequests?: LeaveRequest[];
  credentials?: StaffCredential[];
  careMinutes?: CareMinutesDay[];
  queueItems?: QueueItem[];
  handovers?: HandoverItem[];
  auditSchedule?: AuditScheduleItem[];
  totalStaff?: number;
  trainingGaps?: { staffCount: number; mostCommonGap: string; mostCommonGapCount: number };
}

export interface StewardReport {
  findings: StewardFinding[];
  structural: StewardFinding[];
  episodic: StewardFinding[];
  narrative: string;
}

// ── MAIN RUNNER ───────────────────────────────────────────────

export async function runSteward(
  facilityId: string,
  data: StewardData
): Promise<StewardReport> {

  const startTime = Date.now();

  const [rosterFindings, careMinutesFindings, trainingFindings, operationsFindings] = await Promise.all([
    analyseRosterArchitecture(facilityId, data),
    analyseCareMinutesArchitecture(facilityId, data),
    analyseTrainingCapacity(facilityId, data),
    analyseOperationalFlow(facilityId, data),
  ]);

  const allFindings = [...rosterFindings, ...careMinutesFindings, ...trainingFindings, ...operationsFindings];
  const structural = allFindings.filter((f) => f.classification === 'structural');
  const episodic = allFindings.filter((f) => f.classification === 'episodic');

  const narrative = await generateStewardNarrative(facilityId, allFindings, data.careType);

  const durationMs = Date.now() - startTime;
  console.log(`[Steward] ${facilityId} | ${structural.length} structural + ${episodic.length} episodic | ${durationMs}ms`);

  // TODO: Ivan — write to steward_reports table
  // TODO: Ivan — deliver queue items to FM
  // TODO: Ivan — publish steward events for Town Crier / Keeper

  return { findings: allFindings, structural, episodic, narrative };
}

// ── ROSTER ARCHITECTURE ───────────────────────────────────────

async function analyseRosterArchitecture(facilityId: string, data: StewardData): Promise<StewardFinding[]> {
  const findings: StewardFinding[] = [];
  if (!data.rosterHistory || data.rosterHistory.length === 0) return findings;

  // Group by shift + day + role pattern
  const groups = groupRosterByPattern(data.rosterHistory);

  for (const [key, shifts] of Object.entries(groups)) {
    const { shift, dayOfWeek, role } = parsePatternKey(key);
    const total = shifts.length;
    const agencyCount = shifts.filter((s) => s.filled_by === 'agency').length;
    const agencyFreq = agencyCount / total;

    // STRUCTURAL: Agency >60% over 8+ weeks
    if (agencyFreq > 0.60 && total >= 8) {
      const premium = getAgencyPremium(role);
      const annualCost = premium * 52 * agencyFreq;

      findings.push({
        type: 'structural_shift_gap',
        classification: 'structural',
        severity: agencyFreq > 0.80 ? 'urgent' : 'routine',
        domain: 'roster',
        title: `Structural ${role.toUpperCase()} gap — ${dayOfWeek} ${shift} shift`,
        description: `${dayOfWeek} ${shift} ${role.toUpperCase()} has required agency on ${agencyCount} of ${total} occasions (${Math.round(agencyFreq * 100)}%) over ${total} weeks. This is a roster design problem, not a staffing emergency. Agency premium: ${fmtCurrency(annualCost / 12)}/month, ${fmtCurrency(annualCost)}/year.`,
        facility_id: facilityId,
        shift, day_of_week: dayOfWeek, role,
        weeks_analysed: total, agency_frequency: agencyFreq,
        monthly_cost: annualCost / 12, annual_cost: annualCost,
        recommended_action: `Add permanent ${role.toUpperCase()} to ${dayOfWeek} ${shift} roster — agency dependency costs ${fmtCurrency(annualCost)}/year in premium`,
        route: '/dashboard/workforce/roster',
        notify_roles: ['facility_manager', 'hr_manager'],
        notify_via: 'in_app',
        publish_event: 'steward.structural_roster_gap',
        event_payload: { shift, day_of_week: dayOfWeek, role, agency_frequency: agencyFreq, annual_premium_cost: annualCost },
      });
    }
  }

  // EPISODIC: Leave without cover in next 30 days
  const now = new Date();
  for (const leave of (data.leaveRequests ?? []).filter((l) => l.status === 'approved' && !l.cover_arranged)) {
    const leaveStart = new Date(leave.leave_start);
    if (leaveStart < now) continue;
    const daysUntil = Math.round((leaveStart.getTime() - now.getTime()) / 86400000);
    if (daysUntil > 30) continue;

    findings.push({
      type: 'leave_coverage_gap',
      classification: 'episodic',
      severity: daysUntil <= 7 ? 'urgent' : 'routine',
      domain: 'roster',
      title: `${leave.role.toUpperCase()} leave without cover — ${leaveStart.toLocaleDateString('en-AU')}`,
      description: `${leave.role.toUpperCase()} leave approved from ${leaveStart.toLocaleDateString('en-AU')} with no cover arranged. ${daysUntil} days to find cover.${leave.role === 'rn' ? ' RN leave without cover risks care minutes compliance.' : ''}`,
      facility_id: facilityId,
      role: leave.role,
      recommended_action: daysUntil <= 7
        ? `Source ${leave.role.toUpperCase()} cover immediately for ${leaveStart.toLocaleDateString('en-AU')}`
        : `Arrange ${leave.role.toUpperCase()} cover — ${daysUntil} days available`,
      route: '/dashboard/workforce/roster',
      notify_roles: leave.role === 'rn' ? ['don', 'facility_manager'] : ['facility_manager'],
      notify_via: daysUntil <= 7 ? 'both' : 'in_app',
    });
  }

  return findings;
}

// ── CARE MINUTES ARCHITECTURE ─────────────────────────────────

async function analyseCareMinutesArchitecture(facilityId: string, data: StewardData): Promise<StewardFinding[]> {
  const findings: StewardFinding[] = [];
  if (!data.careMinutes || data.careMinutes.length === 0) return findings;

  const totalTarget = AGED_CARE_KNOWLEDGE.care_minutes.total_minutes_per_resident_day;
  const criticalBuffer = 0.03;

  // Shift buffer analysis
  const shiftBuffers = calculateShiftBuffers(data.careMinutes, totalTarget);
  for (const [shift, buffer] of Object.entries(shiftBuffers)) {
    if (buffer.avgBuffer < criticalBuffer) {
      findings.push({
        type: 'care_minutes_buffer_critical',
        classification: 'structural',
        severity: 'urgent',
        domain: 'care_minutes',
        title: `Care minutes buffer critical — ${shift} shift`,
        description: `${shift} shift averages only ${Math.round(buffer.avgBuffer * 100)}% above target. Any single unplanned absence breaches compliance. The master roster does not have sufficient buffer for the ${shift} shift.`,
        facility_id: facilityId,
        shift,
        recommended_action: `Add ${Math.ceil(totalTarget * criticalBuffer)} minutes of rostered care to the ${shift} shift master roster`,
        route: '/dashboard/care-minutes',
        notify_roles: ['don', 'facility_manager'],
        notify_via: 'both',
        publish_event: 'steward.care_minutes_buffer_critical',
        event_payload: { shift, avg_buffer: buffer.avgBuffer },
      });
    }
  }

  // Day-of-week pattern detection
  const nonCompliant = data.careMinutes.filter((d) => d.total_minutes_delivered < totalTarget * 0.95);
  if (nonCompliant.length >= 3) {
    const pattern = analyseDayPattern(nonCompliant);
    if (pattern.dominantDay) {
      findings.push({
        type: 'care_minutes_day_pattern',
        classification: 'structural',
        severity: 'urgent',
        domain: 'care_minutes',
        title: `Care minutes consistently low — ${pattern.dominantDay}s`,
        description: `Care minutes below target on ${nonCompliant.length} days in 30 days, with ${pattern.dominantDay} appearing ${pattern.frequency} times. This is a systemic ${pattern.dominantDay} roster pattern, not random variance.`,
        facility_id: facilityId,
        day_of_week: pattern.dominantDay,
        recommended_action: `Review ${pattern.dominantDay} master roster — structural gap requiring redesign`,
        route: '/dashboard/care-minutes',
        notify_roles: ['don', 'facility_manager'],
        notify_via: 'in_app',
      });
    }
  }

  return findings;
}

// ── TRAINING CAPACITY ─────────────────────────────────────────

async function analyseTrainingCapacity(facilityId: string, data: StewardData): Promise<StewardFinding[]> {
  const findings: StewardFinding[] = [];
  const now = new Date();
  const thirtyDays = new Date(now.getTime() + 30 * 86400000);

  // Credential expiry — 30 day window
  const expiring = (data.credentials ?? []).filter((c) => {
    const exp = new Date(c.expiry_date);
    return exp >= now && exp <= thirtyDays;
  });

  const rnExpiring = expiring.filter((c) => c.credential_type === 'ahpra' && c.role === 'rn');
  if (rnExpiring.length > 0) {
    findings.push({
      type: 'rn_credential_expiry_imminent',
      classification: 'episodic',
      severity: 'urgent',
      domain: 'training',
      title: `${rnExpiring.length} RN AHPRA registration${rnExpiring.length > 1 ? 's' : ''} expiring within 30 days`,
      description: `Expired registration means the staff member cannot be legally rostered as an RN. This creates a care minutes compliance risk if unresolved.`,
      facility_id: facilityId,
      role: 'rn',
      recommended_action: 'Send AHPRA renewal reminders immediately — do not wait for expiry',
      route: '/dashboard/workforce/training',
      notify_roles: ['don', 'hr_manager', 'facility_manager'],
      notify_via: 'both',
      publish_event: 'steward.credential_expiry_care_minutes_risk',
      event_payload: { role: 'rn', count: rnExpiring.length, care_minutes_risk: true },
    });
  }

  const otherExpiring = expiring.filter((c) => !(c.credential_type === 'ahpra' && c.role === 'rn'));
  if (otherExpiring.length > 0) {
    findings.push({
      type: 'credential_expiry_imminent',
      classification: 'episodic',
      severity: 'routine',
      domain: 'training',
      title: `${otherExpiring.length} credential${otherExpiring.length > 1 ? 's' : ''} expiring within 30 days`,
      description: `${otherExpiring.length} staff credential${otherExpiring.length > 1 ? 's' : ''} expiring: ${[...new Set(otherExpiring.map((c) => c.credential_type))].join(', ')}.`,
      facility_id: facilityId,
      recommended_action: 'Send renewal reminders and schedule renewal sessions',
      route: '/dashboard/workforce/training',
      notify_roles: ['hr_manager'],
      notify_via: 'in_app',
    });
  }

  // Mandatory training gaps
  if (data.trainingGaps && data.trainingGaps.staffCount > 0 && data.totalStaff) {
    const rate = 1 - (data.trainingGaps.staffCount / data.totalStaff);
    findings.push({
      type: 'mandatory_training_gaps',
      classification: data.trainingGaps.staffCount > 5 ? 'structural' : 'episodic',
      severity: rate < 0.85 ? 'urgent' : 'routine',
      domain: 'training',
      title: `Mandatory training compliance at ${Math.round(rate * 100)}%`,
      description: `${data.trainingGaps.staffCount} of ${data.totalStaff} staff have overdue mandatory training. ACQSC auditors assess training compliance as Quality Standard 8 evidence.`,
      facility_id: facilityId,
      recommended_action: `Schedule training for the ${data.trainingGaps.mostCommonGap} module — ${data.trainingGaps.mostCommonGapCount} staff affected`,
      route: '/dashboard/workforce/training',
      notify_roles: ['hr_manager', 'facility_manager'],
      notify_via: 'in_app',
    });
  }

  return findings;
}

// ── OPERATIONAL FLOW ──────────────────────────────────────────

async function analyseOperationalFlow(facilityId: string, data: StewardData): Promise<StewardFinding[]> {
  const findings: StewardFinding[] = [];
  const now = new Date();

  // Handover clearance time
  const clearedHandovers = (data.handovers ?? []).filter((h) => h.status === 'cleared' && h.cleared_at);
  if (clearedHandovers.length > 0) {
    const avgHours = clearedHandovers.reduce((sum, h) => {
      return sum + (new Date(h.cleared_at!).getTime() - new Date(h.created_at).getTime()) / 3600000;
    }, 0) / clearedHandovers.length;

    if (avgHours > 24) {
      findings.push({
        type: 'handover_clearance_slow',
        classification: avgHours > 48 ? 'structural' : 'episodic',
        severity: 'routine',
        domain: 'operations',
        title: `Handover items averaging ${Math.round(avgHours)}h to clear`,
        description: `Average clearance ${Math.round(avgHours)} hours against 8-hour target. ${avgHours > 48 ? 'Systemic process issue.' : 'Items accumulating faster than resolved.'}`,
        facility_id: facilityId,
        recommended_action: 'Review handover process — consider queue management redesign or triage',
        route: '/dashboard/operations',
        notify_roles: ['facility_manager', 'don'],
        notify_via: 'in_app',
      });
    }
  }

  // Queue item aging
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
  const aging = (data.queueItems ?? []).filter((q) => q.status === 'pending' && new Date(q.created_at) < sevenDaysAgo);
  if (aging.length > 3) {
    const oldestMs = Math.min(...aging.map((q) => new Date(q.created_at).getTime()));
    const oldestDays = Math.round((now.getTime() - oldestMs) / 86400000);

    findings.push({
      type: 'queue_items_aging',
      classification: 'structural',
      severity: 'routine',
      domain: 'operations',
      title: `${aging.length} queue items over 7 days old`,
      description: `${aging.length} items pending >7 days. Oldest: ${oldestDays} days. Items generated faster than leaders can action them.`,
      facility_id: facilityId,
      recommended_action: 'Review queue management — different routing or leader capacity adjustment needed',
      route: '/dashboard/operations',
      notify_roles: ['facility_manager'],
      notify_via: 'in_app',
    });
  }

  // Audit scheduling conflicts
  for (const audit of (data.auditSchedule ?? [])) {
    const auditDate = new Date(audit.scheduled_date);
    if (auditDate < now) continue;
    const conflicting = (data.leaveRequests ?? []).filter((l) =>
      l.status === 'approved' &&
      l.role === audit.required_role &&
      new Date(l.leave_start) <= auditDate &&
      new Date(l.leave_end) >= auditDate
    );

    if (conflicting.length > 0) {
      findings.push({
        type: 'audit_scheduling_conflict',
        classification: 'episodic',
        severity: 'routine',
        domain: 'operations',
        title: `${audit.audit_type} audit conflict — ${auditDate.toLocaleDateString('en-AU')}`,
        description: `${audit.audit_type} audit on ${auditDate.toLocaleDateString('en-AU')} conflicts with approved ${audit.required_role.toUpperCase()} leave. Required staff unavailable.`,
        facility_id: facilityId,
        recommended_action: 'Reschedule audit or arrange alternative auditor — voice-guided CHRIS audit reduces time',
        route: `/dashboard/audits/${audit.id}`,
        notify_roles: ['quality_lead', 'don'],
        notify_via: 'in_app',
      });
    }
  }

  return findings;
}

// ── NARRATIVE GENERATION ──────────────────────────────────────

async function generateStewardNarrative(
  facilityId: string,
  findings: StewardFinding[],
  careType: 'residential' | 'home_care' | 'ndis'
): Promise<string> {
  const structural = findings.filter((f) => f.classification === 'structural');
  const episodic = findings.filter((f) => f.classification === 'episodic');

  return callClaudeText({
    system: getStewardPrompt(careType),
    messages: [{
      role: 'user',
      content: `Generate the daily Steward Report for the Facility Manager.

4-5 sentences. Lead with the most significant structural finding.
Make the structural vs episodic distinction explicit.
Name shifts, days, roles, dollar amounts.
End with one concrete structural recommendation.
No bullet points.

Structural (${structural.length}): ${JSON.stringify(structural)}
Episodic (${episodic.length}): ${JSON.stringify(episodic)}`,
    }],
    maxTokens: 500,
    facilityId,
    agentName: 'steward',
    callType: 'daily_report',
  });
}

// ── ORACLE EVENT HANDLER ──────────────────────────────────────

/**
 * When Oracle identifies AN-ACC opportunities requiring clinical staff time,
 * Steward finds the optimal scheduling window.
 * Town Crier wires this handoff in a later session.
 */
export async function handleOracleEvent(
  facilityId: string,
  event: { type: string; annacc_opportunities: Array<{ type: string }>; total_monthly_uplift: number }
): Promise<void> {
  if (event.type !== 'oracle.weekly_scan_complete') return;

  const assessments = event.annacc_opportunities.filter((o) => o.type === 'annacc_upward_reclassification');
  if (assessments.length === 0) return;

  // TODO: Ivan — find optimal scheduling window from roster data
  // and publish coordinated recommendation for Town Crier
  console.log(`[Steward] Oracle handoff: ${assessments.length} AN-ACC assessments to schedule for ${facilityId}`);
}

// ── HELPERS ───────────────────────────────────────────────────

function groupRosterByPattern(history: RosterShift[]): Record<string, RosterShift[]> {
  return history.reduce((acc, s) => {
    const key = `${s.shift_type}|${s.day_of_week}|${s.role}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {} as Record<string, RosterShift[]>);
}

function parsePatternKey(key: string): { shift: string; dayOfWeek: string; role: string } {
  const [shift, dayOfWeek, role] = key.split('|');
  return { shift, dayOfWeek, role };
}

function getAgencyPremium(role: string): number {
  const b = AGED_CARE_KNOWLEDGE.financial.workforce_cost_benchmarks;
  return role === 'rn' ? b.agency_rn_premium_per_shift : b.agency_ain_premium_per_shift;
}

function calculateShiftBuffers(
  careMinutes: CareMinutesDay[],
  totalTarget: number
): Record<string, { avgBuffer: number }> {
  const shifts = ['morning', 'afternoon', 'night'];
  const shiftTargets: Record<string, number> = { morning: totalTarget * 0.4, afternoon: totalTarget * 0.4, night: totalTarget * 0.2 };

  return shifts.reduce((acc, shift) => {
    const data = careMinutes.filter((d) => d.shift_type === shift);
    if (data.length === 0) return acc;
    const avg = data.reduce((s, d) => s + d.total_minutes_delivered, 0) / data.length;
    const target = shiftTargets[shift];
    acc[shift] = { avgBuffer: (avg - target) / target };
    return acc;
  }, {} as Record<string, { avgBuffer: number }>);
}

function analyseDayPattern(data: CareMinutesDay[]): { dominantDay: string | null; frequency: number } {
  const counts: Record<string, number> = {};
  for (const d of data) {
    const day = new Date(d.date).toLocaleDateString('en-AU', { weekday: 'long' });
    counts[day] = (counts[day] || 0) + 1;
  }
  const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
  if (sorted.length === 0) return { dominantDay: null, frequency: 0 };
  const [day, freq] = sorted[0];
  return { dominantDay: freq >= 2 ? day : null, frequency: freq };
}

function fmtCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}
