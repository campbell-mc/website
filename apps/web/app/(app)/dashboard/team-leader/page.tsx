"use client";
import { RoleHomeScreen, type RoleHomeConfig } from "@/components/dashboard/RoleHomeScreen";

const config: RoleHomeConfig = {
  greeting: "Good morning, Sandra",
  subtitle: "Wattle Wing Evening · The Holy Grail Bowral",
  todaysPicture: "Your team's practice last fortnight worked — 'Protect breaks under pressure' reduced the workload hazard score by 0.08, the strongest improvement this cycle. Pulse participation was 78% — above the 50% threshold. Your team scored highest on Belonging (4.3) this cycle, which is a real strength to build on. One thing to watch: Psychological Safety dipped slightly to 3.6 — the Team Briefing has more detail on what might be driving that.",
  domains: [
    { name: "Team PSH", status: "clear", summary: "Workload improving · Psych Safety to watch", href: "/dashboard/risk" },
    { name: "Pulse", status: "clear", summary: "Cycle 8 · 78% participation · closes Friday", href: "/team-loop/pulse" },
    { name: "Practice", status: "clear", summary: "'Protect breaks' — outcome measured ✅ +0.08", href: "/team-loop/briefing" },
    { name: "Leader Loop", status: "watch", summary: "Cycle 3 in progress · OBP set", href: "/leader-loop/arrive" },
  ],
  topActions: [
    { priority: "watch", label: "Read your Team Briefing — 3 signals, practice attached", actionLabel: "Read briefing →", href: "/team-loop/briefing" },
    { priority: "watch", label: "Complete Leader Loop Cycle 3 prompt — due this week", actionLabel: "Continue →", href: "/leader-loop/arrive" },
    { priority: "clear", label: "Practice outcome: hazard reduced +0.08 — worth reinforcing", actionLabel: "View outcome →", href: "/dashboard/psh" },
  ],
  intelligence: {
    type: "CAUSAL", confidence: "EMERGING", domains: ["Clinical", "Workforce"],
    headline: "Your team's care continuity is above facility average",
    detail: "Wattle Wing Evening has the lowest agency dependency of any team this cycle — 8% vs facility average 14%. Residents in your wing had zero falls this fortnight. Care continuity is the protective factor.",
  },
  briefing: { label: "Team Briefing · Cycle 8", sub: "Updated overnight · 3 signals · practice attached", href: "/team-loop/briefing" },
};

export default function TeamLeaderHome() { return <RoleHomeScreen config={config} />; }
