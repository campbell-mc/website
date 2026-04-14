const AGENTS = [
  { name: "The Sentinel", cadence: "2-hr cycle", color: "bg-emerald-50 text-emerald-700", domain: "Clinical & compliance vigilance", what: "Monitors care minutes per shift and day, 24/7 RN coverage, SIRS incident classification, clinical audit schedule, and roster compliance. Triggers alerts when thresholds are breached.", outputs: ["Care minutes alert", "SIRS draft notification", "Roster gap alert", "Compliance breach notice"] },
  { name: "The Oracle", cadence: "Weekly", color: "bg-amber-50 text-amber-700", domain: "Revenue & funding intelligence", what: "Scans AN-ACC classifications for reclassification opportunities, benchmarks financial performance against StewartBrown data, identifies accommodation pricing optimisation, and surfaces revenue gaps.", outputs: ["AN-ACC reclassification brief", "Revenue gap analysis", "StewartBrown benchmark report", "Funding forecast"] },
  { name: "The Steward", cadence: "Daily", color: "bg-emerald-50 text-emerald-700", domain: "Capacity & operational structure", what: "Analyses rostering patterns for structural gaps — not individual missed shifts, but repeating patterns that indicate a permanent staffing problem. Surfaces root causes and recommendations.", outputs: ["Structural gap brief", "Agency dependency analysis", "Roster optimisation recommendation"] },
  { name: "The Chronicler", cadence: "Event-driven", color: "bg-amber-50 text-amber-700", domain: "Auto-documentation & evidence", what: "Triggered by incident events. Drafts SIRS notifications, corrective action plans, board pack entries, and QI submission data. The DON reviews and approves — not authors.", outputs: ["SIRS notification draft", "Corrective action plan", "Board pack entry", "QI submission data"] },
  { name: "The Keeper", cadence: "Fortnightly", color: "bg-orange-50 text-orange-700", domain: "Workforce intelligence & people health", what: "Analyses psychosocial hazard signals from pulse surveys across all 16 ISO 45003 domains. Detects convergence events, identifies turnover precursors, and prescribes evidence-based micro-practices.", outputs: ["Monday Briefing", "Team Briefing", "PSH convergence alert", "ISO 45003 evidence pack"] },
  { name: "The Town Crier", cadence: "Continuous", color: "bg-stone-100 text-stone-600", domain: "Signal coordination & clarity", what: "Coordinates output across all other agents. When the Sentinel and Steward both flag the same issue, the Town Crier decides what reaches which leader and when. One coordinated signal, not five separate alerts.", outputs: ["Coordinated briefing", "Escalation routing", "Alert suppression", "Cross-agent synthesis"] },
  { name: "The Curator", cadence: "2-hr cycle", color: "bg-slate-100 text-slate-600", domain: "Sector intelligence & regulatory watch", what: "Monitors 35 external sources — government, regulators, legal analysis, sector news — every 2 hours. Surfaces regulatory changes, sector developments, and compliance intelligence. Powers The Newsroom.", outputs: ["Newsroom intelligence feed", "Weekly regulatory report", "Regulatory change alert"] },
];

export function AgentLayer() {
  return (
    <section className="bg-stone-50 border-b border-[#1B4332]/8">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4">The seven agents</div>
        <h2 className="text-[clamp(24px,3vw,36px)] font-normal leading-[1.1] tracking-[-0.02em] text-[#1B4332] mb-4" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>Every domain. Always on.</h2>
        <p className="text-[14px] text-stone-500 max-w-xl mb-12 leading-relaxed">Each agent has a specific domain, a defined cadence, and a set of outputs. Together they watch every dimension of an aged care organisation simultaneously.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AGENTS.map((agent) => (
            <div key={agent.name} className="bg-white border border-[#1B4332]/8 rounded-xl p-5 hover:border-[#1B4332]/20 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[13px] font-medium text-stone-800">{agent.name}</span>
                <span className={`text-[9px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full ${agent.color}`}>{agent.cadence}</span>
              </div>
              <div className="text-[11px] text-stone-400 mb-3">{agent.domain}</div>
              <p className="text-[12px] text-stone-500 leading-relaxed mb-3">{agent.what}</p>
              <div className="flex flex-wrap gap-1.5">
                {agent.outputs.map((o) => (
                  <span key={o} className="text-[10px] text-stone-500 bg-stone-50 border border-stone-100 rounded-full px-2.5 py-1">{o}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
