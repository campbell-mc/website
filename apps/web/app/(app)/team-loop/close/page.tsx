"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

const COMMITTED_ACTIONS = [
  { id: "1", title: "Prevent 'quiet resignation' after repeated disappointments", personalized: false },
  { id: "2", title: "Reset expectations with Chen family about meal service timing", personalized: true },
];

export default function LoopClosePage() {
  const router = useRouter();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [effectiveness, setEffectiveness] = useState<number | null>(null);
  const [didNotImplement, setDidNotImplement] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "hsl(var(--background))" }}>
        <div className="w-16 h-16 rounded-full bg-[#D4EDDD] flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-[#1B4332]" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Loop closed</h2>
        <p className="text-sm text-muted-foreground text-center mb-2">Thanks for closing the loop. Your feedback trains CHRIS.</p>
        <p className="text-xs text-muted-foreground text-center mb-6">127 leaders closed loops this week. 89% implemented at least one action.</p>
        <button onClick={() => router.push("/dashboard")} className="text-sm font-medium px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <ChrisAvatar size="medium" className="mx-auto mb-3" />
          <h1 className="text-xl font-bold text-foreground">Loop Close Check-In</h1>
          <p className="text-xs text-muted-foreground mt-1">30 seconds · Which action did you try?</p>
        </div>

        {/* Action selection */}
        {!didNotImplement && (
          <>
            <p className="text-sm font-medium text-foreground mb-3">Which action did you implement?</p>
            <div className="space-y-2 mb-4">
              {COMMITTED_ACTIONS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAction(a.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    selectedAction === a.id ? "border-[#1B4332] bg-[#D4EDDD]" : "border-border bg-card"
                  }`}
                >
                  <p className="text-sm text-foreground">{a.title}</p>
                  {a.personalized && <span className="text-[9px] text-[hsl(var(--brand-amber))] font-medium">Personalised for your context</span>}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Didn't implement */}
        <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input type="checkbox" checked={didNotImplement} onChange={(e) => { setDidNotImplement(e.target.checked); if (e.target.checked) setSelectedAction(null); }}
            className="w-4 h-4 rounded border-border" />
          <span className="text-xs text-muted-foreground">We didn't get to implement anything this loop</span>
        </label>

        {/* Effectiveness rating */}
        {selectedAction && (
          <div className="mb-4 animate-slideUp">
            <p className="text-sm font-medium text-foreground mb-3">How effective was it?</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setEffectiveness(n)}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                    effectiveness === n ? "text-white" : "bg-[#FAFAF8] border border-[#E0DAD4] text-foreground"
                  }`}
                  style={effectiveness === n ? { background: "#C4704A", borderColor: "#A85D3B" } : undefined}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
              <span>Not effective</span><span>Very effective</span>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={() => setSubmitted(true)}
          disabled={!selectedAction && !didNotImplement}
          className="w-full py-3.5 rounded-xl font-medium text-white disabled:opacity-40 mt-4"
          style={{ background: "#C4704A" }}
        >
          Close this loop
        </button>
      </div>
    </div>
  );
}
