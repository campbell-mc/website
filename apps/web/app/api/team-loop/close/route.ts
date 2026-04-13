// api/team-loop/close/route.ts
// Leader closes the loop — selects which action they implemented
// and rates its effectiveness (1-5).
//
// This completes the measurement cycle:
//   Practice prescribed → Committed → Implemented → Effectiveness rated
//   Next cycle: compare hazard scores to measure real outcome delta.

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { facility_id, team_id, cycle_id, action_implemented_id, effectiveness_rating, did_not_implement } = body as {
    facility_id: string;
    team_id: string;
    cycle_id: number;
    action_implemented_id: string | null;
    effectiveness_rating: number | null;   // 1-5
    did_not_implement: boolean;
  };

  if (!facility_id || !team_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (!did_not_implement && !action_implemented_id) {
    return NextResponse.json({ error: 'Select an action or check "did not implement"' }, { status: 400 });
  }

  if (effectiveness_rating != null && (effectiveness_rating < 1 || effectiveness_rating > 5)) {
    return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 });
  }

  // TODO: Ivan — update facility_interventions:
  //   team_loop_completed: true
  //   leader_confidence_post_loop: effectiveness_rating
  //   outcome_measured_at: null (set when next cycle hazard scores available)

  // TODO: Ivan — transition cycle state to closed
  // TODO: Ivan — update Bayesian priors based on effectiveness rating

  console.log(`[LoopCloseAPI] Loop closed — team: ${team_id}, cycle: ${cycle_id}, implemented: ${action_implemented_id ?? 'none'}, rating: ${effectiveness_rating}`);

  return NextResponse.json({
    success: true,
    message: 'Loop closed. Your feedback trains CHRIS.',
  });
}
