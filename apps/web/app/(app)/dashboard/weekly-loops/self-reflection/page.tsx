"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const PROMPTS = [
  { id: "practice", prompt: 'The practice this cycle was "Structured debrief after difficult shifts." What happened when you used it? What did you notice in your team?', placeholder: "Be honest — what worked, what felt awkward, what surprised you..." },
  { id: "loop", prompt: "Looking at your Leader Loop results — what stands out? What do you want to understand better?", placeholder: "What are you curious about in the feedback?" },
  { id: "genos", prompt: "Genos EI focus — Emotional self-awareness: Before your next team huddle, what are you carrying into the room? What state do you want to be in?", placeholder: "What do you need to let go of or prepare for?" },
  { id: "next", prompt: "One thing you will do differently next fortnight as a leader:", placeholder: "Be specific — what will you do, when, and with whom?" },
];

export default function SelfReflectionPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    try {
      await fetch("/api/weekly-loops/self-reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cycle: 8, answers }),
      });
    } catch (e) { /* silent for demo */ }
    setSaved(true);
  }

  if (saved) {
    return (
      <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-[#D4EDDD] flex items-center justify-center mx-auto mb-4"><span className="text-2xl">✓</span></div>
        <h2 className="text-lg font-bold text-foreground mb-2">Reflection saved</h2>
        <p className="text-sm text-muted-foreground mb-4">Your reflection is private. CHRIS will reference it in your next Leader Briefing to help track your development over cycles.</p>
        <p className="text-xs text-muted-foreground mb-6">CHRIS will also send a summary via iMessage as a personal reminder before the next cycle.</p>
        <button onClick={() => router.push("/dashboard/weekly-loops")} className="px-6 py-3 bg-[#1B4332] text-white rounded-xl text-sm font-medium">Back to Weekly Loops →</button>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-2xl mx-auto">
      <button onClick={() => router.push("/dashboard/weekly-loops")} className="flex items-center gap-1 text-sm text-muted-foreground mb-4"><ChevronLeft className="w-4 h-4" /> Weekly Loops</button>
      <h1 className="text-[22px] md:text-xl font-semibold text-foreground mb-1">Self-reflection</h1>
      <p className="text-xs text-muted-foreground mb-5">Cycle 8 · Private · Your notes stay with you</p>

      <div className="bg-[#F0F7F4] rounded-xl border border-[#2D7D73] p-3 mb-5">
        <p className="text-xs text-foreground leading-relaxed">This is your thinking space. No one else reads your reflection — not your manager, not CHRIS&apos;s intelligence reporting. CHRIS uses it only to write your next Leader Briefing. Takes about 10 minutes.</p>
      </div>

      <div className="space-y-4 mb-5">
        {PROMPTS.map((p, i) => (
          <div key={p.id} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-base font-bold text-[#2D7D73] shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-sm font-medium text-foreground leading-relaxed">{p.prompt}</p>
            </div>
            <textarea
              value={answers[p.id] ?? ""}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [p.id]: e.target.value }))}
              placeholder={p.placeholder}
              rows={4}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background resize-none"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={Object.keys(answers).length === 0}
        className={`w-full py-3.5 rounded-xl text-sm font-medium ${Object.keys(answers).length > 0 ? "bg-[#1B4332] text-white" : "bg-muted text-muted-foreground"}`}
      >
        Save reflection →
      </button>
      <p className="text-[10px] text-muted-foreground text-center mt-2">CHRIS will send this reflection via iMessage as a personal reminder before next cycle.</p>

      <div className="h-16" />
    </div>
  );
}
