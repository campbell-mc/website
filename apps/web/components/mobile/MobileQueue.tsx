"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { queue_items } from "@/lib/seed-data";
import MobileActionCard from "./MobileActionCard";

type SeverityFilter = "all" | "immediate" | "urgent" | "routine";

const filterPills: { label: string; value: SeverityFilter }[] = [
  { label: "All", value: "all" },
  { label: "Immediate", value: "immediate" },
  { label: "Urgent", value: "urgent" },
  { label: "Routine", value: "routine" },
];

const pillColors: Record<SeverityFilter, string> = {
  all: "bg-[#1B4332] text-white",
  immediate: "bg-[#C4704A] text-white",
  urgent: "bg-[#D4A017] text-white",
  routine: "bg-[#2D7D73] text-white",
};

export default function MobileQueue() {
  const router = useRouter();
  const [filter, setFilter] = useState<SeverityFilter>("all");

  const donItems = queue_items.don ?? [];
  const filtered =
    filter === "all"
      ? donItems
      : donItems.filter((item) => item.severity === filter);

  return (
    <div className="min-h-screen bg-[#FAF9F7] pb-20">
      {/* Header */}
      <div className="px-4 pt-12 pb-2">
        <h1 className="text-[22px] font-bold text-[#1B4332]">Review Queue</h1>
        <p className="text-[14px] text-gray-500 mt-0.5">
          {donItems.length} item{donItems.length !== 1 ? "s" : ""} awaiting
          review
        </p>
      </div>

      {/* Filter pills */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        {filterPills.map((pill) => {
          const isActive = filter === pill.value;
          return (
            <button
              key={pill.value}
              data-has-handler="true"
              onClick={() => setFilter(pill.value)}
              className={`px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap min-h-[44px] transition-colors ${
                isActive
                  ? pillColors[pill.value]
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {pill.label}
              {pill.value !== "all" && (
                <span className="ml-1.5 opacity-80">
                  {donItems.filter((i) =>
                    pill.value === "all" ? true : i.severity === pill.value
                  ).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Queue list */}
      <div className="px-4 flex flex-col gap-3 mt-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-[#E8F5F0] flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-[#2D7D73]"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <h3 className="text-[17px] font-semibold text-[#1B4332] mb-1">
              All clear
            </h3>
            <p className="text-[14px] text-gray-500">
              No {filter} items in your queue
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.id}>
              <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wide mb-1.5 ml-1">
                From The {item.source}
              </p>
              <MobileActionCard
                severity={item.severity}
                title={item.title}
                description={`Raised by ${item.source} agent`}
                actionLabel="Review"
                route={item.route}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
