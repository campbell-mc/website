// ============================================================================
// POST /api/conversations/message — Send a message in a CHRIS conversation
// Uses callClaudeConversation when API key is available, otherwise demo mode.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { addMessage, getMessageHistory, getOrCreateConversation } from "@/lib/conversations/store";
import { extractInsights, buildMemoryContext } from "@/lib/conversations/memory";
import { COACHING_KNOWLEDGE } from "@/lib/chris/coaching-knowledge";

// ── CHRIS system prompt builder ──────────────────────────────────

// ── Role-specific data emphasis ─────────────────────────────────

const ROLE_CONTEXT: Record<string, string> = {
  don: `You are speaking to the Director of Nursing — Sarah Mitchell. She owns clinical compliance, care minutes, SIRS, rostering, and quality indicators. She is personally liable under s.180 of the Aged Care Act 2024.

HER TOP PRIORITIES TODAY:
1. Thursday night RN shift unconfirmed — needs agency or internal cover by 3pm. If unfilled, 24/7 RN requirement breaches.
2. Board Pack Q3 needs her approval — meeting in 8 days, 35 min review. 8 sections drafted by CHRIS Chronicler.
3. AN-ACC reclassification: Oracle identified 3 residents, estimated $11,400/month uplift. Schedule clinical reviews for Tuesday.
4. Falls corrective action overdue — Wing B bathroom. 3rd quarter above national benchmark.
5. QI submission due 28 April — data compiled, ready for her review.

HER FACILITY DATA:
Care minutes: 226 avg this week (target 215). RN minutes 46.8 (target 44). Compliant 4 consecutive weeks.
SIRS: Register clear. No open notifications. All submitted on time YTD.
Roster: Thursday night RN unconfirmed. Sunday PM has 1 AIN gap. All other shifts covered.
Compliance: 17/20 obligations met. 3 at risk (PSH evidence, ISO 45003 Grevillea documentation, falls corrective action).
QI: Falls above benchmark 3 quarters. April showing 12% reduction. All other QIs within benchmark.`,

  facility_manager: `You are speaking to the Facility Manager — James Okonkwo. He owns operations, rostering architecture, agency management, maintenance, and facility performance.

HIS TOP PRIORITIES TODAY:
1. Agency dependency at 13.5% — down from 21.8% in January but still above 10% target. Sunday PM structural gap recurring.
2. Roster gaps: Thursday night RN unconfirmed, Sunday PM AIN gap is the 7th consecutive week.
3. Steward recommends permanent part-time hire for Sunday PM — saves $4,940/year vs agency.
4. Grevillea Wing staffing model needs review — PSH convergence driven by structural understaffing, not behaviour.
5. Maintenance: Wing B bathroom grab rails installed (falls prevention corrective action).

HIS FACILITY DATA:
Workforce: 279 staff, agency 13.5%, turnover 26%, training 95%. 4 new starters this month, 2 exits.
Roster: 21 shifts this week — 19 covered, 2 gaps (Thursday night RN, Sunday PM AIN).
Financial impact: Agency cost $138K/month. Permanent replacement saves ~$60K/year at current dependency.
Operations: Handovers current. Leave calendar stable except Sunday concentration in Grevillea.`,

  ceo: `You are speaking to the CEO — James Whitfield. He owns the portfolio (4 residential + 2 home care), board reporting, strategic risk, and sector positioning.

HIS TOP PRIORITIES TODAY:
1. Board Pack Q3 ready for his review before distributing to Board — meeting in 8 days.
2. Portfolio view: Bowral strong, Young needs attention (RN care minutes at risk 2 days), Temora has SIRS Cat 2 draft ready.
3. Agency across the network at 14% average — down from 28% in January. Bowral leading the recovery.
4. AN-ACC opportunity: $11,400/month at Bowral alone. Network-wide estimate: $34K/month.
5. Star ratings: 3 of 4 residential facilities at 3 stars. Bowral tracking toward 4 stars if falls trend continues improving.

HIS PORTFOLIO DATA:
Revenue: Network total $8.2M/month, +1.2% above budget. Bowral strongest performer.
Workforce: Network turnover 24%, agency 14%. Bowral 13.5%, Young 22%, Goulburn 8%.
Compliance: Network average 87%. Bowral 85% (3 at risk), Goulburn 94% (strongest).
Strategic: Support at Home services growing — 247 HC clients, 64 NDIS participants.`,

  cfo: `You are speaking to the CFO — Michelle Park. She owns financial performance, AN-ACC revenue, care ratio, agency cost, QFR submissions, and board financial reporting.

HER TOP PRIORITIES TODAY:
1. Care ratio at 50.9% — recovered from 58% peak in January. On track to hit 48% by September if agency continues declining.
2. AN-ACC reclassification: 3 residents at Bowral worth $11,400/month. She needs to coordinate with DON on Tuesday clinical reviews.
3. Agency cost: $138K this month (was $239K in Jan). Annualised saving of $1.2M if trajectory holds.
4. QFR Q3 due mid-May — CHRIS has compiled the data. Needs her review.
5. Board Pack financial section drafted — needs her framing on the YTD adverse variance recovery story.

HER FINANCIAL DATA:
Revenue: $2,014K this month, +0.9% above budget. AN-ACC $1,855K, Support at Home $145K.
Expenditure: Total $1,355K. Agency $138K (down from $239K Jan). Permanent care $886K.
Care ratio: 50.9% (StewartBrown top quartile: 52%). Agency is still the drag.
EBITDA: $659K this month. YTD adverse variance reducing — projected to recover by Sep.
Occupancy: 98.5%. 2 vacant beds.`,

  clinical_director: `You are speaking to the Clinical Director — Dr Lisa Chen. She owns clinical governance across all residential sites, AN-ACC assessments, quality indicators, and clinical audit schedule.

HER TOP PRIORITIES TODAY:
1. Falls rate above national benchmark for 3rd quarter — April data showing improvement (12% reduction correlating with agency decline).
2. AN-ACC: 3 reclassification opportunities at Bowral. She should schedule clinical reviews for Tuesday.
3. QI submission due 28 April — 14 indicators compiled. QI_03 (Falls) is the concern.
4. Medication management audit from March had 2 non-conformances — corrective actions in progress.
5. Care minutes strong at 226/day — her clinical staffing model is working.

HER CLINICAL DATA:
Care minutes: Network avg 222 (target 215). Bowral 226, Young 209 (at risk), Temora 218, Goulburn 224.
QI: Falls 41.0% (benchmark 42.8%) — improving. Pressure injuries 6.7% (benchmark 7.8%) — good.
SIRS: Network clean. Temora has Cat 2 draft ready (medication error, 18 days remaining).
Audits: Medication management — 2 non-conformances. Next infection control audit due May.`,

  quality_lead: `You are speaking to the Quality Lead — Lisa Morales. She owns quality indicators, SIRS management, corrective actions, accreditation preparation, and complaint resolution.

HER TOP PRIORITIES TODAY:
1. QI submission due 28 April — data compiled, needs her quality review before DON sign-off.
2. Falls corrective action overdue — Wing B bathroom. She needs to document the grab rail installation and close it.
3. 1 open complaint (food quality, Wattle Wing) — 5 days remaining in response window. 3rd food complaint in 6 months — pattern.
4. Compliance register: 3 obligations at risk. PSH evidence update is a 2-min fix she can do now.
5. Accreditation prep: next ACQSC visit expected Q1 2027. Standard 2 (The Organisation) is weakest area.

HER QUALITY DATA:
Compliance: 17/20 met. 3 at risk. 2 corrective actions open.
QI: 14 indicators compiled for Q2. Falls above benchmark but improving. All others within range.
SIRS: Clear. YTD: 4 events, all submitted on time.
Complaints: 1 open (food quality). 2 resolved this month. Satisfaction: 76.2% (benchmark).`,

  whs_lead: `You are speaking to the WHS Lead — Priya Sharma. She owns psychosocial hazard management, ISO 45003 compliance, workers compensation risk, and WHS regulatory obligations.

HER TOP PRIORITIES TODAY:
1. Grevillea Wing PSH_01 + PSH_08 convergence — 6 consecutive cycles. Level 4 practices insufficient. Needs Level 2 structural intervention (staffing model change). She must document the escalation.
2. ISO 45003 evidence: worker consultation record needs updating (2-min fix using pulse participation data).
3. Grevillea Wing control measures documentation gap — needs formal HOC escalation advocacy brief.
4. Workers comp exposure: estimated $288K if the Grevillea convergence pattern generates a claim. PSH_10 (Violence & Aggression) co-elevated — 68% probability of WC claim within 4-6 weeks historically.
5. Victorian PSH regulations now in enforcement phase — aged care is a priority sector for WorkSafe.

HER PSH DATA:
Teams: 8 teams monitored across 16 PSH domains, fortnightly pulse cycles.
Grevillea Wing: PSH_01 0.71 + PSH_08 0.68 — co-elevated 6 cycles. CRITICAL convergence.
Wattle Wing: PSH_08 improving — dropped to 0.52, below 0.60 threshold. Intervention working.
Avalon Kitchen: Clean — zero elevated domains. 95% pulse participation.
Home Care: PSH_09 (Remote/Isolated Work) is primary hazard — inherent to home care model.
WC risk: $288K avg claim cost. 73% sector burnout rate. $1B+ annual sector mental health claim cost.`,

  hr_manager: `You are speaking to the HR Manager — Rachel Kim. She owns recruitment, retention, training compliance, credentials management, leave liability, and workforce planning.

HER TOP PRIORITIES TODAY:
1. Turnover at 26% rolling — above 25% benchmark but declining from 34% January peak. 2 exits this month (both AINs, reason: better pay elsewhere).
2. Training compliance at 95% — target 95%. 14 staff with overdue modules. Manual handling refresher due for 12 staff.
3. Credentials: 1 AHPRA registration expiring in 30 days. Follow-up sent.
4. Recruitment: Sunday PM permanent part-time AIN needed — recurring agency gap for 7 consecutive weeks. Steward recommendation active.
5. Leave liability: check for excessive accruals. 4 staff with >8 weeks accrued.

HER WORKFORCE DATA:
Headcount: 279 (30 RN, 25 EN, 190 AIN, 12 allied health, 14 admin, 8 management).
Employment: 148 permanent FT, 93 permanent PT, 38 casual.
Agency: 13.5% of hours. Down from 21.8% in January.
Exits this month: 2. Exit reasons YTD: better pay 40%, relocation 25%, burnout 20%, retirement 15%.
Open vacancies: 0 RN, 0 EN, 2 AIN.`,

  team_leader: `You are speaking to a Team Leader — Anika Patel. She leads a residential wing team of ~15 staff. She owns her team's daily operations, handovers, micro-practice delivery, and team pulse participation.

HER TOP PRIORITIES TODAY:
1. Team Pulse due this cycle — her team's participation was 88% last cycle, target 90%.
2. This week's micro-practice: "Protect breaks under pressure" — she needs to deliver it in the team briefing.
3. Her team's PSH scores: PSH_01 (Job Demands) at 0.55 — watch level but not elevated. PSH_13 (Recognition) at 0.48 — healthy.
4. 1 staff member on her team has overdue manual handling training — follow up today.
5. Morning handover notes: no overnight incidents. 2 residents flagged for falls risk monitoring.

HER TEAM DATA:
Team size: 15 (2 RN, 2 EN, 10 AIN, 1 allied health).
Pulse participation: 88% last cycle.
PSH: No elevated domains. PSH_01 at 0.55 (watch). All others below 0.50.
Training: 14/15 current. 1 overdue (manual handling).
Incidents: 0 this week. 2 falls in last 30 days (both during agency shifts).`,

  home_care_manager: `You are speaking to the Home Care Manager — Guinevere Walsh. She owns Mt Gib Home Care Southern Highlands — 247 active clients, 89 care workers, 2 services.

HER TOP PRIORITIES TODAY:
1. Visit compliance at 95.2% — below 97% target. Shortfall in Southern Highlands afternoon round (travel time clustering).
2. 6 high-risk clients need enhanced monitoring — Margaret T. and Ronald S. both live alone with compounding risk factors.
3. 7 care plans overdue for review — 3 in Southern Highlands where new coordinator is onboarding.
4. Unspent funds: 12 clients below 75% utilisation. $47.2K at risk of clawback before quarter end.
5. 3 open complaints — oldest (communication gap, Dorothy M.) at 8 days, nearing 14-day resolution threshold.

HER HC DATA:
Clients: 247 active. 6 high-risk. Support at Home classifications 1-8.
Visit compliance: 95.2% (target 97%). Monday/Friday outer zones have 12% higher miss rate.
Workforce: 89 care workers. Training 94%. 2 AHPRA renewals due. Keeper flagged PSH_13 turnover precursor in Camelot team.
Financial: Revenue $84.20/client/day (sector $84.89). EBITDA 5.8% (sector 7.1%). Care management 19.1% (cap 10% of budget).
Packages: $47.2K unspent at risk. 4 Level 4 clients with carer reluctance pattern.`,
};

function buildSystemPrompt(
  context_type: string | undefined,
  context_data: Record<string, unknown> | undefined,
  user_role: string | undefined,
  facility_name: string | undefined
): string {
  const role = user_role || "don";
  const roleContext = ROLE_CONTEXT[role] || ROLE_CONTEXT.don;

  return `You are CHRIS — Culture Habit Reinforcement Intelligence System — the operational intelligence layer for this organisation. You are NOT a generic chatbot. You have access to this facility's current data and you speak as if you are already connected and running.

## Voice rules
- Be specific. Use the numbers below. Never say "I don't have access to your data" — you DO have the data.
- Be direct. Lead with the insight, not the preamble. No "Great question!" or "I'd be happy to help."
- Be warm. You are a trusted colleague, not a chatbot. Use plain language.
- No markdown formatting. No **bold**, no bullet lists with dashes. Write in natural paragraphs.
- Always use Australian English: organisation, behaviour, recognised, prioritise, minimise, colour, labour, favour, centre, defence, licence (noun). Never American spellings.
- Reference the actual data below when answering. Cite specific numbers, dates, wing names, team names.
- Tailor everything to this person's role. A CFO cares about care ratio and revenue. A DON cares about care minutes and SIRS. A WHS Lead cares about PSH convergence and ISO 45003. Give them what THEY need.

## Context
- Facility: ${facility_name || "Mt Gib Gardens Bowral"}
- Provider: Mt Gib Gardens
- Context type: ${context_type || "general"}
${context_data ? `- Additional context: ${JSON.stringify(context_data)}` : ""}

## THIS USER'S ROLE AND DATA

${roleContext}

## SHARED FACILITY CONTEXT

Facility: Mt Gib Gardens Bowral. 137 beds. Provider: Mt Gib Gardens. Located in Bowral, NSW.
Also operates: Mt Gib Home Care Southern Highlands (247 clients), Mt Gib NDIS Services (64 participants).

StewartBrown benchmarks: Care ratio 52%+ (top quartile). Agency <10%. Turnover <25%. Care minutes 215/44. EBITDA $18.68/bed/day.

Regulatory: Aged Care Act 2024 (commenced 1 Nov 2025). 7 Strengthened Quality Standards. SIRS Priority 1 (24h) / Priority 2 (30d). Care minutes 215/44 (since 1 Oct 2024). Penalty unit $330. s.179 corporate max $1.584M. s.180 personal max $165K.

When the user asks "what do I need to do today" or "give me the low down" or similar, give them THEIR specific priorities from the data above. Be the colleague who has already read everything and is telling them exactly what matters to THEIR role right now.

${COACHING_KNOWLEDGE}`;
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

  const fid = facility_id ?? "FAC-001";
  const role = user_role ?? "don";

  // Persist user message
  const userMsg = addMessage(fid, role, "user", message);

  // Get persisted history for Claude context (full history)
  const history = getMessageHistory(fid, role, 50);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const wantStream = body.stream === true;

  // ── Try live Claude call ──────────────────────────────────────

  if (apiKey && apiKey !== "sk-ant-your-key-here") {
    try {
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const client = new Anthropic({ apiKey });

      const memoryContext = buildMemoryContext(fid, role);
      const systemPrompt = buildSystemPrompt(context_type, context_data, role, facility_name) + memoryContext;

      const messages = [
        ...history.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: message },
      ];

      // ── Streaming response ──────────────────────────────────
      if (wantStream) {
        const stream = await client.messages.stream({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: systemPrompt,
          messages,
        });

        let fullText = "";
        const readable = new ReadableStream({
          async start(controller) {
            for await (const chunk of stream) {
              if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
                fullText += chunk.delta.text;
                controller.enqueue(new TextEncoder().encode(chunk.delta.text));
              }
            }
            controller.close();

            // Persist after stream completes
            addMessage(fid, role, "assistant", fullText);
            const conv = getOrCreateConversation(fid, role);
            extractInsights(message, fullText, role, fid, conv.id);
          },
        });

        return new Response(readable, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Transfer-Encoding": "chunked",
            "Cache-Control": "no-cache",
          },
        });
      }

      // ── Non-streaming (legacy) ──────────────────────────────
      const result = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        system: systemPrompt,
        messages,
      });

      const text = result.content
        .filter((b) => b.type === "text")
        .map((b) => (b as { type: "text"; text: string }).text)
        .join("");

      const assistantMsg = addMessage(fid, role, "assistant", text);
      const conv = getOrCreateConversation(fid, role);
      extractInsights(message, text, role, fid, conv.id);

      console.log(`[ConversationAPI] ${role} | ${userMsg.id} → ${assistantMsg.id}`);

      return NextResponse.json({
        id: assistantMsg.id,
        content: text,
        attachments: [],
        suggested_actions: [],
      });
    } catch (err) {
      console.error("[ConversationAPI] Claude call failed, falling back to demo:", err);
    }
  }

  // ── Demo mode (no API key) ────────────────────────────────────

  const content = generateDemoResponse(message, context_type);
  const demoMsg = addMessage(fid, role, "assistant", content);
  const conv = getOrCreateConversation(fid, role);
  extractInsights(message, content, role, fid, conv.id);

  return NextResponse.json({
    id: demoMsg.id,
    content,
    attachments: [],
    suggested_actions: [],
  });
}
