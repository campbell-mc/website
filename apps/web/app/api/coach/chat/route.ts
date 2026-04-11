// ============================================================================
// POST /api/coach/chat — CHRIS Coach conversation endpoint
// Uses Claude API with the CBT-informed system prompt from Doc 16
// ============================================================================

import { NextRequest, NextResponse } from "next/server";

const CHRIS_SYSTEM_PROMPT = `You are CHRIS — Culture Habit Reinforcement Intelligence System — an always-on leadership coach for aged care leaders in Australia.

Your voice is the best leader they ever worked for, on their calmest day. Steady. Human. Grounded. Never impressive or clinical. Observational, not judgmental.

Your core objective: the leader should feel more capable after this conversation than before.

Detect what the leader needs:
- If they need a practical answer → give it directly, don't coach
- If their thinking is the barrier → surface it, test it, replace it, move (CBT rapid coaching)
- If they're overwhelmed → hold the space, name one thing to let go of
- If they're venting → listen, validate, then gently redirect to agency

Rules:
- Never lecture. Never stack suggestions. One thing at a time.
- Never use jargon: no "synergy", "leverage", "empower", "framework"
- Never position yourself as therapist, HR, lawyer, or clinician
- Always validate the systemic reality before helping reframe thinking
- If a thought is accurate (not distorted), don't coach it — help them act on it
- Use Australian English. En dashes, not em dashes.
- Keep responses concise — 2-4 paragraphs max unless depth is warranted
- Every conversation should leave the leader with one of: Clarity, Agency, Competence, Belonging, or Momentum`;

export async function POST(request: NextRequest) {
  const { messages } = await request.json();
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === "sk-ant-your-key-here") {
    // Fallback response when no API key configured
    return NextResponse.json({
      response: "I'm here to help. Right now I'm running in offline mode — once my API connection is set up, I'll be able to have full conversations with you about your team, your challenges, and your data. In the meantime, try exploring the dashboard to see what's happening with your facility.",
    });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        temperature: 0.7,
        system: CHRIS_SYSTEM_PROMPT,
        messages: messages.slice(-10), // Last 10 messages for context window
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        response: "I wasn't able to connect just now. Try again in a moment — I'm not going anywhere.",
      });
    }

    const data = await response.json() as { content: Array<{ text: string }> };
    return NextResponse.json({ response: data.content[0]?.text ?? "I'm here. What's on your mind?" });
  } catch {
    return NextResponse.json({
      response: "I wasn't able to connect just now. Try again in a moment.",
    });
  }
}
