"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

interface DocumentSection {
  id: string;
  title: string;
  content: string;
  editable: boolean;
  required: boolean;
  placeholder?: string;
  type: "text" | "textarea" | "date" | "select" | "readonly";
  options?: string[];
}

interface CHRISDocumentViewerProps {
  documentId: string;
  documentType: string;
  title: string;
  subtitle: string;
  generatedBy: "chronicler" | "oracle" | "sentinel" | "chris";
  generatedAt: string;
  status: "draft" | "ready" | "approved" | "submitted";
  regulatoryDeadline?: string;
  penaltyExposure?: string;
  sections: DocumentSection[];
  submitLabel: string;
  submitDestination: string;
  onApprove?: () => void;
  onSubmit?: () => void;
  onReject?: () => void;
  requiresAllSections?: boolean;
}

const AGENT_COLORS: Record<string, string> = { chronicler: "#D4A017", oracle: "#2D7D73", sentinel: "#1B4332", chris: "#1B4332" };
const AGENT_LABELS: Record<string, string> = { chronicler: "The Chronicler", oracle: "The Oracle", sentinel: "The Sentinel", chris: "CHRIS" };

const STATUS_STYLES: Record<string, string> = {
  submitted: "bg-[#F0F7F4] text-[#1B4332]", approved: "bg-[#F0F7F4] text-[#2D7D73]",
  ready: "bg-amber-50 text-amber-700", draft: "bg-gray-100 text-gray-600",
};

export function CHRISDocumentViewer({
  documentId, documentType, title, subtitle, generatedBy, generatedAt, status,
  regulatoryDeadline, penaltyExposure, sections, submitLabel, submitDestination,
  onApprove, onSubmit, onReject, requiresAllSections = true,
}: CHRISDocumentViewerProps) {
  const router = useRouter();
  const [edited, setEdited] = useState<Record<string, string>>(Object.fromEntries(sections.map((s) => [s.id, s.content])));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const requiredSections = sections.filter((s) => s.required);
  const completedRequired = requiredSections.filter((s) => edited[s.id]?.trim().length > 0 && !edited[s.id]?.includes("[REVIEW REQUIRED")).length;
  const allComplete = completedRequired === requiredSections.length;
  const hoursRemaining = regulatoryDeadline ? Math.round((new Date(regulatoryDeadline).getTime() - Date.now()) / (1000 * 60 * 60)) : null;

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      await fetch(`/api/documents/${documentId}/submit`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: edited, submit_destination: submitDestination }),
      });
      setSubmitted(true);
      onSubmit?.();
    } catch (e) { console.error("Submission failed:", e); }
    setIsSubmitting(false);
    setShowConfirm(false);
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#D4EDDD] flex items-center justify-center mx-auto mb-4"><span className="text-2xl">✓</span></div>
        <h2 className="text-xl font-bold text-foreground mb-2">Submitted successfully</h2>
        <p className="text-sm text-muted-foreground mb-6">{title} has been submitted to {submitDestination}. The Chronicler has filed a copy in your compliance record.</p>
        <button onClick={() => router.back()} className="px-6 py-3 bg-[#1B4332] text-white rounded-xl text-sm font-medium">Back to dashboard</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-card rounded-xl border border-border p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: AGENT_COLORS[generatedBy] }}>
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Draft prepared by {AGENT_LABELS[generatedBy]}</p>
            <p className="text-[10px] text-muted-foreground">{new Date(generatedAt).toLocaleString("en-AU")} · Requires your review</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[status]}`}>
            {status === "submitted" ? "✓ Submitted" : status === "approved" ? "✓ Approved" : status === "ready" ? "Ready for review" : "Draft"}
          </span>
        </div>

        <h1 className="text-xl font-bold text-foreground mb-1">{title}</h1>
        <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>

        {/* Deadline */}
        {regulatoryDeadline && hoursRemaining !== null && (
          <div className={`rounded-xl p-4 mb-4 ${hoursRemaining < 6 ? "bg-[#FEF7F0] border border-[#C4704A]" : hoursRemaining < 24 ? "bg-[#FFFBF0] border border-[#D4A017]" : "bg-muted/30 border border-border"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold ${hoursRemaining < 6 ? "text-[#C4704A]" : hoursRemaining < 24 ? "text-[#D4A017]" : "text-foreground"}`}>
                  Deadline: {new Date(regulatoryDeadline).toLocaleString("en-AU")}
                </p>
                {penaltyExposure && <p className="text-xs font-semibold text-[#C4704A] mt-0.5">⚠ {penaltyExposure}</p>}
              </div>
              <span className={`text-2xl font-bold ${hoursRemaining < 6 ? "text-[#C4704A]" : hoursRemaining < 24 ? "text-[#D4A017]" : "text-foreground"}`}>
                {hoursRemaining < 24 ? `${hoursRemaining}h` : `${Math.round(hoursRemaining / 24)}d`}
              </span>
            </div>
          </div>
        )}

        {/* Progress */}
        {requiresAllSections && requiredSections.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div className="h-2 rounded-full bg-[#2D7D73] transition-all" style={{ width: `${(completedRequired / requiredSections.length) * 100}%` }} />
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{completedRequired}/{requiredSections.length} required fields</span>
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="bg-card rounded-xl border border-border p-5 mb-4">
        <div className="space-y-5">
          {sections.map((section, i) => (
            <div key={section.id}>
              {i > 0 && <div className="border-t border-border mb-5" />}
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-foreground">
                  {section.title}{section.required && <span className="text-[#C4704A] ml-1">*</span>}
                </label>
                {!section.editable && <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">Auto-populated</span>}
              </div>

              {section.type === "readonly" ? (
                <div className="bg-muted/30 rounded-lg p-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap">{edited[section.id]}</div>
              ) : section.type === "textarea" ? (
                <textarea
                  value={edited[section.id]} onChange={(e) => setEdited((p) => ({ ...p, [section.id]: e.target.value }))}
                  disabled={!section.editable} rows={4} placeholder={section.placeholder}
                  className={`w-full rounded-lg border p-3 text-sm leading-relaxed resize-none bg-background ${
                    section.editable ? "border-border focus:border-[#2D7D73]" : "border-border bg-muted/30 text-muted-foreground"
                  } ${edited[section.id]?.includes("[REVIEW REQUIRED") ? "border-amber-300 bg-amber-50/50" : ""}`}
                />
              ) : section.type === "select" ? (
                <select value={edited[section.id]} onChange={(e) => setEdited((p) => ({ ...p, [section.id]: e.target.value }))}
                  disabled={!section.editable} className="w-full rounded-lg border border-border p-3 text-sm bg-background">
                  {section.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : section.type === "date" ? (
                <input type="date" value={edited[section.id]} onChange={(e) => setEdited((p) => ({ ...p, [section.id]: e.target.value }))}
                  disabled={!section.editable} className="w-full rounded-lg border border-border p-3 text-sm bg-background" />
              ) : (
                <input type="text" value={edited[section.id]} onChange={(e) => setEdited((p) => ({ ...p, [section.id]: e.target.value }))}
                  disabled={!section.editable} placeholder={section.placeholder}
                  className={`w-full rounded-lg border p-3 text-sm bg-background ${section.editable ? "border-border" : "border-border bg-muted/30 text-muted-foreground"}`} />
              )}

              {edited[section.id]?.includes("[REVIEW REQUIRED") && (
                <p className="text-xs text-amber-600 mt-1">⚠ This field requires your input before submission</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-muted/30 rounded-xl p-4 mb-4">
        <p className="text-[10px] text-muted-foreground"><strong>DRAFT PREPARED BY CHRIS — REQUIRES YOUR REVIEW AND APPROVAL BEFORE USE.</strong> You are responsible for verifying all details before submission. CHRIS cannot submit to GPMS on your behalf.</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mb-8">
        <button onClick={() => setShowConfirm(true)} disabled={requiresAllSections && !allComplete}
          className={`w-full py-3.5 rounded-xl text-sm font-medium ${allComplete || !requiresAllSections ? "bg-[#1B4332] text-white" : "bg-muted text-muted-foreground cursor-not-allowed"}`}>
          {submitLabel}
        </button>
        {!allComplete && requiresAllSections && <p className="text-xs text-center text-amber-600">Complete all required fields (*) before submitting</p>}
        <div className="flex gap-3">
          <button onClick={onApprove} className="flex-1 py-3 border border-[#1B4332] text-[#1B4332] rounded-xl text-sm font-medium">Approve as-is</button>
          <button onClick={onReject} className="flex-1 py-3 border border-border text-muted-foreground rounded-xl text-sm font-medium">Request revision</button>
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
          <div className="bg-card rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-foreground mb-2">Confirm submission</h3>
            <p className="text-sm text-muted-foreground mb-4">You are confirming that you have reviewed this document and the information is accurate. This action will be logged.</p>
            {penaltyExposure && <p className="text-xs font-semibold text-[#C4704A] mb-4">⚠ {penaltyExposure}</p>}
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 border border-border text-muted-foreground rounded-xl font-medium">Cancel</button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 py-3 bg-[#1B4332] text-white rounded-xl font-medium">{isSubmitting ? "Submitting..." : "Confirm"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
