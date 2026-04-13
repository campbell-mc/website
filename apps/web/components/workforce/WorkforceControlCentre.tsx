"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AgentPulse } from "@/components/chris/AgentPulse";
import { SituationReport } from "@/components/chris/SituationReport";
import { workforceReport } from "@/lib/chris/situation-reports";
import { RadarChart } from "@/components/charts/RadarChart";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { facility } from "@/lib/seed-data";

type WorkforceTab = "overview" | "sentiment" | "composition" | "compliance" | "financial";

// ── SEED METRICS ─────────────────────────────────────────────

const metrics = {
  turnover_pct: 28, voluntary_turnover_pct: 22, absenteeism_pct: 7.2,
  unplanned_leave_pct: 4.1, agency_pct: 18, agency_cost_week: 950,
  overtime_cost_week: 340, permanent_ratio: 74, rn_ratio: 19,
  avg_tenure_days: 847, training_compliance_pct: 91, ahpra_current_pct: 87,
  leave_liability: 48000, turnover_cost_ytd: 126000, care_ratio: 51.9,
  labour_cost_pbd: 212, psh_composite_score: 2.8, psh_participation_pct: 84,
};

// ── STAT CARD ────────────────────────────────────────────────

function StatCard({ label, value, benchmark, detail, status, trend, onClick }: {
  label: string; value: string; benchmark: string; detail: string;
  status: "good" | "watch" | "act"; trend: "up" | "down" | "stable";
  onClick?: () => void;
}) {
  const colors = { good: "border-[#2D7D73] bg-[#F0F7F4]", watch: "border-[#D4A017] bg-[#FFFBF0]", act: "border-[#C4704A] bg-[#FEF7F0]" };
  const trendColors = { good: "text-[#2D7D73]", watch: "text-[#D4A017]", act: "text-[#C4704A]" };
  return (
    <button onClick={onClick} className={`text-left p-4 rounded-xl border ${colors[status]} hover:shadow-sm transition-shadow`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
        <span className={`text-[10px] font-semibold ${trendColors[status]}`}>
          {trend === "down" ? "↓ improving" : trend === "up" ? "↑ worsening" : "— stable"}
        </span>
      </div>
      <p className="text-2xl font-bold text-foreground mb-0.5">{value}</p>
      <p className="text-[10px] text-muted-foreground">{benchmark}</p>
      <p className="text-[10px] text-muted-foreground/60 mt-0.5">{detail}</p>
    </button>
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────────

export function WorkforceControlCentre() {
  const [activeTab, setActiveTab] = useState<WorkforceTab>("overview");
  const router = useRouter();

  const tabs: { id: WorkforceTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "sentiment", label: "Sentiment" },
    { id: "composition", label: "Composition" },
    { id: "compliance", label: "Compliance" },
    { id: "financial", label: "Financial" },
  ];

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Workforce Control Centre</h1>
          <p className="text-xs text-muted-foreground">{facility.name} · Employment Hero + Deputy · Updated 1h ago</p>
        </div>
        <button onClick={() => router.push("/dashboard/workforce/pulse/new")} className="text-xs font-medium px-4 py-2.5 rounded-xl bg-[#1B4332] text-white hover:opacity-90">
          + New pulse survey
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-5">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === t.id ? "border-[#2D7D73] text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <AgentPulse domain="workforce" />

      <div className="mb-5">
        <SituationReport domain="workforce" narrative={workforceReport.narrative} refreshedAt={workforceReport.refreshedAt} context={workforceReport.context} signals={workforceReport.signals} />
      </div>

      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "sentiment" && <SentimentTab />}
      {activeTab === "composition" && <CompositionTab />}
      {activeTab === "compliance" && <ComplianceTab />}
      {activeTab === "financial" && <FinancialTab />}

      <div className="h-16" />
    </div>
  );
}

// ── OVERVIEW TAB ─────────────────────────────────────────────

function OverviewTab() {
  const router = useRouter();

  const overviewMetrics = [
    { label: "Turnover", value: `${metrics.turnover_pct}%`, benchmark: "32% sector avg", detail: `$${(metrics.turnover_cost_ytd / 1000).toFixed(0)}K replacement cost YTD`, status: "good" as const, trend: "stable" as const },
    { label: "Agency", value: `${metrics.agency_pct}%`, benchmark: "15% CHRIS alert", detail: `$${metrics.agency_cost_week}/week premium`, status: "watch" as const, trend: "down" as const },
    { label: "Absenteeism", value: `${metrics.absenteeism_pct}%`, benchmark: "6.8% sector avg", detail: `${metrics.unplanned_leave_pct}% unplanned`, status: "watch" as const, trend: "up" as const },
    { label: "Training", value: `${metrics.training_compliance_pct}%`, benchmark: "100% target", detail: "AHPRA: 6 expiring", status: metrics.training_compliance_pct >= 95 ? "good" as const : "watch" as const, trend: "stable" as const },
    { label: "PSH composite", value: metrics.psh_composite_score.toFixed(1), benchmark: "3.5 = elevated", detail: `${metrics.psh_participation_pct}% participation`, status: "good" as const, trend: "down" as const },
    { label: "Avg tenure", value: `${Math.round(metrics.avg_tenure_days / 30)}mo`, benchmark: "Longer is better", detail: "Stable this quarter", status: "good" as const, trend: "stable" as const },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        {overviewMetrics.map((m) => <StatCard key={m.label} {...m} />)}
      </div>

      {/* Keeper signals */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-[#C4704A] flex items-center justify-center"><span className="text-white text-[10px] font-bold">K</span></div>
          <p className="text-sm font-semibold text-foreground">Keeper — this cycle</p>
          <button onClick={() => router.push("/dashboard/workforce/keeper")} className="ml-auto text-xs text-[hsl(var(--brand-teal))] font-medium">View all signals →</button>
        </div>
        <div className="space-y-2">
          {[
            { severity: "urgent", signal: "Turnover precursor — Wattle Wing Team B", detail: "71% probability within 4-6 cycles", route: "/dashboard/workforce/keeper/turnover-precursor" },
            { severity: "urgent", signal: "6 AHPRA registrations expiring in 3 weeks", detail: "Care minutes compliance at risk", route: "/dashboard/workforce/keeper/ahpra-expiry" },
            { severity: "routine", signal: "Composition drift — Grevillea Wing RN:AIN ratio 1:6", detail: "Award compliance risk below 1:5", route: "/dashboard/workforce/keeper/composition-drift" },
            { severity: "routine", signal: "$48K accrued leave liability", detail: "4 staff — 6+ months without leave", route: "/dashboard/workforce/keeper/leave-liability" },
          ].map((item, i) => (
            <button key={i} onClick={() => router.push(item.route)} className={`w-full flex gap-3 p-3 rounded-lg text-left hover:shadow-sm transition-shadow ${item.severity === "urgent" ? "bg-[#FFFBF0]" : "bg-muted/30"}`}>
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.severity === "urgent" ? "bg-[#D4A017]" : "bg-[#2D7D73]"}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.signal}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
              <svg className="w-4 h-4 text-muted-foreground/30 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SENTIMENT TAB ────────────────────────────────────────────

function SentimentTab() {
  const [view, setView] = useState<"psh" | "custom">("psh");
  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <button onClick={() => setView("psh")} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${view === "psh" ? "bg-[#1B4332] text-white" : "bg-card border border-border text-muted-foreground"}`}>Psychosocial Health Pulse</button>
        <button onClick={() => setView("custom")} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${view === "custom" ? "bg-[#1B4332] text-white" : "bg-card border border-border text-muted-foreground"}`}>Custom Pulse Surveys</button>
      </div>
      {view === "psh" ? <PSHView /> : <CustomPulseView />}
    </div>
  );
}

function PSHView() {
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState("All teams");
  const teams = ["All teams", "Wattle Wing", "Grevillea Wing", "Wing A", "Wing B", "Night Team"];

  const pshData = [
    { domain: "Job Demands", score: 3.8 }, { domain: "Job Control", score: 2.9 },
    { domain: "Support", score: 2.7 }, { domain: "Relationships", score: 2.4 },
    { domain: "Role Clarity", score: 2.2 }, { domain: "Org Change", score: 2.6 },
    { domain: "Isolation", score: 1.8 }, { domain: "Trauma", score: 4.1 },
    { domain: "Lone Worker", score: 2.1 }, { domain: "Violence", score: 3.2 },
    { domain: "Bullying", score: 2.0 }, { domain: "Fatigue", score: 3.5 },
    { domain: "Turnover Intent", score: 3.7 }, { domain: "Emotional", score: 3.9 },
    { domain: "Recognition", score: 2.8 }, { domain: "Environment", score: 2.3 },
  ];
  const priorData = pshData.map((d) => ({ ...d, score: d.score + (Math.random() - 0.5) * 0.4 }));

  const trendSeries = [
    { name: "PSH_08 Traumatic Exposure", color: "#C4704A", data: [4.8, 4.6, 4.7, 4.5, 4.4, 4.5, 4.5, 4.1] },
    { name: "PSH_13 Turnover Intention", color: "#D4A017", data: [4.0, 3.9, 4.1, 3.9, 3.8, 3.9, 3.8, 3.7] },
    { name: "PSH_14 Emotional Demands", color: "#E07B39", data: [3.5, 3.6, 3.7, 3.8, 3.7, 3.8, 3.7, 3.9] },
  ];

  const teamComparison = [
    { team: "Wattle Wing", score: 2.6, prior: 2.8, participation: 88 },
    { team: "Grevillea Wing", score: 3.4, prior: 3.3, participation: 79 },
    { team: "Wing A", score: 2.4, prior: 2.5, participation: 91 },
    { team: "Wing B", score: 2.9, prior: 2.8, participation: 82 },
    { team: "Night Team", score: 3.1, prior: 3.2, participation: 76 },
  ];

  return (
    <div className="space-y-5">
      {/* Team selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {teams.map((t) => (
          <button key={t} onClick={() => setSelectedTeam(t)} className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedTeam === t ? "bg-[#1B4332] text-white" : "bg-card border border-border text-muted-foreground"}`}>{t}</button>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Cycle", value: "8", sub: "Current" },
          { label: "Participation", value: "84%", sub: "↑ from 79%", good: true },
          { label: "Elevated domains", value: "2", sub: "PSH_08, PSH_14", warn: true },
          { label: "Composite", value: "2.8", sub: "↓ improving", good: true },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-3 ${s.warn ? "border-l-4 border-l-[#D4A017] bg-[#FFFBF0] border-border" : s.good ? "border-l-4 border-l-[#2D7D73] bg-[#F0F7F4] border-border" : "border-border bg-card"}`}>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase">{s.label}</p>
            <p className={`text-[10px] mt-0.5 ${s.good ? "text-[#2D7D73]" : s.warn ? "text-[#D4A017]" : "text-muted-foreground/60"}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Radar chart */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">All 16 PSH domains — radar view</h3>
          <div className="flex gap-4 text-[10px]">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#2D7D73]" /><span className="text-muted-foreground">Cycle 8</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-gray-300" /><span className="text-muted-foreground">Cycle 7</span></div>
          </div>
        </div>
        <RadarChart data={pshData} priorData={priorData} maxValue={5} threshold={3.5} size={380} />
        <p className="text-[10px] text-muted-foreground/60 text-center mt-2">Red zone (≥3.5) indicates elevated psychosocial hazard requiring intervention</p>
      </div>

      {/* Trend chart */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Domain trends — 8 cycles</h3>
          <button onClick={() => router.push("/dashboard/psh")} className="text-xs text-[hsl(var(--brand-teal))] font-medium">Full PSH dashboard →</button>
        </div>
        <TrendLineChart labels={["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8"]} series={trendSeries} threshold={3.5} thresholdLabel="Elevated (3.5)" yDomain={[1, 5]} height={200} />
        <div className="flex gap-4 mt-3 flex-wrap">
          {trendSeries.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm" style={{ backgroundColor: s.color }} /><span className="text-[10px] text-muted-foreground">{s.name}</span></div>
          ))}
        </div>
      </div>

      {/* Team comparison */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Team comparison — composite score</h3>
          <span className="text-[10px] text-muted-foreground/60">Lower is better · 5 = worst</span>
        </div>
        <div className="space-y-2">
          {teamComparison.map((t) => (
            <button key={t.team} onClick={() => router.push(`/dashboard/psh`)} className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 text-left">
              <span className="text-sm font-medium text-foreground w-28 shrink-0">{t.team}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className={`h-2 rounded-full ${t.score >= 3.5 ? "bg-[#C4704A]" : t.score >= 3.0 ? "bg-[#D4A017]" : "bg-[#2D7D73]"}`} style={{ width: `${(t.score / 5) * 100}%` }} />
                  </div>
                  <span className={`text-sm font-bold w-8 ${t.score >= 3.5 ? "text-[#C4704A]" : t.score >= 3.0 ? "text-[#D4A017]" : "text-foreground"}`}>{t.score.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] ${t.score < t.prior ? "text-[#2D7D73]" : t.score > t.prior ? "text-[#C4704A]" : "text-muted-foreground"}`}>
                    {t.score < t.prior ? `↓ from ${t.prior}` : t.score > t.prior ? `↑ from ${t.prior}` : "stable"}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">{t.participation}% participation</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CustomPulseView() {
  const router = useRouter();

  const surveys = [
    {
      id: "s1", name: "Weekly wellbeing check", frequency: "Weekly — every Monday",
      target: "All staff", response_rate: 0.72, cycle: "Week 15 — 8 Apr",
      questions: [
        { id: "q1", text: "How supported did you feel by management this week?", type: "scale", avg: 3.8, trend: "up" },
        { id: "q2", text: "Do you have everything you need to do your job well?", type: "yesno", yes_pct: 0.71, trend: "stable" },
        { id: "q3", text: "One word to describe this week:", type: "text", words: ["busy", "good", "tired", "ok", "challenging"] },
      ],
      trend: [3.2, 3.4, 3.5, 3.6, 3.8, 3.7, 3.8, 3.8],
      convergence: "Q1 (management support) correlating positively with PSH_03 (Support) improvement",
    },
    {
      id: "s2", name: "Rostering satisfaction — monthly", frequency: "Monthly",
      target: "AIN + EN", response_rate: 0.64, cycle: "April 2026",
      questions: [
        { id: "q1", text: "How satisfied are you with your current roster?", type: "scale", avg: 3.2, trend: "stable" },
        { id: "q2", text: "Were your shift preferences accommodated this month?", type: "scale", avg: 2.9, trend: "down" },
      ],
      trend: [3.4, 3.5, 3.3, 3.2, 3.1, 3.2],
      convergence: "Q2 (shift preferences) declining — correlates with increased unplanned leave in AIN group",
    },
  ];

  return (
    <div className="space-y-5">
      <button onClick={() => router.push("/dashboard/workforce/pulse/new")} className="w-full py-4 border-2 border-dashed border-[#2D7D73] text-[#2D7D73] rounded-xl text-sm font-semibold hover:bg-[#F0F7F4] transition-colors flex items-center justify-center gap-2">
        <span className="text-lg">+</span> Create new pulse survey
      </button>

      {surveys.map((survey) => (
        <div key={survey.id} className="bg-card rounded-xl border border-border overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{survey.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{survey.frequency} · {survey.target} · {Math.round(survey.response_rate * 100)}% response rate</p>
              </div>
              <button className="text-xs font-medium px-3 py-1.5 border border-border text-muted-foreground rounded-lg hover:bg-muted">Full results</button>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-0.5">
                <span>Response rate — {survey.cycle}</span>
                <span>{Math.round(survey.response_rate * 100)}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full">
                <div className={`h-1.5 rounded-full ${survey.response_rate >= 0.70 ? "bg-[#2D7D73]" : survey.response_rate >= 0.50 ? "bg-[#D4A017]" : "bg-[#C4704A]"}`} style={{ width: `${survey.response_rate * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="p-4 space-y-3">
            {survey.questions.map((q) => (
              <div key={q.id}>
                <p className="text-xs text-foreground mb-1.5">{q.text}</p>
                {q.type === "scale" && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div className={`h-3 rounded-full ${(q as any).avg >= 4.0 ? "bg-[#2D7D73]" : (q as any).avg >= 3.0 ? "bg-[#D4A017]" : "bg-[#C4704A]"}`} style={{ width: `${((q as any).avg / 5) * 100}%` }} />
                    </div>
                    <span className="text-sm font-bold text-foreground">{(q as any).avg.toFixed(1)}<span className="text-[10px] font-normal text-muted-foreground">/5</span></span>
                    <span className={`text-[10px] ${(q as any).trend === "up" ? "text-[#2D7D73]" : (q as any).trend === "down" ? "text-[#C4704A]" : "text-muted-foreground/50"}`}>
                      {(q as any).trend === "up" ? "↑" : (q as any).trend === "down" ? "↓" : "—"}
                    </span>
                  </div>
                )}
                {q.type === "yesno" && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-[#FEF7F0] rounded-full overflow-hidden">
                      <div className="h-3 bg-[#2D7D73] rounded-full" style={{ width: `${(q as any).yes_pct * 100}%` }} />
                    </div>
                    <span className="text-sm font-bold text-foreground">{Math.round((q as any).yes_pct * 100)}% yes</span>
                  </div>
                )}
                {q.type === "text" && (
                  <div className="flex gap-2 flex-wrap">
                    {((q as any).words ?? []).map((w: string, i: number) => (
                      <span key={w} className={`px-3 py-1.5 rounded-full text-sm font-medium ${i === 0 ? "bg-[#1B4332] text-white" : i === 1 ? "bg-[#2D7D73] text-white text-xs" : "bg-muted text-muted-foreground text-xs"}`}>{w}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Trend */}
          <div className="px-4 pb-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Trend</p>
            <TrendLineChart labels={survey.trend.map((_, i) => `W${i + 1}`)} series={[{ name: survey.questions[0].text.slice(0, 30), color: "#2D7D73", data: survey.trend }]} threshold={3.0} yDomain={[1, 5]} height={120} compact />
          </div>

          {/* Convergence */}
          {survey.convergence && (
            <div className="mx-4 mb-4">
              <div className="bg-[#F0F7F4] rounded-lg p-3 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-[#2D7D73] mt-1 shrink-0" />
                <p className="text-xs text-foreground"><strong>CHRIS convergence:</strong> {survey.convergence}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── COMPOSITION TAB ──────────────────────────────────────────

function CompositionTab() {
  const comp = [
    { label: "RN:EN:AIN ratio", value: "19:10:71", target: "20:10:70", status: "watch" as const, detail: "RN 1% below target" },
    { label: "Permanent:Casual:Agency", value: "74:8:18", target: "75:15:10", status: "watch" as const, detail: "Agency 8pp above target" },
    { label: "Avg hours/worker/week", value: "34.2", target: "<38", status: "good" as const, detail: "Within award limits" },
    { label: "Overtime concentration", value: "3 staff", target: "<2", status: "watch" as const, detail: "Carrying 68% of all overtime" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {comp.map((c) => (
          <div key={c.label} className={`rounded-xl border p-4 ${c.status === "good" ? "border-[#2D7D73] bg-[#F0F7F4]" : "border-[#D4A017] bg-[#FFFBF0]"}`}>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">{c.label}</p>
            <p className="text-xl font-bold text-foreground">{c.value}</p>
            <p className="text-[10px] text-muted-foreground">Target: {c.target}</p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">{c.detail}</p>
          </div>
        ))}
      </div>

      {/* Agency by wing */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Agency % by wing</h3>
        {[
          { wing: "Wattle Wing", pct: 22 }, { wing: "Grevillea Wing", pct: 28 },
          { wing: "Wing A", pct: 12 }, { wing: "Wing B", pct: 14 }, { wing: "Night Team", pct: 18 },
        ].map((w) => (
          <div key={w.wing} className="flex items-center gap-3 py-2">
            <span className="text-xs text-foreground w-28 shrink-0">{w.wing}</span>
            <div className="flex-1 bg-muted rounded-full h-2">
              <div className={`h-2 rounded-full ${w.pct > 25 ? "bg-[#C4704A]" : w.pct > 15 ? "bg-[#D4A017]" : "bg-[#2D7D73]"}`} style={{ width: `${Math.min(w.pct, 100)}%` }} />
            </div>
            <span className={`text-xs font-bold w-8 ${w.pct > 25 ? "text-[#C4704A]" : w.pct > 15 ? "text-[#D4A017]" : "text-foreground"}`}>{w.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── COMPLIANCE TAB ───────────────────────────────────────────

function ComplianceTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "AHPRA current", value: `${metrics.ahpra_current_pct}%`, urgency: metrics.ahpra_current_pct < 90 ? "watch" : "good", detail: "6 expiring in 30d" },
          { label: "Training compliance", value: `${metrics.training_compliance_pct}%`, urgency: "watch", detail: "12 staff overdue" },
          { label: "Award compliance", value: "98%", urgency: "good", detail: "2 flags this month" },
        ].map((c) => (
          <div key={c.label} className={`rounded-xl border p-3 ${c.urgency === "watch" ? "border-l-4 border-l-[#D4A017] bg-[#FFFBF0] border-border" : "border-l-4 border-l-[#2D7D73] bg-[#F0F7F4] border-border"}`}>
            <p className="text-lg font-bold text-foreground">{c.value}</p>
            <p className="text-[10px] text-muted-foreground">{c.label}</p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">{c.detail}</p>
          </div>
        ))}
      </div>

      {/* Credential pipeline */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Credential expiry pipeline</h3>
        {[
          { window: "Next 30 days", count: 6, urgency: "act" },
          { window: "31–60 days", count: 3, urgency: "watch" },
          { window: "61–90 days", count: 2, urgency: "good" },
        ].map((p) => (
          <div key={p.window} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
            <span className="text-xs text-foreground">{p.window}</span>
            <span className={`text-sm font-bold ${p.urgency === "act" ? "text-[#C4704A]" : p.urgency === "watch" ? "text-[#D4A017]" : "text-foreground"}`}>{p.count} staff</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FINANCIAL TAB ────────────────────────────────────────────

function FinancialTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Labour cost/resident/day", value: `$${metrics.labour_cost_pbd}`, benchmark: "SB: $228", status: "good" },
          { label: "Care ratio", value: `${metrics.care_ratio}%`, benchmark: "SB: 70%", status: "good" },
          { label: "Agency premium/week", value: `$${metrics.agency_cost_week}`, benchmark: "$0 target", status: "watch" },
          { label: "Turnover cost YTD", value: `$${(metrics.turnover_cost_ytd / 1000).toFixed(0)}K`, benchmark: "4 exits", status: "watch" },
          { label: "Overtime/week", value: `$${metrics.overtime_cost_week}`, benchmark: "3 staff", status: "watch" },
          { label: "Leave liability", value: `$${(metrics.leave_liability / 1000).toFixed(0)}K`, benchmark: "$50K alert", status: "good" },
        ].map((m) => (
          <div key={m.label} className={`rounded-xl border p-3 ${m.status === "good" ? "border-l-4 border-l-[#2D7D73] bg-[#F0F7F4] border-border" : "border-l-4 border-l-[#D4A017] bg-[#FFFBF0] border-border"}`}>
            <p className="text-lg font-bold text-foreground">{m.value}</p>
            <p className="text-[10px] text-muted-foreground">{m.label}</p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">{m.benchmark}</p>
          </div>
        ))}
      </div>

      {/* Cost trend */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Agency + overtime cost — 8 weeks</h3>
        <TrendLineChart
          labels={["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"]}
          series={[
            { name: "Agency", color: "#D4A017", data: [1200, 1100, 980, 950, 920, 960, 950, 950] },
            { name: "Overtime", color: "#C4704A", data: [420, 380, 350, 340, 360, 320, 340, 340] },
          ]}
          yDomain={[0, 1500]}
          height={180}
        />
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-[#D4A017]" /><span className="text-[10px] text-muted-foreground">Agency</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-[#C4704A]" /><span className="text-[10px] text-muted-foreground">Overtime</span></div>
        </div>
      </div>
    </div>
  );
}
