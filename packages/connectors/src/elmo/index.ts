// ============================================================================
// ELMO Connector
// HR/Payroll connector — covers headcount, turnover, sick leave,
// training compliance. Does NOT provide rostering data.
//
// Auth: OAuth2 with per-tenant scoping
// Rate limit: 200 requests/hour
// Stale threshold: 50 hours (HR data changes less frequently)
// ============================================================================

import { BaseConnector } from "../base";
import type {
  ConnectorConfig,
  ConnectorPullResult,
  ConnectorHealth,
  DataAnomaly,
} from "../types";
import { mapElmoRoleToCategory } from "./role-mapping";
import type { RoleCategory, EmploymentType } from "@chris/db";
import { db, facilityWorkforce, facilityTrainingCompliance, facilities } from "@chris/db";
import { eq, sql } from "drizzle-orm";

// ELMO employment type mapping
const ELMO_EMPLOYMENT_TYPE: Record<string, EmploymentType> = {
  FULL_TIME: "permanent_ft",
  PART_TIME: "permanent_pt",
  CASUAL: "casual",
  CONTRACTOR: "contract",
  AGENCY: "agency",
};

interface AnonymisedEmployee {
  internalId: number;
  roleCategory: RoleCategory;
  employmentType: EmploymentType;
  startDate?: string;
  terminationDate?: string;
  terminationVoluntary?: boolean;
}

interface TrainingRecord {
  trainingType: string;
  roleCategory: RoleCategory;
  completed: boolean;
  expiryDate?: string;
}

interface ProcessedElmoData {
  workforce: Array<{
    roleCategory: RoleCategory;
    employmentType: EmploymentType;
    headcount: number;
    fte: number;
    newStarters: number;
    terminations: number;
    voluntaryTerminations: number;
    sickLeaveHours: number;
    sickLeaveOccasions: number;
    workersCompHours: number;
  }>;
  training: Array<{
    trainingType: string;
    roleCategory: RoleCategory;
    eligibleStaff: number;
    compliantStaff: number;
    complianceRate: number;
    expiringWithin30d: number;
  }>;
}

export class ElmoConnector extends BaseConnector {
  private baseUrl: string;
  private accessToken: string;

  constructor(config: ConnectorConfig) {
    super(config);
    this.baseUrl = config.credentials.baseUrl ?? "";
    this.accessToken = config.credentials.accessToken ?? "";
  }

  async pull(since: Date): Promise<ConnectorPullResult> {
    const errors: ConnectorPullResult["errors"] = [];
    const warnings: string[] = [];
    const until = new Date();

    try {
      // 1. Fetch and de-identify employees
      const employees = await this.fetchAndDeidentifyEmployees(since, until);

      // 2. Fetch leave records
      const leaveData = await this.fetchLeave(since, until, employees);

      // 3. Fetch training compliance
      const trainingData = await this.fetchTraining(employees);

      // 4. Aggregate
      const processed = this.aggregate(employees, leaveData, trainingData, since, until);

      // 5. Anomalies
      const anomalies = this.detectAnomalies(processed);

      // 6. Write to canonical
      const recordsWritten = await this.writeToCanonical(processed, since, until);

      return this.buildResult({
        periodStart: since,
        periodEnd: until,
        recordsExtracted: employees.length,
        recordsWritten,
        errors,
        warnings,
        anomalies,
      });
    } catch (err) {
      errors.push({
        code: "PULL_FAILED",
        message: err instanceof Error ? err.message : String(err),
        retryable: true,
      });
      return this.buildResult({
        periodStart: since,
        periodEnd: until,
        recordsExtracted: 0,
        recordsWritten: 0,
        errors,
        warnings,
        anomalies: [],
      });
    }
  }

  async healthCheck(): Promise<ConnectorHealth> {
    try {
      const response = await this.fetchWithRetry(
        `${this.baseUrl}/api/v1/health`,
        { headers: { Authorization: `Bearer ${this.accessToken}` } },
        0
      );

      if (response.ok) {
        return { status: "healthy", sourceSystem: "elmo", lastSuccessfulPull: this.config.lastSuccessfulPull };
      }
      if (response.status === 401) {
        return { status: "degraded", sourceSystem: "elmo", lastSuccessfulPull: this.config.lastSuccessfulPull, error: "authentication_failed" };
      }
      return { status: "degraded", sourceSystem: "elmo", lastSuccessfulPull: this.config.lastSuccessfulPull, error: `http_${response.status}` };
    } catch {
      return { status: "degraded", sourceSystem: "elmo", lastSuccessfulPull: this.config.lastSuccessfulPull, error: "timeout" };
    }
  }

  private async fetchAndDeidentifyEmployees(
    since: Date,
    until: Date
  ): Promise<AnonymisedEmployee[]> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/v1/employees?includeTerminated=true`,
      { headers: { Authorization: `Bearer ${this.accessToken}` } }
    );
    if (!response.ok) throw new Error(`ELMO employees fetch failed: ${response.status}`);

    const raw = await response.json() as Array<{
      Id: number;
      JobTitle?: string;
      EmploymentType?: string;
      StartDate?: string;
      TerminationDate?: string;
      TerminationReason?: string;
      // PII fields — stripped immediately
      FirstName?: string;
      LastName?: string;
      Email?: string;
      DateOfBirth?: string;
      Address?: string;
      TFN?: string;
      EmployeeId?: string;
      [key: string]: unknown;
    }>;

    // De-identify: strip all PII, keep only aggregation fields
    return raw.map((emp) => ({
      internalId: emp.Id,
      roleCategory: mapElmoRoleToCategory(emp.JobTitle ?? ""),
      employmentType: ELMO_EMPLOYMENT_TYPE[emp.EmploymentType ?? ""] ?? "casual",
      startDate: emp.StartDate,
      terminationDate: emp.TerminationDate,
      terminationVoluntary: emp.TerminationReason?.toLowerCase().includes("resign") ||
        emp.TerminationReason?.toLowerCase().includes("voluntary"),
    }));
  }

  private async fetchLeave(
    since: Date,
    until: Date,
    employees: AnonymisedEmployee[]
  ): Promise<Map<number, { sickHours: number; sickOccasions: number; workersCompHours: number }>> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/v1/leave?from=${since.toISOString()}&to=${until.toISOString()}`,
      { headers: { Authorization: `Bearer ${this.accessToken}` } }
    );
    if (!response.ok) throw new Error(`ELMO leave fetch failed: ${response.status}`);

    const raw = await response.json() as Array<{
      EmployeeId: number;
      LeaveType: string;
      ApprovedHours: number;
      [key: string]: unknown;
    }>;

    const leaveMap = new Map<number, { sickHours: number; sickOccasions: number; workersCompHours: number }>();

    for (const leave of raw) {
      if (!leaveMap.has(leave.EmployeeId)) {
        leaveMap.set(leave.EmployeeId, { sickHours: 0, sickOccasions: 0, workersCompHours: 0 });
      }
      const entry = leaveMap.get(leave.EmployeeId)!;
      const type = leave.LeaveType?.toLowerCase() ?? "";

      if (type.includes("sick") || type.includes("personal")) {
        entry.sickHours += leave.ApprovedHours;
        entry.sickOccasions++;
      } else if (type.includes("workers") || type.includes("comp")) {
        entry.workersCompHours += leave.ApprovedHours;
      }
    }

    return leaveMap;
  }

  private async fetchTraining(
    employees: AnonymisedEmployee[]
  ): Promise<TrainingRecord[]> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}/api/v1/training/compliance`,
      { headers: { Authorization: `Bearer ${this.accessToken}` } }
    );
    if (!response.ok) throw new Error(`ELMO training fetch failed: ${response.status}`);

    const raw = await response.json() as Array<{
      EmployeeId: number;
      TrainingName: string;
      CompletionDate?: string;
      ExpiryDate?: string;
      Status: string;
      [key: string]: unknown;
    }>;

    // De-identify: map EmployeeId to role_category then discard
    const empLookup = new Map(employees.map((e) => [e.internalId, e]));

    return raw
      .filter((t) => empLookup.has(t.EmployeeId))
      .map((t) => ({
        trainingType: this.normalizeTrainingType(t.TrainingName),
        roleCategory: empLookup.get(t.EmployeeId)!.roleCategory,
        completed: t.Status?.toLowerCase() === "completed",
        expiryDate: t.ExpiryDate,
      }));
  }

  private normalizeTrainingType(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes("fire")) return "mandatory_fire_safety";
    if (lower.includes("manual handling") || lower.includes("manual hand")) return "manual_handling";
    if (lower.includes("medication")) return "medication_management";
    if (lower.includes("infection")) return "infection_control";
    if (lower.includes("dementia")) return "dementia_care";
    if (lower.includes("ahpra")) return "ahpra_registration";
    if (lower.includes("working with children") || lower.includes("wwc")) return "wwc";
    if (lower.includes("first aid")) return "first_aid";
    if (lower.includes("cpr")) return "cpr";
    if (lower.includes("food") || lower.includes("hygiene")) return "food_safety";
    return "other";
  }

  private aggregate(
    employees: AnonymisedEmployee[],
    leaveData: Map<number, { sickHours: number; sickOccasions: number; workersCompHours: number }>,
    trainingData: TrainingRecord[],
    since: Date,
    until: Date
  ): ProcessedElmoData {
    // Workforce aggregation
    const wfMap = new Map<string, ProcessedElmoData["workforce"][0]>();

    for (const emp of employees) {
      const key = `${emp.roleCategory}:${emp.employmentType}`;
      if (!wfMap.has(key)) {
        wfMap.set(key, {
          roleCategory: emp.roleCategory,
          employmentType: emp.employmentType,
          headcount: 0,
          fte: 0,
          newStarters: 0,
          terminations: 0,
          voluntaryTerminations: 0,
          sickLeaveHours: 0,
          sickLeaveOccasions: 0,
          workersCompHours: 0,
        });
      }

      const wf = wfMap.get(key)!;
      wf.headcount++;

      // New starters in period
      if (emp.startDate && new Date(emp.startDate) >= since && new Date(emp.startDate) <= until) {
        wf.newStarters++;
      }

      // Terminations in period
      if (emp.terminationDate && new Date(emp.terminationDate) >= since && new Date(emp.terminationDate) <= until) {
        wf.terminations++;
        if (emp.terminationVoluntary) wf.voluntaryTerminations++;
      }

      // Leave data
      const leave = leaveData.get(emp.internalId);
      if (leave) {
        wf.sickLeaveHours += leave.sickHours;
        wf.sickLeaveOccasions += leave.sickOccasions;
        wf.workersCompHours += leave.workersCompHours;
      }
    }

    // Training aggregation
    const trainingMap = new Map<string, ProcessedElmoData["training"][0]>();
    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    for (const t of trainingData) {
      const key = `${t.trainingType}:${t.roleCategory}`;
      if (!trainingMap.has(key)) {
        trainingMap.set(key, {
          trainingType: t.trainingType,
          roleCategory: t.roleCategory,
          eligibleStaff: 0,
          compliantStaff: 0,
          complianceRate: 0,
          expiringWithin30d: 0,
        });
      }

      const entry = trainingMap.get(key)!;
      entry.eligibleStaff++;
      if (t.completed) entry.compliantStaff++;
      if (t.expiryDate && new Date(t.expiryDate) <= thirtyDays && new Date(t.expiryDate) > now) {
        entry.expiringWithin30d++;
      }
    }

    // Calculate compliance rates
    for (const entry of trainingMap.values()) {
      entry.complianceRate = entry.eligibleStaff > 0
        ? entry.compliantStaff / entry.eligibleStaff
        : 0;
    }

    return {
      workforce: Array.from(wfMap.values()),
      training: Array.from(trainingMap.values()),
    };
  }

  detectAnomalies(data: ProcessedElmoData): DataAnomaly[] {
    const anomalies: DataAnomaly[] = [];

    // Turnover spike: terminations > 10% of headcount
    for (const wf of data.workforce) {
      if (wf.headcount > 0 && wf.terminations / wf.headcount > 0.1) {
        anomalies.push({
          type: "turnover_spike",
          description: `${wf.roleCategory} (${wf.employmentType}): ${wf.terminations} terminations out of ${wf.headcount} staff (${Math.round((wf.terminations / wf.headcount) * 100)}%).`,
          severity: "medium",
          recommendation: "Review exit interview data. Check for systemic issues in this role category.",
        });
      }
    }

    // Training compliance drop
    for (const t of data.training) {
      if (t.complianceRate < 0.8 && t.eligibleStaff >= 5) {
        anomalies.push({
          type: "training_compliance_low",
          description: `${t.trainingType} compliance at ${Math.round(t.complianceRate * 100)}% for ${t.roleCategory} (${t.compliantStaff}/${t.eligibleStaff}).`,
          severity: t.complianceRate < 0.5 ? "high" : "medium",
          recommendation: "Schedule training sessions. Non-compliance affects accreditation.",
        });
      }

      // Expiring training
      if (t.expiringWithin30d > 0) {
        anomalies.push({
          type: "training_expiring",
          description: `${t.expiringWithin30d} ${t.roleCategory} staff have ${t.trainingType} expiring within 30 days.`,
          severity: "medium",
          recommendation: "Schedule renewal training to maintain compliance.",
        });
      }
    }

    return anomalies;
  }

  private async writeToCanonical(
    data: ProcessedElmoData,
    since: Date,
    until: Date
  ): Promise<number> {
    let written = 0;
    const periodStart = since.toISOString().split("T")[0];
    const periodEnd = until.toISOString().split("T")[0];

    // Workforce rows
    for (const wf of data.workforce) {
      const turnoverRate = wf.headcount > 0 ? wf.terminations / wf.headcount : 0;
      const absenteeismRate = wf.headcount > 0 ? wf.sickLeaveOccasions / wf.headcount : 0;

      await db.insert(facilityWorkforce).values({
        facilityId: this.config.facilityId,
        periodStart,
        periodEnd,
        sourceSystem: "elmo",
        roleCategory: wf.roleCategory,
        employmentType: wf.employmentType,
        headcount: wf.headcount,
        fte: String(wf.fte || wf.headcount),
        newStarters: wf.newStarters,
        terminations: wf.terminations,
        voluntaryTerminations: wf.voluntaryTerminations,
        sickLeaveHours: String(wf.sickLeaveHours),
        sickLeaveOccasions: wf.sickLeaveOccasions,
        workersCompHours: String(wf.workersCompHours),
        turnoverRate: String(turnoverRate),
        absenteeismRate: String(absenteeismRate),
      }).onConflictDoUpdate({
        target: [
          facilityWorkforce.facilityId, facilityWorkforce.periodStart,
          facilityWorkforce.periodEnd, facilityWorkforce.roleCategory,
          facilityWorkforce.employmentType, facilityWorkforce.sourceSystem,
        ],
        set: {
          headcount: wf.headcount,
          newStarters: wf.newStarters,
          terminations: wf.terminations,
          voluntaryTerminations: wf.voluntaryTerminations,
          sickLeaveHours: String(wf.sickLeaveHours),
          sickLeaveOccasions: wf.sickLeaveOccasions,
          workersCompHours: String(wf.workersCompHours),
          turnoverRate: String(turnoverRate),
          absenteeismRate: String(absenteeismRate),
          ingestedAt: sql`NOW()`,
        },
      });
      written++;
    }

    // Training compliance rows
    for (const t of data.training) {
      await db.insert(facilityTrainingCompliance).values({
        facilityId: this.config.facilityId,
        periodStart,
        periodEnd,
        trainingType: t.trainingType,
        roleCategory: t.roleCategory,
        eligibleStaff: t.eligibleStaff,
        compliantStaff: t.compliantStaff,
        complianceRate: String(t.complianceRate),
        expiringWithin30d: t.expiringWithin30d,
        sourceSystem: "elmo",
      }).onConflictDoUpdate({
        target: [
          facilityTrainingCompliance.facilityId, facilityTrainingCompliance.periodStart,
          facilityTrainingCompliance.trainingType, facilityTrainingCompliance.roleCategory,
        ],
        set: {
          eligibleStaff: t.eligibleStaff,
          compliantStaff: t.compliantStaff,
          complianceRate: String(t.complianceRate),
          expiringWithin30d: t.expiringWithin30d,
          ingestedAt: sql`NOW()`,
        },
      });
      written++;
    }

    await db.update(facilities).set({ lastIngestionAt: new Date() }).where(eq(facilities.id, this.config.facilityId));
    return written;
  }
}
