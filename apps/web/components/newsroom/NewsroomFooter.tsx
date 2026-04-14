import Link from "next/link";

export function NewsroomFooter() {
  return (
    <footer className="bg-[#1B4332]">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-14">
        <div className="max-w-2xl">
          <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-white/50 mb-5">
            CHRIS-OS · The Newsroom
          </div>
          <h2 className="text-[clamp(22px,3vw,36px)] font-normal text-white leading-[1.12] tracking-[-0.02em] mb-5" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
            The Curator watches so your leaders don&apos;t have to.
            <br />
            <em className="italic text-emerald-300">The full platform does the rest.</em>
          </h2>
          <p className="text-[14px] text-white/65 leading-relaxed mb-8 max-w-md">
            The Newsroom is a public window into what CHRIS watches. Inside the platform,
            six more agents watch your facility — clinical compliance, workforce health,
            financial performance, rostering gaps, psychosocial signals, and governance.
            All of it, continuously, for every leader.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/" className="bg-white text-[#1B4332] px-6 py-3 rounded-lg text-[13px] font-medium hover:bg-white/90 transition-colors">
              Explore CHRIS-OS →
            </Link>
            <Link href="/" className="border border-white/20 text-white/75 px-6 py-3 rounded-lg text-[13px] hover:border-white/38 hover:text-white/78 transition-colors">
              Back to CHRIS-OS
            </Link>
          </div>
          <div className="mt-12 pt-6 border-t border-white/8 flex items-center justify-between flex-wrap gap-3">
            <span className="text-[11px] text-white/40">
              CHRIS-OS — Operational intelligence for Australian aged care
            </span>
            <span className="text-[11px] text-white/40">
              The Curator · 35 sources · 2-hour cycle
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
