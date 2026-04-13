"use client";
import { useMobile } from "@/lib/hooks/useMobile";
import { MobileDomainScreen } from "@/components/mobile/MobileDomainScreen";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Mic, AlertTriangle, FileText, Users, Heart, MoreHorizontal, CheckCircle } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { resident_intelligence, facility } from "@/lib/seed-data";
import { BENCHMARKS, fmtK } from "@/lib/financial-benchmarks";
import { SituationReport } from "@/components/chris/SituationReport";
import { residentsReport } from "@/lib/chris/situation-reports";
import { AgentPulse } from "@/components/chris/AgentPulse";
import { LineChart, Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

const ri = resident_intelligence;
const cp = ri.care_plans;
const rv = ri.resident_voice;
const comp = ri.complaints;
const ce = ri.consumer_experience;

export default function ResidentIntelligencePage() {
  const mobile = useMobile();
  if (mobile) return <MobileDomainScreen domain="residents" />;

  const router = useRouter();

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard")} className="p-1 -ml-1 hover:bg-muted rounded-lg"><ChevronLeft className="w-5 h-5 text-foreground" /></button>
          <div>
            <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Resident Intelligence</p>
            <p className="text-[10px] text-muted-foreground">{facility.name} · {ri.cohort.total_residents} residents · Updated from AlayaCare 2h ago</p>
          </div>
        </div>
        <button data-has-handler="true" onClick={() => router.push("/dashboard/coach")} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted"><Mic className="w-3.5 h-3.5" /> Ask CHRIS</button>
      </div>

      {/* Today's Resident Picture */}
      <div className="rounded-xl p-5 mb-5" style={{ background: "rgba(27,67,50,0.05)" }}>
        <div className="flex items-start gap-3">
          <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5" />
          <p className="text-sm text-foreground leading-relaxed font-serif-accent">
            The resident picture is broadly stable this week. Consumer experience remains at {ce.qi_11_score} — above sector benchmark — but CHRIS has detected an early pattern: Grevillea and Acacia Wings (dementia cohort) are showing lower voice scores for the third consecutive fortnight. This correlates with the elevated PSH_08 (Traumatic Exposure) in those teams. Worth a walkthrough this week. {cp.overdue_90_180d} care plans are overdue for 90-day review and {comp.open} open complaint has been waiting {comp.open_items[0]?.days_elapsed} days without a documented resolution.
          </p>
        </div>
      </div>

      {/* 5 stat cards */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        {[
          { value: ri.cohort.total_residents.toString(), label: "Residents", href: "/dashboard/residents", color: "text-foreground" },
          { value: `${Math.round(ri.cohort.occupancy_pct * 100)}%`, label: "Occupancy", href: "/dashboard/financial/revenue", color: "text-foreground" },
          { value: ce.qi_11_score.toString(), label: "Consumer Exp", href: "/dashboard/residents/voice", color: ce.qi_11_score >= ce.qi_11_benchmark ? "text-[hsl(var(--brand-teal))]" : "text-[hsl(var(--brand-amber))]" },
          { value: cp.overdue_90_180d.toString(), label: "Plans Overdue", href: "/dashboard/residents/care-plans", color: cp.overdue_90_180d > 0 ? "text-[hsl(var(--brand-amber))]" : "text-[hsl(var(--brand-teal))]" },
          { value: comp.open.toString(), label: "Open Complaints", href: "/dashboard/residents/feedback", color: comp.open > 0 ? "text-[hsl(var(--brand-amber))]" : "text-[hsl(var(--brand-teal))]" },
        ].map((s) => (
          <button key={s.label} data-has-handler="true" onClick={() => router.push(s.href)} className="bg-card rounded-lg px-2 py-2.5 border border-border text-center hover:shadow-warm transition-shadow">
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[8px] text-muted-foreground leading-tight">{s.label}</p>
          </button>
        ))}
      </div>

      <AgentPulse domain="residents" />
      <SituationReport domain="residents" narrative={residentsReport.narrative} refreshedAt={residentsReport.refreshedAt} context={residentsReport.context} signals={residentsReport.signals} />

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Needs your attention</p>

      {/* Care plans overdue */}
      {cp.overdue_90_180d > 0 && (
        <div className="rounded-xl p-4 border border-border border-l-4 border-l-[hsl(var(--brand-amber))] mb-3" style={{ background: "rgba(212,160,23,0.06)" }}>
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-[hsl(var(--brand-amber))] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground mb-1">{cp.overdue_90_180d} care plans overdue for 90-day review</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                {cp.overdue_detail.map((d) => `${d.wing}: ${d.days_since_review} days since review`).join(" · ")}. Regulatory expectation: review within 90 days.
              </p>
              <button data-has-handler="true" onClick={() => router.push("/dashboard/residents/care-plans")} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Schedule reviews →</button>
            </div>
          </div>
        </div>
      )}

      {/* Voice declining */}
      <div className="rounded-xl p-4 border border-border border-l-4 border-l-[hsl(var(--brand-amber))] mb-3" style={{ background: "rgba(212,160,23,0.06)" }}>
        <div className="flex items-start gap-3">
          <Heart className="w-5 h-5 text-[hsl(var(--brand-amber))] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-1">Dementia wing voice scores declining — 3rd fortnight</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-1">
              Grevillea Wing: avg {rv.by_wing[2].overall}/5 (down from 3.8). Acacia Wing: avg {rv.by_wing[3].overall}/5 (down from 3.7). Residential wings: avg 4.1/5 — stable.
            </p>
            <p className="text-[10px] text-muted-foreground/60 mb-2">CHRIS cross-domain: correlates with PSH_08 elevation in both teams</p>
            <div className="flex gap-2">
              <button data-has-handler="true" onClick={() => router.push("/dashboard/residents/voice")} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">View voice detail →</button>
              <button data-has-handler="true" onClick={() => router.push("/dashboard/psh")} className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">View PSH correlation →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Open complaint */}
      {comp.open_items.map((c) => (
        <div key={c.id} className="rounded-xl p-4 border border-border border-l-4 border-l-[hsl(var(--brand-amber))] mb-3" style={{ background: "rgba(212,160,23,0.06)" }}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[hsl(var(--brand-amber))] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground mb-1">Open complaint — {c.days_elapsed} days without documented resolution</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-1">
                Category: {c.category.replace(/_/g, " ")} — {c.subcategory.replace(/_/g, " ")}. Received: {c.received_date}. Response due: within 14 days ({c.days_remaining} remaining).
              </p>
              <div className="flex gap-2">
                <button data-has-handler="true" onClick={() => router.push("/dashboard/residents/feedback")} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">View complaint →</button>
                <button className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">Assign response →</button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* AN-ACC opportunity — positive */}
      <div className="rounded-xl p-4 border border-border border-l-4 border-l-[hsl(var(--brand-teal))] mb-3">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-[hsl(var(--brand-teal))] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-1">AN-ACC reassessment opportunity — {cp.annacc_reassessment_flags} residents</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              2 residents with increased documented care needs, 1 approaching 12-month anniversary. Estimated net revenue impact: <span className="font-medium text-[hsl(var(--brand-teal))]">+{fmtK(cp.estimated_revenue_impact)}/month</span> if reclassified.
            </p>
            <button className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Alert DON →</button>
          </div>
        </div>
      </div>

      {/* CHRIS cross-domain intelligence signal */}
      <div className="bg-card rounded-xl p-4 border border-border mb-5">
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]">PREDICTIVE</span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dashed border-[hsl(var(--brand-amber))] text-muted-foreground">EMERGING</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Resident Experience</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Workforce</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">PSH</span>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Consumer experience and staff wellbeing are diverging</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
          Consumer experience stable at {ce.qi_11_score}. Staff PSH declining in dementia wings. In comparable facilities, sustained PSH decline in dementia teams precedes consumer experience decline by 2-3 cycles. Early intervention now protects resident experience later.
        </p>
        <div className="flex items-center gap-2">
          <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Act</button>
          <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted">Monitor</button>
          <button className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground ml-auto">Not relevant</button>
        </div>
      </div>

      {/* Domain status rows */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Resident domains</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-5">
        {[
          { name: "Experience", status: "clear", summary: `Consumer exp ${ce.qi_11_score} · Voice ${rv.overall_scores.overall_feeling}/5 avg · Stable`, href: "/dashboard/residents/voice" },
          { name: "Care Currency", status: cp.overdue_90_180d > 0 ? "watch" : "clear", summary: `${cp.overdue_90_180d} care plans overdue · ${cp.goals_not_progressed} goal not progressed`, href: "/dashboard/residents/care-plans" },
          { name: "Safety", status: "watch", summary: `QI_03 above benchmark · ${ri.safety_signals.high_fall_risk_residents} high-risk falls residents`, href: "/dashboard/quality" },
          { name: "Engagement", status: "clear", summary: `Family engagement ${Math.round(ri.family_engagement.engagement_rate * 100)}% · ${comp.overdue_14d} complaints >14 days`, href: "/dashboard/residents/families" },
        ].map((d) => {
          const indicator = d.status === "clear" ? "✅" : "⚠️";
          return (
            <button key={d.name} data-has-handler="true" onClick={() => router.push(d.href)} className="flex items-center justify-between w-full px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors text-left">
              <div className="flex items-center gap-3">
                <span className="text-sm">{indicator}</span>
                <span className="text-sm font-medium text-foreground">{d.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{d.summary}</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Occupancy and flow */}
      <div className="bg-card rounded-xl p-4 border border-border mb-5">
        <p className="text-sm font-semibold text-foreground mb-2">Occupancy and flow</p>
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Current occupancy</span>
            <span className="font-medium text-foreground">{ri.cohort.total_residents}/{facility.beds} beds · {Math.round(ri.cohort.occupancy_pct * 100)}%</span>
          </div>
          {ri.cohort.vacant_detail.map((v) => (
            <div key={v.bed} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{v.wing} {v.bed} — vacant {v.vacant_days} days</span>
              <span className="text-[hsl(var(--brand-amber))] font-medium">{fmtK(v.revenue_lost)} lost</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Respite beds</span>
            <span className="text-foreground">2/6 utilised</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Admissions pipeline</span>
            <span className="text-foreground">{ri.cohort.admissions_pipeline.enquiries} enquiries · {ri.cohort.admissions_pipeline.assessments_in_progress} assessments · {ri.cohort.admissions_pipeline.offers_made} offer</span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground/70">
          Revenue: ${BENCHMARKS.revenue_per_vacant_bed_day}/day per vacant bed. Current vacancy cost: {fmtK(ri.cohort.vacant_detail.reduce((s, v) => s + BENCHMARKS.revenue_per_vacant_bed_day, 0))}/day.
        </p>
      </div>

      {/* Consumer experience trend */}
      <div className="bg-card rounded-xl p-4 border border-border mb-16">
        <p className="text-sm font-semibold text-foreground mb-0.5">Consumer experience trend</p>
        <p className="text-[10px] text-muted-foreground mb-3">QI_11 annual (solid) + Resident Voice fortnightly (dotted) vs sector benchmark</p>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={rv.six_cycle_trend} margin={{ top: 5, right: 30, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 15% 90%)" />
            <XAxis dataKey="cycle" tick={{ fontSize: 10, fill: "hsl(152 20% 35%)" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `C${v}`} />
            <YAxis domain={[3, 5]} tick={{ fontSize: 9, fill: "hsl(152 20% 55%)" }} axisLine={false} tickLine={false} width={28} />
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(30 15% 88%)" }} formatter={(v: any) => [`${v}/5`, "Resident Voice"]} />
            <ReferenceLine y={3.8} stroke="hsl(152 20% 70%)" strokeDasharray="3 3" strokeWidth={1} label={{ value: `Sector ${ce.qi_11_benchmark}→3.8`, position: "right", fontSize: 8, fill: "hsl(152 20% 55%)" }} />
            <Line type="monotone" dataKey="overall" stroke="hsl(var(--brand-forest))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--brand-forest))" }} />
          </LineChart>
        </ResponsiveContainer>

        <div className="flex items-start gap-2 p-2.5 rounded-lg mt-2" style={{ background: "rgba(27,67,50,0.05)" }}>
          <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Your consumer experience ({ce.qi_11_score}) is above sector benchmark ({ce.qi_11_benchmark}). Resident Voice is providing a more frequent signal — the fortnightly data shows a dip in dementia wings that the annual survey won&apos;t capture until next year.
          </p>
        </div>
      </div>
    </div>
  );
}
