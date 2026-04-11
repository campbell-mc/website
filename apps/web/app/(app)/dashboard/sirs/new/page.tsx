"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";
import { Mic } from "lucide-react";

const INCIDENT_TYPES = [
  "Fall", "Medication error", "Pressure injury", "Unexpected death",
  "Abuse / neglect", "Missing resident", "Restrictive practice", "Elopement", "Other",
];

export default function NewIncidentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [classification, setClassification] = useState<"cat1" | "cat2" | "internal" | null>(null);
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "hsl(var(--background))" }}>
        <div className="w-16 h-16 rounded-full bg-[hsl(150_25%_96%)] flex items-center justify-center mb-4"><span className="text-2xl">✅</span></div>
        <p className="text-lg font-bold text-foreground mb-1">Incident logged</p>
        <p className="text-xs text-muted-foreground mb-1">{classification === "cat1" ? "Category 1 — 24h clock started. Draft in your queue." : classification === "cat2" ? "Category 2 — 30-day window. CHRIS is preparing the draft." : "Internal incident recorded. Not SIRS-reportable."}</p>
        <button onClick={() => router.push("/dashboard/sirs")} className="mt-4 text-sm font-medium px-6 py-3 rounded-xl bg-primary text-primary-foreground">← Back to SIRS Register</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button onClick={() => router.push("/dashboard/sirs")} className="text-sm text-muted-foreground">✕ Cancel</button>
          <span className="text-sm font-semibold text-foreground">New Incident</span>
          <span className="text-xs text-muted-foreground">Step {step}/2</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {step === 1 && (
          <div className="animate-slideUp">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-3">What happened?</p>

            <p className="text-xs font-medium text-foreground mb-2">Incident type</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {INCIDENT_TYPES.map((t) => (
                <button key={t} onClick={() => setType(t)} className={`text-xs py-2.5 px-2 rounded-lg border transition-all text-center ${type === t ? "border-[hsl(var(--brand-forest))] bg-[hsl(150_25%_96%)] text-foreground font-medium" : "border-border text-muted-foreground hover:border-muted-foreground/30"}`}>
                  {t}
                </button>
              ))}
            </div>

            <p className="text-xs font-medium text-foreground mb-2">Description</p>
            <div className="relative mb-4">
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What happened? CHRIS will structure this for you..." className="w-full p-3 border border-border rounded-xl text-sm bg-background min-h-[100px]" />
              <button className="absolute bottom-2 right-2 p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"><Mic className="w-4 h-4" /></button>
            </div>

            {/* CHRIS pre-screening */}
            {description.length > 20 && type && (
              <div className="rounded-xl p-4 mb-4 animate-slideUp" style={{ background: "rgba(27,67,50,0.05)" }}>
                <div className="flex items-start gap-2">
                  <ChrisAvatar size="small" showGlow className="shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">CHRIS pre-screening</p>
                    {type === "Unexpected death" || type === "Abuse / neglect" || type === "Missing resident" ? (
                      <>
                        <p className="text-xs text-[hsl(var(--brand-terracotta))] font-medium mb-1">⚠️ This may be a Category 1 incident.</p>
                        <p className="text-xs text-muted-foreground mb-2">Category 1 requires ACQSC notification within 24 hours. CHRIS will generate the draft now.</p>
                        <button onClick={() => { setClassification("cat1"); setStep(2); }} className="text-xs font-medium px-3 py-2 rounded-lg bg-[hsl(var(--brand-terracotta))] text-white hover:opacity-90">Confirm Cat 1 — start 24h clock</button>
                      </>
                    ) : type === "Fall" || type === "Medication error" || type === "Pressure injury" ? (
                      <>
                        <p className="text-xs text-[hsl(var(--brand-amber))] font-medium mb-1">This appears to be a Category 2 incident.</p>
                        <p className="text-xs text-muted-foreground mb-2">You have 30 days to notify ACQSC. CHRIS will prepare the draft.</p>
                        <button onClick={() => { setClassification("cat2"); setStep(2); }} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Confirm and continue</button>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-muted-foreground mb-2">This incident does not appear to meet SIRS reporting criteria. CHRIS will log it as internal only.</p>
                        <div className="flex gap-2">
                          <button onClick={() => { setClassification("internal"); setStep(2); }} className="text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Log as internal</button>
                          <button onClick={() => { setClassification("cat2"); setStep(2); }} className="text-xs font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">Override — treat as SIRS</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="animate-slideUp">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-3">Immediate actions taken</p>
            <div className="space-y-2 mb-4">
              {["Medical attention obtained", "GP / medical officer notified", "Family / representative notified", "Ambulance called", "Hospital transfer", "Pain management administered", "Area made safe"].map((action) => (
                <label key={action} className="flex items-center gap-3 bg-card rounded-lg px-4 py-3 border border-border cursor-pointer hover:bg-muted/50">
                  <input type="checkbox" className="w-4 h-4 rounded border-border" />
                  <span className="text-xs text-foreground">{action}</span>
                </label>
              ))}
            </div>

            <button onClick={() => setSaved(true)} className="w-full py-3.5 rounded-xl font-medium text-white" style={{ background: "#C4704A" }}>
              Save incident report →
            </button>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              {classification === "cat1" ? "24h clock started. Draft will appear in your queue immediately." : classification === "cat2" ? "CHRIS will prepare the SIRS draft. 30-day window started." : "Logged as internal incident."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
