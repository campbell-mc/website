"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const BRIEFINGS = [
  { team: "Wattle Wing", leader: "Anika Patel", score: 2.6, change: -0.2, participation: 88, delivered: true, status: "good" },
  { team: "Grevillea Wing", leader: "Marcus Chen", score: 3.4, change: 0.1, participation: 79, delivered: false, status: "concern" },
  { team: "Wing A", leader: "Sandra Obi", score: 2.4, change: -0.1, participation: 91, delivered: true, status: "good" },
  { team: "Wing B", leader: "James Park", score: 2.9, change: 0.1, participation: 82, delivered: true, status: "watch" },
  { team: "Night Team", leader: "Priya Nair", score: 3.1, change: 0.2, participation: 76, delivered: false, status: "watch" },
];

const STATUS_DOT: Record<string, string> = { good: "bg-[#2D7D73]", concern: "bg-[#C4704A]", watch: "bg-[#D4A017]" };

export default function TeamBriefingsPage() {
  const router = useRouter();
  const deliveredCount = BRIEFINGS.filter((b) => b.delivered).length;

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-3xl mx-auto">
      <button onClick={() => router.push("/dashboard/weekly-loops")} className="flex items-center gap-1 text-sm text-muted-foreground mb-4"><ChevronLeft className="w-4 h-4" /> Weekly Loops</button>

      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[22px] md:text-xl font-semibold text-foreground">Team Briefings</h1>
          <p className="text-xs text-muted-foreground">Cycle 8 · 5 teams · {deliveredCount}/5 practices delivered</p>
        </div>
        <button onClick={() => router.push("/dashboard/weekly-loops/leadership-session")} className="text-xs font-medium px-4 py-2.5 rounded-xl bg-[#1B4332] text-white">Prepare session →</button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-2.5 bg-muted/30 border-b border-border">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Cycle 8 — all teams</p>
        </div>
        {BRIEFINGS.map((b) => (
          <button key={b.team} onClick={() => router.push("/team-loop/briefing")} className="w-full flex items-center gap-4 px-4 py-3.5 border-b border-border last:border-b-0 hover:bg-muted/20 text-left">
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${STATUS_DOT[b.status]}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">{b.team}</p>
                <p className="text-xs text-muted-foreground">{b.leader}</p>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-muted-foreground">{b.participation}% participation</span>
                {!b.delivered && <span className="text-xs text-[#D4A017]">Practice not yet delivered</span>}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-lg font-bold ${b.score >= 3.5 ? "text-[#C4704A]" : b.score >= 3.0 ? "text-[#D4A017]" : "text-[#2D7D73]"}`}>{b.score.toFixed(1)}</p>
              <p className={`text-xs ${b.change < 0 ? "text-[#2D7D73]" : b.change > 0 ? "text-[#C4704A]" : "text-muted-foreground"}`}>{b.change > 0 ? "+" : ""}{b.change.toFixed(1)}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="h-16" />
    </div>
  );
}
