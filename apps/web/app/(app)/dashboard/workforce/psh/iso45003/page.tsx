"use client";

interface ISOSection {
  code: string;
  title: string;
  covered: boolean;
}

interface CycleRecord {
  cycle: number;
  period: string;
  participation: string;
  elevatedDomains: string[];
  practice: string;
  isoSections: string[];
  filedDate: string;
}

const ISO_SECTIONS: ISOSection[] = [
  { code: "6.1.2", title: "Hazard identification & risk assessment", covered: true },
  { code: "6.1.3", title: "Assessment of opportunities", covered: true },
  { code: "8.1.2", title: "Eliminating hazards & reducing risks", covered: true },
  { code: "8.1.3", title: "Management of change", covered: false },
  { code: "9.1.2", title: "Monitoring, measurement, analysis & evaluation", covered: true },
  { code: "9.3", title: "Management review", covered: false },
];

const CYCLE_RECORDS: CycleRecord[] = [
  {
    cycle: 8,
    period: "Mar 2026",
    participation: "94% (47/50)",
    elevatedDomains: ["Workload", "Role clarity"],
    practice: "Micro-debrief after high-acuity shifts",
    isoSections: ["6.1.2", "8.1.2", "9.1.2"],
    filedDate: "28 Mar 2026",
  },
  {
    cycle: 7,
    period: "Feb 2026",
    participation: "91% (45/50)",
    elevatedDomains: ["Peer support", "Workload"],
    practice: "Structured handover checklist",
    isoSections: ["6.1.2", "8.1.2"],
    filedDate: "28 Feb 2026",
  },
  {
    cycle: 6,
    period: "Jan 2026",
    participation: "88% (44/50)",
    elevatedDomains: ["Workload"],
    practice: "Task redistribution during peak census",
    isoSections: ["6.1.2", "6.1.3", "8.1.2", "9.1.2"],
    filedDate: "31 Jan 2026",
  },
];

export default function ISO45003Page() {
  const coveredCount = ISO_SECTIONS.filter((s) => s.covered).length;

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[28px] font-bold text-foreground tracking-tight leading-tight">
            ISO 45003:2021 Evidence Register
          </h1>
          <p className="text-[10px] text-muted-foreground">
            Psychological health & safety at work — evidence auto-filed by The Keeper
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-[#2D7D73]/10 text-[#2D7D73] shrink-0">
          Auto-filed
        </span>
      </div>

      {/* Coverage grid */}
      <div className="bg-card rounded-xl border border-border p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">
            Compliance coverage
          </p>
          <span className="text-xs font-semibold text-foreground">
            {coveredCount}/{ISO_SECTIONS.length} sections covered
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {ISO_SECTIONS.map((section) => (
            <div
              key={section.code}
              className={`rounded-lg p-3 border ${
                section.covered
                  ? "bg-[#2D7D73]/5 border-[#2D7D73]/20"
                  : "bg-muted/30 border-border"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    section.covered ? "bg-[#2D7D73]" : "bg-muted-foreground/30"
                  }`}
                />
                <span className="text-[10px] font-mono text-muted-foreground">{section.code}</span>
              </div>
              <p className="text-xs text-foreground leading-snug">{section.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cycle records */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">
        PSH cycle evidence records
      </p>
      <div className="space-y-3">
        {CYCLE_RECORDS.map((record) => (
          <div key={record.cycle} className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">
                Cycle {record.cycle} — {record.period}
              </h3>
              <span className="text-[10px] text-muted-foreground">
                Filed {record.filedDate}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div>
                <p className="text-muted-foreground text-[10px] font-medium uppercase mb-0.5">Participation</p>
                <p className="text-foreground">{record.participation}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] font-medium uppercase mb-0.5">Elevated domains</p>
                <p className="text-foreground">{record.elevatedDomains.join(", ")}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] font-medium uppercase mb-0.5">Practice deployed</p>
                <p className="text-foreground">{record.practice}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] font-medium uppercase mb-0.5">ISO sections covered</p>
                <p className="text-foreground">{record.isoSections.join(", ")}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
