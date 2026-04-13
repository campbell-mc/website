"use client";

import { useRouter } from "next/navigation";

interface QueueDocument {
  id: string;
  title: string;
  severity: "immediate" | "urgent" | "routine";
  timeRemaining?: string;
  penaltyExposure?: string;
  route: string;
  description: string;
}

const SEVERITY_STYLES: Record<string, { border: string; badge: string; badgeText: string }> = {
  immediate: { border: "border-l-[#C4704A]", badge: "bg-[#C4704A]/10 text-[#C4704A]", badgeText: "Immediate" },
  urgent: { border: "border-l-[#D4A017]", badge: "bg-[#D4A017]/10 text-[#D4A017]", badgeText: "Urgent" },
  routine: { border: "border-l-[#2D7D73]", badge: "bg-[#2D7D73]/10 text-[#2D7D73]", badgeText: "Routine" },
};

const DOCUMENTS: QueueDocument[] = [
  {
    id: "sirs-cat1-2026-041",
    title: "SIRS Category 1 — Unreasonable Use of Force",
    severity: "immediate",
    timeRemaining: "6h remaining",
    penaltyExposure: "$783,000 penalty exposure",
    route: "/dashboard/sirs/draft",
    description: "Incident reported 12 Apr 2026. The Chronicler has drafted the SIRS notification. Requires your review before ACQSC submission.",
  },
  {
    id: "board-pack-q3-2026",
    title: "Board Pack — Q3 2025-26",
    severity: "urgent",
    timeRemaining: "4 days",
    route: "/dashboard/governance/board-pack",
    description: "Quarterly governance pack compiled across clinical, workforce, financial and compliance domains. Board meeting scheduled 17 Apr.",
  },
  {
    id: "ca-plan-2026-004",
    title: "Corrective Action Plan — CA-2026-004",
    severity: "routine",
    route: "/dashboard/governance/corrective-actions/CA-2026-004",
    description: "Corrective action plan addressing medication management findings from the February site audit. Due for lodgement 28 Apr.",
  },
];

export default function DocumentsQueuePage() {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-[#D4A017] flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">C</span>
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-foreground tracking-tight leading-tight">
            Documents awaiting review
          </h1>
          <p className="text-[10px] text-muted-foreground">
            {DOCUMENTS.length} documents prepared by The Chronicler
          </p>
        </div>
      </div>

      {/* Document cards */}
      <div className="space-y-3">
        {DOCUMENTS.map((doc) => {
          const style = SEVERITY_STYLES[doc.severity];
          return (
            <div
              key={doc.id}
              className={`bg-card rounded-xl border border-border border-l-4 ${style.border} p-5`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-sm font-semibold text-foreground">{doc.title}</h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${style.badge}`}>
                  {style.badgeText}
                </span>
              </div>

              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{doc.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {doc.timeRemaining && (
                    <span className={`text-xs font-semibold ${doc.severity === "immediate" ? "text-[#C4704A]" : "text-[#D4A017]"}`}>
                      {doc.timeRemaining}
                    </span>
                  )}
                  {doc.penaltyExposure && (
                    <span className="text-xs font-semibold text-[#C4704A]">
                      {doc.penaltyExposure}
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground bg-[#D4A017]/10 px-2 py-0.5 rounded-full font-medium">
                    Chronicler
                  </span>
                </div>
                <button
                  onClick={() => router.push(doc.route)}
                  className="text-xs font-medium text-[#1B4332] hover:underline"
                >
                  Review document &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
