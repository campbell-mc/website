"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown, ChevronUp, Sparkles, Mic, CheckCircle } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

const PULSE_DATA = [
  { question: "I feel heard when I raise concerns or ideas.", score: 2.3, signal: true },
  { question: "Issues I report usually lead to improvement.", score: 2.1, signal: true },
  { question: "I trust leadership to follow through on commitments.", score: 2.6, signal: true },
  { question: "I feel supported after difficult or emotional events.", score: 2.8, signal: false },
];

const PRACTICES = [
  {
    id: "MA_001", title: "Prevent 'quiet resignation' after repeated disappointments",
    tagline: "Close the loop on what was raised — even when the answer is 'not yet'.",
    whatToTry: "This fortnight, pick one outstanding issue your team has raised before. Bring it back to them with a status: fixed, in progress, or can't fix (and why). The act of returning to an issue — even without a solution — breaks the 'nothing ever changes' cycle.",
    whyThisHelps: "When people stop raising things, it's not because problems went away. It's because they decided raising them doesn't help. One closed loop — even a 'no' — rebuilds the signal that voice matters.",
    whatItLooksLike: '"I know some of you raised the medication trolley issue a while back. I want to come back to it. We can\'t replace it this quarter, but I\'ve flagged it for budget review. In the meantime, here\'s what we\'re doing..."',
  },
  {
    id: "MA_002", title: "Run a 'two-minute prep' before hard conversations",
    tagline: "What you think through beforehand determines whether it lands.",
    whatToTry: "Before any conversation you're dreading: write down the one thing you need them to hear, the one thing you need to understand from them, and the opening line you'll use. Two minutes. That's it.",
    whyThisHelps: "Most difficult conversations fail not because of what's said, but because neither person knew what they actually needed from it. Two minutes of prep turns a confrontation into a conversation.",
    whatItLooksLike: '"Before my next roster conversation: I need them to hear that the pattern is unsustainable. I need to understand what\'s driving the swaps. Opening: \'I want to talk about the last few weeks — not to blame, but to understand what\'s going on.\'"',
  },
  {
    id: "MA_003", title: "Create a 'micro-ritual' for cumulative grief",
    tagline: "Name repeated loss so it doesn't quietly become burnout.",
    whatToTry: "After a resident death — particularly when it's the second or third in a short period — take 60 seconds with the team before the shift continues. Not a debrief. Just a pause. Name the person. Acknowledge the loss. Then carry on.",
    whyThisHelps: "Cumulative grief in aged care is the number one driver of emotional exhaustion. Not because of any single death, but because there's never a pause between them. A micro-ritual doesn't fix grief — it prevents it from going underground.",
    whatItLooksLike: '"Before we move on — Mrs Chen passed this morning. She was here for four years. Some of you knew her well. Take a moment if you need it. We keep going, but we don\'t pretend it didn\'t happen."',
  },
];

export default function TeamBriefingPage() {
  const router = useRouter();
  const [expandedPractice, setExpandedPractice] = useState<string | null>(null);
  const [selectedPractice, setSelectedPractice] = useState<string | null>(null);
  const [showStory, setShowStory] = useState(true);
  const [showPulse, setShowPulse] = useState(false);
  const [committed, setCommitted] = useState(false);

  if (committed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "hsl(var(--background))" }}>
        <div className="w-16 h-16 rounded-full bg-[#D4EDDD] flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-[#1B4332]" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Practice committed</h2>
        <p className="text-sm text-muted-foreground text-center mb-2">
          CHRIS will measure the outcome next cycle.
        </p>
        <p className="text-xs text-muted-foreground text-center mb-6">
          127 leaders closed their loops this week. 89% implemented at least one action.
        </p>
        <button onClick={() => router.push("/dashboard")} className="text-sm font-medium px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90">
          ← Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      {/* Full-screen document — no sidebar, no bottom nav */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push("/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-4 h-4" /> Home
          </button>
          <span className="text-sm font-semibold text-foreground">Team Briefing · Cycle 8</span>
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <Mic className="w-3.5 h-3.5" /> CHRIS
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* CHRIS Insight */}
        <div className="rounded-xl p-4 mb-6" style={{ background: "linear-gradient(135deg, hsl(150 25% 96%), hsl(150 25% 92%))" }}>
          <div className="flex items-start gap-3">
            <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">CHRIS Insight</p>
              <p className="text-sm text-muted-foreground leading-relaxed font-serif-accent">
                Your team's trust is under strain — staff are pulling back. The pulse shows a pattern: concerns are being raised but not returned to. That silence isn't peace. It's withdrawal.
              </p>
            </div>
          </div>
        </div>

        {/* Pulse Results */}
        <button onClick={() => setShowPulse(!showPulse)} className="flex items-center justify-between w-full mb-3">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">Pulse Results</span>
          {showPulse ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {showPulse && (
          <div className="bg-card rounded-xl border border-border overflow-hidden mb-6">
            {PULSE_DATA.map((q, i) => (
              <div key={i} className={`flex items-center justify-between px-4 py-3 ${i < PULSE_DATA.length - 1 ? "border-b border-border" : ""}`}>
                <p className="text-xs text-foreground flex-1 mr-3">{q.question}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-sm font-bold ${q.score < 3 ? "text-[hsl(var(--brand-terracotta))]" : "text-[hsl(var(--brand-teal))]"}`}>
                    {q.score.toFixed(1)}
                  </span>
                  {q.signal && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.12)] text-[hsl(var(--brand-amber))]">⚠ Watch</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Story Behind the Data */}
        <button onClick={() => setShowStory(!showStory)} className="flex items-center justify-between w-full mb-3">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">The Story Behind the Data</span>
          {showStory ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {showStory && (
          <div className="bg-card rounded-xl p-4 border border-border mb-6">
            <p className="text-sm text-muted-foreground leading-relaxed mb-3 font-serif-accent">
              This fortnight's pulse tells a clear story: your team is disengaging from upward communication. Three of four questions scored below 3.0, with "Issues I report usually lead to improvement" at 2.1 — the lowest score this team has recorded.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3 font-serif-accent">
              Cross-referencing with operational data: this team had 777 sick leave hours this period — 55% above the 500-hour target. Two roster gaps in the last week coincided with the lowest pulse scores.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed font-serif-accent">
              The data suggests this isn't about morale alone. Staff are carrying unresolved concerns alongside genuine operational strain. The risk is that the team moves from "raising issues that aren't addressed" to "not raising issues at all."
            </p>
          </div>
        )}

        {/* Micro-Practices */}
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-3 block">Micro-Practices — choose one</span>
        <div className="space-y-3 mb-6">
          {PRACTICES.map((p) => {
            const isExpanded = expandedPractice === p.id;
            const isSelected = selectedPractice === p.id;

            return (
              <div key={p.id} className={`bg-card rounded-xl border transition-all ${isSelected ? "border-[hsl(var(--brand-amber))] shadow-warm" : "border-border"}`}>
                <button onClick={() => setExpandedPractice(isExpanded ? null : p.id)} className="w-full p-4 text-left">
                  <p className="text-sm font-semibold text-foreground mb-1">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.tagline}</p>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border pt-3 animate-slideUp">
                    <div className="mb-3">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">What to try</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{p.whatToTry}</p>
                    </div>
                    <div className="mb-3">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Why this helps</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{p.whyThisHelps}</p>
                    </div>
                    <div className="rounded-lg p-3 mb-3" style={{ background: "hsl(150 25% 96%)" }}>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">What it might look like</p>
                      <p className="text-xs text-muted-foreground leading-relaxed italic">"{p.whatItLooksLike}"</p>
                    </div>
                    <button
                      onClick={() => setSelectedPractice(isSelected ? null : p.id)}
                      className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isSelected ? "bg-[hsl(var(--brand-amber))] text-white" : "bg-primary text-primary-foreground hover:opacity-90"
                      }`}
                    >
                      {isSelected ? "✓ Selected — use as inspiration" : "Use as inspiration"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Commit */}
        {selectedPractice && (
          <div className="sticky bottom-0 bg-card border-t border-border px-4 py-4 -mx-4">
            <button
              onClick={() => setCommitted(true)}
              className="w-full py-3.5 rounded-xl font-medium text-white"
              style={{ background: "#C4704A" }}
            >
              Commit to this practice →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
