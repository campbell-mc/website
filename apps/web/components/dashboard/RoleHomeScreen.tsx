"use client";

import { useRouter } from "next/navigation";
import { Bell, ChevronRight, Sparkles, Mic } from "lucide-react";
import { ChrisAvatar } from "../chris/ChrisAvatar";
import { AgentPulse } from "../chris/AgentPulse";

// ============================================================================
// RoleHomeScreen — Reusable home screen template for every role
// Same pattern, different data. Today's Picture → Domain Strip →
// Top 3 Actions → CHRIS Intelligence → Briefing entry
// ============================================================================

export interface DomainStatus {
  name: string;
  status: "clear" | "watch" | "act";
  summary: string;
  href: string;
}

export interface TopAction {
  priority: "act" | "watch" | "clear";
  label: string;
  actionLabel: string;
  href: string;
}

export interface IntelligenceSignal {
  type: string;
  confidence: string;
  domains: string[];
  headline: string;
  detail: string;
}

export interface RoleHomeConfig {
  greeting: string;
  subtitle: string;
  todaysPicture: string;
  domains: DomainStatus[];
  topActions: TopAction[];
  intelligence?: IntelligenceSignal;
  briefing?: { label: string; sub: string; href: string };
  queueCount?: number;
  queueHref?: string;
  notificationCount?: number;
}

export function RoleHomeScreen({ config, children }: { config: RoleHomeConfig; children?: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="p-4 lg:p-6 max-w-lg lg:max-w-3xl mx-auto">
      {/* 1. GREETING — matches MobileHome exactly */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[28px] lg:text-lg font-bold lg:font-semibold text-gray-900">{config.greeting}</h1>
          <p className="text-[13px] lg:text-xs text-gray-500">{config.subtitle}</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-[13px] font-medium text-gray-700 lg:hidden">
          <Mic className="w-4 h-4" /><span>Ask</span>
        </button>
        {config.notificationCount !== undefined && config.notificationCount > 0 && (
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors hidden lg:block">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-[hsl(var(--brand-amber))] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{config.notificationCount}</span>
          </button>
        )}
      </div>

      {/* 2. TODAY'S PICTURE — no avatar on mobile, matches MobileHome */}
      <div className="bg-white lg:bg-transparent rounded-2xl lg:rounded-xl border border-gray-100 lg:border-0 p-5 mb-5" style={{ background: undefined }}>
        <div className="flex items-start gap-3">
          <ChrisAvatar size="small" showGlow className="shrink-0 mt-0.5 hidden lg:block" />
          <div className="lg:hidden flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#1B4332] flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-900">CHRIS</p>
              <p className="text-[12px] text-gray-400">Updated 2h ago</p>
            </div>
          </div>
        </div>
        <p className="text-[17px] lg:text-sm text-gray-800 leading-[1.65] lg:leading-relaxed">{config.todaysPicture}</p>
      </div>

      <AgentPulse domain="all" />

      {/* 3. DOMAIN STATUS STRIP */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Across your domains</p>
      <div className="bg-white rounded-2xl lg:rounded-xl border border-gray-100 lg:border-border overflow-hidden mb-5">
        {config.domains.map((d) => {
          const indicator = d.status === "clear" ? "✅" : d.status === "watch" ? "⚠️" : "🔴";
          return (
            <button
              key={d.name}
              onClick={() => router.push(d.href)}
              className={`flex items-center justify-between w-full px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors ${d.status === "act" ? "bg-[rgba(196,112,74,0.04)]" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[15px] lg:text-sm">{indicator}</span>
                <span className="text-[15px] lg:text-sm font-medium text-foreground">{d.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] lg:text-xs text-muted-foreground">{d.summary}</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. TOP 3 ACTIONS */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">Top {config.topActions.length} actions</p>
      <div className="space-y-2 mb-5">
        {config.topActions.map((action, i) => (
          <div
            key={i}
            className={`bg-card rounded-xl p-4 border border-border border-l-4 ${
              action.priority === "act" ? "border-l-[hsl(var(--brand-terracotta))]" : action.priority === "clear" ? "border-l-[hsl(var(--brand-teal))]" : "border-l-[hsl(var(--brand-amber))]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-sm font-bold text-muted-foreground w-5 shrink-0">{i + 1}.</span>
                <p className="text-[15px] lg:text-sm font-medium text-foreground">{action.label}</p>
              </div>
              <button onClick={() => router.push(action.href)} className="text-[13px] lg:text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 shrink-0 ml-3">
                {action.actionLabel}
              </button>
            </div>
          </div>
        ))}
        {config.queueCount !== undefined && config.queueCount > 0 && (
          <button onClick={() => router.push(config.queueHref ?? "/don/queue")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mt-1">
            {config.queueCount} more items in your queue <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 5. CHRIS INTELLIGENCE */}
      {config.intelligence && (
        <div className="bg-card rounded-xl p-4 border border-border mb-5">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[hsl(var(--brand-amber)/0.1)] text-[hsl(var(--brand-amber))]">{config.intelligence.type}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-dashed border-[hsl(var(--brand-amber))] text-muted-foreground">{config.intelligence.confidence}</span>
            {config.intelligence.domains.map((d) => (
              <span key={d} className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{d}</span>
            ))}
          </div>
          <p className="text-[15px] lg:text-sm font-medium text-foreground mb-1">{config.intelligence.headline}</p>
          <p className="text-[13px] lg:text-xs text-muted-foreground leading-relaxed mb-2">{config.intelligence.detail}</p>
          <div className="flex items-center gap-2">
            <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Act</button>
            <button className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted">Monitor</button>
            <button className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground ml-auto">Not relevant</button>
          </div>
        </div>
      )}

      {/* 5.5 ROLE-SPECIFIC FINANCIAL SECTION */}
      {children && <div className="mb-5">{children}</div>}

      <div className="h-16" />
    </div>
  );
}
