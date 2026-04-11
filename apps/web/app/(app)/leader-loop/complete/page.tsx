"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, Star } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

export default function LeaderLoopComplete() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "hsl(var(--background))" }}>
      {/* All 5 dots filled */}
      <div className="flex gap-1.5 mb-6">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="w-3 h-3 rounded-full bg-[#1B4332]" />
        ))}
      </div>

      {/* Success */}
      <div className="w-16 h-16 rounded-full bg-[#D4EDDD] flex items-center justify-center mb-4">
        <CheckCircle className="w-8 h-8 text-[#1B4332]" />
      </div>

      <h1 className="text-2xl font-bold text-foreground mb-2">You've done the hard part</h1>
      <p className="text-sm text-muted-foreground text-center mb-6">
        You looked at it honestly. That takes courage.
      </p>

      {/* CHRIS message */}
      <div className="w-full max-w-md rounded-xl p-4 mb-6" style={{ background: "linear-gradient(135deg, hsl(150 25% 96%), hsl(150 25% 92%))", border: "1px solid hsl(150 20% 85%)" }}>
        <div className="flex items-start gap-3">
          <ChrisAvatar size="small" showGlow className="shrink-0" />
          <p className="text-sm text-foreground leading-relaxed font-serif-accent">
            Your OBP is saved to your profile and your Micro-Practice is set as your Leader Loop focus. CHRIS will check in with you after your first Loop. Good luck — though you won't need it.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="w-full max-w-md space-y-3 mb-8">
        <div className="rounded-xl p-4 border-2 border-[hsl(var(--brand-amber))]" style={{ background: "linear-gradient(135deg, hsl(48 90% 97%), hsl(40 80% 95%))" }}>
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-[hsl(var(--brand-amber))]" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">Your One Big Practice</span>
          </div>
          <p className="text-sm font-medium text-foreground">
            Give direct feedback in the moment, not after the fact — especially when it's the hard stuff.
          </p>
        </div>

        <div className="rounded-xl p-4 border-2 border-[hsl(var(--brand-teal))]" style={{ background: "hsl(150 25% 97%)" }}>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-[hsl(var(--brand-teal))]" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">Your Fortnightly Practice</span>
          </div>
          <p className="text-sm font-medium text-foreground">
            Two-minute prep before hard conversations
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-md space-y-3">
        <button
          onClick={() => router.push("/leader-loop/profile")}
          className="w-full py-3.5 rounded-xl font-medium text-white bg-[#1B4332] hover:bg-[#153728]"
        >
          Go to my profile
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full py-3.5 rounded-xl font-medium text-foreground border border-border hover:bg-muted"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
