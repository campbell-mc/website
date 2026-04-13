"use client";

import { useState } from "react";
import { ClipboardList, Clock, AlertTriangle, Plus } from "lucide-react";
import { HandoverItem } from "@/components/operations/HandoverItem";
import { AgentPulse } from "@/components/chris/AgentPulse";
import { SituationReport } from "@/components/chris/SituationReport";
import { operationsReport } from "@/lib/chris/situation-reports";
import { current_handover, facility } from "@/lib/seed-data";
import { useMobile } from "@/lib/hooks/useMobile";
import MobileHandovers from "@/components/mobile/MobileHandovers";

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-3">
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      {sub && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function HandoversPage() {
  const mobile = useMobile();
  if (mobile) return <MobileHandovers />;

  const [items, setItems] = useState(current_handover.items.map((i) => ({ ...i })));
  const [notes, setNotes] = useState<{ text: string; role: string; time: string }[]>([]);
  const [newNote, setNewNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [completed, setCompleted] = useState(false);

  const chrisGenerated = items.filter((i) => i.generated_by !== "manual").length;
  const followUp = items.filter((i) => i.priority === "high" || i.priority === "medium").length;

  function markNoted(id: string) {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, noted: true } : i));
  }

  function addNote() {
    if (!newNote.trim()) return;
    setNotes([...notes, { text: newNote, role: "DON", time: new Date().toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" }) }]);
    setNewNote("");
    setShowNoteInput(false);
  }

  // Sort: not-noted first, then noted
  const sorted = [...items].sort((a, b) => (a.noted === b.noted ? 0 : a.noted ? 1 : -1));

  if (completed) {
    return (
      <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-[#D4EDDD] flex items-center justify-center mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Handover completed</h2>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Afternoon handover locked. Incoming team notified.
          </p>
          <p className="text-xs text-muted-foreground">{items.filter((i) => i.noted).length} items noted · {notes.length} notes added</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-3xl mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-foreground">Handovers</h1>
        <p className="text-xs text-muted-foreground">{facility.name} · Monday 13 April · Afternoon handover</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard label="Handover items" value={String(items.length)} />
        <StatCard label="CHRIS-generated" value={String(chrisGenerated)} />
        <StatCard label="Requiring follow-up" value={String(followUp)} />
        <StatCard label="Last completed" value={current_handover.last_completed.time} sub={`${current_handover.last_completed.shift} shift`} />
      </div>

      <AgentPulse domain="operations" />

      <div className="mb-5">
        <SituationReport domain="operations" narrative={operationsReport.narrative} refreshedAt={operationsReport.refreshedAt} context={operationsReport.context} signals={operationsReport.signals} />
      </div>

      {/* Current handover items */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">
        Current handover — Afternoon shift (2pm)
      </p>

      <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-2 mt-4">CHRIS-generated items</p>
      <div className="space-y-3 mb-5">
        {sorted.filter((i) => i.generated_by !== "manual").map((item) => (
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

      {sorted.filter((i) => i.generated_by === "manual").length > 0 && (
        <>
          <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-2">Manual items</p>
          <div className="space-y-3 mb-5">
            {sorted.filter((i) => i.generated_by === "manual").map((item) => (
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
        </>
      )}

      {/* Clinical notes */}
      <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-2">Clinical notes</p>
      {notes.length > 0 && (
        <div className="space-y-2 mb-3">
          {notes.map((n, i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-medium text-muted-foreground">{n.role}</span>
                <span className="text-[10px] text-muted-foreground/60">{n.time}</span>
              </div>
              <p className="text-xs text-foreground">{n.text}</p>
            </div>
          ))}
        </div>
      )}

      {!showNoteInput ? (
        <button onClick={() => setShowNoteInput(true)} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground mb-5">
          <Plus className="w-3.5 h-3.5" /> Add handover note
        </button>
      ) : (
        <div className="bg-card rounded-xl border border-border p-3 mb-5">
          <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a note for the incoming shift..." className="w-full p-2 border border-border rounded-lg text-sm bg-background resize-none min-h-[60px]" />
          <div className="flex gap-2 mt-2">
            <button onClick={addNote} className="text-xs font-medium px-3 py-2 rounded-lg bg-[#1B4332] text-white hover:opacity-90">Add note</button>
            <button onClick={() => setShowNoteInput(false)} className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-muted-foreground">Cancel</button>
          </div>
        </div>
      )}

      {/* Handover history */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Handover history</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-5">
        {[
          { shift: "Morning", date: "13 Apr", by: "CN Sarah Chen", items: 5 },
          { shift: "Night", date: "12 Apr", by: "RN Night", items: 3 },
          { shift: "Afternoon", date: "12 Apr", by: "CN James Wu", items: 6 },
        ].map((h, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5 border-b border-border last:border-b-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-foreground">{h.shift}</span>
              <span className="text-xs text-muted-foreground">{h.date}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{h.by}</span>
              <span className="text-xs text-muted-foreground">{h.items} items</span>
            </div>
          </div>
        ))}
      </div>

      {/* Complete button */}
      <button onClick={() => setCompleted(true)} className="w-full py-3.5 rounded-xl font-medium text-white bg-[#1B4332] hover:opacity-90 mb-16">
        Complete handover and notify incoming team →
      </button>
    </div>
  );
}
