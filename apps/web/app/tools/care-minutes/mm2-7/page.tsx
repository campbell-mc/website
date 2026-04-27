"use client";

import Link from "next/link";

const C = { dark: "#1a1218", copper: "#c89a3c", cream: "#faf7f2", ink: "#f5ede3", inkDark: "#1a1218", inkMuted: "rgba(245,237,227,0.78)", calm: "#8aa888" };

export default function MM27Calculator() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <nav className="sticky top-0 z-50" style={{ backgroundColor: C.dark, borderBottom: "1px solid rgba(245,237,227,0.08)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-16 py-4">
          <Link href="/v2" className="text-[15px] font-medium tracking-tight" style={{ color: C.ink }}>CHRIS<span style={{ color: C.copper }}>·</span>OS</Link>
          <div className="flex items-center gap-4">
            <Link href="/tools/care-minutes" className="text-[13px] hidden md:block" style={{ color: C.inkMuted }}>← Care minutes hub</Link>
            <a href="/v2#book" className="text-[13px] font-medium px-5 py-2 rounded" style={{ backgroundColor: C.copper, color: C.dark }}>Book a conversation</a>
          </div>
        </div>
      </nav>

      <section style={{ backgroundColor: C.dark }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-16 py-16 lg:py-24 text-center">
          <div className="text-[11px] font-medium tracking-[0.12em] uppercase mb-5" style={{ color: C.calm }}>Care minutes · MM2–7 regional / rural / remote</div>
          <h1 className="text-[clamp(1.3rem,3vw,2rem)] font-normal leading-[1.2] mb-4" style={{ fontFamily: "Georgia, serif", color: C.ink }}>
            Coming soon.{" "}
            <em className="italic" style={{ color: C.copper }}>The regional cost model is in development.</em>
          </h1>
          <p className="text-[14px] leading-[1.65] max-w-xl mx-auto mb-8" style={{ color: C.inkMuted }}>
            Your funding doesn&apos;t change — but the obligation, Star Ratings, and Director Declaration personal liability still do. This calculator will model what your current delivery actually costs across the 85–105% spread.
          </p>
          <a href="/v2#book" className="inline-block text-[14px] font-medium px-8 py-3.5 rounded-lg" style={{ backgroundColor: C.copper, color: C.dark }}>Book a 30-minute conversation →</a>
        </div>
      </section>
    </div>
  );
}
