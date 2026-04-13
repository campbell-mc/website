"use client";

interface StatItem {
  value: string;
  label: string;
  suffix?: string;
  urgency?: "immediate" | "urgent" | "routine" | "none";
}

export function MobileStatGrid({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => {
        const urgency = stat.urgency ?? "none";
        const cardClass =
          urgency === "immediate"
            ? "border-l-4 border-l-[#C4704A] bg-[#FEF7F0] border-gray-100"
            : urgency === "urgent"
              ? "border-l-4 border-l-[#D4A017] bg-[#FFFBF0] border-gray-100"
              : urgency === "routine"
                ? "border-l-4 border-l-[#2D7D73] bg-white border-gray-100"
                : "border-gray-100";
        const valueColor =
          urgency === "immediate"
            ? "text-[#C4704A]"
            : urgency === "urgent"
              ? "text-[#D4A017]"
              : "text-gray-900";

        return (
          <div
            key={stat.label}
            className={`bg-white rounded-2xl border p-4 min-h-[88px] flex flex-col justify-between ${cardClass}`}
          >
            <div className="flex items-baseline gap-0.5">
              <span className={`text-[32px] font-bold leading-none ${valueColor}`}>
                {stat.value}
              </span>
              {stat.suffix && (
                <span className="text-[16px] text-gray-400 font-medium">{stat.suffix}</span>
              )}
            </div>
            <span className="text-[12px] uppercase tracking-wide text-gray-500 font-medium">
              {stat.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
