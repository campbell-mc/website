// lib/messaging/compose.ts
// Composes CHRIS-voice messages for WhatsApp/iMessage delivery.
// Every outbound message from CHRIS uses this — never raw text.

import { callClaudeText } from "@/lib/anthropic/client";

interface ComposeOpts {
  event_type: string;
  recipient_role: string;
  recipient_name?: string;
  facility_name: string;
  context: Record<string, unknown>;
  urgency: "immediate" | "urgent" | "routine";
  max_chars?: number;
}

const URGENCY_GUIDANCE: Record<string, string> = {
  immediate: "Time-critical. Name the deadline and consequence immediately. No preamble. No greeting.",
  urgent: "Important but not panicked. One sentence of context, then what needs to happen.",
  routine: "Part of the regular rhythm. Warm and collegial — a tap on the shoulder from someone who knows them.",
};

export async function composeMessage(opts: ComposeOpts): Promise<string> {
  const maxChars = opts.max_chars ?? 180;

  const message = await callClaudeText({
    system: `You are CHRIS writing a WhatsApp message to a ${opts.recipient_role} at ${opts.facility_name}.

VOICE: Specific, direct, intelligent, appropriately urgent. A trusted colleague, not a corporate system.
URGENCY: ${opts.urgency} — ${URGENCY_GUIDANCE[opts.urgency]}

RULES:
- Maximum ${maxChars} characters
- No ALL CAPS except acronyms (SIRS, CHRIS, RN, DON, FM)
- No "Dear" or "Hello" — get straight to it
- No sign-off. No exclamation marks for routine.
- Write as if a smart colleague sent a voice note that was transcribed.
- The message will be followed by tap buttons — don't include "tap below".

Write ONLY the message body.`,
    messages: [{ role: "user", content: `Write a WhatsApp message for:\nEvent: ${opts.event_type}\nRecipient: ${opts.recipient_name ?? opts.recipient_role}\nContext: ${JSON.stringify(opts.context)}` }],
    maxTokens: 100,
    facilityId: "system",
    agentName: "messaging",
    callType: "compose_message",
  });

  return message.trim().slice(0, maxChars);
}
