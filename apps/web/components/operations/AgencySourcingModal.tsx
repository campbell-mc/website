"use client";

import { useState } from "react";

interface AgencySourcingModalProps {
  role: "RN" | "EN" | "AIN";
  shift: string;
  date: string;
  wing?: string;
  onClose: () => void;
}

const PERM_RATES: Record<string, number> = { RN: 52, EN: 44, AIN: 32 };

export function AgencySourcingModal({ role, shift, date, wing, onClose }: AgencySourcingModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const permRate = PERM_RATES[role] ?? 32;

  const agencies = [
    { id: "programmed", name: "Programmed Healthcare", available: true, workers: 3, rate: role === "RN" ? 72 : role === "EN" ? 58 : 42, responseTime: "< 30 min", rating: 4.8 },
    { id: "hendercare", name: "Hendercare", available: true, workers: 1, rate: role === "RN" ? 68 : role === "EN" ? 55 : 40, responseTime: "< 1h", rating: 4.6 },
    { id: "healthe", name: "Healthe Care Staffing", available: false, workers: 0, rate: 0, responseTime: "Unavailable tonight", rating: 4.5 },
  ];

  const sel = agencies.find((a) => a.id === selected);

  if (booked) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-2xl w-full max-w-md p-6 text-center">
          <div className="text-4xl mb-3">✓</div>
          <h3 className="text-lg font-bold text-foreground mb-2">Cover sourced</h3>
          <p className="text-sm text-muted-foreground mb-4">Request sent to {sel?.name}. Confirmation within {sel?.responseTime}. CHRIS will update the roster.</p>
          <button onClick={onClose} className="w-full py-3 bg-[#1B4332] text-white rounded-xl font-medium">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
      <div className="bg-card rounded-2xl w-full max-w-md">
        <div className="p-5 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">Find agency cover</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{role} · {shift} · {wing ?? "All wings"} · {date}</p>
            </div>
            <button onClick={onClose} className="text-muted-foreground text-lg">✕</button>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {agencies.map((a) => (
            <button key={a.id} onClick={() => a.available && setSelected(a.id)} disabled={!a.available}
              className={`w-full text-left p-4 rounded-xl border transition-all ${!a.available ? "opacity-50 cursor-not-allowed border-border bg-muted/30" : selected === a.id ? "border-[#2D7D73] bg-[#F0F7F4]" : "border-border bg-card hover:border-muted-foreground/20"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground">{a.name}</p>
                    {selected === a.id && <span className="text-[10px] bg-[#2D7D73] text-white px-2 py-0.5 rounded-full">Selected</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{a.available ? `${a.workers} available · ${a.responseTime} · ${a.rating}★` : a.responseTime}</p>
                </div>
                {a.available && (
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-foreground">${a.rate}/hr</p>
                    <p className="text-xs text-[#C4704A]">+${a.rate - permRate} premium</p>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
        {sel && (
          <div className="mx-4 bg-[#FEF7F0] rounded-xl p-3 mb-4">
            <p className="text-xs text-muted-foreground">Est. cost: <strong>${sel.rate * 8}</strong> (8h shift) · Premium: <strong className="text-[#C4704A]">${(sel.rate - permRate) * 8}</strong></p>
          </div>
        )}
        <div className="p-4 pt-0 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-border text-muted-foreground rounded-xl text-sm font-medium">Cancel</button>
          <button onClick={() => setBooked(true)} disabled={!selected} className={`flex-1 py-3 rounded-xl text-sm font-medium ${selected ? "bg-[#1B4332] text-white" : "bg-muted text-muted-foreground cursor-not-allowed"}`}>Request cover →</button>
        </div>
        <div className="px-4 pb-4"><button className="w-full py-2.5 text-sm text-[hsl(var(--brand-teal))] font-medium">Post to internal pool instead →</button></div>
      </div>
    </div>
  );
}
