"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, AlertCircle, Clock, ArrowRight } from "lucide-react";

/* ── colours ── */
const forest = "#1B4332";
const teal = "#2D7D73";
const amber = "#D4A017";
const terracotta = "#C4704A";

const today = new Date();
const dateStr = today.toLocaleDateString("en-AU", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const actions = [
  {
    priority: 1,
    label: "Lone worker alerts",
    urgency: "IMMEDIATE",
    urgencyColor: terracotta,
    detail:
      "Two lone worker welfare check failures detected overnight — workers did not confirm safe arrival at client homes. Coordinator follow-up required before morning visits commence.",
    cta: "Review Incidents",
    route: "/dashboard/home-care/incidents",
  },
  {
    priority: 2,
    label: "Budget statements",
    urgency: "TODAY",
    urgencyColor: amber,
    detail:
      "Monthly home care budget statements are due today. 3 Level 4 packages and 1 Level 3 package require reconciliation before distribution to clients.",
    cta: "Open Financial",
    route: "/dashboard/home-care/financial",
  },
  {
    priority: 3,
    label: "Underspend recovery",
    urgency: "THIS WEEK",
    urgencyColor: teal,
    detail:
      "Oracle has identified $21,600 in recoverable underspend across 8 Level 4 packages. Scheduling additional allied health and social support visits this week could improve both utilisation and client outcomes.",
    cta: "View Packages",
    route: "/dashboard/home-care/packages",
  },
];

const serviceSnapshot = [
  { name: "Camelot", visits: 26, compliance: 97.8 },
  { name: "Avalon", visits: 21, compliance: 94.1 },
];

export default function BriefingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <button
          onClick={() => router.push("/dashboard/home-care")}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          Home Care <ChevronRight className="w-3 h-3" /> Morning Briefing
        </button>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${forest}, ${amber})`,
            }}
          >
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Morning Briefing</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{dateStr}</span>
              <span className="text-gray-300">·</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Generated 6:00 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Card */}
        <div className="rounded-2xl p-6 text-white" style={{ backgroundColor: forest }}>
          <p className="text-sm font-medium opacity-70 mb-3">CHRIS Briefing Narrative</p>
          <p className="text-sm leading-relaxed opacity-95">
            Good morning. Two lone worker welfare check alerts require immediate coordinator
            attention before this morning&apos;s visits — both were overnight failures to
            confirm safe departure from client homes. Budget statements are due today, with
            4 packages needing reconciliation. Across both services, 47 visits are scheduled
            today with an overall visit compliance rate of 96.2%. Oracle has flagged a $21,600
            underspend opportunity across 8 Level 4 packages that could be recovered this week
            through additional allied health and social support scheduling.
          </p>
        </div>

        {/* Top 3 Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Priority Actions</h2>
          {actions.map((a) => (
            <div
              key={a.priority}
              className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: a.urgencyColor }}
                  >
                    {a.priority}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{a.label}</span>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: `${a.urgencyColor}15`,
                    color: a.urgencyColor,
                  }}
                >
                  {a.urgency}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{a.detail}</p>
              <button
                onClick={() => router.push(a.route)}
                className="flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: a.urgencyColor }}
              >
                {a.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Service Snapshot */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Service Snapshot — Today</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {serviceSnapshot.map((svc) => (
              <div key={svc.name} className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-900 mb-3">{svc.name}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold" style={{ color: forest }}>
                      {svc.visits}
                    </p>
                    <p className="text-xs text-gray-500">visits scheduled</p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-2xl font-bold"
                      style={{ color: svc.compliance >= 96 ? teal : amber }}
                    >
                      {svc.compliance}%
                    </p>
                    <p className="text-xs text-gray-500">visit compliance</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
