// iMessage demo thread data — pixel-perfect simulation of CHRIS via LinqApp

export interface ThreadMessage {
  id: string;
  sender: 'chris' | 'user';
  text: string;
  time: string;
  urgent?: boolean; // terracotta tint on bubble for immediate messages
  actions?: Array<{ label: string; route?: string; variant?: 'primary' | 'secondary' | 'urgent'; response?: string }>;
  emojiActions?: Array<{ emoji: string; response: string }>;
}

export interface Thread {
  id: string;
  role: string;
  name: string;
  initials: string;
  color: string;
  messages: ThreadMessage[];
}

export const THREADS: Thread[] = [
  {
    id: 'don',
    role: 'Director of Nursing',
    name: 'Sarah Mitchell',
    initials: 'SM',
    color: '#1B4332',
    messages: [
      { id: 'd1', sender: 'chris', time: 'Today 05:47am', text: "Good morning Sarah. Care minutes are compliant heading into the day — 216 total, 44.4 RN. One thing before you arrive: the Board Pack needs your approval before the 17th. It's sitting in your queue, takes about 20 minutes.", actions: [{ label: 'Open CHRIS →', route: '/dashboard', variant: 'primary' }] },
      { id: 'd2', sender: 'chris', time: 'Today 06:03am', urgent: true, text: 'SIRS Cat 1 — Wattle Wing. Unexpected fall, Wing B bathroom. Draft notification is ready for your review. 18 hours remaining to submit to ACQSC. Penalty exposure: $783K if missed.', actions: [{ label: 'Review draft →', route: '/dashboard/sirs', variant: 'urgent' }] },
      { id: 'd3', sender: 'user', time: 'Today 11:47am', text: "What's our care minutes position for tonight's afternoon shift?" },
      { id: 'd4', sender: 'chris', time: 'Today 11:48am', text: "Tonight looks tight. RN confirmed — 44.2 minutes projected. Total care minutes at 212 — 3 short of the 215 target. The gap is in Grevillea Wing afternoon. One AIN shift unfilled. Want me to generate the agency brief?", actions: [{ label: 'Yes, generate brief →', variant: 'primary', response: 'Agency brief sent to Programmed. Grevillea Wing AIN shift covered for tonight. Care minutes will be compliant. I\'ve updated the roster in the queue for your confirmation.' }, { label: "I'll handle it", variant: 'secondary', response: 'Got it. The gap is flagged in your queue if you need the detail later.' }] },
    ],
  },
  {
    id: 'fm',
    role: 'Facility Manager',
    name: 'James Okonkwo',
    initials: 'JO',
    color: '#2D6A4F',
    messages: [
      { id: 'f1', sender: 'chris', time: 'Today 06:15am', text: "Morning James. The Steward has confirmed the Sunday PM RN gap as structural — 6 of the last 8 weeks have required agency. At $190 premium per shift that's running $4,940 annually. The Oracle and Steward have a joint recommendation ready for you.", actions: [{ label: 'View recommendation →', route: '/dashboard/agents', variant: 'primary' }] },
      { id: 'f2', sender: 'chris', time: 'Today 08:31am', text: 'Oracle weekly scan complete. Three AN-ACC reclassification opportunities identified — combined estimated uplift $11,400 per month if actioned. Two residents are in Wattle Wing. The Steward has found Tuesday morning as the optimal window for clinical reviews.', actions: [{ label: 'View opportunities →', route: '/dashboard/financial/revenue', variant: 'primary' }] },
      { id: 'f3', sender: 'user', time: 'Today 2:15pm', text: 'Has the falls prevention corrective action been picked up?' },
      { id: 'f4', sender: 'chris', time: 'Today 2:16pm', text: "The Wing B bathroom falls corrective action is 11 days overdue — assigned to the DON, due 1 April. CHRIS has it flagged in the quality queue. Falls are still trending above benchmark — 78% of events on shifts with agency coverage above 30%. Worth a conversation with Sarah this week.", actions: [{ label: 'View corrective action →', route: '/dashboard/compliance', variant: 'primary' }] },
    ],
  },
  {
    id: 'cfo',
    role: 'Chief Financial Officer',
    name: 'Michelle Park',
    initials: 'MP',
    color: '#2D7D73',
    messages: [
      { id: 'c1', sender: 'chris', time: 'Today 06:01am', text: "Oracle weekly report ready. This week: 3 AN-ACC opportunities ($11.4K/month), RAD pricing 8% below regional benchmark ($41,200 annual impact at current occupancy), HELF adoption at 12% vs estimated 25% sector average. Full report in the app.", actions: [{ label: 'View Oracle report →', route: '/dashboard/financial/revenue', variant: 'primary' }] },
      { id: 'c2', sender: 'user', time: 'Today 09:15am', text: "What's our care ratio sitting at?" },
      { id: 'c3', sender: 'chris', time: 'Today 09:16am', text: "Care ratio is at 51.9% this period — below the 55% internal target. Agency is the primary driver: 18% of shifts agency-covered this month vs a target of 12%. The Steward's structural gap analysis has the detail.", actions: [{ label: 'View care ratio →', route: '/dashboard/financial/care-ratio', variant: 'primary' }] },
      { id: 'c4', sender: 'chris', time: 'Today 4:45pm', text: "Reminder — QFR submission is due in 8 days. Data is 94% complete in the app. Two fields need your sign-off: the capital expenditure line and the depreciation schedule. Takes about 15 minutes.", actions: [{ label: 'Review QFR →', route: '/dashboard/financial/budget', variant: 'primary' }] },
    ],
  },
  {
    id: 'whs',
    role: 'WHS Lead',
    name: 'Priya Sharma',
    initials: 'PS',
    color: '#D4A017',
    messages: [
      { id: 'w1', sender: 'chris', time: 'Today 06:08am', text: "Cycle 8 closed overnight. PSH update: Wattle Wing showed the strongest improvement this cycle — PSH_08 dropped 0.08, the largest single-cycle improvement we've seen there. Grevillea Wing remains a concern — PSH_08 and PSH_10 both elevated for the third cycle. WC risk signal active.", actions: [{ label: 'View PSH dashboard →', route: '/dashboard/psh', variant: 'primary' }] },
      { id: 'w2', sender: 'chris', time: 'Today 08:44am', text: 'ISO 45003 evidence record has been updated automatically from Cycle 8 pulse data. Coverage: 5.4 Consultation and participation, 6.1 Risk assessment, 8.1 Operational planning. Participation this cycle: 84% — above the 75% threshold for evidence validity.', actions: [{ label: 'View evidence record →', route: '/dashboard/risk', variant: 'primary' }] },
      { id: 'w3', sender: 'user', time: 'Today 11:20am', text: "What's the WC risk dollar estimate for Grevillea Wing?" },
      { id: 'w4', sender: 'chris', time: 'Today 11:21am', text: "Based on PSH_08 and PSH_10 both elevated simultaneously, the research correlation puts WC claim probability at 68% within 4-6 weeks. Average claim cost in residential aged care: $45K-$290K. At the lower bound that's $30,600 expected cost. The Grevillea Wing Team Briefing this fortnight has a targeted intervention — worth checking it landed.", actions: [{ label: 'View Grevillea briefing →', route: '/team-loop/briefing', variant: 'primary' }] },
    ],
  },
  {
    id: 'team-leader',
    role: 'Team Leader',
    name: 'Anika Patel',
    initials: 'AP',
    color: '#6BAF92',
    messages: [
      { id: 't1', sender: 'chris', time: 'Sunday 11:47pm', text: "Hi Anika. Your Cycle 8 Team Briefing is ready for your Monday huddle. Wattle Wing had a strong cycle — PSH_08 improved the most of any team in the facility. The practice worked. This fortnight: a recognition micro-practice for the team. Takes 5 minutes in your huddle.", actions: [{ label: 'Read your briefing →', route: '/team-loop/briefing', variant: 'primary' }] },
      { id: 't2', sender: 'user', time: 'Monday 7:02am', text: "Thanks CHRIS. Quick one — one of my team is really struggling today. What should I do?" },
      { id: 't3', sender: 'chris', time: 'Monday 7:03am', text: "That's hard to witness. A few things worth considering: check in privately, not in front of the team. One open question — \"How are you doing, really?\" — then listen without fixing. If it feels serious, the EAP line is 1800 818 728, available 24/7. Want to talk through it more?", actions: [{ label: 'Open CHRIS Coach →', route: '/dashboard/coach', variant: 'primary' }, { label: 'That helped, thanks', variant: 'secondary', response: 'Glad that helped 👍 You\'re doing the right thing by noticing.' }] },
      { id: 't4', sender: 'chris', time: 'Wednesday 2:15pm', text: "Leader Briefing ready for this week. Your reflection prompt: the recognition practice landed well last fortnight — what did you notice about how your team responded? One thing to try this week in the Leader Loop.", actions: [{ label: 'Read Leader Briefing →', route: '/leader-loop/arrive', variant: 'primary' }] },
    ],
  },
  {
    id: 'csw',
    role: 'Community Support Worker',
    name: 'Tom Nguyen',
    initials: 'TN',
    color: '#C4704A',
    messages: [
      { id: 'h1', sender: 'chris', time: 'Today 8:02am', text: "Morning Tom. You have 4 visits today starting at 9am in Bowral. First visit: Margaret, 12 Merrigang St. Don't forget your check-in after each visit.", actions: [{ label: 'View my schedule →', route: '/dashboard/visits', variant: 'primary' }] },
      { id: 'h2', sender: 'chris', time: 'Today 9:47am', text: "Check-in reminder — you've been at your current visit for 75 minutes. All good?", actions: [{ label: '✓ All good', variant: 'primary', response: 'Thanks Tom. Check-in logged. Take your time.' }, { label: 'Need help', variant: 'secondary', response: 'Your coordinator has been notified. Emergency: 000. Office: 02 4861 1234.' }] },
      { id: 'h3', sender: 'user', time: 'Today 9:48am', text: "All good, running a bit long. Margaret had a fall yesterday, staying a bit longer." },
      { id: 'h4', sender: 'chris', time: 'Today 9:49am', text: "Thanks for letting me know. Take your time. If Margaret had a fall yesterday that wasn't reported, it may need to be logged. Do you know if the office was told?", actions: [{ label: 'It was reported', variant: 'secondary', response: 'Good — noted. Finish up when you\'re ready.' }, { label: "I'm not sure", variant: 'secondary', response: 'No worries — I\'ll flag it for your coordinator to check. You focus on Margaret.' }, { label: 'Help me report it', variant: 'primary', response: 'Opening the incident form. I\'ll pre-fill what I know — you just add the details.' }] },
      { id: 'h5', sender: 'chris', time: 'Today 4:30pm', text: "Great work today Tom — all 4 visits completed. How are you feeling after the shift?", emojiActions: [{ emoji: '😊', response: 'Glad to hear it. See you tomorrow.' }, { emoji: '😐', response: 'Got it. Anything on your mind? I\'m here if you want to talk.' }, { emoji: '😟', response: "Sorry to hear that. Want to talk about it? The EAP line is also available 24/7: 1800 818 728." }] },
    ],
  },
];

export function getThread(id: string): Thread | undefined {
  return THREADS.find((t) => t.id === id);
}
