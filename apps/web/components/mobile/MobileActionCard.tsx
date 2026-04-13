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
  source?: string;
}

export default function MobileActionCard({ severity, title, description, penaltyRisk, countdown, actionLabel, route, source }: MobileActionCardProps) {
  const router = useRouter();

  return (
    <div className={`rounded-2xl overflow-hidden border border-gray-100 ${
      severity === "immediate" ? "border-l-[6px] border-l-[#C4704A] bg-[#FEF7F0]" :
      severity === "urgent" ? "border-l-[6px] border-l-[#D4A017] bg-[#FFFBF0]" :
      "border-l-[4px] border-l-[#2D7D73] bg-white"
    }`}>
      <div className="p-5">
        {source && <p className="text-[11px] text-gray-400 mb-1.5">From The {source}</p>}

        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-[17px] font-semibold text-gray-900 leading-snug flex-1">{title}</h3>
          {countdown && (
            <span className={`text-[15px] font-bold shrink-0 mt-0.5 ${
              severity === "immediate" ? "text-[#C4704A] animate-pulse" : "text-[#D4A017]"
            }`}>{countdown}</span>
          )}
        </div>

        <p className="text-[15px] text-gray-600 leading-relaxed mb-3">{description}</p>

        {penaltyRisk && <p className="text-[13px] font-bold text-[#C4704A] mb-4">⚠ {penaltyRisk}</p>}

        <button
          data-has-handler="true"
          onClick={() => router.push(route)}
          className={`w-full py-4 rounded-xl text-[16px] font-semibold flex items-center justify-center active:opacity-80 transition-opacity ${
            severity === "immediate" || severity === "urgent"
              ? "bg-[#1B4332] text-white"
              : "border-2 border-[#1B4332] text-[#1B4332]"
          }`}
        >{actionLabel}</button>
      </div>
    </div>
  );
}
