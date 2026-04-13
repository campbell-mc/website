// api/leader-loop/reflection/route.ts
// Leader submits their reflection after reviewing 360 profile and insights.
// CHRIS responds with a coaching message — developmental, not directive.

import { NextRequest, NextResponse } from 'next/server';
import { callClaudeText } from '@/lib/anthropic/client';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { facility_id, leader_id, cycle_id, reflection_text } = body as {
    facility_id: string;
    leader_id: string;
    cycle_id: number;
    reflection_text: string;
  };

  if (!facility_id || !leader_id || !reflection_text?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Generate CHRIS coaching response
  const response = await callClaudeText({
    system: `You are CHRIS — a coaching companion for an aged care team leader reviewing their 360 feedback. Coaching tone. Curious rather than directive. Invite reflection. Surface questions rather than answers. Warm, honest, and genuinely interested in the leader's development. The Genos EI framework underpins your approach. Keep under 60 words. No preamble. No bullet points.`,
    messages: [{
      role: 'user',
      content: `The leader reflected: "${reflection_text}"\n\nRespond as their coaching companion. Validate their insight. Add one question that deepens the reflection.`,
    }],
    maxTokens: 150,
    facilityId: facility_id,
    agentName: 'briefing_engine',
    callType: 'leader_reflection_response',
  });

  // TODO: Ivan — update leader_loop_cycles:
  //   reflection_text, reflection_submitted_at, chris_response

  console.log(`[LeaderReflectionAPI] Reflection submitted — leader: ${leader_id}`);

  return NextResponse.json({
    success: true,
    chris_response: response,
  });
}
