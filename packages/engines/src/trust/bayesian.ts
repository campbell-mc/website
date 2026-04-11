// ============================================================================
// Bayesian Posteriors Engine
//
// Ported from Prism's beta-posteriors.ts.
// Per-(facility × hazard_domain × practice_id) Beta distributions
// with Thompson sampling for practice selection and trust calibration.
//
// Default prior: Beta(2, 2) — weak uninformative, mean = 0.5
// Update: alpha += reward, beta += (1 - reward)
// Decay: alpha, beta *= 0.95 for rows with 10+ observations
//
// Used by:
//   - Practice selector (rank by reliability)
//   - Trust engine (outcome accuracy component)
//   - Cross-facility learning (shared posteriors)
// ============================================================================

import { db, betaPosteriors } from "@chris/db";
import { eq, and, gt, sql } from "drizzle-orm";

// --- Types ---

export interface BetaPrior {
  alpha: number;
  beta: number;
  observations: number;
}

// --- In-memory cache (5-min TTL, matches Prism) ---

const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  prior: BetaPrior;
  loadedAt: number;
}

const cache = new Map<string, CacheEntry>();

function cacheKey(
  facilityId: string,
  entityType: string,
  entityId: string,
  issueType: string,
  actionType: string
): string {
  return `${facilityId}:${entityType}:${entityId}:${issueType}:${actionType}`;
}

/** Normalize strings for consistent cache keys */
function canonicalize(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, "_");
}

/** Test-only cache reset */
export function _resetCache(): void {
  cache.clear();
}

// --- Core Functions ---

/**
 * Load the Beta prior for a specific entity×issue×action combination.
 * Returns Beta(2,2) default if no data exists.
 */
export async function loadPrior(
  facilityId: string,
  entityType: string,
  entityId: string,
  issueType: string,
  actionType: string
): Promise<BetaPrior> {
  const it = canonicalize(issueType);
  const at = canonicalize(actionType);
  const key = cacheKey(facilityId, entityType, entityId, it, at);

  const cached = cache.get(key);
  if (cached && Date.now() - cached.loadedAt < CACHE_TTL_MS) {
    return cached.prior;
  }

  const [row] = await db
    .select({
      alpha: betaPosteriors.alpha,
      betaParam: betaPosteriors.betaParam,
      totalObservations: betaPosteriors.totalObservations,
    })
    .from(betaPosteriors)
    .where(
      and(
        eq(betaPosteriors.facilityId, facilityId),
        eq(betaPosteriors.entityType, entityType),
        eq(betaPosteriors.entityId, entityId),
        eq(betaPosteriors.issueType, it),
        eq(betaPosteriors.actionType, at)
      )
    )
    .limit(1);

  const prior: BetaPrior = row
    ? {
        alpha: Number(row.alpha),
        beta: Number(row.betaParam),
        observations: row.totalObservations,
      }
    : { alpha: 2, beta: 2, observations: 0 };

  cache.set(key, { prior, loadedAt: Date.now() });
  return prior;
}

/**
 * Update the posterior with a new observation.
 * reward ∈ [0, 1]: 1 = full success, 0 = full failure, 0.5 = mixed.
 */
export async function updatePrior(
  facilityId: string,
  entityType: string,
  entityId: string,
  issueType: string,
  actionType: string,
  reward: number
): Promise<void> {
  const it = canonicalize(issueType);
  const at = canonicalize(actionType);
  const key = cacheKey(facilityId, entityType, entityId, it, at);

  await db
    .insert(betaPosteriors)
    .values({
      facilityId,
      entityType,
      entityId,
      issueType: it,
      actionType: at,
      alpha: String(2 + reward),
      betaParam: String(2 + (1 - reward)),
      totalObservations: 1,
      lastUpdatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [
        betaPosteriors.facilityId,
        betaPosteriors.entityType,
        betaPosteriors.entityId,
        betaPosteriors.issueType,
        betaPosteriors.actionType,
      ],
      set: {
        alpha: sql`${betaPosteriors.alpha}::numeric + ${reward}`,
        betaParam: sql`${betaPosteriors.betaParam}::numeric + ${1 - reward}`,
        totalObservations: sql`${betaPosteriors.totalObservations} + 1`,
        lastUpdatedAt: new Date(),
      },
    });

  // Invalidate cache
  cache.delete(key);
}

/**
 * Posterior mean: E[θ] = α / (α + β)
 */
export function posteriorMean(prior: BetaPrior): number {
  return prior.alpha / (prior.alpha + prior.beta);
}

/**
 * Posterior variance: Var[θ] = αβ / ((α+β)²(α+β+1))
 */
export function posteriorVariance(prior: BetaPrior): number {
  const { alpha, beta } = prior;
  return (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1));
}

/**
 * 95% credible interval width.
 * Approximation: ±2σ where σ = √variance
 */
export function credibleIntervalWidth(prior: BetaPrior): number {
  return 4 * Math.sqrt(posteriorVariance(prior));
}

/**
 * Thompson sampling via Marsaglia-Tsang gamma sampler (pure JS, no deps).
 * Returns a sample from Beta(alpha, beta) in [0, 1].
 * Used for randomized practice selection weighted by reliability.
 */
export function betaSample(alpha: number, beta: number): number {
  const x = gammaSample(alpha);
  const y = gammaSample(beta);
  return x / (x + y);
}

function gammaSample(shape: number): number {
  if (shape < 1) {
    return gammaSample(shape + 1) * Math.random() ** (1 / shape);
  }

  // Marsaglia-Tsang method for shape >= 1
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);

  for (;;) {
    let x: number;
    let v: number;
    do {
      x = normalSample();
      v = 1 + c * x;
    } while (v <= 0);

    v = v * v * v;
    const u = Math.random();

    if (u < 1 - 0.0331 * (x * x) * (x * x)) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

function normalSample(): number {
  // Box-Muller transform
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/**
 * Decay all priors for a facility with sufficient observations.
 * Multiplies alpha and beta by 0.95 to gradually forget old data.
 * Run daily or weekly.
 */
export async function decayPriors(facilityId: string): Promise<number> {
  const result = await db
    .update(betaPosteriors)
    .set({
      alpha: sql`(${betaPosteriors.alpha}::numeric * 0.95)::numeric(10,4)`,
      betaParam: sql`(${betaPosteriors.betaParam}::numeric * 0.95)::numeric(10,4)`,
      lastUpdatedAt: new Date(),
    })
    .where(
      and(
        eq(betaPosteriors.facilityId, facilityId),
        gt(betaPosteriors.totalObservations, 10)
      )
    )
    .returning({ id: betaPosteriors.id });

  // Flush facility from cache
  for (const key of cache.keys()) {
    if (key.startsWith(`${facilityId}:`)) {
      cache.delete(key);
    }
  }

  return result.length;
}
