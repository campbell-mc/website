export function AgentActivityCard() {
  const agents = [
    { name: "Sentinel", status: "active", action: "Care minutes compliant · RN confirmed tonight", dot: "#2d6a4f", time: "2m ago" },
    { name: "Chronicler", status: "awaiting", action: "SIRS Priority 1 draft ready · awaiting DON review", dot: "#c89a3c", time: "11m ago" },
    { name: "Oracle", status: "active", action: "3 AN-ACC reclassification opportunities · $11.4K/mo", dot: "#2d6a4f", time: "Sun 9pm" },
    { name: "Keeper", status: "active", action: "PSH convergence Grevillea Wing · cycle 6", dot: "#b5572a", time: "Fri" },
    { name: "Steward", status: "active", action: "Sunday PM structural gap · 7th consecutive week", dot: "#c89a3c", time: "6am" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 w-full" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)" }}>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[13px] font-semibold text-[#1a1218]">Agent activity</p>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a4f] animate-pulse" />
          <span className="text-[10px] text-[#1a1218]/40">5 active</span>
        </div>
      </div>

      <div className="space-y-0">
        {agents.map((agent, i) => (
          <div key={i} className="flex items-start gap-3 py-2.5" style={{ borderTop: i > 0 ? "1px solid rgba(26,18,24,0.04)" : "none" }}>
            <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: agent.dot }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1a1218]/50">{agent.name}</span>
                <span className="text-[10px] text-[#1a1218]/25">{agent.time}</span>
              </div>
              <p className="text-[12px] text-[#1a1218]/60 mt-0.5">{agent.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
