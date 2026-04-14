// lib/simulation/world.ts
// SimWorld — mutable facility state for a simulation run.
// Events mutate the world. Agents read from it.
// Each tick, the world can change, and agents react.

import type { ScenarioWorld, ScenarioEvent, SimRosterShift, SimSIRSItem, SimComplianceItem, SimConnector } from './types';

export class SimWorld {
  facility: ScenarioWorld['facility'];
  roster: SimRosterShift[];
  care_minutes: ScenarioWorld['care_minutes'];
  psh_scores: Record<string, Record<string, number>>;
  sirs_open: SimSIRSItem[];
  compliance: SimComplianceItem[];
  workforce: ScenarioWorld['workforce'];
  financial: ScenarioWorld['financial'];
  connectors: SimConnector[];

  // Event log — every mutation recorded
  eventLog: Array<{ tick: number; event: ScenarioEvent }> = [];

  constructor(initial: ScenarioWorld) {
    this.facility = { ...initial.facility };
    this.roster = initial.roster.map((s) => ({ ...s }));
    this.care_minutes = { ...initial.care_minutes };
    this.psh_scores = JSON.parse(JSON.stringify(initial.psh_scores));
    this.sirs_open = initial.sirs_open.map((s) => ({ ...s }));
    this.compliance = initial.compliance.map((c) => ({ ...c }));
    this.workforce = { ...initial.workforce };
    this.financial = { ...initial.financial };
    this.connectors = initial.connectors.map((c) => ({ ...c }));
  }

  /**
   * Apply a scenario event — mutates world state.
   */
  apply(event: ScenarioEvent, tick: number): void {
    this.eventLog.push({ tick, event });
    const { type, payload } = event;

    switch (type) {
      case 'roster_update':
        this.applyRosterUpdate(payload);
        break;
      case 'care_minutes_update':
        if (payload.projected_total != null) this.care_minutes.projected_total = payload.projected_total as number;
        if (payload.rn_minutes != null) this.care_minutes.rn_minutes = payload.rn_minutes as number;
        this.care_minutes.compliant = this.care_minutes.projected_total >= 215 && this.care_minutes.rn_minutes >= 44;
        break;
      case 'sirs_event':
        if (payload.action === 'add') {
          this.sirs_open.push(payload.item as SimSIRSItem);
        } else if (payload.action === 'update') {
          const idx = this.sirs_open.findIndex((s) => s.id === payload.id);
          if (idx >= 0) Object.assign(this.sirs_open[idx], payload.updates);
        }
        break;
      case 'psh_update':
        const teamId = payload.team_id as string;
        if (!this.psh_scores[teamId]) this.psh_scores[teamId] = {};
        Object.assign(this.psh_scores[teamId], payload.scores);
        break;
      case 'compliance_update':
        const compIdx = this.compliance.findIndex((c) => c.id === payload.id);
        if (compIdx >= 0) Object.assign(this.compliance[compIdx], payload.updates);
        break;
      case 'connector_update':
        const connIdx = this.connectors.findIndex((c) => c.name === payload.name);
        if (connIdx >= 0) Object.assign(this.connectors[connIdx], payload.updates);
        break;
      case 'workforce_update':
        Object.assign(this.workforce, payload);
        break;
      case 'financial_update':
        Object.assign(this.financial, payload);
        break;
      case 'incident_logged':
      case 'complaint_logged':
        // These create events that agents process — no world state change needed
        break;
    }
  }

  private applyRosterUpdate(payload: Record<string, unknown>): void {
    const shift = payload.shift as string;
    const idx = this.roster.findIndex((r) => r.shift === shift);
    if (idx >= 0) {
      Object.assign(this.roster[idx], payload.updates);
    }
    // Recalculate care minutes based on roster
    if (payload.care_minutes_impact) {
      this.care_minutes.projected_total += payload.care_minutes_impact as number;
      if (payload.rn_impact) this.care_minutes.rn_minutes += payload.rn_impact as number;
      this.care_minutes.compliant = this.care_minutes.projected_total >= 215 && this.care_minutes.rn_minutes >= 44;
    }
  }

  /**
   * Advance SIRS deadlines by one tick (30 min).
   */
  tickTime(): void {
    for (const sirs of this.sirs_open) {
      sirs.hours_remaining = Math.max(0, sirs.hours_remaining - 0.5);
    }
    for (const comp of this.compliance) {
      // Advance time — each tick is 30 min = 0.021 days
      comp.days_remaining = Math.max(0, comp.days_remaining - 0.021);
    }
    for (const conn of this.connectors) {
      conn.last_sync_hours_ago += 0.5;
      conn.status = conn.last_sync_hours_ago > 12 ? 'stale' : conn.last_sync_hours_ago > 24 ? 'error' : 'healthy';
    }
  }
}
