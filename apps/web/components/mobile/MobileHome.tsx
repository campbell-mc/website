"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, ChevronRight, RefreshCw } from "lucide-react";
import { todays_picture, facility, financial_monthly, agent_activity } from "@/lib/seed-data";
import { currentMetrics } from "@/lib/financial-benchmarks";
import MobileActionCard from "./MobileActionCard";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const topAgent = agent_activity.find((a) => a.status === "awaiting_action") ?? agent_activity[0];

export default function MobileHome() {
  const router = useRouter();
  const [chrisExpanded, setChrisExpanded] = useState(false);

  const sentences = todays_picture.chris_text.split(/(?<=\.)\s+/).filter(Boolean);
  const preview = sentences.slice(0, 3).join(" ");
  const rest = sentences.slice(3).join(" ");

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Role switcher — horizontal scroll */}
      <div className="bg-[#1B4332]">
        <p className="px-4 pt-3 pb-2 text-[11px] font-semibold text-white uppercase tracking-wider">Demo — Switch role</p>
        <div className="flex overflow-x-auto gap-2 px-4 pb-3" style={{ scrollbarWidth: "none" }}>
          {[
            { label: "DON", href: "/dashboard" },
            { label: "FM", href: "/dashboard/fm" },
            { label: "CEO", href: "/dashboard/ceo" },
            { label: "CFO", href: "/dashboard/cfo" },
            { label: "Clinical", href: "/dashboard/clinical-director" },
            { label: "Quality", href: "/dashboard/quality-lead" },
            { label: "WHS", href: "/dashboard/whs" },
            { label: "HR", href: "/dashboard/hr" },
            { label: "Board", href: "/dashboard/board" },
            { label: "Team Lead", href: "/dashboard/team-leader" },
          ].map((r) => (
            <button key={r.label} data-has-handler="true" onClick={() => router.push(r.href)} className="shrink-0 px-4 py-2 rounded-xl bg-white/10 text-white text-[14px] font-medium active:bg-white/20">{r.label}</button>
          ))}
        </div>
      </div>

      {/* Greeting */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-gray-900">{getGreeting()}, Sarah</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">{facility.name} · Day shift</p>
          </div>
          <button data-has-handler="true" onClick={() => router.push("/dashboard/coach")} className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-[13px] font-medium text-gray-700 active:bg-gray-50">
            <Mic className="w-4 h-4" /><span>Ask</span>
          </button>
        </div>
      </div>

      {/* CHRIS Intelligence */}
      <div className="mx-4 bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#1B4332] flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold">C</span>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-gray-900">CHRIS</p>
            <p className="text-[12px] text-gray-400">Updated 2h ago</p>
          </div>
        </div>
        <p className="text-[17px] text-gray-800 leading-[1.65] mb-3">
          {preview}
          {rest && !chrisExpanded && (
            <span>... <button onClick={() => setChrisExpanded(true)} className="text-[#2D7D73] font-semibold">Read more</button></span>
          )}
          {chrisExpanded && (
            <span> {rest} <button onClick={() => setChrisExpanded(false)} className="text-[#2D7D73] font-semibold">Show less</button></span>
          )}
        </p>
        <div className="flex gap-4 pt-3 border-t border-gray-50">
          <button className="text-[13px] text-[#2D7D73] font-medium flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" />Refresh</button>
          <button data-has-handler="true" onClick={() => router.push("/dashboard/coach")} className="text-[13px] text-gray-400 font-medium">Ask CHRIS</button>
        </div>
      </div>

      {/* Agent Pulse — animated scrolling ticker */}
      <div className="mx-4 rounded-xl overflow-hidden relative" style={{ background: "#F0F4F2" }}>
        <div className="absolute left-0 top-0 bottom-0 w-6 z-10" style={{ background: "linear-gradient(to right, #F0F4F2, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-6 z-10" style={{ background: "linear-gradient(to left, #F0F4F2, transparent)" }} />
        <div className="flex items-center py-3 animate-agent-scroll">
          {[...agent_activity, ...agent_activity].map((agent, i) => {
            const COLORS: Record<string, string> = { Sentinel: "#1B4332", Oracle: "#2D7D73", Steward: "#4A8C6F", Chronicler: "#B8900F", Keeper: "#C4704A", "Town Crier": "#7C5CBF" };
            return (
              <div key={`${agent.name}-${i}`} className="flex items-center gap-2 shrink-0 mx-3">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${agent.status === "active" ? "animate-pulse" : ""}`} style={{ backgroundColor: agent.status === "awaiting_action" ? "#D4A017" : COLORS[agent.name] || "#1B4332" }} />
                <span className="text-[12px] font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: COLORS[agent.name] || "#1B4332" }}>{agent.name}</span>
                <span className="text-[12px] text-gray-500 whitespace-nowrap">{agent.last_action.substring(0, 30)}...</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Domain Strip */}
      <div className="px-4">
        <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Across your domains</p>
        <div className="flex flex-col gap-2">
          {todays_picture.domain_status.map((d) => {
            const routes: Record<string, string> = { Clinical: "/dashboard/clinical", Workforce: "/dashboard/workforce", Governance: "/dashboard/compliance", Financial: "/dashboard/financial", Operations: "/dashboard/operations" };
            return (
              <button key={d.domain} data-has-handler="true" onClick={() => router.push(routes[d.domain] || "/dashboard/residents")} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 text-left active:bg-gray-50">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${d.status === "ok" ? "bg-[#2D7D73]" : "bg-[#D4A017]"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-gray-900">{d.domain}</p>
                  <p className="text-[13px] text-gray-500 leading-snug mt-0.5">{d.summary}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 mt-1" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4">
        <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Needs your attention</p>
        <div className="flex flex-col gap-3">
          <MobileActionCard severity="immediate" title="Corrective action — 58 days overdue" description="Wing B bathroom falls prevention. Grab rail assessment not done." penaltyRisk="Overdue corrective actions are ACQSC audit risk" actionLabel="Assign now →" route="/dashboard/compliance" />
          <MobileActionCard severity="urgent" title="Board Pack approval — 8 days" description="Meeting 17 April. CHRIS draft ready. 35 min review." actionLabel="Start review →" route="/dashboard/reporting" />
          <MobileActionCard severity="routine" title="QI submission due in 9 days" description="Q2 Quality Indicators. CHRIS draft ready for review." actionLabel="Review submission →" route="/dashboard/quality" />
        </div>
      </div>

      {/* Financial snapshot 2x2 */}
      <div className="px-4">
        <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Financial snapshot</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: `${currentMetrics.careRatio}%`, label: "Care ratio", alert: false },
            { value: `$${Math.round(financial_monthly[financial_monthly.length - 1].expenditure.direct_care_agency / 1000)}K`, label: "Agency cost", alert: true },
            { value: `${Math.round(currentMetrics.occupancy * 100)}%`, label: "Occupancy", alert: false },
            { value: "+$190", label: "Tonight premium", alert: true },
          ].map((s) => (
            <div key={s.label} className={`bg-white rounded-2xl border p-4 min-h-[88px] flex flex-col justify-between ${s.alert ? "border-l-4 border-l-[#D4A017] bg-[#FFFBF0] border-gray-100" : "border-gray-100"}`}>
              <span className={`text-[32px] font-bold leading-none ${s.alert ? "text-[#C4704A]" : "text-gray-900"}`}>{s.value}</span>
              <span className="text-[12px] uppercase tracking-wide text-gray-500 font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
