"use client";

import { MessageCircle, Sparkles } from "lucide-react";

interface FloatingChrisButtonProps {
  onClick: () => void;
}

export function FloatingChrisButton({ onClick }: FloatingChrisButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 lg:bottom-6 right-4 z-[200] text-white rounded-full px-6 py-4 hover:scale-105 transition-transform flex items-center gap-2 group"
      style={{
        background: "linear-gradient(135deg, #1B4332 0%, #2D7D73 100%)",
        boxShadow: "0 4px 16px rgba(27, 67, 50, 0.25)",
      }}
    >
      <div className="relative">
        <MessageCircle className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
      </div>
      <span className="font-medium text-sm">Ask CHRIS</span>
      <Sparkles className="w-4 h-4 text-[#D4A853] opacity-80 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
