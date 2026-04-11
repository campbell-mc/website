"use client";

import { MessageCircle, Sparkles } from "lucide-react";

interface FloatingChrisButtonProps {
  onClick: () => void;
}

export function FloatingChrisButton({ onClick }: FloatingChrisButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 z-[200] bg-gradient-to-r from-[#1B4332] to-[#D4A017] text-white rounded-full px-6 py-4 shadow-lg hover:scale-105 transition-transform flex items-center gap-2 group"
    >
      <div className="relative">
        <MessageCircle className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
      </div>
      <span className="font-medium text-sm">Ask CHRIS</span>
      <Sparkles className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
