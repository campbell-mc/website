"use client";

import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Mic, Clock } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { useState } from "react";

export default function SIRSIncidentDetail() {
  const router = useRouter();
  const params = useParams();
  const [showDraftReview, setShowDraftReview] = useState(false);
  const [draftStep, setDraftStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // --- Draft Review Full-Screen ---
  if (showDraftReview) {
    if (submitted) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "hsl(var(--background))" }}>
          <div className="w-16 h-16 rounded-full bg-[hsl(150_25%_96%)] flex items-center justify-center mb-4"><span className="text-2xl">✅</span></div>
          <p className="text-lg font-bold text-foreground mb-1">SIRS notification submitted</p>
          <p className="text-xs text-muted-foreground mb-1">Reference: SIRS-2026-0421</p>
          <p className="text-xs text-muted-foreground mb-4">30-day corrective action review due: 3 May 2026</p>
          <button onClick={() => { setShowDraftReview(false); setSubmitted(false); }} className="text-sm font-medium px-6 py-3 rounded-xl bg-primary text-primary-foreground">← Back to SIRS Register</button>
        </div>
      );
    }

    return (
      <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
        <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button onClick={() => setShowDraftReview(false)} className="text-sm text-muted-foreground">✕ Exit</button>
            <span className="text-sm font-semibold text-foreground">SIRS Draft Review</span>
            <span className="text-xs text-muted-foreground font-mono">22 days</span>
          </div>
          {/* Step indicator */}
          <div className="max-w-2xl mx-auto flex gap-1 mt-2">
            {["Incident", "Clinical", "Notifications", "Actions", "Submit"].map((s, i) => (
              <div key={s} className={`flex-1 h-1 rounded-full ${i + 1 <= draftStep ? "bg-[hsl(var(--brand-forest))]" : "bg-muted"}`} />
            ))}
          </div>
          <div className="max-w-2xl mx-auto flex gap-1 mt-1">
            {["Incident", "Clinical", "Notifications", "Actions", "Submit"].map((s, i) => (
              <span key={s} className={`flex-1 text-[8px] text-center ${i + 1 === draftStep ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6">
          {draftStep === 1 && (
            <div className="animate-slideUp">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-3">Step 1 · Incident Details</p>
              <div className="space-y-3">
                <div className="bg-card rounded-lg p-3 border border-border">
                  <p className="text-[10px] text-muted-foreground mb-1">Incident type</p>
                  <p className="text-sm text-foreground">Fall resulting in serious injury (hip fracture)</p>
                </div>
                <div className="bg-card rounded-lg p-3 border border-border">
                  <p className="text-[10px] text-muted-foreground mb-1">Classification</p>
                  <p className="text-sm text-foreground">Category 2 — fall with major injury</p>
                </div>
                <div className="bg-card rounded-lg p-3 border border-border">
                  <p className="text-[10px] text-muted-foreground mb-1">Date and time</p>
                  <p className="text-sm text-foreground">3 Apr 2026 · 14:15</p>
                </div>
                <div className="bg-card rounded-lg p-3 border border-border">
                  <p className="text-[10px] text-muted-foreground mb-1">Location</p>
                  <p className="text-sm text-foreground">Wing A — Bedroom</p>
                </div>
                <div className="bg-card rounded-lg p-3 border border-border">
                  <p className="text-[10px] text-muted-foreground mb-1">Description (CHRIS drafted)</p>
                  <textarea className="w-full text-sm text-foreground bg-background border border-border rounded p-2 min-h-[80px]" defaultValue="A resident was found on the floor of their bedroom at 14:15 by the RN on duty. The resident reported pain in their right hip. X-ray at hospital confirmed a fractured neck of femur." />
                </div>
                <div className="card-amber rounded-lg p-3">
                  <p className="text-xs text-foreground font-medium">⚠️ Add before submitting:</p>
                  <p className="text-xs text-muted-foreground mt-1">Resident name · Room number</p>
                  <input placeholder="Resident name" className="mt-2 w-full text-sm p-2 border border-border rounded bg-background" />
                  <input placeholder="Room number" className="mt-1 w-full text-sm p-2 border border-border rounded bg-background" />
                </div>
              </div>
              <button onClick={() => setDraftStep(2)} className="w-full mt-4 py-3 rounded-xl font-medium text-white bg-primary hover:opacity-90">✅ Mark section complete →</button>
            </div>
          )}

          {draftStep === 2 && (
            <div className="animate-slideUp">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-3">Step 2 · Clinical Response</p>
              <div className="space-y-3">
                {[
                  { label: "Medical notification", value: "GP notified at 14:40 ✅", input: "GP name" },
                  { label: "Hospital transfer", value: "Ambulance called 14:50 · Transfer 15:30 ✅", input: "Hospital name" },
                  { label: "Family notification", value: "Notified at 15:00 ✅", input: "Relationship" },
                  { label: "Post-incident care", value: "Pain management administered ✅" },
                ].map((item) => (
                  <div key={item.label} className="bg-card rounded-lg p-3 border border-border">
                    <p className="text-[10px] text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-sm text-foreground">{item.value}</p>
                    {item.input && <input placeholder={item.input} className="mt-1 w-full text-sm p-2 border border-border rounded bg-background" />}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setDraftStep(1)} className="flex-1 py-3 rounded-xl font-medium border border-border text-foreground hover:bg-muted">← Back</button>
                <button onClick={() => setDraftStep(3)} className="flex-1 py-3 rounded-xl font-medium text-white bg-primary hover:opacity-90">✅ Mark complete →</button>
              </div>
            </div>
          )}

          {draftStep >= 3 && draftStep < 5 && (
            <div className="animate-slideUp">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-3">Step {draftStep} · {draftStep === 3 ? "Notifications" : "Actions Taken"}</p>
              <div className="bg-card rounded-xl p-4 border border-border mb-4">
                <p className="text-xs text-muted-foreground">
                  {draftStep === 3 ? "DON notified at 14:45 (auto). Quality Lead notified. ACQSC notification = this submission." : "Immediate actions: Pain management, GP notified, family notified, ambulance, hospital transfer. Ongoing: Fall risk review in progress, care plan update scheduled."}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setDraftStep(draftStep - 1)} className="flex-1 py-3 rounded-xl font-medium border border-border text-foreground">← Back</button>
                <button onClick={() => setDraftStep(draftStep + 1)} className="flex-1 py-3 rounded-xl font-medium text-white bg-primary">��� Mark complete →</button>
              </div>
            </div>
          )}

          {draftStep === 5 && (
            <div className="animate-slideUp">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-3">Step 5 · Submit</p>
              <div className="space-y-2 mb-4">
                {["Incident details complete", "Resident details added", "Clinical response documented", "Notifications recorded", "Actions documented", "Within 30-day window (22 days remaining)"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2"><span className="text-[hsl(var(--brand-teal))]">✅</span><p className="text-xs text-muted-foreground">{item}</p></div>
                ))}
              </div>
              <div className="bg-card rounded-xl p-4 border border-border mb-4">
                <p className="text-xs text-muted-foreground mb-1">I confirm this notification is accurate to the best of my knowledge.</p>
                <p className="text-sm font-medium text-foreground">Sarah Mitchell · Director of Nursing</p>
              </div>
              <button onClick={() => setSubmitted(true)} className="w-full py-3.5 rounded-xl font-medium text-white bg-primary hover:opacity-90">Submit to ACQSC via GPMS →</button>
              <p className="text-[10px] text-muted-foreground text-center mt-2">Category 2 · Harbison Bowral · Will be recorded by ACQSC</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Main Incident Detail ---
  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/dashboard/sirs")} className="p-1 -ml-1 hover:bg-muted rounded-lg"><ChevronLeft className="w-5 h-5 text-foreground" /></button>
          <div>
            <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">SIRS — Category 2</p>
            <p className="text-[10px] text-muted-foreground">Fall with hip fracture · Wing A · 3 Apr 2026</p>
          </div>
        </div>
        <button onClick={() => router.push("/dashboard/coach")} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted"><Mic className="w-3.5 h-3.5" /> Ask CHRIS</button>
      </div>

      {/* Timeline */}
      <div className="bg-card rounded-xl p-4 border border-border mb-4">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Timeline</p>
        <div className="space-y-2 text-xs">
          {[
            { label: "Incident", value: "3 Apr 2026 · 14:15" },
            { label: "Reported to DON", value: "14:45 (30 min)" },
            { label: "CHRIS classified", value: "15:00 (Cat 2)" },
            { label: "Clock started", value: "14:15 (time of awareness)" },
            { label: "Deadline", value: "3 May 2026 · 14:15 (30 days)" },
            { label: "Days remaining", value: "22 days ✅" },
          ].map((row) => (
            <div key={row.label} className="flex justify-between">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="text-foreground font-medium">{row.value}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-muted rounded-full h-2 mt-3">
          <div className="h-2 rounded-full bg-[hsl(var(--brand-teal))]" style={{ width: "29%" }} />
        </div>
        <p className="text-[9px] text-muted-foreground mt-1">29% of 30-day window elapsed</p>
      </div>

      {/* Notification status */}
      <div className="rounded-xl p-4 border border-border border-l-4 border-l-[hsl(var(--brand-amber))] mb-4" style={{ background: "rgba(212,160,23,0.06)" }}>
        <p className="text-xs font-semibold text-foreground mb-1">⏳ Draft ready — pending DON approval</p>
        <p className="text-xs text-muted-foreground mb-3">CHRIS has prepared the full notification. Add resident details and review before submission.</p>
        <div className="flex gap-2">
          <button onClick={() => setShowDraftReview(true)} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Review full draft →</button>
          <button className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">Edit draft</button>
        </div>
      </div>

      {/* Investigation */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Investigation & corrective actions</p>
      <div className="bg-card rounded-xl border border-border mb-4 overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Internal investigation</p>
            <p className="text-xs font-medium text-foreground">⏳ In progress</p>
          </div>
        </div>
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-foreground">Falls risk review — Wing A residents</p>
            <p className="text-[10px] text-muted-foreground">Not started · Due: 17 Apr</p>
          </div>
          <button className="text-[10px] font-medium px-2 py-1 rounded bg-primary text-primary-foreground">Assign →</button>
        </div>
        <div className="px-4 py-3">
          <button className="text-xs font-medium text-[hsl(var(--brand-teal))] hover:underline">+ Add corrective action</button>
        </div>
      </div>

      {/* CHRIS Analysis */}
      <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(27,67,50,0.05)" }}>
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]">CAUSAL</span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dashed border-[hsl(var(--brand-amber))] text-muted-foreground">STRONG</span>
        </div>
        <div className="flex items-start gap-2 mb-2">
          <ChrisAvatar size="small" showGlow className="shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            This fall occurred on an afternoon shift with 38% agency coverage. Wing A afternoon shifts have had 3 falls events this quarter, all with &gt;35% agency. Permanent staff shifts: 0 falls. This suggests an agency familiarity gap — consider adding high-risk resident flags to shift handover briefs.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Add to corrective action</button>
          <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted">Share with WHS</button>
        </div>
      </div>

      {/* QI Link */}
      <div className="bg-card rounded-xl p-4 border border-border mb-16">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">QI impact</p>
        <p className="text-xs text-muted-foreground mb-1">This incident contributes to:</p>
        <p className="text-xs text-foreground">QI_03 (Falls): +1 event for Q2 · QI_04 (Major Injury): +1 event</p>
        <p className="text-[10px] text-muted-foreground mt-1">CHRIS has updated the QI tracker automatically.</p>
        <button onClick={() => router.push("/dashboard/quality/QI_03")} className="text-xs font-medium text-[hsl(var(--brand-teal))] hover:underline mt-1 block">View QI impact →</button>
      </div>
    </div>
  );
}
