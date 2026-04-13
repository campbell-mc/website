"use client";

import { useState } from "react";
import { X, ChevronLeft, AlertTriangle } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

interface IncidentLogFormProps {
  onClose: () => void;
  onSubmit: (data: IncidentFormData) => void;
  mobile?: boolean;
}

export interface IncidentFormData {
  incident_type: string;
  occurred_at: string;
  wing: string;
  description: string;
  immediate_actions: string;
  medical_attention: boolean;
  sirs_category: number | null;
}

const INCIDENT_TYPES = [
  "Fall", "Fall with injury", "Medication error", "Unexpected death",
  "Missing resident", "Physical assault", "Sexual misconduct",
  "Psychological abuse", "Neglect", "Unexplained injury",
  "Infection/illness", "Other",
];

const WINGS = ["Wing A", "Wing B", "Wattle Wing", "Grevillea Wing", "Acacia Wing", "Banksia Wing", "Common areas", "External"];

const STEPS = ["Details", "Description", "SIRS", "Submit"];

export function IncidentLogForm({ onClose, onSubmit, mobile = false }: IncidentLogFormProps) {
  const [step, setStep] = useState(1);
  const [incidentType, setIncidentType] = useState("");
  const [occurredAt, setOccurredAt] = useState(new Date().toISOString().slice(0, 16));
  const [wing, setWing] = useState("");
  const [description, setDescription] = useState("");
  const [immediateActions, setImmediateActions] = useState("");
  const [medicalAttention, setMedicalAttention] = useState(false);
  const [sirsCategory, setSirsCategory] = useState<number | null>(null);
  const [assessing, setAssessing] = useState(false);
  const [assessed, setAssessed] = useState(false);
  const [assessment, setAssessment] = useState<{ recommended_category: number | null; reasoning: string; penalty_exposure: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleAssess() {
    setAssessing(true);
    // Simulate SIRS assessment (in production: POST /api/incidents/assess)
    await new Promise((r) => setTimeout(r, 1200));

    const isCat1 = ["Unexpected death", "Missing resident", "Physical assault", "Sexual misconduct", "Neglect"].includes(incidentType);
    const isCat2 = ["Fall with injury", "Medication error", "Unexplained injury"].includes(incidentType);

    setAssessment({
      recommended_category: isCat1 ? 1 : isCat2 ? 2 : null,
      reasoning: isCat1
        ? `${incidentType} meets Category 1 SIRS threshold under the Aged Care Act 2024. Notification required within 24 hours.`
        : isCat2
        ? `${incidentType} meets Category 2 SIRS threshold. Notification required within 30 days.`
        : "This incident does not appear to meet SIRS notification thresholds based on the description provided. DON to confirm.",
      penalty_exposure: isCat1 ? "$783,000 maximum penalty per contravention" : isCat2 ? "$78,000 maximum penalty per contravention" : "N/A",
    });
    setSirsCategory(isCat1 ? 1 : isCat2 ? 2 : null);
    setAssessing(false);
    setAssessed(true);
  }

  async function handleSubmit() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
    onSubmit({
      incident_type: incidentType,
      occurred_at: occurredAt,
      wing,
      description,
      immediate_actions: immediateActions,
      medical_attention: medicalAttention,
      sirs_category: sirsCategory,
    });
  }

  const containerClass = mobile
    ? "fixed inset-0 bg-background z-50 flex flex-col"
    : "fixed inset-y-0 right-0 w-[480px] bg-card border-l border-border shadow-xl z-50 flex flex-col";

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        {step > 1 && !submitted ? (
          <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-sm text-muted-foreground">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        ) : (
          <span className="text-sm font-semibold text-foreground">Log Incident</span>
        )}
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i + 1 <= step ? "w-6 bg-[#1B4332]" : "w-1.5 bg-muted"}`} />
            ))}
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Incident type</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full p-3 border border-border rounded-xl text-sm bg-background"
              >
                <option value="">Select type...</option>
                {INCIDENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Date and time</label>
              <input type="datetime-local" value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)}
                className="w-full p-3 border border-border rounded-xl text-sm bg-background" />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Wing / location</label>
              <select value={wing} onChange={(e) => setWing(e.target.value)}
                className="w-full p-3 border border-border rounded-xl text-sm bg-background">
                <option value="">Select location...</option>
                {WINGS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Description */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">What happened</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the incident..." maxLength={500}
                className="w-full p-3 border border-border rounded-xl text-sm bg-background resize-none min-h-[120px]" />
              <p className="text-[10px] text-muted-foreground text-right mt-1">{description.length}/500</p>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Immediate actions taken</label>
              <textarea value={immediateActions} onChange={(e) => setImmediateActions(e.target.value)}
                placeholder="What was done immediately..."
                className="w-full p-3 border border-border rounded-xl text-sm bg-background resize-none min-h-[80px]" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={medicalAttention} onChange={(e) => setMedicalAttention(e.target.checked)}
                className="w-4 h-4 rounded border-border" />
              <span className="text-sm text-foreground">Medical attention required</span>
            </label>
          </div>
        )}

        {/* Step 3: SIRS Assessment */}
        {step === 3 && (
          <div className="space-y-4">
            {!assessed && !assessing && (
              <div className="rounded-xl p-4" style={{ background: "rgba(27,67,50,0.05)" }}>
                <div className="flex items-start gap-3">
                  <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">SIRS Assessment</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      CHRIS will assess whether this incident requires a SIRS notification under the Aged Care Act 2024.
                    </p>
                  </div>
                </div>
                <button onClick={handleAssess} className="w-full mt-3 py-3 rounded-xl text-sm font-medium bg-[#1B4332] text-white hover:opacity-90">
                  Assess SIRS requirement
                </button>
              </div>
            )}

            {assessing && (
              <div className="rounded-xl p-6 text-center" style={{ background: "rgba(27,67,50,0.05)" }}>
                <ChrisAvatar size="medium" showGlow className="mx-auto mb-3" />
                <p className="text-sm text-foreground">Assessing SIRS requirement</p>
                <div className="flex justify-center gap-1 mt-2">
                  <span className="w-2 h-2 rounded-full bg-[#1B4332] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[#1B4332] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[#1B4332] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            {assessed && assessment && (
              <>
                <div className={`rounded-xl p-4 border-l-4 ${
                  assessment.recommended_category === 1 ? "border-l-[#C4704A] bg-[#FEF7F0]" :
                  assessment.recommended_category === 2 ? "border-l-[#D4A017] bg-[#FFFBF0]" :
                  "border-l-[#2D7D73] bg-white"
                } border border-border`}>
                  <div className="flex items-start gap-3">
                    <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        {assessment.recommended_category
                          ? `Category ${assessment.recommended_category} SIRS Event`
                          : "Not a SIRS Event"}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">{assessment.reasoning}</p>
                      {assessment.recommended_category && (
                        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#FEF7F0]">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#C4704A]" />
                          <span className="text-xs font-medium text-[#C4704A]">{assessment.penalty_exposure}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {assessment.recommended_category === 1 && (
                    <button onClick={() => setSirsCategory(1)} className={`w-full py-3 rounded-xl text-sm font-medium border transition-all ${sirsCategory === 1 ? "bg-[#C4704A] text-white border-[#C4704A]" : "border-border text-foreground hover:bg-muted"}`}>
                      Confirm Cat 1 — notify within 24h
                    </button>
                  )}
                  {assessment.recommended_category === 2 && (
                    <button onClick={() => setSirsCategory(2)} className={`w-full py-3 rounded-xl text-sm font-medium border transition-all ${sirsCategory === 2 ? "bg-[#D4A017] text-white border-[#D4A017]" : "border-border text-foreground hover:bg-muted"}`}>
                      Confirm Cat 2 — notify within 30d
                    </button>
                  )}
                  {assessment.recommended_category !== 1 && (
                    <button onClick={() => setSirsCategory(1)} className={`w-full py-3 rounded-xl text-sm font-medium border transition-all ${sirsCategory === 1 ? "bg-[#C4704A] text-white border-[#C4704A]" : "border-border text-muted-foreground hover:bg-muted"}`}>
                      Override — Cat 1
                    </button>
                  )}
                  {assessment.recommended_category !== 2 && (
                    <button onClick={() => setSirsCategory(2)} className={`w-full py-3 rounded-xl text-sm font-medium border transition-all ${sirsCategory === 2 ? "bg-[#D4A017] text-white border-[#D4A017]" : "border-border text-muted-foreground hover:bg-muted"}`}>
                      Override — Cat 2
                    </button>
                  )}
                  <button onClick={() => setSirsCategory(null)} className={`w-full py-3 rounded-xl text-sm font-medium border transition-all ${sirsCategory === null && assessed ? "bg-[#2D7D73] text-white border-[#2D7D73]" : "border-border text-muted-foreground hover:bg-muted"}`}>
                    Not SIRS
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 4: Submit */}
        {step === 4 && !submitted && (
          <div className="space-y-4">
            <div className="rounded-xl p-4 border border-border bg-card">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Summary</p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{incidentType}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="font-medium">{wing}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Medical attention</span><span className="font-medium">{medicalAttention ? "Yes" : "No"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">SIRS</span><span className="font-medium">{sirsCategory ? `Category ${sirsCategory}` : "Not SIRS"}</span></div>
              </div>
            </div>

            {sirsCategory && (
              <div className="rounded-xl p-3 bg-[#FEF7F0] border border-[#C4704A]/20">
                <p className="text-xs font-medium text-[#C4704A]">
                  SIRS Cat {sirsCategory} — {sirsCategory === 1 ? "24-hour" : "30-day"} notification deadline
                </p>
              </div>
            )}

            <div className="rounded-xl p-4" style={{ background: "rgba(27,67,50,0.05)" }}>
              <div className="flex items-start gap-3">
                <ChrisAvatar size="small" className="shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The Chronicler will prepare a draft {sirsCategory ? "SIRS notification" : "incident report"} for your review within 2 minutes.
                </p>
              </div>
            </div>
          </div>
        )}

        {submitted && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#D4EDDD] flex items-center justify-center mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <h2 className="text-lg font-bold text-foreground mb-2">Incident logged</h2>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {sirsCategory
                ? `SIRS Cat ${sirsCategory} recorded. Chronicler draft in progress.`
                : "Incident recorded. Chronicler documentation in progress."}
            </p>
            <div className="flex justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Chronicler is preparing your draft...</p>
          </div>
        )}
      </div>

      {/* Footer buttons */}
      {!submitted && (
        <div className="border-t border-border px-4 py-3">
          {step < 3 && (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 ? !incidentType || !wing : step === 2 ? !description : false}
              className="w-full py-3 rounded-xl text-sm font-medium bg-[#1B4332] text-white disabled:opacity-40 hover:opacity-90"
            >
              Continue
            </button>
          )}
          {step === 3 && assessed && (
            <button onClick={() => setStep(4)} className="w-full py-3 rounded-xl text-sm font-medium bg-[#1B4332] text-white hover:opacity-90">
              Continue to submit
            </button>
          )}
          {step === 4 && (
            <button onClick={handleSubmit} disabled={submitting} className="w-full py-3 rounded-xl text-sm font-medium bg-[#C4704A] text-white disabled:opacity-60 hover:opacity-90">
              {submitting ? "Submitting..." : "Submit incident and generate draft →"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
