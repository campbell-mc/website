// lib/simulation/index.ts
// Public API for the CHRIS Agent Simulation Engine.
//
// Usage:
//   import { runSuite, runSingleScenario } from '@/lib/simulation';
//   const report = await runSuite(sentinelScenarios);
//   const verdict = await runSingleScenario(careMinutesBreachScenario);

import { runScenario } from './runner';
import { judgeScenario } from './judge';
import { buildSuiteReport } from './report';
import type { Scenario, Verdict, SuiteReport } from './types';

export type { Scenario, Verdict, SuiteReport, ScenarioResult, AgentFinding, AgentAction } from './types';
export { seedHealthyResidential, seedPressuredResidential, seedHealthyHomeCare } from './seed';

/**
 * Run a single scenario and return the verdict.
 */
export async function runSingleScenario(scenario: Scenario): Promise<Verdict> {
  const result = await runScenario(scenario);
  return judgeScenario(result);
}

/**
 * Run a suite of scenarios and return an aggregated report.
 */
export async function runSuite(scenarios: Scenario[]): Promise<SuiteReport> {
  const startTime = Date.now();
  const verdicts: Verdict[] = [];

  for (const scenario of scenarios) {
    const result = await runScenario(scenario);
    const verdict = judgeScenario(result);
    verdicts.push(verdict);
    console.log(`[Simulation] ${verdict.pass ? '✓' : '✗'} ${scenario.name} — ${(verdict.overall_score * 100).toFixed(0)}%`);
  }

  return buildSuiteReport(verdicts, Date.now() - startTime);
}
