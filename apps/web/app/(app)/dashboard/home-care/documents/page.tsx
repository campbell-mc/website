"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, FileText } from "lucide-react";

/* ── Design tokens ─────────────────────────────────────────────── */
const FOREST = "#1B4332";
const TEAL = "#2D7D73";
const AMBER = "#D4A017";
const TERRACOTTA = "#C4704A";

/* ── Types ─────────────────────────────────────────────────────── */

interface DocumentCard {
  id: string;
  title: string;
  severity: "routine" | "urgent";
  description: string;
  chroniclerBadge: boolean;
  route: string;
}

/* ── Data ──────────────────────────────────────────────────────── */

const documents: DocumentCard[] = [
  {
    id: "DOC-HC-001",
    title: "Budget Statement — C-0042",
    severity: "routine",
    description:
      "Monthly budget statement for client C-0042. Package utilisation at 84%. No variances requiring escalation.",
    chroniclerBadge: true,
    route: "/dashboard/home-care/packages/statements",
  },
  {
    id: "DOC-HC-002",
    title: "Budget Statement — C-0118",
    severity: "routine",
    description:
      "Monthly budget statement for client C-0118. Package utilisation at 91%. Surplus trending toward unspent funds threshold.",
    chroniclerBadge: true,
    route: "/dashboard/home-care/packages/statements",
  },
  {
    id: "DOC-HC-003",
    title: "Client complaint response — food quality",
    severity: "urgent",
    description:
      "Formal response required for complaint lodged regarding meal quality during visits. Deadline approaching. Requires your review before dispatch.",
    chroniclerBadge: true,
    route: "/dashboard/home-care/clients/feedback",
  },
];

const SEVERITY_STYLES: Record<string, { border: string; badge: string; badgeText: string; label: string }> = {
  routine: {
    border: `border-l-[${TEAL}]`,
    badge: "bg-[#F0F7F4]",
    badgeText: `text-[${TEAL}]`,
    label: "Routine",
  },
  urgent: {
    border: `border-l-[${TERRACOTTA}]`,
    badge: "bg-[#FEF7F0]",
    badgeText: `text-[${TERRACOTTA}]`,
    label: "Urgent",
  },
};

/* ── Page ──────────────────────────────────────────────────────── */

export default function HomeCareDocumentsPage() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: AMBER }}
        >
          <span className="text-white text-sm font-bold">C</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#111827]">
            Documents awaiting review
          </h1>
          <p className="text-sm text-[#6B7280]">
            Prepared by The Chronicler &middot; 3 documents
          </p>
        </div>
      </div>

      {/* Document cards */}
      <div className="space-y-4">
        {documents.map((doc) => {
          const sev = doc.severity;
          const borderColor = sev === "urgent" ? TERRACOTTA : TEAL;
          const badgeBg = sev === "urgent" ? "#FEF7F0" : "#F0F7F4";
          const badgeColor = sev === "urgent" ? TERRACOTTA : TEAL;
          const label = sev === "urgent" ? "Urgent" : "Routine";

          return (
            <div
              key={doc.id}
              className="rounded-xl border bg-white overflow-hidden"
              style={{
                borderLeftWidth: "4px",
                borderLeftColor: borderColor,
                borderColor: "#E5E7EB",
              }}
            >
              <div className="px-5 py-4">
                {/* Top row */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-mono text-[#6B7280]">
                    {doc.id}
                  </span>
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: badgeBg, color: badgeColor }}
                  >
                    {label}
                  </span>
                  {doc.chroniclerBadge && (
                    <span
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1"
                      style={{ backgroundColor: `${AMBER}15`, color: AMBER }}
                    >
                      <FileText className="w-3 h-3" />
                      Chronicler
                    </span>
                  )}
                </div>

                {/* Title + description */}
                <h3 className="text-sm font-semibold text-[#111827] mb-1">
                  {doc.title}
                </h3>
                <p className="text-xs text-[#6B7280] leading-relaxed mb-3">
                  {doc.description}
                </p>

                {/* CTA */}
                <button
                  onClick={() => router.push(doc.route)}
                  className="text-sm font-medium flex items-center gap-1"
                  style={{ color: FOREST }}
                >
                  Review document
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-16" />
    </div>
  );
}
