"use client";

import { useEffect, useState } from "react";

interface DomainResult {
  domain: number;
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  gaps: string[];
}

interface ComplyResult {
  total: number;
  maxTotal: number;
  percentage: number;
  domains: DomainResult[];
  criticalGaps: Array<{ question: string; regulation: string; action: string }>;
  priorityActions: string[];
  conversionPriority: string;
}

function getScoreColor(percentage: number): string {
  if (percentage >= 75) return "var(--teal, #2D7D73)";
  if (percentage >= 50) return "var(--amber, #D4A017)";
  return "var(--terracotta, #C4704A)";
}

function getScoreLabel(percentage: number): string {
  if (percentage >= 75) return "Strong";
  if (percentage >= 50) return "Needs Attention";
  return "At Risk";
}

export default function ComplyResultsPage() {
  const [results, setResults] = useState<ComplyResult | null>(null);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("comply-results");
    if (stored) {
      setResults(JSON.parse(stored));
    }
  }, []);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
        <p className="text-gray-500">No results found. Please complete the audit first.</p>
      </div>
    );
  }

  const scoreColor = getScoreColor(results.percentage);
  const scoreLabel = getScoreLabel(results.percentage);

  return (
    <div className="min-h-screen" style={{ background: "var(--cream, #FAF7F2)" }}>
      {/* Header */}
      <header className="px-4 py-6 text-center" style={{ background: "var(--forest, #1B4332)" }}>
        <div className="max-w-lg mx-auto">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#1B4332] to-[#D4A017] flex items-center justify-center">
            <span className="text-white text-sm font-bold">C</span>
          </div>
          <h1 className="text-white text-2xl font-bold mb-1">Your Compliance Score</h1>
          <p className="text-white/60 text-sm">CHRIS Comply Audit Results</p>
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto">
        {/* Overall score */}
        <div className="bg-white rounded-xl p-6 shadow-sm text-center mb-6">
          <div
            className="text-6xl font-bold mb-2"
            style={{ color: scoreColor }}
          >
            {results.percentage}%
          </div>
          <div
            className="text-lg font-semibold mb-1"
            style={{ color: scoreColor }}
          >
            {scoreLabel}
          </div>
          <p className="text-sm text-gray-500">
            {results.total} of {results.maxTotal} points
          </p>
        </div>

        {/* Domain breakdown */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Domain Breakdown
          </h2>
          <div className="space-y-4">
            {results.domains.map((d) => (
              <div key={d.domain}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-800">{d.name}</span>
                  <span style={{ color: getScoreColor(d.percentage) }}>
                    {d.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-700"
                    style={{
                      width: `${d.percentage}%`,
                      background: getScoreColor(d.percentage),
                    }}
                  />
                </div>
                {d.gaps.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {d.gaps.length} gap{d.gaps.length > 1 ? "s" : ""} identified
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Critical gaps */}
        {results.criticalGaps.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Top Priority Gaps
            </h2>
            <div className="space-y-4">
              {results.criticalGaps.map((gap, idx) => (
                <div key={idx} className="border-l-3 pl-3" style={{ borderColor: "var(--terracotta)" }}>
                  <p className="text-sm font-medium text-gray-800 mb-1">{gap.question}</p>
                  <p className="text-xs text-gray-500 mb-1">Regulation: {gap.regulation}</p>
                  <p className="text-xs" style={{ color: "var(--forest)" }}>{gap.action}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Email capture — BELOW results */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-2" style={{ borderColor: "var(--amber)" }}>
          {!emailSubmitted ? (
            <>
              <h3 className="font-semibold mb-2" style={{ color: "var(--forest)" }}>
                Get your free monitoring dashboard
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                We'll alert you when regulations change that affect your score.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 p-3 border rounded-lg text-sm"
                />
                <button
                  onClick={async () => {
                    if (!email) return;
                    await fetch("/api/comply/submit", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email, results }),
                    });
                    setEmailSubmitted(true);
                  }}
                  disabled={!email.includes("@")}
                  className="px-4 py-3 rounded-lg text-white font-medium text-sm disabled:opacity-40"
                  style={{ background: "var(--forest)", minHeight: "44px" }}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="font-medium" style={{ color: "var(--forest)" }}>
                Check your inbox
              </p>
              <p className="text-sm text-gray-500 mt-1">
                We've sent your full results and dashboard link.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
