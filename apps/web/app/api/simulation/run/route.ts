import { NextRequest, NextResponse } from 'next/server';
import { runSuite } from '@/lib/simulation';
import { sentinelScenarios } from '@/lib/simulation/scenarios/sentinel';
import { oracleScenarios } from '@/lib/simulation/scenarios/oracle';
import { keeperScenarios } from '@/lib/simulation/scenarios/keeper';
import { multiAgentScenarios } from '@/lib/simulation/scenarios/multi-agent';
import { homeCareScenarios } from '@/lib/simulation/scenarios/home-care';

const ALL_SCENARIOS = [...sentinelScenarios, ...oracleScenarios, ...keeperScenarios, ...multiAgentScenarios, ...homeCareScenarios];

const SUITES: Record<string, typeof sentinelScenarios> = {
  sentinel: sentinelScenarios,
  oracle: oracleScenarios,
  keeper: keeperScenarios,
  multi: multiAgentScenarios,
  home_care: homeCareScenarios,
  all: ALL_SCENARIOS,
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const suite = body.suite ?? 'all';
  const llmJudge = body.llm_judge ?? false;
  const scenarios = SUITES[suite] ?? ALL_SCENARIOS;
  const report = await runSuite(scenarios, { llmJudge });
  return NextResponse.json(report);
}
