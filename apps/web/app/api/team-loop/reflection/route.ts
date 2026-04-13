// api/team-loop/reflection/route.ts
// Leader submits their loop reflection — 3-step flow:
// 1. Did they notice the team actions being implemented?
// 2. What difference did it make?
// 3. What made it harder than expected?
//
// This feeds into: CHRIS's practice effectiveness model, ISO 45003 evidence,
// next cycle's practice selection (Bayesian prior update), and the leader's
// development profile.

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { facility_id, team_id, cycle_id, frequency, difference, challenges } = body as {
    facility_id: string;
    team_id: string;
    cycle_id: number;
    frequency: string;       // 'yes-often' | 'yes-occasionally' | 'not-really' | 'hard-to-tell'
    difference: string;      // Free text
    challenges: string;      // Free text
  };

  if (!facility_id || !team_id || !frequency) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // TODO: Ivan — write to facility_interventions (update existing record):
  //   reflection_frequency, reflection_difference, reflection_challenges,
  //   reflection_submitted_at

  // TODO: Ivan — update Bayesian prior for this practice:
  //   If frequency is 'yes-often' or 'yes-occasionally' → increment alpha
  //   If frequency is 'not-really' or 'hard-to-tell' → increment beta

  console.log(`[ReflectionAPI] Reflection submitted — team: ${team_id}, cycle: ${cycle_id}, frequency: ${frequency}`);

  return NextResponse.json({
    success: true,
    message: 'Reflection recorded. CHRIS will use this to improve recommendations.',
  });
}
