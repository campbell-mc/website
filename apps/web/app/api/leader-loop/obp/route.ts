// api/leader-loop/obp/route.ts
// Leader confirms their One Big Practice.
//
// This triggers:
//   1. OBP saved to leader profile
//   2. Fortnightly pulse question created for direct reports
//   3. Micro-practice assigned to support the OBP
//   4. Leader Loop conversations anchored to this OBP going forward
//   5. Progress tracked over cycles

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { facility_id, leader_id, team_id, cycle_id, competency_id, behavior_text, personalised_text } = body as {
    facility_id: string;
    leader_id: string;
    team_id: string;
    cycle_id: number;
    competency_id: string;
    behavior_text: string;
    personalised_text: string;
  };

  if (!facility_id || !leader_id || !competency_id || !personalised_text?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // TODO: Ivan — write to leader_profiles:
  //   obp_competency_id, obp_behavior_text, obp_personalised, obp_confirmed_at

  // TODO: Ivan — create fortnightly pulse question for direct reports:
  //   Derived from the selected behaviour
  //   e.g., "My team leader gives me direct feedback on the same day" (1-5 scale)

  // TODO: Ivan — assign micro-practice from leader_practices library
  //   Match by competency_id + behavior_index
  //   Alternate A/B variants across cycles

  // TODO: Ivan — transition leader loop state to 'development_active'

  console.log(`[OBP_API] OBP confirmed — leader: ${leader_id}, competency: ${competency_id}`);

  return NextResponse.json({
    success: true,
    message: 'Your One Big Practice is confirmed.',
  });
}
