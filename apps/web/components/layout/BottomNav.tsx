"use client";

import { Home, Activity, Users, Shield, Sparkles } from "lucide-react";
import { ChrisAvatar } from "../chris/ChrisAvatar";

export type NavTab = "home" | "clinical" | "workforce" | "governance" | "coach";

interface BottomNavProps {
  activeTab: NavTab;
  onNavigate: (tab: NavTab) => void;
}

const TABS: Array<{ id: NavTab; label: string; icon: typeof Home }> = [
  { id: "home", label: "Home", icon: Home },
  { id: "clinical", label: "Clinical", icon: Activity },
  { id: "workforce", label: "Workforce", icon: Users },
  { id: "governance", label: "Governance", icon: Shield },
  { id: "coach", label: "CHRIS", icon: Sparkles },
];

export function BottomNav({ activeTab, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[200] bg-white/95 backdrop-blur-md border-t border-gray-100">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[56px] ${
                isActive
                  ? "bg-[rgba(27,67,50,0.08)] text-[var(--brand-forest)]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.id === "coach" ? (
                <ChrisAvatar size="small" />
              ) : (
                <Icon className="w-5 h-5" />
              )}
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
