export function ArchitectureDiagram() {
  return (
    <section className="bg-[#EDE9DF] border-y border-[#1B4332]/8" id="architecture">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16">
        <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4">System architecture</div>
        <h2 className="text-[clamp(24px,3vw,36px)] font-normal leading-[1.1] tracking-[-0.02em] text-[#1B4332] mb-3" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
          Three layers. One system.
        </h2>
        <p className="text-[14px] text-stone-500 max-w-xl mb-12 leading-relaxed">
          Source systems flow in. Intelligence flows up. Actions flow out. CHRIS-OS is the connective tissue — the layer that didn&apos;t exist.
        </p>

        <div className="w-full overflow-x-auto">
          <svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-4xl mx-auto" role="img" aria-label="CHRIS-OS three-layer architecture">
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#2D7D73" opacity="0.6" /></marker>
              <marker id="arrow-dark" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#1B4332" opacity="0.5" /></marker>
            </defs>

            {/* Layer labels */}
            <text x="80" y="30" fontSize="9" fontWeight="500" letterSpacing="1.5" fill="#78716c" textAnchor="middle" fontFamily="DM Sans, sans-serif">SOURCE SYSTEMS</text>
            <text x="382" y="30" fontSize="9" fontWeight="500" letterSpacing="1.5" fill="#78716c" textAnchor="middle" fontFamily="DM Sans, sans-serif">CANONICAL LAYER</text>
            <text x="635" y="30" fontSize="9" fontWeight="500" letterSpacing="1.5" fill="#78716c" textAnchor="middle" fontFamily="DM Sans, sans-serif">AGENT LAYER</text>
            <text x="845" y="30" fontSize="9" fontWeight="500" letterSpacing="1.5" fill="#78716c" textAnchor="middle" fontFamily="DM Sans, sans-serif">OUTPUTS</text>

            {/* Source system boxes */}
            {[
              { y: 55, label: "Clinical system", sub: "Leecare · Epicor · AutumnCare" },
              { y: 120, label: "Rostering", sub: "Deputy · Humanforce" },
              { y: 185, label: "HR & payroll", sub: "ELMO · Employment Hero" },
              { y: 250, label: "Finance", sub: "TechOne · MYOB · Xero" },
              { y: 315, label: "Incidents & WHS", sub: "RiskMan · SafetyCulture" },
              { y: 380, label: "ACQSC & GPMS", sub: "Government portal" },
              { y: 445, label: "Pulse surveys", sub: "Native to CHRIS-OS" },
            ].map(({ y, label, sub }) => (
              <g key={label}>
                <rect x="10" y={y} width="140" height="50" rx="6" fill="white" stroke="#1B4332" strokeWidth="0.5" strokeOpacity="0.2" />
                <text x="80" y={y + 20} fontSize="11" fontWeight="500" fill="#292524" textAnchor="middle" fontFamily="DM Sans, sans-serif">{label}</text>
                <text x="80" y={y + 35} fontSize="9" fill="#78716c" textAnchor="middle" fontFamily="DM Sans, sans-serif">{sub}</text>
                <line x1="150" y1={y + 25} x2="278" y2={y + 25} stroke="#2D7D73" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3,3" markerEnd="url(#arrow)" />
              </g>
            ))}

            {/* Canonical layer */}
            <rect x="285" y="45" width="195" height="460" rx="10" fill="#1B4332" fillOpacity="0.04" stroke="#1B4332" strokeWidth="1" strokeOpacity="0.15" />
            <text x="382" y="75" fontSize="11" fontWeight="500" fill="#1B4332" textAnchor="middle" fontFamily="DM Sans, sans-serif">Canonical data schema</text>
            {["11 domains", "8 source system categories", "16 PSH hazard domains", "De-identified at boundary", "Append-only · Timestamped", "Row-level security (RLS)", "Neon Postgres · Drizzle ORM"].map((item, i) => (
              <g key={item}>
                <circle cx="300" cy={100 + i * 52} r="2.5" fill="#2D7D73" opacity="0.6" />
                <text x="310" y={105 + i * 52} fontSize="10" fill="#44403c" fontFamily="DM Sans, sans-serif">{item}</text>
              </g>
            ))}

            <line x1="480" y1="270" x2="535" y2="270" stroke="#1B4332" strokeWidth="1.5" strokeOpacity="0.4" markerEnd="url(#arrow-dark)" />

            {/* Agent layer */}
            {[
              { y: 58, name: "The Sentinel", cadence: "2-hr", color: "#059669" },
              { y: 118, name: "The Oracle", cadence: "Weekly", color: "#d97706" },
              { y: 178, name: "The Steward", cadence: "Daily", color: "#059669" },
              { y: 238, name: "The Chronicler", cadence: "Event", color: "#d97706" },
              { y: 298, name: "The Keeper", cadence: "Fortnightly", color: "#ea580c" },
              { y: 358, name: "The Town Crier", cadence: "Continuous", color: "#6b7280" },
              { y: 418, name: "The Curator", cadence: "2-hr", color: "#4a5568" },
            ].map(({ y, name, cadence, color }) => (
              <g key={name}>
                <rect x="545" y={y} width="180" height="46" rx="6" fill="white" stroke="#1B4332" strokeWidth="0.5" strokeOpacity="0.2" />
                <circle cx="560" cy={y + 23} r="4" fill={color} opacity="0.8" />
                <text x="572" y={y + 19} fontSize="11" fontWeight="500" fill="#292524" fontFamily="DM Sans, sans-serif">{name}</text>
                <text x="572" y={y + 33} fontSize="9" fill="#78716c" fontFamily="DM Sans, sans-serif">{cadence}</text>
                <line x1="725" y1={y + 23} x2="763" y2={y + 23} stroke="#1B4332" strokeWidth="0.8" strokeOpacity="0.3" markerEnd="url(#arrow-dark)" />
              </g>
            ))}

            <rect x="545" y="472" width="180" height="28" rx="5" fill="#f5f2eb" stroke="#1B4332" strokeWidth="0.5" strokeOpacity="0.2" />
            <text x="635" y="490" fontSize="9" fill="#78716c" textAnchor="middle" fontFamily="DM Sans, sans-serif">Powered by Claude API (Anthropic)</text>

            {/* Output column */}
            {[
              { y: 58, label: "Monday Briefing" },
              { y: 118, label: "SIRS notifications" },
              { y: 178, label: "QI submissions" },
              { y: 238, label: "Board packs" },
              { y: 298, label: "Care minutes alerts" },
              { y: 358, label: "DON review queue" },
              { y: 418, label: "Newsroom / Curator" },
            ].map(({ y, label }) => (
              <g key={label}>
                <rect x="770" y={y} width="115" height="46" rx="6" fill="#1B4332" fillOpacity="0.05" stroke="#1B4332" strokeWidth="0.5" strokeOpacity="0.25" />
                <text x="827" y={y + 27} fontSize="10" fontWeight="500" fill="#1B4332" textAnchor="middle" fontFamily="DM Sans, sans-serif">{label}</text>
              </g>
            ))}

            <rect x="770" y="472" width="115" height="28" rx="5" fill="#f5f2eb" stroke="#1B4332" strokeWidth="0.5" strokeOpacity="0.2" />
            <text x="827" y="490" fontSize="9" fill="#78716c" textAnchor="middle" fontFamily="DM Sans, sans-serif">Via iMessage + portal</text>
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10">
          {[
            { n: "01", title: "Source systems", body: "CHRIS connects to the systems providers already run — rostering, clinical, HR, finance, WHS, GPMS. No rip and replace." },
            { n: "02", title: "Canonical layer", body: "Every connector normalises data into a single schema. De-identified at the boundary. Append-only. The schema is the IP." },
            { n: "03", title: "Agent layer", body: "Seven AI agents run continuously on the canonical data. Each has a domain, a cadence, and a job." },
            { n: "04", title: "Execution outputs", body: "Agents produce work — not dashboards. Drafted documents, queued actions, filed submissions, delivered briefings." },
          ].map(({ n, title, body }) => (
            <div key={n} className="bg-white border border-[#1B4332]/8 rounded-xl p-5">
              <div className="text-[10px] font-medium text-stone-300 mb-2">{n}</div>
              <div className="text-[13px] font-medium text-stone-800 mb-2">{title}</div>
              <div className="text-[12px] text-stone-500 leading-relaxed">{body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
