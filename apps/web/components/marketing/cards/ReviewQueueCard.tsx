"use client";

import { useEffect, useState } from "react";

const ALL_ITEMS = [
  { urgency: "immediate", label: "SIRS Priority 1: review draft", agent: "Chronicler", time: "11:09pm", color: "#b5572a", detail: "Fall with injury. 24h deadline. Draft complete." },
  { urgency: "urgent", label: "Care minutes gap: tonight's RN shift", agent: "Sentinel", time: "2:14pm", color: "#c89a3c", detail: "Projected breach at 3pm. 2 agency RNs available." },
  { urgency: "urgent", label: "Board Pack Q3: awaiting approval", agent: "Chronicler", time: "8 days", color: "#c89a3c", detail: "8 sections compiled. Meeting in 8 days." },
  { urgency: "routine", label: "QI submission: data compiled", agent: "Chronicler", time: "14 days", color: "#2d6a4f", detail: "14 domains. GPMS-ready. 15 min review." },
  { urgency: "urgent", label: "PSH convergence: Grevillea Wing", agent: "Keeper", time: "Fri", color: "#c89a3c", detail: "PSH_01 + PSH_08. 6 cycles. Structural intervention." },
  { urgency: "routine", label: "AN-ACC reclassification: 3 residents", agent: "Oracle", time: "Tue", color: "#2d6a4f", detail: "Estimated uplift $11.4K/mo. Clinical review needed." },
];

export function ReviewQueueCard() {
  const [items, setItems] = useState(ALL_ITEMS.slice(0, 4));
  const [newItem, setNewItem] = useState(false);

  // Simulate a new item arriving
  useEffect(() => {
    const t = setTimeout(() => {
      setNewItem(true);
      setItems([ALL_ITEMS[4], ...ALL_ITEMS.slice(0, 4)]);
      setTimeout(() => setNewItem(false), 2000);
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-white rounded-[10px] p-5 w-full" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)" }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] font-semibold text-[#1a1218]">Review queue</p>
        <div className="flex items-center gap-2">
          <span className={`w-5 h-5 rounded-full bg-[#1B4332] flex items-center justify-center text-[9px] text-white font-bold transition-all duration-300 ${newItem ? "scale-125 bg-[#b5572a]" : ""}`}>
            {items.length}
          </span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a4f] animate-pulse" />
            <span className="text-[9px] font-medium text-[#1a1218]/30">Live</span>
          </div>
        </div>
      </div>

      <div className="space-y-0">
        {items.slice(0, 5).map((item, i) => (
          <div key={`${item.label}-${i}`}
            className={`flex items-start gap-2.5 py-2.5 transition-all duration-500 ${i === 0 && newItem ? "bg-[#b5572a]/[0.03] -mx-2 px-2 rounded-lg" : ""}`}
            style={{ borderTop: i > 0 ? "1px solid rgba(26,18,24,0.04)" : "none" }}>
            <div className="w-1 h-full min-h-[40px] rounded-full shrink-0 mt-0.5 transition-all duration-300" style={{ backgroundColor: item.color }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] font-medium text-[#1a1218]/75 leading-snug">{item.label}</p>
                <span className="text-[9px] text-[#1a1218]/25 shrink-0 mt-0.5">{item.time}</span>
              </div>
              <p className="text-[9px] text-[#1a1218]/35 mt-0.5 leading-snug">{item.detail}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] text-[#1a1218]/25">{item.agent}</span>
                <span className="text-[8px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: `${item.color}10`, color: item.color }}>
                  {item.urgency}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Queue stats */}
      <div className="flex items-center justify-between mt-3 pt-2" style={{ borderTop: "1px solid rgba(26,18,24,0.06)" }}>
        <div className="flex items-center gap-3 text-[9px] text-[#1a1218]/30">
          <span><span className="font-semibold" style={{ color: "#b5572a" }}>1</span> immediate</span>
          <span><span className="font-semibold" style={{ color: "#c89a3c" }}>{items.filter((i) => i.urgency === "urgent").length}</span> urgent</span>
          <span><span className="font-semibold" style={{ color: "#2d6a4f" }}>{items.filter((i) => i.urgency === "routine").length}</span> routine</span>
        </div>
        <span className="text-[9px] text-[#1a1218]/25">Avg: 4.2 min</span>
      </div>
    </div>
  );
}
