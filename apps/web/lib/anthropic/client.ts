// lib/anthropic/client.ts
// Maintained by Ivan Sanchez
// All Claude API calls in CHRIS go through this function

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type ClaudeModel =
  | 'claude-sonnet-4-20250514'  // default — agents, briefings, situation reports
  | 'claude-opus-4-20250514';   // CHRIS Coach only — richer coaching responses

export interface ClaudeCallParams {
  system: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  maxTokens?: number;
  model?: ClaudeModel;
  facilityId?: string;   // for logging and audit trail
  agentName?: string;    // for logging — which agent called this
  callType?: string;     // for logging — briefing | agent | coach | situation_report
}

export interface ClaudeCallResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
  model: string;
  durationMs: number;
}

export async function callClaude({
  system,
  messages,
  maxTokens = 1000,
  model = 'claude-sonnet-4-20250514',
  facilityId,
  agentName,
  callType,
}: ClaudeCallParams): Promise<ClaudeCallResult> {

  const startTime = Date.now();

  const response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages,
  });

  const durationMs = Date.now() - startTime;

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('');

  const result: ClaudeCallResult = {
    text,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    model: response.model,
    durationMs,
  };

  // Log every API call for monitoring and cost tracking
  // Non-blocking — never fails the parent call
  logApiCall({
    facilityId,
    agentName,
    callType,
    model,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
    durationMs,
    success: true,
  }).catch(console.error);

  return result;
}

// Convenience wrapper that returns text only
// Used by agents that just need the string
export async function callClaudeText(params: ClaudeCallParams): Promise<string> {
  const result = await callClaude(params);
  return result.text;
}

// Multi-turn conversation helper
// Used by CHRIS Coach for ongoing conversations
export async function callClaudeConversation({
  system,
  history,
  newMessage,
  maxTokens = 1000,
  model = 'claude-opus-4-20250514',
  facilityId,
  agentName = 'chris_coach',
}: {
  system: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  newMessage: string;
  maxTokens?: number;
  model?: ClaudeModel;
  facilityId?: string;
  agentName?: string;
}): Promise<ClaudeCallResult> {

  return callClaude({
    system,
    messages: [...history, { role: 'user', content: newMessage }],
    maxTokens,
    model,
    facilityId,
    agentName,
    callType: 'coach',
  });
}

// Internal logging — writes to api_call_log table
// Non-blocking — parent call never waits for this
async function logApiCall(params: {
  facilityId?: string;
  agentName?: string;
  callType?: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  durationMs: number;
  success: boolean;
  error?: string;
}) {
  try {
    // TODO: Wire to Neon when db client is connected
    // For now, log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[CHRIS API] ${params.agentName || 'unknown'} | ${params.callType || 'unknown'} | ${params.model} | ${params.inputTokens}in/${params.outputTokens}out | ${params.durationMs}ms`);
    }
  } catch {
    // Logging failure should never break the parent call
    console.error('API call logging failed');
  }
}

// Cost estimation helper for operator dashboard
export function estimateCost(inputTokens: number, outputTokens: number, model: ClaudeModel): number {
  const pricing: Record<ClaudeModel, { input: number; output: number }> = {
    'claude-sonnet-4-20250514': { input: 3.00, output: 15.00 },  // per million tokens
    'claude-opus-4-20250514':   { input: 5.00, output: 25.00 },
  };
  const p = pricing[model];
  return (inputTokens * p.input + outputTokens * p.output) / 1_000_000;
}
