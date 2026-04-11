"use client";

import { Settings, Shield } from "lucide-react";
import { ChrisAvatar } from "../chris/ChrisAvatar";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onSettingsClick?: () => void;
  showSettings?: boolean;
  onAdminClick?: () => void;
  showAdmin?: boolean;
}

export function Header({
  title = "Culture Crunch",
  subtitle,
  onSettingsClick,
  showSettings = false,
  onAdminClick,
  showAdmin = false,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ChrisAvatar size="small" />
          <div>
            <h1 className="text-lg font-semibold text-[#1B4332]">{title}</h1>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showSettings && (
            <button onClick={onSettingsClick} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          )}
          {showAdmin && (
            <button onClick={onAdminClick} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Shield className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
