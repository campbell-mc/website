"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { HandoverItem } from "@/components/operations/HandoverItem";
import { current_handover } from "@/lib/seed-data";

export default function MobileHandovers() {
  const [items, setItems] = useState(current_handover.items.map((i) => ({ ...i })));
  const [newNote, setNewNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [completed, setCompleted] = useState(false);

  function markNoted(id: string) {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, noted: true } : i));
  }

  const sorted = [...items].sort((a, b) => (a.noted === b.noted ? 0 : a.noted ? 1 : -1));

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <div className="w-16 h-16 rounded-full bg-[#D4EDDD] flex items-center justify-center mb-4">
          <span className="text-2xl">✓</span>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Handover completed</h2>
        <p className="text-sm text-muted-foreground text-center">Incoming team notified.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 pb-32">
      <h1 className="text-[28px] font-bold text-foreground mb-1">Handovers</h1>
      <p className="text-xs text-muted-foreground mb-4">Afternoon handover · Monday 13 April</p>

      {/* Items */}
      <div className="space-y-3 mb-4">
        {sorted.map((item) => (
          <HandoverItem
            key={item.id}
            priority={item.priority}
            title={item.title}
            detail={item.detail}
            source={item.source}
            generatedBy={item.generated_by}
            wing={item.wing}
            noted={item.noted}
            onMarkNoted={() => markNoted(item.id)}
          />
        ))}
      </div>

      {/* Add note */}
      {!showNoteInput ? (
        <button onClick={() => setShowNoteInput(true)} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-4">
          <Plus className="w-3.5 h-3.5" /> Add handover note
        </button>
      ) : (
        <div className="bg-card rounded-xl border border-border p-3 mb-4">
          <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Note for incoming shift..." className="w-full p-2 border border-border rounded-lg text-sm bg-background resize-none min-h-[60px]" />
          <div className="flex gap-2 mt-2">
            <button onClick={() => { setShowNoteInput(false); setNewNote(""); }} className="flex-1 text-xs py-2 rounded-lg border border-border text-muted-foreground">Cancel</button>
            <button onClick={() => setShowNoteInput(false)} className="flex-1 text-xs py-2 rounded-lg bg-[#1B4332] text-white">Add</button>
          </div>
        </div>
      )}

      {/* History */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recent handovers</p>
      <div className="space-y-1 mb-4">
        {[
          { shift: "Morning", date: "13 Apr", items: 5 },
          { shift: "Night", date: "12 Apr", items: 3 },
          { shift: "Afternoon", date: "12 Apr", items: 6 },
        ].map((h, i) => (
          <div key={i} className="flex items-center justify-between py-2 text-xs text-muted-foreground">
            <span>{h.shift} · {h.date}</span>
            <span>{h.items} items</span>
          </div>
        ))}
      </div>

      {/* Sticky sign-off */}
      <div className="fixed bottom-16 left-0 right-0 px-4 py-3 bg-card border-t border-border md:hidden">
        <button onClick={() => setCompleted(true)} className="w-full py-3.5 rounded-xl font-medium text-white bg-[#1B4332] hover:opacity-90" style={{ minHeight: "56px" }}>
          Complete handover →
        </button>
      </div>
    </div>
  );
}
