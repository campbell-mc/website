"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, AlertTriangle, CheckCircle, ThumbsUp, Plus, FileText, TrendingUp } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { resident_intelligence, facility } from "@/lib/seed-data";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from "recharts";

const comp = resident_intelligence.complaints;
const rv = resident_intelligence.resident_voice;

export default function FeedbackComplaintsPage() {
  const router = useRouter();

  const trendData = comp.twelve_month_trend.map((m) => ({
    ...m,
    label: m.month.slice(5), // "05", "06", etc.
  }));

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button data-has-handler="true" onClick={() => router.push("/dashboard/residents")} className="p-1 -ml-1 hover:bg-muted rounded-lg">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Feedback & Complaints</p>
            <p className="text-[10px] text-muted-foreground">{facility.name} · As at {resident_intelligence.as_at}</p>
          </div>
        </div>
      </div>

      {/* Regulatory context — always visible */}
      <div className="bg-card rounded-xl p-3 border border-border mb-5">
        <div className="flex items-start gap-2">
          <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            <span className="font-semibold">Quality Standard 6 — Feedback and complaints:</span> All complaints must be acknowledged within 24 hours and resolved within 14 days. Patterns must be documented and actioned. Escalation to ACQSC required for serious incidents or unresolved complaints beyond 21 days.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { value: comp.open.toString(), label: "Open", color: comp.open > 0 ? "text-[hsl(var(--brand-amber))]" : "text-[hsl(var(--brand-teal))]" },
          { value: comp.overdue_14d.toString(), label: "Overdue (>14d)", color: comp.overdue_14d > 0 ? "text-[hsl(var(--brand-terracotta))]" : "text-[hsl(var(--brand-teal))]" },
          { value: comp.resolved_this_month.toString(), label: "Resolved this month", color: "text-[hsl(var(--brand-teal))]" },
          { value: comp.escalated_to_acqsc_ytd.toString(), label: "Escalated YTD", color: comp.escalated_to_acqsc_ytd > 0 ? "text-[hsl(var(--brand-terracotta))]" : "text-[hsl(var(--brand-teal))]" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl p-4 border border-border text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[8px] text-muted-foreground leading-tight mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Open complaint detail */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Open complaints</p>
      {comp.open_items.map((c) => (
        <div key={c.id} className="bg-card rounded-xl p-4 border border-border border-l-4 border-l-[hsl(var(--brand-amber))] mb-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[hsl(var(--brand-amber))] shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="text-sm font-semibold text-foreground">{c.id}</p>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]">{c.status.replace(/_/g, " ")}</span>
                {c.pattern_flag && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-terracotta)/0.1)] text-[hsl(var(--brand-terracotta))]">Pattern detected</span>
                )}
              </div>
              <div className="space-y-1 mb-2">
                <p className="text-xs text-muted-foreground">Category: {c.category.replace(/_/g, " ")} — {c.subcategory.replace(/_/g, " ")}</p>
                <p className="text-xs text-muted-foreground">Wing: {c.wing} · Channel: {c.channel.replace(/_/g, " ")}</p>
                <p className="text-xs text-muted-foreground">Received: {c.received_date} · Acknowledged: {c.acknowledged_date}</p>
                <p className="text-xs text-muted-foreground">Days elapsed: <span className="font-medium text-foreground">{c.days_elapsed}</span> · Response due: {c.response_due} (<span className="font-medium text-[hsl(var(--brand-amber))]">{c.days_remaining} days remaining</span>)</p>
                <p className="text-xs text-muted-foreground">Assigned to: {c.assigned_to.toUpperCase()}</p>
              </div>
              {c.pattern_flag && (
                <div className="p-2.5 rounded-lg bg-[hsl(var(--brand-terracotta)/0.06)] mb-2">
                  <p className="text-[11px] text-[hsl(var(--brand-terracotta))] leading-relaxed">{c.pattern_note}</p>
                </div>
              )}
              <div className="flex gap-2">
                <button data-has-handler="true" onClick={() => router.push("/dashboard/residents/feedback")} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Document resolution</button>
                <button data-has-handler="true" onClick={() => router.push("/dashboard/residents/feedback")} className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">Reassign</button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* CHRIS pattern analysis */}
      <div className="rounded-xl p-5 mb-5" style={{ background: "rgba(27,67,50,0.05)" }}>
        <div className="flex items-start gap-3">
          <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground leading-relaxed font-serif-accent mb-2">
              CHRIS has detected a pattern: 3 food quality complaints in 6 months, all from Wattle Wing, all related to modified texture meals. This is above the expected rate for a single wing and suggests a systemic issue rather than isolated incidents. Recommend a kitchen audit of modified texture meal preparation for Wattle Wing residents, and a conversation with the catering team about portion sizing for puree and soft diets.
            </p>
            <p className="text-xs text-muted-foreground">
              Pattern confidence: High. All complaints from same wing, same meal type, within 6-month window.
            </p>
          </div>
        </div>
      </div>

      {/* Resolved this month */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Resolved this month</p>
      {comp.resolved_items.map((r) => (
        <div key={r.id} className="bg-card rounded-xl p-4 border border-border border-l-4 border-l-[hsl(var(--brand-teal))] mb-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[hsl(var(--brand-teal))] shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-foreground">{r.id}</p>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-teal)/0.1)] text-[hsl(var(--brand-teal))]">Resolved</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                Category: {r.category.replace(/_/g, " ")} — {r.subcategory.replace(/_/g, " ")}
              </p>
              <p className="text-xs text-muted-foreground mb-1">
                Resolved: {r.resolved_date} · Time to resolve: {r.days_to_resolve} days
              </p>
              <p className="text-xs text-foreground">{r.resolution}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Positive feedback from Resident Voice */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2 mt-5">Positive feedback themes (from Resident Voice)</p>
      <div className="bg-card rounded-xl p-4 border border-border mb-5">
        <div className="flex items-start gap-2 mb-3">
          <ThumbsUp className="w-4 h-4 text-[hsl(var(--brand-teal))] shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">Top themes from open-ended Resident Voice responses that reflect positive experiences</p>
        </div>
        <div className="space-y-2">
          {rv.open_ended_themes.filter((_, i) => i < 2).map((t) => (
            <div key={t.theme} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{t.theme}</span>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{t.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement themes */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Improvement themes</p>
      <div className="bg-card rounded-xl p-4 border border-border mb-5">
        <div className="flex items-start gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-[hsl(var(--brand-amber))] shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">Themes from complaints and Resident Voice that indicate areas for improvement</p>
        </div>
        <div className="space-y-2">
          {rv.open_ended_themes.filter((_, i) => i >= 2).map((t) => (
            <div key={t.theme} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{t.theme}</span>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{t.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* New feedback button */}
      <div className="mb-5">
        <button data-has-handler="true" onClick={() => router.push("/dashboard/residents/feedback")} className="w-full text-sm font-medium px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Log new feedback or complaint
        </button>
      </div>

      {/* 12-month complaint trend */}
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">12-month complaint trend</p>
      <div className="bg-card rounded-xl p-4 border border-border mb-5">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={trendData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 15% 90%)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: "hsl(152 20% 35%)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 4]}
              tick={{ fontSize: 9, fill: "hsl(152 20% 55%)" }}
              axisLine={false}
              tickLine={false}
              width={20}
              allowDecimals={false}
            />
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid hsl(30 15% 88%)" }} formatter={(v: any) => [v, "Complaints"]} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={24}>
              {trendData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.count <= 1 ? "hsl(var(--brand-teal))" : "hsl(var(--brand-amber))"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-[10px] text-muted-foreground mt-2">
          Low volume overall — avg {comp.avg_resolution_days_ytd} days to resolve YTD. Months with 0 complaints shown as empty. Pattern analysis applies across rolling 6-month windows.
        </p>
      </div>

      {/* Regulatory reporting */}
      <div className="bg-card rounded-xl p-4 border border-border mb-16">
        <div className="flex items-start gap-2">
          <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Regulatory reporting</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {comp.escalated_to_acqsc_ytd} complaints escalated to the Aged Care Quality and Safety Commission this year. Complaint data is included in the quarterly governance pack and annual quality report. Any unresolved complaint beyond 21 days will trigger an automatic escalation flag for DON review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
