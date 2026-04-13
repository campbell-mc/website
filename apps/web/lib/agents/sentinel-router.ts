// lib/agents/sentinel-router.ts
// Maintained by Ivan Sanchez
//
// The Sentinel Router is the central nervous system of CHRIS.
// Every data change from every connector passes through here.
// It evaluates whether the change is meaningful enough to:
//   A) Trigger an agent cycle (Claude API call)
//   B) Publish an event to the event bus
//   C) Update the data layer only (no API cost)
//
// This keeps API costs predictable while making the platform
// feel alive — data moves in real time, intelligence moves deliberately.

import { runSentinel } from '@/lib/agents/sentinel';
import { publishEvent } from '@/lib/agents/town-crier';
import { generateConvergenceInsights } from '@/lib/chris/convergence';
import { callClaudeText } from '@/lib/anthropic/client';
import AGED_CARE_KNOWLEDGE from '@/lib/chris/aged-care-knowledge';

// ── DATA TYPES ────────────────────────────────────────────────

export type ConnectorDataType =
  | 'roster_update' | 'incident_logged' | 'care_plan_updated'
  | 'care_minutes_updated' | 'sirs_event_created' | 'psh_response_submitted'
  | 'financial_updated' | 'credential_updated' | 'training_updated'
  | 'complaint_logged' | 'corrective_action_updated' | 'audit_completed'
  | 'admission_discharge' | 'connector_health_changed';

export interface ConnectorDataEvent {
  facility_id: string;
  data_type: ConnectorDataType;
  source_system: string;
  payload: Record<string, unknown>;
  received_at: Date;
  connector_pull_id: string;
}

export interface ThresholdEvaluation {
  threshold_crossed: boolean;
  severity: 'immediate' | 'urgent' | 'routine' | 'none';
  event_type?: string;
  trigger_agent_cycle: boolean;
  trigger_narrative_refresh: boolean;
  reason?: string;
}

// ── MAIN ROUTER ───────────────────────────────────────────────

export async function routeConnectorData(event: ConnectorDataEvent): Promise<ThresholdEvaluation> {
  const { facility_id, data_type, payload } = event;

  // TODO: Ivan — log connector pull to connector_pull_log table

  // Evaluate thresholds
  const evaluation = evaluateThresholds(event);

  // TODO: Ivan — update canonical data layer (Neon write)

  if (evaluation.threshold_crossed) {
    // Publish event to Town Crier
    if (evaluation.event_type) {
      await publishEvent({
        source_agent: 'sentinel',
        event_type: evaluation.event_type as Parameters<typeof publishEvent>[0]['event_type'],
        facility_id,
        priority: evaluation.severity === 'immediate' ? 'safety'
          : evaluation.severity === 'urgent' ? 'compliance'
          : 'operational',
        payload: { ...payload, threshold_evaluation: evaluation, routed_at: new Date().toISOString() },
      });
    }

    // Run full Sentinel analysis if warranted
    if (evaluation.trigger_agent_cycle) {
      await runSentinel(facility_id, 'residential', {
        careMinutesToday: payload.projected_total_minutes ? {
          projected_total_minutes: payload.projected_total_minutes as number,
          rn_minutes_tonight: payload.rn_minutes_tonight as number,
        } : undefined,
      });
    }

    // Refresh domain Situation Report
    if (evaluation.trigger_narrative_refresh) {
      const domain = getDomainForDataType(data_type);
      if (domain) {
        await refreshSituationReport(facility_id, domain, 'threshold_crossing');
      }
    }
  }

  return evaluation;
}

// ── THRESHOLD EVALUATION ──────────────────────────────────────

function evaluateThresholds(event: ConnectorDataEvent): ThresholdEvaluation {
  const { data_type, payload } = event;

  switch (data_type) {
    case 'roster_update':
    case 'care_minutes_updated': {
      const projected = payload.projected_total_minutes as number;
      const projectedRN = payload.rn_minutes_tonight as number;
      const target = AGED_CARE_KNOWLEDGE.care_minutes.total_minutes_per_resident_day;
      const rnTarget = AGED_CARE_KNOWLEDGE.care_minutes.rn_minutes_per_resident_day;
      const critical = AGED_CARE_KNOWLEDGE.care_minutes.chris_critical_threshold_pct;
      const alert = AGED_CARE_KNOWLEDGE.care_minutes.chris_alert_threshold_pct;

      if (projectedRN != null && projectedRN < rnTarget * critical) {
        return { threshold_crossed: true, severity: 'immediate', event_type: 'sentinel.rn_gap_tonight', trigger_agent_cycle: true, trigger_narrative_refresh: true, reason: `RN minutes ${projectedRN} below critical threshold` };
      }
      if (projected != null && projected < target * critical) {
        return { threshold_crossed: true, severity: 'immediate', event_type: 'sentinel.care_minutes_at_risk', trigger_agent_cycle: true, trigger_narrative_refresh: true, reason: `Care minutes ${projected} below critical threshold` };
      }
      if (projected != null && projected < target * alert) {
        return { threshold_crossed: true, severity: 'urgent', event_type: 'sentinel.care_minutes_at_risk', trigger_agent_cycle: false, trigger_narrative_refresh: true, reason: `Care minutes ${projected} below alert threshold` };
      }
      return noThreshold();
    }

    case 'sirs_event_created':
    case 'incident_logged': {
      const category = payload.category as number;
      return {
        threshold_crossed: true,
        severity: category === 1 ? 'immediate' : 'urgent',
        event_type: category === 1 ? 'sentinel.sirs_deadline_approaching' : 'sentinel.sirs_deadline_approaching',
        trigger_agent_cycle: true,
        trigger_narrative_refresh: true,
        reason: `SIRS Cat ${category} logged: ${payload.incident_type}`,
      };
    }

    case 'psh_response_submitted': {
      const scores = payload.updated_scores as Record<string, number> | undefined;
      if (!scores) return noThreshold();

      const elevated = AGED_CARE_KNOWLEDGE.psh.thresholds.elevated;
      const elevatedDomains = Object.entries(scores).filter(([, s]) => s >= elevated).map(([d]) => d);
      const wcRisk = ['PSH_08', 'PSH_10'].every((d) => elevatedDomains.includes(d));

      if (wcRisk) {
        return { threshold_crossed: true, severity: 'urgent', event_type: 'sentinel.psh_wc_risk', trigger_agent_cycle: true, trigger_narrative_refresh: true, reason: 'PSH_08 + PSH_10 both elevated — WC risk' };
      }
      if (elevatedDomains.length >= AGED_CARE_KNOWLEDGE.psh.convergence.domains_required) {
        return { threshold_crossed: true, severity: 'urgent', event_type: 'sentinel.psh_convergence', trigger_agent_cycle: false, trigger_narrative_refresh: true, reason: `${elevatedDomains.length} PSH domains elevated` };
      }
      return noThreshold();
    }

    case 'admission_discharge':
      return { threshold_crossed: true, severity: 'routine', event_type: 'sentinel.care_minutes_at_risk', trigger_agent_cycle: false, trigger_narrative_refresh: true, reason: 'Occupancy changed' };

    case 'connector_health_changed': {
      const hours = payload.hours_stale as number;
      if (hours > 4) {
        return { threshold_crossed: true, severity: hours > 12 ? 'urgent' : 'routine', event_type: 'sentinel.care_minutes_at_risk', trigger_agent_cycle: false, trigger_narrative_refresh: true, reason: `${payload.system_name} data ${hours}h stale` };
      }
      return noThreshold();
    }

    default:
      return noThreshold();
  }
}

function noThreshold(): ThresholdEvaluation {
  return { threshold_crossed: false, severity: 'none', trigger_agent_cycle: false, trigger_narrative_refresh: false };
}

// ── SITUATION REPORT REFRESH ──────────────────────────────────

export async function refreshSituationReport(
  facilityId: string,
  domain: string,
  trigger: 'threshold_crossing' | 'scheduled' | 'manual'
): Promise<string> {

  const systemPrompt = `You are CHRIS — the operational intelligence system for Australian aged care. You generate domain situation reports. Write 3-4 sentences maximum. Direct and specific. Name metrics, wings, deadlines, dollar amounts. No bullet points. No preamble. Lead with deterministic metrics (compliance, deadlines, counts). Where convergence is detected — two independent signal streams agreeing on the same cause — add one sentence explaining the "why" behind the metric. End with one clear recommended action.`;

  const narrative = await callClaudeText({
    system: systemPrompt,
    messages: [{ role: 'user', content: `Generate the ${domain} situation report. Trigger: ${trigger}. Time: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}` }],
    maxTokens: 400,
    facilityId,
    agentName: 'sentinel',
    callType: 'situation_report',
  });

  // TODO: Ivan — write to situation_reports table
  // TODO: Ivan — broadcast via Neon NOTIFY for real-time UI update

  console.log(`[SitRep] ${domain} | ${facilityId} | ${trigger} | ${narrative.length} chars`);
  return narrative;
}

// ── HELPERS ───────────────────────────────────────────────────

function getDomainForDataType(dataType: ConnectorDataType): string | null {
  const map: Partial<Record<ConnectorDataType, string>> = {
    roster_update: 'clinical', care_minutes_updated: 'clinical',
    incident_logged: 'clinical', sirs_event_created: 'clinical',
    care_plan_updated: 'clinical', psh_response_submitted: 'workforce',
    financial_updated: 'financial', credential_updated: 'workforce',
    training_updated: 'workforce', complaint_logged: 'residents',
    corrective_action_updated: 'governance', audit_completed: 'governance',
    admission_discharge: 'residents',
  };
  return map[dataType] || null;
}
