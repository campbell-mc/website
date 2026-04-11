// ============================================================================
// Governance Pack Generator
//
// Generates Board packs, committee packs with structured data sections
// and Claude API-generated narratives.
//
// CEO/DON must approve before distribution.
// ============================================================================

import { db, facilities, facilityRostering, facilityIncidents, facilityHazardScores, facilityWorkforce, facilityInterventions, donReviewItems } from "@chris/db";
import { eq, and, gte, lte, desc, sql, count } from "drizzle-orm";

export type PackType = "board" | "quality_risk" | "finance" | "people_culture" | "elt";

export interface PackRequest {
  facilityId: string;
  packType: PackType;
  periodStart: string;
  periodEnd: string;
  scheduledMeetingDate: string;
}

export interface PackSection {
  title: string;
  type: "narrative" | "structured" | "table";
  content: string | Record<string, unknown>;
}

export interface GeneratedPack {
  packId: string;
  facilityId: string;
  packType: PackType;
  periodStart: string;
  periodEnd: string;
  sections: PackSection[];
  generatedAt: Date;
  reviewItemId: string;
}

export class GovernancePackEngine {
  private claudeApiKey: string;

  constructor(claudeApiKey: string) {
    this.claudeApiKey = claudeApiKey;
  }

  async generatePack(request: PackRequest): Promise<GeneratedPack> {
    const packId = `pack-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Load facility data
    const [facility] = await db.select().from(facilities).where(eq(facilities.id, request.facilityId));
    if (!facility) throw new Error(`Facility ${request.facilityId} not found`);

    // Load canonical data for the period
    const data = await this.loadPeriodData(request.facilityId, request.periodStart, request.periodEnd);

    // Generate sections based on pack type
    let sections: PackSection[];

    if (request.packType === "board") {
      sections = await this.generateBoardPack(facility, data, request);
    } else if (request.packType === "quality_risk") {
      sections = await this.generateQualityRiskPack(facility, data, request);
    } else {
      sections = await this.generateBoardPack(facility, data, request); // Default to board format
    }

    // Create DON review item for approval
    const meetingDate = new Date(request.scheduledMeetingDate);
    const deadlineDate = new Date(meetingDate);
    deadlineDate.setDate(deadlineDate.getDate() - 2); // 2 business days before meeting

    const [reviewItem] = await db.insert(donReviewItems).values({
      facilityId: request.facilityId,
      itemType: "pack_approval",
      urgency: "routine",
      summary: `${request.packType.replace("_", " ")} pack for ${request.periodStart} to ${request.periodEnd} ready for review.`,
      fullContext: {
        packId,
        packType: request.packType,
        periodStart: request.periodStart,
        periodEnd: request.periodEnd,
        sectionTitles: sections.map((s) => s.title),
      },
      chrisRecommendation: `Review and approve before ${request.scheduledMeetingDate} meeting. Pack contains ${sections.length} sections.`,
      deadline: deadlineDate,
    }).returning({ id: donReviewItems.id });

    return {
      packId,
      facilityId: request.facilityId,
      packType: request.packType,
      periodStart: request.periodStart,
      periodEnd: request.periodEnd,
      sections,
      generatedAt: new Date(),
      reviewItemId: reviewItem.id,
    };
  }

  private async generateBoardPack(
    facility: Record<string, unknown>,
    data: PeriodData,
    request: PackRequest
  ): Promise<PackSection[]> {
    const sections: PackSection[] = [];

    // Section 1: Executive Summary (Claude API)
    const execSummary = await this.generateNarrative(
      "Write the CEO's executive summary for the Board. Three operational highlights. Three risks. One forward-looking priority. Direct and factual. Specific numbers. No corporate hedging. Do not identify individual staff or residents.",
      this.buildContextPrompt(facility, data),
      1000,
      0.3
    );
    sections.push({ title: "Executive Summary", type: "narrative", content: execSummary });

    // Section 2: Quality and Safety (structured)
    sections.push({
      title: "Quality and Safety",
      type: "structured",
      content: {
        totalIncidents: data.incidentCount,
        sirsCategory1: data.sirsCat1Count,
        sirsCategory2: data.sirsCat2Count,
        openCorrectiveActions: data.openCorrectiveActions,
        accreditationStatus: facility.accreditationStatus ?? "unknown",
        starRating: facility.starRating ?? "N/A",
        sectorBenchmark: 0.85, // Placeholder until Benchmarks product live
      },
    });

    // Section 3: Workforce and Culture (structured + narrative)
    const workforceNarrative = await this.generateNarrative(
      "Write a 200-word workforce and culture summary for the Board. Cover care minutes compliance, turnover trends, agency dependency, and psychosocial safety status. Be specific with numbers. Do not identify individuals.",
      `Care minutes compliance rate: ${data.careMinutesComplianceRate}%\nTurnover: ${data.turnoverRate}% (sector mean: 28%)\nAgency dependency: ${data.agencyDependency}% (sector mean: 12%)\nElevated PSH hazards: ${data.elevatedHazards}\nConvergence events: ${data.convergenceEvents}`,
      400,
      0.3
    );
    sections.push({
      title: "Workforce and Culture",
      type: "structured",
      content: {
        careMinutesComplianceRate: data.careMinutesComplianceRate,
        avgCareMinutesPerResident: data.avgCareMinutes,
        turnoverRate: data.turnoverRate,
        sectorTurnover: 28,
        agencyDependency: data.agencyDependency,
        sectorAgency: 12,
        elevatedHazards: data.elevatedHazards,
        convergenceEvents: data.convergenceEvents,
        narrative: workforceNarrative,
      },
    });

    // Section 4: Financial (structured — placeholder)
    sections.push({
      title: "Financial Summary",
      type: "structured",
      content: {
        note: "Financial data integration pending (requires TechnologyOne/Xero connector).",
        workforceCostIndicator: data.totalStaff > 0 ? "Available from HR connector" : "No data",
      },
    });

    // Section 5: Strategic Risks (Claude API)
    const risksNarrative = await this.generateNarrative(
      "Identify 3-5 strategic risks based on the operational data. For each: name, likelihood (H/M/L), impact (H/M/L), mitigation, Board action. Ground each risk in the specific data provided.",
      this.buildContextPrompt(facility, data),
      600,
      0.3
    );
    sections.push({ title: "Strategic Risks", type: "narrative", content: risksNarrative });

    // Section 6: Decisions Required (Claude API)
    const decisionsNarrative = await this.generateNarrative(
      "What decisions does the Board need to make today? Maximum 3. Each must be a genuine decision (not just awareness). Provide resolution text and supporting rationale.",
      this.buildContextPrompt(facility, data),
      300,
      0.3
    );
    sections.push({ title: "Decisions Required", type: "narrative", content: decisionsNarrative });

    return sections;
  }

  private async generateQualityRiskPack(
    facility: Record<string, unknown>,
    data: PeriodData,
    request: PackRequest
  ): Promise<PackSection[]> {
    // Q&R pack: more operational detail than Board pack
    const sections: PackSection[] = [];

    sections.push({
      title: "SIRS Deep Dive",
      type: "structured",
      content: {
        category1Incidents: data.sirsCat1Count,
        category2Incidents: data.sirsCat2Count,
        totalIncidents: data.incidentCount,
        openCorrectiveActions: data.openCorrectiveActions,
        incidentsByCategory: data.incidentsByCategory,
      },
    });

    sections.push({
      title: "PSH Hazard Summary",
      type: "structured",
      content: {
        elevatedDomains: data.elevatedHazards,
        convergenceEvents: data.convergenceEvents,
        interventionOutcomes: data.interventionOutcomes,
      },
    });

    sections.push({
      title: "Care Minutes Compliance",
      type: "structured",
      content: {
        complianceRate: data.careMinutesComplianceRate,
        avgPerResident: data.avgCareMinutes,
        daysNonCompliant: data.daysNonCompliant,
      },
    });

    return sections;
  }

  private async loadPeriodData(facilityId: string, periodStart: string, periodEnd: string): Promise<PeriodData> {
    // Rostering data
    const rosteringRows = await db.select().from(facilityRostering).where(
      and(eq(facilityRostering.facilityId, facilityId), gte(facilityRostering.shiftDate, periodStart), lte(facilityRostering.shiftDate, periodEnd))
    );

    const compliantDays = rosteringRows.filter((r) => r.careMinutesComplianceStatus === "compliant").length;
    const totalDays = rosteringRows.length;
    const careMinutesComplianceRate = totalDays > 0 ? Math.round((compliantDays / totalDays) * 100) : 0;
    const avgCareMinutes = totalDays > 0
      ? rosteringRows.reduce((s, r) => s + Number(r.actualTotalMinutes ?? 0), 0) / totalDays
      : 0;
    const daysNonCompliant = rosteringRows.filter((r) => r.careMinutesComplianceStatus === "non_compliant").length;

    // Incidents
    const incidents = await db.select().from(facilityIncidents).where(
      and(eq(facilityIncidents.facilityId, facilityId), gte(facilityIncidents.incidentDate, periodStart), lte(facilityIncidents.incidentDate, periodEnd))
    );

    const incidentsByCategory: Record<string, number> = {};
    for (const inc of incidents) {
      incidentsByCategory[inc.incidentCategory] = (incidentsByCategory[inc.incidentCategory] ?? 0) + 1;
    }

    // Workforce
    const workforce = await db.select().from(facilityWorkforce).where(eq(facilityWorkforce.facilityId, facilityId));
    const totalStaff = workforce.reduce((s, w) => s + w.headcount, 0);
    const totalTerminations = workforce.reduce((s, w) => s + (w.terminations ?? 0), 0);
    const totalAgencyHours = workforce.reduce((s, w) => s + Number(w.agencyHours ?? 0), 0);
    const totalHours = totalStaff * 38 * 4; // Rough estimate: 38h/week * 4 weeks
    const turnoverRate = totalStaff > 0 ? Math.round((totalTerminations / totalStaff) * 100) : 0;
    const agencyDependency = totalHours > 0 ? Math.round((totalAgencyHours / totalHours) * 100) : 0;

    // Hazard scores
    const hazards = await db.select().from(facilityHazardScores).where(eq(facilityHazardScores.facilityId, facilityId));
    const elevatedHazards = hazards.filter((h) => Number(h.overallScore ?? 0) > 0.5).length;
    const convergenceEvents = hazards.filter((h) => h.convergenceDetected).length;

    // Interventions
    const interventions = await db.select().from(facilityInterventions).where(eq(facilityInterventions.facilityId, facilityId));
    const interventionOutcomes = {
      reduced: interventions.filter((i) => i.outcome === "hazard_reduced").length,
      noChange: interventions.filter((i) => i.outcome === "no_change").length,
      worsened: interventions.filter((i) => i.outcome === "hazard_worsened").length,
    };

    return {
      incidentCount: incidents.length,
      sirsCat1Count: incidents.filter((i) => i.sirsCategory === 1).length,
      sirsCat2Count: incidents.filter((i) => i.sirsCategory === 2).length,
      openCorrectiveActions: incidents.filter((i) => i.correctiveActionRequired && !i.correctiveActionCompletedAt).length,
      incidentsByCategory,
      careMinutesComplianceRate,
      avgCareMinutes: Math.round(avgCareMinutes * 10) / 10,
      daysNonCompliant,
      totalStaff,
      turnoverRate,
      agencyDependency,
      elevatedHazards,
      convergenceEvents,
      interventionOutcomes,
    };
  }

  private buildContextPrompt(facility: Record<string, unknown>, data: PeriodData): string {
    return `Facility: ${facility.name ?? "Unknown"} (${facility.facilityType ?? "residential"})
Beds: ${facility.operationalBeds ?? "N/A"}
Total incidents this period: ${data.incidentCount} (SIRS Cat 1: ${data.sirsCat1Count}, Cat 2: ${data.sirsCat2Count})
Open corrective actions: ${data.openCorrectiveActions}
Care minutes compliance rate: ${data.careMinutesComplianceRate}%
Avg care minutes per resident: ${data.avgCareMinutes}
Days non-compliant: ${data.daysNonCompliant}
Staff count: ${data.totalStaff}
Turnover: ${data.turnoverRate}% (sector mean: 28%)
Agency dependency: ${data.agencyDependency}% (sector mean: 12%)
Elevated PSH hazards: ${data.elevatedHazards}
Convergence events: ${data.convergenceEvents}
Interventions: ${data.interventionOutcomes.reduced} reduced, ${data.interventionOutcomes.noChange} no change, ${data.interventionOutcomes.worsened} worsened`;
  }

  private async generateNarrative(
    systemPrompt: string,
    context: string,
    maxTokens: number,
    temperature: number
  ): Promise<string> {
    if (!this.claudeApiKey || this.claudeApiKey === "sk-ant-your-key-here") {
      return `[Narrative generation requires Claude API key. Context: ${context.slice(0, 200)}...]`;
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
          max_tokens: maxTokens,
          temperature,
          system: systemPrompt,
          messages: [{ role: "user", content: context }],
        }),
      });

      if (!response.ok) {
        return `[Claude API error: ${response.status}. Narrative could not be generated.]`;
      }

      const data = await response.json() as { content: Array<{ text: string }> };
      return data.content[0]?.text ?? "[No response from Claude API]";
    } catch (err) {
      return `[Narrative generation failed: ${err instanceof Error ? err.message : "unknown error"}]`;
    }
  }
}

interface PeriodData {
  incidentCount: number;
  sirsCat1Count: number;
  sirsCat2Count: number;
  openCorrectiveActions: number;
  incidentsByCategory: Record<string, number>;
  careMinutesComplianceRate: number;
  avgCareMinutes: number;
  daysNonCompliant: number;
  totalStaff: number;
  turnoverRate: number;
  agencyDependency: number;
  elevatedHazards: number;
  convergenceEvents: number;
  interventionOutcomes: { reduced: number; noChange: number; worsened: number };
}
