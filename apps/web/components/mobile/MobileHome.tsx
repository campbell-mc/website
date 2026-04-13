"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { todays_picture, facility, financial_monthly } from "@/lib/seed-data";
import MobileActionCard from "./MobileActionCard";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const domainStatusDot: Record<string, string> = {
  ok: "bg-[#2D7D73]",
  warning: "bg-[#D4A017]",
  critical: "bg-[#C4704A]",
};

export default function MobileHome() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const latestFinancial = financial_monthly[financial_monthly.length - 1];
  const chrisText = todays_picture.chris_text;
  const previewText = chrisText.split(". ").slice(0, 2).join(". ") + ".";

  return (
    <div className="min-h-screen bg-[#FAF9F7] pb-20">
      {/* Header */}
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-[22px] font-bold text-[#1B4332]">
          {getGreeting()}, Sarah
        </h1>
        <p className="text-[14px] text-gray-500 mt-0.5">
          {facility.name} &middot; {formatDate()}
        </p>
      </div>

      {/* CHRIS Intelligence Block */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            {/* CHRIS Avatar */}
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
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[13px] font-semibold text-[#1B4332]">
                  CHRIS
                </span>
                {/* Signal dots */}
                <div className="flex gap-1">
                  {todays_picture.domain_status.map((d) => (
                    <span
                      key={d.domain}
                      className={`w-1.5 h-1.5 rounded-full ${domainStatusDot[d.status] || "bg-gray-300"}`}
                      title={d.domain}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[15px] text-gray-700 leading-relaxed">
                {expanded ? chrisText : previewText}
              </p>
              <button
                data-has-handler="true"
                onClick={() => setExpanded(!expanded)}
                className="text-[13px] text-[#2D7D73] font-medium mt-1 min-h-[44px] flex items-center"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Strip */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50">
          {todays_picture.domain_status.map((domain) => (
            <button
              key={domain.domain}
              data-has-handler="true"
              onClick={() =>
                router.push(
                  `/dashboard/${domain.domain.toLowerCase()}`
                )
              }
              className="w-full flex items-start gap-3 px-4 py-3.5 min-h-[44px] active:bg-gray-50 transition-colors"
            >
              <span
                className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${domainStatusDot[domain.status] || "bg-gray-300"}`}
              />
              <div className="flex-1 text-left min-w-0">
                <span className="text-[15px] font-semibold text-[#1B4332] block">
                  {domain.domain}
                </span>
                <span className="text-[13px] text-gray-500 leading-snug block mt-0.5">
                  {domain.summary}
                </span>
              </div>
              <svg
                className="w-4 h-4 text-gray-300 mt-1 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Actions */}
      <div className="px-4 mb-4">
        <h2 className="text-[15px] font-semibold text-[#1B4332] mb-3">
          Priority actions
        </h2>
        <div className="flex flex-col gap-3">
          {todays_picture.top_3_actions.map((action) => (
            <MobileActionCard
              key={action.rank}
              severity={
                action.priority === "immediate"
                  ? "immediate"
                  : action.priority === "urgent"
                    ? "urgent"
                    : "routine"
              }
              title={action.description}
              description={action.context}
              actionLabel={action.action_label}
              route={action.route}
            />
          ))}
        </div>
      </div>

      {/* Financial Snapshot */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-[15px] font-semibold text-[#1B4332] mb-3">
            Financial snapshot
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[12px] text-gray-400 uppercase tracking-wide">
                Care ratio
              </p>
              <p className="text-[20px] font-bold text-[#1B4332]">
                {latestFinancial
                  ? `${(latestFinancial.care_ratio * 100).toFixed(1)}%`
                  : "--"}
              </p>
              <p className="text-[12px] text-gray-400">Target 55%</p>
            </div>
            <div>
              <p className="text-[12px] text-gray-400 uppercase tracking-wide">
                Agency cost
              </p>
              <p className="text-[20px] font-bold text-[#1B4332]">
                {latestFinancial
                  ? `${(latestFinancial.agency_cost_pct_of_care_workforce * 100).toFixed(1)}%`
                  : "--"}
              </p>
              <p className="text-[12px] text-gray-400">of care workforce</p>
            </div>
            <div>
              <p className="text-[12px] text-gray-400 uppercase tracking-wide">
                EBITDA
              </p>
              <p className="text-[20px] font-bold text-[#1B4332]">
                {latestFinancial
                  ? `$${(latestFinancial.ebitda / 1000).toFixed(0)}K`
                  : "--"}
              </p>
              <p className="text-[12px] text-gray-400">March 2026</p>
            </div>
            <div>
              <p className="text-[12px] text-gray-400 uppercase tracking-wide">
                Occupancy
              </p>
              <p className="text-[20px] font-bold text-[#1B4332]">
                {latestFinancial
                  ? `${(latestFinancial.occupancy_pct * 100).toFixed(1)}%`
                  : "--"}
              </p>
              <p className="text-[12px] text-gray-400">
                {facility.beds} beds
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
