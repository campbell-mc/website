import { NextRequest, NextResponse } from "next/server";

// In-memory store for waitlist signups (persists to DB when Neon connected)
const signups: Array<Record<string, string>> = [];

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, name, role, organisation, homes, exposure, routing, source, workflow_interest, calculator_data } = body;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  // Check for duplicate
  if (signups.some((s) => s.email === email)) {
    return NextResponse.json({ success: true, message: "Already on the list" });
  }

  const entry: Record<string, string> = {
    email: String(email).trim(),
    name: String(name ?? "").trim(),
    role: String(role ?? "").trim(),
    organisation: String(organisation ?? "").trim(),
    homes: String(homes ?? "").trim(),
    exposure: String(exposure ?? "").trim(),
    routing: String(routing ?? "waitlist").trim(),
    source: String(source ?? "").trim(),
    workflow_interest: String(workflow_interest ?? "").trim(),
    calculator_data: calculator_data ? JSON.stringify(calculator_data) : "",
    timestamp: new Date().toISOString(),
  };

  signups.push(entry);

  // Fire webhook to Cowork sales sheet if configured
  const webhookUrl = process.env.COWORK_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
    } catch (err) {
      console.warn("[Waitlist] Webhook failed:", err);
    }
  } else {
    console.warn("[Waitlist] COWORK_WEBHOOK_URL not set. Submission stored in-memory only.");
  }

  // Send notification email via Resend if available
  try {
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const routingLabel = entry.routing === "diagnostic-call" ? "DIAGNOSTIC CALL REQUEST" : "Waitlist signup";
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Chris-OS <notifications@culturecrunch.io>",
          to: "hello@culturecrunch.io",
          subject: `${routingLabel}: ${entry.name || entry.email}`,
          text: [
            `${routingLabel}`,
            "",
            `Name: ${entry.name || "Not provided"}`,
            `Email: ${entry.email}`,
            `Role: ${entry.role || "Not provided"}`,
            `Organisation: ${entry.organisation || "Not provided"}`,
            `Homes: ${entry.homes || "Not provided"}`,
            `Exposure: ${entry.exposure || "Not provided"}`,
            `Source: ${entry.source || "direct"}`,
            entry.workflow_interest ? `Tool: ${entry.workflow_interest}` : "",
            entry.calculator_data ? `Calculator data: ${entry.calculator_data}` : "",
            `Time: ${entry.timestamp}`,
          ].filter(Boolean).join("\n"),
        }),
      });
    }
  } catch {
    // Email send failed, do not block the signup
  }

  console.log(`[Waitlist] ${entry.routing}: ${entry.email} | ${entry.name} | ${entry.role} | ${entry.organisation}`);

  return NextResponse.json({
    success: true,
    routing: entry.routing,
    message: entry.routing === "diagnostic-call"
      ? "Received. We will be in touch within 48 hours."
      : "You are on the list. We will be in touch.",
  });
}

export async function GET() {
  return NextResponse.json({ count: signups.length });
}
