const STEPS = [
  { step: "01", title: "Connectors pull from source systems", body: "CHRIS connects to your existing systems via authenticated API connectors. Each connector runs on a schedule — rostering every 15 minutes, HR daily, finance on-demand. Data is normalised at the connector boundary before it enters the canonical layer. Individual names are never stored — aggregation happens first. This eliminates Privacy Act exposure and makes CHRIS safe to position to staff, unions, and regulators.", tag: "Data ingestion" },
  { step: "02", title: "The canonical layer creates a unified picture", body: "All source data lands in a single Postgres schema — the canonical layer. Every table is append-only and timestamped. No data is ever modified or deleted — only new rows are added. This creates a complete, auditable history of every operational signal CHRIS has ever seen. The canonical schema spans 11 domains and 8 source system categories.", tag: "Data model" },
  { step: "03", title: "Agents run continuously on the canonical data", body: "Seven agents run on scheduled cycles or event triggers. Each agent reads from the canonical layer, applies its intelligence model, and produces structured outputs — queue items, drafted documents, briefings, or submissions. Agents are built on Claude (Anthropic's API) with structured system prompts per domain. The Town Crier coordinates across agents to prevent alert fatigue.", tag: "Intelligence layer" },
  { step: "04", title: "Leaders approve. CHRIS executes.", body: "CHRIS never acts autonomously on anything consequential. Every output lands in a review queue with context, evidence, and a single approval button. The DON's job is review and authorise — not author and compile. Once approved, CHRIS executes: submitting to GPMS, filing with ACQSC, delivering to leaders via iMessage. Every execution is logged and timestamped.", tag: "Execution" },
];

export function HowItWorks() {
  return (
    <section className="bg-[#F5F2EB] border-b border-[#1B4332]/8">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16">
        <div className="max-w-4xl">
          <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4">The execution model</div>
          <h2 className="text-[clamp(24px,3vw,36px)] font-normal leading-[1.1] tracking-[-0.02em] text-[#1B4332] mb-4" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>How a signal becomes an action.</h2>
          <p className="text-[14px] text-stone-500 max-w-xl mb-14 leading-relaxed">From data ingestion to approved submission — four stages, all automated except the moment that requires human judgement.</p>

          <div className="space-y-0">
            {STEPS.map(({ step, title, body, tag }, i) => (
              <div key={step} className="grid grid-cols-[64px_1fr] gap-6 pb-12 relative">
                {i < STEPS.length - 1 && <div className="absolute left-7 top-10 bottom-0 w-px bg-[#1B4332]/10" />}
                <div className="flex flex-col items-center pt-0.5">
                  <div className="w-14 h-14 rounded-full bg-[#1B4332] flex items-center justify-center text-white text-[18px] flex-shrink-0 z-10" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>{step}</div>
                </div>
                <div>
                  <div className="inline-flex items-center bg-[#2D7D73]/10 text-[#2D7D73] text-[10px] font-medium uppercase tracking-wide px-2.5 py-1 rounded-full mb-3">{tag}</div>
                  <h3 className="text-[20px] text-[#1B4332] font-normal tracking-[-0.01em] mb-3" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>{title}</h3>
                  <p className="text-[13px] text-stone-500 leading-relaxed max-w-2xl">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
