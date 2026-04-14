// lib/simulation/llm-judge.ts
// Phase 5 — LLM-as-judge evaluation.
// Claude evaluates agent findings for quality, actionability, specificity, and tone.
// This runs AFTER the deterministic judge — adds a qualitative layer.

import { callClaudeText } from '@/lib/anthropic/client';
import type { ScenarioResult, AgentFinding } from './types';

export interface LLMJudgeVerdict {
  scenario_id: string;
  overall_quality: number;        // 0-1
  dimensions: {
    actionability: { score: number; reasoning: string };
    specificity: { score: number; reasoning: string };
    accuracy: { score: number; reasoning: string };
    tone: { score: number; reasoning: string };
    signal_to_noise: { score: number; reasoning: string };
  };
  summary: string;
  improvements: string[];
}

/**
 * Run LLM judge on a scenario result.
 * Evaluates the quality of what agents SAID, not just whether they fired.
 * Requires ANTHROPIC_API_KEY — returns null if not available.
 */
export async function llmJudgeScenario(result: ScenarioResult): Promise<LLMJudgeVerdict | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  const { scenario, findings, actions } = result;

  // Build the transcript of what agents produced
  const transcript = findings.map((f) =>
    `[Tick ${f.tick}] ${f.agent.toUpperCase()} (${f.severity}): ${f.title}\n  → ${f.detail}`
  ).join('\n\n');

  const actionList = actions.map((a) =>
    `[Tick ${a.tick}] ${a.agent.toUpperCase()}: ${a.description}`
  ).join('\n');

  const prompt = `You are evaluating the output of an AI agent system (CHRIS) for Australian aged care. CHRIS has 6 agents that monitor facilities and generate findings.

SCENARIO: ${scenario.name}
DESCRIPTION: ${scenario.description}
CARE TYPE: ${scenario.care_type}
DURATION: ${scenario.duration_ticks} ticks (${scenario.duration_ticks * 30} minutes simulated)

GROUND TRUTH — what SHOULD have been detected:
${scenario.ground_truth.expected_findings.map((f) => `- ${f.agent}: ${f.description} (${f.severity}, within ${f.max_ticks_to_detect} ticks)`).join('\n')}

WHAT AGENTS ACTUALLY PRODUCED:
${transcript || '(No findings produced)'}

ACTIONS TAKEN:
${actionList || '(No actions taken)'}

Evaluate the agent output across 5 dimensions. Score each 0.0 to 1.0:

1. ACTIONABILITY — Would a DON/FM know exactly what to do from these findings? Are next steps clear?
2. SPECIFICITY — Are numbers, names, wings, deadlines, dollar amounts named? Or is it vague?
3. ACCURACY — Are the facts correct? Does the severity match the situation? Any hallucinated details?
4. TONE — Is the language appropriate for aged care leadership? Direct but not alarming? Professional?
5. SIGNAL-TO-NOISE — Every finding carries new information? Or are there redundant/duplicate alerts?

Respond with ONLY valid JSON:
{
  "overall_quality": 0.0-1.0,
  "dimensions": {
    "actionability": { "score": 0.0-1.0, "reasoning": "one sentence" },
    "specificity": { "score": 0.0-1.0, "reasoning": "one sentence" },
    "accuracy": { "score": 0.0-1.0, "reasoning": "one sentence" },
    "tone": { "score": 0.0-1.0, "reasoning": "one sentence" },
    "signal_to_noise": { "score": 0.0-1.0, "reasoning": "one sentence" }
  },
  "summary": "2-3 sentence overall assessment",
  "improvements": ["specific improvement 1", "specific improvement 2"]
}`;

  try {
    const response = await callClaudeText({
      system: 'You are a quality evaluator for AI agent outputs in Australian aged care. Respond with valid JSON only.',
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 800,
      facilityId: 'simulation',
      agentName: 'llm_judge',
      callType: 'simulation_evaluation',
    });

    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      scenario_id: scenario.id,
      overall_quality: parsed.overall_quality ?? 0,
      dimensions: parsed.dimensions ?? {},
      summary: parsed.summary ?? '',
      improvements: parsed.improvements ?? [],
    };
  } catch (error) {
    console.error(`[LLM Judge] Failed for ${scenario.id}:`, error);
    return null;
  }
}

/**
 * Run LLM judge across an entire suite.
 * Returns verdicts only for scenarios that have findings to evaluate.
 */
export async function llmJudgeSuite(
  results: ScenarioResult[],
): Promise<LLMJudgeVerdict[]> {
  const verdicts: LLMJudgeVerdict[] = [];

  for (const result of results) {
    if (result.findings.length === 0 && result.actions.length === 0) continue;
    const verdict = await llmJudgeScenario(result);
    if (verdict) {
      verdicts.push(verdict);
      console.log(`[LLM Judge] ${verdict.scenario_id}: ${Math.round(verdict.overall_quality * 100)}% quality`);
    }
  }

  return verdicts;
}
