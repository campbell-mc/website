export function AgentActivityCard() {
  const agents = [
    { name: "Sentinel", action: "Care minutes compliant. RN confirmed tonight.", value: "180/215", dot: "#2d6a4f", time: "2m" },
    { name: "Chronicler", action: "SIRS Priority 1 draft ready. Awaiting DON.", value: "1 draft", dot: "#c89a3c", time: "11m" },
    { name: "Oracle", action: "AN-ACC reclassification opportunities identified.", value: "$11.4K/mo", dot: "#2d6a4f", time: "Sun" },
    { name: "Keeper", action: "PSH convergence Grevillea Wing. Cycle 6.", value: "2 domains", dot: "#b5572a", time: "Fri" },
    { name: "Steward", action: "Sunday PM structural gap. 7th consecutive week.", value: "$4.9K save", dot: "#c89a3c", time: "6am" },
  ];

  return (
    <div className="bg-white rounded-[10px] p-5 w-full" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)" }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] font-semibold text-[#1a1218]">Agent activity</p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-[#1a1218]/35">5/5</span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a4f] animate-pulse" />
            <span className="text-[9px] font-medium text-[#1a1218]/30">Running</span>
          </div>
        </div>
      </div>

      <div className="space-y-0">
        {agents.map((agent, i) => (
          <div key={i} className="flex items-start gap-2.5 py-2" style={{ borderTop: i > 0 ? "1px solid rgba(26,18,24,0.04)" : "none" }}>
            <span className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: agent.dot }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#1a1218]/70">{agent.name}</span>
                <span className="text-[10px] font-semibold tabular-nums" style={{ color: agent.dot }}>{agent.value}</span>
              </div>
              <p className="text-[10px] text-[#1a1218]/40 mt-0.5 leading-snug">{agent.action}</p>
            </div>
            <span className="text-[9px] text-[#1a1218]/20 shrink-0">{agent.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
