"use client";
import { useMobile } from "@/lib/hooks/useMobile";
import MobileCareMinutes from "@/components/mobile/MobileCareMinutes";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mic, Clock, AlertTriangle, MoreHorizontal, CheckCircle, Users } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { ActionModal, type ActionVariant } from "@/components/ActionModal";
import { care_minutes_weekly, facility, workforce_monthly } from "@/lib/seed-data";

// Derive this week's daily data from the most recent week in seed data
const latestWeek = care_minutes_weekly[care_minutes_weekly.length - 1];
const prevWeeks = care_minutes_weekly.slice(-4);

// Simulate daily variation from weekly average
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"];
const WEEK_DATA = DAYS.map((day, i) => {
  const jitter = [3, -2, 1, -14, -11, -9, -2][i]; // realistic daily variation
  const total = latestWeek.avg_total + jitter;
  const rnJitter = [1.2, -0.9, 0.8, -3.2, -2.1, -1.1, 0.4][i];
  const rn = latestWeek.avg_rn + rnJitter;
  const status = total >= 215 && rn >= 44 ? "compliant" as const : total >= 210 ? "at-risk" as const : "non-compliant" as const;
  return { day, total: Math.round(total), rn: Math.round(rn * 10) / 10, status };
});

const SHIFT_DATA = [
  { shift: "Morning", rn: 16.2, en: 5.4, ain: 42.1, total: 63.7, status: "ok" as const, note: "Complete" },
  { shift: "Afternoon", rn: 14.8, en: 4.8, ain: 38.5, total: 58.1, status: "warn" as const, note: "RN below target" },
  { shift: "Night", rn: 0, en: 0, ain: 0, total: 0, status: "bad" as const, note: "RN UNFILLED" },
];

export default function CareMinutesPage() {
  const mobile = useMobile();
  if (mobile) return <MobileCareMinutes />;

  const router = useRouter();
  const [modal, setModal] = useState<{ variant: ActionVariant; title: string; chris?: string; label?: string } | null>(null);

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      {/* Header — back to Clinical CC */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard/clinical")} className="p-1 -ml-1 hover:bg-muted rounded-lg">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <p className="text-[28px] font-bold text-foreground leading-tight tracking-tight">Care Minutes</p>
            <p className="text-[10px] text-muted-foreground">{facility.name} · Deputy 2h ago ✅ · Updated hourly</p>
          </div>
        </div>
        <button onClick={() => router.push("/dashboard/coach")} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">
          <Mic className="w-3.5 h-3.5" /> Ask CHRIS
        </button>
      </div>

      {/* TODAY — hero with CHRIS speaking first */}
      <div className="rounded-xl p-4 border border-border border-l-4 border-l-[hsl(var(--brand-amber))] mb-4" style={{ background: "rgba(212, 160, 23, 0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Today · {latestWeek.non_compliant_days === 0 ? "Compliant" : latestWeek.non_compliant_days <= 2 ? "At Risk" : "Non-Compliant"} · Week {latestWeek.week.split("W")[1]}</span>
          <span className="text-xs text-muted-foreground font-mono">
            <Clock className="w-3 h-3 inline mr-1" />Updates hourly
          </span>
        </div>

        {/* Big number */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className={`text-[64px] font-extrabold leading-none tracking-tight ${latestWeek.avg_total >= 215 ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-amber))]"}`} style={{ fontFamily: "var(--font-display)" }}>{latestWeek.avg_total}</span>
          <span className="text-lg text-muted-foreground ml-1">/ 215 min per resident</span>
        </div>

        {/* Role breakdown — simple bars */}
        <div className="space-y-2 mb-3">
          {[
            { label: "RN", value: Math.round(latestWeek.avg_rn * 10) / 10, target: 44, ok: latestWeek.avg_rn >= 44 },
            { label: "EN", value: Math.round((latestWeek.avg_total - latestWeek.avg_rn - (latestWeek.avg_total - latestWeek.avg_rn) * 0.93) * 10) / 10, target: null, ok: true },
            { label: "AIN", value: Math.round((latestWeek.avg_total - latestWeek.avg_rn) * 0.93 * 10) / 10, target: null, ok: true },
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
        <div className="flex items-start gap-2 p-3 rounded-lg mb-3" style={{ background: "rgba(27, 67, 50, 0.05)" }}>
          <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {latestWeek.avg_total >= 215 && latestWeek.avg_rn >= 44
              ? `Care minutes have been compliant every day this week — ${latestWeek.avg_total} total, ${latestWeek.avg_rn} RN. This is the strongest sustained period since November. The new RN has settled in and agency dependency is down to 18%. Keep it going.`
              : `You're ${215 - latestWeek.avg_total} min/resident short. RN minutes at ${latestWeek.avg_rn} (target: 44). ${latestWeek.rn_gap_days} RN gap days this week. Agency cover is the immediate lever — longer term, workforce stability is the fix.`}
          </p>
        </div>

        {/* THE ACTIONS — front and centre */}
        <div className="space-y-2">
          <button onClick={() => setModal({ variant: "form", title: "Find agency RN for tonight", chris: "CHRIS has generated a shift brief for tonight's evening RN shift. Review it, then send to your agency contacts. The brief includes care model, specific care needs, handover time, and who to report to.", label: "Send agency brief →" })} className="w-full text-sm font-medium py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            Find agency RN for tonight →
          </button>
          <div className="flex gap-2">
            <button onClick={() => setModal({ variant: "confirm", title: "Post to internal pool", chris: "CHRIS will send an alert to all qualified RN staff asking for tonight's evening shift cover. The alert goes via iMessage.", label: "Post shift alert →" })} className="flex-1 text-xs font-medium py-2.5 rounded-lg border border-border text-foreground hover:bg-muted transition-colors">
              Post to internal pool
            </button>
            <button onClick={() => setModal({ variant: "confirm", title: "Flag for tomorrow", chris: "This flags tonight's gap as a known risk in tomorrow's briefing. Care minutes may breach but RN coverage has been reviewed and accepted.", label: "Accept and flag →" })} className="flex-1 text-xs font-medium py-2.5 rounded-lg border border-border text-foreground hover:bg-muted transition-colors">
              Flag for tomorrow
            </button>
          </div>
        </div>
      </div>

      {/* BY SHIFT — with action on the gap */}
      <div className="bg-card rounded-xl shadow-warm border border-border mb-4 overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">By Shift</p>
        </div>
        {SHIFT_DATA.map((s) => {
          const isBad = s.status === "bad";
          const isWarn = s.status === "warn";
          return (
            <div key={s.shift} className={`px-4 py-3 border-b border-border last:border-b-0 border-l-[3px] ${
              isBad ? "border-l-[hsl(var(--brand-terracotta))] bg-[hsl(var(--brand-terracotta)/0.04)]" :
              isWarn ? "border-l-[hsl(var(--brand-amber))]" :
              "border-l-[hsl(var(--brand-teal))]"
            }`}>
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
                  <button onClick={() => setModal({ variant: "form", title: "Find agency cover for tonight", chris: "CHRIS has generated a shift brief for tonight's night RN shift. Review and send to agency.", label: "Send agency brief →" })} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
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
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-3">This Week</p>
        <div className="space-y-2">
          {WEEK_DATA.map((d) => {
            const pct = Math.round((d.total / 240) * 100);
            const color = d.status === "compliant" ? "hsl(var(--brand-teal))" : d.status === "at-risk" ? "hsl(var(--brand-amber))" : "hsl(var(--brand-terracotta))";
            return (
              <div key={d.day} className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground w-10 shrink-0">{d.day}</span>
                <div className="flex-1 bg-muted rounded-full h-3 relative">
                  <div className="h-3 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
                  {/* 215 target marker */}
                  <div className="absolute top-0 bottom-0 border-r-2 border-dashed border-foreground/20" style={{ left: `${Math.round((215 / 240) * 100)}%` }} />
                </div>
                <span className="text-xs font-medium w-8 text-right" style={{ color }}>{d.total}</span>
              </div>
            );
          })}
        </div>
        <p className="text-[9px] text-muted-foreground mt-2 text-right">Dashed line = 215 target</p>
      </div>

      {/* CHRIS cross-domain signal for care minutes */}
      <div className="bg-card rounded-xl p-4 shadow-warm border border-border mb-16">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]">CAUSAL</span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dashed border-[hsl(var(--brand-amber))] text-muted-foreground">STRONG</span>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Agency dependency peaked in Jan — culture signal, not rostering failure</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">2 RNs resigned in December following 4 cycles of declining PSH_13 (Recognition) scores in Wattle Wing. Agency peaked at 28% of RN hours in January. Care minutes breached 6 days that month. As agency reduces (now 18%), care minutes have recovered. Estimated cost of the exits + agency surge: $240K YTD.</p>
        <div className="flex items-center gap-2">
          <button onClick={() => setModal({ variant: "form", title: "Address root cause", chris: "The RN shortfall follows a 4-cycle decline in PSH_02 (Lack of Support). CHRIS recommends prescribing a recognition-focused practice for the affected team. This creates a corrective action and appears in the next Team Briefing.", label: "Create corrective action →" })} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Address root cause →</button>
          <button onClick={() => setModal({ variant: "feedback", title: "Signal not relevant", chris: "Your feedback helps CHRIS learn. Why doesn't this signal apply to your context?", label: "Submit feedback" })} className="text-[11px] text-muted-foreground hover:text-foreground">Not relevant</button>
        </div>
      </div>

      {/* Action Modal */}
      {modal && (
        <ActionModal
          open={true}
          onClose={() => setModal(null)}
          variant={modal.variant}
          title={modal.title}
          chrisMessage={modal.chris}
          primaryLabel={modal.label}
        />
      )}
    </div>
  );
}
