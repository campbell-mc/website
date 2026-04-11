"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Users, BarChart2, Shield, BookOpen, Sparkles, CheckCircle } from "lucide-react";
import { ChrisMessage } from "../chris/ChrisMessage";
import { LoopIndicator } from "./LoopIndicator";

export type CycleState = "pulse_in_progress" | "briefing_ready" | "actions_in_progress" | "end_of_cycle" | "steady";

interface HomeDashboardProps {
  cycleState: CycleState;
  loopNumber?: number;
  currentWeek?: 1 | 2;
  userName?: string;
  teamName?: string;
  responseRate?: number;
  onViewBriefing?: () => void;
  onViewTeamLoop?: () => void;
  onViewLeaderLoop?: () => void;
  onViewCoach?: () => void;
  onStartReflection?: () => void;
  onNavigate?: (tab: string) => void;
}

export function HomeDashboard({
  cycleState,
  loopNumber = 3,
  currentWeek = 1,
  userName = "there",
  teamName = "your team",
  responseRate = 0,
  onViewBriefing,
  onViewTeamLoop,
  onViewLeaderLoop,
  onViewCoach,
  onStartReflection,
  onNavigate,
}: HomeDashboardProps) {
  const [showLoopDetails, setShowLoopDetails] = useState(false);

  const progressPercent =
    cycleState === "pulse_in_progress" ? 15 :
    cycleState === "briefing_ready" ? 25 :
    cycleState === "actions_in_progress" ? 50 :
    cycleState === "end_of_cycle" ? 100 : 0;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto mb-24">
      {/* Welcome */}
      <h2 className="text-2xl font-bold text-[#1B4332] mb-1">
        Welcome back{userName !== "there" ? `, ${userName}` : ""}
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Here's what's happening with {teamName}
      </p>

      {/* Loop Progress */}
      <button
        onClick={() => setShowLoopDetails(!showLoopDetails)}
        className="w-full mb-4"
      >
        <div className="bg-gradient-to-r from-[#D4EDDD] via-[#E8F5EE] to-[#D4EDDD] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#1B4332]">
              Team Loop {loopNumber}
            </span>
            <span className="text-xs text-[#1B4332]/60">
              Week {currentWeek} of 2
            </span>
            {showLoopDetails ? (
              <ChevronUp className="w-4 h-4 text-[#1B4332]/40" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#1B4332]/40" />
            )}
          </div>
          {/* Progress bar */}
          <div className="w-full bg-white/60 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-[#1B4332] to-[#D4A017] transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </button>

      {showLoopDetails && (
        <div className="mb-4 px-2">
          <LoopIndicator loopNumber={loopNumber} currentWeek={currentWeek} loopType="team" />
        </div>
      )}

      {/* Cycle-specific content */}
      {cycleState === "pulse_in_progress" && (
        <div className="mb-6">
          <ChrisMessage
            message={`Team Pulse is live — ${responseRate > 0 ? `${Math.round(responseRate * 100)}% response rate so far` : "waiting for responses"}. I'll have your briefing ready when it closes.`}
            variant="default"
          />
          <div className="mt-4 bg-[#E8F5EE] rounded-xl p-4 border border-[#D4EDDD]">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#1B4332]" />
              <span className="text-sm font-semibold text-[#1B4332]">Team Pulse in progress</span>
            </div>
            <p className="text-xs text-[#1B4332]/70">
              Staff are completing their fortnightly check-in. Results feed into your next Team Briefing.
            </p>
          </div>
        </div>
      )}

      {cycleState === "briefing_ready" && (
        <div className="mb-6">
          <ChrisMessage
            message="Your Team Briefing is ready. I've analysed the pulse data alongside operational signals to surface what matters most this fortnight."
            variant="insight"
          />
          <div className="mt-4 bg-gradient-to-r from-amber-50 to-[#E8F5EE] rounded-xl p-4 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#D4A017]" />
              <span className="text-sm font-semibold text-[#1B4332]">Team Briefing ready</span>
            </div>
            <p className="text-xs text-[#1B4332]/70 mb-3">
              Pulse results + operational context + recommended practices
            </p>
            <button
              onClick={onViewBriefing}
              className="w-full py-3 rounded-xl text-white font-medium text-sm bg-[#1B4332] hover:bg-[#2D6A4F] transition-colors"
            >
              View Team Briefing
            </button>
          </div>
        </div>
      )}

      {cycleState === "actions_in_progress" && (
        <div className="mb-6">
          <ChrisMessage
            message="Your team experiment is underway. I'll keep monitoring operational signals and check in at the end of the cycle."
            variant="suggestion"
          />
          <div className="mt-4 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-[#2D7D73]" />
              <span className="text-sm font-semibold text-[#1B4332]">Team experiment underway</span>
            </div>
            <div className="bg-[#E8F5EE] rounded-lg p-3 mt-2">
              <p className="text-xs text-[#1B4332]/80 italic">
                "Protect breaks when under pressure — treat them like a safety control, not a nice-to-have."
              </p>
            </div>
            <p className="text-[10px] text-gray-400 mt-2">9 days remaining in this cycle</p>
          </div>
        </div>
      )}

      {cycleState === "end_of_cycle" && (
        <div className="mb-6">
          <ChrisMessage
            message="This loop is closing. A quick reflection helps me understand what worked — and makes the next briefing sharper."
            variant="insight"
          />
          <div className="mt-4 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-[#D4A017]" />
              <span className="text-sm font-semibold text-[#1B4332]">Time to reflect</span>
            </div>
            <p className="text-xs text-[#1B4332]/70 mb-3">
              3 quick questions about how this fortnight went
            </p>
            <button
              onClick={onStartReflection}
              className="w-full py-3 rounded-xl text-white font-medium text-sm bg-[#D4A017] hover:bg-[#C49615] transition-colors"
            >
              Start Reflection
            </button>
          </div>
        </div>
      )}

      {cycleState === "steady" && (
        <div className="mb-6">
          <ChrisMessage
            message="Everything's on track. Next pulse launches on Monday — I'll let you know when results are ready."
            variant="default"
          />
        </div>
      )}

      {/* Quick Navigation Cards */}
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-8">
        Quick access
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onViewTeamLoop}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-semibold text-[#1B4332]">Team Loop</span>
          <p className="text-[10px] text-gray-400 mt-1">Briefings & practices</p>
        </button>

        <button
          onClick={onViewLeaderLoop}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A017] to-[#C9A84C] flex items-center justify-center mb-3">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-semibold text-[#1B4332]">Leader Loop</span>
          <p className="text-[10px] text-gray-400 mt-1">360 & development</p>
        </button>

        <button
          onClick={onViewCoach}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B4332] to-[#D4A017] flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-semibold text-[#1B4332]">CHRIS Coach</span>
          <p className="text-[10px] text-gray-400 mt-1">Ask anything</p>
        </button>

        <button
          onClick={() => onNavigate?.("risk")}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C4704A] to-[#D4A017] flex items-center justify-center mb-3">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-semibold text-[#1B4332]">PSH Dashboard</span>
          <p className="text-[10px] text-gray-400 mt-1">Hazard overview</p>
        </button>
      </div>

      {/* Recent Activity */}
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-8">
        Recent activity
      </h3>
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#2D7D73] mt-1.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-700">{loopNumber - 1} Loops completed</p>
              <p className="text-[10px] text-gray-400">Last check-in: 2 weeks ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#D4A017] mt-1.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-700">Team Pulse running fortnightly</p>
              <p className="text-[10px] text-gray-400">Since Cycle 1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
