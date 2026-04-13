import { NextRequest, NextResponse } from 'next/server';
import { runSuite } from '@/lib/simulation';
import { sentinelScenarios } from '@/lib/simulation/scenarios/sentinel';

export async function POST(request: NextRequest) {
  const { suite } = await request.json().catch(() => ({ suite: 'sentinel' }));

  const scenarios = suite === 'sentinel' ? sentinelScenarios : sentinelScenarios;

  const report = await runSuite(scenarios);

  return NextResponse.json(report);
}
