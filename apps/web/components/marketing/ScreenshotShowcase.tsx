export function ScreenshotShowcase() {
  const screenshots = [
    {
      title: "The Review Queue",
      caption: "Everything that needs action, ranked by urgency, drafted and ready.",
      rotate: "-1.5deg",
      bg: "#1B4332",
    },
    {
      title: "Care Minutes — Live",
      caption: "Every shift. With CHRIS telling you what it means.",
      rotate: "1deg",
      bg: "#2D7D73",
    },
    {
      title: "SIRS Notification",
      caption: "Drafted by The Chronicler. Auto-populated. Awaiting your approval.",
      rotate: "-0.5deg",
      bg: "#C4704A",
    },
  ];

  return (
    <section className="bg-[#faf7f2] border-y border-[#1B4332]/8">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <div className="text-center mb-14">
          <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1B4332]/50 mb-4">
            The platform
          </div>
          <h2 className="text-[clamp(1.8rem,3.5vw,3rem)] font-normal leading-[1.12] tracking-[-0.02em] text-[#1B4332] mb-4" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
            Intelligence that executes.<br />
            <em className="italic text-[#2D7D73]">Not a dashboard. A system that acts.</em>
          </h2>
          <p className="text-[15px] text-stone-500 max-w-lg mx-auto leading-relaxed">
            Every screen is a decision point. Every decision is logged. Every outcome feeds back into the intelligence layer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          {screenshots.map((shot, i) => (
            <div key={shot.title} className="group">
              <div
                className="rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.06)] transition-all duration-300 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.16)] group-hover:-translate-y-2"
                style={{ transform: `rotate(${shot.rotate})` }}
              >
                {/* Placeholder screenshot representation */}
                <div className="aspect-[4/3] relative" style={{ backgroundColor: shot.bg }}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                    <div className="w-full max-w-sm">
                      {/* Simulated UI elements */}
                      <div className="bg-white/10 rounded-lg p-3 mb-3">
                        <div className="h-2 bg-white/20 rounded w-2/3 mb-2" />
                        <div className="h-2 bg-white/15 rounded w-full mb-2" />
                        <div className="h-2 bg-white/15 rounded w-4/5" />
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 mb-3">
                        <div className="h-2 bg-white/20 rounded w-1/2 mb-2" />
                        <div className="h-2 bg-white/15 rounded w-full" />
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="h-2 bg-white/20 rounded w-3/4 mb-2" />
                        <div className="h-2 bg-white/15 rounded w-full mb-2" />
                        <div className="h-2 bg-white/15 rounded w-2/3" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-white/80 text-[13px] font-medium">{shot.title}</div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[13px] text-stone-500 text-center mt-4 leading-relaxed px-4">{shot.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
