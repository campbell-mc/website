"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DOMAIN_NAMES = [
  "",
  "Psychosocial Safety",
  "Incident Management / SIRS",
  "Care Quality",
  "Workforce",
  "Governance",
];

const QUESTIONS = [
  // Domain 1
  { id: "psh_1", domain: 1, text: "Do you have a documented psychosocial hazard management plan?" },
  { id: "psh_2", domain: 1, text: "Has a formal psychosocial hazard assessment been done in the last 12 months?" },
  { id: "psh_3", domain: 1, text: "Do you run regular pulse surveys or equivalent psychosocial measurement?" },
  { id: "psh_4", domain: 1, text: "Do frontline team leaders receive structured support to manage psychological safety?" },
  { id: "psh_5", domain: 1, text: "Do you have documented intervention procedures for identified hazards?" },
  // Domain 2
  { id: "sirs_1", domain: 2, text: "Is your SIRS reporting process documented and understood by relevant staff?" },
  { id: "sirs_2", domain: 2, text: "Have all Category 1 incidents been reported within 24 hours this year?" },
  { id: "sirs_3", domain: 2, text: "Do you have a process to identify SIRS-reportable incidents at point of occurrence?" },
  { id: "sirs_4", domain: 2, text: "Are SIRS incidents reviewed for patterns and systemic issues?" },
  // Domain 3
  { id: "care_1", domain: 3, text: "Do you monitor care minutes compliance daily?" },
  { id: "care_2", domain: 3, text: "Have you consistently met the 215 min/resident/day target this past quarter?" },
  { id: "care_3", domain: 3, text: "Is RN 24/7 coverage maintained with a documented contingency process?" },
  { id: "care_4", domain: 3, text: "Do you submit quality indicator data to ACQSC on time quarterly?" },
  // Domain 4
  { id: "wf_1", domain: 4, text: "Is your agency dependency below 15% of total care hours?" },
  { id: "wf_2", domain: 4, text: "Do you have a formal workforce risk assessment process?" },
  { id: "wf_3", domain: 4, text: "Are all mandatory training requirements tracked and current?" },
  // Domain 5
  { id: "gov_1", domain: 5, text: "Does your Board receive quarterly operational reports including safety and quality?" },
  { id: "gov_2", domain: 5, text: "Is there a Quality and Risk Committee meeting at least quarterly?" },
  { id: "gov_3", domain: 5, text: "Do you have an audit-ready compliance evidence pack available at any time?" },
];

type Response = "yes" | "partially" | "no" | "unsure";

const RESPONSE_OPTIONS: Array<{ value: Response; label: string }> = [
  { value: "yes", label: "Yes" },
  { value: "partially", label: "Partially" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Unsure" },
];

export default function ComplyAuditPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = provider info, 1-5 = domains
  const [providerInfo, setProviderInfo] = useState({
    name: "",
    state: "",
    careType: "residential",
    bedCount: "",
  });
  const [answers, setAnswers] = useState<Record<string, Response>>({});
  const [submitting, setSubmitting] = useState(false);

  const currentDomain = step;
  const domainQuestions = QUESTIONS.filter((q) => q.domain === currentDomain);
  const totalSteps = 6; // 0 = intro + 5 domains
  const progress = Math.round((step / totalSteps) * 100);

  function setAnswer(questionId: string, response: Response) {
    setAnswers((prev) => ({ ...prev, [questionId]: response }));
  }

  function canProgress(): boolean {
    if (step === 0) return providerInfo.name.length > 0 && providerInfo.state.length > 0;
    return domainQuestions.every((q) => answers[q.id]);
  }

  async function handleSubmit() {
    setSubmitting(true);
    const formattedAnswers = Object.entries(answers).map(([questionId, response]) => ({
      questionId,
      response,
    }));

    try {
      const res = await fetch("/api/comply/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerInfo, answers: formattedAnswers }),
      });

      if (res.ok) {
        const data = await res.json();
        // Store results for the results page
        sessionStorage.setItem("comply-results", JSON.stringify(data));
        router.push("/comply/results");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--cream, #FAF7F2)" }}>
      {/* Header */}
      <header className="px-4 py-4" style={{ background: "var(--forest, #1B4332)" }}>
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1B4332] to-[#D4A017] flex items-center justify-center">
              <span className="text-white text-xs font-bold">C</span>
            </div>
            <h1 className="text-white font-semibold">CHRIS Comply</h1>
          </div>
          <p className="text-white/70 text-sm mb-3">Free 15-minute compliance audit</p>
          {/* Progress bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "var(--amber, #D4A017)" }}
            />
          </div>
          <p className="text-white/50 text-xs mt-1">
            {step === 0 ? "Your details" : `Domain ${step} of 5 — ${DOMAIN_NAMES[step]}`}
          </p>
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto">
        {/* Step 0: Provider info */}
        {step === 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--forest)" }}>
              About your organisation
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organisation name</label>
                <input
                  type="text"
                  value={providerInfo.name}
                  onChange={(e) => setProviderInfo((p) => ({ ...p, name: e.target.value }))}
                  className="w-full p-3 border rounded-lg text-sm"
                  placeholder="e.g. Sunrise Aged Care"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select
                  value={providerInfo.state}
                  onChange={(e) => setProviderInfo((p) => ({ ...p, state: e.target.value }))}
                  className="w-full p-3 border rounded-lg text-sm"
                >
                  <option value="">Select state...</option>
                  <option value="NSW">New South Wales</option>
                  <option value="VIC">Victoria</option>
                  <option value="QLD">Queensland</option>
                  <option value="SA">South Australia</option>
                  <option value="WA">Western Australia</option>
                  <option value="TAS">Tasmania</option>
                  <option value="NT">Northern Territory</option>
                  <option value="ACT">Australian Capital Territory</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Care type</label>
                <select
                  value={providerInfo.careType}
                  onChange={(e) => setProviderInfo((p) => ({ ...p, careType: e.target.value }))}
                  className="w-full p-3 border rounded-lg text-sm"
                >
                  <option value="residential">Residential</option>
                  <option value="home_care">Home Care</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bed / client count</label>
                <select
                  value={providerInfo.bedCount}
                  onChange={(e) => setProviderInfo((p) => ({ ...p, bedCount: e.target.value }))}
                  className="w-full p-3 border rounded-lg text-sm"
                >
                  <option value="">Select range...</option>
                  <option value="1-50">1-50</option>
                  <option value="51-100">51-100</option>
                  <option value="101-200">101-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Steps 1-5: Domain questions */}
        {step >= 1 && step <= 5 && (
          <div>
            <h2 className="text-xl font-semibold mb-1" style={{ color: "var(--forest)" }}>
              {DOMAIN_NAMES[step]}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {domainQuestions.length} questions
            </p>
            <div className="space-y-6">
              {domainQuestions.map((q, idx) => (
                <div key={q.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm font-medium text-gray-800 mb-3">
                    {idx + 1}. {q.text}
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {RESPONSE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setAnswer(q.id, opt.value)}
                        className={`py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                          answers[q.id] === opt.value
                            ? "text-white shadow-md"
                            : "bg-gray-100 text-gray-600"
                        }`}
                        style={
                          answers[q.id] === opt.value
                            ? {
                                background:
                                  opt.value === "yes"
                                    ? "var(--teal, #2D7D73)"
                                    : opt.value === "partially"
                                      ? "var(--amber, #D4A017)"
                                      : "var(--terracotta, #C4704A)",
                              }
                            : undefined
                        }
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 rounded-lg border-2 font-medium text-sm"
              style={{ borderColor: "var(--forest)", color: "var(--forest)", minHeight: "44px" }}
            >
              Back
            </button>
          )}
          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProgress()}
              className="flex-1 py-3 rounded-lg text-white font-medium text-sm disabled:opacity-40"
              style={{ background: "var(--forest)", minHeight: "44px" }}
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProgress() || submitting}
              className="flex-1 py-3 rounded-lg text-white font-medium text-sm disabled:opacity-40"
              style={{ background: "var(--forest)", minHeight: "44px" }}
            >
              {submitting ? "Calculating..." : "See My Results"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
