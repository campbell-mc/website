// ============================================================================
// POST /api/comply/submit — Score the audit and return results
// PUT /api/comply/submit — Capture email after results are shown
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { scoreAudit } from "@chris/engines/comply/scoring";
import type { ComplyAnswer } from "@chris/engines/comply/scoring";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { providerInfo, answers } = body as {
    providerInfo: { name: string; state: string; careType: string; bedCount: string };
    answers: ComplyAnswer[];
  };

  // Score the audit
  const results = scoreAudit(answers);

  // Log lead (in production: INSERT to provider_leads table)
  console.log("[Comply] New audit:", {
    provider: providerInfo.name,
    state: providerInfo.state,
    careType: providerInfo.careType,
    score: results.total,
    conversionPriority: results.conversionPriority,
  });

  // If critical: flag for Campbell's immediate attention
  if (results.conversionPriority === "critical") {
    console.log(`[Comply] CRITICAL lead: ${providerInfo.name} (${results.total}/100). Campbell outreach required.`);
  }

  return NextResponse.json(results);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { email, results } = body;

  // Capture email (in production: UPDATE provider_leads + send via Resend)
  console.log("[Comply] Email captured:", email, "Score:", results?.total);

  return NextResponse.json({ success: true });
}
