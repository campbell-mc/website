// ============================================================================
// SIRS Classifier
//
// Serious Incident Response Scheme — Aged Care Act 2024.
// Category 1: report within 24 hours. Category 2: report within 30 days.
// Penalty for non-reporting: up to $783,000 per contravention.
//
// Classification:
//   Tier 1 — Pattern match (no Claude API, HIGH confidence)
//   Tier 2 — Claude API for ambiguous cases (MEDIUM confidence)
//
// DON approval is ALWAYS required before submission.
// ============================================================================

import { db, facilityIncidents, donReviewItems } from "@chris/db";
import { eq } from "drizzle-orm";

// Category 1 types (24h reporting)
const CATEGORY_1_TYPES = [
  "unreasonable_use_of_force",
  "unlawful_sexual_contact",
  "inappropriate_sexual_conduct",
  "psychological_emotional_abuse",
  "unexpected_death",
  "stealing_financial_fraud",
  "neglect",
  "inappropriate_restrictive_practice",
] as const;

// Category 2 types (30 day reporting)
const CATEGORY_2_TYPES = [
  "missing_resident",
  "medication_error_adverse_outcome",
  "physical_injury_requiring_treatment",
  "malnutrition_requiring_treatment",
  "fall_with_significant_injury",
] as const;

export interface SIRSClassification {
  incidentId: string;
  category: 1 | 2 | null;
  confidence: "high" | "medium" | "low";
  classificationMethod: "pattern_match" | "claude_api";
  rationale: string;
  legalReference: string;
  reportingDeadline: Date | null;
  draftReport: SIRSDraftReport;
}

export interface SIRSDraftReport {
  incidentDate: string;
  incidentType: string;
  incidentDescription: string; // De-identified: no individual names
  immediateActionTaken: string;
  notificationGivenTo: string;
  correctiveActionPlanned: string;
}

interface IncidentInput {
  id: string;
  facilityId: string;
  incidentDate: string;
  incidentTime?: string | null;
  reportedAt: Date;
  incidentCategory: string;
  incidentSubcategory?: string | null;
  severity: string;
  locationArea?: string | null;
  roleCategoryInvolved?: string | null;
}

export async function classifyIncident(
  incident: IncidentInput,
  claudeApiKey?: string
): Promise<SIRSClassification> {
  // Tier 1: Pattern matching (HIGH confidence)
  const patternResult = patternMatch(incident);

  if (patternResult !== null) {
    const classification: SIRSClassification = {
      incidentId: incident.id,
      ...patternResult,
      classificationMethod: "pattern_match",
      reportingDeadline: calculateDeadline(patternResult.category, incident.reportedAt),
      draftReport: buildDraftReport(incident, patternResult.category),
    };

    // Create DON review item
    await createDONReviewItem(incident.facilityId, classification);

    return classification;
  }

  // Tier 2: Claude API for ambiguous cases
  if (claudeApiKey) {
    const claudeResult = await classifyWithClaude(incident, claudeApiKey);

    const classification: SIRSClassification = {
      incidentId: incident.id,
      ...claudeResult,
      classificationMethod: "claude_api",
      reportingDeadline: calculateDeadline(claudeResult.category, incident.reportedAt),
      draftReport: buildDraftReport(incident, claudeResult.category),
    };

    if (claudeResult.category !== null) {
      await createDONReviewItem(incident.facilityId, classification);
    }

    return classification;
  }

  // No Claude API key — flag for manual review
  const classification: SIRSClassification = {
    incidentId: incident.id,
    category: null,
    confidence: "low",
    classificationMethod: "pattern_match",
    rationale: "Incident requires manual SIRS assessment — could not determine category automatically.",
    legalReference: "Aged Care Act 2024, Part 4, Division 3",
    reportingDeadline: null,
    draftReport: buildDraftReport(incident, null),
  };

  return classification;
}

// --- Pattern Matching (Tier 1) ---

function patternMatch(
  incident: IncidentInput
): { category: 1 | 2 | null; confidence: "high"; rationale: string; legalReference: string } | null {
  const { incidentCategory, severity, incidentSubcategory } = incident;
  const cat = incidentCategory.toLowerCase();
  const sev = severity.toLowerCase();
  const subcat = (incidentSubcategory ?? "").toLowerCase();

  // Category 1: 24-hour reporting
  if (cat === "unexpected_death" && ["serious", "critical", "sentinel"].includes(sev)) {
    return {
      category: 1,
      confidence: "high",
      rationale: "Unexpected death classified as SIRS Category 1. Mandatory 24-hour reporting.",
      legalReference: "Aged Care Act 2024 s.74(1)(e)",
    };
  }

  if (cat === "aggression" && ["serious", "critical", "sentinel"].includes(sev)) {
    return {
      category: 1,
      confidence: "high",
      rationale: "Serious aggression incident classified as SIRS Category 1 — unreasonable use of force.",
      legalReference: "Aged Care Act 2024 s.74(1)(a)",
    };
  }

  if (subcat.includes("sexual") || cat.includes("sexual")) {
    return {
      category: 1,
      confidence: "high",
      rationale: "Sexual misconduct classified as SIRS Category 1.",
      legalReference: "Aged Care Act 2024 s.74(1)(b)(c)",
    };
  }

  if (subcat.includes("psychological") || subcat.includes("emotional_abuse")) {
    return {
      category: 1,
      confidence: "high",
      rationale: "Psychological/emotional abuse classified as SIRS Category 1.",
      legalReference: "Aged Care Act 2024 s.74(1)(d)",
    };
  }

  if (subcat.includes("neglect") && ["serious", "critical", "sentinel"].includes(sev)) {
    return {
      category: 1,
      confidence: "high",
      rationale: "Serious neglect classified as SIRS Category 1.",
      legalReference: "Aged Care Act 2024 s.74(1)(g)",
    };
  }

  if (subcat.includes("restrictive") && ["serious", "critical"].includes(sev)) {
    return {
      category: 1,
      confidence: "high",
      rationale: "Inappropriate restrictive practice classified as SIRS Category 1.",
      legalReference: "Aged Care Act 2024 s.74(1)(h)",
    };
  }

  if (subcat.includes("financial") || subcat.includes("stealing")) {
    return {
      category: 1,
      confidence: "high",
      rationale: "Stealing or financial fraud classified as SIRS Category 1.",
      legalReference: "Aged Care Act 2024 s.74(1)(f)",
    };
  }

  // Category 2: 30-day reporting
  if (cat === "missing_resident") {
    return {
      category: 2,
      confidence: "high",
      rationale: "Missing resident classified as SIRS Category 2.",
      legalReference: "Aged Care Act 2024 s.74(2)(a)",
    };
  }

  if (cat === "fall" && ["critical", "sentinel"].includes(sev)) {
    return {
      category: 2,
      confidence: "high",
      rationale: "Fall with significant injury classified as SIRS Category 2.",
      legalReference: "Aged Care Act 2024 s.74(2)(e)",
    };
  }

  if (cat === "medication_error" && ["serious", "critical", "sentinel"].includes(sev)) {
    return {
      category: 2,
      confidence: "high",
      rationale: "Medication error with adverse outcome classified as SIRS Category 2.",
      legalReference: "Aged Care Act 2024 s.74(2)(b)",
    };
  }

  // Not reportable (clear non-matches)
  if (cat === "near_miss" && sev === "low") {
    return {
      category: null,
      confidence: "high",
      rationale: "Low-severity near miss — not SIRS reportable.",
      legalReference: "N/A",
    };
  }

  if (cat === "medication_error" && sev === "low") {
    return {
      category: null,
      confidence: "high",
      rationale: "Low-severity medication error with no adverse outcome — not SIRS reportable.",
      legalReference: "N/A",
    };
  }

  if (cat === "environmental" || cat === "near_miss") {
    return {
      category: null,
      confidence: "high",
      rationale: "Environmental or near-miss incident — not SIRS reportable.",
      legalReference: "N/A",
    };
  }

  // Ambiguous — needs Claude API
  return null;
}

// --- Claude API Classification (Tier 2) ---

async function classifyWithClaude(
  incident: IncidentInput,
  apiKey: string
): Promise<{ category: 1 | 2 | null; confidence: "high" | "medium" | "low"; rationale: string; legalReference: string }> {
  const systemPrompt = `You are a SIRS compliance specialist under the Aged Care Act 2024.
Classify this incident. Output JSON only:
{ "category": 1 | 2 | null, "confidence": "high" | "medium" | "low",
  "rationale": "plain language for the DON, max 100 words",
  "legal_reference": "specific Act section" }
Do not identify any individual in your response.`;

  const userPrompt = `Incident category: ${incident.incidentCategory}
Severity: ${incident.severity}
Subcategory: ${incident.incidentSubcategory ?? "none"}
Location: ${incident.locationArea ?? "unknown"}
Role involved: ${incident.roleCategoryInvolved ?? "unknown"}
Date: ${incident.incidentDate}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        temperature: 0.1,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json() as {
      content: Array<{ type: string; text: string }>;
    };

    const text = data.content[0]?.text ?? "{}";
    const parsed = JSON.parse(text);

    return {
      category: parsed.category ?? null,
      confidence: parsed.confidence ?? "low",
      rationale: parsed.rationale ?? "Classification by AI review.",
      legalReference: parsed.legal_reference ?? "Aged Care Act 2024, Part 4",
    };
  } catch (err) {
    console.error("[SIRS] Claude API classification failed:", err);
    return {
      category: null,
      confidence: "low",
      rationale: "AI classification failed — manual review required.",
      legalReference: "Aged Care Act 2024, Part 4, Division 3",
    };
  }
}

// --- Helpers ---

function calculateDeadline(category: 1 | 2 | null, reportedAt: Date): Date | null {
  if (category === null) return null;
  const deadline = new Date(reportedAt);
  if (category === 1) {
    deadline.setHours(deadline.getHours() + 24);
  } else {
    deadline.setDate(deadline.getDate() + 30);
  }
  return deadline;
}

function buildDraftReport(incident: IncidentInput, category: 1 | 2 | null): SIRSDraftReport {
  return {
    incidentDate: incident.incidentDate,
    incidentType: category === 1
      ? `SIRS Category 1 — ${incident.incidentCategory}`
      : category === 2
        ? `SIRS Category 2 — ${incident.incidentCategory}`
        : `Under review — ${incident.incidentCategory}`,
    incidentDescription: `${incident.incidentCategory} incident (${incident.severity} severity) in ${incident.locationArea ?? "unspecified area"}. Involved role: ${incident.roleCategoryInvolved ?? "unknown"}.`,
    immediateActionTaken: "[To be completed by DON]",
    notificationGivenTo: "[To be completed by DON]",
    correctiveActionPlanned: "[To be completed by DON]",
  };
}

async function createDONReviewItem(
  facilityId: string,
  classification: SIRSClassification
): Promise<void> {
  const urgency = classification.category === 1 ? "immediate" : "urgent";

  await db.insert(donReviewItems).values({
    facilityId,
    itemType: "sirs_classification",
    urgency,
    summary: `SIRS ${classification.category === 1 ? "Category 1 (24h)" : "Category 2 (30 day)"}: ${classification.rationale}`,
    fullContext: {
      classification,
      draftReport: classification.draftReport,
    },
    chrisRecommendation: `Review and approve SIRS report. ${classification.legalReference}. Deadline: ${classification.reportingDeadline?.toISOString() ?? "N/A"}.`,
    deadline: classification.reportingDeadline,
  });
}
