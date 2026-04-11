"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

const EMOTIONS = ["Curious", "Ready", "Nervous", "Unsure", "Mixed"];

export default function LeaderLoop360Arrive() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(var(--background))" }}>
      {/* Progress dots */}
      <div className="flex justify-center gap-2 py-4">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className={`w-3 h-3 rounded-full ${step === 1 ? "bg-[#1B4332]" : "bg-gray-300"}`} />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto">
        <ChrisAvatar size="large" showGlow className="mb-6" />

        <h1 className="text-2xl font-bold text-foreground text-center mb-2">Your 360 Feedback</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">Stage 1 of 5 · Arrival</p>

        {/* CHRIS message */}
        <div className="rounded-xl p-5 mb-8 w-full" style={{ background: "linear-gradient(135deg, hsl(150 25% 96%), hsl(150 25% 92%))", border: "1px solid hsl(150 20% 85%)" }}>
          <p className="text-sm text-foreground leading-relaxed font-serif-accent">
            Your 360 feedback is ready. Before you go in — this is data from people who work alongside you. It's not a verdict. It's a map. Take your time with it.
          </p>
        </div>

        {/* Emotional state */}
        <p className="text-sm font-medium text-foreground mb-3">How are you feeling about seeing your results?</p>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {EMOTIONS.map((emotion) => (
            <button
              key={emotion}
              onClick={() => setSelected(emotion)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selected === emotion
                  ? "bg-[#1B4332] text-white shadow-md scale-105"
                  : "bg-card border border-border text-foreground hover:border-foreground/20"
              }`}
            >
              {emotion}
            </button>
          ))}
        </div>

        {/* Actions */}
        {selected && (
          <div className="w-full space-y-3 animate-slideUp">
            <button
              onClick={() => router.push(`/leader-loop/profile?emotion=${selected}`)}
              className="w-full py-3.5 rounded-xl font-medium text-white bg-[#1B4332] hover:bg-[#153728] transition-colors"
            >
              Take me through it
            </button>
            <button
              onClick={() => router.push(`/leader-loop/profile?emotion=${selected}&full=true`)}
              className="w-full py-3.5 rounded-xl font-medium text-foreground border border-border hover:bg-muted transition-colors"
            >
              Read my full report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
