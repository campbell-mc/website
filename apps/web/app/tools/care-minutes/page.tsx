"use client";

import Link from "next/link";

const C = { dark: "#1a1218", copper: "#c89a3c", copperDark: "#8b6914", cream: "#faf7f2", ink: "#f5ede3", inkDark: "#1a1218", inkMuted: "rgba(245,237,227,0.78)", inkMutedLight: "rgba(26,18,24,0.78)", calm: "#8aa888" };

export default function CareMinutesHub() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50" style={{ backgroundColor: C.dark, borderBottom: "1px solid rgba(245,237,227,0.08)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-16 py-4">
          <Link href="/v2" className="text-[15px] font-medium tracking-tight" style={{ color: C.ink }}>Chris<span style={{ color: C.copper }}>·</span>OS</Link>
          <a href="/v2#book" className="text-[13px] font-medium px-5 py-2 rounded" style={{ backgroundColor: C.copper, color: C.dark }}>Book a conversation</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ backgroundColor: C.dark }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-16 py-16 lg:py-24 text-center">
          <div className="text-[11px] font-medium tracking-[0.15em] uppercase mb-6" style={{ color: C.copper }}>Care minutes · pick your lane</div>
          <h1 className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-normal leading-[1.15] tracking-[-0.01em] mb-5" style={{ fontFamily: "Georgia, serif", color: C.ink }}>
            From 1 April 2026, the maths depends on where you sit.{" "}
            <em className="italic" style={{ color: C.copper }}>Two different calculators for two different decisions.</em>
          </h1>
          <p className="text-[15px] leading-[1.65] max-w-xl mx-auto mb-10" style={{ color: C.inkMuted }}>
            If you operate metropolitan homes, your funding is now linked to delivery against target. If you operate regional homes, your funding doesn&apos;t change — but the obligation, Star Ratings, and Director Declaration personal liability still do.
          </p>
        </div>
      </section>

      {/* Two cards */}
      <section style={{ backgroundColor: C.cream }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-16 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* MM1 */}
            <Link href="/tools/care-minutes/mm1" className="block border rounded-lg p-6 transition-all hover:-translate-y-1" style={{ backgroundColor: "#fff", borderColor: "rgba(26,18,24,0.08)", borderLeftWidth: 4, borderLeftColor: C.copper }}>
              <p className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: C.copperDark }}>MM1 metropolitan homes</p>
              <h2 className="text-[16px] font-medium mb-2" style={{ color: C.inkDark }}>I run MM1 metropolitan homes</h2>
              <p className="text-[13px] leading-relaxed mb-4" style={{ color: C.inkMutedLight }}>
                Model what it costs to capture the supplement vs forfeit it. The 85–100% gradient. Three scenarios priced.
              </p>
              <span className="text-[13px] font-medium" style={{ color: C.copperDark }}>MM1 Supplement Calculator →</span>
            </Link>

            {/* MM2-7 */}
            <Link href="/tools/care-minutes/mm2-7" className="block border rounded-lg p-6 transition-all hover:-translate-y-1" style={{ backgroundColor: "#fff", borderColor: "rgba(26,18,24,0.08)", borderLeftWidth: 4, borderLeftColor: C.calm }}>
              <p className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: C.calm }}>MM2–7 regional / rural / remote</p>
              <h2 className="text-[16px] font-medium mb-2" style={{ color: C.inkDark }}>I run MM2–7 regional homes</h2>
              <p className="text-[13px] leading-relaxed mb-4" style={{ color: C.inkMutedLight }}>
                Model what your current delivery actually costs. The 85–105% spread. Where you might be safely reducing.
              </p>
              <span className="text-[13px] font-medium" style={{ color: C.calm }}>MM2–7 Cost Calculator →</span>
            </Link>
          </div>

          <p className="text-[12px] text-center mt-6" style={{ color: "rgba(26,18,24,0.4)" }}>
            Mixed portfolio? Run both — one for metro, one for regional.
          </p>
        </div>
      </section>
    </div>
  );
}
