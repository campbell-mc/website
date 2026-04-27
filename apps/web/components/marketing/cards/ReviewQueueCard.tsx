export function ReviewQueueCard() {
  const items = [
    { urgency: "immediate", label: "SIRS Priority 1: review draft", agent: "Chronicler", time: "11:09pm", color: "#b5572a" },
    { urgency: "urgent", label: "Care minutes gap: tonight's RN shift", agent: "Sentinel", time: "2:14pm", color: "#c89a3c" },
    { urgency: "urgent", label: "Board Pack Q3: awaiting approval", agent: "Chronicler", time: "8 days", color: "#c89a3c" },
    { urgency: "routine", label: "QI submission: data compiled", agent: "Chronicler", time: "14 days", color: "#2d6a4f" },
  ];

  return (
    <div className="bg-white rounded-[10px] p-5 w-full" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)" }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] font-semibold text-[#1a1218]">Review queue</p>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#1B4332] flex items-center justify-center text-[9px] text-white font-bold">4</span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a4f] animate-pulse" />
            <span className="text-[9px] font-medium text-[#1a1218]/30">Live</span>
          </div>
        </div>
      </div>

      <div className="space-y-0">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2.5 py-2.5" style={{ borderTop: i > 0 ? "1px solid rgba(26,18,24,0.04)" : "none" }}>
            <div className="w-1 h-full min-h-[32px] rounded-full shrink-0 mt-0.5" style={{ backgroundColor: item.color }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] font-medium text-[#1a1218]/75 leading-snug">{item.label}</p>
                <span className="text-[9px] text-[#1a1218]/25 shrink-0 mt-0.5">{item.time}</span>
              </div>
              <span className="text-[9px] text-[#1a1218]/30 mt-0.5 block">{item.agent}</span>
            </div>
            <span className="text-[8px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0" style={{ backgroundColor: `${item.color}10`, color: item.color }}>
              {item.urgency}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
