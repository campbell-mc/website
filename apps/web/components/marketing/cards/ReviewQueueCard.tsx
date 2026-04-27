export function ReviewQueueCard() {
  const items = [
    { urgency: "immediate", label: "SIRS Priority 1 — review draft", agent: "Chronicler", time: "11:09pm", color: "#b5572a" },
    { urgency: "urgent", label: "Care minutes gap — tonight's RN shift", agent: "Sentinel", time: "2:14pm", color: "#c89a3c" },
    { urgency: "urgent", label: "Board Pack Q3 — awaiting approval", agent: "Chronicler", time: "8 days", color: "#c89a3c" },
    { urgency: "routine", label: "QI submission — data compiled", agent: "Chronicler", time: "14 days", color: "#2d6a4f" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 w-full" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)" }}>
      <div className="flex items-center justify-between mb-5">
        <p className="text-[13px] font-semibold text-[#1a1218]">Review queue</p>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-[#b5572a] flex items-center justify-center text-[9px] text-white font-bold">1</span>
          <span className="text-[11px] text-[#1a1218]/40">4 items</span>
        </div>
      </div>

      <div className="space-y-0">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 py-3" style={{ borderTop: i > 0 ? "1px solid rgba(26,18,24,0.04)" : "none" }}>
            <div className="w-1 h-full min-h-[36px] rounded-full shrink-0 mt-0.5" style={{ backgroundColor: item.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-[#1a1218]/80">{item.label}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-[#1a1218]/30">{item.agent}</span>
                <span className="text-[10px] text-[#1a1218]/30">·</span>
                <span className="text-[10px] text-[#1a1218]/30">{item.time}</span>
              </div>
            </div>
            <span className="text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0" style={{ backgroundColor: `${item.color}10`, color: item.color }}>
              {item.urgency}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
