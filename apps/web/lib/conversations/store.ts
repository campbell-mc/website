// lib/conversations/store.ts
// Conversation persistence for CHRIS Coach.
// Uses in-memory store until Neon DB is connected, then upgrades seamlessly.

import { randomUUID } from "crypto";

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  sender_type: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  facility_id: string;
  user_role: string;
  user_name: string | null;
  context_type: string;
  title: string | null;
  message_count: number;
  last_message_at: string | null;
  created_at: string;
  messages: ConversationMessage[];
}

// ── In-memory store ─────────────────────────────────────────────
// Keyed by `${facility_id}:${user_role}` — one active conversation per role per facility.

const conversationStore = new Map<string, Conversation>();

function storeKey(facilityId: string, userRole: string): string {
  return `${facilityId}:${userRole}`;
}

/**
 * Get or create a conversation for a role at a facility.
 */
export function getOrCreateConversation(
  facilityId: string,
  userRole: string,
  userName?: string,
  contextType?: string
): Conversation {
  const key = storeKey(facilityId, userRole);
  let conv = conversationStore.get(key);

  if (!conv) {
    conv = {
      id: `conv-${randomUUID().slice(0, 8)}`,
      facility_id: facilityId,
      user_role: userRole,
      user_name: userName ?? null,
      context_type: contextType ?? "general",
      title: null,
      message_count: 0,
      last_message_at: null,
      created_at: new Date().toISOString(),
      messages: [],
    };
    conversationStore.set(key, conv);
  }

  return conv;
}

/**
 * Add a message to a conversation.
 */
export function addMessage(
  facilityId: string,
  userRole: string,
  senderType: "user" | "assistant" | "system",
  content: string
): ConversationMessage {
  const conv = getOrCreateConversation(facilityId, userRole);
  const msg: ConversationMessage = {
    id: `msg-${Date.now()}-${randomUUID().slice(0, 4)}`,
    conversation_id: conv.id,
    sender_type: senderType,
    content,
    created_at: new Date().toISOString(),
  };

  conv.messages.push(msg);
  conv.message_count = conv.messages.length;
  conv.last_message_at = msg.created_at;

  // Auto-generate title from first user message
  if (!conv.title && senderType === "user") {
    conv.title = content.length > 60 ? content.slice(0, 57) + "..." : content;
  }

  // Keep last 100 messages per conversation
  if (conv.messages.length > 100) {
    conv.messages = conv.messages.slice(-100);
  }

  return msg;
}

/**
 * Get message history for a conversation (for Claude API context).
 * Returns the last N messages in { role, content } format.
 */
export function getMessageHistory(
  facilityId: string,
  userRole: string,
  limit = 20
): Array<{ role: "user" | "assistant"; content: string }> {
  const conv = conversationStore.get(storeKey(facilityId, userRole));
  if (!conv) return [];

  return conv.messages
    .filter((m) => m.sender_type === "user" || m.sender_type === "assistant")
    .slice(-limit)
    .map((m) => ({
      role: m.sender_type as "user" | "assistant",
      content: m.content,
    }));
}

/**
 * Get full conversation with messages.
 */
export function getConversation(
  facilityId: string,
  userRole: string
): Conversation | null {
  return conversationStore.get(storeKey(facilityId, userRole)) ?? null;
}

/**
 * Clear a conversation (start fresh).
 */
export function clearConversation(facilityId: string, userRole: string): void {
  conversationStore.delete(storeKey(facilityId, userRole));
}

/**
 * List all conversations (for admin/debug).
 */
export function listConversations(): Conversation[] {
  return Array.from(conversationStore.values()).sort(
    (a, b) => (b.last_message_at ?? "").localeCompare(a.last_message_at ?? "")
  );
}
