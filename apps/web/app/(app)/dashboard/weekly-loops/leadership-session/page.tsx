"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

const AGENDA = [
  {
    duration: "5 min", type: "opening", title: "Check-in",
    content: 'Opening question for the room: "What\'s one thing your team did really well this fortnight?"',
    chris_note: null, data: null,
  },
  {
    duration: "15 min", type: "data", title: "Cycle 8 pulse results — all teams",
    content: "Review the cross-team PSH data together. CHRIS has highlighted the key patterns.",
    chris_note: "Wattle Wing: strongest improvement — PSH_08 dropped 0.08. Grevillea Wing: PSH_01 and PSH_08 co-elevated for 6 cycles — needs collective attention. Wing A and Wing B: stable. Night Team: PSH_12 (Fatigue) creeping up — worth flagging.",
    data: [
      { team: "Wattle Wing", score: 2.6, change: -0.2, status: "improving" },
      { team: "Grevillea Wing", score: 3.4, change: 0.1, status: "concern" },
      { team: "Wing A", score: 2.4, change: -0.1, status: "good" },
      { team: "Wing B", score: 2.9, change: 0.1, status: "watch" },
      { team: "Night Team", score: 3.1, change: 0.2, status: "watch" },
    ],
  },
  {
    duration: "15 min", type: "discussion", title: "Grevillea Wing — collective problem solving",
    content: "PSH_01 (High Job Demands) and PSH_08 (Traumatic Exposure) have been co-elevated for 6 consecutive cycles. Level 4 practices haven't moved them. This needs a conversation beyond the Team Leader level.",
    chris_note: 'Discussion prompt: What do you know about what\'s happening in Grevillea Wing that might not be showing in the data? What resources or support does the Team Leader need that they don\'t currently have?',
    data: null,
  },
  {
    duration: "10 min", type: "practice", title: "Practice review — what worked?",
    content: "Each Team Leader shares: Did you deliver the micro-practice? What happened? What did the team say?",
    chris_note: "Last cycle practice: Recognition practice (PSH_15). Wattle Wing data shows strongest improvement — what did they do differently? Can other teams learn from it?",
    data: null,
  },
  {
    duration: "10 min", type: "practice", title: "This cycle's practice — collective commitment",
    content: "Review the practice CHRIS has selected for Cycle 9. Each leader commits to how they will introduce it in their team huddle.",
    chris_note: "Cycle 9 practice selected: Structured debrief after difficult shifts. Targets PSH_08 and PSH_14. Delivery: 5 minutes at end of any shift with a traumatic event.",
    data: null,
  },
  {
    duration: "5 min", type: "closing", title: "One commitment each",
    content: "Closing round: each leader states one specific thing they will do differently this fortnight.",
    chris_note: "The Chronicler will capture each commitment as an action item.",
    data: null,
  },
];

const TYPE_COLORS: Record<string, { bg: string; border: string; badge: string }> = {
  opening: { bg: "bg-muted/30", border: "border-border", badge: "bg-muted text-muted-foreground" },
  data: { bg: "bg-[#F0F7F4]", border: "border-[#2D7D73]", badge: "bg-[#2D7D73] text-white" },
  discussion: { bg: "bg-[#FFFBF0]", border: "border-[#D4A017]", badge: "bg-[#D4A017] text-white" },
  practice: { bg: "bg-[#F0F7F4]", border: "border-[#6BAF92]", badge: "bg-[#6BAF92] text-white" },
  closing: { bg: "bg-muted/30", border: "border-border", badge: "bg-muted text-muted-foreground" },
};

const STATUS_COLORS: Record<string, string> = {
  good: "bg-[#F0F7F4] text-[#2D7D73]", improving: "bg-[#F0F7F4] text-[#2D7D73]",
  concern: "bg-[#FEF7F0] text-[#C4704A]", watch: "bg-[#FFFBF0] text-[#D4A017]",
};

export default function LeadershipSessionPage() {
  const router = useRouter();
  const [view, setView] = useState<"agenda" | "record">("agenda");
  const [recordNotes, setRecordNotes] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6 max-w-3xl mx-auto">
      <button onClick={() => router.push("/dashboard/weekly-loops")} className="flex items-center gap-1 text-sm text-muted-foreground mb-4"><ChevronLeft className="w-4 h-4" /> Weekly Loops</button>

      <div className="mb-5">
        <h1 className="text-[22px] md:text-xl font-semibold text-foreground">Leadership Session</h1>
        <p className="text-xs text-muted-foreground">Cycle 8 · Week 1 · All Team Leaders + DON/FM</p>
      </div>

      {/* About */}
      <div className="bg-[#F0F7F4] rounded-xl border border-[#2D7D73] p-4 mb-5">
        <p className="text-sm font-semibold text-[#1B4332] mb-1">About this session</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The Leadership Session brings all Team Leaders together to review collective team performance from the PSH pulse, share what&apos;s working, and make decisions together. CHRIS has prepared the agenda from this cycle&apos;s data. The Chronicler will document the session.
        </p>
        <div className="flex gap-6 mt-3">
          <div className="text-center"><p className="text-base font-bold text-foreground">60–90</p><p className="text-[10px] text-muted-foreground">minutes</p></div>
          <div className="text-center"><p className="text-base font-bold text-foreground">5</p><p className="text-[10px] text-muted-foreground">Team Leaders</p></div>
          <div className="text-center"><p className="text-base font-bold text-foreground">Collective</p><p className="text-[10px] text-muted-foreground">focus</p></div>
        </div>
      </div>

      {/* Toggle */}
      <div className="flex gap-2 mb-5">
        <button onClick={() => setView("agenda")} className={`flex-1 py-2.5 rounded-xl text-sm font-medium ${view === "agenda" ? "bg-[#1B4332] text-white" : "bg-card border border-border text-muted-foreground"}`}>Session agenda</button>
        <button onClick={() => setView("record")} className={`flex-1 py-2.5 rounded-xl text-sm font-medium ${view === "record" ? "bg-[#1B4332] text-white" : "bg-card border border-border text-muted-foreground"}`}>Record session</button>
      </div>

      {/* AGENDA VIEW */}
      {view === "agenda" && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">Total session time: 60 minutes</p>

          {AGENDA.map((item, i) => {
            const c = TYPE_COLORS[item.type] ?? TYPE_COLORS.opening;
            return (
              <div key={i} className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.badge}`}>{item.duration}</span>
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{item.content}</p>

                {/* Cross-team data table */}
                {item.data && (
                  <div className="bg-card rounded-lg overflow-hidden mb-3">
                    <table className="w-full text-xs">
                      <thead><tr className="bg-muted/50">
                        <th className="text-left p-2.5 font-medium text-muted-foreground">Team</th>
                        <th className="text-center p-2.5 font-medium text-muted-foreground">Score</th>
                        <th className="text-center p-2.5 font-medium text-muted-foreground">Change</th>
                        <th className="text-center p-2.5 font-medium text-muted-foreground">Status</th>
                      </tr></thead>
                      <tbody>
                        {item.data.map((t) => (
                          <tr key={t.team} className="border-b border-border last:border-b-0">
                            <td className="p-2.5 font-medium text-foreground">{t.team}</td>
                            <td className="p-2.5 text-center font-bold text-foreground">{t.score.toFixed(1)}</td>
                            <td className={`p-2.5 text-center font-bold ${t.change < 0 ? "text-[#2D7D73]" : t.change > 0 ? "text-[#C4704A]" : "text-muted-foreground"}`}>{t.change > 0 ? "+" : ""}{t.change.toFixed(1)}</td>
                            <td className="p-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_COLORS[t.status]}`}>{t.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* CHRIS note */}
                {item.chris_note && (
                  <div className="flex gap-2 bg-card rounded-lg p-3">
                    <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">{item.chris_note}</p>
                  </div>
                )}
              </div>
            );
          })}

          <button onClick={() => setView("record")} className="w-full py-3.5 bg-[#1B4332] text-white rounded-xl text-sm font-medium hover:opacity-90">
            Session complete — record outcomes →
          </button>
        </div>
      )}

      {/* RECORD VIEW */}
      {view === "record" && !saved && (
        <div className="space-y-4">
          {[
            { id: "attendees", title: "Attendees", placeholder: "e.g. Sarah Mitchell (DON), James Okonkwo (FM), Anika Patel (TL — Wattle Wing)..." },
            { id: "key_insights", title: "Key insights from pulse discussion", placeholder: "What did the group notice in the data? What patterns emerged?" },
            { id: "grevillea", title: "Grevillea Wing — collective discussion", placeholder: "What did the group decide? What support for the Team Leader?" },
            { id: "commitments", title: "Individual practice commitments", placeholder: "e.g. Anika (Wattle Wing): Will introduce at Monday huddle..." },
            { id: "actions", title: "Actions arising", placeholder: "e.g. 1. DON to meet with Grevillea TL privately before Wednesday..." },
          ].map((section) => (
            <div key={section.id} className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm font-semibold text-foreground mb-2">{section.title}</p>
              <textarea
                value={recordNotes[section.id] ?? ""}
                onChange={(e) => setRecordNotes((prev) => ({ ...prev, [section.id]: e.target.value }))}
                placeholder={section.placeholder}
                rows={3}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background resize-none"
              />
            </div>
          ))}

          <div className="flex gap-2 bg-muted/30 rounded-lg p-3">
            <ChrisAvatar size="small" className="shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground">The Chronicler will compile these notes into formal meeting minutes and distribute to all Team Leaders. Notes feed the ISO 45003 evidence trail as documented management review.</p>
          </div>

          <button onClick={() => setSaved(true)} className="w-full py-3.5 bg-[#1B4332] text-white rounded-xl text-sm font-medium hover:opacity-90">
            Save and distribute to Team Leaders →
          </button>
        </div>
      )}

      {view === "record" && saved && (
        <div className="py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#D4EDDD] flex items-center justify-center mx-auto mb-4"><span className="text-2xl">✓</span></div>
          <h2 className="text-lg font-bold text-foreground mb-2">Session documented</h2>
          <p className="text-sm text-muted-foreground mb-4">The Chronicler is compiling minutes. Team Leaders will receive them via iMessage.</p>
          <button onClick={() => router.push("/dashboard/weekly-loops")} className="text-sm font-medium px-6 py-3 rounded-xl bg-primary text-primary-foreground">Back to Weekly Loops</button>
        </div>
      )}

      <div className="h-16" />
    </div>
  );
}
