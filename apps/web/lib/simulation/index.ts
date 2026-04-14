// lib/simulation/index.ts
// Public API for the CHRIS Agent Simulation Engine.
//
// Usage:
//   import { runSuite, runSingleScenario } from '@/lib/simulation';
//   const report = await runSuite(sentinelScenarios);
//   const report = await runSuite(scenarios, { llmJudge: true });

import { runScenario } from './runner';
import { judgeScenario } from './judge';
import { llmJudgeScenario } from './llm-judge';
import { buildSuiteReport } from './report';
import type { Scenario, Verdict, SuiteReport } from './types';

export type { Scenario, Verdict, SuiteReport, ScenarioResult, AgentFinding, AgentAction } from './types';
export { seedHealthyResidential, seedPressuredResidential, seedHealthyHomeCare } from './seed';

interface SuiteOptions {
  llmJudge?: boolean;  // Run Claude quality evaluation on findings
}

/**
 * Run a single scenario and return the verdict.
 */
export async function runSingleScenario(scenario: Scenario, options?: SuiteOptions): Promise<Verdict> {
  const result = await runScenario(scenario);
  const verdict = judgeScenario(result);

  if (options?.llmJudge) {
    const llmVerdict = await llmJudgeScenario(result);
    if (llmVerdict) {
      verdict.llm_quality = llmVerdict.overall_quality;
      verdict.llm_summary = llmVerdict.summary;
    }
  }

  return verdict;
}

/**
 * Run a suite of scenarios and return an aggregated report.
 */
export async function runSuite(scenarios: Scenario[], options?: SuiteOptions): Promise<SuiteReport> {
  const startTime = Date.now();
  const verdicts: Verdict[] = [];
  const useLLM = options?.llmJudge && !!process.env.ANTHROPIC_API_KEY;

  for (const scenario of scenarios) {
    const result = await runScenario(scenario);
    const verdict = judgeScenario(result);

    // LLM quality evaluation (if API key available and requested)
    if (useLLM && (result.findings.length > 0 || result.actions.length > 0)) {
      const llmVerdict = await llmJudgeScenario(result);
      if (llmVerdict) {
        verdict.llm_quality = llmVerdict.overall_quality;
        verdict.llm_summary = llmVerdict.summary;
      }
    }

    verdicts.push(verdict);
    const llmTag = verdict.llm_quality != null ? ` · LLM: ${Math.round(verdict.llm_quality * 100)}%` : '';
    console.log(`[Simulation] ${verdict.pass ? '✓' : '✗'} ${scenario.name} — ${(verdict.overall_score * 100).toFixed(0)}%${llmTag}`);
  }

  const report = buildSuiteReport(verdicts, Date.now() - startTime);

  // Add LLM judge metadata
  report.llm_judge_available = useLLM ?? false;
  if (useLLM) {
    const llmScored = verdicts.filter((v) => v.llm_quality != null);
    report.llm_avg_quality = llmScored.length > 0
      ? llmScored.reduce((sum, v) => sum + (v.llm_quality ?? 0), 0) / llmScored.length
      : undefined;
  }

  return report;
}
