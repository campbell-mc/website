// api/leader-loop/arrive/route.ts
// Records the leader's emotional state before viewing 360 feedback.
// This is developmental data — used by CHRIS Coach to calibrate
// the coaching conversation, not for reporting.

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { facility_id, leader_id, cycle_id, emotion } = body as {
    facility_id: string;
    leader_id: string;
    cycle_id: number;
    emotion: string;  // 'Curious' | 'Ready' | 'Nervous' | 'Unsure' | 'Mixed'
  };

  if (!facility_id || !leader_id || !emotion) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // TODO: Ivan — update leader_loop_cycles:
  //   arrival_emotion, arrival_at

  console.log(`[LeaderArriveAPI] Arrival — leader: ${leader_id}, emotion: ${emotion}`);

  return NextResponse.json({ success: true });
}
