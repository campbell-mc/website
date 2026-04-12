// lib/agents/sentinel.ts
// Maintained by Ivan Sanchez
// The Sentinel — always-on monitoring agent for CHRIS
//
// Watches the live canonical data layer and fires alerts
// the moment a threshold is crossed. Runs on each connector
// pull cycle and can be triggered by significant events.

import { callClaudeText } from '@/lib/anthropic/client';
import { getSentinelPrompt } from '@/lib/agents/prompts/sentinel';
import AGED_CARE_KNOWLEDGE from '@/lib/chris/aged-care-knowledge';

// ── TYPES ─────────────────────────────────────────────────────

export interface SentinelFinding {
  type: string;
  severity: 'immediate' | 'urgent' | 'routine';
  domain: 'safety' | 'compliance' | 'clinical' | 'workforce' | 'financial';
  title: string;
  description: string;
  facility_id: string;
  wing?: string;
  days_remaining?: number;
  metric_value?: number;
  threshold_value?: number;
  action_required: string;
  route?: string;
  notify_roles: string[];
  notify_via: 'imessage' | 'in_app' | 'both';
}

interface CareMinutesToday {
  projected_total_minutes: number;
  rn_minutes_tonight: number;
}

interface SIRSItem {
  id: string;
  category: number;
  incident_type: string;
  notification_deadline: string;
  draft_status: string;
  status: string;
}

interface CorrectiveAction {
  id: string;
  description: string;
  assigned_role: string;
  due_date: string;
  status: string;
}

interface ClinicalAudit {
  id: string;
  audit_type: string;
  scheduled_date: string;
  estimated_duration_minutes: number;
  status: string;
}

interface ComplianceObligation {
  obligation_type: string;
  description: string;
  due_date: string;
  evidence_status: string;
  status: string;
}

interface ConnectorStatus {
  system_name: string;
  last_successful_sync: string;
  data_domains: string[];
}

// ── MAIN ENTRY POINT ──────────────────────────────────────────

export async function runSentinel(
  facilityId: string,
  careType: 'residential' | 'home_care' | 'ndis' = 'residential',
  data: {
    careMinutesToday?: CareMinutesToday;
    sirsItems?: SIRSItem[];
    correctiveActions?: CorrectiveAction[];
    audits?: ClinicalAudit[];
    pshTeamScores?: Record<string, Record<string, number>>;
    complianceObligations?: ComplianceObligation[];
    connectors?: ConnectorStatus[];
  }
): Promise<SentinelFinding[]> {

  const startTime = Date.now();

  // Run all scans in parallel
  const [
    careMinutesFindings,
    sirsFindings,
    correctiveActionFindings,
    auditFindings,
    pshFindings,
    complianceFindings,
    connectorFindings,
  ] = await Promise.all([
    scanCareMinutes(facilityId, data.careMinutesToday),
    scanSIRS(facilityId, data.sirsItems ?? []),
    scanCorrectiveActions(facilityId, data.correctiveActions ?? []),
    scanAudits(facilityId, data.audits ?? []),
    scanPSH(facilityId, data.pshTeamScores ?? {}),
    scanCompliance(facilityId, data.complianceObligations ?? []),
    scanConnectorHealth(facilityId, data.connectors ?? []),
  ]);

  const allFindings = [
    ...careMinutesFindings,
    ...sirsFindings,
    ...correctiveActionFindings,
    ...auditFindings,
    ...pshFindings,
    ...complianceFindings,
    ...connectorFindings,
  ];

  // Sort by severity: immediate first, then urgent, then routine
  const severityOrder = { immediate: 0, urgent: 1, routine: 2 };
  allFindings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  // Generate Sentinel narrative for Situation Report
  let narrative = '';
  if (allFindings.length > 0) {
    narrative = await generateSentinelNarrative(facilityId, allFindings, careType);
  }

  const durationMs = Date.now() - startTime;

  // Log activity
  console.log(`[Sentinel] ${facilityId} | ${allFindings.length} findings (${allFindings.filter(f => f.severity === 'immediate').length} immediate, ${allFindings.filter(f => f.severity === 'urgent').length} urgent) | ${durationMs}ms`);

  return allFindings;
}

// ── CARE MINUTES ─────────────────────────────────────────────

async function scanCareMinutes(facilityId: string, today?: CareMinutesToday): Promise<SentinelFinding[]> {
  if (!today) return [];
  const findings: SentinelFinding[] = [];

  const totalTarget = AGED_CARE_KNOWLEDGE.care_minutes.total_minutes_per_resident_day;
  const rnTarget = AGED_CARE_KNOWLEDGE.care_minutes.rn_minutes_per_resident_day;
  const criticalThreshold = AGED_CARE_KNOWLEDGE.care_minutes.chris_critical_threshold_pct;

  if (today.projected_total_minutes < totalTarget * criticalThreshold) {
    findings.push({
      type: 'care_minutes_critical',
      severity: 'immediate',
      domain: 'compliance',
      title: 'Care minutes at risk tonight',
      description: `Projected ${today.projected_total_minutes} minutes against ${totalTarget} minute target. ${Math.round((1 - today.projected_total_minutes / totalTarget) * 100)}% below required.`,
      facility_id: facilityId,
      metric_value: today.projected_total_minutes,
      threshold_value: totalTarget,
      action_required: 'Source additional staff before 3pm to protect care minutes compliance',
      route: '/dashboard/care-minutes',
      notify_roles: ['don', 'facility_manager'],
      notify_via: 'both',
    });
  }

  if (today.rn_minutes_tonight < rnTarget * criticalThreshold) {
    findings.push({
      type: 'rn_coverage_gap',
      severity: 'immediate',
      domain: 'safety',
      title: 'RN coverage gap tonight',
      description: `${today.rn_minutes_tonight} RN minutes rostered against ${rnTarget} minute requirement. RN must be on site at all times under the Aged Care Act 2024.`,
      facility_id: facilityId,
      metric_value: today.rn_minutes_tonight,
      threshold_value: rnTarget,
      action_required: 'Source RN cover immediately — this is a regulatory requirement, not a preference',
      route: '/dashboard/care-minutes',
      notify_roles: ['don', 'facility_manager'],
      notify_via: 'both',
    });
  }

  return findings;
}

// ── SIRS ─────────────────────────────────────────────────────

async function scanSIRS(facilityId: string, openItems: SIRSItem[]): Promise<SentinelFinding[]> {
  const findings: SentinelFinding[] = [];
  const now = new Date();
  const thresholds = AGED_CARE_KNOWLEDGE.sirs.chris_alert_thresholds;

  for (const item of openItems.filter((i) => i.status === 'open')) {
    const deadline = new Date(item.notification_deadline);
    const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    const daysRemaining = hoursRemaining / 24;

    if (item.category === 1) {
      if (hoursRemaining <= thresholds.cat1_hours_remaining_urgent) {
        findings.push({
          type: 'sirs_cat1_critical',
          severity: 'immediate',
          domain: 'compliance',
          title: `SIRS Cat 1 — ${Math.round(hoursRemaining)} hours remaining`,
          description: `${item.incident_type} notification due to ACQSC within ${Math.round(hoursRemaining)} hours. Maximum penalty for non-notification: $${AGED_CARE_KNOWLEDGE.sirs.max_penalty_per_breach.toLocaleString()}. Chronicler draft ${item.draft_status === 'ready' ? 'is ready for your review' : 'is being prepared'}.`,
          facility_id: facilityId,
          days_remaining: daysRemaining,
          action_required: 'Review and submit SIRS notification via GPMS immediately',
          route: `/dashboard/sirs/${item.id}`,
          notify_roles: ['don', 'quality_lead', 'facility_manager'],
          notify_via: 'both',
        });
      } else if (hoursRemaining <= thresholds.cat1_hours_remaining_warning) {
        findings.push({
          type: 'sirs_cat1_warning',
          severity: 'urgent',
          domain: 'compliance',
          title: `SIRS Cat 1 — ${Math.round(hoursRemaining)} hours remaining`,
          description: `${item.incident_type} notification due within ${Math.round(hoursRemaining)} hours. Chronicler draft is ${item.draft_status === 'ready' ? 'ready for review' : 'in progress'}.`,
          facility_id: facilityId,
          days_remaining: daysRemaining,
          action_required: 'Review Chronicler draft and prepare for GPMS submission',
          route: `/dashboard/sirs/${item.id}`,
          notify_roles: ['don', 'quality_lead'],
          notify_via: 'both',
        });
      }
    }

    if (item.category === 2) {
      if (daysRemaining <= thresholds.cat2_days_remaining_urgent) {
        findings.push({
          type: 'sirs_cat2_urgent',
          severity: 'urgent',
          domain: 'compliance',
          title: `SIRS Cat 2 — ${Math.round(daysRemaining)} days remaining`,
          description: `${item.incident_type} notification due in ${Math.round(daysRemaining)} days. ${item.draft_status === 'ready' ? 'Chronicler draft ready for review.' : 'Chronicler is preparing the draft.'}`,
          facility_id: facilityId,
          days_remaining: daysRemaining,
          action_required: 'Review and finalise SIRS Cat 2 notification for GPMS submission',
          route: `/dashboard/sirs/${item.id}`,
          notify_roles: ['don', 'quality_lead'],
          notify_via: 'in_app',
        });
      } else if (daysRemaining <= thresholds.cat2_days_remaining_warning) {
        findings.push({
          type: 'sirs_cat2_warning',
          severity: 'routine',
          domain: 'compliance',
          title: `SIRS Cat 2 — ${Math.round(daysRemaining)} days remaining`,
          description: `${item.incident_type} notification due in ${Math.round(daysRemaining)} days. Add to this week's Quality and Risk review.`,
          facility_id: facilityId,
          days_remaining: daysRemaining,
          action_required: 'Review draft and schedule GPMS submission',
          route: `/dashboard/sirs/${item.id}`,
          notify_roles: ['quality_lead'],
          notify_via: 'in_app',
        });
      }
    }
  }

  return findings;
}

// ── CORRECTIVE ACTIONS ────────────────────────────────────────

async function scanCorrectiveActions(facilityId: string, actions: CorrectiveAction[]): Promise<SentinelFinding[]> {
  const findings: SentinelFinding[] = [];
  const now = new Date();

  for (const action of actions.filter((a) => a.status === 'not_started')) {
    const dueDate = new Date(action.due_date);
    if (dueDate < now) {
      const daysOverdue = Math.round((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      findings.push({
        type: 'corrective_action_overdue',
        severity: daysOverdue > 14 ? 'urgent' : 'routine',
        domain: 'compliance',
        title: `Corrective action ${daysOverdue} days overdue`,
        description: `${action.description} — assigned to ${action.assigned_role}, due ${dueDate.toLocaleDateString('en-AU')}. Overdue corrective actions create evidence gaps for ACQSC audits.`,
        facility_id: facilityId,
        action_required: 'Update corrective action status or reassign with new due date',
        route: `/dashboard/corrective-actions/${action.id}`,
        notify_roles: ['quality_lead', 'facility_manager'],
        notify_via: 'in_app',
      });
    }
  }

  return findings;
}

// ── CLINICAL AUDITS ───────────────────────────────────────────

async function scanAudits(facilityId: string, audits: ClinicalAudit[]): Promise<SentinelFinding[]> {
  const findings: SentinelFinding[] = [];
  const now = new Date();

  for (const audit of audits.filter((a) => a.status === 'scheduled')) {
    const scheduledDate = new Date(audit.scheduled_date);
    if (scheduledDate < now) {
      const daysOverdue = Math.round((now.getTime() - scheduledDate.getTime()) / (1000 * 60 * 60 * 24));
      findings.push({
        type: 'audit_overdue',
        severity: 'routine',
        domain: 'compliance',
        title: `${audit.audit_type} audit ${daysOverdue} days overdue`,
        description: `Scheduled for ${scheduledDate.toLocaleDateString('en-AU')}. Overdue audits create gaps in Quality Standard evidence. Voice-guided audit via CHRIS takes approximately ${audit.estimated_duration_minutes} minutes.`,
        facility_id: facilityId,
        action_required: 'Complete audit using CHRIS voice-guided audit experience',
        route: `/dashboard/audits/${audit.id}`,
        notify_roles: ['don', 'quality_lead'],
        notify_via: 'in_app',
      });
    }
  }

  return findings;
}

// ── PSH ───────────────────────────────────────────────────────

async function scanPSH(facilityId: string, teamScores: Record<string, Record<string, number>>): Promise<SentinelFinding[]> {
  const findings: SentinelFinding[] = [];
  const elevatedThreshold = AGED_CARE_KNOWLEDGE.psh.thresholds.elevated;
  const wcRiskDomains = ['PSH_08', 'PSH_10'];

  for (const [teamId, domainScores] of Object.entries(teamScores)) {
    const elevatedDomains = Object.entries(domainScores)
      .filter(([, score]) => score >= elevatedThreshold)
      .map(([domain]) => domain);

    if (elevatedDomains.length >= AGED_CARE_KNOWLEDGE.psh.convergence.domains_required) {
      const wcRiskPresent = wcRiskDomains.every((d) => elevatedDomains.includes(d));

      findings.push({
        type: wcRiskPresent ? 'psh_wc_risk' : 'psh_convergence',
        severity: wcRiskPresent ? 'urgent' : 'routine',
        domain: wcRiskPresent ? 'safety' : 'workforce',
        title: wcRiskPresent
          ? `PSH convergence with WC risk — ${teamId}`
          : `PSH convergence detected — ${teamId}`,
        description: wcRiskPresent
          ? `PSH_08 (Traumatic Exposure) and PSH_10 (Violence and Aggression) both elevated in ${teamId}. Research indicates ${AGED_CARE_KNOWLEDGE.psh.wc_correlations.PSH_08_and_PSH_10.claim_probability * 100}% probability of a workers compensation claim within ${AGED_CARE_KNOWLEDGE.psh.wc_correlations.PSH_08_and_PSH_10.window_weeks}.`
          : `${elevatedDomains.length} PSH domains elevated in ${teamId}: ${elevatedDomains.join(', ')}. Convergence of multiple hazards requires a coordinated intervention response.`,
        facility_id: facilityId,
        action_required: wcRiskPresent
          ? 'Review Team Briefing for this team and implement PSH_08/PSH_10 intervention this week'
          : 'Review Team Briefing for this team — micro-practice has been selected for this cycle',
        route: '/dashboard/psh',
        notify_roles: wcRiskPresent ? ['don', 'whs_lead', 'facility_manager'] : ['don', 'whs_lead'],
        notify_via: wcRiskPresent ? 'both' : 'in_app',
      });
    }
  }

  return findings;
}

// ── COMPLIANCE REGISTER ───────────────────────────────────────

async function scanCompliance(facilityId: string, obligations: ComplianceObligation[]): Promise<SentinelFinding[]> {
  const findings: SentinelFinding[] = [];
  const now = new Date();

  for (const obligation of obligations.filter((o) => o.status === 'pending')) {
    const dueDate = new Date(obligation.due_date);
    const daysRemaining = Math.round((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 14) {
      findings.push({
        type: 'compliance_deadline',
        severity: daysRemaining <= 3 ? 'urgent' : 'routine',
        domain: 'compliance',
        title: `${obligation.obligation_type} due in ${daysRemaining} days`,
        description: `${obligation.description}. Due: ${dueDate.toLocaleDateString('en-AU')}. Evidence status: ${obligation.evidence_status}.`,
        facility_id: facilityId,
        days_remaining: daysRemaining,
        action_required: obligation.evidence_status === 'missing'
          ? 'Evidence required before submission — review Chronicler for draft documentation'
          : 'Review and submit via GPMS',
        route: '/dashboard/compliance',
        notify_roles: ['quality_lead', 'facility_manager'],
        notify_via: daysRemaining <= 3 ? 'both' : 'in_app',
      });
    }
  }

  return findings;
}

// ── CONNECTOR HEALTH ──────────────────────────────────────────

async function scanConnectorHealth(facilityId: string, connectors: ConnectorStatus[]): Promise<SentinelFinding[]> {
  const findings: SentinelFinding[] = [];
  const now = new Date();

  for (const connector of connectors) {
    const lastSync = new Date(connector.last_successful_sync);
    const hoursStale = Math.round((now.getTime() - lastSync.getTime()) / (1000 * 60 * 60));

    if (hoursStale > 4) {
      findings.push({
        type: 'connector_stale',
        severity: hoursStale > 12 ? 'urgent' : 'routine',
        domain: 'compliance',
        title: `${connector.system_name} data ${hoursStale}h out of date`,
        description: `Last successful sync from ${connector.system_name} was ${hoursStale} hours ago. CHRIS intelligence for ${connector.data_domains.join(', ')} may not reflect current state.`,
        facility_id: facilityId,
        action_required: 'Check connector status in operator dashboard',
        route: '/dashboard/operator/connectors',
        notify_roles: ['operator'],
        notify_via: 'in_app',
      });
    }
  }

  return findings;
}

// ── NARRATIVE GENERATION ──────────────────────────────────────

async function generateSentinelNarrative(
  facilityId: string,
  findings: SentinelFinding[],
  careType: 'residential' | 'home_care' | 'ndis'
): Promise<string> {

  const immediate = findings.filter((f) => f.severity === 'immediate');
  const urgent = findings.filter((f) => f.severity === 'urgent');
  const routine = findings.filter((f) => f.severity === 'routine');

  const narrative = await callClaudeText({
    system: getSentinelPrompt(careType),
    messages: [{
      role: 'user',
      content: `Generate the Sentinel Situation Report for this facility.

Immediate findings (${immediate.length}): ${JSON.stringify(immediate)}
Urgent findings (${urgent.length}): ${JSON.stringify(urgent)}
Routine findings (${routine.length}): ${JSON.stringify(routine)}

Write 3-4 sentences. Lead with the most critical finding.
Name specific metrics, wings, deadlines, and dollar amounts.
End with one clear recommended action for the DON.
No bullet points. No hedging.`,
    }],
    maxTokens: 400,
    facilityId,
    agentName: 'sentinel',
    callType: 'situation_report',
  });

  return narrative;
}

// ── IMESSAGE HELPER ───────────────────────────────────────────

// TODO: Ivan — wire to LinqApp or equivalent iMessage delivery mechanism
// This is a placeholder that logs to console
async function sendIMessage(params: {
  facilityId: string;
  targetRoles: string[];
  message: string;
}): Promise<void> {
  console.log(`[Sentinel iMessage] → ${params.targetRoles.join(', ')}: ${params.message}`);
}

// ── ALERT DELIVERY ────────────────────────────────────────────

export async function deliverSentinelAlerts(facilityId: string, findings: SentinelFinding[]): Promise<void> {
  for (const finding of findings) {
    // In production: write to queue_items table + send iMessage
    // For now: log
    console.log(`[Sentinel Alert] ${finding.severity} | ${finding.title}`);

    if (finding.severity === 'immediate' && finding.notify_via !== 'in_app') {
      await sendIMessage({
        facilityId,
        targetRoles: finding.notify_roles,
        message: `CHRIS Sentinel: ${finding.title}. ${finding.action_required} [Open CHRIS →]`,
      });
    }
  }
}
