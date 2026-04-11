"use client";

import { useEffect, useState, useCallback } from "react";
import { ReviewCard } from "@/components/don/ReviewCard";

interface DONReviewItem {
  id: string;
  facilityId: string;
  createdAt: string;
  itemType: string;
  urgency: "immediate" | "urgent" | "routine";
  summary: string;
  fullContext: Record<string, unknown>;
  chrisRecommendation: string | null;
  deadline: string | null;
  status: string;
}

// TODO: Replace with real facility ID from auth context
const FACILITY_ID = "demo-facility";

export default function DONQueuePage() {
  const [items, setItems] = useState<DONReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch(`/api/don/queue?facilityId=${FACILITY_ID}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
        // Cache in localStorage for offline
        localStorage.setItem("don-queue-cache", JSON.stringify(data.items));
      }
    } catch {
      // Offline — load from cache
      const cached = localStorage.getItem("don-queue-cache");
      if (cached) {
        setItems(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();

    // Poll every 30 seconds for new items
    const interval = setInterval(fetchItems, 30_000);

    // Online/offline detection
    function handleOnline() { setOffline(false); fetchItems(); }
    function handleOffline() { setOffline(true); }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setOffline(!navigator.onLine);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [fetchItems]);

  async function handleApprove(itemId: string, note?: string) {
    await fetch("/api/don/queue", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, action: "approve", note }),
    });
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }

  async function handleModify(itemId: string, modifications: Record<string, unknown>, note: string) {
    await fetch("/api/don/queue", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, action: "modify", modifications, note }),
    });
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }

  async function handleReject(itemId: string, note: string) {
    await fetch("/api/don/queue", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, action: "reject", note }),
    });
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }

  // Group by urgency
  const immediate = items.filter((i) => i.urgency === "immediate");
  const urgent = items.filter((i) => i.urgency === "urgent");
  const routine = items.filter((i) => i.urgency === "routine");

  return (
    <div className="min-h-screen" style={{ background: "var(--cream, #FAF7F2)" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 py-3 shadow-sm" style={{ background: "var(--forest, #1B4332)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1B4332] to-[#D4A017] flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg">DON Queue</h1>
            <p className="text-white/60 text-xs">
              {items.length} item{items.length !== 1 ? "s" : ""} pending
            </p>
          </div>
        </div>
      </header>

      {/* Offline banner */}
      {offline && (
        <div className="bg-amber-100 text-amber-800 text-center py-2 text-sm font-medium">
          Offline — showing cached items. Actions will sync when reconnected.
        </div>
      )}

      {/* Queue content */}
      <main className="px-4 py-4 max-w-lg mx-auto">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "#e8f5e9" }}>
              <span className="text-2xl">✓</span>
            </div>
            <p className="text-gray-600 font-medium">All clear</p>
            <p className="text-gray-400 text-sm mt-1">No items require your attention</p>
          </div>
        ) : (
          <>
            {/* Immediate */}
            {immediate.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">
                  Immediate ({immediate.length})
                </h2>
                {immediate.map((item) => (
                  <ReviewCard
                    key={item.id}
                    item={item}
                    onApprove={handleApprove}
                    onModify={handleModify}
                    onReject={handleReject}
                  />
                ))}
              </section>
            )}

            {/* Urgent */}
            {urgent.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--amber)" }}>
                  Urgent ({urgent.length})
                </h2>
                {urgent.map((item) => (
                  <ReviewCard
                    key={item.id}
                    item={item}
                    onApprove={handleApprove}
                    onModify={handleModify}
                    onReject={handleReject}
                  />
                ))}
              </section>
            )}

            {/* Routine */}
            {routine.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--teal, #2D7D73)" }}>
                  Routine ({routine.length})
                </h2>
                {routine.map((item) => (
                  <ReviewCard
                    key={item.id}
                    item={item}
                    onApprove={handleApprove}
                    onModify={handleModify}
                    onReject={handleReject}
                  />
                ))}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
