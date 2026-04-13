"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, TrendingDown, TrendingUp, Minus, MessageCircle, Users, BarChart3 } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { resident_intelligence, facility } from "@/lib/seed-data";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, ReferenceLine } from "recharts";

const rv = resident_intelligence.resident_voice;

function scoreColor(score: number): string {
  if (score >= 4) return "text-[hsl(var(--brand-teal))]";
  if (score >= 3) return "text-[hsl(var(--brand-amber))]";
  return "text-[hsl(var(--brand-terracotta))]";
}

function scoreBg(score: number): string {
  if (score >= 4) return "bg-[hsl(var(--brand-teal)/0.08)]";
  if (score >= 3) return "bg-[hsl(var(--brand-amber)/0.08)]";
  return "bg-[hsl(var(--brand-terracotta)/0.08)]";
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "improving") return <TrendingUp className="w-3.5 h-3.5 text-[hsl(var(--brand-teal))]" />;
  if (trend === "declining") return <TrendingDown className="w-3.5 h-3.5 text-[hsl(var(--brand-terracotta))]" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
}

export default function ResidentVoicePage() {
  const router = useRouter();

  const scores = rv.overall_scores;
  const scoreCards: { label: string; value: number; key: string }[] = [
    { label: "Overall feeling", value: scores.overall_feeling, key: "overall" },
    { label: "Feel listened to", value: scores.feel_listened_to, key: "listened" },
    { label: "Feel safe", value: scores.feel_safe, key: "safe" },
    { label: "Satisfied with care", value: scores.satisfied_with_care, key: "satisfied" },
    { label: "Something to improve", value: scores.something_to_improve, key: "improve" },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button data-has-handler="true" onClick={() => router.push("/dashboard/residents")} className="p-1 -ml-1 hover:bg-muted rounded-lg">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Resident Voice</p>
            <p className="text-[10px] text-muted-foreground">Cycle {rv.cycle} · {rv.collection_period} · {facility.name}</p>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-card rounded-xl p-4 border border-border mb-5">
        <div className="flex items-start gap-2">
          <MessageCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Resident Voice is a fortnightly micro-survey capturing how residents feel about their care, safety, and quality of life. It provides a more frequent signal than the annual Consumer Experience survey, allowing early detection of emerging issues at the wing level.
          </p>
        </div>
      </div>

      {/* Participation stats */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Participation</p>
      <div className="bg-card rounded-xl p-4 border border-border mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">{rv.responses} of {rv.eligible} eligible residents</p>
          </div>
          <p className="text-lg font-bold text-foreground">{Math.round(rv.participation_rate * 100)}%</p>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mb-2">
          <div className="bg-[hsl(var(--brand-forest))] rounded-full h-2" style={{ width: `${rv.participation_rate * 100}%` }} />
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>{rv.proxy_responses} proxy responses (family/representative)</span>
          <span>{rv.not_collected} not yet collected</span>
        </div>
      </div>

      {/* Overall score cards */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Overall scores</p>
      <div className="grid grid-cols-5 gap-2 mb-5">
        {scoreCards.map((s) => (
          <div key={s.key} className={`rounded-xl p-3 border border-border text-center ${scoreBg(s.value)}`}>
            <p className={`text-lg font-bold ${scoreColor(s.value)}`}>{s.value}</p>
            <p className="text-[8px] text-muted-foreground leading-tight mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Scores by wing — TABLE */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Scores by wing</p>
      <div className="bg-card rounded-xl border border-border overflow-x-auto mb-5">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-3 py-2 text-[10px] font-semibold text-muted-foreground">Wing</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-muted-foreground">Overall</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-muted-foreground">Listened</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-muted-foreground">Safe</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-muted-foreground">Satisfied</th>
              <th className="text-center px-2 py-2 text-[10px] font-semibold text-muted-foreground">Trend</th>
            </tr>
          </thead>
          <tbody>
            {rv.by_wing.map((w) => {
              const isDeclining = w.trend === "declining";
              return (
                <tr key={w.team_id} className={`border-b border-border last:border-b-0 ${isDeclining ? "bg-[hsl(var(--brand-amber)/0.06)]" : ""}`}>
                  <td className="px-3 py-2">
                    <span className="font-medium text-foreground">{w.name}</span>
                    {isDeclining && <span className="ml-1 text-[8px] text-[hsl(var(--brand-amber))] font-semibold">WATCH</span>}
                  </td>
                  <td className={`text-center px-2 py-2 font-medium ${scoreColor(w.overall)}`}>{w.overall}</td>
                  <td className={`text-center px-2 py-2 font-medium ${scoreColor(w.listened)}`}>{w.listened}</td>
                  <td className={`text-center px-2 py-2 font-medium ${scoreColor(w.safe)}`}>{w.safe}</td>
                  <td className={`text-center px-2 py-2 font-medium ${scoreColor(w.satisfied)}`}>{w.satisfied}</td>
                  <td className="text-center px-2 py-2"><TrendIcon trend={w.trend} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CHRIS analysis */}
      <div className="rounded-xl p-5 mb-5" style={{ background: "rgba(27,67,50,0.05)" }}>
        <div className="flex items-start gap-3">
          <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground leading-relaxed font-serif-accent mb-2">
              Grevillea and Acacia Wings (dementia cohort) have been declining for 3 consecutive cycles. This is not random — CHRIS has detected a strong correlation with PSH_08 (Traumatic Exposure) elevation in both teams. When staff are experiencing traumatic exposure without adequate support, the quality of relational care declines, and residents notice. The pattern is consistent with sector research on staff wellbeing and consumer experience.
            </p>
            <p className="text-xs text-muted-foreground">
              Recommendation: Address PSH_08 in both teams through the prescribed micro-practice before the next voice cycle.
            </p>
          </div>
        </div>
      </div>

      {/* Cross-domain signal */}
      <div className="bg-card rounded-xl p-4 border border-border mb-5">
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]">CAUSAL</span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-[hsl(var(--brand-amber))] text-[hsl(var(--brand-amber))]">STRONG</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Resident Voice</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">PSH</span>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Dementia wing voice scores linked to staff traumatic exposure</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          PSH_08 has been elevated in Grevillea and Acacia teams for 3 cycles. Resident Voice scores in those wings have declined in lockstep. This is a known causal pathway in aged care — staff under psychological strain deliver less relational care, which residents perceive as reduced listening, safety, and satisfaction.
        </p>
      </div>

      {/* Open-ended themes */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Open-ended themes</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-5">
        {rv.open_ended_themes.map((t) => (
          <div key={t.theme} className={`flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0 ${t.flag === "agency_signal" ? "bg-[hsl(var(--brand-amber)/0.06)]" : ""}`}>
            <div className="flex-1">
              <p className="text-sm text-foreground">{t.theme}</p>
              {t.flag === "agency_signal" && (
                <p className="text-[10px] text-[hsl(var(--brand-amber))] font-medium mt-0.5">Agency workforce signal — residents want consistent staff</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{t.count} mentions</span>
            </div>
          </div>
        ))}
      </div>

      {/* 6-cycle trend */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">6-cycle trend</p>
      <div className="bg-card rounded-xl p-4 border border-border mb-5">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={rv.six_cycle_trend} margin={{ top: 5, right: 30, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 15% 90%)" />
            <XAxis
              dataKey="cycle"
              tick={{ fontSize: 10, fill: "hsl(152 20% 35%)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `C${v}`}
            />
            <YAxis
              domain={[3, 5]}
              tick={{ fontSize: 9, fill: "hsl(152 20% 55%)" }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(30 15% 88%)" }} formatter={(v: any) => [`${v}/5`, "Overall"]} />
            <ReferenceLine y={3.8} stroke="hsl(152 20% 70%)" strokeDasharray="3 3" strokeWidth={1} label={{ value: "Benchmark 3.8", position: "right", fontSize: 8, fill: "hsl(152 20% 55%)" }} />
            <Line type="monotone" dataKey="overall" stroke="hsl(var(--brand-forest))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--brand-forest))" }} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-[10px] text-muted-foreground mt-2">Overall resident voice score trending down from 4.2 (Cycle 3) to 3.8 (Cycle 8). Driven primarily by dementia wing decline.</p>
      </div>

      {/* Collect remaining */}
      <div className="bg-card rounded-xl p-4 border border-border mb-16">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{rv.not_collected} responses remaining</p>
            <p className="text-xs text-muted-foreground">Collection closes end of cycle period</p>
          </div>
          <button data-has-handler="true" onClick={() => router.push("/dashboard/residents/voice")} className="text-xs font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
            Collect remaining responses
          </button>
        </div>
      </div>
    </div>
  );
}
