"use client";

interface ChrisAvatarProps {
  size?: "small" | "medium" | "large";
  showGlow?: boolean;
  className?: string;
}

const SIZES = {
  small: { outer: "w-8 h-8", text: "text-xs" },
  medium: { outer: "w-12 h-12", text: "text-base" },
  large: { outer: "w-16 h-16", text: "text-xl" },
};

export function ChrisAvatar({ size = "medium", showGlow = false, className = "" }: ChrisAvatarProps) {
  const s = SIZES[size];

  return (
    <div className={`relative ${className}`}>
      {showGlow && (
        <div className={`absolute inset-0 ${s.outer} rounded-full bg-gradient-to-br from-[#1B4332] to-[#D4A017] opacity-40 animate-pulse blur-md`} />
      )}
      <div className={`${s.outer} rounded-full bg-gradient-to-br from-[#1B4332] to-[#D4A853] flex items-center justify-center shadow-md relative`}>
        <span className={`text-white font-bold ${s.text}`}>C</span>
      </div>
    </div>
  );
}
