"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Star } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

const DEV_ITEMS = [
  { id: "1", competency: "Inspiring Performance", behavior: "Gives constructive feedback", personalized: "Give direct feedback in the moment, not after the fact — especially when it's the hard stuff." },
  { id: "2", competency: "Self-Management", behavior: "Manages emotions in difficult situations", personalized: "Notice when stress is driving your decisions and pause — even 10 seconds changes the outcome." },
  { id: "3", competency: "Authenticity", behavior: "Is honest about their own mistakes", personalized: "When you get it wrong, say so openly. Your team already knows — the honesty is what builds trust." },
];

const CHRIS_RESPONSES = [
  "Strong choice. Focusing on this will create visible change for your team. This becomes your pulse question fortnightly.",
  "This is the one. It sits at the intersection of what matters most and where you have the most room to grow.",
  "Good instinct. Of all the behaviours you identified, this one has the highest potential for impact.",
];

export default function OBPSelectionPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const selectedItem = DEV_ITEMS.find((d) => d.id === selected);

  if (confirmed && selectedItem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "hsl(var(--background))" }}>
        <div className="flex gap-1.5 mb-6">{[1,2,3,4,5].map((s) => <div key={s} className={`w-3 h-3 rounded-full ${s <= 4 ? "bg-[#1B4332]" : "bg-gray-300"}`} />)}</div>

        {/* Confirmed OBP card */}
        <div className="w-full max-w-md rounded-xl p-5 text-white mb-6" style={{ background: "linear-gradient(135deg, #1B4332, #153728)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Your One Big Practice</span>
          </div>
          <p className="text-base font-medium leading-relaxed">{selectedItem.personalized}</p>
          <p className="text-[10px] opacity-60 mt-2">{selectedItem.competency}</p>
        </div>

        {/* CHRIS affirmation */}
        <div className="w-full max-w-md rounded-xl p-4 mb-6" style={{ background: "linear-gradient(135deg, hsl(150 25% 96%), hsl(150 25% 92%))", border: "1px solid hsl(150 20% 85%)" }}>
          <div className="flex items-start gap-3">
            <ChrisAvatar size="small" showGlow className="shrink-0" />
            <p className="text-sm text-foreground leading-relaxed font-serif-accent">
              {CHRIS_RESPONSES[Math.floor(Math.random() * CHRIS_RESPONSES.length)]}
            </p>
          </div>
        </div>

        <button onClick={() => router.push("/leader-loop/complete")} className="w-full max-w-md py-3.5 rounded-xl font-medium text-white bg-[#1B4332] hover:bg-[#153728]">
          Continue to Practice →
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-muted-foreground"><ChevronLeft className="w-4 h-4" /> Back</button>
          <span className="text-sm font-semibold text-foreground">OBP Selection · Stage 4 of 5</span>
          <div className="flex gap-1.5">{[1,2,3,4,5].map((s) => <div key={s} className={`w-2.5 h-2.5 rounded-full ${s <= 4 ? "bg-[#1B4332]" : "bg-gray-300"}`} />)}</div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="rounded-xl p-4 mb-6" style={{ background: "linear-gradient(135deg, hsl(150 25% 96%), hsl(150 25% 92%))", border: "1px solid hsl(150 20% 85%)" }}>
          <div className="flex items-start gap-3">
            <ChrisAvatar size="small" className="shrink-0" />
            <p className="text-sm text-foreground leading-relaxed font-serif-accent">
              You've built a solid development plan across {DEV_ITEMS.length} competencies. Now it's time to choose <strong>one</strong> — the behaviour that, if you got it right consistently, would have the biggest ripple effect on your team. This becomes your One Big Practice.
            </p>
          </div>
        </div>

        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-3">Select your OBP</p>
        <div className="space-y-3 mb-6">
          {DEV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`w-full text-left rounded-xl p-4 border transition-all ${
                selected === item.id
                  ? "border-[hsl(var(--brand-amber))] shadow-warm" + " bg-gradient-to-r from-amber-50 to-orange-50"
                  : "border-border bg-card hover:border-muted-foreground/20"
              }`}
            >
              <p className="text-xs text-muted-foreground mb-1">{item.competency}</p>
              <p className="text-sm font-medium text-foreground">{item.personalized}</p>
            </button>
          ))}
        </div>

        {selected && (
          <div className="animate-slideUp">
            <div className="bg-card rounded-xl p-4 border border-border mb-4">
              <p className="text-xs font-medium text-foreground mb-2">What happens when you confirm:</p>
              <ol className="text-xs text-muted-foreground space-y-1.5">
                <li>1. This becomes your fortnightly pulse question from direct reports</li>
                <li>2. CHRIS will assign a micro-practice to support it</li>
                <li>3. Your progress is tracked over cycles</li>
                <li>4. It anchors your Leader Loop conversations</li>
              </ol>
            </div>
            <button onClick={() => setConfirmed(true)} className="w-full py-3.5 rounded-xl font-medium text-white bg-[#1B4332] hover:bg-[#153728]">
              Confirm — this is my OBP
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
