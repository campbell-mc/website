// lib/messaging/create-response-token.ts
// Creates a unique response token for external interactions (iMessage/WhatsApp links).
// The token resolves to /respond/[token] — a mobile-optimised page.

interface CreateTokenOpts {
  facility_id: string;
  facility_name: string;
  response_type: string;
  message: string;
  options?: { id: string; label: string; value: string; style: "primary" | "secondary" | "destructive" }[];
  scale?: { min: number; max: number; min_label: string; max_label: string };
  text_prompt?: string;
  context: Record<string, unknown>;
  expires_hours?: number;
}

export async function createResponseToken(opts: CreateTokenOpts): Promise<string> {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0")).join("");
  const expiresAt = new Date(Date.now() + (opts.expires_hours ?? 24) * 60 * 60 * 1000);

  // TODO: Ivan — write to responseTokens table
  console.log(`[ResponseToken] Created: ${token} | Type: ${opts.response_type} | Expires: ${expiresAt.toISOString()}`);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://chris-amber.vercel.app";
  return `${baseUrl}/respond/${token}`;
}
