"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { MobileStatGrid } from "./MobileStatGrid";

const closedItems = [
  { id: "SIRS-2026-012", category: "Cat 2", summary: "Medication error — wrong dosage administered, no adverse outcome", closedDate: "8 Apr 2026", daysOpen: 6 },
  { id: "SIRS-2026-011", category: "Cat 2", summary: "Unexplained bruising reported by family — investigated, accidental", closedDate: "2 Apr 2026", daysOpen: 11 },
  { id: "SIRS-2026-010", category: "Cat 1", summary: "Resident fall with minor laceration — treated onsite, family notified", closedDate: "28 Mar 2026", daysOpen: 14 },
  { id: "SIRS-2026-009", category: "Cat 2", summary: "Missing controlled substance — reconciliation confirmed dispensing error", closedDate: "21 Mar 2026", daysOpen: 18 },
];

export default function MobileSIRS() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAF9F7] pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <button
            data-has-handler="true"
            onClick={() => router.push("/dashboard/clinical")}
            className="p-2 -ml-2 active:bg-gray-100 rounded-xl"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-[28px] font-bold text-gray-900">SIRS Register</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Serious Incident Response Scheme</p>
          </div>
        </div>
      </div>

      {/* Stat grid */}
      <div className="px-4 mt-4">
        <MobileStatGrid
          stats={[
            { value: "0", label: "Cat 1 open", urgency: "none" },
            { value: "0", label: "Cat 2 open", urgency: "none" },
            { value: "4", label: "Closed", urgency: "none" },
            { value: "12", label: "Avg days", suffix: "d", urgency: "none" },
          ]}
        />
      </div>

      {/* All clear card */}
      <div className="mx-4 mt-4 bg-[#E8F5F0] rounded-2xl border border-[#B8E0D2] p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2D7D73] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <p className="text-[17px] font-semibold text-[#1B4332]">All clear</p>
            <p className="text-[13px] text-[#2D7D73] leading-snug">
              No open SIRS incidents. Zero Category 1 and Category 2 matters requiring action.
            </p>
          </div>
        </div>
      </div>

      {/* CHRIS analysis card */}
      <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1B4332] to-[#C9A84C] flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold">C</span>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-gray-900">CHRIS Analysis</p>
            <p className="text-[12px] text-gray-400">Pattern detection across closed incidents</p>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FEF7F0] text-[#C4704A]">
            Causal
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#E8F5F0] text-[#2D7D73]">
            Strong
          </span>
        </div>

        <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
          Two of the last four closed incidents involved medication management processes. Both
          occurred during afternoon shift changeover. This suggests a handover communication
          pattern rather than individual error. Recommend reviewing the medication handover
          protocol for the 14:00 transition.
        </p>

        <button
          data-has-handler="true"
          onClick={() => router.push("/dashboard/sirs/patterns")}
          className="w-full py-3.5 rounded-xl text-[15px] font-semibold border-2 border-[#1B4332] text-[#1B4332] flex items-center justify-center active:opacity-80 transition-opacity min-h-[56px]"
        >
          View pattern analysis
        </button>
      </div>

      {/* Closed items */}
      <div className="px-4 mt-4">
        <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Recently closed
        </p>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {closedItems.map((item, i) => (
            <div
              key={item.id}
              className={`px-5 py-4 ${i < closedItems.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] font-semibold text-[#1B4332]">{item.id}</span>
                <span className="text-[11px] text-gray-400 font-medium">{item.category}</span>
              </div>
              <p className="text-[14px] text-gray-700 leading-snug">{item.summary}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[12px] text-gray-400">Closed {item.closedDate}</span>
                <span className="text-[12px] text-gray-400">{item.daysOpen}d open</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
