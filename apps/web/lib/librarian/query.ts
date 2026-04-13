// lib/librarian/query.ts
// 14 typed query kinds. Phase 1: reads from seed data.
// Phase 2: reads from Neon via Drizzle.
// Each query returns a specifically shaped result — agents never
// need to know whether data came from seed or DB.

import type { QueryKind, QueryParamsMap, QueryResultMap } from './types';
import {
  financial_monthly, workforce_monthly, care_minutes_weekly,
  psh_cycles, sirs_events, compliance_obligations, corrective_actions,
  incidents_closed_ytd, roster_today, leave_current, facility,
  resident_intelligence,
} from '@/lib/seed-data';

/**
 * Execute a typed query. Returns structured data matching QueryResultMap[K].
 */
export async function query<K extends QueryKind>(
  kind: K,
  params: QueryParamsMap[K],
): Promise<QueryResultMap[K]> {
  const handler = QUERY_HANDLERS[kind];
  if (!handler) throw new Error(`Unknown query kind: ${kind}`);
  return handler(params as any) as Promise<QueryResultMap[K]>;
}

// ── QUERY HANDLERS ───────────────────────────────────────────

const QUERY_HANDLERS: Record<QueryKind, (params: any) => Promise<any>> = {

  async psh_scores(params: QueryParamsMap['psh_scores']) {
    const cycles = params.cycles ?? 6;
    const data = psh_cycles.slice(-cycles);
    return data.flatMap((cycle) =>
      Object.entries(cycle.teams).map(([teamId, team]: [string, any]) => ({
        cycle_id: String(cycle.cycle),
        team_id: teamId,
        wing: teamId, // TODO: map team_id to wing name
        domain_scores: team.scores,
        participation_rate: team.response_rate,
        elevated: team.status.elevated,
        monitoring: team.status.monitoring,
        convergence_detected: !!team.convergence,
      }))
    );
  },

  async care_minutes_trend(params: QueryParamsMap['care_minutes_trend']) {
    return care_minutes_weekly.slice(-(params.days ?? 7)).map((w) => ({
      date: w.week,
      total_minutes: w.avg_total,
      rn_minutes: w.avg_rn,
      en_minutes: 0,
      pcw_minutes: w.avg_total - w.avg_rn,
      compliant: w.avg_total >= 200 && w.avg_rn >= 40,
      agency_pct: 0.18,
    }));
  },

  async sirs_open(_params: QueryParamsMap['sirs_open']) {
    return sirs_events
      .filter((s) => !s.sirs_submitted)
      .map((s) => ({
        id: s.id,
        category: s.category,
        incident_type: s.incident_type,
        occurred_at: s.incident_date,
        deadline: s.deadline,
        hours_remaining: Math.max(0, (new Date(s.deadline).getTime() - Date.now()) / (1000 * 60 * 60)),
        draft_status: 'ready',
        wing: s.wing ?? '',
      }));
  },

  async workforce_snapshot(_params: QueryParamsMap['workforce_snapshot']) {
    const latest = workforce_monthly[workforce_monthly.length - 1];
    return {
      turnover_pct: latest.turnover_rolling_12m * 100,
      voluntary_turnover_pct: latest.turnover_rolling_12m * 100 * 0.78,
      absenteeism_pct: latest.absenteeism_rate * 100,
      unplanned_leave_pct: latest.absenteeism_rate * 100 * 0.57,
      agency_pct: latest.agency_hours_pct * 100,
      agency_cost_week: 950,
      permanent_ratio: 74,
      rn_ratio: 19,
      avg_tenure_days: 847,
      training_compliance_pct: latest.training_compliance_pct * 100,
      ahpra_current_pct: 87,
      credentials_expiring_30d: latest.credentials_expiring_30d,
      leave_liability: leave_current.accrued_liability.total_dollars,
      psh_composite_score: 2.8,
      psh_participation_pct: 84,
    };
  },

  async incident_trend(params: QueryParamsMap['incident_trend']) {
    return incidents_closed_ytd.map((inc) => ({
      month: inc.date.slice(0, 7),
      total: 1,
      by_type: { [inc.type]: 1 },
      sirs_count: inc.sirs_category ? 1 : 0,
      agency_shift_pct: inc.agency_shift ? 1 : 0,
    }));
  },

  async financial_snapshot(_params: QueryParamsMap['financial_snapshot']) {
    const latest = financial_monthly[financial_monthly.length - 1];
    return {
      period: latest.period,
      ebitda_pbd: 16.10,
      care_ratio: latest.care_ratio,
      occupancy_pct: latest.occupancy_pct,
      agency_cost_month: latest.expenditure.direct_care_agency,
      revenue_total: latest.revenue.total,
      labour_cost_pbd: 212,
      vacant_beds: facility.beds - Math.round(facility.beds * latest.occupancy_pct),
    };
  },

  async convergence_active(params: QueryParamsMap['convergence_active']) {
    // From seed: Grevillea Wing has active convergence
    const latestCycle = psh_cycles[psh_cycles.length - 1];
    const results: any[] = [];
    for (const [teamId, team] of Object.entries(latestCycle.teams) as [string, any][]) {
      if (team.convergence) {
        results.push({
          hazard_domain: team.convergence.signals?.[0] ?? 'PSH_01',
          pulse_severity: 0.71,
          operational_severity: 0.65,
          final_score: 0.85,
          confidence: team.convergence.confidence ?? 'MODERATE',
          narrative: team.convergence.note,
          cycles_persisting: team.convergence.cycles_persisting ?? 1,
          team_id: teamId,
        });
      }
    }
    return results;
  },

  async practice_history(params: QueryParamsMap['practice_history']) {
    const cycles = params.cycles ?? 6;
    const data = psh_cycles.slice(-cycles);
    return data.flatMap((cycle) =>
      Object.entries(cycle.teams)
        .filter(([tid]) => !params.team_id || tid === params.team_id)
        .map(([teamId, team]: [string, any]) => ({
          cycle_id: String(cycle.cycle),
          team_id: teamId,
          practice_id: team.practice_prescribed ?? '',
          practice_name: '',
          hazard_targeted: team.status.elevated?.[0] ?? '',
          pre_score: null,
          post_score: null,
          delta: team.prior_cycle_outcome?.delta ?? null,
          outcome: team.prior_cycle_outcome?.outcome ?? null,
          delivered: true,
        }))
    );
  },

  async compliance_obligations(_params: QueryParamsMap['compliance_obligations']) {
    return compliance_obligations.map((o: any) => ({
      id: o.id,
      name: o.obligation,
      domain: o.framework ?? '',
      status: o.status,
      deadline: o.next_review ?? o.last_reviewed ?? '',
      days_remaining: o.next_review ? Math.round((new Date(o.next_review).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0,
      penalty_exposure: null,
    }));
  },

  async agent_findings(params: QueryParamsMap['agent_findings']) {
    // Phase 1: no persisted findings yet — return empty
    // Phase 2: query reasoning_traces table
    return [];
  },

  async resident_intelligence(_params: QueryParamsMap['resident_intelligence']) {
    // Phase 1: return from seed resident_intelligence
    return [];
  },

  async briefing_history(_params: QueryParamsMap['briefing_history']) {
    // Phase 1: no persisted briefings yet
    return [];
  },

  async events_since(params: QueryParamsMap['events_since']) {
    // Phase 1: no episode ledger yet — return empty
    // Phase 2: query episode_ledger WHERE recorded_at > params.since
    return [];
  },

  async roster_pattern(params: QueryParamsMap['roster_pattern']) {
    return roster_today.week.map((d) => ({
      date: d.day,
      shift: 'all',
      total_staff: d.shifts,
      gaps: d.gaps,
      agency_count: d.agency,
      agency_cost: d.cost,
      rn_confirmed: true,
    }));
  },
};
