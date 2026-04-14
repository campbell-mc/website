"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Inputs = {
  sites: number;
  beds: number;
  leaders: number;
  rate: number;
  synth: number;
  pack: number;
  sirs: number;
  qfr: number;
  anacc: number;
  uplift: number;
  prob: number;
  claims: number;
};

const DEFAULTS: Inputs = {
  sites: 1, beds: 80, leaders: 12, rate: 85,
  synth: 3, pack: 8, sirs: 6, qfr: 10,
  anacc: 3, uplift: 380, prob: 15, claims: 0.5,
};

function fmt(n: number): string {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return "$" + Math.round(n / 1_000) + "K";
  return "$" + Math.round(n).toLocaleString();
}

function compute(i: Inputs) {
  const totalLeaders = i.leaders * i.sites;
  const synthHrs = i.synth * 52 * totalLeaders;
  const packHrs = i.pack * 12 * i.sites;
  const sirsHrs = i.sirs * 12 * i.sites;
  const qfrHrs = (i.qfr / 3) * 4 * i.sites;
  const totalHrs = synthHrs + packHrs + sirsHrs + qfrHrs;

  const synthVal = Math.round(synthHrs * i.rate);
  const packVal = Math.round(packHrs * i.rate);
  const sirsVal = Math.round(sirsHrs * i.rate);
  const qfrVal = Math.round(qfrHrs * i.rate);
  const timeTotal = synthVal + packVal + sirsVal + qfrVal;

  const anaccVal = Math.round(i.anacc * i.uplift * 12 * i.sites);
  const penaltyVal = Math.round(330_000 * (i.prob / 100) * i.sites);
  const wcVal = Math.round(i.claims * 288_542 * i.sites);
  const riskTotal = penaltyVal + wcVal;

  const chrisCost = 33_000 * i.sites;
  const totalValue = timeTotal + anaccVal + riskTotal;
  const netBenefit = totalValue - chrisCost;
  const roiMult = chrisCost > 0 ? parseFloat((totalValue / chrisCost).toFixed(1)) : 0;

  return {
    totalLeaders, synthHrs: Math.round(synthHrs), packHrs: Math.round(packHrs),
    sirsHrs: Math.round(sirsHrs), qfrHrs: Math.round(qfrHrs), totalHrs: Math.round(totalHrs),
    synthVal, packVal, sirsVal, qfrVal, timeTotal, anaccVal, penaltyVal, wcVal,
    riskTotal, chrisCost, totalValue, netBenefit, roiMult,
  };
}

function Slider({ label, value, min, max, step, display, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  display: string; onChange: (v: number) => void;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-baseline mb-1.5">
        <label className="text-[12px] text-stone-500">{label}</label>
        <span className="text-[12px] font-medium text-stone-800">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full cursor-pointer" style={{ accentColor: "#1B4332" }} />
    </div>
  );
}

function BarRow({ label, hrs, maxHrs }: { label: string; hrs: number; maxHrs: number }) {
  const pct = maxHrs > 0 ? Math.round((hrs / maxHrs) * 100) : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-[11px] text-stone-500 mb-1">
        <span>{label}</span>
        <span className="font-medium text-stone-700">{hrs.toLocaleString()} hrs</span>
      </div>
      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#1B4332] rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function BRow({ label, value, variant = "positive" }: {
  label: string; value: string; variant?: "positive" | "cost" | "net";
}) {
  const colour = variant === "cost" ? "text-red-600" : variant === "net" ? "text-[#1B4332] font-semibold" : "text-emerald-700";
  return (
    <div className="flex justify-between items-center py-2 border-b border-stone-50 last:border-0">
      <span className="text-[12px] text-stone-500">{label}</span>
      <span className={`text-[12px] font-medium ${colour}`}>{value}</span>
    </div>
  );
}

export function RoiCalculator() {
  const [inp, setInp] = useState<Inputs>(DEFAULTS);
  const set = (key: keyof Inputs) => (v: number) => setInp((prev) => ({ ...prev, [key]: v }));
  const r = useMemo(() => compute(inp), [inp]);

  return (
    <section className="bg-[#1B4332]" id="roi-calculator">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-16 lg:py-24">
        <div className="mb-10">
          <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-white/50 mb-3">
            Business case calculator
          </div>
          <h2 className="text-[clamp(26px,3.5vw,42px)] font-normal leading-[1.1] tracking-[-0.02em] mb-4" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif", color: "#ffffff" }}>
            What is CHRIS worth
            <br />
            <em className="italic" style={{ color: "#86EFAC" }}>to your organisation?</em>
          </h2>
          <p className="text-[14px] text-white/60 max-w-lg leading-relaxed">
            Adjust the inputs to match your facility. Every number is grounded in
            real aged care operational data — your actual leader time, your actual
            AN-ACC exposure, your actual compliance risk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5">
              <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4 pb-3 border-b border-stone-50">
                Your facility profile
              </div>
              <Slider label="Number of facilities" value={inp.sites} min={1} max={20} step={1} display={String(inp.sites)} onChange={set("sites")} />
              <Slider label="Beds per facility" value={inp.beds} min={30} max={250} step={10} display={String(inp.beds)} onChange={set("beds")} />
              <Slider label="Leaders per facility" value={inp.leaders} min={5} max={30} step={1} display={String(inp.leaders)} onChange={set("leaders")} />
              <Slider label="Avg leader hourly cost (incl. on-costs)" value={inp.rate} min={60} max={200} step={5} display={`$${inp.rate}`} onChange={set("rate")} />
            </div>

            <div className="bg-white rounded-2xl p-5">
              <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4 pb-3 border-b border-stone-50">
                Time savings
              </div>
              <Slider label="Hours saved per leader/week — data synthesis" value={inp.synth} min={1} max={8} step={0.5} display={`${inp.synth}h`} onChange={set("synth")} />
              <Slider label="Hours saved/month — board & committee packs" value={inp.pack} min={2} max={20} step={1} display={`${inp.pack}h`} onChange={set("pack")} />
              <Slider label="Hours saved/month — SIRS & compliance reporting" value={inp.sirs} min={1} max={15} step={1} display={`${inp.sirs}h`} onChange={set("sirs")} />
              <Slider label="Hours saved/quarter — QFR + QI submissions" value={inp.qfr} min={2} max={20} step={1} display={`${inp.qfr}h`} onChange={set("qfr")} />
            </div>

            <div className="bg-white rounded-2xl p-5">
              <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4 pb-3 border-b border-stone-50">
                Revenue & risk
              </div>
              <Slider label="AN-ACC reclassification opportunities (residents/yr)" value={inp.anacc} min={0} max={15} step={1} display={String(inp.anacc)} onChange={set("anacc")} />
              <Slider label="Avg monthly funding uplift per reclassified resident" value={inp.uplift} min={100} max={1000} step={20} display={`$${inp.uplift}`} onChange={set("uplift")} />
              <Slider label="Probability of SIRS penalty avoided (%)" value={inp.prob} min={0} max={50} step={5} display={`${inp.prob}%`} onChange={set("prob")} />
              <Slider label="Workers comp claims prevented per year" value={inp.claims} min={0} max={3} step={0.5} display={String(inp.claims)} onChange={set("claims")} />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5">
              <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4">
                Annual value generated
              </div>

              <div className="bg-[#1B4332] rounded-xl p-5 mb-4">
                <div className="text-[11px] text-white/50 mb-1">Total annual value</div>
                <div className="text-[42px] text-white leading-none mb-1" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
                  {fmt(r.totalValue)}
                </div>
                <div className="text-[11px] text-white/40">
                  across {inp.sites} facilit{inp.sites === 1 ? "y" : "ies"} · {r.totalLeaders} leaders
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Time value returned", value: fmt(r.timeTotal), sub: `${r.totalHrs.toLocaleString()} hrs/yr` },
                  { label: "AN-ACC revenue uplift", value: fmt(r.anaccVal), sub: "funding recovered" },
                  { label: "Risk exposure avoided", value: fmt(r.riskTotal), sub: "penalty + WC exposure" },
                  { label: "ROI multiple", value: `${r.roiMult}x`, sub: "return on CHRIS cost" },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="bg-stone-50 rounded-xl p-3.5">
                    <div className="text-[10px] text-stone-400 mb-1">{label}</div>
                    <div className="text-[22px] text-stone-800 leading-none mb-0.5" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>{value}</div>
                    <div className="text-[10px] text-stone-400">{sub}</div>
                  </div>
                ))}
              </div>

              <div className="text-[10px] font-medium tracking-[0.06em] uppercase text-stone-400 mb-2">Breakdown</div>
              <BRow label="Weekly data synthesis (all leaders)" value={fmt(r.synthVal)} />
              <BRow label="Board & committee pack prep" value={fmt(r.packVal)} />
              <BRow label="SIRS & compliance reporting" value={fmt(r.sirsVal)} />
              <BRow label="QFR + QI submissions" value={fmt(r.qfrVal)} />
              <BRow label="AN-ACC revenue uplift" value={fmt(r.anaccVal)} />
              <BRow label="SIRS penalty risk avoided" value={fmt(r.penaltyVal)} />
              <BRow label="Workers comp claims avoided" value={fmt(r.wcVal)} />
              <div className="border-t border-stone-100 mt-2 pt-2">
                <BRow label="CHRIS annual cost (est.)" value={`-${fmt(r.chrisCost)}`} variant="cost" />
                <BRow label="Net annual benefit" value={fmt(r.netBenefit)} variant="net" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5">
              <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-4">
                Leadership hours returned per year
              </div>
              {[
                { label: "Data synthesis (all leaders)", hrs: r.synthHrs },
                { label: "Board & committee packs", hrs: r.packHrs },
                { label: "SIRS & compliance", hrs: r.sirsHrs },
                { label: "QFR + QI submissions", hrs: r.qfrHrs },
              ].map((bar) => (
                <BarRow key={bar.label} label={bar.label} hrs={bar.hrs} maxHrs={Math.max(r.synthHrs, r.packHrs, r.sirsHrs, r.qfrHrs)} />
              ))}
              <div className="mt-4 pt-4 border-t border-stone-50">
                <div className="flex justify-between items-baseline">
                  <span className="text-[11px] text-stone-400">Total hours returned/year</span>
                  <span className="text-[22px] text-stone-800" style={{ fontFamily: "var(--font-instrument-serif, 'Georgia'), serif" }}>
                    {r.totalHrs.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/8 border border-white/10 rounded-xl p-4">
              <div className="text-[10px] text-white/45 leading-relaxed">
                Time value uses loaded hourly rate including super and overhead.
                AN-ACC uplift modelled at 12 months per reclassification.
                SIRS penalty uses $330,000 (1,000 penalty units x $330 — s.179
                corporate provider, Aged Care Act 2024). Workers comp average:
                $288,542/claim (sector data). CHRIS cost est. $30K-$36K/site/year.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-4 flex-wrap">
          <Link href="/" className="bg-white text-[#1B4332] px-8 py-3.5 rounded-lg text-[13px] font-medium hover:bg-white/90 transition-colors">
            Enter the demo →
          </Link>
          <Link href="/newsroom" className="border border-white/20 text-white/65 px-8 py-3.5 rounded-lg text-[13px] hover:border-white/38 hover:text-white/85 transition-colors">
            Read the regulatory context
          </Link>
        </div>
      </div>
    </section>
  );
}
