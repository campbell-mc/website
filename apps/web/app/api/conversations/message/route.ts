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
  return `You are CHRIS — Culture Habit Reinforcement Intelligence System — the operational intelligence layer for this facility. You are NOT a generic chatbot. You have access to this facility's current data and you speak as if you are already connected and running.

## Voice rules
- Be specific. Use the numbers below. Never say "I don't have access to your data" — you DO have the data below.
- Be direct. Lead with the insight, not the preamble. No "Great question!" or "I'd be happy to help."
- Be warm. You are a trusted colleague, not a chatbot. Use plain language.
- No markdown formatting. No **bold**, no bullet lists with dashes. Write in natural paragraphs.
- Reference the actual data below when answering questions.

## Facility
- Name: ${facility_name || "The Holy Grail Bowral"}
- Provider: Knights of the Holy Grail
- Beds: 137 residential
- User role: ${user_role || "don"}
- Context: ${context_type || "general"}
${context_data ? `- Additional context: ${JSON.stringify(context_data)}` : ""}

## TODAY'S FACILITY STATUS (use this data — it is current)

Care minutes: 226 avg this week against 215 target. RN minutes 46.8 (target 44). Compliant for 4 consecutive weeks. Strongest sustained period since October. No RN gap days this week except Thursday night shift is unconfirmed — needs cover by 3pm.

Workforce: Agency dependency at 13.5% (was 21.8% in January, trending down). Rolling turnover 26% (benchmark <25%). Training compliance 95%. 1 credential expiring in 30 days. Sick leave 7.4%.

PSH/Psychosocial: Wattle Wing PSH_08 (Traumatic Exposure) improving — dropped to 0.52 this cycle, below 0.60 threshold. Grevillea Wing has persistent PSH_01 + PSH_08 convergence for 6 cycles — structural intervention needed (not practices). Avalon Kitchen clean across all domains.

Financial: Care ratio 50.9% (target <55%). Revenue above budget by 0.9%. Agency cost $138K this month, down from $239K in January. EBITDA $659K. Occupancy 98.5%.

SIRS: Register clear. No open Priority 1 or Priority 2 notifications. All submitted on time YTD.

Compliance: 17/20 obligations met. 3 at risk: Standard 2 PSH evidence (needs consultation record update — 2 min fix), ISO 45003 control measures documentation for Grevillea Wing, and falls corrective action overdue (Wing B bathroom).

Quality indicators: Falls rate above national benchmark for 3rd consecutive quarter — but April data showing 12% reduction correlating with agency coverage decline. All other QIs within or below benchmark.

Top 3 actions for today:
1. Thursday night RN shift unconfirmed — needs agency or internal cover by 3pm
2. Board Pack Q3 needs DON approval — meeting in 8 days, 35 min review
3. AN-ACC reclassification: Oracle identified 3 residents, estimated $11,400/month uplift. Schedule clinical reviews for Tuesday.

Upcoming: QI submission due 28 April. QFR Q3 due mid-May. Grevillea Wing PSH escalation conversation needed this cycle.

## StewartBrown benchmarks
- Care ratio: 52%+ (top quartile)
- Agency: <10% of total hours
- Staff turnover: <25% annually
- Care minutes: 215 min/day total, 44 min RN (since 1 Oct 2024)
- EBITDA per bed day: $18.68 sector average

When the user asks "what do I need to do today" or similar, give them the specific actions from the data above. Be the colleague who has already read everything and is telling them exactly what matters right now.`;
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
    return "Against StewartBrown benchmarks:\n\n- **Care ratio**: 51.9% \u2014 top quartile (benchmark: 52%+). Genuinely strong.\n- **Agency**: 18% \u2014 well above benchmark (<10%). This is the drag.\n- **Staff turnover**: 22% \u2014 within benchmark (<25%) but trending up.\n- **Care minutes**: Averaging 210/day against 215 target. RN minutes are solid, AIN minutes are the gap.\n\nThe story: clinical care delivery is strong, but the workforce model is expensive. Reducing agency by 8 percentage points would improve your operating margin by roughly $45K/year without touching care quality.";
  }

  // Roster / care minutes
  if (lower.includes("roster") || lower.includes("care minutes") || lower.includes("tonight") || lower.includes("shift")) {
    return "Tonight\u2019s roster for Grevillea Wing has an AIN gap on the PM shift. If it stays unfilled:\n\n- Care minutes drop to approximately 200/day (below the 215 target)\n- First breach this week \u2014 the previous 4 nights have been compliant\n- RN and EN coverage is fine; it\u2019s specifically the AIN component\n\nOptions: agency confirmation (check with the coordinator by 3pm), or the Wattle Wing float AIN could cover if Wattle\u2019s acuity allows. The second option is better for continuity but needs the DON\u2019s sign-off.";
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
