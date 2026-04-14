// ============================================================================
// POST /api/conversations/message — Send a message in a CHRIS conversation
// Uses callClaudeConversation when API key is available, otherwise demo mode.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";

// ── CHRIS system prompt builder ──────────────────────────────────

function buildSystemPrompt(
  context_type: string | undefined,
  context_data: Record<string, unknown> | undefined,
  user_role: string | undefined,
  facility_name: string | undefined
): string {
  return `You are CHRIS — Culture Habit Reinforcement Intelligence System — an AI operational intelligence platform for Australian aged care providers.

## Voice rules
- Be specific. Use numbers, names, dates, wing labels. Never be vague.
- Be direct. Lead with the insight, not the preamble. No "Great question!" or "I'd be happy to help."
- Be warm. You are a trusted colleague, not a chatbot. Use plain language.
- No corporate language. No "leverage", "synergy", "stakeholders". Say what you mean.
- Reference data. Cite StewartBrown benchmarks, PSH scores, care minutes data when relevant.
- Be honest about uncertainty. If you don't have data, say so clearly.

## Context
- Facility: ${facility_name || "Current facility"}
- User role: ${user_role || "facility_manager"}
- Context type: ${context_type || "general"}
${context_data ? `- Context data: ${JSON.stringify(context_data)}` : ""}

## Capabilities
You can:
- Explain data patterns, trends, and anomalies in plain language
- Draft communications (SIRS notifications, governance notes, team updates)
- Recommend evidence-based practices from the CHRIS practice library
- Compare performance against StewartBrown aged care benchmarks
- Identify workforce risks and suggest interventions
- Walk through compliance requirements and deadlines
- Prepare talking points for leadership sessions

## StewartBrown benchmarks (reference)
- Care ratio target: 52%+ (top quartile)
- Agency target: <10% of total hours
- Staff turnover benchmark: <25% annually
- Care minutes: RN 40min, EN 20min, AIN 140min (200 total target)

Always respond in the context of Australian aged care regulation and operations.`;
}

// ── Demo response generator ──────────────────────────────────────

function generateDemoResponse(message: string, context_type?: string): string {
  const lower = message.toLowerCase();

  // SIRS-related
  if (lower.includes("sirs") || lower.includes("notification") || lower.includes("chronicler")) {
    return "The SIRS Cat 1 draft has the incident details, contributing factors, and immediate actions pre-filled from the incident log. What\u2019s missing: the resident\u2019s medical outcome (you\u2019ll need that from the GP review) and your sign-off on the root cause classification. The deadline is 24 hours from incident time \u2014 you have about 6 hours remaining. Want me to open the draft for you?";
  }

  // AN-ACC / revenue
  if (lower.includes("an-acc") || lower.includes("revenue") || lower.includes("reclassification")) {
    return "The three AN-ACC opportunities:\n\n1. **3 residents for reclassification** \u2014 $8,200/month. Their care needs have increased since last classification. Tuesday\u2019s clinical reviews would capture this.\n2. **Medication management uplift** \u2014 $1,800/month. Documentation gap in 2 residents\u2019 polypharmacy management.\n3. **Pain management domain** \u2014 $1,400/month. One resident\u2019s chronic pain regime changed but AN-ACC hasn\u2019t been updated.\n\nThe reclassification is the highest-value move. Want me to draft the clinical review schedule for Tuesday?";
  }

  // PSH / psychosocial hazard
  if (lower.includes("psh") || lower.includes("psychosocial") || lower.includes("hazard")) {
    return "PSH_08 (workload management) and PSH_01 (role clarity) have been co-elevated in Grevillea Wing for 6 consecutive cycles. The pattern: when workload spikes, role boundaries blur \u2014 AINs pick up RN tasks, nobody\u2019s clear on escalation paths.\n\nThe practices assigned (micro-debriefs, role cards) haven\u2019t shifted the scores. This is a structural issue, not a behavioural one. It needs a leadership conversation about staffing ratios in that wing.\n\nWattle Wing ran the same pattern 4 months ago and resolved it by adjusting the afternoon skill mix. That\u2019s the playbook here.";
  }

  // Agency / workforce
  if (lower.includes("agency") || lower.includes("workforce") || lower.includes("turnover") || lower.includes("staffing")) {
    return "Agency sits at 18% of total hours \u2014 the StewartBrown benchmark is under 10%. The cost premium is $950/week, or roughly $49,400/year.\n\nThe concentration is Grevillea Wing Sunday PM shifts. The Steward\u2019s analysis shows that a permanent part-timer covering Sunday PM would cost $44,460/year versus $49,400 in agency \u2014 saving $4,940/year with better continuity of care.\n\nTeam B\u2019s turnover precursor: 3 of 4 indicators are present \u2014 declining pulse scores, increased sick leave, and reduced shift swap acceptance. The Keeper estimates 71% probability of turnover within 4\u20136 cycles. A stay conversation this week would be the first move.";
  }

  // Financial
  if (lower.includes("financial") || lower.includes("care ratio") || lower.includes("stewartbrown") || lower.includes("benchmark")) {
    return "Against StewartBrown benchmarks:\n\n- **Care ratio**: 51.9% \u2014 top quartile (benchmark: 52%+). Genuinely strong.\n- **Agency**: 18% \u2014 well above benchmark (<10%). This is the drag.\n- **Staff turnover**: 22% \u2014 within benchmark (<25%) but trending up.\n- **Care minutes**: Averaging 195/day against 200 target. RN minutes are solid, AIN minutes are the gap.\n\nThe story: clinical care delivery is strong, but the workforce model is expensive. Reducing agency by 8 percentage points would improve your operating margin by roughly $45K/year without touching care quality.";
  }

  // Roster / care minutes
  if (lower.includes("roster") || lower.includes("care minutes") || lower.includes("tonight") || lower.includes("shift")) {
    return "Tonight\u2019s roster for Grevillea Wing has an AIN gap on the PM shift. If it stays unfilled:\n\n- Care minutes drop to approximately 185/day (below the 200 target)\n- First breach this week \u2014 the previous 4 nights have been compliant\n- RN and EN coverage is fine; it\u2019s specifically the AIN component\n\nOptions: agency confirmation (check with the coordinator by 3pm), or the Wattle Wing float AIN could cover if Wattle\u2019s acuity allows. The second option is better for continuity but needs the DON\u2019s sign-off.";
  }

  // Leadership / governance
  if (lower.includes("leadership") || lower.includes("governance") || lower.includes("talking points") || lower.includes("session")) {
    return "For the Leadership Session, I\u2019d focus on three items:\n\n1. **Grevillea Wing PSH pattern** \u2014 6 cycles co-elevated, practices not moving the needle, needs structural discussion about staffing model. Bring the trend chart.\n2. **AN-ACC opportunity** \u2014 $11.4K/month sitting on the table. Tuesday clinical reviews are the critical action. Need commitment from the clinical lead.\n3. **Agency reduction plan** \u2014 The Sunday PM permanent hire recommendation. $4,940/year saving with better care continuity. Decision needed this week.\n\nWant me to draft a one-page brief for the session?";
  }

  // Default
  return "I\u2019m here and ready to help. I can walk you through today\u2019s priorities, explain any data on your dashboard, help draft communications, or dig into specific metrics. What would you like to focus on?";
}

// ── Route handler ────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    conversation_id,
    facility_id,
    facility_name,
    message,
    context_type,
    context_id,
    context_data,
    user_role,
    message_history,
  } = body;

  if (!message) {
    return NextResponse.json(
      { error: "Missing required field: message" },
      { status: 400 }
    );
  }

  const messageId = `msg-${Date.now()}`;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // ── Try live Claude call ──────────────────────────────────────

  if (apiKey && apiKey !== "sk-ant-your-key-here") {
    try {
      const { callClaudeConversation } = await import("@/lib/anthropic/client");

      const systemPrompt = buildSystemPrompt(context_type, context_data, user_role, facility_name);
      const history = (message_history ?? []).map(
        (m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })
      );

      const result = await callClaudeConversation({
        system: systemPrompt,
        history,
        newMessage: message,
        maxTokens: 800,
        model: "claude-sonnet-4-20250514",
        facilityId: facility_id,
        agentName: "chris_conversation",
      });

      console.log(
        `[ConversationAPI] Message: ${messageId} | conversation=${conversation_id} | ${user_role} | tokens=${result.inputTokens}in/${result.outputTokens}out`
      );

      return NextResponse.json({
        id: messageId,
        content: result.text,
        attachments: [],
        suggested_actions: [],
      });
    } catch (err) {
      console.error("[ConversationAPI] Claude call failed, falling back to demo:", err);
    }
  }

  // ── Demo mode (no API key) ────────────────────────────────────

  const content = generateDemoResponse(message, context_type);

  console.log(
    `[ConversationAPI] Demo message: ${messageId} | conversation=${conversation_id} | ${user_role}`
  );

  return NextResponse.json({
    id: messageId,
    content,
    attachments: [],
    suggested_actions: [],
  });
}
