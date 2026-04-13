"use client";

import { useRouter } from "next/navigation";

interface MobileActionCardProps {
  severity: "immediate" | "urgent" | "routine";
  title: string;
  description: string;
  penaltyRisk?: string;
  countdown?: string;
  actionLabel: string;
  route: string;
}

const severityStyles = {
  immediate: {
    border: "border-l-4 border-l-[#C4704A]",
    bg: "bg-[#FDF2EE]",
    button: "bg-[#C4704A] hover:bg-[#B5613D] active:bg-[#A35535]",
    countdownPulse: "animate-pulse",
    dot: "bg-[#C4704A]",
  },
  urgent: {
    border: "border-l-4 border-l-[#D4A017]",
    bg: "bg-[#FDF8E8]",
    button: "bg-[#D4A017] hover:bg-[#C29215] active:bg-[#B08513]",
    countdownPulse: "",
    dot: "bg-[#D4A017]",
  },
  routine: {
    border: "border-l-4 border-l-[#2D7D73]",
    bg: "bg-white",
    button: "bg-[#2D7D73] hover:bg-[#256B62] active:bg-[#1E5A52]",
    countdownPulse: "",
    dot: "bg-[#2D7D73]",
  },
};

export default function MobileActionCard({
  severity,
  title,
  description,
  penaltyRisk,
  countdown,
  actionLabel,
  route,
}: MobileActionCardProps) {
  const router = useRouter();
  const styles = severityStyles[severity];

  return (
    <div className={`rounded-2xl p-4 ${styles.border} ${styles.bg}`}>
      {/* Title + countdown row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-[15px] font-semibold text-[#1B4332] leading-snug flex-1">
          {title}
        </h3>
        {countdown && (
          <span
            className={`text-[13px] font-medium text-gray-500 whitespace-nowrap ${
              severity === "immediate" ? styles.countdownPulse : ""
            }`}
          >
            {countdown}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-[14px] text-gray-600 leading-relaxed mb-3">
        {description}
      </p>

      {/* Penalty risk */}
      {penaltyRisk && (
        <p className="text-[13px] text-[#C4704A] font-medium mb-3">
          {penaltyRisk}
        </p>
      )}

      {/* CTA button */}
      <button
        data-has-handler="true"
        onClick={() => router.push(route)}
        className={`w-full h-12 rounded-xl text-[15px] font-semibold text-white min-h-[44px] transition-colors ${styles.button}`}
      >
        {actionLabel}
      </button>
    </div>
  );
}
