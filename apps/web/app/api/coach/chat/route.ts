// ============================================================================
// POST /api/coach/chat — CHRIS Coach conversation endpoint
// Reads persona from role config. Each role gets a different CHRIS voice.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getCoachPersona } from "@/lib/roles/coach-personas";
import type { CoachPersona } from "@/lib/roles/types";

export async function POST(request: NextRequest) {
  const { messages, persona } = await request.json() as {
    messages: Array<{ role: string; content: string }>;
    persona?: CoachPersona;
  };

  const systemPrompt = getCoachPersona(persona ?? "operational");
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === "sk-ant-your-key-here") {
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
        system: systemPrompt,
        messages: messages.slice(-10),
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
