const SECURITY = [
  { title: "De-identified at the connector boundary", body: "Individual staff names are never ingested into the canonical layer. Aggregation happens at the connector level — CHRIS sees patterns in populations, not behaviour of individuals. This eliminates Privacy Act exposure." },
  { title: "Row-level security enforced at the database", body: "Every database query is scoped to a single provider by Postgres RLS. Provider A's data cannot be accessed by Provider B under any circumstances — the isolation is enforced at the storage layer, not the application layer." },
  { title: "Append-only audit trail", body: "No data in the canonical layer is ever modified or deleted. Every record is immutable and timestamped. When ACQSC comes to audit, CHRIS can reconstruct the compliance evidence for any period." },
  { title: "Australian data residency", body: "All compute and storage runs in Google Cloud australia-southeast1 (Sydney). No data is processed or stored outside Australia. This is the architecture, not a configuration option." },
  { title: "No passwords — magic link authentication", body: "CHRIS uses passwordless authentication with magic links. There are no passwords to breach, phish, or reuse. Access is email-verified and session-scoped." },
  { title: "Submission approval always requires a human", body: "CHRIS never submits to ACQSC, GPMS, or any regulatory body autonomously. Every submission requires explicit DON approval. The approval is timestamped and logged as compliance evidence." },
];

export function SecurityPrivacy() {
  return (
    <section className="bg-[#F5F2EB] border-b border-[#1B4332]/8">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16">
        <div className="max-w-4xl">
          <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4">Security & privacy</div>
          <h2 className="text-[clamp(24px,3vw,36px)] font-normal leading-[1.1] tracking-[-0.02em] text-[#1B4332] mb-4" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>Built for a regulated environment.</h2>
          <p className="text-[14px] text-stone-500 max-w-xl mb-12 leading-relaxed">Aged care handles some of Australia&apos;s most sensitive personal data. CHRIS is designed from the ground up for that environment — not adapted to it after the fact.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SECURITY.map(({ title, body }) => (
              <div key={title} className="bg-white border border-[#1B4332]/8 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="#059669" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
                  </div>
                  <div>
                    <div className="text-[12px] font-medium text-stone-800 mb-1.5">{title}</div>
                    <div className="text-[12px] text-stone-500 leading-relaxed">{body}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
