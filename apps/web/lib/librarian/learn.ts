// lib/librarian/learn.ts
// Closed-loop learning from practice outcomes.
// When a practice is prescribed and the next cycle completes,
// learn() records what happened. Over time, this builds Bayesian
// evidence for which practices move which hazards.

import type { PracticeOutcomeInput } from './types';

/**
 * Record a practice outcome for learning.
 * Phase 1: console log. Phase 2: INSERT into practice_outcomes + update Bayesian priors.
 */
export async function learn(outcome: PracticeOutcomeInput): Promise<void> {
  const delta = outcome.pre_score !== null && outcome.post_score !== null
    ? outcome.post_score - outcome.pre_score
    : null;

  const classification = delta === null ? 'unknown'
    : delta < -0.05 ? 'improved'
    : delta > 0.05 ? 'worsened'
    : 'stable';

  // TODO: Phase 2 — write to practice_outcomes table:
  // await db.insert(practiceOutcomesTable).values({
  //   facility_id: outcome.facility_id,
  //   team_id: outcome.team_id,
  //   cycle_id: outcome.cycle_id,
  //   practice_id: outcome.practice_id,
  //   signal_targeted: outcome.signal_targeted,
  //   hazard_domain: outcome.hazard_domain,
  //   pre_score: outcome.pre_score,
  //   post_score: outcome.post_score,
  //   delta,
  //   outcome: classification,
  //   leader_effectiveness_rating: outcome.leader_effectiveness_rating,
  //   practice_delivered: outcome.practice_delivered,
  //   contextual_factors: outcome.contextual_factors,
  // });

  // TODO: Phase 3 — update Bayesian reliability for this practice:
  // If improved: increment alpha (success count)
  // If worsened: increment beta (failure count)
  // reliability = alpha / (alpha + beta)
  // This feeds back into selectPractice() ranking

  console.log(`[Librarian] learn: ${outcome.practice_id} | ${outcome.hazard_domain} | ${classification} | delta: ${delta?.toFixed(3) ?? 'unknown'} | rating: ${outcome.leader_effectiveness_rating ?? 'none'}`);
}
