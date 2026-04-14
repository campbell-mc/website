const EXECUTION = [
  { icon: "✦", title: "Documents drafted, not described", body: "When an event occurs — a fall, a complaint, a SIRS trigger — the Chronicler drafts the required documentation within minutes. SIRS notification, corrective action plan, board pack entry. The DON receives a draft ready for review, not an alert telling them to write one.", example: '"SIRS Priority 1 detected — Wattle Wing. Draft notification ready. 22 hours remaining. Penalty exposure: $330,000 if missed."' },
  { icon: "⬡", title: "Actions queued, not alerted", body: "Every output lands in a structured review queue with context, evidence, deadline, and a single action button. The DON sees three ranked actions for today — not forty alerts. Each card has everything needed to decide in under 90 seconds.", example: '"AN-ACC reclassification: 3 residents identified. Estimated uplift: $11,400/month. Optimal assessment window: Tuesday morning."' },
  { icon: "→", title: "Submissions filed, not prepared", body: "CHRIS compiles QI data, formats it to the GPMS schema, and submits directly to the ACQSC portal after DON approval. The GPMS reference number is logged automatically. The DON never touches the GPMS portal.", example: '"Q2 QI submission: data compiled. 14 indicators ready. Deadline: 11 August. [Review and approve →]"' },
  { icon: "↗", title: "Leaders briefed before they arrive", body: "Every leader receives a briefing tailored to their role — the Monday Briefing for the DON, team briefings for team leaders, board packs for the Board. Delivered via iMessage before they walk in the door.", example: '"Your Monday Briefing is ready. 4 signals · 3 actions · 8 minutes to read. Care minutes strong. AN-ACC opportunity flagged."' },
];

export function ExecutionLayer() {
  return (
    <section className="bg-[#F5F2EB] border-b border-[#1B4332]/8">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16">
        <div className="max-w-4xl">
          <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4">The execution model</div>
          <h2 className="text-[clamp(24px,3vw,36px)] font-normal leading-[1.1] tracking-[-0.02em] text-[#1B4332] mb-4" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
            CHRIS doesn&apos;t tell you what to do.<br /><em className="italic text-[#2D7D73]">It does it.</em>
          </h2>
          <p className="text-[14px] text-stone-500 max-w-xl mb-14 leading-relaxed">The distinction between a tool and a platform is this: a tool gives you information. A platform delivers work. CHRIS delivers work — and waits for your approval.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {EXECUTION.map(({ icon, title, body, example }) => (
              <div key={title} className="bg-white border border-[#1B4332]/8 rounded-xl p-6">
                <div className="text-[20px] mb-3">{icon}</div>
                <h3 className="text-[14px] font-medium text-stone-800 mb-2">{title}</h3>
                <p className="text-[12px] text-stone-500 leading-relaxed mb-4">{body}</p>
                <div className="bg-stone-50 border-l-2 border-[#2D7D73]/40 rounded-r-lg px-3 py-2.5 text-[11px] text-stone-500 italic leading-relaxed">{example}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
