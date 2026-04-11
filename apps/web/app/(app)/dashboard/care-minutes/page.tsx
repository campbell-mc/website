"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Mic, Clock, AlertTriangle, MoreHorizontal, CheckCircle, Users } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

const WEEK_DATA = [
  { day: "Mon", total: 203, rn: 42, status: "compliant" as const },
  { day: "Tue", total: 198, rn: 39, status: "at-risk" as const },
  { day: "Wed", total: 201, rn: 41, status: "compliant" as const },
  { day: "Thu", total: 186, rn: 37, status: "non-compliant" as const },
  { day: "Fri", total: 189, rn: 38, status: "at-risk" as const },
  { day: "Sat", total: 191, rn: 39, status: "at-risk" as const },
  { day: "Today", total: 198, rn: 41, status: "at-risk" as const },
];

const SHIFT_DATA = [
  { shift: "Morning", rn: 16.2, en: 5.4, ain: 42.1, total: 63.7, status: "ok" as const, note: "Complete" },
  { shift: "Afternoon", rn: 14.8, en: 4.8, ain: 38.5, total: 58.1, status: "warn" as const, note: "RN below target" },
  { shift: "Night", rn: 0, en: 0, ain: 0, total: 0, status: "bad" as const, note: "RN UNFILLED" },
];

export default function CareMinutesPage() {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      {/* Header — back to Clinical CC */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard/clinical")} className="p-1 -ml-1 hover:bg-muted rounded-lg">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <p className="text-base font-semibold text-foreground">Care Minutes</p>
            <p className="text-[10px] text-muted-foreground">Harbison Bowral · Deputy 2h ago ✅ · Updated hourly</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">
          <Mic className="w-3.5 h-3.5" /> Ask CHRIS
        </button>
      </div>

      {/* TODAY — hero with CHRIS speaking first */}
      <div className="bg-card rounded-xl p-4 shadow-warm border border-border border-l-4 border-l-[hsl(var(--brand-amber))] mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Today · At Risk · Day 3</span>
          <span className="text-xs text-muted-foreground font-mono">
            <Clock className="w-3 h-3 inline mr-1" />Updates hourly
          </span>
        </div>

        {/* Big number */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-4xl font-bold text-[hsl(var(--brand-amber))]">198</span>
          <span className="text-sm text-muted-foreground">/ 200 min per resident</span>
        </div>

        {/* Role breakdown — simple bars */}
        <div className="space-y-2 mb-3">
          {[
            { label: "RN", value: 41, target: 40, ok: true },
            { label: "EN", value: 10.2, target: null, ok: true },
            { label: "AIN", value: 146.8, target: null, ok: true },
          ].map((r) => (
            <div key={r.label} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-8">{r.label}</span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${Math.min(100, (r.value / (r.target ?? 160)) * 100)}%`,
                    background: r.ok ? "hsl(var(--brand-teal))" : "hsl(var(--brand-amber))",
                  }}
                />
              </div>
              <span className="text-xs font-medium text-foreground w-16 text-right">
                {r.value} {r.target ? `/ ${r.target}` : "min"}
              </span>
            </div>
          ))}
        </div>

        {/* CHRIS interpretation */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 mb-3">
          <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            You're 2 min/resident short. Tonight's RN shift is unfilled — that's what tips you from compliant to at-risk. If agency RN confirmed, projected finish: 204 min — <span className="text-[hsl(var(--brand-teal))] font-medium">compliant</span>.
          </p>
        </div>

        {/* THE ACTIONS — front and centre */}
        <div className="space-y-2">
          <button className="w-full text-sm font-medium py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            Find agency RN for tonight →
          </button>
          <div className="flex gap-2">
            <button className="flex-1 text-xs font-medium py-2.5 rounded-lg border border-border text-foreground hover:bg-muted transition-colors">
              Post to internal pool
            </button>
            <button className="flex-1 text-xs font-medium py-2.5 rounded-lg border border-border text-foreground hover:bg-muted transition-colors">
              Flag for tomorrow
            </button>
          </div>
        </div>
      </div>

      {/* BY SHIFT — with action on the gap */}
      <div className="bg-card rounded-xl shadow-warm border border-border mb-4 overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">By Shift</p>
        </div>
        {SHIFT_DATA.map((s) => {
          const isBad = s.status === "bad";
          const isWarn = s.status === "warn";
          return (
            <div key={s.shift} className={`px-4 py-3 border-b border-border last:border-b-0 ${isBad ? "bg-[hsl(var(--brand-terracotta)/0.04)]" : ""}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    isBad ? "bg-[hsl(var(--brand-terracotta))] animate-pulse" : isWarn ? "bg-[hsl(var(--brand-amber))]" : "bg-[hsl(var(--brand-teal))]"
                  }`} />
                  <span className="text-sm font-medium text-foreground">{s.shift}</span>
                </div>
                <span className="text-xs text-muted-foreground">{s.total > 0 ? `${s.total.toFixed(0)} min` : "—"}</span>
              </div>
              {s.total > 0 ? (
                <p className="text-[10px] text-muted-foreground ml-4">
                  RN: {s.rn} · EN: {s.en} · AIN: {s.ain} {isWarn && "· ⚠️ " + s.note}
                </p>
              ) : (
                <div className="ml-4">
                  <p className="text-xs text-[hsl(var(--brand-terracotta))] font-medium mb-2">🔴 {s.note} — RN shift not filled</p>
                  <button className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
                    Find agency cover for tonight →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* THIS WEEK — visual bar chart, fixed */}
      <div className="bg-card rounded-xl p-4 shadow-warm border border-border mb-4">
        <p className="text-sm font-semibold text-foreground mb-3">This Week</p>
        <div className="space-y-2">
          {WEEK_DATA.map((d) => {
            const pct = Math.round((d.total / 220) * 100);
            const color = d.status === "compliant" ? "hsl(var(--brand-teal))" : d.status === "at-risk" ? "hsl(var(--brand-amber))" : "hsl(var(--brand-terracotta))";
            return (
              <div key={d.day} className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground w-10 shrink-0">{d.day}</span>
                <div className="flex-1 bg-muted rounded-full h-3 relative">
                  <div className="h-3 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
                  {/* 200 target marker */}
                  <div className="absolute top-0 bottom-0 border-r-2 border-dashed border-foreground/20" style={{ left: `${Math.round((200 / 220) * 100)}%` }} />
                </div>
                <span className="text-xs font-medium w-8 text-right" style={{ color }}>{d.total}</span>
              </div>
            );
          })}
        </div>
        <p className="text-[9px] text-muted-foreground mt-2 text-right">Dashed line = 200 target</p>
      </div>

      {/* CHRIS cross-domain signal for care minutes */}
      <div className="bg-card rounded-xl p-4 shadow-warm border border-border mb-16">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]">CAUSAL</span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dashed border-[hsl(var(--brand-amber))] text-muted-foreground">STRONG</span>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">RN shortfall follows PSH_02 decline — culture signal, not rostering failure</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">The permanent RN roster has insufficient buffer because 2 RNs resigned following 4 cycles of declining Lack of Support scores. Agency cover addresses the symptom. Recognition practices address the cause.</p>
        <div className="flex items-center gap-2">
          <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Address root cause →</button>
          <button className="text-[11px] text-muted-foreground hover:text-foreground">Not relevant</button>
        </div>
      </div>
    </div>
  );
}
