"use client";

import { ChrisAvatar } from "./ChrisAvatar";

interface ChrisMessageProps {
  message: string;
  showAvatar?: boolean;
  variant?: "default" | "insight" | "suggestion";
  className?: string;
}

const VARIANT_STYLES = {
  default: "bg-gradient-to-r from-[#E8F5EE] via-[#E8F5EE] to-[#E8F5EE]",
  insight: "bg-gradient-to-r from-[#D4EDDD] to-[#E8F5EE]",
  suggestion: "bg-gradient-to-r from-[#E8F5EE] to-[#f5f0e8]",
};

const VARIANT_BADGES: Record<string, string | null> = {
  default: null,
  insight: "Insight",
  suggestion: "Suggestion",
};

export function ChrisMessage({ message, showAvatar = true, variant = "default", className = "" }: ChrisMessageProps) {
  const badge = VARIANT_BADGES[variant];

  return (
    <div className={`flex gap-3 items-start ${className}`}>
      {showAvatar && <ChrisAvatar size="small" />}
      <div className={`flex-1 rounded-2xl border border-[#D4EDDD]/60 p-4 ${VARIANT_STYLES[variant]}`}>
        {badge && (
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-[#1B4332]/60 bg-white/60 px-2 py-0.5 rounded-full mb-2">
            {badge}
          </span>
        )}
        <p className="text-sm text-[#1B4332] leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
