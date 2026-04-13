"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { queue_items } from "@/lib/seed-data";

type FilterType = "all" | "immediate" | "urgent" | "routine";

// TODO: Read role from session — default to DON for demo
const ROLE = "don";
const items = queue_items[ROLE] ?? [];

export default function QueuePage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = filter === "all" ? items : items.filter((i) => i.severity === filter);
  const counts = {
    immediate: items.filter((i) => i.severity === "immediate").length,
    urgent: items.filter((i) => i.severity === "urgent").length,
    routine: items.filter((i) => i.severity === "routine").length,
  };

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto pb-24">
      <div className="flex items-center gap-2 mb-1">
        <button data-has-handler="true" onClick={() => router.push("/dashboard")} className="p-1 -ml-1 hover:bg-muted rounded-lg">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <p className="text-[28px] font-bold text-foreground tracking-tight leading-tight">Review Queue</p>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        {items.length} items · {counts.immediate} immediate · {counts.urgent} urgent
      </p>

      {/* Filter pills */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {([
          { id: "all" as const, label: `All ${items.length}` },
          { id: "immediate" as const, label: `Immediate ${counts.immediate}` },
          { id: "urgent" as const, label: `Urgent ${counts.urgent}` },
          { id: "routine" as const, label: `Routine ${counts.routine}` },
        ]).map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f.id ? "bg-[#1B4332] text-white" : "bg-white border border-border text-muted-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Queue items */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div key={item.id}>
            <p className="text-[10px] text-muted-foreground mb-1 ml-1">From The {item.source}</p>
            <button
              data-has-handler="true"
              onClick={() => router.push(item.route)}
              className={`w-full text-left rounded-xl p-4 border border-border ${
                item.severity === "immediate" ? "border-l-[6px] border-l-[#C4704A] bg-[#FEF7F0]" :
                item.severity === "urgent" ? "border-l-[6px] border-l-[#D4A017] bg-[#FFFBF0]" :
                "border-l-4 border-l-[#2D7D73] bg-white"
              }`}
            >
              <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
              <p className="text-xs font-medium text-[#1B4332]">Open →</p>
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-2xl mb-2">✓</p>
            <p className="text-foreground font-medium">All clear</p>
            <p className="text-muted-foreground text-sm mt-1">No {filter} items in your queue</p>
          </div>
        )}
      </div>
    </div>
  );
}
