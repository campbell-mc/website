"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, FileText, AlertTriangle, Calendar, Target, ChevronDown, ChevronUp, DollarSign } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { resident_intelligence, facility } from "@/lib/seed-data";
import { fmtK } from "@/lib/financial-benchmarks";

const cp = resident_intelligence.care_plans;

export default function CarePlansPage() {
  const router = useRouter();
  const [showRegContext, setShowRegContext] = useState(false);

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button data-has-handler="true" onClick={() => router.push("/dashboard/residents")} className="p-1 -ml-1 hover:bg-muted rounded-lg">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Care Plan Currency</p>
            <p className="text-[10px] text-muted-foreground">{facility.name} · {resident_intelligence.cohort.total_residents} residents · As at {resident_intelligence.as_at}</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { value: cp.current_within_90d.toString(), label: "Current (within 90d)", color: "text-[hsl(var(--brand-teal))]" },
          { value: cp.overdue_90_180d.toString(), label: "Overdue", color: "text-[hsl(var(--brand-amber))]" },
          { value: cp.goals_not_progressed.toString(), label: "Goal not progressed", color: "text-[hsl(var(--brand-amber))]" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl p-4 border border-border text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground leading-tight mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* CHRIS insight */}
      <div className="rounded-xl p-5 mb-5" style={{ background: "rgba(27,67,50,0.05)" }}>
        <div className="flex items-start gap-3">
          <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5" />
          <p className="text-sm text-foreground leading-relaxed font-serif-accent">
            {cp.overdue_90_180d} care plans have passed the 90-day review window. Grevillea Wing&apos;s overdue plan coincides with elevated PSH in that team — the review should specifically re-assess emotional wellbeing goals. Boronia Wing is a standard cycle overdue. Neither has reached 180 days, so this is a watch-level finding, not a compliance breach — but scheduling this week is strongly recommended.
          </p>
        </div>
      </div>

      {/* Overdue detail */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Overdue care plans</p>
      {cp.overdue_detail.map((d) => (
        <div key={d.wing} className="bg-card rounded-xl p-4 border border-border border-l-4 border-l-[hsl(var(--brand-amber))] mb-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[hsl(var(--brand-amber))] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground mb-1">{d.wing}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-1">
                {d.days_since_review} days since last review
              </p>
              <p className="text-[10px] text-muted-foreground/70 mb-2">Trigger: {d.trigger}</p>
              <div className="flex gap-2">
                <button data-has-handler="true" onClick={() => router.push("/dashboard/residents/care-plans")} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Schedule review</button>
                <button className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">Assign to RN</button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Goals not progressed */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2 mt-5">Goals not progressed</p>
      {cp.goals_detail.map((g) => (
        <div key={g.goal} className="bg-card rounded-xl p-4 border border-border border-l-4 border-l-[hsl(var(--brand-amber))] mb-3">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-[hsl(var(--brand-amber))] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground mb-1">{g.wing} — {g.category}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-1">
                Goal: &ldquo;{g.goal}&rdquo; — set {g.weeks_since_set} weeks ago, progress: <span className="text-[hsl(var(--brand-terracotta))] font-medium">{g.progress}</span>
              </p>
              <p className="text-[10px] text-muted-foreground/70 mb-2">Action needed: {g.action_needed}</p>
              <button data-has-handler="true" onClick={() => router.push("/dashboard/residents/care-plans")} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Create referral</button>
            </div>
          </div>
        </div>
      ))}

      {/* Upcoming reviews */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2 mt-5">Upcoming reviews — next 14 days</p>
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-5">
        {cp.upcoming_detail.map((u) => (
          <div key={u.wing} className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0">
            <div>
              <p className="text-sm font-medium text-foreground">{u.wing}</p>
              <p className="text-xs text-muted-foreground">{u.count} review{u.count !== 1 ? "s" : ""} due within {u.due_within_days} days</p>
            </div>
            <button data-has-handler="true" onClick={() => router.push("/dashboard/residents/care-plans")} className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Schedule
            </button>
          </div>
        ))}
        <div className="px-4 py-2.5 bg-muted/30">
          <p className="text-[10px] text-muted-foreground">{cp.upcoming_reviews_14d} total reviews in the next 14 days across all wings</p>
        </div>
      </div>

      {/* AN-ACC link */}
      <div className="bg-card rounded-xl p-4 border border-border border-l-4 border-l-[hsl(var(--brand-teal))] mb-5">
        <div className="flex items-start gap-3">
          <DollarSign className="w-5 h-5 text-[hsl(var(--brand-teal))] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-1">AN-ACC reassessment link</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-1">
              Care plan reviews are a key input to AN-ACC reassessment. {cp.annacc_reassessment_flags} residents currently have documented care needs that have increased since their last classification. Completing overdue reviews ensures the clinical evidence base supports any reclassification request.
            </p>
            <p className="text-[10px] text-[hsl(var(--brand-teal))] font-medium mb-2">
              Estimated revenue impact if reclassified: +{fmtK(cp.estimated_revenue_impact)}/month
            </p>
            <button data-has-handler="true" onClick={() => router.push("/dashboard/financial/revenue")} className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">View AN-ACC detail</button>
          </div>
        </div>
      </div>

      {/* Regulatory context (collapsible) */}
      <div className="bg-card rounded-xl border border-border mb-16">
        <button
          onClick={() => setShowRegContext(!showRegContext)}
          className="flex items-center justify-between w-full px-4 py-3 text-left"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Regulatory context</p>
          </div>
          {showRegContext ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {showRegContext && (
          <div className="px-4 pb-4 border-t border-border pt-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-1.5">Aged Care Quality Standard 2 — Ongoing assessment and planning with consumers</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              Each consumer&apos;s care and services are planned, delivered, and monitored to ensure safe, quality care. Care plans must be reviewed regularly (recommended: within 90 days or following a significant change in condition) and must include measurable goals developed with the consumer and/or their representative.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The Aged Care Quality and Safety Commission expects documented evidence of regular care plan review, goal setting with consumer participation, and timely updates when care needs change. Non-compliance can trigger regulatory action under the Quality of Care Principles 2014.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
