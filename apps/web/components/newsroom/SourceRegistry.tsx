const SOURCES: Record<string, { name: string; url: string }[]> = {
  "Government": [
    { name: "Department of Health and Aged Care", url: "https://www.health.gov.au/topics/aged-care" },
    { name: "Federal Register of Legislation", url: "https://www.legislation.gov.au" },
    { name: "My Aged Care", url: "https://www.myagedcare.gov.au" },
    { name: "Parliament of Australia", url: "https://www.aph.gov.au" },
    { name: "Productivity Commission", url: "https://www.pc.gov.au" },
    { name: "AIHW — Australian Institute of Health and Welfare", url: "https://www.aihw.gov.au/aged-care" },
  ],
  "Regulators": [
    { name: "Aged Care Quality and Safety Commission", url: "https://www.agedcarequality.gov.au" },
    { name: "SafeWork NSW", url: "https://www.safework.nsw.gov.au" },
    { name: "WorkSafe Victoria", url: "https://www.worksafe.vic.gov.au" },
    { name: "Fair Work Commission", url: "https://www.fwc.gov.au" },
  ],
  "Sector bodies": [
    { name: "ACCPA — Aged & Community Care Providers Association", url: "https://www.accpa.asn.au" },
    { name: "LASA — Leading Age Services Australia", url: "https://www.lasa.asn.au" },
    { name: "COTA — Council on the Ageing", url: "https://www.cota.org.au" },
    { name: "StewartBrown", url: "https://www.stewartbrown.com.au" },
    { name: "ANMF — Australian Nursing & Midwifery Federation", url: "https://anmf.org.au" },
    { name: "HESTA", url: "https://www.hesta.com.au" },
  ],
  "Legal analysis": [
    { name: "MinterEllison", url: "https://www.minterellison.com" },
    { name: "Maddocks", url: "https://www.maddocks.com.au" },
    { name: "Hall & Wilcox", url: "https://hallandwilcox.com.au" },
    { name: "Russell Kennedy", url: "https://www.russellkennedy.com.au" },
    { name: "Wotton Kearney", url: "https://www.wottonkearney.com" },
    { name: "Moores", url: "https://www.moores.com.au" },
    { name: "Crisp Law", url: "https://crisplaw.com.au" },
  ],
  "News & media": [
    { name: "Australian Ageing Agenda", url: "https://www.australianageingagenda.com.au" },
    { name: "Aged Care Insite", url: "https://www.agedcareinsite.com.au" },
    { name: "Community Care Review", url: "https://www.australianageingagenda.com.au/category/community-care-review" },
    { name: "Aged Care Essentials", url: "https://www.agedcareessentials.com.au" },
    { name: "Aged Care News", url: "https://www.agedcarenews.com.au" },
    { name: "Inside Ageing", url: "https://www.insideageing.com.au" },
    { name: "ABC Health & Wellbeing", url: "https://www.abc.net.au/news/health" },
    { name: "The Guardian Australia", url: "https://www.theguardian.com/australia-news/aged-care" },
    { name: "The Australian", url: "https://www.theaustralian.com.au" },
    { name: "Australian Financial Review", url: "https://www.afr.com" },
    { name: "Australian Seniors News", url: "https://www.australianseniorsnews.com.au" },
  ],
  "Academic": [
    { name: "ANAO — Australian National Audit Office", url: "https://www.anao.gov.au" },
  ],
};

const HOW = [
  { n: "01", t: "RSS ingestion", b: "Every 2 hours, The Curator pulls new items directly from RSS feeds across sector news sources — real-time, no delay." },
  { n: "02", t: "Deep web search", b: "25 targeted queries across government, regulators, and legal sources that don't publish RSS. Live search with synthesis." },
  { n: "03", t: "Relevance filter", b: "Claude filters every item for relevance — dropping vendor content, general health news, and duplicates automatically." },
];

export function SourceRegistry() {
  return (
    <section className="bg-[#F5F2EB] border-b border-[#1B4332]/8" id="sources">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16">
        <div className="max-w-5xl">
          <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4">
            Sources monitored
          </div>
          <h2 className="text-[clamp(24px,3vw,38px)] font-normal leading-[1.1] tracking-[-0.02em] text-[#1B4332] mb-4" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
            35 sources. Every 2 hours.
          </h2>
          <p className="text-[15px] leading-relaxed text-stone-500 max-w-2xl mb-12">
            The Curator reads from primary sources — legislation, regulators, government agencies,
            authoritative legal analysis, and the sector&apos;s leading publications — on every
            single run. This is the complete list.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10 mb-14">
            {Object.entries(SOURCES).map(([group, sources]) => (
              <div key={group}>
                <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-3 pb-2 border-b border-[#1B4332]/8">
                  {group}
                </div>
                <ul className="space-y-2.5">
                  {sources.map((s) => (
                    <li key={s.name}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer"
                        className="text-[12px] text-stone-500 hover:text-[#1B4332] transition-colors flex items-start gap-1.5 group">
                        <span className="text-stone-300 group-hover:text-[#2D7D73] transition-colors mt-0.5 flex-shrink-0">↗</span>
                        {s.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#1B4332]/8 rounded-xl p-6 max-w-2xl">
            <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-5">
              How The Curator works
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {HOW.map(({ n, t, b }) => (
                <div key={n}>
                  <div className="text-[10px] font-medium text-stone-300 mb-2">{n}</div>
                  <div className="text-[12px] font-medium text-stone-700 mb-1.5">{t}</div>
                  <div className="text-[11px] text-stone-400 leading-relaxed">{b}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
