// ============================================================================
// Magic Link Auth — LinqApp / iMessage Delivery
//
// Flow:
//   1. User enters phone number
//   2. CHRIS generates a magic link token (crypto random, 15-min expiry)
//   3. Link sent via LinqApp API → delivered as iMessage
//   4. User taps link → token verified → JWT session created
//   5. Session: 30-day mobile, 8-hour desktop
//
// Fallback: if LinqApp delivery fails, send via Twilio SMS
// ============================================================================

import { db, users, magicLinks, sessions } from "@chris/db";
import { eq, and, gt, isNull } from "drizzle-orm";
import { randomBytes, createHash } from "crypto";

const MAGIC_LINK_EXPIRY_MINUTES = 15;
const SESSION_EXPIRY_MOBILE_DAYS = 30;
const SESSION_EXPIRY_DESKTOP_HOURS = 8;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// --- Token Generation ---

function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// --- Send Magic Link ---

export async function sendMagicLink(phone: string): Promise<{ success: boolean; error?: string }> {
  // Normalize phone to E.164
  const normalizedPhone = normalizePhone(phone);

  // Look up user
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.phone, normalizedPhone), eq(users.isActive, true)));

  if (!user) {
    // Don't reveal whether phone exists — return success silently
    return { success: true };
  }

  // Generate token
  const token = generateToken();
  const expiresAt = new Date(Date.now() + MAGIC_LINK_EXPIRY_MINUTES * 60 * 1000);

  // Store hashed token
  await db.insert(magicLinks).values({
    userId: user.id,
    token: hashToken(token),
    expiresAt,
  });

  // Build magic link URL
  const magicLinkUrl = `${APP_URL}/auth/verify?token=${token}`;

  // Send via LinqApp → iMessage
  const delivered = await sendViaLinqApp(normalizedPhone, user.name, magicLinkUrl);

  if (!delivered) {
    // Fallback: Twilio SMS
    const smsSent = await sendViaTwilio(normalizedPhone, magicLinkUrl);
    if (!smsSent) {
      return { success: false, error: "delivery_failed" };
    }
  }

  return { success: true };
}

// --- Verify Magic Link ---

export async function verifyMagicLink(
  token: string,
  isMobile: boolean = true
): Promise<{
  success: boolean;
  sessionToken?: string;
  user?: { id: string; name: string; role: string; providerId: string; facilityIds: unknown };
  error?: string;
}> {
  const hashedToken = hashToken(token);

  // Find unexpired, unused magic link
  const [link] = await db
    .select()
    .from(magicLinks)
    .where(
      and(
        eq(magicLinks.token, hashedToken),
        gt(magicLinks.expiresAt, new Date()),
        isNull(magicLinks.usedAt)
      )
    );

  if (!link) {
    return { success: false, error: "invalid_or_expired" };
  }

  // Mark as used
  await db
    .update(magicLinks)
    .set({ usedAt: new Date() })
    .where(eq(magicLinks.id, link.id));

  // Get user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, link.userId));

  if (!user || !user.isActive) {
    return { success: false, error: "user_inactive" };
  }

  // Create session
  const sessionToken = generateToken();
  const sessionExpiry = isMobile
    ? new Date(Date.now() + SESSION_EXPIRY_MOBILE_DAYS * 24 * 60 * 60 * 1000)
    : new Date(Date.now() + SESSION_EXPIRY_DESKTOP_HOURS * 60 * 60 * 1000);

  await db.insert(sessions).values({
    userId: user.id,
    token: hashToken(sessionToken),
    expiresAt: sessionExpiry,
  });

  // Update last login
  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, user.id));

  return {
    success: true,
    sessionToken,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      providerId: user.providerId,
      facilityIds: user.facilityIds,
    },
  };
}

// --- Validate Session ---

export async function validateSession(
  sessionToken: string
): Promise<{
  valid: boolean;
  user?: { id: string; name: string; role: string; providerId: string; facilityIds: unknown };
}> {
  const hashedToken = hashToken(sessionToken);

  const [session] = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.token, hashedToken),
        gt(sessions.expiresAt, new Date())
      )
    );

  if (!session) {
    return { valid: false };
  }

  // Refresh last active
  await db
    .update(sessions)
    .set({ lastActiveAt: new Date() })
    .where(eq(sessions.id, session.id));

  // Get user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId));

  if (!user || !user.isActive) {
    return { valid: false };
  }

  return {
    valid: true,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      providerId: user.providerId,
      facilityIds: user.facilityIds,
    },
  };
}

// --- LinqApp Delivery ---

async function sendViaLinqApp(phone: string, name: string, magicLinkUrl: string): Promise<boolean> {
  const linqAppApiKey = process.env.LINQAPP_API_KEY;
  if (!linqAppApiKey) {
    console.log(`[Auth] LinqApp not configured. Magic link for ${phone}: ${magicLinkUrl}`);
    return false;
  }

  try {
    const message = `Hi ${name} — tap to open CHRIS:\n${magicLinkUrl}\n\nThis link expires in 15 minutes.`;

    const response = await fetch("https://api.linqapp.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${linqAppApiKey}`,
      },
      body: JSON.stringify({
        to: phone,
        message,
        channel: "imessage",
      }),
    });

    if (response.ok) {
      console.log(`[Auth] Magic link sent via LinqApp to ${phone}`);
      return true;
    }

    console.warn(`[Auth] LinqApp delivery failed: ${response.status}`);
    return false;
  } catch (err) {
    console.error("[Auth] LinqApp error:", err);
    return false;
  }
}

// --- Twilio SMS Fallback ---

async function sendViaTwilio(phone: string, magicLinkUrl: string): Promise<boolean> {
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_FROM_NUMBER;

  if (!twilioSid || !twilioToken || !twilioFrom) {
    console.log(`[Auth] Twilio not configured. Magic link for ${phone}: ${magicLinkUrl}`);
    return false;
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: phone,
          From: twilioFrom,
          Body: `CHRIS: Tap to sign in → ${magicLinkUrl} (expires in 15 min)`,
        }),
      }
    );

    if (response.ok) {
      console.log(`[Auth] Magic link sent via Twilio SMS to ${phone}`);
      return true;
    }

    console.warn(`[Auth] Twilio SMS failed: ${response.status}`);
    return false;
  } catch (err) {
    console.error("[Auth] Twilio error:", err);
    return false;
  }
}

// --- Phone Normalization ---

function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)]/g, "");

  // Australian mobile: 04XX → +614XX
  if (cleaned.startsWith("04")) {
    cleaned = "+61" + cleaned.slice(1);
  }
  // Already has country code
  if (!cleaned.startsWith("+")) {
    cleaned = "+61" + cleaned;
  }

  return cleaned;
}
