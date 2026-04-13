"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface Recipient { id: string; role: string; relationship: "direct_report" | "peer" | "manager"; selected: boolean; }

export default function LeaderPulsePage() {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "recipients" | "preview" | "sent">("intro");
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: "r1", role: "AIN — Wattle Wing", relationship: "direct_report", selected: true },
    { id: "r2", role: "AIN — Wattle Wing", relationship: "direct_report", selected: true },
    { id: "r3", role: "EN — Wattle Wing", relationship: "direct_report", selected: true },
    { id: "r4", role: "Team Leader — Grevillea Wing", relationship: "peer", selected: false },
    { id: "r5", role: "Team Leader — Wing A", relationship: "peer", selected: false },
    { id: "r6", role: "Director of Nursing", relationship: "manager", selected: true },
  ]);

  const practice = "Structured debrief after difficult shifts";
  const selectedCount = recipients.filter((r) => r.selected).length;

  function toggle(id: string) { setRecipients((prev) => prev.map((r) => r.id === id ? { ...r, selected: !r.selected } : r)); }

  if (step === "sent") {
    return (
      <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-[#D4EDDD] flex items-center justify-center mx-auto mb-4"><span className="text-2xl">✓</span></div>
        <h2 className="text-lg font-bold text-foreground mb-2">Leader Loop sent</h2>
        <p className="text-sm text-muted-foreground mb-1">Sent to {selectedCount} people via iMessage.</p>
        <p className="text-xs text-muted-foreground mb-6">Responses are anonymous. Typical window: 2-3 days.</p>
        <button onClick={() => router.push("/dashboard/weekly-loops/leader-briefing")} className="px-6 py-3 bg-[#1B4332] text-white rounded-xl text-sm font-medium">Go to Leader Briefing →</button>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-2xl mx-auto">
      <button onClick={() => router.push("/dashboard/weekly-loops")} className="flex items-center gap-1 text-sm text-muted-foreground mb-4"><ChevronLeft className="w-4 h-4" /> Weekly Loops</button>
      <h1 className="text-[22px] md:text-xl font-semibold text-foreground mb-1">Leader Loop</h1>
      <p className="text-xs text-muted-foreground mb-5">Cycle 8 · Your fortnightly leadership pulse</p>

      {/* INTRO */}
      {step === "intro" && (
        <div className="space-y-4">
          <div className="bg-[#F0F7F4] rounded-xl border border-[#2D7D73] p-4">
            <p className="text-sm font-semibold text-[#1B4332] mb-1">About your Leader Loop</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Your Leader Loop is a 60-second anonymous pulse you send to people you choose — direct reports, peers, or your manager. Built around the practice you&apos;ve been working on this fortnight.</p>
            <div className="flex gap-4 mt-3">
              <div className="text-center"><p className="text-base font-bold text-foreground">60 sec</p><p className="text-[10px] text-muted-foreground">for recipients</p></div>
              <div className="text-center"><p className="text-base font-bold text-foreground">Anonymous</p><p className="text-[10px] text-muted-foreground">always</p></div>
              <div className="text-center"><p className="text-base font-bold text-foreground">Your data</p><p className="text-[10px] text-muted-foreground">stays with you</p></div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Your practice this cycle</p>
            <p className="text-sm font-semibold text-foreground">{practice}</p>
          </div>

          {/* iMessage preview */}
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">What recipients will receive</p>
            <div className="bg-[#F2F2F7] rounded-2xl p-4 space-y-2">
              <div className="bg-white rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
                <p className="text-xs text-foreground leading-relaxed">Hi — Anika has asked for your quick and anonymous feedback on their leadership this fortnight. Takes about 60 seconds.</p>
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
                <p className="text-[10px] text-muted-foreground mb-2">Practice: &ldquo;{practice}&rdquo;</p>
                <p className="text-xs text-foreground mb-2">Did you notice Anika using this practice?</p>
                <div className="flex gap-1.5">{["Yes, definitely", "Somewhat", "Not really"].map((o) => <span key={o} className="px-2.5 py-1 bg-[#1B4332] text-white rounded-lg text-[10px] font-medium">{o}</span>)}</div>
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
                <p className="text-xs text-foreground mb-2">How supported did you feel? (1–5)</p>
                <div className="flex gap-1.5">{[1, 2, 3, 4, 5].map((n) => <span key={n} className="w-7 h-7 bg-[#1B4332] text-white rounded-lg text-xs font-bold flex items-center justify-center">{n}</span>)}</div>
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
                <p className="text-xs text-foreground">One word for Anika&apos;s leadership this fortnight:</p>
              </div>
            </div>
          </div>

          <button onClick={() => setStep("recipients")} className="w-full py-3.5 bg-[#1B4332] text-white rounded-xl text-sm font-medium">Choose who to send to →</button>
        </div>
      )}

      {/* RECIPIENTS */}
      {step === "recipients" && (
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground mb-1">Choose your recipients</p>
            <p className="text-xs text-muted-foreground mb-4">Mix of direct reports, a peer, and your manager. Minimum 3.</p>

            {(["direct_report", "peer", "manager"] as const).map((type) => (
              <div key={type} className="mb-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  {type === "direct_report" ? "Direct reports" : type === "peer" ? "Peers" : "Manager"}
                </p>
                {recipients.filter((r) => r.relationship === type).map((r) => (
                  <button key={r.id} onClick={() => toggle(r.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl border mb-1 text-left ${r.selected ? "border-[#2D7D73] bg-[#F0F7F4]" : "border-border bg-card"}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${r.selected ? "bg-[#2D7D73] border-[#2D7D73]" : "border-muted-foreground/30"}`}>{r.selected && <span className="text-white text-[10px]">✓</span>}</div>
                    <span className="text-sm text-foreground">{r.role}</span>
                  </button>
                ))}
              </div>
            ))}

            <p className="text-xs text-muted-foreground mt-2"><strong>{selectedCount} selected.</strong> {selectedCount < 3 ? "Select at least 3." : "Good selection."}</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("intro")} className="flex-1 py-3 border border-border text-muted-foreground rounded-xl text-sm font-medium">← Back</button>
            <button onClick={() => setStep("preview")} disabled={selectedCount < 3} className={`flex-1 py-3.5 rounded-xl text-sm font-medium ${selectedCount >= 3 ? "bg-[#1B4332] text-white" : "bg-muted text-muted-foreground"}`}>Preview and send →</button>
          </div>
        </div>
      )}

      {/* PREVIEW */}
      {step === "preview" && (
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm font-semibold text-foreground mb-3">Ready to send</p>
            {[
              ["Recipients", `${selectedCount} people`], ["Delivery", "iMessage + in-app"], ["Responses", "Anonymous"],
              ["Results visible to", "You only"], ["Practice focus", practice],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs py-1.5">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium text-foreground text-right max-w-[60%]">{v}</span>
              </div>
            ))}
          </div>

          <div className="bg-[#F0F7F4] rounded-xl p-3">
            <p className="text-[11px] text-foreground"><strong>Privacy:</strong> Individual responses are never shown. You see aggregates only. Your manager sees you ran the Loop but not what people said.</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("recipients")} className="flex-1 py-3 border border-border text-muted-foreground rounded-xl text-sm font-medium">← Edit</button>
            <button onClick={() => setStep("sent")} className="flex-1 py-3.5 bg-[#1B4332] text-white rounded-xl text-sm font-medium">Send Leader Loop →</button>
          </div>
        </div>
      )}

      <div className="h-16" />
    </div>
  );
}
