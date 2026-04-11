// ============================================================================
// Monday Briefing Engine (Site Operational Briefing)
//
// The flagship CHRIS output. Generated every Sunday 21:00 for Monday 06:00
// delivery. Each DON receives a briefing with:
//   - Top 3 prescribed actions (Signal / Action / Script / Consequence)
//   - Operational dashboard (care minutes, SIRS, workforce, PSH)
//   - Huddle agenda items
//
// CHRIS never invents practices — all actions come from the library
// via signals_addressed matching.
// ============================================================================

import { db, facilities, facilityRostering, facilityIncidents, facilityHazardScores, facilityWorkforce, donReviewItems } from "@chris/db";
import { eq, and, gte, desc } from "drizzle-orm";
import { PracticeSelector, type MicroPractice, type PracticeSelection } from "./practice-selector";
import { classifyHazardScore, type HazardClassification } from "../pulse/domains";

export { PracticeSelector } from "./practice-selector";
export type { MicroPractice, PracticeSelection } from "./practice-selector";

// --- Types ---

export interface ActionBlock {
  priority: number;
  hazardDomain: string;
  teamId: string;
  teamName: string;
  signal: {
    classification: HazardClassification;
    consecutiveCycles: number;
    corroboratingData: string[];
    confidence: "HIGH" | "MEDIUM" | "LOW";
  };
  action: {
    summary: string;
    steps: string[];
    practice: PracticeSelection | null;
  };
  script: string;
  consequenceOfInaction: string;
  deadline: string;
}

export interface OperationalDashboard {
  careMinutes: {
    avgPerResident: number;
    rnPerResident: number;
    complianceRate: number;
    status: string;
  };
  sirs: {
    openEvents: number;
    approachingDeadline: number;
    last7Days: number;
  };
  workforce: {
    absenteeismRate: number;
    unfilledShifts: number;
    agencyHours: number;
    turnoverRate: number;
  };
  psh: {
    domainsRed: number;
    domainsAmber: number;
    convergenceEvents: number;
  };
}

export interface MondayBriefing {
  facilityId: string;
  facilityName: string;
  generatedAt: Date;
  cycleId: number;
  actionBlocks: ActionBlock[];
  dashboard: OperationalDashboard;
  huddleAgenda: string[];
  narrative: string; // Claude API generated summary
}

// --- Engine ---

export class MondayBriefingEngine {
  private practiceSelector: PracticeSelector;
  private claudeApiKey: string;

  constructor(practiceLibrary: MicroPractice[], claudeApiKey: string) {
    this.practiceSelector = new PracticeSelector(practiceLibrary);
    this.claudeApiKey = claudeApiKey;
  }

  async generateBriefing(
    facilityId: string,
    cycleId: number
  ): Promise<MondayBriefing> {
    // Step 1: Load facility context
    const [facility] = await db.select().from(facilities).where(eq(facilities.id, facilityId));
    if (!facility) throw new Error(`Facility ${facilityId} not found`);

    // Step 2: Load operational data (last 14 days)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const sinceDate = fourteenDaysAgo.toISOString().split("T")[0];

    const [rosteringData, incidentData, hazardData, workforceData] = await Promise.all([
      db.select().from(facilityRostering).where(and(eq(facilityRostering.facilityId, facilityId), gte(facilityRostering.shiftDate, sinceDate))),
      db.select().from(facilityIncidents).where(and(eq(facilityIncidents.facilityId, facilityId), gte(facilityIncidents.incidentDate, sinceDate))),
      db.select().from(facilityHazardScores).where(eq(facilityHazardScores.facilityId, facilityId)).orderBy(desc(facilityHazardScores.cycleId)).limit(20),
      db.select().from(facilityWorkforce).where(eq(facilityWorkforce.facilityId, facilityId)),
    ]);

    // Step 3: Build operational dashboard
    const dashboard = this.buildDashboard(rosteringData, incidentData, hazardData, workforceData);

    // Step 4: Identify active hazard flags and compile signals
    const currentHazards = hazardData.filter((h) => h.cycleId === cycleId);
    const activeSignals = this.compileActiveSignals(currentHazards, rosteringData, workforceData);

    // Step 5: Select practices for top signals
    const practiceSelections = await this.practiceSelector.selectMultiple(
      {
        facilityId,
        teamId: currentHazards[0]?.teamId ?? "facility",
        cycleId,
        agedCareSetting: (facility.facilityType as "residential" | "home_care") ?? "residential",
        leaderStatus: "experienced",
        activeSignals,
      },
      3
    );

    // Step 6: Build action blocks
    const actionBlocks = this.buildActionBlocks(currentHazards, practiceSelections, dashboard);

    // Step 7: Generate huddle agenda
    const huddleAgenda = this.generateHuddleAgenda(actionBlocks, dashboard);

    // Step 8: Generate narrative via Claude API
    const narrative = await this.generateNarrative(facility, dashboard, actionBlocks);

    // Step 9: Create DON review item
    await db.insert(donReviewItems).values({
      facilityId,
      itemType: "pack_approval",
      urgency: actionBlocks.some((a) => a.signal.confidence === "HIGH") ? "urgent" : "routine",
      summary: `Monday Briefing for ${facility.name} — ${actionBlocks.length} action(s) prescribed.`,
      fullContext: { cycleId, actionCount: actionBlocks.length, dashboard },
      chrisRecommendation: "Review and approve Monday Briefing before 06:00 delivery.",
      deadline: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
    });

    return {
      facilityId,
      facilityName: facility.name,
      generatedAt: new Date(),
      cycleId,
      actionBlocks,
      dashboard,
      huddleAgenda,
      narrative,
    };
  }

  private buildDashboard(
    rostering: Array<Record<string, unknown>>,
    incidents: Array<Record<string, unknown>>,
    hazards: Array<Record<string, unknown>>,
    workforce: Array<Record<string, unknown>>
  ): OperationalDashboard {
    // Care minutes
    const compliantShifts = rostering.filter((r) => r.careMinutesComplianceStatus === "compliant").length;
    const totalShifts = rostering.length;
    const avgTotal = totalShifts > 0
      ? rostering.reduce((s, r) => s + Number(r.actualTotalMinutes ?? 0), 0) / totalShifts
      : 0;
    const avgRn = totalShifts > 0
      ? rostering.reduce((s, r) => s + Number(r.actualRnMinutes ?? 0), 0) / totalShifts
      : 0;

    // SIRS
    const sirsOpen = incidents.filter((i) => i.sirsCategory && !i.sirsReportedAt).length;
    const sirsLast7 = incidents.filter((i) => i.sirsCategory).length;

    // Workforce
    const totalAbsenteeism = workforce.length > 0
      ? workforce.reduce((s, w) => s + Number(w.absenteeismRate ?? 0), 0) / workforce.length
      : 0;
    const totalUnfilled = rostering.reduce((s, r) => s + Number(r.unfilledShifts ?? 0), 0);
    const totalAgency = workforce.reduce((s, w) => s + Number(w.agencyHours ?? 0), 0);
    const totalTurnover = workforce.length > 0
      ? workforce.reduce((s, w) => s + Number(w.turnoverRate ?? 0), 0) / workforce.length
      : 0;

    // PSH
    const latestCycle = hazards.length > 0 ? hazards[0].cycleId : 0;
    const latestHazards = hazards.filter((h) => h.cycleId === latestCycle);
    let domainsRed = 0;
    let domainsAmber = 0;
    for (const h of latestHazards) {
      const score = Number(h.overallScore ?? 0);
      const cls = classifyHazardScore(score);
      if (cls === "RED") domainsRed++;
      else if (cls === "AMBER") domainsAmber++;
    }
    const convergenceEvents = latestHazards.filter((h) => h.convergenceDetected).length;

    return {
      careMinutes: {
        avgPerResident: Math.round(avgTotal * 10) / 10,
        rnPerResident: Math.round(avgRn * 10) / 10,
        complianceRate: totalShifts > 0 ? Math.round((compliantShifts / totalShifts) * 100) : 0,
        status: compliantShifts === totalShifts ? "compliant" : compliantShifts >= totalShifts * 0.9 ? "at_risk" : "non_compliant",
      },
      sirs: {
        openEvents: sirsOpen,
        approachingDeadline: incidents.filter((i) => {
          if (!i.sirsReportingDeadline || i.sirsReportedAt) return false;
          const hoursLeft = (new Date(i.sirsReportingDeadline as string).getTime() - Date.now()) / 3_600_000;
          return hoursLeft < 48;
        }).length,
        last7Days: sirsLast7,
      },
      workforce: {
        absenteeismRate: Math.round(totalAbsenteeism * 1000) / 10,
        unfilledShifts: totalUnfilled,
        agencyHours: Math.round(totalAgency),
        turnoverRate: Math.round(totalTurnover * 1000) / 10,
      },
      psh: {
        domainsRed,
        domainsAmber,
        convergenceEvents,
      },
    };
  }

  private compileActiveSignals(
    hazards: Array<Record<string, unknown>>,
    rostering: Array<Record<string, unknown>>,
    workforce: Array<Record<string, unknown>>
  ): string[] {
    const signals: string[] = [];

    // Pulse-derived signals
    for (const h of hazards) {
      const score = Number(h.overallScore ?? 0);
      if (score > 0.6) {
        signals.push("workload_pressure_pulse_low");
        signals.push("emotional_exhaustion_pulse_high");
      }
      if (score > 0.5) {
        signals.push("support_from_leader_pulse_low");
      }
    }

    // Operational signals from rostering
    const unfilledRate = rostering.length > 0
      ? rostering.filter((r) => Number(r.unfilledShifts ?? 0) > 0).length / rostering.length
      : 0;
    if (unfilledRate > 0.15) signals.push("staffing_coverage_ratio_low");

    const agencyShifts = rostering.reduce((s, r) => s + Number(r.agencyShifts ?? 0), 0);
    const totalShifts = rostering.length;
    if (totalShifts > 0 && agencyShifts / totalShifts > 0.2) signals.push("agency_usage_spike");

    const rnGaps = rostering.filter((r) => r.rnCoverageGap).length;
    if (rnGaps > 0) signals.push("rn_coverage_gap");

    // Workforce signals
    const avgAbsenteeism = workforce.length > 0
      ? workforce.reduce((s, w) => s + Number(w.absenteeismRate ?? 0), 0) / workforce.length
      : 0;
    if (avgAbsenteeism > 0.07) signals.push("sick_leave_spike");

    return [...new Set(signals)]; // Deduplicate
  }

  private buildActionBlocks(
    hazards: Array<Record<string, unknown>>,
    practices: PracticeSelection[],
    dashboard: OperationalDashboard
  ): ActionBlock[] {
    const blocks: ActionBlock[] = [];

    for (let i = 0; i < Math.min(practices.length, 3); i++) {
      const practice = practices[i];
      const hazard = hazards[i];

      const score = hazard ? Number(hazard.overallScore ?? 0) : 0;
      const classification = classifyHazardScore(score);

      blocks.push({
        priority: i + 1,
        hazardDomain: practice.signalsMatched[0] ?? "operational",
        teamId: (hazard?.teamId as string) ?? "facility",
        teamName: (hazard?.teamId as string) ?? "Facility-wide",
        signal: {
          classification,
          consecutiveCycles: 1,
          corroboratingData: practice.signalsMatched,
          confidence: practice.signalMatchCount >= 3 ? "HIGH" : practice.signalMatchCount >= 2 ? "MEDIUM" : "LOW",
        },
        action: {
          summary: practice.practice.title,
          steps: [
            practice.practice.whatToTry.split(".").slice(0, 3).join(".") + ".",
          ],
          practice,
        },
        script: practice.practice.whatItLooksLike,
        consequenceOfInaction: this.generateConsequence(classification, practice.signalsMatched),
        deadline: "Action this week. Report back via briefing action checkbox by Friday.",
      });
    }

    // If no practices matched but dashboard shows issues, add operational actions
    if (blocks.length === 0 && (dashboard.sirs.openEvents > 0 || dashboard.careMinutes.status !== "compliant")) {
      if (dashboard.sirs.openEvents > 0) {
        blocks.push({
          priority: 1,
          hazardDomain: "sirs_compliance",
          teamId: "facility",
          teamName: "Facility-wide",
          signal: {
            classification: "RED",
            consecutiveCycles: 1,
            corroboratingData: ["sirs_open_events"],
            confidence: "HIGH",
          },
          action: {
            summary: "Review and submit pending SIRS reports",
            steps: ["Open DON queue and review pending SIRS classifications", "Approve or modify each report", "Ensure submission before deadline"],
            practice: null,
          },
          script: "There are SIRS reports awaiting your approval in the DON queue. Please review and submit before the reporting deadline.",
          consequenceOfInaction: "SIRS non-reporting penalty: up to $783,000 per contravention under the Aged Care Act 2024.",
          deadline: "Review today.",
        });
      }
    }

    return blocks;
  }

  private generateConsequence(classification: HazardClassification, signals: string[]): string {
    if (classification === "RED") {
      return "Sustained RED classification is the strongest leading indicator of turnover events. Expected 8-week outcome without intervention: 1-2 voluntary resignations. Replacement cost: $18,000-22,000 per care worker. Regulatory exposure under Quality Standard 2 and Standard 7.";
    }
    if (classification === "AMBER") {
      return "AMBER signals trending toward RED without intervention. Early action now prevents escalation. Monitor closely over next cycle.";
    }
    return "Watch item — no immediate risk, but trending data suggests attention may be needed soon.";
  }

  private generateHuddleAgenda(blocks: ActionBlock[], dashboard: OperationalDashboard): string[] {
    const agenda: string[] = [];

    if (blocks.length > 0) {
      agenda.push(`Priority: ${blocks[0].action.summary} (${blocks[0].teamName})`);
    }
    if (dashboard.careMinutes.status !== "compliant") {
      agenda.push(`Care minutes: ${dashboard.careMinutes.avgPerResident} min/resident (target 200). Review rostering for this week.`);
    }
    if (dashboard.sirs.openEvents > 0) {
      agenda.push(`SIRS: ${dashboard.sirs.openEvents} open event(s) — confirm reporting status.`);
    }
    if (dashboard.workforce.unfilledShifts > 3) {
      agenda.push(`Workforce: ${dashboard.workforce.unfilledShifts} unfilled shifts in last 14 days. Review coverage plan.`);
    }

    if (agenda.length === 0) {
      agenda.push("No urgent items — reinforce what's working well.");
      agenda.push("Review upcoming compliance deadlines.");
      agenda.push("Check in with team leaders on current priorities.");
    }

    return agenda.slice(0, 3);
  }

  private async generateNarrative(
    facility: Record<string, unknown>,
    dashboard: OperationalDashboard,
    actions: ActionBlock[]
  ): Promise<string> {
    if (!this.claudeApiKey || this.claudeApiKey === "sk-ant-your-key-here") {
      return `Monday Briefing for ${facility.name}: ${actions.length} action(s) prescribed. Care minutes ${dashboard.careMinutes.status}. ${dashboard.sirs.openEvents} open SIRS event(s). ${dashboard.psh.domainsRed} RED hazard domain(s).`;
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.claudeApiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          temperature: 0.3,
          system: "Write a concise Monday Briefing summary for a Director of Nursing. Direct, factual, specific numbers. No corporate hedging. Do not identify individual staff or residents. Max 200 words.",
          messages: [{
            role: "user",
            content: `Facility: ${facility.name}\nCare minutes: ${dashboard.careMinutes.avgPerResident} min/resident (${dashboard.careMinutes.status})\nSIRS open: ${dashboard.sirs.openEvents}\nAbsenteeism: ${dashboard.workforce.absenteeismRate}%\nUnfilled shifts: ${dashboard.workforce.unfilledShifts}\nPSH RED domains: ${dashboard.psh.domainsRed}, AMBER: ${dashboard.psh.domainsAmber}\nActions prescribed: ${actions.map((a) => a.action.summary).join("; ")}`,
          }],
        }),
      });

      if (!response.ok) return `[Briefing narrative generation failed: ${response.status}]`;
      const data = await response.json() as { content: Array<{ text: string }> };
      return data.content[0]?.text ?? "[No narrative generated]";
    } catch {
      return `Monday Briefing for ${facility.name}: ${actions.length} action(s). Review DON queue for details.`;
    }
  }
}
