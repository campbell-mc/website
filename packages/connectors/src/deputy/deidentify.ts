// ============================================================================
// Deputy De-identification
// Strips all PII from Deputy API responses at the connector boundary.
// Individual names NEVER enter the canonical store.
// ============================================================================

import type { RoleCategory, EmploymentType } from "@chris/db";
import { mapDeputyRoleToCategory } from "./role-mapping";

// Fields stripped from Deputy employee records
const DEPUTY_PII_FIELDS = [
  "FirstName",
  "LastName",
  "DisplayName",
  "Email",
  "Phone",
  "Mobile",
  "Address1",
  "Address2",
  "Suburb",
  "PostCode",
  "TfnDeclaration",
  "DateOfBirth",
  "EmergencyContactName",
  "EmergencyContactPhone",
  "Photo",
  "CompanyName",
] as const;

export interface DeputyEmployee {
  Id: number;
  FirstName?: string;
  LastName?: string;
  DisplayName?: string;
  Email?: string;
  Phone?: string;
  Mobile?: string;
  Address1?: string;
  Address2?: string;
  Suburb?: string;
  PostCode?: string;
  TfnDeclaration?: unknown;
  DateOfBirth?: string;
  EmergencyContactName?: string;
  EmergencyContactPhone?: string;
  Photo?: string;
  CompanyName?: string;
  Role?: number;
  RoleObject?: { Name?: string };
  Active?: boolean;
  EmploymentType?: number;
  [key: string]: unknown;
}

export interface AnonymisedEmployee {
  internalId: number; // Used only for roster/timesheet mapping, never stored
  roleCategory: RoleCategory;
  employmentType: EmploymentType;
}

/**
 * Strip all PII from a Deputy employee record and return only the
 * role_category and employment_type needed for canonical aggregation.
 */
export function deidentifyEmployee(employee: DeputyEmployee): AnonymisedEmployee {
  const roleTitle = employee.RoleObject?.Name ?? "";
  const roleCategory = mapDeputyRoleToCategory(roleTitle);

  // Map Deputy employment type (integer) to canonical type
  const employmentType = mapDeputyEmploymentType(employee.EmploymentType);

  return {
    internalId: employee.Id,
    roleCategory,
    employmentType,
  };
}

/**
 * Build a lookup map from Deputy employee ID → anonymised role info.
 * The employee ID is used only during processing to link rosters/timesheets
 * to role categories — it is never written to the canonical store.
 */
export function buildEmployeeMap(
  employees: DeputyEmployee[]
): Map<number, AnonymisedEmployee> {
  const map = new Map<number, AnonymisedEmployee>();
  for (const emp of employees) {
    map.set(emp.Id, deidentifyEmployee(emp));
  }
  return map;
}

function mapDeputyEmploymentType(
  deputyType: number | undefined
): EmploymentType {
  // Deputy employment type mappings (varies by installation)
  // Common: 1=Full-time, 2=Part-time, 3=Casual
  switch (deputyType) {
    case 1:
      return "permanent_ft";
    case 2:
      return "permanent_pt";
    case 3:
      return "casual";
    default:
      return "casual"; // Default to casual if unknown
  }
}

/**
 * Verify that no PII fields exist in a record. Throws if PII is found.
 */
export function assertNoPII(record: Record<string, unknown>): void {
  for (const field of DEPUTY_PII_FIELDS) {
    if (field in record && record[field] !== undefined) {
      throw new Error(
        `PII field "${field}" found in record. De-identification failed — aborting.`
      );
    }
  }
}
