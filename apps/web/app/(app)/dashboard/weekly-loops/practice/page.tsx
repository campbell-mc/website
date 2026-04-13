"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const PRACTICE = {
  name: "Structured debrief after difficult shifts",
  target: "PSH_08 Traumatic Exposure + PSH_14 Emotional Demands",
  duration: "5 minutes",
  when: "At the end of any shift involving a traumatic or difficult event",
  rationale: "When staff carry unprocessed trauma from a shift into their next one, it compounds. A brief structured debrief creates a container for the experience and signals that the organisation cares.",
  steps: [
    "At the end of the shift, gather the team briefly — even 2-3 minutes in the corridor is fine.",
    'Open with: "That was a hard shift. Before you go — what was the hardest moment for you today?"',
    "Listen without fixing. Let people name it.",
    '"What\'s one thing you\'re leaving here before you go home?" — signals it\'s ok to let it go.',
    "Takes 5 minutes. The discipline is doing it consistently, not perfectly.",
  ],
  opening: "Before we finish up — that was a difficult shift. I want to take 5 minutes so we can leave it here rather than take it home with us.",
  evidence: "ISO 45003:2021 §8.1.2 — Operational control of psychosocial risk",
  prior: "PSH_08 dropped 0.08 in Wattle Wing where this practice was used last cycle — the strongest single-cycle improvement seen in that team.",
};

export default function MicroPracticePage() {
  const router = useRouter();
  const [delivered, setDelivered] = useState(false);
  const [notes, setNotes] = useState("");

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-2xl mx-auto">
      <button onClick={() => router.push("/dashboard/weekly-loops")} className="flex items-center gap-1 text-sm text-muted-foreground mb-4"><ChevronLeft className="w-4 h-4" /> Weekly Loops</button>
      <h1 className="text-[22px] md:text-xl font-semibold text-foreground mb-1">Micro Practice</h1>
      <p className="text-xs text-muted-foreground mb-5">Cycle 8 · Deliver with your team this week</p>

      {/* Practice card */}
      <div className="bg-[#F0F7F4] rounded-xl border border-[#1B4332] p-4 mb-5">
        <p className="text-[10px] font-semibold text-[#2D7D73] uppercase tracking-wider mb-1">This cycle&apos;s practice · {PRACTICE.duration}</p>
        <p className="text-lg font-bold text-foreground mb-1">{PRACTICE.name}</p>
        <p className="text-xs text-muted-foreground">Targets: {PRACTICE.target}</p>
      </div>

      {/* Why this practice */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <p className="text-sm font-semibold text-foreground mb-2">Why this practice, why now</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{PRACTICE.rationale}</p>
        <div className="bg-[#F0F7F4] rounded-lg p-3">
          <p className="text-[10px] font-semibold text-[#2D7D73] mb-1">Evidence from this facility:</p>
          <p className="text-[10px] text-muted-foreground">{PRACTICE.prior}</p>
        </div>
      </div>

      {/* How to deliver */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <p className="text-sm font-semibold text-foreground mb-1">How to deliver it</p>
        <p className="text-[10px] text-muted-foreground mb-3">When: {PRACTICE.when}</p>
        <div className="space-y-2.5">
          {PRACTICE.steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-sm font-bold text-[#2D7D73] shrink-0 mt-0.5">{i + 1}.</span>
              <p className="text-xs text-foreground leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Opening words */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <p className="text-sm font-semibold text-foreground mb-2">Opening words</p>
        <div className="bg-muted/30 rounded-lg p-3 border-l-4 border-[#2D7D73]">
          <p className="text-xs text-foreground italic leading-relaxed">&ldquo;{PRACTICE.opening}&rdquo;</p>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">This is a starting point — use your own words. The intention matters more than the script.</p>
      </div>

      {/* Mark as delivered */}
      {!delivered ? (
        <div className="bg-card rounded-xl border border-border p-4 mb-5">
          <p className="text-sm font-semibold text-foreground mb-2">Mark as delivered</p>
          <p className="text-xs text-muted-foreground mb-3">How did it go? Any notes for your self-reflection?</p>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional — what happened? What did the team say?" rows={3} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background resize-none mb-3" />
          <button onClick={() => setDelivered(true)} className="w-full py-3 bg-[#1B4332] text-white rounded-xl text-sm font-medium">✓ Mark practice as delivered</button>
        </div>
      ) : (
        <div className="bg-[#F0F7F4] rounded-xl border border-[#2D7D73] p-4 text-center mb-5">
          <p className="text-2xl mb-2">✓</p>
          <p className="text-sm font-semibold text-foreground">Practice delivered — Cycle 8</p>
          <p className="text-xs text-muted-foreground mt-1">Notes saved to your self-reflection.</p>
        </div>
      )}

      <p className="text-[10px] text-muted-foreground text-center">Evidence base: {PRACTICE.evidence}</p>
      <div className="h-16" />
    </div>
  );
}
