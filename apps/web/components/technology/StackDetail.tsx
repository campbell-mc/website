const STACK = [
  { category: "Frontend", items: [{ name: "Next.js 15", note: "App Router, ISR, Server Components" }, { name: "TypeScript", note: "Full type safety across frontend and API" }, { name: "React 19", note: "Server and client components" }, { name: "Tailwind CSS", note: "Custom design system — forest, teal, cream" }] },
  { category: "Database", items: [{ name: "Neon (Postgres)", note: "Serverless Postgres with connection pooling" }, { name: "Drizzle ORM", note: "Type-safe schema and migrations" }, { name: "Row-Level Security", note: "Multi-tenant isolation enforced at DB layer" }, { name: "Append-only design", note: "No deletes — full audit trail by design" }] },
  { category: "AI & agents", items: [{ name: "Claude API (Anthropic)", note: "claude-sonnet-4 — intelligence and generation" }, { name: "Web search tool", note: "Live research for The Curator agent" }, { name: "Structured outputs", note: "JSON schema outputs for all agent actions" }, { name: "Simulation engine", note: "28 scenarios, 99% pass rate" }] },
  { category: "Infrastructure", items: [{ name: "Vercel", note: "Edge deployment — auto-scaling Next.js" }, { name: "Google Cloud Run", note: "Agent workers — australia-southeast1" }, { name: "GitHub Actions", note: "CI/CD with automated simulation tests" }, { name: "Monorepo (Turborepo)", note: "5 packages: web, db, shared, connectors, engines" }] },
  { category: "Auth & notifications", items: [{ name: "Passwordless auth", note: "Magic link — no password risk" }, { name: "Twilio", note: "iMessage and SMS delivery for alerts" }, { name: "Resend", note: "Transactional email for governance packs" }, { name: "Push notifications", note: "In-app for team leader briefings" }] },
  { category: "Connectors", items: [{ name: "Deputy (live)", note: "Rostering — open API, highest priority" }, { name: "Humanforce (building)", note: "Rostering — enterprise aged care" }, { name: "ELMO / Employment Hero", note: "HR & payroll — Phase 2" }, { name: "RiskMan / SafetyCulture", note: "Incidents & WHS — Phase 3" }] },
];

export function StackDetail() {
  return (
    <section className="bg-stone-50 border-b border-[#1B4332]/8">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4">The stack</div>
        <h2 className="text-[clamp(24px,3vw,36px)] font-normal leading-[1.1] tracking-[-0.02em] text-[#1B4332] mb-4" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
          Built for production.<br /><em className="italic" style={{ color: "#2D7D73" }}>Deployed in Australian aged care.</em>
        </h2>
        <p className="text-[14px] text-stone-500 max-w-xl mb-12 leading-relaxed">Built on the same cloud infrastructure used by Australia's major health systems. No on-premise hardware. No IT project. Connected to your existing systems within weeks, not months.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {STACK.map(({ category, items }) => (
            <div key={category} className="bg-white border border-[#1B4332]/8 rounded-xl p-5">
              <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4 pb-3 border-b border-stone-50">{category}</div>
              <ul className="space-y-3">
                {items.map(({ name, note }) => (
                  <li key={name}>
                    <div className="text-[12px] font-medium text-stone-800 mb-0.5">{name}</div>
                    <div className="text-[11px] text-stone-400 leading-snug">{note}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
