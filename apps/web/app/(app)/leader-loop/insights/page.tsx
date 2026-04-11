"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Sparkles } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

export default function LeaderLoopInsights() {
  const router = useRouter();
  const [reflection, setReflection] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-muted-foreground"><ChevronLeft className="w-4 h-4" /> Back</button>
          <span className="text-sm font-semibold text-foreground">Insights · Stage 3 of 5</span>
          <div className="flex gap-1.5">{[1,2,3,4,5].map((s) => <div key={s} className={`w-2.5 h-2.5 rounded-full ${s <= 3 ? "bg-[#1B4332]" : "bg-gray-300"}`} />)}</div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* CHRIS Pattern */}
        <div className="rounded-xl p-5 mb-6" style={{ background: "linear-gradient(135deg, hsl(150 25% 96%), hsl(150 25% 92%))", border: "1px solid hsl(150 20% 85%)" }}>
          <div className="flex items-start gap-3">
            <ChrisAvatar size="small" showGlow className="shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">The Pattern</p>
              <p className="text-sm text-foreground leading-relaxed font-serif-accent mb-3">
                Your feedback reveals a leader who cares deeply about the team but pulls back under pressure — defaulting to control rather than collaboration. Your direct reports see capability and intention. They also see the moments when stress overrides those instincts.
              </p>
              <p className="text-sm text-foreground leading-relaxed font-serif-accent">
                The development edge isn't about learning new skills. It's about staying in your productive state when the pressure rises — being Present instead of Disconnected, Genuine instead of guarded.
              </p>
            </div>
          </div>
        </div>

        {/* Self-Other Gap */}
        <div className="bg-card rounded-xl p-4 border border-border mb-4">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-3">The Gap Worth Knowing</p>
          <p className="text-xs text-muted-foreground mb-3">Where your self-view differs from how others experience you:</p>
          <div className="space-y-3">
            {[
              { comp: "Self-Awareness", self: 4.2, others: 3.4 },
              { comp: "Authenticity", self: 3.8, others: 3.2 },
              { comp: "Inspiring Performance", self: 3.6, others: 3.1 },
            ].map((g) => (
              <div key={g.comp}>
                <p className="text-xs font-medium text-foreground mb-1">{g.comp}</p>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5"><span>Self: {g.self}</span><span>Others: {g.others}</span></div>
                    <div className="relative h-2 bg-muted rounded-full">
                      <div className="absolute h-2 rounded-full bg-[hsl(var(--brand-forest))]" style={{ width: `${(g.self / 5) * 100}%`, opacity: 0.4 }} />
                      <div className="absolute h-2 rounded-full bg-[hsl(var(--brand-amber))]" style={{ width: `${(g.others / 5) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[hsl(var(--brand-terracotta))] w-8 text-right">+{(g.self - g.others).toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Development Priorities */}
        <div className="bg-card rounded-xl p-4 border border-border mb-4">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-3">Your Development Priority</p>
          {[
            { comp: "Inspiring Performance", gap: 1.6, text: "Highest importance (4.7) with largest demonstration gap. Your team needs more from you here." },
            { comp: "Self-Management", gap: 1.6, text: "Second priority. Resilience under pressure is the foundation for everything else." },
          ].map((p, i) => (
            <div key={p.comp} className={`p-3 rounded-lg mb-2 ${i === 0 ? "card-amber" : "card-forest"}`}>
              <p className="text-xs font-semibold text-foreground">{p.comp} · Gap: {p.gap}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{p.text}</p>
            </div>
          ))}
        </div>

        {/* Reflection */}
        <div className="rounded-xl p-4 mb-6" style={{ background: "linear-gradient(135deg, hsl(150 25% 96%), hsl(150 25% 92%))", border: "1px solid hsl(150 20% 85%)" }}>
          <div className="flex items-start gap-3">
            <ChrisAvatar size="small" className="shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-foreground mb-2">Of everything you've seen so far — what's the one thing you want to understand better?</p>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Take your time..."
                className="w-full p-3 border border-border rounded-lg text-sm bg-background resize-none min-h-[80px]"
              />
              {!submitted ? (
                <button
                  onClick={() => setSubmitted(true)}
                  disabled={!reflection.trim()}
                  className="mt-2 text-xs font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-40"
                >
                  Share with CHRIS
                </button>
              ) : (
                <div className="mt-3 p-3 rounded-lg bg-card border border-border animate-slideUp">
                  <p className="text-xs text-muted-foreground leading-relaxed font-serif-accent">
                    That discomfort is valuable — it's pointing you toward something worth understanding better. The gap between intention and impact is where the real development happens. Let's explore this in your development plan.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <button onClick={() => router.push("/leader-loop/obp")} className="w-full py-3.5 rounded-xl font-medium text-white bg-[#1B4332] hover:bg-[#153728] mb-16">
          Continue to OBP Selection →
        </button>
      </div>
    </div>
  );
}
