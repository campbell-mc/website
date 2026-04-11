"use client";

interface LoopIndicatorProps {
  loopNumber: number;
  currentWeek: 1 | 2;
  loopType: "team" | "leader";
  className?: string;
}

export function LoopIndicator({ loopNumber, currentWeek, loopType, className = "" }: LoopIndicatorProps) {
  const totalDots = 7;
  const filledDots = currentWeek === 1 ? 3 : 7;
  const typeLabel = loopType === "team" ? "Team Loop" : "Leader Loop";
  const typeColor = loopType === "team" ? "#1B4332" : "#D4A017";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Week 1 */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Wk 1</span>
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{ background: currentWeek >= 1 ? typeColor : "#e5e7eb" }}
        >
          {currentWeek >= 1 ? "✓" : ""}
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: totalDots }).map((_, i) => (
            <div
              key={`w1-${i}`}
              className="w-1.5 h-1.5 rounded-full transition-colors"
              style={{ background: i < (currentWeek === 1 ? filledDots : totalDots) ? typeColor : "#e5e7eb" }}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex gap-0.5">
        <div className="w-1 h-1 rounded-full bg-gray-300" />
        <div className="w-1 h-1 rounded-full bg-gray-300" />
      </div>

      {/* Week 2 */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Wk 2</span>
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{ background: currentWeek >= 2 ? typeColor : "#e5e7eb" }}
        >
          {currentWeek >= 2 ? "✓" : ""}
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: totalDots }).map((_, i) => (
            <div
              key={`w2-${i}`}
              className="w-1.5 h-1.5 rounded-full transition-colors"
              style={{ background: currentWeek === 2 && i < filledDots ? typeColor : "#e5e7eb" }}
            />
          ))}
        </div>
      </div>

      {/* Loop label */}
      <span
        className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white ml-1"
        style={{ background: typeColor }}
      >
        Loop {loopNumber} – {typeLabel}
      </span>
    </div>
  );
}
