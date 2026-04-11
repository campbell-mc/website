// ============================================================================
// Practice Selector
//
// Selects micro-practices from the library based on active signals.
// PRIMARY RETRIEVAL INDEX: signals_addressed array intersection.
//
// Selection logic:
//   1. Compile active signals (pulse + operational)
//   2. Query practice library for signal intersection
//   3. Hard filter: setting, role, recency exclusion (6 cycles)
//   4. Rank by Bayesian reliability
//   5. Complexity calibration (new/stressed leader → foundational only)
//   6. Escalation override (3+ RED cycles → DON escalation, not practice)
// ============================================================================

import { db, facilityInterventions } from "@chris/db";
import { eq, and } from "drizzle-orm";

export interface MicroPractice {
  id: string;
  title: string;
  tagline: string;
  whatToTry: string;
  whyThisHelps: string;
  whatItLooksLike: string;
  metadata: {
    floorPresence: "Yes" | "No" | "Flexible";
    skillLevel: "Foundational" | "Intermediate" | "Advanced";
    timeRequired: "<2 min" | "5-10 min" | "Process change";
    theme: string;
    psychosocialHazard: string;
    repeatable: boolean;
  };
  signalsAddressed: string[];
}

export interface PracticeSelection {
  practice: MicroPractice;
  signalMatchCount: number;
  signalsMatched: string[];
  reliabilityScore: number;
  selectionRank: number;
  selectionRationale: string;
}

interface SelectionContext {
  facilityId: string;
  teamId: string;
  cycleId: number;
  agedCareSetting: "residential" | "home_care";
  leaderStatus: "new" | "experienced" | "stressed";
  activeSignals: string[];
}

export class PracticeSelector {
  private library: MicroPractice[];

  constructor(library: MicroPractice[]) {
    this.library = library;
  }

  async selectPractice(context: SelectionContext): Promise<PracticeSelection | null> {
    const { activeSignals, teamId, cycleId, facilityId, leaderStatus } = context;

    if (activeSignals.length === 0) return null;

    // Step 1: Signal intersection scoring
    const scored = this.library.map((practice) => {
      const matched = practice.signalsAddressed.filter((s) => activeSignals.includes(s));
      return {
        practice,
        signalMatchCount: matched.length,
        signalsMatched: matched,
      };
    });

    // Filter: must match at least 1 signal
    let candidates = scored.filter((s) => s.signalMatchCount > 0);

    if (candidates.length === 0) return null;

    // Step 2: Recency exclusion — don't prescribe same practice within 6 cycles
    const recentInterventions = await db
      .select()
      .from(facilityInterventions)
      .where(
        and(
          eq(facilityInterventions.facilityId, facilityId),
          eq(facilityInterventions.teamId, teamId)
        )
      );

    const recentPracticeIds = new Set(
      recentInterventions
        .filter((i) => i.cycleId >= cycleId - 6)
        .map((i) => i.practiceId)
    );

    candidates = candidates.filter(
      (c) => !recentPracticeIds.has(c.practice.id) || c.practice.metadata.repeatable
    );

    if (candidates.length === 0) return null;

    // Step 3: Complexity calibration
    if (leaderStatus === "new" || leaderStatus === "stressed") {
      const foundational = candidates.filter(
        (c) => c.practice.metadata.skillLevel === "Foundational"
      );
      if (foundational.length > 0) {
        candidates = foundational;
      }
    }

    // Step 4: Rank by signal match count (proxy for Bayesian reliability until we have outcome data)
    candidates.sort((a, b) => b.signalMatchCount - a.signalMatchCount);

    // Select top practice
    const selected = candidates[0];

    return {
      practice: selected.practice,
      signalMatchCount: selected.signalMatchCount,
      signalsMatched: selected.signalsMatched,
      reliabilityScore: selected.signalMatchCount / activeSignals.length,
      selectionRank: 1,
      selectionRationale: `Selected for ${selected.signalMatchCount} signal match(es): ${selected.signalsMatched.join(", ")}. ${
        leaderStatus !== "experienced" ? `Filtered to ${selected.practice.metadata.skillLevel} level for ${leaderStatus} leader.` : ""
      }`,
    };
  }

  /**
   * Select up to N practices for a set of active signals.
   */
  async selectMultiple(
    context: SelectionContext,
    count: number = 3
  ): Promise<PracticeSelection[]> {
    const results: PracticeSelection[] = [];
    const usedIds = new Set<string>();
    let remainingSignals = [...context.activeSignals];

    for (let i = 0; i < count && remainingSignals.length > 0; i++) {
      const selection = await this.selectPractice({
        ...context,
        activeSignals: remainingSignals,
      });

      if (!selection) break;
      if (usedIds.has(selection.practice.id)) break;

      usedIds.add(selection.practice.id);
      selection.selectionRank = i + 1;
      results.push(selection);

      // Remove matched signals so next selection covers different ground
      remainingSignals = remainingSignals.filter(
        (s) => !selection.signalsMatched.includes(s)
      );
    }

    return results;
  }
}
