"use client";

interface ScoreRingProps {
  score: number; // 0-100
  size?: "sm" | "md" | "lg";
  label?: string;
  delta?: number; // +/- change
  className?: string;
}

const SIZES = {
  sm: { outer: 48, stroke: 4, fontSize: "text-sm", labelSize: "text-[9px]" },
  md: { outer: 64, stroke: 5, fontSize: "text-lg", labelSize: "text-[10px]" },
  lg: { outer: 120, stroke: 6, fontSize: "text-3xl", labelSize: "text-xs" },
};

function getScoreColor(score: number): string {
  if (score >= 75) return "var(--brand-teal)";
  if (score >= 50) return "var(--brand-amber)";
  return "var(--brand-terracotta)";
}

export function ScoreRing({ score, size = "md", label, delta, className = "" }: ScoreRingProps) {
  const s = SIZES[size];
  const radius = (s.outer - s.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div className="relative" style={{ width: s.outer, height: s.outer }}>
        <svg width={s.outer} height={s.outer} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={s.outer / 2}
            cy={s.outer / 2}
            r={radius}
            fill="none"
            stroke="rgba(27, 67, 50, 0.08)"
            strokeWidth={s.stroke}
          />
          {/* Score ring */}
          <circle
            cx={s.outer / 2}
            cy={s.outer / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={s.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-700"
          />
        </svg>
        {/* Score number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${s.fontSize}`} style={{ color }}>
            {score}
          </span>
        </div>
      </div>
      {label && (
        <span className={`font-medium text-gray-500 ${s.labelSize}`}>{label}</span>
      )}
      {delta !== undefined && delta !== 0 && (
        <span
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
            delta > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
          }`}
        >
          {delta > 0 ? "+" : ""}{delta}%
        </span>
      )}
    </div>
  );
}
