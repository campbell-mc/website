// lib/loops/practice-library.ts
// Maintained by Ivan Sanchez
//
// The canonical practice library — every practice CHRIS can prescribe.
// Library-first rule: CHRIS never invents a practice. Always retrieved.
//
// 4 components:
//   1. Team Micro-Practices — signal-driven, fortnightly Team Loop
//      Residential: MP_001–MP_194 | Home Care/NDIS: parallel set | PS Hazard: MP_201–MP_215
//   2. Leader Loop Micro-Practices — 84 EI practices (6 competencies × 7 behaviours × 2)
//   3. EI Behaviour Library — 42 aged care translations of Genos behaviours
//   4. Knowledge Base — ~170 research objects (sense-making only, never in loops)
//
// Selection logic: signals_addressed match → Bayesian reliability → complexity calibration
// One practice per cycle. Not a list. Not options. One well-matched practice.

import type { PSHDomain } from './cycle';

// ── PRACTICE TYPES ───────────��───────────────────────────────

export interface Practice {
  id: string;
  title: string;
  tagline: string;
  what_to_try: string;
  why_this_helps: string;
  what_it_looks_like: string;
  care_setting: 'residential' | 'home_care' | 'both';
  floor_presence: boolean;
  skill_level: 'foundational' | 'intermediate' | 'advanced';
  time_required: '<2 min' | '5 min' | 'process change' | 'shift-long';
  action_type: 'ritual' | 'conversation' | 'system_change' | 'signal' | 'reflection';
  theme: string;
  psychosocial_hazard: PSHDomain[];
  signals_addressed: string[];
  repeatable: boolean;
}

export interface LeaderPractice {
  id: string;
  competency_id: string;
  competency_name: string;
  behavior_index: number;
  behavior_text: string;
  practice_variant: 'A' | 'B';
  title: string;
  what_to_practise: string;
  why_this_matters: string;
  pressure_example: string;
  oora_relevant: boolean;
}

export interface EIBehaviour {
  competency_id: string;
  competency_name: string;
  behavior_index: number;
  behavior_text: string;
  aged_care_meaning: string;
  failure_modes: string;
  chris_coaching_angle: string;
}

// ── TEAM MICRO-PRACTICES (RESIDENTIAL) ───────────────────────
// Representative set — in production this is 194+ practices loaded from DB.

export const RESIDENTIAL_PRACTICES: Practice[] = [
  {
    id: 'MP_001', title: 'Protect breaks when under pressure',
    tagline: 'Make recovery possible by actively buffering, not by reminding.',
    what_to_try: 'For the next fortnight, treat breaks like a safety control, not a nice-to-have. At the start of the shift, state the break plan (who covers whom, approximate timing). During peak periods, take "buffer duty" for 10 minutes at a time — cover call bells, triage family requests, or hold non-urgent questions — so one staff member can actually step away. If breaks are failing, don\'t shame staff; treat it as a system signal. Adjust coverage rotation, tighten priorities (what stops), or temporarily reassign non-urgent tasks.',
    why_this_helps: 'Break loss drives fatigue → errors, injuries, irritability, and burnout. In aged care, fatigue directly increases risk (medication errors, falls response delays, manual handling shortcuts). When leaders actively protect recovery, engagement lifts because staff feel protected, not used up.',
    what_it_looks_like: '"Breaks are protected today. I\'ll cover the floor for 10 minutes at a time — call me if you\'re blocked."',
    care_setting: 'residential', floor_presence: true, skill_level: 'foundational',
    time_required: 'process change', action_type: 'system_change', theme: 'Workload/Safety',
    psychosocial_hazard: ['PSH_01', 'PSH_02', 'PSH_16'],
    signals_addressed: ['workload_pressure_pulse_low', 'support_from_leader_pulse_low', 'break_access_concerns_pulse_high', 'break_non_compliance_rate_high', 'staffing_coverage_ratio_low', 'agency_usage_spike', 'incident_rate_elevated', 'sick_leave_spike', 'fatigue_crisis_indicators'],
    repeatable: true,
  },
  {
    id: 'MP_004', title: 'Create a micro-ritual for cumulative grief',
    tagline: 'Name repeated loss so it doesn\'t quietly become burnout.',
    what_to_try: 'After a resident death — particularly when it\'s the second or third in a short period — take 60 seconds with the team before the shift continues. Not a debrief. Just a pause. Name the person. Acknowledge the loss. Then carry on.',
    why_this_helps: 'Cumulative grief in aged care is the number one driver of emotional exhaustion. Not because of any single death, but because there\'s never a pause between them. A micro-ritual doesn\'t fix grief — it prevents it from going underground.',
    what_it_looks_like: '"Before we move on — Mrs Chen passed this morning. She was here for four years. Some of you knew her well. Take a moment if you need it. We keep going, but we don\'t pretend it didn\'t happen."',
    care_setting: 'residential', floor_presence: true, skill_level: 'foundational',
    time_required: '<2 min', action_type: 'ritual', theme: 'Trauma/Grief',
    psychosocial_hazard: ['PSH_08', 'PSH_12'],
    signals_addressed: ['traumatic_exposure_pulse_high', 'fatigue_indicators_rising', 'post_incident_team_state', 'sick_leave_spike'],
    repeatable: true,
  },
  {
    id: 'MP_012', title: 'Specific praise for observed behaviour',
    tagline: 'Replace general "good job" with named, specific recognition.',
    what_to_try: 'For the next fortnight, catch one staff member per shift doing something well and name the specific behaviour. Not "good job today" — but "The way you repositioned Mr Harris while talking to him about his garden, that\'s exactly the care we want here." Make it about the behaviour, not the person. Public where appropriate, private where needed.',
    why_this_helps: 'Generic praise is invisible after the first week. Specific praise tells staff what good looks like — it teaches and reinforces simultaneously. When recognition is specific, it connects effort to meaning.',
    what_it_looks_like: '"I saw you help the new agency nurse find the medication trolley without making them feel stupid about asking. That matters more than you think."',
    care_setting: 'residential', floor_presence: true, skill_level: 'foundational',
    time_required: '<2 min', action_type: 'conversation', theme: 'Recognition',
    psychosocial_hazard: ['PSH_13', 'PSH_05'],
    signals_addressed: ['recognition_pulse_low', 'team_relationships_pulse_low', 'new_staff_high', 'trust_erosion_pattern'],
    repeatable: true,
  },
  {
    id: 'MP_013', title: 'Prevent "quiet resignation" after repeated disappointments',
    tagline: 'Close the loop on what was raised — even when the answer is "not yet".',
    what_to_try: 'This fortnight, pick one outstanding issue your team has raised before. Bring it back to them with a status: fixed, in progress, or can\'t fix (and why). The act of returning to an issue — even without a solution — breaks the "nothing ever changes" cycle.',
    why_this_helps: 'When people stop raising things, it\'s not because problems went away. It\'s because they decided raising them doesn\'t help. One closed loop — even a "no" — rebuilds the signal that voice matters.',
    what_it_looks_like: '"I know some of you raised the medication trolley issue a while back. I want to come back to it. We can\'t replace it this quarter, but I\'ve flagged it for budget review. In the meantime, here\'s what we\'re doing..."',
    care_setting: 'residential', floor_presence: false, skill_level: 'intermediate',
    time_required: '5 min', action_type: 'conversation', theme: 'Trust',
    psychosocial_hazard: ['PSH_03', 'PSH_13'],
    signals_addressed: ['recognition_pulse_low', 'trust_erosion_pattern', 'psychological_safety_pulse_low'],
    repeatable: true,
  },
  {
    id: 'MP_021', title: 'Slow down the handover by 90 seconds',
    tagline: 'Add one question to the handover that changes what gets passed on.',
    what_to_try: 'At the end of each handover this fortnight, add one question: "Is there anything happening with any resident that isn\'t in the notes but the next shift should know?" Then wait. The 90 seconds of silence that follows is the most important part — it creates space for the things that get lost between clinical facts.',
    why_this_helps: 'Handover is the highest-risk transition in aged care. Information loss during handover is the single largest contributor to medication errors, falls, and missed deterioration. Adding one question doesn\'t add time — it changes what travels.',
    what_it_looks_like: '"Before we close — anything happening with anyone that didn\'t make it into the notes? Any gut feelings?"',
    care_setting: 'residential', floor_presence: true, skill_level: 'foundational',
    time_required: '<2 min', action_type: 'ritual', theme: 'Handover/Communication',
    psychosocial_hazard: ['PSH_06', 'PSH_01'],
    signals_addressed: ['incident_rate_elevated', 'care_minutes_at_risk', 'new_staff_high'],
    repeatable: true,
  },
  {
    id: 'MP_030', title: 'Name the trade-off out loud',
    tagline: 'When something has to give, say what and why — before staff fill the silence with assumptions.',
    what_to_try: 'When you make a decision that affects the team\'s workload or plans, name the trade-off before moving on. "We\'re prioritising the medication round over the garden activity this afternoon because of the staff gap — I know that\'s not ideal for residents, and I want you to know I see that trade-off." This prevents the assumption that you don\'t care or didn\'t notice.',
    why_this_helps: 'Leaders who name trade-offs earn trust even when the decision is unpopular. The silence around hard decisions is where cynicism grows. Naming doesn\'t fix it — but it prevents the corrosive assumption that leadership is disconnected.',
    what_it_looks_like: '"We\'re down one today. That means showers are prioritised by need, not the usual round. I know that changes your plan — I want you to know I see it."',
    care_setting: 'both', floor_presence: true, skill_level: 'intermediate',
    time_required: '<2 min', action_type: 'conversation', theme: 'Trust',
    psychosocial_hazard: ['PSH_03', 'PSH_01', 'PSH_04'],
    signals_addressed: ['trust_erosion_pattern', 'workload_pressure_pulse_low', 'job_control_pulse_low', 'staffing_coverage_ratio_low', 'agency_usage_spike'],
    repeatable: true,
  },
  {
    id: 'MP_033', title: 'Acknowledge cumulative grief after resident deaths',
    tagline: 'Don\'t let repeated loss become invisible emotional labour.',
    what_to_try: 'When a resident dies — especially if it\'s the second or third in a short period — pause the team for 60 seconds. Name the person. Acknowledge what staff may be carrying. Then let them choose: carry on, or take 5 minutes. The pause itself is the intervention.',
    why_this_helps: 'Aged care workers experience repeated bereavement as a structural condition of work, not as discrete events. Cumulative grief that goes unacknowledged becomes emotional exhaustion, absenteeism, and ultimately exit. One moment of naming breaks the pattern of "just keep going."',
    what_it_looks_like: '"That\'s the third death this month. I want to acknowledge that before we keep going. It\'s okay to feel something about it."',
    care_setting: 'residential', floor_presence: true, skill_level: 'foundational',
    time_required: '<2 min', action_type: 'ritual', theme: 'Trauma/Grief',
    psychosocial_hazard: ['PSH_08', 'PSH_12', 'PSH_02'],
    signals_addressed: ['traumatic_exposure_pulse_high', 'fatigue_indicators_rising', 'sick_leave_spike', 'post_incident_team_state', 'convergence_event_active'],
    repeatable: true,
  },
  {
    id: 'MP_044', title: 'Run a "no-blame near-miss" debrief',
    tagline: 'Make it safe to report what almost went wrong.',
    what_to_try: 'After a near-miss (medication error caught, fall almost prevented, resident distress de-escalated), run a 3-minute debrief with the immediate team. Three questions only: What happened? What stopped it getting worse? What would help next time? No blame, no investigation, no documentation beyond a note in the handover.',
    why_this_helps: 'Near-miss reporting is the single most effective early warning system in clinical care. But it only works if the culture is safe enough to speak. Each no-blame debrief builds a micro-dose of psychological safety that compounds.',
    what_it_looks_like: '"That was close. Let\'s take 3 minutes — what happened, what saved it, what would help? No names, no forms, just learning."',
    care_setting: 'residential', floor_presence: true, skill_level: 'intermediate',
    time_required: '5 min', action_type: 'conversation', theme: 'Psychological Safety',
    psychosocial_hazard: ['PSH_11', 'PSH_10', 'PSH_03'],
    signals_addressed: ['psychological_safety_pulse_low', 'incident_rate_elevated', 'post_incident_team_state'],
    repeatable: true,
  },
  {
    id: 'MP_053', title: 'End the shift with one named contribution',
    tagline: 'Close the day with something specific, not generic.',
    what_to_try: 'In the last 5 minutes of the shift, name one specific contribution from one team member that mattered today. Not "thanks team, good work." Something they did, that you saw, that made a difference. Rotate across the team over the fortnight.',
    why_this_helps: 'The end of an aged care shift is often the most emotionally depleted point of the day. One moment of specific, witnessed recognition changes how staff leave — and whether they come back tomorrow carrying resentment or purpose.',
    what_it_looks_like: '"Before you go — Priya, the way you handled Mrs Walsh\'s agitation this afternoon was exactly right. You stayed calm, you redirected gently, and you kept the other residents safe. That was leadership."',
    care_setting: 'residential', floor_presence: true, skill_level: 'foundational',
    time_required: '<2 min', action_type: 'ritual', theme: 'Recognition',
    psychosocial_hazard: ['PSH_13', 'PSH_02', 'PSH_05'],
    signals_addressed: ['recognition_pulse_low', 'support_from_leader_pulse_low', 'team_relationships_pulse_low', 'trust_erosion_pattern'],
    repeatable: true,
  },
  {
    id: 'MP_091', title: 'Anchor the team to purpose after a hard week',
    tagline: 'Reconnect effort to meaning when motivation is thin.',
    what_to_try: 'After a particularly difficult week, start the Monday huddle with a purpose anchor: one specific moment from last week where the team\'s presence made a difference to a resident. Not a metric. Not a compliment. A moment.',
    why_this_helps: 'Aged care workers chose this work for a reason. Under sustained pressure, that reason becomes invisible. Purpose anchoring doesn\'t fix workload — it reminds people why the workload matters, and that changes whether they show up again.',
    what_it_looks_like: '"Last Thursday, Mr Chen didn\'t eat for 18 hours. Two of you sat with him for lunch and by Friday he was back. That\'s why we do this."',
    care_setting: 'residential', floor_presence: true, skill_level: 'foundational',
    time_required: '<2 min', action_type: 'ritual', theme: 'Purpose/Meaning',
    psychosocial_hazard: ['PSH_12', 'PSH_08'],
    signals_addressed: ['fatigue_indicators_rising', 'traumatic_exposure_pulse_high', 'trust_erosion_pattern', 'sick_leave_spike'],
    repeatable: true,
  },
];

// ── HOME CARE / NDIS PRACTICES ───────────────────────────────
// Parallel set adapted for community context: "visit" not "shift",
// "remote" not "floor", lone worker safety, geographically dispersed teams.

export const HOME_CARE_PRACTICES: Practice[] = [
  {
    id: 'MP_HC_001', title: 'Protect recovery between visits',
    tagline: 'Build micro-recovery into travel time instead of filling it with admin.',
    what_to_try: 'For the next fortnight, designate the first 3 minutes of travel between visits as recovery time — not phone calls, not documentation catch-up. Explicitly tell your team: "The drive between visits is not admin time. It\'s decompression time." If workers are running behind, reduce the next visit scope rather than cutting travel recovery.',
    why_this_helps: 'Home care workers carry emotional residue from one visit into the next with no debrief, no colleague support, and no environmental change. The car is their only transition space. Protecting it prevents cumulative emotional buildup that presents as disengagement or error.',
    what_it_looks_like: '"The 10 minutes between visits isn\'t for returning calls. It\'s for resetting. If you need to make calls, pull over and do it after you\'ve had 3 minutes."',
    care_setting: 'home_care', floor_presence: false, skill_level: 'foundational',
    time_required: 'process change', action_type: 'system_change', theme: 'Workload/Safety',
    psychosocial_hazard: ['PSH_01', 'PSH_16', 'PSH_09'],
    signals_addressed: ['workload_pressure_pulse_low', 'fatigue_indicators_rising', 'lone_worker_check_in_missed', 'sick_leave_spike'],
    repeatable: true,
  },
  {
    id: 'MP_HC_064', title: 'Define the "minimum viable visit" when time collapses',
    tagline: 'Give workers permission to do less well rather than nothing at all.',
    what_to_try: 'Create a clear, written "minimum viable visit" standard for each client — the non-negotiable core of what must happen vs what can flex. When a worker calls to say they\'re running 20 minutes late, the coordinator can immediately say: "Do the minimum viable visit for Mrs Jones — medication, fall risk check, and a 5-minute conversation. Skip the shower — we\'ll reschedule."',
    why_this_helps: 'Home care workers face impossible choices when schedules compress. Without a defined minimum, every visit feels like a failure. A minimum viable visit turns "I couldn\'t do everything" into "I did what mattered most" — which preserves both quality and worker wellbeing.',
    what_it_looks_like: '"When you\'re running behind, do the MVV — meds, safety check, and connection. Everything else gets rescheduled, not skipped."',
    care_setting: 'home_care', floor_presence: false, skill_level: 'intermediate',
    time_required: 'process change', action_type: 'system_change', theme: 'Workload/Safety',
    psychosocial_hazard: ['PSH_01', 'PSH_04', 'PSH_06'],
    signals_addressed: ['workload_pressure_pulse_low', 'job_control_pulse_low', 'role_clarity_pulse_low', 'visit_duration_variance_high', 'cancellation_rate_elevated'],
    repeatable: true,
  },
  {
    id: 'MP_HC_118', title: 'Reduce "handover debt" with a 60-second voice note rule',
    tagline: 'Replace missed handovers with a voice note the next worker can hear on the way.',
    what_to_try: 'At the end of each visit, workers record a 60-second voice note: one thing that went well, one thing the next worker should know, one thing that concerned them. Uploaded to the client file before driving to the next visit. The next worker listens on the way.',
    why_this_helps: 'Home care handover is structurally broken — workers never meet. Voice notes carry tone, emphasis, and concern that written notes strip out. "She seemed off today" in a voice note conveys clinical judgment that "no concerns" in a text field does not.',
    what_it_looks_like: '"Before you drive to the next visit, record your 60-second voice note. The next person needs to hear what you saw."',
    care_setting: 'home_care', floor_presence: false, skill_level: 'foundational',
    time_required: '<2 min', action_type: 'ritual', theme: 'Handover/Communication',
    psychosocial_hazard: ['PSH_06', 'PSH_09'],
    signals_addressed: ['incident_rate_elevated', 'care_plan_variance_high', 'new_staff_high', 'lone_worker_check_in_missed'],
    repeatable: true,
  },
  {
    id: 'MP_HC_178', title: 'Reduce "risky lone work" with a check-in timer',
    tagline: 'Make lone worker safety a system, not an afterthought.',
    what_to_try: 'Implement a simple check-in timer: workers start a timer at the beginning of each visit. If they don\'t check in within the expected visit duration + 15 minutes, the coordinator receives an automatic alert. Not surveillance — safety. Frame it as: "This is how we know you\'re safe, not how we check you\'re working."',
    why_this_helps: 'Lone workers in home care face genuine safety risks — aggressive clients, falls with no witness, mental health crises with no backup. A check-in system transforms isolation from a silent risk into a managed one.',
    what_it_looks_like: '"Start the timer when you arrive. If you can\'t check in, we\'ll call. If you don\'t answer, we send someone. That\'s the deal."',
    care_setting: 'home_care', floor_presence: false, skill_level: 'foundational',
    time_required: 'process change', action_type: 'system_change', theme: 'Lone Worker Safety',
    psychosocial_hazard: ['PSH_09', 'PSH_10'],
    signals_addressed: ['lone_worker_check_in_missed', 'incident_rate_elevated', 'psychological_safety_pulse_low'],
    repeatable: true,
  },
];

// ── ADDITIONAL PSH HAZARD PRACTICES (MP_201–MP_215) ──────────

export const PSH_HAZARD_PRACTICES: Practice[] = [
  {
    id: 'MP_201', title: 'Build control through bounded choice',
    tagline: 'Give staff control within defined limits rather than no control at all.',
    what_to_try: 'Identify one area where staff currently have no input — meal timing, room order, documentation sequence — and offer a bounded choice: "You can do rooms 1-5 in any order today. The medications round stays fixed." Small control with clear boundaries is better than no control or unlimited choice.',
    why_this_helps: 'Low job control is the strongest predictor of burnout in care work. But full autonomy isn\'t possible in a regulated environment. Bounded choice — control within limits — reduces the PSH_04 signal without creating operational risk.',
    what_it_looks_like: '"You decide the order. The only fixed point is the meds round at 10. Everything else is your call today."',
    care_setting: 'both', floor_presence: true, skill_level: 'foundational',
    time_required: '<2 min', action_type: 'system_change', theme: 'Role Clarity/Autonomy',
    psychosocial_hazard: ['PSH_04'],
    signals_addressed: ['job_control_pulse_low', 'workload_pressure_pulse_low'],
    repeatable: true,
  },
  {
    id: 'MP_204', title: 'Immediate aggression relief',
    tagline: 'Remove the worker from the situation before anything else.',
    what_to_try: 'After any aggressive incident — verbal or physical — the first action is relief, not debrief. Pull the worker out of the environment for a minimum of 10 minutes. No questions, no paperwork, no "are you okay?" — just physical removal from the space. Cover their role. Debrief comes later.',
    why_this_helps: 'Workers who stay in the environment after an aggressive incident continue operating in fight-or-flight. The risk of a secondary incident doubles. Immediate relief breaks the physiological cycle and signals that safety matters more than coverage.',
    what_it_looks_like: '"You\'re off the floor for 10 minutes. I\'ve got your residents. Go sit somewhere quiet. We\'ll talk when you\'re ready."',
    care_setting: 'residential', floor_presence: true, skill_level: 'foundational',
    time_required: '5 min', action_type: 'signal', theme: 'Violence/Aggression',
    psychosocial_hazard: ['PSH_10', 'PSH_08'],
    signals_addressed: ['incident_rate_elevated', 'post_incident_team_state', 'psychological_safety_pulse_low', 'traumatic_exposure_pulse_high'],
    repeatable: true,
  },
  {
    id: 'MP_205', title: 'Anticipate aggression at handover',
    tagline: 'Name the risk before the shift starts, not after it escalates.',
    what_to_try: 'Add a 30-second "risk anticipation" to every handover: name the resident(s) most likely to escalate today, the trigger patterns observed this week, and the de-escalation approach that\'s been working. Give the incoming shift a head start on the day\'s highest-risk moments.',
    why_this_helps: 'Most aggression in aged care is predictable — not random. The same residents, the same times, the same triggers. Naming risk at handover transforms reactive crisis management into anticipatory care.',
    what_it_looks_like: '"Mrs Walsh has been escalating at sundown for 3 days. The trigger is usually the corridor noise. What\'s been working is reducing stimulation from 4pm. Keep the lounge quiet if you can."',
    care_setting: 'residential', floor_presence: true, skill_level: 'intermediate',
    time_required: '<2 min', action_type: 'ritual', theme: 'Violence/Aggression',
    psychosocial_hazard: ['PSH_10', 'PSH_08'],
    signals_addressed: ['incident_rate_elevated', 'post_incident_team_state', 'new_staff_high'],
    repeatable: true,
  },
  {
    id: 'MP_208', title: 'Structure lone-worker check-ins',
    tagline: 'Make isolation visible rather than leaving it to chance.',
    what_to_try: 'Implement structured check-ins for isolated workers: once at the start of shift, once at mid-shift, once before leaving. Not surveillance — connection. The check-in should take 30 seconds: "I\'m here, I\'m safe, this is how it\'s going." If a check-in is missed, the coordinator calls within 15 minutes.',
    why_this_helps: 'Remote and isolated work is the forgotten psychosocial hazard. Workers who feel no one would notice if they disappeared experience profound disengagement. Structured check-ins transform isolation into managed independence.',
    what_it_looks_like: '"Check in three times: start, middle, end. If I don\'t hear from you, I\'m calling. Not because I don\'t trust you — because I need to know you\'re safe."',
    care_setting: 'home_care', floor_presence: false, skill_level: 'foundational',
    time_required: 'process change', action_type: 'system_change', theme: 'Lone Worker Safety',
    psychosocial_hazard: ['PSH_09'],
    signals_addressed: ['lone_worker_check_in_missed', 'psychological_safety_pulse_low'],
    repeatable: true,
  },
  {
    id: 'MP_212', title: 'Make monitoring transparent',
    tagline: 'Tell people what you\'re watching and why before they find out.',
    what_to_try: 'Before introducing any new monitoring (camera, tracking, documentation audit) — explain what you\'re watching, why, and what you\'re NOT watching. Invite questions. Give staff 48 hours to raise concerns before implementation.',
    why_this_helps: 'Surveillance without transparency destroys organisational justice. When staff discover monitoring they didn\'t know about, trust collapses. Transparent monitoring — even of the same things — preserves the fairness signal.',
    what_it_looks_like: '"We\'re adding medication round tracking next week. I want to explain what it records, what it doesn\'t, and why. Any questions before we start?"',
    care_setting: 'both', floor_presence: false, skill_level: 'intermediate',
    time_required: '5 min', action_type: 'conversation', theme: 'Fairness/Justice',
    psychosocial_hazard: ['PSH_03'],
    signals_addressed: ['trust_erosion_pattern', 'psychological_safety_pulse_low', 'change_fatigue_indicators'],
    repeatable: false,
  },
];

// ── LEADER LOOP PRACTICES (GENOS EI) ��────────────────────────
// 84 practices: 6 competencies × 7 behaviours × 2 variants (A/B)
// Representative set below — full library in DB.

export const LEADER_PRACTICES: LeaderPractice[] = [
  // Self-Awareness
  {
    id: 'LP_SA_01A', competency_id: 'selfAwareness', competency_name: 'Self-Awareness',
    behavior_index: 1, behavior_text: 'Understands the impact their behaviour has on others',
    practice_variant: 'A', title: 'The Pause-and-Read Practice',
    what_to_practise: 'Before responding in a tense conversation, pause for three seconds and scan the other person\'s face and posture. Adjust your tone or words based on what you observe before speaking.',
    why_this_matters: 'This builds the capacity to interrupt automatic reactions and insert a moment of social calibration. Under pressure, leaders often respond without reading impact cues. This practice trains real-time adjustment.',
    pressure_example: 'A team member challenges your decision in a meeting. You feel the urge to defend immediately. Instead, you pause, notice their crossed arms and tight jaw, and soften your opening response to reduce defensiveness.',
    oora_relevant: false,
  },
  {
    id: 'LP_SA_01B', competency_id: 'selfAwareness', competency_name: 'Self-Awareness',
    behavior_index: 1, behavior_text: 'Understands the impact their behaviour has on others',
    practice_variant: 'B', title: 'The After-Action Impact Check',
    what_to_practise: 'Within two hours of a significant interaction, ask one specific question to someone present: "How did my response land with the group?" Listen without defending or explaining.',
    why_this_matters: 'Leaders rarely receive timely feedback on interpersonal impact. This practice creates a feedback loop that sharpens awareness of how behaviour registers with others under real conditions.',
    pressure_example: 'After delivering difficult news about roster changes in a team meeting, you ask your deputy privately: "How did my tone come across?" You resist the urge to justify the decision while they answer.',
    oora_relevant: false,
  },
  // Authenticity (carries OORA)
  {
    id: 'LP_AU_04A', competency_id: 'authenticity', competency_name: 'Authenticity',
    behavior_index: 4, behavior_text: 'Is honest about their own mistakes',
    practice_variant: 'A', title: 'The "I got that wrong" Practice',
    what_to_practise: 'The next time you make a mistake — a wrong call on staffing, a tone that landed badly, a promise you couldn\'t keep — name it to the team within 24 hours. Use the phrase: "I got that wrong. Here\'s what I\'m doing about it."',
    why_this_matters: 'Authenticity under pressure is the fastest trust-builder in aged care leadership. Staff know when leaders make mistakes — the question is whether the leader acknowledges it or pretends it didn\'t happen.',
    pressure_example: 'You promised the team extra help for the weekend and it fell through. Instead of ignoring it, you say: "I told you there\'d be extra help this weekend and it didn\'t happen. That\'s on me. I\'m escalating it now."',
    oora_relevant: true,
  },
  {
    id: 'LP_AU_04B', competency_id: 'authenticity', competency_name: 'Authenticity',
    behavior_index: 4, behavior_text: 'Is honest about their own mistakes',
    practice_variant: 'B', title: 'The Pattern Recognition Practice',
    what_to_practise: 'At the end of each week, identify one decision or interaction where you defaulted to self-protection rather than honesty. Name the pattern to yourself. If the pattern repeats, name it to someone you trust.',
    why_this_matters: 'Leaders develop blind spots around their own avoidance patterns. This practice builds meta-awareness — seeing the pattern before it becomes a culture problem.',
    pressure_example: 'You realise you\'ve avoided telling the DON about a staffing decision you know will cause problems. You recognise the pattern: avoiding upward honesty when the news is bad.',
    oora_relevant: false,
  },
  // Inspiring Performance
  {
    id: 'LP_IP_02A', competency_id: 'inspiringPerformance', competency_name: 'Inspiring Performance',
    behavior_index: 2, behavior_text: 'Gives constructive feedback',
    practice_variant: 'A', title: 'The OORA Feedback Conversation',
    what_to_practise: 'Use the OORA framework for your next feedback conversation: Observation (specific behaviour you saw), Ownership (how it affected you), Request (what you\'d like instead), Agreement (shared commitment). One conversation, 5 minutes, no ambiguity.',
    why_this_matters: 'Most leaders in aged care avoid feedback until it becomes a formal HR conversation. OORA makes feedback specific, human, and forward-looking — a leadership act, not a management process.',
    pressure_example: '"I noticed the documentation wasn\'t completed for the last three shifts [Observation]. When I see that, I worry about risk and handover gaps [Ownership]. I\'d like us to agree on a minimum by end-of-shift [Request]. Can we do that? [Agreement]"',
    oora_relevant: true,
  },
  {
    id: 'LP_IP_02B', competency_id: 'inspiringPerformance', competency_name: 'Inspiring Performance',
    behavior_index: 2, behavior_text: 'Gives constructive feedback',
    practice_variant: 'B', title: 'The Same-Day Feedback Practice',
    what_to_practise: 'Give feedback on the same day the behaviour occurs — positive or constructive. Don\'t wait for the "right moment." The right moment is today.',
    why_this_matters: 'Delayed feedback loses context, emotional charge, and impact. Same-day feedback is more accurate because both parties remember the situation. It also prevents issues from compounding.',
    pressure_example: 'A team member handled a family complaint well. Instead of mentioning it next week, you tell them before they leave: "The way you handled Mrs Walsh\'s daughter today — that was exactly the right approach."',
    oora_relevant: false,
  },
  // Self-Management
  {
    id: 'LP_SM_01A', competency_id: 'selfManagement', competency_name: 'Self-Management',
    behavior_index: 1, behavior_text: 'Manages emotions in difficult situations',
    practice_variant: 'A', title: 'The 10-Second Reset',
    what_to_practise: 'When you feel your emotional state rising in a difficult situation, use a 10-second reset: exhale slowly, drop your shoulders, unclench your hands. Don\'t try to feel different — just create physical space between the trigger and your response.',
    why_this_matters: 'Emotional regulation in aged care leadership isn\'t about suppression — it\'s about buying time. 10 seconds is enough to shift from reactive to responsive. Your team watches how you handle pressure more closely than what you say about it.',
    pressure_example: 'A family member is yelling at you about their parent\'s care. You feel anger rising. Instead of defending, you exhale, drop your shoulders, and say: "I can hear this is really upsetting. Tell me what you need right now."',
    oora_relevant: false,
  },
  // Awareness of Others (carries OORA)
  {
    id: 'LP_AO_03A', competency_id: 'awarenessOfOthers', competency_name: 'Awareness of Others',
    behavior_index: 3, behavior_text: 'Notices when someone is not coping or needs support',
    practice_variant: 'A', title: 'The Check-In Before the Ask',
    what_to_practise: 'Before asking a team member to take on an extra task, check in first: "How are you tracking today?" Listen to the answer — and believe it. If they\'re struggling, find another way.',
    why_this_matters: 'Awareness of others under pressure means noticing before they tell you. In aged care, staff won\'t say "I can\'t cope" until they\'re already past the limit. This practice creates a habitual check-in that catches early signals.',
    pressure_example: 'You need someone to cover an extra resident. Before asking, you notice your best carer looks exhausted. You ask: "How are you going today?" She says "Fine" but her voice is flat. You ask someone else.',
    oora_relevant: true,
  },
  // Emotional Reasoning
  {
    id: 'LP_ER_05A', competency_id: 'emotionalReasoning', competency_name: 'Emotional Reasoning',
    behavior_index: 5, behavior_text: 'Considers the bigger picture when deciding',
    practice_variant: 'A', title: 'The "Who else is affected?" Practice',
    what_to_practise: 'Before making a decision that affects the team, pause and ask: "Who else is affected by this that I haven\'t thought about?" Run through residents, families, other shifts, other teams. Make one adjustment based on what you find.',
    why_this_matters: 'Leaders under pressure narrow their decision frame to the immediate problem. This practice deliberately widens the lens — not to overthink, but to catch the second-order effects that create tomorrow\'s problems.',
    pressure_example: 'You\'re about to move a carer from Wing A to cover Wing B. Before you do, you ask: "Who in Wing A will feel that gap?" You realise two residents have complex needs and adjust the plan.',
    oora_relevant: false,
  },
];

// ── EI BEHAVIOUR LIBRARY ─────────────────────────────────────
// 42 behaviours translated for aged care. Representative set below.

export const EI_BEHAVIOURS: EIBehaviour[] = [
  {
    competency_id: 'selfAwareness', competency_name: 'Self-Awareness',
    behavior_index: 1, behavior_text: 'Understands the impact their behaviour has on others',
    aged_care_meaning: 'Recognising that the sharpness in your voice during the 3pm handover isn\'t about the new care aide — it\'s about what you\'ve been carrying since the morning. In aged care, the leader\'s emotional state transmits directly into the psychological safety of the floor. Staff read you constantly, and what you model in difficult moments shapes what becomes culturally normal.',
    failure_modes: 'Blaming staff reactions on sensitivity rather than examining your own contribution. Delivering hard messages without noticing the emotional charge behind them. Justifying curtness as efficiency. Genuinely not seeing the gap between intent and impact.',
    chris_coaching_angle: 'CHRIS explores: "What was happening for you emotionally when that conversation went sideways?" and "What do you think they took from it?" Builds the habit of tracing impact back to inner state.',
  },
  {
    competency_id: 'authenticity', competency_name: 'Authenticity',
    behavior_index: 4, behavior_text: 'Is honest about their own mistakes',
    aged_care_meaning: 'In aged care, leaders carry enormous accountability — for residents, staff, families, and regulators simultaneously. The pressure to appear infallible is intense. But infallibility is a fiction that erodes trust. When a leader names their mistake before staff have to point it out, they model the vulnerability that makes psychological safety possible for everyone.',
    failure_modes: 'Reframing mistakes as "learning opportunities" without actually naming what went wrong. Apologising in private but never publicly. Making excuses dressed as explanations. Avoiding the topic entirely and hoping staff forget.',
    chris_coaching_angle: 'CHRIS asks: "What was the hardest thing to admit this week?" and follows with "What would it cost you to say that to your team?" Tracks the gap between private acknowledgment and public authenticity.',
  },
  {
    competency_id: 'inspiringPerformance', competency_name: 'Inspiring Performance',
    behavior_index: 7, behavior_text: 'Recognises hard work and effort',
    aged_care_meaning: 'In aged care, the baseline effort required just to get through a shift is enormous — and invisible. Recognition isn\'t about celebrating above-and-beyond performance. It\'s about making the ordinary extraordinary effort of care work visible. When a leader names what they saw, staff feel witnessed. That changes everything.',
    failure_modes: 'Generic praise ("good job, team") that feels hollow. Recognition only during formal processes. Noticing effort only when it produces measurable outcomes. Failing to see the emotional labour that doesn\'t show up in documentation.',
    chris_coaching_angle: 'CHRIS asks: "Who on your team did something this week that no one else noticed?" and "What would it mean to them if you told them you saw it?" Builds the habit of witnessing effort, not just outcomes.',
  },
];

// ── PRACTICE SELECTION ENGINE ────────────────────────────────

/**
 * Select the best practice for a team based on active signals.
 * Library-first: always retrieves from authored library.
 * One practice per cycle. Not a list.
 */
export function selectPractice(
  elevated: string[],
  monitoring: string[],
  scores: Record<string, number>,
  careSetting: 'residential' | 'home_care' = 'residential',
): Practice | null {
  const allPractices = [
    ...(careSetting === 'residential' ? RESIDENTIAL_PRACTICES : HOME_CARE_PRACTICES),
    ...PSH_HAZARD_PRACTICES.filter((p) => p.care_setting === careSetting || p.care_setting === 'both'),
  ];

  // Build active signals from elevated/monitoring domains
  const activeSignals = new Set<string>();
  for (const domain of elevated) {
    activeSignals.add(`${domain.toLowerCase().replace('psh_', '')}_pulse_elevated`);
    // Map PSH domains to common signal names
    const signalMap: Record<string, string[]> = {
      PSH_01: ['workload_pressure_pulse_low', 'fatigue_crisis_indicators'],
      PSH_02: ['support_from_leader_pulse_low'],
      PSH_03: ['trust_erosion_pattern', 'psychological_safety_pulse_low'],
      PSH_04: ['job_control_pulse_low'],
      PSH_05: ['team_relationships_pulse_low'],
      PSH_06: ['role_clarity_pulse_low'],
      PSH_07: ['change_fatigue_indicators'],
      PSH_08: ['traumatic_exposure_pulse_high', 'post_incident_team_state'],
      PSH_09: ['lone_worker_check_in_missed'],
      PSH_10: ['incident_rate_elevated', 'post_incident_team_state'],
      PSH_11: ['psychological_safety_pulse_low'],
      PSH_12: ['fatigue_indicators_rising'],
      PSH_13: ['recognition_pulse_low'],
      PSH_14: [],
      PSH_15: [],
      PSH_16: ['fatigue_indicators_rising'],
    };
    for (const sig of signalMap[domain] ?? []) {
      activeSignals.add(sig);
    }
  }

  // Score each practice by signal intersection
  const scored = allPractices.map((practice) => {
    const intersection = practice.signals_addressed.filter((s) => activeSignals.has(s));
    const matchScore = activeSignals.size > 0 ? intersection.length / activeSignals.size : 0;

    // Bonus for directly addressing the highest-severity domain
    const primaryDomainBonus = elevated.some((d) =>
      practice.psychosocial_hazard.includes(d as PSHDomain)
    ) ? 0.2 : 0;

    return { practice, score: matchScore + primaryDomainBonus, matchCount: intersection.length };
  });

  // Sort by score, then by match count
  scored.sort((a, b) => b.score - a.score || b.matchCount - a.matchCount);

  return scored[0]?.practice ?? null;
}

/**
 * Select a Leader Loop practice based on competency gaps and OBP selection.
 */
export function selectLeaderPractice(
  competencyId: string,
  behaviorIndex?: number,
): LeaderPractice[] {
  return LEADER_PRACTICES.filter((p) =>
    p.competency_id === competencyId &&
    (behaviorIndex == null || p.behavior_index === behaviorIndex)
  );
}

/**
 * Get all practices for a given care setting.
 */
export function getAllPractices(careSetting: 'residential' | 'home_care' = 'residential'): Practice[] {
  return [
    ...(careSetting === 'residential' ? RESIDENTIAL_PRACTICES : HOME_CARE_PRACTICES),
    ...PSH_HAZARD_PRACTICES.filter((p) => p.care_setting === careSetting || p.care_setting === 'both'),
  ];
}
