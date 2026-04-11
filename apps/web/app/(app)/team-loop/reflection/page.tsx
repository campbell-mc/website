"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

const FREQUENCY_OPTIONS = [
  { value: "yes-often", label: "Yes — often" },
  { value: "yes-occasionally", label: "Yes — occasionally" },
  { value: "not-really", label: "Not really" },
  { value: "hard-to-tell", label: "Hard to tell" },
];

export default function TeamLoopReflection() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [frequency, setFrequency] = useState("");
  const [difference, setDifference] = useState("");
  const [challenges, setChallenges] = useState("");

  function handleSubmit() {
    // TODO: POST to API
    router.push("/team-loop/close");
  }

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <div className="max-w-md mx-auto px-4 py-6">
        <button onClick={() => router.push("/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center mb-6">
          <ChrisAvatar size="medium" className="mx-auto mb-3" />
          <h1 className="text-xl font-bold text-foreground">Loop Reflection</h1>
          <p className="text-xs text-muted-foreground mt-1">Loop 1 · Dec 23 – Jan 6</p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-2 rounded-full transition-all ${s === step ? "w-8 bg-[#1B4332]" : s < step ? "w-8 bg-[#1B4332]" : "w-2 bg-gray-300"}`} />
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="animate-slideUp">
            <div className="rounded-xl p-4 mb-4" style={{ background: "linear-gradient(135deg, hsl(150 25% 96%), hsl(150 25% 92%))" }}>
              <p className="text-xs text-muted-foreground leading-relaxed font-serif-accent">
                The team committed to 'Protect breaks when under pressure' this fortnight. Did you see it happen?
              </p>
            </div>
            <p className="text-sm font-medium text-foreground mb-3">Did you notice the team actions being implemented?</p>
            <div className="space-y-2">
              {FREQUENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFrequency(opt.value)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    frequency === opt.value ? "border-[#1B4332] bg-[#D4EDDD]" : "border-border bg-card hover:border-muted-foreground/20"
                  }`}
                >
                  <span className="text-sm text-foreground">{opt.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} disabled={!frequency} className="w-full py-3.5 rounded-xl font-medium text-white bg-[#1B4332] disabled:opacity-40 mt-4">
              Continue
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="animate-slideUp">
            <div className="rounded-xl p-4 mb-4" style={{ background: "linear-gradient(135deg, hsl(150 25% 96%), hsl(150 25% 92%))" }}>
              <p className="text-xs text-muted-foreground leading-relaxed font-serif-accent">
                Even small changes matter. What you noticed — even if it was subtle — helps CHRIS understand what works.
              </p>
            </div>
            <p className="text-sm font-medium text-foreground mb-3">What difference did it make?</p>
            <textarea
              value={difference}
              onChange={(e) => setDifference(e.target.value)}
              placeholder="Even a small observation helps..."
              className="w-full p-4 border border-border rounded-xl text-sm bg-background resize-none min-h-[120px]"
            />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl font-medium text-foreground border border-border hover:bg-muted">Previous</button>
              <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-xl font-medium text-white bg-[#1B4332]">Continue</button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="animate-slideUp">
            <div className="rounded-xl p-4 mb-4" style={{ background: "linear-gradient(135deg, hsl(150 25% 96%), hsl(150 25% 92%))" }}>
              <p className="text-xs text-muted-foreground leading-relaxed font-serif-accent">
                Understanding what got in the way helps CHRIS recommend better next time. There's no wrong answer here.
              </p>
            </div>
            <p className="text-sm font-medium text-foreground mb-3">What made it harder than expected?</p>
            <textarea
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="Staffing, timing, buy-in, competing priorities..."
              className="w-full p-4 border border-border rounded-xl text-sm bg-background resize-none min-h-[120px]"
            />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl font-medium text-foreground border border-border hover:bg-muted">Previous</button>
              <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl font-medium text-white" style={{ background: "#C4704A" }}>Submit Reflection</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
