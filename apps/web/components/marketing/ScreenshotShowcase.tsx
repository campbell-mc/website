import Image from "next/image";

const screenshots = [
  {
    src: "/screenshots/review-queue.png",
    alt: "DON Review Queue — IMMEDIATE, URGENT, ROUTINE priorities",
    title: "The Review Queue",
    caption: "Everything that needs action, ranked by urgency, drafted and ready.",
    rotate: "-1.5deg",
  },
  {
    src: "/screenshots/care-minutes.png",
    alt: "Care Minutes Dashboard — 226/215 compliant",
    title: "Care Minutes — Live",
    caption: "Every shift. With CHRIS telling you what it means.",
    rotate: "1deg",
  },
  {
    src: "/screenshots/sirs-draft.png",
    alt: "SIRS Notification Draft — Priority 1, fields auto-populated",
    title: "SIRS Notification",
    caption: "Drafted by The Chronicler. Auto-populated. Awaiting your approval.",
    rotate: "-0.5deg",
  },
];

export function ScreenshotShowcase() {
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
          {screenshots.map((shot) => (
            <div key={shot.title} className="group">
              <div
                className="rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.06)] transition-all duration-300 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.16)] group-hover:-translate-y-2 lg:group-hover:!rotate-0"
                style={{ transform: `rotate(${shot.rotate})` }}
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={600}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-[13px] text-stone-500 text-center mt-4 leading-relaxed px-4">
                <span className="font-medium text-[#1B4332]">{shot.title}.</span> {shot.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
