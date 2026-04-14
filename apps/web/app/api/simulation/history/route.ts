import { NextRequest, NextResponse } from 'next/server';
import { getRunHistory, getScoreTrend, getUnresolvedFailures, getFailurePatterns } from '@/lib/simulation/persist';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    runs: getRunHistory(20),
    trend: getScoreTrend(),
    unresolved_failures: getUnresolvedFailures(),
    failure_patterns: getFailurePatterns(),
  });
}
