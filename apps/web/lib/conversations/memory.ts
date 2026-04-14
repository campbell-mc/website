// lib/conversations/memory.ts
// Conversation memory layer — extracts insights from interactions and
// builds per-user context that compounds over time.
//
// This is what makes CHRIS sticky. After 3 conversations, CHRIS knows
// your preferences, your concerns, your decision patterns, and the
// threads you're tracking.

import { randomUUID } from "crypto";

// ── Types ────────────────────────────────────────────────────────────────────

export interface UserMemory {
  id: string;
  facility_id: string;
  user_role: string;
  type: "preference" | "concern" | "decision" | "thread" | "context" | "relationship";
  content: string;
  source_conversation_id: string;
  confidence: number;           // 0-1 how confident we are this is accurate
  last_referenced: string;      // ISO timestamp — when this memory was last relevant
  reference_count: number;      // how many times this has been used in context
  created_at: string;
  expires_at: string | null;    // null = permanent, otherwise auto-decays
}

export interface FacilityKnowledge {
  id: string;
  facility_id: string;
  domain: string;               // clinical, workforce, financial, etc.
  fact: string;                 // "Grevillea Wing has had PSH convergence for 6 cycles"
  source: string;               // "agent:sentinel:run-xxx" or "conversation:conv-xxx"
  first_observed: string;
  last_confirmed: string;
  status: "active" | "resolved" | "outdated";
}

export interface ConversationInsight {
  user_role: string;
  topics_discussed: string[];
  decisions_made: string[];
  concerns_raised: string[];
  preferences_detected: string[];
  follow_ups_needed: string[];
}

// ── In-memory stores ────────────────────────────────────────────────────────

const userMemories = new Map<string, UserMemory[]>();
const facilityKnowledge = new Map<string, FacilityKnowledge[]>();

function memoryKey(facilityId: string, userRole: string): string {
  return `${facilityId}:${userRole}`;
}

// ── Seed facility knowledge ─────────────────────────────────────────────────

function ensureFacilityKnowledge(facilityId: string): FacilityKnowledge[] {
  let knowledge = facilityKnowledge.get(facilityId);
  if (!knowledge) {
    const now = new Date().toISOString();
    knowledge = [
      { id: "fk-001", facility_id: facilityId, domain: "workforce", fact: "Grevillea Wing has PSH_01 + PSH_08 convergence persisting for 6 cycles. Level 4 practices insufficient — structural intervention needed.", source: "agent:sentinel", first_observed: "2026-01-15", last_confirmed: now, status: "active" },
      { id: "fk-002", facility_id: facilityId, domain: "workforce", fact: "Wattle Wing PSH_08 (Traumatic Exposure) improved from 0.72 to 0.52 over 4 cycles after micro-practice intervention. Practice is working.", source: "agent:keeper", first_observed: "2026-02-01", last_confirmed: now, status: "active" },
      { id: "fk-003", facility_id: facilityId, domain: "clinical", fact: "Falls rate above national benchmark for 3 consecutive quarters. April data showing 12% reduction correlating with agency coverage decline.", source: "agent:sentinel", first_observed: "2025-10-01", last_confirmed: now, status: "active" },
      { id: "fk-004", facility_id: facilityId, domain: "financial", fact: "Agency cost peaked at $239K/month in January 2026 (staffing crisis — 2 RN exits in December). Now $138K and declining.", source: "agent:oracle", first_observed: "2026-01-01", last_confirmed: now, status: "active" },
      { id: "fk-005", facility_id: facilityId, domain: "operations", fact: "Sunday PM AIN gap has been structural for 7 consecutive weeks. Steward recommends permanent part-time hire ($4,940/year saving vs agency).", source: "agent:steward", first_observed: "2026-02-23", last_confirmed: now, status: "active" },
      { id: "fk-006", facility_id: facilityId, domain: "financial", fact: "3 AN-ACC reclassification opportunities identified by Oracle. Estimated uplift $11,400/month. Clinical reviews needed Tuesday.", source: "agent:oracle", first_observed: "2026-04-13", last_confirmed: now, status: "active" },
      { id: "fk-007", facility_id: facilityId, domain: "governance", fact: "Board Pack Q3 drafted by Chronicler. 8 sections. Meeting in 8 days. Needs DON and CEO approval.", source: "agent:chronicler", first_observed: "2026-04-10", last_confirmed: now, status: "active" },
      { id: "fk-008", facility_id: facilityId, domain: "compliance", fact: "Standard 2 PSH evidence gap — worker consultation record needs updating. Pulse participation data satisfies this. 2-minute fix.", source: "agent:sentinel", first_observed: "2026-03-15", last_confirmed: now, status: "active" },
      { id: "fk-009", facility_id: facilityId, domain: "clinical", fact: "Care minutes strong at 226/day (target 215). Compliant for 4 consecutive weeks. Strongest sustained period since October.", source: "agent:sentinel", first_observed: "2026-03-18", last_confirmed: now, status: "active" },
      { id: "fk-010", facility_id: facilityId, domain: "workforce", fact: "Home Care: Keeper detected PSH_13 turnover precursor in Camelot team. Role clarity declining 3 cycles. New rostering system rollout is the driver.", source: "agent:keeper", first_observed: "2026-03-28", last_confirmed: now, status: "active" },
    ];
    facilityKnowledge.set(facilityId, knowledge);
  }
  return knowledge;
}

// ── Extract insights from a conversation ────────────────────────────────────

export function extractInsights(
  userMessage: string,
  assistantResponse: string,
  userRole: string,
  facilityId: string,
  conversationId: string
): void {
  const key = memoryKey(facilityId, userRole);
  if (!userMemories.has(key)) userMemories.set(key, []);
  const memories = userMemories.get(key)!;
  const now = new Date().toISOString();
  const lower = userMessage.toLowerCase();

  // Detect topics of interest
  const topicPatterns: Array<{ pattern: RegExp; topic: string }> = [
    { pattern: /care.?minutes|215|rn.?minutes/i, topic: "care minutes compliance" },
    { pattern: /agency|staffing|roster/i, topic: "agency dependency and rostering" },
    { pattern: /falls|qi|quality.?indicator/i, topic: "falls rate and quality indicators" },
    { pattern: /psh|psychosocial|convergence|hazard/i, topic: "psychosocial safety" },
    { pattern: /an.?acc|reclassif|revenue|funding/i, topic: "AN-ACC and revenue" },
    { pattern: /board|pack|governance/i, topic: "board reporting and governance" },
    { pattern: /sirs|incident|notification/i, topic: "SIRS and incident management" },
    { pattern: /turnover|retention|exit/i, topic: "turnover and retention" },
    { pattern: /training|credential|ahpra/i, topic: "training and credentials" },
    { pattern: /grevillea/i, topic: "Grevillea Wing" },
    { pattern: /wattle/i, topic: "Wattle Wing" },
    { pattern: /home.?care|visit|client/i, topic: "home care operations" },
  ];

  for (const { pattern, topic } of topicPatterns) {
    if (pattern.test(lower)) {
      const existing = memories.find((m) => m.type === "concern" && m.content.includes(topic));
      if (existing) {
        existing.reference_count++;
        existing.last_referenced = now;
      } else {
        memories.push({
          id: randomUUID().slice(0, 8),
          facility_id: facilityId,
          user_role: userRole,
          type: "concern",
          content: `Interested in ${topic}`,
          source_conversation_id: conversationId,
          confidence: 0.7,
          last_referenced: now,
          reference_count: 1,
          created_at: now,
          expires_at: null,
        });
      }
    }
  }

  // Detect preference signals
  if (lower.includes("don't") || lower.includes("stop") || lower.includes("less") || lower.includes("more detail") || lower.includes("simpler")) {
    memories.push({
      id: randomUUID().slice(0, 8),
      facility_id: facilityId,
      user_role: userRole,
      type: "preference",
      content: `User said: "${userMessage.slice(0, 100)}" — may indicate communication preference`,
      source_conversation_id: conversationId,
      confidence: 0.5,
      last_referenced: now,
      reference_count: 1,
      created_at: now,
      expires_at: null,
    });
  }

  // Track follow-up threads
  if (lower.includes("follow up") || lower.includes("update me") || lower.includes("remind me") || lower.includes("check back")) {
    memories.push({
      id: randomUUID().slice(0, 8),
      facility_id: facilityId,
      user_role: userRole,
      type: "thread",
      content: `Follow-up requested: "${userMessage.slice(0, 120)}"`,
      source_conversation_id: conversationId,
      confidence: 0.9,
      last_referenced: now,
      reference_count: 1,
      created_at: now,
      expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 day expiry
    });
  }
}

// ── Build memory context for system prompt ──────────────────────────────────

export function buildMemoryContext(facilityId: string, userRole: string): string {
  const key = memoryKey(facilityId, userRole);
  const memories = userMemories.get(key) ?? [];
  const knowledge = ensureFacilityKnowledge(facilityId);

  const sections: string[] = [];

  // User-specific memories (top concerns, sorted by reference count)
  const activeMemories = memories
    .filter((m) => !m.expires_at || new Date(m.expires_at) > new Date())
    .sort((a, b) => b.reference_count - a.reference_count)
    .slice(0, 10);

  if (activeMemories.length > 0) {
    const concerns = activeMemories.filter((m) => m.type === "concern");
    const threads = activeMemories.filter((m) => m.type === "thread");
    const prefs = activeMemories.filter((m) => m.type === "preference");

    if (concerns.length > 0) {
      sections.push(`TOPICS THIS USER KEEPS COMING BACK TO:\n${concerns.map((m) => `- ${m.content} (asked about ${m.reference_count} times)`).join("\n")}`);
    }
    if (threads.length > 0) {
      sections.push(`OPEN FOLLOW-UP THREADS:\n${threads.map((m) => `- ${m.content}`).join("\n")}`);
    }
    if (prefs.length > 0) {
      sections.push(`COMMUNICATION PREFERENCES DETECTED:\n${prefs.map((m) => `- ${m.content}`).join("\n")}`);
    }
  }

  // Facility knowledge relevant to this role
  const roleKnowledge = knowledge.filter((k) => {
    if (k.status !== "active") return false;
    const roleDomains: Record<string, string[]> = {
      don: ["clinical", "workforce", "compliance", "operations", "governance"],
      facility_manager: ["operations", "workforce", "financial"],
      ceo: ["financial", "workforce", "governance", "clinical"],
      cfo: ["financial", "governance"],
      clinical_director: ["clinical", "compliance"],
      quality_lead: ["compliance", "clinical"],
      whs_lead: ["workforce"],
      hr_manager: ["workforce"],
      team_leader: ["workforce", "operations"],
      home_care_manager: ["clinical", "workforce", "financial", "compliance"],
    };
    return (roleDomains[userRole] ?? ["clinical", "workforce"]).includes(k.domain);
  });

  if (roleKnowledge.length > 0) {
    sections.push(`ACTIVE FACILITY INTELLIGENCE (from CHRIS agents — reference when relevant):\n${roleKnowledge.map((k) => `- [${k.domain}] ${k.fact}`).join("\n")}`);
  }

  // Cross-conversation threading
  const otherRoleMemories: string[] = [];
  for (const [k, mems] of userMemories.entries()) {
    if (k === key) continue;
    const role = k.split(":")[1];
    const recent = mems
      .filter((m) => m.type === "concern" && m.reference_count >= 2)
      .slice(0, 3);
    if (recent.length > 0) {
      otherRoleMemories.push(`The ${role} has been asking about: ${recent.map((m) => m.content.replace("Interested in ", "")).join(", ")}`);
    }
  }

  if (otherRoleMemories.length > 0) {
    sections.push(`CROSS-ROLE INTELLIGENCE (other leaders have been discussing):\n${otherRoleMemories.join("\n")}`);
  }

  return sections.length > 0
    ? `\n\n## CHRIS MEMORY (from previous conversations and agent observations)\n\n${sections.join("\n\n")}`
    : "";
}

// ── Get user memory stats ───────────────────────────────────────────────────

export function getMemoryStats(facilityId: string, userRole: string) {
  const key = memoryKey(facilityId, userRole);
  const memories = userMemories.get(key) ?? [];
  return {
    total: memories.length,
    concerns: memories.filter((m) => m.type === "concern").length,
    threads: memories.filter((m) => m.type === "thread").length,
    preferences: memories.filter((m) => m.type === "preference").length,
    topConcerns: memories
      .filter((m) => m.type === "concern")
      .sort((a, b) => b.reference_count - a.reference_count)
      .slice(0, 5)
      .map((m) => ({ topic: m.content, count: m.reference_count })),
  };
}
