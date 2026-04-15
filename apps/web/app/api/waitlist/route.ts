import { NextRequest, NextResponse } from "next/server";

// In-memory store for waitlist signups (persists to DB when Neon connected)
const signups: Array<{ email: string; name: string; role: string; organisation: string; timestamp: string }> = [];

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, name, role, organisation } = body;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  // Check for duplicate
  if (signups.some((s) => s.email === email)) {
    return NextResponse.json({ success: true, message: "Already on the waitlist" });
  }

  const entry = {
    email: String(email).trim(),
    name: String(name ?? "").trim(),
    role: String(role ?? "").trim(),
    organisation: String(organisation ?? "").trim(),
    timestamp: new Date().toISOString(),
  };

  signups.push(entry);

  // Send notification email to hello@culturecrunch.io
  try {
    // Use mailto link approach via fetch to a notification service
    // For now, log the signup and attempt a simple email via Resend if available
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "CHRIS-OS <notifications@culturecrunch.io>",
          to: "hello@culturecrunch.io",
          subject: `Waitlist signup: ${entry.name || entry.email}`,
          text: `New CHRIS-OS waitlist signup:\n\nName: ${entry.name || "Not provided"}\nEmail: ${entry.email}\nRole: ${entry.role || "Not provided"}\nOrganisation: ${entry.organisation || "Not provided"}\nTime: ${entry.timestamp}`,
        }),
      });
    }
  } catch {
    // Email send failed — don't block the signup
  }

  console.log(`[Waitlist] New signup: ${entry.email} | ${entry.name} | ${entry.role} | ${entry.organisation}`);

  return NextResponse.json({
    success: true,
    message: "You're on the waitlist. We'll be in touch.",
  });
}

export async function GET() {
  return NextResponse.json({ count: signups.length });
}
