"use client";

import { Menu, Bell } from "lucide-react";
import { ChrisAvatar } from "../chris/ChrisAvatar";

interface MobileHeaderProps {
  providerName: string;
  onMenuClick: () => void;
}

export function MobileHeader({ providerName, onMenuClick }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-1.5 -ml-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <ChrisAvatar size="small" />
          <p className="text-sm font-semibold text-foreground truncate">{providerName}</p>
        </div>
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-[hsl(var(--brand-amber))] text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
        </button>
      </div>
    </header>
  );
}
