// lib/librarian/record.ts
// Stores reasoning traces — the audit trail of every agent decision.
// "Why did CHRIS recommend this?" → traceable to specific knowledge + data.

import type { ReasoningTraceInput } from './types';

/**
 * Record a reasoning trace for an agent run.
 * Phase 1: console log. Phase 2: INSERT into reasoning_traces table.
 */
export async function record(trace: ReasoningTraceInput): Promise<void> {
  const run_id = trace.agent + '-' + Date.now().toString(36);

  // TODO: Phase 2 — write to reasoning_traces table:
  // await db.insert(reasoningTraces).values({
  //   facility_id: trace.facility_id,
  //   agent: trace.agent,
  //   run_id,
  //   trigger: trace.trigger,
  //   knowledge_used: trace.knowledge_used,
  //   data_queried: trace.data_queried,
  //   findings_count: trace.findings_count,
  //   findings: trace.findings,
  //   narrative: trace.narrative,
  //   actions_recommended: trace.actions_recommended,
  //   model: trace.model,
  //   input_tokens: trace.input_tokens,
  //   output_tokens: trace.output_tokens,
  //   estimated_cost_usd: trace.estimated_cost_usd,
  //   duration_ms: trace.duration_ms,
  // });

  console.log(`[Librarian] record: ${trace.agent} | ${run_id} | ${trace.trigger} | ${trace.findings_count} findings | ${trace.duration_ms ?? 0}ms | $${(trace.estimated_cost_usd ?? 0).toFixed(4)}`);
}
