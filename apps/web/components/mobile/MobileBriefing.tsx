"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BriefingTab = "morning" | "team" | "leader";

const tabs: { label: string; value: BriefingTab }[] = [
  { label: "Morning", value: "morning" },
  { label: "Team Loop", value: "team" },
  { label: "Leader Loop", value: "leader" },
];

const briefingData: Record<
  BriefingTab,
  {
    label: string;
    time: string;
    narrative: string;
  }
> = {
  morning: {
    label: "Morning Briefing",
    time: "Generated 05:12 AEST",
    narrative:
      "Good morning, Sarah. Care minutes are compliant across all wings today. RN coverage is confirmed for tonight — no gaps. The Wattle Wing practice from last fortnight is showing results: PSH_08 dropped 0.08 this cycle, the strongest improvement we have seen there. Two items need your attention: the SIRS Cat 2 draft from last night is ready for your review and submission to GPMS, and the falls prevention audit in Wing B is 4 days overdue. The Q2 QI submission draft is also ready when you have 20 minutes — all 14 indicators are compiled and annotated.",
  },
  team: {
    label: "Team Loop Briefing",
    time: "Cycle 8 — 12 Apr 2026",
    narrative:
      "This fortnight, the Wattle Wing practice worked. We asked team leaders to run a 2-minute check-in at shift handover — just asking each person how their shift went, naming one thing that went well. PSH_08 (Traumatic Exposure) dropped 0.08 in Wattle Wing, the best single-cycle improvement this year. This tells us something important: small, consistent recognition practices reduce the emotional load on frontline teams. The practice continues this cycle. Grevillea Wing, your PSH convergence is still elevated — CHRIS has a specific practice for your team below.",
  },
  leader: {
    label: "Leader Loop Briefing",
    time: "Cycle 8 — 12 Apr 2026",
    narrative:
      "This cycle reveals a clear pattern: when team leaders consistently run micro-recognition moments, psychosocial hazard scores improve within one cycle. Wattle Wing is the proof case — PSH_08 dropped after just one cycle of the 2-minute handover check-in. The challenge now is Grevillea Wing, where PSH_01 and PSH_08 have been co-elevated for 6 cycles. This is the pattern that preceded the December RN exits in Wattle Wing. The coaching focus this cycle is on early intervention — how to recognise the convergence pattern and act before it reaches the turnover threshold.",
  },
};

const practiceCard = {
  name: "2-Minute Handover Check-In",
  description:
    "At each shift handover, the outgoing team leader asks each team member: 'How was your shift?' and 'What went well today?' This takes 2 minutes, costs nothing, and directly addresses PSH_08 (Traumatic Exposure) by creating a moment of acknowledgement before the team member leaves.",
};

const coachingFocus = {
  title: "Recognising PSH Convergence Early",
  description:
    "When two or more psychosocial hazard scores are elevated simultaneously in the same team for 3+ cycles, this is a convergence pattern. Historically, 71% of voluntary turnover events in aged care are preceded by PSH convergence. The leadership action is to intervene at cycle 3, not cycle 6. This cycle, focus on Grevillea Wing: schedule a 15-minute conversation with the team leader about workload distribution and recognition frequency.",
};

export default function MobileBriefing() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BriefingTab>("morning");
  const data = briefingData[activeTab];

  return (
    <div className="min-h-screen bg-[#FAF9F7] pb-20">
      {/* Header */}
      <div className="px-4 pt-12 pb-2">
        <h1 className="text-[22px] font-bold text-[#1B4332]">Briefing</h1>
      </div>

      {/* Tab selector */}
      <div className="px-4 py-3">
        <div className="flex bg-gray-100 rounded-xl p-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                data-has-handler="true"
                onClick={() => setActiveTab(tab.value)}
                className={`flex-1 py-2.5 rounded-lg text-[14px] font-medium min-h-[44px] transition-colors ${
                  isActive
                    ? "bg-white text-[#1B4332] shadow-sm"
                    : "text-gray-500"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Briefing content */}
      <div className="px-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {/* CHRIS avatar + header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B4332] to-[#C9A84C] flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-[#1B4332]">
                {data.label}
              </p>
              <p className="text-[12px] text-gray-400">{data.time}</p>
            </div>
          </div>

          {/* Narrative */}
          <p className="text-[15px] text-gray-700 leading-relaxed">
            {data.narrative}
          </p>

          {/* Morning: Action buttons */}
          {activeTab === "morning" && (
            <div className="flex flex-col gap-2 mt-4">
              <button
                data-has-handler="true"
                onClick={() => router.push("/dashboard/sirs")}
                className="w-full h-12 rounded-xl text-[15px] font-semibold text-white bg-[#C4704A] min-h-[44px] transition-colors hover:bg-[#B5613D]"
              >
                Review SIRS draft
              </button>
              <button
                data-has-handler="true"
                onClick={() => router.push("/dashboard/audits")}
                className="w-full h-12 rounded-xl text-[15px] font-semibold text-[#1B4332] bg-gray-100 min-h-[44px] transition-colors hover:bg-gray-200"
              >
                View overdue audit
              </button>
            </div>
          )}

          {/* Team Loop: Practice card */}
          {activeTab === "team" && (
            <div className="mt-4 rounded-xl bg-[#E8F5F0] p-4">
              <p className="text-[12px] text-[#2D7D73] font-semibold uppercase tracking-wide mb-1">
                This cycle&apos;s practice
              </p>
              <p className="text-[15px] font-semibold text-[#1B4332] mb-1">
                {practiceCard.name}
              </p>
              <p className="text-[14px] text-gray-600 leading-relaxed">
                {practiceCard.description}
              </p>
            </div>
          )}

          {/* Leader Loop: Coaching focus card */}
          {activeTab === "leader" && (
            <div className="mt-4 rounded-xl bg-[#F5F0E8] p-4">
              <p className="text-[12px] text-[#D4A017] font-semibold uppercase tracking-wide mb-1">
                Coaching focus
              </p>
              <p className="text-[15px] font-semibold text-[#1B4332] mb-1">
                {coachingFocus.title}
              </p>
              <p className="text-[14px] text-gray-600 leading-relaxed">
                {coachingFocus.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
