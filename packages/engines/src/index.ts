export { CareMinutesEngine } from "./care-minutes/index";
export type { CareMinutesResult, RollingResult, MonthlyReport } from "./care-minutes/index";

export { classifyIncident, submitSIRSReport, checkDeadlines } from "./sirs/index";
export type { SIRSClassification, SIRSDraftReport, DeadlineAlert } from "./sirs/index";

export { GovernancePackEngine, distributePack } from "./governance/index";
export type { PackType, PackRequest, PackSection, GeneratedPack } from "./governance/index";

export { SagaTransaction } from "./saga";

export { PulseEngine } from "./pulse/index";
export { PULSE_DOMAINS, PSH_DOMAINS, classifyHazardScore, calculateTrajectory } from "./pulse/domains";
export type { PulseDomain, HazardClassification, Trajectory } from "./pulse/domains";
export type { PulseResponse, HazardFlag, ConvergenceResult, PulseCycleResult } from "./pulse/index";

export { MondayBriefingEngine, PracticeSelector } from "./monday-briefing/index";
export type { MondayBriefing, ActionBlock, OperationalDashboard, MicroPractice, PracticeSelection } from "./monday-briefing/index";

export { scoreAudit, COMPLY_QUESTIONS } from "./comply/scoring";
export type { ComplyResult, ComplyQuestion, ComplyAnswer } from "./comply/scoring";

// Execution Layer (Doc 17)
export { TrustEngine } from "./trust/index";
export type { TrustResult, TrustComponents, TrustSampleSizes } from "./trust/index";
export {
  loadPrior, updatePrior, posteriorMean, posteriorVariance,
  credibleIntervalWidth, betaSample, decayPriors,
} from "./trust/bayesian";
export type { BetaPrior } from "./trust/bayesian";
export { MonitoringEngine } from "./monitoring/index";
export type { MonitorSignal } from "./monitoring/index";
export { ExecutionLoop } from "./execution/index";
export type { ExecutionResult } from "./execution/index";
