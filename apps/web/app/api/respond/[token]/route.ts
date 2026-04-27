import { NextRequest, NextResponse } from "next/server";

// Demo response tokens for testing
const DEMO_TOKENS: Record<string, any> = {
  "demo-roster-gap": {
    type: "roster_gap", facility_name: "Mt Gib Gardens Bowral",
    message: "Tonight's AIN shift in Grevillea Wing (2pm–10pm) is unfilled. Can you cover?",
    options: [
      { id: "yes", label: "Yes, I can cover", value: "yes_cover", style: "primary" },
      { id: "partial", label: "I can do 2pm–6pm", value: "partial_cover", style: "secondary" },
      { id: "no", label: "Not available", value: "unavailable", style: "secondary" },
    ],
    expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    already_responded: false,
  },
  "demo-leader-loop": {
    type: "leader_loop", facility_name: "Mt Gib Gardens Bowral",
    message: "Anika has asked for your quick, anonymous feedback on their leadership this fortnight.",
    options: [
      { id: "yes", label: "Yes, definitely", value: "yes_definitely", style: "primary" },
      { id: "somewhat", label: "Somewhat", value: "somewhat", style: "secondary" },
      { id: "no", label: "Not really", value: "not_really", style: "secondary" },
    ],
    scale: { min: 1, max: 5, min_label: "Not supported", max_label: "Very supported" },
    text_prompt: "One word for Anika's leadership this fortnight:",
    expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    already_responded: false,
  },
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const demo = DEMO_TOKENS[token];
  if (demo) return NextResponse.json(demo);

  // TODO: Ivan — look up from responseTokens table
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const body = await request.json();
  console.log(`[ResponseAPI] Token: ${token} | Response: ${body.response} | Scale: ${body.scale_value} | Text: ${body.text_input}`);

  // TODO: Ivan — update responseTokens table, route response
  return NextResponse.json({ success: true });
}
