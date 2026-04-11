// ============================================================================
// Pulse Engine
//
// Processes fortnightly staff pulse survey responses into PSH hazard scores.
// Detects convergence with operational data (rostering, incidents, workforce).
// Writes scored results to facility_hazard_scores canonical table.
//
// Runs every second Sunday at 20:00 AEST after pulse close.
// ============================================================================

import { db, facilityHazardScores, facilityRostering, facilityWorkforce, facilityIncidents, facilities } from "@chris/db";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import {
  PULSE_DOMAINS,
  PSH_DOMAINS,
  classifyHazardScore,
  calculateTrajectory,
  type HazardClassification,
  type Trajectory,
} from "./domains";

export { PULSE_DOMAINS, PSH_DOMAINS, classifyHazardScore, calculateTrajectory } from "./domains";
export type { HazardClassification, Trajectory, PulseDomain } from "./domains";

// --- Types ---

export interface PulseResponse {
  teamId: string;
  domainId: string; // e.g., "engagement", "psychological_safety"
  score: number;    // 1-5 scale from respondent
}

export interface HazardFlag {
  teamId: string;
  pshCode: string;
  pshName: string;
  score: number;           // 0.0–1.0
  classification: HazardClassification;
  trajectory: Trajectory;
  consecutiveCycles: number;
  evidenceChain: string[];
}

export interface ConvergenceResult {
  hazardFlag: HazardFlag;
  corroboratingSignals: Array<{
    source: string;      // "rostering" | "hr" | "whs" | "clinical"
    confidence: string;  // "HIGH" | "MEDIUM" | "LOW"
    detail: string;
  }>;
  overallConfidence: "HIGH" | "MEDIUM" | "LOW";
  recommendedAction: "escalate" | "prescribe_practice" | "monitor";
}

export interface PulseCycleResult {
  facilityId: string;
  cycleId: number;
  cycleStart: string;
  cycleEnd: string;
  teamsProcessed: number;
  hazardFlags: HazardFlag[];
  convergenceResults: ConvergenceResult[];
  participationRate: number;
}

// --- Engine ---

export class PulseEngine {
  /**
   * Process a complete pulse cycle for a facility.
   * Called after pulse survey closes (Sunday 20:00).
   */
  async processCycle(
    facilityId: string,
    cycleId: number,
    cycleStart: string,
    cycleEnd: string,
    responses: PulseResponse[],
    eligibleByTeam: Map<string, number>
  ): Promise<PulseCycleResult> {
    // Group responses by team
    const responsesByTeam = new Map<string, PulseResponse[]>();
    for (const r of responses) {
      if (!responsesByTeam.has(r.teamId)) responsesByTeam.set(r.teamId, []);
      responsesByTeam.get(r.teamId)!.push(r);
    }

    const allHazardFlags: HazardFlag[] = [];
    const allConvergence: ConvergenceResult[] = [];
    let totalEligible = 0;
    let totalResponded = 0;

    for (const [teamId, teamResponses] of responsesByTeam) {
      const eligible = eligibleByTeam.get(teamId) ?? teamResponses.length;
      totalEligible += eligible;
      const respondentCount = new Set(teamResponses.map((r) => `${r.teamId}-${r.domainId}`)).size;
      totalResponded += Math.min(respondentCount, eligible);

      const participationRate = eligible > 0 ? respondentCount / eligible : 0;

      // Score each PSH domain for this team
      const pshScores = this.scorePSHDomains(teamResponses);

      // Get prior scores for trajectory
      const priorScores = await this.getPriorScores(facilityId, teamId, cycleId, 3);

      // Build hazard flags
      const confidenceFlag = participationRate < 0.4 ? "low_participation" : "normal";

      for (const [pshCode, score] of Object.entries(pshScores)) {
        const classification = classifyHazardScore(score);
        const priorForDomain = priorScores
          .filter((p) => p.pshCode === pshCode)
          .map((p) => p.score);
        const trajectory = calculateTrajectory([...priorForDomain, score]);

        const consecutiveCycles = this.countConsecutiveFlags(
          priorScores.filter((p) => p.pshCode === pshCode),
          classification
        );

        if (classification !== "GREEN") {
          const flag: HazardFlag = {
            teamId,
            pshCode,
            pshName: PSH_DOMAINS[pshCode as keyof typeof PSH_DOMAINS]?.name ?? pshCode,
            score,
            classification,
            trajectory,
            consecutiveCycles: consecutiveCycles + 1,
            evidenceChain: [`Pulse ${classification} (score: ${score.toFixed(2)})`],
          };

          allHazardFlags.push(flag);

          // Convergence detection
          const convergence = await this.detectConvergence(facilityId, teamId, flag, cycleStart, cycleEnd);
          if (convergence.corroboratingSignals.length > 0) {
            allConvergence.push(convergence);
          }
        }

        // Write to canonical table
        await this.writeHazardScore(
          facilityId, teamId, cycleId, cycleStart, cycleEnd,
          pshCode, score, pshScores,
          participationRate, eligible, Math.round(participationRate * eligible),
          confidenceFlag,
          allConvergence.filter((c) => c.hazardFlag.teamId === teamId)
        );
      }
    }

    const participationRate = totalEligible > 0 ? totalResponded / totalEligible : 0;

    return {
      facilityId,
      cycleId,
      cycleStart,
      cycleEnd,
      teamsProcessed: responsesByTeam.size,
      hazardFlags: allHazardFlags,
      convergenceResults: allConvergence,
      participationRate,
    };
  }

  /**
   * Convert pulse responses (1-5 scale) to PSH hazard scores (0.0-1.0).
   * Lower pulse score = higher hazard.
   */
  scorePSHDomains(responses: PulseResponse[]): Record<string, number> {
    // Group by pulse domain
    const byDomain = new Map<string, number[]>();
    for (const r of responses) {
      if (!byDomain.has(r.domainId)) byDomain.set(r.domainId, []);
      byDomain.get(r.domainId)!.push(r.score);
    }

    // Map pulse domains → PSH codes
    const pshScores: Record<string, number[]> = {};

    for (const domain of PULSE_DOMAINS) {
      const scores = byDomain.get(domain.id);
      if (!scores || scores.length === 0) continue;

      const avgScore = scores.reduce((s, v) => s + v, 0) / scores.length;
      // Invert: pulse 5 (great) → hazard 0.0, pulse 1 (terrible) → hazard 1.0
      const hazardScore = Math.max(0, Math.min(1, (5 - avgScore) / 4));

      for (const pshCode of domain.pshMapping) {
        if (!pshScores[pshCode]) pshScores[pshCode] = [];
        pshScores[pshCode].push(hazardScore);
      }
    }

    // Average across domains that feed each PSH code
    const result: Record<string, number> = {};
    for (const [code, scores] of Object.entries(pshScores)) {
      result[code] = Math.round((scores.reduce((s, v) => s + v, 0) / scores.length) * 10000) / 10000;
    }

    return result;
  }

  /**
   * Detect convergence between pulse hazard flag and operational data.
   */
  private async detectConvergence(
    facilityId: string,
    teamId: string,
    flag: HazardFlag,
    cycleStart: string,
    cycleEnd: string
  ): Promise<ConvergenceResult> {
    const corroborating: ConvergenceResult["corroboratingSignals"] = [];

    // Check rostering data (last 28 days)
    const startDate = new Date(cycleStart);
    startDate.setDate(startDate.getDate() - 28);
    const rosteringRows = await db.select().from(facilityRostering).where(
      and(eq(facilityRostering.facilityId, facilityId), gte(facilityRostering.shiftDate, startDate.toISOString().split("T")[0]))
    );

    if (rosteringRows.length > 0) {
      const unfilledRate = rosteringRows.filter((r) => (r.unfilledShifts ?? 0) > 0).length / rosteringRows.length;
      if (unfilledRate > 0.3) {
        corroborating.push({
          source: "rostering",
          confidence: "HIGH",
          detail: `${Math.round(unfilledRate * 100)}% of shifts had unfilled positions in last 28 days`,
        });
      }

      const rnGaps = rosteringRows.filter((r) => r.rnCoverageGap).length;
      if (rnGaps > 0) {
        corroborating.push({
          source: "rostering",
          confidence: "HIGH",
          detail: `${rnGaps} RN coverage gap(s) in last 28 days`,
        });
      }
    }

    // Check workforce data (absenteeism, agency)
    const workforce = await db.select().from(facilityWorkforce).where(eq(facilityWorkforce.facilityId, facilityId));
    const totalAbsenteeism = workforce.reduce((s, w) => s + Number(w.absenteeismRate ?? 0), 0) / Math.max(workforce.length, 1);
    if (totalAbsenteeism > 0.07) {
      corroborating.push({
        source: "hr",
        confidence: "MEDIUM",
        detail: `Absenteeism rate ${(totalAbsenteeism * 100).toFixed(1)}% (threshold: 7%)`,
      });
    }

    const totalAgency = workforce.reduce((s, w) => s + Number(w.agencyDependencyPct ?? 0), 0) / Math.max(workforce.length, 1);
    if (totalAgency > 0.15) {
      corroborating.push({
        source: "hr",
        confidence: "MEDIUM",
        detail: `Agency dependency ${(totalAgency * 100).toFixed(1)}% (threshold: 15%)`,
      });
    }

    // Check incident data
    const incidents = await db.select().from(facilityIncidents).where(
      and(eq(facilityIncidents.facilityId, facilityId), gte(facilityIncidents.incidentDate, startDate.toISOString().split("T")[0]))
    );
    if (incidents.length > 5) {
      corroborating.push({
        source: "whs",
        confidence: "MEDIUM",
        detail: `${incidents.length} incidents in last 28 days`,
      });
    }

    // Determine overall confidence
    let overallConfidence: "HIGH" | "MEDIUM" | "LOW" = "LOW";
    if (corroborating.length >= 2) overallConfidence = "HIGH";
    else if (corroborating.length === 1) overallConfidence = "MEDIUM";

    // Determine recommended action
    let recommendedAction: "escalate" | "prescribe_practice" | "monitor" = "monitor";
    if (overallConfidence === "HIGH" && flag.classification === "RED") {
      recommendedAction = "escalate";
    } else if (overallConfidence !== "LOW" || flag.classification !== "GREEN") {
      recommendedAction = "prescribe_practice";
    }

    return {
      hazardFlag: flag,
      corroboratingSignals: corroborating,
      overallConfidence,
      recommendedAction,
    };
  }

  /**
   * Get prior PSH scores for trajectory calculation.
   */
  private async getPriorScores(
    facilityId: string,
    teamId: string,
    currentCycleId: number,
    lookback: number
  ): Promise<Array<{ pshCode: string; score: number; cycleId: number }>> {
    const rows = await db
      .select()
      .from(facilityHazardScores)
      .where(
        and(
          eq(facilityHazardScores.facilityId, facilityId),
          eq(facilityHazardScores.teamId, teamId)
        )
      )
      .orderBy(desc(facilityHazardScores.cycleId))
      .limit(lookback);

    const results: Array<{ pshCode: string; score: number; cycleId: number }> = [];
    for (const row of rows) {
      if (row.cycleId >= currentCycleId) continue;
      // Extract all PSH scores from the row
      const pshFields: Array<{ code: string; field: keyof typeof row }> = [
        { code: "PSH_01", field: "psh01HighJobDemands" },
        { code: "PSH_02", field: "psh02LackOfSupport" },
        { code: "PSH_03", field: "psh03PoorOrgJustice" },
        { code: "PSH_04", field: "psh04LowJobControl" },
        { code: "PSH_05", field: "psh05PoorRelationships" },
        { code: "PSH_06", field: "psh06RoleConflict" },
        { code: "PSH_07", field: "psh07ChangeManagement" },
        { code: "PSH_08", field: "psh08TraumaticExposure" },
        { code: "PSH_09", field: "psh09RemoteIsolated" },
        { code: "PSH_10", field: "psh10ViolenceAggression" },
        { code: "PSH_11", field: "psh11HarassmentBullying" },
        { code: "PSH_12", field: "psh12EmotionalDemands" },
        { code: "PSH_13", field: "psh13LowRecognition" },
        { code: "PSH_14", field: "psh14PoorEnvironment" },
        { code: "PSH_15", field: "psh15JobInsecurity" },
        { code: "PSH_16", field: "psh16WorkLifeImbalance" },
      ];
      for (const { code, field } of pshFields) {
        const val = row[field];
        if (val !== null && val !== undefined) {
          results.push({ pshCode: code, score: Number(val), cycleId: row.cycleId });
        }
      }
    }
    return results;
  }

  private countConsecutiveFlags(
    priorScores: Array<{ score: number }>,
    currentClassification: HazardClassification
  ): number {
    let count = 0;
    for (const prior of priorScores) {
      const priorClass = classifyHazardScore(prior.score);
      if (priorClass === currentClassification || (currentClassification === "RED" && priorClass === "AMBER")) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }

  /**
   * Write hazard scores to canonical table.
   */
  private async writeHazardScore(
    facilityId: string,
    teamId: string,
    cycleId: number,
    cycleStart: string,
    cycleEnd: string,
    pshCode: string,
    score: number,
    allScores: Record<string, number>,
    participationRate: number,
    eligible: number,
    actual: number,
    confidenceFlag: string,
    convergenceResults: ConvergenceResult[]
  ): Promise<void> {
    const hasConvergence = convergenceResults.some(
      (c) => c.corroboratingSignals.length > 0
    );
    const worstConvergence = convergenceResults.reduce(
      (worst, c) => {
        if (c.overallConfidence === "HIGH") return "critical";
        if (c.overallConfidence === "MEDIUM" && worst !== "critical") return "high";
        if (worst !== "critical" && worst !== "high") return "elevated";
        return worst;
      },
      null as string | null
    );

    const overallScore = Object.values(allScores).reduce((s, v) => s + v, 0) / Math.max(Object.keys(allScores).length, 1);

    // Upsert — one row per team per cycle
    await db
      .insert(facilityHazardScores)
      .values({
        facilityId,
        teamId,
        cycleId,
        cycleStart,
        cycleEnd,
        psh01HighJobDemands: String(allScores.PSH_01 ?? 0),
        psh02LackOfSupport: String(allScores.PSH_02 ?? 0),
        psh03PoorOrgJustice: String(allScores.PSH_03 ?? 0),
        psh04LowJobControl: String(allScores.PSH_04 ?? 0),
        psh05PoorRelationships: String(allScores.PSH_05 ?? 0),
        psh06RoleConflict: String(allScores.PSH_06 ?? 0),
        psh07ChangeManagement: String(allScores.PSH_07 ?? 0),
        psh08TraumaticExposure: String(allScores.PSH_08 ?? 0),
        psh09RemoteIsolated: String(allScores.PSH_09 ?? 0),
        psh10ViolenceAggression: String(allScores.PSH_10 ?? 0),
        psh11HarassmentBullying: String(allScores.PSH_11 ?? 0),
        psh12EmotionalDemands: String(allScores.PSH_12 ?? 0),
        psh13LowRecognition: String(allScores.PSH_13 ?? 0),
        psh14PoorEnvironment: String(allScores.PSH_14 ?? 0),
        psh15JobInsecurity: String(allScores.PSH_15 ?? 0),
        psh16WorkLifeImbalance: String(allScores.PSH_16 ?? 0),
        overallScore: String(overallScore),
        pulseComponent: String(overallScore),
        operationalComponent: "0",
        pulseParticipationRate: String(participationRate),
        eligibleRespondents: eligible,
        actualRespondents: actual,
        confidenceFlag,
        convergenceDetected: hasConvergence,
        convergenceSeverity: worstConvergence,
        convergencePairs: convergenceResults.map((c) => ({
          pshCode: c.hazardFlag.pshCode,
          signals: c.corroboratingSignals,
          confidence: c.overallConfidence,
        })),
      })
      .onConflictDoUpdate({
        target: [facilityHazardScores.facilityId, facilityHazardScores.teamId, facilityHazardScores.cycleId],
        set: {
          psh01HighJobDemands: String(allScores.PSH_01 ?? 0),
          psh02LackOfSupport: String(allScores.PSH_02 ?? 0),
          psh03PoorOrgJustice: String(allScores.PSH_03 ?? 0),
          psh04LowJobControl: String(allScores.PSH_04 ?? 0),
          psh05PoorRelationships: String(allScores.PSH_05 ?? 0),
          psh06RoleConflict: String(allScores.PSH_06 ?? 0),
          psh07ChangeManagement: String(allScores.PSH_07 ?? 0),
          psh08TraumaticExposure: String(allScores.PSH_08 ?? 0),
          psh09RemoteIsolated: String(allScores.PSH_09 ?? 0),
          psh10ViolenceAggression: String(allScores.PSH_10 ?? 0),
          psh11HarassmentBullying: String(allScores.PSH_11 ?? 0),
          psh12EmotionalDemands: String(allScores.PSH_12 ?? 0),
          psh13LowRecognition: String(allScores.PSH_13 ?? 0),
          psh14PoorEnvironment: String(allScores.PSH_14 ?? 0),
          psh15JobInsecurity: String(allScores.PSH_15 ?? 0),
          psh16WorkLifeImbalance: String(allScores.PSH_16 ?? 0),
          overallScore: String(overallScore),
          convergenceDetected: hasConvergence,
          convergenceSeverity: worstConvergence,
        },
      });
  }
}
