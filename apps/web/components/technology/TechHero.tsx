export function TechHero() {
  return (
    <section className="bg-[#1B4332]">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2.5 bg-white/8 border border-white/12 rounded-full px-3.5 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium tracking-[0.06em] uppercase text-white/70">How CHRIS-OS works</span>
          </div>

          <h1 className="text-[clamp(30px,4.5vw,54px)] font-normal leading-[1.06] tracking-[-0.02em] mb-6" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif", color: "#ffffff" }}>
            Not a dashboard.
            <br />
            <em className="italic" style={{ color: "#86EFAC" }}>An operational operating system.</em>
          </h1>

          <p className="text-[16px] leading-[1.75] max-w-xl mb-6" style={{ color: "rgba(255,255,255,0.90)" }}>
            CHRIS-OS is middleware. It sits above every system your organisation already runs — clinical, rostering, HR, finance, WHS, incident management — ingests their data into a single canonical layer, and runs seven AI agents continuously on top of it.
          </p>

          <p className="text-[15px] leading-[1.75] max-w-xl" style={{ color: "rgba(255,255,255,0.70)" }}>
            The output is not a report. It is work done — documents drafted, submissions filed, leaders briefed, actions queued. Every output is timestamped, append-only, and auditable by regulators.
          </p>
        </div>
      </div>
    </section>
  );
}
