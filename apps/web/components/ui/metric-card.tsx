"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "stable";
  trendLabel?: string;
  status?: "compliant" | "at-risk" | "non-compliant";
  onClick?: () => void;
  className?: string;
}

const STATUS_STYLES = {
  compliant: "border-status-compliant",
  "at-risk": "border-status-at-risk",
  "non-compliant": "border-status-non-compliant",
};

export function MetricCard({
  label,
  value,
  subtitle,
  trend,
  trendLabel,
  status,
  onClick,
  className = "",
}: MetricCardProps) {
  const statusClass = status ? STATUS_STYLES[status] : "";
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-4 shadow-warm-sm border border-[var(--border-default)] ${statusClass} ${
        isClickable ? "cursor-pointer hover:shadow-warm transition-shadow" : ""
      } ${className}`}
    >
      <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold" style={{ color: "var(--brand-forest)" }}>
          {value}
        </p>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            trend === "up" ? "text-emerald-600" :
            trend === "down" ? "text-rose-600" :
            "text-gray-400"
          }`}>
            {trend === "up" && <TrendingUp className="w-3.5 h-3.5" />}
            {trend === "down" && <TrendingDown className="w-3.5 h-3.5" />}
            {trend === "stable" && <Minus className="w-3.5 h-3.5" />}
            {trendLabel && <span>{trendLabel}</span>}
          </div>
        )}
      </div>
      {subtitle && (
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
}
