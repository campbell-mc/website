// ============================================================================
// CHRIS Context Builder
// Assembles all facility context before each agent run.
// Adapted from Prism's context-builder — aged care data model.
// ============================================================================

import { db, facilities, facilityRostering, facilityIncidents, facilityHazardScores, facilityWorkforce, donReviewItems, evidenceRecords } from "@chris/db";
import { eq, and, gte, desc } from "drizzle-orm";

export interface FacilityContext {
  facility: {
    id: string;
    name: string;
    type: string;
    beds: number;
    state: string;
  };
  careMinutes: {
    todayTotal: number;
    todayRn: number;
    complianceStatus: string;
    consecutiveAtRisk: number;
  };
  sirs: {
    openCat1: number;
    openCat2: number;
    approachingDeadline: number;
  };
  workforce: {
    totalStaff: number;
    agencyPct: number;
    absenteeismRate: number;
    turnoverRate: number;
  };
  psh: {
    elevatedTeams: number;
    convergenceEvents: number;
    criticalDomains: string[];
  };
  queue: {
    immediate: number;
    urgent: number;
    routine: number;
  };
  connectors: {
    lastIngestion: Date | null;
    hoursStale: number;
    allHealthy: boolean;
  };
}

/**
 * Build the complete facility context for an agent run.
 * All queries run in parallel for speed.
 */
export async function buildFacilityContext(facilityId: string): Promise<FacilityContext> {
  const today = new Date().toISOString().split("T")[0];
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [facilityRow, rostering, incidents, hazards, workforce, queueItems] = await Promise.all([
    db.select().from(facilities).where(eq(facilities.id, facilityId)).then((r) => r[0]),
    db.select().from(facilityRostering).where(and(eq(facilityRostering.facilityId, facilityId), eq(facilityRostering.shiftDate, today))),
    db.select().from(facilityIncidents).where(and(eq(facilityIncidents.facilityId, facilityId), gte(facilityIncidents.incidentDate, fourteenDaysAgo))),
    db.select().from(facilityHazardScores).where(eq(facilityHazardScores.facilityId, facilityId)).orderBy(desc(facilityHazardScores.cycleId)).limit(20),
    db.select().from(facilityWorkforce).where(eq(facilityWorkforce.facilityId, facilityId)),
    db.select().from(donReviewItems).where(and(eq(donReviewItems.facilityId, facilityId), eq(donReviewItems.status, "pending"))),
  ]);

  // Care minutes
  const todayTotal = rostering.reduce((s, r) => s + Number(r.actualTotalMinutes ?? 0), 0);
  const todayRn = rostering.reduce((s, r) => s + Number(r.actualRnMinutes ?? 0), 0);
  const beds = facilityRow?.operationalBeds ?? 0;
  const perResidentTotal = beds > 0 ? todayTotal / beds : 0;
  const perResidentRn = beds > 0 ? todayRn / beds : 0;

  // SIRS
  const openCat1 = incidents.filter((i) => i.sirsCategory === 1 && !i.sirsReportedAt).length;
  const openCat2 = incidents.filter((i) => i.sirsCategory === 2 && !i.sirsReportedAt).length;
  const approaching = incidents.filter((i) => {
    if (!i.sirsReportingDeadline || i.sirsReportedAt) return false;
    return (new Date(i.sirsReportingDeadline).getTime() - Date.now()) < 48 * 3600000;
  }).length;

  // Workforce
  const totalStaff = workforce.reduce((s, w) => s + w.headcount, 0);
  const totalAgency = workforce.reduce((s, w) => s + Number(w.agencyHours ?? 0), 0);
  const totalHours = totalStaff * 38;
  const avgAbsenteeism = workforce.length > 0 ? workforce.reduce((s, w) => s + Number(w.absenteeismRate ?? 0), 0) / workforce.length : 0;
  const avgTurnover = workforce.length > 0 ? workforce.reduce((s, w) => s + Number(w.turnoverRate ?? 0), 0) / workforce.length : 0;

  // PSH
  const latestCycle = hazards[0]?.cycleId ?? 0;
  const currentHazards = hazards.filter((h) => h.cycleId === latestCycle);
  const elevated = currentHazards.filter((h) => Number(h.overallScore ?? 0) > 0.6).length;
  const convergence = currentHazards.filter((h) => h.convergenceDetected).length;
  const critical = currentHazards
    .filter((h) => Number(h.overallScore ?? 0) > 0.85)
    .map((h) => h.teamId);

  // Queue
  const immediate = queueItems.filter((q) => q.urgency === "immediate").length;
  const urgent = queueItems.filter((q) => q.urgency === "urgent").length;
  const routine = queueItems.filter((q) => q.urgency === "routine").length;

  // Connector health
  const lastIngestion = facilityRow?.lastIngestionAt ? new Date(facilityRow.lastIngestionAt) : null;
  const hoursStale = lastIngestion ? (Date.now() - lastIngestion.getTime()) / 3600000 : -1;

  return {
    facility: {
      id: facilityId,
      name: facilityRow?.name ?? "Unknown",
      type: facilityRow?.facilityType ?? "residential",
      beds,
      state: facilityRow?.state ?? "",
    },
    careMinutes: {
      todayTotal: Math.round(perResidentTotal * 10) / 10,
      todayRn: Math.round(perResidentRn * 10) / 10,
      complianceStatus: perResidentTotal >= 200 && perResidentRn >= 40 ? "compliant" : perResidentTotal >= 190 ? "at_risk" : "non_compliant",
      consecutiveAtRisk: 0, // TODO: calculate from prior days
    },
    sirs: { openCat1, openCat2, approachingDeadline: approaching },
    workforce: {
      totalStaff,
      agencyPct: totalHours > 0 ? Math.round((totalAgency / totalHours) * 100) : 0,
      absenteeismRate: Math.round(avgAbsenteeism * 1000) / 10,
      turnoverRate: Math.round(avgTurnover * 1000) / 10,
    },
    psh: { elevatedTeams: elevated, convergenceEvents: convergence, criticalDomains: critical },
    queue: { immediate, urgent, routine },
    connectors: {
      lastIngestion,
      hoursStale: Math.round(hoursStale * 10) / 10,
      allHealthy: hoursStale >= 0 && hoursStale < 26,
    },
  };
}
