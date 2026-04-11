"use client";

import { useRouter } from "next/navigation";
import { FileText, ChevronRight, Download } from "lucide-react";
import { ChrisAvatar } from "@/components/chris/ChrisAvatar";

// Board Member — read-only, clean, minimal, authoritative.

export default function BoardHome() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "hsl(var(--background))" }}>
      <div className="w-full max-w-md">
        {/* Provider identity */}
        <div className="text-center mb-8">
          <ChrisAvatar size="large" className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Knights of the Holy Grail</h1>
          <p className="text-sm text-muted-foreground">Board member view · Margaret Wilson</p>
        </div>

        {/* Next meeting */}
        <div className="rounded-xl p-5 mb-4" style={{ background: "rgba(27,67,50,0.05)" }}>
          <p className="text-xs text-muted-foreground mb-1">Next Board meeting</p>
          <p className="text-lg font-bold text-foreground">15 May 2026 · 14 days</p>
        </div>

        {/* Board Pack — the one action */}
        <div className="bg-card rounded-xl p-5 border border-border shadow-warm mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-[hsl(var(--brand-forest))]" />
            <p className="text-base font-semibold text-foreground">Q1 2026 Board Pack</p>
          </div>
          <p className="text-xs text-muted-foreground mb-1">8 sections · Approved by CEO · 11 April 2026</p>
          <p className="text-xs text-muted-foreground mb-4">Care minutes, quality indicators, workforce, financial performance, strategic risks, decisions required.</p>
          <button
            onClick={() => router.push("/dashboard/reporting")}
            className="w-full py-3.5 rounded-xl font-medium text-white bg-primary hover:opacity-90 transition-opacity"
          >
            Read Board Pack →
          </button>
        </div>

        {/* Material alerts */}
        <div className="bg-card rounded-xl p-4 border border-border mb-4">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Since your last visit</p>
          <p className="text-xs text-muted-foreground">No material incidents to report. All SIRS obligations met. Facility operations stable.</p>
        </div>

        {/* Prior packs */}
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Prior packs</p>
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-8">
          {["Q4 2025 · Distributed 15 Jan", "Q3 2025 · Distributed 12 Oct", "Q2 2025 · Distributed 14 Jul", "Q1 2025 · Distributed 11 Apr"].map((pack, i) => (
            <div key={i} className={`flex items-center justify-between px-4 py-3 ${i < 3 ? "border-b border-border" : ""}`}>
              <span className="text-xs text-foreground">{pack}</span>
              <button className="text-xs text-[hsl(var(--brand-teal))] font-medium hover:underline">Read →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
