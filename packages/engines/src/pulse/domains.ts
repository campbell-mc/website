// ============================================================================
// Pulse Domains and PSH Hazard Mapping
//
// 14 culture outcome domains, each with 10 questions (140 total).
// Questions are rotated across cycles to prevent survey fatigue.
// Each domain maps to one or more PSH hazard codes (ISO 45003).
// ============================================================================

export interface PulseDomain {
  id: string;
  name: string;
  description: string;
  category: "individual" | "team" | "leadership";
  pshMapping: string[]; // PSH hazard codes this domain feeds
}

export const PULSE_DOMAINS: PulseDomain[] = [
  { id: "engagement", name: "Engagement", description: "Staff connection to work, motivation, and discretionary effort", category: "individual", pshMapping: ["PSH_01", "PSH_12"] },
  { id: "psychological_safety", name: "Psychological Safety", description: "Feeling safe to speak up, make mistakes, and be yourself", category: "team", pshMapping: ["PSH_11", "PSH_10"] },
  { id: "recognition", name: "Recognition & Appreciation", description: "Feeling valued and acknowledged for contributions", category: "individual", pshMapping: ["PSH_13"] },
  { id: "culture_climate", name: "Culture & Climate", description: "Overall work environment, morale, and organisational atmosphere", category: "team", pshMapping: ["PSH_03", "PSH_07"] },
  { id: "belonging", name: "Belonging", description: "Feeling included, respected, and part of the team", category: "individual", pshMapping: ["PSH_05", "PSH_09"] },
  { id: "collaboration", name: "Collaboration & Coordination", description: "Quality of teamwork, handovers, and cross-team communication", category: "team", pshMapping: ["PSH_06", "PSH_04"] },
  { id: "trust", name: "Trust", description: "Confidence in colleagues, leaders, and the organisation", category: "team", pshMapping: ["PSH_03"] },
  { id: "team_learning", name: "Team Learning & Adaptability", description: "Capacity to learn, improve, and adapt to change together", category: "team", pshMapping: ["PSH_07", "PSH_04"] },
  { id: "team_performance", name: "Team Performance", description: "Collective effectiveness, quality of care, and team results", category: "team", pshMapping: ["PSH_01"] },
  { id: "clarity", name: "Clarity & Accountability", description: "Clear expectations, responsibilities, and follow-through", category: "leadership", pshMapping: ["PSH_06", "PSH_04"] },
  { id: "purpose", name: "Purpose & Vision Alignment", description: "Connection to organisational mission and strategic direction", category: "leadership", pshMapping: ["PSH_12", "PSH_08"] },
  { id: "leadership", name: "Leadership Effectiveness", description: "Quality of leadership support, communication, and decision-making", category: "leadership", pshMapping: ["PSH_02", "PSH_13"] },
  { id: "decision_quality", name: "Decision-Making Quality", description: "How decisions are made, communicated, and implemented", category: "leadership", pshMapping: ["PSH_04", "PSH_03"] },
  { id: "role_clarity", name: "Role Clarity", description: "Understanding of individual role, scope, and boundaries", category: "individual", pshMapping: ["PSH_06", "PSH_15"] },
];

// PSH domain labels (ISO 45003)
export const PSH_DOMAINS = {
  PSH_01: { code: "PSH_01", name: "High Job Demands", isoRef: "ISO 45003:6.1.2", whsRef: "WHS_PSH_Code:3.1" },
  PSH_02: { code: "PSH_02", name: "Lack of Support", isoRef: "ISO 45003:6.1.6" },
  PSH_03: { code: "PSH_03", name: "Poor Organisational Justice", isoRef: "ISO 45003:6.1.6" },
  PSH_04: { code: "PSH_04", name: "Low Job Control", isoRef: "ISO 45003:6.1.3", whsRef: "WHS_PSH_Code:3.2" },
  PSH_05: { code: "PSH_05", name: "Poor Relationships", isoRef: "ISO 45003:6.1.5", whsRef: "WHS_PSH_Code:3.5" },
  PSH_06: { code: "PSH_06", name: "Role Conflict", isoRef: "ISO 45003:6.1.1" },
  PSH_07: { code: "PSH_07", name: "Change Management", isoRef: "ISO 45003:6.1.4" },
  PSH_08: { code: "PSH_08", name: "Traumatic Exposure", isoRef: "ISO 45003:6.1.7", whsRef: "WHS_PSH_Code:3.7" },
  PSH_09: { code: "PSH_09", name: "Remote / Isolated Work", whsRef: "WHS_PSH_Code:3.8" },
  PSH_10: { code: "PSH_10", name: "Violence & Aggression", isoRef: "ISO 45003:6.1.5" },
  PSH_11: { code: "PSH_11", name: "Harassment & Bullying", isoRef: "ISO 45003:6.1.5", whsRef: "WHS_PSH_Code:3.4" },
  PSH_12: { code: "PSH_12", name: "Emotional Demands", isoRef: "ISO 45003:6.1.2" },
  PSH_13: { code: "PSH_13", name: "Low Recognition", isoRef: "ISO 45003:6.1.6" },
  PSH_14: { code: "PSH_14", name: "Poor Physical Environment", whsRef: "WHS_Reg:39" },
  PSH_15: { code: "PSH_15", name: "Job Insecurity", isoRef: "ISO 45003:6.1.6" },
  PSH_16: { code: "PSH_16", name: "Work-Life Imbalance", isoRef: "ISO 45003:6.1.6" },
} as const;

// Hazard classification thresholds (0.0–1.0 scale, where 1.0 = maximum hazard)
export const HAZARD_THRESHOLDS = {
  GREEN: 0.35,  // Below this = healthy
  AMBER: 0.60,  // Below this = watch
  // Above AMBER = RED (act)
} as const;

export type HazardClassification = "GREEN" | "AMBER" | "RED";

export function classifyHazardScore(score: number): HazardClassification {
  if (score <= HAZARD_THRESHOLDS.GREEN) return "GREEN";
  if (score <= HAZARD_THRESHOLDS.AMBER) return "AMBER";
  return "RED";
}

export type Trajectory = "IMPROVING" | "STABLE" | "DECLINING" | "ACUTE";

export function calculateTrajectory(scores: number[]): Trajectory {
  if (scores.length < 2) return "STABLE";

  const recent = scores[scores.length - 1];
  const prior = scores[scores.length - 2];
  const delta = recent - prior;

  // Acute: score jumped from GREEN to RED in one cycle
  if (scores.length >= 2 && prior <= HAZARD_THRESHOLDS.GREEN && recent > HAZARD_THRESHOLDS.AMBER) {
    return "ACUTE";
  }

  if (delta < -0.05) return "IMPROVING"; // Score decreased (lower = better)
  if (delta > 0.05) return "DECLINING";  // Score increased (higher = worse)
  return "STABLE";
}
