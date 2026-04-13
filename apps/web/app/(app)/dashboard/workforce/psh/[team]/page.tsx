"use client";

import { useParams, useRouter } from "next/navigation";

interface PSHDomain {
  name: string;
  score: number;
  prior: number;
}

const PSH_DOMAINS: PSHDomain[] = [
  { name: "Workload", score: 3.8, prior: 3.5 },
  { name: "Role clarity", score: 3.6, prior: 3.3 },
  { name: "Peer support", score: 2.9, prior: 3.1 },
  { name: "Manager support", score: 3.2, prior: 3.0 },
  { name: "Autonomy", score: 2.7, prior: 2.8 },
  { name: "Task variety", score: 2.5, prior: 2.6 },
  { name: "Emotional demands", score: 3.4, prior: 3.2 },
  { name: "Work-life balance", score: 2.8, prior: 2.9 },
  { name: "Bullying & harassment", score: 1.9, prior: 1.8 },
  { name: "Violence & aggression", score: 2.2, prior: 2.1 },
  { name: "Justice & fairness", score: 2.6, prior: 2.7 },
  { name: "Recognition", score: 2.4, prior: 2.5 },
  { name: "Change management", score: 3.1, prior: 2.9 },
  { name: "Physical environment", score: 2.3, prior: 2.4 },
  { name: "Job security", score: 2.1, prior: 2.2 },
  { name: "Organisational culture", score: 2.8, prior: 2.7 },
];

function slugToDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getScoreColor(score: number): string {
  if (score >= 3.5) return "#C4704A";
  if (score >= 3.0) return "#D4A017";
  return "#2D7D73";
}

function getScoreLabel(score: number): string {
  if (score >= 3.5) return "Elevated";
  if (score >= 3.0) return "Watch";
  return "Healthy";
}

export default function PSHTeamPage() {
  const params = useParams();
  const router = useRouter();
  const team = params.team as string;
  const displayName = slugToDisplayName(team);

  const elevatedCount = PSH_DOMAINS.filter((d) => d.score >= 3.5).length;
  const watchCount = PSH_DOMAINS.filter((d) => d.score >= 3.0 && d.score < 3.5).length;

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-[#E07B39] flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">K</span>
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-foreground tracking-tight leading-tight">
            {displayName}
          </h1>
          <p className="text-[10px] text-muted-foreground">
            PSH Cycle 8 results — {elevatedCount} elevated, {watchCount} watch
          </p>
        </div>
      </div>

      {/* Keeper insight narrative */}
      <div className="bg-card rounded-xl border border-border p-5 mb-4">
        <div className="flex items-start gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-[#E07B39] flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-white text-[8px] font-bold">K</span>
          </div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase">Keeper Insight</p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {displayName} is showing a turnover precursor pattern. Workload and Role clarity have
          both crossed the elevated threshold for the second consecutive cycle. Combined with a 14%
          increase in unplanned overtime this quarter, Keeper estimates a 71% probability of
          voluntary turnover within 90 days if no intervention is deployed. Peer support has dropped
          below the healthy threshold, which historically correlates with disengagement in care teams
          of this size.
        </p>
      </div>

      {/* All 16 PSH domains */}
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">
        All 16 PSH domains
      </p>
      <div className="bg-card rounded-xl border border-border p-5 mb-4">
        <div className="space-y-3">
          {PSH_DOMAINS.map((domain) => {
            const color = getScoreColor(domain.score);
            const label = getScoreLabel(domain.score);
            const delta = domain.score - domain.prior;
            const arrow = delta > 0 ? "\u2191" : delta < 0 ? "\u2193" : "\u2192";
            const barWidth = Math.min((domain.score / 5) * 100, 100);

            return (
              <div key={domain.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">{domain.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">
                      {arrow} {Math.abs(delta).toFixed(1)} from prior
                    </span>
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: `${color}15`, color }}
                    >
                      {domain.score.toFixed(1)} {label}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${barWidth}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Practice recommendation */}
      <div className="bg-card rounded-xl border border-border p-5 mb-4">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-2">
          Recommended practice for Cycle 9
        </p>
        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-sm font-semibold text-foreground mb-1">
            Structured peer check-in (15 min, start of shift)
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            A brief, facilitated peer check-in at the start of each shift where team members share
            one concern and one capacity note. Addresses Workload and Peer support domains
            simultaneously. Evidence shows a 0.4-point average improvement after 2 cycles when
            deployed consistently.
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3 mb-8">
        <button
          onClick={() => router.push(`/dashboard/workforce/psh/${team}/briefing`)}
          className="w-full py-3.5 rounded-xl text-sm font-medium bg-[#1B4332] text-white"
        >
          View Team Briefing
        </button>
        <button
          onClick={() => router.push("/dashboard/workforce/psh/iso45003")}
          className="w-full py-3.5 rounded-xl text-sm font-medium border border-[#1B4332] text-[#1B4332]"
        >
          View ISO 45003 Evidence
        </button>
      </div>
    </div>
  );
}
