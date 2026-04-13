// lib/simulation/report.ts
// Aggregate verdicts across a scenario suite into a summary report.

import type { Verdict, SuiteReport } from './types';

export function buildSuiteReport(verdicts: Verdict[], duration_ms: number): SuiteReport {
  const passed = verdicts.filter((v) => v.pass).length;
  const failed = verdicts.filter((v) => !v.pass).length;
  const overall_score = verdicts.length > 0
    ? verdicts.reduce((sum, v) => sum + v.overall_score, 0) / verdicts.length
    : 0;

  // By tier
  const by_tier: SuiteReport['by_tier'] = {};
  for (const v of verdicts) {
    const tier = v.scenario_id.split('-')[0]; // sentinel, oracle, keeper, multi
    if (!by_tier[tier]) by_tier[tier] = { total: 0, passed: 0, avg_score: 0 };
    by_tier[tier].total++;
    if (v.pass) by_tier[tier].passed++;
    by_tier[tier].avg_score += v.overall_score;
  }
  for (const tier of Object.values(by_tier)) {
    tier.avg_score = tier.total > 0 ? tier.avg_score / tier.total : 0;
  }

  // By agent
  const by_agent: SuiteReport['by_agent'] = {};
  for (const v of verdicts) {
    // Extract primary agent from scenario ID
    const agent = v.scenario_id.split('-')[0];
    if (!by_agent[agent]) by_agent[agent] = { total: 0, passed: 0, avg_score: 0 };
    by_agent[agent].total++;
    if (v.pass) by_agent[agent].passed++;
    by_agent[agent].avg_score += v.overall_score;
  }
  for (const agent of Object.values(by_agent)) {
    agent.avg_score = agent.total > 0 ? agent.avg_score / agent.total : 0;
  }

  return {
    total_scenarios: verdicts.length,
    passed,
    failed,
    overall_score,
    by_tier,
    by_agent,
    verdicts,
    run_at: new Date().toISOString(),
    duration_ms,
  };
}
