"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

const QUESTIONS = [
  { id: "1", text: "I feel motivated to do my best work each day." },
  { id: "2", text: "I feel safe speaking up about mistakes." },
  { id: "3", text: "I feel appreciated for the work I do." },
  { id: "4", text: "Our team lives the values we claim." },
];

const EMOJIS = [
  { value: 1, emoji: "😞", label: "Strongly Disagree", bg: "bg-red-100", active: "bg-red-500 text-white" },
  { value: 2, emoji: "😕", label: "Disagree", bg: "bg-orange-100", active: "bg-orange-500 text-white" },
  { value: 3, emoji: "😐", label: "Neutral", bg: "bg-yellow-100", active: "bg-yellow-500 text-white" },
  { value: 4, emoji: "🙂", label: "Agree", bg: "bg-lime-100", active: "bg-lime-500 text-white" },
  { value: 5, emoji: "😊", label: "Strongly Agree", bg: "bg-green-100", active: "bg-green-500 text-white" },
];

export default function TeamPulseCheckIn() {
  const router = useRouter();
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const answered = Object.keys(responses).length;
  const total = QUESTIONS.length;
  const allAnswered = answered === total;

  function handleSelect(questionId: string, value: number) {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleSubmit() {
    try {
      await fetch("/api/team-loop/pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team_id: "TEAM-001", responses, comment }),
      });
    } catch (e) {
      // Silent fail for demo — pulse is fire-and-forget
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "hsl(var(--background))" }}>
        <div className="w-16 h-16 rounded-full bg-[#D4EDDD] flex items-center justify-center mb-4">
          <span className="text-2xl">✓</span>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Thank you</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Your responses help CHRIS understand your team's experience. Results go to your team leader — never to management individually.
        </p>
        <p className="text-xs text-muted-foreground">You can close this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(var(--background))" }}>
      {/* Header */}
      <div className="bg-card px-4 py-4 text-center border-b border-border">
        <ChrisAvatar size="small" className="mx-auto mb-2" />
        <h1 className="text-base font-semibold text-foreground">Team Pulse Check-In</h1>
        <p className="text-xs text-muted-foreground">Anonymous · 2 minutes · Your voice matters</p>
      </div>

      {/* Progress */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground">{answered} of {total} answered</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="h-2 rounded-full bg-foreground transition-all duration-300" style={{ width: `${(answered / total) * 100}%` }} />
        </div>
      </div>

      {/* Questions */}
      <div className="flex-1 px-4 py-2 space-y-4">
        {QUESTIONS.map((q, qi) => (
          <div key={q.id} className="bg-card rounded-xl p-4 shadow-warm-sm border border-border">
            <p className="text-sm font-medium text-foreground mb-3">
              <span className="text-muted-foreground mr-1">{qi + 1}.</span> {q.text}
            </p>
            <div className="flex justify-between gap-1">
              {EMOJIS.map((e) => {
                const isSelected = responses[q.id] === e.value;
                return (
                  <button
                    key={e.value}
                    onClick={() => handleSelect(q.id, e.value)}
                    className={`flex-1 py-2.5 rounded-lg text-center transition-all ${
                      isSelected ? e.active + " scale-110 shadow-md" : e.bg + " hover:scale-105"
                    }`}
                  >
                    <span className="text-lg">{e.emoji}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Optional comment */}
        {!showComment ? (
          <button onClick={() => setShowComment(true)} className="text-xs text-muted-foreground hover:text-foreground underline">
            + Add a comment (optional)
          </button>
        ) : (
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-xs font-medium text-foreground mb-2">Anything else you'd like to share?</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="This is anonymous..."
              className="w-full p-3 border border-border rounded-lg text-sm resize-none min-h-[80px] bg-background"
            />
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="px-4 py-4 border-t border-border bg-card">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full py-3.5 rounded-xl font-medium text-white disabled:opacity-40 transition-opacity"
          style={{ background: allAnswered ? "#C4704A" : undefined, backgroundColor: !allAnswered ? "#ccc" : undefined }}
        >
          Submit Check-In
        </button>
      </div>
    </div>
  );
}
