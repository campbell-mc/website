"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { RefreshCw, MessageCircle } from "lucide-react";
import { ChrisAvatar } from "./ChrisAvatar";
import { useRouter } from "next/navigation";
import { useFacility } from "@/lib/context/facility";
import { subscribeSituationReport } from "@/lib/realtime/subscriptions";

// ============================================================================
// CHRIS Situation Report — the most important component in the platform
//
// Works in two modes:
//   1. Seed data mode — narrative passed as prop (current)
//   2. Real-time mode — subscribes to Neon NOTIFY (when wired)
//
// The component always renders. If a real-time update arrives,
// it replaces the prop-based narrative with a fade transition.
// Manual refresh calls the API route and is rate-limited to 5 min.
// ============================================================================

export type SituationDomain =
  | "operations" | "clinical" | "workforce"
  | "financial" | "governance" | "residents";

export interface SignalDot {
  domain: string;
  active: boolean;
}

interface SituationReportProps {
  domain: SituationDomain;
  narrative: string;
  refreshedAt: string;
  context: string;
  signals?: SignalDot[];
  onRefresh?: () => void;
}

const DOMAIN_LABELS: Record<SituationDomain, string> = {
  operations: "Operations",
  clinical: "Clinical",
  workforce: "Workforce",
  financial: "Financial",
  governance: "Governance",
  residents: "Residents",
};

export function SituationReport({
  domain,
  narrative: initialNarrative,
  refreshedAt: initialRefreshedAt,
  context,
  signals,
  onRefresh,
}: SituationReportProps) {
  const router = useRouter();
  const { facilityId } = useFacility();
  const [narrative, setNarrative] = useState(initialNarrative);
  const [refreshedAt, setRefreshedAt] = useState(initialRefreshedAt);
  const [refreshing, setRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(true);

  // Keep in sync with prop changes (e.g. page navigation)
  useEffect(() => {
    setNarrative(initialNarrative);
    setRefreshedAt(initialRefreshedAt);
  }, [initialNarrative, initialRefreshedAt]);

  // Subscribe to real-time updates from Neon
  // When wired, this will receive live narrative updates on threshold crossings
  useEffect(() => {
    if (!facilityId) return;

    const unsubscribe = subscribeSituationReport(
      facilityId,
      domain,
      (newNarrative, newUpdatedAt) => {
        setRefreshing(true);
        setTimeout(() => {
          setNarrative(newNarrative);
          setRefreshedAt(formatRelativeTime(new Date(newUpdatedAt)));
          setRefreshing(false);
        }, 300);
      }
    );

    return unsubscribe;
  }, [facilityId, domain]);

  // Manual refresh — calls API, rate limited 5 min
  const handleRefresh = useCallback(async () => {
    if (!canRefresh || refreshing) return;

    setRefreshing(true);
    setCanRefresh(false);

    // Re-enable after 5 minutes
    setTimeout(() => setCanRefresh(true), 5 * 60 * 1000);

    try {
      const response = await fetch("/api/situation-report/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facilityId, domain, trigger: "manual" }),
      });

      if (response.ok) {
        const data = await response.json();
        setNarrative(data.narrative);
        setRefreshedAt(formatRelativeTime(new Date(data.updated_at)));
      }
    } catch {
      // Refresh failed — keep existing narrative
    } finally {
      setRefreshing(false);
    }

    onRefresh?.();
  }, [facilityId, domain, canRefresh, refreshing, onRefresh]);

  const [expanded, setExpanded] = useState(false);
  const { preview, hasMore } = useMemo(() => {
    const sentences = narrative.split(/(?<=\.)\s+/).filter(Boolean);
    if (sentences.length <= 4) return { preview: narrative, hasMore: false };
    return { preview: sentences.slice(0, 4).join(' '), hasMore: true };
  }, [narrative]);

  return (
    <div
      className="rounded-xl border-l-4 border-l-[hsl(var(--brand-forest))] border border-border p-5 mb-4"
      style={{ background: "rgba(250, 247, 242, 0.8)" }}
    >
      {/* Header row */}
      <div className="flex items-center gap-2 mb-3">
        <ChrisAvatar size="small" showGlow />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-[hsl(var(--brand-forest))] break-words">
            CHRIS · {DOMAIN_LABELS[domain]} · Updated {refreshedAt}
            <span className="hidden sm:inline"> · {context}</span>
          </p>
        </div>
      </div>

      {/* Narrative — 4 sentence max, expand for more */}
      <div className={`text-sm text-foreground leading-relaxed font-serif-accent mb-4 transition-opacity duration-300 ${refreshing ? "opacity-40" : "opacity-100"}`}>
        {refreshing && !narrative ? (
          <span className="text-muted-foreground italic">Generating situation report...</span>
        ) : (
          <>
            {expanded ? narrative : preview}
            {hasMore && (
              <button onClick={() => setExpanded(!expanded)} className="ml-1 text-[#2D7D73] text-sm font-medium hover:underline">
                {expanded ? 'Show less' : 'Read more →'}
              </button>
            )}
          </>
        )}
      </div>

      {/* Signal dots + actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {signals && signals.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-muted-foreground mr-1">Signals:</span>
            {signals.map((s) => (
              <span
                key={s.domain}
                className={`inline-flex items-center gap-0.5 text-[9px] ${
                  s.active ? "text-[hsl(var(--brand-forest))]" : "text-muted-foreground/40"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  s.active ? "bg-[hsl(var(--brand-forest))]" : "bg-muted-foreground/20"
                }`} />
                {s.domain}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={!canRefresh || refreshing}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            title={!canRefresh ? "Wait 5 minutes between refreshes" : "Refresh"}
          >
            <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            data-has-handler="true"
            onClick={() => router.push("/dashboard/coach")}
            className="flex items-center gap-1 text-[11px] font-medium text-[hsl(var(--brand-forest))] hover:opacity-80 transition-opacity"
          >
            <MessageCircle className="w-3 h-3" />
            Ask CHRIS about this
          </button>
        </div>
      </div>
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString("en-AU");
}
