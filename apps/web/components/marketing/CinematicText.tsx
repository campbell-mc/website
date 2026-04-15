export function CinematicText() {
  return (
    <section className="bg-[#1B4332] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-20 lg:py-28">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-[12px] font-medium tracking-[0.1em] uppercase mb-10" style={{ color: "#D4A017" }}>
            A real scenario. Every facility. Every week.
          </div>

          <div className="text-[clamp(1.4rem,3vw,2.2rem)] leading-[1.5]" style={{ fontFamily: "var(--font-instrument-serif, 'Source Serif 4', Georgia), serif", color: "#faf7f2" }}>
            <p className="mb-6">11:04pm Friday.</p>
            <p className="mb-6">A Priority 1 incident.<br />24 hours to notify ACQSC.</p>
            <p className="mb-6">
              CHRIS classified it in 4 minutes.<br />
              The draft was waiting in the DON&apos;s inbox by 11:09.<br />
              She approved it before midnight.
            </p>
            <p className="mb-0">
              That&apos;s not a feature.<br />
              That&apos;s the difference between a penalty<br />
              and a clean record.
            </p>
          </div>

          <div className="w-10 h-px mx-auto my-10" style={{ backgroundColor: "#D4A017" }} />

          <p className="text-[15px] leading-relaxed" style={{ color: "rgba(250,247,242,0.50)" }}>
            The Chronicler agent. Event-driven. Always watching.<br />
            Civil penalties for late notifications. Zero missed deadlines at current pilots.
          </p>
        </div>
      </div>
    </section>
  );
}
