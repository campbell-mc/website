"use client";

import { useRouter } from "next/navigation";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

function ProgressItem({ label, done, route, cta }: { label: string; done: boolean; route: string; cta?: string }) {
  const router = useRouter();
  return (
    <button onClick={() => router.push(route)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 text-left">
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${done ? "bg-[#2D7D73] border-[#2D7D73]" : "border-muted-foreground/30"}`}>
        {done && <span className="text-white text-[10px]">✓</span>}
      </div>
      <span className={`flex-1 text-sm ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>{label}</span>
      {!done && cta && <span className="text-xs text-[hsl(var(--brand-teal))] font-medium shrink-0">{cta}</span>}
    </button>
  );
}

export default function WeeklyLoopsPage() {
  const router = useRouter();

  const cycle = {
    number: 8, active_week: 1 as 1 | 2,
    start_date: "2026-04-07", end_date: "2026-04-20",
    pulse_closed: true, briefings_generated: true,
    leadership_session_held: false, practices_delivered: 3,
    leader_loops_initiated: 0,
  };

  const isTeamWeek = cycle.active_week === 1;

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-3xl mx-auto">
      <div className="mb-5">
        <h1 className="text-[22px] md:text-xl font-semibold text-foreground">Weekly Loops</h1>
        <p className="text-xs text-muted-foreground">Cycle {cycle.number} · {cycle.start_date.slice(5)} – {cycle.end_date.slice(5)}</p>
      </div>

      {/* Week indicator */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <div className="flex items-center gap-4 mb-4">
          <div className={`flex-1 rounded-xl p-4 border-2 text-center ${isTeamWeek ? "border-[#1B4332] bg-[#F0F7F4]" : "border-border bg-muted/30 opacity-60"}`}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className={`w-2.5 h-2.5 rounded-full ${isTeamWeek ? "bg-[#2D7D73]" : "bg-muted-foreground/30"}`} />
              <p className="text-sm font-bold text-foreground">Team Loop</p>
            </div>
            <p className="text-xs text-muted-foreground">Week 1 — collective</p>
            {isTeamWeek && <p className="text-xs font-semibold text-[#2D7D73] mt-1">This week</p>}
          </div>
          <span className="text-muted-foreground/30 font-bold">⟷</span>
          <div className={`flex-1 rounded-xl p-4 border-2 text-center ${!isTeamWeek ? "border-[#1B4332] bg-[#F0F7F4]" : "border-border bg-muted/30 opacity-60"}`}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className={`w-2.5 h-2.5 rounded-full ${!isTeamWeek ? "bg-[#2D7D73]" : "bg-muted-foreground/30"}`} />
              <p className="text-sm font-bold text-foreground">Leader Loop</p>
            </div>
            <p className="text-xs text-muted-foreground">Week 2 — individual</p>
            {!isTeamWeek && <p className="text-xs font-semibold text-[#2D7D73] mt-1">This week</p>}
          </div>
        </div>

        <div className="space-y-1">
          {isTeamWeek ? (
            <>
              <ProgressItem label="PSH pulse closed" done={cycle.pulse_closed} route="/dashboard/weekly-loops/team-pulse" />
              <ProgressItem label="Team Briefings generated" done={cycle.briefings_generated} route="/dashboard/weekly-loops/team-briefings" />
              <ProgressItem label="Leadership session held" done={cycle.leadership_session_held} route="/dashboard/weekly-loops/leadership-session" cta="Prepare agenda →" />
              <ProgressItem label={`Micro-practices delivered (${cycle.practices_delivered}/5 teams)`} done={cycle.practices_delivered === 5} route="/dashboard/weekly-loops/practice" />
            </>
          ) : (
            <>
              <ProgressItem label={`Leader Loops initiated (${cycle.leader_loops_initiated}/5)`} done={cycle.leader_loops_initiated === 5} route="/dashboard/weekly-loops/leader-pulse" cta="Initiate your Loop →" />
              <ProgressItem label="Leader Briefings reviewed" done={false} route="/dashboard/weekly-loops/leader-briefing" />
              <ProgressItem label="Self-reflection completed" done={false} route="/dashboard/weekly-loops/self-reflection" />
            </>
          )}
        </div>
      </div>

      {/* CHRIS summary */}
      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <div className="flex items-start gap-3">
          <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">CHRIS — Cycle 8</p>
            <p className="text-sm text-muted-foreground leading-relaxed font-serif-accent">
              Cycle 8 is the strongest in three months. Wattle Wing&apos;s PSH_08 improvement is the standout — the practice worked. Grevillea Wing continues to need attention and should be the focus of the Leadership Session this week. The Leadership Session agenda is ready. 3 of 5 teams have delivered their micro-practice. 2 are outstanding.
            </p>
          </div>
        </div>
        <button onClick={() => router.push("/dashboard/weekly-loops/leadership-session")} className="w-full mt-3 py-3 bg-[#1B4332] text-white rounded-xl text-sm font-medium hover:opacity-90">
          Prepare Leadership Session →
        </button>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Team Briefings", sub: "5 ready", route: "/dashboard/weekly-loops/team-briefings", icon: "📋" },
          { label: "Leadership Session", sub: "Agenda ready", route: "/dashboard/weekly-loops/leadership-session", icon: "👥" },
          { label: "Micro Practice", sub: "3/5 delivered", route: "/dashboard/weekly-loops/practice", icon: "🎯" },
          { label: "PSH Dashboard", sub: "Cycle 8 results", route: "/dashboard/psh", icon: "📊" },
        ].map((item) => (
          <button key={item.label} onClick={() => router.push(item.route)} className="bg-card rounded-xl border border-border p-4 text-left hover:shadow-sm transition-shadow">
            <p className="text-2xl mb-2">{item.icon}</p>
            <p className="text-sm font-semibold text-foreground">{item.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
          </button>
        ))}
      </div>

      <div className="h-16" />
    </div>
  );
}
