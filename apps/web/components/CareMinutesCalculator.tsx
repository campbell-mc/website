"use client";

import { useState, useMemo } from "react";

// ── Financial constants (non-negotiable) ────────────────────────────────────
const AN_ACC_PRICE_PER_NWAU = 295.64;
const BCT_REDUCTION_NWAU = 0.113;
const FUNDING_AT_RISK_PRPD = AN_ACC_PRICE_PER_NWAU * BCT_REDUCTION_NWAU; // ~$33.41

interface CalcInputs {
  mm1Homes: number;
  mm2to7Homes: number;
  bedsPerHome: number;
  occupancyPct: number;
  totalCareMinPct: number;
  rnMinPct: number;
  rnHourlyCost: number;
}

const DEFAULTS: CalcInputs = {
  mm1Homes: 5,
  mm2to7Homes: 0,
  bedsPerHome: 80,
  occupancyPct: 92,
  totalCareMinPct: 95,
  rnMinPct: 92,
  rnHourlyCost: 75,
};

function computeGap(i: CalcInputs) {
  const occupiedBeds = i.mm1Homes * i.bedsPerHome * (i.occupancyPct / 100);
  const combinedPct = Math.min(i.totalCareMinPct, i.rnMinPct);

  // Compliance scale: 85% → 0 entitlement, 100% → full entitlement, linear between
  let entitlementFraction: number;
  if (combinedPct >= 100) entitlementFraction = 1;
  else if (combinedPct <= 85) entitlementFraction = 0;
  else entitlementFraction = (combinedPct - 85) / (100 - 85);

  const maxSupplementPRPD = FUNDING_AT_RISK_PRPD;
  const currentEntitlementPRPD = maxSupplementPRPD * entitlementFraction;
  const gapPRPD = maxSupplementPRPD - currentEntitlementPRPD;

  const annualDays = 365;
  const maxSupplementAnnual = Math.round(maxSupplementPRPD * occupiedBeds * annualDays);
  const currentEntitlementAnnual = Math.round(currentEntitlementPRPD * occupiedBeds * annualDays);
  const gapAnnual = maxSupplementAnnual - currentEntitlementAnnual;

  // Recovery economics
  // Gap in minutes per day = (100 - combinedPct)/100 * 215 (target) * occupiedBeds
  const minuteGapPerDay = ((100 - combinedPct) / 100) * 215 * occupiedBeds;
  const hoursPerDay = minuteGapPerDay / 60;
  const costToCloseAnnual = Math.round(hoursPerDay * annualDays * i.rnHourlyCost);
  const netRecoveryUpside = gapAnnual - costToCloseAnnual;

  // Over-delivery cost (if >= 100%)
  const overDeliveryPct = combinedPct > 100 ? combinedPct - 100 : 0;
  const overDeliveryMinutesPerDay = (overDeliveryPct / 100) * 215 * occupiedBeds;
  const overDeliveryHoursPerDay = overDeliveryMinutesPerDay / 60;
  const overDeliveryCostAnnual = Math.round(overDeliveryHoursPerDay * annualDays * i.rnHourlyCost);

  return {
    occupiedBeds: Math.round(occupiedBeds),
    combinedPct,
    entitlementFraction,
    maxSupplementPRPD,
    currentEntitlementPRPD,
    gapPRPD,
    maxSupplementAnnual,
    currentEntitlementAnnual,
    gapAnnual,
    costToCloseAnnual,
    netRecoveryUpside,
    overDeliveryPct,
    overDeliveryCostAnnual,
    isOverDelivering: combinedPct >= 100,
    isSevere: combinedPct < 85,
    isDefault: i.mm1Homes === DEFAULTS.mm1Homes && i.bedsPerHome === DEFAULTS.bedsPerHome && i.occupancyPct === DEFAULTS.occupancyPct && i.totalCareMinPct === DEFAULTS.totalCareMinPct && i.rnMinPct === DEFAULTS.rnMinPct,
  };
}

function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M";
  if (Math.abs(n) >= 1_000) return "$" + Math.round(n / 1_000).toLocaleString() + "K";
  return "$" + Math.round(n).toLocaleString();
}

function Slider({ label, value, min, max, step, display, onChange, sublabel }: {
  label: string; value: number; min: number; max: number; step: number;
  display: string; onChange: (v: number) => void; sublabel?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-1">
        <div>
          <label className="text-[13px] font-medium text-stone-700">{label}</label>
          {sublabel && <p className="text-[11px] text-stone-400">{sublabel}</p>}
        </div>
        <span className="text-[14px] font-semibold text-[#1B4332]">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full cursor-pointer" style={{ accentColor: "#1B4332" }} />
    </div>
  );
}

interface Props {
  captureEndpoint?: string;
  bookingUrl?: string;
  pshAuditUrl?: string;
}

export function CareMinutesCalculator({ captureEndpoint = "/api/waitlist", bookingUrl = "#waitlist", pshAuditUrl }: Props) {
  const [inp, setInp] = useState<CalcInputs>(DEFAULTS);
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [emailOrg, setEmailOrg] = useState("");
  const [emailRole, setEmailRole] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const set = (key: keyof CalcInputs) => (v: number) => setInp((prev) => ({ ...prev, [key]: v }));
  const r = useMemo(() => computeGap(inp), [inp]);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch(captureEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, organisation: emailOrg, role: emailRole,
          workflow_interest: "care_minutes_calculator",
          calculator_data: { occupiedBeds: r.occupiedBeds, gapAnnual: r.gapAnnual, netRecoveryUpside: r.netRecoveryUpside, combinedPct: r.combinedPct },
        }),
      });
    } catch {}
    setEmailSent(true);
  }

  return (
    <section className="bg-white" id="calculator">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 py-12 lg:py-20">

        {/* MM2-7 banner */}
        {inp.mm2to7Homes > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-[13px] text-amber-800">
            This calculator covers MM1 exposure. Your {inp.mm2to7Homes} regional home{inp.mm2to7Homes > 1 ? "s" : ""} operate under different funding mechanics — we can model those in a diagnostic call.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ── INPUTS ── */}
          <div>
            <div className="bg-[#faf7f2] rounded-2xl p-6 lg:p-8">
              <h3 className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-6 pb-3 border-b border-stone-200">Your facility profile</h3>

              <Slider label="MM1 homes" value={inp.mm1Homes} min={1} max={30} step={1} display={String(inp.mm1Homes)} onChange={set("mm1Homes")} />
              <Slider label="MM2–7 homes" value={inp.mm2to7Homes} min={0} max={20} step={1} display={String(inp.mm2to7Homes)} sublabel="Regional — modelled separately" onChange={set("mm2to7Homes")} />
              <Slider label="Beds per home" value={inp.bedsPerHome} min={30} max={200} step={5} display={String(inp.bedsPerHome)} onChange={set("bedsPerHome")} />
              <Slider label="Occupancy" value={inp.occupancyPct} min={70} max={100} step={1} display={`${inp.occupancyPct}%`} onChange={set("occupancyPct")} />

              <h3 className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-6 mt-8 pb-3 border-b border-stone-200">Your care minutes performance</h3>

              <Slider label="Total care minutes % of target" value={inp.totalCareMinPct} min={70} max={110} step={1} display={`${inp.totalCareMinPct}%`} sublabel="215 min/resident/day target" onChange={set("totalCareMinPct")} />
              <Slider label="RN minutes % of target" value={inp.rnMinPct} min={70} max={110} step={1} display={`${inp.rnMinPct}%`} sublabel="44 min/resident/day target" onChange={set("rnMinPct")} />

              <h3 className="text-[11px] font-medium tracking-[0.08em] uppercase text-stone-400 mb-6 mt-8 pb-3 border-b border-stone-200">Recovery economics</h3>

              <Slider label="RN hourly cost (loaded)" value={inp.rnHourlyCost} min={50} max={120} step={5} display={`$${inp.rnHourlyCost}`} sublabel="Including super and on-costs" onChange={set("rnHourlyCost")} />
            </div>
          </div>

          {/* ── RESULTS ── */}
          <div>
            {/* Default state */}
            {r.isDefault && (
              <div className="bg-[#faf7f2] rounded-2xl p-8 text-center flex flex-col items-center justify-center h-full">
                <p className="text-[15px] text-stone-500 max-w-sm">Adjust the inputs on the left to see your facility&apos;s funding exposure.</p>
              </div>
            )}

            {/* Under-delivery (main case) */}
            {!r.isDefault && !r.isOverDelivering && (
              <div className="space-y-5">
                {/* Headline number */}
                <div className="bg-[#1B4332] rounded-2xl p-6 lg:p-8 text-center">
                  <p className="text-[12px] uppercase tracking-[0.1em] mb-3" style={{ color: "rgba(250,247,242,0.5)" }}>Your projected supplement funding gap</p>
                  <p className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-none mb-2" style={{ color: r.isSevere ? "#C4704A" : "#D4A017" }}>{fmt(r.gapAnnual)}</p>
                  <p className="text-[13px]" style={{ color: "rgba(250,247,242,0.5)" }}>annually · across {inp.mm1Homes} home{inp.mm1Homes > 1 ? "s" : ""} · {r.occupiedBeds} occupied beds</p>
                </div>

                {/* Severe warning */}
                {r.isSevere && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[13px] text-red-800">
                    You&apos;re below 85% on {r.combinedPct === inp.totalCareMinPct ? "total care minutes" : "RN minutes"} — losing the <strong>full supplement</strong> on this target. That&apos;s {fmt(r.gapAnnual)} annually.
                  </div>
                )}

                {/* Breakdown */}
                <div className="bg-white border border-stone-200 rounded-xl p-5">
                  <p className="text-[11px] font-medium tracking-[0.06em] uppercase text-stone-400 mb-4">Breakdown</p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-stone-500">Maximum supplement available</span>
                      <span className="font-medium text-stone-800">{fmt(r.maxSupplementAnnual)}</span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-stone-500">Your current entitlement ({r.combinedPct}%)</span>
                      <span className="font-medium text-[#2D7D73]">{fmt(r.currentEntitlementAnnual)}</span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${r.entitlementFraction * 100}%`, backgroundColor: r.entitlementFraction > 0.7 ? "#2D7D73" : r.entitlementFraction > 0.4 ? "#D4A017" : "#C4704A" }} />
                    </div>
                    <div className="flex justify-between text-[13px] pt-2 border-t border-stone-100">
                      <span className="font-medium text-stone-700">Funding gap</span>
                      <span className="font-bold" style={{ color: "#C4704A" }}>{fmt(r.gapAnnual)}</span>
                    </div>
                  </div>
                </div>

                {/* Recovery economics */}
                <div className="bg-white border border-stone-200 rounded-xl p-5">
                  <p className="text-[11px] font-medium tracking-[0.06em] uppercase text-stone-400 mb-4">Recovery economics</p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-stone-500">Cost to close the gap (staffing)</span>
                      <span className="font-medium text-stone-800">{fmt(r.costToCloseAnnual)}</span>
                    </div>
                    <div className="flex justify-between text-[13px] pt-2 border-t border-stone-100">
                      <span className="font-medium text-stone-700">Net P&L impact if recovered</span>
                      <span className="font-bold" style={{ color: r.netRecoveryUpside > 0 ? "#2D7D73" : "#C4704A" }}>
                        {r.netRecoveryUpside > 0 ? "+" : ""}{fmt(r.netRecoveryUpside)}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-4 leading-relaxed">
                    Modelled estimate. Actual figures depend on roster efficiency, agency reliance, and operational structure.
                  </p>
                </div>

                {/* Reassurance */}
                {!r.isSevere && (
                  <p className="text-[13px] text-stone-400 text-center leading-relaxed">
                    You&apos;re not alone. 56% of MM1 for-profit homes are in the same position.
                  </p>
                )}

                {/* CTAs */}
                <div className="space-y-3 pt-2">
                  <a href={bookingUrl} className="block w-full text-center py-3.5 rounded-xl text-[14px] font-medium text-white transition-colors hover:opacity-90" style={{ backgroundColor: "#C4704A" }}>
                    Book a 30-minute diagnostic call
                  </a>
                  <button onClick={() => setShowEmail(true)} className="block w-full text-center py-3 rounded-xl text-[13px] font-medium text-[#1B4332] border border-[#1B4332]/20 hover:border-[#1B4332]/40 transition-colors">
                    Email me the full breakdown
                  </button>
                  {pshAuditUrl && (
                    <a href={pshAuditUrl} className="block text-center text-[12px] text-stone-400 hover:text-stone-600 transition-colors">
                      Or start with a psychosocial safety audit →
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Over-delivery */}
            {!r.isDefault && r.isOverDelivering && (
              <div className="space-y-5">
                <div className="bg-[#2D7D73] rounded-2xl p-6 lg:p-8 text-center">
                  <p className="text-[12px] uppercase tracking-[0.1em] mb-3" style={{ color: "rgba(250,247,242,0.5)" }}>You&apos;re earning maximum supplement</p>
                  <p className="text-[clamp(2rem,4vw,3rem)] font-bold leading-none mb-2" style={{ color: "#faf7f2" }}>{fmt(r.maxSupplementAnnual)}</p>
                  <p className="text-[14px] mt-3" style={{ color: "rgba(250,247,242,0.7)" }}>But you&apos;re over-delivering by {r.overDeliveryPct.toFixed(0)}% — and bleeding margin to do it.</p>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-5">
                  <p className="text-[11px] font-medium tracking-[0.06em] uppercase text-stone-400 mb-4">Cost of over-delivery</p>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-stone-500">Annual cost of minutes above 100% target</span>
                    <span className="font-bold text-[#D4A017]">{fmt(r.overDeliveryCostAnnual)}</span>
                  </div>
                  <p className="text-[12px] text-stone-400 mt-3">That&apos;s margin you&apos;re giving away. CHRIS helps you hit target precisely — not generously.</p>
                </div>

                <a href={bookingUrl} className="block w-full text-center py-3.5 rounded-xl text-[14px] font-medium text-white transition-colors hover:opacity-90" style={{ backgroundColor: "#1B4332" }}>
                  Book a 30-minute diagnostic call
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Email capture modal */}
        {showEmail && !emailSent && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setShowEmail(false)}>
            <form onSubmit={handleEmailSubmit} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-[16px] font-semibold text-[#1B4332]">Email your funding breakdown</h3>
              <p className="text-[13px] text-stone-500">We&apos;ll send the full analysis based on your inputs — including recovery economics and next steps.</p>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work email" className="w-full px-4 py-3 rounded-lg border border-stone-200 text-[14px] focus:outline-none focus:border-[#1B4332]" />
              <input type="text" value={emailOrg} onChange={(e) => setEmailOrg(e.target.value)} placeholder="Organisation" className="w-full px-4 py-3 rounded-lg border border-stone-200 text-[14px] focus:outline-none focus:border-[#1B4332]" />
              <input type="text" value={emailRole} onChange={(e) => setEmailRole(e.target.value)} placeholder="Your role (e.g. CEO, CFO)" className="w-full px-4 py-3 rounded-lg border border-stone-200 text-[14px] focus:outline-none focus:border-[#1B4332]" />
              <button type="submit" className="w-full py-3 rounded-xl text-[14px] font-medium text-white bg-[#1B4332] hover:opacity-90 transition-colors">Send breakdown →</button>
            </form>
          </div>
        )}
        {showEmail && emailSent && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setShowEmail(false)}>
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
              <p className="text-[16px] font-semibold text-[#1B4332] mb-2">Sent.</p>
              <p className="text-[13px] text-stone-500">Check your inbox. We&apos;ll follow up within 24 hours.</p>
              <button onClick={() => setShowEmail(false)} className="mt-4 text-[13px] text-[#2D7D73] hover:underline">Close</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
