"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

type QuestionType = "scale" | "yesno" | "text" | "multiple_choice";
type Frequency = "daily" | "weekly" | "fortnightly" | "monthly" | "one_off";

interface Question { id: string; text: string; type: QuestionType; scale?: number; required: boolean; }

const ROLES = ["All staff", "RN", "EN", "AIN", "Team Leader", "DON", "Facility Manager"];
const WINGS = ["All wings", "Wattle Wing", "Grevillea Wing", "Wing A", "Wing B", "Night Team"];
const FREQUENCIES: { id: Frequency; label: string; detail: string }[] = [
  { id: "daily", label: "Daily", detail: "Sent every morning" },
  { id: "weekly", label: "Weekly", detail: "Sent every Monday" },
  { id: "fortnightly", label: "Fortnightly", detail: "Aligned with PSH pulse cycle" },
  { id: "monthly", label: "Monthly", detail: "Sent on the 1st of each month" },
  { id: "one_off", label: "One-off", detail: "Send once on a chosen date" },
];

export default function NewPulseSurveyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("weekly");
  const [targetRoles, setTargetRoles] = useState<string[]>(["all"]);
  const [targetWings, setTargetWings] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([{ id: "1", text: "", type: "scale", scale: 5, required: true }]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function addQuestion() { setQuestions((prev) => [...prev, { id: Date.now().toString(), text: "", type: "scale", scale: 5, required: true }]); }
  function updateQuestion(id: string, updates: Partial<Question>) { setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q))); }
  function removeQuestion(id: string) { if (questions.length > 1) setQuestions((prev) => prev.filter((q) => q.id !== id)); }

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
  }

  if (saved) {
    return (
      <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-2xl mx-auto text-center">
        <div className="py-12">
          <div className="w-16 h-16 rounded-full bg-[#D4EDDD] flex items-center justify-center mx-auto mb-4"><span className="text-2xl">✓</span></div>
          <h2 className="text-xl font-bold text-foreground mb-2">Survey created</h2>
          <p className="text-sm text-muted-foreground mb-1"><strong>{name}</strong> is active.</p>
          <p className="text-xs text-muted-foreground mb-6">
            First survey will be sent {frequency === "weekly" ? "next Monday" : frequency === "daily" ? "tomorrow morning" : "as scheduled"}.
            Results feed directly into CHRIS&apos;s intelligence layer.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push("/dashboard/workforce")} className="px-6 py-3 bg-[#1B4332] text-white rounded-xl text-sm font-medium">View workforce dashboard →</button>
            <button onClick={() => { setSaved(false); setStep(1); setName(""); }} className="px-6 py-3 border border-border text-muted-foreground rounded-xl text-sm font-medium">Create another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-2xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-muted-foreground mb-4"><ChevronLeft className="w-4 h-4" /> Back</button>
      <h1 className="text-xl font-semibold text-foreground mb-1">Create pulse survey</h1>
      <p className="text-xs text-muted-foreground mb-5">Results feed directly into CHRIS&apos;s workforce intelligence layer</p>

      {/* Progress */}
      <div className="flex gap-2 mb-6">{[1, 2, 3].map((s) => <div key={s} className={`flex-1 h-1.5 rounded-full ${s <= step ? "bg-[#2D7D73]" : "bg-muted"}`} />)}</div>

      {/* Step 1 — Details */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-foreground">Survey details</h2>
          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">Survey name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Weekly wellbeing check" className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">Description (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this survey for?" rows={2} className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background resize-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block mb-2">Frequency *</label>
            <div className="space-y-2">
              {FREQUENCIES.map((f) => (
                <button key={f.id} onClick={() => setFrequency(f.id)} className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left ${frequency === f.id ? "border-[#2D7D73] bg-[#F0F7F4]" : "border-border bg-card hover:border-muted-foreground/20"}`}>
                  <span className="text-sm font-medium text-foreground">{f.label}</span>
                  <span className="text-xs text-muted-foreground">{f.detail}</span>
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setStep(2)} disabled={!name.trim()} className={`w-full py-3.5 rounded-xl text-sm font-medium ${name.trim() ? "bg-[#1B4332] text-white" : "bg-muted text-muted-foreground"}`}>
            Next — Choose audience →
          </button>
        </div>
      )}

      {/* Step 2 — Audience */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-foreground">Who receives this survey?</h2>
          <div>
            <label className="text-xs font-medium text-foreground block mb-2">Roles</label>
            <div className="flex gap-2 flex-wrap">
              {ROLES.map((role) => (
                <button key={role} onClick={() => role === "All staff" ? setTargetRoles(["all"]) : setTargetRoles((prev) => prev.includes(role) ? prev.filter((r) => r !== role) : [...prev.filter((r) => r !== "all"), role])}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${(role === "All staff" && targetRoles.includes("all")) || targetRoles.includes(role) ? "bg-[#1B4332] text-white border-[#1B4332]" : "bg-card text-muted-foreground border-border"}`}>
                  {role}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block mb-2">Wings (optional)</label>
            <div className="flex gap-2 flex-wrap">
              {WINGS.map((w) => (
                <button key={w} onClick={() => w === "All wings" ? setTargetWings([]) : setTargetWings((prev) => prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w])}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${(w === "All wings" && targetWings.length === 0) || targetWings.includes(w) ? "bg-[#2D7D73] text-white border-[#2D7D73]" : "bg-card text-muted-foreground border-border"}`}>
                  {w}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-[#F0F7F4] rounded-xl p-4">
            <p className="text-xs text-foreground leading-relaxed"><strong>How CHRIS uses this data:</strong> Survey results automatically feed into The Keeper&apos;s workforce intelligence analysis. When results correlate with PSH scores, absenteeism, or turnover signals, CHRIS surfaces convergence alerts.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 border border-border text-muted-foreground rounded-xl text-sm font-medium">← Back</button>
            <button onClick={() => setStep(3)} className="flex-1 py-3.5 bg-[#1B4332] text-white rounded-xl text-sm font-medium">Next — Add questions →</button>
          </div>
        </div>
      )}

      {/* Step 3 — Questions */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-foreground">Survey questions</h2>
          <p className="text-xs text-muted-foreground">Keep it short — 1-3 questions work best.</p>

          {questions.map((q, i) => (
            <div key={q.id} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground">Question {i + 1}</span>
                {questions.length > 1 && <button onClick={() => removeQuestion(q.id)} className="text-[10px] text-[#C4704A] font-medium">Remove</button>}
              </div>
              <textarea value={q.text} onChange={(e) => updateQuestion(q.id, { text: e.target.value })} placeholder="Ask a question..." rows={2} className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background resize-none mb-2" />
              <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">Response type</p>
              <div className="flex gap-2 flex-wrap">
                {([{ id: "scale", label: "1–5 Scale" }, { id: "yesno", label: "Yes / No" }, { id: "text", label: "Free text" }] as { id: QuestionType; label: string }[]).map((type) => (
                  <button key={type.id} onClick={() => updateQuestion(q.id, { type: type.id })} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${q.type === type.id ? "bg-[#1B4332] text-white border-[#1B4332]" : "bg-card text-muted-foreground border-border"}`}>
                    {type.label}
                  </button>
                ))}
              </div>
              {q.type === "scale" && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">Scale:</span>
                  {[3, 5, 10].map((n) => (
                    <button key={n} onClick={() => updateQuestion(q.id, { scale: n })} className={`w-8 h-8 rounded-lg text-xs font-medium border ${q.scale === n ? "bg-[#2D7D73] text-white border-[#2D7D73]" : "bg-card text-muted-foreground border-border"}`}>{n}</button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {questions.length < 5 && (
            <button onClick={addQuestion} className="w-full py-3 border-2 border-dashed border-border text-muted-foreground rounded-xl text-sm font-medium hover:border-[#2D7D73] hover:text-[#2D7D73] transition-colors">+ Add another question</button>
          )}
          {questions.length >= 3 && <p className="text-[10px] text-[#D4A017] text-center">Tip: 3+ questions reduces response rates.</p>}

          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-xs text-muted-foreground"><strong>{name}</strong> · {frequency} · {targetRoles.includes("all") ? "All staff" : targetRoles.join(", ")} · {questions.length} question{questions.length > 1 ? "s" : ""}</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-3 border border-border text-muted-foreground rounded-xl text-sm font-medium">← Back</button>
            <button onClick={handleSave} disabled={saving || questions.some((q) => !q.text.trim())} className={`flex-1 py-3.5 rounded-xl text-sm font-medium ${!saving && questions.every((q) => q.text.trim()) ? "bg-[#1B4332] text-white" : "bg-muted text-muted-foreground"}`}>
              {saving ? "Creating..." : "Create survey →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
