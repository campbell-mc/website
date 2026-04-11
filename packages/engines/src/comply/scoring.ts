// ============================================================================
// CHRIS Comply Scoring Engine
//
// 5-domain compliance audit. 100 points total.
// All questions: Yes (full points) / Partially (half) / No (zero) / Unsure (zero)
//
// Domain 1: Psychosocial Safety (35 pts, 5 questions × 7 each)
// Domain 2: Incident Management/SIRS (20 pts, 4 questions × 5 each)
// Domain 3: Care Quality (20 pts, 4 questions × 5 each)
// Domain 4: Workforce (15 pts, 3 questions × 5 each)
// Domain 5: Governance (10 pts, 3 questions × 3.33 each)
// ============================================================================

export interface ComplyQuestion {
  id: string;
  domain: number;
  text: string;
  maxPoints: number;
  regulation?: string;
}

export interface ComplyAnswer {
  questionId: string;
  response: "yes" | "partially" | "no" | "unsure";
}

export interface DomainResult {
  domain: number;
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  gaps: string[];
}

export interface ComplyResult {
  total: number;
  maxTotal: number;
  percentage: number;
  domains: DomainResult[];
  criticalGaps: Array<{
    question: string;
    regulation: string;
    action: string;
  }>;
  priorityActions: string[];
  conversionPriority: "critical" | "high" | "medium" | "low";
}

export const COMPLY_QUESTIONS: ComplyQuestion[] = [
  // Domain 1: Psychosocial Safety (35 pts)
  { id: "psh_1", domain: 1, text: "Do you have a documented psychosocial hazard management plan?", maxPoints: 7, regulation: "Quality Standard 2.8.2, ISO 45003" },
  { id: "psh_2", domain: 1, text: "Has a formal psychosocial hazard assessment been done in the last 12 months?", maxPoints: 7, regulation: "WHS Regulation 2025 s.55C" },
  { id: "psh_3", domain: 1, text: "Do you run regular pulse surveys or equivalent psychosocial measurement?", maxPoints: 7, regulation: "Quality Standard 2.8.2" },
  { id: "psh_4", domain: 1, text: "Do frontline team leaders receive structured support to manage psychological safety?", maxPoints: 7, regulation: "ISO 45003 Clause 6.1.2" },
  { id: "psh_5", domain: 1, text: "Do you have documented intervention procedures for identified hazards?", maxPoints: 7, regulation: "WHS Act 2011 s.19, ISO 45003 Clause 8.1" },

  // Domain 2: Incident Management/SIRS (20 pts)
  { id: "sirs_1", domain: 2, text: "Is your SIRS reporting process documented and understood by relevant staff?", maxPoints: 5, regulation: "Aged Care Act 2024 s.74" },
  { id: "sirs_2", domain: 2, text: "Have all Category 1 incidents been reported within 24 hours this year?", maxPoints: 5, regulation: "Aged Care Act 2024 s.74(1)" },
  { id: "sirs_3", domain: 2, text: "Do you have a process to identify SIRS-reportable incidents at point of occurrence?", maxPoints: 5, regulation: "Aged Care Act 2024 s.74" },
  { id: "sirs_4", domain: 2, text: "Are SIRS incidents reviewed for patterns and systemic issues?", maxPoints: 5, regulation: "Quality Standard 8" },

  // Domain 3: Care Quality (20 pts)
  { id: "care_1", domain: 3, text: "Do you monitor care minutes compliance daily?", maxPoints: 5, regulation: "Aged Care Act 2024, AN-ACC" },
  { id: "care_2", domain: 3, text: "Have you consistently met the 200 min/resident/day target this past quarter?", maxPoints: 5, regulation: "AN-ACC Determination 2024" },
  { id: "care_3", domain: 3, text: "Is RN 24/7 coverage maintained with a documented contingency process?", maxPoints: 5, regulation: "Aged Care Act 2024 s.45" },
  { id: "care_4", domain: 3, text: "Do you submit quality indicator data to ACQSC on time quarterly?", maxPoints: 5, regulation: "Quality Standards, GPMS" },

  // Domain 4: Workforce (15 pts)
  { id: "wf_1", domain: 4, text: "Is your agency dependency below 15% of total care hours?", maxPoints: 5, regulation: "Quality Standard 7" },
  { id: "wf_2", domain: 4, text: "Do you have a formal workforce risk assessment process?", maxPoints: 5, regulation: "WHS Act 2011, Quality Standard 7" },
  { id: "wf_3", domain: 4, text: "Are all mandatory training requirements tracked and current?", maxPoints: 5, regulation: "Aged Care Act 2024, Quality Standard 7" },

  // Domain 5: Governance (10 pts)
  { id: "gov_1", domain: 5, text: "Does your Board receive quarterly operational reports including safety and quality?", maxPoints: 3.34, regulation: "Prudential Standard, Quality Standard 8" },
  { id: "gov_2", domain: 5, text: "Is there a Quality and Risk Committee meeting at least quarterly?", maxPoints: 3.33, regulation: "Quality Standard 8" },
  { id: "gov_3", domain: 5, text: "Do you have an audit-ready compliance evidence pack available at any time?", maxPoints: 3.33, regulation: "Aged Care Act 2024, Quality Standards" },
];

const DOMAIN_NAMES: Record<number, string> = {
  1: "Psychosocial Safety",
  2: "Incident Management / SIRS",
  3: "Care Quality",
  4: "Workforce",
  5: "Governance",
};

export function scoreAudit(answers: ComplyAnswer[]): ComplyResult {
  const answerMap = new Map(answers.map((a) => [a.questionId, a]));

  // Score each question
  const questionScores = COMPLY_QUESTIONS.map((q) => {
    const answer = answerMap.get(q.id);
    let score = 0;
    if (answer?.response === "yes") score = q.maxPoints;
    else if (answer?.response === "partially") score = q.maxPoints / 2;
    // "no" and "unsure" = 0

    return { ...q, score, answer: answer?.response ?? "no" };
  });

  // Aggregate by domain
  const domains: DomainResult[] = [1, 2, 3, 4, 5].map((domain) => {
    const domainQuestions = questionScores.filter((q) => q.domain === domain);
    const score = domainQuestions.reduce((s, q) => s + q.score, 0);
    const maxScore = domainQuestions.reduce((s, q) => s + q.maxPoints, 0);
    const gaps = domainQuestions
      .filter((q) => q.answer === "no" || q.answer === "unsure")
      .map((q) => q.text);

    return {
      domain,
      name: DOMAIN_NAMES[domain],
      score: Math.round(score * 10) / 10,
      maxScore: Math.round(maxScore * 10) / 10,
      percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
      gaps,
    };
  });

  const total = Math.round(domains.reduce((s, d) => s + d.score, 0) * 10) / 10;
  const maxTotal = 100;

  // Critical gaps: questions answered "no" with regulatory reference
  const criticalGaps = questionScores
    .filter((q) => q.answer === "no" && q.regulation)
    .slice(0, 3) // Top 3
    .map((q) => ({
      question: q.text,
      regulation: q.regulation!,
      action: generateAction(q.id),
    }));

  // Priority actions
  const priorityActions = criticalGaps.map((g) => g.action);

  // Conversion priority
  let conversionPriority: ComplyResult["conversionPriority"];
  if (total < 50) conversionPriority = "critical";
  else if (total < 65) conversionPriority = "high";
  else if (total < 75) conversionPriority = "medium";
  else conversionPriority = "low";

  return {
    total,
    maxTotal,
    percentage: Math.round((total / maxTotal) * 100),
    domains,
    criticalGaps,
    priorityActions,
    conversionPriority,
  };
}

function generateAction(questionId: string): string {
  const actions: Record<string, string> = {
    psh_1: "Develop a psychosocial hazard management plan aligned with ISO 45003 and Quality Standard 2.8.2.",
    psh_2: "Conduct a formal psychosocial hazard assessment across all sites within the next 30 days.",
    psh_3: "Implement regular pulse surveys to measure psychosocial climate and track hazard trends.",
    psh_4: "Establish structured leadership support programs for frontline team leaders.",
    psh_5: "Document intervention procedures for each identified psychosocial hazard.",
    sirs_1: "Document your SIRS reporting process and train relevant staff on Category 1 and 2 requirements.",
    sirs_2: "Review SIRS reporting compliance and establish real-time incident identification at point of occurrence.",
    sirs_3: "Implement a process for immediate SIRS classification at the time of incident reporting.",
    sirs_4: "Establish regular SIRS pattern analysis and systemic review processes.",
    care_1: "Implement daily care minutes monitoring across all shifts.",
    care_2: "Review rostering patterns to ensure consistent 200 min/resident/day compliance.",
    care_3: "Document RN 24/7 coverage contingency procedures for all scenarios.",
    care_4: "Set up quarterly quality indicator submission reminders and verification processes.",
    wf_1: "Develop a workforce plan to reduce agency dependency below 15%.",
    wf_2: "Conduct a formal workforce risk assessment covering all role categories.",
    wf_3: "Implement a mandatory training tracking system with automated expiry alerts.",
    gov_1: "Establish quarterly Board reporting with operational safety and quality metrics.",
    gov_2: "Set up a Quality and Risk Committee with quarterly meeting cadence.",
    gov_3: "Build an audit-ready compliance evidence pack that can be produced on demand.",
  };

  return actions[questionId] ?? "Review and address this compliance gap.";
}
