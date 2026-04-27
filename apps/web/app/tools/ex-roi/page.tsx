"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const C = { dark: "#1a1218", dark2: "#2d1f2a", copper: "#c89a3c", copperDark: "#8b6914", cream: "#faf7f2", ink: "#f5ede3", inkDark: "#1a1218", inkMuted: "rgba(245,237,227,0.78)", inkMutedLight: "rgba(26,18,24,0.78)", good: "#2d6a4f", warn: "#b5572a", calm: "#8aa888" };

// ── Genos / Kunze methodology (DO NOT CHANGE) ───────────────────────────────
const TURNOVER_RATE = 0.28;
const REPLACEMENT_COST = 50_000;
const SALARY = 75_000;
const LEAVE_DAYS = 10;
const DAILY_COST = SALARY / 250;

interface Inputs { sites: number; bedsPerSite: number; turnoverReduction: number; absentReduction: number; perfReturn: number; }
const DEFAULTS: Inputs = { sites: 1, bedsPerSite: 80, turnoverReduction: 15, absentReduction: 12, perfReturn: 0 };

function compute(i: Inputs) {
  const staffPerSite = Math.round(i.bedsPerSite * 1.5);
  const staff = i.sites * staffPerSite;
  const chrisCost = 33_000 * i.sites;

  const turnoverSaving = TURNOVER_RATE * staff * (i.turnoverReduction / 100) * REPLACEMENT_COST;
  const absentSaving = LEAVE_DAYS * staff * (i.absentReduction / 100) * DAILY_COST;
  const perfValue = staff * SALARY * (i.perfReturn / 100);

  const totalBenefit = turnoverSaving + absentSaving + perfValue;
  const roi = chrisCost > 0 ? ((totalBenefit - chrisCost) / chrisCost) * 100 : 0;
  const paybackMonths = totalBenefit > 0 ? chrisCost / (totalBenefit / 12) : 0;
  const netValue = totalBenefit - chrisCost;
  const hoursReturned = Math.round(LEAVE_DAYS * staff * (i.absentReduction / 100) * 8);

  return { staff, chrisCost, turnoverSaving: Math.round(turnoverSaving), absentSaving: Math.round(absentSaving), perfValue: Math.round(perfValue), totalBenefit: Math.round(totalBenefit), roi: Math.round(roi), paybackMonths: Math.round(paybackMonths * 10) / 10, netValue: Math.round(netValue), hoursReturned };
}

function fmt(n: number) { return "$" + Math.round(Math.abs(n)).toLocaleString("en-AU"); }

function Slider({ label, value, min, max, step, display, onChange, citation }: {
  label: string; value: number; min: number; max: number; step: number;
  display: string; onChange: (v: number) => void; citation?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-[13px] font-medium" style={{ color: C.inkDark }}>{label}</span>
        <span className="text-[14px] font-semibold" style={{ color: C.inkDark }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full cursor-pointer" style={{ accentColor: C.copper }} />
      {citation && <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "rgba(26,18,24,0.35)" }}>{citation}</p>}
    </div>
  );
}

function Bar({ label, value, maxVal, color }: { label: string; value: number; maxVal: number; color: string }) {
  const pct = maxVal > 0 ? Math.min(100, (Math.abs(value) / maxVal) * 100) : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-[12px] mb-1">
        <span style={{ color: "rgba(26,18,24,0.5)" }}>{label}</span>
        <span className="font-medium" style={{ color }}>{value < 0 ? "−" : ""}{fmt(value)}</span>
      </div>
      <div className="h-2 rounded-full" style={{ backgroundColor: "rgba(26,18,24,0.04)" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function ExRoiCalculator() {
  const [inp, setInp] = useState(DEFAULTS);
  const set = (k: keyof Inputs) => (v: number) => setInp((p) => ({ ...p, [k]: v }));
  const r = useMemo(() => compute(inp), [inp]);
  const maxBar = Math.max(r.turnoverSaving, r.absentSaving, r.perfValue, r.chrisCost);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <nav className="sticky top-0 z-50" style={{ backgroundColor: C.dark, borderBottom: "1px solid rgba(245,237,227,0.08)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-16 py-4">
          <Link href="/v2" className="text-[15px] font-medium tracking-tight" style={{ color: C.ink }}>Chris<span style={{ color: C.copper }}>·</span>OS</Link>
          <a href="/v2#book" className="text-[13px] font-medium px-5 py-2 rounded" style={{ backgroundColor: C.copper, color: C.dark }}>Book a conversation</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ backgroundColor: C.dark }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-16 py-12 lg:py-16 text-center">
          <div className="text-[11px] font-medium tracking-[0.12em] uppercase mb-5" style={{ color: C.copper }}>EX workforce ROI · Chris-OS workforce intelligence</div>
          <h1 className="text-[clamp(1.3rem,3vw,2rem)] font-normal leading-[1.2] mb-4" style={{ fontFamily: "Georgia, serif", color: C.ink }}>
            Turnover. Agency. Burnout.{" "}
            <em className="italic" style={{ color: C.copper }}>The numbers nobody wants to add up.</em>
          </h1>
          <p className="text-[14px] leading-[1.65] max-w-xl mx-auto" style={{ color: C.inkMuted }}>
            Model what Chris-OS workforce intelligence is worth against your actual workforce position. Adjust the assumptions. See the return.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section style={{ backgroundColor: C.cream }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-16 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Inputs */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-4 pb-2 border-b" style={{ color: "rgba(26,18,24,0.35)", borderColor: "rgba(26,18,24,0.06)" }}>Your facility</p>
                <Slider label="Number of sites" value={inp.sites} min={1} max={20} step={1} display={String(inp.sites)} onChange={set("sites")} />
                <Slider label="Beds per site" value={inp.bedsPerSite} min={30} max={200} step={10} display={String(inp.bedsPerSite)} onChange={set("bedsPerSite")} />
                <p className="text-[11px]" style={{ color: "rgba(26,18,24,0.4)" }}>Staff estimate: ~{r.staff} ({inp.bedsPerSite} beds × 1.5 staff/bed × {inp.sites} site{inp.sites > 1 ? "s" : ""})</p>
              </div>

              <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-4 pb-2 border-b" style={{ color: "rgba(26,18,24,0.35)", borderColor: "rgba(26,18,24,0.06)" }}>Impact assumptions</p>
                <Slider label="Turnover reduction" value={inp.turnoverReduction} min={5} max={30} step={1} display={`${inp.turnoverReduction}%`} onChange={set("turnoverReduction")}
                  citation="Research supports 10–25% reduction. 15% is conservative. Source: Van Dierendonck et al. (2004); Collini et al. (2013)." />
                <Slider label="Absenteeism reduction" value={inp.absentReduction} min={5} max={25} step={1} display={`${inp.absentReduction}%`} onChange={set("absentReduction")}
                  citation="PSH programs show 10–20% reduction. 12% is conservative. Source: Kivimäki et al. (2015, The Lancet); Safe Work Australia." />
                <Slider label="Performance return on salary" value={inp.perfReturn} min={0} max={10} step={1} display={inp.perfReturn === 0 ? "Not included" : `${inp.perfReturn}%`} onChange={set("perfReturn")}
                  citation="EI development supports 4-8% return in people-intensive roles. Default zero: turnover and absenteeism are sufficient. Source: Harter et al. (2002)." />
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {/* 4 metric cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-4 border" style={{ borderColor: "rgba(26,18,24,0.06)", borderLeftWidth: 3, borderLeftColor: C.copper }}>
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "rgba(26,18,24,0.4)" }}>Total annual benefit</p>
                  <p className="text-[24px] font-light tracking-tight" style={{ fontFamily: "Georgia, serif", color: C.copper }}>{fmt(r.totalBenefit)}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border" style={{ borderColor: "rgba(26,18,24,0.06)", borderLeftWidth: 3, borderLeftColor: C.calm }}>
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "rgba(26,18,24,0.4)" }}>ROI</p>
                  <p className="text-[24px] font-light tracking-tight" style={{ fontFamily: "Georgia, serif", color: C.calm }}>{r.roi}%</p>
                </div>
                <div className="bg-white rounded-xl p-4 border" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "rgba(26,18,24,0.4)" }}>Payback period</p>
                  <p className="text-[24px] font-light tracking-tight" style={{ fontFamily: "Georgia, serif", color: C.inkDark }}>{r.paybackMonths} months</p>
                </div>
                <div className="bg-white rounded-xl p-4 border" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "rgba(26,18,24,0.4)" }}>Hours returned / year</p>
                  <p className="text-[24px] font-light tracking-tight" style={{ fontFamily: "Georgia, serif", color: C.inkDark }}>{r.hoursReturned.toLocaleString()}</p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                <p className="text-[10px] font-medium uppercase tracking-wider mb-4" style={{ color: "rgba(26,18,24,0.35)" }}>Value breakdown</p>
                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between"><span style={{ color: "rgba(26,18,24,0.5)" }}>Turnover cost reduction</span><span className="font-medium" style={{ color: C.good }}>{fmt(r.turnoverSaving)}</span></div>
                  <div className="flex justify-between"><span style={{ color: "rgba(26,18,24,0.5)" }}>Absenteeism cost reduction</span><span className="font-medium" style={{ color: C.good }}>{fmt(r.absentSaving)}</span></div>
                  {r.perfValue > 0 && <div className="flex justify-between"><span style={{ color: "rgba(26,18,24,0.5)" }}>Performance return</span><span className="font-medium" style={{ color: C.good }}>{fmt(r.perfValue)}</span></div>}
                  <div className="flex justify-between pt-2 border-t" style={{ borderColor: "rgba(26,18,24,0.04)" }}><span className="font-medium" style={{ color: C.inkDark }}>Total annual benefit</span><span className="font-medium" style={{ color: C.calm }}>{fmt(r.totalBenefit)}</span></div>
                  <div className="flex justify-between"><span style={{ color: "rgba(26,18,24,0.5)" }}>Chris-OS annual cost</span><span className="font-medium" style={{ color: C.warn }}>−{fmt(r.chrisCost)}</span></div>
                  <div className="flex justify-between pt-2 border-t" style={{ borderColor: "rgba(26,18,24,0.04)" }}><span className="font-semibold" style={{ color: C.inkDark }}>Net annual value</span><span className="font-semibold" style={{ color: r.netValue > 0 ? C.good : C.warn }}>{r.netValue > 0 ? "" : "−"}{fmt(r.netValue)}</span></div>
                </div>
              </div>

              {/* Bar chart */}
              <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                <Bar label="Turnover saving" value={r.turnoverSaving} maxVal={maxBar} color={C.calm} />
                <Bar label="Absenteeism saving" value={r.absentSaving} maxVal={maxBar} color={C.copper} />
                {r.perfValue > 0 && <Bar label="Performance gain" value={r.perfValue} maxVal={maxBar} color="#7c3aed" />}
                <Bar label="Chris-OS investment" value={-r.chrisCost} maxVal={maxBar} color={C.warn} />
              </div>

              {/* Network scale */}
              {inp.sites > 1 && (
                <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(26,18,24,0.06)", borderLeftWidth: 3, borderLeftColor: C.copper }}>
                  <p className="text-[13px] font-medium mb-1" style={{ color: C.inkDark }}>At portfolio scale ({inp.sites} sites)</p>
                  <p className="text-[12px]" style={{ color: "rgba(26,18,24,0.5)" }}>
                    {fmt(r.totalBenefit)} annual benefit across {r.staff} staff. Net value after Chris-OS: {fmt(r.netValue)}. Payback in {r.paybackMonths} months.
                  </p>
                </div>
              )}

              {/* CTAs */}
              <div className="space-y-3">
                <a href="/v2#book" className="block w-full text-center py-3.5 rounded-lg text-[14px] font-medium hover:opacity-90" style={{ backgroundColor: C.copper, color: C.dark }}>Book a 30-minute conversation</a>
                <a href="/v2#book" className="block w-full text-center py-3 rounded-lg text-[13px] font-medium border" style={{ borderColor: "rgba(26,18,24,0.15)", color: C.inkDark }}>Join the waitlist</a>
              </div>

              {/* Methodology */}
              <div className="bg-white rounded-xl p-5 border" style={{ borderColor: "rgba(26,18,24,0.06)" }}>
                <p className="text-[11px] font-medium mb-2" style={{ color: "rgba(26,18,24,0.4)" }}>About this model</p>
                <p className="text-[11px] leading-relaxed" style={{ color: "rgba(26,18,24,0.5)" }}>
                  Built on the Genos International ROI methodology designed by Christopher Kunze of Kunze Analytics. Three value drivers (turnover reduction, absenteeism reduction, and performance return) applied here to a continuous workforce intelligence layer (Chris-OS). Citations: Mattingly & Kraiger (2019), Harms & Credé (2010), Bersin by Deloitte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
