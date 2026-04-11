// ============================================================================
// Signal Convergence Types
//
// Four signal types from Doc 18:
//   CAUSAL — Domain B is driving Domain A
//   PREDICTIVE — Domain B pattern precedes Domain A event
//   AMPLIFYING — Two domain problems making each other worse
//   EXONERATING — Domain A outcome explained by Domain B context
//
// Three confidence levels:
//   STRONG — Pattern in 10+ comparable facilities, statistically significant
//   EMERGING — Pattern in 3-9 facilities, correlation present
//   NOVEL — First time seen, may be important or coincidence
// ============================================================================

export type SignalType = "causal" | "predictive" | "amplifying" | "exonerating";
export type SignalConfidence = "strong" | "emerging" | "novel";
export type Domain = "clinical" | "workforce" | "financial" | "psh" | "operational" | "governance";

export interface ConvergenceSignal {
  id: string;
  type: SignalType;
  confidence: SignalConfidence;
  headline: string; // One sentence — what CHRIS detected
  domains: Domain[]; // Which canonical domains contributed
  facilityId: string;
  teamId?: string; // If team-specific

  // Detail
  explanation: string; // Full CHRIS explanation with cited data points
  dataPoints: DataPoint[]; // The specific data that supports the signal
  implication: string; // What happens if not addressed + timeline
  recommendedAction: string; // What should be done

  // Targeting
  targetRoles: string[]; // Which roles should see this signal
  ownerRole?: string; // Which role leads the response

  // Metadata
  detectedAt: Date;
  cycleId?: number;
  comparableFacilities?: number; // How many similar facilities show this pattern
}

export interface DataPoint {
  domain: Domain;
  metric: string;
  value: string | number;
  context: string; // How this data point contributes to the signal
  source: string; // Canonical table / connector
}

export interface ConvergencePanel {
  role: string;
  facilityId: string;
  signals: ConvergenceSignal[];
  generatedAt: Date;
}
