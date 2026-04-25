"use client";

import Link from "next/link";
import { CareMinutesCalculator } from "@/components/CareMinutesCalculator";

export default function CareMinutesLandingPage() {
  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "var(--font-dm-sans, 'DM Sans'), system-ui, sans-serif" }}>
      {/* Nav */}
      <nav className="border-b border-stone-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-16 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#1B4332] rounded-lg flex items-center justify-center text-white text-xs font-medium">C</div>
            <span className="text-[#1B4332] text-[14px] font-medium tracking-tight">CHRIS-OS</span>
          </Link>
          <a href="#waitlist" className="text-[13px] bg-[#C4704A] text-white px-5 py-2 rounded-lg hover:opacity-90 transition-colors font-medium">
            Book diagnostic →
          </a>
        </div>
      </nav>

      {/* Hero — problem first */}
      <section className="bg-[#1B4332] relative overflow-hidden" style={{ backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(45,125,115,0.15) 0%, transparent 70%)" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
          <div className="max-w-2xl">
            <div className="text-[11px] font-medium tracking-[0.15em] uppercase mb-6" style={{ color: "#C4704A" }}>
              From 1 April 2026 · Care minutes supplement
            </div>
            <h1 className="text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.02em] mb-6" style={{ color: "#faf7f2" }}>
              Most aged care providers are losing funding right now.
              <br />
              <span style={{ color: "#D4A017" }}>Do you know your number?</span>
            </h1>
            <p className="text-[16px] leading-[1.7] mb-8" style={{ color: "rgba(250,247,242,0.70)" }}>
              From April 2026, your AN-ACC base care tariff is reduced — and replaced with a care minutes supplement that you only earn if you hit your targets. If your facility is delivering below 100% of the 215/44 care minutes target, you are losing funding every single day. The gap is real, it is measurable, and for most providers it runs into the millions.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <a href="#calculator" className="px-7 py-3.5 rounded-xl text-[14px] font-medium text-white hover:opacity-90 transition-colors" style={{ backgroundColor: "#C4704A" }}>
                Calculate your funding exposure
              </a>
              <a href="#waitlist" className="px-7 py-3.5 rounded-xl text-[14px] transition-colors" style={{ border: "1px solid rgba(250,247,242,0.25)", color: "rgba(250,247,242,0.7)" }}>
                Book a 30-minute diagnostic
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <CareMinutesCalculator bookingUrl="#waitlist" />

      {/* Transition — post-calculator */}
      <section className="bg-[#faf7f2] border-y border-stone-200">
        <div className="max-w-3xl mx-auto px-6 lg:px-16 py-14 lg:py-20 text-center">
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-[#1B4332] mb-5" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
            This is the gap.<br />Most providers can&apos;t close it profitably.
          </h2>
          <p className="text-[15px] text-stone-500 leading-relaxed max-w-xl mx-auto mb-6">
            Throwing more staff at care minutes burns margin. Running under-target burns funding. The problem isn&apos;t willpower — it&apos;s visibility. You can&apos;t manage what you can&apos;t see in real time.
          </p>
          <p className="text-[15px] text-stone-700 font-medium leading-relaxed max-w-xl mx-auto">
            CHRIS gives you real-time control of care minute delivery — so you hit target without destroying margin.
          </p>
        </div>
      </section>

      {/* How CHRIS closes the gap */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-16 py-14 lg:py-20">
          <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4">Care minutes control</div>
          <h2 className="text-[clamp(1.3rem,2.5vw,1.8rem)] font-semibold text-[#1B4332] mb-8" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
            The scenario that costs you funding — every quarter
          </h2>

          {/* Scenario */}
          <div className="bg-[#faf7f2] rounded-xl p-6 mb-8">
            <p className="text-[14px] text-stone-600 leading-relaxed italic">
              &ldquo;Your RN calls in sick at 2pm. Nobody recalculates. The shift runs short. The quarter closes. Your supplement drops. By the time someone notices, you&apos;ve lost $80,000 in funding you can&apos;t get back.&rdquo;
            </p>
          </div>

          <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#2D7D73] mb-4">With CHRIS running</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[
              { title: "Recalculates every 2 hours", desc: "CHRIS pulls rostering data and projects care minutes compliance for every shift, every day." },
              { title: "Predicts before breach", desc: "Alerts arrive 5 hours before a care minutes breach — not after the quarter closes." },
              { title: "Tells you what to do", desc: "Not just the gap — the options. Agency, internal pool, or accept the risk. Your call." },
              { title: "Logs everything", desc: "Every calculation, every alert, every decision. Audit-ready compliance evidence generated automatically." },
            ].map((item) => (
              <div key={item.title} className="border border-stone-200 rounded-xl p-5">
                <p className="text-[14px] font-medium text-[#1B4332] mb-1.5">{item.title}</p>
                <p className="text-[13px] text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Supporting capabilities — secondary */}
          <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4">Also handles</div>
          <div className="flex flex-wrap gap-2">
            {["SIRS notifications", "AN-ACC optimisation", "Board reporting", "Workforce signals", "Corrective actions", "QI submissions"].map((item) => (
              <span key={item} className="text-[12px] text-stone-500 bg-stone-50 border border-stone-100 rounded-full px-3 py-1.5">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — simplified */}
      <section className="bg-[#1B4332]">
        <div className="max-w-4xl mx-auto px-6 lg:px-16 py-14 lg:py-20">
          <div className="text-[11px] font-medium tracking-[0.08em] uppercase mb-4" style={{ color: "rgba(250,247,242,0.4)" }}>How it works</div>
          <h2 className="text-[clamp(1.3rem,2.5vw,1.8rem)] font-semibold mb-10" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif", color: "#faf7f2" }}>
            Four steps. No IT project.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: "01", title: "Connects to your systems", desc: "Deputy, Humanforce, your clinical system. Read-only. No migration." },
              { n: "02", title: "Monitors care minutes continuously", desc: "Every 2 hours. Total and RN. By shift, by day, by quarter." },
              { n: "03", title: "Tells you what to do", desc: "Alerts before breach. Options ranked. One button to act." },
              { n: "04", title: "Executes", desc: "Drafts documents, files submissions, delivers briefings. You approve." },
            ].map((step) => (
              <div key={step.n}>
                <div className="text-[24px] font-normal mb-3" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif", color: "#D4A017" }}>{step.n}</div>
                <p className="text-[14px] font-medium mb-2" style={{ color: "#faf7f2" }}>{step.title}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: "rgba(250,247,242,0.55)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white" id="waitlist">
        <div className="max-w-3xl mx-auto px-6 lg:px-16 py-14 lg:py-20 text-center">
          <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-[1.15] text-[#1B4332] mb-4" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
            Start with one conversation
          </h2>
          <p className="text-[15px] text-stone-500 mb-8 max-w-md mx-auto leading-relaxed">
            30 minutes. No demo. Your data and our model. We&apos;ll show you exactly where you&apos;re losing funding and what it would take to close the gap.
          </p>
          <div className="flex items-center gap-4 justify-center flex-wrap">
            <a href="mailto:hello@culturecrunch.io?subject=Care%20Minutes%20Diagnostic" className="px-8 py-3.5 rounded-xl text-[14px] font-medium text-white hover:opacity-90 transition-colors" style={{ backgroundColor: "#C4704A" }}>
              Book a diagnostic call →
            </a>
            <a href="/" className="px-8 py-3.5 rounded-xl text-[13px] text-stone-400 border border-stone-200 hover:border-stone-300 transition-colors">
              See the full CHRIS platform
            </a>
          </div>
          <p className="text-[12px] text-stone-400 mt-4">hello@culturecrunch.io · Culture Crunch Pty Ltd</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-100 bg-stone-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-16 py-5 flex items-center justify-between flex-wrap gap-3">
          <span className="text-[11px] text-stone-400">CHRIS-OS · Care Minutes Supplement Calculator</span>
          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <Link href="/legal" className="hover:text-stone-600 transition-colors">Privacy</Link>
            <Link href="/dashboard/references" className="hover:text-stone-600 transition-colors">Sources</Link>
            <span>chris-os.io</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
