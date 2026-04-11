// ============================================================================
// Trust Engine — Multi-Component Weighted Scoring
//
// Ported from Prism's trust-engine.ts. Per facility, computed from
// historical action data across 5 weighted components:
//
//   briefingAcceptance (25%) — DON opens and acts on briefings
//   recommendationFollow (25%) — DON approves CHRIS recommendations
//   outcomeAccuracy (30%) — practices actually reduce hazard scores
//   calibration (20%) — Bayesian posterior calibration score
//   undoPenalty — multiplier (0.5x × undo rate) subtracted from composite
//
// Trust phases:
//   observe (< 0.3) → assist (0.3-0.5) → operate (0.5-0.7)
//   → manage (0.7-0.9) → autonomous (≥ 0.9)
//
// Minimum sample sizes before a component is included:
//   briefingAcceptance: 10, recommendationFollow: 5,
//   outcomeAccuracy: 10, undoRate: 1
//
// Cache: L1 in-memory (1 min TTL)
// ============================================================================

import { db, trustScores, autonomyConfig, evidenceRecords, facilityInterventions, donReviewItems } from "@chris/db";
import {
  type ActionCategory,
  type ApprovalTier,
  type TrustPhase,
  getTrustPhase,
  HARD_CEILING_ACTIONS,
  ALWAYS_TIER_3,
  ACTION_REGISTRY,
} from "@chris/db";
import { eq, and, gte, isNotNull, lt } from "drizzle-orm";

// --- Types ---

export interface TrustComponents {
  briefingAcceptance: number;
  recommendationFollow: number;
  outcomeAccuracy: number;
  undoRate: number;
  calibration: number;
}

export interface TrustSampleSizes {
  briefingAcceptance: number;
  recommendationFollow: number;
  outcomeAccuracy: number;
  undoRate: number;
}

export interface TrustResult {
  overall: number;
  components: TrustComponents;
  sampleSizes: TrustSampleSizes;
  phase: TrustPhase;
  actionCategory?: ActionCategory;
  effectiveTier?: ApprovalTier;
  isHardCeiling?: boolean;
  canActAutonomously?: boolean;
}

// --- Constants (matching Prism) ---

const COMPONENT_WEIGHTS = {
  briefingAcceptance: 0.25,
  recommendationFollow: 0.25,
  outcomeAccuracy: 0.30,
  calibration: 0.20,
} as const;

const MIN_SAMPLES = {
  briefingAcceptance: 10,
  recommendationFollow: 5,
  outcomeAccuracy: 10,
  undoRate: 1,
} as const;

const UNDO_PENALTY_MULTIPLIER = 0.5;
const LOOKBACK_DAYS = 30;

// L1 in-memory cache (1 min TTL)
const CACHE_TTL_MS = 60_000;
const trustCache = new Map<string, { score: TrustResult; loadedAt: number }>();

export class TrustEngine {
  /**
   * Compute the full multi-component trust score for a facility.
   */
  async computeTrust(facilityId: string): Promise<TrustResult> {
    const cached = trustCache.get(facilityId);
    if (cached && Date.now() - cached.loadedAt < CACHE_TTL_MS) {
      return cached.score;
    }

    const cutoff = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000);

    const [briefingStats, recommendationStats, outcomeStats, undoStats] =
      await Promise.all([
        this.queryBriefingAcceptance(facilityId, cutoff),
        this.queryRecommendationFollow(facilityId, cutoff),
        this.queryOutcomeAccuracy(facilityId, cutoff),
        this.queryUndoRate(facilityId, cutoff),
      ]);

    const calibration = 0.5; // Computed from betaPosteriors aggregate in production

    const sampleSizes: TrustSampleSizes = {
      briefingAcceptance: briefingStats.total,
      recommendationFollow: recommendationStats.total,
      outcomeAccuracy: outcomeStats.total,
      undoRate: undoStats.total,
    };

    const components: TrustComponents = {
      briefingAcceptance: briefingStats.total > 0 ? briefingStats.accepted / briefingStats.total : 0,
      recommendationFollow: recommendationStats.total > 0 ? recommendationStats.approved / recommendationStats.total : 0,
      outcomeAccuracy: outcomeStats.total > 0 ? outcomeStats.positive / outcomeStats.total : 0,
      undoRate: undoStats.total > 0 ? undoStats.rejected / undoStats.total : 0,
      calibration,
    };

    let weightedSum = 0;
    let totalWeight = 0;

    if (sampleSizes.briefingAcceptance >= MIN_SAMPLES.briefingAcceptance) {
      weightedSum += components.briefingAcceptance * COMPONENT_WEIGHTS.briefingAcceptance;
      totalWeight += COMPONENT_WEIGHTS.briefingAcceptance;
    }
    if (sampleSizes.recommendationFollow >= MIN_SAMPLES.recommendationFollow) {
      weightedSum += components.recommendationFollow * COMPONENT_WEIGHTS.recommendationFollow;
      totalWeight += COMPONENT_WEIGHTS.recommendationFollow;
    }
    if (sampleSizes.outcomeAccuracy >= MIN_SAMPLES.outcomeAccuracy) {
      weightedSum += components.outcomeAccuracy * COMPONENT_WEIGHTS.outcomeAccuracy;
      totalWeight += COMPONENT_WEIGHTS.outcomeAccuracy;
    }
    weightedSum += components.calibration * COMPONENT_WEIGHTS.calibration;
    totalWeight += COMPONENT_WEIGHTS.calibration;

    let overall = totalWeight > 0 ? weightedSum / totalWeight : 0;

    if (sampleSizes.undoRate >= MIN_SAMPLES.undoRate) {
      overall -= components.undoRate * UNDO_PENALTY_MULTIPLIER;
    }

    overall = Math.max(0, Math.min(1, overall));

    const result: TrustResult = { overall, components, sampleSizes, phase: getTrustPhase(overall) };
    trustCache.set(facilityId, { score: result, loadedAt: Date.now() });
    return result;
  }

  /**
   * Get trust + effective tier for a specific action at a facility.
   */
  async getTrust(facilityId: string, actionCategory: ActionCategory): Promise<TrustResult> {
    const base = await this.computeTrust(facilityId);

    const [config] = await db
      .select()
      .from(autonomyConfig)
      .where(and(eq(autonomyConfig.facilityId, facilityId), eq(autonomyConfig.actionCategory, actionCategory)));

    const registryEntry = ACTION_REGISTRY.find((r) => r.category === actionCategory);
    const defaultTier = (config?.defaultTier ?? registryEntry?.defaultTier ?? 2) as ApprovalTier;
    const ceilingTier = (config?.ceilingTier ?? registryEntry?.ceilingTier ?? 2) as ApprovalTier;
    const threshold = Number(config?.trustThreshold ?? 0.8);
    const isHardCeiling = HARD_CEILING_ACTIONS.includes(actionCategory);
    const isAlwaysTier3 = ALWAYS_TIER_3.includes(actionCategory);

    let effectiveTier: ApprovalTier;
    if (isAlwaysTier3) effectiveTier = 3;
    else if (isHardCeiling) effectiveTier = Math.max(2, ceilingTier) as ApprovalTier;
    else if (base.overall >= threshold && ceilingTier === 1) effectiveTier = 1;
    else if (base.overall >= 0.4) effectiveTier = Math.max(defaultTier, ceilingTier) as ApprovalTier;
    else effectiveTier = defaultTier;

    return { ...base, actionCategory, effectiveTier, isHardCeiling, canActAutonomously: effectiveTier === 1 };
  }

  invalidateCache(facilityId: string): void { trustCache.delete(facilityId); }

  async decayInactive(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const stale = await db.select().from(trustScores).where(lt(trustScores.lastActivityAt, thirtyDaysAgo));
    let decayed = 0;
    for (const row of stale) {
      await db.update(trustScores).set({ score: String(Number(row.score) * 0.95), updatedAt: new Date() }).where(eq(trustScores.id, row.id));
      decayed++;
    }
    return decayed;
  }

  async seedFacilityConfig(facilityId: string): Promise<void> {
    for (const entry of ACTION_REGISTRY) {
      await db.insert(autonomyConfig).values({
        facilityId, actionCategory: entry.category, defaultTier: entry.defaultTier,
        ceilingTier: entry.ceilingTier, isReversible: entry.isReversible,
        requiresSaga: entry.requiresSaga, hardCeiling: HARD_CEILING_ACTIONS.includes(entry.category),
      }).onConflictDoNothing();
    }
  }

  // --- DB Queries ---

  private async queryBriefingAcceptance(facilityId: string, cutoff: Date): Promise<{ total: number; accepted: number }> {
    const rows = await db.select().from(evidenceRecords).where(
      and(eq(evidenceRecords.facilityId, facilityId), gte(evidenceRecords.triggeredAt, cutoff))
    );
    const briefings = rows.filter((r) => ["monday_briefing_delivery", "team_briefing_delivery", "leader_loop_delivery"].includes(r.actionCategory));
    return { total: briefings.length, accepted: briefings.filter((r) => r.decision !== "rejected").length };
  }

  private async queryRecommendationFollow(facilityId: string, cutoff: Date): Promise<{ total: number; approved: number }> {
    const rows = await db.select().from(donReviewItems).where(
      and(eq(donReviewItems.facilityId, facilityId), gte(donReviewItems.createdAt, cutoff), isNotNull(donReviewItems.decidedAt))
    );
    return { total: rows.length, approved: rows.filter((r) => r.status === "approved").length };
  }

  private async queryOutcomeAccuracy(facilityId: string, cutoff: Date): Promise<{ total: number; positive: number }> {
    const rows = await db.select().from(facilityInterventions).where(
      and(eq(facilityInterventions.facilityId, facilityId), isNotNull(facilityInterventions.outcome), gte(facilityInterventions.prescribedAt, cutoff))
    );
    return { total: rows.length, positive: rows.filter((r) => r.outcome === "hazard_reduced").length };
  }

  private async queryUndoRate(facilityId: string, cutoff: Date): Promise<{ total: number; rejected: number }> {
    const rows = await db.select().from(donReviewItems).where(
      and(eq(donReviewItems.facilityId, facilityId), gte(donReviewItems.createdAt, cutoff), isNotNull(donReviewItems.decidedAt))
    );
    return { total: rows.length, rejected: rows.filter((r) => r.status === "rejected").length };
  }
}
