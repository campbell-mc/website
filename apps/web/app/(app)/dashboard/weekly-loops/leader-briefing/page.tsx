"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

export default function LeaderBriefingPage() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const results = {
    sent_to: 4, responses: 3, response_rate: 0.75,
    practice_visibility: { yes: 2, somewhat: 1, no: 0 },
    support_rating: { avg: 4.0, prior: 3.7 },
    words: ["supportive", "present", "calm"],
    has_results: true,
  };

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-2xl mx-auto">
      <button onClick={() => router.push("/dashboard/weekly-loops")} className="flex items-center gap-1 text-sm text-muted-foreground mb-4"><ChevronLeft className="w-4 h-4" /> Weekly Loops</button>
      <h1 className="text-[22px] md:text-xl font-semibold text-foreground mb-1">Leader Briefing</h1>
      <p className="text-xs text-muted-foreground mb-5">Cycle 8 · Week 2 · Your private development space</p>

      {/* Privacy */}
      <div className="bg-[#F0F7F4] rounded-xl border border-[#2D7D73] p-3 mb-5">
        <p className="text-[10px] font-semibold text-[#1B4332] mb-0.5">This is your space</p>
        <p className="text-[10px] text-muted-foreground leading-relaxed">Your Leader Briefing and Loop results are private to you. Your manager sees you completed your Loop but cannot see what people said.</p>
      </div>

      {/* CHRIS coaching narrative */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <div className="flex items-start gap-3">
          <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">CHRIS — your leader briefing</p>
            <p className="text-sm text-muted-foreground leading-relaxed font-serif-accent">
              The recognition practice landed well last fortnight — three people mentioned feeling seen in their pulse responses, and PSH_15 (Lack of Recognition) dropped in your team. That&apos;s real. The one thing worth reflecting on: Grevillea Wing&apos;s voice scores on &ldquo;feeling listened to&rdquo; have declined for three consecutive fortnights. You&apos;re not responsible for that team — but as a peer leader you might notice something the data doesn&apos;t show.
            </p>
            {!expanded && <button onClick={() => setExpanded(true)} className="text-xs text-[hsl(var(--brand-teal))] font-medium mt-2">Read more →</button>}
            {expanded && (
              <>
                <p className="text-sm text-muted-foreground leading-relaxed font-serif-accent mt-3">
                  Your coaching focus this week connects to the Genos EI framework — specifically emotional self-awareness. Before your next team huddle, take 60 seconds to check in with yourself: what are you carrying into the room? Your team reads your state before they hear your words.
                </p>
                <button onClick={() => setExpanded(false)} className="text-xs text-[hsl(var(--brand-teal))] font-medium mt-2">Show less</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Loop results */}
      {results.has_results ? (
        <div className="bg-card rounded-xl border border-border p-4 mb-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-foreground">Your Leader Loop results</p>
            <span className="text-xs text-muted-foreground">{results.responses}/{results.sent_to} responded</span>
          </div>

          {/* Practice visibility */}
          <div className="mb-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Did people notice your practice?</p>
            {[
              { label: "Yes, definitely", count: results.practice_visibility.yes, color: "#2D7D73" },
              { label: "Somewhat", count: results.practice_visibility.somewhat, color: "#D4A017" },
              { label: "Not really", count: results.practice_visibility.no, color: "#C4704A" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 py-1">
                <span className="text-xs text-muted-foreground w-24 shrink-0">{item.label}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-2 rounded-full" style={{ width: `${results.responses > 0 ? (item.count / results.responses) * 100 : 0}%`, backgroundColor: item.color }} />
                </div>
                <span className="text-xs font-bold text-foreground w-4">{item.count}</span>
              </div>
            ))}
          </div>

          {/* Support rating */}
          <div className="mb-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">How supported did people feel?</p>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-[#2D7D73]">{results.support_rating.avg.toFixed(1)}</span>
              <div className="mb-1">
                <span className="text-sm text-muted-foreground">/5</span>
                <p className="text-xs text-[#2D7D73]">↑ from {results.support_rating.prior.toFixed(1)}</p>
              </div>
            </div>
            <div className="mt-2 h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-3 rounded-full bg-[#2D7D73]" style={{ width: `${(results.support_rating.avg / 5) * 100}%` }} />
            </div>
          </div>

          {/* Words */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">One word themes</p>
            <div className="flex gap-2 flex-wrap">
              {results.words.map((w, i) => (
                <span key={w} className={`px-3 py-1.5 rounded-full text-sm font-medium ${i === 0 ? "bg-[#1B4332] text-white" : i === 1 ? "bg-[#2D7D73] text-white text-xs" : "bg-[#6BAF92] text-white text-xs"}`}>{w}</span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border p-4 mb-5">
          <p className="text-sm font-semibold text-foreground mb-2">Leader Loop results</p>
          <p className="text-xs text-muted-foreground mb-3">You haven&apos;t sent your Leader Loop yet this cycle.</p>
          <button onClick={() => router.push("/dashboard/weekly-loops/leader-pulse")} className="w-full py-3 bg-[#1B4332] text-white rounded-xl text-sm font-medium">Send my Leader Loop →</button>
        </div>
      )}

      {/* Self-reflection link */}
      <button onClick={() => router.push("/dashboard/weekly-loops/self-reflection")} className="w-full py-3 border border-[#1B4332] text-[#1B4332] rounded-xl text-sm font-medium mb-5">
        Go to self-reflection module →
      </button>

      <p className="text-[10px] text-muted-foreground text-center">CHRIS will send your self-reflection prompt via iMessage at the end of this week.</p>

      <div className="h-16" />
    </div>
  );
}
