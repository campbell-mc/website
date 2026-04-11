"use client";

type BadgeStatus = "compliant" | "at-risk" | "non-compliant" | "info" | "setup";

interface StatusBadgeProps {
  status: BadgeStatus;
  label?: string;
  showDot?: boolean;
  size?: "xs" | "sm" | "md";
  className?: string;
}

const STATUS_CONFIG: Record<BadgeStatus, { bg: string; text: string; dot: string; defaultLabel: string }> = {
  compliant: {
    bg: "bg-[rgba(45,125,115,0.12)] border-[rgba(45,125,115,0.25)]",
    text: "text-[#2D7D73]",
    dot: "bg-[#2D7D73]",
    defaultLabel: "Compliant",
  },
  "at-risk": {
    bg: "bg-[rgba(212,160,23,0.12)] border-[rgba(212,160,23,0.30)]",
    text: "text-[#9a7212]",
    dot: "bg-[#D4A017]",
    defaultLabel: "At Risk",
  },
  "non-compliant": {
    bg: "bg-[rgba(196,112,74,0.12)] border-[rgba(196,112,74,0.30)]",
    text: "text-[#C4704A]",
    dot: "bg-[#C4704A]",
    defaultLabel: "Non-Compliant",
  },
  info: {
    bg: "bg-[rgba(27,67,50,0.08)] border-[rgba(27,67,50,0.15)]",
    text: "text-[#1B4332]",
    dot: "bg-[#1B4332]",
    defaultLabel: "Info",
  },
  setup: {
    bg: "bg-[#C4704A]",
    text: "text-white",
    dot: "bg-white",
    defaultLabel: "Setup",
  },
};

const SIZE_STYLES = {
  xs: "text-[9px] px-1.5 py-0.5",
  sm: "text-[10px] px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
};

export function StatusBadge({ status, label, showDot = false, size = "sm", className = "" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${config.bg} ${config.text} ${SIZE_STYLES[size]} ${className}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      {label ?? config.defaultLabel}
    </span>
  );
}

// Simple status dot (no text)
export function StatusDot({ status, className = "" }: { status: BadgeStatus; className?: string }) {
  const config = STATUS_CONFIG[status];
  return <span className={`inline-block w-2 h-2 rounded-full ${config.dot} ${className}`} />;
}
