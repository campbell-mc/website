// ============================================================================
// Trust Engine — Earned Autonomy for CHRIS Actions
//
// Adapted from Prism's trust-engine.ts. Per action category, per facility.
//
// Trust increases slowly, decreases fast:
//   Each consecutive approval without modification: +0.04
//   Each modification: reset consecutive count, no penalty
//   Each rejection: -0.15, consecutive count reset
//
// Trust score → autonomy behaviour:
//   ≥ 0.80: CHRIS acts without queue item (Tier 1 behaviour)
//   0.40-0.79: Queue item, human reviews (Tier 2 behaviour)
//   < 0.40: Queue item, explicit approval required each time
//
// Decay: 30 days inactivity → score × 0.95
// Hard ceilings: some actions can NEVER be fully autonomous
// ============================================================================

import { db, trustScores, autonomyConfig } from "@chris/db";
import {
  type ActionCategory,
  type ApprovalTier,
  type TrustPhase,
  getTrustPhase,
  HARD_CEILING_ACTIONS,
  ALWAYS_TIER_3,
  ACTION_REGISTRY,
} from "@chris/db";
import { eq, and, lt, sql } from "drizzle-orm";

export interface TrustResult {
  actionCategory: ActionCategory;
  score: number;
  phase: TrustPhase;
  effectiveTier: ApprovalTier;
  consecutiveApprovals: number;
  isHardCeiling: boolean;
  canActAutonomously: boolean;
}

export class TrustEngine {
  /**
   * Get the trust score and effective tier for an action at a facility.
   */
  async getTrust(facilityId: string, actionCategory: ActionCategory): Promise<TrustResult> {
    // Load trust score
    const [trust] = await db
      .select()
      .from(trustScores)
      .where(
        and(
          eq(trustScores.facilityId, facilityId),
          eq(trustScores.actionCategory, actionCategory)
        )
      );

    const score = trust ? Number(trust.score) : 0.2; // Default: low trust for new facilities
    const consecutiveApprovals = trust?.consecutiveApprovals ?? 0;

    // Load autonomy config (or use registry defaults)
    const [config] = await db
      .select()
      .from(autonomyConfig)
      .where(
        and(
          eq(autonomyConfig.facilityId, facilityId),
          eq(autonomyConfig.actionCategory, actionCategory)
        )
      );

    const registryEntry = ACTION_REGISTRY.find((r) => r.category === actionCategory);
    const defaultTier = (config?.defaultTier ?? registryEntry?.defaultTier ?? 2) as ApprovalTier;
    const ceilingTier = (config?.ceilingTier ?? registryEntry?.ceilingTier ?? 2) as ApprovalTier;
    const threshold = Number(config?.trustThreshold ?? 0.8);
    const isHardCeiling = HARD_CEILING_ACTIONS.includes(actionCategory);
    const isAlwaysTier3 = ALWAYS_TIER_3.includes(actionCategory);

    // Determine effective tier
    let effectiveTier: ApprovalTier;

    if (isAlwaysTier3) {
      effectiveTier = 3;
    } else if (isHardCeiling) {
      effectiveTier = Math.max(2, ceilingTier) as ApprovalTier;
    } else if (score >= threshold && ceilingTier === 1) {
      effectiveTier = 1; // Earned autonomous
    } else if (score >= 0.4) {
      effectiveTier = Math.max(defaultTier, ceilingTier) as ApprovalTier;
    } else {
      effectiveTier = defaultTier;
    }

    return {
      actionCategory,
      score,
      phase: getTrustPhase(score),
      effectiveTier,
      consecutiveApprovals,
      isHardCeiling,
      canActAutonomously: effectiveTier === 1,
    };
  }

  /**
   * Record an approval — trust increases slowly.
   */
  async recordApproval(facilityId: string, actionCategory: ActionCategory): Promise<void> {
    const [existing] = await db
      .select()
      .from(trustScores)
      .where(and(eq(trustScores.facilityId, facilityId), eq(trustScores.actionCategory, actionCategory)));

    if (existing) {
      const newScore = Math.min(1, Number(existing.score) + 0.04);
      await db
        .update(trustScores)
        .set({
          score: String(newScore),
          consecutiveApprovals: (existing.consecutiveApprovals ?? 0) + 1,
          totalApprovals: (existing.totalApprovals ?? 0) + 1,
          lastActivityAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(trustScores.id, existing.id));
    } else {
      await db.insert(trustScores).values({
        facilityId,
        actionCategory,
        score: "0.24", // 0.20 + 0.04
        consecutiveApprovals: 1,
        totalApprovals: 1,
        lastActivityAt: new Date(),
      });
    }
  }

  /**
   * Record a modification — resets consecutive count, no score penalty.
   */
  async recordModification(facilityId: string, actionCategory: ActionCategory): Promise<void> {
    const [existing] = await db
      .select()
      .from(trustScores)
      .where(and(eq(trustScores.facilityId, facilityId), eq(trustScores.actionCategory, actionCategory)));

    if (existing) {
      await db
        .update(trustScores)
        .set({
          consecutiveApprovals: 0,
          totalModifications: (existing.totalModifications ?? 0) + 1,
          lastActivityAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(trustScores.id, existing.id));
    } else {
      await db.insert(trustScores).values({
        facilityId,
        actionCategory,
        score: "0.2000",
        consecutiveApprovals: 0,
        totalModifications: 1,
        lastActivityAt: new Date(),
      });
    }
  }

  /**
   * Record a rejection — trust decreases fast (-0.15).
   */
  async recordRejection(facilityId: string, actionCategory: ActionCategory): Promise<void> {
    const [existing] = await db
      .select()
      .from(trustScores)
      .where(and(eq(trustScores.facilityId, facilityId), eq(trustScores.actionCategory, actionCategory)));

    if (existing) {
      const newScore = Math.max(0, Number(existing.score) - 0.15);
      await db
        .update(trustScores)
        .set({
          score: String(newScore),
          consecutiveApprovals: 0,
          totalRejections: (existing.totalRejections ?? 0) + 1,
          lastActivityAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(trustScores.id, existing.id));
    } else {
      await db.insert(trustScores).values({
        facilityId,
        actionCategory,
        score: "0.0500", // 0.20 - 0.15
        consecutiveApprovals: 0,
        totalRejections: 1,
        lastActivityAt: new Date(),
      });
    }
  }

  /**
   * Decay inactive trust scores — run daily.
   * 30 days inactivity → score × 0.95
   */
  async decayInactive(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stale = await db
      .select()
      .from(trustScores)
      .where(lt(trustScores.lastActivityAt, thirtyDaysAgo));

    let decayed = 0;
    for (const row of stale) {
      const newScore = Number(row.score) * 0.95;
      await db
        .update(trustScores)
        .set({
          score: String(Math.round(newScore * 10000) / 10000),
          updatedAt: new Date(),
        })
        .where(eq(trustScores.id, row.id));
      decayed++;
    }

    return decayed;
  }

  /**
   * Seed autonomy config for a new facility from the registry defaults.
   */
  async seedFacilityConfig(facilityId: string): Promise<void> {
    for (const entry of ACTION_REGISTRY) {
      await db
        .insert(autonomyConfig)
        .values({
          facilityId,
          actionCategory: entry.category,
          defaultTier: entry.defaultTier,
          ceilingTier: entry.ceilingTier,
          isReversible: entry.isReversible,
          requiresSaga: entry.requiresSaga,
          hardCeiling: HARD_CEILING_ACTIONS.includes(entry.category),
        })
        .onConflictDoNothing();
    }
  }
}
