// ============================================================================
// POST /api/conversations/open — Open a CHRIS conversation with context
// Returns a context-specific opening message and suggested actions.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";

interface SuggestedAction {
  label: string;
  type: "respond" | "navigate";
  payload: string;
}

// ── Opening messages by context type ─────────────────────────────

const OPENING_MESSAGES: Record<string, string> = {
  general:
    "Three things on the board today \u2014 the SIRS Cat 1 draft needs your review (6 hours remaining), the Oracle found $11.4K/month in AN-ACC opportunities, and Grevillea Wing\u2019s PSH data needs the leadership team\u2019s attention this week.",
  sirs_draft:
    "The SIRS Cat 1 notification for the Wing B fall is ready for your review. You have 6 hours remaining. The Chronicler has pre-populated everything except the resident details and medical outcome \u2014 those need your input.",
  oracle_report:
    "Three revenue opportunities this week totalling $11,400 per month. The AN-ACC reclassification for 3 residents is the highest priority \u2014 clinical reviews on Tuesday would capture $8,200/month.",
  psh_team:
    "Grevillea Wing\u2019s pattern is clear \u2014 PSH_08 and PSH_01 have been co-elevated for 6 cycles. The practices aren\u2019t moving them. This needs a collective conversation at the Leadership Session.",
  financial:
    "Care ratio at 51.9% is genuinely strong \u2014 top quartile against StewartBrown. The drag is agency at 18% \u2014 $950/week premium. The Steward\u2019s Sunday PM recommendation would save $4,940/year.",
  workforce:
    "The workforce picture is split. Wattle Wing is improving \u2014 PSH_08 down 0.08. Grevillea Wing needs attention. The Keeper has flagged a turnover precursor in Team B \u2014 71% probability within 4\u20136 cycles.",
  roster:
    "Tonight\u2019s the one to watch. The Grevillea Wing AIN gap is still unfilled. If agency isn\u2019t confirmed by 3pm, care minutes breach tonight for the first time this week.",
};

// ── Suggested actions by context type ────────────────────────────

const SUGGESTED_ACTIONS: Record<string, SuggestedAction[]> = {
  general: [
    { label: "Review SIRS draft", type: "navigate", payload: "/sirs/drafts" },
    { label: "Show AN-ACC opportunities", type: "respond", payload: "Tell me more about the AN-ACC opportunities" },
    { label: "PSH breakdown", type: "respond", payload: "Walk me through the Grevillea Wing PSH data" },
  ],
  sirs_draft: [
    { label: "Open draft", type: "navigate", payload: "/sirs/drafts" },
    { label: "What\u2019s pre-filled?", type: "respond", payload: "What has the Chronicler already filled in?" },
    { label: "Show timeline", type: "respond", payload: "Show me the SIRS timeline and deadline" },
    { label: "Similar incidents", type: "respond", payload: "Have there been similar incidents this quarter?" },
  ],
  oracle_report: [
    { label: "AN-ACC details", type: "respond", payload: "Break down the AN-ACC reclassification opportunity" },
    { label: "Schedule reviews", type: "respond", payload: "Help me plan the Tuesday clinical reviews" },
    { label: "Revenue trend", type: "respond", payload: "Show me the revenue trend over the last 3 months" },
  ],
  psh_team: [
    { label: "PSH breakdown", type: "respond", payload: "Show me the PSH_08 and PSH_01 trend data" },
    { label: "Current practices", type: "respond", payload: "What practices have been tried so far?" },
    { label: "Prep leadership session", type: "respond", payload: "Help me prepare talking points for the Leadership Session" },
  ],
  financial: [
    { label: "Agency deep-dive", type: "respond", payload: "Break down the agency spend by wing and shift" },
    { label: "Sunday PM plan", type: "respond", payload: "Explain the Steward\u2019s Sunday PM recommendation" },
    { label: "StewartBrown comparison", type: "respond", payload: "How do we compare to StewartBrown benchmarks across all categories?" },
  ],
  workforce: [
    { label: "Grevillea detail", type: "respond", payload: "What\u2019s happening in Grevillea Wing specifically?" },
    { label: "Team B risk", type: "respond", payload: "Tell me about the turnover precursor in Team B" },
    { label: "Wattle improvement", type: "respond", payload: "What drove the improvement in Wattle Wing?" },
  ],
  roster: [
    { label: "Fill the gap", type: "respond", payload: "What are the options for filling the Grevillea AIN gap?" },
    { label: "Care minutes impact", type: "respond", payload: "What\u2019s the care minutes impact if it stays unfilled?" },
    { label: "Agency status", type: "respond", payload: "Check the agency confirmation status" },
    { label: "Open roster", type: "navigate", payload: "/roster/tonight" },
  ],
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    facility_id,
    facility_name,
    context_type,
    context_id,
    context_label,
    context_data,
    user_role,
  } = body;

  const conversationId = `demo-${Date.now()}`;
  const type = context_type ?? "general";

  // Pick opening message
  const content =
    OPENING_MESSAGES[type] ??
    `Here\u2019s the current picture for ${facility_name || "your facility"}. What would you like to focus on today?`;

  // Pick suggested actions
  const suggested_actions =
    SUGGESTED_ACTIONS[type] ?? [
      { label: "Show today\u2019s priorities", type: "respond" as const, payload: "What should I focus on today?" },
      { label: "Compliance status", type: "respond" as const, payload: "Give me a compliance overview" },
      { label: "Workforce pulse", type: "respond" as const, payload: "How is the workforce tracking?" },
    ];

  console.log(
    `[ConversationAPI] Opened: ${conversationId} | ${type} | ${user_role} | facility=${facility_id}`
  );

  return NextResponse.json({
    conversation_id: conversationId,
    content,
    suggested_actions,
  });
}
