"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ExternalLink } from "lucide-react";

interface Reference {
  title: string;
  url: string;
  description: string;
}

interface ReferenceSection {
  title: string;
  refs: Reference[];
}

const SECTIONS: ReferenceSection[] = [
  {
    title: "Legislation",
    refs: [
      { title: "Aged Care Act 2024 — Federal Register", url: "https://www.legislation.gov.au/C2024A00104/latest", description: "Primary legislation governing aged care in Australia. Commenced 1 November 2025." },
      { title: "Aged Care Act 2024 — AustLII Full Text", url: "https://classic.austlii.edu.au/au/legis/cth/num_act/aca202457/", description: "Full text including s.179 (provider duty) and s.180 (responsible person duty)." },
      { title: "Aged Care Rules 2025 — Federal Register", url: "https://www.legislation.gov.au/F2025L01173/asmade/text", description: "Delegated legislation including care minutes calculation (s.176-20)." },
    ],
  },
  {
    title: "Government Agencies",
    refs: [
      { title: "Department of Health — Aged Care Reforms", url: "https://www.health.gov.au/our-work/aged-care-reforms", description: "Central hub for aged care reform implementation and guidance." },
      { title: "Department of Health — Care Minutes", url: "https://www.health.gov.au/our-work/care-minutes-registered-nurses-aged-care/care-minutes", description: "215 total / 44 RN minutes per resident per day (from 1 October 2024)." },
      { title: "Department of Health — Support at Home", url: "https://www.health.gov.au/our-work/support-at-home", description: "Support at Home program replacing Home Care Packages from 1 November 2025." },
      { title: "Department of Health — Funding Classifications", url: "https://www.health.gov.au/our-work/support-at-home/funding-for-support-at-home/funding-classifications-for-support-at-home", description: "8 Support at Home classifications and annual budgets." },
      { title: "ACQSC — Provider Reform Changes", url: "https://www.agedcarequality.gov.au/providers/reform-changes-providers/about-new-aged-care-act-and-key-changes-providers", description: "Quality and Safety Commission guidance on new Act obligations." },
      { title: "ACQSC — SIRS Overview", url: "https://www.agedcarequality.gov.au/providers/serious-incident-response-scheme", description: "Serious Incident Response Scheme — 9 reportable incident types, Priority 1/2 classification." },
      { title: "ACQSC — SIRS Changes (Nov 2025)", url: "https://www.agedcarequality.gov.au/resource-library/reportable-incidents-and-sirs-quick-guide-changes-1-nov-2025", description: "Quick guide to SIRS changes including extension to Support at Home." },
      { title: "ACQSC — Star Ratings", url: "https://www.agedcarequality.gov.au/providers/assessment-monitoring/star-ratings", description: "Four-domain star rating system for residential aged care." },
      { title: "My Aged Care — Star Ratings Methodology", url: "https://www.myagedcare.gov.au/quality/how-are-star-ratings-calculated", description: "How star ratings are calculated across Compliance, Residents' Experience, Staffing, and Quality Measures." },
    ],
  },
  {
    title: "Penalty & Enforcement",
    refs: [
      { title: "ABS — Penalty Unit Value ($330)", url: "https://www.abs.gov.au/participate-survey/penalty-provisions", description: "Commonwealth penalty unit = $330 (from 7 November 2024). Next indexation: 1 July 2026." },
      { title: "ASIC — Fines and Penalties", url: "https://www.asic.gov.au/about-asic/asic-investigations-and-enforcement/fines-and-penalties/", description: "Confirms $330 penalty unit value and indexation schedule." },
    ],
  },
  {
    title: "Sector Benchmarks",
    refs: [
      { title: "Productivity Commission — Report on Government Services 2026", url: "https://www.pc.gov.au/ongoing/report-on-government-services/community-services/aged-care-services/", description: "National care minutes compliance rates: 45.9% met both targets, 55.8% met total, 70.2% met RN." },
      { title: "StewartBrown Aged Care Financial Performance Survey", url: "https://www.stewartbrown.com.au/news-articles/aged-care-financial-performance-survey", description: "ACFPS FY25 — sector benchmarks for EBITDA, care ratios, workforce costs, occupancy." },
    ],
  },
  {
    title: "Legal Analysis",
    refs: [
      { title: "Wotton Kearney — Responsible Persons", url: "https://www.wottonkearney.com/the-new-aged-care-act-2024-cth-what-do-responsible-persons-and-their-insurers-need-to-know/", description: "Analysis of s.180 responsible person duties and who they apply to." },
      { title: "Maddocks — Statutory Duties", url: "https://www.maddocks.com.au/insights/statutory-duties-under-the-aged-care-act", description: "Detailed analysis of provider and responsible person obligations." },
      { title: "MinterEllison — Compliance Risks", url: "https://www.minterellison.com/articles/new-compliance-risks-for-disability-and-aged-care-providers", description: "New compliance framework including Code of Conduct (s.173-174) penalties." },
      { title: "Hall & Wilcox — Provider Impacts", url: "https://hallandwilcox.com.au/news/how-will-the-new-aged-care-bill-affect-aged-care-approved-providers/", description: "Penalty quantum analysis — 'the penalty is that amount, not up to that amount'." },
      { title: "Moores — Board Member Duties", url: "https://www.moores.com.au/new-duties-for-board-members-of-aged-care-providers-what-you-need-to-know/", description: "Due diligence obligations for board members under s.180." },
    ],
  },
  {
    title: "Support at Home Guidance",
    refs: [
      { title: "Trilogy Care — Classifications Guide", url: "https://trilogycare.com.au/support-at-home-classifications-1-8-funding-amounts-and-services-explained", description: "8 classifications from $10,731 to $78,106/year. Reviewed March 2026." },
      { title: "Aged Care Essentials — Provider Obligations", url: "https://www.agedcareessentials.com.au/news/aged-care-essentials-support-at-home-program-what-aged-care-providers-need-to-know-before-1-november-2025", description: "Comprehensive guide to Support at Home provider obligations." },
      { title: "Sensible Care — 2026 Program Guide", url: "https://www.sensiblecare.com.au/blog/support-at-home-program-2026", description: "Practical guide to operating under Support at Home." },
    ],
  },
  {
    title: "SIRS Detailed Guidance",
    refs: [
      { title: "Statura Care — Complete SIRS Guide", url: "https://statura.care/sirs-aged-care-guide", description: "Comprehensive guide including all 9 reportable incident types and Priority 1/2 criteria." },
      { title: "ACQSC — SIRS Guidelines PDF", url: "https://www.agedcarequality.gov.au/sites/default/files/media/SIRS-guidelines-for-residential-aged-care-providers.pdf", description: "Official ACQSC SIRS guidelines for providers." },
    ],
  },
  {
    title: "Quality Standards",
    refs: [
      { title: "Statura Care — Strengthened Quality Standards Guide", url: "https://statura.care/blog/acqs-strengthened-quality-standards-compliance-guide", description: "7 Strengthened Quality Standards from 1 November 2025." },
    ],
  },
];

export default function ReferencesPage() {
  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      <PageHeader title="Reference Library" subtitle="Primary sources for all CHRIS compliance data" backHref="/dashboard" showAskChris={false} />

      <div className="bg-card rounded-xl border border-border p-4 mb-5">
        <p className="text-xs text-muted-foreground leading-relaxed">
          CHRIS sources all compliance data, regulatory thresholds, and sector benchmarks from primary government and authoritative sources. This library lists every reference used. All URLs verified as of April 2026.
        </p>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title} className="mb-6">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">{section.title}</p>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {section.refs.map((ref, i) => (
              <a
                key={ref.url}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors ${i < section.refs.length - 1 ? "border-b border-border" : ""}`}
              >
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">{ref.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{ref.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}

      <p className="text-[10px] text-muted-foreground text-center mt-8 mb-8">
        Regulatory information should be re-verified whenever ACQSC or Department of Health guidance is updated.
      </p>
    </div>
  );
}
