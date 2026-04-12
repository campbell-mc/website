// API route for manual situation report refresh
// Rate limited to once per 5 minutes per facility per domain

import { NextRequest, NextResponse } from 'next/server';
import { refreshSituationReport } from '@/lib/agents/sentinel-router';

export async function POST(request: NextRequest) {
  // TODO: Ivan — add auth check from session

  const { facilityId, domain, trigger } = await request.json() as {
    facilityId?: string;
    domain?: string;
    trigger?: string;
  };

  if (!facilityId || !domain) {
    return NextResponse.json({ error: 'Missing facilityId or domain' }, { status: 400 });
  }

  try {
    const narrative = await refreshSituationReport(
      facilityId,
      domain,
      (trigger as 'threshold_crossing' | 'scheduled' | 'manual') || 'manual'
    );

    return NextResponse.json({
      narrative,
      updated_at: new Date().toISOString(),
      domain,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Rate limited')) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    return NextResponse.json({ error: 'Refresh failed' }, { status: 500 });
  }
}
