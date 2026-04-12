"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

// Genos 6 competencies with sample 360 data
const COMPETENCIES = [
  {
    id: "selfAwareness", name: "Self-Awareness",
    productive: "Present", unproductive: "Disconnected",
    selfScore: 4.2, othersScore: 3.4, importance: 4.3, demonstration: 3.4,
    gap: 0.8, direction: "Self rates higher than others",
    behaviors: [
      "Understands the impact their behaviour has on others",
      "Aware of their strengths and limitations",
      "Seeks feedback from others about their behaviour",
      "Responds to feedback in a positive manner",
      "Behaves consistently with what they say",
      "Behaves in a manner they expect of others",
      "Demonstrates awareness of their mood and its impact",
    ],
  },
  {
    id: "awarenessOfOthers", name: "Awareness of Others",
    productive: "Empathetic", unproductive: "Insensitive",
    selfScore: 4.0, othersScore: 3.8, importance: 4.5, demonstration: 3.8,
    gap: 0.2, direction: "Close alignment",
    behaviors: [
      "Makes others feel valued and appreciated",
      "Adjusts their communication style to suit others",
      "Notices when someone is not coping or needs support",
      "Takes the perspective of others into account",
      "Acknowledges the views of others",
      "Anticipates how others will react",
      "Balances results with others' needs",
    ],
  },
  {
    id: "authenticity", name: "Authenticity",
    productive: "Genuine", unproductive: "Untrustworthy",
    selfScore: 3.8, othersScore: 3.2, importance: 4.4, demonstration: 3.2,
    gap: 0.6, direction: "Self rates higher than others",
    behaviors: [
      "Openly expresses their thoughts and feelings",
      "Expresses themselves with sensitivity",
      "Facilitates robust discussion and debate",
      "Is honest about their own mistakes",
      "Honours commitments they make",
      "Encourages others to speak honestly",
      "Responds effectively when challenged",
    ],
  },
  {
    id: "emotionalReasoning", name: "Emotional Reasoning",
    productive: "Expansive", unproductive: "Limited",
    selfScore: 3.5, othersScore: 3.6, importance: 4.1, demonstration: 3.6,
    gap: -0.1, direction: "Others rate slightly higher",
    behaviors: [
      "Consults others before making decisions",
      "Explains the rationale behind their decisions",
      "Involves others in decisions that affect them",
      "Takes multiple perspectives into account",
      "Considers the bigger picture when deciding",
      "Reflects on feelings when making decisions",
      "Makes ethical decisions consistently",
    ],
  },
  {
    id: "selfManagement", name: "Self-Management",
    productive: "Resilient", unproductive: "Temperamental",
    selfScore: 3.3, othersScore: 3.0, importance: 4.6, demonstration: 3.0,
    gap: 0.3, direction: "Largest importance-demonstration gap",
    behaviors: [
      "Manages emotions in difficult situations",
      "Maintains a positive demeanour",
      "Manages their time effectively",
      "Learns from their mistakes",
      "Stays aware of industry changes",
      "Strives to continuously improve",
      "Adapts quickly to new circumstances",
    ],
  },
  {
    id: "inspiringPerformance", name: "Inspiring Performance",
    productive: "Empowering", unproductive: "Demoralising",
    selfScore: 3.6, othersScore: 3.1, importance: 4.7, demonstration: 3.1,
    gap: 0.5, direction: "Highest importance, largest gap",
    behaviors: [
      "Provides useful support and guidance",
      "Gives constructive feedback",
      "Helps others understand their purpose",
      "Notices and responds to inappropriate behaviour",
      "Maintains a positive work environment",
      "Facilitates career development",
      "Recognises hard work and effort",
    ],
  },
];

function LeaderLoop360ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emotion = searchParams.get("emotion") ?? "Curious";
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, "results" | "learn" | "develop">>({});

  const getTab = (id: string) => activeTab[id] ?? "results";

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push("/leader-loop/arrive")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-sm font-semibold text-foreground">360 Profile · Stage 2 of 5</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className={`w-2.5 h-2.5 rounded-full ${s <= 2 ? "bg-[#1B4332]" : "bg-gray-300"}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Rater group selector */}
        <div className="flex gap-1 bg-muted rounded-lg p-1 mb-6">
          {["All Raters", "Manager", "Peers", "Direct Reports", "Self"].map((group) => (
            <button key={group} className="flex-1 text-[10px] font-medium py-2 rounded-md bg-card text-foreground shadow-sm">
              {group}
            </button>
          ))}
        </div>

        {/* Competency cards */}
        {COMPETENCIES.map((comp) => {
          const isExpanded = expanded === comp.id;
          const tab = getTab(comp.id);
          const gapColor = comp.importance - comp.demonstration > 0.5 ? "text-[hsl(var(--brand-terracotta))]" : "text-[hsl(var(--brand-amber))]";

          return (
            <div key={comp.id} className="bg-card rounded-xl border border-border mb-3 overflow-hidden">
              {/* Header */}
              <button onClick={() => setExpanded(isExpanded ? null : comp.id)} className="w-full p-4 text-left">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{comp.name}</p>
                    <p className="text-[10px] text-muted-foreground">{comp.productive} ↔ {comp.unproductive}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">I–D Gap</p>
                      <p className={`text-sm font-bold ${gapColor}`}>{(comp.importance - comp.demonstration).toFixed(1)}</p>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
                {/* Score bars */}
                <div className="flex gap-4 mt-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] text-muted-foreground">Importance</span>
                      <span className="text-[10px] font-medium">{comp.importance.toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-[hsl(var(--brand-forest))]" style={{ width: `${(comp.importance / 5) * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] text-muted-foreground">Demonstration</span>
                      <span className="text-[10px] font-medium">{comp.demonstration.toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-[hsl(var(--brand-amber))]" style={{ width: `${(comp.demonstration / 5) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-border animate-slideUp">
                  {/* Tabs */}
                  <div className="flex border-b border-border">
                    {(["results", "learn", "develop"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setActiveTab((prev) => ({ ...prev, [comp.id]: t }))}
                        className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                          tab === t ? "text-foreground border-b-2 border-[hsl(var(--brand-teal))]" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t === "results" ? "Results" : t === "learn" ? "Learn" : "Develop"}
                      </button>
                    ))}
                  </div>

                  <div className="p-4">
                    {tab === "results" && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-3">{comp.direction}</p>
                        <div className="flex gap-3 mb-3">
                          <div className="flex-1 bg-muted/50 rounded-lg p-3 text-center">
                            <p className="text-lg font-bold text-foreground">{comp.selfScore.toFixed(1)}</p>
                            <p className="text-[9px] text-muted-foreground">Self</p>
                          </div>
                          <div className="flex-1 bg-muted/50 rounded-lg p-3 text-center">
                            <p className="text-lg font-bold text-foreground">{comp.othersScore.toFixed(1)}</p>
                            <p className="text-[9px] text-muted-foreground">All Others</p>
                          </div>
                        </div>
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">7 Behaviours</p>
                        {comp.behaviors.map((b, i) => (
                          <p key={i} className="text-xs text-muted-foreground py-1 border-b border-border last:border-b-0">
                            {i + 1}. {b}
                          </p>
                        ))}
                      </div>
                    )}

                    {tab === "learn" && (
                      <div>
                        <div className="rounded-lg p-3 mb-3" style={{ background: "hsl(150 25% 96%)" }}>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Understanding</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {comp.name} in aged care means being aware of how your state — your mood, your energy, your stress — transmits directly to the team before you say a word. Leaders set the emotional climate at shift start.
                          </p>
                        </div>
                        <div className="rounded-lg p-3" style={{ background: "hsl(48 90% 96%)" }}>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Common Pitfalls</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            The most common pitfall: assuming your team can't read your state. They can — within 30 seconds of you arriving on the floor. The gap between what you think you're projecting and what they're receiving is the development edge.
                          </p>
                        </div>
                      </div>
                    )}

                    {tab === "develop" && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-3">Select a behaviour to add to your development plan:</p>
                        {comp.behaviors.map((b, i) => (
                          <button key={i} className="w-full text-left text-xs p-3 rounded-lg border border-border mb-2 hover:border-[hsl(var(--brand-teal))] hover:bg-muted/50 transition-colors">
                            {b}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Continue */}
        <button
          onClick={() => router.push("/leader-loop/insights")}
          className="w-full py-3.5 rounded-xl font-medium text-white bg-[#1B4332] hover:bg-[#153728] mt-4 mb-16"
        >
          Continue to Insights →
        </button>
      </div>
    </div>
  );
}

export default function LeaderLoop360Profile() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-muted-foreground">Loading...</div>}>
      <LeaderLoop360ProfileContent />
    </Suspense>
  );
}
