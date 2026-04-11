// ============================================================================
// Connector Framework Types
// ============================================================================

export interface ConnectorConfig {
  connectorId: string;
  facilityId: string;
  sourceSystem: string;
  credentials: Record<string, string>;
  syncFrequency: "hourly" | "6h" | "daily";
  lastSuccessfulPull: Date | null;
  isActive: boolean;
}

export interface ConnectorPullResult {
  connectorId: string;
  facilityId: string;
  sourceSystem: string;
  pulledAt: Date;
  periodStart: Date;
  periodEnd: Date;
  success: boolean;
  recordsExtracted: number;
  recordsWritten: number;
  dataFreshnessHours: number;
  errors: ConnectorError[];
  warnings: string[];
  anomalies: DataAnomaly[];
}

export interface ConnectorError {
  code: string;
  message: string;
  retryable: boolean;
}

export interface DataAnomaly {
  type: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  affectedDate?: string;
  recommendation?: string;
}

export interface ConnectorHealth {
  status: "healthy" | "degraded" | "offline";
  sourceSystem: string;
  lastSuccessfulPull: Date | null;
  error?: string;
  details?: Record<string, unknown>;
}

// PII fields that MUST be stripped at the connector boundary
export const PII_FIELDS = [
  "FirstName",
  "firstName",
  "first_name",
  "LastName",
  "lastName",
  "last_name",
  "Email",
  "email",
  "Phone",
  "phone",
  "Mobile",
  "mobile",
  "Address",
  "address",
  "TfnDeclaration",
  "DateOfBirth",
  "dateOfBirth",
  "date_of_birth",
  "EmergencyContact",
  "emergencyContact",
  "emergency_contact",
  "BankAccount",
  "bankAccount",
  "bank_account",
] as const;
