import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-8 py-5 md:py-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1B4332] flex items-center justify-center">
            <span className="text-white text-sm font-bold">C</span>
          </div>
          <span className="text-[#1B4332] text-lg font-bold tracking-tight">CHRIS-OS</span>
        </div>
        <span className="text-sm text-gray-400 hidden md:block">chris-os.io</span>
      </div>

      {/* Main content — vertically centred */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-8">
        <div className="max-w-2xl w-full">

          {/* Headline */}
          <h1 className="text-[28px] md:text-[42px] font-bold text-[#1B4332] leading-tight mb-4">
            The operational intelligence<br className="hidden md:block" />
            {" "}system for Australian<br className="hidden md:block" />
            {" "}aged care.
          </h1>

          {/* Sub */}
          <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-10 leading-relaxed">
            Built for Directors of Nursing, Facility Managers, and the teams responsible for running aged care facilities every day.
          </p>

          {/* Three capability cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
            {[
              {
                icon: "⬡",
                title: "Six AI agents",
                body: "Monitor your facility continuously — clinical compliance, workforce health, financial performance, and regulatory obligations.",
              },
              {
                icon: "↻",
                title: "Fortnightly loops",
                body: "A structured leadership rhythm that surfaces psychosocial health signals and delivers individual team briefings every cycle.",
              },
              {
                icon: "✦",
                title: "Documents drafted",
                body: "SIRS notifications, board packs, QI submissions, corrective action plans — prepared by CHRIS, reviewed and approved by you.",
              },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-2xl mb-3 text-[#2D7D73]">{card.icon}</p>
                <p className="text-sm font-semibold text-gray-900 mb-2">{card.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>

          {/* Harbison reference */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#2D7D73] animate-pulse" />
              <p className="text-xs md:text-sm text-gray-500 text-center">
                Live at <span className="font-semibold text-gray-700">Harbison Aged Care</span> · Bowral NSW · 350 staff · Cycle 8
              </p>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 pb-8 md:pb-0">
            <Link
              href="/dashboard"
              className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1B4332] text-white rounded-2xl text-base font-semibold hover:bg-[#2D7D73] transition-colors shadow-sm"
            >
              Enter the demo
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <p className="text-xs text-gray-400 text-center max-w-sm leading-relaxed">
              You are entering a demo environment with representative data. Nothing you interact with affects a real facility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
