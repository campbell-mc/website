"use client";

import { Home, BarChart2, Shield, CheckCircle, Sparkles } from "lucide-react";
import { ChrisAvatar } from "../chris/ChrisAvatar";

export type NavTab = "home" | "journey" | "risk" | "todo" | "coach";

interface BottomNavProps {
  activeTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  todoCount?: number;
  journeyBadge?: boolean;
  riskBadge?: boolean;
}

const TABS: Array<{ id: NavTab; label: string; icon: typeof Home }> = [
  { id: "home", label: "Home", icon: Home },
  { id: "journey", label: "Journey", icon: BarChart2 },
  { id: "risk", label: "Risk", icon: Shield },
  { id: "todo", label: "To-Do", icon: CheckCircle },
  { id: "coach", label: "Coach", icon: Sparkles },
];

export function BottomNav({ activeTab, onNavigate, todoCount, journeyBadge, riskBadge }: BottomNavProps) {
  function getBadge(tabId: NavTab): number | null {
    if (tabId === "todo" && todoCount) return todoCount;
    if (tabId === "journey" && journeyBadge) return 0; // dot only
    if (tabId === "risk" && riskBadge) return 0;
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[200] bg-white/95 backdrop-blur-md border-t border-gray-100">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const badge = getBadge(tab.id);
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                isActive
                  ? "bg-[#E8F5EE] text-[#1B4332]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className="relative">
                {tab.id === "coach" ? (
                  <ChrisAvatar size="small" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
                {badge !== null && (
                  <span className={`absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[10px] font-bold text-white ${
                    badge > 0 ? "bg-gradient-to-r from-red-500 to-[#1B4332] px-1" : "w-2 h-2 bg-red-500"
                  }`}>
                    {badge > 0 ? badge : ""}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
