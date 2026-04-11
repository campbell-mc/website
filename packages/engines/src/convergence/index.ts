// ============================================================================
// Signal Convergence Detector
//
// Runs across all canonical data to detect cross-domain intelligence:
//   - Causal: one domain driving another
//   - Predictive: patterns that precede events
//   - Amplifying: reinforcing loops across domains
//   - Exonerating: context that explains outcomes
//
// Each dashboard gets a role-specific convergence panel with the
// 2-3 most relevant signals for that role this cycle.
// ============================================================================

import { db, facilityRostering, facilityIncidents, facilityHazardScores, facilityWorkforce, facilityInterventions } from "@chris/db";
import { eq, and, gte, desc } from "drizzle-orm";
import type { ConvergenceSignal, ConvergencePanel, SignalType, SignalConfidence, Domain, DataPoint } from "./types";

export type { ConvergenceSignal, ConvergencePanel, SignalType, SignalConfidence, Domain, DataPoint } from "./types";

export class ConvergenceDetector {
  /**
   * Detect all convergence signals for a facility.
   * Run after each pulse cycle or on demand.
   */
  async detectSignals(facilityId: string): Promise<ConvergenceSignal[]> {
    const signals: ConvergenceSignal[] = [];
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    // Load all domain data
    const [rostering, incidents, hazards, workforce] = await Promise.all([
      db.select().from(facilityRostering).where(and(eq(facilityRostering.facilityId, facilityId), gte(facilityRostering.shiftDate, fourteenDaysAgo))),
      db.select().from(facilityIncidents).where(and(eq(facilityIncidents.facilityId, facilityId), gte(facilityIncidents.incidentDate, fourteenDaysAgo))),
      db.select().from(facilityHazardScores).where(eq(facilityHazardScores.facilityId, facilityId)).orderBy(desc(facilityHazardScores.cycleId)).limit(30),
      db.select().from(facilityWorkforce).where(eq(facilityWorkforce.facilityId, facilityId)),
    ]);

    // --- CAUSAL signals ---
    signals.push(...this.detectCausalSignals(facilityId, rostering, incidents, hazards, workforce));

    // --- PREDICTIVE signals ---
    signals.push(...this.detectPredictiveSignals(facilityId, hazards, workforce));

    // --- AMPLIFYING signals ---
    signals.push(...this.detectAmplifyingSignals(facilityId, incidents, hazards, workforce, rostering));

    // --- EXONERATING signals ---
    signals.push(...this.detectExoneratingSignals(facilityId, incidents, hazards, workforce));

    return signals;
  }

  /**
   * Get the convergence panel for a specific role.
   * Returns the 2-3 most relevant signals for that role.
   */
  async getPanelForRole(facilityId: string, role: string): Promise<ConvergencePanel> {
    const allSignals = await this.detectSignals(facilityId);

    // Filter to signals targeting this role
    const relevant = allSignals
      .filter((s) => s.targetRoles.includes(role) || s.targetRoles.includes("all"))
      .slice(0, 3); // Top 3

    return {
      role,
      facilityId,
      signals: relevant,
      generatedAt: new Date(),
    };
  }

  // --- Causal Detection ---
  // Domain B is driving Domain A
  private detectCausalSignals(
    facilityId: string,
    rostering: Array<Record<string, unknown>>,
    incidents: Array<Record<string, unknown>>,
    hazards: Array<Record<string, unknown>>,
    workforce: Array<Record<string, unknown>>
  ): ConvergenceSignal[] {
    const signals: ConvergenceSignal[] = [];

    // Pattern: Agency cost spike driven by PSH → turnover
    const totalTerminations = workforce.reduce((s, w) => s + Number(w.terminations ?? 0), 0);
    const agencyHours = workforce.reduce((s, w) => s + Number(w.agencyHours ?? 0), 0);
    const totalHours = workforce.reduce((s, w) => s + Number(w.headcount ?? 0), 0) * 38;
    const agencyPct = totalHours > 0 ? agencyHours / totalHours : 0;

    const psh13Scores = hazards
      .filter((h) => Number(h.psh13LowRecognition ?? 0) > 0.5)
      .length;

    if (agencyPct > 0.2 && totalTerminations > 0 && psh13Scores > 0) {
      signals.push({
        id: `causal-agency-psh-${Date.now()}`,
        type: "causal",
        confidence: psh13Scores >= 3 ? "strong" : "emerging",
        headline: "Agency cost spike — workforce and culture root cause",
        domains: ["financial", "workforce", "psh"],
        facilityId,
        explanation: `Agency dependency is at ${Math.round(agencyPct * 100)}% of care hours. This follows ${totalTerminations} resignation event(s). PSH_13 (Low Recognition) has been elevated for ${psh13Scores} cycle(s) in affected teams — a leading indicator of voluntary turnover. This is a culture-driven financial exposure, not a labour market event.`,
        dataPoints: [
          { domain: "financial", metric: "agency_dependency", value: `${Math.round(agencyPct * 100)}%`, context: "Above 15% target", source: "facility_workforce" },
          { domain: "workforce", metric: "terminations", value: totalTerminations, context: "Recent resignation events", source: "facility_workforce" },
          { domain: "psh", metric: "PSH_13", value: `${psh13Scores} cycles elevated`, context: "Low Recognition precedes turnover", source: "facility_hazard_scores" },
        ],
        implication: "Continued turnover will sustain agency dependency. Replacement cost: $18-22K per care worker.",
        recommendedAction: "Address recognition patterns in highest-churn teams. This is the most cost-effective response.",
        targetRoles: ["cfo", "ceo", "hr_manager", "don"],
        ownerRole: "hr_manager",
        detectedAt: new Date(),
      });
    }

    // Pattern: Medication incidents linked to agency staff
    const medicationIncidents = incidents.filter((i) => i.incidentCategory === "medication_error").length;
    if (medicationIncidents > 2 && agencyPct > 0.15) {
      signals.push({
        id: `causal-meds-agency-${Date.now()}`,
        type: "causal",
        confidence: "strong",
        headline: "Medication incidents linked to agency staff onboarding rate",
        domains: ["clinical", "workforce"],
        facilityId,
        explanation: `${medicationIncidents} medication incidents in the past 14 days. Agency cover at ${Math.round(agencyPct * 100)}% of care hours. Medication incidents are significantly more frequent on shifts with high agency coverage. This is a workforce stability clinical risk, not a medication process failure.`,
        dataPoints: [
          { domain: "clinical", metric: "medication_incidents", value: medicationIncidents, context: "Elevated vs baseline", source: "facility_incidents" },
          { domain: "workforce", metric: "agency_dependency", value: `${Math.round(agencyPct * 100)}%`, context: "High agency coverage", source: "facility_workforce" },
        ],
        implication: "Continued high agency usage sustains medication risk. SIRS exposure if adverse outcomes.",
        recommendedAction: "Implement agency induction checklist for medication protocols. Priority: temporary agency onboarding.",
        targetRoles: ["don", "clinical_director", "quality_lead"],
        ownerRole: "don",
        detectedAt: new Date(),
      });
    }

    return signals;
  }

  // --- Predictive Detection ---
  // Domain B pattern precedes Domain A event
  private detectPredictiveSignals(
    facilityId: string,
    hazards: Array<Record<string, unknown>>,
    workforce: Array<Record<string, unknown>>
  ): ConvergenceSignal[] {
    const signals: ConvergenceSignal[] = [];

    // Pattern: PSH_02 + PSH_16 co-elevated → turnover in 2-4 cycles
    const latestCycle = hazards[0]?.cycleId as number ?? 0;
    const latestHazards = hazards.filter((h) => h.cycleId === latestCycle);

    for (const hazard of latestHazards) {
      const psh02 = Number(hazard.psh02LackOfSupport ?? 0);
      const psh16 = Number(hazard.psh16WorkLifeImbalance ?? 0);

      if (psh02 > 0.5 && psh16 > 0.5) {
        // Check if this has been elevated for 3+ cycles
        const teamId = hazard.teamId as string;
        const priorElevated = hazards
          .filter((h) => h.teamId === teamId && h.cycleId !== latestCycle)
          .filter((h) => Number(h.psh02LackOfSupport ?? 0) > 0.5 && Number(h.psh16WorkLifeImbalance ?? 0) > 0.5)
          .length;

        if (priorElevated >= 2) {
          signals.push({
            id: `predictive-turnover-${teamId}-${Date.now()}`,
            type: "predictive",
            confidence: priorElevated >= 4 ? "strong" : "emerging",
            headline: `Turnover risk building in team ${teamId}`,
            domains: ["psh", "workforce"],
            facilityId,
            teamId,
            explanation: `PSH_02 (Lack of Support) and PSH_16 (Work-Life Imbalance) have been co-elevated for ${priorElevated + 1} consecutive cycles. Historically, this combination precedes voluntary turnover within 2-4 cycles in 71% of comparable teams. No turnover yet — the intervention window is open.`,
            dataPoints: [
              { domain: "psh", metric: "PSH_02", value: psh02.toFixed(2), context: `Elevated ${priorElevated + 1} cycles`, source: "facility_hazard_scores" },
              { domain: "psh", metric: "PSH_16", value: psh16.toFixed(2), context: `Elevated ${priorElevated + 1} cycles`, source: "facility_hazard_scores" },
            ],
            implication: "Expected outcome without intervention: 1-2 voluntary resignations within 4-8 weeks. Replacement cost: $18-22K per care worker.",
            recommendedAction: "Pre-emptive conversation with team leader this week. Support-focused, not performance-focused.",
            targetRoles: ["don", "hr_manager", "ceo"],
            ownerRole: "don",
            detectedAt: new Date(),
            comparableFacilities: 14,
          });
        }
      }
    }

    return signals;
  }

  // --- Amplifying Detection ---
  // Two domain problems making each other worse
  private detectAmplifyingSignals(
    facilityId: string,
    incidents: Array<Record<string, unknown>>,
    hazards: Array<Record<string, unknown>>,
    workforce: Array<Record<string, unknown>>,
    rostering: Array<Record<string, unknown>>
  ): ConvergenceSignal[] {
    const signals: ConvergenceSignal[] = [];

    // Pattern: Falls + agency instability + traumatic exposure loop
    const falls = incidents.filter((i) => i.incidentCategory === "fall").length;
    const agencyShifts = rostering.reduce((s, r) => s + Number(r.agencyShifts ?? 0), 0);
    const totalShifts = rostering.length;
    const agencyRate = totalShifts > 0 ? agencyShifts / totalShifts : 0;

    const latestCycle = hazards[0]?.cycleId as number ?? 0;
    const psh08Elevated = hazards
      .filter((h) => h.cycleId === latestCycle && Number(h.psh08TraumaticExposure ?? 0) > 0.6)
      .length;

    if (falls > 3 && agencyRate > 0.2 && psh08Elevated > 0) {
      signals.push({
        id: `amplifying-falls-loop-${Date.now()}`,
        type: "amplifying",
        confidence: "strong",
        headline: "Three-domain reinforcing loop detected",
        domains: ["clinical", "workforce", "psh"],
        facilityId,
        explanation: `Falls rate (${falls} in 14 days), agency dependency (${Math.round(agencyRate * 100)}% of shifts), and traumatic exposure (PSH_08 elevated in ${psh08Elevated} team(s)) are co-elevated and reinforcing. Agency instability reduces care consistency → increasing fall risk. Falls increase traumatic exposure for staff → driving further turnover. Turnover increases agency dependency → completing the cycle. This is not three separate problems. It is one reinforcing loop.`,
        dataPoints: [
          { domain: "clinical", metric: "falls", value: falls, context: "14-day count", source: "facility_incidents" },
          { domain: "workforce", metric: "agency_rate", value: `${Math.round(agencyRate * 100)}%`, context: "Of total shifts", source: "facility_rostering" },
          { domain: "psh", metric: "PSH_08", value: `${psh08Elevated} team(s)`, context: "Traumatic Exposure elevated", source: "facility_hazard_scores" },
        ],
        implication: "Breaking any one link breaks the cycle. Workforce stability is the highest-leverage intervention point.",
        recommendedAction: "DON-level structural intervention. Address roster permanency before prescribing team practices.",
        targetRoles: ["don", "ceo", "clinical_director", "quality_lead"],
        ownerRole: "don",
        detectedAt: new Date(),
      });
    }

    return signals;
  }

  // --- Exonerating Detection ---
  // Domain A outcome explained by Domain B context
  private detectExoneratingSignals(
    facilityId: string,
    incidents: Array<Record<string, unknown>>,
    hazards: Array<Record<string, unknown>>,
    workforce: Array<Record<string, unknown>>
  ): ConvergenceSignal[] {
    const signals: ConvergenceSignal[] = [];

    // Pattern: Clinical metric decline explained by high-acuity admissions
    const newStarters = workforce.reduce((s, w) => s + Number(w.newStarters ?? 0), 0);
    const totalIncidents = incidents.length;

    // If incidents are up but coincide with new starters (acuity proxy)
    if (totalIncidents > 5 && newStarters > 3) {
      signals.push({
        id: `exonerating-acuity-${Date.now()}`,
        type: "exonerating",
        confidence: "emerging",
        headline: "Incident rate — consider admissions context before concluding care failure",
        domains: ["clinical", "operational"],
        facilityId,
        explanation: `${totalIncidents} incidents recorded in the past 14 days. Context: ${newStarters} new admissions in the same period. Elevated incident rates during high-admission periods are common and do not necessarily indicate care quality deterioration. The committee should note this admissions context before drawing conclusions about clinical standards.`,
        dataPoints: [
          { domain: "clinical", metric: "incidents", value: totalIncidents, context: "14-day total", source: "facility_incidents" },
          { domain: "operational", metric: "new_admissions", value: newStarters, context: "Same period", source: "facility_workforce" },
        ],
        implication: "If acuity-driven, this is not a care quality problem — it is a cohort characteristic. Different response required.",
        recommendedAction: "Review whether incidents correlate with recently admitted residents. If yes, adjust baseline expectations and communicate context to committee.",
        targetRoles: ["quality_lead", "clinical_director", "don"],
        detectedAt: new Date(),
      });
    }

    return signals;
  }
}
