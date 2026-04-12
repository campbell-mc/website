"use client";

/**
 * CHRIS Design System — Reusable Components
 *
 * Every screen imports from here. No one-off styling decisions.
 * The urgency system, stat cards, action cards, progress bars,
 * badges, and loading states are all defined once and used everywhere.
 */

import { AlertTriangle, CheckCircle, Info, MoreHorizontal, TrendingUp, TrendingDown, Minus } from "lucide-react";

// ── URGENCY TYPES ─────────────────────────────────────────────

export type Urgency = "immediate" | "urgent" | "routine" | "positive";

// ── URGENCY CARD ──────────────────────────────────────────────

export function UrgencyCard({
  urgency,
  children,
  className = "",
}: {
  urgency: Urgency;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`urgency-${urgency} rounded-xl p-4 action-card ${className}`}>
      {children}
    </div>
  );
}

// ── URGENCY BADGE ─────────────────────────────────────────────

export function UrgencyBadge({ urgency, label }: { urgency: Urgency; label: string }) {
  return (
    <span className={`badge-${urgency} text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full`}>
      {label}
    </span>
  );
}

// ── URGENCY ICON ──────────────────────────────────────────────

export function UrgencyIcon({ urgency, className = "w-5 h-5" }: { urgency: Urgency; className?: string }) {
  const colors = {
    immediate: "text-[#C4704A]",
    urgent: "text-[#D4A017]",
    routine: "text-[#2D7D73]",
    positive: "text-[#6BAF92]",
  };

  if (urgency === "positive") return <CheckCircle className={`${className} ${colors[urgency]}`} />;
  if (urgency === "routine") return <Info className={`${className} ${colors[urgency]}`} />;
  return <AlertTriangle className={`${className} ${colors[urgency]}`} />;
}

// ── COUNTDOWN ─────────────────────────────────────────────────

export function Countdown({ value, urgency }: { value: string; urgency: Urgency }) {
  const sizes = { immediate: "text-lg font-bold", urgent: "text-sm font-bold", routine: "text-xs font-medium", positive: "text-xs" };
  const colors = { immediate: "text-[#C4704A]", urgent: "text-[#D4A017]", routine: "text-[#6B7280]", positive: "text-[#6BAF92]" };
  const pulse = urgency === "immediate" ? "countdown-pulse" : "";

  return <span className={`${sizes[urgency]} ${colors[urgency]} ${pulse} font-mono`}>{value}</span>;
}

// ── STAT CARD ─────────────────────────────────────────────────

export type TrendDirection = "improving" | "declining" | "stable";

export function StatCard({
  value,
  label,
  trend,
  alert,
  onClick,
  className = "",
}: {
  value: string;
  label: string;
  trend?: TrendDirection;
  alert?: "amber" | "terra";
  onClick?: () => void;
  className?: string;
}) {
  const alertClass = alert === "amber" ? "stat-card-alert-amber" : alert === "terra" ? "stat-card-alert-terra" : "";

  return (
    <button
      onClick={onClick}
      data-has-handler={onClick ? "true" : undefined}
      className={`stat-card ${alertClass} text-left ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-card-value">{value}</p>
          <p className="stat-card-label mt-1">{label}</p>
        </div>
        {trend && <TrendArrow direction={trend} />}
      </div>
    </button>
  );
}

function TrendArrow({ direction }: { direction: TrendDirection }) {
  if (direction === "improving") return <TrendingUp className="w-4 h-4 text-[#2D7D73]" />;
  if (direction === "declining") return <TrendingDown className="w-4 h-4 text-[#C4704A]" />;
  return <Minus className="w-3.5 h-3.5 text-[#9CA3AF]" />;
}

// ── PROGRESS BAR ──────────────────────────────────────────────

export function ProgressBar({
  value,
  target,
  label,
  showLabel = true,
}: {
  value: number;
  target: number;
  label?: string;
  showLabel?: boolean;
}) {
  const pct = Math.min(100, Math.round((value / target) * 100));
  const fillClass = pct >= 95 ? "progress-bar-good" : pct >= 85 ? "progress-bar-watch" : "progress-bar-act";

  return (
    <div>
      {showLabel && label && (
        <p className="text-xs text-[#6B7280] mb-1">{label} — {value} / {target}</p>
      )}
      <div className="progress-bar-track">
        <div className={`progress-bar-fill ${fillClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── ACTION CARD CTA ───────────────────────────────────────────

export function ActionCTA({
  label,
  variant = "primary",
  onClick,
}: {
  label: string;
  variant?: "primary" | "outlined" | "teal";
  onClick?: () => void;
}) {
  const cls = variant === "primary" ? "action-card-cta-primary"
    : variant === "teal" ? "action-card-cta-teal"
    : "action-card-cta-outlined";

  return (
    <button data-has-handler={onClick ? "true" : undefined} onClick={onClick} className={`action-card-cta ${cls}`}>
      {label}
    </button>
  );
}

// ── PENALTY / RISK LINE ───────────────────────────────────────

export function PenaltyLine({ text }: { text: string }) {
  return <p className="action-card-penalty mt-1">{text}</p>;
}

// ── SECTION HEADER ────────────────────────────────────────────

export function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B7280] mb-2">
      {children}
    </p>
  );
}

// ── NOTIFICATION BADGE ────────────────────────────────────────

export function NotificationBadge({ count, variant = "red" }: { count: number; variant?: "red" | "amber" | "terra" | "teal" }) {
  const colorClass = `badge-count-${variant}`;
  const display = count > 99 ? "99+" : count.toString();

  return <span className={`badge-count ${colorClass}`}>{display}</span>;
}

// ── SKELETON LOADING ──────────────────────────────────────────

export function SkeletonCard() {
  return <div className="skeleton skeleton-card" />;
}

export function SkeletonBlock() {
  return <div className="skeleton skeleton-block" />;
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div>
      <div className="skeleton skeleton-title" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton skeleton-text" style={{ width: i === lines - 1 ? "60%" : "100%" }} />
      ))}
    </div>
  );
}

// ── EMPTY STATE ───────────────────────────────────────────────

export function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center py-12 px-6">
      <div className="w-16 h-16 rounded-full bg-[#F0F7F4] flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-[#2D7D73]" />
      </div>
      <p className="text-base font-semibold text-[#1A1A1A] mb-1">{title}</p>
      <p className="text-sm text-[#6B7280]">{subtitle}</p>
    </div>
  );
}

// ── ERROR STATE ───────────────────────────────────────────────

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="text-center py-12 px-6">
      <div className="w-16 h-16 rounded-full bg-[#FEF7F0] flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-8 h-8 text-[#C4704A]" />
      </div>
      <p className="text-base font-semibold text-[#1A1A1A] mb-1">Something went wrong</p>
      <p className="text-sm text-[#6B7280] mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-sm font-medium text-[#2D7D73] hover:underline">
          Try refreshing
        </button>
      )}
    </div>
  );
}
