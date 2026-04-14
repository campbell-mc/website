"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SuiteReport, Verdict } from "@/lib/simulation/types";

const SUITES = [
  { id: "all", label: "All Scenarios", count: 28 },
  { id: "sentinel", label: "Sentinel", count: 8 },
  { id: "oracle", label: "Oracle", count: 4 },
  { id: "keeper", label: "Keeper", count: 4 },
  { id: "multi", label: "Multi-Agent", count: 4 },
  { id: "home_care", label: "Home Care", count: 8 },
];

export default function SimulationPage() {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState("all");
  const [report, setReport] = useState<SuiteReport | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function runSimulation() {
    setRunning(true);
    setReport(null);
    try {
      const res = await fetch("/api/simulation/run", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ suite: selectedSuite }) });
      const data = await res.json();
      setReport(data);
    } catch (e) {
      console.error("Simulation failed:", e);
    }
    setRunning(false);
  }

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[28px] md:text-xl font-bold text-gray-900">Agent Simulation</h1>
          <p className="text-[13px] md:text-sm text-gray-500 mt-0.5">Run agents through scripted scenarios · Measure accuracy</p>
        </div>
        <button onClick={runSimulation} disabled={running} className={`text-sm font-medium px-4 py-2.5 rounded-xl ${running ? "bg-gray-200 text-gray-400" : "bg-[#1B4332] text-white hover:opacity-90"}`}>
          {running ? "Running..." : "Run Suite"}
        </button>
      </div>

      {/* Suite selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
        {SUITES.map((s) => (
          <button key={s.id} onClick={() => setSelectedSuite(s.id)} className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedSuite === s.id ? "bg-[#1B4332] text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
            {s.label} <span className="text-xs opacity-60">({s.count})</span>
          </button>
        ))}
      </div>

      {/* Running state */}
      {running && (
        <div className="bg-[#F0F7F4] rounded-2xl border border-[#2D7D73] p-6 text-center mb-5">
          <div className="flex justify-center gap-1 mb-3">
            {[0, 1, 2].map((i) => <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#2D7D73] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
          </div>
          <p className="text-sm text-gray-700">Running 8 Sentinel scenarios...</p>
          <p className="text-xs text-gray-500 mt-1">Testing care minutes, SIRS deadlines, connectors, compliance, PSH convergence</p>
        </div>
      )}

      {/* Results */}
      {report && (
        <>
          {/* Summary */}
          <div className={`rounded-2xl border p-5 mb-5 ${report.passed === report.total_scenarios ? "bg-[#F0F7F4] border-[#2D7D73]" : "bg-[#FFFBF0] border-[#D4A017]"}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-2xl font-bold text-gray-900">{report.passed}/{report.total_scenarios} passed</p>
                <p className="text-sm text-gray-500">{report.duration_ms}ms · {new Date(report.run_at).toLocaleTimeString("en-AU")}</p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${report.overall_score >= 0.8 ? "text-[#2D7D73]" : report.overall_score >= 0.6 ? "text-[#D4A017]" : "text-[#C4704A]"}`}>
                  {Math.round(report.overall_score * 100)}%
                </p>
                <p className="text-xs text-gray-500">Overall score</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-[#2D7D73]">{report.passed}</p>
                <p className="text-[10px] text-gray-500">Passed</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-[#C4704A]">{report.failed}</p>
                <p className="text-[10px] text-gray-500">Failed</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-gray-900">{report.total_scenarios}</p>
                <p className="text-[10px] text-gray-500">Total</p>
              </div>
            </div>
          </div>

          {/* Individual verdicts */}
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Scenario results</p>
          <div className="space-y-3">
            {report.verdicts.map((v) => (
              <div key={v.scenario_id} className={`rounded-2xl border overflow-hidden ${v.pass ? "border-[#2D7D73] bg-white" : "border-[#C4704A] bg-[#FEF7F0]"}`}>
                <button onClick={() => setExpanded(expanded === v.scenario_id ? null : v.scenario_id)} className="w-full flex items-center gap-3 p-4 text-left">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${v.pass ? "bg-[#F0F7F4] text-[#2D7D73]" : "bg-[#FEF7F0] text-[#C4704A]"}`}>
                    {v.pass ? "✓" : "✗"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{v.scenario_name}</p>
                    <p className="text-xs text-gray-500">
                      Detection: {Math.round(v.detection_rate * 100)}% · Silence: {Math.round(v.silence_rate * 100)}% · {v.findings_count} findings · {v.duration_ms}ms
                    </p>
                  </div>
                  <span className={`text-lg font-bold shrink-0 ${v.overall_score >= 0.8 ? "text-[#2D7D73]" : v.overall_score >= 0.6 ? "text-[#D4A017]" : "text-[#C4704A]"}`}>
                    {Math.round(v.overall_score * 100)}%
                  </span>
                </button>

                {expanded === v.scenario_id && (
                  <div className="border-t border-gray-100 p-4 space-y-3">
                    {/* Detections */}
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Expected detections</p>
                      {v.detections.map((d, i) => (
                        <div key={i} className="flex items-center gap-2 py-1">
                          <span className={`text-sm ${d.found ? "text-[#2D7D73]" : "text-[#C4704A]"}`}>{d.found ? "✓" : "✗"}</span>
                          <span className="text-xs text-gray-700 flex-1">{d.expected.description}</span>
                          {d.found && <span className="text-[10px] text-gray-400">tick {d.tick_detected}</span>}
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${d.expected.severity === "immediate" ? "bg-[#FEF7F0] text-[#C4704A]" : "bg-[#FFFBF0] text-[#D4A017]"}`}>
                            {d.expected.severity}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Silence checks */}
                    {v.silence_checks.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">False positive tests</p>
                        {v.silence_checks.map((s, i) => (
                          <div key={i} className="flex items-center gap-2 py-1">
                            <span className={`text-sm ${s.silent ? "text-[#2D7D73]" : "text-[#C4704A]"}`}>{s.silent ? "✓" : "✗"}</span>
                            <span className="text-xs text-gray-700">Should NOT fire: {s.expected.should_not_fire}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Scores */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Detection", value: v.detection_rate },
                        { label: "Silence", value: v.silence_rate },
                        { label: "Timeliness", value: v.timeliness_score },
                      ].map((s) => (
                        <div key={s.label} className="bg-gray-50 rounded-lg p-2 text-center">
                          <p className={`text-sm font-bold ${s.value >= 0.8 ? "text-[#2D7D73]" : s.value >= 0.5 ? "text-[#D4A017]" : "text-[#C4704A]"}`}>
                            {Math.round(s.value * 100)}%
                          </p>
                          <p className="text-[10px] text-gray-500">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {!running && !report && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F0F7F4] flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⬡</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Agent Simulation Engine</h2>
          <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
            Run CHRIS agents through 28 scripted aged care scenarios across residential and home care. Sentinel (8), Oracle (4), Keeper (4), multi-agent coordination (4), and Home Care (8) — testing care minutes, SIRS, revenue intelligence, workforce signals, lone worker safety, visit compliance, and cross-agent prioritisation.
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Each scenario has ground truth — expected detections, expected silence (false positive tests), and weighted scoring rubric.
          </p>
          <button onClick={runSimulation} className="px-6 py-3 bg-[#1B4332] text-white rounded-xl text-sm font-medium hover:opacity-90">
            Run All 28 Scenarios →
          </button>
        </div>
      )}

      <div className="h-16" />
    </div>
  );
}
