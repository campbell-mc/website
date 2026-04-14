import Link from "next/link";

export function TechFooter() {
  return (
    <footer className="bg-[#1B4332]">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-14">
        <div className="max-w-2xl">
          <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-white/50 mb-5">CHRIS-OS · Technology</div>
          <h2 className="text-[clamp(22px,3vw,36px)] font-normal leading-[1.12] tracking-[-0.02em] mb-5" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif", color: "#ffffff" }}>
            The infrastructure aged care never had.
            <br />
            <em className="italic" style={{ color: "#86EFAC" }}>Built. Live. Compounding.</em>
          </h2>
          <p className="text-[14px] leading-relaxed mb-8 max-w-md" style={{ color: "rgba(255,255,255,0.70)" }}>
            CHRIS-OS is live with providers in NSW and VIC. The canonical layer is already ingesting. The agents are already running. Every new client makes the system smarter — cross-provider benchmarks activate at scale.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/" className="bg-white text-[#1B4332] px-6 py-3 rounded-lg text-[13px] font-medium hover:bg-white/90 transition-colors">Explore CHRIS-OS →</Link>
            <Link href="/newsroom" className="border border-white/30 px-6 py-3 rounded-lg text-[13px] hover:border-white/50 transition-colors" style={{ color: "rgba(255,255,255,0.80)" }}>Read The Newsroom</Link>
          </div>
          <div className="mt-12 pt-6 border-t border-white/8 flex items-center justify-between flex-wrap gap-3">
            <span className="text-[11px] text-white/40">CHRIS-OS — Operational intelligence for Australian aged care</span>
            <span className="text-[11px] text-white/40">Live in NSW and VIC · australia-southeast1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
