interface Stat {
  number: string;
  label: string;
  accent: string;
}

export function CinematicStats({ stats, id }: { stats: Stat[]; id?: string }) {
  return (
    <section className="bg-[#1B4332]" id={id}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`flex flex-col items-center text-center py-8 md:py-0 ${
              i < stats.length - 1 ? "border-b md:border-b-0 md:border-r border-white/10" : ""
            }`}>
              <div className="text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-tight leading-none mb-3" style={{ color: stat.accent, fontFamily: "var(--font-dm-sans, 'DM Sans'), sans-serif" }}>
                {stat.number}
              </div>
              <div className="text-[13px] uppercase tracking-[0.08em] leading-snug max-w-[200px]" style={{ color: "rgba(250,247,242,0.55)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
